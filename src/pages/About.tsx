import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const About = () => {
  return (
    <>
      <Helmet>
        <title>من نحن | منصة كتبي الملكية</title>
        <meta name="description" content="تعرف على منصة كتبي الملكية، وجهتك الأولى لاستكشاف أندر وأثمن المجلدات والكتب الإلكترونية في العالم العربي." />
      </Helmet>
      <div className="bg-surface min-h-screen text-slate-100 font-jakarta rtl" dir="rtl">
        <Navbar />
        <main className="container mx-auto px-6 pt-40 pb-24 max-w-4xl text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
              <div className="w-24 h-24 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-gold-500/30">
                 <AutoStoriesIcon className="text-gold-500 text-5xl" />
              </div>
              <h1 className="text-5xl font-amiri font-black gold-text mb-6">من نحن</h1>
              <p className="text-xl text-slate-400 font-bold leading-relaxed mb-8">
                 منصة "كتبي" الملكية هي وجهتك الأولى لاستكشاف أندر وأثمن المجلدات والكتب الإلكترونية. تأسست برؤية تهدف إلى إعادة إحياء التراث الإنساني وتسهيل الوصول للمعرفة الراقية في قالب إلكتروني فاخر.
              </p>
              <p className="text-xl text-slate-400 font-bold leading-relaxed">
                 نحن نؤمن بأن كل كتاب هو قصر يعج بالأسرار، ولذلك صممنا هذه المنصة لتكون رحلة ملكية تليق بعشاق القراءة وتوفر تجربة غامرة تدمج عبق الماضي مع تكنولوجيا الحاضر.
              </p>
            </motion.div>
        </main>
        <Footer />
      </div>
    </>
  );
};
export default About;
