import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'About TableSift | AI-Powered Document Conversion',
    description: 'Learn about TableSift, the next-generation document conversion engine that transforms PDFs and images into Excel spreadsheets with 99.9% accuracy.',
    openGraph: {
        title: 'About TableSift | Redefining Data Extraction with AI',
        description: 'We built TableSift because we were tired of dumb converters. Our AI sifts through the noise to deliver 99.9% accurate spreadsheets.',
        url: 'https://tablesift.com/about',
    },
    alternates: {
        canonical: 'https://tablesift.com/about',
    },
};

export default function AboutPage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc',
            fontFamily: 'var(--font-body)',
        }}>
            {/* Header */}
            <header style={{
                padding: '1.5rem 4rem',
                borderBottom: '1px solid #e2e8f0',
                background: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', textDecoration: 'none' }}>
                    TableSift<span style={{ color: '#22c55e' }}>.com</span>
                </Link>
                <Link
                    href="/"
                    style={{
                        background: '#22c55e',
                        color: 'white',
                        padding: '10px 24px',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        fontWeight: 600,
                    }}
                >
                    Try Free
                </Link>
            </header>

            {/* Main Content */}
            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '5rem 2rem' }}>

                {/* Hero */}
                <div style={{ marginBottom: '4rem' }}>
                    <span style={{
                        background: '#dbeafe',
                        color: '#1e40af',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase'
                    }}>
                        About Us
                    </span>
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        marginTop: '1.5rem',
                        fontFamily: 'var(--font-headline)',
                        letterSpacing: '-1px',
                        lineHeight: 1.1,
                    }}>
                        Redefining Data Extraction with AI Precision
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: '#64748b',
                        lineHeight: 1.7,
                        marginTop: '1.5rem',
                    }}>
                        Welcome to <strong style={{ color: '#0f172a' }}>TableSift</strong>, the next-generation document conversion
                        engine designed to transform static documents into dynamic, usable spreadsheets with <strong style={{ color: '#22c55e' }}>99.9% accuracy</strong>.
                    </p>
                </div>

                {/* Why We Built This */}
                <section style={{ marginBottom: '4rem' }}>
                    <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.8 }}>
                        We built TableSift because we were tired of &ldquo;dumb&rdquo; converters. We were tired of OCR tools
                        that mixed up columns, confused headers with data, and required hours of manual cleanup.
                        We believed there had to be a better way to handle the world&apos;s data.
                    </p>
                </section>

                {/* What Does Table Sift Mean */}
                <section style={{ marginBottom: '4rem', background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'var(--font-headline)' }}>
                        What Does &ldquo;TableSift&rdquo; Mean?
                    </h2>
                    <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                        The name is our philosophy.
                    </p>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <span style={{ background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem' }}>Table</span>
                            <span style={{ color: '#475569', lineHeight: 1.7 }}>The structured data—rows, columns, and financial grids—that drives your business, research, and analysis.</span>
                        </li>
                        <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <span style={{ background: '#dbeafe', color: '#1e40af', padding: '6px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem' }}>Sift</span>
                            <span style={{ color: '#475569', lineHeight: 1.7 }}>To examine thoroughly and isolate what is valuable.</span>
                        </li>
                    </ul>
                    <p style={{ fontSize: '1rem', color: '#64748b', marginTop: '1.5rem', lineHeight: 1.7 }}>
                        Unlike traditional tools that blindly copy text, our AI <strong style={{ color: '#0f172a' }}>sifts</strong> through
                        the noise of a PDF or Image. It intelligently separates the data you need from the formatting you don&apos;t,
                        preserving the integrity of your original document.
                    </p>
                </section>

                {/* Technology Section */}
                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', fontFamily: 'var(--font-headline)' }}>
                        Our Technology: Beyond Standard OCR
                    </h2>
                    <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '2rem', lineHeight: 1.7 }}>
                        Standard Optical Character Recognition (OCR) sees characters. <strong style={{ color: '#0f172a' }}>TableSift sees context.</strong>
                    </p>
                    <p style={{ fontSize: '1rem', color: '#475569', marginBottom: '2rem', lineHeight: 1.7 }}>
                        Powered by advanced Large Language Models (LLMs) and computer vision, TableSift understands
                        the <em>structure</em> of a document before it extracts a single number. This allows us to achieve:
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎯</div>
                            <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>99.9% Accuracy</h4>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>We minimize hallucinations and formatting errors.</p>
                        </div>
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📊</div>
                            <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Complex Layouts</h4>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>Merged cells, borderless tables, multi-page docs handled.</p>
                        </div>
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📁</div>
                            <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Universal</h4>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>PDF, JPG, PNG → pristine Excel or CSV files.</p>
                        </div>
                    </div>
                </section>

                {/* Comparison Table */}
                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'var(--font-headline)' }}>
                        Why We Are Different
                    </h2>
                    <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f1f5f9' }}>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 700, color: '#0f172a', borderBottom: '1px solid #e2e8f0' }}>Feature</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 700, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Standard Converters</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 700, color: '#22c55e', borderBottom: '1px solid #e2e8f0' }}>TableSift AI</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#0f172a', borderBottom: '1px solid #e2e8f0' }}>Accuracy</td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>~85% (Requires checking)</td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#166534', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>99.9% (Ready to use)</td>
                                </tr>
                                <tr style={{ background: '#fafafa' }}>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#0f172a', borderBottom: '1px solid #e2e8f0' }}>Image Handling</td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Often fails on blurry text</td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#166534', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Enhances & Extracts</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#0f172a', borderBottom: '1px solid #e2e8f0' }}>Table Structure</td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Frequently breaks rows/cols</td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#166534', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Preserves strict grid logic</td>
                                </tr>
                                <tr style={{ background: '#fafafa' }}>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#0f172a' }}>Format</td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#64748b' }}>PDF only</td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#166534', fontWeight: 600 }}>PDF, JPG, PNG, TIFF</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Mission */}
                <section style={{ marginBottom: '4rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '3rem', borderRadius: '20px', color: 'white' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', fontFamily: 'var(--font-headline)' }}>
                        Our Mission
                    </h2>
                    <p style={{ fontSize: '1.25rem', lineHeight: 1.7, opacity: 0.9 }}>
                        <strong>To make the world&apos;s unstructured data accessible.</strong>
                    </p>
                    <p style={{ fontSize: '1rem', lineHeight: 1.8, marginTop: '1rem', opacity: 0.8 }}>
                        Every day, millions of valuable data points are locked inside &ldquo;dead&rdquo; formats like PDFs and images.
                        We are unlocking that data, making it searchable, editable, and analyzable for analysts,
                        accountants, developers, and researchers worldwide.
                    </p>
                </section>

                {/* FAQ */}
                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'var(--font-headline)' }}>
                        Frequently Asked Questions
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <details style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <summary style={{ fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>Is my data secure?</summary>
                            <p style={{ color: '#64748b', marginTop: '1rem', lineHeight: 1.7 }}>
                                Yes. TableSift processes your documents in a secure environment. We do not use your private data
                                to train our models without your explicit consent.
                            </p>
                        </details>
                        <details style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <summary style={{ fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>Can TableSift handle handwritten text?</summary>
                            <p style={{ color: '#64748b', marginTop: '1rem', lineHeight: 1.7 }}>
                                Our AI models are trained to recognize legible handwriting and convert it into structured
                                digital text within Excel cells.
                            </p>
                        </details>
                        <details style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <summary style={{ fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>Who is TableSift for?</summary>
                            <p style={{ color: '#64748b', marginTop: '1rem', lineHeight: 1.7 }}>
                                We serve anyone who interacts with data: Financial Analysts converting bank statements,
                                Researchers digitizing archival records, and Developers integrating data pipelines.
                            </p>
                        </details>
                    </div>
                </section>

                {/* CTA */}
                <section style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '2rem' }}>
                        TableSift is the premier AI solution for PDF to Excel and Image to Excel conversion.<br />
                        <strong style={{ color: '#0f172a' }}>Stop typing. Start Sifting.</strong>
                    </p>
                    <Link
                        href="/"
                        style={{
                            display: 'inline-block',
                            background: '#22c55e',
                            color: 'white',
                            padding: '18px 48px',
                            borderRadius: '14px',
                            textDecoration: 'none',
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            boxShadow: '0 10px 30px -10px rgba(34, 197, 94, 0.4)',
                        }}
                    >
                        Try TableSift Free →
                    </Link>
                </section>

            </main>

            {/* Footer */}
            <footer style={{
                padding: '3rem 4rem',
                borderTop: '1px solid #e2e8f0',
                background: 'white',
                textAlign: 'center',
            }}>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                    © 2026 TableSift AI. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
