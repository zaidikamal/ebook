import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      await sendPasswordResetEmail(auth, email);
      setStatus('success');
    } catch (error: any) {
      console.error('Reset error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'حدث خطأ أثناء إرسال رابط إعادة التعيين.');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl -ml-48 -mb-48" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-gradient-to-tr from-gold-600 to-gold-400 rounded-2xl flex items-center justify-center shadow-xl shadow-gold-500/20"
          >
            <Mail className="text-surface w-10 h-10" />
          </motion.div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black text-white px-4 leading-tight">
          استعادة الوصول للمكتبة الملكية
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400 font-sans">
          أدخل بريدك الإلكتروني وسنرسل لك رابط استعادة كلمة المرور
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-3xl border border-white/10"
        >
          {status === 'success' ? (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                  <CheckCircle className="text-green-500 w-8 h-8" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">تم الإرسال بنجاح!</h3>
                <p className="text-gray-400 text-sm">
                  تفقد صندوق الوارد في بريدك الإلكتروني <b>{email}</b> واتبع التعليمات.
                </p>
              </div>
              <Link 
                to="/login"
                className="inline-flex items-center text-gold-500 hover:text-gold-400 transition-colors font-bold"
              >
                العودة لتسجيل الدخول
                <ArrowRight className="mr-2 w-4 h-4 rotate-180" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-300 mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pr-12 pl-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all font-sans"
                    placeholder="example@library.com"
                  />
                </div>
              </div>

              {status === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3 space-x-reverse"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{errorMessage}</p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl text-lg font-black text-surface bg-gradient-to-tr from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-gold-500/20"
              >
                {status === 'loading' ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
              </button>

              <div className="text-center">
                <Link 
                  to="/login"
                  className="text-sm font-bold text-gray-400 hover:text-gold-500 transition-colors"
                >
                  تذكرت كلمة المرور؟ العودة للدخول
                </Link>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
