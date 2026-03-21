import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import { downloadProtectedFile } from '../utils/ContentProtection';
import { getLibraryBookIds } from '../lib/libraryService';
import { formattedAuthor } from '../utils/formatters';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const PRESET_AVATARS = [
  '/avatars/royal-user.png',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=royal1&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=royal2&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=royal3&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=royal4&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=sultan',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=amir',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=reader',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=book1',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=book2',
  'https://api.dicebear.com/7.x/bottts/svg?seed=royal&baseColor=gold',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=kutubi',
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const [ownedBooks, setOwnedBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAvatar, setUserAvatar] = useState(localStorage.getItem('userAvatar') || '/avatars/royal-user.png');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = {
    name: "القارئ الملكي",
    email: "reader@royal.com",
    avatar: userAvatar,
    tier: "عضوية الصفوة"
  };

  const applyAvatar = (src: string) => {
    setUserAvatar(src);
    localStorage.setItem('userAvatar', src);
    window.dispatchEvent(new Event('storage'));
    setShowAvatarModal(false);
    setUploadPreview(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setUploadPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const fetchOwnedBooks = async () => {
      const ids = await getLibraryBookIds();
      if (ids.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const bookPromises = ids.map(async (fullId: string) => {
          const [type, realId] = fullId.split(':');
          if (type === 'gb') {
            const resp = await axios.get(`https://www.googleapis.com/books/v1/volumes/${realId}`);
            return {
              _id: fullId,
              title: resp.data.volumeInfo.title,
              author: formattedAuthor(resp.data.volumeInfo.authors?.[0]) || 'كاتب موقر',
              coverImage: resp.data.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:'),
              price: "مملوك",
              rating: resp.data.volumeInfo.averageRating || 4.5
            };
          } else if (type === 'pg') {
            const resp = await axios.get(`https://gutendex.com/books/${realId}`);
            return {
              _id: fullId,
              title: resp.data.title,
              author: formattedAuthor(resp.data.authors?.[0]?.name) || 'مؤلف كلاسيكي',
              coverImage: `https://www.gutenberg.org/cache/epub/${realId}/pg${realId}.cover.medium.jpg`,
              price: "مملوك",
              rating: 4.8
            };
          } else if (type === 'ia') {
            const resp = await axios.get(`https://archive.org/metadata/${realId}`);
            return {
              _id: fullId,
              title: resp.data.metadata.title,
              author: formattedAuthor(resp.data.metadata.creator) || 'كاتب مجهول',
              coverImage: `https://archive.org/services/img/${realId}`,
              price: "مملوك",
              rating: 4.7
            };
          }
          return null;
        });

        const results = await Promise.all(bookPromises);
        setOwnedBooks(results.filter(b => b !== null));
      } catch (err) {
        console.error("Error fetching library:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnedBooks();
  }, []);

  const handleDownload = (bookTitle: string) => {
    downloadProtectedFile(bookTitle, user.name);
  };

  return (
    <div className="bg-surface min-h-screen text-slate-100 font-jakarta rtl" dir="rtl">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-40 pb-24">
        {/* User Header */}
        <section className="mb-20">
           <div className="bg-gradient-to-br from-gold-900/20 to-surface-container-low p-12 rounded-[4rem] border border-gold-900/20 flex flex-col md:flex-row-reverse items-center justify-between gap-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-gold-600/5 rounded-full blur-[100px] pointer-events-none"></div>
             
             <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                <div className="w-32 h-32 rounded-full border-4 border-gold-500/30 p-1 shadow-2xl relative group cursor-pointer" onClick={() => setShowAvatarModal(true)}>
                   <img src={user.avatar} alt="صورة المستخدم الشخصية" loading="lazy" className="w-full h-full rounded-full bg-surface-container-low object-cover" />
                   <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <EditIcon className="text-gold-500" />
                   </div>
                   <div className="absolute -bottom-2 -right-2 bg-gold-500 w-10 h-10 rounded-full flex items-center justify-center border-4 border-surface shadow-lg">
                      <VerifiedIcon className="text-surface text-xl" />
                   </div>
                </div>
                <div className="text-center md:text-right">
                   <h1 className="text-4xl font-amiri font-black gold-text mb-2">{user.name}</h1>
                   <p className="text-slate-500 font-bold mb-4">{user.email}</p>
                   <span className="px-6 py-2 bg-gold-900/10 border border-gold-900/20 rounded-full text-gold-500 text-sm font-black uppercase tracking-widest">
                     {user.tier}
                   </span>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-8 w-full md:w-auto">
                <div className="bg-surface/50 p-6 rounded-3xl border border-gold-900/10 text-center">
                   <p className="text-3xl font-amiri font-black gold-text">{ownedBooks.length}</p>
                   <p className="text-slate-500 text-[10px] font-black uppercase">كتاب في الخزانة</p>
                </div>
                <div className="bg-surface/50 p-6 rounded-3xl border border-gold-900/10 text-center">
                   <p className="text-3xl font-amiri font-black gold-text">12</p>
                   <p className="text-slate-500 text-[10px] font-black uppercase">ساعة قراءة</p>
                </div>
             </div>
           </div>
        </section>

        {/* Library Section */}
        <section>
          <div className="flex items-center justify-between mb-16 px-4">
             <h2 className="text-4xl font-amiri font-black gold-text">مكتبتك الخاصة</h2>
             <div className="flex gap-4">
                <button className="bg-gold-500/10 text-gold-500 px-6 py-2 rounded-full text-sm font-black border border-gold-500/20">الكل</button>
             </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            <AnimatePresence mode="popLayout">
              {loading ? (
                 [...Array(4)].map((_, i) => (
                   <div key={i} className="aspect-[3/4.5] bg-surface-container-low animate-pulse rounded-[2rem] border border-gold-900/10" />
                 ))
              ) : ownedBooks.length === 0 ? (
                <div className="col-span-full py-32 text-center opacity-30">
                   <Inventory2Icon className="text-8xl mb-6" />
                   <p className="text-3xl font-amiri font-black">خزانتك لا تزال بانتظر كنوزها الأولى</p>
                   <button onClick={() => navigate('/search')} className="mt-8 text-gold-500 font-black border-b border-gold-500 pb-1">ابدأ الاقتناء الآن</button>
                </div>
              ) : (
                ownedBooks.map((book: any) => (
                  <motion.div 
                    key={book._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative group"
                  >
                    <BookCard book={book} />
                    <button 
                      onClick={() => handleDownload(book.title)}
                      className="absolute bottom-24 left-8 right-8 bg-surface/90 backdrop-blur-xl border border-gold-500/30 py-3 rounded-2xl text-gold-500 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 shadow-2xl flex items-center justify-center gap-2 hover:bg-gold-500 hover:text-surface"
                    >
                      <DownloadIcon className="text-sm" />
                      تحميل النسخة الملكية
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Avatar Change Modal */}
      <AnimatePresence>
        {showAvatarModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => { setShowAvatarModal(false); setUploadPreview(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-surface-container-low border border-gold-900/20 rounded-[3rem] p-10 w-full max-w-xl shadow-2xl"
              onClick={e => e.stopPropagation()}
              dir="rtl"
            >
              <div className="flex flex-row-reverse items-center justify-between mb-8">
                <h2 className="text-3xl font-amiri font-black gold-text">تغيير صورة البروفيل</h2>
                <button aria-label="إغلاق النافذة" onClick={() => { setShowAvatarModal(false); setUploadPreview(null); }} className="w-10 h-10 rounded-full bg-surface flex items-center justify-center hover:bg-gold-500/10 transition-colors">
                  <CloseIcon className="text-slate-400" />
                </button>
              </div>

              {/* Upload from device */}
              <div className="mb-8">
                <p className="text-slate-400 font-bold mb-4 text-right">رفع صورة من جهازك</p>
                {uploadPreview ? (
                  <div className="flex flex-col items-center gap-4">
                    <img src={uploadPreview} alt="معاينة الصورة" loading="lazy" className="w-24 h-24 rounded-full object-cover border-4 border-gold-500/50 shadow-xl" />
                    <div className="flex gap-3">
                      <button
                        onClick={() => applyAvatar(uploadPreview)}
                        className="gold-button px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2"
                      >
                        <CheckCircleIcon className="text-lg" />
                        تطبيق هذه الصورة
                      </button>
                      <button
                        onClick={() => setUploadPreview(null)}
                        className="bg-surface-container-lowest border border-gold-900/20 px-6 py-3 rounded-2xl font-black text-sm text-slate-400"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gold-900/30 hover:border-gold-500/50 rounded-3xl py-8 flex flex-col items-center gap-3 transition-all hover:bg-gold-500/5 group"
                  >
                    <AddPhotoAlternateIcon className="text-4xl text-gold-900/50 group-hover:text-gold-500 transition-colors" />
                    <span className="text-slate-500 font-bold">اضغط لرفع صورة</span>
                    <span className="text-slate-600 text-xs">JPG, PNG, GIF مقبولة</span>
                  </button>
                )}
              </div>

              {/* Preset avatars */}
              <div>
                <p className="text-slate-400 font-bold mb-4 text-right">أو اختر صورة جاهزة</p>
                <div className="grid grid-cols-6 gap-3">
                  {PRESET_AVATARS.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => applyAvatar(src)}
                      className={`w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all hover:scale-110 ${
                        userAvatar === src ? 'border-gold-500 shadow-[0_0_12px_rgba(212,175,55,0.5)]' : 'border-gold-900/20 hover:border-gold-500/50'
                      }`}
                    >
                      <img src={src} alt={`صورة رمزية مستعارة ${i}`} loading="lazy" className="w-full h-full object-cover bg-surface-container-lowest" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default ProfilePage;
