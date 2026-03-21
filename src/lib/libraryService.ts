import { supabase } from './supabaseClient';

/**
 * Add a book to the current user's personal library.
 * Falls back to localStorage if the user is not authenticated.
 */
export async function addBookToLibrary(bookId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { error } = await supabase
      .from('personal_library')
      .upsert({ user_id: user.id, book_id: bookId }, { onConflict: 'user_id,book_id' });
    if (error) console.error('Supabase library insert error:', error);
  } else {
    // Fallback for demo / unauthenticated users
    const ownedBooks = JSON.parse(localStorage.getItem('ownedBooks') || '[]');
    if (!ownedBooks.includes(bookId)) {
      ownedBooks.push(bookId);
      localStorage.setItem('ownedBooks', JSON.stringify(ownedBooks));
    }
  }
}

/**
 * Fetch all book IDs owned by the current user.
 * Falls back to localStorage if the user is not authenticated.
 */
export async function getLibraryBookIds(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data, error } = await supabase
      .from('personal_library')
      .select('book_id')
      .eq('user_id', user.id);
    if (error) {
      console.error('Supabase library fetch error:', error);
      return [];
    }
    return data?.map((row: { book_id: string }) => row.book_id) || [];
  } else {
    // Fallback for demo / unauthenticated users
    return JSON.parse(localStorage.getItem('ownedBooks') || '[]');
  }
}

/**
 * Check if the user owns a specific book.
 */
export async function userOwnsBook(bookId: string): Promise<boolean> {
  const ids = await getLibraryBookIds();
  return ids.includes(bookId);
}
