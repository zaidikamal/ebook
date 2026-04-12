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
    <h3 className="text-4xl font-amiri font-black gold-text">تحليلات الأداء الملكي</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-right" dir="rtl">
        <thead>
          <tr className="border-b border-gold-900/10 text-slate-500 text-xs font-black uppercase tracking-widest">
            <th className="pb-6 pr-4">المجلد</th>
            <th className="pb-6">المشاهدات</th>
            <th className="pb-6">التحميلات</th>
            <th className="pb-6">معدل التحويل</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gold-900/5">
          {books.map(book => (
            <tr key={book.id} className="hover:bg-gold-500/5 transition-colors">
              <td className="py-5 pr-4 font-black text-white">{book.title}</td>
              <td className="py-5 font-bold text-slate-400">{book.views || 0}</td>
              <td className="py-5 font-bold text-emerald-500">{book.downloads || 0}</td>
              <td className="py-5 font-black text-gold-500">
                {book.views ? Math.round(((book.downloads || 0) / book.views) * 100) : 0}%
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
    <div className="flex flex-row-reverse items-center justify-between">
      <h3 className="text-4xl font-amiri font-black gold-text">آخر الإضافات الملكية</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-right" dir="rtl">
        <thead>
          <tr className="border-b border-gold-900/10 text-slate-500 text-xs font-black uppercase tracking-widest">
            <th className="pb-6 pr-4">الكتاب</th>
            <th className="pb-6">المؤلف</th>
            <th className="pb-6">السعر</th>
            <th className="pb-6">الحالة</th>
            <th className="pb-6 pl-4">التاريخ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gold-900/5">
          {recentBooks.map(book => (
            <tr key={book.id} className="hover:bg-gold-500/5 transition-colors">
              <td className="py-5 pr-4 font-black text-white">{book.title}</td>
              <td className="py-5 font-bold text-slate-400">{book.author}</td>
              <td className="py-5 text-gold-500 font-black">${book.price}</td>
              <td className="py-5">
                <span className={`px-3 py-1 rounded-full text-xs font-black ${
                  book.status === 'approved' ? 'bg-emerald-900/20 text-emerald-400' : 'bg-gold-900/20 text-gold-400'
                }`}>
                  {book.status === 'approved' ? 'تم النشر' : 'قيد المراجعة'}
                </span>
              </td>
              <td className="py-5 pl-4 text-slate-500 text-sm">{book.uploadDate}</td>
            </tr>
          ))}
          {recentBooks.length === 0 && (
            <tr><td colSpan={5} className="py-10 text-center text-slate-500">لا توجد إضافات حديثة حالياً</td></tr>
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
    <div className="space-y-10 relative z-10 text-right">
      <div className="flex flex-row-reverse items-center justify-between gap-4">
        <h3 className="text-4xl font-amiri font-black gold-text">إدارة الخزانة</h3>
        <div className="flex gap-4 flex-row-reverse">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث في الكتب..."
            className="bg-surface-container-lowest border border-gold-900/20 rounded-2xl px-6 py-3 text-white font-bold text-sm focus:outline-none focus:border-gold-500/50 w-56 text-right"
          />
          <button onClick={onAdd} className="gold-button px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2">
            <AddIcon className="text-lg" /> إضافة كتاب
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right" dir="rtl">
          <thead>
            <tr className="border-b border-gold-900/10 text-slate-500 text-xs font-black uppercase tracking-widest">
              <th className="pb-5 pr-4 text-right">العنوان</th>
              <th className="pb-5 text-right">المؤلف</th>
              <th className="pb-5 text-right">سنة الإصدار</th>
              <th className="pb-5 text-right">السعر</th>
              <th className="pb-5 text-right">الحالة</th>
              <th className="pb-5 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-900/5">
            {filtered.map(book => (
              <tr key={book.id} className="hover:bg-gold-500/5 transition-colors group">
                <td className="py-5 pr-4 font-black text-white">{book.title}</td>
                <td className="py-5 text-slate-400 font-bold">{book.author}</td>
                <td className="py-5 text-slate-500 font-bold text-sm">{book.publicationYear || '—'}</td>
                <td className="py-5 text-gold-500 font-black">${book.price}</td>
                <td className="py-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${
                    book.status === 'approved'
                      ? 'bg-emerald-900/20 text-emerald-400'
                      : 'bg-gold-900/20 text-gold-400'
                  }`}>
                    {book.status === 'approved' ? 'منشور' : 'قيد المراجعة'}
                  </span>
                </td>
                <td className="py-5 text-center">
                  <div className="flex gap-2 justify-center">
                    {/* Edit — always available for all books */}
                    <button
                      onClick={() => onEdit(book)}
                      title="تعديل"
                      className="p-2 rounded-xl hover:bg-gold-500/10 text-slate-500 hover:text-gold-400 transition-all"
                    >
                      <EditIcon className="text-base" />
                    </button>
                    {/* Approve — only for pending books */}
                    {book.status !== 'approved' && (
                      <button
                        onClick={() => onApprove(book.id)}
                        title="موافقة"
                        className="p-2 rounded-xl hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-400 transition-all"
                      >
                        <CheckCircleIcon className="text-base" />
                      </button>
                    )}
                    {/* Delete — always available */}
                    <button
                      onClick={() => onDelete(book.id)}
                      title="حذف"
                      className="p-2 rounded-xl hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-all"
                    >
                      <DeleteIcon className="text-base" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500 font-bold">
                  لا توجد كتب تطابق البحث.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ===================== REVIEW SECTION with Edit/Approve/Delete ===================== */
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
  <div className="space-y-10 relative z-10 text-right">
    <h3 className="text-4xl font-amiri font-black gold-text">مراجعة المجلدات الجديدة</h3>
    <div className="grid gap-6">
      {pendingBooks.map(book => (
        <div
          key={book.id}
          className="bg-surface-container-lowest p-6 rounded-3xl border border-gold-500/20 flex flex-col md:flex-row-reverse items-start md:items-center justify-between gap-4"
        >
          <div className="text-right flex-1">
            <h4 className="text-xl font-black text-white">{book.title}</h4>
            <p className="text-slate-500 font-bold mt-1">
              {book.author}
              {book.publicationYear && <span className="text-gold-600 mx-2">• {book.publicationYear}</span>}
              <span className="mx-2">• {book.category}</span>
              <span className="text-emerald-500">${book.price}</span>
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {/* Edit */}
            <button
              onClick={() => onEdit(book)}
              className="flex items-center gap-2 bg-gold-500/10 text-gold-400 border border-gold-500/20 px-4 py-2 rounded-xl font-black text-sm hover:bg-gold-500/20 transition-all"
            >
              <EditIcon className="text-sm" /> تعديل
            </button>
            {/* Approve */}
            <button
              onClick={() => onApprove(book.id)}
              className="flex items-center gap-2 bg-emerald-500 text-slate-950 px-5 py-2 rounded-xl font-black text-sm hover:bg-emerald-400 transition-all"
            >
              <CheckCircleIcon className="text-sm" /> موافقة ملكية
            </button>
            {/* Delete/Reject */}
            <button
              onClick={() => onDelete(book.id)}
              className="flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-500/20 transition-all"
            >
              <DeleteIcon className="text-sm" /> رفض وحذف
            </button>
          </div>
        </div>
      ))}
      {pendingBooks.length === 0 && (
        <div className="p-20 text-center text-slate-500 font-bold bg-gold-500/5 rounded-[3rem]">
          لا توجد مجلدات تنتظر المراجعة حالياً. الخزانة في أمان. 🏛️
        </div>
      )}
    </div>
  </div>
);

const MembersSection = ({ members }: { members: FirebaseUser[] }) => (
  <div className="space-y-10 relative z-10 text-right">
    <h3 className="text-4xl font-amiri font-black gold-text">قاعدة الأعضاء</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-right" dir="rtl">
        <thead>
          <tr className="border-b border-gold-900/10 text-slate-500 text-xs font-black uppercase tracking-widest">
            <th className="pb-5 pr-4 text-right">العضو</th>
            <th className="pb-5 text-right">البريد</th>
            <th className="pb-5 text-right">الدور</th>
            <th className="pb-5 text-left pl-4">التاريخ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gold-900/5">
          {members.map(m => (
            <tr key={m.id} className="hover:bg-gold-500/5 transition-colors">
              <td className="py-5 pr-4 font-black text-white">{m.name}</td>
              <td className="py-5 text-slate-400 font-bold text-sm">{m.email}</td>
              <td className="py-5">
                <span className={`px-3 py-1 rounded-full text-xs font-black text-white ${m.role === 'admin' ? 'bg-gold-500 text-slate-950' : 'bg-slate-700'}`}>
                  {m.role === 'admin' ? 'مسؤول' : 'عضو'}
                </span>
              </td>
              <td className="py-5 pl-4 text-left text-slate-500 text-sm">{m.createdAt?.split('T')[0] || 'قديم'}</td>
            </tr>
          ))}
        </tbody>
      </table>
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

  const statsList = [
    { label: 'إجمالي المجلدات', value: books.length, icon: MenuBookIcon, color: 'from-gold-700 to-gold-400' },
    { label: 'إجمالي التحميلات', value: totalDownloads, icon: CloudUploadIcon, color: 'from-emerald-700 to-teal-400' },
    { label: 'تنتظر المراجعة', value: pendingBooks.length, icon: PendingActionsIcon, color: 'from-gold-600 to-gold-300' },
    { label: 'تم النشر', value: approvedBooks.length, icon: CheckCircleIcon, color: 'from-emerald-600 to-teal-400' },
  ];

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
              <div className="text-right flex-1">
                <h1 className="text-5xl font-amiri font-black gold-text mb-4">أهلاً بك، السيّد المدير العام 👑</h1>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">مرحباً بك في قمرة القيادة الملكية لمنصة كتبي. الخزانة تحت إشرافك.</p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-3xl border border-gold-900/10 text-center min-w-[200px]">
                <p className="text-white font-black text-lg">
                  {new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <p className="text-gold-500 text-[10px] font-black uppercase tracking-tighter">التوقيت الملكي للمنصة</p>
              </div>
            </div>

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

            <div className={`p-10 rounded-[3rem] ${activeTab === 'analytics' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-surface-container-lowest'} border transition-all`}>
              <div className="flex justify-between items-center mb-6">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">نظام الإدارة</p>
                <button
                  onClick={cleanupRegistry}
                  className="text-xs bg-red-500/10 text-red-500 px-4 py-2 rounded-xl font-black border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                >
                  تنظيف السجلات التجريبية 🛡️
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
              {activeTab === 'settings' && (
                <div className="text-center py-20 opacity-40">خصائص الإعدادات الملكية قادمة قريباً... ⏳</div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
