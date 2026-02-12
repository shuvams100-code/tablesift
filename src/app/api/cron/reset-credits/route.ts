import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

/**
 * Monthly Credit Reset Cron Job
 * 
 * This endpoint runs on a schedule to reset planCredits for all users
 * based on their billing cycle. RefillCredits are never touched.
 * 
 * Deployment: Add to vercel.json as a cron job (runs daily):
 * {
 *   "crons": [{
 *     "path": "/api/cron/reset-credits",
 *     "schedule": "0 0 * * *"
 *   }]
 * }
 */

// Define credit allocation by tier (must match actual pricing plans)
const PLAN_CREDITS: Record<string, number> = {
    free: 0,           // Free tier: 10 lifetime fuels, no monthly reset
    starter: 50,       // Starter plan: 50 fuels/month
    pro: 200,          // Pro plan: 200 fuels/month
    business: 900,     // Business plan: 900 fuels/month
};

export async function GET(req: NextRequest) {
    try {
        // Verify cron secret for security (optional but recommended)
        const authHeader = req.headers.get("authorization");
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!db) {
            return NextResponse.json({ error: "Firestore not available" }, { status: 500 });
        }

        const today = new Date();
        const usersRef = db.collection("users");

        // Get all users (you may want to paginate this for large user bases)
        const snapshot = await usersRef.get();

        let resetCount = 0;
        const batch = db.batch();

        snapshot.forEach((doc) => {
            const data = doc.data();
            const billingCycleStart = data.billingCycleStart?.toDate();

            // Skip if no billing cycle set
            if (!billingCycleStart) return;

            // Calculate days since billing cycle started
            const daysSinceStart = Math.floor((today.getTime() - billingCycleStart.getTime()) / (1000 * 60 * 60 * 24));

            // Reset if it's been 30 days or more
            if (daysSinceStart >= 30) {
                const tier = data.tier || "free";
                const newPlanCredits = PLAN_CREDITS[tier] || 0;

                batch.update(doc.ref, {
                    planCredits: newPlanCredits,
                    billingCycleStart: today
                });

                resetCount++;
            }
        });

        await batch.commit();

        return NextResponse.json({
            success: true,
            message: `Reset planCredits for ${resetCount} users`,
            timestamp: today.toISOString()
        });

    } catch (error: unknown) {
        console.error("Credit reset error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
