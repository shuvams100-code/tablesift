"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { auth, signInWithPopup, googleProvider } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export default function Header() {
    const [user, setUser] = useState<User | null>(null);
    const [scrolled, setScrolled] = useState(false);

    const [authLoading, setAuthLoading] = useState(true);

    // Handle Scroll Effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Listen for Auth changes
    useEffect(() => {
        if (!auth) {
            setTimeout(() => setAuthLoading(false), 0);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSignIn = async () => {
        if (!auth || !googleProvider) return;
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    return (
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
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                    TableSift<span style={{ color: '#107c41' }}>.com</span>
                </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="desktop-nav" style={{ display: 'flex', gap: '32px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                <Link href="/#why-tablesift" style={{ color: '#475569', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>Why TableSift?</Link>
                <Link href="/#how-it-works" style={{ color: '#475569', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>How it works</Link>
                <Link href="/blog" style={{ color: '#475569', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>Blog</Link>
                <Link href="/#pricing" style={{ color: '#475569', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>Pricing</Link>
                <Link href="/#faq" style={{ color: '#475569', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>FAQ</Link>
            </nav>

            <div className="nav-buttons-group">
                {(user && !authLoading) ? (
                    <Link href="/dashboard" style={{
                        textDecoration: 'none',
                        padding: '10px 24px',
                        background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)',
                        color: 'white',
                        borderRadius: '50px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        boxShadow: '0 4px 14px rgba(16, 124, 65, 0.3)'
                    }}>Dashboard</Link>
                ) : (
                    <button onClick={handleSignIn} style={{
                        padding: '10px 24px',
                        background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(16, 124, 65, 0.3)'
                    }}>Sign In</button>
                )}
            </div>
        </header>
    );
}
