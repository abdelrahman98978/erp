/**
 * IAM & Multi-Company / Multi-Department Access Control Types
 * Based on Khalid_ERP_Access_Control_Plan_AR.docx blueprint.
 */

export type AccountType = 
  | 'Group Super Admin'
  | 'Board / Group Executive'
  | 'Company Admin'
  | 'Branch Manager'
  | 'Department Manager'
  | 'Employee'
  | 'Auditor'
  | 'Shared Services';

export type UserStatus = 'نشط' | 'معلق' | 'موقوف' | 'منتهي الصلاحية';

export interface IamUser {
  id: string;
  identityId?: string;
  employeeNumber: string;
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  accountType: AccountType;
  status: UserStatus;
  mfaEnabled: boolean;
  mfaMethod: 'Google Authenticator' | 'SMS' | 'WhatsApp' | 'Email' | 'بصمة بيومترية (FIDO2)';
  biometricEnabled: boolean;
  biometricType?: 'Touch ID' | 'Face ID' | 'بصمة مزدوجة';
  sessionTimeoutMinutes: number;
  lastLoginAt?: string;
  lastLoginIp?: string;
  created_at?: string;
  memberships?: IamMembership[];
}

export interface IamCompany {
  id: string;
  tenantId: string;
  code: string;
  legalName: string;
  commercialName: string;
  crNumber: string;
  vatNumber: string;
  logoUrl?: string;
  primaryColor?: string;
  isGroupParent: boolean;
  status: 'نشط' | 'موقوف';
}

export interface IamBranch {
  id: string;
  companyId: string;
  code: string;
  name: string;
  city: string;
  address?: string;
  phone?: string;
  isMainBranch: boolean;
  status: 'نشط' | 'موقوف';
}

export interface IamDepartment {
  id: string;
  companyId: string;
  branchId?: string;
  parentId?: string;
  code: string;
  name: string;
  departmentType: 'HR' | 'Finance' | 'Operations' | 'Procurement' | 'IT' | 'Management' | 'Legal' | string;
  managerId?: string;
  status: 'نشط' | 'موقوف';
}

export interface IamMembership {
  id: string;
  userId: string;
  companyId: string;
  companyCode?: string;
  companyName?: string;
  branchScope: string[]; // ["*"] or list of branch IDs
  departmentScope: string[]; // ["*"] or list of department IDs
  isPrimary: boolean;
  status: 'نشط' | 'غير نشط' | 'مجمد';
  validFrom: string;
  validTo?: string;
  roles?: IamRole[];
}

export interface IamRole {
  id: string;
  companyId?: string;
  code: string;
  name: string;
  description: string;
  roleType: 'Global' | 'Company' | 'Department';
  isSystemRole: boolean;
  status: 'نشط' | 'موقوف';
  permissions?: IamPermission[];
}

export interface IamPermission {
  id: string;
  code: string;
  resource: string;
  action: string;
  name: string;
  module: string;
  sensitivityLevel: 'عادي' | 'متوسط' | 'عالي الحساسية' | 'سري للغاية' | 'حرج';
  description?: string;
}

export interface IamRolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  constraintsJson?: Record<string, any>;
}

export interface IamDelegation {
  id: string;
  fromUserId: string;
  fromUserName?: string;
  toUserId: string;
  toUserName?: string;
  companyId: string;
  companyName?: string;
  roleId?: string;
  roleName?: string;
  permissionsScope: string[];
  reason: string;
  validFrom: string;
  validTo: string;
  status: 'نشط' | 'منتهي' | 'ملغي';
  approvedBy?: string;
}

export interface IamSoDRule {
  id: string;
  code: string;
  name: string;
  description: string;
  permissionA: string;
  permissionB: string;
  riskLevel: 'منخفض' | 'متوسط' | 'عالي' | 'حرج';
  mitigationControl?: string;
  status: 'نشط' | 'معطل';
}

export interface IamSoDViolation {
  id: string;
  userId: string;
  userName?: string;
  sodRuleId: string;
  ruleName?: string;
  status: 'مرصود' | 'استثناء معتمد' | 'تم تصحيحه';
  exceptionApprovedBy?: string;
  exceptionExpiry?: string;
  notes?: string;
  detectedAt: string;
}

export interface IamAccessRequest {
  id: string;
  requestNumber: string;
  userId: string;
  userName?: string;
  companyId: string;
  companyName?: string;
  requestedRoles: string[];
  requestedPermissions: string[];
  justification: string;
  departmentManagerStatus: 'قيد المراجعة' | 'معتمد' | 'مرفوض';
  securityAdminStatus: 'قيد المراجعة' | 'معتمد' | 'مرفوض';
  finalStatus: 'قيد المراجعة' | 'معتمد' | 'مرفوض';
  createdAt: string;
}

export interface IamAccessReview {
  id: string;
  campaignName: string;
  quarter: string;
  reviewerId: string;
  reviewerName?: string;
  companyId: string;
  companyName?: string;
  totalUsersReviewed: number;
  revokedPermissionsCount: number;
  status: 'جارية' | 'مكتملة' | 'متأخرة';
  completedAt?: string;
  createdAt: string;
}

export interface IamUserSession {
  id: string;
  userId: string;
  userName?: string;
  activeCompanyId?: string;
  companyCode?: string;
  sessionToken: string;
  ipAddress: string;
  userAgent: string;
  deviceType: string;
  expiresAt: string;
  status: 'نشطة' | 'منتهية' | 'ملغاة إجبارياً';
  createdAt: string;
}

export interface IamAuditLog {
  id: string;
  actorId?: string;
  actorEmail: string;
  companyId?: string;
  companyCode?: string;
  action: string;
  resource: string;
  recordId?: string;
  result: 'SUCCESS' | 'FORBIDDEN' | 'FAILED';
  severity: 'معلومات' | 'تحذير' | 'خطر أمني';
  ipAddress?: string;
  userAgent?: string;
  oldValues?: any;
  newValues?: any;
  createdAt: string;
}

export interface IamSessionContext {
  currentUser: IamUser | null;
  activeTenantId: string;
  activeCompanyId: string;
  activeCompany: IamCompany | null;
  userMemberships: IamMembership[];
  activeMembership: IamMembership | null;
  activeRoles: IamRole[];
  permissionCodes: Set<string>;
  delegations: IamDelegation[];
  isSuperAdmin: boolean;
  isBoardExecutive: boolean;
  canSwitchCompany: boolean;
  switchCompany: (companyId: string) => Promise<boolean>;
  hasPermission: (permissionCode: string) => boolean;
  canAccessBranch: (branchId: string) => boolean;
  canAccessDepartment: (deptId: string) => boolean;
  logAuditAction: (action: string, resource: string, result: 'SUCCESS' | 'FORBIDDEN' | 'FAILED', recordId?: string, details?: any) => Promise<void>;
}
