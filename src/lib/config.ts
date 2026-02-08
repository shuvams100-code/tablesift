export const getBaseUrl = () => {
    // Priority 1: Environment variable
    if (process.env.NEXT_PUBLIC_BASE_URL) {
        return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");
    }

    // Priority 2: Vercel deployment URL
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    // Priority 3: Local development
    if (process.env.NODE_ENV === "development") {
        return "http://localhost:3000";
    }

    // Default fallback
    return "https://tablesift.com";
};
