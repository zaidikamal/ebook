import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseReady = !!supabase;

/**
 * Uploads a file to Supabase Storage with progress tracking.
 * Returns the public URL of the uploaded file.
 */
export const uploadToSupabase = async (
  file: File,
  bucket: 'covers' | 'books',
  onProgress?: (progress: number) => void
): Promise<string> => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.');
  }

  // Extract extension safely
  const extMatch = file.name.match(/\.[0-9a-z]+$/i);
  const ext = extMatch ? extMatch[0] : '';
  // Generate a fully random, safe alphanumeric key to avoid Arabic/special char issues
  const safeName = Math.random().toString(36).substring(2, 15);
  const fileName = `${Date.now()}_${safeName}${ext}`;
  const filePath = `${fileName}`;

  // Supabase doesn't have native progress, so we simulate it
  onProgress?.(10);

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  onProgress?.(90);

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  if (!urlData?.publicUrl) {
    throw new Error('Could not get public URL for uploaded file.');
  }

  onProgress?.(100);
  return urlData.publicUrl;
};
