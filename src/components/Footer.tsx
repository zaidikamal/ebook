import { Link } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-gold-500/10 py-32 relative overflow-hidden" dir="rtl">
      {/* Cinematic Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-600/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gold-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
          <div className="space-y-8">
            <h2 className="text-5xl font-amiri font-black gold-text">كتبي</h2>
            <p className="text-on-surface-variant leading-relaxed text-lg font-medium opacity-80">
              المنصة الأرقى في العالم العربي لتبادل واقتناء المجلدات والمخطوطات النادرة برؤية عصرية تليق بالصفوة.
            </p>
          </div>
          
          <div>
            <h3 className="font-amiri font-black text-white mb-10 text-2xl relative inline-block">
              الروابط الملكية
              <span className="absolute -bottom-2 right-0 w-12 h-1 bg-gradient-to-l from-gold-500 to-transparent rounded-full"></span>
            </h3>
            <ul className="space-y-4 text-on-surface-variant/70 font-bold">
              <li><Link to="/search" className="hover:text-gold-400 transition-colors">تصفح المجموعات</Link></li>
              <li><Link to="/about" className="hover:text-gold-400 transition-colors">عن كتبي</Link></li>
              <li><Link to="/search?filter=rare" className="hover:text-gold-400 transition-colors">المخطوطات النادرة</Link></li>
              <li><Link to="/membership" className="hover:text-gold-400 transition-colors">عضويات الصفوة</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-amiri font-black text-white mb-10 text-2xl relative inline-block">
              مركز الدعم
              <span className="absolute -bottom-2 right-0 w-12 h-1 bg-gradient-to-l from-gold-500 to-transparent rounded-full"></span>
            </h3>
            <ul className="space-y-4 text-on-surface-variant/70 font-bold">
              <li><Link to="/faq" className="hover:text-gold-400 transition-colors">الأسئلة الشائعة</Link></li>
              <li><Link to="/privacy" className="hover:text-gold-400 transition-colors">الخصوصية والعهود</Link></li>
              <li><Link to="/terms" className="hover:text-gold-400 transition-colors">شروط الاستخدام</Link></li>
              <li><Link to="/contact" className="hover:text-gold-400 transition-colors">اتصل بنا</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h3 className="font-amiri font-black text-white mb-10 text-2xl relative inline-block">
              النشرة الملكية
              <span className="absolute -bottom-2 right-0 w-12 h-1 bg-gradient-to-l from-gold-500 to-transparent rounded-full"></span>
            </h3>
            <p className="text-on-surface-variant/70 font-medium">اشترك لتصلك دعوات خاصة لمزادات الكتب النادرة.</p>
            <div className="flex gap-3">
              <input 
                type="email" 
                placeholder="بريدك الموقر..." 
                className="royal-input flex-1 min-w-0" 
              />
              <button aria-label="اشتراك" className="gold-button !px-6 !py-0 flex items-center justify-center">
                <SendIcon className="text-xl" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row-reverse justify-between items-center pt-10 border-t border-gold-500/10 gap-10">
          <p className="text-on-surface-variant/40 text-xs font-black tracking-[0.2em] uppercase">© 2026 منصة كتبي الرقمية. نعتني بذاكرة الأمة.</p>
          <div className="flex gap-8 items-center">
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="فيسبوك" className="hover:scale-125 transform transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
            </a>
            {/* X (Twitter) */}
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="تويتر / إكس" className="hover:scale-125 transform transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 300 300" fill="white">
                <path d="M178.57 127.15L290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59H300zm-36.3 41.23l-11.87-16.57L36.16 19.36h40.61l76.18 106.47 11.87 16.57 99.05 138.32h-40.61z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="انستغرام" className="hover:scale-125 transform transition-all duration-200">
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
