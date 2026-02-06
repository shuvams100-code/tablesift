import { getPost, getPosts } from "@/lib/cms";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ViewTracker from "@/components/ViewTracker";

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
        <div style={{ minHeight: '100vh', background: '#ffffff' }}>
            <Header />
            <ViewTracker slug={slug} />

            {/* Hero Header */}
            <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                color: 'white',
                paddingTop: '120px',
                paddingBottom: '80px',
                paddingLeft: '24px',
                paddingRight: '24px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Glow */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '600px',
                    height: '600px',
                    background: 'rgba(16, 124, 65, 0.1)',
                    filter: 'blur(100px)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    transform: 'translate(33%, -33%)'
                }}></div>

                <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10, textAlign: 'center' }}>
                    <Link href="/blog" style={{
                        display: 'inline-block',
                        marginBottom: '32px',
                        color: '#4ade80',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        letterSpacing: '0.1em',
                        textDecoration: 'none'
                    }}>
                        ← BACK TO BLOG
                    </Link>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 900,
                        marginBottom: '24px',
                        lineHeight: 1.2,
                        letterSpacing: '-1px'
                    }}>
                        {post.title}
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', color: '#94a3b8', fontSize: '0.9rem' }}>
                        <span>{new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span>•</span>
                        <span>{post.author.name}</span>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
                <article className="glass-panel" style={{
                    padding: '48px',
                    marginTop: '-40px',
                    position: 'relative',
                    zIndex: 20
                }}>
                    {post.coverImage && (
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            style={{ width: '100%', height: 'auto', borderRadius: '12px', marginBottom: '48px' }}
                        />
                    )}

                    {/* The Blog Content */}
                    <div
                        className="blog-content"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>

                {/* CTA Footer */}
                <div style={{ textAlign: 'center', margin: '60px 0 80px' }}>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                        Ready to try TableSift?
                    </h3>
                    <p style={{ color: '#64748b', marginBottom: '32px' }}>
                        Convert your first PDF to Excel for free today.
                    </p>
                    <Link href="/" className="btn-primary" style={{
                        display: 'inline-block',
                        padding: '16px 36px',
                        textDecoration: 'none',
                    }}>
                        Start Extraction Free →
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}

