"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, updateDoc, increment, setDoc } from "firebase/firestore";

export default function CreditsPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [planCredits, setPlanCredits] = useState<number>(0);
    const [refillCredits, setRefillCredits] = useState<number>(0);
    const [userTier, setUserTier] = useState<string>("free");
    const [processingPack, setProcessingPack] = useState<number | null>(null);

    // Auth & Balance Check
    useEffect(() => {
        if (!auth) {
            router.push("/");
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                if (db) {
                    const userRef = doc(db, "users", currentUser.uid);
                    const snap = await getDoc(userRef);
                    if (snap.exists()) {
                        const data = snap.data();
                        setPlanCredits(data.planCredits ?? 0);
                        setRefillCredits(data.refillCredits ?? 0);
                        setUserTier(data.tier ?? "free");
                    }
                }
            } else {
                router.push("/");
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handlePurchase = async (price: number, amount: number) => {
        if (!user || !db) return;

        // SUBSCRIPTION GATING - Block free users
        if (userTier === "free") {
            alert("Please upgrade to a paid plan to purchase refill credits.");
            return;
        }

        setProcessingPack(price);

        // Simulate API/Payment delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const userRef = doc(db, "users", user.uid);
            // Increment REFILL credits (these roll over)
            await updateDoc(userRef, {
                refillCredits: increment(amount)
            });

            // Redirect back to dashboard
            router.push("/dashboard");
        } catch (error) {
            console.error("Purchase failed", error);
            setProcessingPack(null);
            alert("Purchase failed. Please try again.");
        }
    };

    // Pricing Packs Configuration (WITH BONUSES)
    const packs = [
        { price: 5, amount: 55, baseAmount: 50, bonus: "+10%", label: "Starter" },
        { price: 10, amount: 115, baseAmount: 100, bonus: "+15%", label: "Booster" },
        { price: 15, amount: 180, baseAmount: 150, bonus: "+20%", label: "Basic" },
        { price: 20, amount: 250, baseAmount: 200, bonus: "+25%", label: "Pro", popular: true },
        { price: 25, amount: 325, baseAmount: 250, bonus: "+30%", label: "Expert" },
        { price: 50, amount: 700, baseAmount: 500, bonus: "+40%", label: "Master" },
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '4rem' }}>
            {/* Minimal Header */}
            <header style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid #e2e8f0',
                padding: '1rem 2rem',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Link href="/dashboard" className="logo" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', textDecoration: 'none' }}>
                    TableSift<span style={{ color: '#16a34a' }}>.com</span>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {user && (
                        <div style={{
                            background: '#f0fdf4',
                            color: '#166534',
                            padding: '6px 12px',
                            borderRadius: '99px',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            border: '1px solid #bbf7d0'
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#22c55e" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                            </svg>
                            {planCredits + refillCredits}
                        </div>
                    )}
                    <Link href="/dashboard" style={{
                        fontSize: '0.9rem', fontWeight: 600, color: '#64748b', textDecoration: 'none'
                    }}>
                        Close
                    </Link>
                </div>
            </header>

            <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem', textAlign: 'center' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <div style={{
                        width: '64px', height: '64px',
                        background: '#f0fdf4',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 10px 20px -5px rgba(34, 197, 94, 0.2)'
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#22c55e" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                        </svg>
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-1px' }}>
                        Refill Your Energy
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#64748b' }}>
                        Choose a pack to instantly top up your wallet.
                    </p>
                </div>

                {/* Pricing Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem',
                    justifyContent: 'center'
                }}>
                    {packs.map((pack) => (
                        <div key={pack.price} style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '2rem',
                            border: pack.popular ? '2px solid #22c55e' : '1px solid #e2e8f0',
                            transition: 'all 0.2s',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: processingPack ? 'not-allowed' : 'default'
                        }}>
                            {/* Bonus Badge Ribbon (Top-Left) */}
                            {pack.bonus && (
                                <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    left: '-8px',
                                    background: '#22c55e',
                                    color: 'white',
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    padding: '4px 12px',
                                    textTransform: 'uppercase',
                                    boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                                    letterSpacing: '0.5px'
                                }}>
                                    {pack.bonus} BONUS
                                </div>
                            )}

                            {/* Popular Badge (Top-Right) */}
                            {pack.popular && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    background: '#22c55e',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    padding: '4px 12px',
                                    borderBottomLeftRadius: '12px',
                                    textTransform: 'uppercase'
                                }}>
                                    Popular
                                </div>
                            )}

                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginTop: pack.bonus ? '1.5rem' : '0' }}>
                                {pack.label}
                            </h3>

                            <div style={{ margin: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                {/* Base Amount (Crossed Out) */}
                                {pack.baseAmount && (
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#94a3b8', textDecoration: 'line-through' }}>
                                        {pack.baseAmount} Coins
                                    </span>
                                )}
                                {/* Final Amount (Bold & Green) */}
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                    <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a' }}>{pack.amount}</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#22c55e' }}>Coins</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handlePurchase(pack.price, pack.amount)}
                                disabled={!!processingPack}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    cursor: processingPack ? 'not-allowed' : 'pointer',
                                    background: processingPack === pack.price ? '#f1f5f9' : '#0f172a',
                                    color: processingPack === pack.price ? '#94a3b8' : 'white',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {processingPack === pack.price ? 'Processing...' : `Buy for $${pack.price}`}
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '3rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                    Secured by DemoPay. No actual card required.
                </div>
            </main>
        </div>
    );
}
