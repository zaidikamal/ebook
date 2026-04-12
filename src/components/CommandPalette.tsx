import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Book, 
  User, 
  Settings, 
  Home, 
  ShieldCheck, 
  Zap,
  Command as CommandIcon 
} from 'lucide-react';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const togglePalette = useCallback(() => setIsOpen(prev => !prev), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        togglePalette();
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePalette]);

  const actions = [
    { name: 'العودة للمنزل', icon: <Home className="w-4 h-4" />, path: '/', shortcut: 'H' },
    { name: 'تصفح الخزانة', icon: <Book className="w-4 h-4" />, path: '/search', shortcut: 'B' },
    { name: 'الملف الإمبراطوري', icon: <User className="w-4 h-4" />, path: '/profile', shortcut: 'P' },
    { name: 'لوحة التحكم الملكية', icon: <ShieldCheck className="w-4 h-4" />, path: '/admin', shortcut: 'A', adminOnly: true },
    { name: 'الإعدادات الملكية', icon: <Settings className="w-4 h-4" />, path: '/profile', shortcut: 'S' },
  ];

  const filteredActions = actions.filter(action => 
    action.name.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Palette */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-2xl bg-[#0c0c0d]/90 border border-gold-500/20 rounded-[2rem] shadow-[0_0_100px_rgba(212,175,55,0.1)] overflow-hidden"
        >
          {/* Input Header */}
          <div className="flex items-center gap-4 p-6 border-b border-white/5">
            <Search className="w-6 h-6 text-gold-500" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن أمر، كتاب، أو قسم..."
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-xl font-amiri text-white placeholder:text-slate-600"
            />
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
              <span className="text-[10px] font-black text-slate-500 uppercase">ESC</span>
            </div>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
            <div className="space-y-2">
              <p className="px-4 py-2 text-[10px] font-black text-gold-500/50 uppercase tracking-[0.3em]">تسريع الوصول (Fast Track)</p>
              {filteredActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    navigate(action.path);
                    setIsOpen(false);
                  }}
                  className="w-full group flex items-center justify-between p-4 rounded-2xl hover:bg-gold-500/10 border border-transparent hover:border-gold-500/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-gold-500 group-hover:bg-gold-500/20 transition-all">
                      {action.icon}
                    </div>
                    <span className="text-lg font-bold text-slate-300 group-hover:text-white transition-colors">{action.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-black text-slate-400 uppercase tracking-tighter">Enter</span>
                  </div>
                </button>
              ))}

              {query && filteredActions.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-slate-500 font-bold">لم يتم العثور على نتائج لـ "{query}"</p>
                  <p className="text-xs text-slate-600 mt-2 lowercase">Royal Archive Research Unit</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-black/20 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 bg-white/10 rounded border border-white/10 text-[8px] text-slate-400">↑↓</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">تصفح</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 bg-white/10 rounded border border-white/10 text-[8px] text-slate-400">↵</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">اختيار</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-gold-500" />
              <span className="text-[10px] font-black text-gold-500/50 uppercase tracking-[0.2em]">Imperial Command Engine</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
