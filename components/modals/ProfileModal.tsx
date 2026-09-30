'use client';

import { useApp, ProfileForm } from '@/lib/appContext';
import { mockProfiles } from '@/lib/mockData';

// ── Create/Edit Profile Modal ─────────────────────────────────────────────────

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label className="text-label-lg" style={{ color: 'var(--on-surface-variant)' }}>
        {label}{required && <span style={{ color: '#F87171', marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const ALL_LOCATIONS = [
  'Malvern (On-site)', 'Remote US (Nationwide)', 'Charlotte Hub',
  'Dallas Branch', 'Scottsdale Tech', 'Remote US (Federal/Gov)',
  'Charlotte Secure Lab', 'Austin Ops Center', 'San Francisco Core',
];

export default function ProfileModal() {
  const { modalView, closeModal, editingProfileId, profileForm, updateProfileForm } = useApp();
  const isOpen = modalView === 'create-profile' || modalView === 'edit-profile-metadata';
  const isEdit = modalView === 'edit-profile-metadata';

  // Pre-populate if editing
  const existingProfile = editingProfileId ? mockProfiles.find(p => p.id === editingProfileId) : null;

  const effectiveName        = profileForm.name        || (existingProfile?.name        ?? '');
  const effectiveCode        = profileForm.code        || (existingProfile?.code        ?? '');
  const effectiveDescription = profileForm.description || (existingProfile?.description ?? '');
  const effectiveAccount     = profileForm.account     || (existingProfile?.account     ?? 'VG');
  const effectiveLocations   = profileForm.locations.length > 0 ? profileForm.locations : (existingProfile?.locations ?? []);
  const effectiveStatus      = profileForm.status      || (existingProfile?.status      ?? 'draft');

  if (!isOpen) return null;

  const toggleLocation = (loc: string) => {
    if (effectiveLocations.includes(loc)) {
      updateProfileForm({ locations: effectiveLocations.filter(l => l !== loc) });
    } else {
      updateProfileForm({ locations: [...effectiveLocations, loc] });
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop"
        onClick={closeModal}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {/* Modal Panel — stop propagation so clicking inside doesn't close */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 560, maxHeight: '90vh',
            background: '#111827',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 20,
            boxShadow: '0 20px 60px -8px rgba(0,0,0,0.8)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            margin: '0 16px',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '20px 24px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(10,14,22,0.3)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: 'var(--primary-container)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--on-primary-container)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  {isEdit
                    ? <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>
                    : <><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></>
                  }
                </svg>
              </div>
              <div>
                <div className="text-headline-sm" style={{ color: 'var(--on-surface)' }}>
                  {isEdit ? 'Edit Profile Metadata' : 'Create Workflow Profile'}
                </div>
                <div className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>
                  {isEdit ? `Editing: ${existingProfile?.name ?? ''}` : 'Define a new lifecycle governance profile'}
                </div>
              </div>
            </div>
            <button
              onClick={closeModal}
              style={{
                width: 30, height: 30, borderRadius: 7, border: 'none', cursor: 'pointer',
                background: 'transparent', color: 'var(--on-surface-variant)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Profile Name + Code */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Profile Name" required>
                <input
                  className="input-base"
                  value={effectiveName}
                  onChange={e => updateProfileForm({ name: e.target.value })}
                  placeholder="e.g. US Onshore Standard"
                />
              </Field>
              <Field label="Profile Code" required>
                <input
                  className="input-base"
                  value={effectiveCode}
                  onChange={e => updateProfileForm({ code: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="us-onshore-standard"
                  style={{ fontFamily: 'monospace' }}
                />
              </Field>
            </div>

            {/* Description */}
            <Field label="Description">
              <textarea
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: 8,
                  background: '#111827', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#F8FAFC', fontSize: 14, fontFamily: 'var(--font-sans)',
                  resize: 'vertical', minHeight: 72, outline: 'none',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                value={effectiveDescription}
                onChange={e => updateProfileForm({ description: e.target.value })}
                placeholder="Brief description of this workflow profile…"
              />
            </Field>

            {/* Account + Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Account" required>
                <select className="input-base" value={effectiveAccount} onChange={e => updateProfileForm({ account: e.target.value })}>
                  <option value="VG">VG</option>
                  <option value="EPAM">EPAM</option>
                  <option value="Client-A">Client-A</option>
                </select>
              </Field>
              <Field label="Status">
                <select className="input-base" value={effectiveStatus} onChange={e => updateProfileForm({ status: e.target.value as ProfileForm['status'] })}>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </Field>
            </div>

            {/* Locations */}
            <Field label="Assigned Locations" required>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 200, overflowY: 'auto' }}>
                {ALL_LOCATIONS.map(loc => {
                  const checked = effectiveLocations.includes(loc);
                  return (
                    <label key={loc} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
                      background: checked ? 'rgba(79,70,229,0.1)' : 'var(--surface-container)',
                      border: `1px solid ${checked ? 'rgba(79,70,229,0.35)' : 'rgba(255,255,255,0.05)'}`,
                      transition: 'all 0.15s',
                    }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                        background: checked ? '#4F46E5' : '#111827',
                        border: `1px solid ${checked ? '#4F46E5' : 'rgba(255,255,255,0.2)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}>
                        {checked && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </div>
                      <input type="checkbox" style={{ display: 'none' }} checked={checked} onChange={() => toggleLocation(loc)} />
                      <span className="text-body-sm" style={{ color: checked ? 'var(--on-surface)' : 'var(--on-surface-variant)' }}>{loc}</span>
                    </label>
                  );
                })}
              </div>
            </Field>

            {/* Selected count */}
            {effectiveLocations.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  height: 20, padding: '0 8px', borderRadius: 9999,
                  background: 'rgba(79,70,229,0.15)', color: '#818CF8',
                  fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center',
                }}>{effectiveLocations.length} selected</span>
                <button className="btn-ghost" style={{ height: 20, fontSize: 11, padding: '0 8px' }} onClick={() => updateProfileForm({ locations: [] })}>
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', justifyContent: 'flex-end', gap: 10,
            background: 'rgba(10,14,22,0.3)',
            flexShrink: 0,
          }}>
            <button className="btn-ghost btn-sm" onClick={closeModal}>Cancel</button>
            <button
              className="btn-primary btn-sm glow-primary-sm"
              onClick={closeModal}
            >
              {isEdit ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                  </svg>
                  Save Metadata
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
                  </svg>
                  Create Profile
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
