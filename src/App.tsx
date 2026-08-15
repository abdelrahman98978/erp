import React, { useState, lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { AppShell } from './components/layout/AppShell';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { CompanyProvider } from './contexts/CompanyContext';
import { ImpersonationProvider } from './contexts/ImpersonationContext';
import { RBACProvider } from './contexts/RBACContext';

import { useAppStore } from './stores/appStore';
import { QuickSearchModal } from './components/common/QuickSearchModal';

import './styles/index.css';
import './styles/layout.css';
import './styles/components.css';

// Dynamic Lazy Imports for Enterprise Modules
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const GroupCommandCenterPage = lazy(() => import('./pages/GroupCommandCenterPage').then(m => ({ default: m.GroupCommandCenterPage })));
const CompanySelectorPortal = lazy(() => import('./components/portal/CompanySelectorPortal').then(m => ({ default: m.CompanySelectorPortal })));
const EnterpriseATSPipelinePage = lazy(() => import('./pages/EnterpriseATSPipelinePage').then(m => ({ default: m.EnterpriseATSPipelinePage })));
const ExternalOfficesAgentsPage = lazy(() => import('./pages/ExternalOfficesAgentsPage').then(m => ({ default: m.ExternalOfficesAgentsPage })));
const UnifiedCommunicationCenterPage = lazy(() => import('./pages/UnifiedCommunicationCenterPage').then(m => ({ default: m.UnifiedCommunicationCenterPage })));
const MicrosoftIntegrationCenterPage = lazy(() => import('./pages/MicrosoftIntegrationCenterPage').then(m => ({ default: m.MicrosoftIntegrationCenterPage })));

const RecruitmentContractsPage = lazy(() => import('./pages/RecruitmentContractsPage').then(m => ({ default: m.RecruitmentContractsPage })));
const RentContractsPage = lazy(() => import('./pages/RentContractsPage').then(m => ({ default: m.RentContractsPage })));
const CreateCVPage = lazy(() => import('./pages/CreateCVPage').then(m => ({ default: m.CreateCVPage })));
const OrdersPage = lazy(() => import('./pages/OrdersPage').then(m => ({ default: m.OrdersPage })));
const ShelterPage = lazy(() => import('./pages/ShelterPage').then(m => ({ default: m.ShelterPage })));
const SponsorshipTransferPage = lazy(() => import('./pages/SponsorshipTransferPage').then(m => ({ default: m.SponsorshipTransferPage })));
const TravelPage = lazy(() => import('./pages/TravelPage').then(m => ({ default: m.TravelPage })));
const ComplaintsPage = lazy(() => import('./pages/ComplaintsPage').then(m => ({ default: m.ComplaintsPage })));
const OfficesPage = lazy(() => import('./pages/OfficesPage').then(m => ({ default: m.OfficesPage })));
const FinancialRequestsPage = lazy(() => import('./pages/FinancialRequestsPage').then(m => ({ default: m.FinancialRequestsPage })));
const FinancePage = lazy(() => import('./pages/FinancePage').then(m => ({ default: m.FinancePage })));
const ClientsPage = lazy(() => import('./pages/ClientsPage').then(m => ({ default: m.ClientsPage })));
const HRPage = lazy(() => import('./pages/HRPage').then(m => ({ default: m.HRPage })));
const ReportsPage = lazy(() => import('./pages/ReportsPage').then(m => ({ default: m.ReportsPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const UsersPage = lazy(() => import('./pages/UsersPage').then(m => ({ default: m.UsersPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const WhatsAppInboxPage = lazy(() => import('./pages/WhatsAppInboxPage').then(m => ({ default: m.WhatsAppInboxPage })));
const AgentImportsPage = lazy(() => import('./pages/AgentImportsPage').then(m => ({ default: m.AgentImportsPage })));
const ZATCAPage = lazy(() => import('./pages/ZATCAPage').then(m => ({ default: m.ZATCAPage })));
const AttendancesPage = lazy(() => import('./pages/AttendancesPage').then(m => ({ default: m.AttendancesPage })));
const RentPackagesPage = lazy(() => import('./pages/RentPackagesPage').then(m => ({ default: m.RentPackagesPage })));
const ActivityLogPage = lazy(() => import('./pages/ActivityLogPage').then(m => ({ default: m.ActivityLogPage })));
const WebsiteVisitorsPage = lazy(() => import('./pages/WebsiteVisitorsPage').then(m => ({ default: m.WebsiteVisitorsPage })));
const SentMessagesPage = lazy(() => import('./pages/SentMessagesPage').then(m => ({ default: m.SentMessagesPage })));
const CustodiesPage = lazy(() => import('./pages/CustodiesPage').then(m => ({ default: m.CustodiesPage })));
const CostCentersPage = lazy(() => import('./pages/CostCentersPage').then(m => ({ default: m.CostCentersPage })));
const JournalsPage = lazy(() => import('./pages/JournalsPage').then(m => ({ default: m.JournalsPage })));
const MasterConstantsPage = lazy(() => import('./pages/MasterConstantsPage').then(m => ({ default: m.MasterConstantsPage })));
const AppLauncherPage = lazy(() => import('./pages/AppLauncherPage').then(m => ({ default: m.AppLauncherPage })));
const IngazPage = lazy(() => import('./pages/IngazPage').then(m => ({ default: m.IngazPage })));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const BranchCommunicationPage = lazy(() => import('./pages/BranchCommunicationPage').then(m => ({ default: m.BranchCommunicationPage })));
const GroupDispatchPage = lazy(() => import('./pages/GroupDispatchPage').then(m => ({ default: m.GroupDispatchPage })));
const BranchDepartmentsPage = lazy(() => import('./pages/BranchDepartmentsPage').then(m => ({ default: m.BranchDepartmentsPage })));

const PageFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-8">
    <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-3" />
    <span className="text-sm font-medium text-slate-500 animate-pulse">جاري تحميل النظام المؤسسي...</span>
  </div>
);

const MainContent: React.FC = () => {
  const { flowState, setFlowState, activeTab, activeTabTitle, setActiveTab } = useAppStore();

  const handleSelectTab = (href: string, title: string) => {
    if (href === 'logout') {
      setFlowState('landing');
      return;
    }
    setFlowState('workspace');
    setActiveTab(href, title);
  };

  const handleLogout = () => {
    setFlowState('landing');
  };

  // 1. Landing Page (Portal Overview)
  if (flowState === 'landing') {
    return (
      <Suspense fallback={<PageFallback />}>
        <LandingPage onSelectCompany={() => setFlowState('login')} />
      </Suspense>
    );
  }

  // 2. Login Page
  if (flowState === 'login') {
    return (
      <Suspense fallback={<PageFallback />}>
        <LoginPage onLoginSuccess={() => setFlowState('launcher')} />
      </Suspense>
    );
  }

  // 3. App Launcher Explorer Portal
  if (flowState === 'launcher') {
    return (
      <Suspense fallback={<PageFallback />}>
        <AppLauncherPage onSelectApp={handleSelectTab} />
      </Suspense>
    );
  }

  // 4. ERP Workspace Router
  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleSelectTab} />;

      case 'group-command-center':
        return <GroupCommandCenterPage />;

      case 'company-selector':
        return <CompanySelectorPortal onSelectCompany={() => handleSelectTab('dashboard', 'الرئيسية والمؤشرات التشغيلية')} />;

      case 'ats-pipeline':
        return <EnterpriseATSPipelinePage />;

      case 'external-offices':
        return <ExternalOfficesAgentsPage />;

      case 'unified-communication':
        return <UnifiedCommunicationCenterPage />;

      case 'microsoft-center':
        return <MicrosoftIntegrationCenterPage />;

      case 'admin-dashboard':
        return <AdminDashboardPage onNavigate={handleSelectTab} />;

      case 'branch-communication':
        return <BranchCommunicationPage />;

      case 'group-dispatch':
        return <GroupDispatchPage />;

      case 'branch-departments':
        return <BranchDepartmentsPage />;

      case 'recruitment-contracts':
      case 'create-contract':
      case 'current-contracts':
      case 'completed-contracts':
      case 'returned-contracts':
      case 'dispatches':
        return <RecruitmentContractsPage />;

      case 'rent-contracts':
      case 'create-rent':
      case 'all-rent-contracts':
      case 'active-rent':
      case 'transferred-rent':
        return <RentContractsPage />;

      case 'rent-packages':
        return <RentPackagesPage />;

      case 'create-cv':
      case 'cvs-recruitment':
      case 'cvs-rental':
      case 'cvs-backout':
      case 'cvs-deleted':
      case 'cvs-pending':
      case 'cvs':
        return <CreateCVPage />;

      case 'orders':
      case 'all-orders':
      case 'new-orders':
      case 'in-progress-orders':
      case 'contracted-orders':
      case 'professional-requests':
      case 'special-requests':
      case 'known-service':
        return <OrdersPage />;

      case 'ingaz':
      case 'create-ingaz':
      case 'ingaz-delegations':
        return <IngazPage />;

      case 'shelter':
      case 'create-shelter':
      case 'inside-shelter':
      case 'outside-shelter':
      case 'available-transfer':
      case 'deportation-stage':
        return <ShelterPage />;

      case 'sponsorship-transfer':
      case 'transfer-requests':
      case 'trial-period':
      case 'transferred-done':
        return <SponsorshipTransferPage />;

      case 'arrival-flights':
      case 'deportation-flights':
      case 'logistics':
        return <TravelPage />;

      case 'complaints':
      case 'complaints-list':
      case 'create-complaint':
      case 'complaint-types':
        return <ComplaintsPage />;

      case 'offices':
      case 'offices-list':
      case 'office-list':
      case 'add-office':
      case 'office-transfers':
        return <OfficesPage />;

      case 'financial-requests':
      case 'cash-custody':
      case 'all-fin-requests':
      case 'create-fin-request':
        return <FinancialRequestsPage />;

      case 'finance-home':
      case 'finance':
      case 'finance-erp':
      case 'general-ledger':
      case 'trial-balance':
      case 'income-statement':
      case 'balance-sheet':
      case 'invoices':
      case 'receipts':
      case 'payment-vouchers':
      case 'tax-returns':
      case 'chart-accounts':
        return <FinancePage />;

      case 'cost-centers':
        return <CostCentersPage />;

      case 'journals':
        return <JournalsPage />;

      case 'clients':
      case 'client-list':
      case 'new-client':
      case 'black-list':
      case 'crm':
        return <ClientsPage />;

      case 'employees':
      case 'employee-list':
      case 'payroll':
      case 'leave-requests':
      case 'salaries':
      case 'hr':
        return <HRPage />;

      case 'reports':
      case 'reports-hub':
      case 'executive-summary':
      case 'sales-reports':
      case 'recruitment-reports':
      case 'financial-reports':
        return <ReportsPage />;

      case 'settings':
      case 'general-settings':
      case 'company-profile':
      case 'integrations':
      case 'quick-links-settings':
        return <SettingsPage />;

      case 'master-constants':
      case 'nationalities-jobs':
        return <MasterConstantsPage />;

      case 'users':
      case 'users-list':
      case 'roles-permissions':
      case 'users-access':
        return <UsersPage />;

      case 'whatsapp-inbox':
        return <WhatsAppInboxPage />;

      case 'whatsapp-dispatch':
      case 'messages':
      case 'sent-messages':
        return <SentMessagesPage />;

      case 'visitors':
      case 'website-visitors':
        return <WebsiteVisitorsPage />;

      case 'agent-imports':
        return <AgentImportsPage />;

      case 'zatca':
      case 'zatca-phase2':
      case 'zatca-settings':
      case 'shared-bills':
        return <ZATCAPage />;

      case 'attendances':
        return <AttendancesPage />;

      case 'activity-logs':
      case 'activity-log':
        return <ActivityLogPage />;

      case 'custodies':
        return <CustodiesPage />;

      default:
        return <DashboardPage onNavigate={handleSelectTab} />;
    }
  };

  return (
    <>
      <AppShell
        activeTab={activeTab}
        activeTabTitle={activeTabTitle}
        onSelectTab={handleSelectTab}
        onOpenAppLauncher={() => setFlowState('launcher')}
        onLogout={handleLogout}
      >
        <Suspense fallback={<PageFallback />}>
          {renderPage()}
        </Suspense>
      </AppShell>
      <QuickSearchModal onNavigate={handleSelectTab} />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CompanyProvider>
          <RBACProvider>
            <ImpersonationProvider>
              <MainContent />
            </ImpersonationProvider>
          </RBACProvider>
        </CompanyProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
