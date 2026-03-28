import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { addBookToLibrary } from '../lib/libraryService';
import { formattedAuthor } from '../utils/formatters';
import { useToast } from '../components/Toast';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const PAYPAL_CLIENT_ID = "Add_KKb8gyre1KNXB_39mAtdcYtzrR8Rg31roKZZk2VlD-7xEhQ1-Xz2CzCXWEn1d6PciizoZ4rWrDV4";

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      
      const type = id.split(':')[0];
      const realId = id.split(':')[1];

      try {
        let bookData: any;
        if (type === 'gb') {
          const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${realId}`);
          const item = response.data;
          bookData = {
            _id: id,
            title: item.volumeInfo.title,
            author: formattedAuthor(item.volumeInfo.authors?.[0]) || 'كاتب موقر',
            price: 24.99,
            coverImage: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400'
          };
        } else if (type === 'pg') {
          const response = await axios.get(`https://gutendex.com/books/${realId}`);
          const item = response.data;
          bookData = {
            _id: id,
            title: item.title,
            author: formattedAuthor(item.authors?.[0]?.name) || 'مؤلف كلاسيكي',
            price: 0,
            coverImage: `https://www.gutenberg.org/cache/epub/${realId}/pg${realId}.cover.medium.jpg`
          };
        } else if (type === 'ia') {
          const response = await axios.get(`https://archive.org/metadata/${realId}`);
          const item = response.data;
          bookData = {
            _id: id,
            title: item.metadata.title,
            author: formattedAuthor(item.metadata.creator) || 'كاتب مجهول',
            price: 0,
            coverImage: `https://archive.org/services/img/${realId}`
          };
        } else if (type === 'ko') {
          const KUTUBI_ORIGINALS = [
             { id: 'original-1', title: 'مقدمة ابن خلدون', author: 'ابن خلدون', coverImage: 'https://images.unsplash.com/photo-1589998059171-d88d664a2a0f?auto=format&fit=crop&q=80&w=400', price: 45.00 },
             { id: 'original-2', title: 'ألف ليلة وليلة', author: 'تراث شعبي', coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400', price: 29.99 },
             { id: 'original-3', title: 'كليلة ودمنة', author: 'عبد الله بن المقفع', coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400', price: 19.99 },
             { id: 'original-4', title: 'ديوان المتنبي', author: 'أبو الطيب المتنبي', coverImage: 'https://images.unsplash.com/photo-1532012197367-6849412a52cd?auto=format&fit=crop&q=80&w=400', price: 35.00 },
             { id: 'original-5', title: 'طوق الحمامة', author: 'ابن حزم الأندلسي', coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400', price: 25.00 },
             { id: 'original-6', title: 'حي بن يقظان', author: 'ابن طفيل', coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400', price: 22.00 },
             { id: 'original-7', title: 'البخلاء', author: 'الجاحظ', coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400', price: 15.00 },
             { id: 'original-8', title: 'رسالة الغفران', author: 'أبو العلاء المعري', coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b81ae1a3?auto=format&fit=crop&q=80&w=400', price: 27.50 },
          ];
          const original = KUTUBI_ORIGINALS.find(b => b.id === realId);
          if (original) {
            bookData = {
               _id: id,
               title: original.title,
               author: original.author,
               price: original.price,
               coverImage: original.coverImage
            };
          }
        } else if (type === 'royal') {
          const docRef = doc(db, 'books', realId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            bookData = {
               _id: id,
               title: data.title,
               author: data.author,
               price: data.price,
               coverImage: data.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
               source: 'مخطوطة ملكية معتمدة'
            };
          }
        }

        // Redirect free books to profile directly
        if (bookData.price === 0) {
          await addBookToLibrary(id);
          navigate('/profile');
        } else {
          setBook(bookData);
        }
      } catch (err) {
        console.error('Error fetching book for checkout:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBook();
  }, [id, navigate]);

  const handlePaymentSuccess = async (details: any) => {
    await addBookToLibrary(id as string);
    showToast(`شكراً لك ${details.payer.name.given_name}! تمت عملية الاستحواذ الملكية بنجاح. 👑`, 'success', 6000);
    navigate('/profile');
  };

  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center text-gold-500 font-black">جالٍ تحميل التفاصيل الملكية...</div>;
  if (!book) return <div className="min-h-screen bg-surface flex items-center justify-center text-gold-500 font-black">لم يتم العثور على المجلد القابل للاقتناء</div>;

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID }}>
      <div className="min-h-screen bg-surface text-slate-100 font-jakarta rtl" dir="rtl">
        <Navbar />
        
        <main className="container mx-auto px-6 pt-40 pb-24">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row-reverse gap-16">
            
            <div className="lg:w-1/2 space-y-10">
              <div className="text-right">
                <h1 className="text-5xl font-amiri font-black gold-text mb-6">إتمام الاقتناء الملكي</h1>
                <p className="text-slate-400 text-xl leading-relaxed">أنت على وشك إضافة هذا الكنز الثقافي إلى خزانتك الخاصة من مصدر {book.source || 'موثوق'}.</p>
              </div>

              <div className="bg-surface-container-low p-10 rounded-[4rem] border border-gold-900/20 shadow-2xl relative overflow-hidden">
                <h2 className="text-2xl font-black text-slate-300 mb-8 border-b border-gold-900/10 pb-4 text-right">ملخص الفاتورة الموقرة</h2>
                <div className="space-y-6">
                  <div className="flex flex-row-reverse justify-between items-center text-lg">
                    <span className="text-slate-500 font-bold">عنوان المجلد</span>
                    <span className="font-black text-white text-right max-w-[250px]">{book?.title}</span>
                  </div>
                  <div className="flex flex-row-reverse justify-between items-center text-lg">
                    <span className="text-slate-500 font-bold">القيمة الحالية</span>
                    <span className="font-black text-gold-500 text-2xl">${book?.price?.toFixed(2)}</span>
                  </div>
                  <div className="pt-6 border-t border-gold-900/10 mt-6 flex flex-row-reverse justify-between items-center">
                    <span className="text-2xl font-amiri font-black gold-text">الإجمالي الملكي</span>
                    <span className="text-4xl font-amiri font-black gold-text">${book?.price?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 flex flex-col justify-center">
               <div className="bg-surface-container-low border border-gold-900/20 rounded-[4rem] p-12 shadow-2xl relative">
                 <div className="text-center mb-12">
                   <h3 className="text-3xl font-amiri font-black gold-text mb-2">اختر طريقتك الملكية</h3>
                   <p className="text-slate-500 font-bold">الدفع الآمن باستخدام PayPal</p>
                 </div>
                 <div className="paypal-container relative z-10">
                   <PayPalButtons 
                     style={{ layout: "vertical", color: "gold", shape: "pill", label: "pay", tagline: false }}
                     createOrder={(_data, actions) => {
                       return actions.order.create({
                         intent: "CAPTURE",
                         purchase_units: [{
                           amount: { currency_code: "USD", value: book?.price?.toString() || "24.99" },
                           description: `اقتناء: ${book?.title}`
                         }],
                       });
                     }}
                     onApprove={(_data, actions) => {
                       return actions.order?.capture().then((details) => {
                         handlePaymentSuccess(details);
                       }) as Promise<void>;
                     }}
                   />
                 </div>
               </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PayPalScriptProvider>
  );
};

export default Checkout;
