import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/dashboard/'],
            },
            // AI Crawler Optimization (GEO)
            {
                userAgent: 'GPTBot', // OpenAI ChatGPT crawler
                allow: '/',
            },
            {
                userAgent: 'Google-Extended', // Google Gemini AI training
                allow: '/',
            },
            {
                userAgent: 'ClaudeBot', // Anthropic Claude crawler
                allow: '/',
            },
            {
                userAgent: 'Applebot', // Apple AI
                allow: '/',
            },
            {
                userAgent: 'CCBot', // Common Crawl (used by many AI models)
                allow: '/',
            },
        ],
        sitemap: 'https://tablesift.com/sitemap.xml',
    }
}
