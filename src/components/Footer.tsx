"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer style={{
            background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative blur */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '600px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(80px)',
                pointerEvents: 'none',
            }} />

            {/* Footer Content */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '80px 24px 60px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    gap: '60px'
                }}>
                    {/* Brand */}
                    <div>
                        <Link href="/" style={{
                            fontSize: '1.5rem',
                            fontWeight: 800,
                            color: 'white',
                            textDecoration: 'none',
                            letterSpacing: '-0.5px'
                        }}>
                            TableSift<span style={{ color: '#10b981' }}>.com</span>
                        </Link>
                        <p style={{
                            color: 'rgba(255,255,255,0.6)',
                            marginTop: '16px',
                            maxWidth: '300px',
                            lineHeight: 1.7,
                            fontSize: '0.95rem'
                        }}>
                            The world&apos;s most advanced AI-powered extraction tool for spreadsheet professionals.
                        </p>
                    </div>

                    {/* Links */}
                    <div style={{ display: 'flex', gap: '80px' }}>
                        <div>
                            <h4 style={{
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                color: 'rgba(255,255,255,0.4)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                marginBottom: '24px'
                            }}>Product</h4>
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '14px'
                            }}>
                                <li><Link href="/#why-tablesift" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', transition: 'color 0.2s' }}>Features</Link></li>
                                <li><Link href="/#pricing" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', transition: 'color 0.2s' }}>Pricing</Link></li>
                                <li><Link href="/#faq" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', transition: 'color 0.2s' }}>FAQ</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                color: 'rgba(255,255,255,0.4)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                marginBottom: '24px'
                            }}>Company</h4>
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '14px'
                            }}>
                                <li><Link href="/about" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', transition: 'color 0.2s' }}>About</Link></li>
                                <li><Link href="/blog" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', transition: 'color 0.2s' }}>Blog</Link></li>
                                <li><Link href="/privacy" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', transition: 'color 0.2s' }}>Privacy</Link></li>
                                <li><Link href="/terms" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', transition: 'color 0.2s' }}>Terms</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    marginTop: '60px',
                    paddingTop: '30px',
                    textAlign: 'center'
                }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                        © 2026 TableSift.com. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
