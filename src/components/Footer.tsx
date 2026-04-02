import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SendIcon from '@mui/icons-material/Send';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    try {
      await addDoc(collection(db, 'newsletter_subscriptions'), {
        email: email.trim().toLowerCase(),
        subscribedAt: new Date().toISOString()
      });
      
      setStatus('success');
      setEmail('');
      
      // Reset back to idle after a few seconds
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } catch (error) {
      console.error("Error subscribing:", error);
      setStatus('idle');
    }
  };

  return (
    <footer className="relative overflow-hidden border-t" dir="rtl"
      style={{
        background: 'linear-gradient(180deg, rgba(10,9,14,0) 0%, rgba(8,7,12,1) 8%)',
        borderColor: 'rgba(212,175,55,0.08)',
        paddingTop: '5rem',
        paddingBottom: '3rem',
      }}
    >
      {/* ── Ambient Glows ── */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.04) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.03) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />

      {/* ── Ornament Top Line ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)' }}
      />

      <div className="container mx-auto px-6 relative z-10">

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-16">

          {/* Brand Column */}
          <div className="space-y-6 lg:col-span-1">
            <div className="flex items-center gap-3 w-fit" dir="ltr">
              <div className="relative w-11 h-11">
                <div className="absolute inset-0 rounded-xl bg-gold-500/20 blur-md animate-glow-pulse" />
                <div className="relative w-full h-full bg-gradient-to-tr from-gold-700 via-gold-500 to-gold-300 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/30 transform -rotate-6">
                  <MenuBookIcon className="text-slate-950 text-xl font-black" />
                </div>
              </div>
              <h2 className="text-4xl font-amiri italic tracking-wide font-black gold-text">Koutoubi</h2>
            </div>

            <p className="text-slate-500 leading-loose text-sm font-medium">
              المنصة الأرقى في العالم العربي لتبادل واقتناء المجلدات الملكية والمخطوطات النادرة برؤية عصرية تليق بالصفوة.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(24,119,242,0.4)]"
                style={{ background: 'rgba(24,119,242,0.1)', border: '1px solid rgba(24,119,242,0.2)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
              </a>

              {/* X */}
              <a href="https://x.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <svg width="16" height="16" viewBox="0 0 300 300" fill="white">
                  <path d="M178.57 127.15L290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59H300zm-36.3 41.23l-11.87-16.57L36.16 19.36h40.61l76.18 106.47 11.87 16.57 99.05 138.32h-40.61z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(214,37,159,0.4)]"
                style={{ background: 'rgba(214,37,159,0.08)', border: '1px solid rgba(214,37,159,0.2)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <defs>
                    <radialGradient id="ig2" cx="30%" cy="107%" r="150%">
                      <stop offset="0%" stopColor="#fdf497"/>
                      <stop offset="45%" stopColor="#fd5949"/>
                      <stop offset="60%" stopColor="#d6249f"/>
                      <stop offset="90%" stopColor="#285AEB"/>
                    </radialGradient>
                  </defs>
                  <path fill="url(#ig2)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="font-amiri font-black text-white mb-7 text-xl relative inline-block">
              الروابط الملكية
              <span className="absolute -bottom-2 right-0 w-10 h-[2px] rounded-full"
                style={{ background: 'linear-gradient(90deg, #d4af37, transparent)' }} />
            </h3>
            <ul className="space-y-3.5">
              {[
                { to: '/search', label: 'تصفح المجموعات' },
                { to: '/about', label: 'عن كتبي' },
                { to: '/search?filter=rare', label: 'المخطوطات النادرة' },
                { to: '/membership', label: 'عضويات الصفوة' },
              ].map(item => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="flex items-center gap-2 text-slate-500 hover:text-gold-400 transition-colors duration-300 text-sm font-bold group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-900/60 group-hover:bg-gold-500 transition-colors flex-shrink-0" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="font-amiri font-black text-white mb-7 text-xl relative inline-block">
              مركز الدعم
              <span className="absolute -bottom-2 right-0 w-10 h-[2px] rounded-full"
                style={{ background: 'linear-gradient(90deg, #d4af37, transparent)' }} />
            </h3>
            <ul className="space-y-3.5">
              {[
                { to: '/faq', label: 'الأسئلة الشائعة' },
                { to: '/privacy', label: 'الخصوصية والعهود' },
                { to: '/terms', label: 'شروط الاستخدام' },
                { to: '/contact', label: 'اتصل بنا' },
              ].map(item => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="flex items-center gap-2 text-slate-500 hover:text-gold-400 transition-colors duration-300 text-sm font-bold group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-900/60 group-hover:bg-gold-500 transition-colors flex-shrink-0" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="font-amiri font-black text-white mb-7 text-xl relative inline-block">
              النشرة الملكية
              <span className="absolute -bottom-2 right-0 w-10 h-[2px] rounded-full"
                style={{ background: 'linear-gradient(90deg, #d4af37, transparent)' }} />
            </h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              اشترك لتصلك دعوات خاصة لمزادات الكتب النادرة وآخر الإصدارات.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="بريدك الإلكتروني..."
                  className="royal-input flex-1 min-w-0 text-sm py-3"
                  required
                  disabled={status !== 'idle'}
                />
                <motion.button
                  type="submit"
                  whileTap={status === 'idle' ? { scale: 0.92 } : {}}
                  disabled={status !== 'idle'}
                  aria-label="اشتراك"
                  className="gold-button !px-4 !py-0 h-12 flex items-center justify-center rounded-xl flex-shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  ) : status === 'success' ? (
                    <CheckCircleIcon className="text-base" />
                  ) : (
                    <SendIcon className="text-base" />
                  )}
                </motion.button>
              </div>
              <AnimatePresence>
                {status === 'success' && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-emerald-400 text-xs font-bold px-2"
                  >
                    تم الاشتراك بنجاح! شكراً لك.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-8 flex flex-col md:flex-row-reverse justify-between items-center gap-6"
          style={{ borderTop: '1px solid rgba(212,175,55,0.07)' }}
        >
          <p className="text-slate-700 text-xs font-black tracking-[0.15em] uppercase text-center md:text-right">
            © 2026 منصة كتبي الملكية — نعتني بذاكرة الأمة
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold">الخدمة تعمل بشكل ممتاز</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
