"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
            <head>
                <link rel="canonical" href="https://tablesift.com/privacy" />
                <title>Privacy Policy | TableSift</title>
            </head>
            <Header />

            {/* Main Content */}
            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px 80px' }}>
                {/* Hero */}
                <div style={{ marginBottom: '60px', textAlign: 'center' }}>
                    <span style={{
                        background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
                        color: '#1e40af',
                        padding: '8px 20px',
                        borderRadius: '50px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}>
                        Privacy
                    </span>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        fontWeight: 900,
                        color: '#0f172a',
                        marginTop: '24px',
                        marginBottom: '16px',
                        letterSpacing: '-1px',
                    }}>
                        Privacy Policy
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1rem' }}>
                        Effective Date: February 1, 2026 | Last Updated: February 7, 2026
                    </p>
                </div>

                {/* Introduction */}
                <div style={{
                    padding: '40px',
                    marginBottom: '24px',
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
                }}>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem' }}>
                        At TableSift (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), we are committed to protecting your privacy and ensuring the security of your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service, in compliance with the General Data Protection Regulation (GDPR), the Information Technology Act, 2000 (India), and other applicable data protection laws.
                    </p>
                </div>

                {/* Section 1 */}
                <div style={{
                    padding: '40px',
                    marginBottom: '24px',
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
                }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
                        1. Data Controller Information
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        TableSift is the data controller responsible for your personal data. For questions or concerns about our privacy practices, contact:
                    </p>
                    <p style={{ color: '#0f172a', lineHeight: 1.8, fontSize: '1.05rem', fontWeight: 600 }}>
                        Support Team<br />
                        Email: support@tablesift.com<br />
                        Address: Bangalore, Karnataka, India
                    </p>
                </div>

                {/* Section 2 */}
                <div style={{
                    padding: '40px',
                    marginBottom: '24px',
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
                }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
                        2. Data We Collect
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        We collect information in the following categories:
                    </p>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '12px' }}>
                        <strong style={{ color: '#0f172a' }}>Account Information:</strong> Name, email address, profile picture (via Google Sign-in), and account preferences.
                    </p>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '12px' }}>
                        <strong style={{ color: '#0f172a' }}>Usage Data:</strong> Information about how you use our Service, including pages visited, features used, and conversion history.
                    </p>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '12px' }}>
                        <strong style={{ color: '#0f172a' }}>Device Information:</strong> IP address, browser type, operating system, and device identifiers.
                    </p>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem' }}>
                        <strong style={{ color: '#0f172a' }}>Payment Information:</strong> Billing details processed securely through Razorpay. We do not store credit card numbers.
                    </p>
                </div>

                {/* Section 3 */}
                <div style={{
                    padding: '40px',
                    marginBottom: '24px',
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
                }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
                        3. How We Use Your Data
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        We process your data based on the following lawful bases:
                    </p>
                    <ul style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', paddingLeft: '24px' }}>
                        <li><strong style={{ color: '#0f172a' }}>Contract Performance:</strong> To provide and maintain our Service, process your conversions, and manage your account.</li>
                        <li><strong style={{ color: '#0f172a' }}>Legitimate Interests:</strong> To improve our Service, analyze usage patterns, and prevent fraud.</li>
                        <li><strong style={{ color: '#0f172a' }}>Consent:</strong> For marketing communications and optional analytics (you may opt-out at any time).</li>
                        <li><strong style={{ color: '#0f172a' }}>Legal Obligations:</strong> To comply with applicable laws and respond to lawful requests.</li>
                    </ul>
                </div>

                {/* Section 4 - Document Processing - Dark Section */}
                <div style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    padding: '48px',
                    borderRadius: '24px',
                    color: 'white',
                    marginBottom: '24px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-30%',
                        right: '-10%',
                        width: '300px',
                        height: '300px',
                        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(40px)',
                        pointerEvents: 'none',
                    }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>
                            4. Document Processing & Zero-Trace Policy
                        </h2>
                        <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '16px', opacity: 0.95 }}>
                            We employ a strict <strong>Zero-Trace policy</strong> for document processing. This is our commitment to your data sovereignty:
                        </p>
                        <ul style={{ lineHeight: 1.8, fontSize: '1.05rem', paddingLeft: '24px', opacity: 0.9 }}>
                            <li>Documents are processed in <strong>ephemeral, high-security environments</strong></li>
                            <li>Uploaded files are <strong>never stored permanently</strong> on our servers</li>
                            <li>Upon extraction completion, both original documents and results are <strong>purged from active memory</strong></li>
                            <li>We do <strong>not train AI models</strong> on your uploaded documents</li>
                        </ul>
                    </div>
                </div>

                {/* Section 5 */}
                <div style={{
                    padding: '40px',
                    marginBottom: '24px',
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
                }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
                        5. Data Sharing & Third Parties
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        We share your data only with the following categories of third parties:
                    </p>
                    <ul style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', paddingLeft: '24px', marginBottom: '16px' }}>
                        <li><strong style={{ color: '#0f172a' }}>Authentication Providers:</strong> Google (for Sign-in)</li>
                        <li><strong style={{ color: '#0f172a' }}>Payment Processors:</strong> Razorpay (for secure payment handling)</li>
                        <li><strong style={{ color: '#0f172a' }}>Analytics:</strong> Google Analytics (for usage insights)</li>
                        <li><strong style={{ color: '#0f172a' }}>Cloud Infrastructure:</strong> Firebase/Google Cloud (for hosting)</li>
                    </ul>
                    <p style={{ color: '#0f172a', lineHeight: 1.8, fontSize: '1.05rem', fontWeight: 600 }}>
                        We do NOT sell your personal data to third parties.
                    </p>
                </div>

                {/* Section 6 */}
                <div style={{
                    padding: '40px',
                    marginBottom: '24px',
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
                }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
                        6. Data Retention & Deletion
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy:
                    </p>
                    <ul style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', paddingLeft: '24px' }}>
                        <li><strong style={{ color: '#0f172a' }}>Account Data:</strong> Retained while your account is active, deleted within 30 days of account closure</li>
                        <li><strong style={{ color: '#0f172a' }}>Usage Logs:</strong> Retained for 12 months for service improvement</li>
                        <li><strong style={{ color: '#0f172a' }}>Billing Records:</strong> Retained for 7 years as required by tax regulations</li>
                        <li><strong style={{ color: '#0f172a' }}>Uploaded Documents:</strong> Deleted immediately after processing (Zero-Trace)</li>
                    </ul>
                </div>

                {/* Section 7 - User Rights */}
                <div style={{
                    padding: '40px',
                    marginBottom: '24px',
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
                }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
                        7. Your Rights (GDPR)
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        Under the GDPR and applicable data protection laws, you have the following rights:
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                        <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', padding: '20px', borderRadius: '16px' }}>
                            <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>🔍 Access</h4>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Request a copy of your data</p>
                        </div>
                        <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', padding: '20px', borderRadius: '16px' }}>
                            <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>✏️ Rectification</h4>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Correct inaccurate data</p>
                        </div>
                        <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', padding: '20px', borderRadius: '16px' }}>
                            <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>🗑️ Erasure</h4>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Request data deletion</p>
                        </div>
                        <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', padding: '20px', borderRadius: '16px' }}>
                            <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>📦 Portability</h4>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Export data in standard format</p>
                        </div>
                        <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', padding: '20px', borderRadius: '16px' }}>
                            <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>🚫 Object</h4>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Object to processing</p>
                        </div>
                        <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', padding: '20px', borderRadius: '16px' }}>
                            <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>⏸️ Restrict</h4>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Limit data processing</p>
                        </div>
                    </div>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginTop: '20px' }}>
                        To exercise these rights, email <strong style={{ color: '#0f172a' }}>support@tablesift.com</strong>. We will respond within 30 days.
                    </p>
                </div>

                {/* Remaining Sections */}
                <div style={{
                    padding: '40px',
                    marginBottom: '24px',
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
                }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
                        8. Data Security
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        We implement robust technical and organizational measures to protect your data:
                    </p>
                    <ul style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', paddingLeft: '24px' }}>
                        <li>TLS/SSL encryption for all data in transit</li>
                        <li>AES-256 encryption for data at rest</li>
                        <li>Role-based access controls for internal systems</li>
                        <li>Regular security audits and penetration testing</li>
                        <li>Employee training on data protection best practices</li>
                    </ul>
                </div>

                <div style={{
                    padding: '40px',
                    marginBottom: '24px',
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
                }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
                        9. Contact Information
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        For questions about this Privacy Policy, please contact us:
                    </p>
                    <p style={{ color: '#0f172a', lineHeight: 1.8, fontSize: '1.05rem', fontWeight: 600 }}>
                        Email: support@tablesift.com
                    </p>
                </div>

                {/* CTA */}
                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <p style={{ color: '#64748b', marginBottom: '24px' }}>Have questions about your privacy?</p>
                    <a href="mailto:support@tablesift.com" style={{
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
                        Contact Support
                    </a>
                </div>
            </main>

            <Footer />
        </div>
    );
}
