import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import { formattedAuthor } from '../utils/formatters';
import { useToast } from '../components/Toast';
import { userOwnsBook, addBookToLibrary } from '../lib/libraryService';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import EventIcon from '@mui/icons-material/Event';
import BusinessIcon from '@mui/icons-material/Business';
import VerifiedIcon from '@mui/icons-material/Verified';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import StarIcon from '@mui/icons-material/Star';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { incrementBookStat, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isOwned, setIsOwned] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600 * 3 + 45 * 60); // 3h 45m dummy timer

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

  const { data, isLoading: loading, isError: error, refetch } = useQuery({
    queryKey: ['bookDetails', id],
    queryFn: async () => {
      // Existing query logic...
      if (!id) throw new Error("No ID");
      
      const type = id.split(':')[0];
      const realId = id.split(':').slice(1).join(':'); // handle IDs that may contain colons

      let formattedBook: any;

        if (type === 'ko') {
          const KUTUBI_ORIGINALS = [
             { id: 'original-1', title: 'مقدمة ابن خلدون', author: 'ابن خلدون', coverImage: 'https://images.unsplash.com/photo-1589998059171-d88d664a2a0f?auto=format&fit=crop&q=80&w=400', rating: 5.0, price: 45.00 },
             { id: 'original-2', title: 'ألف ليلة وليلة', author: 'تراث شعبي', coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400', rating: 4.9, price: 29.99 },
             { id: 'original-3', title: 'كليلة ودمنة', author: 'عبد الله بن المقفع', coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400', rating: 4.8, price: 19.99 },
             { id: 'original-4', title: 'ديوان المتنبي', author: 'أبو الطيب المتنبي', coverImage: 'https://images.unsplash.com/photo-1532012197367-6849412a52cd?auto=format&fit=crop&q=80&w=400', rating: 5.0, price: 35.00 },
             { id: 'original-5', title: 'طوق الحمامة', author: 'ابن حزم الأندلسي', coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400', rating: 4.7, price: 25.00 },
             { id: 'original-6', title: 'حي بن يقظان', author: 'ابن طفيل', coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400', rating: 4.9, price: 22.00 },
             { id: 'original-7', title: 'البخلاء', author: 'الجاحظ', coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400', rating: 4.6, price: 15.00 },
             { id: 'original-8', title: 'رسالة الغفران', author: 'أبو العلاء المعري', coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b81ae1a3?auto=format&fit=crop&q=80&w=400', rating: 4.8, price: 27.50 },
          ];
          const original = KUTUBI_ORIGINALS.find(b => b.id === realId);
          if (original) {
            formattedBook = {
               _id: id,
               title: original.title,
               author: original.author,
               description: 'إصدار ملكي خاص وحصري من منصة كتبي الرقمية، تم تحقيقه وتنسيقه بعناية فائقة ليوفر لك تجربة قراءة لا تُنسى.',
               price: original.price,
               originalPrice: original.price + 15,
               rating: original.rating,
               readers: Math.floor(Math.random() * 5000) + 2000,
               pages: Math.floor(Math.random() * 500) + 200,
               publisher: 'منصة كتبي الملكية',
               publishedDate: 'طبعة حصرية',
               coverImage: original.coverImage,
               source: 'Kutubi Originals',
               categories: ['أدب كلاسيكي', 'حصري']
            };
          }
        } else if (type === 'gb') {
          const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${realId}`);
          const item = response.data;
          formattedBook = {
            _id: id,
            title: item.volumeInfo.title,
            author: formattedAuthor(item.volumeInfo.authors?.[0]) || 'كاتب موقر',
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
            author: formattedAuthor(item.authors?.[0]?.name) || 'مؤلف كلاسيكي',
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
              author: formattedAuthor(meta.creator) || 'كاتب مجهول',
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
            formattedBook = {
              _id: id, title: realId, author: 'Internet Archive',
              description: 'تعذّر تحميل بيانات هذه المخطوطة من الأرشيف. يرجى المحاولة مجدداً.',
              price: 0, rating: 4.5, readers: 800, pages: '---',
              publisher: 'Internet Archive', publishedDate: 'غير محدد',
              coverImage: '/placeholder.png', source: 'Internet Archive', categories: ['Archive']
            };
          }
        } else if (type === 'royal') {
          const docRef = doc(db, 'books', realId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            formattedBook = {
              _id: id,
              title: data.title,
              author: data.author,
              description: data.description || 'وصف ملكي من خزانة كتبي المتفردة.',
              price: data.price || 0,
              rating: 5.0,
              readers: Math.floor(Math.random() * 1000) + 500,
              pages: data.pages || '---',
              publisher: 'منصة كتبي الملكية',
              publishedDate: data.uploadDate || 'حديث',
              coverImage: data.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
              fileUrl: data.fileUrl,
              source: 'Kutubi Royal',
              categories: [data.category || 'عام']
            };
          }
        }

        let related: any[] = [];
        try {
          const cat = formattedBook?.categories?.[0] || 'fiction';
          const relatedResp = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=subject:${cat}&maxResults=4&langRestrict=ar`, { timeout: 6000 });
          related = relatedResp.data.items?.map((i: any) => ({
            _id: `gb:${i.id}`,
            title: i.volumeInfo.title,
            author: formattedAuthor(i.volumeInfo.authors?.[0]) || 'كاتب موقر',
            price: 19.99,
            coverImage: i.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || '/placeholder.png',
            rating: i.volumeInfo.averageRating || 4.5
          })) || [];
        } catch { /* related optional */ }

        return { book: formattedBook, relatedBooks: related };
    },
    staleTime: 1000 * 60 * 5,
  });

  const book = data?.book;
  const relatedBooks = data?.relatedBooks || [];

  useEffect(() => {
    const checkOwnership = async () => {
      if (id) {
        const owned = await userOwnsBook(id);
        setIsOwned(owned);
      }
    };
    checkOwnership();
  }, [id]);

  useEffect(() => {
    if (id && id.startsWith('royal:')) {
      const realId = id.split(':')[1];
      incrementBookStat(realId, 'views');
    }
  }, [id]);

  const handlePurchase = async () => {
    if (isOwned || book.price === 0) {
      if (!isOwned) {
        await addBookToLibrary(id as string);
        setIsOwned(true);
        if (id && id.startsWith('royal:')) {
          incrementBookStat(id.split(':')[1], 'downloads');
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
      <MenuBookIcon className="text-8xl text-gold-900/30" />
      <h2 className="text-4xl font-amiri font-black gold-text">تعذّر استحضار هذا المجلد</h2>
      <p className="text-slate-500 max-w-md">قد يكون المجلد غير متاح مؤقتاً أو انتهت مهلة الاتصال بالمصدر الخارجي.</p>
      <div className="flex gap-4">
        <button onClick={() => refetch()} className="gold-button px-8 py-4 rounded-2xl font-black text-lg">إعادة المحاولة</button>
        <button onClick={() => navigate(-1)} className="bg-surface-container-low border border-gold-900/20 px-8 py-4 rounded-2xl font-black text-lg text-gold-500">العودة للخلف</button>
      </div>
    </div>
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": book.title,
    "author": {
      "@type": "Person",
      "name": book.author || "مؤلف مجهول"
    },
    "image": book.coverImage,
    "description": book.description,
    "isbn": book.isbn || "unknown",
    "publisher": {
      "@type": "Organization",
      "name": book.publisher || "منصة كتبي الملكية"
    },
    "offers": {
      "@type": "Offer",
      "price": book.price.toFixed(2),
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <>
      <Helmet>
        <title>{book.title} | منصة كتبي الملكية</title>
        <meta name="description" content={book.description.substring(0, 150)} />
        <meta property="og:title" content={book.title} />
        <meta property="og:description" content={book.description.substring(0, 150)} />
        <meta property="og:image" content={book.coverImage} />
        <meta property="og:type" content="book" />
        <link rel="canonical" href={window.location.href} />
        
        {/* إضافة البيانات المهيكلة */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      <div className="bg-surface min-h-screen text-slate-100 font-jakarta rtl" dir="rtl">
        <Navbar />
      
      <main className="container mx-auto px-6 pt-40 pb-24">
        {/* Scarcity Banner */}
        {book.price > 0 && !isOwned && (
          <div className="bg-gold-500/10 border border-gold-500/30 rounded-3xl p-6 mb-16 flex flex-col md:flex-row-reverse items-center justify-between gap-6 shadow-xl relative overflow-hidden group">
             <div className="flex flex-row-reverse items-center gap-4 relative z-10">
                <LocalFireDepartmentIcon className="text-gold-500 animate-bounce" />
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
                <img src={book.coverImage} alt={`غلاف كتاب ${book.title} للمؤلف ${book.author}`} loading="lazy" className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-1000" />
             </motion.div>
             <div className="mt-8 bg-surface-container-low p-6 rounded-3xl border border-gold-900/10 text-center relative z-10">
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">الدليل الاجتماعي</p>
                <div className="flex items-center justify-center gap-2">
                   <div className="flex -space-x-4 space-x-reverse">
                      {[1,2,3,4].map(i => <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt={`أحد القراء الموقرين ${i}`} loading="lazy" className="w-10 h-10 rounded-full border-2 border-surface bg-surface-container-low" />)}
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
                    <StarIcon className="text-xl" />
                    <span className="font-black text-lg">{book.rating}</span>
                 </div>
              </div>
              <h1 className="book-title text-6xl md:text-8xl leading-tight gold-text">{book.title}</h1>
              <p className="text-3xl font-amiri font-black text-slate-300">{book.author ? `بواسطة: ${book.author}` : 'مؤلف غير معروف'}</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[
                 { label: 'عدد الصفحات', val: book.pages, icon: AutoStoriesIcon },
                 { label: 'تارخ النشر', val: book.publishedDate, icon: EventIcon },
                 { label: 'الناشر', val: book.publisher, icon: BusinessIcon },
                 { label: 'حالة النسخة', val: book.price === 0 ? 'نسخة مجانية' : 'متوفر ملكياً', icon: VerifiedIcon },
               ].map(stat => (
                 <div key={stat.label} className="bg-surface-container-low p-6 rounded-3xl border border-gold-900/10 text-right hover:border-gold-500/30 transition-all shadow-lg">
                    <stat.icon className="text-gold-500 mb-2" />
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
               <div className="price flex flex-col items-end">
                  {book.originalPrice && !isOwned && book.price > 0 && (
                    <del className="text-gray-400 text-3xl opacity-50">${book.originalPrice}</del>
                  )}
                  <span className="text-red-600 font-bold text-6xl font-amiri">
                    {book.price === 0 ? 'مجاني' : `$${book.price}`}
                  </span>
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
                    <ShoppingBagIcon />
                    {book.price === 0 ? 'اقتناء مجاني الآن' : `اقتناء النسخة الملكية - $${book.price}`}
                  </motion.button>
                  
                  <button 
                    onClick={() => showToast('سيتم افتتاح الجناح الخاص بالقراءة المدمجة قريباً. ترقبوا التحديث الملكي القادم!', 'info')}
                    className="flex-1 bg-surface-container-low border border-gold-900/20 py-6 rounded-2xl text-gold-500 font-black text-xl flex items-center justify-center gap-3 hover:bg-gold-500/5 transition-all"
                  >
                    <MenuBookIcon />
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
                   <button 
                     onClick={() => {
                       const owned = JSON.parse(localStorage.getItem('ownedBooks') || '[]');
                       localStorage.setItem('ownedBooks', JSON.stringify([...new Set([...owned, 'ko:history-arabs', 'ko:andalusian-lit'])]));
                       showToast('تمت إضافة الحزمة الملكية (تاريخ العرب + الأدب الأندلسي) لمكتبتك بنجاح!', 'success');
                       navigate('/profile');
                     }}
                     className="bg-emerald-500 text-emerald-950 px-6 py-3 rounded-xl font-black text-sm whitespace-nowrap hover:bg-emerald-400 transition-colors"
                   >
                     أضف للمجموعة
                   </button>
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
    </>
  );
};

export default BookDetails;
