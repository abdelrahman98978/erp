import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { AppShell } from './components/layout/AppShell';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { CompanyProvider } from './contexts/CompanyContext';
import { ImpersonationProvider } from './contexts/ImpersonationContext';
import { RBACProvider } from './contexts/RBACContext';

import { useAppStore } from './stores/appStore';
import { QuickSearchModal } from './components/common/QuickSearchModal';
import { AICopilotWidget } from './components/common/AICopilotWidget';
import { LegalDisclaimerModal, SignedUndertakingRecord } from './components/legal/LegalDisclaimerModal';

import './styles/index.css';
import './styles/layout.css';
import './styles/components.css';

// Resilient Lazy Import with Auto-Recovery on Deployment Cache Mismatch
function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T } | any>
) {
  return lazy(() =>
    factory().catch((error: any) => {
      console.warn('Chunk import failed, attempting self-healing reload:', error);
      const isChunkError =
        error?.name === 'ChunkLoadError' ||
        error?.message?.includes('Failed to fetch dynamically imported module') ||
        error?.message?.includes('Expected a JavaScript-or-Wasm module script') ||
        error?.message?.includes('Importing a module script failed');

      if (isChunkError) {
        const reloadKey = 'erp_lazy_retry_lock';
        const last = sessionStorage.getItem(reloadKey);
        if (!last || Date.now() - Number(last) > 10000) {
          sessionStorage.setItem(reloadKey, String(Date.now()));
          window.location.reload();
          return new Promise(() => {}); // prevent further error cascade during reload
        }
      }
      throw error;
    })
  );
}

// Dynamic Lazy Imports for Enterprise Modules
const DashboardPage = lazyWithRetry(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const GroupCommandCenterPage = lazyWithRetry(() => import('./pages/GroupCommandCenterPage').then(m => ({ default: m.GroupCommandCenterPage })));
const CompanySelectorPortal = lazyWithRetry(() => import('./components/portal/CompanySelectorPortal').then(m => ({ default: m.CompanySelectorPortal })));
const EnterpriseATSPipelinePage = lazyWithRetry(() => import('./pages/EnterpriseATSPipelinePage').then(m => ({ default: m.EnterpriseATSPipelinePage })));
const ExternalOfficesAgentsPage = lazyWithRetry(() => import('./pages/ExternalOfficesAgentsPage').then(m => ({ default: m.ExternalOfficesAgentsPage })));
const UnifiedCommunicationCenterPage = lazyWithRetry(() => import('./pages/UnifiedCommunicationCenterPage').then(m => ({ default: m.UnifiedCommunicationCenterPage })));
const MicrosoftIntegrationCenterPage = lazyWithRetry(() => import('./pages/MicrosoftIntegrationCenterPage').then(m => ({ default: m.MicrosoftIntegrationCenterPage })));

const RecruitmentContractsPage = lazyWithRetry(() => import('./pages/RecruitmentContractsPage').then(m => ({ default: m.RecruitmentContractsPage })));
const RentContractsPage = lazyWithRetry(() => import('./pages/RentContractsPage').then(m => ({ default: m.RentContractsPage })));
const CreateCVPage = lazyWithRetry(() => import('./pages/CreateCVPage').then(m => ({ default: m.CreateCVPage })));
const OrdersPage = lazyWithRetry(() => import('./pages/OrdersPage').then(m => ({ default: m.OrdersPage })));
const ShelterPage = lazyWithRetry(() => import('./pages/ShelterPage').then(m => ({ default: m.ShelterPage })));
const SponsorshipTransferPage = lazyWithRetry(() => import('./pages/SponsorshipTransferPage').then(m => ({ default: m.SponsorshipTransferPage })));
const TravelPage = lazyWithRetry(() => import('./pages/TravelPage').then(m => ({ default: m.TravelPage })));
const ComplaintsPage = lazyWithRetry(() => import('./pages/ComplaintsPage').then(m => ({ default: m.ComplaintsPage })));
const OfficesPage = lazyWithRetry(() => import('./pages/OfficesPage').then(m => ({ default: m.OfficesPage })));
const FinancialRequestsPage = lazyWithRetry(() => import('./pages/FinancialRequestsPage').then(m => ({ default: m.FinancialRequestsPage })));
const FinancePage = lazyWithRetry(() => import('./pages/FinancePage').then(m => ({ default: m.FinancePage })));
const ClientsPage = lazyWithRetry(() => import('./pages/ClientsPage').then(m => ({ default: m.ClientsPage })));
const HRPage = lazyWithRetry(() => import('./pages/HRPage').then(m => ({ default: m.HRPage })));
const ReportsPage = lazyWithRetry(() => import('./pages/ReportsPage').then(m => ({ default: m.ReportsPage })));
const SettingsPage = lazyWithRetry(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const UsersPage = lazyWithRetry(() => import('./pages/UsersPage').then(m => ({ default: m.UsersPage })));
const LoginPage = lazyWithRetry(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const LandingPage = lazyWithRetry(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const WhatsAppInboxPage = lazyWithRetry(() => import('./pages/WhatsAppInboxPage').then(m => ({ default: m.WhatsAppInboxPage })));
const AgentImportsPage = lazyWithRetry(() => import('./pages/AgentImportsPage').then(m => ({ default: m.AgentImportsPage })));
const ZATCAPage = lazyWithRetry(() => import('./pages/ZATCAPage').then(m => ({ default: m.ZATCAPage })));
const AttendancesPage = lazyWithRetry(() => import('./pages/AttendancesPage').then(m => ({ default: m.AttendancesPage })));
const RentPackagesPage = lazyWithRetry(() => import('./pages/RentPackagesPage').then(m => ({ default: m.RentPackagesPage })));
const ActivityLogPage = lazyWithRetry(() => import('./pages/ActivityLogPage').then(m => ({ default: m.ActivityLogPage })));
const WebsiteVisitorsPage = lazyWithRetry(() => import('./pages/WebsiteVisitorsPage').then(m => ({ default: m.WebsiteVisitorsPage })));
const SentMessagesPage = lazyWithRetry(() => import('./pages/SentMessagesPage').then(m => ({ default: m.SentMessagesPage })));
const CustodiesPage = lazyWithRetry(() => import('./pages/CustodiesPage').then(m => ({ default: m.CustodiesPage })));
const CostCentersPage = lazyWithRetry(() => import('./pages/CostCentersPage').then(m => ({ default: m.CostCentersPage })));
const JournalsPage = lazyWithRetry(() => import('./pages/JournalsPage').then(m => ({ default: m.JournalsPage })));
const MasterConstantsPage = lazyWithRetry(() => import('./pages/MasterConstantsPage').then(m => ({ default: m.MasterConstantsPage })));
const AppLauncherPage = lazyWithRetry(() => import('./pages/AppLauncherPage').then(m => ({ default: m.AppLauncherPage })));
const IngazPage = lazyWithRetry(() => import('./pages/IngazPage').then(m => ({ default: m.IngazPage })));
const AdminDashboardPage = lazyWithRetry(() => import('./pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const BranchCommunicationPage = lazyWithRetry(() => import('./pages/BranchCommunicationPage').then(m => ({ default: m.BranchCommunicationPage })));
const GroupDispatchPage = lazyWithRetry(() => import('./pages/GroupDispatchPage').then(m => ({ default: m.GroupDispatchPage })));
const BranchDepartmentsPage = lazyWithRetry(() => import('./pages/BranchDepartmentsPage').then(m => ({ default: m.BranchDepartmentsPage })));
const DataImportWizardPage = lazyWithRetry(() => import('./pages/DataImportWizardPage').then(m => ({ default: m.DataImportWizardPage })));
const SmaccModulesPage = lazyWithRetry(() => import('./pages/SmaccModulesPage').then(m => ({ default: m.SmaccModulesPage })));
const SmaccAccountingPage = lazyWithRetry(() => import('./pages/SmaccAccountingPage').then(m => ({ default: m.SmaccAccountingPage })));
const SmaccInventoryAssetsPage = lazyWithRetry(() => import('./pages/SmaccInventoryAssetsPage').then(m => ({ default: m.SmaccInventoryAssetsPage })));
const SmaccEmployeesSettingsPage = lazyWithRetry(() => import('./pages/SmaccEmployeesSettingsPage').then(m => ({ default: m.SmaccEmployeesSettingsPage })));
const LegalCompliancePage = lazyWithRetry(() => import('./pages/LegalCompliancePage').then(m => ({ default: m.LegalCompliancePage })));
const TendersBOQPage = lazyWithRetry(() => import('./pages/TendersBOQPage').then(m => ({ default: m.TendersBOQPage })));
const KasEtimadCloudPage = lazyWithRetry(() => import('./pages/KasEtimadCloudPage').then(m => ({ default: m.KasEtimadCloudPage })));

const PageFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-8">
    <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-3" />
    <span className="text-sm font-medium text-slate-500 animate-pulse">جاري تحميل النظام المؤسسي...</span>
  </div>
);

const MainContent: React.FC = () => {
  const { flowState, setFlowState, activeTab, activeTabTitle, setActiveTab } = useAppStore();

  const [showLegalModal, setShowLegalModal] = useState(false);
  const [currentUserForLegal] = useState({
    name: 'مشرف admin (خالد السليم)',
    username: 'admin',
    department: 'التشغيل والاستقدام',
    job_title: 'الرئيس التنفيذي / مدير النظام',
    branch: 'الفرع الرئيسي',
    national_id: '1012345678',
    role: 'Administrator'
  });

  useEffect(() => {
    // Check if user acknowledged legal policy on first login
    if (flowState === 'workspace' || flowState === 'launcher') {
      const key = `alsulaim_legal_acknowledged_${currentUserForLegal.username}`;
      const isSigned = localStorage.getItem(key);
      if (!isSigned) {
        setShowLegalModal(true);
      }
    }
  }, [flowState, currentUserForLegal.username]);

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

  useEffect(() => {
    const handleNav = (e: any) => {
      if (e.detail?.tab) {
        handleSelectTab(e.detail.tab, e.detail.title || e.detail.tab);
      }
    };
    window.addEventListener('alsulaim_navigate', handleNav);
    return () => window.removeEventListener('alsulaim_navigate', handleNav);
  }, []);

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
      case 'contract-extension-requests':
      case 'contract-return-requests':
      case 'musaned-pipeline':
      case 'musaned-sync':
      case 'contract-insurance':
        return <RecruitmentContractsPage />;

      case 'rent-contracts':
      case 'create-rent':
      case 'all-rent-contracts':
      case 'rental-orders':
      case 'active-rent':
      case 'transferred-rent':
      case 'completed-rent':
      case 'rent-contract-terms':
      case 'rental-drivers':
      case 'rental-domestic':
        return <RentContractsPage />;

      case 'rent-packages':
        return <RentPackagesPage />;

      case 'create-cv':
      case 'cvs-recruitment':
      case 'cvs-rental':
      case 'cvs-backout':
      case 'cvs-deleted':
      case 'cvs-pending':
      case 'cvs-reserved':
      case 'cvs':
        return <CreateCVPage />;

      case 'orders':
      case 'all-orders':
      case 'new-orders':
      case 'in-progress-orders':
      case 'contracted-orders':
      case 'incomplete-orders':
      case 'urgent-orders':
      case 'create-order':
      case 'professional-requests':
      case 'special-requests':
      case 'renew-contracts':
      case 'known-service':
      case 'contact-requests':
        return <OrdersPage />;

      case 'ingaz':
      case 'create-ingaz':
      case 'ingaz-delegations':
      case 'chamber-commerce':
      case 'visa-issuance':
        return <IngazPage />;

      case 'shelter':
      case 'create-shelter':
      case 'inside-shelter':
      case 'outside-shelter':
      case 'available-transfer':
      case 'deportation-stage':
      case 'shelter-places':
      case 'room-management':
      case 'food-catering':
        return <ShelterPage />;

      case 'sponsorship-transfer':
      case 'transfer-requests':
      case 'web-transfer-requests':
      case 'trial-period':
      case 'transferred-done':
      case 'transfer-contract-terms':
        return <SponsorshipTransferPage />;

      case 'travel':
      case 'arrival-flights':
      case 'deportation-flights':
      case 'deportation-travel':
      case 'logistics':
      case 'airport-reception':
        return <TravelPage />;

      case 'complaints':
      case 'complaints-list':
      case 'create-complaint':
      case 'complaint-types':
      case 'compensation-claims':
        return <ComplaintsPage />;

      case 'offices':
      case 'offices-list':
      case 'office-list':
      case 'add-office':
      case 'office-transfers':
      case 'agent-accounts':
        return <OfficesPage />;

      case 'financial-requests':
      case 'cash-custody':
      case 'all-fin-requests':
      case 'create-fin-request':
      case 'petty-cash':
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
      case 'vouchers':
      case 'receipt-vouchers':
      case 'payment-vouchers':
      case 'banks-boxes':
      case 'bank-reconciliation':
      case 'vat-declaration':
      case 'tax-returns':
      case 'chart-accounts':
        return <FinancePage />;

      case 'cost-centers':
        return <CostCentersPage />;

      case 'journals':
        return <JournalsPage />;

      case 'smacc-accounting':
        return <SmaccAccountingPage />;

      case 'smacc-inventory':
      case 'smacc-inventory-assets':
        return <SmaccInventoryAssetsPage />;

      case 'smacc-hr-settings':
      case 'smacc-employees':
        return <SmaccEmployeesSettingsPage />;

      case 'smacc-modules':
      case 'sales-collectors':
        return <SmaccModulesPage />;

      case 'clients':
      case 'client-list':
      case 'new-client':
      case 'black-list':
      case 'client-blacklist':
      case 'client-categories':
      case 'crm':
        return <ClientsPage />;

      case 'employees':
      case 'employee-list':
      case 'add-employee':
      case 'maids-hr':
      case 'payroll':
      case 'payrolls':
      case 'wps':
      case 'wps-generator':
      case 'salary':
      case 'leave-requests':
      case 'employee-advances':
      case 'employee-sanctions':
      case 'employee-permissions':
      case 'employee-rewards':
      case 'end-of-service':
      case 'gosi-insurance':
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
      case 'system-backup':
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
      case 'sms-dispatch':
        return <SentMessagesPage />;

      case 'visitors':
      case 'website-visitors':
        return <WebsiteVisitorsPage />;

      case 'agent-imports':
        return <AgentImportsPage />;

      case 'data-import':
      case 'import-wizard':
        return <DataImportWizardPage />;

      case 'zatca':
      case 'zatca-phase2':
      case 'zatca-settings':
      case 'shared-bills':
        return <ZATCAPage />;

      case 'attendances':
      case 'daily-work-reports':
        return <AttendancesPage />;

      case 'activity-logs':
      case 'activity-log':
        return <ActivityLogPage />;

      case 'legal-compliance':
      case 'legal-disclaimers':
      case 'legal-policies':
        return <LegalCompliancePage />;

      case 'tenders-boq':
      case 'tenders':
      case 'boq':
      case 'kas-tenders':
      case 'boq-analytics':
        return <TendersBOQPage />;

      case 'kas-etmad':
      case 'kas-etmad-cloud':
      case 'etmad-cloud':
      case 'etmad':
      case 'kas-cloud-suite':
        return <KasEtimadCloudPage />;

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
      <AICopilotWidget onNavigate={handleSelectTab} />
      {showLegalModal && (
        <LegalDisclaimerModal
          user={currentUserForLegal}
          onAcceptAndContinue={() => setShowLegalModal(false)}
          onLogout={handleLogout}
        />
      )}
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
