export const formattedAuthor = (author?: string | string[] | null): string => {
  if (!author) return '';
  const authorStr = Array.isArray(author) ? author[0] : author;
  if (!authorStr || typeof authorStr !== 'string' || authorStr.trim() === 'الموقر') return '';
  return authorStr.trim();
};
