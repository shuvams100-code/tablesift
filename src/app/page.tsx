"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronDown, Rocket, Shield, Zap, Mail } from "lucide-react";

// --- COMPONENTS ---
import Header from "@/components/Header";
import HeroVisual from "@/components/HeroVisual";
import { AnimatedSection, AnimatedGrid } from "@/components/AnimatedSection";

// --- FIREBASE ---
import { auth, googleProvider, signInWithPopup } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

// --- DODO PAYMENT IDS ---
const STARTER_ID = "pdt_0NXYHBcPszGyHO9M2lt8P"; // $12 Starter Plan - UPDATE WHEN READY
const PRO_ID = "pdt_0NXYHGpP9pSriiWduXPUE";     // $49 Pro Plan - UPDATE WHEN READY
const BUSINESS_ID = "PLACEHOLDER_BUSINESS_ID"; // $199 Business Plan - REPLACE WITH DODO ID

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [userCount, setUserCount] = useState(0);

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

  // Animated user counter
  useEffect(() => {
    const target = 8247;
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setUserCount(target);
        clearInterval(timer);
      } else {
        setUserCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Save to Firestore via API
      const res = await fetch('/api/leads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: contactForm.firstName,
          lastName: contactForm.lastName,
          email: contactForm.email,
          phone: contactForm.phone,
          message: contactForm.message,
          source: 'flexible_pricing',
          createdAt: new Date().toISOString()
        })
      });
      if (res.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setShowContactModal(false);
          setSubmitSuccess(false);
          setContactForm({ firstName: '', lastName: '', email: '', phone: '', message: '' });
        }, 2500);
      }
    } catch (err) {
      console.error("Contact form failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', scrollBehavior: 'smooth' }}>

      {/* Floating Pill Navbar */}
      <header className="navbar-glass">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
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
              <h1 className="hero-title" style={{ marginBottom: '24px' }}>
                Convert PDFs & Screenshots to Excel.<br />
                <span style={{ color: '#107c41' }}>AI that actually works.</span>
              </h1>

              <p className="hero-sub" style={{ marginBottom: '48px', fontSize: '1.25rem', maxWidth: '600px' }}>
                Stop fixing messy formatting. Upload any document, image, or table. Our AI extracts structured data in seconds.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <button onClick={handleGetStarted} className="btn-primary" style={{ height: '60px', padding: '0 40px' }}>
                    Get 10 Free Fuels <ArrowRight size={20} style={{ marginLeft: '12px' }} />
                  </button>
                </div>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginLeft: '4px' }}>
                  No Credit Card Required. 10 Free Fuels included.
                </span>

                {/* Social Proof Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '24px', flexWrap: 'wrap' }}>
                  {/* Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} width="18" height="18" viewBox="0 0 24 24" fill={star <= 4 ? '#FBBF24' : 'none'} stroke={star === 5 ? '#FBBF24' : 'none'}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={star === 5 ? '#FBBF24' : undefined} style={{ opacity: star === 5 ? 0.9 : 1 }} />
                        </svg>
                      ))}
                    </div>
                    <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>4.8</span>
                    <span style={{ color: '#64748b', fontSize: '0.85rem' }}>rating</span>
                  </div>

                  {/* Divider */}
                  <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }}></div>

                  {/* User Count */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>{userCount.toLocaleString()}+</span>
                    <span style={{ color: '#64748b', fontSize: '0.85rem' }}>documents processed</span>
                  </div>
                </div>
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

      {/* --- TESTIMONIALS MARQUEE --- */}
      <section style={{ padding: '60px 0', backgroundColor: '#fff', borderTop: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <p style={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '32px', textAlign: 'center' }}>
          What users are saying
        </p>
        {/* Center spotlight gradient overlay */}
        <div style={{ position: 'relative', width: '100%' }}>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '120px',
            background: 'linear-gradient(to right, #fff 0%, transparent 100%)',
            zIndex: 10,
            pointerEvents: 'none'
          }}></div>
          <div style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '120px',
            background: 'linear-gradient(to left, #fff 0%, transparent 100%)',
            zIndex: 10,
            pointerEvents: 'none'
          }}></div>
          <div className="testimonial-marquee" style={{
            display: 'flex',
            gap: '24px',
            animation: 'scrollMarquee 50s linear infinite',
            width: 'max-content',
            paddingLeft: '24px'
          }}>
            {/* Duplicate testimonials for seamless loop */}
            {[...Array(2)].map((_, setIndex) => (
              [
                { name: "Priya S.", role: "Financial Analyst", text: "Saved me 3 hours this week alone. The accuracy on scanned invoices is incredible.", avatar: "PS" },
                { name: "James K.", role: "Freelance Consultant", text: "Finally, a tool that actually works on messy PDFs. Worth every penny.", avatar: "JK" },
                { name: "Sarah M.", role: "Data Entry Lead", text: "We process 200+ documents daily. TableSift cut our time by 70%.", avatar: "SM" },
                { name: "Rahul D.", role: "CA Firm Partner", text: "Game changer for tax season. Extracts bank statements perfectly.", avatar: "RD" },
                { name: "Emily T.", role: "Operations Manager", text: "Simple, fast, and no learning curve. My team adopted it in minutes.", avatar: "ET" },
                { name: "Mike L.", role: "Startup Founder", text: "Screenshot to Excel in seconds. This is the future.", avatar: "ML" },
              ].map((t, i) => (
                <div key={`${setIndex}-${i}`} className="testimonial-card" style={{
                  minWidth: '320px',
                  background: '#f8fafc',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #e2e8f0',
                  flexShrink: 0,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '16px', fontStyle: 'italic' }}>
                    &quot;{t.text}&quot;
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #107c41 0%, #22c55e 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.85rem',
                      fontWeight: 700
                    }}>{t.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{t.name}</div>
                      <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))
            ))}
          </div>
        </div>
      </section>

      {/* --- WHY TABLESIFT? (PROBLEM/SOLUTION GRID) --- */}
      <section id="why-tablesift" className="section-gradient-1 section-glow" style={{ padding: '140px 24px', borderTop: '1px solid #f1f5f9' }}>
        <div className="max-w-container">
          <AnimatedSection animation="fade-up">
            <h2 style={{ fontSize: '3rem', fontWeight: 900, textAlign: 'center', marginBottom: '80px', color: '#0f172a' }}>Why TableSift?</h2>
          </AnimatedSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="glass-panel" style={{ padding: '48px' }}>
                <div className="icon-animate" style={{ fontSize: '2rem', marginBottom: '24px' }}>⚡</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>Messy OCR Results</h3>
                <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6 }}>
                  Standard tools fail on complex layouts. We specialize in Clean Data Extraction preserving headers and row alignment.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <div className="glass-panel" style={{ padding: '48px' }}>
                <div className="icon-animate" style={{ fontSize: '2rem', marginBottom: '24px' }}>📸</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>Screenshot to Spreadsheet</h3>
                <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6 }}>
                  Don&apos;t retype data. Snap a picture of a financial report or invoice and convert Image to Excel AI instantly.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={300}>
              <div className="glass-panel" style={{ padding: '48px' }}>
                <div className="icon-animate" style={{ fontSize: '2rem', marginBottom: '24px' }}>📦</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>Bulk Processing</h3>
                <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6 }}>
                  Need to parse 100 pages? Our PDF Parsing engine handles bulk uploads without crashing.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="section-gradient-2" style={{ padding: '140px 24px', borderTop: '1px solid #f1f5f9' }}>
        <div className="max-w-container">
          <AnimatedSection animation="fade-up">
            <h2 style={{ fontSize: '3rem', fontWeight: 900, textAlign: 'center', marginBottom: '80px', color: '#0f172a' }}>From Image to Excel in 3 Steps</h2>
          </AnimatedSection>

          <div className="steps-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', position: 'relative' }}>

            <AnimatedSection animation="fade-up" delay={100}>
              <div style={{ textAlign: 'center' }}>
                <div className="step-number" style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#107c41', fontSize: '1.5rem', fontWeight: 900, margin: '0 auto 32px' }}>1</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Upload your PDF or Image</h3>
                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Supports scanned docs, photos, and high-res PDFs.</p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <div style={{ textAlign: 'center' }}>
                <div className="step-number" style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#107c41', fontSize: '1.5rem', fontWeight: 900, margin: '0 auto 32px' }}>2</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>AI Identifies Data</h3>
                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Our vision models identify rows, columns, and headers automatically.</p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={300}>
              <div style={{ textAlign: 'center' }}>
                <div className="step-number" style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#107c41', fontSize: '1.5rem', fontWeight: 900, margin: '0 auto 32px' }}>3</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Download Results</h3>
                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Download as perfectly formatted .XLSX or .CSV files.</p>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* --- BUILT FOR PROFESSIONALS --- */}
      <section id="built-for" className="section-gradient-1 section-glow" style={{ padding: '120px 24px', borderTop: '1px solid #f1f5f9' }}>
        <div className="max-w-container">
          <AnimatedSection animation="fade-up">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
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
                Built for Workflow
              </span>
              <h2 style={{ fontSize: '2.75rem', fontWeight: 900, marginTop: '24px', marginBottom: '16px', color: '#0f172a' }}>
                Who Uses TableSift?
              </h2>
              <p style={{ color: '#64748b', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto' }}>
                Trusted by professionals who deal with documents daily. It&apos;s not a trend—it&apos;s a workflow essential.
              </p>
            </div>
          </AnimatedSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>

            {/* Accounting Firms */}
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="glass-panel" style={{ padding: '32px', textAlign: 'left' }}>
                <div className="icon-animate" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🧾</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', color: '#0f172a' }}>Accounting Firms</h3>
                <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.7, marginBottom: '16px' }}>
                  Convert bank statements, GST invoices, and ledger exports to Excel. No more manual data entry during tax season.
                </p>
                <span style={{ fontSize: '0.85rem', color: '#107c41', fontWeight: 700 }}>Bank Statements • GST Returns • Tally Exports</span>
              </div>
            </AnimatedSection>

            {/* Audit Firms */}
            <AnimatedSection animation="fade-up" delay={150}>
              <div className="glass-panel" style={{ padding: '32px', textAlign: 'left' }}>
                <div className="icon-animate" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🔍</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', color: '#0f172a' }}>Audit Firms</h3>
                <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.7, marginBottom: '16px' }}>
                  Extract financial tables from compliance documents. Verify entries against ledgers in minutes, not hours.
                </p>
                <span style={{ fontSize: '0.85rem', color: '#107c41', fontWeight: 700 }}>Compliance Docs • Verification Tables • ITR Data</span>
              </div>
            </AnimatedSection>

            {/* Logistics & Operations */}
            <AnimatedSection animation="fade-up" delay={200}>
              <div className="glass-panel" style={{ padding: '32px', textAlign: 'left' }}>
                <div className="icon-animate" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📦</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', color: '#0f172a' }}>Logistics & Operations</h3>
                <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.7, marginBottom: '16px' }}>
                  Process vendor bills, shipping manifests, and purchase orders at scale. Keep your operations running smooth.
                </p>
                <span style={{ fontSize: '0.85rem', color: '#107c41', fontWeight: 700 }}>Vendor Bills • PO Tables • Shipping Manifests</span>
              </div>
            </AnimatedSection>

            {/* Research Teams */}
            <AnimatedSection animation="fade-up" delay={250}>
              <div className="glass-panel" style={{ padding: '32px', textAlign: 'left' }}>
                <div className="icon-animate" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📊</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', color: '#0f172a' }}>Research Teams</h3>
                <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.7, marginBottom: '16px' }}>
                  Digitize survey data, report tables, and academic citations. Spend time analyzing, not transcribing.
                </p>
                <span style={{ fontSize: '0.85rem', color: '#107c41', fontWeight: 700 }}>Survey Data • Report Tables • Citations</span>
              </div>
            </AnimatedSection>

            {/* Agencies */}
            <AnimatedSection animation="fade-up" delay={300}>
              <div className="glass-panel" style={{ padding: '32px', textAlign: 'left' }}>
                <div className="icon-animate" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🏢</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', color: '#0f172a' }}>Agencies</h3>
                <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.7, marginBottom: '16px' }}>
                  Handle client invoices, expense reports, and campaign data. Streamline your billing and reporting cycles.
                </p>
                <span style={{ fontSize: '0.85rem', color: '#107c41', fontWeight: 700 }}>Client Invoices • Expense Reports • Campaign Data</span>
              </div>
            </AnimatedSection>

            {/* Back-Office & BPO */}
            <AnimatedSection animation="fade-up" delay={350}>
              <div className="glass-panel" style={{ padding: '32px', textAlign: 'left' }}>
                <div className="icon-animate" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>⚙️</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', color: '#0f172a' }}>Back-Office & BPO</h3>
                <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.7, marginBottom: '16px' }}>
                  Bulk data entry is your business. TableSift handles 100s of documents per day without breaking a sweat.
                </p>
                <span style={{ fontSize: '0.85rem', color: '#107c41', fontWeight: 700 }}>Bulk Processing • Data Entry • Document Automation</span>
              </div>
            </AnimatedSection>

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
            margin: '0 auto',
            paddingTop: '20px'
          }}>

            {/* Card 1: Free Tier */}
            <div className="glass-panel" style={{ padding: '56px 40px', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: '#107C41' }}>Free</h3>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '3rem', fontWeight: 900 }}>$0</span>
                <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, marginLeft: '4px' }}>/ one-time</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700, marginBottom: '24px' }}>10 Fuels (Lifetime)</p>
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
            <div className="glass-panel" style={{ padding: '56px 40px', textAlign: 'left', border: '2px solid #107C41', backgroundColor: '#fff', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'visible' }}>
              <div className="badge-popular">Most Popular</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: '#107C41' }}>Starter</h3>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '3rem', fontWeight: 900 }}>$12</span>
                <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, marginLeft: '4px' }}>/ mo</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700, marginBottom: '24px' }}>50 Fuels / mo</p>
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
              <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700, marginBottom: '24px' }}>200 Fuels / mo</p>
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

            {/* Card 4: Business */}
            <div className="glass-panel" style={{ padding: '56px 40px', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: '#107C41' }}>Business</h3>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '3rem', fontWeight: 900 }}>$199</span>
                <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, marginLeft: '4px' }}>/ mo</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700, marginBottom: '24px' }}>900 Fuels / mo</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#107C41' }}></span>
                  Everything in Pro
                </li>
                <li style={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#107C41' }}></span>
                  Team Accounts (5 users)
                </li>
                <li style={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#107C41' }}></span>
                  Priority Support
                </li>
                <li style={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#107C41' }}></span>
                  90-Day Download History
                </li>
              </ul>
              <button onClick={() => handleSubscribe(BUSINESS_ID)} style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#0f172a', color: '#fff', fontWeight: 800, cursor: 'pointer', border: 'none', marginTop: 'auto' }}>Get Business</button>
            </div>
          </div>

          {/* Flexible Pricing CTA */}
          <div style={{ textAlign: 'center', marginTop: '60px', padding: '40px 20px', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', borderRadius: '20px', border: '1px solid #bbf7d0' }}>
            <p style={{ fontSize: '1.35rem', color: '#334155', fontWeight: 600, marginBottom: '12px' }}>
              Need a <span style={{ color: '#107C41', fontWeight: 800 }}>custom plan</span>? We&apos;re flexible.
            </p>
            <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '24px' }}>
              Volume discounts, team billing, or unique requirements — let&apos;s talk.
            </p>
            <button
              onClick={() => setShowContactModal(true)}
              style={{
                padding: '14px 32px',
                borderRadius: '12px',
                background: '#107C41',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(16, 124, 65, 0.3)'
              }}
            >
              <Mail size={18} /> Contact Us for Flexible Pricing
            </button>
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
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
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
                <li><Link href="/blog" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>Blog</Link></li>
                <li><Link href="#pricing" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>Pricing</Link></li>
                <li><Link href="#faq" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>FAQ</Link></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '32px' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li><Link href="/about" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>About</Link></li>
                <li><Link href="/privacy" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link></li>
                <li><Link href="/terms" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>Terms of Service</Link></li>
                <li><a href="mailto:support@tablesift.com" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>Contact Support</a></li>
              </ul>
            </div>

          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '40px', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              © 2026 TableSift.com. All rights reserved. Built for data-driven teams.
            </p>
          </div>
        </div>
      </footer>

      {/* Contact Form Modal */}
      {showContactModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '48px',
            maxWidth: '500px',
            width: '100%',
            position: 'relative',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            {/* Close Button */}
            <button
              onClick={() => { setShowContactModal(false); setSubmitSuccess(false); }}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#94a3b8'
              }}
            >×</button>

            {submitSuccess ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>Thank You!</h2>
                <p style={{ color: '#64748b', fontSize: '1rem' }}>We&apos;ll reach out within 24 hours.</p>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', textAlign: 'center' }}>Get Flexible Pricing</h2>
                <p style={{ color: '#64748b', marginBottom: '32px', textAlign: 'center' }}>Tell us about your needs and we&apos;ll create a custom plan.</p>

                <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <input
                      type="text"
                      placeholder="First Name"
                      required
                      value={contactForm.firstName}
                      onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                      style={{ padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', width: '100%', boxSizing: 'border-box' as const }}
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      required
                      value={contactForm.lastName}
                      onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                      style={{ padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', width: '100%', boxSizing: 'border-box' as const }}
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Work Email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    style={{ padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', width: '100%', boxSizing: 'border-box' as const }}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    style={{ padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', width: '100%', boxSizing: 'border-box' as const }}
                  />
                  <textarea
                    placeholder="Tell us about your requirements (optional)"
                    rows={3}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    style={{ padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', resize: 'none', width: '100%', boxSizing: 'border-box' as const }}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      background: isSubmitting ? '#94a3b8' : '#107C41',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '1rem',
                      border: 'none',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      marginTop: '8px'
                    }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Request Custom Pricing'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div >
  );
}
