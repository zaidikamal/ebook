import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const terms = [
  { title: 'القبول بالشروط', icon: 'gavel', body: 'باستخدامك لمنصة كتبي فإنك توافق على هذه الشروط. إذا كنت لا توافق على أي جزء منها، يرجى التوقف عن استخدام المنصة.' },
  { title: 'صلاحية الاستخدام', icon: 'person_check', body: 'يجب أن يكون عمرك 13 عاماً على الأقل لاستخدام المنصة. أنت مسؤول عن الحفاظ على سرية بيانات حسابك.' },
  { title: 'الحقوق الفكرية', icon: 'copyright', body: 'جميع الكتب المدفوعة على المنصة محمية بحقوق الملكية الفكرية. لا يجوز توزيعها أو نسخها أو بيعها. الكتب المجانية من نطاق الملكية العامة تخضع لتراخيصها الأصلية.' },
  { title: 'قواعد الاستخدام', icon: 'rule', body: 'يُحظر استخدام المنصة لأغراض غير قانونية، أو نشر محتوى مسيء، أو محاولة اختراق أنظمة المنصة. نحتفظ بالحق في إيقاف أي حساب يخالف هذه القواعد.' },
  { title: 'المبيعات والمدفوعات', icon: 'payments', body: 'جميع المبيعات نهائية بعد تحميل الكتاب. يُعالَج الدفع عبر PayPal ويخضع لشروطهم. الأسعار قابلة للتغيير دون إشعار مسبق.' },
  { title: 'إخلاء المسؤولية', icon: 'report_problem', body: 'نسعى لتوفير خدمة موثوقة، لكننا لا نضمن الوصول المستمر دون انقطاع. لا نتحمل المسؤولية عن أي خسائر ناتجة عن توقف الخدمة.' },
  { title: 'تعديل الشروط', icon: 'edit_document', body: 'نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعارك عبر البريد الإلكتروني المسجّل عند إجراء تغييرات جوهرية.' },
];

const Terms = () => (
  <div className="min-h-screen bg-surface text-slate-100 font-jakarta rtl" dir="rtl">
    <Navbar />
    <main className="container mx-auto px-6 pt-40 pb-24 max-w-4xl">
      <div className="text-center mb-20">
        <span className="material-icons text-6xl text-gold-500 mb-6 block">gavel</span>
        <h1 className="text-6xl font-amiri font-black gold-text mb-4">شروط الاستخدام</h1>
        <p className="text-slate-400 text-xl">يرجى قراءة هذه الشروط بعناية قبل استخدام المنصة</p>
        <p className="text-slate-600 text-sm mt-4">آخر تحديث: مارس 2026</p>
      </div>
      <div className="space-y-6">
        {terms.map((t, i) => (
          <div key={i} className="bg-surface-container-low border border-gold-900/20 rounded-3xl p-10">
            <div className="flex flex-row-reverse items-center gap-4 mb-5">
              <div className="w-12 h-12 bg-gold-500/10 rounded-2xl flex items-center justify-center">
                <span className="material-icons text-gold-500">{t.icon}</span>
              </div>
              <h2 className="text-2xl font-amiri font-black text-white">{t.title}</h2>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed text-right">{t.body}</p>
          </div>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default Terms;
