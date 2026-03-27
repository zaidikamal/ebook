/**
 * This script is intended to be run locally using Firebase Admin SDK
 * to grant admin privileges to a specific user.
 * 
 * Usage:
 * 1. Download your service account key from Firebase Console
 * 2. Set GOOGLE_APPLICATION_CREDENTIALS environment variable
 * 3. Run: node scripts/set-admin.js <user-email-or-uid>
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';

// Replace with path to your service account key
const serviceAccount = JSON.parse(readFileSync('./service-account.json', 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const identifier = process.argv[2];

if (!identifier) {
  console.error('Please provide a user email or UID');
  process.exit(1);
}

const setAdmin = async (id) => {
  try {
    let user;
    if (id.includes('@')) {
      user = await getAuth().getUserByEmail(id);
    } else {
      user = await getAuth().getUser(id);
    }

    await getAuth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`Successfully set admin claim for user: ${user.email} (${user.uid})`);
    
    // Verification
    const updatedUser = await getAuth().getUser(user.uid);
    console.log('Current claims:', updatedUser.customClaims);
  } catch (error) {
    console.error('Error setting admin claim:', error);
  }
};

setAdmin(identifier);
