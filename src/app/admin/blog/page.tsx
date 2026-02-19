"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, googleProvider, signInWithPopup, signOut } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Edit, Plus, LogOut, ArrowLeft } from "lucide-react";

// Admin email whitelist
const ADMIN_EMAILS = ["shuvams100@gmail.com"];

interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    publishedAt: string;
    coverImage?: string;
    views?: number;
    generatedByAI?: boolean;
}

export default function AdminBlog() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
        if (!auth) {
            // If auth is not initialized, stop loading eventually
            const t = setTimeout(() => setLoading(false), 0);
            return () => clearTimeout(t);
        }
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Fetch posts
    useEffect(() => {
        async function fetchPosts() {
            if (!db || !user || !ADMIN_EMAILS.includes(user.email || "")) return;
            const q = query(collection(db, "blog_posts"), orderBy("publishedAt", "desc"));
            const snapshot = await getDocs(q);
            const data: BlogPost[] = snapshot.docs.map((doc) => {
                const d = doc.data();
                return {
                    slug: doc.id,
                    title: d.title,
                    excerpt: d.excerpt,
                    publishedAt: d.publishedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                    coverImage: d.coverImage,
                    views: d.views || 0,
                    generatedByAI: d.generatedByAI || false,
                };
            });
            setPosts(data);
        }
        fetchPosts();
    }, [user]);

    const handleLogin = async () => {
        if (!auth || !googleProvider) return;
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    const handleLogout = async () => {
        if (!auth) return;
        await signOut(auth);
        router.push("/");
    };

    const handleDelete = async (slug: string) => {
        if (!db || !confirm("Delete this post? This cannot be undone.")) return;
        setDeleting(slug);
        try {
            await deleteDoc(doc(db, "blog_posts", slug));
            setPosts((prev) => prev.filter((p) => p.slug !== slug));
        } catch (err) {
            console.error("Delete failed", err);
        }
        setDeleting(null);
    };

    // Not logged in
    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
                <p style={{ color: "#64748b" }}>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8fafc", gap: "24px" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a" }}>Admin Login</h1>
                <p style={{ color: "#64748b" }}>Sign in with your authorized Google account.</p>
                <button
                    onClick={handleLogin}
                    style={{
                        padding: "14px 32px",
                        borderRadius: "12px",
                        background: "#0f172a",
                        color: "#fff",
                        fontWeight: 700,
                        cursor: "pointer",
                        border: "none",
                        fontSize: "1rem",
                    }}
                >
                    Sign in with Google
                </button>
            </div>
        );
    }

    // Check whitelist
    if (!ADMIN_EMAILS.includes(user.email || "")) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8fafc", gap: "24px" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#ef4444" }}>Access Denied</h1>
                <p style={{ color: "#64748b" }}>Your email ({user.email}) is not authorized.</p>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: "14px 32px",
                        borderRadius: "12px",
                        background: "#e2e8f0",
                        color: "#0f172a",
                        fontWeight: 700,
                        cursor: "pointer",
                        border: "none",
                    }}
                >
                    Sign out
                </button>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
            {/* Header */}
            <header style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <Link href="/" style={{ color: "#64748b", display: "flex", alignItems: "center", gap: "6px", textDecoration: "none", fontSize: "0.9rem" }}>
                        <ArrowLeft size={16} /> Back to Site
                    </Link>
                    <h1 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a" }}>Blog Admin</h1>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span style={{ fontSize: "0.85rem", color: "#64748b" }}>{user.email}</span>
                    <button onClick={handleLogout} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a" }}>All Posts ({posts.length})</h2>
                    <Link
                        href="/admin/blog/new"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "12px 24px",
                            borderRadius: "10px",
                            background: "#107C41",
                            color: "#fff",
                            fontWeight: 700,
                            textDecoration: "none",
                        }}
                    >
                        <Plus size={18} /> New Post
                    </Link>
                </div>

                {/* Analytics Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
                    <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                        <p style={{ fontSize: "2rem", fontWeight: 800, color: "#107C41" }}>{posts.reduce((sum, p) => sum + (p.views || 0), 0)}</p>
                        <p style={{ fontSize: "0.85rem", color: "#64748b" }}>Total Views</p>
                    </div>
                    <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                        <p style={{ fontSize: "2rem", fontWeight: 800, color: "#2563eb" }}>{posts.filter(p => p.generatedByAI).length}</p>
                        <p style={{ fontSize: "0.85rem", color: "#64748b" }}>🤖 AI Posts</p>
                    </div>
                    <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                        <p style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a" }}>{posts.filter(p => !p.generatedByAI).length}</p>
                        <p style={{ fontSize: "0.85rem", color: "#64748b" }}>Manual Posts</p>
                    </div>
                </div>

                {posts.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "80px 20px", background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                        <p style={{ color: "#64748b", marginBottom: "24px" }}>No posts yet. Create your first one!</p>
                        <Link
                            href="/admin/blog/new"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "12px 24px",
                                borderRadius: "10px",
                                background: "#107C41",
                                color: "#fff",
                                fontWeight: 700,
                                textDecoration: "none",
                            }}
                        >
                            <Plus size={18} /> Create Post
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {posts.map((post) => (
                            <div
                                key={post.slug}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "20px",
                                    padding: "20px 24px",
                                    background: "#fff",
                                    borderRadius: "12px",
                                    border: "1px solid #e2e8f0",
                                }}
                            >
                                {post.coverImage && (
                                    <img src={post.coverImage} alt="" style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "8px" }} />
                                )}
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>{post.title}</h3>
                                        {post.generatedByAI && (
                                            <span style={{ fontSize: "0.7rem", padding: "2px 8px", background: "#dbeafe", color: "#2563eb", borderRadius: "999px", fontWeight: 600 }}>🤖 AI</span>
                                        )}
                                    </div>
                                    <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                                        {new Date(post.publishedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                                        <span style={{ margin: "0 8px" }}>•</span>
                                        <span style={{ color: "#107C41", fontWeight: 600 }}>{post.views || 0} views</span>
                                    </p>
                                </div>
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <Link
                                        href={`/admin/blog/edit/${post.slug}`}
                                        style={{
                                            padding: "10px 16px",
                                            borderRadius: "8px",
                                            background: "#f1f5f9",
                                            color: "#475569",
                                            textDecoration: "none",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            fontWeight: 600,
                                            fontSize: "0.85rem",
                                        }}
                                    >
                                        <Edit size={14} /> Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(post.slug)}
                                        disabled={deleting === post.slug}
                                        style={{
                                            padding: "10px 16px",
                                            borderRadius: "8px",
                                            background: deleting === post.slug ? "#fecaca" : "#fee2e2",
                                            color: "#dc2626",
                                            border: "none",
                                            cursor: deleting === post.slug ? "not-allowed" : "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            fontWeight: 600,
                                            fontSize: "0.85rem",
                                        }}
                                    >
                                        <Trash2 size={14} /> {deleting === post.slug ? "..." : "Delete"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
