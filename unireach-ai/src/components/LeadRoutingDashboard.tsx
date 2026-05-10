'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Zap, Users, MapPin, GraduationCap, Activity, Clock, Server } from 'lucide-react';
import { useAgentCommunication } from '@/context/AgentCommunicationContext';
import { apiUrl } from '@/lib/api';

type Lead = {
  id?: number;
  full_name?: string;
  desired_major?: string;
  nationality?: string;
};

export default function LeadRoutingDashboard() {
  const { insights, publishInsight } = useAgentCommunication();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const activeCampaign = useMemo<string | null>(() => {
    const latestCampaign = insights.find(i => i.type === 'CAMPAIGN_LAUNCH');
    return typeof latestCampaign?.payload.country === 'string'
      ? latestCampaign.payload.country
      : null;
  }, [insights]);

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch(apiUrl('/leads'));
      if (!res.ok) throw new Error();
      const data: Lead[] = await res.json();
      setLeads(data);
      const priorityLead = data.find((l) => l.nationality === activeCampaign);
      if (priorityLead) {
        publishInsight({
          source: 'LeadRouting',
          type: 'PRIORITY_LEAD',
          payload: { name: priorityLead.full_name, country: priorityLead.nationality },
        });
      }
    } catch {
      // backend offline — show empty state
    } finally {
      setLoading(false);
    }
  }, [activeCampaign, publishInsight]);

  useEffect(() => {
    const initial = window.setTimeout(() => {
      void fetchLeads();
    }, 0);
    const id = setInterval(fetchLeads, 5000);
    return () => {
      window.clearTimeout(initial);
      clearInterval(id);
    };
  }, [fetchLeads]);

  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl flex flex-col gap-6 h-full">

      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400 shrink-0" />
          <h2 className="text-lg font-semibold text-white">Smart Routing</h2>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg">
          <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-300">Live</span>
        </div>
      </div>

      {activeCampaign && (
        <div className="bg-amber-950/40 border border-amber-800/50 rounded-lg px-3 py-2 text-xs text-amber-300">
          Active campaign: <span className="font-semibold">{activeCampaign}</span>
        </div>
      )}

      {/* Table header */}
      <div className="grid grid-cols-12 text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
        <div className="col-span-5 flex items-center gap-1"><Users className="w-3 h-3" /> Name</div>
        <div className="col-span-3 flex items-center gap-1"><MapPin className="w-3 h-3" /> Country</div>
        <div className="col-span-4 flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Major</div>
      </div>

      {/* Table body — scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0 max-h-64 space-y-0">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-5 h-5 border-2 border-slate-600 border-t-amber-400 rounded-full animate-spin" />
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-10 text-sm text-slate-500">Awaiting transmissions…</div>
        ) : (
          leads.map((lead, i) => (
            <div
              key={lead.id ?? i}
              className="grid grid-cols-12 items-center py-2.5 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
            >
              {/* Name + avatar */}
              <div className="col-span-5 flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 shrink-0 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                  {(lead.full_name ?? 'U').charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-white truncate">{lead.full_name ?? 'Unknown'}</span>
              </div>
              {/* Country */}
              <div className="col-span-3 min-w-0">
                <span className="text-sm text-slate-300 truncate block">{lead.nationality ?? '—'}</span>
              </div>
              {/* Major */}
              <div className="col-span-4 min-w-0">
                <span className="text-sm text-slate-400 truncate block">{lead.desired_major ?? '—'}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Status footer — always at bottom */}
      <div className="border-t border-slate-800 pt-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">Engine</div>
            <div className="text-sm font-mono text-white">4.2.0-STABLE</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">Success Rate</div>
            <div className="text-sm font-mono text-white">99.9%</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-blue-400 shrink-0" />
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">MTTR</div>
            <div className="text-sm font-mono text-white">12.4 ms</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">Latency</div>
            <div className="text-sm font-mono text-white">24 ms</div>
          </div>
        </div>
      </div>
    </div>
  );
}
