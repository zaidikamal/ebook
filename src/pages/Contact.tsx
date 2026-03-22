import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useToast } from '../components/Toast';
import EmailIcon from '@mui/icons-material/Email';

const Contact = () => {
  const { showToast } = useToast();
  return (
    <>
      <Helmet>
        <title>اتصل بنا | منصة كتبي الملكية</title>
        <meta name="description" content="تواصل مع فريق الدعم الفني الملكي لأي استفسار أو مساعدة بشأن منصة كتبي." />
      </Helmet>
      <div className="bg-surface min-h-screen text-slate-100 font-jakarta rtl" dir="rtl">
        <Navbar />
        <main className="container mx-auto px-6 pt-40 pb-24 max-w-2xl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface-container-low border border-gold-900/20 rounded-[3rem] p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold-600/5 rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="flex flex-col items-center text-center mb-10">
                 <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mb-6 border border-gold-500/30">
                    <EmailIcon className="text-gold-500 text-4xl" />
                 </div>
                 <h1 className="text-4xl font-amiri font-black gold-text mb-4">الدعم الفني الملكي</h1>
                 <p className="text-slate-400 font-bold text-lg">نحن هنا لخدمتك والإجابة عن جميع استفساراتك الموقرة.</p>
              </div>

              <form className="flex flex-col gap-6 relative z-10" onSubmit={(e) => { e.preventDefault(); showToast('تم إرسال رسالتك الملكية بنجاح! وسنرد عليها في أقرب وقت.', 'success'); }}>
                 <div>
                    <label className="block text-gold-500 font-black mb-2">اسمك الكريم</label>
                    <input type="text" className="w-full bg-surface border border-gold-900/20 rounded-2xl p-4 text-white focus:border-gold-500 transition-colors outline-none" required />
                 </div>
                 <div>
                    <label className="block text-gold-500 font-black mb-2">البريد الإلكتروني</label>
                    <input type="email" className="w-full bg-surface border border-gold-900/20 rounded-2xl p-4 text-white focus:border-gold-500 transition-colors outline-none" required dir="ltr" />
                 </div>
                 <div>
                    <label className="block text-gold-500 font-black mb-2">رسالتك الموقرة</label>
                    <textarea rows={5} className="w-full bg-surface border border-gold-900/20 rounded-2xl p-4 text-white focus:border-gold-500 transition-colors outline-none" required></textarea>
                 </div>
                 <button type="submit" className="gold-button w-full py-5 rounded-2xl font-black text-xl shadow-xl mt-4 transform hover:scale-[1.02] active:scale-95 transition-all">
                    إرسال البرقية
                 </button>
              </form>
            </motion.div>
        </main>
        <Footer />
      </div>
    </>
  );
};
export default Contact;
