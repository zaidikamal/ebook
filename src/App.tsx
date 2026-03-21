import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SearchPage from './pages/Search';
import BookDetails from './pages/BookDetails';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ProfilePage from './pages/Profile';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import UploadBook from './pages/Admin/UploadBook';
import Subscriptions from './pages/Subscriptions';
import AffiliatePage from './pages/Affiliate';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Payment from './pages/Payment';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-surface selection:bg-indigo-500/30">
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
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/affiliate" element={<AffiliatePage />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
