import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from '@/lib/firebase-admin';
import { getRandomSocialTopic } from '@/lib/social-templates';

export const dynamic = 'force-dynamic';

const CRON_SECRET = process.env.CRON_SECRET;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_TELEGRAM_CHAT_ID = process.env.ADMIN_TELEGRAM_CHAT_ID;

async function sendTelegramMessage(text: string) {
    if (!ADMIN_TELEGRAM_CHAT_ID || !TELEGRAM_BOT_TOKEN) return;

    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: ADMIN_TELEGRAM_CHAT_ID,
                text,
                parse_mode: 'HTML',
                disable_web_page_preview: true,
            }),
        });
    } catch (error) {
        console.error('Failed to send Telegram notification:', error);
    }
}

/**
 * GET /api/cron/social-content
 * Generates ready-to-post Twitter + LinkedIn content via GPT-4o-mini
 * and sends it to Telegram for easy copy-paste posting
 * 
 * Runs daily at 8:30 AM IST via Vercel cron
 * Header: Authorization: Bearer <CRON_SECRET>
 */
export async function GET(req: Request) {
    try {
        // Auth check
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || authHeader !== `Bearer ${CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('Social Content Engine started at', new Date().toISOString());

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        if (!process.env.OPENAI_API_KEY) {
            console.error('OPENAI_API_KEY is missing');
            return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
        }

        // Get recently used angles from Firestore to avoid repetition
        let recentAngles: string[] = [];
        if (db) {
            const recentSnapshot = await db.collection('social_posts_log')
                .orderBy('createdAt', 'desc')
                .limit(15)
                .get();
            recentAngles = recentSnapshot.docs.map(doc => doc.data().angle as string);
        }

        // Pick a random topic
        const topic = getRandomSocialTopic(recentAngles);

        // Generate content via GPT-4o-mini
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `You are a social media content writer for TableSift — a tool that converts PDFs and scanned documents to clean Excel spreadsheets using AI.

Write two versions of a social media post:

1. TWITTER VERSION:
- Under 270 characters (leave room for hashtags)
- Punchy, conversational, relatable
- Use line breaks for readability
- End with a soft CTA or link mention: "tablesift.com"
- Don't use emojis excessively (1-2 max)

2. LINKEDIN VERSION:
- 100-200 words
- Professional but not boring
- Start with a hook (question, bold statement, or relatable scenario)
- Include a specific insight or tip
- End with CTA: "Try it free at tablesift.com"
- Use line breaks between paragraphs

TONE: Sound like a founder sharing insights, NOT a marketer selling a product.
AVOID: "Game-changer", "revolutionary", "seamless", "leverage", "in today's world".

Return a JSON object with:
{
    "twitter": "the tweet text (without hashtags)",
    "linkedin": "the linkedin post text"
}`
                },
                {
                    role: 'user',
                    content: `Write a ${topic.category} post about: "${topic.angle}"

Category guide:
- tip: Share a practical, actionable tip
- stat: Lead with a compelling statistic, explain why it matters
- pain_point: Make it relatable, then offer the solution
- question: Ask an engaging question that invites comments
- tutorial: Give a quick 3-step process
- myth_bust: "Myth: X. Reality: Y." format`
                }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.9,
            max_tokens: 500,
        });

        const content = response.choices[0].message.content;
        if (!content) {
            throw new Error('No content generated');
        }

        const parsed = JSON.parse(content);
        const hashtags = topic.hashtags.join(' ');

        // Format the Telegram message
        const twitterPost = `${parsed.twitter}\n\n${hashtags}`;
        const linkedinPost = parsed.linkedin;

        const message = `📱 <b>Ready-to-Post Content</b>

━━━━━━━━━━━━━━━━━━━━━━

🐦 <b>Twitter / X:</b>

<code>${twitterPost}</code>

━━━━━━━━━━━━━━━━━━━━━━

💼 <b>LinkedIn:</b>

<code>${linkedinPost}</code>

━━━━━━━━━━━━━━━━━━━━━━

📌 Category: ${topic.category}
💡 Tap the text above to copy → paste → post!`;

        await sendTelegramMessage(message);

        // Log to Firestore to track what's been posted
        if (db) {
            await db.collection('social_posts_log').add({
                angle: topic.angle,
                category: topic.category,
                twitter: twitterPost,
                linkedin: linkedinPost,
                createdAt: new Date(),
            });
        }

        console.log('Social content generated and sent via Telegram');

        return NextResponse.json({
            success: true,
            category: topic.category,
            angle: topic.angle,
        });

    } catch (error) {
        console.error('Social Content Engine error:', error);

        await sendTelegramMessage(
            `❌ <b>Social Content Error</b>\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`
        );

        return NextResponse.json({
            error: 'Social content generation failed',
            details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}
