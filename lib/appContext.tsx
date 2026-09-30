'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

// ── App State Types ────────────────────────────────────────────────────────────

export type ActiveView =
  | 'dashboard'
  | 'active'
  | 'onboarded'
  | 'admin-profiles'
  | 'admin-canvas';

export type DrawerView =
  | null
  | 'new-case-step1'
  | 'new-case-step2'
  | 'new-case-step3'
  | 'new-case-review';

export type ModalView =
  | null
  | 'create-profile'
  | 'edit-profile-metadata';

export interface NewCaseForm {
  // Step 1 — Identity
  epamPersonId: string;
  location: string;
  projectId: string;
  dmId: string;
  iopsOwnerId: string;
  expectedStart: string;
  // Step 2 — Workflow
  vgManagerId: string;
  jobCode: string;
  profileId: string;
  // Step 3 — Review (read-only)
}

export interface ProfileForm {
  name: string;
  code: string;
  description: string;
  account: string;
  locations: string[];
  status: 'active' | 'draft' | 'archived';
}

interface AppState {
  activeView: ActiveView;
  setActiveView: (v: ActiveView) => void;
  
  drawerView: DrawerView;
  openDrawer: (v: DrawerView) => void;
  closeDrawer: () => void;
  nextDrawerStep: () => void;
  prevDrawerStep: () => void;
  
  modalView: ModalView;
  openModal: (v: ModalView, profileId?: string) => void;
  closeModal: () => void;
  editingProfileId: string | null;

  selectedCanvasProfileId: string | null;
  setSelectedCanvasProfileId: (id: string) => void;

  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  
  propertiesPanelOpen: boolean;
  setPropertiesPanelOpen: (v: boolean) => void;

  newCaseForm: NewCaseForm;
  updateNewCaseForm: (patch: Partial<NewCaseForm>) => void;
  resetNewCaseForm: () => void;
  
  profileForm: ProfileForm;
  updateProfileForm: (patch: Partial<ProfileForm>) => void;
  resetProfileForm: () => void;
}

const drawerSteps: DrawerView[] = [
  'new-case-step1',
  'new-case-step2',
  'new-case-step3',
  'new-case-review',
];

const defaultNewCaseForm: NewCaseForm = {
  epamPersonId: '', location: '', projectId: '', dmId: '', iopsOwnerId: '',
  expectedStart: '', vgManagerId: '', jobCode: '', profileId: 'profile-001',
};

const defaultProfileForm: ProfileForm = {
  name: '', code: '', description: '',
  account: 'VG', locations: [], status: 'draft',
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [drawerView, setDrawerView] = useState<DrawerView>(null);
  const [modalView, setModalView] = useState<ModalView>(null);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [selectedCanvasProfileId, setSelectedCanvasProfileId] = useState<string>('profile-001');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [propertiesPanelOpen, setPropertiesPanelOpen] = useState(true);
  const [newCaseForm, setNewCaseForm] = useState<NewCaseForm>(defaultNewCaseForm);
  const [profileForm, setProfileForm] = useState<ProfileForm>(defaultProfileForm);

  const openDrawer = useCallback((v: DrawerView) => setDrawerView(v), []);
  const closeDrawer = useCallback(() => {
    setDrawerView(null);
    setNewCaseForm(defaultNewCaseForm);
  }, []);

  const nextDrawerStep = useCallback(() => {
    setDrawerView(prev => {
      const idx = drawerSteps.indexOf(prev!);
      return idx < drawerSteps.length - 1 ? drawerSteps[idx + 1] : prev;
    });
  }, []);

  const prevDrawerStep = useCallback(() => {
    setDrawerView(prev => {
      const idx = drawerSteps.indexOf(prev!);
      return idx > 0 ? drawerSteps[idx - 1] : prev;
    });
  }, []);

  const openModal = useCallback((v: ModalView, profileId?: string) => {
    setModalView(v);
    setEditingProfileId(profileId ?? null);
  }, []);

  const closeModal = useCallback(() => {
    setModalView(null);
    setEditingProfileId(null);
    setProfileForm(defaultProfileForm);
  }, []);

  const updateNewCaseForm = useCallback((patch: Partial<NewCaseForm>) => {
    setNewCaseForm(prev => ({ ...prev, ...patch }));
  }, []);

  const resetNewCaseForm = useCallback(() => setNewCaseForm(defaultNewCaseForm), []);

  const updateProfileForm = useCallback((patch: Partial<ProfileForm>) => {
    setProfileForm(prev => ({ ...prev, ...patch }));
  }, []);

  const resetProfileForm = useCallback(() => setProfileForm(defaultProfileForm), []);

  return (
    <AppContext.Provider value={{
      activeView, setActiveView,
      drawerView, openDrawer, closeDrawer, nextDrawerStep, prevDrawerStep,
      modalView, openModal, closeModal, editingProfileId,
      selectedCanvasProfileId, setSelectedCanvasProfileId,
      selectedNodeId, setSelectedNodeId,
      propertiesPanelOpen, setPropertiesPanelOpen,
      newCaseForm, updateNewCaseForm, resetNewCaseForm,
      profileForm, updateProfileForm, resetProfileForm,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
