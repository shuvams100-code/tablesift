import { NextRequest, NextResponse } from 'next/server';
import { dodoClient } from '@/lib/dodo';
import { adminAuth } from '@/lib/firebase-admin';
import { getBaseUrl } from '@/lib/config';

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        console.log('Backend: Received Auth Header:', authHeader ? `Present (Length: ${authHeader.length})` : 'Missing');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        if (!adminAuth) {
            return NextResponse.json({ error: 'Internal Server Error: Firebase Admin not initialized' }, { status: 500 });
        }
        const decodedToken = await adminAuth.verifyIdToken(token);
        const userId = decodedToken.uid;
        const userEmail = decodedToken.email;

        const { productId, planName, monthlyCredits } = await req.json();

        if (!productId || !planName || !monthlyCredits) {
            return NextResponse.json({ error: 'Missing productId, planName or monthlyCredits' }, { status: 400 });
        }

        // Create subscription checkout via Dodo SDK (Official modern method)
        // We use @ts-ignore because the local SDK types might not yet reflect the latest checkoutSessions API,
        // but the runtime supports it.
        try {
            const baseUrl = getBaseUrl();
            const returnUrl = `${baseUrl}/dashboard?subscribed=true`;
            console.log('Creating Dodo Subscription checkout:', { productId, userId, returnUrl });

            // @ts-ignore
            const session = await dodoClient.checkoutSessions.create({
                customer: {
                    email: userEmail || '',
                    name: decodedToken.name || 'Customer',
                },
                product_cart: [
                    {
                        product_id: productId,
                        quantity: 1,
                    }
                ],
                billing_address: {
                    city: 'Not Provided',
                    country: 'IN', // Default country code
                    state: 'Not Provided',
                    street: 'Not Provided',
                    zipcode: '000000',
                },
                metadata: {
                    user_id: userId,
                    plan_name: planName,
                    monthly_credits: monthlyCredits.toString(),
                    type: 'subscription',
                },
                return_url: returnUrl,
            });

            return NextResponse.json({
                checkoutUrl: session.checkout_url,
                // @ts-ignore
                checkoutId: session.checkout_session_id,
            });
        } catch (dodoError: any) {
            console.error('Dodo SDK Error Detail:', {
                message: dodoError.message,
                status: dodoError.status,
                data: dodoError.response?.data
            });
            return NextResponse.json(
                { error: dodoError.message || 'Dodo API error' },
                { status: dodoError.status || 500 }
            );
        }

    } catch (error: any) {
        console.error('Subscription creation system error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
