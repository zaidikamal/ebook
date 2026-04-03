import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { supabase } from '../lib/supabase';

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Check if the user has already seen the popup or subscribed
    const hasSeenPopup = localStorage.getItem('kutubi_newsletter_seen');
    const isSubscribed = localStorage.getItem('kutubi_newsletter_subscribed');

    if (!hasSeenPopup && !isSubscribed) {
      // Show popup after 5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('kutubi_newsletter_seen', 'true');
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      if (!supabase) throw new Error("Supabase is not configured");

      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ 
          email: email.trim().toLowerCase(), 
          subscribed_at: new Date().toISOString(),
          source: 'popup'
        }]);

      if (error) {
        if (error.code === '23505') { // Unique violation
          throw new Error('هذا البريد الإلكتروني مسجل مسبقاً.');
        }
        throw error;
      }

      setStatus('success');
      localStorage.setItem('kutubi_newsletter_subscribed', 'true');
      
      // Close popup automatically after success
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);

    } catch (error: any) {
      console.error("Error subscribing:", error);
      setErrorMessage(error.message || 'حدث خطأ. يرجى المحاولة لاحقاً.');
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" dir="rtl">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Popup Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl"
            style={{
              background: 'linear-gradient(145deg, rgba(15,13,22,1) 0%, rgba(10,8,15,1) 100%)',
              border: '1px solid rgba(212,175,55,0.2)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.1) inset'
            }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 left-4 z-10 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <CloseIcon fontSize="small" />
            </button>

            {/* Glowing Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="p-8 sm:p-10 text-center relative z-10">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-6"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-6 relative">
                    <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
                    <CheckCircleOutlineIcon className="text-emerald-400" style={{ fontSize: 40 }} />
                  </div>
                  <h3 className="text-3xl font-amiri font-black text-white mb-2">أهلاً بك في الخزانة الملكية</h3>
                  <p className="text-slate-400">تم تسجيل بريدك بنجاح. ترقب الرسائل المتميزة قريباً.</p>
                </motion.div>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6"
                    style={{
                      background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(234,88,12,0.1))',
                      border: '1px solid rgba(212,175,55,0.25)',
                      boxShadow: '0 0 30px rgba(212,175,55,0.15)'
                    }}>
                    <MailOutlineIcon className="text-gold-400" fontSize="large" />
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-amiri font-black text-white mb-4">
                    انضم إلى <span className="gold-text">دعوات الصفوة</span>
                  </h3>
                  
                  <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    اشترك الآن للحصول على دعوات حصرية، نوادر المخطوطات، وتحديثات الخزانة الملكية قبل الجميع.
                  </p>

                  <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="أدخل بريدك الإلكتروني الأنيق..."
                        disabled={status === 'loading'}
                        required
                        className="w-full bg-slate-900/50 border border-gold-500/20 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-gold-500/50 transition-colors placeholder:text-slate-600"
                        style={{
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                        }}
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="gold-button w-full py-4 text-base font-black relative overflow-hidden group"
                    >
                      {status === 'loading' ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                          جاري التسجيل...
                        </span>
                      ) : (
                        <span className="relative z-10">الاشتراك في النشرة الملكية ✦</span>
                      )}
                    </button>
                    
                    {status === 'error' && errorMessage && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-xs mt-1"
                      >
                        {errorMessage}
                      </motion.p>
                    )}
                  </form>
                  
                  <p className="text-slate-600 text-[10px] mt-6">
                    لن نرسل لك أي رسائل مزعجة، وعد ملكي.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NewsletterPopup;
