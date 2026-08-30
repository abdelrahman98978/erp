import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { IamUser, IamCompany, IamMembership, IamRole, IamDelegation, IamSessionContext as IamSessionContextType } from '../types/iam';
import { iamPolicyEngine } from '../services/iamPolicyEngine';

const IamContext = createContext<IamSessionContextType | undefined>(undefined);

// Initial Fallback Super Admin User for Seamless Experience
const DEFAULT_SUPER_ADMIN: IamUser = {
  id: 'usr-admin-001',
  employeeNumber: 'EMP-0001',
  fullName: 'خالد بن عبدالعزيز السليم',
  email: 'khalid@alsulaim.sa',
  phone: '0501234567',
  jobTitle: 'رئيس مجلس الإدارة والمدير العام',
  accountType: 'Group Super Admin',
  status: 'نشط',
  mfaEnabled: true,
  mfaMethod: 'Google Authenticator',
  biometricEnabled: true,
  biometricType: 'بصمة مزدوجة',
  sessionTimeoutMinutes: 45,
};

const DEFAULT_COMPANIES: IamCompany[] = [
  {
    id: '22222222-2222-2222-2222-222222222221',
    tenantId: '11111111-1111-1111-1111-111111111111',
    code: 'SAF',
    legalName: 'شركة السفير الماسي للاستقدام',
    commercialName: 'السفير الماسي للاستقدام',
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
    legalName: 'شركة ياقوت نجد للاستقدام',
    commercialName: 'ياقوت نجد للاستقدام',
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
    legalName: 'شركة توباز للاستقدام',
    commercialName: 'توباز للاستقدام',
    crNumber: '1010345678',
    vatNumber: '310345678900003',
    primaryColor: '#0d9488',
    isGroupParent: false,
    status: 'نشط',
  },
  {
    id: '22222222-2222-2222-2222-222222222224',
    tenantId: '11111111-1111-1111-1111-111111111111',
    code: 'DAR',
    legalName: 'دار الرواد للاستقدام',
    commercialName: 'دار الرواد',
    crNumber: '1010456789',
    vatNumber: '310456789000003',
    primaryColor: '#7c3aed',
    isGroupParent: false,
    status: 'نشط',
  },
  {
    id: '22222222-2222-2222-2222-222222222225',
    tenantId: '11111111-1111-1111-1111-111111111111',
    code: 'KAS',
    legalName: 'مؤسسة خالد عبدالعزيز السليم للتجارة',
    commercialName: 'شركة كاس للتجارة والمقاولات',
    crNumber: '1010789234',
    vatNumber: '310284759200003',
    primaryColor: '#059669',
    isGroupParent: false,
    status: 'نشط',
  },
];

export const IamSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<IamUser | null>(DEFAULT_SUPER_ADMIN);
  const [companies, setCompanies] = useState<IamCompany[]>(DEFAULT_COMPANIES);
  const [activeCompanyCode, setActiveCompanyCode] = useState<string>('KAS');
  const [userMemberships, setUserMemberships] = useState<IamMembership[]>([]);
  const [activeRoles, setActiveRoles] = useState<IamRole[]>([]);
  const [delegations, setDelegations] = useState<IamDelegation[]>([]);
  const [permissionCodes, setPermissionCodes] = useState<Set<string>>(new Set([
    'dashboard.view',
    'group.dashboard.view',
    'employee.read',
    'employee.salary.read',
    'employee.create',
    'employee.edit',
    'invoice.read',
    'invoice.create',
    'invoice.approve',
    'payment.release',
    'vendor.create',
    'vendor.manage',
    'tender.manage',
    'boq.price',
    'report.export',
    'iam.manage',
    'audit.read',
  ]));

  // Load real companies from Supabase
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
    return userMemberships.find(m => m.companyId === activeCompany?.id) || null;
  }, [userMemberships, activeCompany]);

  const isSuperAdmin = currentUser?.accountType === 'Group Super Admin';
  const isBoardExecutive = currentUser?.accountType === 'Board / Group Executive';
  const canSwitchCompany = isSuperAdmin || isBoardExecutive || userMemberships.length > 1;

  const hasPermission = useCallback((permissionCode: string): boolean => {
    if (isSuperAdmin) return true; // Super Admin has unrestricted technical authority
    return permissionCodes.has(permissionCode);
  }, [isSuperAdmin, permissionCodes]);

  const canAccessBranch = useCallback((branchId: string): boolean => {
    if (isSuperAdmin || isBoardExecutive) return true;
    if (!activeMembership) return false;
    if (activeMembership.branchScope.includes('*')) return true;
    return activeMembership.branchScope.includes(branchId);
  }, [isSuperAdmin, isBoardExecutive, activeMembership]);

  const canAccessDepartment = useCallback((deptId: string): boolean => {
    if (isSuperAdmin || isBoardExecutive) return true;
    if (!activeMembership) return false;
    if (activeMembership.departmentScope.includes('*')) return true;
    return activeMembership.departmentScope.includes(deptId);
  }, [isSuperAdmin, isBoardExecutive, activeMembership]);

  const switchCompany = async (newCompanyCodeOrId: string): Promise<boolean> => {
    const target = companies.find(c => c.code === newCompanyCodeOrId || c.id === newCompanyCodeOrId);
    if (!target) return false;

    // Check authorization to switch
    if (!canSwitchCompany && target.id !== activeMembership?.companyId) {
      await iamPolicyEngine.logAudit({
        actorId: currentUser?.id,
        actorEmail: currentUser?.email || 'unknown',
        companyId: target.id,
        companyCode: target.code,
        action: 'COMPANY_SWITCH_ATTEMPT',
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
    userMemberships,
    activeMembership,
    activeRoles,
    permissionCodes,
    delegations,
    isSuperAdmin,
    isBoardExecutive,
    canSwitchCompany,
    switchCompany,
    hasPermission,
    canAccessBranch,
    canAccessDepartment,
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
