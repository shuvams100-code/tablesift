
import { db, adminAuth } from '../src/lib/firebase-admin';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function upgradeUser() {
    console.log('Target Email:', 'shuvams100@gmail.com');
    try {
        if (!adminAuth || !db) {
            throw new Error('Firebase Admin not initialized. Check .env.local credentials.');
        }

        // LIST ALL USERS to find the correct UID if email lookup fails
        // This is optional but helpful for debugging
        // const listUsersResult = await adminAuth.listUsers(10);
        // listUsersResult.users.forEach((userRecord) => {
        //   console.log('user', userRecord.toJSON());
        // });

        // 1. Get User by Email
        const userRecord = await adminAuth.getUserByEmail('shuvams100@gmail.com');
        console.log(`Found user: ${userRecord.uid} (${userRecord.email})`);

        // 2. Update Firestore
        const userRef = db.collection('users').doc(userRecord.uid);
        const docSnap = await userRef.get();

        if (!docSnap.exists) {
            console.error('User document not found in Firestore!');
            // Ideally create it if missing, but for now just error
            return;
        }

        await userRef.update({
            tier: 'business',
            planCredits: 7500, // Demo account with high fuel count
            refillCredits: 0,
            subscriptionStatus: 'active',
            updatedAt: new Date()
        });

        console.log('Successfully upgraded demo account to "business" tier with 7500 plan credits.');

    } catch (error) {
        console.error('Error upgrading user:', error);
    }
}

upgradeUser();
