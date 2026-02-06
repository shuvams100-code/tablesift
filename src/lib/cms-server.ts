import { db } from "./firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

export interface BlogPost {
    slug: string;
    title: string;
    content: string; // HTML string
    excerpt: string;
    coverImage?: string;
    publishedAt: string; // ISO string
    author: {
        name: string;
        photoURL?: string;
    };
}

export async function getPosts(): Promise<BlogPost[]> {
    if (!db) return [];

    try {
        // Query posts ordered by publishedAt desc
        const snapshot = await db.collection("blog_posts")
            .orderBy("publishedAt", "desc")
            .get();

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                slug: doc.id,
                title: data.title,
                content: data.content,
                excerpt: data.excerpt,
                coverImage: data.coverImage,
                publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate().toISOString() : new Date().toISOString(),
                author: data.author || { name: 'TableSift Team' }
            } as BlogPost;
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

export async function getPost(slug: string): Promise<BlogPost | null> {
    if (!db) return null;

    try {
        const docSnap = await db.collection("blog_posts").doc(slug).get();

        if (docSnap.exists) {
            const data = docSnap.data();
            if (!data) return null;

            return {
                slug: docSnap.id,
                title: data.title,
                content: data.content,
                excerpt: data.excerpt,
                coverImage: data.coverImage,
                publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate().toISOString() : new Date().toISOString(),
                author: data.author || { name: 'TableSift Team' }
            } as BlogPost;
        }
    } catch (error) {
        console.error("Error fetching post:", error);
    }
    return null;
}
