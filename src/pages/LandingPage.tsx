import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MenuBook, 
  Star, 
  ArrowForward, 
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

      {/* CTA Section was here */}

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
