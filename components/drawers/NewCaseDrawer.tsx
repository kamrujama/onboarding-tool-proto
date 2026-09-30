'use client';

import { useApp, NewCaseForm } from '@/lib/appContext';
import { mockProfiles } from '@/lib/mockData';

// ── Step Progress Indicator ────────────────────────────────────────────────────
function StepIndicator({ step }: { step: number }) {
  const steps = [
    { label: 'Identity',  num: 1 },
    { label: 'Workflow',  num: 2 },
    { label: 'Review',    num: 3 },
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
                background: isComplete ? '#34D399' : 'var(--surface-container-highest)',
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

// ── Field Wrapper ─────────────────────────────────────────────────────────────
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

// ── Step 1: Identity ──────────────────────────────────────────────────────────
function Step1({ form, update }: { form: NewCaseForm; update: (p: Partial<NewCaseForm>) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.2)' }}>
        <p className="text-body-sm" style={{ color: 'var(--on-surface-variant)', margin: 0 }}>
          Enter the candidate&apos;s personal details. These will be used to initialize their onboarding record.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="First Name" required>
          <input className="input-base" value={form.firstName} onChange={e => update({ firstName: e.target.value })} placeholder="e.g. Jordan" />
        </Field>
        <Field label="Last Name" required>
          <input className="input-base" value={form.lastName} onChange={e => update({ lastName: e.target.value })} placeholder="e.g. Smith" />
        </Field>
      </div>

      <Field label="Work Email" required>
        <input className="input-base" type="email" value={form.email} onChange={e => update({ email: e.target.value })} placeholder="jordan.smith@epam.com" />
      </Field>

      <Field label="Phone Number">
        <input className="input-base" type="tel" value={form.phone} onChange={e => update({ phone: e.target.value })} placeholder="+1 (555) 000-0000" />
      </Field>

      <Field label="Job Title" required>
        <input className="input-base" value={form.jobTitle} onChange={e => update({ jobTitle: e.target.value })} placeholder="e.g. Senior Software Engineer" />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Department" required>
          <select className="input-base" value={form.department} onChange={e => update({ department: e.target.value })}>
            <option value="">Select…</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Design">Design</option>
            <option value="Operations">Operations</option>
            <option value="HR">Human Resources</option>
            <option value="Finance">Finance</option>
          </select>
        </Field>
        <Field label="Employee Type" required>
          <select className="input-base" value={form.employeeType} onChange={e => update({ employeeType: e.target.value })}>
            <option value="FTE">Full-Time (FTE)</option>
            <option value="Contractor">Contractor</option>
            <option value="Intern">Intern</option>
            <option value="Temp">Temporary</option>
          </select>
        </Field>
      </div>
    </div>
  );
}

// ── Step 2: Workflow ──────────────────────────────────────────────────────────
function Step2({ form, update }: { form: NewCaseForm; update: (p: Partial<NewCaseForm>) => void }) {
  const selectedProfile = mockProfiles.find(p => p.id === form.profileId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.2)' }}>
        <p className="text-body-sm" style={{ color: 'var(--on-surface-variant)', margin: 0 }}>
          Select the workflow profile and assign a start date and manager for this candidate.
        </p>
      </div>

      <Field label="Workflow Profile" required>
        <select className="input-base" value={form.profileId} onChange={e => update({ profileId: e.target.value })}>
          {mockProfiles.map(p => (
            <option key={p.id} value={p.id}>{p.name} ({p.phases} phases)</option>
          ))}
        </select>
      </Field>

      {selectedProfile && (
        <div style={{
          padding: '12px 14px', borderRadius: 10,
          background: 'var(--surface-container)', border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div className="text-label-sm" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: 8 }}>Profile Details</div>
          <div className="text-body-sm" style={{ color: 'var(--on-surface-variant)', marginBottom: 6 }}>{selectedProfile.description}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {selectedProfile.steps.slice(0, 4).map((s, i) => (
              <span key={i} className="text-code-tabular" style={{
                padding: '1px 8px', borderRadius: 4, fontSize: 11,
                background: 'var(--surface-container-high)', color: 'var(--on-surface-variant)',
              }}>{i + 1}. {s}</span>
            ))}
          </div>
        </div>
      )}

      <Field label="Office Location" required>
        <select className="input-base" value={form.location} onChange={e => update({ location: e.target.value })}>
          <option value="">Select location…</option>
          <option value="Malvern (On-site)">Malvern, PA (On-site)</option>
          <option value="Remote US">Remote US (Nationwide)</option>
          <option value="Charlotte Hub">Charlotte Hub, NC</option>
          <option value="Dallas Branch">Dallas Branch, TX</option>
          <option value="Scottsdale Tech">Scottsdale Tech, AZ</option>
        </select>
      </Field>

      <Field label="Delivery Manager" required>
        <select className="input-base" value={form.manager} onChange={e => update({ manager: e.target.value })}>
          <option value="">Select manager…</option>
          <option value="Sarah Chen">Sarah Chen</option>
          <option value="James Park">James Park</option>
          <option value="Lisa Torres">Lisa Torres</option>
          <option value="Michael Okafor">Michael Okafor</option>
        </select>
      </Field>

      <Field label="Target Start Date" required>
        <input className="input-base" type="date" value={form.startDate} onChange={e => update({ startDate: e.target.value })} />
      </Field>
    </div>
  );
}

// ── Step 3: Review ────────────────────────────────────────────────────────────
function Step3Review({ form }: { form: NewCaseForm }) {
  const profile = mockProfiles.find(p => p.id === form.profileId);

  const rows = [
    { label: 'Full Name',   value: `${form.firstName} ${form.lastName}` || '—' },
    { label: 'Email',       value: form.email || '—' },
    { label: 'Phone',       value: form.phone || '—' },
    { label: 'Job Title',   value: form.jobTitle || '—' },
    { label: 'Department',  value: form.department || '—' },
    { label: 'Emp. Type',   value: form.employeeType },
    { label: 'Profile',     value: profile?.name ?? '—' },
    { label: 'Location',    value: form.location || '—' },
    { label: 'Manager',     value: form.manager || '—' },
    { label: 'Start Date',  value: form.startDate || '—' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)' }}>
        <p className="text-body-sm" style={{ color: '#34D399', margin: 0 }}>
          ✓ Review all details before submitting. This will create the onboarding case and trigger the workflow.
        </p>
      </div>

      <div style={{
        background: 'var(--surface-container)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 10, overflow: 'hidden',
      }}>
        {rows.map((r, i) => (
          <div key={r.label} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px',
            borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
          }}>
            <span className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>{r.label}</span>
            <span className="text-label-lg" style={{ color: r.value === '—' ? 'var(--on-surface-variant)' : 'var(--on-surface)', textAlign: 'right', maxWidth: '60%' }}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Drawer ───────────────────────────────────────────────────────────────
export default function NewCaseDrawer() {
  const { drawerView, closeDrawer, nextDrawerStep, prevDrawerStep, newCaseForm, updateNewCaseForm } = useApp();

  const isOpen = drawerView !== null;
  const currentStep = drawerView === 'new-case-step1' ? 1 : drawerView === 'new-case-step2' ? 2 : 3;

  if (!isOpen) return null;

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
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(10,14,22,0.3)',
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
              <div className="text-headline-sm" style={{ color: 'var(--on-surface)' }}>Create New Case</div>
              <div className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>
                Step {currentStep} of 3 —&nbsp;
                {currentStep === 1 ? 'Identity Details' : currentStep === 2 ? 'Workflow Assignment' : 'Review & Submit'}
              </div>
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
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <StepIndicator step={currentStep} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {drawerView === 'new-case-step1' && <Step1 form={newCaseForm} update={updateNewCaseForm} />}
          {drawerView === 'new-case-step2' && <Step2 form={newCaseForm} update={updateNewCaseForm} />}
          {(drawerView === 'new-case-step3' || drawerView === 'new-case-review') && <Step3Review form={newCaseForm} />}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexShrink: 0,
          background: 'rgba(10,14,22,0.3)',
        }}>
          <button className="btn-ghost btn-sm" onClick={currentStep === 1 ? closeDrawer : prevDrawerStep}>
            {currentStep === 1 ? 'Cancel' : '← Back'}
          </button>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Step dots */}
            <div style={{ display: 'flex', gap: 5, marginRight: 4 }}>
              {[1, 2, 3].map(n => (
                <div key={n} style={{
                  width: n === currentStep ? 16 : 6, height: 6, borderRadius: 9999,
                  background: n < currentStep ? '#34D399' : n === currentStep ? '#4F46E5' : 'var(--surface-container-highest)',
                  transition: 'all 0.2s',
                }} />
              ))}
            </div>
            {currentStep < 3 ? (
              <button className="btn-primary btn-sm glow-primary-sm" onClick={nextDrawerStep}>
                Continue →
              </button>
            ) : (
              <button
                className="btn-primary btn-sm glow-primary"
                onClick={() => {
                  // In a real app, would submit here
                  closeDrawer();
                }}
                style={{ background: '#059669', boxShadow: '0 0 12px rgba(5,150,105,0.4)' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Submit Case
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
