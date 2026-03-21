import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqs = [
  { q: 'كيف أشتري كتاباً؟', a: 'ابحث عن الكتاب، اضغط على "اقتناء النسخة الملكية"، ثم أتمّ الدفع عبر PayPal. يُضاف الكتاب فوراً إلى مكتبتك.' },
  { q: 'هل يمكنني الوصول إلى مكتبتي من أي جهاز؟', a: 'نعم، باستخدام حسابك على المنصة يمكنك الوصول إلى مكتبتك من أي جهاز متصل بالإنترنت.' },
  { q: 'ما صيغ الكتب المتاحة للتحميل؟', a: 'نوفر حالياً صيغة PDF مع حماية رقمية باسم المشتري. نعمل على إضافة ePub قريباً.' },
  { q: 'كيف أسترد أموالي؟', a: 'في حال وجود مشكلة تقنية تمنع الوصول للكتاب، يمكن طلب الاسترداد خلال 7 أيام من الشراء عبر صفحة التواصل.' },
  { q: 'هل الكتب من Project Gutenberg مجانية؟', a: 'نعم، جميع كتب Project Gutenberg وInternet Archive متاحة مجاناً لأنها في نطاق الملكية العامة.' },
  { q: 'كيف أرفع كتابي للبيع على المنصة؟', a: 'سجّل دخولك كمسؤول ثم انتقل إلى لوحة التحكم > إضافة كتاب. سيوجهك النظام عبر خطوات التحقق والرفع.' },
  { q: 'ما نسبة عمولة المنصة؟', a: 'تحتفظ المنصة بـ 30% من قيمة كل مبيعة، والباقي يذهب للمؤلف أو الناشر.' },
  { q: 'هل بيانات دفعي آمنة؟', a: 'نعم، نستخدم PayPal لمعالجة المدفوعات وهو أحد أكثر بوابات الدفع أماناً عالمياً. لا نحتفظ بأي بيانات بطاقة ائتمانية.' },
];

const FAQ = () => (
  <div className="min-h-screen bg-surface text-slate-100 font-jakarta rtl" dir="rtl">
    <Navbar />
    <main className="container mx-auto px-6 pt-40 pb-24 max-w-4xl">
      <div className="text-center mb-20">
        <HelpCenterIcon className="text-6xl text-gold-500 mb-6 block" />
        <h1 className="text-6xl font-amiri font-black gold-text mb-4">الأسئلة الشائعة</h1>
        <p className="text-slate-400 text-xl">إجابات لأكثر الأسئلة التي يطرحها قراؤنا الموقرون</p>
      </div>
      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <details key={i} className="bg-surface-container-low border border-gold-900/20 rounded-3xl p-8 group cursor-pointer">
            <summary className="flex flex-row-reverse items-center justify-between font-black text-xl text-slate-200 list-none gap-4">
              <span className="flex-1 text-right">{faq.q}</span>
              <ExpandMoreIcon className="text-gold-500 group-open:rotate-180 transition-transform" />
            </summary>
            <p className="mt-6 text-slate-400 text-lg leading-relaxed text-right border-t border-gold-900/10 pt-6">{faq.a}</p>
          </details>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default FAQ;
