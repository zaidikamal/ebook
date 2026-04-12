import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MenuBook, 
  Security, 
  AutoStories, 
  Star, 
  ArrowForward, 
  SmartToy,
  AutoGraph
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050507] text-white selection:bg-gold-500/30 overflow-hidden font-jakarta" dir="rtl">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 container mx-auto px-6 text-center">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gold-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none animate-pulse-slow" />

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, ease: "easeOut" }}
           className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
             <Star className="text-[14px]" /> الإصدار الملكي النهائي وصولاً
          </div>
          
          <h1 className="text-6xl md:text-8xl font-amiri font-black mb-8 leading-[1.1] tracking-tight">
            ادخل عالم <span className="gold-text">الخزانة الرقمية</span> <br /> 
            بفخامة لا تضاهى.
          </h1>
          
          <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl font-bold mb-12 leading-relaxed">
            منصة "كتبي" بهويتها الملكية الجديدة تعيد تعريف تجربة القراءة والإدارة الرقمية. 
            أرشيف سينمائي، تحليلات ذكية، وتحكم إمبراطوري كامل.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
             <button 
                onClick={() => navigate('/register')}
                className="gold-button px-10 py-5 rounded-2xl text-xl font-black flex items-center gap-3 group shadow-[0_20px_40px_rgba(212,175,55,0.2)]"
             >
                ابدأ رحلتك الملكية <ArrowForward className="group-hover:translate-x-[-10px] transition-transform" />
             </button>
             <button 
                onClick={() => {
                  const el = document.getElementById('demo-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-10 py-5 rounded-2xl text-xl font-bold border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
             >
                شاهد العرض التجريبي
             </button>
          </div>
        </motion.div>

        {/* Floating Icons Decors */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0], y: [-20, 20, -20] }}
            transition={{ duration: 5 + i, repeat: Infinity, delay: i }}
            className="absolute hidden lg:block text-gold-500/20"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 20}%`,
            }}
          >
            <MenuBook className="text-[40px]" />
          </motion.div>
        ))}
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
           {[
             { label: 'كتاب ملكي', value: '+5,000' },
             { label: 'عضو مستنير', value: '+20k' },
             { label: 'تحميلات معتمدة', value: '+150k' },
             { label: 'دقة الـ AI', value: '99.9%' },
           ].map((stat, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
             >
                <p className="text-4xl md:text-5xl font-amiri font-black gold-text mb-2">{stat.value}</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 container mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-amiri font-black text-white mb-6 underline decoration-gold-500/20 underline-offset-8">مميزات العصر الملكي</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">أدوات إمبراطورية مصممة لنخبة القراء والمديرين</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           {[
             { 
               title: 'مساعد الذكاء الاصطناعي', 
               desc: 'مستشار رقمي يحلل اهتماماتك ويقترح لك المجلدات بناءً على ذوقك الرفيع.',
               icon: <SmartToy />,
               color: 'from-blue-500/20 to-indigo-500/5'
             },
             { 
               title: 'الخزانة السينمائية', 
               desc: 'تجربة تصفح غامرة تحول رحلة البحث عن كتاب إلى رحلة بصرية فاخرة.',
               icon: <AutoStories />,
               color: 'from-gold-500/20 to-amber-500/5'
             },
             { 
               title: 'مركز الأوامر الفوري', 
               desc: 'لوحة تحكم (Ctrl+K) تمكنك من التنقل بين أروقة المنصة بلمحة بصر.',
               icon: <AutoGraph />,
               color: 'from-emerald-500/20 to-teal-500/5'
             }
           ].map((feat, i) => (
             <motion.div
               key={i}
               whileHover={{ y: -10 }}
               className="bg-[#0c0c0d] p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group"
             >
                <div className={`absolute inset-0 bg-gradient-to-br ${feat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                   <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-gold-500 mb-8 border border-white/10 group-hover:scale-110 transition-transform">
                      {feat.icon}
                   </div>
                   <h3 className="text-2xl font-black text-white mb-4">{feat.title}</h3>
                   <p className="text-slate-500 font-bold leading-relaxed">{feat.desc}</p>
                </div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo-section" className="py-32 relative overflow-hidden">
         <div className="absolute inset-0 bg-gold-500/[0.02] pointer-events-none" />
         <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-20">
               <div className="lg:w-1/2 text-right">
                  <span className="text-gold-500 font-black uppercase text-[10px] tracking-[0.4em] mb-4 block">LIVE DEMO PREVIEW</span>
                  <h2 className="text-4xl md:text-7xl font-amiri font-black text-white mb-8">استجابة فائقة <br /> <span className="gold-text">في قمرة القيادة</span>.</h2>
                  <p className="text-slate-400 text-lg font-bold leading-relaxed mb-10">
                     شاهد كيف تتحول البيانات المعقدة إلى لوحات فنية سهلة الإدارة. نظام الإشعارات الملكي، مركز الأوامر السريعة، والتحليلات الحية.. كلها بين يديك.
                  </p>
                  <ul className="space-y-4">
                     {['واجهة مستخدم بتقنية Glassmorphism', 'نظام إشعارات لحظي متطور', 'تصفح فائق السرعة'].map((item, i) => (
                       <li key={i} className="flex items-center gap-3 font-black text-sm text-slate-300">
                          <div className="w-2 h-2 rounded-full bg-gold-500" />
                          {item}
                       </li>
                     ))}
                  </ul>
               </div>
               
               <div className="lg:w-1/2 relative">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    className="relative z-10 rounded-[3rem] overflow-hidden border border-gold-500/20 shadow-[0_0_100px_rgba(212,175,55,0.15)] bg-slate-900 aspect-video group"
                  >
                     <img 
                       src="https://i.imgur.com/GisLhRk.png" 
                       className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" 
                       alt="Admin Dashboard Preview" 
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                     <div className="absolute bottom-8 right-8 flex items-center gap-3">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">عرض حي للوحة التحكم</span>
                     </div>
                  </motion.div>
                  {/* Decorative Elements */}
                  <div className="absolute -top-10 -left-10 w-40 h-40 border border-gold-500/10 rounded-full" />
                  <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-gold-500/5 blur-3xl rounded-full" />
               </div>
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 bg-gradient-to-b from-transparent to-gold-500/5">
         <div className="container mx-auto px-6 text-center max-w-4xl">
            <h2 className="text-4xl md:text-7xl font-amiri font-black text-white mb-10">هل أنت مستعد لمقابلة <br /> <span className="gold-text">الخزانة؟</span></h2>
            <p className="text-slate-500 text-xl font-bold mb-12">انضم إلى آلاف القراء المتميزين وابدأ بناء أرشيفك الخاص اليوم.</p>
            <button 
                onClick={() => navigate('/register')}
                className="gold-button px-12 py-6 rounded-[2rem] text-2xl font-black shadow-[0_30px_60px_rgba(212,175,55,0.3)]"
            >
               سجل عضويتك الآن 🏛️
            </button>
         </div>
      </section>

      <Footer />
    </div>
  );
}
