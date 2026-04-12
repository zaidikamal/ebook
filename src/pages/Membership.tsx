import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check, Star, Crown, Shield, Zap, Gem, Award, Search } from 'lucide-react';

const MembershipTier = ({ tier, idx }: { tier: any; idx: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: idx * 0.1, duration: 0.8 }}
    className={`relative group rounded-[3rem] p-10 border transition-all duration-500 hover:scale-[1.02] ${
      tier.highlight ? 'bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-yellow-500/50 shadow-[0_0_50px_rgba(234,179,8,0.1)]' : 'bg-white/[0.02] border-white/10 hover:border-white/20'
    }`}
  >
    {tier.highlight && (
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-6 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-xl">
        Most Distinguished
      </div>
    )}

    <div className="flex flex-col h-full">
      <div className="mb-8">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${tier.iconBg}`}>
          <tier.icon className={`w-8 h-8 ${tier.iconColor}`} />
        </div>
        <h3 className="text-3xl font-amiri font-black text-white mb-2">{tier.name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-white">{tier.price}</span>
          <span className="text-zinc-500 text-sm">{tier.period}</span>
        </div>
        <p className="mt-4 text-zinc-400 text-sm leading-relaxed">{tier.description}</p>
      </div>

      <div className="space-y-4 mb-10 flex-grow">
        {tier.features.map((feature: string, i: number) => (
          <div key={i} className="flex items-start gap-3 group/item">
            <div className={`mt-1 p-0.5 rounded-full ${tier.highlight ? 'bg-yellow-500/20 text-yellow-500' : 'bg-white/10 text-zinc-400'}`}>
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="text-zinc-300 text-sm font-medium group-hover/item:text-white transition-colors">{feature}</span>
          </div>
        ))}
      </div>

      <button className={`w-full py-4 rounded-2xl font-black text-lg transition-all duration-300 ${
        tier.highlight 
          ? 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/20' 
          : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
      }`}>
        {tier.cta}
      </button>
    </div>
  </motion.div>
);

const Membership = () => {
  const tiers = [
    {
      name: "الباحث الموقر",
      price: "$0",
      period: "/مجاناً",
      description: "للقراء الشغوفين ببداية رحلتهم في عالم المخطوطات والكتب النادرة.",
      icon: Search,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      features: [
        "الوصول للكتب العامة",
        "محرك بحث ذكي",
        "قائمة القراءة الشخصية",
        "تنبيهات بالإصدارات الجديدة"
      ],
      cta: "ابدأ مجاناً",
      highlight: false
    },
    {
      name: "العضوية الملكية",
      price: "$29",
      period: "/شهرياً",
      description: "التجربة الكاملة للنخبة، وصول غير محدود لكل كنوز المنصة.",
      icon: Crown,
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-500",
      features: [
        "كل مزايا الباحث الموقر",
        "وصول حصري للمخطوطات الملكية",
        "تحميل غير محدود بأعلى جودة",
        "تجربة خالية من الإعلانات",
        "أولوية الوصول للإصدارات النادرة",
        "شارات ملكية خاصة للملف الشخصي"
      ],
      cta: "انضم للنخبة الآن",
      highlight: true
    },
    {
      name: "حامي التراث",
      price: "$99",
      period: "/سنوياً",
      description: "للمؤسسات وكبار الجامعين الداعمين لحفظ التراث العربي المعرفي.",
      icon: Shield,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      features: [
        "كل مزايا العضوية الملكية",
        "دعم فني مخصص 24/7",
        "أدوات تحليل وبحث متقدمة",
        "إمكانية اقتراح كتب للرقمنة",
        "شهادة تقدير كداعم للتراث",
        "خصومات خاصة على الطبعات الورقية"
      ],
      cta: "كن حامياً للتراث",
      highlight: false
    }
  ];

  const benefits = [
    { icon: Zap, title: "سرعة في التحميل", desc: "خوادم مخصصة تضمن لك أقصى سرعة لتحميل المجلدات الضخمة." },
    { icon: Gem, title: "محتوى حصري", desc: "نعمل مع كبار المكتبيين لتوفير نسخ لن تجدها في أي مكان آخر." },
    { icon: Award, title: "جودة ملكية", desc: "جميع النسخ ممسوحة ضوئياً بأحدث التقنيات وبدقة 4K." }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-jakarta" dir="rtl">
      <Helmet>
        <title>العضوية الملكية | منصة كتبي</title>
        <meta name="description" content="انضم إلى صفوة القراء واحصل على وصول حصري لأندر المخطوطات والكتب العربية." />
      </Helmet>

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#3b3b3b33,transparent)] pointer-events-none" />
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-black tracking-widest uppercase text-zinc-400">انضم إلى قائمة الصفوة</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl lg:text-8xl font-amiri font-black mb-8 leading-tight"
          >
            عضوية تليق <br /> <span className="text-yellow-500 italic">بشغفك المعرفي</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-zinc-400 text-lg md:text-xl leading-relaxed mb-12"
          >
            اختر الباقة التي تناسب تطلعاتك وانطلق في رحلة عبر آلاف السنين من المعرفة والأدب العربي الفاخر.
          </motion.p>
        </div>
      </section>

      {/* Tiers Grid */}
      <section className="py-20 px-6 relative">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => (
              <MembershipTier key={idx} tier={tier} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 px-6 bg-zinc-950/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-yellow-500/5 border border-yellow-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-8 h-8 text-yellow-500" />
                </div>
                <h4 className="text-xl font-black mb-4">{benefit.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ / Trust Banner */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-16 rounded-[4rem] bg-gradient-to-br from-yellow-500 to-yellow-600 text-black relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-20 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-amiri font-black mb-6">هل لديك استفسار خاص؟</h2>
              <p className="text-black/80 text-lg mb-10 font-bold">فريق الدعم الملكي مخصص لخدمة الأعضاء والباحثين على مدار الساعة.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-black text-white hover:bg-zinc-900 px-10 py-6 rounded-2xl text-lg font-black transition-all">
                  تواصل معنا
                </button>
                <button className="border-2 border-black text-black hover:bg-black/5 px-10 py-6 rounded-2xl text-lg font-black transition-all">
                  الأسئلة الشائعة
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Membership;
