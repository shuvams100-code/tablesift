"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronDown, Rocket, Shield, Zap, Mail, Upload, Download } from "lucide-react";

// --- COMPONENTS ---
import Header from "@/components/Header";
import HeroVisual from "@/components/HeroVisual";
import { AnimatedSection, AnimatedGrid } from "@/components/AnimatedSection";

// --- FIREBASE ---
import { auth, googleProvider, signInWithPopup } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

// --- DODO PAYMENT IDS (LIVE PRODUCTION) ---
const STARTER_ID = process.env.NEXT_PUBLIC_DODO_SUB_STARTER || "pdt_0NXXzxOEqw2kCiWhVVmws"; // $12 Starter Plan - 50 Fuels/mo
const PRO_ID = process.env.NEXT_PUBLIC_DODO_SUB_PRO || "pdt_0NXY0LRFGlLKb1psLfs6y";     // $49 Pro Plan - 200 Fuels/mo
const BUSINESS_ID = process.env.NEXT_PUBLIC_DODO_SUB_BUSINESS || "pdt_0NXvSY9wpwzCHAxLZ43vS"; // $199 Business Plan - 900 Fuels/mo

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

  const handleSubscribe = async (productId: string, planName: string, monthlyCredits: number) => {
    if (!user) {
      await handleLogin();
      return;
    }
    try {
      const token = await user.getIdToken();
      console.log('Frontend: Generated Token for Subscription:', token ? 'Token exists' : 'No token');
      const res = await fetch("/api/subscriptions/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          planName,
          monthlyCredits
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to start checkout');
      }
      if (data.checkoutUrl) {
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          console.error('Checkout URL is missing from response', data);
          alert('Payment initialization failed: No checkout URL returned. Please check console for details.');
        }
      }
    } catch (err: any) {
      console.error("Subscription failed", err);
      // Fallback UI for now since there's no toast
      alert(`Payment Error: ${err.message}`);
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
        paddingTop: '160px',
        paddingBottom: '100px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 30%, #a7f3d0 60%, #6ee7b7 100%)',
      }}>
        {/* Large Decorative Blur Blobs - Outseta style */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(20, 184, 166, 0.2) 50%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-15%',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(52, 211, 153, 0.5) 0%, rgba(16, 124, 65, 0.2) 50%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '40%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(254, 243, 199, 0.6) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />

        <div className="max-w-container" style={{ paddingInline: '24px', position: 'relative', zIndex: 1 }}>
          {/* Centered Hero Content */}
          <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto', marginBottom: '60px' }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#0f172a',
              marginBottom: '24px'
            }}>
              Convert PDFs & Screenshots to Excel.<br />
              <span style={{ color: '#107c41' }}>AI that actually works.</span>
            </h1>

            <p style={{
              fontSize: '1.25rem',
              color: '#475569',
              lineHeight: 1.7,
              marginBottom: '40px',
              maxWidth: '650px',
              margin: '0 auto 40px'
            }}>
              Stop fixing messy formatting. Upload any document, image, or table. Our AI extracts structured data in seconds.
            </p>

            {/* CTA Buttons Row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <button onClick={handleGetStarted} style={{
                height: '56px',
                padding: '0 32px',
                background: '#107C41',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 20px rgba(16, 124, 65, 0.4)',
                transition: 'all 0.2s ease',
              }}>
                Get 10 Free Fuels <ArrowRight size={18} />
              </button>
              <button onClick={() => router.push('#how-it-works')} style={{
                height: '56px',
                padding: '0 32px',
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(10px)',
                color: '#0f172a',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}>
                See how it works
              </button>
            </div>

            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
              No Credit Card Required. 10 Free Fuels included.
            </span>
          </div>

          {/* Product Screenshots / UI Display - Outseta style floating cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            {/* Card 1 - Upload */}
            <div style={{
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.8)',
              transform: 'rotate(-2deg)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Upload size={20} color="#107c41" />
                </div>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>Upload</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Drag & drop PDFs, images, or screenshots</p>
            </div>

            {/* Card 2 - Processing (center, larger) */}
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 30px 80px rgba(0,0,0,0.15)',
              border: '1px solid rgba(255,255,255,0.8)',
              transform: 'translateY(-20px)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #107c41, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={22} color="white" />
                </div>
                <div>
                  <span style={{ fontWeight: 700, color: '#0f172a', display: 'block' }}>AI Processing</span>
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>✓ Data Extracted</span>
                </div>
              </div>
              {/* Mini table preview */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '0.75rem' }}>
                  <div style={{ fontWeight: 700, color: '#64748b' }}>Name</div>
                  <div style={{ fontWeight: 700, color: '#64748b' }}>Amount</div>
                  <div style={{ fontWeight: 700, color: '#64748b' }}>Status</div>
                  <div style={{ color: '#0f172a' }}>Invoice A</div>
                  <div style={{ color: '#0f172a' }}>$1,250</div>
                  <div style={{ color: '#10b981' }}>Paid</div>
                  <div style={{ color: '#0f172a' }}>Invoice B</div>
                  <div style={{ color: '#0f172a' }}>$3,400</div>
                  <div style={{ color: '#f59e0b' }}>Pending</div>
                </div>
              </div>
            </div>

            {/* Card 3 - Download */}
            <div style={{
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.8)',
              transform: 'rotate(2deg)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Download size={20} color="#107c41" />
                </div>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>Download</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Get perfectly formatted .XLSX or .CSV files</p>
            </div>
          </div>

          {/* Social Proof Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '32px',
            marginTop: '60px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} width="18" height="18" viewBox="0 0 24 24" fill="#FBBF24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>4.8</span>
              <span style={{ color: '#64748b', fontSize: '0.9rem' }}>rating</span>
            </div>
            <div style={{ width: '1px', height: '24px', background: 'rgba(0,0,0,0.1)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>{userCount.toLocaleString()}+</span>
              <span style={{ color: '#64748b', fontSize: '0.9rem' }}>documents processed</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS MARQUEE --- */}
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 50%, #ffffff 100%)',
        overflow: 'hidden'
      }}>
        <p style={{
          color: '#107c41',
          fontWeight: 700,
          fontSize: '0.85rem',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          What users are saying
        </p>
        {/* Center spotlight gradient overlay */}
        <div style={{ position: 'relative', width: '100%' }}>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '150px',
            background: 'linear-gradient(to right, #f0fdf4 0%, transparent 100%)',
            zIndex: 10,
            pointerEvents: 'none'
          }}></div>
          <div style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '150px',
            background: 'linear-gradient(to left, #ffffff 0%, transparent 100%)',
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
                <div key={`${setIndex}-${i}`} style={{
                  minWidth: '340px',
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: '28px',
                  border: '1px solid rgba(16, 124, 65, 0.1)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
                  flexShrink: 0,
                }}>
                  <p style={{ color: '#334155', fontSize: '1rem', lineHeight: 1.7, marginBottom: '20px' }}>
                    &quot;{t.text}&quot;
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.85rem',
                      fontWeight: 700
                    }}>{t.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{t.name}</div>
                      <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))
            ))}
          </div>
        </div>
      </section>

      {/* --- WHY TABLESIFT? (DARK SHOWCASE SECTION - Outseta style) --- */}
      <section id="why-tablesift" style={{
        padding: '140px 24px',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative blur */}
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(16, 124, 65, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(52, 211, 153, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />

        <div className="max-w-container" style={{ position: 'relative', zIndex: 1 }}>
          <AnimatedSection animation="fade-up">
            <p style={{
              textAlign: 'center',
              color: '#10b981',
              fontWeight: 700,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: '16px'
            }}>
              Why TableSift?
            </p>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              textAlign: 'center',
              marginBottom: '80px',
              color: '#ffffff',
              maxWidth: '800px',
              margin: '0 auto 80px'
            }}>
              Stop wrestling with messy data. <br />
              <span style={{ color: '#10b981' }}>Start extracting in seconds.</span>
            </h2>
          </AnimatedSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            <AnimatedSection animation="fade-up" delay={100}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '40px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                height: '100%'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  fontSize: '1.5rem'
                }}>⚡</div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '16px', color: '#ffffff' }}>Messy OCR Results</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.7 }}>
                  Standard tools fail on complex layouts. We specialize in Clean Data Extraction preserving headers and row alignment.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '40px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                height: '100%'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  fontSize: '1.5rem'
                }}>📸</div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '16px', color: '#ffffff' }}>Screenshot to Spreadsheet</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.7 }}>
                  Don&apos;t retype data. Snap a picture of a financial report or invoice and convert Image to Excel AI instantly.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={300}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '40px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                height: '100%'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  fontSize: '1.5rem'
                }}>📦</div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '16px', color: '#ffffff' }}>Bulk Processing</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.7 }}>
                  Need to parse 100 pages? Our PDF Parsing engine handles bulk uploads without crashing.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" style={{
        padding: '140px 24px',
        background: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle background accent */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        <div className="max-w-container" style={{ position: 'relative', zIndex: 1 }}>
          <AnimatedSection animation="fade-up">
            <p style={{
              textAlign: 'center',
              color: '#10b981',
              fontWeight: 700,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: '16px'
            }}>
              How It Works
            </p>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              textAlign: 'center',
              marginBottom: '80px',
              color: '#0f172a',
              maxWidth: '700px',
              margin: '0 auto 80px'
            }}>
              From Image to Excel <span style={{ color: '#107c41' }}>in 3 Simple Steps</span>
            </h2>
          </AnimatedSection>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '48px',
            maxWidth: '1100px',
            margin: '0 auto'
          }}>

            <AnimatedSection animation="fade-up" delay={100}>
              <div style={{
                background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
                borderRadius: '24px',
                padding: '40px',
                border: '1px solid #e2e8f0',
                textAlign: 'center',
                height: '100%'
              }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.75rem',
                  fontWeight: 900,
                  margin: '0 auto 28px',
                  boxShadow: '0 8px 24px rgba(16, 124, 65, 0.3)'
                }}>1</div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '16px', color: '#0f172a' }}>Upload your PDF or Image</h3>
                <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.7 }}>Supports scanned docs, photos, and high-res PDFs.</p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <div style={{
                background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
                borderRadius: '24px',
                padding: '40px',
                border: '1px solid #e2e8f0',
                textAlign: 'center',
                height: '100%'
              }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.75rem',
                  fontWeight: 900,
                  margin: '0 auto 28px',
                  boxShadow: '0 8px 24px rgba(16, 124, 65, 0.3)'
                }}>2</div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '16px', color: '#0f172a' }}>AI Identifies Data</h3>
                <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.7 }}>Our vision models identify rows, columns, and headers automatically.</p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={300}>
              <div style={{
                background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
                borderRadius: '24px',
                padding: '40px',
                border: '1px solid #e2e8f0',
                textAlign: 'center',
                height: '100%'
              }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.75rem',
                  fontWeight: 900,
                  margin: '0 auto 28px',
                  boxShadow: '0 8px 24px rgba(16, 124, 65, 0.3)'
                }}>3</div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '16px', color: '#0f172a' }}>Download Results</h3>
                <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.7 }}>Download as perfectly formatted .XLSX or .CSV files.</p>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* --- BUILT FOR PROFESSIONALS (DARK SHOWCASE) --- */}
      <section id="built-for" style={{
        padding: '140px 24px',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative blur */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '20%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(16, 124, 65, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />

        <div className="max-w-container" style={{ position: 'relative', zIndex: 1 }}>
          <AnimatedSection animation="fade-up">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <span style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                Built for Workflow
              </span>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, marginTop: '24px', marginBottom: '16px', color: '#ffffff' }}>
                Who Uses <span style={{ color: '#10b981' }}>TableSift?</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto' }}>
                Trusted by professionals who deal with documents daily. It&apos;s not a trend—it&apos;s a workflow essential.
              </p>
            </div>
          </AnimatedSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>

            {/* Accounting Firms */}
            <AnimatedSection animation="fade-up" delay={100}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                height: '100%'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🧾</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', color: '#ffffff' }}>Accounting Firms</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '16px' }}>
                  Convert bank statements, GST invoices, and ledger exports to Excel. No more manual data entry during tax season.
                </p>
                <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>Bank Statements • GST Returns • Tally Exports</span>
              </div>
            </AnimatedSection>

            {/* Audit Firms */}
            <AnimatedSection animation="fade-up" delay={150}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                height: '100%'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🔍</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', color: '#ffffff' }}>Audit Firms</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '16px' }}>
                  Extract financial tables from compliance documents. Verify entries against ledgers in minutes, not hours.
                </p>
                <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>Compliance Docs • Verification Tables • ITR Data</span>
              </div>
            </AnimatedSection>

            {/* Logistics & Operations */}
            <AnimatedSection animation="fade-up" delay={200}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                height: '100%'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📦</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', color: '#ffffff' }}>Logistics & Operations</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '16px' }}>
                  Process vendor bills, shipping manifests, and purchase orders at scale. Keep your operations running smooth.
                </p>
                <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>Vendor Bills • PO Tables • Shipping Manifests</span>
              </div>
            </AnimatedSection>

            {/* Research Teams */}
            <AnimatedSection animation="fade-up" delay={250}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                height: '100%'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📊</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', color: '#ffffff' }}>Research Teams</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '16px' }}>
                  Digitize survey data, report tables, and academic citations. Spend time analyzing, not transcribing.
                </p>
                <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>Survey Data • Report Tables • Citations</span>
              </div>
            </AnimatedSection>

            {/* Agencies */}
            <AnimatedSection animation="fade-up" delay={300}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                height: '100%'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🏢</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', color: '#ffffff' }}>Agencies</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '16px' }}>
                  Handle client invoices, expense reports, and campaign data. Streamline your billing and reporting cycles.
                </p>
                <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>Client Invoices • Expense Reports • Campaign Data</span>
              </div>
            </AnimatedSection>

            {/* Back-Office & BPO */}
            <AnimatedSection animation="fade-up" delay={350}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                height: '100%'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>⚙️</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', color: '#ffffff' }}>Back-Office & BPO</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '16px' }}>
                  Bulk data entry is your business. TableSift handles 100s of documents per day without breaking a sweat.
                </p>
                <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>Bulk Processing • Data Entry • Document Automation</span>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* Pricing Section follows */}

      {/* --- PRICING SECTION --- */}
      <section id="pricing" style={{
        padding: '140px 0',
        background: 'linear-gradient(180deg, #f8fafc 0%, #f0fdf4 50%, #ecfdf5 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative blur */}
        <div style={{
          position: 'absolute',
          top: '0',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />

        <div className="max-w-container" style={{ paddingInline: '24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <p style={{
            textAlign: 'center',
            color: '#10b981',
            fontWeight: 700,
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: '16px'
          }}>
            Pricing
          </p>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 900,
            marginBottom: '20px',
            color: '#0f172a'
          }}>
            Simple, <span style={{ color: '#107c41' }}>per-page fuel packs</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.2rem', marginBottom: '80px' }}>No hidden fees. Cancel anytime.</p>

          <div className="pricing-grid" style={{
            display: 'grid',
            gap: '24px',
            maxWidth: '1400px',
            margin: '0 auto',
          }}>

            {/* Card 1: Free Tier */}
            <div style={{
              padding: '48px 36px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: '#107C41' }}>Free</h3>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a' }}>$0</span>
                <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, marginLeft: '4px' }}>/ one-time</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700, marginBottom: '24px' }}>10 Fuels (Lifetime)</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <li style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)' }}></span>
                  Standard AI Processing
                </li>
                <li style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)' }}></span>
                  Export to Excel/CSV
                </li>
                <li style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)' }}></span>
                  24-Hour Secure Deletion
                </li>
              </ul>
              <button onClick={handleGetStarted} style={{
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                border: '2px solid #e2e8f0',
                background: 'transparent',
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: 'auto',
                fontSize: '1rem',
                color: '#475569',
                transition: 'all 0.2s ease'
              }}>Start Free</button>
            </div>

            {/* Card 2: Starter (MOST POPULAR) */}
            <div style={{
              padding: '48px 36px',
              textAlign: 'left',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'visible',
              background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)',
              borderRadius: '24px',
              border: '2px solid #10b981',
              boxShadow: '0 12px 40px rgba(16, 185, 129, 0.2)'
            }}>
              <div style={{
                position: 'absolute',
                top: '-14px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)',
                color: 'white',
                padding: '6px 20px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Most Popular</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: '#107C41' }}>Starter</h3>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a' }}>$12</span>
                <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, marginLeft: '4px' }}>/ mo</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700, marginBottom: '24px' }}>50 Fuels / mo</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <li style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)' }}></span>
                  Everything in Free
                </li>
                <li style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)' }}></span>
                  Priority Email Support
                </li>
                <li style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)' }}></span>
                  Cancel Anytime
                </li>
                <li style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)' }}></span>
                  Perfect for Freelancers
                </li>
              </ul>
              <button onClick={() => handleSubscribe(STARTER_ID, 'Starter', 50)} style={{
                width: '100%',
                padding: '16px',
                marginTop: 'auto',
                background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 124, 65, 0.3)'
              }}>Get Starter</button>
            </div>

            {/* Card 3: Pro */}
            <div style={{
              padding: '48px 36px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: '#107C41' }}>Pro</h3>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a' }}>$49</span>
                <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, marginLeft: '4px' }}>/ mo</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700, marginBottom: '24px' }}>200 Fuels / mo</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <li style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)' }}></span>
                  Everything in Starter
                </li>
                <li style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)' }}></span>
                  Bulk File Uploads
                </li>
                <li style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)' }}></span>
                  High-Volume Workflow
                </li>
                <li style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)' }}></span>
                  Invoice Billing Available
                </li>
              </ul>
              <button onClick={() => handleSubscribe(PRO_ID, 'Pro', 200)} style={{
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                background: '#0f172a',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
                marginTop: 'auto',
                fontSize: '1rem'
              }}>Get Pro</button>
            </div>

            {/* Card 4: Business */}
            <div style={{
              padding: '48px 36px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: '#107C41' }}>Business</h3>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a' }}>$199</span>
                <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, marginLeft: '4px' }}>/ mo</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700, marginBottom: '24px' }}>900 Fuels / mo</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <li style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)' }}></span>
                  Everything in Pro
                </li>
                <li style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)' }}></span>
                  Team Accounts (5 users)
                </li>
                <li style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)' }}></span>
                  Priority Support
                </li>
                <li style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)' }}></span>
                  90-Day Download History
                </li>
              </ul>
              <button onClick={() => handleSubscribe(BUSINESS_ID, 'Business', 900)} style={{
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                background: '#0f172a',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
                marginTop: 'auto',
                fontSize: '1rem'
              }}>Get Business</button>
            </div>
          </div>

          {/* Flexible Pricing CTA */}
          <div style={{
            textAlign: 'center',
            marginTop: '60px',
            padding: '48px 24px',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.04)'
          }}>
            <p style={{ fontSize: '1.35rem', color: '#0f172a', fontWeight: 700, marginBottom: '12px' }}>
              Need a <span style={{ color: '#107C41' }}>custom plan</span>? We&apos;re flexible.
            </p>
            <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '24px' }}>
              Volume discounts, team billing, or unique requirements — let&apos;s talk.
            </p>
            <button
              onClick={() => setShowContactModal(true)}
              style={{
                padding: '14px 32px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)',
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
      <section id="faq" style={{
        padding: '140px 24px',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <p style={{
            textAlign: 'center',
            color: '#10b981',
            fontWeight: 700,
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: '16px'
          }}>
            FAQs
          </p>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 900,
            textAlign: 'center',
            marginBottom: '60px',
            color: '#0f172a'
          }}>
            Got Questions? <span style={{ color: '#107c41' }}>We&apos;ve Got Answers</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { q: "Does this work on Scanned PDFs?", a: "Yes. Our AI includes advanced OCR (Optical Character Recognition) that reads data from screenshots, photos, and scanned documents, not just digital PDFs." },
              { q: "Will it keep formatting?", a: "Absolutely. TableSift detects headers, merged cells, and column alignment to give you a clean Excel (.xlsx) file, so you don't have to reformat manually." },
              { q: "How secure is my data?", a: "Your privacy is our priority. Files are processed securely and automatically deleted from our servers after 24 hours." },
              { q: "Can I convert a photo of a table?", a: "Yes. Use our 'Image to Excel' feature. Just snap a photo of a financial report, invoice, or schedule, and we will convert it to a spreadsheet." },
              { q: "What is a 'Fuel'?", a: "One Fuel equals one page scan. If you upload a 5-page PDF, it costs 5 Fuels. This ensures you only pay for exactly what you use." }
            ].map((item, i) => (
              <details key={i} style={{
                padding: '28px',
                cursor: 'pointer',
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
              }}>
                <summary style={{ fontWeight: 800, fontSize: '1.15rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', listStyle: 'none', color: '#0f172a' }}>
                  {item.q}
                  <ChevronDown size={20} color="#107C41" />
                </summary>
                <p style={{ marginTop: '20px', color: '#64748b', fontSize: '1.05rem', lineHeight: 1.7 }}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER WITH DARK CTA --- */}
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

        {/* CTA Section */}
        <div style={{ padding: '120px 24px 80px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 900,
            color: '#ffffff',
            marginBottom: '24px'
          }}>
            Ready to <span style={{ color: '#10b981' }}>Save Hours</span> Every Week?
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '1.2rem',
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px'
          }}>
            Join thousands of professionals who trust TableSift for their document extraction needs.
          </p>
          <button onClick={handleGetStarted} style={{
            height: '60px',
            padding: '0 40px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '14px',
            fontSize: '1.1rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
          }}>
            Get 10 Free Fuels <ArrowRight size={20} />
          </button>
          <p style={{ marginTop: '20px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
            No credit card required
          </p>
        </div>

        {/* Footer Links */}
        <div className="max-w-container" style={{ padding: '0 24px 60px', position: 'relative', zIndex: 1 }}>
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '60px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '60px',
          }}>

            {/* Brand Col */}
            <div>
              <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '24px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
                  TableSift<span style={{ color: '#10b981' }}>.com</span>
                </span>
              </Link>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '280px' }}>
                The world&apos;s most intelligent table extraction engine. Turn messy documents into clean Excel files in seconds.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px' }}>Product</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <li><Link href="#why-tablesift" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>Why TableSift?</Link></li>
                <li><Link href="#how-it-works" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>How it Works</Link></li>
                <li><Link href="/blog" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>Blog</Link></li>
                <li><Link href="#pricing" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>Pricing</Link></li>
                <li><Link href="#faq" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>FAQ</Link></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <li><Link href="/about" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>About</Link></li>
                <li><Link href="/privacy" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>Privacy Policy</Link></li>
                <li><Link href="/terms" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>Terms of Service</Link></li>
                <li><a href="mailto:support@tablesift.com" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>Contact Support</a></li>
              </ul>
            </div>

          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '60px', paddingTop: '30px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
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
