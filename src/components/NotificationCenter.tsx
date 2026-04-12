import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, Info, Star, Trash2 } from 'lucide-react';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'موافقة ملكية تمّت 👑',
      message: 'تمت الموافقة على مجلد "تاريخ الأندلس" بنجاح.',
      type: 'success',
      time: 'منذ دقيقتين',
      read: false
    },
    {
      id: 2,
      title: 'عضو جديد انضم للديوان',
      message: 'رحب بالعضو الملكي الجديد: "زيد كمال".',
      type: 'info',
      time: 'منذ ساعة',
      read: false
    },
    {
      id: 3,
      title: 'تنبيه إمبراطوري ⚠️',
      message: 'يرجى تنظيف الملفات المؤقتة في الخزانة الرقمية.',
      type: 'warning',
      time: 'منذ 3 ساعات',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-gold-500/50 hover:bg-gold-500/10 transition-all group"
      >
        <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'text-gold-500 animate-pulse' : 'text-slate-400 group-hover:text-gold-500'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-black">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay to close */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-0 mt-4 w-96 z-50 bg-[#0c0c0d]/95 backdrop-blur-2xl border border-gold-500/20 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
              dir="rtl"
            >
              {/* Header */}
              <div className="p-6 bg-gold-500/5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-gold-500/20 flex items-center justify-center">
                      <Bell className="w-4 h-4 text-gold-500" />
                   </div>
                   <h3 className="text-xl font-amiri font-black text-white">الديوان الملكي</h3>
                </div>
                <button 
                  onClick={markAllAsRead}
                  className="text-[10px] font-black text-gold-500/60 uppercase tracking-widest hover:text-gold-500 transition-colors"
                >
                  تصفية الجميع
                </button>
              </div>

              {/* List */}
              <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n.id}
                      className={`group p-6 border-b border-white/5 hover:bg-white/5 transition-all relative ${!n.read ? 'bg-gold-500/[0.02]' : ''}`}
                    >
                      {!n.read && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-12 bg-gold-500 rounded-full blur-[2px]" />
                      )}
                      
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 p-2 rounded-xl flex-shrink-0 ${
                          n.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                          n.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {n.type === 'success' ? <CheckCircle className="w-4 h-4" /> :
                           n.type === 'warning' ? <Info className="w-4 h-4" /> :
                           <Star className="w-4 h-4" />}
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-white text-sm tracking-tight">{n.title}</h4>
                            <span className="text-[10px] text-slate-500 font-bold">{n.time}</span>
                          </div>
                          <p className="text-xs text-slate-400 font-bold leading-relaxed">{n.message}</p>
                        </div>

                        <button 
                          onClick={() => removeNotification(n.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-16 text-center space-y-4">
                     <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 opacity-20">
                        <Bell className="w-8 h-8" />
                     </div>
                     <p className="text-slate-500 font-bold text-sm">لا توجد رسائل في الديوان حالياً</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-black/40 text-center">
                 <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Imperial Registry System v2.5</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
