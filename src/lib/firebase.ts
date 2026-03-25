import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const getEnv = (name: string) => import.meta.env[`VITE_${name}`] || import.meta.env[`NEXT_PUBLIC_${name}`];

const firebaseConfig = {
  apiKey: getEnv('FIREBASE_API_KEY'),
  authDomain: getEnv('FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('FIREBASE_STORAGE_BUCKET') || "kutubi-prod.firebasestorage.app",
  messagingSenderId: getEnv('FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('FIREBASE_APP_ID'),
  measurementId: getEnv('FIREBASE_MEASUREMENT_ID')
};

// Guard against missing environment variables during build or initial deploy
const isConfigValid = !!import.meta.env.VITE_FIREBASE_API_KEY;

if (!isConfigValid) {
  console.error("⚠️ Firebase API Key is missing.");
  console.warn("Possible reasons:");
  console.warn("1. Env variables not added to Vercel Settings.");
  console.warn("2. Forgot to 'Redeploy' after adding variables.");
  console.warn("3. Missing 'VITE_' prefix in the variable name.");
}

// Initialize Firebase
if (isConfigValid) {
  console.log("🔥 Initializing Firebase with Project ID:", firebaseConfig.projectId);
  console.log("📦 Storage Bucket:", firebaseConfig.storageBucket);
}

const app = isConfigValid ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null as any;
export const db = app ? getFirestore(app) : null as any;
export const storage = app ? getStorage(app) : null as any;

export default app;
