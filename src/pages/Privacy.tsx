import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const sections = [
  {
    title: 'جمع البيانات',
    icon: 'data_usage',
    body: 'نجمع المعلومات التي تقدمها عند التسجيل مثل الاسم والبريد الإلكتروني، إضافةً إلى بيانات الاستخدام كالكتب التي اطلعت عليها أو اشتريتها. لا نجمع أي بيانات حساسة دون موافقتك الصريحة.',
  },
  {
    title: 'استخدام البيانات',
    icon: 'manage_accounts',
    body: 'نستخدم بياناتك لتقديم وتحسين خدماتنا، ومعالجة المدفوعات، وإرسال إشعارات مرتبطة بطلباتك، وتخصيص توصيات الكتب بناءً على اهتماماتك.',
  },
  {
    title: 'مشاركة البيانات',
    icon: 'share',
    body: 'لا نبيع بياناتك الشخصية لأي طرف ثالث. قد نشارك معلومات محدودة مع مزودي الخدمات الضروريين كـ PayPal لمعالجة المدفوعات، وذلك وفق سياساتهم الخاصة.',
  },
  {
    title: 'حماية البيانات',
    icon: 'security',
    body: 'نستخدم بروتوكولات تشفير SSL لحماية جميع الاتصالات. يتم تخزين البيانات على خوادم Supabase المؤمنّة والمشفرة في أوروبا.',
  },
  {
    title: 'حقوقك',
    icon: 'verified_user',
    body: 'يحق لك في أي وقت: طلب نسخة من بياناتك، تعديل معلوماتك، حذف حسابك بالكامل، أو الاعتراض على معالجة بياناتك. تواصل معنا عبر صفحة التواصل لأي من هذه الطلبات.',
  },
  {
    title: 'ملفات الارتباط (Cookies)',
    icon: 'cookie',
    body: 'نستخدم ملفات ارتباط ضرورية لتشغيل المنصة (كجلسات تسجيل الدخول)، وملفات تحليلية لفهم كيفية استخدام المنصة. يمكنك تعطيل ملفات الارتباط من إعدادات متصفحك.',
  },
];

const Privacy = () => (
  <div className="min-h-screen bg-surface text-slate-100 font-jakarta rtl" dir="rtl">
    <Navbar />
    <main className="container mx-auto px-6 pt-40 pb-24 max-w-4xl">
      <div className="text-center mb-20">
        <span className="material-icons text-6xl text-gold-500 mb-6 block">privacy_tip</span>
        <h1 className="text-6xl font-amiri font-black gold-text mb-4">سياسة الخصوصية</h1>
        <p className="text-slate-400 text-xl">نلتزم بحماية خصوصيتك وبياناتك الشخصية</p>
        <p className="text-slate-600 text-sm mt-4">آخر تحديث: مارس 2026</p>
      </div>
      <div className="space-y-8">
        {sections.map((s, i) => (
          <div key={i} className="bg-surface-container-low border border-gold-900/20 rounded-3xl p-10">
            <div className="flex flex-row-reverse items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gold-500/10 rounded-2xl flex items-center justify-center">
                <span className="material-icons text-gold-500">{s.icon}</span>
              </div>
              <h2 className="text-2xl font-amiri font-black text-white">{s.title}</h2>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed text-right">{s.body}</p>
          </div>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default Privacy;
