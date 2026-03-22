import { useState, useEffect } from 'react';
import axios from 'axios';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import { Link } from 'react-router-dom';
import { formattedAuthor } from '../utils/formatters';

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
          author: formattedAuthor(item.volumeInfo?.authors?.[0] || item.authors?.[0]?.name || item.metadata?.creator) || 'مؤلف موقر',
          price: prefix === 'gb' ? (15.99 + Math.random() * 20) : 0, 
          coverImage: item.volumeInfo?.imageLinks?.thumbnail?.replace('http:', 'https:') || 
                      (prefix === 'pg' ? `https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400` : 
                       prefix === 'ia' ? `https://images.unsplash.com/photo-1532012197367-6849412a52cd?auto=format&fit=crop&q=80&w=400` :
                       '/placeholder.png'),
          rating: item.volumeInfo?.averageRating || 4.5
        })) || [];

        // 4. Fetch Approved Books from Firestore
        const q = query(
          collection(db, 'uploads'), 
          where('status', '==', 'approved'),
          limit(8)
        );
        const querySnapshot = await getDocs(q);
        const approvedRoyal = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            _id: `royal:${doc.id}`,
            title: data.title,
            author: data.author,
            price: data.price,
            coverImage: data.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
            rating: 5.0,
            isRoyal: true
          };
        });

        if (resp1?.data?.items) {
           setMustReads(formatBooks(resp1.data.items, 'gb'));
        }
        if (resp2?.data?.items) {
           // Prepend approved royal books to new arrivals
           const formattedGB = formatBooks(resp2.data.items, 'gb');
           setNewArrivals([...approvedRoyal, ...formattedGB]);
        } else if (approvedRoyal.length > 0) {
           setNewArrivals(prev => [...approvedRoyal, ...prev]);
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
                author: formattedAuthor(item.creator) || 'مؤرخ مجهول',
                price: 0,
                coverImage: `https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400`,
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
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/C:/Users/EZ-ZAIDI/.gemini/antigravity/brain/4af9e354-49c4-4d63-b3d6-ab6f35f76016/royal_library_hero_bg_1774208611671.png" 
            alt="Royal Library" 
            className="w-full h-full object-cover scale-110 animate-subtle-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface/20 via-surface/60 to-surface"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-surface opacity-40"></div>
        </div>

        <div className="container mx-auto text-center relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-black uppercase tracking-[0.3em] mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse"></span>
              المكان الأرقى للمعرفة
            </div>
            <h1 className="text-7xl md:text-9xl font-amiri font-black mb-10 leading-[1.1] text-white">
              <span className="block opacity-90">مكتبة</span>
              <span className="gold-text">المستقبل</span>
            </h1>
            <p className="max-w-3xl mx-auto text-on-surface-variant text-xl md:text-2xl leading-relaxed mb-16 font-medium bg-surface/10 backdrop-blur-sm rounded-3xl p-6">
              اكتشف خبايا المعرفة في أفخم منصة عربية للكتب الإلكترونية. اختر من بين ملايين العناوين العالمية والمحلية برؤية ملكية فريدة.
            </p>
            <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-8">
              <Link to="/search">
                <button className="gold-button">
                  ابدأ رحلتك المعرفية
                </button>
              </Link>
              <Link to="/search?sort=newest">
                <button className="px-12 py-5 rounded-2xl font-black text-xl text-white border border-gold-500/20 hover:bg-gold-500/5 transition-all backdrop-blur-md">
                   أحدث الإضافات
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gold-500/40">
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">اسحب للأسفل</span>
           <div className="w-[1px] h-12 bg-gradient-to-b from-gold-500/50 to-transparent"></div>
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
             <Link to="/search">
               <button className="hidden md:block text-gold-400 font-black hover:text-gold-300 transition-colors">عرض الكل ←</button>
             </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="aspect-[3/4] bg-surface-container-low animate-pulse rounded-[2.5rem] border border-gold-900/10"></div>
               ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {mustReads.map((book, index) => (
                <BookCard key={book._id} book={book} isPriority={index < 4} />
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
