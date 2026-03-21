import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<any>(null);
  const [relatedBooks, setRelatedBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isOwned, setIsOwned] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600 * 3 + 45 * 60); // 3h 45m dummy timer
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError(false);
      
      const type = id.split(':')[0];
      const realId = id.split(':').slice(1).join(':'); // handle IDs that may contain colons

      try {
        let formattedBook: any;

        if (type === 'gb') {
          const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${realId}`);
          const item = response.data;
          formattedBook = {
            _id: id,
            title: item.volumeInfo.title,
            author: item.volumeInfo.authors?.[0] || 'كاتب موقر',
            description: item.volumeInfo.description?.replace(/<[^>]*>?/gm, '') || 'وصف ملكي غير متوفر حالياً.',
            price: 24.99,
            originalPrice: 39.99,
            rating: item.volumeInfo.averageRating || 4.8,
            readers: Math.floor(Math.random() * 5000) + 1200,
            pages: item.volumeInfo.pageCount || '---',
            publisher: item.volumeInfo.publisher || 'دار نشر عالمية',
            publishedDate: item.volumeInfo.publishedDate || 'غير مؤرخ',
            coverImage: item.volumeInfo.imageLinks?.extraLarge?.replace('http:', 'https:') || 
                        item.volumeInfo.imageLinks?.large?.replace('http:', 'https:') ||
                        item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') ||
                        'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400',
            source: 'Google Books',
            categories: item.volumeInfo.categories || ['عام']
          };
        } else if (type === 'pg') {
          const response = await axios.get(`https://gutendex.com/books/${realId}`);
          const item = response.data;
          formattedBook = {
            _id: id,
            title: item.title,
            author: item.authors?.[0]?.name || 'مؤلف كلاسيكي',
            description: `هذا الكتاب من كنوز Project Gutenberg الكلاسيكية. متوفر للقراءة العامة كونه جزءاً من التراث الثقافي الإنساني.`,
            price: 0,
            rating: 4.9,
            readers: Math.floor(Math.random() * 10000) + 5000,
            pages: 'متغير',
            publisher: 'Project Gutenberg',
            publishedDate: 'كلاسيك',
            coverImage: `https://www.gutenberg.org/cache/epub/${realId}/pg${realId}.cover.medium.jpg`,
            source: 'Project Gutenberg',
            categories: item.subjects || ['Public Domain']
          };
        } else if (type === 'ia') {
          try {
            const response = await axios.get(`https://archive.org/metadata/${realId}`, { timeout: 8000 });
            const item = response.data;
            const meta = item?.metadata || {};
            formattedBook = {
              _id: id,
              title: meta.title || realId,
              author: Array.isArray(meta.creator) ? meta.creator[0] : (meta.creator || 'كاتب مجهول'),
              description: (typeof meta.description === 'string' ? meta.description : Array.isArray(meta.description) ? meta.description[0] : '')?.replace(/<[^>]*>?/gm, '') || 'مخطوطة أرشيفية نادرة من مكتبة الإنترنت العالمية.',
              price: 0,
              rating: 4.7,
              readers: Math.floor(Math.random() * 3000) + 800,
              pages: meta.page_count || '---',
              publisher: 'Internet Archive',
              publishedDate: meta.date || 'غير محدد',
              coverImage: `https://archive.org/services/img/${realId}`,
              source: 'Internet Archive',
              categories: meta.subject ? (Array.isArray(meta.subject) ? meta.subject : [meta.subject]) : ['Archive']
            };
          } catch (iaErr) {
            console.error('Archive.org fetch failed:', iaErr);
            // Create a minimal fallback so the page still renders
            formattedBook = {
              _id: id, title: realId, author: 'Internet Archive',
              description: 'تعذّر تحميل بيانات هذه المخطوطة من الأرشيف. يرجى المحاولة مجدداً.',
              price: 0, rating: 4.5, readers: 800, pages: '---',
              publisher: 'Internet Archive', publishedDate: 'غير محدد',
              coverImage: '/placeholder.png', source: 'Internet Archive', categories: ['Archive']
            };
          }
        }

        setBook(formattedBook);

        // Fetch related books (non-blocking — don't let failure prevent page render)
        try {
          const cat = formattedBook?.categories?.[0] || 'fiction';
          const relatedResp = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=subject:${cat}&maxResults=4&langRestrict=ar`, { timeout: 6000 });
          setRelatedBooks(relatedResp.data.items?.map((i: any) => ({
            _id: `gb:${i.id}`,
            title: i.volumeInfo.title,
            author: i.volumeInfo.authors?.[0] || 'كاتب موقر',
            price: 19.99,
            coverImage: i.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || '/placeholder.png',
            rating: i.volumeInfo.averageRating || 4.5
          })) || []);
        } catch { /* related books are optional */ }

      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
    const ownedBooks = JSON.parse(localStorage.getItem('ownedBooks') || '[]');
    setIsOwned(ownedBooks.includes(id));
  }, [id, retryCount]);

  const handlePurchase = () => {
    if (isOwned || book.price === 0) {
      if (!isOwned) {
        const ownedBooks = JSON.parse(localStorage.getItem('ownedBooks') || '[]');
        if (!ownedBooks.includes(id)) {
           ownedBooks.push(id);
           localStorage.setItem('ownedBooks', JSON.stringify(ownedBooks));
        }
      }
      navigate('/profile');
    } else {
      navigate(`/checkout/${id}`);
    }
  };

  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center text-gold-500 font-black" dir="rtl">...جالٍ استحضار المخطوطة الملكية</div>;
  if (error || !book) return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-8 text-center" dir="rtl">
      <span className="material-icons text-8xl text-gold-900/30">menu_book</span>
      <h2 className="text-4xl font-amiri font-black gold-text">تعذّر استحضار هذا المجلد</h2>
      <p className="text-slate-500 max-w-md">قد يكون المجلد غير متاح مؤقتاً أو انتهت مهلة الاتصال بالمصدر الخارجي.</p>
      <div className="flex gap-4">
        <button onClick={() => setRetryCount(c => c + 1)} className="gold-button px-8 py-4 rounded-2xl font-black text-lg">إعادة المحاولة</button>
        <button onClick={() => navigate(-1)} className="bg-surface-container-low border border-gold-900/20 px-8 py-4 rounded-2xl font-black text-lg text-gold-500">العودة للخلف</button>
      </div>
    </div>
  );

  return (
    <div className="bg-surface min-h-screen text-slate-100 font-jakarta rtl" dir="rtl">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-40 pb-24">
        {/* Scarcity Banner */}
        {book.price > 0 && !isOwned && (
          <div className="bg-gold-500/10 border border-gold-500/30 rounded-3xl p-6 mb-16 flex flex-col md:flex-row-reverse items-center justify-between gap-6 shadow-xl relative overflow-hidden group">
             <div className="flex flex-row-reverse items-center gap-4 relative z-10">
                <span className="material-icons text-gold-500 animate-bounce">local_fire_department</span>
                <p className="font-black text-xl gold-text">عرض ملكي محدود: ينتهي هذا السعر الخاص خلال {formatTime(timeLeft)}</p>
             </div>
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-gold-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row-reverse gap-20 items-start mb-32">
          
          <div className="lg:w-1/3 w-full group relative">
             <div className="absolute -inset-10 bg-gold-600/5 rounded-full blur-[100px] pointer-events-none opacity-100 transition-all"></div>
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border-2 border-gold-900/30 group-hover:border-gold-500/50 transition-all"
             >
                <img src={book.coverImage} alt={book.title} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-1000" />
             </motion.div>
             <div className="mt-8 bg-surface-container-low p-6 rounded-3xl border border-gold-900/10 text-center relative z-10">
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">الدليل الاجتماعي</p>
                <div className="flex items-center justify-center gap-2">
                   <div className="flex -space-x-4 space-x-reverse">
                      {[1,2,3,4].map(i => <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} className="w-10 h-10 rounded-full border-2 border-surface bg-surface-container-low" />)}
                   </div>
                   <p className="text-white font-black text-lg mr-4">+{book.readers} قارئ ملكي اقتنى هذا الكنز</p>
                </div>
             </div>
          </div>

          <div className="lg:w-2/3 space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-row-reverse items-center gap-6">
                 <span className="px-5 py-2 bg-gold-900/10 text-gold-500 rounded-full text-sm font-black border border-gold-900/20">
                   {book.source === 'Google Books' ? 'كتب جوجل الشاملة' : 
                    book.source === 'Project Gutenberg' ? 'مشروع غوتنبرغ' : 
                    book.source === 'Internet Archive' ? 'أرشيف الإنترنت' : 
                    book.source}
                 </span>
                 <div className="flex flex-row-reverse items-center gap-2 text-gold-400">
                    <span className="material-icons text-xl">star</span>
                    <span className="font-black text-lg">{book.rating}</span>
                 </div>
              </div>
              <h1 className="text-6xl md:text-8xl font-amiri font-black leading-tight gold-text">{book.title}</h1>
              <p className="text-3xl font-amiri font-black text-slate-300">بقلم الموقر: {book.author}</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[
                 { label: 'عدد الصفحات', val: book.pages, icon: 'auto_stories' },
                 { label: 'تارخ النشر', val: book.publishedDate, icon: 'event' },
                 { label: 'الناشر', val: book.publisher, icon: 'business' },
                 { label: 'حالة النسخة', val: book.price === 0 ? 'نسخة مجانية' : 'متوفر ملكياً', icon: 'verified' },
               ].map(stat => (
                 <div key={stat.label} className="bg-surface-container-low p-6 rounded-3xl border border-gold-900/10 text-right hover:border-gold-500/30 transition-all shadow-lg">
                    <span className="material-icons text-gold-500 mb-2">{stat.icon}</span>
                    <p className="text-slate-500 text-[10px] font-black uppercase mb-1 tracking-widest">{stat.label}</p>
                    <p className="font-black text-white line-clamp-1">{stat.val}</p>
                 </div>
               ))}
            </div>

            <div className="space-y-6 text-right">
               <h3 className="text-2xl font-amiri font-black gold-text">عن هذا المجلد</h3>
               <p className="text-slate-400 text-xl leading-relaxed max-w-4xl">
                 {book.description}
               </p>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center gap-10 pt-10 border-t border-gold-900/10">
               <div className="flex flex-col items-end">
                  {book.originalPrice && !isOwned && (
                    <span className="text-slate-500 font-bold line-through text-2xl mb-[-10px] opacity-50">${book.originalPrice}</span>
                  )}
                  <p className="text-6xl font-amiri font-black gold-text">{book.price === 0 ? 'مجاني' : `$${book.price}`}</p>
               </div>
               {/* CTA and Conversion Boosters */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePurchase}
                    className="flex-1 bg-gold-500 text-slate-950 py-6 rounded-2xl font-black text-xl shadow-[0_20px_40px_-10px_rgba(212,175,55,0.4)] flex items-center justify-center gap-3 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <span className="material-icons">shopping_bag</span>
                    {book.price === 0 ? 'اقتناء مجاني الآن' : `اقتناء النسخة الملكية - $${book.price}`}
                  </motion.button>
                  
                  <button className="flex-1 bg-surface-container-low border border-gold-900/20 py-6 rounded-2xl text-gold-500 font-black text-xl flex items-center justify-center gap-3 hover:bg-gold-500/5 transition-all">
                    <span className="material-icons">menu_book</span>
                    قراءة الفصل الأول مجاناً
                  </button>
                </div>

                {/* Bundle Upsell */}
                <div className="bg-emerald-950/20 border border-emerald-500/20 p-8 rounded-[2.5rem] flex items-center justify-between gap-6">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-20 bg-surface-container-low rounded-xl border border-gold-900/10 shadow-lg rotate-[-5deg]"></div>
                      <div className="w-16 h-20 bg-surface-container-low rounded-xl border border-gold-900/10 shadow-lg absolute translate-x-4 rotate-[5deg]"></div>
                      <div className="ml-10">
                         <p className="text-emerald-500 font-black text-sm mb-1">وفر 25% مع الحزمة الملكية</p>
                         <h4 className="text-white font-bold leading-tight">أضف "تاريخ العرب" + "الأدب الأندلسي"</h4>
                      </div>
                   </div>
                   <button className="bg-emerald-500 text-emerald-950 px-6 py-3 rounded-xl font-black text-sm whitespace-nowrap">أضف للمجموعة</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="pt-24 border-t border-gold-900/10">
           <h2 className="text-4xl font-amiri font-black gold-text mb-16 text-right">كنوز مشابهة قد تفضلها</h2>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
             {relatedBooks.map((b) => (
               <BookCard key={b._id} book={b} />
             ))}
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BookDetails;
