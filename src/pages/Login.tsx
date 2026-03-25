import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', await user.getIdToken());
        setLoading(false);
        navigate('/admin'); // Redirect admins directly
      } else {
        // Fallback for missing Firestore doc
        const fallbackUser = {
          uid: user.uid,
          email: user.email,
          role: user.email === 'admin@kutubi.com' ? 'admin' : 'user',
          name: user.displayName || 'مستخدم موقر'
        };
        localStorage.setItem('user', JSON.stringify(fallbackUser));
        localStorage.setItem('token', await user.getIdToken());
        setLoading(false);
        navigate(fallbackUser.role === 'admin' ? '/admin' : '/profile');
      }
    } catch (err: any) {
      console.error('Login error:', err.code, err.message);
      setLoading(false);
      
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('خطأ في البريد الإلكتروني أو كلمة المرور الموقرة. إذا لم تكن قد سجلت بعد، يرجى إنشاء حساب جديد.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('تم حظر المحاولات مؤقتاً بسبب كثرة الطلبات. حاول مجدداً لاحقاً.');
      } else {
        setError('حدث خطأ غير متوقع في البوابة الملكية. حاول مرة أخرى.');
      }
    }
  };

  return (
    <div className="bg-surface min-h-screen text-slate-100 font-jakarta pt-40 pb-24 rtl" dir="rtl">
      <Navbar />
      
      <main className="container mx-auto px-6 flex justify-center">
        <div className="w-full max-w-lg bg-surface-container-low border border-gold-900/20 rounded-[4rem] p-16 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold-600/10 rounded-full blur-[100px] group-hover:bg-gold-600/20 transition-all duration-700"></div>
          
          <div className="text-center mb-12 relative z-10">
            <h1 className="text-5xl font-amiri font-black mb-4 gold-text">مرحباً بك في رحابنا</h1>
            <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">سجل دخولك للمكتبة الملكية</p>
          </div>

          {error && (
            <div className="bg-red-950/20 border border-gold-600/30 text-gold-400 p-6 rounded-2xl text-sm mb-10 flex items-center gap-4 animate-shake shadow-lg">
              <ErrorOutlineIcon className="text-2xl text-gold-500" />
              <div className="flex-1">
                <p className="font-amiri font-black text-lg leading-tight mb-1">تنبيه ملكي</p>
                <p className="font-bold opacity-80">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-3 text-right">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">البريد الإلكتروني الموقر</label>
              <div className="relative">
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="name@royal.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-surface-container-lowest border border-gold-900/10 rounded-2xl py-5 px-8 pr-16 focus:outline-none focus:border-gold-500 transition-all text-lg shadow-inner"
                />
                <EmailIcon className="absolute right-6 top-1/2 -translate-y-1/2 text-gold-900/60" />
              </div>
            </div>

            <div className="space-y-3 text-right">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">كلمة المرور السرية</label>
              <div className="relative">
                <input 
                  type="password" 
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-surface-container-lowest border border-gold-900/10 rounded-2xl py-5 px-8 pr-16 focus:outline-none focus:border-gold-500 transition-all text-lg shadow-inner tracking-[0.2em]"
                />
                <LockIcon className="absolute right-6 top-1/2 -translate-y-1/2 text-gold-900/60" />
              </div>
              <div className="text-left pt-2">
                <Link to="/forgot-password" title="نسيت كلمة المرور؟" className="text-xs text-gold-500/60 hover:text-gold-400 font-bold transition-colors">نسيت كلمة المرور؟</Link>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full gold-button py-6 rounded-[2rem] text-2xl font-black transition-all shadow-xl shadow-gold-600/20 flex items-center justify-center gap-4 transform hover:scale-[1.02] active:scale-95"
            >
              {loading ? (
                <div className="h-6 w-6 border-3 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
              ) : 'دخول ملكي آمن'}
            </button>
          </form>
          
          <div className="mt-10 p-4 bg-gold-900/5 rounded-2xl border border-gold-900/10 text-center">
            <p className="text-xs text-gold-600 font-black uppercase tracking-tighter mb-1">بيانات الدخول الإدارية</p>
            <p className="text-sm text-slate-400 font-sans">admin@kutubi.com / *كلمة المرور الخاصة بك*</p>
          </div>

          <div className="mt-12 text-center relative z-10">
            <p className="text-slate-500 font-bold mb-3">ليس لديك حساب موقر؟</p>
            <Link to="/register" className="text-gold-400 font-black hover:text-gold-300 transition-colors text-lg border-b-2 border-gold-400/20 hover:border-gold-400 pb-1">إنشاء حساب جديد الآن</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
