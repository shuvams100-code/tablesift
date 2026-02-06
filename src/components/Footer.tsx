"use client";

import Link from "next/link";

export default function Footer() {
    return (
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
                            <li><Link href="/blog" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>Blog</Link></li>
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
    );
}
