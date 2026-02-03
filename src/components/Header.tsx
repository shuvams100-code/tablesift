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
        <header className={`navbar-glass ${scrolled ? 'scrolled' : ''}`} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: 'calc(100% - 40px)',
            maxWidth: '1100px',
            margin: '20px auto',
            padding: '12px 30px',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            borderRadius: '100px',
            position: 'sticky',
            top: '20px',
            zIndex: 1000,
            transition: 'all 0.3s ease'
        }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', fontFamily: 'Clash Display', letterSpacing: '-1px' }}>
                    TableSift<span style={{ color: '#107c41' }}>.com</span>
                </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="desktop-nav" style={{ display: 'flex', gap: '32px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                <Link href="/#why-tablesift" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>Why TableSift?</Link>
                <Link href="/#how-it-works" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>How it works</Link>
                <Link href="/#pricing" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>Pricing</Link>
                <Link href="/#faq" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>FAQ</Link>
            </nav>

            <div className="nav-buttons-group">
                {(user && !authLoading) ? (
                    <Link href="/dashboard" className="btn-signin" style={{ textDecoration: 'none' }}>Dashboard</Link>
                ) : (
                    <button onClick={handleSignIn} className="btn-signin">Sign In</button>
                )}
            </div>
        </header>
    );
}
