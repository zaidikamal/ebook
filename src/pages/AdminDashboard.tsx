import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ===================== DATA ===================== */
const stats = [
  { label: 'إجمالي المبيعات الملكية', value: '$124,500', icon: 'payments', color: 'from-gold-700 to-gold-400' },
  { label: 'الأعضاء الموقرون', value: '1,250', icon: 'group', color: 'from-blue-600 to-indigo-400' },
  { label: 'الكتب في الخزانة', value: '450', icon: 'menu_book', color: 'from-gold-600 to-gold-300' },
  { label: 'معدل القراءة اليومي', value: '+15%', icon: 'trending_up', color: 'from-emerald-600 to-teal-400' },
];

const recentSales = [
  { id: 1, user: 'أحمد علي', book: 'فن اللامبالاة', price: '$15.99', date: 'منذ ساعتين', status: 'مكتمل' },
  { id: 2, user: 'سارة خالد', book: 'عادات ذرية', price: '$12.50', date: 'منذ 5 ساعات', status: 'مكتمل' },
  { id: 3, user: 'محمد فهد', book: 'عالم صوفي', price: '$18.00', date: 'يوم أمس', status: 'مكتمل' },
  { id: 4, user: 'ليلى منصور', book: 'قواعد العشق الأربعون', price: '$14.99', date: 'يوم أمس', status: 'مكتمل' },
  { id: 5, user: 'عمر بن خلدون', book: 'المقدمة', price: '$22.99', date: 'منذ 3 أيام', status: 'مكتمل' },
];

const mockBooks = [
  { id: 1, title: 'فن اللامبالاة', author: 'مارك مانسون', price: '$15.99', sales: 342, status: 'منشور' },
  { id: 2, title: 'عادات ذرية', author: 'جيمس كلير', price: '$12.50', sales: 289, status: 'منشور' },
  { id: 3, title: 'عالم صوفي', author: 'يوستاين غاردر', price: '$18.00', sales: 201, status: 'منشور' },
  { id: 4, title: 'قواعد العشق الأربعون', author: 'إليف شافاق', price: '$14.99', sales: 178, status: 'منشور' },
  { id: 5, title: 'نزل الرياح', author: 'باتريك روتفوس', price: '$19.99', sales: 95, status: 'مسودة' },
];

const mockMembers = [
  { id: 1, name: 'أحمد علي', email: 'ahmed@royal.com', tier: 'Diamond', books: 12, joined: 'يناير 2025', status: 'نشط' },
  { id: 2, name: 'سارة خالد', email: 'sara@royal.com', tier: 'Ruby', books: 7, joined: 'فبراير 2025', status: 'نشط' },
  { id: 3, name: 'محمد فهد', email: 'mfhd@royal.com', tier: 'Emerald', books: 4, joined: 'مارس 2025', status: 'نشط' },
  { id: 4, name: 'ليلى منصور', email: 'layla@royal.com', tier: 'Free', books: 2, joined: 'مارس 2025', status: 'نشط' },
  { id: 5, name: 'عمر بن خلدون', email: 'omar@royal.com', tier: 'Diamond', books: 21, joined: 'ديسمبر 2024', status: 'نشط' },
];

const monthlyRevenue = [
  { month: 'أكتوبر', value: 8200 },
  { month: 'نوفمبر', value: 11500 },
  { month: 'ديسمبر', value: 19800 },
  { month: 'يناير', value: 14300 },
  { month: 'فبراير', value: 21000 },
  { month: 'مارس', value: 24500 },
];

const tierColors: Record<string, string> = {
  'Diamond': 'from-blue-600 to-indigo-400',
  'Ruby': 'from-rose-600 to-pink-400',
  'Emerald': 'from-emerald-600 to-teal-400',
  'Free': 'from-slate-600 to-slate-400',
};

/* ===================== SECTION COMPONENTS ===================== */

const OverviewSection = () => (
  <div className="space-y-12 relative z-10">
    <div className="flex flex-row-reverse items-center justify-between">
      <h3 className="text-4xl font-amiri font-black gold-text">مبيعات اليوم التاريخية</h3>
      <button className="bg-surface-container-lowest border border-gold-900/10 px-8 py-3 rounded-2xl text-gold-400 font-black hover:bg-gold-500/5 transition-all text-sm">عرض كل المعاملات</button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-right">
        <thead>
          <tr className="border-b border-gold-900/10 text-slate-500 text-xs font-black uppercase tracking-widest">
            <th className="pb-6 pr-4">المشتري</th>
            <th className="pb-6">الكتاب</th>
            <th className="pb-6">المبلغ</th>
            <th className="pb-6">الحالة</th>
            <th className="pb-6 pl-4">التاريخ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gold-900/5">
          {recentSales.map(sale => (
            <tr key={sale.id} className="hover:bg-gold-500/5 transition-colors">
              <td className="py-5 pr-4 font-black">{sale.user}</td>
              <td className="py-5 font-bold text-slate-400">{sale.book}</td>
              <td className="py-5 text-gold-500 font-black">{sale.price}</td>
              <td className="py-5"><span className="px-3 py-1 bg-emerald-900/20 text-emerald-400 rounded-full text-xs font-black">{sale.status}</span></td>
              <td className="py-5 pl-4 text-slate-500 text-sm">{sale.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const BooksSection = ({ onAdd }: { onAdd: () => void }) => {
  const [search, setSearch] = useState('');
  const filtered = mockBooks.filter(b => b.title.includes(search) || b.author.includes(search));
  return (
    <div className="space-y-10 relative z-10">
      <div className="flex flex-row-reverse items-center justify-between gap-4">
        <h3 className="text-4xl font-amiri font-black gold-text">إدارة الكتب</h3>
        <div className="flex gap-4 flex-row-reverse">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث في المكتبة..."
            className="bg-surface-container-lowest border border-gold-900/20 rounded-2xl px-6 py-3 text-white font-bold text-sm focus:outline-none focus:border-gold-500/50 w-56 text-right"
          />
          <button onClick={onAdd} className="gold-button px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2">
            <span className="material-icons text-lg">add</span> إضافة كتاب
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-gold-900/10 text-slate-500 text-xs font-black uppercase tracking-widest">
              <th className="pb-5 pr-4">عنوان الكتاب</th>
              <th className="pb-5">المؤلف</th>
              <th className="pb-5">السعر</th>
              <th className="pb-5">المبيعات</th>
              <th className="pb-5">الحالة</th>
              <th className="pb-5 pl-4">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-900/5">
            {filtered.map(book => (
              <tr key={book.id} className="hover:bg-gold-500/5 transition-colors group">
                <td className="py-5 pr-4 font-black">{book.title}</td>
                <td className="py-5 text-slate-400 font-bold">{book.author}</td>
                <td className="py-5 text-gold-500 font-black">{book.price}</td>
                <td className="py-5 font-bold text-slate-300">{book.sales}</td>
                <td className="py-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${book.status === 'منشور' ? 'bg-emerald-900/20 text-emerald-400' : 'bg-gold-900/20 text-gold-400'}`}>{book.status}</span>
                </td>
                <td className="py-5 pl-4">
                  <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:text-gold-500 transition-colors"><span className="material-icons text-base">edit</span></button>
                    <button className="p-2 hover:text-rose-500 transition-colors"><span className="material-icons text-base">delete</span></button>
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

const MembersSection = () => {
  const [search, setSearch] = useState('');
  const filtered = mockMembers.filter(m => m.name.includes(search) || m.email.includes(search));
  return (
    <div className="space-y-10 relative z-10">
      <div className="flex flex-row-reverse items-center justify-between gap-4">
        <h3 className="text-4xl font-amiri font-black gold-text">قاعدة الأعضاء</h3>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="بحث في الأعضاء..."
          className="bg-surface-container-lowest border border-gold-900/20 rounded-2xl px-6 py-3 text-white font-bold text-sm focus:outline-none focus:border-gold-500/50 w-56 text-right"
        />
      </div>

      <div className="grid grid-cols-4 gap-6 mb-4">
        {[
          { label: 'Diamond', count: 2, color: 'from-blue-600 to-indigo-400' },
          { label: 'Ruby', count: 1, color: 'from-rose-600 to-pink-400' },
          { label: 'Emerald', count: 1, color: 'from-emerald-600 to-teal-400' },
          { label: 'Free', count: 1, color: 'from-slate-600 to-slate-400' },
        ].map(t => (
          <div key={t.label} className="bg-surface-container-lowest rounded-3xl p-5 border border-gold-900/10 text-center">
            <div className={`bg-gradient-to-tr ${t.color} w-10 h-10 rounded-2xl mx-auto mb-3`} />
            <p className="font-black text-white text-xl">{t.count}</p>
            <p className="text-slate-500 text-xs font-black">{t.label}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-gold-900/10 text-slate-500 text-xs font-black uppercase tracking-widest">
              <th className="pb-5 pr-4">العضو</th>
              <th className="pb-5">البريد</th>
              <th className="pb-5">المستوى</th>
              <th className="pb-5">الكتب</th>
              <th className="pb-5">تاريخ الانضمام</th>
              <th className="pb-5 pl-4">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-900/5">
            {filtered.map(m => (
              <tr key={m.id} className="hover:bg-gold-500/5 transition-colors">
                <td className="py-5 pr-4 font-black">{m.name}</td>
                <td className="py-5 text-slate-400 font-bold text-sm">{m.email}</td>
                <td className="py-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-black text-white bg-gradient-to-r ${tierColors[m.tier]}`}>{m.tier}</span>
                </td>
                <td className="py-5 font-black text-gold-400">{m.books}</td>
                <td className="py-5 text-slate-500 text-sm">{m.joined}</td>
                <td className="py-5 pl-4"><span className="px-3 py-1 bg-emerald-900/20 text-emerald-400 rounded-full text-xs font-black">{m.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ReportsSection = () => {
  const maxVal = Math.max(...monthlyRevenue.map(m => m.value));
  const totalRevenue = monthlyRevenue.reduce((a, b) => a + b.value, 0);
  return (
    <div className="space-y-12 relative z-10">
      <h3 className="text-4xl font-amiri font-black gold-text text-right">التقارير المالية</h3>

      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'الإيرادات الكلية', value: `$${totalRevenue.toLocaleString()}`, icon: 'paid', trend: '+22%' },
          { label: 'متوسط قيمة الطلب', value: '$16.50', icon: 'receipt_long', trend: '+8%' },
          { label: 'معدل التحويل', value: '3.4%', icon: 'conversion_path', trend: '+1.2%' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-surface-container-lowest p-6 rounded-3xl border border-gold-900/10 text-right">
            <div className="flex flex-row-reverse items-start justify-between mb-4">
              <span className="material-icons text-gold-500 text-2xl">{kpi.icon}</span>
              <span className="text-emerald-400 text-xs font-black bg-emerald-900/20 px-3 py-1 rounded-full">{kpi.trend}</span>
            </div>
            <p className="text-3xl font-amiri font-black text-white mb-1">{kpi.value}</p>
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="space-y-4">
        <h4 className="text-xl font-amiri font-black text-slate-300 text-right">الإيرادات الشهرية</h4>
        <div className="flex flex-row-reverse items-end gap-3 h-48 bg-surface-container-lowest rounded-3xl p-6 border border-gold-900/10">
          {monthlyRevenue.map(m => (
            <div key={m.month} className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
              <span className="text-gold-500 text-xs font-black">${(m.value / 1000).toFixed(1)}k</span>
              <div
                className="w-full bg-gradient-to-t from-gold-700 to-gold-400 rounded-t-xl transition-all duration-700 relative group"
                style={{ height: `${(m.value / maxVal) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-all rounded-t-xl" />
              </div>
              <span className="text-slate-500 text-xs font-bold">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Books */}
      <div className="space-y-4">
        <h4 className="text-xl font-amiri font-black text-slate-300 text-right">أعلى الكتب مبيعاً</h4>
        <div className="space-y-3">
          {mockBooks.sort((a, b) => b.sales - a.sales).slice(0, 4).map((book, i) => (
            <div key={book.id} className="flex flex-row-reverse items-center gap-4 bg-surface-container-lowest p-5 rounded-2xl border border-gold-900/10">
              <span className="text-gold-500 font-black text-lg w-8 text-center">#{i + 1}</span>
              <div className="flex-1 text-right">
                <p className="font-black">{book.title}</p>
                <p className="text-slate-500 text-sm">{book.author}</p>
              </div>
              <div className="text-right">
                <p className="text-gold-500 font-black">{book.sales} مبيعة</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SettingsSection = () => {
  const [siteName, setSiteName] = useState('كُتُبي');
  const [currency, setCurrency] = useState('USD');
  const [commissionRate, setCommissionRate] = useState('30');
  const [freeTrialDays, setFreeTrialDays] = useState('7');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const field = (label: string, value: string, onChange: (v: string) => void, type = 'text') => (
    <div className="space-y-2">
      <label className="block text-slate-400 text-sm font-black text-right">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-surface-container-lowest border border-gold-900/20 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-gold-500/50 text-right"
      />
    </div>
  );

  return (
    <div className="space-y-10 relative z-10">
      <h3 className="text-4xl font-amiri font-black gold-text text-right">الإعدادات الملكية</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Platform Settings */}
        <div className="space-y-6 bg-surface-container-lowest p-8 rounded-3xl border border-gold-900/10">
          <h4 className="text-lg font-black text-gold-400 text-right border-b border-gold-900/10 pb-4">إعدادات المنصة</h4>
          {field('اسم المنصة', siteName, setSiteName)}
          {field('عملة التسعير', currency, setCurrency)}
        </div>

        {/* Business Settings */}
        <div className="space-y-6 bg-surface-container-lowest p-8 rounded-3xl border border-gold-900/10">
          <h4 className="text-lg font-black text-gold-400 text-right border-b border-gold-900/10 pb-4">إعدادات الأعمال</h4>
          {field('نسبة عمولة المؤلفين (%)', commissionRate, setCommissionRate, 'number')}
          {field('أيام الفترة التجريبية المجانية', freeTrialDays, setFreeTrialDays, 'number')}
        </div>

        {/* Security */}
        <div className="space-y-4 bg-surface-container-lowest p-8 rounded-3xl border border-gold-900/10">
          <h4 className="text-lg font-black text-gold-400 text-right border-b border-gold-900/10 pb-4">الأمان والوصول</h4>
          {[
            { label: 'المصادقة الثنائية للمسؤولين', enabled: true },
            { label: 'تشفير روابط التحميل', enabled: true },
            { label: 'وضع الصيانة', enabled: false },
          ].map(item => (
            <div key={item.label} className="flex flex-row-reverse items-center justify-between">
              <span className="font-bold text-slate-300">{item.label}</span>
              <div className={`w-12 h-6 rounded-full flex items-center px-1 transition-all cursor-pointer ${item.enabled ? 'bg-gold-500 justify-end' : 'bg-slate-700 justify-start'}`}>
                <div className="w-4 h-4 bg-white rounded-full shadow" />
              </div>
            </div>
          ))}
        </div>

        {/* Notifications */}
        <div className="space-y-4 bg-surface-container-lowest p-8 rounded-3xl border border-gold-900/10">
          <h4 className="text-lg font-black text-gold-400 text-right border-b border-gold-900/10 pb-4">الإشعارات</h4>
          {[
            { label: 'إشعار كل عملية بيع', enabled: true },
            { label: 'تقارير أسبوعية بالبريد', enabled: true },
            { label: 'تنبيهات الأعضاء الجدد', enabled: false },
          ].map(item => (
            <div key={item.label} className="flex flex-row-reverse items-center justify-between">
              <span className="font-bold text-slate-300">{item.label}</span>
              <div className={`w-12 h-6 rounded-full flex items-center px-1 transition-all cursor-pointer ${item.enabled ? 'bg-gold-500 justify-end' : 'bg-slate-700 justify-start'}`}>
                <div className="w-4 h-4 bg-white rounded-full shadow" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-row-reverse gap-4">
        <button
          onClick={handleSave}
          className={`gold-button px-10 py-4 rounded-2xl font-black text-lg flex items-center gap-2 transition-all ${saved ? 'bg-emerald-500 text-white shadow-emerald-500/30' : ''}`}
        >
          <span className="material-icons">{saved ? 'check_circle' : 'save'}</span>
          {saved ? 'تم الحفظ بنجاح!' : 'حفظ الإعدادات'}
        </button>
      </div>
    </div>
  );
};

/* ===================== MAIN DASHBOARD ===================== */
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const navItems = [
    { id: 'overview', label: 'نظرة عامة', icon: 'dashboard' },
    { id: 'upload', label: 'إضافة كتاب', icon: 'add_to_photos' },
    { id: 'books', label: 'إدارة الكتب', icon: 'library_books' },
    { id: 'users', label: 'الأعضاء', icon: 'people' },
    { id: 'reports', label: 'التقارير المالية', icon: 'analytics' },
    { id: 'settings', label: 'الإعدادات الملكية', icon: 'settings' },
  ];

  const handleNav = (id: string) => {
    if (id === 'upload') {
      navigate('/admin/upload');
    } else {
      setActiveTab(id);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-slate-100 font-jakarta rtl" dir="rtl">
      <Navbar />

      <main className="container mx-auto px-6 pt-40 pb-24">
        <div className="flex flex-col lg:flex-row-reverse gap-12">

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-80 space-y-6">
            <div className="bg-surface-container-low p-8 rounded-[3rem] border border-gold-900/20 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-600/5 rounded-full blur-3xl" />
              <h2 className="text-3xl font-amiri font-black mb-10 gold-text text-right">مركز التحكم</h2>
              <nav className="space-y-4 relative z-10">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex flex-row-reverse items-center gap-4 p-5 rounded-2xl transition-all font-black text-lg ${activeTab === item.id ? 'bg-gold-500 text-slate-950 shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'bg-surface-container-lowest text-slate-400 hover:text-gold-400 hover:bg-gold-500/5'}`}
                  >
                    <span className="material-icons">{item.icon}</span>
                    <span className="flex-1 text-right">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="bg-gradient-to-br from-gold-900/20 to-surface-container-low p-8 rounded-[3rem] border border-gold-900/20 text-center">
              <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-gold-500 text-3xl">verified_user</span>
              </div>
              <p className="text-sm font-bold text-slate-400 mb-4">أنت الآن في المنطقة الآمنة</p>
              <button onClick={() => navigate('/login')} className="text-gold-500 hover:underline font-black">تسجيل الخروج</button>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1 space-y-12">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              {stats.map(stat => (
                <div key={stat.label} className="bg-surface-container-low p-8 rounded-[2.5rem] border border-gold-900/10 shadow-xl group hover:border-gold-500/30 transition-all">
                  <div className={`w-14 h-14 bg-gradient-to-tr ${stat.color} rounded-2xl flex items-center justify-center text-slate-900 mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <span className="material-icons text-3xl">{stat.icon}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-4xl font-amiri font-black text-white">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Section Content */}
            <div className="bg-surface-container-low rounded-[4rem] border border-gold-900/20 shadow-2xl p-12 md:p-16 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-600/5 rounded-full blur-[80px]" />
              {activeTab === 'overview' && <OverviewSection />}
              {activeTab === 'books' && <BooksSection onAdd={() => navigate('/admin/upload')} />}
              {activeTab === 'users' && <MembersSection />}
              {activeTab === 'reports' && <ReportsSection />}
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
