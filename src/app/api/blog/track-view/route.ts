import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * POST /api/blog/track-view
 * Tracks a view for a blog post
 * Called from the blog post page when user loads it
 * 
 * Body: { slug: string }
 */
export async function POST(req: Request) {
    try {
        const { slug } = await req.json();

        if (!slug || typeof slug !== 'string') {
            return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
        }

        if (!db) {
            return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
        }

        const postRef = db.collection('blog_posts').doc(slug);
        const postDoc = await postRef.get();

        if (!postDoc.exists) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Increment view count
        await postRef.update({
            views: FieldValue.increment(1),
            lastViewedAt: new Date(),
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error tracking view:', error);
        return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
    }
}
