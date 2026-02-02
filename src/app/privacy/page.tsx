"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PrivacyPage() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="container" style={{ paddingTop: '10rem' }}>
            <header className={`nav-header ${scrolled ? 'scrolled' : ''}`}>
                <Link href="/" className="logo">TableSift<span>.com</span></Link>
                <nav style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
                    <Link href="/" style={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748b', textDecoration: 'none' }}>Home</Link>
                    <Link href="/" className="glow-btn">Get Started</Link>
                </nav>
            </header>

            <main className="card-section">
                <h1 className="hero" style={{ textAlign: 'left', marginBottom: '1rem' }}>Privacy Policy</h1>
                <p style={{ color: '#94a3b8', marginBottom: '4rem' }}>Last updated: January 29, 2026</p>

                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>1. Data Sovereignty</h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.1rem' }}>
                        At TableSift, we believe your data is your property. We employ a strict Zero-Trace policy.
                        When you upload a document for sifting, it is processed in a high-security ephemeral environment.
                    </p>
                </section>

                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>2. Document Processing</h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.1rem' }}>
                        Processed files are never stored on our servers. The moment your extraction is completed and the
                        result is delivered to your browser, the original document and the extracted data are purged
                        from our active memory.
                    </p>
                </section>

                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>3. Identity & Usage</h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.1rem' }}>
                        We only retain your email address and profile name via Google Sign-in to manage your
                        free daily credits and prevent platform abuse. We do not sell this data to third parties.
                    </p>
                </section>
            </main>

            {/* Massive Footer */}
            <footer className="footer-massive" style={{ marginTop: '10rem' }}>
                <div className="footer-col">
                    <Link href="/" className="logo" style={{ marginBottom: '2rem' }}>TableSift<span>.com</span></Link>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.1rem' }}>
                        The world&apos;s most advanced AI-powered extraction tool for spreadsheet professionals.
                    </p>
                </div>
                <div className="footer-col">
                    <h4>Product</h4>
                    <ul>
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/#features">Features</Link></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Legal</h4>
                    <ul>
                        <li><Link href="/terms">Terms</Link></li>
                        <li><Link href="/privacy">Privacy</Link></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="mailto:support@tablesift.com">Support</a></li>
                    </ul>
                </div>
                <div className="footer-bottom">
                    <div>&copy; 2026 TableSift AI.</div>
                </div>
            </footer>
        </div>
    );
}
