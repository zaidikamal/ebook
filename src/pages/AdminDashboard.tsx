import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import StarIcon from '@mui/icons-material/Star';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc, getDocs, where, writeBatch } from 'firebase/firestore';
import { useToast } from '../components/Toast';
import { useAuth } from '../contexts/AuthContext';
import { uploadToSupabase } from '../lib/supabase';

/* ===================== TYPES ===================== */
interface FirebaseBook {
  id: string;
  title: string;
  author: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadDate: string;
  price: number;
  publicationYear?: string;
  description?: string;
  license?: string;
  views?: number;
  downloads?: number;
  coverUrl?: string;
}

interface FirebaseUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  avatar?: string;
}

/* ===================== EDIT MODAL ===================== */
interface EditModalProps {
  book: FirebaseBook;
  onClose: () => void;
  onSave: (id: string, data: Partial<FirebaseBook>) => Promise<void>;
}

const EditModal: React.FC<EditModalProps> = ({ book, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: book.title || '',
    author: book.author || '',
    category: book.category || '',
    price: String(book.price || 0),
    publicationYear: book.publicationYear || '',
    description: book.description || '',
    license: book.license || 'Licensed',
  });
  const [saving, setSaving] = useState(false);
  const [newCoverFile, setNewCoverFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      let updatedCoverUrl = book.coverUrl;
      if (newCoverFile) {
        setUploadProgress(0);
        updatedCoverUrl = await uploadToSupabase(newCoverFile, 'covers', (p) => setUploadProgress(p));
      }
      await onSave(book.id, {
        title: form.title,
        author: form.author,
        category: form.category,
        price: parseFloat(form.price) || 0,
        publicationYear: form.publicationYear,
        description: form.description,
        license: form.license,
        ...(updatedCoverUrl && { coverUrl: updatedCoverUrl })
      });
      onClose();
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'حدث خطأ غير متوقع أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const previewUrl = newCoverFile ? URL.createObjectURL(newCoverFile) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={!saving ? onClose : undefined} />

      {/* Modal */}
      <div className="relative bg-[#0d1117] border border-gold-500/20 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.8)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gold-900/20">
          <button onClick={onClose} disabled={saving} className="p-2 rounded-xl hover:bg-white/5 transition-colors text-slate-400 hover:text-white disabled:opacity-40">
            <CloseIcon />
          </button>
          <div className="text-right">
            <h2 className="text-2xl font-amiri font-black gold-text">تعديل معلومات الكتاب</h2>
            <p className="text-slate-500 text-sm font-bold mt-1">يمكنك تحديث جميع بيانات الكاتب والكتاب وسنة الإصدار</p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8 space-y-6">
          {/* Row 1: Title & Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-400">عنوان الكتاب *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="عنوان الكتاب"
                className="w-full bg-white/5 border border-gold-900/20 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-gold-500/50 transition-all text-right"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-400">اسم الكاتب / المؤلف *</label>
              <input
                type="text"
                value={form.author}
                onChange={e => setForm({ ...form, author: e.target.value })}
                placeholder="اسم الكاتب الكامل"
                className="w-full bg-white/5 border border-gold-900/20 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-gold-500/50 transition-all text-right"
              />
            </div>
          </div>

          {/* Row 2: Year, Category, Price */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-400">سنة الإصدار</label>
              <input
                type="text"
                value={form.publicationYear}
                onChange={e => setForm({ ...form, publicationYear: e.target.value })}
                placeholder="مثال: 2023"
                className="w-full bg-white/5 border border-gold-900/20 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-gold-500/50 transition-all text-right"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-400">التصنيف</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[#0d1117] border border-gold-900/20 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-gold-500/50 transition-all text-right"
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
              <label className="text-sm font-black text-slate-400">السعر ($)</label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                placeholder="0.00"
                className="w-full bg-white/5 border border-gold-900/20 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-gold-500/50 transition-all text-right"
              />
            </div>
          </div>

          {/* License */}
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-400">نوع الترخيص</label>
            <select
              value={form.license}
              onChange={e => setForm({ ...form, license: e.target.value })}
              className="w-full bg-[#0d1117] border border-gold-900/20 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-gold-500/50 transition-all text-right"
            >
              <option>Licensed</option>
              <option>Public Domain</option>
              <option>Creative Commons</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-400">وصف الكتاب</label>
            <textarea
              rows={5}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="وصف مفصّل عن محتوى الكتاب..."
              className="w-full bg-white/5 border border-gold-900/20 rounded-2xl px-5 py-4 text-white font-medium focus:outline-none focus:border-gold-500/50 transition-all text-right resize-none leading-relaxed"
            />
          </div>
          
          {/* Cover Edit */}
          <div className="space-y-4 pt-4 border-t border-gold-900/20">
            <div className="flex items-center justify-between">
              <label className="text-sm font-black text-slate-400">تغيير غلاف الكتاب</label>
              {newCoverFile && (
                <button
                  type="button"
                  onClick={() => { setNewCoverFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="text-xs text-red-400 hover:text-red-300 font-black border border-red-500/20 px-3 py-1 rounded-xl hover:bg-red-500/10 transition-all"
                >
                  ✕ إلغاء الصورة الجديدة
                </button>
              )}
            </div>

            {/* Current Cover Preview */}
            {book.coverUrl && (
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-gold-900/10">
                <img 
                  src={book.coverUrl} 
                  alt="الغلاف الحالي"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  className="h-20 w-14 object-cover rounded-lg border border-gold-900/20 shadow-md flex-shrink-0" 
                />
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-black">الغلاف الحالي</p>
                  <p className="text-xs text-slate-600 mt-1 truncate max-w-[200px]">{book.coverUrl.split('/').pop()}</p>
                  {newCoverFile && (
                    <p className="text-xs text-gold-500 font-bold mt-1">سيتم استبداله بالصورة الجديدة</p>
                  )}
                </div>
              </div>
            )}

            {/* Drop Zone for New Cover */}
            <div className={`border-2 border-dashed ${newCoverFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-gold-900/30 hover:border-gold-500/50'} rounded-2xl p-6 text-center transition-all group relative cursor-pointer flex flex-col items-center justify-center`}>
              <AddPhotoAlternateIcon className={`text-4xl ${newCoverFile ? 'text-emerald-500' : 'text-gold-900 group-hover:text-gold-500'} transition-colors mb-2`} />
              <p className={`font-bold text-sm ${newCoverFile ? 'text-emerald-400' : 'text-slate-400'}`}>
                {newCoverFile ? `✓ ${newCoverFile.name}` : 'اسحب صورة الغلاف الجديدة هنا أو انقر للاختيار'}
              </p>
              {!newCoverFile && <p className="text-xs text-slate-600 mt-1">JPG, PNG, WebP · الحد الأقصى 10MB</p>}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => setNewCoverFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

            {/* New Cover Preview */}
            {previewUrl && (
              <div className="flex items-center gap-3 p-3 bg-emerald-500/5 rounded-2xl border border-emerald-500/20">
                <img src={previewUrl} alt="الغلاف الجديد" className="h-20 w-14 object-cover rounded-lg border border-emerald-500/20 shadow-md flex-shrink-0" />
                <div className="text-right">
                  <p className="text-xs text-emerald-400 font-black">الغلاف الجديد (قبل الحفظ)</p>
                  <p className="text-xs text-slate-500 mt-1">{(newCoverFile!.size / 1024).toFixed(0)} KB</p>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {saving && newCoverFile && uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs text-gold-500 font-black">
                  <span>جاري رفع الصورة...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-gold-700 to-gold-400 transition-all duration-300 rounded-full" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-right">
                <p className="text-red-400 font-bold text-sm">⚠️ {error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 p-8 border-t border-gold-900/20">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 bg-white/5 border border-gold-900/20 py-4 rounded-2xl font-black text-slate-400 hover:text-white transition-all disabled:opacity-40"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.title || !form.author}
            className="flex-[2] gold-button py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="animate-pulse">جاري الحفظ...</span>
            ) : (
              <><SaveIcon className="text-xl" /> حفظ التعديلات</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ===================== SECTION COMPONENTS ===================== */

const AnalyticsSection = ({ books }: { books: FirebaseBook[] }) => (
  <div className="space-y-12 relative z-10 text-right">
    <div className="relative pb-4">
      <h3 className="text-5xl font-amiri font-black gold-text mb-2">تحليلات الأداء الملكي</h3>
      <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] opacity-60">مؤشرات الرواج والتفاعل للمجلدات الإمبراطورية</p>
      <div className="absolute bottom-0 right-0 w-24 h-1 bg-gradient-to-l from-gold-500 to-transparent"></div>
    </div>

    <div className="overflow-x-auto pb-6 custom-scrollbar">
      <table className="w-full text-right border-separate border-spacing-y-4" dir="rtl">
        <thead>
          <tr className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
            <th className="pb-4 pr-10 text-right">المجلد الإمبراطوري</th>
            <th className="pb-4 text-center">المشاهدات الملكية</th>
            <th className="pb-4 text-center">التحميلات المعتمدة</th>
            <th className="pb-4 text-left pl-10">معدل الانذياع التام</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, idx) => (
            <tr 
              key={book.id} 
              className="group/row transition-all duration-500 hover:-translate-y-0.5"
              style={{ transitionDelay: `${idx * 40}ms` }}
            >
              <td className="py-5 pr-10 bg-[#0c0c0d] group-hover/row:bg-gold-500/[0.05] rounded-r-[2.5rem] border-r border-y border-gold-500/10 group-hover/row:border-gold-500/30 transition-all">
                <div className="flex items-center gap-5">
                   <div className="w-10 h-14 bg-gold-500/10 rounded overflow-hidden border border-white/5">
                      <img src={book.coverUrl || "https://i.imgur.com/8K9f6V2.png"} className="w-full h-full object-cover grayscale group-hover/row:grayscale-0 transition-all" alt="" />
                   </div>
                   <p className="font-playfair font-black text-white group-hover/row:text-gold-400 transition-colors text-lg">{book.title}</p>
                </div>
              </td>
              <td className="py-5 bg-[#0c0c0d] group-hover/row:bg-gold-500/[0.05] border-y border-gold-500/10 group-hover/row:border-gold-500/30 text-center transition-all">
                <span className="text-slate-400 font-bold text-lg">{book.views || 0}</span>
              </td>
              <td className="py-5 bg-[#0c0c0d] group-hover/row:bg-gold-500/[0.05] border-y border-gold-500/10 group-hover/row:border-gold-500/30 text-center transition-all">
                <span className="text-emerald-500 font-black text-lg">{book.downloads || 0}</span>
              </td>
              <td className="py-5 pl-10 bg-[#0c0c0d] group-hover/row:bg-gold-500/[0.05] rounded-l-[2.5rem] border-l border-y border-gold-500/10 group-hover/row:border-gold-500/30 text-left transition-all">
                <span className="px-5 py-2 bg-gold-900/20 border border-gold-500/20 rounded-full text-gold-500 font-black font-mono">
                  {book.views ? Math.round(((book.downloads || 0) / book.views) * 100) : 0}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const OverviewSection = ({ recentBooks }: { recentBooks: FirebaseBook[] }) => (
  <div className="space-y-12 relative z-10 text-right">
    <div className="relative pb-4">
      <h3 className="text-5xl font-amiri font-black gold-text mb-2">آخر الإضافات الملكية</h3>
      <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] opacity-60">التحديثات الأخيرة في سجلات الإمبراطورية</p>
      <div className="absolute bottom-0 right-0 w-24 h-1 bg-gradient-to-l from-gold-500 to-transparent"></div>
    </div>

    <div className="overflow-x-auto pb-6 custom-scrollbar">
      <table className="w-full text-right border-separate border-spacing-y-4" dir="rtl">
        <thead>
          <tr className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
            <th className="pb-4 pr-10 text-right">الكتاب المستجد</th>
            <th className="pb-4 text-right">المؤلف</th>
            <th className="pb-4 text-center">القيمة الإمبراطورية</th>
            <th className="pb-4 text-center">الرتبة</th>
            <th className="pb-4 text-left pl-10">تاريخ الإيداع</th>
          </tr>
        </thead>
        <tbody>
          {recentBooks.map((book, idx) => (
            <tr 
              key={book.id} 
              className="group/row transition-all duration-500"
              style={{ transitionDelay: `${idx * 40}ms` }}
            >
              <td className="py-5 pr-10 bg-[#0c0c0d] group-hover/row:bg-gold-500/[0.05] rounded-r-[2.5rem] border-r border-y border-gold-500/10 group-hover/row:border-gold-500/30 transition-all">
                <p className="font-playfair font-black text-white group-hover/row:text-gold-400 transition-colors text-lg tracking-tight">{book.title}</p>
              </td>
              <td className="py-5 bg-[#0c0c0d] group-hover/row:bg-gold-500/[0.05] border-y border-gold-500/10 group-hover/row:border-gold-500/30 transition-all">
                <span className="text-slate-400 font-bold text-sm">{book.author}</span>
              </td>
              <td className="py-5 bg-[#0c0c0d] group-hover/row:bg-gold-500/[0.05] border-y border-gold-500/10 group-hover/row:border-gold-500/30 text-center transition-all">
                <span className="text-gold-500 font-black text-lg font-mono">${book.price}</span>
              </td>
              <td className="py-5 bg-[#0c0c0d] group-hover/row:bg-gold-500/[0.05] border-y border-gold-500/10 group-hover/row:border-gold-500/30 text-center transition-all">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  book.status === 'approved' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20' : 'bg-gold-900/20 text-gold-400 border-gold-500/20'
                }`}>
                  {book.status === 'approved' ? 'معتمد' : 'مراجعة'}
                </span>
              </td>
              <td className="py-5 pl-10 bg-[#0c0c0d] group-hover/row:bg-gold-500/[0.05] rounded-l-[2.5rem] border-l border-y border-gold-500/10 group-hover/row:border-gold-500/30 text-left transition-all">
                <p className="text-slate-500 font-bold text-xs font-mono">{book.uploadDate}</p>
              </td>
            </tr>
          ))}
          {recentBooks.length === 0 && (
            <tr>
              <td colSpan={5} className="py-24 text-center bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10">
                <p className="text-slate-600 font-bold">لا توجد سجلات حديثة في الأرشيف.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

/* ===================== BOOKS SECTION with Edit/Delete/Approve ===================== */
const BooksSection = ({
  books,
  onDelete,
  onApprove,
  onEdit,
  onAdd,
}: {
  books: FirebaseBook[];
  onDelete: (id: string) => void;
  onApprove: (id: string) => void;
  onEdit: (book: FirebaseBook) => void;
  onAdd: () => void;
}) => {
  const [search, setSearch] = useState('');
  const filtered = books.filter(
    b =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="space-y-12 relative z-10 text-right">
      <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-8 pb-8 border-b border-gold-500/10">
        <div className="relative">
          <h3 className="text-5xl font-amiri font-black gold-text mb-2">إدارة الخزانة الملكية</h3>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] opacity-60">الأرشيف الكامل للمجلدات المنشورة والمؤرشفة</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 flex-row-reverse">
          <div className="relative group w-full md:w-64">
            <div className="absolute inset-0 bg-gold-500/5 blur-xl group-hover:bg-gold-500/10 transition-all rounded-full"></div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث في الأرشيف..."
              className="w-full bg-black/40 border border-gold-500/20 rounded-full px-6 py-3.5 text-white font-bold text-sm focus:outline-none focus:border-gold-500/50 relative z-10 backdrop-blur-md transition-all"
              dir="rtl"
            />
          </div>
          <button 
            onClick={onAdd} 
            className="gold-button px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-3 shadow-[0_10px_30px_rgba(212,175,55,0.2)] hover:-translate-y-1 transition-all"
          >
            <AddIcon className="text-xl" /> إضافة مجلد ملكي
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-6 custom-scrollbar">
        <table className="w-full text-right border-separate border-spacing-y-4" dir="rtl">
          <thead>
            <tr className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
              <th className="pb-4 pr-10 text-right">المجلد / العنوان</th>
              <th className="pb-4 text-right">المؤلف</th>
              <th className="pb-4 text-right">التاريخ / التصنيف</th>
              <th className="pb-4 text-right">القيمة</th>
              <th className="pb-4 text-center">الحالة الإمبراطورية</th>
              <th className="pb-4 text-left pl-10">التحكم</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((book, idx) => (
              <tr 
                key={book.id} 
                className="group/row transition-all duration-500 hover:z-10 relative"
                style={{ transitionDelay: `${idx * 40}ms` }}
              >
                <td className="py-4 pr-10 bg-[#0c0c0d] group-hover/row:bg-gold-500/[0.05] rounded-r-[2.5rem] border-r border-y border-gold-500/10 group-hover/row:border-gold-500/30 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-20 relative flex-shrink-0 group/img">
                      <div className="absolute inset-0 bg-gold-500/20 blur-md opacity-0 group-hover/img:opacity-100 transition-opacity"></div>
                      <img 
                        src={book.coverUrl || "https://i.imgur.com/8K9f6V2.png"} 
                        className="w-full h-full object-cover rounded shadow-lg border border-white/10 relative z-10" 
                        alt="" 
                      />
                    </div>
                    <div>
                      <p className="font-playfair font-black text-white group-hover/row:text-gold-400 transition-colors text-lg tracking-tight leading-tight">{book.title}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">ID: {book.id.slice(0, 8)}</p>
                    </div>
                  </div>
                </td>

                <td className="py-4 bg-[#0c0c0d] group-hover/row:bg-gold-500/[0.05] border-y border-gold-500/10 group-hover/row:border-gold-500/30 transition-all">
                  <span className="text-slate-400 font-bold text-sm">{book.author}</span>
                </td>

                <td className="py-4 bg-[#0c0c0d] group-hover/row:bg-gold-500/[0.05] border-y border-gold-500/10 group-hover/row:border-gold-500/30 transition-all">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-500 text-[10px] font-black">{book.publicationYear || "—"}</span>
                    <span className="text-gold-600/60 font-black text-[10px] uppercase tracking-widest">{book.category}</span>
                  </div>
                </td>

                <td className="py-4 bg-[#0c0c0d] group-hover/row:bg-gold-500/[0.05] border-y border-gold-500/10 group-hover/row:border-gold-500/30 transition-all">
                   <div className="text-emerald-500 font-black text-lg font-mono">
                     <span className="text-xs opacity-50 mr-1">$</span>{book.price}
                   </div>
                </td>

                <td className="py-4 bg-[#0c0c0d] group-hover/row:bg-gold-500/[0.05] border-y border-gold-500/10 group-hover/row:border-gold-500/30 text-center transition-all">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    book.status === 'approved'
                      ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                      : 'bg-gold-900/20 text-gold-400 border-gold-500/20 animate-pulse'
                  }`}>
                    {book.status === 'approved' ? 'منشور ملكي' : 'قيد المراجعة'}
                  </span>
                </td>

                <td className="py-4 pl-10 bg-[#0c0c0d] group-hover/row:bg-gold-500/[0.05] rounded-l-[2.5rem] border-l border-y border-gold-500/10 group-hover/row:border-gold-500/30 transition-all">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onEdit(book)}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-gold-500/10 text-slate-500 hover:text-gold-400 transition-all border border-transparent hover:border-gold-500/20"
                    >
                      <EditIcon className="text-lg" />
                    </button>
                    {book.status !== 'approved' && (
                      <button
                        onClick={() => onApprove(book.id)}
                        className="p-2.5 rounded-xl bg-emerald-500/5 hover:bg-emerald-500/20 text-slate-500 hover:text-emerald-400 transition-all border border-transparent hover:border-emerald-500/20"
                      >
                        <CheckCircleIcon className="text-lg" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(book.id)}
                      className="p-2.5 rounded-xl bg-red-500/5 hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
                    >
                      <DeleteIcon className="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filtered.length === 0 && (
          <div className="py-24 text-center bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10">
            <p className="text-slate-500 font-bold text-xl">لا توجد كتب تطابق هذا البحث في الأرشيف الإمبراطوري.</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ===================== REVIEW SECTION with Premium Royal Banners ===================== */
const ReviewSection = ({
  pendingBooks,
  onApprove,
  onDelete,
  onEdit,
}: {
  pendingBooks: FirebaseBook[];
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (book: FirebaseBook) => void;
}) => (
  <div className="space-y-12 relative z-10 text-right">
    <div className="relative pb-4">
      <h3 className="text-5xl font-amiri font-black gold-text mb-2">مراجعة المجلدات الجديدة</h3>
      <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] opacity-60">مخطوطات تنتظر الختم الملكي للنشر</p>
      <div className="absolute bottom-0 right-0 w-24 h-1 bg-gradient-to-l from-emerald-500 to-transparent"></div>
    </div>

    <div className="grid gap-8">
      {pendingBooks.map((book, idx) => (
        <div
          key={book.id}
          className="group relative bg-[#0c0c0d] border border-gold-500/10 rounded-[2.5rem] overflow-hidden hover:border-gold-500/30 transition-all duration-700 hover:-translate-y-1 shadow-2xl"
          style={{ transitionDelay: `${idx * 50}ms` }}
        >
          {/* Background Decorative Gradient */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="p-8 flex flex-col lg:flex-row-reverse items-center justify-between gap-8">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-8 flex-1">
              {/* Book Cover Thumbnail */}
              <div className="relative flex-shrink-0 group/cover">
                <div className="absolute -inset-2 bg-gold-500/10 rounded-2xl blur-lg opacity-0 group-hover/cover:opacity-100 transition-opacity"></div>
                <div className="w-32 h-44 relative z-10 rounded-xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.5)] border border-white/10 group-hover/cover:border-gold-500/30 transition-all">
                  <img 
                    src={book.coverUrl || "https://i.imgur.com/8K9f6V2.png"} 
                    className="w-full h-full object-cover transform scale-105 group-hover/cover:scale-110 transition-transform duration-700" 
                    alt={book.title} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                     <span className="text-[10px] text-white font-black uppercase tracking-widest bg-gold-500/20 backdrop-blur-md px-2 py-1 rounded border border-white/10 w-full text-center">معاينة الغلاف</span>
                  </div>
                </div>
              </div>

              {/* Book Details */}
              <div className="text-center lg:text-right flex-1 space-y-3">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-3">
                  <h4 className="text-3xl font-playfair font-black text-white group-hover:text-gold-400 transition-colors tracking-tight">{book.title}</h4>
                  <span className="px-3 py-1 bg-gold-900/20 border border-gold-500/30 rounded-full text-gold-500 text-[10px] font-black uppercase tracking-widest">مجلد جديد</span>
                </div>
                
                <div className="flex flex-wrap justify-center lg:justify-end gap-x-6 gap-y-2 text-slate-500 font-bold text-sm uppercase tracking-wider">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-600"></span>
                    {book.author}
                  </span>
                  {book.publicationYear && (
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                      {book.publicationYear}
                    </span>
                  )}
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></span>
                    {book.category}
                  </span>
                  <span className="text-emerald-400 font-black text-lg ml-2 font-mono">${book.price}</span>
                </div>
                
                <p className="text-slate-600 text-xs font-bold leading-relaxed max-w-xl lg:ml-auto">
                   هذا المجلد قيد المراجعة حالياً. يرجى التحقق من صحة البيانات وجودة الغلاف قبل إصدار الختم الملكي بالموافقة.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-row md:flex-row lg:flex-col gap-4 w-full lg:w-auto mt-4 lg:mt-0 relative z-10">
              {/* Approve */}
              <button
                onClick={() => onApprove(book.id)}
                className="flex-1 flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-[1.5rem] font-black text-sm transition-all duration-500 shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/30 hover:-translate-y-1 active:scale-95"
              >
                <CheckCircleIcon className="text-xl" /> موافقة ملكية
              </button>
              
              <div className="flex gap-4">
                {/* Edit */}
                <button
                  onClick={() => onEdit(book)}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-gold-500/10 text-gold-400 border border-gold-500/20 px-6 py-3 rounded-2xl font-black text-xs transition-all hover:border-gold-500/50"
                >
                  <EditIcon className="text-sm" /> تعديل البيانات
                </button>
                
                {/* Delete/Reject */}
                <button
                  onClick={() => onDelete(book.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-950/20 hover:bg-red-600 transition-all text-red-500 hover:text-white px-6 py-3 rounded-2xl border border-red-500/20 font-black text-xs"
                >
                  <DeleteIcon className="text-sm" /> رفض وحذف
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {pendingBooks.length === 0 && (
        <div className="relative py-32 rounded-[4rem] overflow-hidden group">
          <div className="absolute inset-0 bg-emerald-500/5 border-2 border-dashed border-emerald-500/10 rounded-[4rem] group-hover:bg-emerald-500/[0.08] transition-all"></div>
          <div className="relative z-10 text-center space-y-6">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/20 text-emerald-500 animate-pulse">
               <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04c0 4.833 1.833 9.333 5.405 12.662L12 21l3.213-2.358c3.572-3.329 5.405-7.829 5.405-12.662z" />
               </svg>
            </div>
            <div>
              <p className="text-slate-500 font-playfair font-black text-3xl uppercase tracking-widest text-white/80">الخزانة الملكية في أمان تام</p>
              <p className="text-emerald-500/60 text-sm mt-3 font-bold uppercase tracking-[0.3em]">جميع المخطوطات تم فحصها واعتمادها بنجاح</p>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

const MembersSection = ({ members }: { members: FirebaseUser[] }) => {
  const [search, setSearch] = useState('');
  const filtered = members.filter(
    m => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 relative z-10 text-right">
      <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-8 pb-8 border-b border-gold-500/10">
        <div className="relative">
          <h3 className="text-5xl font-amiri font-black gold-text mb-2">قاعدة الأعضاء</h3>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] opacity-60">النخبة المختارة من مجتمع كتبي الملكي</p>
        </div>

        <div className="relative group w-full md:w-80">
          <div className="absolute inset-0 bg-gold-500/5 blur-xl group-hover:bg-gold-500/10 transition-all rounded-full"></div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث عن عضو ملكي..."
            className="w-full bg-black/40 border border-gold-500/20 rounded-full px-8 py-4 text-white font-bold text-sm focus:outline-none focus:border-gold-500/50 relative z-10 backdrop-blur-md transition-all placeholder:text-slate-600"
            dir="rtl"
          />
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
            <svg className="w-5 h-5 text-gold-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar pb-6">
        <table className="w-full text-right border-separate border-spacing-y-4" dir="rtl">
          <thead>
            <tr className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
              <th className="pb-4 pr-10 text-right">العضو المستنير</th>
              <th className="pb-4 text-right">المراسلات الملكية</th>
              <th className="pb-4 text-center">الرتبة / المقام</th>
              <th className="pb-4 text-left pl-10">تاريخ الانتساب</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, idx) => (
              <tr 
                key={m.id} 
                className="group/row transition-all duration-700 hover:-translate-y-1"
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                <td className="py-5 pr-10 bg-[#0c0c0d] group-hover/row:bg-gold-500/[0.07] rounded-r-[2.5rem] border-r border-y border-gold-500/10 group-hover/row:border-gold-500/40 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="relative flex-shrink-0">
                      <div className="absolute -inset-1.5 bg-gold-500/20 rounded-full blur-md opacity-0 group-hover/row:opacity-100 transition-opacity"></div>
                      <div className="relative z-10 w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-gold-600 to-amber-200">
                        <img 
                          src={m.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${m.name}`} 
                          className="w-full h-full rounded-full border-2 border-black object-cover shadow-2xl"
                          alt=""
                        />
                      </div>
                      {m.role === 'admin' && (
                        <div className="absolute -top-1 -right-1 z-20 bg-gold-500 text-black p-1 rounded-full shadow-lg scale-75 border-2 border-black">
                           <StarIcon fontSize="inherit" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-playfair font-black text-white group-hover/row:text-gold-400 transition-colors text-xl tracking-tight leading-tight">{m.name}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                        <span className="w-1 h-1 bg-gold-600 rounded-full"></span>
                        ID: {m.id.slice(0, 10)}
                      </p>
                    </div>
                  </div>
                </td>
                
                <td className="py-5 bg-[#0c0c0d] group-hover/row:bg-gold-500/[0.07] border-y border-gold-500/10 group-hover/row:border-gold-500/40 transition-all">
                  <span className="text-slate-400 font-bold text-sm bg-black/50 px-5 py-2 rounded-full border border-white/5 group-hover/row:border-gold-500/20 transition-all">
                    {m.email}
                  </span>
                </td>
                
                <td className="py-5 bg-[#0c0c0d] group-hover/row:bg-gold-500/[0.07] border-y border-gold-500/10 group-hover/row:border-gold-500/40 text-center transition-all">
                  {m.role === 'admin' ? (
                    <div className="flex flex-col items-center gap-1">
                      <span className="px-6 py-2 bg-gradient-to-r from-gold-900/60 to-gold-600/30 border border-gold-500/50 rounded-full text-gold-300 text-[10px] font-black uppercase tracking-[.25em] shadow-[0_0_20px_rgba(212,175,55,0.15)] inline-flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse ring-4 ring-gold-500/20"></span>
                        مسؤول الإدارة الملكية
                      </span>
                    </div>
                  ) : (
                    <span className="px-6 py-2 bg-white/[0.03] border border-white/10 rounded-full text-slate-500 text-[10px] font-black uppercase tracking-[.25em] inline-flex items-center gap-3 group-hover/row:border-slate-400/30 transition-all">
                      <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                      قارئ معتمد للمجموعة
                    </span>
                  )}
                </td>
                
                <td className="py-5 pl-10 bg-[#0c0c0d] group-hover/row:bg-gold-500/[0.07] rounded-l-[2.5rem] border-l border-y border-gold-500/10 group-hover/row:border-gold-500/40 text-left transition-all">
                  <div className="flex flex-col items-start gap-1">
                    <p className="text-gold-500/60 font-black text-[10px] uppercase tracking-widest">تاريخ المجلد</p>
                    <p className="text-slate-400 font-bold text-xs font-mono">{m.createdAt?.split('T')[0] || 'أرشيفي'}</p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-gold-500/20 text-gold-500/30">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
               </svg>
            </div>
            <p className="text-slate-500 font-bold text-xl uppercase tracking-widest">لم يتم العثور على أي ك سجل ملكي</p>
            <p className="text-slate-600 text-sm mt-2 font-bold antialiased">جرب استخدام مصطلحات أخرى للبحث</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SettingsSection = () => (
  <div className="space-y-12 relative z-10 text-right">
    <div className="relative pb-4">
      <h3 className="text-5xl font-amiri font-black gold-text mb-2">الإعدادات الملكية</h3>
      <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] opacity-60">تخصيص معايير الإمبراطورية الرقمية</p>
      <div className="absolute bottom-0 right-0 w-24 h-1 bg-gradient-to-l from-gold-500 to-transparent"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-[#0c0c0d] p-8 rounded-[2.5rem] border border-gold-500/10 hover:border-gold-500/30 transition-all group">
         <h4 className="text-xl font-black text-white mb-6 flex items-center justify-between gap-3 flex-row-reverse text-right">
            <span>تخصيص الهوية الملكية</span>
            <SettingsIcon className="text-gold-500 text-lg" />
         </h4>
         <div className="space-y-6">
            <div className="space-y-2">
               <label className="text-xs font-black text-slate-500 uppercase tracking-widest block pr-2">لون السمة الرئيسي</label>
               <div className="flex gap-3 justify-end">
                  <div className="w-8 h-8 rounded-full bg-gold-500 border-2 border-white cursor-pointer ring-4 ring-gold-500/20"></div>
                  <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-transparent cursor-pointer hover:border-white transition-all"></div>
                  <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-transparent cursor-pointer hover:border-white transition-all"></div>
               </div>
            </div>
            <div className="pt-4 border-t border-white/5 text-right">
                <button className="w-full gold-button py-3 rounded-xl font-black text-sm">حفظ تغييرات الهوية</button>
            </div>
         </div>
      </div>

      <div className="bg-[#0c0c0d] p-8 rounded-[2.5rem] border border-gold-500/10 hover:border-gold-500/30 transition-all group opacity-50 relative overflow-hidden">
         <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <span className="bg-gold-500 text-slate-950 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest rotate-12 shadow-2xl">Coming Soon</span>
         </div>
         <h4 className="text-xl font-black text-white mb-6 flex items-center justify-between gap-3 flex-row-reverse opacity-20 text-right">
            <span>مركز الصيانة المتقدم</span>
            <SettingsIcon className="text-red-500 text-lg" />
         </h4>
         <p className="text-slate-500 text-sm font-bold opacity-20 text-right">خصائص الإعدادات المتقدمة قادمة في التحديث الإمبراطوري القادم... ⏳</p>
      </div>
    </div>
  </div>
);

/* ===================== MAIN DASHBOARD ===================== */
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [books, setBooks] = useState<FirebaseBook[]>([]);
  const [members, setMembers] = useState<FirebaseUser[]>([]);
  const [editingBook, setEditingBook] = useState<FirebaseBook | null>(null);

  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    if (authLoading) return;

    if (user?.role === 'admin') {
      setIsAuthorized(true);
    } else {
      setDebugInfo(`Email: ${user?.email || 'None'}, Role: ${user?.role || 'None'}`);
      setIsAuthorized(false);
      if (user) {
        showToast('⚠️ وصول ممنوع للمناطق المحظورة', 'error');
      }
    }
  }, [user, authLoading, showToast]);

  const cleanupRegistry = async () => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف جميع المجلدات التجريبية؟ لا يمكن التراجع عن هذه الخطوة. ⚠️')) {
      return;
    }

    try {
      showToast('جاري تنظيف الخزانة الملكية...', 'info');
      const q = query(collection(db, 'books'), where('isTest', '==', true));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        showToast('الخزانة نظيفة بالفعل! لم يتم العثور على ملفات تجريبية.', 'success');
        return;
      }

      const batch = writeBatch(db);
      snapshot.forEach(d => batch.delete(d.ref));
      await batch.commit();

      showToast(`تم حذف ${snapshot.size} ملف تجريبي بنجاح! 👑`, 'success');
    } catch (error) {
      console.error('Cleanup error:', error);
      showToast('حدث خطأ أثناء تنظيف الخزانة.', 'error');
    }
  };

  useEffect(() => {
    if (!isAuthorized) return;
    const unsubBooks = onSnapshot(query(collection(db, 'books'), orderBy('createdAt', 'desc')), snap => {
      setBooks(snap.docs.map(d => ({ id: d.id, ...d.data() })) as FirebaseBook[]);
    });
    const unsubUsers = onSnapshot(query(collection(db, 'users'), orderBy('createdAt', 'desc')), snap => {
      setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() })) as FirebaseUser[]);
    });
    return () => {
      unsubBooks();
      unsubUsers();
    };
  }, [isAuthorized]);

  if (authLoading || isAuthorized === null) return null;

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6 text-right" dir="rtl">
        <div className="bg-surface-container-low border border-gold-900/20 p-12 rounded-[3rem] text-center max-w-md shadow-2xl">
          <div className="w-20 h-20 bg-gold-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-gold-500 text-4xl font-black">!</div>
          <h2 className="text-3xl font-black text-gold-500 mb-4">وصول ممنوع للمناطق المحظورة</h2>
          <p className="text-slate-400 font-bold mb-6">عذراً، هذه المنطقة مخصصة للمشرفين الملكيين فقط.</p>

          <div className="bg-surface-container-lowest p-4 rounded-2xl mb-8 border border-gold-900/10 text-xs font-mono text-slate-500">
            Diagnostic: {debugInfo}
          </div>

          <div className="space-y-4">
            <button onClick={() => navigate('/login')} className="gold-button w-full py-4 rounded-xl font-black">تسجيل الدخول كمسؤول</button>
            <button onClick={() => navigate('/')} className="w-full py-4 rounded-xl font-bold text-slate-500 hover:text-white transition-colors">العودة للمنزل</button>
          </div>
        </div>
      </div>
    );
  }

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, 'books', id), { status: 'approved' });
      showToast('تمت الموافقة الملكية بنجاح! 👑', 'success');
    } catch (error) {
      showToast('خطأ في الموافقة', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المجلد من الخزانة؟')) {
      try {
        await deleteDoc(doc(db, 'books', id));
        showToast('تم الحذف بنجاح', 'info');
      } catch (error) {
        showToast('خطأ في الحذف', 'error');
      }
    }
  };

  const handleEdit = (book: FirebaseBook) => {
    setEditingBook(book);
  };

  const handleSaveEdit = async (id: string, data: Partial<FirebaseBook>) => {
    try {
      await updateDoc(doc(db, 'books', id), data as Record<string, unknown>);
      showToast('تم حفظ التعديلات بنجاح! ✏️', 'success');
    } catch (error) {
      showToast('خطأ في حفظ التعديلات', 'error');
      throw error;
    }
  };

  const pendingBooks = books.filter(b => b.status === 'pending');
  const approvedBooks = books.filter(b => b.status === 'approved');
  const totalDownloads = approvedBooks.reduce((acc, b) => acc + (b.downloads || 0), 0);
  const totalViews = approvedBooks.reduce((acc, b) => acc + (b.views || 0), 0);
  const avgConversion = totalViews ? Math.round((totalDownloads / totalViews) * 100) : 0;

  const handleApproveAll = async () => {
    if (pendingBooks.length === 0) return;
    if (!window.confirm(`هل أنت متأكد من تفعيل "الختم الملكي" والموافقة على جميع المجلدات (${pendingBooks.length}) دفعة واحدة؟ 🏛️`)) return;
    
    try {
      showToast('جاري تفعيل الموافقة الجماعية...', 'info');
      const batch = writeBatch(db);
      pendingBooks.forEach(b => {
        batch.update(doc(db, 'books', b.id), { status: 'approved' });
      });
      await batch.commit();
      showToast('تمت الموافقة على جميع المجلدات بنجاح! 👑', 'success');
    } catch (error) {
      showToast('خطأ في الموافقة الجماعية', 'error');
    }
  };

  const statsList = [
    { label: 'الأصول العريقة', value: books.length, icon: MenuBookIcon, color: 'from-gold-700 to-gold-400' },
    { label: 'التحويلات الملكية', value: totalDownloads, icon: CloudUploadIcon, color: 'from-emerald-700 to-teal-400' },
    { label: 'قيد التمحيص', value: pendingBooks.length, icon: PendingActionsIcon, color: 'from-gold-600 to-gold-300' },
    { label: 'مقام الأعضاء', value: members.length, icon: PeopleIcon, color: 'from-slate-700 to-slate-400' },
  ];

  const QuickActions = () => (
    <div className="flex flex-wrap gap-4 mb-8 bg-gold-500/5 p-4 rounded-3xl border border-gold-500/10">
      <p className="w-full text-[10px] font-black uppercase tracking-[0.3em] text-gold-500/50 mb-2 pr-4">مركز الأوامر السريعة (Quick Actions)</p>
      <button 
        onClick={handleApproveAll}
        disabled={pendingBooks.length === 0}
        className="flex-1 min-w-[150px] bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-slate-950 border border-emerald-500/20 px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all disabled:opacity-30 flex items-center justify-center gap-3"
      >
        <CheckCircleIcon fontSize="small" /> اعتماد الكل ({pendingBooks.length})
      </button>
      <button className="flex-1 min-w-[150px] bg-white/5 hover:bg-white/10 text-white/50 px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border border-white/10 flex items-center justify-center gap-3">
        <LibraryBooksIcon fontSize="small" /> تقرير المخزون
      </button>
      <button className="flex-1 min-w-[150px] bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border border-blue-500/20 flex items-center justify-center gap-3">
        <DashboardIcon fontSize="small" /> تحديث البيانات
      </button>
    </div>
  );

  const navItems = [
    { id: 'overview', label: 'نظرة عامة', icon: DashboardIcon },
    { id: 'review', label: 'المراجعة الملكية', icon: PendingActionsIcon, count: pendingBooks.length },
    { id: 'books', label: 'إدارة الكتب', icon: LibraryBooksIcon },
    { id: 'analytics', label: 'التحليلات الملكية', icon: DashboardIcon },
    { id: 'users', label: 'الأعضاء', icon: PeopleIcon },
    { id: 'settings', label: 'الإعدادات الملكية', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-surface text-slate-100 font-jakarta rtl" dir="rtl">
      <Navbar />

      {/* Edit Modal */}
      {editingBook && (
        <EditModal
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onSave={handleSaveEdit}
        />
      )}

      <main className="container mx-auto px-6 pt-40 pb-24">
        <div className="flex flex-col lg:flex-row-reverse gap-12">
          <aside className="w-full lg:w-80 space-y-6">
            <div className="bg-surface-container-low p-8 rounded-[3rem] border border-gold-900/20 shadow-2xl relative">
              <h2 className="text-3xl font-amiri font-black mb-10 gold-text text-right">جناح المدير العام 👑</h2>
              <nav className="space-y-4">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex flex-row-reverse items-center gap-4 p-5 rounded-2xl transition-all font-black text-lg ${
                      activeTab === item.id
                        ? 'bg-gold-500 text-slate-950 shadow-lg'
                        : 'bg-surface-container-lowest text-slate-400 hover:text-gold-400'
                    }`}
                  >
                    <item.icon />
                    <span className="flex-1 text-right">{item.label}</span>
                    {item.count ? (
                      <span className="bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                        {item.count}
                      </span>
                    ) : null}
                  </button>
                ))}
              </nav>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/admin/upload')}
                className="w-full gold-button py-5 rounded-3xl font-black text-xl shadow-2xl flex items-center justify-center gap-3"
              >
                <AddToPhotosIcon /> رفع فردي
              </button>
              <button
                onClick={() => navigate('/admin/multi-upload')}
                className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400 py-5 rounded-3xl font-black text-xl shadow-2xl flex items-center justify-center gap-3 transition-colors"
              >
                <CloudUploadIcon /> رفع جماعي (Multi)
              </button>
            </div>
          </aside>

          <div className="flex-1 space-y-12">
            {/* Welcome Banner */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-surface-container-low p-10 rounded-[3rem] border border-gold-900/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="text-right flex-1 relative z-10">
                <h1 className="text-5xl font-amiri font-black gold-text mb-4">أهلاً بك، السيّد المدير العام 👑</h1>
                <div className="flex items-center gap-4 flex-wrap justify-end">
                   <span className="px-4 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">معدل التحويل: {avgConversion}%</span>
                   <span className="px-4 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">إجمالي المشاهدات: {totalViews}</span>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-3xl border border-gold-900/10 text-center min-w-[200px] relative z-10">
                <p className="text-white font-black text-lg">
                  {new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <p className="text-gold-500 text-[10px] font-black uppercase tracking-tighter">التوقيت الملكي للمنصة</p>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <QuickActions />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              {statsList.map(stat => (
                <div key={stat.label} className="bg-surface-container-low p-8 rounded-[2.5rem] border border-gold-900/10 shadow-xl group hover:border-gold-500/30 transition-all">
                  <div className={`w-14 h-14 bg-gradient-to-tr ${stat.color} rounded-2xl flex items-center justify-center text-slate-900 mb-6 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="text-3xl" />
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-4xl font-amiri font-black text-white">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`p-10 md:p-14 rounded-[4rem] relative overflow-hidden transition-all duration-700 ${activeTab === 'analytics' ? 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]' : 'bg-[#0a0a0b] border border-gold-500/20 shadow-[0_0_100px_rgba(0,0,0,0.8)]'}`}>
              {/* Cinematic Arcs for the container */}
              <div className="absolute top-0 right-0 w-64 h-64 border-t border-r border-gold-500/10 rounded-tr-[4rem] -mr-10 -mt-10 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 border-b border-l border-gold-500/10 rounded-bl-[4rem] -ml-10 -mb-10 pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row-reverse justify-between items-center mb-12 gap-6 relative z-10">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 bg-gold-500 rounded-full animate-pulse"></div>
                   <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">نظام الإدارة الملكي</p>
                </div>
                
                <button
                  onClick={cleanupRegistry}
                  className="bg-red-950/30 hover:bg-red-600 transition-all text-red-500 hover:text-white px-6 py-2.5 rounded-2xl border border-red-500/20 flex items-center gap-3 text-[10px] font-black tracking-widest uppercase shadow-lg hover:shadow-red-500/20 backdrop-blur-md"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  تنظيف السجلات التجريبية
                </button>
              </div>
              {activeTab === 'overview' && <OverviewSection recentBooks={books.slice(0, 5)} />}
              {activeTab === 'analytics' && <AnalyticsSection books={approvedBooks} />}
              {activeTab === 'books' && (
                <BooksSection
                  books={books}
                  onDelete={handleDelete}
                  onApprove={handleApprove}
                  onEdit={handleEdit}
                  onAdd={() => navigate('/admin/upload')}
                />
              )}
              {activeTab === 'review' && (
                <ReviewSection
                  pendingBooks={pendingBooks}
                  onApprove={handleApprove}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              )}
              {activeTab === 'users' && <MembersSection members={members} />}
              {activeTab === 'settings' && <SettingsSection />}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
