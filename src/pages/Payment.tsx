import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const methods = [
  {
    name: 'PayPal',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
    desc: 'الطريقة المعتمدة الرئيسية. آمنة ومشفرة بالكامل. تقبل بطاقات VISA، Mastercard، وحسابات PayPal مباشرة.',
    badge: 'الأكثر شيوعاً',
    badgeColor: 'from-blue-600 to-indigo-500',
  },
  {
    name: 'بطاقة VISA / Mastercard',
    icon: null,
    iconText: '💳',
    desc: 'عبر بوابة PayPal يمكنك الدفع مباشرة ببطاقتك دون الحاجة لإنشاء حساب PayPal.',
    badge: 'متاح',
    badgeColor: 'from-emerald-600 to-teal-500',
  },
  {
    name: 'كتب مجانية',
    icon: null,
    iconText: '📖',
    desc: 'جميع كتب Project Gutenberg وInternet Archive متاحة مجاناً دون الحاجة لأي وسيلة دفع.',
    badge: 'مجاني',
    badgeColor: 'from-gold-600 to-gold-400',
  },
];

const Payment = () => (
  <div className="min-h-screen bg-surface text-slate-100 font-jakarta rtl" dir="rtl">
    <Navbar />
    <main className="container mx-auto px-6 pt-40 pb-24 max-w-4xl">
      <div className="text-center mb-20">
        <span className="material-icons text-6xl text-gold-500 mb-6 block">credit_card</span>
        <h1 className="text-6xl font-amiri font-black gold-text mb-4">طرق الدفع</h1>
        <p className="text-slate-400 text-xl">وسائل الدفع المقبولة على منصة كتبي الملكية</p>
      </div>

      <div className="space-y-8 mb-16">
        {methods.map((m, i) => (
          <div key={i} className="bg-surface-container-low border border-gold-900/20 rounded-3xl p-10 flex flex-row-reverse items-start gap-8">
            <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center flex-shrink-0 border border-gold-900/10">
              {m.icon
                ? <img src={m.icon} alt={m.name} className="w-10 h-auto" />
                : <span className="text-3xl">{m.iconText}</span>
              }
            </div>
            <div className="flex-1 text-right">
              <div className="flex flex-row-reverse items-center gap-3 mb-3">
                <h2 className="text-2xl font-amiri font-black text-white">{m.name}</h2>
                <span className={`px-4 py-1 bg-gradient-to-r ${m.badgeColor} rounded-full text-xs font-black text-white`}>{m.badge}</span>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Security Section */}
      <div className="bg-gradient-to-br from-gold-900/10 to-surface-container-low border border-gold-900/20 rounded-3xl p-10">
        <div className="flex flex-row-reverse items-center gap-4 mb-8">
          <span className="material-icons text-4xl text-gold-500">shield</span>
          <h2 className="text-3xl font-amiri font-black gold-text">أمان المدفوعات</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: 'lock', label: 'تشفير SSL', desc: 'جميع البيانات مشفرة أثناء النقل' },
            { icon: 'verified_user', label: 'PayPal معتمد', desc: 'لا نحتفظ بأي بيانات بطاقتك' },
            { icon: 'support_agent', label: 'دعم 24/7', desc: 'فريقنا جاهز لمساعدتك' },
          ].map(item => (
            <div key={item.label} className="bg-surface-container-lowest rounded-2xl p-6 text-center border border-gold-900/10">
              <span className="material-icons text-gold-500 text-3xl mb-3 block">{item.icon}</span>
              <p className="font-black text-white mb-1">{item.label}</p>
              <p className="text-slate-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Payment;
