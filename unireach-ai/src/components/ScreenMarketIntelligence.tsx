'use client';

import { useEffect, useRef, useState } from 'react';
import CountryScoreBreakdownPanel from '@/components/CountryScoreBreakdownPanel';
import { exportHtmlElementToPdf } from '@/utils/exportPDF';

// ── Data ──────────────────────────────────────────────────────────
const COUNTRIES = [
  { id: 'CN', flag: '🇨🇳', name: 'China',       major: 'Information Technology', score: 94, color: '#3b82f6', region: 'Asia' },
  { id: 'IN', flag: '🇮🇳', name: 'India',       major: 'Mechanical Engineering',      score: 89, color: '#14b8a6', region: 'Asia' },
  { id: 'PK', flag: '🇵🇰', name: 'Pakistan',    major: 'Nursing',         score: 81, color: '#8b5cf6', region: 'Asia' },
  { id: 'VN', flag: '🇻🇳', name: 'Vietnam',     major: 'Information Technology', score: 77, color: '#3b82f6', region: 'Asia' },
  { id: 'NG', flag: '🇳🇬', name: 'Nigeria',     major: 'International Business',      score: 72, color: '#14b8a6', region: 'Africa' },
  { id: 'BR', flag: '🇧🇷', name: 'Brazil',      major: 'Tourism', score: 76, color: '#f59e0b', region: 'South America' },
  { id: 'DE', flag: '🇩🇪', name: 'Germany',     major: 'Mechanical Engineering', score: 85, color: '#14b8a6', region: 'Europe' },
  { id: 'ID', flag: '🇮🇩', name: 'Indonesia',   major: 'Maritime Management', score: 73, color: '#8b5cf6', region: 'Asia' },
  { id: 'BD', flag: '🇧🇩', name: 'Bangladesh',  major: 'Nursing', score: 70, color: '#8b5cf6', region: 'Asia' },
];

const STRATEGY_ROWS = [
  { tier: 1, country: 'South Korea', channels: 'Instagram · TikTok · Video ads' },
  { tier: 1, country: 'Japan',       channels: 'LINE · YouTube · Influencer' },
  { tier: 2, country: 'Egypt',       channels: 'Facebook · SMS fallback' },
  { tier: 2, country: 'Brazil',      channels: 'Instagram · WhatsApp' },
  { tier: 3, country: 'Mali',        channels: 'Radio · Embassy · USSD' },
];

const LEADS = [
  { initials: 'AK', color: '#3b82f6', name: 'Aiko Kimura',    sub: 'Japan — Computer Science',    status: 'New' },
  { initials: 'RS', color: '#14b8a6', name: 'Rahul Sharma',   sub: 'India — Engineering',          status: 'Contacted' },
  { initials: 'FD', color: '#8b5cf6', name: 'Fatima Diallo',  sub: 'Senegal — Medicine',           status: 'Applied' },
  { initials: 'LW', color: '#f59e0b', name: 'Li Wei',         sub: 'China — Computer Science',    status: 'New' },
];

const BY_NATIONALITY = [
  { country: 'India', leads: 94 },
  { country: 'China', leads: 78 },
  { country: 'Pakistan', leads: 52 },
  { country: 'Nigeria', leads: 41 },
  { country: 'Vietnam', leads: 38 },
  { country: 'Brazil', leads: 27 },
];

// ── Animated number ───────────────────────────────────────────────
interface KpiData {
  label: string;
  value: number;
  sub: string;
  trend: 'pos' | 'neg' | 'neu';
}

function KpiCard({ label, value, sub, trend }: KpiData) {
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let start = 0;
    const step = Math.ceil(value / 40);
    const t = setInterval(() => {
      start = Math.min(start + step, value);
      setDisplay(start);
      if (start >= value) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [value]);

  return (
    <div className="card">
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">{display.toLocaleString()}</p>
      <p className={trend === 'pos' ? 'kpi-sub-pos' : trend === 'neg' ? 'kpi-sub-neg' : 'kpi-sub-neu'}>{sub}</p>
    </div>
  );
}

// ── Score bar ─────────────────────────────────────────────────────
function ScoreBar({ score, color }: { score: number; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(score), 100); return () => clearTimeout(t); }, [score]);
  return (
    <div className="score-bar-track">
      <div className="score-bar-fill" style={{ width: `${width}%`, background: color }} />
    </div>
  );
}

// ── Status pill ───────────────────────────────────────────────────
function LeadPill({ status }: { status: string }) {
  const cls = status === 'New' ? 'status-new' : status === 'Contacted' ? 'status-contacted' : status === 'Applied' ? 'status-applied' : 'status-enrolled';
  return <span className={`lead-status ${cls}`}>{status}</span>;
}

// ── Chat preview ──────────────────────────────────────────────────
function MiniChat() {
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState([
    { role: 'bot',  text: 'Hello! How can I help you with XAMK admissions?' },
    { role: 'user', text: 'What are the tuition fees for international students?' },
    { role: 'bot',  text: 'Tuition starts at €8,000/year. Scholarships are available covering up to 50%.' },
  ]);

  const send = () => {
    if (!input.trim()) return;
    setMsgs(p => [...p, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => setMsgs(p => [...p, { role: 'bot', text: 'Great question! Our team will follow up with full details.' }]), 700);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
        {msgs.map((m, i) => (
          <div key={i} className={m.role === 'bot' ? 'chat-bubble-bot' : 'chat-bubble-user'}>{m.text}</div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
        <input
          className="form-input" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask about admissions…"
          style={{ flex: 1 }}
        />
        <button className="btn-primary" onClick={send}>Send</button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────
export default function MarketIntelligenceScreen() {
  const [expandedPanel, setExpandedPanel] = useState<'countries' | 'strategies' | 'leads' | null>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [dashboardData, setDashboardData] = useState<{
    total_leads: number;
    countries_scanned: number;
    leads_by_status: { new: number; contacted: number; applied: number; enrolled: number };
  } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const exportRef = useRef<HTMLDivElement | null>(null);

  // Fetch dashboard summary on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

        const response = await fetch('http://localhost:8000/dashboard/summary', {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        // Silently handle network errors - backend not available
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            console.log('Backend request timed out - using fallback data');
          } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            // Network error - backend not running
          } else {
            console.error('Dashboard data fetch error:', error);
          }
        } else {
          console.error('Dashboard data fetch error:', error);
        }

        // Always use fallback data
        setDashboardData({
          total_leads: 247,
          countries_scanned: 142,
          leads_by_status: { new: 156, contacted: 67, applied: 24, enrolled: 0 }
        });
      }
    };

    fetchDashboardData();
  }, []);

  const openAdmissionsChat = () => {
    window.location.hash = 'chatbot';
  };

  const filteredCountries = COUNTRIES.filter(c => selectedRegion === 'All' || c.region === selectedRegion);

  const selectedCountry = COUNTRIES.find(c => c.id === selectedCountryId) ?? COUNTRIES[0];
  const selectedProgramme = selectedCountry.major;
  const rankingPosition = COUNTRIES.filter(c => c.score > selectedCountry.score).length + 1;
  const scoreBreakdown = {
    'Economic Strength': selectedCountry.score - 4,
    'Education Quality': selectedCountry.score - 10,
    'Language Proficiency': Math.max(60, selectedCountry.score - 15),
    'Demand': Math.min(100, selectedCountry.score + 5),
    'Competition': Math.max(35, 100 - selectedCountry.score),
  };
  const reasons = [
    `${selectedCountry.name} demonstrates strong demand for ${selectedCountry.major}.`,
    'High employability and industry alignment with the programme.',
    'Low agent dependency expected due to strong direct outreach channels.',
  ];
  const exportCampaignImageUrl = '/marketing-image.jpeg';
  const leadsByNationality = BY_NATIONALITY.map(n => ({ country: n.country, count: n.leads }));
  const funnelStages = [
    { stage: 'New', count: 384, rate: '57.5%' },
    { stage: 'Contacted', count: 221, rate: '43.9%' },
    { stage: 'Applied', count: 97, rate: '35.1%' },
    { stage: 'Enrolled', count: 34, rate: '25.4%' },
  ];
  const studentConcerns = [
    'Housing concerns among international applicants.',
    'Visa uncertainty and processing delays.',
    'Tuition affordability compared to competitors.',
    'Competitor comparison on scholarships and support.',
  ];
  const ethicalSummary = [
    'Direct student communication',
    'Transparent tuition information',
    'Reduced agent dependency',
    'Multilingual support',
  ];

  const handleExportReport = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);
    try {
      const filename = `unireach-ai-report-${selectedCountry.name.replace(/\s+/g, '-').toLowerCase()}-${selectedProgramme.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      await exportHtmlElementToPdf(exportRef.current, filename);
      setExportSuccess(true);
      window.setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('PDF export failed', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Calculate dynamic KPIs based on real data
  const getDynamicKPIs = () => {
    if (!dashboardData) {
      return [
        { label: 'Countries Analyzed', value: 142, sub: 'Loading...', trend: 'neu' as const },
        { label: 'Top Target Countries', value: 28, sub: 'Loading...', trend: 'neu' as const },
        { label: 'Leads This Month', value: 247, sub: 'Loading...', trend: 'neu' as const },
        { label: 'Active Campaigns', value: 74, sub: 'Loading...', trend: 'neu' as const },
      ];
    }

    const countriesAnalyzed = dashboardData.countries_scanned;
    const topTargetCountries = COUNTRIES.filter(c => c.score >= 80).length; // Countries with score >= 80
    const leadsThisMonth = dashboardData.total_leads;
    const activeCampaigns = Math.max(1, Math.floor(dashboardData.total_leads * 0.3)); // At least 1 campaign

    return [
      {
        label: 'Countries Analyzed',
        value: countriesAnalyzed,
        sub: `+${Math.floor(countriesAnalyzed * 0.08)} this month`,
        trend: 'pos' as const
      },
      {
        label: 'Top Target Countries',
        value: topTargetCountries,
        sub: 'Ranked by demand',
        trend: 'neu' as const
      },
      {
        label: 'Leads This Month',
        value: leadsThisMonth,
        sub: leadsThisMonth > 0 ? `+${Math.floor(leadsThisMonth * 0.23)}% vs last month` : 'No data',
        trend: leadsThisMonth > 0 ? 'pos' as const : 'neu' as const
      },
      {
        label: 'Active Campaigns',
        value: activeCampaigns,
        sub: `${Math.floor(activeCampaigns * 0.33)} paused`,
        trend: activeCampaigns > 20 ? 'pos' as const : 'neg' as const
      },
    ];
  };

  const dynamicKPIs = getDynamicKPIs();

  return (
    <div className="content-area animate-in">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl font-semibold">Market Intelligence</h1>
          <p className="text-sm text-gray-500">Export your current country and score data to PDF.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={handleExportReport}
            disabled={isExporting}
            className="btn-primary"
          >
            {isExporting ? 'Generating PDF…' : 'Export PDF Report'}
          </button>
          {exportSuccess && <span className="text-sm text-emerald-600">PDF report generated successfully.</span>}
        </div>
      </div>

      {/* Row 1 — KPIs */}
      <div className="grid-4">
        {dynamicKPIs.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Row 2 */}
      <div className="grid-2">
        {/* Top countries */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Top countries by major</span>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select
                value={selectedRegion}
                onChange={e => setSelectedRegion(e.target.value)}
                style={{ fontSize: 12, padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 4, background: 'white' }}
              >
                <option value="All">All Regions</option>
                {Array.from(new Set(COUNTRIES.map(c => c.region))).map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <button type="button" className="card-action" onClick={() => setExpandedPanel('countries')}>See all</button>
            </div>
          </div>
          {filteredCountries.map(c => (
            <button
              key={c.id}
              type="button"
              className="list-row w-full text-left transition hover:bg-slate-50/60"
              onClick={() => setSelectedCountryId(c.id)}
            >
              <span style={{ fontSize: 16 }}>{c.flag}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.major}</p>
              </div>
              <ScoreBar score={c.score} color={c.color} />
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', width: 24, textAlign: 'right', flexShrink: 0 }}>{c.score}</span>
            </button>
          ))}
        </div>

        {/* Strategy by tier */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Marketing strategy by tier</span>
            <button type="button" className="card-action" onClick={() => setExpandedPanel('strategies')}>See all</button>
          </div>
          {STRATEGY_ROWS.map(s => (
            <div key={s.country} className="list-row">
              <span className={`tier-badge tier-${s.tier}`}>Tier {s.tier}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 500 }}>{s.country}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.channels}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid-2">
        {/* Recent leads */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent leads</span>
            <button type="button" className="card-action" onClick={() => setExpandedPanel('leads')}>See all</button>
          </div>
          {LEADS.map(l => (
            <div key={l.name} className="list-row">
              <div className="lead-avatar" style={{ background: l.color }}>{l.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 500 }}>{l.name}</p>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.sub}</p>
              </div>
              <LeadPill status={l.status} />
            </div>
          ))}
        </div>

        {/* Mini chat */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Admissions chatbot</span>
            <button type="button" className="card-action" onClick={openAdmissionsChat}>Open full</button>
          </div>
          <MiniChat />
        </div>
      </div>

      {expandedPanel && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 50 }}>
          <div className="card" style={{ width: '100%', maxWidth: 760, maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="card-header">
              <span className="card-title">
                {expandedPanel === 'countries' && 'All target countries'}
                {expandedPanel === 'strategies' && 'All marketing tiers'}
                {expandedPanel === 'leads' && 'All recent leads'}
              </span>
              <button type="button" className="card-action" onClick={() => setExpandedPanel(null)}>Close</button>
            </div>

            {expandedPanel === 'countries' && filteredCountries.map(c => (
              <button
                key={c.id}
                type="button"
                className="list-row w-full text-left transition hover:bg-slate-50/60"
                onClick={() => {
                  setExpandedPanel(null);
                  setSelectedCountryId(c.id);
                }}
              >
                <span style={{ fontSize: 18 }}>{c.flag}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.major}</p>
                </div>
                <ScoreBar score={c.score} color={c.color} />
                <span style={{ fontSize: 12, fontWeight: 600, width: 36, textAlign: 'right' }}>{c.score}</span>
              </button>
            ))}

            {expandedPanel === 'strategies' && STRATEGY_ROWS.map(s => (
              <div key={s.country} className="list-row">
                <span className={`tier-badge tier-${s.tier}`}>Tier {s.tier}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{s.country}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.channels}</p>
                </div>
              </div>
            ))}

            {expandedPanel === 'leads' && LEADS.map(l => (
              <div key={l.name} className="list-row">
                <div className="lead-avatar" style={{ background: l.color }}>{l.initials}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{l.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l.sub}</p>
                </div>
                <LeadPill status={l.status} />
              </div>
            ))}
          </div>
        </div>
      )}
      <CountryScoreBreakdownPanel
        countryId={selectedCountryId!}
        open={selectedCountryId !== null}
        onClose={() => setSelectedCountryId(null)}
      />

      <div
        ref={exportRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: 900,
          padding: 24,
          background: '#ffffff',
          color: '#111827',
          boxSizing: 'border-box',
        }}
        aria-hidden="true"
      >
        <div style={{ borderBottom: '2px solid #111827', paddingBottom: 12, marginBottom: 20 }}>
          <h1 style={{ fontSize: 24, margin: 0 }}>UniReach AI Recruitment Intelligence Report</h1>
          <p style={{ fontSize: 12, margin: '8px 0 0', color: '#4b5563' }}>
            Date generated: {new Date().toLocaleDateString()}
          </p>
          <p style={{ fontSize: 12, margin: '4px 0 0', color: '#4b5563' }}>
            Selected Country: {selectedCountry.name} · Programme: {selectedProgramme}
          </p>
        </div>

        <section style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 16, marginBottom: 8, color: '#111827' }}>Section A — Market Intelligence Summary</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, marginBottom: 12 }}>
            <tbody>
              <tr>
                <td style={{ padding: 8, border: '1px solid #d1d5db', width: '40%', background: '#f9fafb' }}>Selected Country</td>
                <td style={{ padding: 8, border: '1px solid #d1d5db' }}>{selectedCountry.name}</td>
              </tr>
              <tr>
                <td style={{ padding: 8, border: '1px solid #d1d5db', background: '#f9fafb' }}>Selected Programme</td>
                <td style={{ padding: 8, border: '1px solid #d1d5db' }}>{selectedProgramme}</td>
              </tr>
              <tr>
                <td style={{ padding: 8, border: '1px solid #d1d5db', background: '#f9fafb' }}>Market Score</td>
                <td style={{ padding: 8, border: '1px solid #d1d5db' }}>{selectedCountry.score} / 100</td>
              </tr>
              <tr>
                <td style={{ padding: 8, border: '1px solid #d1d5db', background: '#f9fafb' }}>Ranking Position</td>
                <td style={{ padding: 8, border: '1px solid #d1d5db' }}>{rankingPosition}</td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Score Breakdown</p>
            {Object.entries(scoreBreakdown).map(([label, value]) => (
              <div key={label} style={{ marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#374151' }}>
                  <span>{label}</span>
                  <span>{value}%</span>
                </div>
                <div style={{ height: 8, background: '#e5e7eb', borderRadius: 4 }}>
                  <div style={{ width: `${value}%`, height: '100%', background: '#2563eb', borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Why Recommended</p>
            <ul style={{ margin: 0, paddingLeft: 18, color: '#374151', fontSize: 11 }}>
              {reasons.map(reason => (
                <li key={reason} style={{ marginBottom: 4 }}>{reason}</li>
              ))}
            </ul>
          </div>
        </section>

        <section style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 16, marginBottom: 8, color: '#111827' }}>Section B — Marketing Strategy</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, marginBottom: 12 }}>
            <tbody>
              <tr>
                <td style={{ padding: 8, border: '1px solid #d1d5db', width: '40%', background: '#f9fafb' }}>Country Tier</td>
                <td style={{ padding: 8, border: '1px solid #d1d5db' }}>{selectedCountry.score >= 85 ? 'Tier 1' : selectedCountry.score >= 75 ? 'Tier 2' : 'Tier 3'}</td>
              </tr>
              <tr>
                <td style={{ padding: 8, border: '1px solid #d1d5db', background: '#f9fafb' }}>Recommended Channels</td>
                <td style={{ padding: 8, border: '1px solid #d1d5db' }}>{['Social Media', 'Search Ads', 'Webinars', 'Partnerships'].join(', ')}</td>
              </tr>
              <tr>
                <td style={{ padding: 8, border: '1px solid #d1d5db', background: '#f9fafb' }}>Campaign Language</td>
                <td style={{ padding: 8, border: '1px solid #d1d5db' }}>English</td>
              </tr>
              <tr>
                <td style={{ padding: 8, border: '1px solid #d1d5db', background: '#f9fafb' }}>Suggested Outreach Method</td>
                <td style={{ padding: 8, border: '1px solid #d1d5db' }}>Targeted digital events and campus webinar sessions</td>
              </tr>
            </tbody>
          </table>
          {exportCampaignImageUrl && (
            <div style={{ marginTop: 8 }}>
              <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Campaign Preview Image</p>
              <img src={exportCampaignImageUrl} alt="Campaign preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8, border: '1px solid #d1d5db' }} />
            </div>
          )}
        </section>

        <section style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 16, marginBottom: 8, color: '#111827' }}>Section C — Lead & Pipeline Summary</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, marginBottom: 12 }}>
            <tbody>
              <tr>
                <td style={{ padding: 8, border: '1px solid #d1d5db', width: '40%', background: '#f9fafb' }}>Total Leads</td>
                <td style={{ padding: 8, border: '1px solid #d1d5db' }}>{dashboardData?.total_leads ?? 247}</td>
              </tr>
              <tr>
                <td style={{ padding: 8, border: '1px solid #d1d5db', background: '#f9fafb' }}>Funnel Stages</td>
                <td style={{ padding: 8, border: '1px solid #d1d5db' }}>{funnelStages.map(stage => stage.stage).join(' → ')}</td>
              </tr>
              <tr>
                <td style={{ padding: 8, border: '1px solid #d1d5db', background: '#f9fafb' }}>Conversion Rates</td>
                <td style={{ padding: 8, border: '1px solid #d1d5db' }}>{funnelStages.map(stage => `${stage.stage}: ${stage.rate}`).join(', ')}</td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Leads by Nationality</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: 8, border: '1px solid #d1d5db', background: '#f9fafb' }}>Country</th>
                  <th style={{ textAlign: 'right', padding: 8, border: '1px solid #d1d5db', background: '#f9fafb' }}>Count</th>
                </tr>
              </thead>
              <tbody>
                {leadsByNationality.map(item => (
                  <tr key={item.country}>
                    <td style={{ padding: 8, border: '1px solid #d1d5db' }}>{item.country}</td>
                    <td style={{ padding: 8, border: '1px solid #d1d5db', textAlign: 'right' }}>{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 16, marginBottom: 8, color: '#111827' }}>Section D — Callback & Applicant Insights</h2>
          <p style={{ fontSize: 12, marginBottom: 8 }}>Common student concerns:</p>
          <ul style={{ margin: 0, paddingLeft: 18, color: '#374151', fontSize: 11 }}>
            {studentConcerns.map(concern => (
              <li key={concern} style={{ marginBottom: 4 }}>{concern}</li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 16, marginBottom: 8, color: '#111827' }}>Section E — Ethical Recruitment Summary</h2>
          <ul style={{ margin: 0, paddingLeft: 18, color: '#374151', fontSize: 11 }}>
            {ethicalSummary.map(item => (
              <li key={item} style={{ marginBottom: 4 }}>✅ {item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
