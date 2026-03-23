import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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
const app = isConfigValid ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null as any;
export const db = app ? getFirestore(app) : null as any;
export const storage = app ? getStorage(app) : null as any;

export default app;
