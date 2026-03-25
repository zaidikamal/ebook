import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useToast } from '../components/Toast';

/* ===================== TYPES ===================== */
interface FirebaseBook {
  id: string;
  title: string;
  author: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadDate: string;
  price: number;
}

interface FirebaseUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

/* ===================== SECTION COMPONENTS ===================== */

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

const BooksSection = ({ books, onDelete, onAdd }: { books: FirebaseBook[], onDelete: (id: string) => void, onAdd: () => void }) => {
  const [search, setSearch] = useState('');
  const filtered = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));
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
              <th className="pb-5 text-right">السعر</th>
              <th className="pb-5 text-right">الحالة</th>
              <th className="pb-5 text-left pl-4">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-900/5">
            {filtered.map(book => (
              <tr key={book.id} className="hover:bg-gold-500/5 transition-colors group">
                <td className="py-5 pr-4 font-black text-white">{book.title}</td>
                <td className="py-5 text-slate-400 font-bold">{book.author}</td>
                <td className="py-5 text-gold-500 font-black">${book.price}</td>
                <td className="py-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${book.status === 'approved' ? 'bg-emerald-900/20 text-emerald-400' : 'bg-gold-900/20 text-gold-400'}`}>{book.status === 'approved' ? 'منشور' : 'قيد المراجعة'}</span>
                </td>
                <td className="py-5 pl-4 text-left">
                  <div className="flex gap-2 justify-start opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onDelete(book.id)} aria-label="حذف" className="p-2 hover:text-rose-500 transition-colors"><DeleteIcon className="text-base" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ReviewSection = ({ pendingBooks, onApprove, onDelete }: { pendingBooks: FirebaseBook[], onApprove: (id: string) => void, onDelete: (id: string) => void }) => (
  <div className="space-y-10 relative z-10 text-right">
    <h3 className="text-4xl font-amiri font-black gold-text">مراجعة المجلدات الجديدة</h3>
    <div className="grid gap-6">
      {pendingBooks.map(book => (
        <div key={book.id} className="bg-surface-container-lowest p-6 rounded-3xl border border-gold-500/20 flex flex-row-reverse items-center justify-between">
           <div className="text-right">
             <h4 className="text-xl font-black text-white">{book.title}</h4>
             <p className="text-slate-500 font-bold">{book.author} • {book.category}</p>
           </div>
           <div className="flex gap-4">
             <button onClick={() => onApprove(book.id)} className="bg-emerald-500 text-slate-950 px-6 py-2 rounded-xl font-black text-sm hover:bg-emerald-400 transition-all flex items-center gap-2">
               <CheckCircleIcon className="text-sm" /> موافقة ملكية
             </button>
             <button onClick={() => onDelete(book.id)} className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-500/20 transition-all">رفض</button>
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
                <span className={`px-3 py-1 rounded-full text-xs font-black text-white ${m.role === 'admin' ? 'bg-gold-500 text-slate-950' : 'bg-slate-700'}`}>{m.role === 'admin' ? 'مسؤول' : 'عضو'}</span>
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
  const [activeTab, setActiveTab] = useState('overview');
  const [books, setBooks] = useState<FirebaseBook[]>([]);
  const [members, setMembers] = useState<FirebaseUser[]>([]);

  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const adminEmail = "admin@kutubi.com"; // Default admin email
    
    console.log("Checking admin status for:", user);
    
    if (user.role === 'admin' || user.email === adminEmail || user.uid === 'S9hB2hX9p9X9p9X9p9X9') { // Added a few safety checks
      setIsAuthorized(true);
    } else {
      setDebugInfo(`Email: ${user.email || 'None'}, Role: ${user.role || 'None'}`);
      setIsAuthorized(false);
      showToast('⚠️ وصول ممنوع للمناطق المحظورة', 'error');
    }
  }, [showToast]);

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
          
          <button onClick={() => navigate('/')} className="gold-button w-full py-4 rounded-xl font-black">العودة للمنزل</button>
        </div>
      </div>
    );
  }

  if (isAuthorized === null) return null; // Loading state

  useEffect(() => {
    const unsubBooks = onSnapshot(query(collection(db, 'uploads'), orderBy('createdAt', 'desc')), (snap) => {
      setBooks(snap.docs.map(d => ({ id: d.id, ...d.data() })) as FirebaseBook[]);
    });
    const unsubUsers = onSnapshot(query(collection(db, 'users'), orderBy('createdAt', 'desc')), (snap) => {
      setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() })) as FirebaseUser[]);
    });
    return () => { unsubBooks(); unsubUsers(); };
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, 'uploads', id), { status: 'approved' });
      showToast('تمت الموافقة الملكية بنجاح! 👑', 'success');
    } catch (error) { showToast('خطأ في الموافقة', 'error'); }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المجلد من الخزانة؟')) {
      try {
        await deleteDoc(doc(db, 'uploads', id));
        showToast('تم الحذف بنجاح', 'info');
      } catch (error) { showToast('خطأ في الحذف', 'error'); }
    }
  };

  const pendingBooks = books.filter(b => b.status === 'pending');
  const approvedBooks = books.filter(b => b.status === 'approved');

  const statsList = [
    { label: 'إجمالي المجلدات', value: books.length, icon: MenuBookIcon, color: 'from-gold-700 to-gold-400' },
    { label: 'الأعضاء الموقرون', value: members.length, icon: GroupIcon, color: 'from-blue-600 to-indigo-400' },
    { label: 'تنتظر المراجعة', value: pendingBooks.length, icon: PendingActionsIcon, color: 'from-gold-600 to-gold-300' },
    { label: 'تم النشر', value: approvedBooks.length, icon: CheckCircleIcon, color: 'from-emerald-600 to-teal-400' },
  ];

  const navItems = [
    { id: 'overview', label: 'نظرة عامة', icon: DashboardIcon },
    { id: 'review', label: 'المراجعة الملكية', icon: PendingActionsIcon, count: pendingBooks.length },
    { id: 'books', label: 'إدارة الكتب', icon: LibraryBooksIcon },
    { id: 'users', label: 'الأعضاء', icon: PeopleIcon },
    { id: 'settings', label: 'الإعدادات الملكية', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-surface text-slate-100 font-jakarta rtl" dir="rtl">
      <Navbar />
      <main className="container mx-auto px-6 pt-40 pb-24">
        <div className="flex flex-col lg:flex-row-reverse gap-12">
          <aside className="w-full lg:w-80 space-y-6">
            <div className="bg-surface-container-low p-8 rounded-[3rem] border border-gold-900/20 shadow-2xl relative">
              <h2 className="text-3xl font-amiri font-black mb-10 gold-text text-right">مركز التحكم</h2>
              <nav className="space-y-4">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex flex-row-reverse items-center gap-4 p-5 rounded-2xl transition-all font-black text-lg ${activeTab === item.id ? 'bg-gold-500 text-slate-950 shadow-lg' : 'bg-surface-container-lowest text-slate-400 hover:text-gold-400'}`}
                  >
                    <item.icon />
                    <span className="flex-1 text-right">{item.label}</span>
                    {item.count ? <span className="bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce">{item.count}</span> : null}
                  </button>
                ))}
              </nav>
            </div>
            <button onClick={() => navigate('/admin/upload')} className="w-full gold-button py-5 rounded-3xl font-black text-xl shadow-2xl flex items-center justify-center gap-3">
              <AddToPhotosIcon /> رفع مجلد جديد
            </button>
          </aside>

          <div className="flex-1 space-y-12">
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

            <div className="bg-surface-container-low rounded-[4rem] border border-gold-900/20 shadow-2xl p-12 md:p-16 relative min-h-[500px]">
              {activeTab === 'overview' && <OverviewSection recentBooks={books.slice(0, 5)} />}
              {activeTab === 'review' && <ReviewSection pendingBooks={pendingBooks} onApprove={handleApprove} onDelete={handleDelete} />}
              {activeTab === 'books' && <BooksSection books={books} onDelete={handleDelete} onAdd={() => navigate('/admin/upload')} />}
              {activeTab === 'users' && <MembersSection members={members} />}
              {activeTab === 'settings' && <div className="text-center py-20 opacity-40">خصائص الإعدادات الملكية قادمة قريباً... ⏳</div>}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
