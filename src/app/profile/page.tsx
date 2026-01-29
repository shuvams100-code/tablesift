"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [usageData, setUsageData] = useState({ usageCount: 0, lastUsageDate: "" });
    const [currentPlan] = useState("pro"); // Hardcoded 'pro' for testing

    // Plan limits
    const planLimits = {
        free: { scans: 1, perDay: 1, bulk: 1, pdfPages: 1 },
        pro: { scans: 100, perDay: null, bulk: 5, pdfPages: 10 },
        business: { scans: 500, perDay: null, bulk: 20, pdfPages: 50 },
        enterprise: { scans: Infinity, perDay: null, bulk: Infinity, pdfPages: Infinity },
    };

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
                setIsLoading(false);
                // Fetch usage data asynchronously (non-blocking)
                if (db) {
                    const userRef = doc(db, "users", currentUser.uid);
                    getDoc(userRef).then((userSnap) => {
                        if (userSnap.exists()) {
                            setUsageData(userSnap.data() as { usageCount: number; lastUsageDate: string });
                        }
                    }).catch((err) => {
                        console.warn("Failed to fetch usage:", err);
                    });
                }
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleSignOut = async () => {
        if (auth) {
            await signOut(auth);
            router.push("/");
        }
    };

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid #22c55e', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                    <p style={{ color: '#64748b' }}>Loading...</p>
                </div>
            </div>
        );
    }

    const limit = planLimits[currentPlan as keyof typeof planLimits];

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header */}
            <header style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', background: 'white' }}>
                <Link href="/dashboard" style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a', textDecoration: 'none' }}>
                    TableSift<span style={{ color: '#22c55e' }}>.com</span>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/dashboard" style={{ fontSize: '0.85rem', color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>Dashboard</Link>
                    <button onClick={handleSignOut} style={{ fontSize: '0.85rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                        Sign Out
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>

                {/* Profile Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
                    <img
                        src={user?.photoURL || ""}
                        alt=""
                        style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #22c55e' }}
                    />
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                            {user?.displayName}
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{user?.email}</p>
                    </div>
                </div>

                {/* Current Plan */}
                <section style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Current Plan</h2>
                        <span style={{
                            background: currentPlan === 'free' ? '#f1f5f9' : currentPlan === 'pro' ? '#dcfce7' : currentPlan === 'business' ? '#0f172a' : '#22c55e',
                            color: currentPlan === 'free' ? '#475569' : currentPlan === 'business' ? 'white' : '#166534',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            textTransform: 'uppercase'
                        }}>
                            {currentPlan}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '1rem' }}>
                            <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Monthly Scans</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                                {limit.scans === Infinity ? '∞' : limit.scans}
                            </p>
                        </div>
                        <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '1rem' }}>
                            <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Bulk Upload</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                                {limit.bulk === Infinity ? '∞' : `${limit.bulk} at once`}
                            </p>
                        </div>
                        <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '1rem' }}>
                            <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.25rem' }}>PDF Pages</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                                {limit.pdfPages === Infinity ? '∞' : `Up to ${limit.pdfPages}`}
                            </p>
                        </div>
                        <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '1rem' }}>
                            <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Daily Limit</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                                {limit.perDay ? `${limit.perDay}/day` : 'No limit'}
                            </p>
                        </div>
                    </div>

                    {currentPlan === 'free' && (
                        <Link href="/#pricing" style={{
                            display: 'block',
                            textAlign: 'center',
                            padding: '14px 24px',
                            background: '#22c55e',
                            color: 'white',
                            borderRadius: '10px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            fontSize: '0.95rem'
                        }}>
                            Upgrade to Pro
                        </Link>
                    )}
                </section>

                {/* Usage This Month */}
                <section style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem' }}>Usage</h2>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ flex: 1, background: '#e2e8f0', borderRadius: '10px', height: '12px', overflow: 'hidden' }}>
                            <div style={{
                                width: `${Math.min((usageData.usageCount / (limit.scans === Infinity ? 1 : limit.scans)) * 100, 100)}%`,
                                height: '100%',
                                background: usageData.usageCount >= (limit.perDay || limit.scans) ? '#ef4444' : '#22c55e',
                                borderRadius: '10px',
                                transition: 'width 0.3s ease'
                            }}></div>
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', minWidth: '80px' }}>
                            {usageData.usageCount} / {limit.scans === Infinity ? '∞' : limit.scans}
                        </span>
                    </div>

                    <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                        {usageData.lastUsageDate
                            ? `Last scan: ${new Date(usageData.lastUsageDate).toLocaleDateString()}`
                            : 'No scans yet'}
                    </p>
                </section>

                {/* Billing (Coming Soon) */}
                <section style={{ background: 'white', borderRadius: '16px', padding: '2rem', border: '1px solid #e2e8f0', opacity: 0.7 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Billing</h2>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Manage your subscription and payment methods</p>
                        </div>
                        <span style={{ background: '#fef3c7', color: '#92400e', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                            COMING SOON
                        </span>
                    </div>
                </section>

            </main>

            <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
