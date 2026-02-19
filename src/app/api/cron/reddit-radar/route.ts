import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

const CRON_SECRET = process.env.CRON_SECRET;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_TELEGRAM_CHAT_ID = process.env.ADMIN_TELEGRAM_CHAT_ID;

const getOpenAI = () => {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is missing');
    }
    const _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return _openai;
};

// Reddit search queries to monitor
const SEARCH_QUERIES = [
    'pdf to excel',
    'convert pdf spreadsheet',
    'pdf data entry automation',
    'extract table from pdf',
    'bank statement to excel',
    'pdf to csv convert',
    'scanned document to excel',
    'copy paste pdf excel broken',
];

// Subreddits to prioritize (posts from these get a boost)
const PRIORITY_SUBREDDITS = [
    'excel', 'googlesheets', 'accounting', 'bookkeeping',
    'smallbusiness', 'Entrepreneur', 'dataentry', 'PDF',
    'sysadmin', 'msp', 'FinancialPlanning', 'taxpros',
];

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
                disable_web_page_preview: false,
            }),
        });
    } catch (error) {
        console.error('Failed to send Telegram notification:', error);
    }
}

interface RedditPost {
    id: string;
    title: string;
    selftext: string;
    subreddit: string;
    author: string;
    num_comments: number;
    score: number;
    permalink: string;
    created_utc: number;
}

async function searchReddit(query: string): Promise<RedditPost[]> {
    try {
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(
            `https://www.reddit.com/search.json?q=${encodedQuery}&sort=new&t=day&limit=10`,
            {
                headers: {
                    'User-Agent': 'TableSift-LeadRadar/1.0',
                },
            }
        );

        if (!response.ok) {
            console.error(`Reddit search failed for "${query}": ${response.status}`);
            return [];
        }

        const data = await response.json();
        return (data?.data?.children || []).map((child: { data: RedditPost }) => child.data);
    } catch (error) {
        console.error(`Reddit search error for "${query}":`, error);
        return [];
    }
}

async function generatePersonalizedReply(post: RedditPost): Promise<string> {
    try {
        const openai = getOpenAI();
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `You are a helpful Reddit user who happens to know about PDF-to-Excel conversion tools. Write a genuinely helpful Reddit reply.

RULES:
- Be helpful FIRST. Answer their actual question with real advice.
- Sound like a real person, not a marketer. Use casual Reddit tone.
- Only mention TableSift naturally at the end, like "I've been using tablesift.com for this and it works well" — NOT as a sales pitch.
- Keep it under 100 words.
- Don't use marketing language like "revolutionary", "game-changer", "seamless".
- If the post isn't really about PDF/Excel conversion, just give generic helpful advice WITHOUT mentioning TableSift.
- Never start with "Hey there!" or "Great question!"
- Be specific to their situation.`
                },
                {
                    role: 'user',
                    content: `Reddit post in r/${post.subreddit}:
Title: "${post.title}"
Body: "${post.selftext?.slice(0, 500) || '(no body text)'}"

Write a helpful reply:`
                }
            ],
            temperature: 0.8,
            max_tokens: 200,
        });

        return response.choices[0].message.content || '';
    } catch (error) {
        console.error('Error generating reply:', error);
        return '';
    }
}

/**
 * GET /api/cron/reddit-radar
 * Scans Reddit for PDF-to-Excel related posts and sends Telegram alerts
 * 
 * Runs every 6 hours via Vercel cron
 * Header: Authorization: Bearer <CRON_SECRET>
 */
export async function GET(req: Request) {
    try {
        // Auth check
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || authHeader !== `Bearer ${CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!db) {
            return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
        }

        console.log('Reddit Radar scan started at', new Date().toISOString());



        if (!process.env.OPENAI_API_KEY) {
            console.error('OPENAI_API_KEY is missing');
            return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
        }

        // Get already-seen post IDs from Firestore
        const seenSnapshot = await db.collection('seen_reddit_posts')
            .orderBy('seenAt', 'desc')
            .limit(500)
            .get();
        const seenIds = new Set(seenSnapshot.docs.map(doc => doc.id));

        // Search Reddit with multiple queries (pick 3 random ones per run to avoid rate limits)
        const shuffled = SEARCH_QUERIES.sort(() => 0.5 - Math.random());
        const selectedQueries = shuffled.slice(0, 3);

        const allPosts: RedditPost[] = [];

        for (const query of selectedQueries) {
            const posts = await searchReddit(query);
            allPosts.push(...posts);
            // Small delay between requests to be nice to Reddit
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Deduplicate by post ID
        const uniquePosts = new Map<string, RedditPost>();
        for (const post of allPosts) {
            if (!uniquePosts.has(post.id) && !seenIds.has(post.id)) {
                uniquePosts.set(post.id, post);
            }
        }

        // Filter: only posts from the last 6 hours
        const sixHoursAgo = (Date.now() / 1000) - (6 * 60 * 60);
        const recentPosts = Array.from(uniquePosts.values())
            .filter(p => p.created_utc > sixHoursAgo)
            // Prioritize posts from relevant subreddits
            .sort((a, b) => {
                const aIsPriority = PRIORITY_SUBREDDITS.includes(a.subreddit) ? 1 : 0;
                const bIsPriority = PRIORITY_SUBREDDITS.includes(b.subreddit) ? 1 : 0;
                return bIsPriority - aIsPriority || b.score - a.score;
            })
            // Cap at 5 leads per scan to avoid spam
            .slice(0, 5);

        if (recentPosts.length === 0) {
            console.log('No new Reddit leads found');
            return NextResponse.json({
                success: true,
                message: 'No new leads found',
                queriesUsed: selectedQueries,
            });
        }

        // Process each lead
        let sentCount = 0;
        for (const post of recentPosts) {
            // Generate AI-personalized reply
            const suggestedReply = await generatePersonalizedReply(post);

            const timeAgo = Math.round((Date.now() / 1000 - post.created_utc) / 3600);
            const postUrl = `https://reddit.com${post.permalink}`;
            const isPriority = PRIORITY_SUBREDDITS.includes(post.subreddit);

            const message = `${isPriority ? '🎯' : '📡'} <b>Reddit Lead Found</b> — r/${post.subreddit}

<b>"${post.title}"</b>
${post.selftext ? `\n<i>${post.selftext.slice(0, 200)}${post.selftext.length > 200 ? '...' : ''}</i>\n` : ''}
👤 u/${post.author} • ${timeAgo}h ago • ${post.num_comments} comments • ⬆️ ${post.score}
🔗 ${postUrl}

📋 <b>Suggested reply:</b>
<code>${suggestedReply}</code>`;

            await sendTelegramMessage(message);
            sentCount++;

            // Mark as seen in Firestore
            await db.collection('seen_reddit_posts').doc(post.id).set({
                title: post.title,
                subreddit: post.subreddit,
                seenAt: new Date(),
                url: postUrl,
            });

            // Small delay between Telegram messages
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log(`Reddit Radar: sent ${sentCount} leads`);

        return NextResponse.json({
            success: true,
            leadsFound: sentCount,
            queriesUsed: selectedQueries,
        });

    } catch (error) {
        console.error('Reddit Radar error:', error);

        await sendTelegramMessage(
            `❌ <b>Reddit Radar Error</b>\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`
        );

        return NextResponse.json({
            error: 'Reddit Radar failed',
            details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}
