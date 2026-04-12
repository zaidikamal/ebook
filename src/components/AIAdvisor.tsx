import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, BrainCircuit } from 'lucide-react';

export default function AIAdvisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'أهلاً بك أيها المدير الإمبراطوري. أنا مستشارك الرقمي، كيف يمكنني المساعدة في تحسين أداء الخزانة اليوم؟ 👑' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { role: 'user', text: input }]);
    setInput('');

    // Mock AI Response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: 'بناءً على تحليلاتي الملكية، أقترح عليك مراجعة المجلدات الثلاثة الأخيرة، فمعدل رواجها يتخطى الـ 90%! 🚀' 
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Trigger */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 z-[100] w-16 h-16 bg-gradient-to-tr from-gold-600 to-amber-300 rounded-full shadow-[0_0_40px_rgba(212,175,55,0.4)] flex items-center justify-center text-slate-950 group"
      >
        <Sparkles className="w-8 h-8 group-hover:animate-spin-slow" />
        <div className="absolute -top-1 -right-1 bg-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter shadow-xl">AI Live</div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="fixed bottom-28 left-8 w-96 z-[101] bg-[#0c0c0d]/95 backdrop-blur-2xl border border-gold-500/30 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col h-[550px]"
            dir="rtl"
          >
            {/* Header */}
            <div className="p-8 bg-gradient-to-l from-gold-500/10 to-transparent border-b border-white/5 relative">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 left-6 p-2 text-slate-500 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-gold-500 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                    <BrainCircuit className="w-7 h-7 text-slate-950" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-amiri font-black text-white">المستشار الملكي</h3>
                    <p className="text-[10px] font-black text-gold-500/60 uppercase tracking-widest">Powered by Imperial Intelligence</p>
                 </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm font-bold leading-relaxed shadow-xl ${
                    m.role === 'assistant' 
                    ? 'bg-white/5 border border-white/10 text-slate-300 rounded-tr-none' 
                    : 'bg-gold-500 text-slate-950 rounded-tl-none font-black'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="px-8 py-3 flex gap-2 overflow-x-auto custom-scrollbar no-scrollbar">
               <button className="whitespace-nowrap px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-400 hover:text-gold-500 hover:border-gold-500/30 transition-all">تحليل رواج الكتب</button>
               <button className="whitespace-nowrap px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-400 hover:text-gold-500 hover:border-gold-500/30 transition-all">تقارير الأعضاء</button>
            </div>

            {/* Input */}
            <div className="p-8 pt-2">
              <div className="relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="اسأل مستشارك الملكي..."
                  className="w-full bg-white/5 border border-white/10 rounded-3xl py-4 pr-6 pl-16 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-gold-500/50 transition-all shadow-inner"
                />
                <button 
                  onClick={handleSend}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-gold-500 rounded-2xl flex items-center justify-center text-slate-950 hover:bg-gold-400 transition-all shadow-lg"
                >
                  <Send className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
