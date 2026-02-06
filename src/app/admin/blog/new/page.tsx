"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, googleProvider, signInWithPopup, signOut } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft, Save, Eye } from "lucide-react";

const ADMIN_EMAILS = ["shuvams100@gmail.com"];

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 60);
}

export default function NewPost() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [slugEdited, setSlugEdited] = useState(false);

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Auto-generate slug from title
    useEffect(() => {
        if (!slugEdited && title) {
            setSlug(generateSlug(title));
        }
    }, [title, slugEdited]);

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

    const handlePublish = async () => {
        if (!db || !user || !title || !content) {
            alert("Please fill in title and content");
            return;
        }

        setSaving(true);
        try {
            const postRef = doc(db, "blog_posts", slug);
            await setDoc(postRef, {
                title,
                slug,
                excerpt: excerpt || title,
                content,
                coverImage: coverImage || null,
                publishedAt: Timestamp.now(),
                createdAt: Timestamp.now(),
                author: {
                    name: user.displayName || "Admin",
                    photoURL: user.photoURL || null,
                },
            });
            router.push("/admin/blog");
        } catch (err) {
            console.error("Publish failed", err);
            alert("Failed to publish. Try again.");
        }
        setSaving(false);
    };

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
                <button onClick={handleLogin} style={{ padding: "14px 32px", borderRadius: "12px", background: "#0f172a", color: "#fff", fontWeight: 700, cursor: "pointer", border: "none" }}>
                    Sign in with Google
                </button>
            </div>
        );
    }

    if (!ADMIN_EMAILS.includes(user.email || "")) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8fafc", gap: "24px" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#ef4444" }}>Access Denied</h1>
                <p style={{ color: "#64748b" }}>Your email is not authorized.</p>
                <button onClick={handleLogout} style={{ padding: "14px 32px", borderRadius: "12px", background: "#e2e8f0", color: "#0f172a", fontWeight: 700, cursor: "pointer", border: "none" }}>
                    Sign out
                </button>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
            {/* Header */}
            <header style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <Link href="/admin/blog" style={{ color: "#64748b", display: "flex", alignItems: "center", gap: "6px", textDecoration: "none", fontSize: "0.9rem" }}>
                        <ArrowLeft size={16} /> Back
                    </Link>
                    <h1 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a" }}>New Post</h1>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                    {slug && (
                        <Link
                            href={`/blog/${slug}`}
                            target="_blank"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "10px 20px",
                                borderRadius: "8px",
                                background: "#f1f5f9",
                                color: "#475569",
                                textDecoration: "none",
                                fontWeight: 600,
                                fontSize: "0.9rem",
                            }}
                        >
                            <Eye size={16} /> Preview
                        </Link>
                    )}
                    <button
                        onClick={handlePublish}
                        disabled={saving || !title || !content}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "10px 24px",
                            borderRadius: "8px",
                            background: saving || !title || !content ? "#94a3b8" : "#107C41",
                            color: "#fff",
                            fontWeight: 700,
                            cursor: saving || !title || !content ? "not-allowed" : "pointer",
                            border: "none",
                            fontSize: "0.9rem",
                        }}
                    >
                        <Save size={16} /> {saving ? "Publishing..." : "Publish"}
                    </button>
                </div>
            </header>

            {/* Editor */}
            <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {/* Title */}
                    <div>
                        <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Your blog post title..."
                            style={{
                                width: "100%",
                                padding: "14px 16px",
                                borderRadius: "10px",
                                border: "1px solid #e2e8f0",
                                fontSize: "1.1rem",
                                fontWeight: 600,
                                boxSizing: "border-box",
                            }}
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>
                            URL Slug
                            <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 400, marginLeft: "8px" }}>/blog/{slug || "..."}</span>
                        </label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => {
                                setSlug(generateSlug(e.target.value));
                                setSlugEdited(true);
                            }}
                            placeholder="url-friendly-slug"
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                borderRadius: "10px",
                                border: "1px solid #e2e8f0",
                                fontSize: "0.95rem",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>
                            Excerpt <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 400 }}>(for SEO & previews)</span>
                        </label>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="A brief summary of the post..."
                            rows={2}
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                borderRadius: "10px",
                                border: "1px solid #e2e8f0",
                                fontSize: "0.95rem",
                                resize: "none",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Cover Image URL</label>
                        <input
                            type="url"
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                borderRadius: "10px",
                                border: "1px solid #e2e8f0",
                                fontSize: "0.95rem",
                                boxSizing: "border-box",
                            }}
                        />
                        {coverImage && (
                            <img src={coverImage} alt="Preview" style={{ marginTop: "12px", maxWidth: "100%", maxHeight: "200px", borderRadius: "10px", objectFit: "cover" }} />
                        )}
                    </div>

                    {/* Content */}
                    <div>
                        <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>
                            Content * <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 400 }}>(HTML supported)</span>
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="<p>Write your blog content here...</p>

<h2>Subheading</h2>
<p>More content...</p>"
                            rows={20}
                            style={{
                                width: "100%",
                                padding: "16px",
                                borderRadius: "10px",
                                border: "1px solid #e2e8f0",
                                fontSize: "0.95rem",
                                fontFamily: "monospace",
                                lineHeight: 1.6,
                                resize: "vertical",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
