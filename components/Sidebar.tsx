'use client';

import clsx from 'clsx';
import { LayoutDashboard, Clock, CircleCheck, Shield, ChevronsLeft, LucideIcon } from 'lucide-react';
import { useApp, ActiveView } from '@/lib/appContext';

interface NavItem {
  id: ActiveView;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard',       label: 'Dashboard' },
  { id: 'active',          label: 'Active' },
  { id: 'onboarded',       label: 'Onboarded' },
  { id: 'admin-profiles',  label: 'Admin' },
];

const iconMap: Record<ActiveView, LucideIcon> = {
  'dashboard':      LayoutDashboard,
  'active':         Clock,
  'onboarded':      CircleCheck,
  'admin-profiles': Shield,
  'admin-canvas':   Shield,
};

export default function Sidebar() {
  const { activeView, setActiveView, sidebarCollapsed, sidebarWidth, toggleSidebarCollapsed } = useApp();

  const isActive = (v: ActiveView) =>
    v === 'admin-profiles'
      ? activeView === 'admin-profiles' || activeView === 'admin-canvas'
      : activeView === v;

  return (
    <aside
      style={{
        position: 'fixed', left: 0, top: 0, bottom: 0,
        width: sidebarWidth, zIndex: 40,
        background: 'var(--surface-container-lowest)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '20px 12px',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px' }}>
          <div style={{
            width: 32, height: 32, minWidth: 32, borderRadius: 8,
            background: 'var(--primary-container)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--on-primary-container)' }}>E</span>
          </div>
          <div className={clsx('nav-item-label', { collapsed: sidebarCollapsed })} style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--on-surface)', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>EPAM</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 10, color: 'var(--on-surface-variant)', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Enterprise Portal</span>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(item => {
            const Icon = iconMap[item.id];
            const active = isActive(item.id);
            return (
              <span key={item.id} className="sidebar-tooltip-wrapper" style={{ position: 'relative' }}>
                <button
                  className={clsx('nav-item', { active, collapsed: sidebarCollapsed })}
                  onClick={() => setActiveView(item.id)}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon size={20} strokeWidth={1.8} style={{ flexShrink: 0 }} />
                  <span className={clsx('nav-item-label', { collapsed: sidebarCollapsed })} style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
                </button>
                {sidebarCollapsed && <span className="sidebar-tooltip">{item.label}</span>}
              </span>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {!sidebarCollapsed && (
          <div style={{ padding: '0 6px' }}>
            <span className="text-code-tabular" style={{ color: 'var(--text-muted)' }}>
              Onboarding Tracker v1.0.0
            </span>
          </div>
        )}
        <span className="sidebar-tooltip-wrapper" style={{ position: 'relative' }}>
          <button
            className="nav-item"
            onClick={toggleSidebarCollapsed}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
          >
            <ChevronsLeft
              size={20}
              strokeWidth={1.8}
              style={{ flexShrink: 0, transform: sidebarCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}
            />
            <span className={clsx('nav-item-label', { collapsed: sidebarCollapsed })} style={{ whiteSpace: 'nowrap' }}>Collapse</span>
          </button>
          {sidebarCollapsed && <span className="sidebar-tooltip">Expand sidebar</span>}
        </span>
      </div>
    </aside>
  );
}
