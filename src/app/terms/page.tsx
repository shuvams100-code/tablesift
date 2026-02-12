"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
            <head>
                <link rel="canonical" href="https://tablesift.com/terms" />
                <title>Terms of Service | TableSift</title>
            </head>
            <Header />

            {/* Main Content */}
            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px 80px' }}>
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
                        Legal
                    </span>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        fontWeight: 900,
                        color: '#0f172a',
                        marginTop: '24px',
                        marginBottom: '16px',
                        letterSpacing: '-1px',
                    }}>
                        Terms of Service
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
                        Welcome to TableSift (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the TableSift platform, website, and services (collectively, the &ldquo;Service&rdquo;). By accessing or using our Service, you agree to be bound by these Terms and our Privacy Policy.
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
                        1. Acceptance of Terms
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        By creating an account or using any part of our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use the Service.
                    </p>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem' }}>
                        We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our website and updating the &ldquo;Last Updated&rdquo; date. Your continued use of the Service after such changes constitutes acceptance of the new Terms.
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
                        2. Description of Service
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        TableSift provides an AI-powered document conversion platform that extracts tabular data from PDF files, images, and scanned documents into editable spreadsheet formats (Excel, CSV). The Service includes:
                    </p>
                    <ul style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', paddingLeft: '24px', marginBottom: '16px' }}>
                        <li>Document upload and processing via our web application</li>
                        <li>AI-driven table detection and data extraction</li>
                        <li>Conversion output in Excel (.xlsx) and CSV formats</li>
                        <li>User account management and credit tracking</li>
                        <li>API access for enterprise customers (where applicable)</li>
                    </ul>
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
                        3. User Accounts & Eligibility
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        <strong style={{ color: '#0f172a' }}>Eligibility:</strong> You must be at least 18 years old or the age of majority in your jurisdiction to use our Service. By using our Service, you represent and warrant that you meet this requirement.
                    </p>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        <strong style={{ color: '#0f172a' }}>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately if you suspect unauthorized access.
                    </p>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem' }}>
                        <strong style={{ color: '#0f172a' }}>Accurate Information:</strong> You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.
                    </p>
                </div>

                {/* Section 4 - Fair Use - Dark Section */}
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
                        background: 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(40px)',
                        pointerEvents: 'none',
                    }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>
                            4. Fair Use Policy
                        </h2>
                        <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '16px', opacity: 0.95 }}>
                            Our Service is designed for legitimate business and personal use. You agree <strong>NOT</strong> to:
                        </p>
                        <ul style={{ lineHeight: 1.8, fontSize: '1.05rem', paddingLeft: '24px', opacity: 0.9 }}>
                            <li>Use automated scripts, bots, or scrapers to access the Service</li>
                            <li>Create multiple accounts to circumvent usage limits</li>
                            <li>Share account credentials with unauthorized parties</li>
                            <li>Process documents containing illegal or prohibited content</li>
                            <li>Attempt to reverse-engineer, decompile, or exploit our systems</li>
                            <li>Resell or redistribute the Service without authorization</li>
                        </ul>
                        <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginTop: '16px', opacity: 0.95 }}>
                            Violation of this policy may result in <strong>immediate account suspension or termination</strong> without refund.
                        </p>
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
                        5. AI Accuracy Disclaimer
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        TableSift uses advanced artificial intelligence to extract and process data. While we strive for high accuracy (targeting 99.9% on standard documents), <strong style={{ color: '#0f172a' }}>AI is not infallible</strong>.
                    </p>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        The Service is a <strong style={{ color: '#0f172a' }}>productivity tool, not a substitute for professional verification</strong>. You are solely responsible for reviewing and validating all extracted data before use in critical applications.
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
                        6. Payment, Billing & Refunds
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        <strong style={{ color: '#0f172a' }}>Pricing:</strong> Paid plans are billed on a monthly or annual basis as specified at purchase. Prices are subject to change with 30 days&apos; notice.
                    </p>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        <strong style={{ color: '#0f172a' }}>Credits:</strong> Conversion credits are included with your subscription plan. Unused credits do not roll over to the next billing period unless specified otherwise.
                    </p>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        <strong style={{ color: '#0f172a' }}>Cancellation:</strong> You may cancel your subscription at any time. Access continues until the end of your current billing period.
                    </p>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem' }}>
                        <strong style={{ color: '#0f172a' }}>Refunds:</strong> Refunds are provided on a case-by-case basis for unused credits. Contact support within 14 days of purchase for refund requests.
                    </p>
                </div>

                {/* Section 7-11 */}
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
                        7. Intellectual Property
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        <strong style={{ color: '#0f172a' }}>Our Property:</strong> The TableSift platform, including its software, algorithms, branding, and content, is protected by copyright, trademark, and other intellectual property laws.
                    </p>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem' }}>
                        <strong style={{ color: '#0f172a' }}>Your Content:</strong> You retain all rights to documents you upload. We do not claim ownership of your data. You grant us a limited license to process your documents solely to provide the Service.
                    </p>
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
                        8. Contact Information
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        For questions about these Terms, please contact us:
                    </p>
                    <p style={{ color: '#0f172a', lineHeight: 1.8, fontSize: '1.05rem', fontWeight: 600 }}>
                        Email: support@tablesift.com
                    </p>
                </div>

                {/* CTA */}
                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <p style={{ color: '#64748b', marginBottom: '24px' }}>Have questions about our terms?</p>
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
