
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, BrainCircuit } from 'lucide-react';
import { getAssistantResponse } from '../services/geminiService';

interface GeminiAssistantProps {
  currentAqi: number;
  theme: 'dark' | 'light';
}

const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ currentAqi, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!query.trim()) return;
    const userText = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    
    setIsTyping(true);
    const aiResponse = await getAssistantResponse(userText, currentAqi);
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
  };

  return (
    <div className="fixed bottom-12 right-12 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`w-[360px] h-[500px] glass rounded-[40px] shadow-2xl flex flex-col overflow-hidden mb-6 border border-white/10`}
          >
            <div className="px-8 py-6 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10">
                  <BrainCircuit size={18} className="text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest">PureAir Intelligence</h4>
                  <span className="text-[9px] opacity-30 font-bold uppercase tracking-widest">NCT Assistant</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="opacity-30 hover:opacity-100">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                  <Sparkles size={32} />
                  <p className="text-xs font-medium max-w-[200px]">Ask about local AQI, health impacts, or GRAP protocols.</p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-5 py-3 rounded-3xl text-xs font-medium leading-relaxed ${
                    m.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-white/5 text-current border border-white/5'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 px-5 py-3 rounded-3xl border border-white/5">
                    <div className="flex gap-1">
                      {[0,1,2].map(d => (
                        <motion.div 
                          key={d}
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }}
                          className="w-1 h-1 rounded-full bg-current"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="px-6 py-6 border-t border-white/5 bg-white/5">
               <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Ask PureAir Assistant..."
                    className="w-full bg-transparent border-none outline-none text-xs font-medium py-2 pr-10 placeholder:opacity-20"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <button 
                    onClick={handleSend}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-indigo-400 opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <Send size={16} />
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-indigo-500 text-white shadow-2xl flex items-center justify-center border-4 border-black/20"
      >
        <MessageSquare size={24} />
      </motion.button>
    </div>
  );
};

export default GeminiAssistant;
