import { getPost, getPosts } from "@/lib/cms-server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ViewTracker from "@/components/ViewTracker";

interface Props {
    params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
            <Header />
            <ViewTracker slug={slug} />

            {/* Hero Header */}
            <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                color: 'white',
                paddingTop: '140px',
                paddingBottom: '100px',
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
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    transform: 'translate(33%, -33%)'
                }}></div>

                <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10, textAlign: 'center' }}>
                    <Link href="/blog" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '32px',
                        color: '#10b981',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        letterSpacing: '0.1em',
                        textDecoration: 'none',
                        padding: '8px 16px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '50px',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}>
                        ← BACK TO BLOG
                    </Link>
                    <h1 style={{
                        fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                        fontWeight: 900,
                        marginBottom: '24px',
                        lineHeight: 1.2,
                        letterSpacing: '-1px'
                    }}>
                        {post.title}
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
                        <span>{new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span style={{ opacity: 0.5 }}>•</span>
                        <span>{post.author.name}</span>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
                <article style={{
                    padding: '48px',
                    marginTop: '-60px',
                    position: 'relative',
                    zIndex: 20,
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 16px 64px rgba(0,0,0,0.08)'
                }}>
                    {post.coverImage && (
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            style={{ width: '100%', height: 'auto', borderRadius: '16px', marginBottom: '48px' }}
                        />
                    )}

                    {/* The Blog Content */}
                    <div
                        className="blog-content"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>

                {/* CTA Footer */}
                <div style={{
                    textAlign: 'center',
                    margin: '80px 0 100px',
                    padding: '60px 40px',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    borderRadius: '24px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '400px',
                        height: '400px',
                        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                        borderRadius: '50%',
                        pointerEvents: 'none',
                    }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '16px' }}>
                            Ready to try TableSift?
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px', fontSize: '1.1rem' }}>
                            Convert your first PDF to Excel for free today.
                        </p>
                        <Link href="/" style={{
                            display: 'inline-block',
                            padding: '18px 40px',
                            textDecoration: 'none',
                            background: 'linear-gradient(135deg, #107c41 0%, #10b981 100%)',
                            color: 'white',
                            borderRadius: '14px',
                            fontWeight: 700,
                            fontSize: '1rem',
                            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)'
                        }}>
                            Start Extraction Free →
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

