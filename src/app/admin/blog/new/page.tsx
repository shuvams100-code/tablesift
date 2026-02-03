"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { auth, signInWithPopup, googleProvider } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { createPost } from "@/lib/cms";
import { useRouter } from "next/navigation";
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, Undo, Redo } from "lucide-react";

export default function NewPost() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [loading, setLoading] = useState(false);

    // Editor Setup
    const editor = useEditor({
        extensions: [StarterKit],
        content: "<p>Start writing your masterpiece...</p>",
        editorProps: {
            attributes: {
                class: "blog-content focus:outline-none min-h-[300px]",
            },
        },
    });

    // Auth Check
    useEffect(() => {
        if (!auth) return;
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
            // Optional: Add email check here for security
            // if (u && u.email !== "your-admin-email@gmail.com") router.push("/");
        });
        return () => unsubscribe();
    }, []);

    const handlePublish = async () => {
        if (!user || !editor) return;
        setLoading(true);

        try {
            if (!title || !slug) throw new Error("Title and Slug are required");

            await createPost({
                slug,
                title,
                content: editor.getHTML(), // Get HTML from Tiptap
                excerpt,
                coverImage,
                publishedAt: new Date().toISOString(),
                author: {
                    name: user.displayName || "Admin",
                    photoURL: user.photoURL || "",
                },
            });

            alert("Post published successfully!");
            router.push("/blog");
        } catch (err: any) {
            alert("Error publishing: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <button onClick={() => googleProvider && signInWithPopup(auth!, googleProvider)} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold">
                    Sign In to Access Admin
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <h1 className="text-3xl font-black mb-8 text-slate-900">Write New Post</h1>

            <div className="flex flex-col gap-6 mb-8">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                    <input
                        className="w-full text-4xl font-bold border-b-2 border-slate-200 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-300"
                        placeholder="Enter Title..."
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            setSlug(e.target.value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""));
                        }}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Slug</label>
                        <input
                            className="w-full border p-2 rounded-lg bg-slate-50 text-slate-600 font-mono text-sm"
                            placeholder="post-slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Cover Image URL</label>
                        <input
                            className="w-full border p-2 rounded-lg"
                            placeholder="https://..."
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Excerpt (SEO Description)</label>
                    <textarea
                        className="w-full border p-2 rounded-lg h-24"
                        placeholder="Short description for SEO..."
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                    />
                </div>
            </div>

            {/* Editor Toolbar */}
            {editor && (
                <div className="sticky top-4 z-10 bg-white shadow-lg border rounded-xl p-2 mb-6 flex flex-wrap gap-2 items-center">
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")}><Bold size={18} /></ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")}><Italic size={18} /></ToolbarBtn>
                    <div className="w-px h-6 bg-slate-200 mx-1"></div>
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive("heading", { level: 1 })}><Heading1 size={18} /></ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive("heading", { level: 2 })}><Heading2 size={18} /></ToolbarBtn>
                    <div className="w-px h-6 bg-slate-200 mx-1"></div>
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")}><List size={18} /></ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")}><ListOrdered size={18} /></ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")}><Quote size={18} /></ToolbarBtn>
                    <div className="w-px h-6 bg-slate-200 mx-1"></div>
                    <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} isActive={false}><Undo size={18} /></ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} isActive={false}><Redo size={18} /></ToolbarBtn>
                </div>
            )}

            {/* Editor Content */}
            <div className="prose-container border rounded-xl p-8 min-h-[400px] bg-white shadow-sm">
                <EditorContent editor={editor} />
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handlePublish}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform transition active:scale-95 disabled:opacity-50"
                >
                    {loading ? "Publishing..." : "Publish Post"}
                </button>
            </div>
        </div>
    );
}

const ToolbarBtn = ({ children, onClick, isActive }: { children: React.ReactNode, onClick: () => void, isActive: boolean }) => (
    <button
        onClick={onClick}
        className={`p-2 rounded-lg transition-colors ${isActive ? "bg-slate-200 text-black" : "text-slate-500 hover:bg-slate-100"}`}
    >
        {children}
    </button>
)
