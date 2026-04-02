import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useToast } from '../../components/Toast';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../lib/firebase';
import { uploadToSupabase } from '../../lib/supabase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { suggestCategory } from '../../utils/ai';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import SyncIcon from '@mui/icons-material/Sync';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ReplayIcon from '@mui/icons-material/Replay';

const UploadBook: React.FC = () => {
  const [step, setStep] = useState(1);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    category: '',
    publicationYear: '',
    license: 'Licensed',
    tags: '',
    isAIGenerated: false
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCover, setSelectedCover] = useState<File | null>(null);
  const [hasDraft, setHasDraft] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Track which file is currently being uploaded for retry logic
  const uploadStateRef = useRef<{
    coverUrl?: string;
    fileUrl?: string;
    phase: 'none' | 'cover' | 'file' | 'metadata';
  }>({ phase: 'none' });



  // Load draft on mount
  React.useEffect(() => {
    const savedDraft = localStorage.getItem('upload_draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData(draft.formData);
        setStep(draft.step);
        uploadStateRef.current = draft.uploadState;
        setHasDraft(true);
        showToast('🔄 تم استعادة مسودة الرفع السابقة.', 'info');
      } catch (e) {
        console.error("Error loading draft:", e);
      }
    }
  }, []);

  // Save draft on changes
  React.useEffect(() => {
    const draft = {
      formData,
      step,
      uploadState: uploadStateRef.current
    };
    localStorage.setItem('upload_draft', JSON.stringify(draft));
  }, [formData, step]);

  const clearDraft = () => {
    localStorage.removeItem('upload_draft');
    setFormData({
      title: '',
      author: '',
      description: '',
      price: '',
      category: '',
      publicationYear: '',
      license: 'Licensed',
      tags: '',
      isAIGenerated: false
    });
    setStep(1);
    setSelectedFile(null);
    setSelectedCover(null);
    uploadStateRef.current = { phase: 'none' };
    setHasDraft(false);
    showToast('تم مسح المسودة.', 'info');
  };

  const generateAIContent = () => {
    setAiLoading(true);
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        description: `هذا المجلد الموقر بعنوان "${prev.title}" هو تحفة أدبية تستكشف أعماق الحكمة البشرية. بقلم الموقر ${prev.author}، نأخذك في رحلة ملكية عبر فصول مشوقة تم صياغتها بعناية بالغة لتناسب ذائقة القراء المتميزين.`,
        tags: 'أدب_رفيع, حكمة, تاريخ, ملكي',
        isAIGenerated: true
      }));
      setAiLoading(false);
    }, 1500);
  };

  const startUploadProcess = async (retryPhase?: 'cover' | 'file' | 'metadata') => {
    if (!db) {
      showToast('⚠️ لم يتم تهيئة قاعدة البيانات.', 'error');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const currentPhase = retryPhase || 'cover';

      // Phase 1: Cover Image → Supabase Storage 'covers' bucket
      if (currentPhase === 'cover') {
        if (!selectedCover) { showToast('❌ الغلاف مفقود.', 'error'); setIsUploading(false); return; }
        uploadStateRef.current.phase = 'cover';
        setUploadStatus('جاري رفع الغلاف الملكي...');
        setUploadProgress(5);

        const coverUrl = await uploadToSupabase(selectedCover, 'covers', (p) => setUploadProgress(p * 0.48));
        uploadStateRef.current.coverUrl = coverUrl;
        uploadStateRef.current.phase = 'file';
        setUploadProgress(50);
      }

      // Phase 2: PDF/ePub → Supabase Storage 'books' bucket
      if (uploadStateRef.current.phase === 'file') {
        if (!selectedFile) { showToast('❌ ملف الكتاب مفقود.', 'error'); setIsUploading(false); return; }
        setUploadStatus('جاري رفع المجلد الرقمي...');

        const fileUrl = await uploadToSupabase(selectedFile, 'books', (p) => setUploadProgress(50 + p * 0.45));
        uploadStateRef.current.fileUrl = fileUrl;
        uploadStateRef.current.phase = 'metadata';
        setUploadProgress(97);
      }

      // Phase 3: Save Metadata → Firestore 'books' collection
      if (uploadStateRef.current.phase === 'metadata') {
        setUploadStatus('جاري تسجيل البيانات في الخزانة...');
        await addDoc(collection(db, 'books'), {
          title: formData.title || 'بدون عنوان',
          author: formData.author || 'غير معروف',
          price: parseFloat(formData.price) || 0,
          description: formData.description || '',
          category: formData.category || 'عام',
          publicationYear: formData.publicationYear || '',
          license: formData.license || 'Licensed',
          status: 'pending',
          coverUrl: uploadStateRef.current.coverUrl || '',
          fileUrl: uploadStateRef.current.fileUrl || '',
          uploadDate: new Date().toISOString().split('T')[0],
          createdAt: serverTimestamp(),
          views: 0,
          downloads: 0,
          uploadedBy: auth?.currentUser?.uid || null
        });

        setUploadProgress(100);
        localStorage.removeItem('upload_draft');
        showToast('تم حفظ الكتاب بنجاح 👑', 'success', 5000);
        setIsUploading(false);
        navigate('/admin');
      }
    } catch (error: any) {
      console.error('❌ Upload error:', error);
      setUploadError(error.message);
      setIsUploading(false);
      showToast('خطأ في الرفع: ' + error.message, 'error');
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen bg-surface text-slate-100 font-jakarta rtl" dir="rtl">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-40 pb-24 max-w-5xl">
        <div className="bg-surface-container-low rounded-[4rem] border border-gold-900/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
          
          <div className="bg-gradient-to-r from-gold-900/20 to-transparent p-12 border-b border-gold-900/10 flex justify-between items-end">
            <div>
              <h1 className="text-5xl font-amiri font-black gold-text mb-4 inline-flex items-center gap-4">
                إضافة مجلد جديد للخزانة الملكية
                {hasDraft && step < 3 && (
                  <button 
                    onClick={clearDraft}
                    className="text-xs bg-red-500/10 text-red-400 px-4 py-2 rounded-full hover:bg-red-500/20 transition-all font-bold border border-red-500/20"
                  >
                    مسح المسودة 🗑️
                  </button>
                )}
              </h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">المرحلة {step} من 3: {step === 1 ? 'رفع الملفات' : step === 2 ? 'البيانات الملكية' : 'التحقق والمراجعة'}</p>
            </div>
          </div>

          <div className="p-12 md:p-20">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-xl font-black gold-text block">ملف الكتاب (PDF / ePub)</label>
                      <div className={`border-2 border-dashed ${selectedFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-gold-900/30'} rounded-3xl p-12 text-center hover:border-gold-500/50 transition-all group relative cursor-pointer`}>
                        <UploadFileIcon className={`text-6xl ${selectedFile ? 'text-emerald-500' : 'text-gold-900 group-hover:text-gold-500'} transition-colors mb-4`} />
                        <p className={`font-bold ${selectedFile ? 'text-emerald-400' : 'text-slate-400'}`}>{selectedFile ? selectedFile.name : 'اسحب الملف هنا أو انقر للإختيار'}</p>
                        <input type="file" accept=".pdf,.epub" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-xl font-black gold-text block">غلاف المجلد (عالي الدقة)</label>
                      <div className={`border-2 border-dashed ${selectedCover ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-gold-900/30'} rounded-3xl p-12 text-center hover:border-gold-500/50 transition-all group relative cursor-pointer`}>
                        <AddPhotoAlternateIcon className={`text-6xl ${selectedCover ? 'text-emerald-500' : 'text-gold-900 group-hover:text-gold-500'} transition-colors mb-4`} />
                        <p className={`font-bold ${selectedCover ? 'text-emerald-400' : 'text-slate-400'}`}>{selectedCover ? selectedCover.name : 'يفضل أبعاد 3:4 للمظهر الملكي'}</p>
                        <input type="file" accept="image/*" onChange={(e) => setSelectedCover(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                  <button onClick={nextStep} className="gold-button w-full py-6 rounded-2xl font-black text-xl shadow-xl transform hover:scale-[1.02] transition-all">الاستمرار للبيانات</button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="font-black text-slate-400">عنوان المجلد</label>
                      <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="مثال: مقدمة ابن خلدون" className="w-full bg-surface-container-lowest border border-gold-900/10 rounded-2xl p-5 focus:border-gold-500/50 outline-none transition-all text-white font-bold" />
                    </div>
                    <div className="space-y-4">
                      <label className="font-black text-slate-400">اسم المؤلف الموقر</label>
                      <input type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} placeholder="اسم الكاتب الكامل" className="w-full bg-surface-container-lowest border border-gold-900/10 rounded-2xl p-5 focus:border-gold-500/50 outline-none transition-all text-white font-bold" />
                    </div>
                  </div>
                  <div className="space-y-4 relative">
                    <div className="flex justify-between items-center mb-2">
                       <label className="font-black text-slate-400">الوصف الملكي للمحتوى</label>
                       <button onClick={generateAIContent} disabled={aiLoading || !formData.title} className="flex items-center gap-2 text-gold-500 font-black hover:text-gold-400 transition-all disabled:opacity-30">
                         {aiLoading ? <SyncIcon className="animate-spin text-lg" /> : <AutoAwesomeIcon className="text-lg" />}
                         {aiLoading ? 'جاري التوليد...' : 'توليد بالذكاء الاصطناعي'}
                       </button>
                    </div>
                    <textarea rows={6} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-surface-container-lowest border border-gold-900/10 rounded-3xl p-6 focus:border-gold-500/50 outline-none transition-all text-white font-medium text-lg leading-relaxed" />
                  </div>
                  <div className="grid md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                      <label className="font-black text-slate-400">سنة النشر</label>
                      <input type="text" value={formData.publicationYear} onChange={e => setFormData({...formData, publicationYear: e.target.value})} placeholder="مثال: 2023" className="w-full bg-surface-container-lowest border border-gold-900/10 rounded-2xl p-5 focus:border-gold-500/50 outline-none transition-all text-white font-bold" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <label className="font-black text-slate-400">التصنيف</label>
                        <button 
                          type="button"
                          onClick={() => {
                            const suggestion = suggestCategory(formData.title, formData.description);
                            setFormData(prev => ({ ...prev, category: suggestion }));
                            showToast(`✨ اقتراح الذكاء الاصطناعي: ${suggestion}`, 'info');
                          }}
                          className="text-[10px] bg-gold-900/10 text-gold-500 px-3 py-1 rounded-full font-black border border-gold-900/10 hover:bg-gold-500 hover:text-slate-950 transition-all flex items-center gap-1"
                        >
                          <AutoAwesomeIcon className="text-[12px]" /> اقتراح سحري
                        </button>
                      </div>
                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-surface-container-lowest border border-gold-900/10 rounded-2xl p-5 focus:border-gold-500/50 outline-none transition-all text-white font-bold">
                         <option>تاريخ</option><option>أدب</option><option>فلسفة</option><option>رواية / خيال</option><option>السير والتراجم</option><option>العلوم الطبيعية</option><option>الفنون والعمارة</option><option>الدين والفكر</option><option>علوم القرآن والحديث</option><option>المخطوطات النادرة</option><option>السياسة والاقتصاد</option><option>تطوير الذات</option><option>الشعر</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="font-black text-slate-400">السعر المقترح ($)</label>
                      <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-surface-container-lowest border border-gold-900/10 rounded-2xl p-5 focus:border-gold-500/50 outline-none transition-all text-white font-bold" />
                    </div>
                    <div className="space-y-4">
                      <label className="font-black text-slate-400">نوع الترخيص</label>
                      <select value={formData.license} onChange={e => setFormData({...formData, license: e.target.value})} className="w-full bg-surface-container-lowest border border-gold-900/10 rounded-2xl p-5 focus:border-gold-500/50 outline-none transition-all text-white font-bold">
                         <option>Licensed</option><option>Public Domain</option><option>Creative Commons</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-6 pt-10">
                    <button onClick={prevStep} className="flex-1 bg-surface-container-lowest border border-gold-900/20 py-5 rounded-2xl font-black text-slate-400 hover:text-gold-500 transition-all">العودة للرفع</button>
                    <button onClick={nextStep} className="flex-[2] gold-button py-5 rounded-2xl font-black text-xl shadow-xl">الاستمرار للمراجعة</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                  {/* Header */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gold-600/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-2 ring-gold-500/20">
                      <TaskAltIcon className="text-5xl text-gold-500" />
                    </div>
                    <h2 className="text-3xl font-amiri font-black text-white mb-2">مراجعة وتعديل بيانات الكتاب</h2>
                    <p className="text-slate-500 font-bold text-sm">يمكنك تعديل أي معلومة قبل إتمام النشر</p>
                  </div>

                  {/* Editable Fields */}
                  <div className="bg-surface-container-lowest/50 border border-gold-900/10 p-8 rounded-[2.5rem] space-y-6 text-right">
                    {/* Row: Title + Author */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">عنوان الكتاب *</label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={e => setFormData({ ...formData, title: e.target.value })}
                          placeholder="عنوان الكتاب"
                          className="w-full bg-surface-container-lowest border border-gold-900/20 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-gold-500/50 transition-all text-right"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">اسم الكاتب / المؤلف *</label>
                        <input
                          type="text"
                          value={formData.author}
                          onChange={e => setFormData({ ...formData, author: e.target.value })}
                          placeholder="اسم الكاتب الكامل"
                          className="w-full bg-surface-container-lowest border border-gold-900/20 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-gold-500/50 transition-all text-right"
                        />
                      </div>
                    </div>

                    {/* Row: Year + Category + Price */}
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">سنة الإصدار</label>
                        <input
                          type="text"
                          value={formData.publicationYear}
                          onChange={e => setFormData({ ...formData, publicationYear: e.target.value })}
                          placeholder="مثال: 2023"
                          className="w-full bg-surface-container-lowest border border-gold-900/20 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-gold-500/50 transition-all text-right"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">التصنيف</label>
                        <select
                          value={formData.category}
                          onChange={e => setFormData({ ...formData, category: e.target.value })}
                          className="w-full bg-surface-container-lowest border border-gold-900/20 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-gold-500/50 transition-all text-right"
                        >
                          <option>تاريخ</option><option>أدب</option><option>فلسفة</option>
                          <option>رواية / خيال</option><option>السير والتراجم</option>
                          <option>العلوم الطبيعية</option><option>الفنون والعمارة</option>
                          <option>الدين والفكر</option><option>علوم القرآن والحديث</option>
                          <option>المخطوطات النادرة</option><option>السياسة والاقتصاد</option>
                          <option>تطوير الذات</option><option>الشعر</option><option>عام</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">السعر ($)</label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={e => setFormData({ ...formData, price: e.target.value })}
                          placeholder="0.00"
                          className="w-full bg-surface-container-lowest border border-gold-900/20 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-gold-500/50 transition-all text-right"
                        />
                      </div>
                    </div>

                    {/* License */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">نوع الترخيص</label>
                      <select
                        value={formData.license}
                        onChange={e => setFormData({ ...formData, license: e.target.value })}
                        className="w-full bg-surface-container-lowest border border-gold-900/20 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-gold-500/50 transition-all text-right"
                      >
                        <option>Licensed</option>
                        <option>Public Domain</option>
                        <option>Creative Commons</option>
                      </select>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">وصف الكتاب</label>
                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="وصف مفصّل عن محتوى الكتاب..."
                        className="w-full bg-surface-container-lowest border border-gold-900/20 rounded-2xl px-5 py-4 text-white font-medium focus:outline-none focus:border-gold-500/50 transition-all text-right resize-none leading-relaxed"
                      />
                    </div>

                    {/* Files summary */}
                    <div className="grid md:grid-cols-2 gap-4 pt-2">
                      <div className={`flex items-center gap-3 p-4 rounded-2xl border ${selectedFile ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                        <span className={`text-lg ${selectedFile ? 'text-emerald-400' : 'text-red-400'}`}>{selectedFile ? '✅' : '❌'}</span>
                        <div className="text-right">
                          <p className="text-xs font-black text-slate-500">ملف الكتاب</p>
                          <p className="text-sm font-bold text-white truncate max-w-[160px]">{selectedFile ? selectedFile.name : 'لم يتم الاختيار'}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-3 p-4 rounded-2xl border ${selectedCover ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                        <span className={`text-lg ${selectedCover ? 'text-emerald-400' : 'text-red-400'}`}>{selectedCover ? '✅' : '❌'}</span>
                        <div className="text-right">
                          <p className="text-xs font-black text-slate-500">صورة الغلاف</p>
                          <p className="text-sm font-bold text-white truncate max-w-[160px]">{selectedCover ? selectedCover.name : 'لم يتم الاختيار'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upload Progress / Error / Actions */}
                  {isUploading ? (
                    <div className="space-y-6 bg-surface-container-lowest p-8 rounded-3xl border border-gold-500/10">
                      <div className="flex justify-between items-center text-sm font-black text-gold-500 uppercase tracking-widest">
                        <span>{uploadStatus}</span>
                        <span>{Math.round(uploadProgress)}%</span>
                      </div>
                      <div className="h-4 bg-surface rounded-full overflow-hidden border border-gold-900/10 p-1">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} className="h-full bg-gradient-to-r from-gold-700 via-gold-500 to-gold-300 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
                      </div>
                      <p className="text-xs text-slate-500 text-center font-bold animate-pulse">جاري الرفع إلى السحابة الملكية... يرجى عدم إغلاق الصفحة</p>
                    </div>
                  ) : uploadError ? (
                    <div className="space-y-6 bg-red-500/5 p-8 rounded-3xl border border-red-500/20 text-center">
                      <p className="text-red-400 font-bold">عذراً، حدث خطأ: {uploadError}</p>
                      <button onClick={() => startUploadProcess(uploadStateRef.current.phase as any)} className="flex items-center gap-2 px-6 py-4 bg-red-500 text-white rounded-2xl mx-auto font-black hover:bg-red-600 transition-all">
                        <ReplayIcon /> إعادة المحاولة
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-6">
                      <button onClick={prevStep} className="flex-1 bg-surface-container-lowest border border-gold-900/20 py-5 rounded-2xl font-black text-slate-400 hover:text-gold-500 transition-all">
                        ← رفع الملفات
                      </button>
                      <button
                        disabled={!selectedFile || !selectedCover || !formData.title || !formData.author}
                        onClick={() => startUploadProcess()}
                        className="flex-[2] gold-button py-5 rounded-2xl font-black text-xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        إتمام النشر الملكي 👑
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UploadBook;
