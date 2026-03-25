import { Link, NavLink, useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SecurityIcon from '@mui/icons-material/Security';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <nav className="glass-header h-20">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        {/* Right side: Logo & Primary Nav (Arabic RTL Support) */}
        <div className="flex items-center gap-10">
          <Link to="/" className="text-3xl font-amiri font-black tracking-tighter text-white flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-tr from-gold-700 via-gold-500 to-gold-300 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/20 transform -rotate-6">
              <MenuBookIcon className="text-slate-950 text-xl font-black" />
            </span>
            <span className="gold-text">كتبي</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={({isActive}) => `nav-text nav-item font-bold ${isActive ? 'nav-active' : ''}`}>الرئيسية</NavLink>
            <NavLink to="/search" className={({isActive}) => `nav-text nav-item font-bold ${isActive ? 'nav-active' : ''}`}>تصفح الكتب</NavLink>
            {user && <NavLink to="/profile" className={({isActive}) => `nav-text nav-item font-bold ${isActive ? 'nav-active' : ''}`}>مكتبتي</NavLink>}
            
            {/* Admin Dashboard Link - Only show if likely admin */}
            {(user?.role === 'admin' || !user) && (
              <Link to="/admin" className="text-gold-500/40 hover:text-gold-500 font-bold transition-colors flex items-center gap-2">
                <SecurityIcon className="text-sm" />
                التحكم الملكي
              </Link>
            )}
          </div>
        </div>

        {/* Left side: Search & Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center bg-surface-container-lowest/50 border border-gold-900/10 rounded-xl px-4 py-2 w-64 group focus-within:border-gold-500/50 transition-all">
            <SearchIcon className="text-gold-900 text-sm" />
            <input 
              type="text" 
              placeholder="ابحث عن كتاب..." 
              className="bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-600 w-full px-2"
            />
          </div>
          
          {loading ? (
            <div className="w-8 h-8 rounded-full border-2 border-gold-500/30 border-t-gold-500 animate-spin"></div>
          ) : user ? (
            <>
              <Link to="/profile" className="flex items-center gap-3 bg-surface-container-low border border-gold-900/10 px-4 py-2 rounded-2xl hover:border-gold-500/30 transition-all group">
                <div className="w-8 h-8 rounded-full border border-gold-500/30 overflow-hidden bg-gold-900/20 flex items-center justify-center text-gold-500">
                   {user.name?.[0] || 'U'}
                </div>
                <span className="text-slate-400 group-hover:text-gold-500 font-black text-sm transition-colors">
                  {user.name || "عضو ملكي"}
                </span>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-950/20 text-red-400 px-4 py-2.5 rounded-xl font-black hover:bg-red-500 hover:text-slate-950 transition-all border border-red-500/10 text-xs"
                title="تسجيل الخروج"
              >
                <LogoutIcon className="text-sm" />
              </button>
            </>
          ) : (
            <Link to="/login" className="flex items-center gap-2 bg-gold-900/20 text-gold-500 px-6 py-2.5 rounded-xl font-black hover:bg-gold-500 hover:text-slate-950 transition-all border border-gold-500/10 text-sm">
              <LoginIcon className="text-sm" />
              <span>دخول</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
