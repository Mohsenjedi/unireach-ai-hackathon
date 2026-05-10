'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageSquare } from 'lucide-react';

interface Message { id: number; sender: 'user' | 'bot'; text: string; }

const RESPONSES = [
  "XAMK offers top-ranked programmes in Computer Science, Business, and Engineering. Tuition starts at €8,000/year with scholarships available.",
  "The application deadline for Autumn 2025 is January 31st. You can apply via Studyinfo.fi.",
  "XAMK is located in South-East Finland with campuses in Kotka, Mikkeli, and Kouvola. Student housing is available from €250/month.",
  "English-taught Bachelor's programmes require IELTS 6.0 or equivalent. Finnish is not required.",
  "Scholarship opportunities include the XAMK Excellence Scholarship covering up to 50% of tuition fees.",
];

let msgId = 0;

export default function AdmissionsChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { id: msgId++, sender: 'bot', text: 'Hello! I am the XAMK Admissions Assistant. Ask me about programmes, deadlines, scholarships, or campus life.' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput('');
    setMessages(p => [...p, { id: msgId++, sender: 'user', text }]);
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    const reply = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
    setMessages(p => [...p, { id: msgId++, sender: 'bot', text: reply }]);
    setIsTyping(false);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl flex flex-col" style={{ minHeight: '480px' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-400 shrink-0" />
          <h2 className="text-lg font-semibold text-white">Admissions Chatbot</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-400">Online</span>
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white ${msg.sender === 'bot' ? 'bg-blue-600' : 'bg-slate-600'}`}>
              {msg.sender === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            {/* Bubble */}
            <div className={`max-w-[75%] px-4 py-2.5 rounded-xl text-sm leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl rounded-tl-none flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-slate-800 px-4 py-3 flex items-center gap-3">
        <input
          type="text" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about programmes, scholarships, deadlines…"
          className="flex-1 bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-500 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors min-w-0"
        />
        <button
          onClick={handleSend} disabled={!input.trim() || isTyping}
          className="w-9 h-9 shrink-0 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
