'use client';

import { useEffect, useState } from 'react';

const FUNNEL = [
  { stage: 'New',       count: 384, color: '#3b82f6' },
  { stage: 'Contacted', count: 221, color: '#8b5cf6' },
  { stage: 'Applied',   count: 97,  color: '#f59e0b' },
  { stage: 'Enrolled',  count: 34,  color: '#16a34a' },
];

const BY_NATIONALITY = [
  { country: 'India',       leads: 94, color: '#f59e0b' },
  { country: 'China',       leads: 78, color: '#3b82f6' },
  { country: 'Pakistan',    leads: 52, color: '#14b8a6' },
  { country: 'Nigeria',     leads: 41, color: '#8b5cf6' },
  { country: 'Vietnam',     leads: 38, color: '#16a34a' },
  { country: 'Brazil',      leads: 27, color: '#dc2626' },
];

const CAMPAIGNS = [
  { name: 'South Asia — CS Push',   status: 'Active',  reach: '120K', budget: '€4,200' },
  { name: 'Korea — TikTok Blitz',   status: 'Active',  reach: '88K',  budget: '€2,800' },
  { name: 'Egypt — Facebook Wave',  status: 'Paused',  reach: '45K',  budget: '€1,100' },
  { name: 'Nigeria — SMS Campaign', status: 'Active',  reach: '22K',  budget: '€600'  },
  { name: 'Mali — Radio Spots',     status: 'Paused',  reach: '8K',   budget: '€300'  },
];

function FunnelBar({ stage, count, color, max }: { stage: string; count: number; color: string; max: number }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW((count / max) * 100), 100); return () => clearTimeout(t); }, [count, max]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 11, color: 'var(--text-secondary)', width: 72, flexShrink: 0 }}>{stage}</span>
      <div className="funnel-bar-track" style={{ flex: 1 }}>
        <div className="funnel-bar-fill" style={{ width: `${w}%`, background: color }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 500, width: 36, textAlign: 'right', flexShrink: 0 }}>{count}</span>
    </div>
  );
}

function NatBar({ country, leads, color, max }: { country: string; leads: number; color: string; max: number }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW((leads / max) * 100), 150); return () => clearTimeout(t); }, [leads, max]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 11, color: 'var(--text-secondary)', width: 68, flexShrink: 0 }}>{country}</span>
      <div className="funnel-bar-track" style={{ flex: 1, height: 20 }}>
        <div className="funnel-bar-fill" style={{ width: `${w}%`, background: color }} />
      </div>
      <span style={{ fontSize: 11, width: 28, textAlign: 'right', flexShrink: 0 }}>{leads}</span>
    </div>
  );
}

export default function AdminDashboardScreen() {
  const [campaigns, setCampaigns] = useState(CAMPAIGNS);
  const [overlay, setOverlay] = useState<'nationalities' | 'campaigns' | null>(null);
  const maxFunnel = FUNNEL[0].count;
  const maxNat = BY_NATIONALITY[0].leads;

  const toggleCampaignStatus = (name: string) => {
    setCampaigns(prev =>
      prev.map(c =>
        c.name === name
          ? { ...c, status: c.status === 'Active' ? 'Paused' : 'Active' }
          : c
      )
    );
  };

  return (
    <div className="content-area animate-in">
      {/* KPI row */}
      <div className="grid-4">
        {[
          { label: 'Total Leads', value: '384', sub: 'All time', trend: 'neu' },
          { label: 'Conversion Rate', value: '8.9%', sub: '+1.2% vs last month', trend: 'pos' },
          { label: 'Active Campaigns', value: '3', sub: '2 paused', trend: 'neu' },
          { label: 'Avg. Response Time', value: '1.4h', sub: '-18min vs last month', trend: 'pos' },
        ].map(k => (
          <div key={k.label} className="card">
            <p className="kpi-label">{k.label}</p>
            <p className="kpi-value">{k.value}</p>
            <p className={k.trend === 'pos' ? 'kpi-sub-pos' : k.trend === 'neg' ? 'kpi-sub-neg' : 'kpi-sub-neu'}>{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Funnel */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Pipeline funnel</span>
            <span className="status-pill pill-green">Live</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FUNNEL.map(f => <FunnelBar key={f.stage} {...f} max={maxFunnel} />)}
          </div>
          {/* Conversion tags */}
          <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Contact rate:</span>
            <span className="status-pill pill-blue" style={{ fontSize: 10 }}>57.5%</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 4 }}>Apply rate:</span>
            <span className="status-pill pill-amber" style={{ fontSize: 10 }}>43.9%</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 4 }}>Enroll rate:</span>
            <span className="status-pill pill-green" style={{ fontSize: 10 }}>35.1%</span>
          </div>
        </div>

        {/* Leads by nationality */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Leads by nationality</span>
            <button type="button" className="card-action" onClick={() => setOverlay('nationalities')}>See all</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {BY_NATIONALITY.map(n => <NatBar key={n.country} {...n} max={maxNat} />)}
          </div>
        </div>
      </div>

      {/* Active campaigns table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Active campaigns</span>
          <button type="button" className="card-action" onClick={() => setOverlay('campaigns')}>Manage all</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Status</th>
              <th>Reach</th>
              <th>Budget</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(c => (
              <tr key={c.name}>
                <td style={{ fontWeight: 500 }}>{c.name}</td>
                <td>
                  <span className={`lead-status ${c.status === 'Active' ? 'status-applied' : 'status-contacted'}`} style={{ marginLeft: 0 }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{c.reach}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{c.budget}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => toggleCampaignStatus(c.name)}
                    style={{ fontSize: 11, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    {c.status === 'Active' ? 'Pause' : 'Resume'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {overlay && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 50 }}>
          <div className="card" style={{ width: '100%', maxWidth: 760, maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="card-header">
              <span className="card-title">{overlay === 'nationalities' ? 'Lead breakdown by nationality' : 'Campaign manager'}</span>
              <button type="button" className="card-action" onClick={() => setOverlay(null)}>Close</button>
            </div>

            {overlay === 'nationalities' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 12px 12px' }}>
                {BY_NATIONALITY.map(n => (
                  <NatBar key={n.country} {...n} max={maxNat} />
                ))}
              </div>
            )}

            {overlay === 'campaigns' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Campaign</th>
                    <th>Status</th>
                    <th>Reach</th>
                    <th>Budget</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map(c => (
                    <tr key={c.name}>
                      <td style={{ fontWeight: 500 }}>{c.name}</td>
                      <td>
                        <span className={`lead-status ${c.status === 'Active' ? 'status-applied' : 'status-contacted'}`} style={{ marginLeft: 0 }}>
                          {c.status}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{c.reach}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{c.budget}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => toggleCampaignStatus(c.name)}
                          style={{ fontSize: 11, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          {c.status === 'Active' ? 'Pause' : 'Resume'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
