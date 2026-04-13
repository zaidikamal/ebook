import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, BrainCircuit, Mic, Waves, Info } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function AIAdvisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'online'>('connecting');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'أهلاً بك أيها القارئ الموقر. يتم الآن الاتصال بخادم المعرفة الملكي... 👑' }
  ]);
  const [input, setInput] = useState('');
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Simulate "Live" connection
  useEffect(() => {
    if (isOpen && connectionStatus === 'connecting') {
      const timer = setTimeout(() => {
        setConnectionStatus('online');
        setMessages(prev => [
          ...prev, 
          { role: 'assistant', text: 'تم الاتصال! أنا مستشارك الذكي الحي (AI Live). كيف يمكنني مرافقتك في رحلتك المعرفية اليوم؟' }
        ]);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    // Context-aware logic
    let responseText = 'أنا أحلل طلبك الآن بالاعتماد على ذكاء كتبي الاصطناعي...';
    
    if (userMsg.includes('رواج') || userMsg.includes('ترند')) {
      responseText = 'بناءً على تحليلات اللحظة، يتصدر "مقدمة ابن خلدون" قائمة القراءة اليوم! هل تريد مني إظهار المزيد من المجلدات الرائجة؟ 📈';
    } else if (userMsg.includes('تخصص') || userMsg.includes('قسم')) {
      responseText = 'لدينا أقسام جديدة تماماً للغات الأجنبية والمهارات المكتبية. هل تود أن أرشدك إليها؟ 📚';
    } else if (location.pathname === '/search') {
      responseText = 'أرى أنك في خزانة البحث. هل تريد مني تصفية النتائج بناءً على تقييمات القراء الموقرين؟ 🔎';
    } else {
      responseText = 'هذا سؤال عميق! بصفتي مستشارك الملكي، أؤكد لك أن منصتنا تضم أندر المخطوطات التي تبحث عنها. كيف يمكنني مساعدتك أكثر؟ ✨';
    }

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: responseText
      }]);
    }, 2000);
  };

  return (
    <>
      {/* Floating Trigger with Pulse Effect */}
      <div className="fixed bottom-8 left-8 z-[100]">
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-gold-500 rounded-full"
        />
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="relative w-16 h-16 bg-gradient-to-tr from-gold-600 to-amber-300 rounded-full shadow-[0_0_40px_rgba(212,175,55,0.4)] flex items-center justify-center text-slate-950 group overflow-hidden"
        >
          <Sparkles className="w-8 h-8 group-hover:animate-spin-slow" />
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute -top-1 -right-1 bg-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter shadow-xl">AI LIVE</div>
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="fixed bottom-28 left-8 w-[400px] z-[101] bg-[#0c0c0d]/98 backdrop-blur-3xl border border-gold-500/30 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col h-[600px]"
            dir="rtl"
          >
            {/* Header */}
            <div className="p-8 bg-gradient-to-l from-gold-500/10 to-transparent border-b border-white/5 relative">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 left-6 p-2 text-slate-500 hover:text-white transition-all bg-white/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                 <div className="relative">
                   <div className="w-14 h-14 rounded-2xl bg-gold-500 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                      <BrainCircuit className="w-8 h-8 text-slate-950" />
                   </div>
                   <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0c0c0d] ${connectionStatus === 'online' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-amiri font-black text-white">المستشار الملكي الحي</h3>
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-black text-gold-500 uppercase tracking-widest">{connectionStatus === 'online' ? 'متصل الآن (Real-time)' : 'جاري الاتصال...'}</span>
                       {connectionStatus === 'online' && <Waves className="w-3 h-3 text-gold-500 animate-pulse" />}
                    </div>
                 </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar scroll-smooth">
              {messages.map((m, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className={`flex ${m.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm font-bold leading-relaxed shadow-xl relative ${
                    m.role === 'assistant' 
                    ? 'bg-white/5 border border-white/10 text-slate-200 rounded-tr-none' 
                    : 'bg-gradient-to-br from-gold-600 to-gold-400 text-slate-950 rounded-tl-none font-black'
                  }`}>
                    {m.text}
                    {m.role === 'assistant' && idx === messages.length - 1 && connectionStatus === 'online' && (
                      <div className="absolute -bottom-6 right-0 flex items-center gap-1 opacity-40">
                         <Info className="w-3 h-3" />
                         <span className="text-[8px] font-black uppercase">Imperial Intelligence v3.1</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-[2rem] rounded-tr-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Footer Interface */}
            <div className="p-8 pt-0 border-t border-white/5 bg-black/20">
              <div className="flex gap-2 py-4 overflow-x-auto no-scrollbar">
                 {['توقعات الرواج', 'الكتب الجديدة', 'مساعدة ملكية'].map(text => (
                   <button 
                    key={text}
                    className="whitespace-nowrap px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-400 hover:text-gold-500 hover:border-gold-500/30 transition-all"
                    onClick={() => {
                      setInput(text);
                      handleSend();
                    }}
                    >
                      {text}
                    </button>
                 ))}
              </div>

              <div className="relative">
                <input
                  disabled={connectionStatus !== 'online'}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={connectionStatus === 'online' ? "اطرح سؤالك على الذكاء الملكي..." : "يرجى الانتظار..."}
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-5 pr-6 pl-24 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-gold-500/50 transition-all shadow-inner disabled:opacity-50"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-500 hover:text-gold-500 transition-all">
                    <Mic className="w-5 h-5" />
                  </button>
                  <button 
                    disabled={connectionStatus !== 'online'}
                    onClick={handleSend}
                    className="w-12 h-12 bg-gold-500 rounded-2xl flex items-center justify-center text-slate-950 hover:bg-gold-400 transition-all shadow-lg active:scale-95 disabled:grayscale"
                  >
                    <Send className="w-5 h-5 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

