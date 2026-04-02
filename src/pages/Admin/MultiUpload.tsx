import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useToast } from '../../components/Toast';
import { useNavigate } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { uploadToSupabase } from '../../lib/supabase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { suggestCategory } from '../../utils/ai';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SyncIcon from '@mui/icons-material/Sync';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';

interface UploadItem {
  id: string;
  file: File;
  cover: File | null;
  title: string;
  author: string;
  publicationYear: string;
  category: string;
  progress: number;
  status: 'idle' | 'uploading' | 'completed' | 'error';
  error?: string;
}

const MultiUpload: React.FC = () => {
  const [items, setItems] = useState<UploadItem[]>([]);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newItems: UploadItem[] = Array.from(files).map(file => {
      // Auto-extract title from filename (remove extension and replace _ with spaces)
      const cleanTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        cover: null,
        title: cleanTitle,
        author: '',
        publicationYear: '',
        category: suggestCategory(cleanTitle, ''),
        progress: 0,
        status: 'idle'
      };
    });
    setItems(prev => [...prev, ...newItems]);
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const updateItem = (id: string, updates: Partial<UploadItem>) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const processUpload = async () => {
    if (items.length === 0) return;
    
    showToast('🚀 بدء الرفع الجماعي الملكي...', 'info');

    for (const item of items) {
      if (item.status === 'completed' || item.status === 'uploading') continue;

      try {
        updateItem(item.id, { status: 'uploading', progress: 5 });

        // Step 1: Upload Cover to Supabase (if exists)
        let coverUrl = '';
        if (item.cover) {
          coverUrl = await uploadToSupabase(item.cover, 'covers', (p) =>
            updateItem(item.id, { progress: Math.round(p * 0.4) })
          );
        }

        // Step 2: Upload PDF to Supabase
        updateItem(item.id, { progress: 40 });
        const fileUrl = await uploadToSupabase(item.file, 'books', (p) =>
          updateItem(item.id, { progress: 40 + Math.round(p * 0.5) })
        );

        // Step 3: Save Metadata to Firestore
        await addDoc(collection(db, 'books'), {
          title: item.title,
          author: item.author || 'مؤلف غير معروف',
          publicationYear: item.publicationYear,
          category: item.category,
          description: `مجلد ملكي تم رفعه عبر نظام الرفع الجماعي.`,
          price: 0,
          license: 'Licensed',
          coverUrl,
          fileUrl,
          status: 'pending',
          uploadDate: new Date().toISOString().split('T')[0],
          createdAt: serverTimestamp(),
        });

        updateItem(item.id, { status: 'completed', progress: 100 });
      } catch (err: any) {
        updateItem(item.id, { status: 'error', error: err.message });
      }
    }

    showToast('👑 اكتملت عملية الرفع الجماعي الموقرة.', 'success');
  };

  return (
    <div className="min-h-screen bg-surface text-slate-100 font-jakarta rtl" dir="rtl">
      <Navbar />
      <main className="container mx-auto px-6 pt-40 pb-24 max-w-6xl">
        <div className="bg-surface-container-low rounded-[4rem] border border-gold-900/20 shadow-2xl overflow-hidden p-12">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-5xl font-amiri font-black gold-text mb-4">الرفع الجماعي الملكي (Multi-Upload)</h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">ارفع مكتبة كاملة بضغطة واحدة</p>
            </div>
            <button onClick={() => navigate('/admin')} className="text-gold-500 font-black hover:text-white transition-all">العودة لمركز التحكم</button>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Drop Zone */}
            <div className="lg:col-span-1 space-y-6">
              <div 
                className="border-4 border-dashed border-gold-900/30 rounded-[3rem] p-12 text-center hover:border-gold-500/50 transition-all group relative bg-black/20"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
              >
                <CloudUploadIcon className="text-7xl text-gold-900 group-hover:text-gold-500 transition-all mb-4" />
                <h3 className="text-xl font-black text-white mb-2">اسحب المجلدات الملكية هنا</h3>
                <p className="text-slate-500 text-sm">أو انقر لاختيار الملفات من خزينتك</p>
                <input type="file" multiple accept=".pdf,.epub" onChange={(e) => handleFiles(e.target.files)} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              
              {items.length > 0 && (
                <button onClick={processUpload} className="w-full gold-button py-6 rounded-2xl font-black text-xl shadow-xl transform hover:scale-[1.02] transition-all">
                  بدء الرفع المجمع ({items.length})
                </button>
              )}
            </div>

            {/* Queue List */}
            <div className="lg:col-span-2 bg-black/30 rounded-[3rem] border border-gold-900/10 p-8 min-h-[400px]">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20">
                  <CloudUploadIcon className="text-9xl mb-4" />
                  <p className="text-2xl font-black">قائمة الرفع فارغة</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className={`bg-surface-container-lowest p-5 rounded-2xl border flex items-center justify-between gap-6 group transition-all ${item.status === 'completed' ? 'border-emerald-500/20 opacity-70' : 'border-gold-900/5'}`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateItem(item.id, { title: e.target.value })}
                            placeholder="عنوان الكتاب"
                            disabled={item.status === 'completed' || item.status === 'uploading'}
                            className="bg-transparent border-none outline-none font-black text-white p-0 m-0 flex-1 focus:text-gold-500 min-w-[150px] disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={item.author}
                              onChange={(e) => updateItem(item.id, { author: e.target.value })}
                              placeholder="المؤلف"
                              disabled={item.status === 'completed' || item.status === 'uploading'}
                              className="bg-surface border border-gold-900/20 rounded px-2 py-1 outline-none font-medium text-slate-300 text-sm focus:border-gold-500 w-32 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <input
                              type="text"
                              value={item.publicationYear}
                              onChange={(e) => updateItem(item.id, { publicationYear: e.target.value })}
                              placeholder="سنة النشر"
                              disabled={item.status === 'completed' || item.status === 'uploading'}
                              className="bg-surface border border-gold-900/20 rounded px-2 py-1 outline-none font-medium text-slate-300 text-sm focus:border-gold-500 w-24 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <span className="text-[10px] bg-gold-900/20 text-gold-500 px-2 py-1 rounded uppercase font-black">{item.category}</span>
                          </div>
                        </div>
                        {item.status === 'completed' && (
                          <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-1">✅ تم الرفع — يحتاج موافقة المدير</p>
                        )}
                        <div className="h-1 bg-surface rounded-full overflow-hidden mt-2">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${item.progress}%` }} className={`h-full ${item.status === 'error' ? 'bg-red-500' : 'bg-gold-500'}`} />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {item.status === 'completed' ? (
                          <CheckCircleIcon className="text-emerald-500" />
                        ) : item.status === 'uploading' ? (
                          <SyncIcon className="animate-spin text-gold-500" />
                        ) : (
                          <button onClick={() => removeItem(item.id)} className="text-slate-500 hover:text-red-400 group-hover:opacity-100 opacity-60 transition-all"><DeleteIcon /></button>
                        )}
                        {item.status !== 'completed' && (
                          <label className="cursor-pointer hover:text-gold-500 transition-colors">
                            {item.cover ? <AutoAwesomeIcon className="text-emerald-500" /> : <AddToPhotosIcon />}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => updateItem(item.id, { cover: e.target.files?.[0] || null })} />
                          </label>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MultiUpload;
