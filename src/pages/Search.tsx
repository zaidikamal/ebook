import { useState, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';

type SearchSource = 'google' | 'gutenberg' | 'archive';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState<SearchSource>('google');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatGoogleBooks = (items: any[]) => items?.map(item => ({
    _id: `gb:${item.id}`,
    title: item.volumeInfo.title,
    author: item.volumeInfo.authors?.[0] || 'كاتب موقر',
    price: 19.99 + (Math.random() * 15),
    coverImage: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400',
    rating: item.volumeInfo.averageRating || 4.2
  })) || [];

  const formatGutenbergBooks = (items: any[]) => items?.map(item => ({
    _id: `pg:${item.id}`,
    title: item.title,
    author: item.authors?.[0]?.name || 'مؤلف كلاسيكي',
    price: 0, // Gutenberg is free
    coverImage: `https://www.gutenberg.org/cache/epub/${item.id}/pg${item.id}.cover.medium.jpg`,
    rating: 4.5
  })) || [];

  const formatArchiveBooks = (items: any[]) => items?.map((item: any) => ({
    _id: `ia:${item.identifier}`,
    title: item.title || 'مخطوطة نادرة',
    author: item.creator?.[0] || 'كاتب مجهول',
    price: 0, // Archive is free
    coverImage: `https://archive.org/services/img/${item.identifier}`,
    rating: 4.7
  })) || [];

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface min-h-screen text-slate-100 font-jakarta rtl" dir="rtl">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-40 pb-24">
        {/* Search Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-amiri font-black gold-text mb-8">اكتشف كنوز المكتبات العالمية</h1>
          
          {/* Source Selector */}
          <div className="flex justify-center gap-4 mb-10 overflow-x-auto pb-4">
            {[
              { id: 'google', name: 'Google Books', icon: 'public' },
              { id: 'gutenberg', name: 'Gutenberg', icon: 'history_edu' },
              { id: 'archive', name: 'Archive.org', icon: 'account_balance' },
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
                <span className="material-icons text-xl">{src.icon}</span>
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
              className="absolute left-6 top-1/2 -translate-y-1/2 gold-button w-16 h-16 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
            >
              <span className="material-icons text-3xl">search</span>
            </button>
          </form>
        </div>

        {/* Results Grid */}
        <section>
          <div className="flex items-center justify-between mb-12 px-4">
             <h2 className="text-3xl font-amiri font-black text-white">
               {searched ? `نتائج البحث عن "${query}"` : 'المجلدات الشائعة حالياً'}
             </h2>
             <span className="text-gold-500/60 font-black tracking-widest uppercase text-xs">
               {results.length} كتاب من {source}
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
                results.map((book) => (
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
               <span className="material-icons text-8xl mb-4">search_off</span>
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
