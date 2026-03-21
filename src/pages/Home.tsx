import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';

const KUTUBI_ORIGINALS = [
  { id: 'original-1', title: 'مقدمة ابن خلدون', author: 'ابن خلدون', coverImage: 'https://images.unsplash.com/photo-1589998059171-d88d664a2a0f?auto=format&fit=crop&q=80&w=400', rating: 5.0, price: 45.00 },
  { id: 'original-2', title: 'ألف ليلة وليلة', author: 'تراث شعبي', coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400', rating: 4.9, price: 29.99 },
  { id: 'original-3', title: 'كليلة ودمنة', author: 'عبد الله بن المقفع', coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400', rating: 4.8, price: 19.99 },
  { id: 'original-4', title: 'ديوان المتنبي', author: 'أبو الطيب المتنبي', coverImage: 'https://images.unsplash.com/photo-1532012197367-6849412a52cd?auto=format&fit=crop&q=80&w=400', rating: 5.0, price: 35.00 },
  { id: 'original-5', title: 'طوق الحمامة', author: 'ابن حزم الأندلسي', coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400', rating: 4.7, price: 25.00 },
  { id: 'original-6', title: 'حي بن يقظان', author: 'ابن طفيل', coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400', rating: 4.9, price: 22.00 },
  { id: 'original-7', title: 'البخلاء', author: 'الجاحظ', coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400', rating: 4.6, price: 15.00 },
  { id: 'original-8', title: 'رسالة الغفران', author: 'أبو العلاء المعري', coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b81ae1a3?auto=format&fit=crop&q=80&w=400', rating: 4.8, price: 27.50 },
].map(b => ({ ...b, _id: `ko:${b.id}` }));

const HomePage = () => {
  const [mustReads, setMustReads] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        // Start with Originals to ensure immediate visibility
        setMustReads(KUTUBI_ORIGINALS.slice(0, 4));
        setNewArrivals(KUTUBI_ORIGINALS.slice(4, 8));

        // Attempt to fetch Arabic Literature from Google Books
        let resp1, resp2;
        try {
          const timeout = (ms: number) => new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));
          
          resp1 = await Promise.race([
            axios.get('https://www.googleapis.com/books/v1/volumes?q=intitle:أدب+عربي&maxResults=8&orderBy=relevance&langRestrict=ar'),
            timeout(3000)
          ]) as any;
          
          resp2 = await Promise.race([
            axios.get('https://www.googleapis.com/books/v1/volumes?q=subject:history&maxResults=8&langRestrict=ar'),
            timeout(3000)
          ]) as any;
        } catch (apiErr) {
          console.warn("Google Books throttled or slow, keeping originals + fallbacks...");
        }
        
        const formatBooks = (items: any[], prefix = 'gb') => items?.map(item => ({
          _id: `${prefix}:${item.id}`,
          title: item.volumeInfo?.title || item.title || 'عنوان ملكي',
          author: item.volumeInfo?.authors?.[0] || item.authors?.[0]?.name || item.metadata?.creator || 'مؤلف موقر',
          price: prefix === 'gb' ? (15.99 + Math.random() * 20) : 0, 
          coverImage: item.volumeInfo?.imageLinks?.thumbnail?.replace('http:', 'https:') || 
                      (prefix === 'pg' ? `https://www.gutenberg.org/cache/epub/${item.id}/pg${item.id}.cover.medium.jpg` : 
                       prefix === 'ia' ? `https://archive.org/services/img/${item.id}` :
                       '/placeholder.png'),
          rating: item.volumeInfo?.averageRating || 4.5
        })) || [];

        if (resp1?.data?.items) {
           setMustReads(formatBooks(resp1.data.items, 'gb'));
        }
        if (resp2?.data?.items) {
           setNewArrivals(formatBooks(resp2.data.items, 'gb'));
        }

        // If Google failed, augment with Gutenberg/Archive but don't clear originals if they are better
        if (!resp1?.data?.items) {
          const gutResp = await axios.get('https://gutendex.com/books/?languages=ar&topic=literature').catch(() => ({ data: { results: [] } }));
          if (gutResp.data.results?.length > 0) {
            setMustReads(prev => [...prev.filter(b => b._id.startsWith('ko')), ...formatBooks(gutResp.data.results.slice(0, 4), 'pg')]);
          }
        }

        if (!resp2?.data?.items) {
          const iaResp = await axios.get('https://archive.org/advancedsearch.php?q=subject:history&output=json&rows=8').catch(() => ({ data: { response: { docs: [] } } }));
          if (iaResp.data.response?.docs?.length > 0) {
             setNewArrivals(prev => [...prev.filter(b => b._id.startsWith('ko')), ...iaResp.data.response.docs.slice(0, 4).map((item: any) => ({
                _id: `ia:${item.identifier}`,
                title: item.title,
                author: item.creator || 'مؤرخ مجهول',
                price: 0,
                coverImage: `https://archive.org/services/img/${item.identifier}`,
                rating: 4.5
             }))]);
          }
        }
      } catch (err) {
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="bg-surface min-h-screen text-slate-100 font-jakarta selection:bg-gold-500/30 overflow-x-hidden" dir="rtl">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-600/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-amiri font-black mb-8 leading-tight">
              <span className="block gold-text">مكتبة المستقبل</span>
              <span className="text-white">بين يديك الآن</span>
            </h1>
            <p className="max-w-2xl mx-auto text-slate-400 text-xl md:text-2xl leading-relaxed mb-12 font-medium">
              اكتشف خبايا المعرفة في أفخم منصة عربية للكتب الإلكترونية. اختر من بين ملايين العناوين العالمية والمحلية.
            </p>
            <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-6">
              <button className="gold-button px-12 py-6 rounded-3xl font-black text-xl shadow-2xl transform hover:scale-105 transition-all">
                ابدأ رحلتك المعرفية
              </button>
              <button className="bg-surface-container-low border border-gold-900/20 px-12 py-6 rounded-3xl font-bold text-xl hover:bg-gold-500/5 transition-all">
                أحدث الإضافات
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-16 px-4">
             <div className="text-right">
               <h2 className="text-4xl md:text-5xl font-amiri font-black gold-text mb-4">كنوز الأدب العربي</h2>
               <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">مختارات حصرية من أرقى المجموعات</p>
             </div>
             <button className="hidden md:block text-gold-400 font-black hover:text-gold-300 transition-colors">عرض الكل ←</button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="aspect-[3/4] bg-surface-container-low animate-pulse rounded-[2.5rem] border border-gold-900/10"></div>
               ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {mustReads.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* History Section */}
      <section className="py-24 px-6 bg-surface-container-lowest/30">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-16 px-4">
             <div className="text-right">
               <h2 className="text-4xl md:text-5xl font-amiri font-black gold-text mb-4">ذاكرة التاريخ</h2>
               <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">استكشف أحداث الماضي برؤية ملكية</p>
             </div>
          </div>

          {loading ? (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[2/3] bg-surface-container-low animate-pulse rounded-3xl"></div>
                ))}
             </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {newArrivals.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats / Royal Banner */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="bg-gradient-to-br from-gold-900/30 to-surface-container-low rounded-[4rem] p-12 md:p-24 border border-gold-900/20 text-center relative overflow-hidden ring-1 ring-gold-500/10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] opacity-10 pointer-events-none"></div>
            <h2 className="text-5xl md:text-7xl font-amiri font-black mb-12 gold-text leading-tight max-w-4xl mx-auto">انضم إلى مجتمع الصفوة من القراء الموقرين</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 max-w-3xl mx-auto">
               <div>
                  <p className="text-4xl font-amiri font-black text-white mb-2">+2M</p>
                  <p className="text-gold-500/60 font-black text-xs uppercase">كتاب حصري</p>
               </div>
               <div>
                  <p className="text-4xl font-amiri font-black text-white mb-2">150K</p>
                  <p className="text-gold-500/60 font-black text-xs uppercase">عضو مفعل</p>
               </div>
               <div className="col-span-2 md:col-span-1">
                  <p className="text-4xl font-amiri font-black text-white mb-2">50+</p>
                  <p className="text-gold-500/60 font-black text-xs uppercase">دولة مشاركة</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
