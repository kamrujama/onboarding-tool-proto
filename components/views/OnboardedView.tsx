'use client';

const onboardedCases = [
  { id: 'ob-001', name: 'Diana Moon',    role: 'Software Engineer',     location: 'Malvern, PA',  completedDate: 'Sep 15, 2026', daysToOnboard: 21, initials: 'DM' },
  { id: 'ob-002', name: 'Cyrus Bell',    role: 'Data Analyst',          location: 'Remote US',    completedDate: 'Sep 22, 2026', daysToOnboard: 18, initials: 'CB' },
  { id: 'ob-003', name: 'Nadia Osei',    role: 'Project Manager',       location: 'Charlotte, NC',completedDate: 'Sep 28, 2026', daysToOnboard: 26, initials: 'NO' },
  { id: 'ob-004', name: 'Felix Huang',   role: 'Cloud Engineer',        location: 'Dallas, TX',   completedDate: 'Sep 10, 2026', daysToOnboard: 19, initials: 'FH' },
  { id: 'ob-005', name: 'Stella Ramos',  role: 'UX Researcher',         location: 'Remote US',    completedDate: 'Sep 5, 2026',  daysToOnboard: 23, initials: 'SR' },
];

export default function OnboardedView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="text-label-sm" style={{ color: 'var(--tertiary)', background: 'rgba(5,150,105,0.12)', border: '1px solid rgba(5,150,105,0.3)', padding: '2px 10px', borderRadius: 9999, textTransform: 'uppercase', fontWeight: 700 }}>
            Completed
          </span>
        </div>
        <h1 className="text-headline-xl" style={{ color: 'var(--on-surface)', margin: 0 }}>Onboarded</h1>
        <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: 4 }}>
          Successfully onboarded candidates — all milestones complete
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {([
          { label: 'Total Onboarded', value: '14', sub: 'Q4 2026' },
          { label: 'Avg. Duration', value: '21.4d', sub: 'days' },
          { label: 'On-time Rate', value: '92%', color: '#34D399' },
          { label: 'SLA Breaches', value: '1', color: '#F87171' },
        ] as { label: string; value: string; sub?: string; color?: string }[]).map(s => (
          <div key={s.label} style={{
            flex: 1, minWidth: 140,
            background: 'var(--surface-container-low)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: '16px 20px',
          }}>
            <div className="text-label-sm" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
            <span className="text-headline-md" style={{ color: s.color ?? 'var(--on-surface)', fontFamily: 'var(--font-display)' }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--surface-container-low)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16, overflow: 'hidden',
      }}>
        <div className="table-header" style={{
          display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr',
          padding: '0 20px', alignItems: 'center', gap: 16,
        }}>
          <span>CANDIDATE</span>
          <span>LOCATION</span>
          <span>COMPLETED</span>
          <span>DURATION</span>
          <span>STATUS</span>
        </div>
        {onboardedCases.map(c => (
          <div key={c.id} className="table-row" style={{
            display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr',
            padding: '0 20px', alignItems: 'center', gap: 16, cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: 'rgba(5,150,105,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#34D399', fontWeight: 700, fontSize: 11,
              }}>{c.initials}</div>
              <div>
                <div className="text-label-lg" style={{ color: 'var(--on-surface)' }}>{c.name}</div>
                <div className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>{c.role}</div>
              </div>
            </div>
            <div className="text-body-sm" style={{ color: 'var(--on-surface)' }}>{c.location}</div>
            <div className="text-body-sm" style={{ color: 'var(--on-surface)' }}>{c.completedDate}</div>
            <div>
              <span className="text-code-tabular" style={{ color: c.daysToOnboard <= 21 ? '#34D399' : '#FBBF24' }}>
                {c.daysToOnboard}d
              </span>
            </div>
            <div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                height: 20, padding: '0 8px', borderRadius: 9999,
                background: 'rgba(5,150,105,0.12)', color: '#34D399',
                border: '1px solid rgba(5,150,105,0.3)',
                fontSize: 11, fontWeight: 600,
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Complete
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
