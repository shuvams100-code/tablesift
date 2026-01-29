"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TermsPage() {
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
                <h1 className="hero" style={{ textAlign: 'left', marginBottom: '1rem' }}>Terms of Service</h1>
                <p style={{ color: '#94a3b8', marginBottom: '4rem' }}>Last updated: January 29, 2026</p>

                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>1. Provision of Service</h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.1rem' }}>
                        TableSift provides an AI-driven data extraction interface. By using our service, you agree
                        to use it for lawful purposes and comply with all applicable data privacy regulations.
                    </p>
                </section>

                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>2. AI Performance</h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.1rem' }}>
                        While our models are industry-leading, AI can hallucinate or misread data. TableSift
                        is a productivity tool, not a substitute for human audit. Users bear the responsibility
                        for verifying all generated data.
                    </p>
                </section>

                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>3. Fair Use</h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.1rem' }}>
                        Our free tier is designed to help individual users. Automated scraping, bulk account creation,
                        or any attempt to bypass usage limits will result in an immediate and permanent suspension of access.
                    </p>
                </section>
            </main>

            {/* Massive Footer */}
            <footer className="footer-massive" style={{ marginTop: '10rem' }}>
                <div className="footer-col">
                    <Link href="/" className="logo" style={{ marginBottom: '2rem' }}>TableSift<span>.com</span></Link>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.1rem' }}>
                        The world's most advanced AI-powered extraction tool for spreadsheet professionals.
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
