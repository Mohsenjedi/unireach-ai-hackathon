'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Sparkles, Share2, Layers, Languages, Cpu } from 'lucide-react';
import { useAgentCommunication } from '@/context/AgentCommunicationContext';
import { apiUrl } from '@/lib/api';
type MarketingPlan = {
  cultural_tone: string;
  recommended_channels: string[];
  language: string;
  assets: string;
};


const COUNTRIES = [
  { name: 'India',   iso: 'IN' },
  { name: 'Vietnam', iso: 'VN' },
  { name: 'Nigeria', iso: 'NG' },
  { name: 'Brazil',  iso: 'BR' },
  { name: 'Germany', iso: 'DE' },
];

export default function MarketingStrategy() {
  const { insights, publishInsight } = useAgentCommunication();
  const [manualCountryIso, setManualCountryIso] = useState<string | null>(null);
  const [plan, setPlan] = useState<MarketingPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'strategy' | 'preview'>('strategy');

  const recommendedCountry = useMemo(() => {
    const latest = insights[0];
    if (latest?.type === 'MARKET_RECOMMENDATION') {
      return COUNTRIES.find(c => c.name === latest.payload.country) ?? null;
    }
    return null;
  }, [insights]);

  const selectedCountry = useMemo(
    () => COUNTRIES.find(c => c.iso === manualCountryIso) ?? recommendedCountry ?? COUNTRIES[0],
    [manualCountryIso, recommendedCountry]
  );

  const fetchPlan = useCallback(async (iso: string, countryName: string) => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl(`/marketing-plan/${iso}`));
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPlan(data);
      publishInsight({
        source: 'MarketingStrategy',
        type: 'CAMPAIGN_LAUNCH',
        payload: { country: countryName, tone: data.cultural_tone, channels: data.recommended_channels },
      });
    } catch {
      setPlan({
        cultural_tone: 'Professional',
        recommended_channels: ['Facebook', 'Instagram', 'LinkedIn'],
        language: 'English',
        assets: `Discover your potential in Finland at XAMK. World-class education, international community. Apply for ${countryName} intake — Autumn 2025.`,
      });
    } finally {
      setLoading(false);
    }
  }, [publishInsight]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      void fetchPlan(selectedCountry.iso, selectedCountry.name);
    }, 0);
    return () => window.clearTimeout(t);
  }, [fetchPlan, selectedCountry]);

  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-amber-400 shrink-0" />
          <h2 className="text-lg font-semibold text-white">Marketing Strategy</h2>
        </div>
        <div className="flex bg-slate-800 border border-slate-700 rounded-lg p-0.5">
          {(['strategy', 'preview'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Country pills */}
      <div className="flex flex-wrap gap-2">
        {COUNTRIES.map(c => (
          <button key={c.iso} onClick={() => setManualCountryIso(c.iso)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              selectedCountry.iso === c.iso
                ? 'bg-amber-900/40 border-amber-600 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}>
            {c.name}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-14 gap-3">
          <div className="w-5 h-5 border-2 border-slate-600 border-t-amber-400 rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Generating strategy…</span>
        </div>
      ) : tab === 'strategy' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Cultural Tone</span>
            </div>
            <p className="text-sm text-white">{plan?.cultural_tone ?? '—'}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Languages className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Localization</span>
            </div>
            <p className="text-sm text-white">{plan?.language ?? '—'}</p>
          </div>
          <div className="sm:col-span-2 bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Distribution Channels</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(plan?.recommended_channels ?? []).map((ch: string) => (
                <span key={ch} className="px-3 py-1 bg-amber-900/30 border border-amber-700/40 text-amber-300 text-sm rounded-md">{ch}</span>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2 bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Share2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Generated Ad Copy</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">{plan?.assets ?? '—'}</p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center py-4">
          <div className="w-64 bg-slate-950 rounded-3xl border-2 border-slate-700 overflow-hidden shadow-xl">
            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-white">XAMK FINLAND</div>
                  <div className="text-[10px] text-slate-400">Sponsored</div>
                </div>
              </div>
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="w-full aspect-video bg-gradient-to-br from-blue-900/60 to-emerald-900/40 rounded-xl flex items-center justify-center border border-slate-700">
                <Sparkles className="w-8 h-8 text-white/40" />
              </div>
              <h3 className="text-sm font-bold text-white">{selectedCountry.name} — XAMK 2025</h3>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{plan?.assets}</p>
              <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors">
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
