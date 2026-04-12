import { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import TrendingBookCard from '../components/TrendingBookCard';
import AdUnit from '../components/AdUnit';
import { Link } from 'react-router-dom';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { formattedAuthor } from '../utils/formatters';
import { Search } from 'lucide-react';

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
  const [trendingBooks, setTrendingBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setMustReads(KUTUBI_ORIGINALS.slice(0, 4));
        setNewArrivals(KUTUBI_ORIGINALS.slice(4, 8));
        setTrendingBooks(KUTUBI_ORIGINALS.slice(0, 6));

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
          console.warn('Google Books throttled or slow.');
        }

        const formatBooks = (items: any[], prefix = 'gb') => items?.map(item => ({
          _id: `${prefix}:${item.id}`,
          title: item.volumeInfo?.title || item.title || 'عنوان ملكي',
          author: formattedAuthor(item.volumeInfo?.authors?.[0] || item.authors?.[0]?.name || item.metadata?.creator) || 'مؤلف موقر',
          price: prefix === 'gb' ? (15.99 + Math.random() * 20) : 0,
          coverImage: item.volumeInfo?.imageLinks?.thumbnail?.replace('http:', 'https:') || '/placeholder.png',
          rating: item.volumeInfo?.averageRating || 4.5
        })) || [];

        const q = query(collection(db, 'books'), where('status', '==', 'approved'), limit(12));
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
            views: data.views || 0,
            isRoyal: true
          };
        });

        const sortedApproved = [...approvedRoyal].sort((a: any, b: any) => (b.views || 0) - (a.views || 0)).slice(0, 6);
        if (sortedApproved.length > 0) {
          setTrendingBooks(sortedApproved);
        }

        if (resp1?.data?.items) setMustReads(formatBooks(resp1.data.items, 'gb'));
        if (resp2?.data?.items) {
          setNewArrivals([...approvedRoyal, ...formatBooks(resp2.data.items, 'gb')]);
        } else if (approvedRoyal.length > 0) {
          setNewArrivals(prev => [...approvedRoyal, ...prev]);
        }

        if (!resp1?.data?.items) {
          const gutResp = await axios.get('https://gutendex.com/books/?languages=ar&topic=literature').catch(() => ({ data: { results: [] } }));
          if (gutResp.data.results?.length > 0) {
            setMustReads(prev => [...prev.filter((b: any) => b._id.startsWith('ko')), ...formatBooks(gutResp.data.results.slice(0, 4), 'pg')]);
          }
        }

        if (!resp2?.data?.items) {
          const iaResp = await axios.get('https://archive.org/advancedsearch.php?q=subject:history&output=json&rows=8').catch(() => ({ data: { response: { docs: [] } } }));
          if (iaResp.data.response?.docs?.length > 0) {
            setNewArrivals(prev => [...prev.filter((b: any) => b._id.startsWith('ko')), ...iaResp.data.response.docs.slice(0, 4).map((item: any) => ({
              _id: `ia:${item.identifier}`,
              title: item.title,
              author: formattedAuthor(item.creator) || 'مؤرخ مجهول',
              price: 0,
              coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400',
              rating: 4.5
            }))]);
          }
        }
      } catch (err) {
        console.error('Error fetching books:', err);
        setTrendingBooks(KUTUBI_ORIGINALS.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="bg-surface min-h-screen text-slate-100 overflow-x-hidden" dir="rtl">
      <Helmet>
        <title>منصة كتبي الملكية | كنوز المعرفة الرقمية 👑</title>
        <meta name="description" content="البوابة الأولى لتحميل الكتب النادرة والمخطوطات الملكية مجاناً وبأعلى جودة. تصفح آلاف العناوين الحصرية." />
        <link rel="canonical" href="https://ebook-mgv9.vercel.app/" />
      </Helmet>
      <Navbar />

      {/* ════ HERO SECTION ════ */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/royal-hero.png" alt="Royal Library" fetchPriority="high" loading="eager"
            className="w-full h-full object-cover scale-110 animate-subtle-zoom" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,9,14,0.1) 0%, rgba(10,9,14,0.55) 50%, rgba(10,9,14,1) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,9,14,0.7) 0%, transparent 40%, transparent 60%, rgba(10,9,14,0.7) 100%)' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 80%, rgba(212,175,55,0.06) 0%, transparent 60%)' }} />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${10 + i * 12}%`, bottom: `${10 + (i % 3) * 20}%`,
              width: i % 2 === 0 ? '2px' : '3px', height: i % 2 === 0 ? '2px' : '3px',
              animationDelay: `${i * 1.2}s`, animationDuration: `${6 + i * 2}s`,
            }} />
          ))}
        </div>

        <div className="container mx-auto text-center relative z-10 pt-16">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>

            {/* Eyebrow badge */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.7 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-10"
              style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', backdropFilter: 'blur(16px)', boxShadow: '0 0 30px rgba(212,175,55,0.1)' }}
            >
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" style={{ boxShadow: '0 0 8px rgba(212,175,55,0.8)' }} />
              <span className="text-gold-400 text-xs font-black uppercase tracking-[0.3em]">المنصة الذهبية للثقافة العربية</span>
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" style={{ boxShadow: '0 0 8px rgba(212,175,55,0.8)' }} />
            </motion.div>

            {/* Heading */}
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }}
              className="text-6xl sm:text-8xl md:text-9xl font-amiri font-black mb-8 leading-[1.05]">
              <span className="block text-white opacity-90 drop-shadow-2xl">مكتبة</span>
              <span className="block gold-text drop-shadow-2xl">المستقبل</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}
              className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl leading-relaxed mb-12 font-medium"
              style={{ background: 'rgba(10,9,14,0.3)', backdropFilter: 'blur(12px)', borderRadius: '1.5rem', padding: '1.25rem 2rem', border: '1px solid rgba(212,175,55,0.06)' }}
            >
              اكتشف خبايا المعرفة في أفخم منصة عربية. ملايين العناوين العالمية والمحلية برؤية ملكية فريدة.
            </motion.p>

            {/* 🔎 Integrated Search Bar (Classic Style) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }}
              className="max-w-3xl mx-auto mb-12 relative group"
            >
              <div className="absolute inset-0 bg-gold-500/10 blur-2xl group-hover:bg-gold-500/15 transition-all duration-500 rounded-3xl" />
              <div className="relative flex items-center bg-[#0d0d12]/80 backdrop-blur-3xl border border-gold-500/20 rounded-3xl p-2 pl-4 shadow-2xl overflow-hidden group-focus-within:border-gold-500/40 transition-all">
                <input 
                  type="text" 
                  placeholder="ابحث عن كتاب، مؤلف، أو مخطوطة نادرة..." 
                  className="w-full bg-transparent border-none outline-none py-4 px-6 text-xl text-white placeholder:text-slate-600 font-bold text-right"
                  dir="rtl"
                />
                <button className="gold-button h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Search className="text-black" />
                </button>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.6 }}
              className="flex flex-col sm:flex-row-reverse items-center justify-center gap-4">
              <Link to="/search"><button className="gold-button text-base px-10 py-4 font-black">ابدأ رحلتك المعرفية ✦</button></Link>
              <Link to="/search?sort=newest">
                <button className="px-10 py-4 rounded-2xl font-black text-base text-slate-300 transition-all duration-400 hover:text-white hover:bg-gold-500/5"
                  style={{ border: '1px solid rgba(212,175,55,0.15)', backdropFilter: 'blur(12px)' }}>
                  أحدث الإصدارات
                </button>
              </Link>
            </motion.div>

            {/* Mini Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.6 }}
              className="flex items-center justify-center gap-8 md:gap-16 mt-16">
              {[{ num: '+2M', label: 'كتاب' }, { num: '150K', label: 'قارئ' }, { num: '50+', label: 'دولة' }].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl md:text-3xl font-amiri font-black gold-text">{s.num}</p>
                  <p className="text-slate-600 text-xs font-black uppercase tracking-widest mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[9px] text-gold-500/30 font-black uppercase tracking-[0.3em]">اكتشف</span>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-[1px] h-14 bg-gradient-to-b from-gold-500/50 to-transparent" />
        </div>
      </section>

      {/* ════ TRENDING SECTION ════ */}
      {trendingBooks.length > 0 && (
        <section className="py-24 px-6 relative z-10 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 70%)' }} />
          <div className="container mx-auto relative z-10">
            <div className="flex flex-row-reverse items-center justify-between gap-4 mb-14">
              <div className="flex flex-row-reverse items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(234,88,12,0.1))', border: '1px solid rgba(212,175,55,0.25)', boxShadow: '0 0 30px rgba(212,175,55,0.15)' }}>
                  <LocalFireDepartmentIcon className="text-orange-400" style={{ fontSize: '28px' }} />
                </div>
                <div className="text-right">
                  <h2 className="text-4xl md:text-5xl font-amiri font-black text-white">المجلدات الأكثر رواجاً</h2>
                  <p className="text-gold-500/70 text-xs font-black uppercase tracking-widest mt-2">✦ الكنوز التي يقرأها الجميع الآن ✦</p>
                </div>
              </div>
              <Link to="/search" className="hidden md:flex items-center gap-1 text-sm text-slate-500 hover:text-gold-400 transition-colors font-black">عرض الكل ←</Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {trendingBooks.map((book, idx) => <TrendingBookCard key={book._id} book={book} rank={idx + 1} />)}
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-6 max-w-5xl">
        <AdUnit slot="1234567890" />
      </div>

      {/* ════ FEATURED BOOKS ════ */}
      <section className="py-24 px-6 relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.04) 0%, transparent 70%)', filter: 'blur(100px)' }} />
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-14 px-2">
            <div className="text-right">
              <motion.h2 initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
                className="text-4xl md:text-5xl font-amiri font-black gold-text mb-3">كنوز الأدب العربي</motion.h2>
              <p className="text-slate-600 font-black text-[10px] uppercase tracking-[0.3em]">✦ مختارات حصرية من أرقى المجموعات ✦</p>
            </div>
            <Link to="/search" className="hidden md:flex items-center gap-1 text-sm text-slate-500 hover:text-gold-400 transition-colors font-black">عرض الكل ←</Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
              {[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4.6] rounded-[2rem] border border-gold-900/10 img-shimmer" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {mustReads.map((book, index) => <BookCard key={book._id} book={book} isPriority={index < 4} />)}
            </div>
          )}
        </div>
      </section>

      {/* ════ HISTORY SECTION ════ */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(15,13,22,0.4), transparent)' }} />
        <div className="container mx-auto relative z-10">
          <div className="flex items-end justify-between mb-14 px-2">
            <div className="text-right">
              <motion.h2 initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
                className="text-4xl md:text-5xl font-amiri font-black gold-text mb-3">ذاكرة التاريخ</motion.h2>
              <p className="text-slate-600 font-black text-[10px] uppercase tracking-[0.3em]">✦ استكشف أحداث الماضي برؤية ملكية ✦</p>
            </div>
            <Link to="/search?subject=history" className="hidden md:flex items-center gap-1 text-sm text-slate-500 hover:text-gold-400 transition-colors font-black">عرض الكل ←</Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4.6] rounded-[2rem] border border-gold-900/10 img-shimmer" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((book) => <BookCard key={book._id} book={book} />)}
            </div>
          )}
        </div>
      </section>

      {/* ════ ROYAL BANNER ════ */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden text-center rounded-[3rem] p-14 md:p-24"
            style={{ background: 'linear-gradient(135deg, rgba(20,16,30,0.98) 0%, rgba(30,24,48,0.95) 50%, rgba(20,16,30,0.98) 100%)', border: '1px solid rgba(212,175,55,0.15)', boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.08) inset' }}
          >
            {/* Corner ornaments */}
            <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-gold-500/20 rounded-tr-2xl" />
            <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-gold-500/20 rounded-tl-2xl" />
            <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-gold-500/20 rounded-br-2xl" />
            <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-gold-500/20 rounded-bl-2xl" />
            {/* Glows */}
            <div className="absolute top-0 right-1/4 w-64 h-64 rounded-full blur-[100px] pointer-events-none" style={{ background: 'rgba(212,175,55,0.07)' }} />
            <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full blur-[100px] pointer-events-none" style={{ background: 'rgba(212,175,55,0.05)' }} />

            <div className="relative z-10">
              <p className="text-gold-500/60 text-xs font-black uppercase tracking-[0.4em] mb-6">✦ انضم إلى الصفوة ✦</p>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-amiri font-black gold-text mb-10 leading-tight max-w-4xl mx-auto">مجتمع القراء الموقرين</h2>
              <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto mb-12">
                {[{ num: '+2M', label: 'كتاب حصري' }, { num: '150K', label: 'عضو مفعل' }, { num: '50+', label: 'دولة مشاركة' }].map((s, i) => (
                  <div key={i} className="stat-card text-center py-5">
                    <p className="text-3xl font-amiri font-black gold-text">{s.num}</p>
                    <p className="text-gold-500/50 text-[10px] font-black uppercase tracking-widest mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <Link to="/search"><button className="gold-button text-base px-12 py-4">ابدأ رحلتك الآن 👑</button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
