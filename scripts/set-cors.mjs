/**
 * Script to configure CORS on Firebase Storage bucket.
 * Usage: node scripts/set-cors.mjs
 * Requires: npm install -g firebase-tools, then firebase login
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { readFileSync } from 'fs';

// Read service account key (must be placed in project root as service-account.json)
let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync('./service-account.json', 'utf8'));
} catch {
  console.error('❌ service-account.json not found!');
  console.log('👉 Download it from Firebase Console → Project Settings → Service Accounts → Generate new private key');
  process.exit(1);
}

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'kutubi-prod.firebasestorage.app',
});

const corsConfig = [
  {
    origin: ['*'],
    method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
    maxAgeSeconds: 3600,
    responseHeader: [
      'Content-Type',
      'Access-Control-Allow-Origin',
      'Content-Disposition',
      'x-goog-resumable',
    ],
  },
];

async function setCors() {
  try {
    const bucket = getStorage().bucket();
    await bucket.setCorsConfiguration(corsConfig);
    console.log('✅ CORS configured successfully on:', bucket.name);
    console.log('🚀 Firebase Storage uploads should now work from the browser!');
  } catch (error) {
    console.error('❌ Error setting CORS:', error.message);
  }
}

setCors();
