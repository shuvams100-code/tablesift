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

        // 3. Create one-time payment via Dodo SDK
        const baseUrl = getBaseUrl();
        const returnUrl = `${baseUrl}/credits?success=true`;
        console.log('Creating Dodo Payment checkout:', { productId, userId, returnUrl });

        const payment = await dodoClient.payments.create({
            billing: {
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
            // Metadata to use in webhook
            metadata: {
                user_id: userId,
                credits: credits.toString(),
                type: 'credit_topup',
            },
            // Redirect URLs
            return_url: returnUrl,
        });

        // 4. Return checkout URL
        return NextResponse.json({
            checkoutUrl: payment.payment_link,
            paymentId: payment.payment_id,
        });

    } catch (error: any) {
        console.error('Dodo payment creation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create payment' },
            { status: 500 }
        );
    }
}
