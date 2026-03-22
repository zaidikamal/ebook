import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useToast } from '../../components/Toast';
import { useNavigate } from 'react-router-dom';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import SyncIcon from '@mui/icons-material/Sync';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

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
    license: 'Licensed',
    tags: '',
    isAIGenerated: false
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCover, setSelectedCover] = useState<File | null>(null);

  const generateAIContent = () => {
    setAiLoading(true);
    // Mocking AI response
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

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen bg-surface text-slate-100 font-jakarta rtl" dir="rtl">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-40 pb-24 max-w-5xl">
        <div className="bg-surface-container-low rounded-[4rem] border border-gold-900/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-gold-900/20 to-transparent p-12 border-b border-gold-900/10">
            <h1 className="text-5xl font-amiri font-black gold-text mb-4">إضافة مجلد جديد للخزانة الملكية</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">المرحلة {step} من 3: {step === 1 ? 'رفع الملفات' : step === 2 ? 'البيانات الملكية' : 'التحقق والمراجعة'}</p>
          </div>

          <div className="p-12 md:p-20">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-xl font-black gold-text block">ملف الكتاب (PDF / ePub)</label>
                      <div className={`border-2 border-dashed ${selectedFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-gold-900/30'} rounded-3xl p-12 text-center hover:border-gold-500/50 transition-all group relative cursor-pointer`}>
                        <UploadFileIcon className={`text-6xl ${selectedFile ? 'text-emerald-500' : 'text-gold-900 group-hover:text-gold-500'} transition-colors mb-4`} />
                        <p className={`font-bold ${selectedFile ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {selectedFile ? selectedFile.name : 'اسحب الملف هنا أو انقر للإختيار'}
                        </p>
                        <input 
                          type="file" 
                          accept=".pdf,.epub"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-xl font-black gold-text block">غلاف المجلد (عالي الدقة)</label>
                      <div className={`border-2 border-dashed ${selectedCover ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-gold-900/30'} rounded-3xl p-12 text-center hover:border-gold-500/50 transition-all group relative cursor-pointer`}>
                        <AddPhotoAlternateIcon className={`text-6xl ${selectedCover ? 'text-emerald-500' : 'text-gold-900 group-hover:text-gold-500'} transition-colors mb-4`} />
                        <p className={`font-bold ${selectedCover ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {selectedCover ? selectedCover.name : 'يفضل أبعاد 3:4 للمظهر الملكي'}
                        </p>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => setSelectedCover(e.target.files?.[0] || null)}
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                        />
                      </div>
                    </div>
                  </div>
                  <button onClick={nextStep} className="gold-button w-full py-6 rounded-2xl font-black text-xl shadow-xl transform hover:scale-[1.02] transition-all">الاستمرار للبيانات</button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="font-black text-slate-400">عنوان المجلد</label>
                      <input 
                        type="text" 
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        placeholder="مثال: مقدمة ابن خلدون"
                        className="w-full bg-surface-container-lowest border border-gold-900/10 rounded-2xl p-5 focus:border-gold-500/50 outline-none transition-all text-white font-bold" 
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="font-black text-slate-400">اسم المؤلف الموقر</label>
                      <input 
                        type="text" 
                        value={formData.author}
                        onChange={e => setFormData({...formData, author: e.target.value})}
                        placeholder="اسم الكاتب الكامل"
                        className="w-full bg-surface-container-lowest border border-gold-900/10 rounded-2xl p-5 focus:border-gold-500/50 outline-none transition-all text-white font-bold" 
                      />
                    </div>
                  </div>

                  <div className="space-y-4 relative">
                    <div className="flex justify-between items-center mb-2">
                       <label className="font-black text-slate-400">الوصف الملكي للمحتوى</label>
                       <button 
                         onClick={generateAIContent}
                         disabled={aiLoading || !formData.title}
                         className="flex items-center gap-2 text-gold-500 font-black hover:text-gold-400 transition-all disabled:opacity-30"
                       >
                         {aiLoading ? <SyncIcon className="text-lg" /> : <AutoAwesomeIcon className="text-lg" />}
                         {aiLoading ? 'جاري التوليد...' : 'توليد بالذكاء الاصطناعي'}
                       </button>
                    </div>
                    <textarea 
                      rows={6}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-surface-container-lowest border border-gold-900/10 rounded-3xl p-6 focus:border-gold-500/50 outline-none transition-all text-white font-medium text-lg leading-relaxed" 
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                      <label className="font-black text-slate-400">التصنيف</label>
                      <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-surface-container-lowest border border-gold-900/10 rounded-2xl p-5 focus:border-gold-500/50 outline-none transition-all text-white font-bold"
                      >
                         <option>تاريخ</option>
                         <option>أدب</option>
                         <option>فلسفة</option>
                         <option>رواية / خيال</option>
                         <option>السير والتراجم</option>
                         <option>العلوم الطبيعية</option>
                         <option>الفنون والعمارة</option>
                         <option>الدين والفكر</option>
                         <option>علوم القرآن والحديث</option>
                         <option>المخطوطات النادرة</option>
                         <option>السياسة والاقتصاد</option>
                         <option>تطوير الذات</option>
                         <option>الشعر</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="font-black text-slate-400">السعر المقترح ($)</label>
                      <input 
                        type="number" 
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        className="w-full bg-surface-container-lowest border border-gold-900/10 rounded-2xl p-5 focus:border-gold-500/50 outline-none transition-all text-white font-bold" 
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="font-black text-slate-400">نوع الترخيص</label>
                      <select 
                        value={formData.license}
                        onChange={e => setFormData({...formData, license: e.target.value})}
                        className="w-full bg-surface-container-lowest border border-gold-900/10 rounded-2xl p-5 focus:border-gold-500/50 outline-none transition-all text-white font-bold"
                      >
                         <option>Licensed</option>
                         <option>Public Domain</option>
                         <option>Creative Commons</option>
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
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-12 text-center"
                >
                   <div className="w-32 h-32 bg-gold-600/10 rounded-full flex items-center justify-center mx-auto mb-10 ring-2 ring-gold-500/20">
                     <TaskAltIcon className="text-7xl text-gold-500" />
                   </div>
                   <h2 className="text-4xl font-amiri font-black text-white">تحقق أخير من المخطوطة</h2>
                   <div className="bg-surface-container-lowest/50 border border-gold-900/10 p-10 rounded-[3rem] text-right space-y-6 max-w-2xl mx-auto">
                      <div className="flex justify-between border-b border-gold-900/5 pb-4">
                        <span className="text-slate-500">العنوان:</span>
                        <span className="font-black text-gold-500">{formData.title}</span>
                      </div>
                      <div className="flex justify-between border-b border-gold-900/5 pb-4">
                        <span className="text-slate-500">المؤلف:</span>
                        <span className="font-black">{formData.author}</span>
                      </div>
                      <div className="flex justify-between border-b border-gold-900/5 pb-4">
                        <span className="text-slate-500">السعر:</span>
                        <span className="font-black text-emerald-500">${formData.price}</span>
                      </div>
                      <p className="text-xs text-slate-500 text-center pt-6 leading-relaxed">بضغطك على إتمام النشر، أنت توافق على أنك تملك كافة الحقوق القانونية لنشر هذا المحتوى، وأن المنصة غير مسؤولة عن أي ملاحقة قانونية ناتجة عن عدم امتلاك الحقوق.</p>
                   </div>

                   <div className="flex gap-6 pt-12">
                    <button onClick={prevStep} className="flex-1 bg-surface-container-lowest border border-gold-900/20 py-5 rounded-2xl font-black text-slate-400 hover:text-gold-500 transition-all">تعديل البيانات</button>
                    <button onClick={() => {
                      // Save to localStorage for persistence in this demo
                      const newUpload = {
                        id: Math.random().toString(36).substr(2, 9),
                        title: formData.title,
                        author: formData.author,
                        category: formData.category || 'أدب',
                        status: 'pending',
                        uploadDate: new Date().toISOString().split('T')[0],
                        price: parseFloat(formData.price) || 0
                      };
                      
                      const existingUploads = JSON.parse(localStorage.getItem('royal_uploads') || '[]');
                      localStorage.setItem('royal_uploads', JSON.stringify([newUpload, ...existingUploads]));

                      showToast('تم إرسال المجلد للمراجعة الملكية بنجاح! 👑', 'success', 5000);
                      setTimeout(() => navigate('/admin/uploads'), 1500);
                    }} className="flex-[2] gold-button py-5 rounded-2xl font-black text-xl shadow-xl">إتمام النشر الملكي 👑</button>
                   </div>
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
