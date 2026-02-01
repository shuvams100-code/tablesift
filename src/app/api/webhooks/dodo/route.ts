import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import * as admin from 'firebase-admin';
import { db } from '@/lib/firebase-admin';

/**
 * Dodo Payments Webhook Handler
 * 
 * Verifies signatures and updates user credits/subscription status in Firestore.
 */

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('webhook-signature');
    const msgId = req.headers.get('webhook-id');
    const timestamp = req.headers.get('webhook-timestamp');
    const secret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET;

    // 1. Verify Signature
    if (!signature || !secret || !msgId || !timestamp) {
        console.error('Missing required webhook headers or secret');
        return new NextResponse('Invalid headers', { status: 401 });
    }

    // Dodo uses Svix-style signatures: v1,base64_hash
    const [version, signatureHash] = signature.split(',');

    if (version !== 'v1' || !signatureHash) {
        console.error('Invalid signature format');
        return new NextResponse('Invalid signature format', { status: 401 });
    }

    // Signed content is id.timestamp.body
    const toSign = `${msgId}.${timestamp}.${body}`;
    const hmac = crypto.createHmac('sha256', secret);
    const computedSignature = hmac.update(toSign).digest('base64');

    if (computedSignature !== signatureHash) {
        console.error('Signature mismatch');
        return new NextResponse('Invalid signature', { status: 401 });
    }

    // 2. Parse Event
    const event = JSON.parse(body);
    console.log('Dodo Webhook Event:', event.type);

    if (!db) {
        console.error('Firestore NOT available');
        return new NextResponse('Internal Server Error', { status: 500 });
    }

    try {
        const data = event.data;
        const metadata = data.metadata || (data.payload ? data.payload.metadata : {}) || {};

        console.log(`Webhook Processing: Event=${event.type}, Metadata=`, JSON.stringify(metadata));

        switch (event.type) {
            // --- ALL-ENCOMPASSING SUCCESSFUL COMPLETION EVENTS ---
            case 'checkout_session.completed':
            case 'checkout.session.completed':
            case 'payment.succeeded': {
                const userId = metadata.user_id || metadata.userId;
                const type = metadata.type;

                if (!userId) {
                    console.error('Webhook: userId missing in metadata. Available keys:', Object.keys(metadata));
                    break;
                }

                // Extract credits from any potential field
                const monthlyCredits = parseInt(metadata.monthly_credits || metadata.monthlyCredits || '0');
                const topupCredits = parseInt(metadata.credits || '0');
                const totalToAdd = monthlyCredits + topupCredits;

                if (totalToAdd > 0) {
                    const userRef = db.collection('users').doc(userId);
                    const updateData: any = {
                        lastPaymentId: data.payment_id || data.checkout_session_id || 'unknown',
                        lastPaymentDate: new Date(),
                        subscriptionStatus: 'active'
                    };

                    // Distinguish between plan update and refill
                    if (type === 'subscription' || monthlyCredits > 0) {
                        const planName = metadata.plan_name || metadata.planName || 'Pro';
                        updateData.tier = planName.toLowerCase();
                        updateData.planCredits = admin.firestore.FieldValue.increment(totalToAdd);
                        updateData.subscriptionId = data.subscription_id || data.subscriptionId || 'initial';
                    } else {
                        updateData.refillCredits = admin.firestore.FieldValue.increment(totalToAdd);
                    }

                    await userRef.update(updateData);
                    console.log(`Webhook: Successfully updated user ${userId}. Added ${totalToAdd} credits.`);
                } else {
                    console.warn('Webhook: No credits found to add in metadata');
                }
                break;
            }

            // --- SUBSCRIPTION LIFECYCLE EVENTS ---
            case 'subscription.created':
            case 'subscription.activate':
            case 'subscription.active': {
                const userId = metadata.user_id || metadata.userId;
                const planName = metadata.plan_name || metadata.planName;
                const monthlyCredits = parseInt(metadata.monthly_credits || metadata.monthlyCredits || '0');

                if (userId && (planName || monthlyCredits > 0)) {
                    const userRef = db.collection('users').doc(userId);
                    await userRef.update({
                        tier: (planName || 'Pro').toLowerCase(),
                        planCredits: admin.firestore.FieldValue.increment(monthlyCredits),
                        subscriptionId: data.subscription_id || data.subscriptionId,
                        subscriptionStatus: 'active',
                        billingCycleStart: new Date(),
                    });
                    console.log(`Webhook: Subscription verified for user ${userId}.`);
                }
                break;
            }

            // --- SUBSCRIPTION RENEWED ---
            case 'subscription.renewed': {
                const subscriptionId = data.subscription_id || data.subscriptionId;
                const usersSnapshot = await db.collection('users')
                    .where('subscriptionId', '==', subscriptionId)
                    .limit(1)
                    .get();

                if (!usersSnapshot.empty) {
                    const userDoc = usersSnapshot.docs[0];
                    const monthlyCredits = parseInt(metadata.monthly_credits || metadata.monthlyCredits || '150');

                    await userDoc.ref.update({
                        planCredits: monthlyCredits,
                        billingCycleStart: new Date(),
                        subscriptionStatus: 'active',
                    });
                    console.log(`Webhook: Subscription ${subscriptionId} renewed.`);
                }
                break;
            }

            // --- SUBSCRIPTION CANCELLED / EXPIRED ---
            case 'subscription.cancelled':
            case 'subscription.expired': {
                const subscriptionId = data.subscription_id || data.subscriptionId;
                const usersSnapshot = await db.collection('users')
                    .where('subscriptionId', '==', subscriptionId)
                    .limit(1)
                    .get();

                if (!usersSnapshot.empty) {
                    const userDoc = usersSnapshot.docs[0];
                    await userDoc.ref.update({
                        tier: 'free',
                        planCredits: 0,
                        subscriptionStatus: 'cancelled',
                    });
                    console.log(`Webhook: Subscription ${subscriptionId} ended.`);
                }
                break;
            }

            default:
                console.log('Webhook: Unhandled event type:', event.type);
        }

        return new NextResponse('OK', { status: 200 });

    } catch (err: any) {
        console.error('Webhook processing error:', err);
        return new NextResponse('Webhook Error', { status: 500 });
    }
}

// End of Webhook Route
