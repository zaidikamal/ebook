import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
const NewsletterPopup = lazy(() => import('./components/NewsletterPopup'));

const Home = lazy(() => import('./pages/Home'));
const SearchPage = lazy(() => import('./pages/Search'));
const BookDetails = lazy(() => import('./pages/BookDetails'));
const LoginPage = lazy(() => import('./pages/Login'));
const RegisterPage = lazy(() => import('./pages/Register'));
const ProfilePage = lazy(() => import('./pages/Profile'));
const Checkout = lazy(() => import('./pages/Checkout'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const UploadBook = lazy(() => import('./pages/Admin/UploadBook'));
const MultiUpload = lazy(() => import('./pages/Admin/MultiUpload'));
const UploadDashboard = lazy(() => import('./pages/Admin/UploadDashboard'));
const Subscriptions = lazy(() => import('./pages/Subscriptions'));
const AffiliatePage = lazy(() => import('./pages/Affiliate'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Payment = lazy(() => import('./pages/Payment'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center text-gold-500 font-black" dir="rtl">
        ...جاري جلب المجلدات
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-surface selection:bg-indigo-500/30">
        <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center text-gold-500 font-black" dir="rtl">...جاري جلب المجلدات</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/checkout/:id" element={<Checkout />} />
            
            {/* Admin Routes with Guards */}
            <Route 
              path="/admin" 
              element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/admin/upload" 
              element={user?.role === 'admin' ? <UploadBook /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/admin/multi-upload" 
              element={user?.role === 'admin' ? <MultiUpload /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/admin/uploads" 
              element={user?.role === 'admin' ? <UploadDashboard /> : <Navigate to="/" replace />} 
            />

            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/affiliate" element={<AffiliatePage />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </Suspense>
        <Suspense fallback={null}>
          <NewsletterPopup />
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
