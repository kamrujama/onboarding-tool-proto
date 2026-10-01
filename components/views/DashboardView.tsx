'use client';

import { useApp } from '@/lib/appContext';
import { mockCases, dashboardStats } from '@/lib/mockData';

const statusColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  active:    { bg: 'color-mix(in srgb, var(--color-success) 12%, transparent)', text: 'var(--color-success)', border: 'color-mix(in srgb, var(--color-success) 30%, transparent)', dot: 'var(--color-success)' },
  blocked:   { bg: 'color-mix(in srgb, var(--color-danger) 12%, transparent)',  text: 'var(--color-danger)',  border: 'color-mix(in srgb, var(--color-danger) 35%, transparent)',  dot: 'var(--color-danger)' },
  attention: { bg: 'color-mix(in srgb, var(--color-warning) 12%, transparent)', text: 'var(--color-warning)', border: 'color-mix(in srgb, var(--color-warning) 30%, transparent)', dot: 'var(--color-warning)' },
  completed: { bg: 'color-mix(in srgb, var(--color-success) 12%, transparent)', text: 'var(--color-success)', border: 'color-mix(in srgb, var(--color-success) 30%, transparent)', dot: 'var(--color-success)' },
};

const statusLabel: Record<string, string> = {
  active: 'Active', blocked: 'Blocked', attention: 'Attention', completed: 'Completed',
};

function StatusBadge({ status }: { status: string }) {
  const c = statusColors[status] ?? statusColors.active;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      height: 22, padding: '2px 10px', borderRadius: 9999,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
      {statusLabel[status]}
    </span>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: number; sub?: string; color?: string }) {
  return (
    <div style={{
      flex: 1, minWidth: 140,
      background: 'var(--surface-container-low)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 12, padding: '16px 20px',
      boxShadow: 'inset 0 1px 0 var(--border-subtle)',
    }}>
      <div className="text-label-sm" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span className="text-headline-lg" style={{ color: color ?? 'var(--on-surface)', fontFamily: 'var(--font-display)' }}>{value}</span>
        {sub && <span className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>{sub}</span>}
      </div>
    </div>
  );
}

function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = Math.round((value / total) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: 'var(--surface-container-high)', borderRadius: 9999, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: 'linear-gradient(90deg, var(--primary-container), var(--color-info))',
          borderRadius: 9999, transition: 'width 0.3s',
        }} />
      </div>
      <span className="text-code-tabular" style={{ color: 'var(--on-surface-variant)', flexShrink: 0 }}>
        {value}/{total}
      </span>
    </div>
  );
}

export default function DashboardView() {
  const { openDrawer } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="text-label-sm" style={{ color: 'var(--secondary)', background: 'var(--surface-container-high)', padding: '2px 10px', borderRadius: 9999, textTransform: 'uppercase', fontWeight: 700 }}>
              Operations Command
            </span>
            <span className="text-code-tabular" style={{ color: 'var(--on-surface-variant)' }}>EP-OPS-001</span>
          </div>
          <h1 className="text-headline-xl" style={{ color: 'var(--on-surface)', margin: 0 }}>Dashboard</h1>
          <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: 4 }}>
            Track and manage all onboarding cases across locations and managers.
          </p>
        </div>
        <button
          id="dashboard-new-case-btn"
          className="btn-primary glow-primary-sm"
          onClick={() => openDrawer('new-case-step1')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Create Case
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <StatCard label="Total Cases"  value={dashboardStats.total}     sub="All time" />
        <StatCard label="Active"       value={dashboardStats.active}    color="var(--color-info)" />
        <StatCard label="Attention"    value={dashboardStats.attention} color="var(--color-warning)" />
        <StatCard label="Blocked"      value={dashboardStats.blocked}   color="var(--color-danger)" />
        <StatCard label="Completed"    value={dashboardStats.completed} color="var(--color-success)" />
        <StatCard label="Avg. Days"    value={dashboardStats.avgDays}   sub="to onboard" />
      </div>

      {/* Active Cases Table */}
      <div style={{
        background: 'var(--surface-container-low)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 16, overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
      }}>
        {/* Table Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span className="text-headline-sm" style={{ color: 'var(--on-surface)' }}>Active Cases</span>
            <span style={{
              height: 20, padding: '0 8px', borderRadius: 9999,
              background: 'color-mix(in srgb, var(--primary-container) 15%, transparent)', color: 'var(--color-info)',
              fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center',
            }}>{mockCases.length}</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              Filter
            </button>
            <button className="btn-secondary btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export
            </button>
          </div>
        </div>

        {/* Column Headers */}
        <div className="table-header" style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.2fr 0.8fr',
          padding: '0 20px', alignItems: 'center', gap: 16,
        }}>
          <span>CANDIDATE</span>
          <span>LOCATION / MANAGER</span>
          <span>START DATE</span>
          <span>STAGE</span>
          <span>PROGRESS</span>
          <span>STATUS</span>
        </div>

        {/* Rows */}
        {mockCases.map(c => (
          <div
            key={c.id}
            className="table-row"
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.2fr 0.8fr',
              padding: '0 20px', alignItems: 'center', gap: 16,
              cursor: 'pointer',
            }}
          >
            {/* Candidate */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: 'color-mix(in srgb, var(--primary-container) 20%, transparent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-info)', fontWeight: 700, fontSize: 11,
              }}>{c.initials}</div>
              <div>
                <div className="text-label-lg" style={{ color: 'var(--on-surface)' }}>{c.name}</div>
                <div className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>{c.role}</div>
              </div>
            </div>
            {/* Location / Manager */}
            <div>
              <div className="text-body-sm" style={{ color: 'var(--on-surface)' }}>{c.location}</div>
              <div className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>DM: {c.manager}</div>
            </div>
            {/* Start Date */}
            <div>
              <div className="text-body-sm" style={{ color: 'var(--on-surface)' }}>{c.startDate}</div>
              <div className="text-code-tabular" style={{ color: c.daysLeft <= 7 ? 'var(--color-warning)' : 'var(--on-surface-variant)' }}>
                {c.daysLeft}d left
              </div>
            </div>
            {/* Stage */}
            <div>
              <span className="text-label-md" style={{ color: 'var(--color-info)' }}>{c.stage}</span>
            </div>
            {/* Progress */}
            <ProgressBar value={c.stageIndex} total={c.totalStages} />
            {/* Status */}
            <StatusBadge status={c.status} />
          </div>
        ))}
      </div>

      {/* Quick Actions Banner */}
      <div style={{
        background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary-container) 12%, transparent) 0%, color-mix(in srgb, var(--secondary-container) 8%, transparent) 100%)',
        border: '1px solid color-mix(in srgb, var(--primary-container) 20%, transparent)',
        borderRadius: 16, padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <h3 className="text-headline-sm" style={{ color: 'var(--on-surface)', margin: '0 0 4px' }}>
            {dashboardStats.attention} cases need your attention
          </h3>
          <p className="text-body-sm" style={{ color: 'var(--on-surface-variant)', margin: 0 }}>
            {dashboardStats.slaBreach} SLA breaches detected · {dashboardStats.blocked} candidates blocked
          </p>
        </div>
        <button className="btn-primary glow-primary-sm">
          Review Now →
        </button>
      </div>
    </div>
  );
}
