import Link from "next/link";
import { getPosts } from "@/lib/cms-server";
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
    title: "TableSift Blog | Excel Tips, PDF Conversion & Data Extraction",
    description: "Learn how to convert PDF to Excel, extract tables from images, and automate your data entry workflow with our expert guides.",
    alternates: {
        canonical: 'https://tablesift.com/blog',
    },
};

export default async function BlogIndex() {
    const posts = await getPosts();

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
            <Header />

            {/* Main Content */}
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 24px 80px' }}>
                {/* Hero */}
                <div style={{ marginBottom: '60px', textAlign: 'center' }}>
                    <span style={{
                        background: 'linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)',
                        color: '#166534',
                        padding: '8px 20px',
                        borderRadius: '50px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}>
                        Knowledge Hub
                    </span>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        fontWeight: 900,
                        color: '#0f172a',
                        marginTop: '24px',
                        marginBottom: '16px',
                        letterSpacing: '-1px',
                    }}>
                        Latest <span style={{ color: '#107c41' }}>Updates</span> & Guides
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        Master data extraction with our tutorials and news.
                    </p>
                </div>

                {/* Blog Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                    gap: '32px',
                    marginBottom: '80px'
                }}>
                    {posts.map((post) => (
                        <Link href={`/blog/${post.slug}`} key={post.slug} style={{ textDecoration: 'none' }}>
                            <article style={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                cursor: 'pointer',
                                background: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '24px',
                                border: '1px solid rgba(0,0,0,0.06)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
                            }}>
                                {post.coverImage && (
                                    <div style={{ height: '200px', overflow: 'hidden' }}>
                                        <img
                                            src={post.coverImage}
                                            alt={post.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                )}
                                <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <span style={{
                                        color: '#10b981',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        marginBottom: '12px'
                                    }}>
                                        Guide
                                    </span>
                                    <h2 style={{
                                        fontSize: '1.25rem',
                                        fontWeight: 800,
                                        color: '#0f172a',
                                        marginBottom: '12px',
                                        lineHeight: 1.4,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {post.title}
                                    </h2>
                                    <p style={{
                                        color: '#64748b',
                                        marginBottom: '24px',
                                        lineHeight: 1.7,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        flex: 1
                                    }}>
                                        {post.excerpt}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        paddingTop: '24px',
                                        borderTop: '1px solid rgba(0,0,0,0.06)'
                                    }}>
                                        {post.author.photoURL ? (
                                            <img src={post.author.photoURL} style={{ width: '36px', height: '36px', borderRadius: '50%' }} alt={post.author.name} />
                                        ) : (
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.8rem',
                                                fontWeight: 700,
                                                color: '#166534'
                                            }}>
                                                {post.author.name.charAt(0)}
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{post.author.name}</span>
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                                {new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}

