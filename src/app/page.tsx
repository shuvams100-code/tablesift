"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { auth, db, googleProvider, signInWithPopup, signOut } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen for Auth changes
  useEffect(() => {
    if (!auth) return; // Skip if Firebase not initialized (build time)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    if (!auth || !googleProvider) return;
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      console.error("Sign in error:", err);
      setError("Failed to sign in. Please try again.");
    }
  };

  const handleSignOut = () => {
    if (auth) signOut(auth);
  };

  const handleFile = async (file: File) => {
    if (!user) {
      handleSignIn();
      return;
    }

    if (!db) {
      setError("Service unavailable. Please refresh the page.");
      return;
    }

    setIsUploading(true);
    setError(null);

    // 1. Check Limits
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const userRef = doc(db!, "users", user.uid);

    try {
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.lastUsageDate === today && userData.usageCount >= 1) {
          throw new Error("Daily limit reached (1/1). Upgrade to Pro for more scans.");
        }
      }

      // 2. Perform Extraction
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to extract table");
      }

      // 3. Update Usage (Only if successful)
      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.lastUsageDate === today) {
          await updateDoc(userRef, { usageCount: increment(1) });
        } else {
          await updateDoc(userRef, { usageCount: 1, lastUsageDate: today });
        }
      } else {
        await setDoc(userRef, { usageCount: 1, lastUsageDate: today, email: user.email });
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tablesift-${new Date().getTime()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="container">
      <header className={`nav-header ${scrolled ? 'scrolled' : ''}`}>
        <Link href="/" className="logo">TableSift<span>.com</span></Link>
        <nav style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
          <Link href="#features" style={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748b', textDecoration: 'none' }}>Features</Link>
          <Link href="#pricing" style={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748b', textDecoration: 'none' }}>Pricing</Link>
          <Link href="#faq" style={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748b', textDecoration: 'none' }}>FAQ</Link>

          {user ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user.displayName}</div>
                <button onClick={handleSignOut} style={{ fontSize: '0.75rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Sign Out</button>
              </div>
              <img src={user.photoURL || ""} alt="User" style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid var(--accent)' }} />
            </div>
          ) : (
            <button onClick={handleSignIn} className="glow-btn">Sign In</button>
          )}
        </nav>
      </header>

      {/* SaaS Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      {/* 2-Column Hero Section */}
      <section className="hero-split">
        {/* Left Column: Text */}
        <div className="hero-text">
          <div className="badge">AI-Powered Data Extraction ✨</div>
          <h1 className="gradient-text" style={{ fontSize: '3.5rem', textAlign: 'left', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Turn Messy Screenshots<br />into Perfect Excel Sheets.
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#64748b', lineHeight: 1.7, marginBottom: '2.5rem', textAlign: 'left' }}>
            Stop wasting hours on manual data entry. Our elite AI Vision instantly extracts data from any screenshot or PDF into structured, ready-to-use tables.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => { if (!user) handleSignIn(); else fileInputRef.current?.click(); }} className="glow-btn" style={{ fontSize: '1rem', padding: '16px 32px' }}>
              {!user ? 'Get Started Free' : 'Upload Screenshot'}
            </button>
            <Link href="#features" style={{ padding: '16px 24px', border: '1px solid #e2e8f0', borderRadius: '12px', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white' }}>
              See How It Works →
            </Link>
          </div>

          {/* Trust Row */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 700 }}>JD</div>
                <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', borderRadius: '50%', border: '2px solid white', marginLeft: '-8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 700 }}>SK</div>
                <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #a855f7, #9333ea)', borderRadius: '50%', border: '2px solid white', marginLeft: '-8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 700 }}>AM</div>
              </div>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>10,000+ users</span>
            </div>
            <div style={{ height: '20px', width: '1px', background: '#e2e8f0' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#facc15', fontSize: '0.9rem' }}>★★★★★</span>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>4.9/5</span>
            </div>
          </div>
        </div>

        {/* Right Column: App Window */}
        <div className="app-window" style={{ marginBottom: 0, transform: 'perspective(1000px) rotateY(-5deg)', transition: 'transform 0.3s ease' }} onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
          <div className="window-header">
            <div className="dot red"></div>
            <div className="dot yellow"></div>
            <div className="dot green"></div>
            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, background: '#f1f5f9', padding: '4px 12px', borderRadius: '6px' }}>tablesift.com</span>
          </div>
          <div
            className={`dropzone-content ${isUploading ? 'processing' : ''}`}
            onClick={() => {
              if (!user) handleSignIn();
              else fileInputRef.current?.click();
            }}
            style={{ padding: '3rem 2rem' }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              style={{ display: 'none' }}
              accept="image/*,.pdf"
            />
            <div style={{ fontSize: '4rem' }}>{!user ? '🔒' : isUploading ? '⏳' : '📤'}</div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem', color: '#1e293b' }}>
                {!user ? 'Sign in to Unlock' : isUploading ? 'Extracting Data...' : 'Drop Your Screenshot'}
              </p>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>PNG, JPG, PDF up to 10MB</p>
            </div>

            {error && (
              <p style={{ color: '#dc2626', fontWeight: 600, background: '#fef2f2', padding: '10px 16px', borderRadius: '8px' }}>❌ {error}</p>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ background: '#f0fdf4', color: '#166534', padding: '8px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%' }}></span>
                {!user ? '2 free/day' : '2 left'}
              </div>
              <div style={{ background: '#f8fafc', color: '#475569', padding: '8px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, border: '1px solid #e2e8f0' }}>
                🔒 Zero retention
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Bento Grid Features */}
      <section id="features" style={{ width: '100%', maxWidth: '1200px', marginTop: '5rem', scrollMarginTop: '100px', padding: '0 2rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '4rem', letterSpacing: '-1px', color: '#0f172a' }}>
          Why Professionals Choose TableSift
        </h2>

        {/* Bento Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'auto auto', gap: '1.5rem' }}>

          {/* Card 1: Large - Accuracy with Mini Table Mockup */}
          <div className="card-premium" style={{ gridColumn: 'span 2', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <span style={{ background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>99.9% Accuracy</span>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>Surgical Precision Extraction</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6, maxWidth: '500px' }}>Our AI understands cell relationships, merged headers, and complex data types.</p>

            {/* Mini Table Mockup */}
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0', marginTop: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
                <div style={{ background: '#e2e8f0', padding: '8px', borderRadius: '4px', color: '#0f172a' }}>Product</div>
                <div style={{ background: '#e2e8f0', padding: '8px', borderRadius: '4px', color: '#0f172a' }}>Q1 Sales</div>
                <div style={{ background: '#e2e8f0', padding: '8px', borderRadius: '4px', color: '#0f172a' }}>Q2 Sales</div>
                <div style={{ background: '#e2e8f0', padding: '8px', borderRadius: '4px', color: '#0f172a' }}>Growth</div>

                <div style={{ background: 'white', padding: '8px', borderRadius: '4px', color: '#475569' }}>Widget A</div>
                <div style={{ background: 'white', padding: '8px', borderRadius: '4px', color: '#475569' }}>$12,450</div>
                <div style={{ background: 'white', padding: '8px', borderRadius: '4px', color: '#475569' }}>$18,320</div>
                <div style={{ background: '#dcfce7', padding: '8px', borderRadius: '4px', color: '#166534', fontWeight: 700 }}>+47%</div>

                <div style={{ background: 'white', padding: '8px', borderRadius: '4px', color: '#475569' }}>Gadget B</div>
                <div style={{ background: 'white', padding: '8px', borderRadius: '4px', color: '#475569' }}>$8,200</div>
                <div style={{ background: 'white', padding: '8px', borderRadius: '4px', color: '#475569' }}>$9,100</div>
                <div style={{ background: '#dcfce7', padding: '8px', borderRadius: '4px', color: '#166534', fontWeight: 700 }}>+11%</div>
              </div>
            </div>
          </div>

          {/* Card 2: Small - Speed Stat */}
          <div className="card-premium" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white' }}>
            <span style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', width: 'fit-content' }}>Speed</span>
            <div>
              <div style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1 }}>3s</div>
              <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Average extraction time</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
              <div style={{ height: '4px', flex: 1, background: '#22c55e', borderRadius: '2px' }}></div>
              <div style={{ height: '4px', flex: 0.8, background: '#22c55e', borderRadius: '2px', opacity: 0.7 }}></div>
              <div style={{ height: '4px', flex: 0.5, background: '#22c55e', borderRadius: '2px', opacity: 0.4 }}></div>
            </div>
          </div>

          {/* Card 3: Small - Security */}
          <div className="card-premium" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', background: '#fef3c7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🔐</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Zero Data Retention</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.95rem' }}>Files are processed in volatile memory and purged immediately. Your data never touches our servers.</p>
          </div>

          {/* Card 4: Small - Formats */}
          <div className="card-premium" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ background: '#dbeafe', color: '#1e40af', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>PNG</div>
              <div style={{ background: '#fce7f3', color: '#9d174d', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>PDF</div>
              <div style={{ background: '#dcfce7', color: '#166534', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>JPG</div>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>All Formats Supported</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.95rem' }}>Screenshots, scanned documents, or exported PDFs — we handle them all.</p>
          </div>

          {/* Card 5: Large - Output Preview */}
          <div className="card-premium" style={{ gridColumn: 'span 2', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <span style={{ background: '#dbeafe', color: '#1e40af', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Output</span>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>Clean, Ready-to-Use CSV</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6, maxWidth: '500px' }}>Download perfectly formatted spreadsheets that open flawlessly in Excel, Google Sheets, or any data tool.</p>

            {/* CSV Preview Mockup */}
            <div style={{ background: '#0f172a', borderRadius: '12px', padding: '1.25rem', fontFamily: 'monospace', fontSize: '0.8rem', color: '#94a3b8', marginTop: 'auto' }}>
              <div style={{ color: '#64748b', marginBottom: '0.5rem' }}>// output.csv</div>
              <div><span style={{ color: '#22c55e' }}>Product</span>,<span style={{ color: '#22c55e' }}>Q1_Sales</span>,<span style={{ color: '#22c55e' }}>Q2_Sales</span>,<span style={{ color: '#22c55e' }}>Growth</span></div>
              <div><span style={{ color: '#f8fafc' }}>Widget A</span>,<span style={{ color: '#f8fafc' }}>12450</span>,<span style={{ color: '#f8fafc' }}>18320</span>,<span style={{ color: '#22c55e' }}>0.47</span></div>
              <div><span style={{ color: '#f8fafc' }}>Gadget B</span>,<span style={{ color: '#f8fafc' }}>8200</span>,<span style={{ color: '#f8fafc' }}>9100</span>,<span style={{ color: '#22c55e' }}>0.11</span></div>
            </div>
          </div>

        </div>
      </section>

      {/* Premium FAQ Section */}
      <section id="faq" style={{ width: '100%', maxWidth: '1000px', marginTop: '10rem', scrollMarginTop: '100px', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ background: '#dbeafe', color: '#1e40af', padding: '6px 14px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>FAQ</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1.5rem', letterSpacing: '-1px', color: '#0f172a' }}>Common Questions</h2>
          <p style={{ color: '#64748b', marginTop: '1rem', fontSize: '1.1rem' }}>Everything you need to know about TableSift</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          <div className="card-premium" style={{ padding: '2rem', display: 'flex', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', background: '#f0fdf4', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#166534', fontWeight: 700, fontSize: '1rem' }}>01</span>
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>How accurate is the extraction?</h4>
              <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.95rem' }}>99.9% accuracy. Our AI handles merged cells, headers, and complex formatting.</p>
            </div>
          </div>

          <div className="card-premium" style={{ padding: '2rem', display: 'flex', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', background: '#fef3c7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#92400e', fontWeight: 700, fontSize: '1rem' }}>02</span>
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>Is my data safe?</h4>
              <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.95rem' }}>Yes. Files are processed in volatile memory and permanently deleted instantly. Zero retention.</p>
            </div>
          </div>

          <div className="card-premium" style={{ padding: '2rem', display: 'flex', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', background: '#dbeafe', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#1e40af', fontWeight: 700, fontSize: '1rem' }}>03</span>
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>What formats are supported?</h4>
              <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.95rem' }}>PNG, JPG, and PDF. Screenshots, scanned docs, or exported files all work.</p>
            </div>
          </div>

          <div className="card-premium" style={{ padding: '2rem', display: 'flex', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', background: '#fce7f3', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#9d174d', fontWeight: 700, fontSize: '1rem' }}>04</span>
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>Is there a free tier?</h4>
              <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.95rem' }}>Yes! You get 2 free extractions per day. No credit card required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ width: '100%', maxWidth: '1100px', marginTop: '10rem', scrollMarginTop: '100px', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ background: '#f0fdf4', color: '#166534', padding: '6px 14px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Pricing</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1.5rem', letterSpacing: '-1px', color: '#0f172a' }}>Simple, Transparent Pricing</h2>
          <p style={{ color: '#64748b', marginTop: '1rem', fontSize: '1.1rem' }}>No hidden fees. Cancel anytime.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>

          {/* Free Plan */}
          <div className="card-premium" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Free</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>Try it out</p>
            </div>
            <div>
              <span style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a' }}>$0</span>
              <span style={{ color: '#64748b', fontSize: '0.9rem' }}>/month</span>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.95rem' }}>
                <span style={{ color: '#22c55e' }}>✓</span> 1 scan per day
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.95rem' }}>
                <span style={{ color: '#22c55e' }}>✓</span> CSV download
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.95rem' }}>
                <span style={{ color: '#22c55e' }}>✓</span> Zero data retention
              </li>
            </ul>
            <button onClick={() => { if (!user) handleSignIn(); }} style={{ marginTop: 'auto', padding: '14px 24px', border: '1px solid #e2e8f0', borderRadius: '12px', fontWeight: 600, color: '#475569', background: 'white', cursor: 'pointer' }}>
              {!user ? 'Get Started' : 'Current Plan'}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="card-premium" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '2px solid #22c55e', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#22c55e', color: 'white', padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>POPULAR</div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Pro</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>For regular users</p>
            </div>
            <div>
              <span style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a' }}>$9</span>
              <span style={{ color: '#64748b', fontSize: '0.9rem' }}>/month</span>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.95rem' }}>
                <span style={{ color: '#22c55e' }}>✓</span> 100 scans per month
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.95rem' }}>
                <span style={{ color: '#22c55e' }}>✓</span> CSV download
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.95rem' }}>
                <span style={{ color: '#22c55e' }}>✓</span> Zero data retention
              </li>
            </ul>
            <button className="glow-btn" style={{ marginTop: 'auto', padding: '14px 24px' }}>
              Upgrade to Pro
            </button>
          </div>

          {/* Unlimited Plan */}
          <div className="card-premium" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#0f172a', color: 'white' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>Unlimited</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>For power users</p>
            </div>
            <div>
              <span style={{ fontSize: '3rem', fontWeight: 900, color: 'white' }}>$29</span>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>/month</span>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e2e8f0', fontSize: '0.95rem' }}>
                <span style={{ color: '#22c55e' }}>✓</span> Unlimited scans
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e2e8f0', fontSize: '0.95rem' }}>
                <span style={{ color: '#22c55e' }}>✓</span> CSV download
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e2e8f0', fontSize: '0.95rem' }}>
                <span style={{ color: '#22c55e' }}>✓</span> Zero data retention
              </li>
            </ul>
            <button style={{ marginTop: 'auto', padding: '14px 24px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontWeight: 600, color: 'white', background: 'transparent', cursor: 'pointer' }}>
              Go Unlimited
            </button>
          </div>

        </div>
      </section>

      {/* Premium Footer */}
      <footer style={{ width: '100%', marginTop: '10rem', background: '#0f172a', color: 'white', padding: '0 2rem' }}>
        {/* CTA Banner */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Ready to save hours?</h3>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Start extracting tables in seconds. No credit card required.</p>
            </div>
            <button onClick={() => { if (!user) handleSignIn(); else fileInputRef.current?.click(); }} className="glow-btn" style={{ fontSize: '1rem', padding: '16px 32px' }}>
              {!user ? 'Get Started Free' : 'Upload Now'}
            </button>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 0', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4rem' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>TableSift<span style={{ color: '#22c55e' }}>.com</span></div>
            <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              The world&apos;s most advanced AI-powered extraction tool for spreadsheet professionals.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>🔒 SOC 2</div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>🌍 GDPR</div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', color: '#94a3b8' }}>Product</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li><Link href="#features" style={{ color: '#e2e8f0', fontSize: '0.95rem', textDecoration: 'none' }}>Features</Link></li>
              <li><Link href="#faq" style={{ color: '#e2e8f0', fontSize: '0.95rem', textDecoration: 'none' }}>FAQ</Link></li>
              <li><Link href="/pricing" style={{ color: '#e2e8f0', fontSize: '0.95rem', textDecoration: 'none' }}>Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', color: '#94a3b8' }}>Legal</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li><Link href="/terms" style={{ color: '#e2e8f0', fontSize: '0.95rem', textDecoration: 'none' }}>Terms of Service</Link></li>
              <li><Link href="/privacy" style={{ color: '#e2e8f0', fontSize: '0.95rem', textDecoration: 'none' }}>Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', color: '#94a3b8' }}>Support</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li><a href="mailto:support@tablesift.com" style={{ color: '#e2e8f0', fontSize: '0.95rem', textDecoration: 'none' }}>Email Support</a></li>
              <li><Link href="/docs" style={{ color: '#e2e8f0', fontSize: '0.95rem', textDecoration: 'none' }}>API Docs</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 0', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>© 2026 TableSift AI. All rights reserved.</div>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Built with precision. 🎯</div>
        </div>
      </footer>
    </div>
  );
}
