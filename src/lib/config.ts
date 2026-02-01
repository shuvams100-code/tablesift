export const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_BASE_URL) {
        return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");
    }

    // Vercel deployment URL
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    // Default fallback
    return "https://tablesift.com";
};
