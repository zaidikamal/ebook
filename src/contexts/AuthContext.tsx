import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, isFirebaseReady } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import * as Sentry from '@sentry/react';

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'user';
  avatar?: string;
  name?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  isFirebaseConfigured: false 
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Firebase isn't correctly configured, stop here instead of crashing
    if (!isFirebaseReady || !auth) {
      console.warn("🛡️ AuthProvider: Firebase is not configured. Falling back to Guest mode.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
         try {
           // Identify user in Sentry for better monitoring
           Sentry.setUser({
             id: firebaseUser.uid,
             email: firebaseUser.email || undefined,
           });

           const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
           const userData = userDoc.data();
           
           const syncedUser: UserProfile = {
             uid: firebaseUser.uid,
             email: firebaseUser.email,
             displayName: firebaseUser.displayName,
             role: userData?.role || (['admin@kutubi.com', 'fr.capsules20@gmail.com'].includes(firebaseUser.email || '') ? 'admin' : 'user'),
             avatar: userData?.avatar || localStorage.getItem('userAvatar') || '/avatars/royal-user.png',
             name: userData?.name || firebaseUser.displayName || 'مستخدم ملكي'
           };
           
           // Tag Sentry with user role
           Sentry.setTag('user_role', syncedUser.role);
           
           setUser(syncedUser);
           localStorage.setItem('user', JSON.stringify(syncedUser));

           // --- MIGRATION LOGIC ---
           // If we have books in localStorage, move them to Firestore
           const localBooks = JSON.parse(localStorage.getItem('ownedBooks') || '[]');
           if (localBooks.length > 0) {
             console.log(`🚀 Migrating ${localBooks.length} books to Firestore...`);
             for (const bookId of localBooks) {
               await setDoc(doc(db, 'users', firebaseUser.uid, 'library', bookId), {
                 bookId,
                 addedAt: new Date().toISOString(),
                 migrated: true
               }, { merge: true });
             }
             localStorage.removeItem('ownedBooks');
             console.log("✅ Migration complete. Local storage cleared.");
           }
           
           // One-time profile sync if missing in Firestore
           if (!userData) {
             await setDoc(doc(db, 'users', firebaseUser.uid), syncedUser, { merge: true });
           }
         } catch (e) {
           console.error("Auth sync error:", e);
           const fallback: UserProfile = {
             uid: firebaseUser.uid, 
             email: firebaseUser.email, 
             displayName: firebaseUser.displayName,
             role: ['admin@kutubi.com', 'fr.capsules20@gmail.com'].includes(firebaseUser.email || '') ? 'admin' : 'user',
             name: firebaseUser.displayName || 'مستخدم ملكي',
             avatar: localStorage.getItem('userAvatar') || '/avatars/royal-user.png'
           };
           setUser(fallback);
         }
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isFirebaseConfigured: isFirebaseReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
