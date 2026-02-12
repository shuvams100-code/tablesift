import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { getRandomTopic } from '@/lib/blog-topics';

export const dynamic = 'force-dynamic';

// Helper to send Telegram messages from any chat ID
async function sendTelegramNotification(chatId: string, message: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) return;

    try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML',
                disable_web_page_preview: false,
            }),
        });
    } catch (err) {
        console.error('Failed to send Telegram notification:', err);
    }
}

// Generate URL-friendly slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 60);
}

// Enhanced SEO System Prompt - Based on 2025-2026 Google Best Practices
const SYSTEM_PROMPT = `You are an expert content writer for TableSift, a B2B SaaS tool that converts PDFs and scanned documents to clean Excel spreadsheets automatically.

===== E-E-A-T COMPLIANCE (Google's Quality Criteria) =====
EXPERIENCE: Write from first-hand experience. Include phrases like "In our experience...", "We've tested...", "Our users report..."
EXPERTISE: Demonstrate deep knowledge with specific technical details, not generic advice.
AUTHORITATIVENESS: Reference industry standards, cite statistics where relevant (make them realistic).
TRUSTWORTHINESS: Be transparent, acknowledge limitations, provide balanced perspectives.

===== WRITING STYLE =====
- Professional but conversational - write like a senior developer explaining to a colleague
- Use second person ("you") to address the reader directly
- Short paragraphs (2-3 sentences max) for easy scanning
- Vary sentence length to maintain rhythm
- NO fluff, filler, or generic statements like "In today's digital world..."
- Be specific and actionable - every section should teach something concrete
- 8th-9th grade reading level (Flesch-Kincaid) for accessibility

===== ARTICLE STRUCTURE (SEO-Optimized) =====
1. HOOK (First 100 words): Address the reader's pain point immediately. Include primary keyword.
2. QUICK ANSWER (40-60 words): Provide a concise answer right after intro - this targets Featured Snippets.
3. TABLE OF CONTENTS: List of sections (implied by H2 headers)
4. MAIN CONTENT (4-6 H2 sections):
   - Each section answers a specific sub-question
   - Include numbered steps or bullet lists where relevant
   - Use H3 for sub-sections if needed
5. FAQ SECTION: 3-4 related questions with concise answers (boosts Featured Snippet chances)
6. CONCLUSION with CTA: Soft mention of TableSift as solution

===== FEATURED SNIPPET OPTIMIZATION =====
- Answer the main question in 40-60 words immediately after intro
- Use clear, structured headings that match common search queries
- Include numbered lists for "how to" topics
- Include bullet lists for "what is" or "types of" topics
- Add a comparison table if comparing options

===== SEO REQUIREMENTS =====
- Primary keyword in: title, first 100 words, one H2, naturally 4-6 times total
- Use LSI keywords (related terms) throughout
- Include question-based H2s (e.g., "How do you convert PDF to Excel?")
- Internal link placeholder: Add [LINK: relevant-page-name] where TableSift features should be linked
- Meta description must include primary keyword and a value proposition

===== HTML FORMATTING =====
Use clean, semantic HTML:
- <h2> for main sections (4-6 per article)
- <h3> for sub-sections
- <p> for paragraphs (short - 2-3 sentences)
- <ul>/<li> for unordered lists
- <ol>/<li> for numbered steps
- <strong> for key terms (sparingly)
- <blockquote> for important callouts or tips
- Use comparison tables <table> when comparing options

===== CTA GUIDELINES =====
End with a natural, non-pushy mention of TableSift:
"Tired of manual data entry? TableSift automatically converts your PDFs to clean, editable Excel files in seconds - no formatting headaches. [Try it free →]"

===== WHAT TO AVOID =====
- Generic intros ("In today's fast-paced world...")
- Keyword stuffing
- Vague advice without specific steps
- Overly promotional tone throughout (save CTA for end)
- AI-sounding phrases ("It's important to note that...", "In conclusion...")
- Passive voice (prefer active)`;


interface GeneratedBlog {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    metaKeywords: string[];
}

async function generateBlogContent(topic: string): Promise<GeneratedBlog> {
    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            {
                role: 'user',
                content: `Write a comprehensive, SEO-optimized blog article about: "${topic}"

STRUCTURE REQUIRED:
1. Hook intro addressing the pain point (2-3 sentences)
2. Quick answer paragraph (40-60 words) - this is for Featured Snippets
3. Main content with 4-6 H2 sections (question-style headings preferred)
4. FAQ section with 3 related questions and concise answers
5. Conclusion with soft TableSift CTA

Return a JSON object with exactly these fields:
{
    "title": "SEO title (50-60 chars, keyword at start)",
    "excerpt": "Meta description (150-160 chars, keyword + value prop + action verb)",
    "content": "Full HTML article (1000-1200 words, includes FAQ section)",
    "metaKeywords": ["primary keyword", "lsi keyword 1", "lsi keyword 2", "lsi keyword 3", "question keyword"]
}

CRITICAL: Include a FAQ section at the end with <h2>Frequently Asked Questions</h2> and 3 questions in <h3> tags.`
            }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 4000,
    });

    const content = response.choices[0].message.content;
    if (!content) {
        throw new Error('No content generated');
    }

    const parsed = JSON.parse(content);
    return {
        title: parsed.title,
        slug: generateSlug(parsed.title),
        excerpt: parsed.excerpt,
        content: parsed.content,
        metaKeywords: parsed.metaKeywords || [],
    };
}

/**
 * POST /api/blog/generate
 * Generates and publishes an AI-written blog post
 * 
 * Body: { topic?: string } - Optional specific topic, otherwise random
 * Header: Authorization: Bearer <BLOG_GENERATE_SECRET>
 */
export async function POST(req: Request) {
    try {
        // Auth check
        const authHeader = req.headers.get('Authorization');
        const expectedSecret = process.env.BLOG_GENERATE_SECRET;

        if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!db) {
            return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
        }

        // Get used topics from Firestore to avoid repetition
        const postsSnapshot = await db.collection('blog_posts').select('title').get();
        const usedTopics = postsSnapshot.docs.map(doc => doc.data().title as string);

        // Get topic from request body or pick random unused one
        let topic: string;
        let notifyChatId: string | undefined;

        try {
            const body = await req.json();
            topic = body.topic || getRandomTopic(usedTopics);
            notifyChatId = body.notifyChatId;
        } catch {
            topic = getRandomTopic(usedTopics);
        }

        console.log(`Generating blog post content for topic: ${topic}`);

        // Generate content using GPT-4o-mini
        const blog = await generateBlogContent(topic);
        console.log(`Content generated successfully: ${blog.title}`);

        // Check if slug already exists, append number if needed
        let finalSlug = blog.slug;
        const existingDoc = await db.collection('blog_posts').doc(finalSlug).get();
        if (existingDoc.exists) {
            finalSlug = `${blog.slug}-${Date.now().toString().slice(-4)}`;
        }

        // Save to Firestore
        const now = Timestamp.now();
        await db.collection('blog_posts').doc(finalSlug).set({
            title: blog.title,
            slug: finalSlug,
            excerpt: blog.excerpt,
            content: blog.content,
            metaKeywords: blog.metaKeywords,
            coverImage: null, // Can be enhanced later with image generation
            publishedAt: now,
            createdAt: now,
            generatedByAI: true,
            originalTopic: topic,
            author: {
                name: 'TableSift Team',
                photoURL: null,
            },
        });

        const postUrl = `https://tablesift.com/blog/${finalSlug}`;

        // Notify via Telegram if requested
        if (notifyChatId) {
            await sendTelegramNotification(notifyChatId,
                `✅ <b>Blog Post Published!</b>\n\n` +
                `📌 <b>Title:</b> ${blog.title}\n\n` +
                `📝 <b>Excerpt:</b>\n${blog.excerpt}\n\n` +
                `🔗 <b>URL:</b>\n<a href="${postUrl}">${postUrl}</a>`
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Blog post generated and published!',
            post: {
                title: blog.title,
                slug: finalSlug,
                excerpt: blog.excerpt,
                url: postUrl,
            },
        });

    } catch (error) {
        console.error('Error generating blog:', error);
        return NextResponse.json({
            error: 'Failed to generate blog post',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// GET endpoint to check status and list recent AI-generated posts
export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        const expectedSecret = process.env.BLOG_GENERATE_SECRET;

        if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!db) {
            return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
        }

        // Get last 5 AI-generated posts
        const snapshot = await db.collection('blog_posts')
            .where('generatedByAI', '==', true)
            .orderBy('publishedAt', 'desc')
            .limit(5)
            .get();

        const posts = snapshot.docs.map(doc => ({
            title: doc.data().title,
            slug: doc.id,
            publishedAt: doc.data().publishedAt?.toDate?.()?.toISOString(),
            url: `https://tablesift.com/blog/${doc.id}`,
        }));

        return NextResponse.json({
            totalAIPosts: snapshot.size,
            recentPosts: posts,
        });

    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}
