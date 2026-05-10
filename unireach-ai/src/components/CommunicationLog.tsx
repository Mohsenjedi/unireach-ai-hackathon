'use client';

import { useAgentCommunication } from '@/context/AgentCommunicationContext';
import { Cpu, Share2, Zap, MessageSquare, Activity } from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  MarketIntelligence: Cpu,
  MarketingStrategy: Share2,
  LeadRouting: Zap,
  AdmissionsChatbot: MessageSquare,
};

const SOURCE_COLOR: Record<string, string> = {
  MarketIntelligence: 'text-blue-400',
  MarketingStrategy:  'text-amber-400',
  LeadRouting:        'text-emerald-400',
  AdmissionsChatbot:  'text-purple-400',
};

export default function CommunicationLog() {
  const { insights } = useAgentCommunication();

  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400 shrink-0" />
          <h2 className="text-lg font-semibold text-white">Neural Link Substrate</h2>
        </div>
        <div className="flex items-center gap-3">
          {[{ label: 'Uptime', value: '100%' }, { label: 'Latency', value: '2ms' }].map(s => (
            <div key={s.label} className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</span>
              <span className="text-sm font-mono text-slate-200">{s.value}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-400">Live</span>
          </div>
        </div>
      </div>

      {/* Log table header */}
      <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-slate-800/60 rounded-lg text-xs font-medium text-slate-400 uppercase tracking-wider">
        <div className="col-span-2">Time</div>
        <div className="col-span-3">Source</div>
        <div className="col-span-3">Event</div>
        <div className="col-span-4">Payload</div>
      </div>

      {/* Log rows */}
      <div className="overflow-y-auto max-h-64 space-y-0.5">
        {insights.length === 0 ? (
          <div className="flex items-center justify-center py-10 gap-3">
            <div className="w-4 h-4 border-2 border-slate-600 border-t-emerald-400 rounded-full animate-spin" />
            <span className="text-sm text-slate-500">Waiting for agent events…</span>
          </div>
        ) : (
          insights.map((ins, idx) => {
            const Icon = ICON_MAP[ins.source];
            const color = SOURCE_COLOR[ins.source] ?? 'text-slate-300';
            return (
              <div
                key={ins.timestamp.getTime() + idx}
                className="grid grid-cols-12 gap-2 px-3 py-2 rounded-lg hover:bg-slate-800/40 transition-colors text-sm"
              >
                <div className="col-span-2 font-mono text-slate-500 text-xs tabular-nums truncate">
                  {new Date(ins.timestamp).toLocaleTimeString([], { hour12: false })}
                </div>
                <div className={`col-span-3 flex items-center gap-1.5 ${color} truncate`}>
                  {Icon && <Icon className="w-3 h-3 shrink-0" />}
                  <span className="text-xs font-medium truncate">
                    {ins.source.replace('Intelligence', '').replace('Strategy', '').replace('Chatbot', '')}
                  </span>
                </div>
                <div className="col-span-3 text-xs text-slate-400 font-mono uppercase truncate">
                  {ins.type}
                </div>
                <div className="col-span-4 text-xs text-slate-300 truncate">
                  {typeof ins.payload === 'string' ? ins.payload : JSON.stringify(ins.payload)}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs text-slate-500">
        <div className="flex gap-2">
          {['AUTH', 'SYNC', 'STREAM'].map(t => (
            <span key={t} className="border border-slate-700 px-2 py-0.5 rounded">{t}</span>
          ))}
        </div>
        <span className="font-mono">SYSTEM_STABLE_V2.0</span>
      </div>
    </div>
  );
}
