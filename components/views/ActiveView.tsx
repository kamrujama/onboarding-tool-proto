'use client';

import { mockCases } from '@/lib/mockData';

const stageColors = ['#4F46E5','#818CF8','#2563EB','#34D399','#FBBF24','#F87171','#68dba9','#b4c5ff','#c3c0ff'];

function MilestoneTrack({ current, total, stage }: { current: number; total: number; stage: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          title={i + 1 <= current ? 'Completed' : i + 1 === current + 1 ? stage : 'Pending'}
          style={{
            width: i + 1 === current ? 20 : 8,
            height: 8,
            borderRadius: 9999,
            background: i + 1 < current
              ? '#34D399'
              : i + 1 === current
                ? '#4F46E5'
                : 'var(--surface-container-highest)',
            transition: 'all 0.2s',
          }}
        />
      ))}
    </div>
  );
}

export default function ActiveView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="text-label-sm" style={{ color: 'var(--secondary)', background: 'var(--surface-container-high)', padding: '2px 10px', borderRadius: 9999, textTransform: 'uppercase', fontWeight: 700 }}>
              In-Flight
            </span>
          </div>
          <h1 className="text-headline-xl" style={{ color: 'var(--on-surface)', margin: 0 }}>Active Cases</h1>
          <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: 4 }}>
            All candidates currently in onboarding pipeline
          </p>
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

      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {mockCases.map(c => {
          const statusColor = c.status === 'active' ? '#34D399' : c.status === 'blocked' ? '#F87171' : '#FBBF24';
          const statusBg = c.status === 'active' ? 'rgba(5,150,105,0.12)' : c.status === 'blocked' ? 'rgba(220,38,38,0.12)' : 'rgba(217,119,6,0.12)';
          const statusBorder = c.status === 'active' ? 'rgba(5,150,105,0.3)' : c.status === 'blocked' ? 'rgba(220,38,38,0.35)' : 'rgba(217,119,6,0.3)';

          return (
            <div key={c.id} style={{
              background: 'var(--surface-container-low)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14,
              padding: '18px 20px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.4)',
              cursor: 'pointer',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(195,192,255,0.2)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.5)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.4)';
              }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'rgba(79,70,229,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#818CF8', fontWeight: 700, fontSize: 12, flexShrink: 0,
                  }}>{c.initials}</div>
                  <div>
                    <div className="text-label-lg" style={{ color: 'var(--on-surface)' }}>{c.name}</div>
                    <div className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>{c.role}</div>
                  </div>
                </div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  height: 20, padding: '0 8px', borderRadius: 9999,
                  background: statusBg, color: statusColor, border: `1px solid ${statusBorder}`,
                  fontSize: 11, fontWeight: 600,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: statusColor }} />
                  {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                </span>
              </div>

              {/* Meta */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                <div>
                  <div className="text-label-sm" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: 2 }}>Location</div>
                  <div className="text-body-sm" style={{ color: 'var(--on-surface)' }}>{c.location}</div>
                </div>
                <div>
                  <div className="text-label-sm" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: 2 }}>Start</div>
                  <div className="text-body-sm" style={{ color: 'var(--on-surface)' }}>{c.startDate}</div>
                </div>
                <div>
                  <div className="text-label-sm" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: 2 }}>DM</div>
                  <div className="text-body-sm" style={{ color: 'var(--on-surface)' }}>{c.manager}</div>
                </div>
              </div>

              {/* Stage + Progress */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span className="text-body-sm" style={{ color: '#818CF8' }}>Stage: {c.stage}</span>
                  <span className="text-code-tabular" style={{ color: 'var(--on-surface-variant)' }}>{c.stageIndex}/{c.totalStages}</span>
                </div>
                <MilestoneTrack current={c.stageIndex} total={c.totalStages} stage={c.stage} />
              </div>

              {/* SLA */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span className="text-code-tabular" style={{ color: c.daysLeft <= 7 ? '#FBBF24' : 'var(--on-surface-variant)' }}>
                  {c.daysLeft}d until start
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
