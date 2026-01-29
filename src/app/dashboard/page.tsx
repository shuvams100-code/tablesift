"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, db, googleProvider, signInWithPopup, signOut } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
// Use dynamic import for pdfjs worker to avoid SSR issues
if (typeof window !== 'undefined' && typeof Promise.withResolvers === 'undefined') {
    // Polyfill for pdfjs
    // @ts-expect-error This is a polyfill
    window.Promise.withResolvers = function () {
        let resolve, reject;
        const promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        return { promise, resolve, reject };
    };
}
// Fix for pdfjs worker in Next.js will be handled inside component useEffect

const DashboardContent = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [processingStage, setProcessingStage] = useState("");
    const [currentPlan] = useState("pro"); // Hardcoded 'pro' for testing
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auth check - redirect to home if not logged in
    useEffect(() => {
        if (!auth) {
            router.push("/");
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push("/");
            } else {
                setUser(currentUser);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    const handleSignOut = async () => {
        if (auth) {
            await signOut(auth);
            router.push("/");
        }
    };

    const convertPdfToImages = async (file: File): Promise<File[]> => {
        // Dynamically import pdfjs
        const pdfjs = await import("pdfjs-dist");

        // Initialize worker if needed
        if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
            pdfjs.GlobalWorkerOptions.workerSrc = window.location.origin + "/pdf.worker.min.mjs";
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        const images: File[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
            setProcessingStage(`Converting PDF Page ${i} of ${pdf.numPages}...`);
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            if (context) {
                // @ts-ignore
                await page.render({ canvasContext: context, viewport }).promise;
                const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), "image/png"));
                images.push(new File([blob], `page-${i}.png`, { type: "image/png" }));
            }
        }
        return images;
    };

    const handleFiles = async (files: FileList | File[]) => {
        if (!user || !files.length) return;

        let fileArray = Array.from(files);
        setIsUploading(true);
        setError(null);
        setSuccess(false);

        try {
            // Mock tier (we'll make this real once payments are connected)
            const planDetails = {
                free: { dailyLimit: 1, bulkMax: 1, maxPdfPages: 1 },
                pro: { dailyLimit: 100, bulkMax: 5, maxPdfPages: 10 },
                business: { dailyLimit: 500, bulkMax: 20, maxPdfPages: 50 }
            };
            const tier = planDetails[currentPlan as keyof typeof planDetails];

            // 1. Handle PDF specifically (split into images)
            if (fileArray.length === 1 && fileArray[0].type === "application/pdf") {
                setProcessingStage("Reading PDF document...");
                const pdfImages = await convertPdfToImages(fileArray[0]);

                if (pdfImages.length > tier.maxPdfPages) {
                    throw new Error(`Your ${currentPlan} plan only supports up to ${tier.maxPdfPages} pages per PDF. Upgrade for more!`);
                }
                fileArray = pdfImages;
            }

            const fileCount = fileArray.length;
            setProcessingStage(fileCount > 1 ? `Preparing ${fileCount} scans...` : "Uploading image...");

            // 2. Check Bulk Limit (for non-PDF multiple files)
            if (fileArray.length > 1 && fileCount > tier.bulkMax && files[0].type !== "application/pdf") {
                throw new Error(`Your ${currentPlan} plan only supports up to ${tier.bulkMax} files at once. Upgrade for more!`);
            }

            // 2. Check Daily Limit (Firestore + LocalStorage)
            const today = new Date().toISOString().split('T')[0];
            const localKey = `tablesift_usage_${user.uid}`;
            const localUsage = localStorage.getItem(localKey);

            let currentCount = 0;
            if (localUsage) {
                const { date, count } = JSON.parse(localUsage);
                if (date === today) currentCount = count;
            }

            if (currentCount + fileCount > tier.dailyLimit) {
                setIsUploading(false);
                setProcessingStage("");
                setError(`Daily limit reached (${currentCount}/${tier.dailyLimit}). Upgrade to Pro for high-volume scanning!`);
                return;
            }

            // Also check Firestore if available
            if (db) {
                setProcessingStage("Checking usage limits...");
                const userRef = doc(db, "users", user.uid);
                try {
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        if (userData.lastUsageDate === today && (userData.usageCount + fileCount) > tier.dailyLimit) {
                            localStorage.setItem(localKey, JSON.stringify({ date: today, count: userData.usageCount }));
                            setIsUploading(false);
                            setProcessingStage("");
                            setError(`Daily limit reached (${userData.usageCount}/${tier.dailyLimit}). Upgrade for more capacity!`);
                            return;
                        }
                        if (userData.lastUsageDate === today) currentCount = userData.usageCount;
                    }
                } catch (firestoreError) {
                    console.warn("Firestore check failed, using local tracking:", firestoreError);
                }
            }

            // 3. Perform Extraction (Client-Side Batching)
            let combinedCsvOutput = "";

            for (let i = 0; i < fileCount; i++) {
                const currentFile = fileArray[i];
                const progressMsg = fileCount > 1
                    ? `Processing table ${i + 1} of ${fileCount}...`
                    : "Extracting data with AI...";

                setProcessingStage(progressMsg);

                const formData = new FormData();
                formData.append("file", currentFile);

                const response = await fetch("/api/extract", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || `Failed to process file ${i + 1}`);
                }

                const csvContent = await response.text();

                if (csvContent) {
                    if (combinedCsvOutput.length > 0) {
                        combinedCsvOutput += `\n\n--- TABLE FROM: ${currentFile.name} ---\n\n`;
                    }
                    combinedCsvOutput += csvContent;
                }
            }

            setProcessingStage("Preparing final CSV...");

            // 4. Update Usage
            const newTotalCount = currentCount + fileCount;
            localStorage.setItem(localKey, JSON.stringify({ date: today, count: newTotalCount }));

            if (db) {
                try {
                    const userRef = doc(db, "users", user.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        if (userData.lastUsageDate === today) {
                            await updateDoc(userRef, { usageCount: increment(fileCount) });
                        } else {
                            await updateDoc(userRef, { usageCount: fileCount, lastUsageDate: today });
                        }
                    } else {
                        await setDoc(userRef, { usageCount: fileCount, lastUsageDate: today, email: user.email });
                    }
                } catch (firestoreError) {
                    console.warn("Firestore update failed:", firestoreError);
                }
            }

            // 5. Trigger Download
            if (combinedCsvOutput) {
                const blob = new Blob([combinedCsvOutput], { type: "text/csv" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `tablesift-batch-${new Date().getTime()}.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                throw new Error("No data could be extracted.");
            }

            setSuccess(true);
            setProcessingStage("");

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
            setProcessingStage("");
        } finally {
            setIsUploading(false);
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files) handleFiles(files);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) handleFiles(files);
    };

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid #22c55e', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                    <p style={{ color: '#64748b' }}>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)', display: 'flex', flexDirection: 'column' }}>

            {/* Header */}
            <header style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', background: 'white' }}>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a' }}>
                    TableSift<span style={{ color: '#22c55e' }}>.com</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/profile" style={{ fontSize: '0.85rem', color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>Profile</Link>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{user?.displayName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user?.email}</div>
                    </div>
                    <Link href="/profile">
                        <img src={user?.photoURL || ""} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #22c55e', cursor: 'pointer' }} />
                    </Link>
                    <button onClick={handleSignOut} style={{ fontSize: '0.85rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                        Sign Out
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                        Extract Tables Instantly
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1rem' }}>
                        Upload a screenshot of any table and get a clean CSV file
                    </p>
                </div>

                {/* Upload Zone */}
                <div
                    onDrop={onDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    style={{
                        width: '100%',
                        maxWidth: '600px',
                        minHeight: '300px',
                        background: 'white',
                        border: isUploading ? '2px solid #22c55e' : '2px dashed #cbd5e1',
                        borderRadius: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isUploading ? 'wait' : 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                        padding: '2rem',
                    }}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        multiple
                        onChange={onFileChange}
                        style={{ display: 'none' }}
                    />

                    {isUploading ? (
                        <div style={{ textAlign: 'center' }}>
                            {/* Animated Spinner */}
                            <div style={{
                                width: '60px',
                                height: '60px',
                                border: '4px solid #e2e8f0',
                                borderTop: '4px solid #22c55e',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto 1.5rem',
                            }}></div>

                            {/* Processing Stage */}
                            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                                {processingStage}
                            </p>
                            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                This may take 15-30 seconds for complex tables
                            </p>

                            {/* Progress Dots */}
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
                                <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', animation: 'pulse 1s infinite' }}></div>
                                <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }}></div>
                                <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', animation: 'pulse 1s infinite 0.4s' }}></div>
                            </div>
                        </div>
                    ) : success ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#166534', marginBottom: '0.5rem' }}>
                                Download Complete!
                            </p>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
                                Your CSV file has been downloaded
                            </p>
                            <button
                                onClick={(e) => { e.stopPropagation(); setSuccess(false); }}
                                style={{
                                    padding: '12px 24px',
                                    background: '#22c55e',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Extract Another Table
                            </button>
                        </div>
                    ) : (
                        <>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
                            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                                Drop your screenshot here
                            </p>
                            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                                or click to browse files
                            </p>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                <span style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', color: '#475569' }}>PNG</span>
                                <span style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', color: '#475569' }}>JPG</span>
                                <span style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', color: '#475569' }}>PDF</span>
                                <span style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', color: '#475569' }}>Up to 10MB</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', maxWidth: '600px', width: '100%', textAlign: 'center' }}>
                        <p style={{ color: '#dc2626', marginBottom: error.includes("limit") ? '1rem' : '0' }}>{error}</p>
                        {error.includes("limit") && (
                            <Link href="/#pricing" style={{
                                display: 'inline-block',
                                padding: '10px 20px',
                                background: '#22c55e',
                                color: 'white',
                                borderRadius: '8px',
                                fontWeight: 600,
                                textDecoration: 'none',
                                fontSize: '0.9rem'
                            }}>
                                Upgrade to Pro
                            </Link>
                        )}
                    </div>
                )}

                {/* Usage Info */}
                <div style={{ marginTop: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                    {currentPlan === 'pro' ? (
                        <p>Plan: <span style={{ color: '#22c55e', fontWeight: 700 }}>Pro Account</span> • 100 scans/month • Bulk Support (5 images)</p>
                    ) : (
                        <p>Free tier: 1 scan per day • <Link href="/#pricing" style={{ color: '#22c55e', fontWeight: 600 }}>Upgrade to Pro</Link></p>
                    )}
                </div>

                {/* Tips Section */}
                <div style={{ marginTop: '2rem', maxWidth: '600px', width: '100%', background: '#f8fafc', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
                    <p style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', fontSize: '0.9rem' }}>💡 Best Results Tips:</p>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#64748b', fontSize: '0.85rem', lineHeight: 1.7 }}>
                        <li><strong>Screenshots</strong> of tables work best (Excel, Google Sheets, web tables)</li>
                        <li><strong>One table per image</strong> for accurate extraction</li>
                        <li><strong>Clear headers</strong> improve column detection</li>
                        <li><strong>PDFs</strong>: Free tier supports 1 page. Pro supports up to 10 pages.</li>
                    </ul>
                </div>

            </main>

            {/* CSS for animations */}
            <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
        </div>
    );
};

import dynamic from 'next/dynamic';

const DashboardContentDynamic = dynamic(() => Promise.resolve(DashboardContent), {
    ssr: false,
});

export default function Dashboard() {
    return <DashboardContentDynamic />;
}
