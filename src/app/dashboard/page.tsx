"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, db, signOut } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import dynamic from 'next/dynamic';

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

const DashboardContent = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [processingStage, setProcessingStage] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [planCredits, setPlanCredits] = useState<number>(0);
    const [refillCredits, setRefillCredits] = useState<number>(0);
    const [userTier, setUserTier] = useState<string>("free");
    const [scrolled, setScrolled] = useState(false);
    const [showTopUpModal, setShowTopUpModal] = useState(false);
    const [showPricingModal, setShowPricingModal] = useState(false);
    const [requiredCoinsForUpload, setRequiredCoinsForUpload] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle Scroll Effect for Glassmorphic Header
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Auth check - redirect to home if not logged in
    useEffect(() => {
        if (!auth) {
            router.push("/");
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                router.push("/");
            } else {
                setUser(currentUser);
                // Fetch dual-bucket credits and tier from Firestore
                if (db) {
                    const userRef = doc(db, "users", currentUser.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const data = userSnap.data();
                        if (data.planCredits === undefined || (data.planCredits === 0 && !data.tier) || data.tier === "none") {
                            // First time landing or migration: Force 30 bonus if it's their very first time
                            const existingTotal = data.credits ?? data.planCredits ?? 30;
                            const finalTier = (data.tier === "none" || !data.tier) ? "free" : data.tier;
                            await updateDoc(userRef, {
                                planCredits: existingTotal,
                                refillCredits: 0,
                                tier: finalTier
                            });
                            setPlanCredits(existingTotal);
                            setRefillCredits(0);
                            setUserTier(finalTier);
                        } else {
                            setPlanCredits(data.planCredits ?? 0);
                            setRefillCredits(data.refillCredits ?? 0);
                            setUserTier(data.tier || "free");
                        }
                    } else {
                        // Initialize new user with 30 Signup Bonus
                        await setDoc(userRef, {
                            planCredits: 30,
                            refillCredits: 0,
                            tier: "free",
                            email: currentUser.email,
                            subscriptionStatus: "none",
                            createdAt: new Date()
                        });
                        setPlanCredits(30);
                        setRefillCredits(0);
                        setUserTier("free");
                    }
                }
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    // Handle Post-Payment Success Redirect
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const query = new URLSearchParams(window.location.search);
            if (query.get('subscribed') === 'true' || query.get('success') === 'true') {
                setSuccess(true);
                setProcessingStage("Success! Synchronizing your new credits...");

                // Poll for updates (in case webhook is slightly delayed)
                let attempts = 0;
                const interval = setInterval(async () => {
                    if (auth.currentUser) {
                        const userRef = doc(db, "users", auth.currentUser.uid);
                        const snap = await getDoc(userRef);
                        if (snap.exists()) {
                            const data = snap.data();
                            // If tier changed or credits increased, stop polling
                            if (data.tier !== "free" || (data.planCredits + data.refillCredits) > 30) {
                                setPlanCredits(data.planCredits ?? 0);
                                setRefillCredits(data.refillCredits ?? 0);
                                setUserTier(data.tier ?? "free");
                                setSuccess(false); // Hide the processing screen
                                clearInterval(interval);
                            }
                        }
                    }
                    attempts++;
                    if (attempts > 10) {
                        setSuccess(false);
                        clearInterval(interval);
                    } // Stop after 20 seconds
                }, 2000);

                return () => clearInterval(interval);
            }
        }
    }, [user]);

    const handleSignOut = async () => {
        if (auth) {
            await signOut(auth);
            router.push("/");
        }
    };

    const handleUpgrade = async (productId: string, planName: string, monthlyCredits: number) => {
        if (!user) return;

        try {
            const idToken = await user.getIdToken();
            const response = await fetch("/api/subscriptions/create-checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    productId,
                    planName,
                    monthlyCredits,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to start checkout");
            }

            const { checkoutUrl } = data;
            window.location.href = checkoutUrl;

        } catch (err: any) {
            console.error("Upgrade failed:", err);
            setError(`Failed to start upgrade: ${err.message}`);
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
                try {
                    // @ts-ignore
                    await page.render({ canvasContext: context, viewport }).promise;
                    const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), "image/png"));
                    images.push(new File([blob], `page-${i}.png`, { type: "image/png" }));
                } catch (e) {
                    console.error("Error rendering page", e);
                }
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
            // 0. SUBSCRIPTION GATING - Allow free users to use their 30 coins, but nudge to upgrade
            // If you want them to spend their 30 coins FIRST, we keep this commented out or removed.
            // Based on user feedback: "Once the balance is exhausted they cannot do anything"
            // So we ALLOW them to upload as long as they have balance.
            /*
            if (userTier === "free" && (planCredits + refillCredits) < 1) {
                setShowPricingModal(true);
                setIsUploading(false);
                setError("Your signup bonus is exhausted. Upgrade to a plan to continue.");
                return;
            }
            */

            // 1. Handle PDF specifically (split into images)
            if (fileArray.length === 1 && fileArray[0].type === "application/pdf") {
                setProcessingStage("Reading PDF document...");
                const pdfImages = await convertPdfToImages(fileArray[0]);
                fileArray = pdfImages;
            }

            const fileCount = fileArray.length;
            const totalCredits = planCredits + refillCredits;

            // 2. Check Coin Balance
            let totalDeductionNeeded = 0;
            for (const f of fileArray) {
                totalDeductionNeeded += (f.name.endsWith(".docx") || f.type.includes("word") || f.type.includes("officedocument")) ? 3 : 1;
            }

            if (totalCredits < totalDeductionNeeded) {
                setRequiredCoinsForUpload(totalDeductionNeeded);
                setShowTopUpModal(true);
                setIsUploading(false);
                return;
            }

            setProcessingStage(fileCount > 1 ? `Preparing ${fileCount} scans...` : "Uploading image...");

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
                formData.append("tier", userTier);

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

            // 4. Update Usage (Deduct Coins using Burn Order)
            if (db) {
                try {
                    const userRef = doc(db, "users", user.uid);

                    // Smart burn order: Use planCredits first, then refillCredits
                    let remainingToDeduct = totalDeductionNeeded;
                    let planDeduction = 0;
                    let refillDeduction = 0;

                    if (planCredits > 0) {
                        planDeduction = Math.min(planCredits, remainingToDeduct);
                        remainingToDeduct -= planDeduction;
                    }

                    if (remainingToDeduct > 0) {
                        refillDeduction = remainingToDeduct;
                    }

                    await updateDoc(userRef, {
                        planCredits: increment(-planDeduction),
                        refillCredits: increment(-refillDeduction),
                        usageCount: increment(fileCount),
                        lastUsageDate: new Date().toISOString().split('T')[0]
                    });

                    // Update local state
                    setPlanCredits(prev => prev - planDeduction);
                    setRefillCredits(prev => prev - refillDeduction);
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
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* Premium Glassmorphic Header */}
            <header className={`nav-header ${scrolled ? 'scrolled' : ''}`} style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                padding: scrolled ? '0.75rem 2rem' : '1.25rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 1000,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.01)',
                backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(0px)',
                borderBottom: scrolled ? '1px solid rgba(16, 124, 65, 0.08)' : '1px solid transparent',
                boxShadow: scrolled ? '0 4px 20px -5px rgba(0, 0, 0, 0.08)' : 'none',
            }}>
                <Link href="/" className="logo">
                    TableSift<span>.com</span>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>

                    {/* Unified Profile Pill */}
                    <div className="profile-pill" style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.6)',
                        padding: '6px 8px 6px 16px',
                        borderRadius: '99px',
                        border: '1px solid rgba(0,0,0,0.05)',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                        backdropFilter: 'blur(10px)',
                        gap: '12px'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.1 }}>
                            <div style={{
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                color: '#0f172a',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                animation: (planCredits + refillCredits < 5) ? 'pulse-low 2s infinite' : 'none'
                            }}>
                                {/* Thunder Icon (Small) - Green */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#22c55e" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                </svg>
                                {planCredits + refillCredits}
                            </div>
                            {(userTier === "free" || userTier === "none") && (
                                <button
                                    onClick={() => setShowPricingModal(true)}
                                    style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                >
                                    Upgrade
                                </button>
                            )}
                        </div>

                        {/* Divider */}
                        <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }}></div>

                        {/* Profile Section */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} className="group">
                            <img
                                src={user?.photoURL || ""}
                                alt="Profile"
                                style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                            />
                            <div className="profile-name" style={{ display: 'flex', flexDirection: 'column', paddingRight: '4px' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                                    {user?.displayName?.split(' ')[0]}
                                </span>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="logout-btn"
                                style={{
                                    background: '#fee2e2',
                                    color: '#dc2626',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '28px',
                                    height: '28px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    marginLeft: '4px'
                                }}
                                title="Sign Out"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            </button>
                        </div>
                    </div>

                </div>
            </header>

            {/* Main Content */}
            <main className="container" style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '100px',
                paddingBottom: '40px'
            }}>

                <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative', zIndex: 10 }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '6px 16px',
                        background: '#f0fdf4',
                        color: '#15803d',
                        borderRadius: '99px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        marginBottom: '1.5rem',
                        border: '1px solid #dcfce7'
                    }}>
                        Ready to Extract
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-1px' }}>
                        Drop anything here.<br />We'll turn it into an Excel file.
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
                        Upload screenshots, PDFs, or Word docs. Get clean, formatted data instantly.
                    </p>
                </div>

                {/* Premium Upload Zone - Matching Homepage 'App Window' Style */}
                <div
                    onDrop={onDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    style={{
                        width: '100%',
                        maxWidth: '750px',
                        minHeight: '400px',
                        background: 'white',
                        border: isUploading ? '2px solid #22c55e' : '1px solid #e2e8f0',
                        borderRadius: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isUploading ? 'wait' : 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isUploading
                            ? '0 25px 50px -12px rgba(34, 197, 94, 0.25)'
                            : '0 20px 40px -10px rgba(0,0,0,0.06)',
                        padding: '3rem',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    className="group"
                >
                    {/* Background Glow Effect */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '600px',
                        height: '600px',
                        background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, rgba(255, 255, 255, 0) 60%)',
                        zIndex: 0,
                        pointerEvents: 'none',
                        filter: 'blur(40px)'
                    }}></div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        multiple
                        onChange={onFileChange}
                        style={{ display: 'none' }}
                    />

                    {isUploading ? (
                        <div style={{ textAlign: 'center', zIndex: 10 }}>
                            {/* Animated Premium Spinner */}
                            <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 2rem' }}>
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    border: '4px solid #e2e8f0',
                                    borderRadius: '50%',
                                }}></div>
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    border: '4px solid #22c55e',
                                    borderTopColor: 'transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                }}></div>
                            </div>

                            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                                {processingStage}
                            </p>
                            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                                AI is analyzing your document structure...
                            </p>
                        </div>
                    ) : success ? (
                        <div style={{ textAlign: 'center', zIndex: 10 }}>
                            <div style={{
                                width: '80px', height: '80px',
                                background: '#dcfce7',
                                color: '#166534',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                margin: '0 auto 1.5rem'
                            }}>
                                ✓
                            </div>
                            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                                Extraction Complete!
                            </p>
                            <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '2rem' }}>
                                Your data has been securely downloaded.
                            </p>
                            <button
                                onClick={(e) => { e.stopPropagation(); setSuccess(false); }}
                                style={{
                                    padding: '12px 32px',
                                    background: '#22c55e',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                Extract Another Table
                            </button>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', zIndex: 10 }} className="drop-content">
                            <div style={{
                                width: '80px', height: '80px',
                                background: '#f0fdf4',
                                borderRadius: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 2rem',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)',
                                border: '1px solid #dcfce7'
                            }}>
                                {/* Green Thunder Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#22c55e" stroke="#15803d" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                </svg>
                            </div>
                            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                                Drag & Drop or Click to Upload
                            </p>
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '2rem' }}>
                                {['JPG', 'PNG', 'PDF', 'DOCX'].map(ext => (
                                    <span key={ext} style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        color: '#94a3b8',
                                        background: '#f8fafc',
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        {ext}
                                    </span>
                                ))}
                            </div>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
                                Max file size: 100MB
                            </p>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        marginTop: '2rem',
                        padding: '1rem 2rem',
                        background: '#fef2f2',
                        border: '1px solid #fee2e2',
                        borderRadius: '16px',
                        color: '#dc2626',
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.05)',
                        animation: 'fadeIn 0.3s ease-out'
                    }}>
                        {error} {error.includes("coin") && <Link href="/#pricing" style={{ textDecoration: 'underline', marginLeft: '5px' }}>Get more.</Link>}
                    </div>
                )}

                {/* Footer Action Pill (Upgrade vs Refill) */}
                {user && (
                    <div style={{
                        marginTop: '2rem',
                        textAlign: 'center',
                        animation: 'fadeIn 0.5s ease-out',
                        position: 'relative',
                        zIndex: 10
                    }}>
                        {(userTier === "free" || userTier === "none") ? (
                            // FREE USER: Show UPGRADE Nudge
                            <div className="refill-pill" style={{
                                background: '#f0fdf4', // green-50
                                border: '1px solid #4ade80', // green-400
                                padding: '10px 24px',
                                borderRadius: '99px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                cursor: 'pointer'
                            }} onClick={() => setShowPricingModal(true)}>
                                {/* Green Sparkle Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#22c55e" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                </svg>
                                <span style={{ color: '#166534', fontWeight: 600, fontSize: '0.95rem' }}>
                                    Want more power?
                                </span>
                                <span style={{
                                    color: '#15803d',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    borderBottom: '2px solid rgba(21, 128, 61, 0.3)',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s',
                                }}>
                                    Upgrade to Pro →
                                </span>
                            </div>
                        ) : (
                            // PAID USER: Show REFILL Nudge (Original)
                            <div className="refill-pill" style={{
                                background: '#f0fdf4', // green-50
                                border: '1px solid #4ade80', // green-400
                                padding: '10px 24px',
                                borderRadius: '99px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                            }}>
                                {/* Green Thunder Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#22c55e" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                </svg>
                                <span style={{ color: '#166534', fontWeight: 600, fontSize: '0.95rem' }}>
                                    Running low on energy?
                                </span>
                                <a href="/credits" style={{
                                    color: '#15803d',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    borderBottom: '2px solid rgba(21, 128, 61, 0.3)',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s',
                                }}
                                    onMouseOver={(e) => e.currentTarget.style.borderBottomColor = '#15803d'}
                                    onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'rgba(21, 128, 61, 0.3)'}
                                >
                                    Get a refill →
                                </a>
                            </div>
                        )}
                    </div>
                )}

                {/* Usage Info & Tips */}
                <div style={{ marginTop: '4rem', maxWidth: '800px', width: '100%' }}>

                    {/* Tips Section */}
                    <div style={{
                        background: '#f8fafc',
                        borderRadius: '20px',
                        padding: '2rem',
                        border: '1px solid #e2e8f0',
                        textAlign: 'left'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '1.25rem' }}>💡</span>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Tips for Best Results</h3>
                        </div>

                        <div className="tips-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ minWidth: '24px', height: '24px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534', fontSize: '0.75rem', fontWeight: 700 }}>1</div>
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Crystal Clear</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>High-resolution screenshots work best. Ensure text isn't blurry.</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ minWidth: '24px', height: '24px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534', fontSize: '0.75rem', fontWeight: 700 }}>2</div>
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Native Docs</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>Use original PDFs or Word files whenever possible for 100% accuracy.</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ minWidth: '24px', height: '24px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534', fontSize: '0.75rem', fontWeight: 700 }}>3</div>
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Table Focus</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>Crop screenshots specifically to the table area you need.</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ minWidth: '24px', height: '24px', background: '#fef3c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309', fontSize: '0.75rem', fontWeight: 700 }}>$</div>
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Cost Check</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>Standard images cost <strong>1 coin</strong>. Complex Word docs cost <strong>3 coins</strong>.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                {/* THE GLASS WALL MODAL */}
                {
                    showTopUpModal && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(15, 23, 42, 0.4)',
                            backdropFilter: 'blur(8px)',
                            zIndex: 2000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            animation: 'fadeIn 0.2s ease-out'
                        }} onClick={() => setShowTopUpModal(false)}>
                            <div style={{
                                background: 'white',
                                borderRadius: '24px',
                                padding: '3rem',
                                width: '100%',
                                maxWidth: '450px',
                                textAlign: 'center',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                position: 'relative',
                                border: '1px solid rgba(255,255,255,0.5)'
                            }} onClick={(e) => e.stopPropagation()}>
                                <div style={{
                                    width: '64px', height: '64px',
                                    background: '#fef3c7',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem',
                                }}>
                                    {/* Large Thunder Icon for Modal */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#d97706" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                    </svg>
                                </div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Out of Energy</h2>
                                <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                                    This operation requires <strong>{requiredCoinsForUpload} coins</strong>, but you only have <strong>{planCredits + refillCredits}</strong>. Recharge to continue!
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {userTier === "free" ? (
                                        <button
                                            onClick={() => { setShowTopUpModal(false); setShowPricingModal(true); }}
                                            style={{
                                                display: 'block',
                                                width: '100%',
                                                padding: '16px',
                                                background: '#2563eb', // Blue for upgrade
                                                color: 'white',
                                                borderRadius: '12px',
                                                fontWeight: 700,
                                                fontSize: '1rem',
                                                border: 'none',
                                                cursor: 'pointer',
                                                boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
                                            }}
                                        >
                                            Upgrade for More Fuel
                                        </button>
                                    ) : (
                                        <Link
                                            href="/credits"
                                            style={{
                                                display: 'block',
                                                width: '100%',
                                                padding: '16px',
                                                background: '#22c55e',
                                                color: 'white',
                                                borderRadius: '12px',
                                                fontWeight: 700,
                                                fontSize: '1rem',
                                                border: 'none',
                                                cursor: 'pointer',
                                                boxShadow: '0 10px 15px -3px rgba(34, 197, 94, 0.3)',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            Refill Fuel
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => setShowTopUpModal(false)}
                                        style={{
                                            width: '100%',
                                            padding: '14px',
                                            background: 'transparent',
                                            color: '#64748b',
                                            borderRadius: '12px',
                                            fontWeight: 600,
                                            border: 'none',
                                            fontSize: '1rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* PRICING MODAL */}
                {showPricingModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(15, 23, 42, 0.4)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 2001,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'fadeIn 0.2s ease-out',
                        padding: '1rem'
                    }} onClick={() => setShowPricingModal(false)}>
                        <div style={{
                            background: '#f8fafc',
                            borderRadius: '24px',
                            padding: '2rem',
                            maxWidth: '900px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            position: 'relative'
                        }} onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setShowPricingModal(false)}
                                style={{
                                    position: 'absolute', top: '1rem', right: '1rem',
                                    background: 'none', border: 'none', fontSize: '1.5rem',
                                    color: '#64748b', cursor: 'pointer'
                                }}
                            >
                                ×
                            </button>

                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Upgrade Your Plan</h2>
                                <p style={{ color: '#64748b' }}>Choose the best plan for your needs.</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                {/* Pro Plan */}
                                <div style={{ padding: '2rem', background: 'white', border: '2px solid #22c55e', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Pro</h3>
                                        <span style={{ background: '#22c55e', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>Popular</span>
                                    </div>
                                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '-0.75rem' }}>For regular users</p>
                                    <div>
                                        <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a' }}>$15</span>
                                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>/month</span>
                                    </div>
                                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}><span style={{ color: '#22c55e' }}>✓</span> 150 Coins / month</li>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}><span style={{ color: '#22c55e' }}>✓</span> Hybrid GPT-4o Engine</li>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}><span style={{ color: '#22c55e' }}>✓</span> Word Doc Support (3 coins)</li>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}><span style={{ color: '#22c55e' }}>✓</span> 5 images at once</li>
                                    </ul>
                                    <button
                                        onClick={() => handleUpgrade('pdt_0NXYHBcPszGyHO9M2lt8P', 'Pro', 150)}
                                        style={{ marginTop: 'auto', padding: '12px 20px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)' }}
                                    >
                                        Upgrade to Pro
                                    </button>
                                </div>

                                {/* Business Plan */}
                                <div style={{ padding: '2rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Business</h3>
                                        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>For power users</p>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a' }}>$49</span>
                                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>/month</span>
                                    </div>
                                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}><span style={{ color: '#22c55e' }}>✓</span> 500 Coins / month</li>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}><span style={{ color: '#22c55e' }}>✓</span> 20 images at once</li>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}><span style={{ color: '#22c55e' }}>✓</span> Up to 50 PDF pages</li>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}><span style={{ color: '#22c55e' }}>✓</span> Priority Support</li>
                                    </ul>
                                    <button
                                        onClick={() => handleUpgrade('pdt_0NXYHGpP9pSriiWduXPUE', 'Business', 500)}
                                        style={{ marginTop: 'auto', padding: '12px 20px', background: 'white', color: '#0f172a', border: '2px solid #e2e8f0', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
                                    >
                                        Upgrade to Business
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* CSS for animations */}
            <style jsx global>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .logo {
                  font-size: 1.5rem;
                  font-weight: 800;
                  letter-spacing: -1px;
                  color: #1e293b;
                  text-decoration: none;
                }
                .logo span { color: #107c41; }
                @keyframes pulse-low {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(0.95); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

const DashboardContentDynamic = dynamic(() => Promise.resolve(DashboardContent), {
    ssr: false,
});

export default function Dashboard() {
    return <DashboardContentDynamic />;
}
