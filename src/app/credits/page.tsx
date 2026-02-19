"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function CreditsPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [planCredits, setPlanCredits] = useState<number>(0);
    const [refillCredits, setRefillCredits] = useState<number>(0);
    const [userTier, setUserTier] = useState<string>("free");
    const [processingPack, setProcessingPack] = useState<number | null>(null);
    const [scrolled, setScrolled] = useState(false);

    // Handle Scroll Effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
                        const tier = data.tier ?? "free";

                        // Gating: Only paid users can access this page
                        if (tier === "free" || tier === "none") {
                            router.push("/dashboard?upgrade_needed=true");
                            return;
                        }

                        setPlanCredits(data.planCredits ?? 0);
                        setRefillCredits(data.refillCredits ?? 0);
                        setUserTier(tier);
                    } else {
                        router.push("/dashboard");
                    }
                }
            } else {
                router.push("/");
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handlePurchase = async (productId: string, amount: number) => {
        if (!user || !db) return;

        if (userTier === "free" || userTier === "none") {
            router.push("/dashboard");
            return;
        }

        setProcessingPack(amount);

        try {
            const idToken = await user.getIdToken();

            const response = await fetch("/api/payments/create-checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    productId,
                    credits: amount,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to create checkout");
            }

            const { checkoutUrl } = await response.json();
            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            } else {
                console.error('Checkout URL is missing from response');
                alert('Payment initialization failed: No checkout URL returned. Please check console for details.');
                setProcessingPack(null);
            }
        } catch (error) {
            console.error("Purchase failed", error);
            setProcessingPack(null);
            alert("Failed to start checkout. Please try again.");
        }
    };

    const packs = [
        { id: 'pdt_0NXY12XISoCzZ7ikWU2D3', price: 5, amount: 55, baseAmount: 50, bonus: "+10%", label: "Fuel Mini" },
        { id: 'pdt_0NXY1LQjul9UlatR2vAfb', price: 10, amount: 115, baseAmount: 100, bonus: "+15%", label: "Fuel Basic" },
        { id: 'pdt_0NXY1atSM5bib2RuQknAq', price: 20, amount: 240, baseAmount: 200, bonus: "+20%", label: "Fuel Standard", popular: true },
        { id: 'pdt_0NXY27NeRW5UWRjLPfTWi', price: 30, amount: 375, baseAmount: 300, bonus: "+25%", label: "Fuel Plus" },
        { id: 'pdt_0NXY2KVOI9kYbpHHemQcb', price: 50, amount: 700, baseAmount: 500, bonus: "+40%", label: "Fuel Max" },
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc 0%, #f0fdf4 100%)' }}>
            {/* Glassmorphic Header */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: 'calc(100% - 40px)',
                maxWidth: '1100px',
                margin: '20px auto',
                padding: '14px 32px',
                background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '100px',
                position: 'sticky',
                top: '20px',
                zIndex: 1000,
                transition: 'all 0.3s ease',
                boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.08)' : '0 4px 20px rgba(0,0,0,0.04)',
                border: '1px solid rgba(255,255,255,0.5)'
            }}>
                <Link href="/dashboard" style={{
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    textDecoration: 'none',
                    letterSpacing: '-0.5px'
                }}>
                    TableSift<span style={{ color: '#107c41' }}>.com</span>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {user && (
                        <div style={{
                            background: 'linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)',
                            color: '#166534',
                            padding: '8px 16px',
                            borderRadius: '50px',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: '1px solid rgba(34, 197, 94, 0.2)'
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#22c55e" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                            </svg>
                            {planCredits + refillCredits} Fuel
                        </div>
                    )}
                    <Link href="/dashboard" style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: '#64748b',
                        textDecoration: 'none',
                        padding: '8px 16px',
                        borderRadius: '50px',
                        background: 'rgba(0,0,0,0.05)',
                        transition: 'background 0.2s'
                    }}>
                        ← Back to Dashboard
                    </Link>
                </div>
            </header>

            <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 24px 100px', textAlign: 'center' }}>
                {/* Hero */}
                <div style={{ marginBottom: '60px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        boxShadow: '0 12px 40px -10px rgba(34, 197, 94, 0.3)'
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#22c55e" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                        </svg>
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 2.75rem)',
                        fontWeight: 900,
                        color: '#0f172a',
                        marginBottom: '16px',
                        letterSpacing: '-1px'
                    }}>
                        Refill Your <span style={{ color: '#10b981' }}>Energy</span>
                    </h1>
                    <p style={{ fontSize: '1.15rem', color: '#64748b', maxWidth: '500px', margin: '0 auto' }}>
                        Choose a pack to instantly top up your wallet. Bigger packs = bigger bonuses.
                    </p>
                </div>

                {/* Pricing Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '24px',
                    justifyContent: 'center'
                }}>
                    {packs.map((pack) => (
                        <div key={pack.price} style={{
                            background: pack.popular
                                ? 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,253,244,0.95) 100%)'
                                : 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '24px',
                            padding: '32px',
                            border: pack.popular ? '2px solid #10b981' : '1px solid rgba(0,0,0,0.06)',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: processingPack ? 'not-allowed' : 'default',
                            boxShadow: pack.popular
                                ? '0 16px 48px -12px rgba(16, 185, 129, 0.25)'
                                : '0 8px 32px rgba(0,0,0,0.06)'
                        }}>
                            {/* Bonus Badge */}
                            {pack.bonus && (
                                <div style={{
                                    position: 'absolute',
                                    top: '16px',
                                    left: '-8px',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    padding: '6px 14px',
                                    textTransform: 'uppercase',
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                    letterSpacing: '0.5px'
                                }}>
                                    {pack.bonus} BONUS
                                </div>
                            )}

                            {/* Popular Badge */}
                            {pack.popular && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    padding: '6px 16px',
                                    borderBottomLeftRadius: '16px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Most Popular
                                </div>
                            )}

                            <h3 style={{
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                color: '#64748b',
                                textTransform: 'uppercase',
                                letterSpacing: '1.5px',
                                marginTop: pack.bonus ? '24px' : '0'
                            }}>
                                {pack.label}
                            </h3>

                            <div style={{ margin: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                {pack.baseAmount && (
                                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#94a3b8', textDecoration: 'line-through' }}>
                                        {pack.baseAmount} Fuel
                                    </span>
                                )}
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                    <span style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a' }}>{pack.amount}</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>Fuel</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handlePurchase(pack.id, pack.amount)}
                                disabled={!!processingPack}
                                style={{
                                    width: '100%',
                                    padding: '18px',
                                    borderRadius: '14px',
                                    border: 'none',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    cursor: processingPack ? 'not-allowed' : 'pointer',
                                    background: processingPack === pack.amount
                                        ? '#f1f5f9'
                                        : pack.popular
                                            ? 'linear-gradient(135deg, #107c41 0%, #10b981 100%)'
                                            : '#0f172a',
                                    color: processingPack === pack.amount ? '#94a3b8' : 'white',
                                    transition: 'all 0.2s',
                                    boxShadow: pack.popular ? '0 4px 14px rgba(16, 124, 65, 0.3)' : 'none'
                                }}
                            >
                                {processingPack === pack.amount ? 'Processing...' : `Buy for $${pack.price}`}
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{
                    marginTop: '60px',
                    color: '#94a3b8',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Secured by Dodo Payments. 256-bit SSL encryption.
                </div>
            </main>
        </div>
    );
}
