
import Link from "next/link";
import { getPosts } from "@/lib/cms";
import { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
    title: "TableSift Blog | Excel Tips, PDF Conversion & Data Extraction",
    description: "Learn how to convert PDF to Excel, extract tables from images, and automate your data entry workflow with our expert guides.",
};

export default async function BlogIndex() {
    const posts = await getPosts();

    return (
        <>
            <Header />
            <div className="container" style={{ paddingTop: '120px' }}>
                <div className="text-center mb-16">
                    <span className="badge">Knowledge Hub</span>
                    <h1 className="headline" style={{ fontSize: '3rem', color: '#0f172a', marginBottom: '1rem' }}>
                        Latest Updates & Guides
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#64748b' }}>
                        Master data extraction with our tutorials and news.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8 max-w-[1200px] w-full mb-20">
                    {posts.map((post) => (
                        <Link href={`/blog/${post.slug}`} key={post.slug} className="group no-underline">
                            <article className="card-premium h-full flex flex-col hover:-translate-y-2 transition-transform duration-300">
                                {post.coverImage && (
                                    <div className="h-48 w-full overflow-hidden border-b border-slate-100">
                                        <img
                                            src={post.coverImage}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                )}
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="text-sm text-green-600 font-bold mb-3 uppercase tracking-wider">Guide</div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-green-700 transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>
                                    <p className="text-slate-500 mb-6 line-clamp-3 leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                    <div className="mt-auto flex items-center gap-3 pt-6 border-t border-slate-100">
                                        {post.author.photoURL ? (
                                            <img src={post.author.photoURL} className="w-8 h-8 rounded-full" alt={post.author.name} />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                                                {post.author.name.charAt(0)}
                                            </div>
                                        )}

                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-900">{post.author.name}</span>
                                            <span className="text-xs text-slate-400">
                                                {new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
