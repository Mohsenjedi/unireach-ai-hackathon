'use client';

import { useState, useRef, useEffect } from 'react';

const LANGS = ['English', 'Hindi', 'Arabic', 'Chinese', 'Vietnamese', 'French', 'Spanish', 'Portuguese'];

const CANNED: Record<string, string> = {
  default: "That's a great question! Our admissions team will follow up with full details within 2 business days.",
  tuition: "Tuition fees for international students start at €8,000 per year. Scholarships are available covering up to 50% of fees.",
  deadline: "The application deadline for Autumn 2025 intake is January 31st, 2025. Apply via Studyinfo.fi.",
  housing:  "Student housing is available from €250/month in our Kotka, Mikkeli, and Kouvola campuses.",
  english:  "English-taught programmes require IELTS 6.0 or equivalent. Finnish language is not mandatory.",
};

function pick(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('tuition') || t.includes('fee') || t.includes('cost')) return CANNED.tuition;
  if (t.includes('deadline') || t.includes('apply') || t.includes('date')) return CANNED.deadline;
  if (t.includes('hous') || t.includes('accomm') || t.includes('live')) return CANNED.housing;
  if (t.includes('english') || t.includes('ielts') || t.includes('language')) return CANNED.english;
  return CANNED.default;
}

interface Msg { id: number; role: 'user' | 'bot'; text: string; time: string; }
let gId = 0;
const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const INIT: Msg[] = [
  { id: gId++, role: 'bot', text: 'Welcome to XAMK University Admissions! 🎓 I can help you with programmes, fees, scholarships, housing, and application deadlines.', time: now() },
];

const QUICK = ['What are the tuition fees?', 'Application deadline?', 'Student housing options?', 'English requirements?'];

export default function AdmissionsChatScreen() {
  const [lang, setLang] = useState('English');
  const [msgs, setMsgs] = useState<Msg[]>(INIT);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || typing) return;
    setInput('');
    setMsgs(p => [...p, { id: gId++, role: 'user', text: t, time: now() }]);
    setTyping(true);
    setTimeout(() => {
      setMsgs(p => [...p, { id: gId++, role: 'bot', text: pick(t), time: now() }]);
      setTyping(false);
    }, 1200);
  };

  const lastLead = msgs.filter(m => m.role === 'user');

  return (
    <div className="content-area animate-in" style={{ padding: 0, overflow: 'hidden', height: '100%' }}>
      <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

        {/* Chat area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Chat header */}
          <div style={{ background: '#fff', borderBottom: 'var(--topbar-border)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14 }}>🤖</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500 }}>XAMK Admissions Bot</p>
                <p style={{ fontSize: 10, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
                  Online
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: 11, color: 'var(--text-muted)' }}>Language:</label>
              <select
                className="form-input" value={lang} onChange={e => setLang(e.target.value)}
                style={{ width: 'auto', padding: '4px 8px', fontSize: 11 }}
              >
                {LANGS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10, background: '#f8f9fb' }}>
            {msgs.map(m => (
              <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 2 }}>
                <div className={m.role === 'bot' ? 'chat-bubble-bot' : 'chat-bubble-user'}>{m.text}</div>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.time}</span>
              </div>
            ))}
            {typing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 12px', background: '#f3f4f6', borderRadius: '0 10px 10px 10px', width: 'fit-content' }}>
                {[0, 150, 300].map(d => (
                  <span key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: '#9ca3af', display: 'inline-block', animation: 'bounce 1s infinite', animationDelay: `${d}ms` }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          <div style={{ background: '#fff', borderTop: '0.5px solid rgba(0,0,0,0.06)', padding: '8px 16px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {QUICK.map(q => (
              <button key={q} onClick={() => send(q)} disabled={typing}
                style={{ fontSize: 11, padding: '4px 10px', border: '0.5px solid rgba(59,130,246,0.3)', borderRadius: 100, background: '#eff6ff', color: '#1d4ed8', cursor: 'pointer' }}>
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ background: '#fff', borderTop: 'var(--topbar-border)', padding: '10px 16px', display: 'flex', gap: 8 }}>
            <input
              className="form-input" style={{ flex: 1 }} value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
              placeholder="Type your question and press Enter…"
            />
            <button className="btn-primary" onClick={() => send(input)} disabled={!input.trim() || typing}>Send</button>
          </div>
        </div>

        {/* Right — Handoff panel */}
        <div style={{ width: 240, background: '#fff', borderLeft: 'var(--card-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '12px 14px', borderBottom: 'var(--topbar-border)' }}>
            <p style={{ fontSize: 12, fontWeight: 500 }}>Session Summary</p>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Language</p>
              <span className="status-pill pill-purple" style={{ fontSize: 11 }}>{lang}</span>
            </div>
            <div>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Messages</p>
              <p style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 600 }}>{msgs.length}</p>
            </div>
            <div>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Topics covered</p>
              {lastLead.length === 0 ? (
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>None yet</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {['Fees', 'Deadlines', 'Housing', 'Requirements'].filter(t => msgs.some(m => m.text.toLowerCase().includes(t.slice(0,3).toLowerCase()))).map(t => (
                    <span key={t} style={{ fontSize: 11, padding: '2px 8px', background: '#f3f4f6', borderRadius: 100, width: 'fit-content' }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
            <div style={{ marginTop: 'auto' }}>
              <button className="btn-primary" style={{ width: '100%', fontSize: 11, padding: '8px 0' }}>
                Handoff to Agent
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
    </div>
  );
}
