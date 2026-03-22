import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const SearchPage = lazy(() => import('./pages/Search'));
const BookDetails = lazy(() => import('./pages/BookDetails'));
const LoginPage = lazy(() => import('./pages/Login'));
const RegisterPage = lazy(() => import('./pages/Register'));
const ProfilePage = lazy(() => import('./pages/Profile'));
const Checkout = lazy(() => import('./pages/Checkout'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const UploadBook = lazy(() => import('./pages/Admin/UploadBook'));
const UploadDashboard = lazy(() => import('./pages/Admin/UploadDashboard'));
const Subscriptions = lazy(() => import('./pages/Subscriptions'));
const AffiliatePage = lazy(() => import('./pages/Affiliate'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Payment = lazy(() => import('./pages/Payment'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
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
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/upload" element={<UploadBook />} />
            <Route path="/admin/uploads" element={<UploadDashboard />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/affiliate" element={<AffiliatePage />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
