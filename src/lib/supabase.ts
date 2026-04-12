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
    throw new Error('لم يتم تهيئة Supabase. يرجى التحقق من إعدادات البيئة VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY.');
  }

  // Validate file size (max 50MB for books, 10MB for covers)
  const maxSize = bucket === 'books' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > maxSize) {
    const maxMB = bucket === 'books' ? 50 : 10;
    throw new Error(`حجم الملف كبير جداً. الحد الأقصى هو ${maxMB}MB.`);
  }

  // Extract extension safely
  const extMatch = file.name.match(/\.[0-9a-z]+$/i);
  const ext = extMatch ? extMatch[0] : '';
  // Generate a fully random, safe alphanumeric key to avoid Arabic/special char issues
  const safeName = Math.random().toString(36).substring(2, 15);
  const fileName = `${Date.now()}_${safeName}${ext}`;
  const filePath = `${fileName}`;

  // Signal upload start
  onProgress?.(10);

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true, // Allow overwrite to avoid conflicts
      contentType: file.type || undefined,
    });

  if (error) {
    console.error('Supabase upload error:', error);
    // Provide user-friendly Arabic error messages
    if (error.message?.includes('not found') || error.message?.includes('Bucket not found')) {
      throw new Error(`مجلد التخزين "${bucket}" غير موجود. تواصل مع الدعم التقني.`);
    }
    if (error.message?.includes('security')) {
      throw new Error('خطأ في الصلاحيات. يرجى التأكد من تسجيل الدخول أولاً.');
    }
    if (error.message?.includes('Payload too large') || error.message?.includes('too large')) {
      throw new Error('حجم الملف أكبر من المسموح به.');
    }
    throw new Error(`فشل الرفع: ${error.message}`);
  }

  onProgress?.(90);

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  if (!urlData?.publicUrl) {
    throw new Error('لم يتم الحصول على رابط الملف المرفوع.');
  }

  onProgress?.(100);
  return urlData.publicUrl;
};

