import { db, auth } from './firebase';
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc, addDoc, serverTimestamp, query, where } from 'firebase/firestore';

/**
 * Add a book to the current user's personal library in Firestore.
 */
export async function addBookToLibrary(bookId: string): Promise<void> {
  const user = auth?.currentUser;
  if (!user) {
    // Fallback to localStorage for guests
    const ownedBooks = JSON.parse(localStorage.getItem('ownedBooks') || '[]');
    if (!ownedBooks.includes(bookId)) {
      ownedBooks.push(bookId);
      localStorage.setItem('ownedBooks', JSON.stringify(ownedBooks));
    }
    return;
  }

  try {
    await setDoc(doc(db, 'users', user.uid, 'library', bookId), {
      bookId,
      addedAt: new Date().toISOString()
    });
    console.log(`Book ${bookId} added to Firestore library.`);
  } catch (e) {
    console.error("Error adding book to Firestore:", e);
    throw e;
  }
}

/**
 * Fetch all book IDs owned by the current user from Firestore.
 */
export async function getLibraryBookIds(): Promise<string[]> {
  const user = auth?.currentUser;
  if (!user) {
    return JSON.parse(localStorage.getItem('ownedBooks') || '[]');
  }

  try {
    const libraryRef = collection(db, 'users', user.uid, 'library');
    const snapshot = await getDocs(libraryRef);
    return snapshot.docs.map(doc => doc.id);
  } catch (e) {
    console.error("Error fetching library from Firestore:", e);
    return JSON.parse(localStorage.getItem('ownedBooks') || '[]');
  }
}

/**
 * Check if the user owns a specific book (Firestore-backed).
 */
export async function userOwnsBook(bookId: string): Promise<boolean> {
  const user = auth?.currentUser;
  if (!user) {
    const ids = await getLibraryBookIds();
    return ids.includes(bookId);
  }

  try {
    const docRef = doc(db, 'users', user.uid, 'library', bookId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (e) {
    console.error("Error checking book ownership in Firestore:", e);
    return false;
  }
}

/**
 * Remove a book from the user's library.
 */
export async function removeBookFromLibrary(bookId: string): Promise<void> {
  const user = auth?.currentUser;
  if (!user) {
    const ownedBooks = JSON.parse(localStorage.getItem('ownedBooks') || '[]');
    const updated = ownedBooks.filter((id: string) => id !== bookId);
    localStorage.setItem('ownedBooks', JSON.stringify(updated));
    return;
  }

  try {
    await deleteDoc(doc(db, 'users', user.uid, 'library', bookId));
  } catch (e) {
    console.error("Error removing book from Firestore:", e);
  }
}

/**
 * NEW: Save a purchase to the global 'purchases' collection.
 */
export async function savePurchase(userId: string, bookId: string, price: number): Promise<void> {
  try {
    const purchaseRef = collection(db, 'purchases');
    await addDoc(purchaseRef, {
      userId,
      bookId,
      price,
      paymentMethod: 'paypal',
      createdAt: serverTimestamp()
    });
    console.log(`Purchase saved for user ${userId} and book ${bookId}`);
  } catch (e) {
    console.error("Error saving purchase to Firestore:", e);
    throw e;
  }
}

/**
 * NEW: Check if a user has purchased a book.
 */
export async function checkPurchase(userId: string, bookId: string): Promise<boolean> {
  if (!userId) {
    const ownedBooks = JSON.parse(localStorage.getItem('ownedBooks') || '[]');
    return ownedBooks.includes(bookId);
  }

  try {
    const q = query(
      collection(db, 'purchases'),
      where('userId', '==', userId),
      where('bookId', '==', bookId)
    );
    const snapshot = await getDocs(q);
    
    // Fallback to library subcollection check just in case for older purchases
    if (snapshot.empty) {
      const oldDocRef = doc(db, 'users', userId, 'library', bookId);
      const oldSnap = await getDoc(oldDocRef);
      return oldSnap.exists();
    }
    
    return !snapshot.empty;
  } catch (e) {
    console.error("Error checking purchase in Firestore:", e);
    return false;
  }
}
