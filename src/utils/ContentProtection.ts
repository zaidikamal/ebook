/**
 * Content Protection Utility for Kutubi Platform
 * Provides Watermarking simulation and expiring link generation.
 */

export const generateSecureLink = (bookId: string, userId: string): string => {
  const timestamp = Date.now();
  const expiry = timestamp + 3600000; // 1 hour expiry
  // In a real app, this would be a signed JWT from the backend
  return `https://kutubi-secure-cdn.com/d/${bookId}?u=${userId}&exp=${expiry}&sig=hmac_verified_${Math.random().toString(36).substring(7)}`;
};

export const applyWatermark = (userName: string, content: string): string => {
  // Simulated watermarking logic for PDF/ePub
  const watermarkText = `\n\n--- ملكية حصرية لـ ${userName} | رقم العملية: ${Math.random().toString(36).toUpperCase()} ---\n--- تم الشراء عبر منصة كتبي الملكية ---`;
  return content + watermarkText;
};

export const downloadProtectedFile = (bookTitle: string, userName: string) => {
   const secureUrl = generateSecureLink('royal-bk-001', 'user-vip-777');
   console.log(`Initiating secure download: ${secureUrl}`);
   
   // Simulating the "Watermarking" process before download
   alert(`جاري تجهيز نسختك الملكية من "${bookTitle}"...\nيتم الآن ختم النسخة باسمك (${userName}) لمنع التسريب وضمان حقوق الملكية.`);
   
   setTimeout(() => {
     alert(`تم تجهيز النسخة بنجاح! الرابط المشفر سيفقد صلاحيته خلال 60 دقيقة.`);
   }, 2000);
};
