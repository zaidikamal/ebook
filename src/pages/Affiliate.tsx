import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AffiliatePage: React.FC = () => {
  const stats = [
    { label: 'إجمالي الأرباح', value: '$2,450.00', icon: 'payments' },
    { label: 'النقرات الملكية', value: '15,200', icon: 'bolt' },
    { label: 'معدل التحويل', value: '3.5%', icon: 'track_changes' },
    { label: 'المسوقون الموقرون', value: '124', icon: 'groups' },
  ];

  return (
    <div className="min-h-screen bg-surface text-slate-100 font-jakarta rtl" dir="rtl">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-40 pb-24">
        <header className="mb-16 flex flex-col md:flex-row-reverse justify-between items-end gap-8">
           <div className="text-right">
              <h1 className="text-5xl font-amiri font-black gold-text mb-4">نظام التحالف الملكي (Affiliate)</h1>
              <p className="text-slate-400 text-xl font-bold">شارك المعرفة واربح عمولة ملكية مقابل كل كتاب يتم بيعه عبر رابطك الخاص.</p>
           </div>
           <button className="gold-button px-10 py-5 rounded-2xl font-black text-xl shadow-xl">إنشاء رابط تسويقي جديد</button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
           {stats.map(stat => (
             <div key={stat.label} className="bg-surface-container-low p-8 rounded-[2.5rem] border border-gold-900/10 shadow-xl text-right">
                <span className="material-icons text-4xl gold-text mb-6">{stat.icon}</span>
                <p className="text-slate-500 text-xs font-black uppercase mb-1">{stat.label}</p>
                <p className="text-3xl font-amiri font-black text-white">{stat.value}</p>
             </div>
           ))}
        </div>

        <div className="bg-surface-container-low rounded-[4rem] border border-gold-900/20 p-12 overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-gold-600/5 rounded-full blur-[100px]"></div>
           
           <h3 className="text-3xl font-amiri font-black gold-text mb-10 text-right">سجل التحويلات والمبيعات</h3>
           
           <div className="overflow-x-auto text-right">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold-900/10 text-slate-500 text-sm font-black uppercase">
                    <th className="pb-6 pr-4">المنتج الملكي</th>
                    <th className="pb-6">المسوق</th>
                    <th className="pb-6">العمولة</th>
                    <th className="pb-6">الحالة</th>
                    <th className="pb-6 pl-4">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-900/5">
                   {[1,2,3,4].map(i => (
                     <tr key={i} className="hover:bg-gold-500/5 transition-colors group">
                       <td className="py-6 pr-4 font-black">مكتبة الأدب العربي (حزمة)</td>
                       <td className="py-6 font-bold text-slate-400">سفير المعرفة #450</td>
                       <td className="py-6 text-emerald-500 font-black">$12.50</td>
                       <td className="py-6">
                          <span className="bg-emerald-500/10 text-emerald-500 px-4 py-1 rounded-full text-xs font-black border border-emerald-500/20">مدفوع</span>
                       </td>
                       <td className="py-6 pl-4 text-slate-500 text-sm">منذ {i * 2} ساعة</td>
                     </tr>
                   ))}
                </tbody>
              </table>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AffiliatePage;
