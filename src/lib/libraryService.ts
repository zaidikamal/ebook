/**
 * Add a book to the current user's personal library.
 * Uses localStorage for local persistence.
 */
export async function addBookToLibrary(bookId: string): Promise<void> {
  const ownedBooks = JSON.parse(localStorage.getItem('ownedBooks') || '[]');
  if (!ownedBooks.includes(bookId)) {
    ownedBooks.push(bookId);
    localStorage.setItem('ownedBooks', JSON.stringify(ownedBooks));
  }
}

/**
 * Fetch all book IDs owned by the current user.
 */
export async function getLibraryBookIds(): Promise<string[]> {
  return JSON.parse(localStorage.getItem('ownedBooks') || '[]');
}

/**
 * Check if the user owns a specific book.
 */
export async function userOwnsBook(bookId: string): Promise<boolean> {
  const ids = await getLibraryBookIds();
  return ids.includes(bookId);
}
