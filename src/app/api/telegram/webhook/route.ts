import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BLOG_GENERATE_SECRET = process.env.BLOG_GENERATE_SECRET;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tablesift.com';

// Your admin chat ID (will be captured on first /start)
const ADMIN_CHAT_IDS = new Set<number>();

interface TelegramMessage {
    message_id: number;
    from: {
        id: number;
        first_name: string;
        username?: string;
    };
    chat: {
        id: number;
        type: string;
    };
    text?: string;
    date: number;
}

interface TelegramUpdate {
    update_id: number;
    message?: TelegramMessage;
}

async function sendTelegramMessage(chatId: number, text: string, parseMode: 'HTML' | 'Markdown' = 'HTML') {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: parseMode,
        }),
    });
    return response.json();
}

async function generateBlogPost(topic?: string) {
    const response = await fetch(`${BASE_URL}/api/blog/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${BLOG_GENERATE_SECRET}`,
        },
        body: topic ? JSON.stringify({ topic }) : '{}',
    });
    return response.json();
}

/**
 * POST /api/telegram/webhook
 * Handles incoming Telegram bot messages
 * 
 * Commands (works with or without / prefix):
 * start - Welcome message
 * generate - Generate a random blog post from SEO topics
 * generate Topic [topic] - Generate a blog post on specific topic
 * status - Show last generated posts
 * help - Show available commands
 */
export async function POST(req: Request) {
    try {
        const update: TelegramUpdate = await req.json();

        if (!update.message?.text) {
            return NextResponse.json({ ok: true });
        }

        const chatId = update.message.chat.id;
        const text = update.message.text.trim();
        const userId = update.message.from.id;

        // Track admin users
        ADMIN_CHAT_IDS.add(userId);

        // Handle commands (support both /command and command without slash)
        const lowerText = text.toLowerCase();

        if (lowerText === '/start' || lowerText === 'start') {
            await sendTelegramMessage(chatId,
                `🚀 <b>TableSift Blog Bot</b>

Welcome! I can generate and publish SEO-optimized blog posts for TableSift.

<b>Commands:</b>
• <code>generate</code> - Random topic from our SEO database
• <code>generate Topic [your topic]</code> - Custom topic
• <code>status</code> - Show recent posts
• <code>help</code> - Show commands

<b>Examples:</b>
<code>generate</code>
<code>generate Topic How to convert PDF invoices to Excel</code>`
            );
        }
        else if (lowerText.startsWith('/generate') || lowerText.startsWith('generate')) {
            // Remove /generate or generate prefix
            let remaining = text.replace(/^\/?generate\s*/i, '').trim();

            // Check if it starts with "Topic" (case insensitive)
            let topic: string | undefined;
            if (remaining.toLowerCase().startsWith('topic ')) {
                topic = remaining.substring(6).trim(); // Remove "Topic " prefix
            } else if (remaining.length > 0) {
                // Also support just typing the topic directly after generate
                topic = remaining;
            }

            await sendTelegramMessage(chatId,
                topic
                    ? `⏳ Generating blog post about:\n<i>"${topic}"</i>\n\nThis may take 30-60 seconds...`
                    : `⏳ Picking a random SEO topic & generating...\n\nThis may take 30-60 seconds...`
            );

            try {
                const result = await generateBlogPost(topic);

                if (result.success) {
                    await sendTelegramMessage(chatId,
                        `✅ <b>Blog Post Published!</b>

📌 <b>Title:</b> ${result.post.title}

📝 <b>Excerpt:</b>
${result.post.excerpt}

🔗 <b>URL:</b>
<a href="${result.post.url}">${result.post.url}</a>`
                    );
                } else {
                    await sendTelegramMessage(chatId,
                        `❌ <b>Generation Failed</b>

Error: ${result.error || 'Unknown error'}
${result.details ? `\nDetails: ${result.details}` : ''}`
                    );
                }
            } catch (error) {
                await sendTelegramMessage(chatId,
                    `❌ Error: ${error instanceof Error ? error.message : 'Failed to generate post'}`
                );
            }
        }
        else if (lowerText === '/status' || lowerText === 'status') {
            try {
                const response = await fetch(`${BASE_URL}/api/blog/generate`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${BLOG_GENERATE_SECRET}`,
                    },
                });
                const result = await response.json();

                if (result.recentPosts?.length > 0) {
                    const postList = result.recentPosts
                        .map((p: { title: string; url: string; publishedAt: string }, i: number) =>
                            `${i + 1}. <a href="${p.url}">${p.title}</a>`
                        )
                        .join('\n');

                    await sendTelegramMessage(chatId,
                        `📊 <b>Recent AI-Generated Posts</b>

${postList}

Total AI posts: ${result.totalAIPosts || result.recentPosts.length}`
                    );
                } else {
                    await sendTelegramMessage(chatId,
                        '📊 No AI-generated posts yet. Type <code>generate</code> to create one!'
                    );
                }
            } catch (error) {
                await sendTelegramMessage(chatId,
                    `❌ Error fetching status: ${error instanceof Error ? error.message : 'Unknown error'}`
                );
            }
        }
        else if (lowerText === '/help' || lowerText === 'help') {
            await sendTelegramMessage(chatId,
                `📚 <b>TableSift Blog Bot - Help</b>

<b>Commands:</b>

<code>generate</code>
→ Picks a random topic from 100+ SEO keywords

<code>generate Topic [your topic]</code>
→ Generates a post on your specific topic
→ Example: <code>generate Topic PDF to Excel for accountants</code>

<code>status</code>
→ Shows the last 5 AI-generated posts

<b>Optimal Posting Time:</b>
Daily auto-publishing at 10:00 AM IST

<b>Cost:</b> ~₹2-4 per post (GPT-4.1-mini)`
            );
        }
        else {
            await sendTelegramMessage(chatId,
                `❓ Unknown command. Type <code>help</code> to see available commands.`
            );
        }

        return NextResponse.json({ ok: true });

    } catch (error) {
        console.error('Telegram webhook error:', error);
        return NextResponse.json({ ok: false, error: 'Webhook processing failed' });
    }
}

// GET endpoint for webhook verification
export async function GET() {
    return NextResponse.json({
        status: 'Telegram webhook is active',
        bot: 'TableSift Blog Bot'
    });
}
