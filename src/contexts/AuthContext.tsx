import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
         // Sync with Firestore to get role
         try {
           const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
           const userData = userDoc.data();
           const syncedUser = userData || {
             uid: firebaseUser.uid,
             email: firebaseUser.email,
             displayName: firebaseUser.displayName,
             role: firebaseUser.email === 'admin@kutubi.com' ? 'admin' : 'user'
           };
           setUser(syncedUser);
           localStorage.setItem('user', JSON.stringify(syncedUser));
         } catch (e) {
           console.error("Auth sync error:", e);
           setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role: 'user' });
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
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
