'use client';

import { useState } from 'react';
import { useApp, NewCaseForm } from '@/lib/appContext';
import {
  mockProfiles,
  mockEpamPeople, mockLocationOptions, mockProjectOptions,
  mockDeliveryManagers, mockIopsOwners, mockVgManagers,
  PersonOption, ProjectOption, VgManagerOption,
} from '@/lib/mockData';
import AppSelect from '@/components/ui/AppSelect';
import AppDatePicker from '@/components/ui/AppDatePicker';

// ── Step Progress Indicator ────────────────────────────────────────────────────
function StepIndicator({ step }: { step: number }) {
  const steps = [
    { label: 'Identity', num: 1 },
    { label: 'Workflow', num: 2 },
    { label: 'Review',   num: 3 },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      {steps.map((s, i) => {
        const isComplete = step > s.num;
        const isActive   = step === s.num;
        return (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && (
              <div style={{
                width: 24, height: 2, flexShrink: 0,
                background: isComplete ? 'var(--color-success)' : 'var(--surface-container-highest)',
                marginTop: -14,
              }} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div className={isComplete ? 'step-dot step-dot-complete' : isActive ? 'step-dot step-dot-active' : 'step-dot step-dot-pending'}>
                {isComplete ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : s.num}
              </div>
              <span className="text-label-sm" style={{ color: isActive ? 'var(--on-surface)' : 'var(--on-surface-variant)', whiteSpace: 'nowrap' }}>
                {s.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Field Wrapper (plain, non-select fields) ──────────────────────────────────
function Field({ label, children, required, helper }: { label: string; children: React.ReactNode; required?: boolean; helper?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label className="text-label-lg" style={{ color: 'var(--on-surface-variant)' }}>
        {label}{required && <span style={{ color: 'var(--color-danger)', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {helper && <span className="text-body-sm" style={{ color: 'var(--on-surface-variant)', fontSize: 11 }}>{helper}</span>}
    </div>
  );
}

// ── Quick-add select field: dropdown + inline "+ New X" create form ──────────
function QuickAddField({
  label, required, helper, value, onChange, options, placeholder, addLabel, onAdd,
}: {
  label: string;
  required?: boolean;
  helper?: string;
  value: string;
  onChange: (id: string) => void;
  options: { id: string; label: string }[];
  placeholder: string;
  addLabel: string;
  onAdd: (name: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const submit = () => {
    const name = draft.trim();
    if (!name) return;
    onAdd(name);
    setDraft('');
    setAdding(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label className="text-label-lg" style={{ color: 'var(--on-surface-variant)' }}>
          {label}{required && <span style={{ color: 'var(--color-danger)', marginLeft: 3 }}>*</span>}
        </label>
        <button
          type="button"
          className="btn-ghost btn-sm"
          style={{ height: 26, padding: '0 10px', fontSize: 11, color: 'var(--primary-fixed)' }}
          onClick={() => setAdding(a => !a)}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          {addLabel}
        </button>
      </div>

      {adding ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="input-base"
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') submit();
              if (e.key === 'Escape') { setAdding(false); setDraft(''); }
            }}
            placeholder={`${addLabel.replace('+ New ', '')} name…`}
          />
          <button type="button" className="btn-primary btn-sm" style={{ flexShrink: 0 }} onClick={submit}>Add</button>
          <button type="button" className="btn-ghost btn-sm" style={{ flexShrink: 0 }} onClick={() => { setAdding(false); setDraft(''); }}>Cancel</button>
        </div>
      ) : (
        <AppSelect
          value={value}
          onChange={onChange}
          options={options.map(o => ({ value: o.id, label: o.label }))}
          placeholder={placeholder}
        />
      )}

      {helper && <span className="text-body-sm" style={{ color: 'var(--on-surface-variant)', fontSize: 11 }}>{helper}</span>}
    </div>
  );
}

const slug = (s: string) => s.toLowerCase().trim().replace(/\s+/g, '.');

// ── Step 1: Identity ──────────────────────────────────────────────────────────
function Step1({
  form, update,
  people, addPerson,
  locations, addLocation,
  projects, addProject,
  dms, addDm,
  iopsOwners, addIopsOwner,
}: {
  form: NewCaseForm;
  update: (p: Partial<NewCaseForm>) => void;
  people: PersonOption[]; addPerson: (name: string) => void;
  locations: string[]; addLocation: (name: string) => void;
  projects: ProjectOption[]; addProject: (name: string) => void;
  dms: PersonOption[]; addDm: (name: string) => void;
  iopsOwners: PersonOption[]; addIopsOwner: (name: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <QuickAddField
        label="EPAM person" required
        helper="Resolve a person to continue. First-typed identity is not used without a personRef."
        value={form.epamPersonId}
        onChange={id => update({ epamPersonId: id })}
        options={people.map(p => ({ id: p.id, label: `${p.name} (${p.email})` }))}
        placeholder="Search by name or email"
        addLabel="+ New EPAM person"
        onAdd={addPerson}
      />

      <QuickAddField
        label="Location" required
        value={form.location}
        onChange={id => update({ location: id })}
        options={locations.map(l => ({ id: l, label: l }))}
        placeholder="Search location"
        addLabel="+ New Location"
        onAdd={addLocation}
      />

      <QuickAddField
        label="Project" required
        value={form.projectId}
        onChange={id => update({ projectId: id })}
        options={projects.map(p => ({ id: p.id, label: `${p.code} — ${p.name}` }))}
        placeholder="Search project"
        addLabel="+ New Project"
        onAdd={addProject}
      />

      <QuickAddField
        label="DM" required
        helper="Recommended"
        value={form.dmId}
        onChange={id => update({ dmId: id })}
        options={dms.map(d => ({ id: d.id, label: `${d.name} (${d.email})` }))}
        placeholder="Search DM"
        addLabel="+ New DM"
        onAdd={addDm}
      />

      <QuickAddField
        label="IOPs Owner" required
        helper="Recommended"
        value={form.iopsOwnerId}
        onChange={id => update({ iopsOwnerId: id })}
        options={iopsOwners.map(o => ({ id: o.id, label: `${o.name} (${o.email})` }))}
        placeholder="Search IOPs Owner"
        addLabel="+ New IOPs Owner"
        onAdd={addIopsOwner}
      />

      <Field label="Expected start" required helper="Stored in wizard draft for Case open (MVP1-18) — not written to Case here.">
        <AppDatePicker value={form.expectedStart} onChange={v => update({ expectedStart: v })} />
      </Field>
    </div>
  );
}

// ── Step 2: Workflow ──────────────────────────────────────────────────────────
function Step2({
  form, update, vgManagers, addVgManager,
}: {
  form: NewCaseForm;
  update: (p: Partial<NewCaseForm>) => void;
  vgManagers: VgManagerOption[]; addVgManager: (name: string) => void;
}) {
  const selectedManager = vgManagers.find(m => m.id === form.vgManagerId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <QuickAddField
        label="Pick existing VG Manager" required
        helper='Required. Pick an existing VG Manager or use "+ New VG Manager".'
        value={form.vgManagerId}
        onChange={id => update({ vgManagerId: id })}
        options={vgManagers.map(m => ({ id: m.id, label: `${m.name} (${m.email})` }))}
        placeholder="Search VG Manager"
        addLabel="+ New VG Manager"
        onAdd={addVgManager}
      />

      {selectedManager && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
          padding: '10px 14px', borderRadius: 10,
          background: 'var(--surface-container)', border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: 'color-mix(in srgb, var(--primary-container) 20%, transparent)', color: 'var(--color-info)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 11,
            }}>{selectedManager.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="text-label-lg" style={{ color: 'var(--on-surface)' }}>{selectedManager.name}</span>
                <span style={{ height: 18, padding: '0 7px', borderRadius: 9999, background: 'color-mix(in srgb, var(--primary-container) 15%, transparent)', color: 'var(--color-info)', fontSize: 10, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>
                  {selectedManager.role}
                </span>
              </div>
              <div className="text-body-sm" style={{ color: 'var(--on-surface-variant)', fontSize: 11 }}>{selectedManager.org} • {selectedManager.dept}</div>
            </div>
          </div>
          {selectedManager.synced && (
            <span style={{
              flexShrink: 0, height: 20, padding: '0 8px', borderRadius: 9999,
              background: 'color-mix(in srgb, var(--color-success) 12%, transparent)', color: 'var(--color-success)',
              border: '1px solid color-mix(in srgb, var(--color-success) 30%, transparent)', fontSize: 11, fontWeight: 600,
            }}>Synchronized</span>
          )}
        </div>
      )}

      <Field label="Job code" helper="Optional job code reference for client billing and project cost center reconciliation.">
        <input className="input-base" style={{ fontFamily: 'monospace' }} value={form.jobCode} onChange={e => update({ jobCode: e.target.value })} placeholder="e.g. VAN" />
      </Field>

      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
          <label className="text-label-lg" style={{ color: 'var(--on-surface-variant)' }}>
            Workflow profile<span style={{ color: 'var(--color-danger)', marginLeft: 3 }}>*</span>
          </label>
          {form.location && (
            <span className="text-body-sm" style={{ color: 'var(--on-surface-variant)', fontSize: 11 }}>Target Location: {form.location}</span>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {mockProfiles.map(p => {
            const active = form.profileId === p.id;
            return (
              <div
                key={p.id}
                onClick={() => update({ profileId: p.id })}
                style={{
                  padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                  background: active ? 'color-mix(in srgb, var(--primary-container) 8%, transparent)' : 'var(--surface-container)',
                  border: `1.5px solid ${active ? 'var(--primary-container)' : 'var(--border-subtle)'}`,
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                      border: `2px solid ${active ? 'var(--primary-container)' : 'var(--outline-variant)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {active && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary-container)' }} />}
                    </div>
                    <div>
                      <div className="text-label-lg" style={{ color: 'var(--on-surface)', marginBottom: 3 }}>{p.name}</div>
                      <div className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>{p.description}</div>
                    </div>
                  </div>
                  <span style={{ flexShrink: 0, height: 20, padding: '0 8px', borderRadius: 9999, background: 'var(--surface-container-high)', color: 'var(--on-surface-variant)', fontSize: 11, fontWeight: 600 }}>
                    {p.milestones} Milestones
                  </span>
                </div>
                {active && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10, paddingLeft: 26 }}>
                    {p.steps.slice(0, 4).map((s, i) => (
                      <span key={i} className="text-code-tabular" style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, background: 'var(--surface-container-high)', color: 'var(--on-surface-variant)' }}>
                        {i + 1}. {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '12px 14px', borderRadius: 10, background: 'color-mix(in srgb, var(--primary-container) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--primary-container) 20%, transparent)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary-fixed)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <p className="text-body-sm" style={{ color: 'var(--on-surface-variant)', margin: 0 }}>
          <strong style={{ color: 'var(--on-surface)' }}>Client Governance Synced:</strong> Target candidate will be mapped against Vanguard security clearance rules and registered in the talent directory upon review completion.
        </p>
      </div>
    </div>
  );
}

// ── Step 3: Review ────────────────────────────────────────────────────────────
function Step3Review({
  form, people, projects, dms, iopsOwners, vgManagers, onEditIdentity,
}: {
  form: NewCaseForm;
  people: PersonOption[];
  projects: ProjectOption[];
  dms: PersonOption[];
  iopsOwners: PersonOption[];
  vgManagers: VgManagerOption[];
  onEditIdentity: () => void;
}) {
  const person     = people.find(p => p.id === form.epamPersonId);
  const project    = projects.find(p => p.id === form.projectId);
  const dm         = dms.find(d => d.id === form.dmId);
  const iopsOwner  = iopsOwners.find(o => o.id === form.iopsOwnerId);
  const vgManager  = vgManagers.find(m => m.id === form.vgManagerId);
  const profile    = mockProfiles.find(p => p.id === form.profileId);

  const requiredFields = [form.epamPersonId, form.location, form.projectId, form.dmId, form.iopsOwnerId, form.expectedStart, form.vgManagerId, form.profileId];
  const readiness = Math.round((requiredFields.filter(Boolean).length / requiredFields.length) * 100);

  const [now] = useState(() => Date.now());
  let daysBadge: string | null = null;
  if (form.expectedStart) {
    const diff = Math.round((new Date(form.expectedStart).getTime() - now) / 86400000);
    daysBadge = diff >= 0 ? `In ${diff} day${diff === 1 ? '' : 's'}` : `${Math.abs(diff)} day${Math.abs(diff) === 1 ? '' : 's'} ago`;
  }

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: 'Location', value: form.location || '—' },
    {
      label: 'Target Start Date',
      value: form.expectedStart ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {form.expectedStart}
          {daysBadge && (
            <span style={{ height: 18, padding: '0 7px', borderRadius: 9999, background: 'color-mix(in srgb, var(--primary-container) 15%, transparent)', color: 'var(--color-info)', fontSize: 10, fontWeight: 600 }}>{daysBadge}</span>
          )}
        </span>
      ) : '—',
    },
    { label: 'Project Container', value: project ? `${project.code} — ${project.name}` : '—' },
    { label: 'Delivery Manager (DM)', value: dm ? <>{dm.name} <span style={{ color: 'var(--on-surface-variant)' }}>({dm.email})</span></> : '—' },
    { label: 'IOPs Owner', value: iopsOwner ? <>{iopsOwner.name} <span style={{ color: 'var(--on-surface-variant)' }}>({iopsOwner.email})</span></> : '—' },
    { label: 'VG Manager', value: vgManager ? <>{vgManager.name} <span style={{ color: 'var(--on-surface-variant)' }}>({vgManager.email})</span></> : '—' },
    {
      label: 'Client Job Code',
      value: form.jobCode ? <span className="text-code-tabular" style={{ padding: '2px 8px', borderRadius: 4, background: 'var(--surface-container-high)', color: 'var(--on-surface)' }}>{form.jobCode}</span> : '—',
    },
    {
      label: 'Assigned Workflow',
      value: profile ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: 'var(--color-info)' }}>{profile.name}</span>
          <span style={{ height: 18, padding: '0 7px', borderRadius: 9999, background: 'var(--surface-container-high)', color: 'var(--on-surface-variant)', fontSize: 10, fontWeight: 600 }}>{profile.milestones} Milestones</span>
        </span>
      ) : '—',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Identity summary */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
        padding: '12px 14px', borderRadius: 10,
        background: 'var(--surface-container)', border: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: 'color-mix(in srgb, var(--primary-container) 20%, transparent)', color: 'var(--color-info)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 12,
          }}>{person ? person.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '—'}</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="text-label-lg" style={{ color: 'var(--on-surface)' }}>{person?.name ?? 'No person selected'}</span>
              {person?.kind && (
                <span style={{ height: 18, padding: '0 7px', borderRadius: 9999, background: 'color-mix(in srgb, var(--color-success) 12%, transparent)', color: 'var(--color-success)', border: '1px solid color-mix(in srgb, var(--color-success) 30%, transparent)', fontSize: 10, fontWeight: 600 }}>
                  {person.kind}
                </span>
              )}
            </div>
            <div className="text-body-sm" style={{ color: 'var(--on-surface-variant)', fontSize: 11 }}>{person?.email ?? '—'}</div>
            {form.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--on-surface-variant)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="text-body-sm" style={{ color: 'var(--on-surface-variant)', fontSize: 11 }}>{form.location}</span>
              </div>
            )}
          </div>
        </div>
        <button type="button" onClick={onEditIdentity} className="btn-ghost btn-sm" style={{ height: 'auto', padding: 0, fontSize: 11, color: 'var(--primary-fixed)', flexShrink: 0 }}>
          Edit Identity
        </button>
      </div>

      {/* Assignment & Case Configuration */}
      <div style={{ background: 'var(--surface-container)', border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
          <span className="text-label-sm" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>Assignment &amp; Case Configuration</span>
          <span className="text-body-sm" style={{ color: 'var(--on-surface-variant)', fontSize: 11 }}>Step 1 &amp; 2 Data</span>
        </div>
        {rows.map((r, i) => (
          <div key={r.label} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px',
            borderBottom: i < rows.length - 1 ? '1px solid var(--border-subtle)' : 'none',
          }}>
            <span className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>{r.label}</span>
            <span className="text-label-lg" style={{ color: 'var(--on-surface)', textAlign: 'right', maxWidth: '65%' }}>{r.value}</span>
          </div>
        ))}
      </div>

      {/* Automated Pre-flight Checks */}
      <div style={{ background: 'var(--surface-container)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="text-label-sm" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>Automated Pre-flight Checks</span>
          <span style={{
            height: 20, padding: '0 8px', borderRadius: 9999,
            background: readiness === 100 ? 'color-mix(in srgb, var(--color-success) 12%, transparent)' : 'color-mix(in srgb, var(--color-warning) 12%, transparent)',
            color: readiness === 100 ? 'var(--color-success)' : 'var(--color-warning)',
            border: `1px solid ${readiness === 100 ? 'color-mix(in srgb, var(--color-success) 30%, transparent)' : 'color-mix(in srgb, var(--color-warning) 30%, transparent)'}`,
            fontSize: 11, fontWeight: 600,
          }}>
            {readiness === 100 ? 'Ready to Provision' : 'Incomplete'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          {[
            'EPAM Global Directory synchronized',
            'Vanguard billing code verified active',
            'Hardware inventory reserved in US East depot',
          ].map(check => (
            <div key={check} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span className="text-body-sm" style={{ color: 'var(--on-surface)' }}>{check}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--on-surface-variant)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <span className="text-body-sm" style={{ color: 'var(--on-surface-variant)', flexShrink: 0 }}>Readiness Score</span>
          <div style={{ flex: 1, height: 6, borderRadius: 9999, background: 'var(--surface-container-high)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${readiness}%`, background: readiness === 100 ? 'var(--color-success)' : 'var(--color-info)', borderRadius: 9999, transition: 'width 0.2s' }} />
          </div>
          <span className="text-code-tabular" style={{ color: 'var(--on-surface)', flexShrink: 0 }}>{readiness}%</span>
        </div>
      </div>

      {/* Provisioning notice */}
      <div style={{ padding: '12px 14px', borderRadius: 10, background: 'color-mix(in srgb, var(--primary-container) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--primary-container) 20%, transparent)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary-fixed)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <p className="text-body-sm" style={{ color: 'var(--on-surface-variant)', margin: 0 }}>
          Creating this case will trigger onboarding notifications and queue credential provisioning 48 hours prior to start date.
        </p>
      </div>
    </div>
  );
}

// ── Main Drawer ───────────────────────────────────────────────────────────────
export default function NewCaseDrawer() {
  const { drawerView, openDrawer, closeDrawer, nextDrawerStep, prevDrawerStep, newCaseForm, updateNewCaseForm } = useApp();

  const [people, setPeople]           = useState<PersonOption[]>(mockEpamPeople);
  const [locations, setLocations]     = useState<string[]>(mockLocationOptions);
  const [projects, setProjects]       = useState<ProjectOption[]>(mockProjectOptions);
  const [dms, setDms]                 = useState<PersonOption[]>(mockDeliveryManagers);
  const [iopsOwners, setIopsOwners]   = useState<PersonOption[]>(mockIopsOwners);
  const [vgManagers, setVgManagers]   = useState<VgManagerOption[]>(mockVgManagers);

  const isOpen = drawerView !== null;
  const currentStep = drawerView === 'new-case-step1' ? 1 : drawerView === 'new-case-step2' ? 2 : 3;

  const addPerson = (name: string) => {
    const id = `person-${Date.now()}`;
    setPeople(prev => [...prev, { id, name, email: `${slug(name)}@epam.com`, kind: 'EPAM Internal' }]);
    updateNewCaseForm({ epamPersonId: id });
  };
  const addLocation = (name: string) => {
    setLocations(prev => [...prev, name]);
    updateNewCaseForm({ location: name });
  };
  const addProject = (name: string) => {
    const id = `project-${Date.now()}`;
    setProjects(prev => [...prev, { id, code: name.toUpperCase().replace(/\s+/g, '-'), name }]);
    updateNewCaseForm({ projectId: id });
  };
  const addDm = (name: string) => {
    const id = `dm-${Date.now()}`;
    setDms(prev => [...prev, { id, name, email: `${slug(name)}@epam.com` }]);
    updateNewCaseForm({ dmId: id });
  };
  const addIopsOwner = (name: string) => {
    const id = `iops-${Date.now()}`;
    setIopsOwners(prev => [...prev, { id, name, email: `${slug(name)}@epam.com` }]);
    updateNewCaseForm({ iopsOwnerId: id });
  };
  const addVgManager = (name: string) => {
    const id = `vg-${Date.now()}`;
    setVgManagers(prev => [...prev, { id, name, email: `${slug(name)}@epam.com`, org: '—', dept: '—', role: 'Primary Contact', synced: false }]);
    updateNewCaseForm({ vgManagerId: id });
  };

  if (!isOpen) return null;

  const headerSubtitle = currentStep === 1
    ? 'Create a new onboarding case and assign details'
    : currentStep === 2
    ? 'Configure client governance and assignment rules'
    : 'Verify all case details before opening and provisioning';

  const continueLabel = currentStep === 1 ? 'Next Step →' : 'Next Step: Review →';

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop"
        onClick={closeDrawer}
        style={{ opacity: isOpen ? 1 : 0, transition: 'opacity 0.25s' }}
      />

      {/* Drawer */}
      <div className="slide-over" style={{
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px 14px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'color-mix(in srgb, var(--scrim) 37.5%, transparent)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--primary-container)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--on-primary-container)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <div className="text-headline-sm" style={{ color: 'var(--on-surface)' }}>New Case</div>
              <div className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>{headerSubtitle}</div>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            style={{
              width: 30, height: 30, borderRadius: 7, border: 'none', cursor: 'pointer',
              background: 'transparent', color: 'var(--on-surface-variant)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Step Indicator */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
          <StepIndicator step={currentStep} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {drawerView === 'new-case-step1' && (
            <Step1
              form={newCaseForm} update={updateNewCaseForm}
              people={people} addPerson={addPerson}
              locations={locations} addLocation={addLocation}
              projects={projects} addProject={addProject}
              dms={dms} addDm={addDm}
              iopsOwners={iopsOwners} addIopsOwner={addIopsOwner}
            />
          )}
          {drawerView === 'new-case-step2' && (
            <Step2 form={newCaseForm} update={updateNewCaseForm} vgManagers={vgManagers} addVgManager={addVgManager} />
          )}
          {(drawerView === 'new-case-step3' || drawerView === 'new-case-review') && (
            <Step3Review
              form={newCaseForm}
              people={people} projects={projects} dms={dms} iopsOwners={iopsOwners} vgManagers={vgManagers}
              onEditIdentity={() => openDrawer('new-case-step1')}
            />
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexShrink: 0,
          background: 'color-mix(in srgb, var(--scrim) 37.5%, transparent)',
        }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost btn-sm" onClick={closeDrawer}>Cancel</button>
            {currentStep > 1 && (
              <button className="btn-ghost btn-sm" onClick={prevDrawerStep}>← Back</button>
            )}
          </div>
          {currentStep < 3 ? (
            <button className="btn-primary btn-sm glow-primary-sm" onClick={nextDrawerStep}>
              {continueLabel}
            </button>
          ) : (
            <button
              className="btn-primary btn-sm glow-primary"
              onClick={closeDrawer}
              style={{ background: 'var(--color-success)', boxShadow: '0 0 12px color-mix(in srgb, var(--color-success) 40%, transparent)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Confirm &amp; Open Case
            </button>
          )}
        </div>
      </div>
    </>
  );
}
