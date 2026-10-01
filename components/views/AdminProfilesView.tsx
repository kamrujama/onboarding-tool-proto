'use client';

import { useApp } from '@/lib/appContext';
import { mockProfiles } from '@/lib/mockData';

function ProfileCard({ profile, onEdit, onCanvas }: {
  profile: typeof mockProfiles[0];
  onEdit: () => void;
  onCanvas: () => void;
}) {
  return (
    <div style={{
      background: 'var(--surface-container-low)',
      border: profile.isDefault ? '1px solid color-mix(in srgb, var(--primary-container) 30%, transparent)' : '1px solid var(--border-subtle)',
      borderRadius: 14, padding: '20px',
      boxShadow: profile.isDefault
        ? 'inset 0 1px 0 var(--border-strong), 0 0 24px -4px color-mix(in srgb, var(--primary-container) 20%, transparent)'
        : 'inset 0 1px 0 var(--border-subtle), var(--shadow-sm)',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
          background: profile.isDefault ? 'color-mix(in srgb, var(--primary-container) 20%, transparent)' : 'var(--surface-container-high)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={profile.isDefault ? 'var(--color-info)' : 'var(--on-surface-variant)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {profile.icon === 'verified_user' && <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></>}
            {profile.icon === 'output' && <><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>}
            {profile.icon === 'alt_route' && <><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/><path d="m15 9 6-6"/></>}
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h2 className="text-headline-sm" style={{ color: 'var(--on-surface)', margin: 0 }}>{profile.name}</h2>
            <span className="text-code-tabular" style={{
              padding: '1px 8px', borderRadius: 4,
              background: 'var(--surface-container-lowest)', color: 'var(--on-surface-variant)',
            }}>{profile.code}</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              height: 20, padding: '0 8px', borderRadius: 9999,
              background: 'color-mix(in srgb, var(--color-success) 12%, transparent)', color: 'var(--color-success)',
              border: '1px solid color-mix(in srgb, var(--color-success) 30%, transparent)', fontSize: 11, fontWeight: 600,
            }}>
              <span className="pulse-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }} />
              Active
            </span>
            {profile.isDefault && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                height: 20, padding: '0 8px', borderRadius: 9999,
                background: 'color-mix(in srgb, var(--primary-container) 15%, transparent)', color: 'var(--color-info)',
                border: '1px solid color-mix(in srgb, var(--primary-container) 30%, transparent)', fontSize: 11, fontWeight: 600,
              }}>
                ★ Default
              </span>
            )}
          </div>
          <div className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>
            <span style={{ fontWeight: 500, color: 'var(--on-surface)' }}>{profile.phases} phases</span>
            {profile.milestones > 0 && <> / {profile.milestones} milestones</>}
            <span style={{ margin: '0 8px', color: 'var(--outline)' }}>/</span>
            Account: <strong style={{ color: 'var(--on-surface)' }}>{profile.account}</strong>
            <span style={{ margin: '0 8px', color: 'var(--outline)' }}>/</span>
            {profile.updatedAt}
          </div>
        </div>
      </div>

      {/* Locations */}
      <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        {profile.locations.slice(0, 3).map(loc => (
          <span key={loc} className="text-body-sm" style={{
            padding: '2px 8px', borderRadius: 6,
            background: 'var(--surface-container-high)', color: 'var(--on-surface)',
          }}>{loc}</span>
        ))}
        {profile.locations.length > 3 && (
          <span className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>+{profile.locations.length - 3} more</span>
        )}
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 16, padding: '8px 12px', background: 'color-mix(in srgb, var(--scrim) 50%, transparent)', borderRadius: 8 }}>
        <span className="text-label-sm" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginRight: 4 }}>Steps:</span>
        {profile.steps.map((s, i) => (
          <span key={i} className="text-code-tabular" style={{
            padding: '1px 8px', borderRadius: 4, fontSize: 11,
            background: i === 0 ? 'color-mix(in srgb, var(--color-success) 15%, transparent)' : i <= 2 ? 'color-mix(in srgb, var(--primary-container) 12%, transparent)' : 'var(--surface-container-high)',
            color: i === 0 ? 'var(--color-success)' : i <= 2 ? 'var(--color-info)' : 'var(--on-surface-variant)',
          }}>
            {i + 1}. {s}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn-secondary btn-sm" style={{ flex: 1 }} onClick={onCanvas}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
          </svg>
          Canvas Builder
        </button>
        <button className="btn-secondary btn-sm" style={{ flex: 1 }} onClick={onEdit}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit Metadata
        </button>
        <button className="btn-ghost btn-sm" style={{ width: 36, padding: 0, justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function AdminProfilesView() {
  const { openModal, setActiveView, setSelectedCanvasProfileId } = useApp();

  const handleCanvas = (profileId: string) => {
    setSelectedCanvasProfileId(profileId);
    setActiveView('admin-canvas');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header Banner */}
      <div style={{
        position: 'relative',
        background: 'var(--surface-container-low)',
        borderRadius: 16, padding: '28px 28px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
      }}>
        {/* Glow orbs */}
        <div style={{ position: 'absolute', right: -80, top: -96, width: 384, height: 384, borderRadius: '50%', background: 'color-mix(in srgb, var(--primary-container) 10%, transparent)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 192, bottom: -96, width: 288, height: 288, borderRadius: '50%', background: 'color-mix(in srgb, var(--secondary-container) 7%, transparent)', filter: 'blur(48px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className="text-label-sm" style={{ color: 'var(--secondary)', background: 'var(--surface-container-high)', padding: '2px 10px', borderRadius: 9999, textTransform: 'uppercase', fontWeight: 700 }}>
                Lifecycle Governance
              </span>
              <span className="text-code-tabular" style={{ color: 'var(--on-surface-variant)' }}>EP-WFL-904</span>
            </div>
            <h1 className="text-headline-xl" style={{ color: 'var(--on-surface)', margin: '0 0 6px' }}>Workflow Profiles</h1>
            <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', margin: 0, maxWidth: 560 }}>
              Define and govern lifecycle milestone tracks, location assignments, SLA thresholds, and stage gate transitions across client accounts.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0, alignItems: 'center' }}>
            <button className="btn-secondary btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export Schema
            </button>
            <button
              id="btn-create-profile"
              className="btn-primary glow-primary"
              onClick={() => openModal('create-profile')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
              </svg>
              Create Profile
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
          marginTop: 24, padding: '16px', borderRadius: 12,
          background: 'color-mix(in srgb, var(--scrim) 62.5%, transparent)', border: '1px solid var(--border-subtle)',
        }}>
          {[
            { label: 'Total Profiles', value: '3', sub: 'Active', icon: '◆', color: 'var(--primary)' },
            { label: 'Supported Locations', value: '7', sub: 'Managed Nodes', icon: '◉', color: 'var(--secondary)' },
            { label: 'Default Track', value: 'US Onshore — Draft A', sub: '', icon: '✓', color: 'var(--tertiary)' },
            { label: 'Sync State', value: 'Real-time Active', sub: '', icon: '●', color: 'var(--tertiary)' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: 'var(--surface-container-high)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: s.color, fontSize: 14,
              }}>{s.icon}</div>
              <div>
                <div className="text-label-sm" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>{s.label}</div>
                <div className="text-label-lg" style={{ color: 'var(--on-surface)' }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{
        background: 'var(--surface-container-low)', borderRadius: 12, padding: '12px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
      }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--on-surface-variant)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input className="input-base" style={{ paddingLeft: 34 }} placeholder="Search workflow profiles by name or code…" />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['All', 'Active', 'Draft'].map(f => (
            <button key={f} style={{
              height: 32, padding: '0 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: f === 'All' ? 'var(--primary-container)' : 'transparent',
              color: f === 'All' ? 'var(--on-primary-container)' : 'var(--on-surface-variant)',
              fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
              transition: 'all 0.15s',
            }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Profile Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {mockProfiles.map(p => (
          <ProfileCard
            key={p.id}
            profile={p}
            onEdit={() => openModal('edit-profile-metadata', p.id)}
            onCanvas={() => handleCanvas(p.id)}
          />
        ))}
      </div>

      {/* Active Track Architecture Preview */}
      <div style={{
        background: 'var(--surface-container-low)', borderRadius: 14, padding: '20px',
        border: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
            <div>
              <h3 className="text-headline-sm" style={{ color: 'var(--on-surface)', margin: 0 }}>Active Track Architecture Preview</h3>
              <p className="text-body-sm" style={{ color: 'var(--on-surface-variant)', margin: 0 }}>
                Live telemetry flow for: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>US Onshore — Draft A</span>
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="text-code-tabular" style={{ padding: '4px 10px', background: 'var(--surface-container-lowest)', borderRadius: 6, color: 'var(--on-surface-variant)' }}>SLA: 25 Days</span>
            <span className="text-code-tabular" style={{ padding: '4px 10px', background: 'var(--surface-container-lowest)', borderRadius: 6, color: 'var(--on-surface-variant)' }}>Auto-gates: 7</span>
          </div>
        </div>

        {/* SVG Flowchart */}
        <div style={{ background: 'color-mix(in srgb, var(--scrim) 75%, transparent)', borderRadius: 10, padding: '16px', overflowX: 'auto' }}>
          <svg viewBox="0 0 880 120" width="100%" style={{ minWidth: 700, height: 120 }}>
            <path d="M 110 60 H 210" stroke="var(--tertiary)" strokeDasharray="4 4" strokeWidth="2" fill="none"/>
            <path d="M 270 60 H 370" stroke="var(--tertiary)" strokeWidth="2" fill="none"/>
            <path d="M 430 60 H 530" stroke="var(--primary)" strokeWidth="2" fill="none"/>
            <path d="M 590 60 H 690" stroke="var(--outline-variant)" strokeWidth="2" fill="none"/>
            <path d="M 750 60 H 810" stroke="var(--outline-variant)" strokeWidth="2" fill="none"/>
            {[
              { x: 50, color: 'var(--tertiary-container)', border: 'var(--tertiary)', text: 'INITIATE', check: true },
              { x: 210, color: 'var(--tertiary-container)', border: 'var(--tertiary)', text: 'CREDS', check: true },
            ].map((n, i) => (
              <g key={i} transform={`translate(${n.x}, 30)`}>
                <rect x="0" y="0" width="60" height="60" rx="12" fill={n.color} fillOpacity="0.3" stroke={n.border} strokeWidth="1.5"/>
                <circle cx="30" cy="30" r="14" fill={n.color}/>
                <path d="M 24 30 L 28 34 L 36 26" stroke="var(--tertiary-fixed)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" fill="none"/>
                <text x="30" y="78" textAnchor="middle" fill="var(--on-surface-variant)" fontSize="10" fontFamily="Inter" fontWeight="600">{n.text}</text>
              </g>
            ))}
            <g transform="translate(370, 30)">
              <rect x="0" y="0" width="60" height="60" rx="12" fill="var(--primary-container)" fillOpacity="0.25" stroke="var(--primary)" strokeWidth="2"/>
              <circle cx="30" cy="30" r="16" fill="var(--primary-container)"/>
              <circle cx="30" cy="30" r="8" fill="var(--primary)"/>
              <text x="30" y="78" textAnchor="middle" fill="var(--primary)" fontSize="10" fontFamily="Inter" fontWeight="700">WD ASSIGN</text>
            </g>
            {[
              { x: 530, label: 'EQUIPMENT', num: '04' },
              { x: 690, label: 'BGC CLEAR', num: '05' },
            ].map((n, i) => (
              <g key={i} transform={`translate(${n.x}, 30)`}>
                <rect x="0" y="0" width="60" height="60" rx="12" fill="var(--surface-container-low)" stroke="var(--outline-variant)" strokeWidth="1.5"/>
                <circle cx="30" cy="30" r="12" fill="var(--surface-container-high)"/>
                <text x="30" y="34" textAnchor="middle" fill="var(--outline)" fontSize="11" fontFamily="Inter">{n.num}</text>
                <text x="30" y="78" textAnchor="middle" fill="var(--outline)" fontSize="10" fontFamily="Inter" fontWeight="500">{n.label}</text>
              </g>
            ))}
            <g transform="translate(810, 35)">
              <circle cx="25" cy="25" r="22" fill="var(--surface-container-high)" stroke="var(--outline-variant)" strokeWidth="1"/>
              <path d="M 20 18 V 32 M 20 18 L 30 23 L 20 28" fill="var(--primary-container)" stroke="var(--primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
              <text x="25" y="68" textAnchor="middle" fill="var(--outline)" fontSize="10" fontFamily="Inter" fontWeight="500">ONBOARDED</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
