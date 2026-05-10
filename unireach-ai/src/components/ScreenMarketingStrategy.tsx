'use client';

import { useRef, useState } from 'react';
import FairRecommendationPanel from '@/components/FairRecommendationPanel';
import { exportHtmlElementToPdf } from '@/utils/exportPDF';

const TIERS: Record<number, { color: string; bg: string; label: string }> = {
  1: { color: '#1d4ed8', bg: '#dbeafe', label: 'Tier 1' },
  2: { color: '#92400e', bg: '#fef3c7', label: 'Tier 2' },
  3: { color: '#b91c1c', bg: '#fee2e2', label: 'Tier 3' },
};

const COUNTRIES = [
  { id: 'CN', name: 'China',       tier: 1, region: 'East Asia',       plan: 'WeChat + Douyin ads, partner with Gaokao prep centres, scholarship webinars.' },
  { id: 'IN', name: 'India',       tier: 1, region: 'South Asia',      plan: 'Google Search, JEE community engagement, influencer partnerships on YouTube.' },
  { id: 'KR', name: 'South Korea', tier: 1, region: 'East Asia',       plan: 'Instagram, TikTok video ads, LINE campaigns, K-influencer collaborations.' },
  { id: 'VN', name: 'Vietnam',     tier: 1, region: 'Southeast Asia',  plan: 'Facebook, Zalo, education fairs in Hanoi & Ho Chi Minh City.' },
  { id: 'EG', name: 'Egypt',       tier: 2, region: 'North Africa',    plan: 'Facebook, SMS fallback, embassy cooperation, Arabic content.' },
  { id: 'BR', name: 'Brazil',      tier: 2, region: 'South America',   plan: 'Instagram, WhatsApp broadcast lists, Portuguese content localisation.' },
  { id: 'PK', name: 'Pakistan',    tier: 2, region: 'South Asia',      plan: 'Facebook, Urdu SMS, university partnership portal.' },
  { id: 'NG', name: 'Nigeria',     tier: 2, region: 'West Africa',     plan: 'Twitter/X, WhatsApp, radio spots in Lagos & Abuja.' },
  { id: 'ML', name: 'Mali',        tier: 3, region: 'West Africa',     plan: 'Radio, embassy visits, USSD short codes, local agent network.' },
  { id: 'MM', name: 'Myanmar',     tier: 3, region: 'Southeast Asia',  plan: 'Viber, Facebook, offline print at universities.' },
];

const CHANNELS_BY_TIER: Record<number, string[]> = {
  1: ['Social Media Ads', 'Video Content', 'Search Engine', 'Influencer'],
  2: ['Facebook', 'SMS / WhatsApp', 'Email', 'Embassy'],
  3: ['Radio', 'Embassy', 'USSD', 'Agents'],
};

// Language mapping by country code
const COUNTRY_LANGUAGE_MAP: Record<string, { code: string; name: string; nativeName: string }> = {
  CN: { code: 'zh', name: 'Chinese', nativeName: '中文' },
  IN: { code: 'en', name: 'English', nativeName: 'English' },
  KR: { code: 'ko', name: 'Korean', nativeName: '한국어' },
  VN: { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  EG: { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  BR: { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  PK: { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  NG: { code: 'en', name: 'English', nativeName: 'English' },
  ML: { code: 'fr', name: 'French', nativeName: 'Français' },
  MM: { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ' },
};

// Sample ad images for each country
const COUNTRY_ADS: Record<string, { title: string; image: string; description: string }> = {
  CN: { title: '中文广告样本', image: '/ads/photo-china.jpeg', description: 'Chinese market ad sample' },
  IN: { title: 'English Ad Sample', image: '/ads/photo-india.jpeg', description: 'India market ad sample' },
  KR: { title: '한국어 광고 샘플', image: '/ads/photo-south korea.jpeg', description: 'Korean market ad sample' },
  VN: { title: 'Mẫu quảng cáo', image: '/ads/photo-berezilia.jpeg', description: 'Vietnamese market ad sample' },
  EG: { title: 'عينة إعلان', image: '/ads/photo-egypt.jpeg', description: 'Egyptian market ad sample' },
  BR: { title: 'Amostra de anúncio', image: '/ads/photo-brazil.jpeg', description: 'Brazilian market ad sample' },
  PK: { title: 'اشتہار کا نمونہ', image: '/ads/photo-pakestan.jpeg', description: 'Pakistani market ad sample' },
  NG: { title: 'Ad Sample', image: '/ads/photo-nijeria.jpeg', description: 'Nigerian market ad sample' },
  ML: { title: 'Exemple de publicité', image: '/ads/photo-mali.jpeg', description: 'Mali market ad sample' },
  MM: { title: 'ကြော်ငြာနမူနာ', image: '/ads/photo-miyuram.jpeg', description: 'Myanmar market ad sample' },
};

export default function MarketingStrategyScreen() {
  const [manualCountryIso, setManualCountryIso] = useState(COUNTRIES[0].id);
  const [launchedCampaigns, setLaunchedCampaigns] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const exportRef = useRef<HTMLDivElement | null>(null);

  const selectedCountry = COUNTRIES.find(c => c.id === manualCountryIso) ?? COUNTRIES[0];
  const selectedProgramme = selectedCountry.tier === 1 ? 'Computer Science' : selectedCountry.tier === 2 ? 'International Business' : 'Nursing';
  const reportCountry = selectedCountry.name;
  const reportProgramme = selectedProgramme;
  const reportScore = 82;
  const reportRanking = selectedCountry.tier === 1 ? 3 : selectedCountry.tier === 2 ? 7 : 12;
  const reportScoreBreakdown = {
    'Platform Engagement': 88,
    'Ad Recall': 79,
    'Lead Quality': 71,
    'Budget Efficiency': 83,
    'Cultural Fit': 76,
  };
  const reportReasons = [
    'Strong channel fit for the selected market.',
    'High demand for the chosen programme in the region.',
    'Low competition from other providers in key segments.',
  ];
  const reportChannels = CHANNELS_BY_TIER[selectedCountry.tier];
  const reportLanguage = COUNTRY_LANGUAGE_MAP[selectedCountry.id]?.name || 'English';
  const reportOutreachMethod = 'Localized social campaigns with campus webinars.';
  const campaignImageUrl = COUNTRY_ADS[selectedCountry.id]?.image;
  const reportTotalLeads = 84;
  const reportLeadsByNationality = [
    { country: 'India', count: 29 },
    { country: 'China', count: 23 },
    { country: 'Vietnam', count: 11 },
    { country: 'Nigeria', count: 8 },
  ];
  const reportFunnelStages = [
    { stage: 'New', count: 84, rate: '62.5%' },
    { stage: 'Contacted', count: 54, rate: '48.2%' },
    { stage: 'Applied', count: 28, rate: '32.1%' },
    { stage: 'Enrolled', count: 15, rate: '17.9%' },
  ];
  const reportConcerns = [
    'Housing concerns for overseas students.',
    'Visa uncertainty and processing delays.',
    'Affordability of tuition vs local competitors.',
    'Need for clear scholarship and fee transparency.',
  ];
  const reportEthicalSummary = [
    'Direct student communication',
    'Transparent tuition information',
    'Reduced agent dependency',
    'Multilingual support',
  ];

  const handleExportReport = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);
    try {
      const filename = `unireach-ai-report-${reportCountry.replace(/\s+/g, '-').toLowerCase()}-${reportProgramme.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      await exportHtmlElementToPdf(exportRef.current, filename);
      setExportSuccess(true);
      window.setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('PDF export failed', error);
    } finally {
      setIsExporting(false);
    }
  };

  const launchCampaign = () => {
    setLaunchedCampaigns(prev => prev.includes(selectedCountry.name) ? prev : [selectedCountry.name, ...prev]);
    setStatusMessage(`Campaign launched for ${selectedCountry.name}. Marketing content is now active.`);
  };

  return (
    <div className="content-area animate-in">
      {statusMessage && (
        <div className="card" style={{ marginBottom: 16, background: '#ecfdf5', borderColor: 'rgba(22,163,74,0.2)' }}>
          <div className="card-header">
            <span className="card-title" style={{ color: '#166534' }}>Campaign Status</span>
            <button type="button" className="card-action" onClick={() => setStatusMessage(null)}>Dismiss</button>
          </div>
          <p style={{ fontSize: 12, color: '#166534' }}>{statusMessage}</p>
        </div>
      )}

      <div className="grid-2" style={{ alignItems: 'start' }}>

        {/* Left — Country list acting as map proxy */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Pseudo world map header */}
          <div style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #e0f2fe 100%)', padding: '20px 16px 14px', borderBottom: 'var(--card-border)' }}>
            <p style={{ fontSize: 13, fontWeight: 500 }}>Global Target Markets</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Click a country to view its full marketing plan</p>
          </div>

          {/* Tier legend */}
          <div style={{ display: 'flex', gap: 8, padding: '10px 16px', borderBottom: 'var(--card-border)' }}>
            {[1,2,3].map(t => (
              <span key={t} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: TIERS[t].bg, color: TIERS[t].color, fontWeight: 500 }}>
                Tier {t}
              </span>
            ))}
          </div>

          {/* Country rows */}
          <div style={{ maxHeight: 420, overflowY: 'auto' }}>
            {COUNTRIES.map(c => (
              <div
                key={c.name}
                className="list-row"
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer',
                  background: selectedCountry.id === c.id ? 'rgba(59,130,246,0.05)' : 'transparent',
                  transition: 'background 0.15s',
                }}
                onClick={() => setManualCountryIso(c.id)}
              >
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: TIERS[c.tier].bg, color: TIERS[c.tier].color, fontWeight: 500, flexShrink: 0 }}>
                  Tier {c.tier}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 500 }}>{c.name}</p>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{c.region}</p>
                </div>
                <span style={{ fontSize: 11, color: 'var(--blue)' }}>→</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Detail panel */}
        <div className="card animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 8 }}>
            <div>
              <p style={{ fontSize: 18, fontFamily: 'var(--font-display)', fontWeight: 700 }}>{selectedCountry.name}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{selectedCountry.region}</p>
            </div>
            <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 100, background: TIERS[selectedCountry.tier].bg, color: TIERS[selectedCountry.tier].color, fontWeight: 500, flexShrink: 0 }}>
              {TIERS[selectedCountry.tier].label}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Programme</p>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{selectedProgramme}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                type="button"
                onClick={handleExportReport}
                disabled={isExporting}
                className="btn-primary"
                style={{ minWidth: 160 }}
              >
                {isExporting ? 'Generating PDF…' : 'Export PDF Report'}
              </button>
              {exportSuccess && <span className="text-sm text-emerald-600">PDF report generated successfully.</span>}
            </div>
          </div>

          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>RECOMMENDED STRATEGY</p>
            <p style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.6 }}>{selectedCountry.plan}</p>
          </div>

          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>PRIMARY CHANNELS</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {CHANNELS_BY_TIER[selectedCountry.tier].map(ch => (
                <span key={ch} style={{ fontSize: 11, padding: '3px 10px', background: '#f3f4f6', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 100, color: 'var(--text-secondary)' }}>
                  {ch}
                </span>
              ))}
            </div>
          </div>

          {/* Language & Ad Preview Section */}
          <div style={{ background: '#f0f4ff', border: '1px solid #dbeafe', borderRadius: 8, padding: '12px', overflow: 'hidden' }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>DETECTED LANGUAGE</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1d4ed8' }}>
                {COUNTRY_LANGUAGE_MAP[selectedCountry.id].nativeName}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                ({COUNTRY_LANGUAGE_MAP[selectedCountry.id].name})
              </span>
            </div>
            
            {/* Ad Sample Preview */}
            <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>SAMPLE AD</p>
            <div style={{ 
              background: 'white', 
              border: 'var(--card-border)', 
              borderRadius: 6, 
              overflow: 'hidden',
              minHeight: 240,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              fontSize: 12,
              position: 'relative'
            }}>
              <img 
                src={COUNTRY_ADS[selectedCountry.id]?.image || '/marketing-image.jpeg'} 
                alt={`${selectedCountry.name} ad sample`}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  padding: '8px'
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {!COUNTRY_ADS[selectedCountry.id]?.image && (
                <span>Ad preview not available</span>
              )}
            </div>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6, fontStyle: 'italic' }}>
              {COUNTRY_ADS[selectedCountry.id]?.description}
            </p>
          </div>

          <div style={{ background: '#f9fafb', border: 'var(--card-border)', borderRadius: 8, padding: '10px 12px' }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 4 }}>ESTIMATED REACH</p>
            <p style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-primary)' }}>
              {selectedCountry.tier === 1 ? '50K–200K' : selectedCountry.tier === 2 ? '10K–50K' : '1K–10K'}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>prospective students per year</p>
          </div>

          <button className="btn-primary" style={{ width: '100%', padding: '10px 0' }} type="button" onClick={launchCampaign}>
            {launchedCampaigns.includes(selectedCountry.name) ? 'Campaign Live' : 'Launch Campaign →'}
          </button>

          {launchedCampaigns.includes(selectedCountry.name) && (
            <p style={{ fontSize: 11, color: 'var(--green)', textAlign: 'center' }}>
              This campaign is now marked as active in the strategy workspace.
            </p>
          )}

          <FairRecommendationPanel countryId={selectedCountry.id} countryName={selectedCountry.name} />
        </div>
      </div>

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
            Selected Country: {reportCountry} · Programme: {reportProgramme}
          </p>
        </div>

        <section style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 16, marginBottom: 8, color: '#111827' }}>Section A — Market Intelligence Summary</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, marginBottom: 12 }}>
            <tbody>
              <tr>
                <td style={{ padding: 8, border: '1px solid #d1d5db', width: '40%', background: '#f9fafb' }}>Selected Country</td>
                <td style={{ padding: 8, border: '1px solid #d1d5db' }}>{reportCountry}</td>
              </tr>
              <tr>
                <td style={{ padding: 8, border: '1px solid #d1d5db', background: '#f9fafb' }}>Selected Programme</td>
                <td style={{ padding: 8, border: '1px solid #d1d5db' }}>{reportProgramme}</td>
              </tr>
              <tr>
                <td style={{ padding: 8, border: '1px solid #d1d5db', background: '#f9fafb' }}>Market Score</td>
                <td style={{ padding: 8, border: '1px solid #d1d5db' }}>{reportScore} / 100</td>
              </tr>
              <tr>
                <td style={{ padding: 8, border: '1px solid #d1d5db', background: '#f9fafb' }}>Ranking Position</td>
                <td style={{ padding: 8, border: '1px solid #d1d5db' }}>{reportRanking}</td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Score Breakdown</p>
            {Object.entries(reportScoreBreakdown).map(([label, value]) => (
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
              {reportReasons.map(reason => (
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
                <td style={{ padding: 8, border: '1px solid #d1d5db' }}>{TIERS[selectedCountry.tier].label}</td>
              </tr>
              <tr>
                <td style={{ padding: 8, border: '1px solid #d1d5db', background: '#f9fafb' }}>Recommended Channels</td>
                <td style={{ padding: 8, border: '1px solid #d1d5db' }}>{reportChannels.join(', ')}</td>
              </tr>
              <tr>
                <td style={{ padding: 8, border: '1px solid #d1d5db', background: '#f9fafb' }}>Campaign Language</td>
                <td style={{ padding: 8, border: '1px solid #d1d5db' }}>{reportLanguage}</td>
              </tr>
              <tr>
                <td style={{ padding: 8, border: '1px solid #d1d5db', background: '#f9fafb' }}>Suggested Outreach Method</td>
                <td style={{ padding: 8, border: '1px solid #d1d5db' }}>{reportOutreachMethod}</td>
              </tr>
            </tbody>
          </table>
          {campaignImageUrl && (
            <div style={{ marginTop: 8 }}>
              <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Campaign Preview Image</p>
              <img src={campaignImageUrl} alt="Campaign preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8, border: '1px solid #d1d5db' }} />
            </div>
          )}
        </section>

        <section style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 16, marginBottom: 8, color: '#111827' }}>Section C — Lead & Pipeline Summary</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, marginBottom: 12 }}>
            <tbody>
              <tr>
                <td style={{ padding: 8, border: '1px solid #d1d5db', width: '40%', background: '#f9fafb' }}>Total Leads</td>
                <td style={{ padding: 8, border: '1px solid #d1d5db' }}>{reportTotalLeads}</td>
              </tr>
              <tr>
                <td style={{ padding: 8, border: '1px solid #d1d5db', background: '#f9fafb' }}>Funnel Stages</td>
                <td style={{ padding: 8, border: '1px solid #d1d5db' }}>{reportFunnelStages.map(stage => stage.stage).join(' → ')}</td>
              </tr>
              <tr>
                <td style={{ padding: 8, border: '1px solid #d1d5db', background: '#f9fafb' }}>Conversion Rates</td>
                <td style={{ padding: 8, border: '1px solid #d1d5db' }}>{reportFunnelStages.map(stage => `${stage.stage}: ${stage.rate}`).join(', ')}</td>
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
                {reportLeadsByNationality.map(item => (
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
            {reportConcerns.map(concern => (
              <li key={concern} style={{ marginBottom: 4 }}>{concern}</li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 16, marginBottom: 8, color: '#111827' }}>Section E — Ethical Recruitment Summary</h2>
          <ul style={{ margin: 0, paddingLeft: 18, color: '#374151', fontSize: 11 }}>
            {reportEthicalSummary.map(item => (
              <li key={item} style={{ marginBottom: 4 }}>✅ {item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
