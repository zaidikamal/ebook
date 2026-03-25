import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useToast } from '../components/Toast';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast('كلمتا المرور غير متطابقتين!', 'error');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName: formData.name });

      // Save to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        role: formData.email === 'admin@kutubi.com' ? 'admin' : 'user',
        createdAt: new Date().toISOString()
      });

      showToast('تم إنشاء الحساب الملكي بنجاح! مرحباً بك في عالم كتبي. 👑', 'success');
      navigate('/login');
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'حدث خطأ أثناء إنشاء الحساب الموقر.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-surface text-slate-100 font-jakarta overflow-hidden relative" dir="rtl">
      <Navbar />
      
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-600/10 rounded-full blur-[120px]"></div>
      </div>

      <main className="container mx-auto px-6 pt-32 pb-24 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-5xl flex flex-col md:flex-row-reverse bg-surface-container-low rounded-[4rem] border border-gold-900/20 shadow-2xl overflow-hidden glass-effect relative z-10">
          
          {/* Visual Side */}
          <div className="md:w-1/2 bg-gradient-to-br from-gold-900/40 to-surface p-12 md:p-20 flex flex-col justify-center text-right relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 C 20 0 50 0 100 100" stroke="currentColor" fill="transparent" strokeWidth="0.1" className="text-gold-500" />
              </svg>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-amiri font-black mb-8 leading-tight gold-text">انضم إلى كنوز المعرفة</h2>
            <p className="text-slate-400 text-xl leading-loose font-medium mb-10">
              ابدأ رحلتك في عالم القراءة الفاخرة واكتشف حصريات الكتب الملكية التي تلهم العقول وتثري الوجدان.
            </p>
            <div className="space-y-6">
              <div className="flex items-center justify-end gap-4 text-gold-400">
                <span className="font-black">وصول حصري لأقدم المخطوطات</span>
                <AutoAwesomeIcon />
              </div>
              <div className="flex items-center justify-end gap-4 text-gold-400">
                <span className="font-black">تجربة قراءة سينمائية فريدة</span>
                <MenuBookIcon />
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="md:w-1/2 p-12 md:p-20 bg-surface-container-lowest/50">
            <div className="max-w-md mx-auto">
              <div className="text-center md:text-right mb-12">
                <h1 className="text-4xl font-amiri font-black mb-4 gold-text">حساب جديد</h1>
                <p className="text-slate-500 font-bold">يرجى إدخال بياناتك الموقرة للانضمام</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="block text-slate-500 text-xs font-black uppercase tracking-widest text-right">الاسم الكامل</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      placeholder="أدخل اسمك الكريم"
                      className="w-full bg-surface-container-lowest border border-gold-900/10 rounded-2xl py-5 px-12 focus:outline-none focus:border-gold-500 transition-all text-right text-lg"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <PersonIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-900/60" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-slate-500 text-xs font-black uppercase tracking-widest text-right">البريد الإلكتروني</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      required
                      placeholder="email@royal.com"
                      className="w-full bg-surface-container-lowest border border-gold-900/10 rounded-2xl py-5 px-12 focus:outline-none focus:border-gold-500 transition-all text-right text-lg"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <EmailIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-900/60" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-slate-500 text-xs font-black uppercase tracking-widest text-right">كلمة المرور</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      className="w-full bg-surface-container-lowest border border-gold-900/10 rounded-2xl py-5 px-12 focus:outline-none focus:border-gold-500 transition-all text-right text-lg tracking-[0.3em]"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <LockIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-900/60" />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full gold-button py-6 rounded-3xl font-black text-2xl transform hover:scale-[1.02] active:scale-95 transition-all shadow-2xl"
                >
                  إنشاء الحساب الموقر
                </button>
              </form>

              <div className="mt-12 text-center text-slate-600 font-bold">
                لديك حساب بالفعل؟{' '}
                <Link to="/login" className="text-gold-400 hover:text-gold-300 transition-colors underline-offset-8 underline">
                  تسجيل الدخول
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;
