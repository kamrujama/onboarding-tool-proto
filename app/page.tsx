'use client';

import { AppProvider, useApp } from '@/lib/appContext';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import DashboardView from '@/components/views/DashboardView';
import ActiveView from '@/components/views/ActiveView';
import OnboardedView from '@/components/views/OnboardedView';
import AdminProfilesView from '@/components/views/AdminProfilesView';
import AdminCanvasView from '@/components/views/AdminCanvasView';
import NewCaseDrawer from '@/components/drawers/NewCaseDrawer';
import ProfileModal from '@/components/modals/ProfileModal';

function AppShell() {
  const { activeView } = useApp();

  const isCanvas = activeView === 'admin-canvas';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface)' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div style={{
        marginLeft: 240,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'var(--surface)',
      }}>
        {/* TopBar */}
        <TopBar />

        {/* Page Content */}
        <main style={{
          flex: 1,
          paddingTop: 64, // TopBar height
          padding: isCanvas ? '64px 24px 24px' : '80px 24px 32px',
          maxWidth: isCanvas ? '100%' : 1400,
          width: '100%',
        }}>
          {activeView === 'dashboard'       && <DashboardView />}
          {activeView === 'active'          && <ActiveView />}
          {activeView === 'onboarded'       && <OnboardedView />}
          {activeView === 'admin-profiles'  && <AdminProfilesView />}
          {activeView === 'admin-canvas'    && <AdminCanvasView />}
        </main>
      </div>

      {/* Global Overlays */}
      <NewCaseDrawer />
      <ProfileModal />
    </div>
  );
}

export default function HomePage() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
