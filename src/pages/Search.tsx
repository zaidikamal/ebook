import { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { db } from '../lib/firebase';
import AdUnit from '../components/AdUnit';
import { collection, query as firestoreQuery, where, getDocs } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import PublicIcon from '@mui/icons-material/Public';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { formattedAuthor } from '../utils/formatters';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';

type SearchSource = 'google' | 'gutenberg' | 'archive';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState<SearchSource>('google');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Filters
  const [filterCategory, setFilterCategory] = useState('الكل');
  const [filterPrice, setFilterPrice] = useState('الكل');
  const [filterRating, setFilterRating] = useState('الكل');

  const getApprovedRoyalBooks = async () => {
    try {
      const q = firestoreQuery(collection(db, 'books'), where('status', '==', 'approved'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as any;
        return {
          _id: `royal:${doc.id}`,
          title: data.title,
          author: data.author,
          price: data.price,
          coverImage: data.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
          rating: 5.0,
          categories: [data.category || 'عام'],
          isRoyal: true
        };
      });
    } catch (error) {
      console.error("Error fetching royal books:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchTrending();
  }, [source]);

  const fetchTrending = async () => {
    setLoading(true);
    try {
      let response;
      if (source === 'google') {
        response = await axios.get('https://www.googleapis.com/books/v1/volumes?q=subject:fiction&maxResults=10&orderBy=newest&langRestrict=ar');
        setResults(formatGoogleBooks(response.data.items));
      } else if (source === 'gutenberg') {
        response = await axios.get('https://gutendex.com/books/?languages=ar,en&sort=popular');
        setResults(formatGutenbergBooks(response.data.results));
      } else {
        response = await axios.get('https://archive.org/advancedsearch.php?q=mediatype:texts+AND+collection:additional_collections&rows=10&output=json');
        setResults(formatArchiveBooks(response.data.response.docs));
      }
      
      const royalBooks = await getApprovedRoyalBooks();
      setResults(prev => [...royalBooks, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatGoogleBooks = (items: any[]) => items?.map(item => ({
    _id: `gb:${item.id}`,
    title: item.volumeInfo.title,
    author: formattedAuthor(item.volumeInfo.authors?.[0]) || 'كاتب موقر',
    price: 19.99 + (Math.random() * 15),
    coverImage: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400',
    rating: item.volumeInfo.averageRating || 4.2,
    categories: item.volumeInfo.categories || ['عام']
  })) || [];

  const formatGutenbergBooks = (items: any[]) => items?.map(item => ({
    _id: `pg:${item.id}`,
    title: item.title,
    author: formattedAuthor(item.authors?.[0]?.name) || 'مؤلف كلاسيكي',
    price: 0, // Gutenberg is free
    coverImage: `https://www.gutenberg.org/cache/epub/${item.id}/pg${item.id}.cover.medium.jpg`,
    rating: 4.5,
    categories: item.subjects || ['Public Domain']
  })) || [];

  const formatArchiveBooks = (items: any[]) => items?.map((item: any) => ({
    _id: `ia:${item.identifier}`,
    title: item.title || 'مخطوطة نادرة',
    author: formattedAuthor(item.creator?.[0]) || 'كاتب مجهول',
    price: 0, // Archive is free
    coverImage: `https://archive.org/services/img/${item.identifier}`,
    rating: 4.7,
    categories: item.subject ? (Array.isArray(item.subject) ? item.subject : [item.subject]) : ['Archive']
  })) || [];

  const filteredResults = results.filter(book => {
    if (filterCategory !== 'الكل') {
      const match = book.categories?.some((c: string) => c.toLowerCase().includes(filterCategory.toLowerCase()));
      if (!match) return false;
    }
    if (filterPrice !== 'الكل') {
      if (filterPrice === 'مجاني' && book.price > 0) return false;
      if (filterPrice === 'مدفوع' && book.price === 0) return false;
    }
    if (filterRating !== 'الكل' && book.rating < parseFloat(filterRating)) return false;
    return true;
  });

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      let response;
      if (source === 'google') {
        response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20&langRestrict=ar`);
        setResults(formatGoogleBooks(response.data.items));
      } else if (source === 'gutenberg') {
        response = await axios.get(`https://gutendex.com/books/?search=${query}`);
        setResults(formatGutenbergBooks(response.data.results));
      } else {
        response = await axios.get(`https://archive.org/advancedsearch.php?q=title:(${query})+AND+mediatype:texts&rows=20&output=json`);
        setResults(formatArchiveBooks(response.data.response.docs));
      }

      const royalBooks = await getApprovedRoyalBooks();
      const matchedRoyal = query 
        ? royalBooks.filter((b: any) => b.title.toLowerCase().includes(query.toLowerCase()) || b.author.toLowerCase().includes(query.toLowerCase()))
        : royalBooks;
        
      setResults(prev => [...matchedRoyal, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface min-h-screen text-slate-100 font-jakarta rtl" dir="rtl">
      <Helmet>
        <title>البحث الملكي | اكتشف كنوز المخطوطات والكتب 👑</title>
        <meta name="description" content="البحث المتقدم في مكتبة كتبي الملكية. اعثر على أندر المخطوطات، الروايات الكلاسيكية، والأبحاث العلمية." />
        <link rel="canonical" href="https://ebook-mgv9.vercel.app/search" />
      </Helmet>
      <Navbar />
      
      <main className="container mx-auto px-6 pt-40 pb-24">
        {/* Search Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-amiri font-black gold-text mb-8">اكتشف كنوز المكتبات العالمية</h1>
          
          {/* Source Selector */}
          <div className="flex justify-center gap-4 mb-10 overflow-x-auto pb-4">
            {[
              { id: 'google', name: 'Google Books', icon: PublicIcon },
              { id: 'gutenberg', name: 'Gutenberg', icon: HistoryEduIcon },
              { id: 'archive', name: 'Archive.org', icon: AccountBalanceIcon },
            ].map((src) => (
              <button
                key={src.id}
                onClick={() => setSource(src.id as SearchSource)}
                className={`flex items-center gap-3 px-8 py-3 rounded-2xl border-2 transition-all font-black text-sm whitespace-nowrap ${
                  source === src.id 
                  ? 'border-gold-500 bg-gold-600/10 text-gold-500 shadow-lg shadow-gold-500/10' 
                  : 'border-gold-900/10 bg-surface-container-low text-slate-500 hover:border-gold-500/30'
                }`}
              >
                <src.icon className="text-xl" />
                {src.name}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch} className="relative group">
            <input 
              type="text" 
              placeholder={`ابحث في ${source === 'google' ? 'Google Books' : source === 'gutenberg' ? 'Project Gutenberg' : 'Internet Archive'}...`}
              className="w-full bg-surface-container-low border-2 border-gold-900/20 rounded-[3rem] py-8 px-12 pr-16 text-2xl focus:outline-none focus:border-gold-500 transition-all shadow-2xl placeholder:text-slate-600 text-right"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              type="submit"
              aria-label="ابحث الآن"
              className="absolute left-6 top-1/2 -translate-y-1/2 gold-button w-16 h-16 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
            >
              <SearchIcon className="text-3xl" />
            </button>
          </form>

          {/* Royal Ad Slot 2 */}
          <AdUnit slot="0987654321" className="!my-16" />

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-surface border border-gold-900/30 rounded-xl px-4 py-2 text-white outline-none focus:border-gold-500 font-bold"
            >
              <option value="الكل">كل التصنيفات</option>
              <option value="literature">أدب</option>
              <option value="fiction">خيال / روايات</option>
              <option value="history">تاريخ</option>
              <option value="philosophy">فلسفة</option>
              <option value="biography">السير والتراجم</option>
              <option value="science">العلوم الطبيعية</option>
              <option value="art">الفنون والعمارة</option>
              <option value="religion">الدين والفكر</option>
              <option value="quran">علوم القرآن والحديث</option>
              <option value="manuscripts">المخطوطات النادرة</option>
              <option value="politics">السياسة والاقتصاد</option>
              <option value="self-help">تطوير الذات</option>
              <option value="poetry">الشعر</option>
              <option value="office-skills">المهارات المكتبية</option>
              <option value="foreign-languages">اللغات الأجنبية</option>
            </select>
            <select
              value={filterPrice}
              onChange={(e) => setFilterPrice(e.target.value)}
              className="bg-surface border border-gold-900/30 rounded-xl px-4 py-2 text-white outline-none focus:border-gold-500 font-bold"
            >
              <option value="الكل">السعر (الكل)</option>
              <option value="مجاني">مجاني</option>
              <option value="مدفوع">مدفوع الملكي</option>
            </select>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="bg-surface border border-gold-900/30 rounded-xl px-4 py-2 text-white outline-none focus:border-gold-500 font-bold"
            >
              <option value="الكل">كل التقييمات</option>
              <option value="4">+4 درجات ملكية</option>
              <option value="4.5">+4.5 درجات ملكية</option>
            </select>
          </div>
        </div>

        {/* Results Grid */}
        <section>
          <div className="flex items-center justify-between mb-12 px-4">
             <h2 className="text-3xl font-amiri font-black text-white">
               {searched ? `نتائج البحث عن "${query}"` : 'المجلدات الشائعة حالياً'}
             </h2>
             <span className="text-gold-500/60 font-black tracking-widest uppercase text-xs">
               {filteredResults.length} كتاب من {source}
             </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 md:gap-12 pl-4">
            <AnimatePresence mode="popLayout">
              {loading ? (
                 [...Array(10)].map((_, i) => (
                   <motion.div 
                     key={`skele-${i}`}
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="aspect-[3/4.5] bg-surface-container-low animate-pulse rounded-[2rem] border border-gold-900/10"
                   />
                 ))
              ) : (
                filteredResults.map((book) => (
                  <motion.div
                    key={book._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BookCard book={book} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
          
          {!loading && results.length === 0 && searched && (
            <div className="text-center py-20 opacity-40">
               <SearchOffIcon className="text-8xl mb-4" />
               <p className="text-3xl font-amiri font-black">لم نعثر على هذا المجلد الموقر في {source}</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SearchPage;
