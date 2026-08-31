import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  IamUser, 
  IamCompany, 
  IamMembership, 
  IamRole, 
  IamDelegation, 
  IamSessionContext as IamSessionContextType,
  DataScopeLevel,
  DataScopeName,
  ModuleAction,
  RecordAccessContext
} from '../types/iam';
import { iamPolicyEngine } from '../services/iamPolicyEngine';

const IamContext = createContext<IamSessionContextType | undefined>(undefined);

// Initial Super Admin User conforming to corporate structure
const DEFAULT_SUPER_ADMIN: IamUser = {
  id: 'usr-admin-001',
  employeeNumber: 'EMP-0001',
  fullName: 'خالد بن عبدالعزيز السليم',
  username: 'khalid.admin',
  email: 'khalid@alsulaim.sa',
  phone: '0501234567',
  jobTitle: 'رئيس مجلس الإدارة والرئيس التنفيذي للمجموعة',
  accountType: 'Group Super Admin',
  status: 'نشط',
  dataScope: 6,
  mfaEnabled: true,
  mfaMethod: 'Google Authenticator',
  biometricEnabled: true,
  biometricType: 'بصمة مزدوجة',
  sessionTimeoutMinutes: 45,
};

// 4 Official Corporate Group Companies
const DEFAULT_COMPANIES: IamCompany[] = [
  {
    id: '22222222-2222-2222-2222-222222222221',
    tenantId: '11111111-1111-1111-1111-111111111111',
    code: 'SAF',
    legalName: 'شركة الصفا الماسي للاستقدام',
    commercialName: 'الصفا الماسي للاستقدام (SAF RC01)',
    crNumber: '1010123456',
    vatNumber: '310123456700003',
    primaryColor: '#0284c7',
    isGroupParent: false,
    status: 'نشط',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    tenantId: '11111111-1111-1111-1111-111111111111',
    code: 'YAQ',
    legalName: 'شركة الياقوت الشرقية للتشغيل والتأجير',
    commercialName: 'الياقوت الشرقية للتشغيل (YAQ RC02)',
    crNumber: '1010234567',
    vatNumber: '310234567800003',
    primaryColor: '#b91c1c',
    isGroupParent: false,
    status: 'نشط',
  },
  {
    id: '22222222-2222-2222-2222-222222222223',
    tenantId: '11111111-1111-1111-1111-111111111111',
    code: 'TOP',
    legalName: 'شركة توب تالنت الدولية للتوظيف',
    commercialName: 'توب تالنت الدولية للتوظيف (TOP RC03)',
    crNumber: '1010345678',
    vatNumber: '310345678900003',
    primaryColor: '#0d9488',
    isGroupParent: false,
    status: 'نشط',
  },
  {
    id: '22222222-2222-2222-2222-222222222224',
    tenantId: '11111111-1111-1111-1111-111111111111',
    code: 'KAS',
    legalName: 'مؤسسة كاس وسحابة اعتماد للمنافسات والتشغيل',
    commercialName: 'كاس للمنافسات والتشغيل (KAS RC04)',
    crNumber: '1010789234',
    vatNumber: '310284759200003',
    primaryColor: '#059669',
    isGroupParent: false,
    status: 'نشط',
  },
];

const DATA_SCOPE_NAMES: Record<DataScopeLevel, DataScopeName> = {
  0: 'No Access',
  1: 'Own',
  2: 'Team',
  3: 'Department',
  4: 'Branch',
  5: 'Company',
  6: 'Group',
};

export const IamSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<IamUser | null>(DEFAULT_SUPER_ADMIN);
  const [companies, setCompanies] = useState<IamCompany[]>(DEFAULT_COMPANIES);
  const [activeCompanyCode, setActiveCompanyCode] = useState<string>('SAF');
  const [userMemberships, setUserMemberships] = useState<IamMembership[]>([]);
  const [activeRoles, setActiveRoles] = useState<IamRole[]>([]);
  const [delegations, setDelegations] = useState<IamDelegation[]>([]);
  
  // Default Permissions Set for Super Admin / Active Session
  const [permissionCodes, setPermissionCodes] = useState<Set<string>>(new Set([
    '*',
    'dashboard.view',
    'group.dashboard.view',
    'recruitment.view',
    'recruitment.create',
    'recruitment.edit',
    'recruitment.approve',
    'recruitment.export',
    'hr.view',
    'hr.create',
    'hr.edit',
    'hr.delete',
    'hr.export',
    'finance.view',
    'finance.create',
    'finance.edit',
    'finance.approve',
    'finance.export',
    'rent.view',
    'rent.create',
    'rent.edit',
    'rent.approve',
    'tenders.view',
    'tenders.create',
    'tenders.edit',
    'tenders.approve',
    'shelter.view',
    'shelter.create',
    'shelter.edit',
    'shelter.export',
    'iam.view',
    'iam.manage',
    'settings.view',
    'settings.edit',
    'audit.view',
    'audit.export',
  ]));

  // Load real companies from Supabase / IAM engine
  useEffect(() => {
    let isMounted = true;
    iamPolicyEngine.getCompanies().then((realCos) => {
      if (isMounted && realCos.length > 0) {
        setCompanies(realCos);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const activeCompany = useMemo(() => {
    return companies.find(c => c.code === activeCompanyCode) || companies[0] || DEFAULT_COMPANIES[0];
  }, [companies, activeCompanyCode]);

  const activeMembership = useMemo(() => {
    if (userMemberships.length > 0) {
      return userMemberships.find(m => m.companyId === activeCompany?.id || m.companyCode === activeCompany?.code) || null;
    }
    // Fallback membership for root super admin across all 4 companies
    return {
      id: `mem-root-${activeCompany?.code}`,
      userId: currentUser?.id || 'usr-admin-001',
      companyId: activeCompany?.id || '',
      companyCode: activeCompany?.code,
      companyName: activeCompany?.legalName,
      dataScope: (currentUser?.accountType === 'Group Super Admin' ? 6 : (currentUser?.dataScope ?? 5)) as DataScopeLevel,
      dataScopeName: DATA_SCOPE_NAMES[(currentUser?.accountType === 'Group Super Admin' ? 6 : (currentUser?.dataScope ?? 5)) as DataScopeLevel],
      branchScope: ['*'],
      departmentScope: ['*'],
      isPrimary: true,
      status: 'نشط' as const,
      validFrom: '2026-01-01',
    };
  }, [userMemberships, activeCompany, currentUser]);

  const dataScope: DataScopeLevel = useMemo(() => {
    if (currentUser?.accountType === 'Group Super Admin') return 6;
    if (activeMembership?.dataScope !== undefined) return activeMembership.dataScope;
    return (currentUser?.dataScope ?? 5) as DataScopeLevel;
  }, [currentUser, activeMembership]);

  const dataScopeName: DataScopeName = DATA_SCOPE_NAMES[dataScope] || 'Company';

  const allowedCompanyIds: string[] = useMemo(() => {
    if (currentUser?.accountType === 'Group Super Admin' || currentUser?.accountType === 'Board / Group Executive') {
      return ['*', ...companies.map(c => c.id), ...companies.map(c => c.code)];
    }
    if (userMemberships.length > 0) {
      return userMemberships.map(m => m.companyId);
    }
    return [activeCompany?.id || ''];
  }, [currentUser, companies, userMemberships, activeCompany]);

  const allowedBranchIds: string[] = useMemo(() => {
    if (currentUser?.accountType === 'Group Super Admin' || currentUser?.accountType === 'Board / Group Executive') {
      return ['*'];
    }
    return activeMembership?.branchScope || ['*'];
  }, [currentUser, activeMembership]);

  const allowedDepartmentIds: string[] = useMemo(() => {
    if (currentUser?.accountType === 'Group Super Admin' || currentUser?.accountType === 'Board / Group Executive') {
      return ['*'];
    }
    return activeMembership?.departmentScope || ['*'];
  }, [currentUser, activeMembership]);

  const isSuperAdmin = currentUser?.accountType === 'Group Super Admin';
  const isBoardExecutive = currentUser?.accountType === 'Board / Group Executive';
  const isCompanyAdmin = isSuperAdmin || isBoardExecutive || currentUser?.accountType === 'Company Admin';
  const isBranchManager = currentUser?.accountType === 'Branch Manager';
  const isDepartmentManager = currentUser?.accountType === 'Department Manager';
  const canSwitchCompany = isSuperAdmin || isBoardExecutive || userMemberships.length > 1;

  // Single Permission Check
  const hasPermission = useCallback((permissionCode: string): boolean => {
    if (isSuperAdmin) return true; // Technical Super Admin unrestricted access
    if (permissionCodes.has('*')) return true;
    if (permissionCodes.has(permissionCode)) return true;

    // Check wildcard module permissions like 'hr.*'
    const parts = permissionCode.split('.');
    if (parts.length > 1 && permissionCodes.has(`${parts[0]}.*`)) {
      return true;
    }
    return false;
  }, [isSuperAdmin, permissionCodes]);

  // Evaluates Full 8-Stage Multi-Entity Decision Flow
  const canPerform = useCallback((module: string, action: ModuleAction, recordContext?: RecordAccessContext): boolean => {
    const decision = iamPolicyEngine.evaluateAccessDecision(
      {
        user: currentUser,
        activeTenantId: activeCompany?.tenantId || '11111111-1111-1111-1111-111111111111',
        activeCompanyId: activeCompany?.id || '',
        allowedCompanyIds,
        allowedBranchIds,
        allowedDepartmentIds,
        dataScope,
        permissionCodes,
      },
      module,
      action,
      recordContext
    );
    return decision.allowed;
  }, [currentUser, activeCompany, allowedCompanyIds, allowedBranchIds, allowedDepartmentIds, dataScope, permissionCodes]);

  const canAccessBranch = useCallback((branchId: string): boolean => {
    if (isSuperAdmin || isBoardExecutive) return true;
    if (allowedBranchIds.includes('*')) return true;
    return allowedBranchIds.includes(branchId);
  }, [isSuperAdmin, isBoardExecutive, allowedBranchIds]);

  const canAccessDepartment = useCallback((deptId: string): boolean => {
    if (isSuperAdmin || isBoardExecutive) return true;
    if (allowedDepartmentIds.includes('*')) return true;
    return allowedDepartmentIds.includes(deptId);
  }, [isSuperAdmin, isBoardExecutive, allowedDepartmentIds]);

  // Filter records by Active Company and Data Scope
  const filterRecords = useCallback(<T extends RecordAccessContext>(records: T[]): T[] => {
    return iamPolicyEngine.filterRecordsByScope(records, {
      user: currentUser,
      activeCompanyId: activeCompany?.id || '',
      allowedBranchIds,
      allowedDepartmentIds,
      dataScope,
      isSuperAdmin,
    });
  }, [currentUser, activeCompany, allowedBranchIds, allowedDepartmentIds, dataScope, isSuperAdmin]);

  // Safe Company Switch with Zero Privilege Leakage
  const switchCompany = async (newCompanyCodeOrId: string): Promise<boolean> => {
    const target = companies.find(c => c.code === newCompanyCodeOrId || c.id === newCompanyCodeOrId);
    if (!target) return false;

    // Check authorization to switch
    const isAuthorized = isSuperAdmin || 
                         isBoardExecutive || 
                         allowedCompanyIds.includes('*') || 
                         allowedCompanyIds.includes(target.id) || 
                         allowedCompanyIds.includes(target.code);

    if (!isAuthorized) {
      await iamPolicyEngine.logAudit({
        actorId: currentUser?.id,
        actorEmail: currentUser?.email || 'unknown',
        companyId: target.id,
        companyCode: target.code,
        action: 'COMPANY_ACCESS_FORBIDDEN',
        resource: 'iam_companies',
        recordId: target.id,
        result: 'FORBIDDEN',
        severity: 'خطر أمني',
      });
      return false;
    }

    const previousCompany = activeCompanyCode;
    setActiveCompanyCode(target.code);

    // Record Company Switch in Audit Log
    await iamPolicyEngine.logAudit({
      actorId: currentUser?.id,
      actorEmail: currentUser?.email || 'unknown',
      companyId: target.id,
      companyCode: target.code,
      action: 'COMPANY_SWITCH',
      resource: 'iam_companies',
      recordId: target.id,
      result: 'SUCCESS',
      severity: 'معلومات',
      oldValues: { fromCompany: previousCompany },
      newValues: { toCompany: target.code },
    });

    return true;
  };

  const logAuditAction = async (
    action: string,
    resource: string,
    result: 'SUCCESS' | 'FORBIDDEN' | 'FAILED',
    recordId?: string,
    details?: any
  ): Promise<void> => {
    await iamPolicyEngine.logAudit({
      actorId: currentUser?.id,
      actorEmail: currentUser?.email || 'unknown',
      companyId: activeCompany?.id,
      companyCode: activeCompany?.code,
      action,
      resource,
      recordId,
      result,
      severity: result === 'FORBIDDEN' ? 'تحذير' : 'معلومات',
      newValues: details,
    });
  };

  const value: IamSessionContextType = {
    currentUser,
    activeTenantId: activeCompany?.tenantId || '11111111-1111-1111-1111-111111111111',
    activeCompanyId: activeCompany?.id || '',
    activeCompany,
    allowedCompanyIds,
    allowedBranchIds,
    allowedDepartmentIds,
    dataScope,
    dataScopeName,
    userMemberships,
    activeMembership,
    activeRoles,
    permissionCodes,
    delegations,
    isSuperAdmin,
    isBoardExecutive,
    isCompanyAdmin,
    isBranchManager,
    isDepartmentManager,
    canSwitchCompany,
    switchCompany,
    hasPermission,
    canPerform,
    canAccessBranch,
    canAccessDepartment,
    filterRecords,
    logAuditAction,
  };

  return <IamContext.Provider value={value}>{children}</IamContext.Provider>;
};

export const useIamSession = (): IamSessionContextType => {
  const context = useContext(IamContext);
  if (!context) {
    throw new Error('useIamSession must be used within an IamSessionProvider');
  }
  return context;
};
