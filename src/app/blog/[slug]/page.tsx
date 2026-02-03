
import { getPost, getPosts } from "@/lib/cms";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import Header from "@/components/Header";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const slug = (await params).slug;
    const post = await getPost(slug);
    if (!post) return { title: "Post Not Found" };

    return {
        title: `${post.title} | TableSift Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: post.coverImage ? [post.coverImage] : [],
        },
    };
}

// Generate static params for all posts at build time (optional but good for performance)
export async function generateStaticParams() {
    const posts = await getPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPost({ params }: Props) {
    const slug = (await params).slug;
    const post = await getPost(slug);
    if (!post) notFound();

    return (
        <div className="min-h-screen pb-20">
            <Header />
            {/* Hero Header */}
            <div className="bg-slate-900 text-white pt-32 pb-20 px-6 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/10 blur-[100px] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>

                <div className="max-w-3xl mx-auto relative z-10 text-center">
                    <Link href="/blog" className="inline-block mb-8 text-green-400 font-bold text-sm tracking-widest hover:text-green-300 transition-colors">
                        ← BACK TO BLOG
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
                        {post.title}
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-slate-400 text-sm">
                        <span>{new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span>•</span>
                        <span>{post.author.name}</span>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <article className="max-w-3xl mx-auto px-6 -mt-10 relative z-20">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100">
                    {post.coverImage && (
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-auto rounded-xl shadow-sm mb-12"
                        />
                    )}

                    {/* The Blog Content */}
                    <div
                        className="blog-content"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </article>

            {/* CTA Footer */}
            <div className="max-w-3xl mx-auto px-6 mt-16 text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to try TableSift?</h3>
                <p className="text-slate-600 mb-8">Convert your first PDF to Excel for free today.</p>
                <Link href="/" className="glow-btn inline-block">
                    Start Extraction Free
                </Link>
            </div>
        </div>
    );
}
