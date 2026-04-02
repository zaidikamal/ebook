import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SecurityIcon from '@mui/icons-material/Security';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
    setMobileOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'الرئيسية', icon: <HomeIcon className="text-base" />, exact: true },
    { to: '/search', label: 'تصفح الكتب', icon: <AutoStoriesIcon className="text-base" /> },
    ...(user ? [{ to: '/profile', label: 'مكتبتي', icon: <AccountBalanceIcon className="text-base" /> }] : []),
  ];

  return (
    <>
      <nav
        className="glass-header h-16 md:h-[4.5rem]"
        style={{
          boxShadow: scrolled
            ? '0 8px 60px rgba(0,0,0,0.7), 0 0 60px rgba(212,175,55,0.08) inset'
            : undefined,
        }}
      >
        <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-3 flex-shrink-0 group"
          >
            <div className="relative w-9 h-9 md:w-10 md:h-10">
              <div className="absolute inset-0 rounded-xl bg-gold-500/20 blur-md group-hover:blur-lg transition-all duration-500 animate-glow-pulse" />
              <div className="relative w-full h-full bg-gradient-to-tr from-gold-700 via-gold-500 to-gold-300 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/30 transform -rotate-6 group-hover:-rotate-3 transition-transform duration-500">
                <MenuBookIcon className="text-slate-950 text-lg font-black" />
              </div>
            </div>
            <span className="text-2xl md:text-3xl font-amiri font-black gold-text tracking-tight group-hover:animate-royal-flicker">
              كتبي
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) =>
                  `nav-item flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black transition-all duration-300 ${
                    isActive
                      ? 'nav-active bg-gold-500/10 text-gold-400'
                      : 'text-slate-400 hover:text-gold-400 hover:bg-gold-500/5'
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}

            {(user?.role === 'admin' || !user) && (
              <Link
                to="/admin"
                className="nav-item flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black transition-all duration-300 text-gold-500/50 hover:text-gold-400 hover:bg-gold-500/5 group"
              >
                <SecurityIcon className="text-base opacity-60 group-hover:opacity-100 transition-opacity" />
                <span>لوحة التحكم</span>
              </Link>
            )}
          </div>

          {/* ── Search Bar ── */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl w-52 xl:w-64 transition-all duration-500 group focus-within:w-72"
            style={{
              background: 'rgba(12,10,22,0.6)',
              border: '1px solid rgba(212,175,55,0.1)',
            }}
          >
            <SearchIcon className="text-slate-600 text-sm group-focus-within:text-gold-500 transition-colors flex-shrink-0" />
            <input
              type="text"
              placeholder="ابحث عن كتاب..."
              className="bg-transparent border-none focus:ring-0 outline-none text-sm placeholder:text-slate-600 text-slate-200 w-full px-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const q = (e.target as HTMLInputElement).value;
                  if (q.trim()) navigate(`/search?q=${encodeURIComponent(q)}`);
                }
              }}
            />
          </div>

          {/* ── Auth Actions ── */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {loading ? (
              <div className="w-7 h-7 rounded-full border-2 border-gold-500/20 border-t-gold-500/80 animate-spin" />
            ) : user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 px-4 py-2 rounded-2xl transition-all duration-300 group"
                  style={{
                    background: 'rgba(15,12,25,0.7)',
                    border: '1px solid rgba(212,175,55,0.1)',
                  }}
                >
                  <div className="w-7 h-7 rounded-full border border-gold-500/40 overflow-hidden bg-gold-900/30 flex items-center justify-center text-gold-400 font-black text-sm flex-shrink-0 group-hover:border-gold-500/80 transition-colors">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-slate-400 group-hover:text-gold-400 font-black text-xs transition-colors">
                    {user.role === 'admin' ? '👑 المدير' : (user.name || 'عضو ملكي')}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-black text-red-400/70 hover:text-white hover:bg-red-500 transition-all duration-300 text-xs"
                  style={{ border: '1px solid rgba(239,68,68,0.1)' }}
                  title="تسجيل الخروج"
                >
                  <LogoutIcon className="text-sm" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="gold-button text-sm py-2.5 px-6 flex items-center gap-2"
              >
                <LoginIcon className="text-base" />
                <span>دخول</span>
              </Link>
            )}
          </div>

          {/* ── Mobile Menu Toggle ── */}
          <button
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-gold-400 hover:bg-gold-500/10 transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-20 left-3 right-3 z-40 rounded-3xl overflow-hidden md:hidden"
            style={{
              background: 'rgba(10,9,15,0.95)',
              border: '1px solid rgba(212,175,55,0.15)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03) inset',
            }}
          >
            <div className="p-5 space-y-2" dir="rtl">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.exact}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm transition-all ${
                      isActive
                        ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20'
                        : 'text-slate-400 hover:text-gold-400 hover:bg-gold-500/8'
                    }`
                  }
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              ))}

              {(user?.role === 'admin' || !user) && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm text-gold-500/50 hover:text-gold-400 hover:bg-gold-500/8 transition-all"
                >
                  <SecurityIcon className="text-base" />
                  لوحة التحكم
                </Link>
              )}

              <div className="pt-2 border-t border-gold-500/10 mt-2">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <LogoutIcon className="text-base" />
                    تسجيل الخروج
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="gold-button w-full flex items-center justify-center gap-2 text-sm"
                  >
                    <LoginIcon className="text-base" />
                    دخول
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
