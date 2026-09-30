'use client';

import { useApp } from '@/lib/appContext';

export default function TopBar() {
  const { openDrawer, activeView } = useApp();

  const getTitle = () => {
    switch (activeView) {
      case 'dashboard':      return 'Dashboard';
      case 'active':         return 'Active Cases';
      case 'onboarded':      return 'Onboarded';
      case 'admin-profiles': return 'Workflow Profiles';
      case 'admin-canvas':   return 'Canvas Builder';
      default:               return 'Dashboard';
    }
  };

  return (
    <header style={{
      position: 'fixed', top: 0, left: 240, right: 0, height: 64, zIndex: 39,
      background: 'rgba(10,14,22,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px',
    }}>
      {/* Search */}
      <div style={{ position: 'relative', flex: 1, maxWidth: 440 }}>
        <svg
          style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--on-surface-variant)', pointerEvents: 'none' }}
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          className="input-base"
          style={{ paddingLeft: 36, height: 36, fontSize: 13 }}
          placeholder="Search cases, profiles, locations…"
          aria-label="Global search"
        />
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* New Case */}
        <button
          id="btn-new-case"
          className="btn-primary btn-sm glow-primary-sm"
          onClick={() => openDrawer('new-case-step1')}
          style={{ gap: 6 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          New Case
        </button>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          style={{
            position: 'relative', width: 36, height: 36,
            background: 'transparent', border: 'none',
            color: 'var(--on-surface-variant)',
            borderRadius: 8, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-container-high)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--on-surface)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--on-surface-variant)'; }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span style={{
            position: 'absolute', top: 6, right: 6,
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--error)',
            border: '1.5px solid var(--surface-container-lowest)',
          }} />
        </button>

        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 8, borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ textAlign: 'right' }}>
            <div className="text-label-md" style={{ color: 'var(--on-surface)', lineHeight: '1.2' }}>OT</div>
            <div className="text-label-sm" style={{ color: 'var(--on-surface-variant)' }}>Onboarding Team</div>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--primary-container)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--on-primary-container)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}
