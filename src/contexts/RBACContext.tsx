import React, { createContext, useContext, useState } from 'react';
import { CompanyId, RoleType, PermissionAction, UserPermission } from '../types';
import { useCompany } from './CompanyContext';

export interface UserRoleProfile {
  id: string;
  name: string;
  role: RoleType;
  primaryCompanyId: CompanyId;
  allowedCompanyIds: CompanyId[]; // 'all' or list of company IDs
  permissions: UserPermission[];
}

const DEFAULT_SUPER_ADMIN_PROFILE: UserRoleProfile = {
  id: 'USER-001',
  name: 'سليمان خالد السليم',
  role: 'SUPER_ADMIN',
  primaryCompanyId: 'all',
  allowedCompanyIds: ['all', 'SAF', 'YAQ', 'TOP', 'DAR'],
  permissions: [
    { module: '*', actions: ['view', 'create', 'edit', 'approve', 'post', 'cancel', 'export', 'print', 'download', 'share', 'delete'], scope: 'GROUP' },
  ],
};

interface RBACContextType {
  currentRoleProfile: UserRoleProfile;
  setRoleProfile: (profile: UserRoleProfile) => void;
  hasPermission: (module: string, action: PermissionAction, targetCompanyId?: CompanyId) => boolean;
  canAccessCompany: (companyId: CompanyId) => boolean;
  isSuperAdmin: boolean;
  isGroupLevel: boolean;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const RBACProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoleProfile, setRoleProfile] = useState<UserRoleProfile>(DEFAULT_SUPER_ADMIN_PROFILE);
  const { activeCompanyId } = useCompany();

  const isSuperAdmin = currentRoleProfile.role === 'SUPER_ADMIN';

  const isGroupLevel =
    isSuperAdmin ||
    currentRoleProfile.role === 'GROUP_ADMIN' ||
    currentRoleProfile.role === 'GROUP_FINANCE' ||
    currentRoleProfile.role === 'GROUP_HR';

  const canAccessCompany = (targetCompanyId: CompanyId): boolean => {
    if (isSuperAdmin || currentRoleProfile.allowedCompanyIds.includes('all')) return true;
    return currentRoleProfile.allowedCompanyIds.includes(targetCompanyId);
  };

  const hasPermission = (module: string, action: PermissionAction, targetCompanyId?: CompanyId): boolean => {
    if (isSuperAdmin) return true;

    const companyToTest = targetCompanyId || activeCompanyId;
    if (!canAccessCompany(companyToTest)) return false;

    // Search permissions array
    const matched = currentRoleProfile.permissions.find(
      (p) => (p.module === '*' || p.module === module) && p.actions.includes(action)
    );

    if (!matched) return false;

    if (matched.scope === 'GROUP' || isGroupLevel) return true;
    if (matched.scope === 'COMPANY') {
      return matched.companyId === companyToTest || currentRoleProfile.primaryCompanyId === companyToTest;
    }

    return true;
  };

  return (
    <RBACContext.Provider
      value={{
        currentRoleProfile,
        setRoleProfile,
        hasPermission,
        canAccessCompany,
        isSuperAdmin,
        isGroupLevel,
      }}
    >
      {children}
    </RBACContext.Provider>
  );
};

export const useRBAC = (): RBACContextType => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};
