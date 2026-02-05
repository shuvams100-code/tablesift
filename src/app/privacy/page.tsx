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
        <div style={{ minHeight: '100vh', background: '#ffffff' }}>
            {/* Navigation */}
            <nav className={`navbar-glass ${scrolled ? 'scrolled' : ''}`} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: 'calc(100% - 40px)',
                maxWidth: '1100px',
                margin: '20px auto',
                padding: '12px 30px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '100px',
                position: 'sticky',
                top: '20px',
                zIndex: 1000,
            }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
                        TableSift<span style={{ color: '#107c41' }}>.com</span>
                    </span>
                </Link>
                <Link href="/" className="glow-btn" style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: '99px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                }}>
                    Get Started
                </Link>
            </nav>

            {/* Main Content */}
            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px 120px' }}>
                {/* Hero */}
                <div style={{ marginBottom: '60px', textAlign: 'center' }}>
                    <span style={{
                        background: '#f0fdf4',
                        color: '#166534',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        Legal
                    </span>
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: 900,
                        color: '#0f172a',
                        marginTop: '24px',
                        marginBottom: '16px',
                        letterSpacing: '-1px',
                    }}>
                        Privacy Policy
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1rem' }}>
                        Last updated: January 29, 2026
                    </p>
                </div>

                {/* Content Sections */}
                <div className="glass-panel" style={{ padding: '48px', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
                        1. Data Sovereignty
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.1rem' }}>
                        At TableSift, we believe your data is your property. We employ a strict <strong style={{ color: '#0f172a' }}>Zero-Trace policy</strong>.
                        When you upload a document for sifting, it is processed in a high-security ephemeral environment.
                    </p>
                </div>

                <div className="glass-panel" style={{ padding: '48px', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
                        2. Document Processing
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.1rem' }}>
                        Processed files are <strong style={{ color: '#0f172a' }}>never stored on our servers</strong>. The moment your extraction is completed and the
                        result is delivered to your browser, the original document and the extracted data are purged
                        from our active memory.
                    </p>
                </div>

                <div className="glass-panel" style={{ padding: '48px', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
                        3. Identity & Usage
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.1rem' }}>
                        We only retain your email address and profile name via Google Sign-in to manage your
                        free credits and prevent platform abuse. <strong style={{ color: '#0f172a' }}>We do not sell this data to third parties.</strong>
                    </p>
                </div>

                {/* CTA */}
                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <p style={{ color: '#64748b', marginBottom: '24px' }}>Questions about our privacy practices?</p>
                    <a href="mailto:support@tablesift.com" className="btn-primary" style={{
                        display: 'inline-block',
                        padding: '16px 36px',
                        textDecoration: 'none',
                    }}>
                        Contact Support
                    </a>
                </div>
            </main>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid #f1f5f9', padding: '60px 24px', background: '#fafafa' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '40px' }}>
                    <div>
                        <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', textDecoration: 'none', letterSpacing: '-0.5px' }}>
                            TableSift<span style={{ color: '#107c41' }}>.com</span>
                        </Link>
                        <p style={{ color: '#64748b', marginTop: '16px', maxWidth: '300px', lineHeight: 1.6 }}>
                            The world&apos;s most advanced AI-powered extraction tool for spreadsheet professionals.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '60px' }}>
                        <div>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>Company</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <li><Link href="/about" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>About</Link></li>
                                <li><Link href="/privacy" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link></li>
                                <li><Link href="/terms" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div style={{ maxWidth: '1200px', margin: '40px auto 0', paddingTop: '40px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>© 2026 TableSift.com. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
