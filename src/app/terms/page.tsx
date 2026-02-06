"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
    return (
        <div style={{ minHeight: '100vh', background: '#ffffff' }}>
            <Header />

            {/* Main Content */}
            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 24px 80px' }}>
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
                        Terms of Service
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1rem' }}>
                        Effective Date: February 1, 2026 | Last Updated: February 7, 2026
                    </p>
                </div>

                {/* Introduction */}
                <div className="glass-panel" style={{ padding: '40px', marginBottom: '24px' }}>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem' }}>
                        Welcome to TableSift (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the TableSift platform, website, and services (collectively, the &ldquo;Service&rdquo;). By accessing or using our Service, you agree to be bound by these Terms and our Privacy Policy.
                    </p>
                </div>

                {/* Section 1 */}
                <div className="glass-panel" style={{ padding: '40px', marginBottom: '24px' }}>
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
                <div className="glass-panel" style={{ padding: '40px', marginBottom: '24px' }}>
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
                <div className="glass-panel" style={{ padding: '40px', marginBottom: '24px' }}>
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

                {/* Section 4 */}
                <div className="glass-panel" style={{ padding: '40px', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
                        4. Fair Use Policy
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        Our Service is designed for legitimate business and personal use. You agree NOT to:
                    </p>
                    <ul style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', paddingLeft: '24px', marginBottom: '16px' }}>
                        <li>Use automated scripts, bots, or scrapers to access the Service</li>
                        <li>Create multiple accounts to circumvent usage limits</li>
                        <li>Share account credentials with unauthorized parties</li>
                        <li>Process documents containing illegal or prohibited content</li>
                        <li>Attempt to reverse-engineer, decompile, or exploit our systems</li>
                        <li>Resell or redistribute the Service without authorization</li>
                    </ul>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem' }}>
                        Violation of this policy may result in <strong style={{ color: '#0f172a' }}>immediate account suspension or termination</strong> without refund.
                    </p>
                </div>

                {/* Section 5 */}
                <div className="glass-panel" style={{ padding: '40px', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
                        5. AI Accuracy Disclaimer
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        TableSift uses advanced artificial intelligence to extract and process data. While we strive for high accuracy (targeting 99.9% on standard documents), <strong style={{ color: '#0f172a' }}>AI is not infallible</strong>.
                    </p>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        The Service is a <strong style={{ color: '#0f172a' }}>productivity tool, not a substitute for professional verification</strong>. You are solely responsible for reviewing and validating all extracted data before use in critical applications, including but not limited to:
                    </p>
                    <ul style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', paddingLeft: '24px' }}>
                        <li>Financial reporting and auditing</li>
                        <li>Legal or regulatory filings</li>
                        <li>Medical or healthcare documentation</li>
                        <li>Any decision-making with material consequences</li>
                    </ul>
                </div>

                {/* Section 6 */}
                <div className="glass-panel" style={{ padding: '40px', marginBottom: '24px' }}>
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

                {/* Section 7 */}
                <div className="glass-panel" style={{ padding: '40px', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
                        7. Intellectual Property
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        <strong style={{ color: '#0f172a' }}>Our Property:</strong> The TableSift platform, including its software, algorithms, branding, and content, is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or create derivative works without our written permission.
                    </p>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem' }}>
                        <strong style={{ color: '#0f172a' }}>Your Content:</strong> You retain all rights to documents you upload. We do not claim ownership of your data. You grant us a limited license to process your documents solely to provide the Service.
                    </p>
                </div>

                {/* Section 8 */}
                <div className="glass-panel" style={{ padding: '40px', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
                        8. Limitation of Liability
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, TABLESIFT AND ITS AFFILIATES SHALL NOT BE LIABLE FOR:
                    </p>
                    <ul style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', paddingLeft: '24px', marginBottom: '16px' }}>
                        <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                        <li>Loss of profits, revenue, data, or business opportunities</li>
                        <li>Damages arising from AI processing errors or inaccuracies</li>
                        <li>Damages exceeding the amount paid by you in the 12 months preceding the claim</li>
                    </ul>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem' }}>
                        The Service is provided &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; without warranties of any kind.
                    </p>
                </div>

                {/* Section 9 */}
                <div className="glass-panel" style={{ padding: '40px', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
                        9. Termination
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        We may suspend or terminate your access to the Service immediately, without prior notice, if you violate these Terms or engage in any conduct that we determine, in our sole discretion, is harmful to other users or our business.
                    </p>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem' }}>
                        Upon termination, your right to use the Service will cease immediately. Sections regarding intellectual property, liability, and governing law will survive termination.
                    </p>
                </div>

                {/* Section 10 */}
                <div className="glass-panel" style={{ padding: '40px', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
                        10. Governing Law & Dispute Resolution
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '16px' }}>
                        These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                    </p>
                    <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '1.05rem' }}>
                        Any disputes arising from these Terms or the Service shall be resolved through binding arbitration in accordance with the Arbitration and Conciliation Act, 1996, conducted in Bangalore, India.
                    </p>
                </div>

                {/* Section 11 */}
                <div className="glass-panel" style={{ padding: '40px', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
                        11. Contact Information
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
                    <a href="mailto:support@tablesift.com" className="btn-primary" style={{
                        display: 'inline-block',
                        padding: '16px 36px',
                        textDecoration: 'none',
                    }}>
                        Contact Support
                    </a>
                </div>
            </main>

            <Footer />
        </div>
    );
}
