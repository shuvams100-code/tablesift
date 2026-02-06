import { NextResponse } from 'next/server';

const BLOG_GENERATE_SECRET = process.env.BLOG_GENERATE_SECRET;
const CRON_SECRET = process.env.CRON_SECRET;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tablesift.com';

// Your admin Telegram chat ID - update this after first /start
// You can get this by messaging @userinfobot on Telegram
const ADMIN_TELEGRAM_CHAT_ID = process.env.ADMIN_TELEGRAM_CHAT_ID;

async function sendTelegramNotification(text: string) {
    if (!ADMIN_TELEGRAM_CHAT_ID || !TELEGRAM_BOT_TOKEN) {
        console.log('Telegram notification skipped - no chat ID or token');
        return;
    }

    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: ADMIN_TELEGRAM_CHAT_ID,
                text,
                parse_mode: 'HTML',
            }),
        });
    } catch (error) {
        console.error('Failed to send Telegram notification:', error);
    }
}

/**
 * GET /api/cron/publish-blog
 * Daily scheduled blog post generation
 * 
 * Best posting times for B2B content:
 * - Tuesday to Thursday
 * - 9:00 AM - 11:00 AM IST (03:30 - 05:30 UTC)
 * 
 * Set up on Vercel: Cron expression "30 4 * * *" (4:30 AM UTC = 10:00 AM IST)
 * Or use cron-job.org to hit this endpoint daily
 * 
 * Header: Authorization: Bearer <CRON_SECRET>
 */
export async function GET(req: Request) {
    try {
        // Auth check
        const authHeader = req.headers.get('Authorization');

        if (!authHeader || authHeader !== `Bearer ${CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('Daily blog generation triggered at', new Date().toISOString());

        // Call the blog generation endpoint
        const response = await fetch(`${BASE_URL}/api/blog/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BLOG_GENERATE_SECRET}`,
            },
        });

        const result = await response.json();

        if (result.success) {
            // Send success notification to Telegram
            await sendTelegramNotification(
                `🤖 <b>Daily Blog Published!</b>

📌 ${result.post.title}

🔗 ${result.post.url}

Published automatically at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`
            );

            return NextResponse.json({
                success: true,
                message: 'Daily blog post generated and published',
                post: result.post,
            });
        } else {
            // Send failure notification
            await sendTelegramNotification(
                `❌ <b>Daily Blog Generation Failed</b>

Error: ${result.error || 'Unknown error'}
Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`
            );

            return NextResponse.json({
                success: false,
                error: result.error || 'Generation failed',
            }, { status: 500 });
        }

    } catch (error) {
        console.error('Cron job error:', error);

        await sendTelegramNotification(
            `❌ <b>Cron Job Error</b>

Error: ${error instanceof Error ? error.message : 'Unknown error'}
Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`
        );

        return NextResponse.json({
            error: 'Cron job failed',
            details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}
