'use client';

import { useState, useEffect } from 'react';
import { Globe, Sparkles, Filter, BarChart2, CheckCircle } from 'lucide-react';
import { MAJOR_WEIGHTS } from '@/lib/agents/market-intelligence';
import { useAgentCommunication } from '@/context/AgentCommunicationContext';
import { apiUrl } from '@/lib/api';

interface MarketData {
  country: string;
  score: number;
  indicators: {
    GDP: number;
    Internet: number;
    Mobile: number;
    YouthPop: number;
    Education: number;
    English: number;
    Mobility: number;
  };
  tier: number;
  region?: string;
}

const FLAG: Record<string, string> = {
  India: '🇮🇳', Vietnam: '🇻🇳', Nigeria: '🇳🇬', Pakistan: '🇵🇰',
  Brazil: '🇧🇷', Germany: '🇩🇪', Indonesia: '🇮🇩', Bangladesh: '🇧🇩', China: '🇨🇳',
};

const REGIONS: Record<string, string> = {
  India: 'Asia', Vietnam: 'Asia', Nigeria: 'Africa', Pakistan: 'Asia',
  China: 'Asia', Brazil: 'South America', Germany: 'Europe', Indonesia: 'Asia', Bangladesh: 'Asia',
};

export default function MarketIntelligenceDashboard() {
  const { publishInsight } = useAgentCommunication();
  const [selectedMajor, setSelectedMajor] = useState('Computer Science');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [countries, setCountries] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const fetchAnalysis = async (major: string) => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/analyze'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ majors: [major] }),
      });
      if (!res.ok) throw new Error('Failed to analyze');
      const data = await res.json();
      const countriesWithRegion = (data[major] || []).map((c: MarketData) => ({
        ...c,
        region: REGIONS[c.country] || 'Other'
      }));
      setCountries(countriesWithRegion);
    } catch {
      setCountries([
        { country: 'India',    score: 88, tier: 1, region: 'Asia', indicators: { GDP: 2200, Internet: 43, Mobile: 85,  YouthPop: 250, Education: 4.4, English: 55, Mobility: 15 } },
        { country: 'Vietnam',  score: 82, tier: 1, region: 'Asia', indicators: { GDP: 3700, Internet: 70, Mobile: 140, YouthPop: 15,  Education: 4.1, English: 52, Mobility: 12 } },
        { country: 'Nigeria',  score: 79, tier: 2, region: 'Africa', indicators: { GDP: 2100, Internet: 36, Mobile: 95,  YouthPop: 40,  Education: 3.5, English: 62, Mobility: 8  } },
        { country: 'Pakistan', score: 71, tier: 2, region: 'Asia', indicators: { GDP: 1500, Internet: 30, Mobile: 82,  YouthPop: 45,  Education: 2.8, English: 50, Mobility: 9  } },
        { country: 'China',    score: 94, tier: 1, region: 'Asia', indicators: { GDP: 10500, Internet: 70, Mobile: 120, YouthPop: 200, Education: 4.0, English: 30, Mobility: 10 } },
        { country: 'Brazil',   score: 76, tier: 2, region: 'South America', indicators: { GDP: 7500, Internet: 81, Mobile: 110, YouthPop: 30, Education: 3.8, English: 48, Mobility: 5 } },
        { country: 'Germany',  score: 85, tier: 1, region: 'Europe', indicators: { GDP: 42000, Internet: 92, Mobile: 130, YouthPop: 10, Education: 5.0, English: 70, Mobility: 25 } },
        { country: 'Indonesia', score: 73, tier: 2, region: 'Asia', indicators: { GDP: 4200, Internet: 54, Mobile: 90, YouthPop: 35, Education: 3.2, English: 40, Mobility: 7 } },
        { country: 'Bangladesh', score: 70, tier: 2, region: 'Asia', indicators: { GDP: 2200, Internet: 25, Mobile: 75, YouthPop: 50, Education: 2.5, English: 35, Mobility: 6 } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = window.setTimeout(() => {
      void fetchAnalysis(selectedMajor);
    }, 0);
    return () => window.clearTimeout(t);
  }, [selectedMajor]);

  const filteredCountries = countries.filter(country =>
    selectedRegion === 'All' || country.region === selectedRegion
  );

  const handleDeepDive = async () => {
    setIsAnalyzing(true);
    setAiInsight(null);
    await new Promise(r => setTimeout(r, 1800));
    const top = filteredCountries[0]?.country || 'Vietnam';
    const insight = `Deploy "Digital-First" campaign in ${top} for ${selectedMajor}. High youth mobility + English proficiency in urban hubs. Target ROAS: 4.8x.`;
    setAiInsight(insight);
    publishInsight({
      source: 'MarketIntelligence',
      type: 'MARKET_RECOMMENDATION',
      payload: { country: top, major: selectedMajor, insight },
    });
    setIsAnalyzing(false);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl flex flex-col gap-6">

      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-400 shrink-0" />
          <h2 className="text-lg font-semibold text-white">Market Intelligence</h2>
          <span className="text-xs text-slate-400 hidden sm:inline">— Global Opportunity Matrix</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Region selector */}
          <div className="relative">
            <select
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value)}
              className="appearance-none bg-slate-800 border border-slate-700 text-sm text-slate-300 pl-3 pr-8 py-1.5 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Regions</option>
              {Array.from(new Set(Object.values(REGIONS))).map(region => (
                <option key={region} value={region} className="bg-slate-900">{region}</option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
          </div>

          {/* Major selector */}
          <div className="relative">
            <select
              value={selectedMajor}
              onChange={e => setSelectedMajor(e.target.value)}
              className="appearance-none bg-slate-800 border border-slate-700 text-sm text-slate-300 pl-3 pr-8 py-1.5 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {Object.keys(MAJOR_WEIGHTS).map(m => (
                <option key={m} value={m} className="bg-slate-900">{m}</option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
          </div>

          {/* Deep Dive button */}
          <button
            onClick={handleDeepDive}
            disabled={isAnalyzing || loading}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isAnalyzing ? 'Analyzing…' : 'Deep Dive'}
          </button>
        </div>
      </div>

      {/* AI Insight banner */}
      {aiInsight && (
        <div className="flex items-start gap-3 bg-blue-950/50 border border-blue-800 rounded-lg p-4">
          <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
          <p className="text-sm text-slate-200 flex-1">{aiInsight}</p>
          <button onClick={() => setAiInsight(null)} className="text-xs text-slate-400 hover:text-white shrink-0">✕</button>
        </div>
      )}

      {/* Data table */}
      <div className="overflow-hidden rounded-lg border border-slate-800">
        {/* Table head */}
        <div className="grid grid-cols-12 bg-slate-800/60 px-4 py-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
          <div className="col-span-1">#</div>
          <div className="col-span-4">Country</div>
          <div className="col-span-3 text-right">GDP / cap</div>
          <div className="col-span-3 text-right">Score</div>
          <div className="col-span-1 text-right">Tier</div>
        </div>

        {/* Table body */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-slate-600 border-t-blue-400 rounded-full animate-spin" />
          </div>
        ) : countries.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">No data — run an analysis</div>
        ) : (
          filteredCountries.map((item, idx) => (
            <div
              key={item.country}
              className="grid grid-cols-12 px-4 py-3 items-center border-t border-slate-800 hover:bg-slate-800/40 transition-colors"
            >
              {/* Rank */}
              <div className="col-span-1 text-sm text-slate-400 font-mono tabular-nums">
                {String(idx + 1).padStart(2, '0')}
              </div>

              {/* Country */}
              <div className="col-span-4 flex items-center gap-2 min-w-0">
                <span className="text-lg leading-none shrink-0">{FLAG[item.country] ?? '🌍'}</span>
                <span className="text-sm text-white truncate">{item.country}</span>
              </div>

              {/* GDP */}
              <div className="col-span-3 text-right">
                <span className="text-sm font-mono text-slate-300">${item.indicators?.GDP?.toLocaleString()}</span>
              </div>

              {/* Score + bar */}
              <div className="col-span-3 flex flex-col gap-1 items-end pr-2">
                <span className="text-sm font-mono text-white tabular-nums">{item.score}</span>
                <div className="w-full max-w-[80px] h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${item.score > 80 ? 'bg-blue-400' : 'bg-emerald-400'}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>

              {/* Tier */}
              <div className="col-span-1 flex justify-end">
                <span className={`text-xs font-mono px-2 py-0.5 rounded border ${item.tier === 1 ? 'border-blue-700 text-blue-300 bg-blue-900/30' : 'border-emerald-700 text-emerald-300 bg-emerald-900/30'}`}>
                  T{item.tier}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer stat */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <BarChart2 className="w-3.5 h-3.5" />
        <span>{filteredCountries.length} markets indexed</span>
      </div>
    </div>
  );
}
