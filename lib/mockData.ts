// Shared mock data for the entire prototype

export type CaseStatus = 'active' | 'blocked' | 'attention' | 'completed';

export interface Case {
  id: string;
  name: string;
  role: string;
  location: string;
  startDate: string;
  daysLeft: number;
  stage: string;
  stageIndex: number;
  totalStages: number;
  status: CaseStatus;
  manager: string;
  initials: string;
}

export interface WorkflowProfile {
  id: string;
  name: string;
  code: string;
  status: 'active' | 'draft' | 'archived';
  phases: number;
  milestones: number;
  locations: string[];
  account: string;
  updatedAt: string;
  isDefault?: boolean;
  steps: string[];
  icon: string;
  description: string;
}

export interface CanvasNode {
  id: string;
  type: 'phase' | 'milestone' | 'gate' | 'action';
  title: string;
  subtitle?: string;
  x: number;
  y: number;
  status: 'complete' | 'active' | 'pending' | 'blocked';
  sla?: string;
  owner?: string;
  dependencies?: string[];
}

// ── Mock Cases ────────────────────────────────────────────────────────────────
export const mockCases: Case[] = [
  {
    id: 'case-001',
    name: 'Ethan Riley',
    role: 'Senior Software Engineer',
    location: 'Malvern, PA',
    startDate: 'Oct 14, 2026',
    daysLeft: 14,
    stage: 'Credentials',
    stageIndex: 2,
    totalStages: 9,
    status: 'active',
    manager: 'Sarah Chen',
    initials: 'ER',
  },
  {
    id: 'case-002',
    name: 'Priya Nair',
    role: 'Product Manager',
    location: 'Remote US',
    startDate: 'Oct 7, 2026',
    daysLeft: 7,
    stage: 'BGC Check',
    stageIndex: 7,
    totalStages: 9,
    status: 'blocked',
    manager: 'James Park',
    initials: 'PN',
  },
  {
    id: 'case-003',
    name: 'Marcus Webb',
    role: 'Cloud Architect',
    location: 'Charlotte, NC',
    startDate: 'Oct 21, 2026',
    daysLeft: 21,
    stage: 'WD Assign',
    stageIndex: 3,
    totalStages: 9,
    status: 'attention',
    manager: 'Sarah Chen',
    initials: 'MW',
  },
  {
    id: 'case-004',
    name: 'Aisha Thompson',
    role: 'UX Designer',
    location: 'Remote US',
    startDate: 'Sep 30, 2026',
    daysLeft: 3,
    stage: 'First Access',
    stageIndex: 6,
    totalStages: 9,
    status: 'active',
    manager: 'Lisa Torres',
    initials: 'AT',
  },
  {
    id: 'case-005',
    name: 'Raj Patel',
    role: 'Data Engineer',
    location: 'Dallas, TX',
    startDate: 'Nov 3, 2026',
    daysLeft: 34,
    stage: 'Initiation',
    stageIndex: 1,
    totalStages: 9,
    status: 'active',
    manager: 'James Park',
    initials: 'RP',
  },
];

// ── Mock Workflow Profiles ────────────────────────────────────────────────────
export const mockProfiles: WorkflowProfile[] = [
  {
    id: 'profile-001',
    name: 'US Onshore — Draft A',
    code: 'us-onshore-draft-a',
    status: 'active',
    phases: 9,
    milestones: 8,
    locations: ['Malvern (On-site)', 'Remote US (Nationwide)', 'Charlotte Hub', 'Dallas Branch', 'Scottsdale Tech'],
    account: 'VG',
    updatedAt: 'Updated yesterday',
    isDefault: true,
    steps: ['Initiation', 'Credentials', 'WD Assign', 'Checklist', 'Equipment', 'First Access', 'BGC Check', '+2 more'],
    icon: 'verified_user',
    description: 'Standard onshore US onboarding track with 9 phases and automated gate transitions.',
  },
  {
    id: 'profile-002',
    name: 'US Offboarding Draft',
    code: 'us-offboarding-draft',
    status: 'active',
    phases: 3,
    milestones: 3,
    locations: ['Malvern HQ', 'Remote US (East)', 'Remote US (West)'],
    account: 'VG',
    updatedAt: 'Updated 2 days ago',
    steps: ['Notice Logged', 'Revocation & Archival', 'Final Sign-off'],
    icon: 'output',
    description: 'Controlled offboarding lifecycle covering handover, credential revocation, and final sign-off.',
  },
  {
    id: 'profile-003',
    name: 'US Onshore — Draft B',
    code: 'us-onshore-draft-b',
    status: 'active',
    phases: 11,
    milestones: 11,
    locations: ['Malvern HQ', 'Remote US (Federal/Gov)', 'Charlotte Secure Lab', 'Austin Ops Center', 'San Francisco Core'],
    account: 'VG',
    updatedAt: 'Updated 3 hours ago',
    steps: ['Pre-clearance', 'Security Intake', 'Device Provisioning', 'Escrow Key Gen', 'Compliance Gate', '+6 more'],
    icon: 'alt_route',
    description: 'Extended federal/government track with dual-clearance escrow and 11 compliance phases.',
  },
];

// ── Mock Canvas Nodes ─────────────────────────────────────────────────────────
export const mockCanvasNodes: CanvasNode[] = [
  { id: 'node-1', type: 'phase',   title: 'Initiation',           subtitle: 'Case kickoff & identity verification', x: 60,  y: 80,  status: 'complete', sla: '2 days',  owner: 'OT Lead' },
  { id: 'node-2', type: 'phase',   title: 'Credentials',          subtitle: 'SSO provisioning, email & VPN setup',  x: 280, y: 80,  status: 'complete', sla: '3 days',  owner: 'IT Ops' },
  { id: 'node-3', type: 'gate',    title: 'Identity Gate',        subtitle: 'Auto verification checkpoint',         x: 500, y: 80,  status: 'complete', sla: '1 day',   owner: 'System' },
  { id: 'node-4', type: 'phase',   title: 'WD Assign',            subtitle: 'Workday worker record creation',       x: 720, y: 80,  status: 'active',   sla: '2 days',  owner: 'HR Ops' },
  { id: 'node-5', type: 'action',  title: 'Checklist Review',     subtitle: 'Manager sign-off on essentials',       x: 940, y: 80,  status: 'pending',  sla: '1 day',   owner: 'DM' },
  { id: 'node-6', type: 'phase',   title: 'Equipment',            subtitle: 'Hardware provisioning & shipping',     x: 60,  y: 300, status: 'pending',  sla: '5 days',  owner: 'IT Ops' },
  { id: 'node-7', type: 'phase',   title: 'First Access',         subtitle: 'Day-1 environment ready check',       x: 280, y: 300, status: 'pending',  sla: '1 day',   owner: 'IT Ops' },
  { id: 'node-8', type: 'phase',   title: 'BGC Check',            subtitle: 'Background verification (3rd party)',  x: 500, y: 300, status: 'pending',  sla: '7 days',  owner: 'Compliance' },
  { id: 'node-9', type: 'gate',    title: 'Clearance Gate',       subtitle: 'HR + Legal final approval',           x: 720, y: 300, status: 'pending',  sla: '1 day',   owner: 'System' },
  { id: 'node-10', type: 'milestone', title: 'ONBOARDED',         subtitle: 'Candidate fully onboarded',           x: 940, y: 300, status: 'pending',  sla: 'Day 1',   owner: 'All' },
];

// ── Dashboard Stats ───────────────────────────────────────────────────────────
export const dashboardStats = {
  total: 42,
  active: 18,
  attention: 7,
  blocked: 3,
  completed: 14,
  avgDays: 23,
  slaBreach: 2,
};
