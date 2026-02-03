"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronDown, Rocket, Shield, Zap, Mail } from "lucide-react";

// --- COMPONENTS ---
import Header from "@/components/Header";
import HeroVisual from "@/components/HeroVisual";

// --- FIREBASE ---
import { auth, googleProvider, signInWithPopup } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

// --- DODO PAYMENT IDS ---
const STARTER_ID = "pdt_0NXYHBcPszGyHO9M2lt8P"; // $15 Plan
const PRO_ID = "pdt_0NXYHGpP9pSriiWduXPUE";     // $49 Plan

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Auth Listener
  useEffect(() => {
    if (!auth) {
      setTimeout(() => setAuthLoading(false), 0);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (redirectTo?: string) => {
    if (!auth || !googleProvider) return;
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result?.user && redirectTo) {
        router.push(redirectTo);
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const handleGetStarted = async () => {
    if (user) {
      router.push("/dashboard");
    } else {
      await handleLogin("/dashboard");
    }
  };

  const handleSubscribe = async (productId: string) => {
    if (!user) {
      await handleLogin();
      return;
    }
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/subscriptions/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          priceId: productId, // Using priceId as requested
          userId: user.uid
        })
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (err: any) {
      console.error("Subscription failed", err);
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', scrollBehavior: 'smooth' }}>

      {/* Floating Pill Navbar */}
      <header className="navbar-glass">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', fontFamily: 'Clash Display', letterSpacing: '-1px' }}>
            TableSift<span style={{ color: '#107c41' }}>.com</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: '32px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <Link href="#why-tablesift" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>Why TableSift?</Link>
          <Link href="#how-it-works" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>How it works</Link>
          <Link href="#pricing" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>Pricing</Link>
          <Link href="#faq" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>FAQ</Link>
        </nav>

        <div className="nav-buttons-group">
          {(user && !authLoading) ? (
            <button onClick={() => router.push('/dashboard')} className="btn-signin">Dashboard</button>
          ) : (
            <button onClick={() => handleLogin('/dashboard')} className="btn-signin">Sign In</button>
          )}
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section style={{
        paddingTop: '180px',
        paddingBottom: '80px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="max-w-container" style={{ paddingInline: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '80px', alignItems: 'center' }}>

            {/* Left Content */}
            <div style={{ textAlign: 'left' }}>
              <h1 className="hero-title" style={{ fontSize: '4.5rem', marginBottom: '24px' }}>
                Convert PDFs & Screenshots to Excel.<br />
                <span style={{ color: '#107c41' }}>AI that actually works.</span>
              </h1>

              <p className="hero-sub" style={{ marginBottom: '48px', fontSize: '1.25rem', maxWidth: '600px' }}>
                Stop fixing messy formatting. Upload any document, image, or table. Our AI extracts structured data in seconds.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <button onClick={handleGetStarted} className="btn-primary" style={{ height: '60px', padding: '0 40px' }}>
                    Get 30 Free Fuels <ArrowRight size={20} style={{ marginLeft: '12px' }} />
                  </button>
                </div>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginLeft: '4px' }}>
                  No Credit Card Required. 30 Free Fuels included.
                </span>
              </div>
            </div>

            {/* Right Side - Hero Visual */}
            <div className="animate-float" style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120%',
                height: '120%',
                background: 'radial-gradient(circle, rgba(16, 124, 65, 0.12) 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: -1
              }}></div>
              <HeroVisual />
            </div>

          </div>
        </div>
      </section>

      {/* --- SOCIAL PROOF --- */}
      <section style={{ padding: '60px 24px', backgroundColor: '#fff', borderTop: '1px solid #f1f5f9' }}>
        <div className="max-w-container" style={{ textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '40px' }}>
            Trusted by data teams automating their workflows at:
          </p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '60px',
            opacity: 0.6,
            filter: 'grayscale(100%)'
          }}>
            {/* Minimal SVG Logos */}
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>amazon</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Microsoft</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Goldman</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Deloitte.</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>SAMSUNG</div>
          </div>
        </div>
      </section>

      {/* --- WHY TABLESIFT? (PROBLEM/SOLUTION GRID) --- */}
      <section id="why-tablesift" style={{ padding: '140px 24px', backgroundColor: '#fcfcfc', borderTop: '1px solid #f1f5f9' }}>
        <div className="max-w-container">
          <h2 style={{ fontSize: '3rem', fontWeight: 900, textAlign: 'center', marginBottom: '80px', color: '#0f172a' }}>Why TableSift?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>

            <div className="glass-panel" style={{ padding: '48px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '24px' }}>⚡</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>Messy OCR Results</h3>
              <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6 }}>
                Standard tools fail on complex layouts. We specialize in Clean Data Extraction preserving headers and row alignment.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '48px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '24px' }}>📸</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>Screenshot to Spreadsheet</h3>
              <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6 }}>
                Don&apos;t retype data. Snap a picture of a financial report or invoice and convert Image to Excel AI instantly.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '48px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '24px' }}>📦</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>Bulk Processing</h3>
              <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6 }}>
                Need to parse 100 pages? Our PDF Parsing engine handles bulk uploads without crashing.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" style={{ padding: '140px 24px', backgroundColor: '#fff', borderTop: '1px solid #f1f5f9' }}>
        <div className="max-w-container">
          <h2 style={{ fontSize: '3rem', fontWeight: 900, textAlign: 'center', marginBottom: '80px', color: '#0f172a' }}>From Image to Excel in 3 Steps</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', position: 'relative' }}>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#107c41', fontSize: '1.5rem', fontWeight: 900, margin: '0 auto 32px' }}>1</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Upload your PDF or Image</h3>
              <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Supports scanned docs, photos, and high-res PDFs.</p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#107c41', fontSize: '1.5rem', fontWeight: 900, margin: '0 auto 32px' }}>2</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>AI Identifies Data</h3>
              <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Our vision models identify rows, columns, and headers automatically.</p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#107c41', fontSize: '1.5rem', fontWeight: 900, margin: '0 auto 32px' }}>3</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Download Results</h3>
              <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Download as perfectly formatted .XLSX or .CSV files.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Section follows */}

      {/* --- PRICING SECTION --- */}
      <section id="pricing" style={{ padding: '140px 0', backgroundColor: '#fcfcfc', borderTop: '1px solid #f1f5f9' }}>
        <div className="max-w-container" style={{ paddingInline: '24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '20px', color: '#0f172a' }}>Simple, per-page fuel packs.</h2>
          <p style={{ color: '#64748b', fontSize: '1.25rem', marginBottom: '80px' }}>No hidden fees. Cancel anytime.</p>

          <div className="pricing-grid" style={{
            display: 'grid',
            gap: '24px',
            maxWidth: '1400px',
            margin: '0 auto'
          }}>

            {/* Card 1: Free Tier */}
            <div className="glass-panel" style={{ padding: '56px 40px', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: '#107C41' }}>Free</h3>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '3rem', fontWeight: 900 }}>$0</span>
                <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, marginLeft: '4px' }}>/ one-time</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700, marginBottom: '24px' }}>30 Fuels (Lifetime)</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#107C41' }}></span>
                  Standard AI Processing
                </li>
                <li style={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#107C41' }}></span>
                  Export to Excel/CSV
                </li>
                <li style={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#107C41' }}></span>
                  24-Hour Secure Deletion
                </li>
              </ul>
              <button onClick={handleGetStarted} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid #e2e8f0', background: 'transparent', fontWeight: 800, cursor: 'pointer', marginTop: 'auto' }}>Start Free</button>
            </div>

            {/* Card 2: Starter (MOST POPULAR) */}
            <div className="glass-panel" style={{ padding: '56px 40px', textAlign: 'left', border: '2px solid #107C41', backgroundColor: '#fff', position: 'relative', display: 'flex', flexDirection: 'column' }}>
              <div className="badge-popular">Most Popular</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: '#107C41' }}>Starter</h3>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '3rem', fontWeight: 900 }}>$15</span>
                <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, marginLeft: '4px' }}>/ mo</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700, marginBottom: '24px' }}>150 Fuels / mo</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#107C41' }}></span>
                  Everything in Free
                </li>
                <li style={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#107C41' }}></span>
                  Priority Email Support
                </li>
                <li style={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#107C41' }}></span>
                  Cancel Anytime
                </li>
                <li style={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#107C41' }}></span>
                  Perfect for Freelancers
                </li>
              </ul>
              <button onClick={() => handleSubscribe(STARTER_ID)} className="btn-primary" style={{ width: '100%', padding: '16px', marginTop: 'auto' }}>Get Starter</button>
            </div>

            {/* Card 3: Pro */}
            <div className="glass-panel" style={{ padding: '56px 40px', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: '#107C41' }}>Pro</h3>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '3rem', fontWeight: 900 }}>$49</span>
                <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, marginLeft: '4px' }}>/ mo</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700, marginBottom: '24px' }}>500 Fuels / mo</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#107C41' }}></span>
                  Everything in Starter
                </li>
                <li style={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#107C41' }}></span>
                  Bulk File Uploads
                </li>
                <li style={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#107C41' }}></span>
                  High-Volume Workflow
                </li>
                <li style={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#107C41' }}></span>
                  Invoice Billing Available
                </li>
              </ul>
              <button onClick={() => handleSubscribe(PRO_ID)} style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#0f172a', color: '#fff', fontWeight: 800, cursor: 'pointer', border: 'none', marginTop: 'auto' }}>Get Pro</button>
            </div>

            {/* Card 4: Flexible */}
            <div className="glass-panel" style={{ padding: '56px 40px', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: '#107C41' }}>Custom</h3>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '3rem', fontWeight: 900 }}>Flexible</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700, marginBottom: '24px' }}>Custom Amount</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#107C41' }}></span>
                  Pay for exactly what you need
                </li>
                <li style={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#107C41' }}></span>
                  API Access & Enterprise vol.
                </li>
                <li style={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#107C41' }}></span>
                  Custom Retention Policies
                </li>
              </ul>
              <button style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#f8fafc', color: '#0f172a', fontWeight: 800, cursor: 'pointer', border: '1px solid #e2e8f0', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Mail size={18} /> Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" style={{ padding: '140px 24px', background: '#fff', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, textAlign: 'center', marginBottom: '60px' }}>Curiosities</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { q: "Does this work on Scanned PDFs?", a: "Yes. Our AI includes advanced OCR (Optical Character Recognition) that reads data from screenshots, photos, and scanned documents, not just digital PDFs." },
              { q: "Will it keep formatting?", a: "Absolutely. TableSift detects headers, merged cells, and column alignment to give you a clean Excel (.xlsx) file, so you don't have to reformat manually." },
              { q: "How secure is my data?", a: "Your privacy is our priority. Files are processed securely and automatically deleted from our servers after 24 hours." },
              { q: "Can I convert a photo of a table?", a: "Yes. Use our 'Image to Excel' feature. Just snap a photo of a financial report, invoice, or schedule, and we will convert it to a spreadsheet." },
              { q: "What is a 'Fuel'?", a: "One Fuel equals one page scan. If you upload a 5-page PDF, it costs 5 Fuels. This ensures you only pay for exactly what you use." }
            ].map((item, i) => (
              <details key={i} className="glass-panel" style={{ padding: '24px', cursor: 'pointer' }}>
                <summary style={{ fontWeight: 800, fontSize: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', listStyle: 'none', color: '#0f172a' }}>
                  {item.q}
                  <ChevronDown size={20} color="#107C41" />
                </summary>
                <p style={{ marginTop: '20px', color: '#64748b', fontSize: '1.1rem', lineHeight: 1.7 }}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer style={{ padding: '120px 24px 60px', backgroundColor: '#fff', borderTop: '1px solid #f1f5f9' }}>
        <div className="max-w-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '80px', marginBottom: '80px' }}>

            {/* Brand Col */}
            <div>
              <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '24px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Clash Display' }}>
                  TableSift<span style={{ color: '#107c41' }}>.com</span>
                </span>
              </Link>
              <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, marginBottom: '32px', maxWidth: '300px' }}>
                The world&apos;s most intelligent table extraction engine. Turn messy documents into clean Excel files in seconds.
              </p>
              <button onClick={handleGetStarted} className="btn-primary" style={{ padding: '12px 32px' }}>
                Get Started Free
              </button>
            </div>

            {/* Product Links */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '32px' }}>Product</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li><Link href="#why-tablesift" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>Why TableSift?</Link></li>
                <li><Link href="#how-it-works" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>How it Works</Link></li>
                <li><Link href="#pricing" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>Pricing</Link></li>
                <li><Link href="#faq" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>FAQ</Link></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '32px' }}>Legal</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li><Link href="/privacy" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link></li>
                <li><Link href="/terms" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>Terms of Service</Link></li>
                <li><a href="mailto:support@tablesift.com" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>Contact Support</a></li>
              </ul>
            </div>

          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '40px', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              © 2026 TableSift AI. All rights reserved. Built for data-driven teams.
            </p>
          </div>
        </div>
      </footer>
    </div >
  );
}
