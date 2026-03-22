import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Link } from 'react-router-dom';
import { useToast } from '../../components/Toast';

interface UploadedBook {
  id: string;
  title: string;
  author: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadDate: string;
  price: number;
}

const MOCK_UPLOADS: UploadedBook[] = [
  { id: '1', title: 'مقدمة ابن خلدون', author: 'ابن خلدون', category: 'تاريخ', status: 'approved', uploadDate: '2026-03-20', price: 45.00 },
  { id: '2', title: 'ألف ليلة وليلة', author: 'تراث شعبي', category: 'أدب', status: 'approved', uploadDate: '2026-03-19', price: 29.99 },
  { id: '3', title: 'تفسير الطبري', author: 'ابن جرير الطبري', category: 'علوم القرآن والحديث', status: 'pending', uploadDate: '2026-03-22', price: 55.00 },
  { id: '4', title: 'رسالة الغفران', author: 'أبو العلاء المعري', category: 'أدب', status: 'pending', uploadDate: '2026-03-21', price: 27.50 },
  { id: '5', title: 'مخطوطة الفلك القديم', author: 'مجهول', category: 'المخطوطات النادرة', status: 'rejected', uploadDate: '2026-03-18', price: 0 },
];

const statusConfig = {
  pending: { label: 'قيد المراجعة', icon: PendingActionsIcon, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  approved: { label: 'تم النشر', icon: CheckCircleIcon, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  rejected: { label: 'مرفوض', icon: CancelIcon, color: 'text-red-400 bg-red-500/10 border-red-500/30' },
};

const UploadDashboard: React.FC = () => {
  const [books, setBooks] = useState<UploadedBook[]>(MOCK_UPLOADS);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { showToast } = useToast();

  useEffect(() => {
    // Merge MOCK_UPLOADS with localStorage data
    const savedBooks = JSON.parse(localStorage.getItem('royal_uploads') || '[]');
    setBooks([...savedBooks, ...MOCK_UPLOADS]);
  }, []);

  const filtered = filterStatus === 'all' ? books : books.filter(b => b.status === filterStatus);

  const stats = {
    total: books.length,
    pending: books.filter(b => b.status === 'pending').length,
    approved: books.filter(b => b.status === 'approved').length,
    rejected: books.filter(b => b.status === 'rejected').length,
  };

  const handleDelete = (id: string) => {
    const updatedBooks = books.filter(b => b.id !== id);
    setBooks(updatedBooks);
    
    // Also remove from localStorage if it exists there
    const savedBooks = JSON.parse(localStorage.getItem('royal_uploads') || '[]');
    const filteredSaved = savedBooks.filter((b: any) => b.id !== id);
    localStorage.setItem('royal_uploads', JSON.stringify(filteredSaved));
    
    showToast('تم حذف المجلد بنجاح', 'info');
  };

  return (
    <div className="min-h-screen bg-surface text-slate-100 font-jakarta rtl" dir="rtl">
      <Navbar />

      <main className="container mx-auto px-6 pt-40 pb-24 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-6">
          <div>
            <h1 className="text-5xl font-amiri font-black gold-text mb-3">لوحة متابعة المجلدات</h1>
            <p className="text-slate-500 font-bold">تتبع حالة جميع الكتب المرفوعة للمنصة الملكية</p>
          </div>
          <Link to="/admin/upload">
            <button className="gold-button px-8 py-4 rounded-2xl font-black text-lg shadow-xl transform hover:scale-105 transition-all">
              + رفع مجلد جديد
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'إجمالي المجلدات', val: stats.total, icon: MenuBookIcon, color: 'text-gold-500' },
            { label: 'قيد المراجعة', val: stats.pending, icon: PendingActionsIcon, color: 'text-amber-400' },
            { label: 'تم النشر', val: stats.approved, icon: CheckCircleIcon, color: 'text-emerald-400' },
            { label: 'مرفوض', val: stats.rejected, icon: CancelIcon, color: 'text-red-400' },
          ].map(stat => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4 }}
              className="bg-surface-container-low p-6 rounded-3xl border border-gold-900/10 text-right hover:border-gold-500/20 transition-all shadow-lg"
            >
              <stat.icon className={`${stat.color} mb-3 text-3xl`} />
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="font-black text-white text-3xl">{stat.val}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 mb-10">
          {[
            { key: 'all', label: 'الكل' },
            { key: 'pending', label: 'قيد المراجعة' },
            { key: 'approved', label: 'تم النشر' },
            { key: 'rejected', label: 'مرفوض' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilterStatus(f.key)}
              className={`px-6 py-2 rounded-xl border font-black text-sm transition-all ${
                filterStatus === f.key
                  ? 'border-gold-500 bg-gold-600/10 text-gold-500'
                  : 'border-gold-900/10 bg-surface-container-low text-slate-500 hover:border-gold-500/30'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-surface-container-low rounded-[2.5rem] border border-gold-900/10 overflow-hidden shadow-2xl">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-gold-900/10 text-slate-500 font-black text-xs uppercase tracking-widest">
            <div className="col-span-4">العنوان</div>
            <div className="col-span-2">التصنيف</div>
            <div className="col-span-2">الحالة</div>
            <div className="col-span-2">التاريخ</div>
            <div className="col-span-2">إجراءات</div>
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="p-16 text-center text-slate-500 font-bold">لا توجد مجلدات في هذا التصنيف</div>
          ) : (
            filtered.map((book, index) => {
              const cfg = statusConfig[book.status];
              return (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 border-b border-gold-900/5 hover:bg-gold-500/5 transition-all items-center"
                >
                  {/* Title & Author */}
                  <div className="col-span-4">
                    <p className="font-black text-white text-lg">{book.title}</p>
                    <p className="text-slate-500 text-sm font-bold">{book.author}</p>
                  </div>

                  {/* Category */}
                  <div className="col-span-2">
                    <span className="text-sm font-bold text-slate-400">{book.category}</span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-black ${cfg.color}`}>
                      <cfg.icon className="text-sm" />
                      {cfg.label}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="col-span-2">
                    <span className="text-slate-500 font-bold text-sm">{book.uploadDate}</span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex gap-3">
                    <button className="w-9 h-9 rounded-xl border border-gold-900/20 flex items-center justify-center text-slate-400 hover:text-gold-500 hover:border-gold-500/30 transition-all">
                      <VisibilityIcon className="text-lg" />
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="w-9 h-9 rounded-xl border border-gold-900/20 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                    >
                      <DeleteOutlineIcon className="text-lg" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UploadDashboard;
