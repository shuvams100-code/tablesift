"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPageClient() {
    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
            <Header />

            {/* Main Content */}
            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px 100px' }}>
                {/* Hero */}
                <div style={{ marginBottom: '60px', textAlign: 'center' }}>
                    <span style={{
                        background: 'linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)',
                        color: '#166534',
                        padding: '8px 20px',
                        borderRadius: '50px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}>
                        About Us
                    </span>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        fontWeight: 900,
                        color: '#0f172a',
                        marginTop: '24px',
                        marginBottom: '20px',
                        letterSpacing: '-1px',
                        lineHeight: 1.2
                    }}>
                        Redefining Data Extraction with <span style={{ color: '#107c41' }}>AI Precision</span>
                    </h1>
                    <p style={{
                        color: '#64748b',
                        fontSize: '1.2rem',
                        lineHeight: 1.7,
                    }}>
                        Welcome to <strong style={{ color: '#0f172a' }}>TableSift</strong>, the next-generation document conversion
                        engine designed to transform static documents into dynamic, usable spreadsheets with <strong style={{ color: '#10b981' }}>99.9% accuracy</strong>.
                    </p>
                </div>

                {/* Why We Built This */}
                <div style={{
                    padding: '48px',
                    marginBottom: '24px',
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
                }}>
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
                <div style={{
                    padding: '48px',
                    marginBottom: '24px',
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
                        What Does &ldquo;TableSift&rdquo; Mean?
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '24px' }}>
                        The name is our philosophy:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            <span style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)', color: '#166534', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>Table</span>
                            <span style={{ color: '#475569', lineHeight: 1.7 }}>The structured data—rows, columns, and financial grids—that drives your business.</span>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            <span style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)', color: '#1e40af', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>Sift</span>
                            <span style={{ color: '#475569', lineHeight: 1.7 }}>To examine thoroughly and isolate what is valuable.</span>
                        </div>
                    </div>
                </div>

                {/* Technology */}
                <div style={{
                    padding: '48px',
                    marginBottom: '24px',
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
                        Our Technology: Beyond Standard OCR
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '32px' }}>
                        Standard OCR sees characters. <strong style={{ color: '#0f172a' }}>TableSift sees context.</strong> Powered by
                        advanced LLMs and computer vision, we understand document <em>structure</em> before extracting a single number.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🎯</div>
                            <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>99.9% Accuracy</h4>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Minimized errors</p>
                        </div>
                        <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📊</div>
                            <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Complex Layouts</h4>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Merged cells handled</p>
                        </div>
                        <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📁</div>
                            <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Universal</h4>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>PDF, JPG, PNG</p>
                        </div>
                    </div>
                </div>

                {/* Mission - Dark Section */}
                <div style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    padding: '48px',
                    borderRadius: '24px',
                    color: 'white',
                    marginBottom: '32px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Decorative blur */}
                    <div style={{
                        position: 'absolute',
                        top: '-50%',
                        right: '-20%',
                        width: '300px',
                        height: '300px',
                        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(40px)',
                        pointerEvents: 'none',
                    }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
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
                </div>

                {/* CTA */}
                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <p style={{ color: '#64748b', marginBottom: '24px', fontStyle: 'italic', fontSize: '1.1rem' }}>
                        Stop typing. <strong style={{ color: '#0f172a' }}>Start Sifting.</strong>
                    </p>
                    <Link href="/" style={{
                        display: 'inline-block',
                        padding: '16px 36px',
                        textDecoration: 'none',
                        background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)',
                        color: 'white',
                        borderRadius: '14px',
                        fontWeight: 700,
                        fontSize: '1rem',
                        boxShadow: '0 4px 14px rgba(16, 124, 65, 0.3)'
                    }}>
                        Try TableSift Free →
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
