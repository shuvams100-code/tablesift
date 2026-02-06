"use client";

import { useEffect } from "react";

interface ViewTrackerProps {
    slug: string;
}

/**
 * Client component that tracks page views
 * Sends a single POST request to /api/blog/track-view when the page loads
 */
export default function ViewTracker({ slug }: ViewTrackerProps) {
    useEffect(() => {
        // Only track once per page load
        const trackView = async () => {
            try {
                await fetch("/api/blog/track-view", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ slug }),
                });
            } catch (error) {
                // Silent fail - don't break the page for analytics
                console.error("Failed to track view:", error);
            }
        };

        trackView();
    }, [slug]);

    // This component renders nothing visible
    return null;
}
