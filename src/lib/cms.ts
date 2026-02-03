
import { db } from "./firebase";
import { collection, doc, getDoc, getDocs, setDoc, query, orderBy, Timestamp } from "firebase/firestore";

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

export async function createPost(post: BlogPost) {
    if (!db) throw new Error("Firestore not initialized");

    const postRef = doc(db, "blog_posts", post.slug);
    await setDoc(postRef, {
        ...post,
        publishedAt: Timestamp.fromDate(new Date()), // Use server timestamp logic if needed, but client date is fine for MVP
        createdAt: Timestamp.now(),
    });
}

export async function getPosts(): Promise<BlogPost[]> {
    if (!db) return [];

    // Query posts ordered by publishedAt desc
    const q = query(collection(db, "blog_posts"), orderBy("publishedAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            slug: doc.id,
            title: data.title,
            content: data.content,
            excerpt: data.excerpt,
            coverImage: data.coverImage,
            publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate().toISOString() : new Date().toISOString(),
            author: data.author
        };
    });
}

export async function getPost(slug: string): Promise<BlogPost | null> {
    if (!db) return null;

    const docRef = doc(db, "blog_posts", slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            slug: docSnap.id,
            title: data.title,
            content: data.content,
            excerpt: data.excerpt,
            coverImage: data.coverImage,
            publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate().toISOString() : new Date().toISOString(),
            author: data.author
        };
    }
    return null;
}
