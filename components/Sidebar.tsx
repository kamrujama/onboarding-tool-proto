'use client';

import { useApp, ActiveView } from '@/lib/appContext';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard',       label: 'Dashboard', icon: '⊞' },
  { id: 'active',          label: 'Active',    icon: '⏳' },
  { id: 'onboarded',       label: 'Onboarded', icon: '✓' },
  { id: 'admin-profiles',  label: 'Admin',     icon: '⚙' },
];

// SVG Icons as React components
function IconDashboard({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  );
}

function IconActive({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  );
}

function IconOnboarded({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}

function IconAdmin({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

const iconMap: Record<ActiveView, React.ComponentType<{ active: boolean }>> = {
  'dashboard':      IconDashboard,
  'active':         IconActive,
  'onboarded':      IconOnboarded,
  'admin-profiles': IconAdmin,
  'admin-canvas':   IconAdmin,
};

export default function Sidebar() {
  const { activeView, setActiveView } = useApp();

  const resolvedView = (v: ActiveView): ActiveView =>
    v === 'admin-profiles' && activeView === 'admin-canvas' ? 'admin-canvas' : v;

  const isActive = (v: ActiveView) =>
    v === 'admin-profiles'
      ? activeView === 'admin-profiles' || activeView === 'admin-canvas'
      : activeView === v;

  return (
    <aside
      style={{
        position: 'fixed', left: 0, top: 0, bottom: 0,
        width: 240, zIndex: 40,
        background: 'var(--surface-container-lowest)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '20px 12px',
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--primary-container)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--on-primary-container)' }}>E</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--on-surface)', letterSpacing: '-0.01em' }}>EPAM</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 10, color: 'var(--on-surface-variant)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Enterprise Portal</span>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(item => {
            const Icon = iconMap[item.id];
            const active = isActive(item.id);
            return (
              <button
                key={item.id}
                className="nav-item"
                style={active ? {
                  background: 'var(--primary-container)',
                  color: 'var(--on-primary-container)',
                  boxShadow: '0 0 16px -2px rgba(79,70,229,0.45)',
                } : {}}
                onClick={() => {
                  if (item.id === 'admin-profiles') {
                    setActiveView('admin-profiles');
                  } else {
                    setActiveView(item.id);
                  }
                }}
                aria-current={active ? 'page' : undefined}
              >
                <Icon active={active} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div style={{ padding: '0 6px' }}>
        <span className="text-code-tabular" style={{ color: 'rgba(199,196,216,0.5)' }}>
          Onboarding Tracker v1.0.0
        </span>
      </div>
    </aside>
  );
}
