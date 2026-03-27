/**
 * AI Categorization Utility for Kutubi Royal
 * Uses keyword matching and simple NLP heuristics to suggest categories.
 */

export const CATEGORIES = [
  'تاريخ', 'أدب', 'فلسفة', 'رواية / خيال', 'السير والتراجم', 
  'العلوم الطبيعية', 'الفنون والعمارة', 'الدين والفكر', 
  'علوم القرآن والحديث', 'المخطوطات النادرة', 'السياسة والاقتصاد', 
  'تطوير الذات', 'الشعر'
];

const KEYWORDS_MAP: Record<string, string[]> = {
  'تاريخ': ['تاريخ', 'قديم', 'حضارة', 'حروب', 'عصور', 'أمم', 'سلالة'],
  'أدب': ['نقد', 'رواية', 'قصص', 'أدبي', 'نثر', 'بلاغة'],
  'فلسفة': ['فلسفة', 'تفكر', 'منطق', 'وعي', 'وجود', 'أفلاطون', 'أرسطو'],
  'الدين والفكر': ['إسلام', 'فقه', 'عقيدة', 'شريعة', 'فكر', 'روحانية'],
  'الشعر': ['شعر', 'قصيدة', 'ديوان', 'قافية', 'بحر', 'أبيات'],
  'السياسة والاقتصاد': ['سياسة', 'اقتصاد', 'تجارة', 'إدارة', 'دولة', 'حكم'],
  'تطوير الذات': ['نجاح', 'تحفيز', 'تطوير', 'قدرات', 'مهارات', 'حياة'],
  'علوم القرآن والحديث': ['قرآن', 'تفسير', 'حديث', 'سنة', 'تجويد', 'قراءات']
};

export const suggestCategory = (title: string, description: string): string => {
  const combined = (title + ' ' + description).toLowerCase();
  
  let bestMatch = 'أدب'; // Default
  let maxHits = 0;

  for (const [category, keywords] of Object.entries(KEYWORDS_MAP)) {
    let hits = 0;
    keywords.forEach(kw => {
      if (combined.includes(kw)) hits++;
    });

    if (hits > maxHits) {
      maxHits = hits;
      bestMatch = category;
    }
  }

  return bestMatch;
};
