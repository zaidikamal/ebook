import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-surface-container-low border-t border-gold-900/10 py-24 relative overflow-hidden rtl" dir="rtl">
      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-1 space-y-6">
            <h2 className="text-4xl font-amiri font-black gold-text mb-6">كتبي</h2>
            <p className="text-gold-500/60 leading-relaxed font-bold text-lg md:text-xl">
              منصتك الرقمية الأولى لاستكشاف واقتناء أحدث المجلدات الملكية. نحن هنا لنصنع من القراءة تجربة تفوق الخيال.
            </p>
          </div>
          
          <div>
            <h3 className="font-amiri font-black text-white mb-8 text-xl border-b border-gold-900/10 pb-2 inline-block">روابط سريعة</h3>
            <ul className="space-y-5 text-gold-500/50 font-bold text-lg">
              <li><Link to="/" className="hover:text-gold-400 transition-all hover:translate-x-[-8px] inline-block">عن المنصة</Link></li>
              <li><Link to="/search" className="hover:text-gold-400 transition-all hover:translate-x-[-8px] inline-block">قائمة الكتب</Link></li>
              <li><Link to="/search?sort=bestseller" className="hover:text-gold-400 transition-all hover:translate-x-[-8px] inline-block">الأكثر مبيعاً</Link></li>
              <li><Link to="/affiliate" className="hover:text-gold-400 transition-all hover:translate-x-[-8px] inline-block">برنامج الإحالة</Link></li>
              <li><Link to="/subscriptions" className="hover:text-gold-400 transition-all hover:translate-x-[-8px] inline-block">العضويات</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-amiri font-black text-white mb-8 text-xl border-b border-gold-900/10 pb-2 inline-block">الدعم الفني</h3>
            <ul className="space-y-5 text-gold-500/50 font-bold text-lg">
              <li><Link to="/faq" className="hover:text-gold-400 transition-all hover:translate-x-[-8px] inline-block">الأسئلة الشائعة</Link></li>
              <li><Link to="/privacy" className="hover:text-gold-400 transition-all hover:translate-x-[-8px] inline-block">سياسة الخصوصية</Link></li>
              <li><Link to="/terms" className="hover:text-gold-400 transition-all hover:translate-x-[-8px] inline-block">شروط الاستخدام</Link></li>
              <li><Link to="/payment" className="hover:text-gold-400 transition-all hover:translate-x-[-8px] inline-block">طرق الدفع</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="font-amiri font-black text-white mb-8 text-xl border-b border-gold-900/10 pb-2 inline-block">النشرة الملكية</h3>
            <p className="text-gold-500/60 font-bold text-lg mb-6">اشترك ليصلك جديد المجلدات والعروض الخاصة بالصفوة.</p>
            <div className="flex flex-row-reverse gap-3">
              <input 
                type="email" 
                placeholder="بريدك الإلكتروني الموقر" 
                className="bg-surface border border-gold-900/20 rounded-2xl px-6 py-4 flex-1 focus:border-gold-500 transition-all outline-none text-right font-bold text-white placeholder:text-gold-900/40 shadow-inner" 
              />
              <button className="gold-button w-14 h-14 rounded-2xl flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all shadow-xl">
                <span className="material-icons text-2xl">send</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row-reverse justify-between items-center pt-8 border-t border-gold-900/10 gap-8">
          <p className="text-gold-900/60 text-sm font-black tracking-widest uppercase">© 2026 منصة كتبي الرقمية. صُنعت بعناية للمثقفين.</p>
          <div className="flex gap-8 items-center">
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:scale-125 transform transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
            </a>
            {/* X (Twitter) */}
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:scale-125 transform transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 300 300" fill="white">
                <path d="M178.57 127.15L290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59H300zm-36.3 41.23l-11.87-16.57L36.16 19.36h40.61l76.18 106.47 11.87 16.57 99.05 138.32h-40.61z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:scale-125 transform transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <defs>
                  <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
                    <stop offset="0%" stopColor="#fdf497"/>
                    <stop offset="5%" stopColor="#fdf497"/>
                    <stop offset="45%" stopColor="#fd5949"/>
                    <stop offset="60%" stopColor="#d6249f"/>
                    <stop offset="90%" stopColor="#285AEB"/>
                  </radialGradient>
                </defs>
                <path fill="url(#ig-grad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
