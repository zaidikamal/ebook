import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import { downloadProtectedFile } from '../utils/ContentProtection';
import { getLibraryBookIds } from '../lib/libraryService';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { formattedAuthor } from '../utils/formatters';
import { supabase } from '../lib/supabase';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PremiumProfile from '../components/PremiumProfile';

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
  const { user: authUser, loading: authLoading } = useAuth();
  const [ownedBooks, setOwnedBooks] = useState<any[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = {
    name: authUser?.name || authUser?.displayName || "القارئ الملكي",
    email: authUser?.email || "reader@royal.com",
    avatar: authUser?.avatar || "/avatars/royal-user.png",
    tier: authUser?.role === 'admin' ? "الإدارة الملكية" : "عضوية الصفوة"
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const applyAvatar = async (src: string) => {
    if (!authUser?.uid) return;
    
    try {
      await updateDoc(doc(db, 'users', authUser.uid), {
        avatar: src
      });
      localStorage.setItem('userAvatar', src);
      setShowAvatarModal(false);
      setUploadPreview(null);
    } catch (e) {
      console.error("Error updating avatar in Firestore:", e);
    }
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
      if (authLoading) return;
      
      const ids = await getLibraryBookIds();
      if (ids.length === 0) {
        setLoadingBooks(false);
        return;
      }

      try {
        const bookPromises = ids.map(async (fullId: string) => {
          const [type, realId] = fullId.split(':');
          try {
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
            } else if (type === 'ko') {
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
              const bk = KUTUBI_ORIGINALS.find(b => b.id === realId);
              if (bk) {
                 return { _id: fullId, title: bk.title, author: bk.author, coverImage: bk.coverImage, price: "مملوك", rating: bk.rating };
              }
            } else if (type === 'royal') {
              const docSnap = await getDoc(doc(db, 'books', realId));
              if (docSnap.exists()) {
                const data = docSnap.data();
                return {
                  _id: fullId,
                  title: data.title,
                  author: data.author,
                  coverImage: data.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
                  price: "مملوك",
                  rating: 5.0,
                };
              } else {
                return null;
              }
            }
            return null;
          } catch (e) {
            console.warn(`Error fetching details for ${fullId}:`, e);
            return null;
          }
        });

        const results = await Promise.all(bookPromises);
        setOwnedBooks(results.filter(b => b !== null) as any[]);
      } catch (err) {
        console.error("Error fetching library:", err);
      } finally {
        setLoadingBooks(false);
      }
    };

    fetchOwnedBooks();
  }, [authUser, authLoading]);

  const handleDownload = async (book: any) => {
    if (book.fileUrl && supabase) {
      try {
        const filePath = book.fileUrl.includes('books/') ? book.fileUrl.split('books/')[1] : book.fileUrl;
        const { data, error } = await supabase.storage.from("books").createSignedUrl(filePath, 60);
        if (error) throw error;
        window.open(data.signedUrl, "_blank");
      } catch (err) {
        console.error('Error with Supabase signed URL', err);
        downloadProtectedFile(book.title, user.name);
      }
    } else {
      downloadProtectedFile(book.title, user.name);
    }
  };

  return (
    <div className="bg-surface min-h-screen text-slate-100 font-jakarta rtl relative overflow-hidden" dir="rtl">
      {/* Royal Background Elements */}
      <div className="particles-bg">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }} 
          />
        ))}
      </div>
      <div className="section-glow section-glow-gold top-0 left-1/4 w-[500px] h-[500px]"></div>
      <div className="section-glow section-glow-gold bottom-0 right-1/4 w-[600px] h-[600px] opacity-[0.03]"></div>

      <Navbar />
      
      <main className="container mx-auto px-6 pt-40 pb-24">
        {/* Premium Cinematic Header */}
        <section className="mb-20">
          <PremiumProfile 
            user={{
              name: user.name.toUpperCase(), // Forcing high-end cinematic feel
              email: user.email,
              avatar: user.avatar,
              tier: "👑 PRO MEMBER",
              roleBadge: user.tier
            }}
            stats={{
              readingHours: 12, // Placeholder or fetch from real stats if available
              booksInLibrary: ownedBooks.length,
              streak: 5
            }}
            onLogout={handleLogout}
          />
        </section>

        {/* Decorative Separator */}
        <div className="ornament-separator opacity-40">
           <div className="w-3 h-3 rounded-full border border-gold-500 animate-pulse"></div>
        </div>

        {/* Library Section */}
        <section>
          <div className="flex flex-col items-center mb-20">
             <h2 className="text-6xl font-amiri font-black gold-text mb-4">مكتبتك الخاصة</h2>
             <div className="h-1 w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
             <p className="text-slate-500 mt-6 font-medium tracking-widest uppercase text-xs">مجموعة الكتب النادرة والمقتنيات الملكية</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            <AnimatePresence mode="popLayout">
              {loadingBooks ? (
                 [...Array(4)].map((_, i) => (
                   <div key={i} className="aspect-[3/4.5] bg-surface-container-low animate-pulse rounded-[2rem] border border-gold-900/10" />
                 ))
              ) : ownedBooks.length === 0 ? (
                <div className="col-span-full py-40 text-center relative group">
                   <div className="absolute inset-0 bg-gold-500/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                   <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-2">
                      <div className="w-24 h-24 bg-surface-container-low border border-gold-900/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                        <Inventory2Icon className="text-5xl text-gold-500/30 group-hover:text-gold-500/60 transition-colors" />
                      </div>
                      <p className="text-4xl font-amiri font-black text-slate-300 mb-4 tracking-tight">خزانتك لا تزال بانتظار كنوزها الأولى</p>
                      <p className="text-slate-500 mb-10 max-w-md mx-auto leading-relaxed font-medium">اكتشف مجموعتنا الحصرية من المخطوطات والكتب النادرة وابدأ في بناء إرثك الثقافي اليوم.</p>
                      <button 
                        onClick={() => navigate('/search')} 
                        className="gold-button scale-95 hover:scale-105 transition-transform inline-flex items-center gap-3"
                      >
                        <span>تصفح الخزانة الملكية</span>
                        <div className="w-6 h-6 rounded-full bg-slate-950/20 flex items-center justify-center">→</div>
                      </button>
                   </div>
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
                      onClick={() => handleDownload(book)}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gold-500 text-slate-950 px-4 py-2 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg hover:bg-gold-400 whitespace-nowrap"
                    >
                      <DownloadIcon className="text-sm group-hover:animate-bounce" />
                      <span>اقتناء النسخة الملكية</span>
                    </button>
                    <div className="absolute inset-0 rounded-2xl border border-gold-500/50 opacity-0 group-hover:opacity-100 animate-pulse pointer-events-none"></div>
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
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="bg-surface-container-low border-2 border-gold-900/30 rounded-[3.5rem] p-12 w-full max-w-2xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden"
                onClick={e => e.stopPropagation()}
                dir="rtl"
              >
                {/* Decorative background for modal */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 blur-[100px] pointer-events-none"></div>
                
                <div className="flex flex-row-reverse items-center justify-between mb-10 relative z-10">
                  <h2 className="text-4xl font-amiri font-black gold-text">اختيار الرمز الملكي</h2>
                  <button aria-label="إغلاق النافذة" onClick={() => { setShowAvatarModal(false); setUploadPreview(null); }} className="w-12 h-12 rounded-2xl bg-surface border border-gold-900/20 flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/30 transition-all hover:rotate-90">
                    <CloseIcon className="text-slate-400 group-hover:text-red-400" />
                  </button>
                </div>

                <div className="relative z-10">
                  {/* Upload from device */}
                  <div className="mb-12">
                    <p className="text-slate-300 font-black mb-6 text-right flex items-center gap-2 justify-end">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
                      رفع صورة مخصصة
                    </p>
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
                  <p className="text-slate-300 font-black mb-6 text-right flex items-center gap-2 justify-end">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
                    المعرض الملكي
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                    {PRESET_AVATARS.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => applyAvatar(src)}
                        className={`group/av-item relative aspect-square rounded-[1.5rem] overflow-hidden border-2 transition-all duration-300 hover:-translate-y-1 ${
                          user.avatar === src ? 'border-gold-500 shadow-[0_0_25px_rgba(212,175,55,0.3)] scale-105' : 'border-gold-900/10 hover:border-gold-500/50'
                        }`}
                      >
                        <img src={src} alt={`صورة رمزية مستعارة ${i}`} loading="lazy" className="w-full h-full object-cover bg-surface-container-lowest transition-transform duration-500 group-hover/av-item:scale-125" />
                        {user.avatar === src && (
                          <div className="absolute inset-0 bg-gold-500/10 flex items-center justify-center">
                            <div className="bg-gold-500 text-slate-950 p-1 rounded-full">
                              <CheckCircleIcon className="text-xs" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
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
