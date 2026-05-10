'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Lazy-load screens
const ScreenMarketIntelligence = dynamic(() => import('@/components/ScreenMarketIntelligence'), { ssr: false });
const ScreenMarketingStrategy  = dynamic(() => import('@/components/ScreenMarketingStrategy'),  { ssr: false });
const ScreenLeadCapture        = dynamic(() => import('@/components/ScreenLeadCapture'),         { ssr: false });
const ScreenAdmissionsChat     = dynamic(() => import('@/components/ScreenAdmissionsChat'),      { ssr: false });
const ScreenAdminDashboard     = dynamic(() => import('@/components/ScreenAdminDashboard'),      { ssr: false });

// ── Nav config ────────────────────────────────────────────────────
type NavItem = { id: string; label: string; dot: string; section: string };

const NAV: NavItem[] = [
  { id: 'market',    label: 'Market Intelligence', dot: '#3b82f6', section: 'Intelligence' },
  { id: 'strategy',  label: 'Marketing Strategy',  dot: '#14b8a6', section: 'Pipeline' },
  { id: 'capture',   label: 'Lead Capture',         dot: '#f59e0b', section: 'Pipeline' },
  { id: 'chatbot',   label: 'Admissions Chat',      dot: '#8b5cf6', section: 'Pipeline' },
  { id: 'admin',     label: 'Admin Dashboard',      dot: '#6b7280', section: 'Admin' },
];

const PAGE_TITLES: Record<string, string> = {
  market:   'Market Intelligence',
  strategy: 'Marketing Strategy',
  capture:  'Lead Capture',
  chatbot:  'Admissions Chat',
  admin:    'Admin Dashboard',
};

const PAGE_STATUS: Record<string, React.ReactNode> = {
  market:   <><span className="status-pill pill-green">Live data</span><span className="status-pill pill-blue">World Bank API</span></>,
  strategy: <><span className="status-pill pill-blue">10 Markets</span></>,
  capture:  <><span className="status-pill pill-green">Form Open</span></>,
  chatbot:  <><span className="status-pill pill-purple">Bot Online</span></>,
  admin:    <><span className="status-pill pill-amber">Admin Only</span></>,
};

// Group nav items by section
const SECTIONS = ['Intelligence', 'Pipeline', 'Admin'];

export default function App() {
  const [active, setActive] = useState<string>('market');

  useEffect(() => {
    const syncFromHash = () => {
      const next = window.location.hash.replace('#', '');
      if (NAV.some(item => item.id === next)) {
        setActive(next);
      }
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  useEffect(() => {
    if (window.location.hash !== `#${active}`) {
      window.history.replaceState(null, '', `#${active}`);
    }
  }, [active]);

  const navigateTo = (next: string) => {
    setActive(next);
  };

  let activeScreen: React.ReactNode = null;
  if (active === 'market') activeScreen = <ScreenMarketIntelligence />;
  if (active === 'strategy') activeScreen = <ScreenMarketingStrategy />;
  if (active === 'capture') activeScreen = <ScreenLeadCapture />;
  if (active === 'chatbot') activeScreen = <ScreenAdmissionsChat />;
  if (active === 'admin') activeScreen = <ScreenAdminDashboard />;

  return (
    <div className="shell">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <p className="logo-name">UniReach AI</p>
          <p className="logo-sub">XAMK University</p>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {SECTIONS.map(section => {
            const items = NAV.filter(n => n.section === section);
            return (
              <div key={section}>
                <p className="nav-section-label">{section}</p>
                {items.map(item => (
                  <button
                    key={item.id}
                    className={`nav-item${active === item.id ? ' active' : ''}`}
                    onClick={() => navigateTo(item.id)}
                    type="button"
                  >
                    <span className="nav-dot" style={{ background: active === item.id ? '#3b82f6' : item.dot }} />
                    {item.label}
                  </button>
                ))}
              </div>
            );
          })}
        </nav>

        {/* Footer badge */}
        <div className="sidebar-footer">
          <div className="sidebar-badge">Admin Panel v1.0</div>
        </div>
      </aside>

      {/* ── Main column ── */}
      <div className="main-col">
        {/* Top bar */}
        <header className="topbar">
          <span className="topbar-title">{PAGE_TITLES[active]}</span>
          <div className="topbar-right">
            {PAGE_STATUS[active]}
            <div className="avatar">XA</div>
          </div>
        </header>

        {/* Screen (key forces re-mount / animation on switch) */}
        <div key={active}>{activeScreen}</div>
      </div>
    </div>
  );
}
