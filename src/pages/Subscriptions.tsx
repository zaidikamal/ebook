import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import DiamondIcon from '@mui/icons-material/Diamond';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

const Subscriptions: React.FC = () => {
  const tiers = [
    {
      name: 'العضوية الزمردية',
      price: '9.99',
      duration: 'شهرياً',
      features: ['الوصول لـ 500 كتاب تاريخي', 'تحميل بصيغة PDF', 'دعم فني ملكي'],
      color: 'from-emerald-900/40 to-emerald-600/20',
      border: 'border-emerald-500/30',
      icon: AutoStoriesIcon
    },
    {
      name: 'العضوية الياقوتية',
      price: '19.99',
      duration: 'شهرياً',
      features: ['وصول غير محدود للخزانة', 'معاينة الفصول قبل الجميع', 'بدون إعلانات نهائياً', 'العلامة المائية الشخصية'],
      color: 'from-gold-900/40 to-gold-600/20',
      border: 'border-gold-500/50',
      icon: DiamondIcon,
      recommended: true
    },
    {
      name: 'العضوية الماسية',
      price: '49.99',
      duration: 'شهرياً',
      features: ['كل مزايا الياقوتية', 'نسخ مطبوعة فاخرة اختيارياً', 'لقاءات مع المؤلفين الموقرين', 'شهادة عضوية ذهبية'],
      color: 'from-blue-900/40 to-blue-600/20',
      border: 'border-blue-500/30',
      icon: WorkspacePremiumIcon
    }
  ];

  return (
    <div className="min-h-screen bg-surface text-slate-100 font-jakarta rtl text-right" dir="rtl">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-48 pb-24">
        <header className="text-center max-w-3xl mx-auto mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-amiri font-black gold-text mb-6"
          >
            خزائن المعرفة الملكية
          </motion.h1>
          <p className="text-slate-400 text-xl font-medium leading-relaxed">
            اختر عضويتك التي تليق بمقامك الثقافي وانضم إلى صفوة القراء في أكبر مجتمع معرفي عربي فاخر.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative bg-surface-container-low rounded-[3.5rem] p-12 border ${tier.border} shadow-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-500`}
            >
              <div className={`absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b ${tier.color} opacity-20 pointer-events-none`}></div>
              
              {tier.recommended && (
                <div className="absolute top-10 -left-12 -rotate-45 bg-gold-500 text-slate-950 font-black py-2 px-14 shadow-lg text-sm">
                  الموصى بها
                </div>
              )}

              <div className="relative z-10">
                <tier.icon className="text-5xl gold-text mb-6" />
                <h3 className="text-3xl font-amiri font-black text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-2 mb-10">
                  <span className="text-5xl font-black gold-text">${tier.price}</span>
                  <span className="text-slate-500 font-bold">/ {tier.duration}</span>
                </div>

                <ul className="space-y-6 mb-12">
                  {tier.features.map(feature => (
                    <li key={feature} className="flex items-center gap-4 text-slate-300 font-bold">
                      <CheckCircleIcon className="text-gold-500 text-lg" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-all ${tier.recommended ? 'gold-button' : 'bg-surface-container-lowest border border-gold-900/20 text-gold-400 hover:bg-gold-500/5'}`}>
                  انضم الآن للمجتمع
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Subscriptions;
