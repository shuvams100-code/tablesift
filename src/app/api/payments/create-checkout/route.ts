import { NextRequest, NextResponse } from 'next/server';
import { dodoClient } from '@/lib/dodo';
import { adminAuth } from '@/lib/firebase-admin';
import { getBaseUrl } from '@/lib/config';

export async function POST(req: NextRequest) {
    try {
        // 1. Verify user authentication
        const authHeader = req.headers.get('Authorization');
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

        // 2. Get product selection from request
        const { productId, credits } = await req.json();

        if (!productId || !credits) {
            return NextResponse.json({ error: 'Missing productId or credits' }, { status: 400 });
        }

        // 3. Create Checkout Session via Dodo SDK (for hosted page)
        console.log('Creating Dodo Payment checkout session:', { productId, userId, returnUrl });

        // @ts-ignore
        const session = await dodoClient.checkoutSessions.create({
            billing_address: {
                city: 'Not Provided',
                country: 'IN', // Default, Dodo will adjust based on actual customer loc
                state: 'Not Provided',
                street: 'Not Provided',
                zipcode: '000000',
            },
            customer: {
                email: userEmail || '',
                name: decodedToken.name || 'Customer',
            },
            product_cart: [
                {
                    product_id: productId,
                    quantity: 1,
                },
            ],
            metadata: {
                user_id: userId,
                credits: credits.toString(),
                type: 'credit_topup',
            },
            return_url: returnUrl,
        });

        console.log('Dodo Session Created:', JSON.stringify(session, null, 2));

        if (!session.checkout_url) {
            console.error('CRITICAL: Dodo session created but checkout_url is missing!', session);
        }

        return NextResponse.json({
            checkoutUrl: session.checkout_url,
            paymentId: session.payment_id || session.checkout_session_id,
        });

    } catch (error: any) {
        console.error('Dodo payment creation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create payment' },
            { status: 500 }
        );
    }
}
