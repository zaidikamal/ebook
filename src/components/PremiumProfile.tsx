import { motion } from "framer-motion";
import { Star, BookOpen, Flame, LogOut, Verified } from "lucide-react";

interface PremiumProfileProps {
  user?: {
    name: string;
    email: string;
    avatar: string;
    tier: string;
    roleBadge?: string;
  };
  stats?: {
    readingHours: number;
    booksInLibrary: number;
    streak: number;
  };
  onLogout?: () => void;
}

export default function PremiumProfile({ 
  user = {
    name: "KAMAL",
    email: "fr.capsules20@gmail.com",
    avatar: "https://i.imgur.com/6VBx3io.png",
    tier: "👑 PRO MEMBER",
    roleBadge: "الإدارة الملكية"
  },
  stats = {
    readingHours: 12,
    booksInLibrary: 0,
    streak: 5
  },
  onLogout
}: PremiumProfileProps) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12" dir="rtl">
      {/* Main Cinematic Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative bg-[#0a0a0a] rounded-[3.5rem] border border-gold-500/20 p-8 md:p-14 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] group"
      >
        {/* Decorative Arcs & Lines (matching the image) */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] border-t border-r border-gold-500/10 rounded-tr-[5rem] pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] border-b border-l border-gold-500/10 rounded-bl-[5rem] pointer-events-none -ml-10 -mb-10"></div>
        
        {/* Subtle Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-gold-900/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Header Elements */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
          
          {/* Avatar Area (Top Left in Image) */}
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Logout Button (Positioned as in Image) */}
            <button 
              onClick={onLogout}
              className="absolute top-0 left-0 md:-top-4 md:-left-4 bg-red-950/30 hover:bg-red-600 transition-all text-red-500 hover:text-white px-4 py-2 rounded-2xl border border-red-500/20 flex items-center gap-2 text-[10px] font-black tracking-widest uppercase z-50 backdrop-blur-md"
            >
              <LogOut size={12} />
              تسجيل الخروج
            </button>

            <div className="relative">
              {/* Outer Golden Rings */}
              <div className="absolute -inset-4 border border-gold-500/20 rounded-full animate-[spin_20s_linear_infinite] pointer-events-none"></div>
              <div className="absolute -inset-2 border-2 border-gold-500/10 rounded-full pointer-events-none"></div>
              
              {/* Profile Image with complex frame */}
              <div className="relative w-44 h-44 rounded-full p-2 bg-gradient-to-br from-gold-600 via-gold-400 to-gold-900 shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-black relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700 hover:scale-110"
                  />
                  {/* Inner Glow */}
                  <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] pointer-events-none"></div>
                </div>
                
                {/* Small Verified Badge inside ring */}
                <div className="absolute bottom-2 right-2 bg-gradient-to-br from-yellow-300 to-yellow-600 p-2 rounded-full border-4 border-[#0a0a0a] shadow-xl z-20">
                  <Verified size={20} className="text-black fill-black/20" />
                </div>
              </div>
            </div>

            {/* Name & Badge Area */}
            <div className="text-center md:text-right space-y-4">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-6xl md:text-8xl font-serif font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#f5e27a] via-[#d4af37] to-[#8b6914] drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {user.name}
              </motion.h1>
              
              <div className="flex flex-col md:flex-row items-center gap-4">
                {/* Email Capsule */}
                <span className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-zinc-400 text-sm font-medium backdrop-blur-md">
                  {user.email}
                </span>
                
                {/* Royal Badge */}
                <div className="group/badge px-6 py-2 bg-gradient-to-r from-gold-900/40 to-black border border-gold-500/30 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
                  </span>
                  <span className="text-gold-400 font-black text-xs tracking-widest uppercase">
                    {user.roleBadge}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Area (Right side in Image) */}
          <div className="flex flex-col sm:flex-row gap-6 lg:ml-auto">
            
            {/* Stat Card 1: Books */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative w-48 h-56 bg-[#0f0f0f]/80 backdrop-blur-2xl rounded-[2.5rem] border border-gold-500/10 p-8 flex flex-col items-center justify-center overflow-hidden shadow-2xl"
            >
              {/* Background faint text */}
              <div className="absolute bottom-4 left-4 text-[4rem] font-black text-gold-500/5 select-none pointer-events-none">#1</div>
              
              <p className="text-5xl font-bold text-white relative z-10 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                {stats.booksInLibrary}
              </p>
              <p className="text-gold-500/60 font-black text-[10px] uppercase tracking-[0.2em] text-center leading-relaxed font-amiri">
                كتاب في الخزانة
              </p>
            </motion.div>

            {/* Stat Card 2: Hours */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative w-48 h-56 bg-[#0f0f0f]/80 backdrop-blur-2xl rounded-[2.5rem] border border-gold-500/10 p-8 flex flex-col items-center justify-center overflow-hidden shadow-2xl"
            >
              {/* Background faint text */}
              <div className="absolute bottom-4 left-4 text-[4rem] font-black text-gold-500/5 select-none pointer-events-none">PRO</div>
              
              <p className="text-5xl font-bold text-white relative z-10 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                {stats.readingHours}
              </p>
              <p className="text-gold-500/60 font-black text-[10px] uppercase tracking-[0.2em] text-center leading-relaxed font-amiri">
                ساعة قراءة
              </p>
            </motion.div>

          </div>
        </div>

        {/* Footer/Progress Section (Custom for Premium) */}
        <div className="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          
          {/* Targets/Achievements */}
          <div className="flex gap-4 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
            {["قارئ نشيط", "خمسة أيام متتالية", "أول كتاب"].map((ach, idx) => (
              <div 
                key={idx}
                className="whitespace-nowrap px-6 py-3 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3 group/ach hover:border-gold-500/30 transition-all cursor-default"
              >
                <div className="w-8 h-8 rounded-full bg-gold-900/50 flex items-center justify-center group-hover/ach:scale-110 transition-transform">
                  <Star size={14} className="text-gold-400" />
                </div>
                <span className="text-zinc-400 text-sm font-bold group-hover/ach:text-gold-200 transition-colors">
                  {ach}
                </span>
              </div>
            ))}
          </div>

          {/* Goal Progress */}
          <div className="w-full md:w-80 space-y-3">
             <div className="flex justify-between text-[10px] font-black tracking-widest uppercase text-zinc-500">
               <span>الهدف الشهري</span>
               <span className="text-gold-500">75%</span>
             </div>
             <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-gold-600 via-gold-400 to-yellow-200 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                />
             </div>
          </div>

        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-12 h-12 border border-gold-500/10 rounded-full animate-bounce duration-[3s]"></div>
        <div className="absolute bottom-1/4 right-10 w-20 h-20 border border-gold-500/5 rounded-full animate-pulse"></div>

      </motion.div>
    </div>
  );
}
