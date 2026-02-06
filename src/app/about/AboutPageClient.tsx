"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPageClient() {
    return (
        <div style={{ minHeight: '100vh', background: '#ffffff' }}>
            <Header />

            {/* Main Content */}
            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px 120px' }}>
                {/* Hero */}
                <div style={{ marginBottom: '60px', textAlign: 'center' }}>
                    <span style={{
                        background: '#dbeafe',
                        color: '#1e40af',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        About Us
                    </span>
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: 900,
                        color: '#0f172a',
                        marginTop: '24px',
                        marginBottom: '16px',
                        letterSpacing: '-1px',
                    }}>
                        Redefining Data Extraction with AI Precision
                    </h1>
                    <p style={{
                        color: '#64748b',
                        fontSize: '1.25rem',
                        lineHeight: 1.7,
                    }}>
                        Welcome to <strong style={{ color: '#0f172a' }}>TableSift</strong>, the next-generation document conversion
                        engine designed to transform static documents into dynamic, usable spreadsheets with <strong style={{ color: '#22c55e' }}>99.9% accuracy</strong>.
                    </p>
                </div>

                {/* Why We Built This */}
                <div className="glass-panel" style={{ padding: '48px', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
                        Why We Built TableSift
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.1rem' }}>
                        We were tired of <strong style={{ color: '#0f172a' }}>&ldquo;dumb&rdquo; converters</strong>. OCR tools that
                        mixed up columns, confused headers with data, and required hours of manual cleanup.
                        We believed there had to be a better way to handle the world&apos;s data.
                    </p>
                </div>

                {/* What Does TableSift Mean */}
                <div className="glass-panel" style={{ padding: '48px', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
                        What Does &ldquo;TableSift&rdquo; Mean?
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '24px' }}>
                        The name is our philosophy:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            <span style={{ background: '#dcfce7', color: '#166534', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>Table</span>
                            <span style={{ color: '#475569', lineHeight: 1.7 }}>The structured data—rows, columns, and financial grids—that drives your business.</span>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            <span style={{ background: '#dbeafe', color: '#1e40af', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>Sift</span>
                            <span style={{ color: '#475569', lineHeight: 1.7 }}>To examine thoroughly and isolate what is valuable.</span>
                        </div>
                    </div>
                </div>

                {/* Technology */}
                <div className="glass-panel" style={{ padding: '48px', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
                        Our Technology: Beyond Standard OCR
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '32px' }}>
                        Standard OCR sees characters. <strong style={{ color: '#0f172a' }}>TableSift sees context.</strong> Powered by
                        advanced LLMs and computer vision, we understand document <em>structure</em> before extracting a single number.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🎯</div>
                            <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>99.9% Accuracy</h4>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Minimized errors</p>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📊</div>
                            <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Complex Layouts</h4>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Merged cells handled</p>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📁</div>
                            <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Universal</h4>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>PDF, JPG, PNG</p>
                        </div>
                    </div>
                </div>

                {/* Mission */}
                <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '48px', borderRadius: '20px', color: 'white', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px' }}>
                        Our Mission
                    </h2>
                    <p style={{ fontSize: '1.25rem', lineHeight: 1.7, opacity: 0.95 }}>
                        <strong>To make the world&apos;s unstructured data accessible.</strong>
                    </p>
                    <p style={{ fontSize: '1rem', lineHeight: 1.8, marginTop: '16px', opacity: 0.85 }}>
                        Every day, millions of valuable data points are locked inside &ldquo;dead&rdquo; formats like PDFs and images.
                        We&apos;re unlocking that data for analysts, accountants, developers, and researchers worldwide.
                    </p>
                </div>

                {/* CTA */}
                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <p style={{ color: '#64748b', marginBottom: '24px', fontStyle: 'italic' }}>
                        Stop typing. <strong style={{ color: '#0f172a' }}>Start Sifting.</strong>
                    </p>
                    <Link href="/" className="btn-primary" style={{
                        display: 'inline-block',
                        padding: '16px 36px',
                        textDecoration: 'none',
                    }}>
                        Try TableSift Free →
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
