import { NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';

// Demo account configuration
const DEMO_ACCOUNT_EMAIL = 'shuvams100@gmail.com';
const DEMO_ACCOUNT_FUEL_COUNT = 7500;

/**
 * POST /api/admin/reset-demo
 * Resets the demo account (shuvams100@gmail.com) to 7500 fuels and business tier.
 * This endpoint is protected by a simple secret key.
 * 
 * Usage: POST /api/admin/reset-demo with header Authorization: Bearer <ADMIN_SECRET>
 */
export async function POST(req: Request) {
    try {
        // Simple secret key protection
        const authHeader = req.headers.get('Authorization');
        const expectedSecret = process.env.ADMIN_SECRET || 'tablesift-demo-reset-2024';

        if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!adminAuth || !db) {
            return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
        }

        // Get user by email
        const userRecord = await adminAuth.getUserByEmail(DEMO_ACCOUNT_EMAIL);

        if (!userRecord) {
            return NextResponse.json({ error: 'Demo account not found' }, { status: 404 });
        }

        // Update Firestore
        const userRef = db.collection('users').doc(userRecord.uid);

        await userRef.set({
            tier: 'business',
            planCredits: DEMO_ACCOUNT_FUEL_COUNT,
            refillCredits: 0,
            subscriptionStatus: 'active',
            email: DEMO_ACCOUNT_EMAIL,
            isDemoAccount: true,
            updatedAt: new Date()
        }, { merge: true });

        return NextResponse.json({
            success: true,
            message: `Demo account reset successfully`,
            details: {
                email: DEMO_ACCOUNT_EMAIL,
                uid: userRecord.uid,
                planCredits: DEMO_ACCOUNT_FUEL_COUNT,
                tier: 'business'
            }
        });

    } catch (error) {
        console.error('Error resetting demo account:', error);
        return NextResponse.json({
            error: 'Failed to reset demo account',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// GET endpoint to check current demo account status
export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        const expectedSecret = process.env.ADMIN_SECRET || 'tablesift-demo-reset-2024';

        if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!adminAuth || !db) {
            return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
        }

        const userRecord = await adminAuth.getUserByEmail(DEMO_ACCOUNT_EMAIL);
        const userRef = db.collection('users').doc(userRecord.uid);
        const docSnap = await userRef.get();

        if (!docSnap.exists) {
            return NextResponse.json({ error: 'Demo account document not found' }, { status: 404 });
        }

        const data = docSnap.data();

        return NextResponse.json({
            email: DEMO_ACCOUNT_EMAIL,
            uid: userRecord.uid,
            planCredits: data?.planCredits ?? 0,
            refillCredits: data?.refillCredits ?? 0,
            tier: data?.tier ?? 'unknown',
            subscriptionStatus: data?.subscriptionStatus ?? 'unknown'
        });

    } catch (error) {
        console.error('Error checking demo account:', error);
        return NextResponse.json({
            error: 'Failed to check demo account',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
