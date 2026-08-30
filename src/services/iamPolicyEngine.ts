/**
 * IAM Policy & Access Control Engine
 * Enterprise Multi-Company & Multi-Department Security Enforcement
 * Direct PostgreSQL connection via Supabase
 */

import { supabase } from './supabaseClient';
import {
  IamUser,
  IamCompany,
  IamBranch,
  IamDepartment,
  IamMembership,
  IamRole,
  IamPermission,
  IamDelegation,
  IamSoDRule,
  IamSoDViolation,
  IamAccessRequest,
  IamAccessReview,
  IamUserSession,
  IamAuditLog,
} from '../types/iam';

class IamPolicyEngine {
  // ============================================================================
  // 1. COMPANIES & STRUCTURE
  // ============================================================================

  public async getCompanies(): Promise<IamCompany[]> {
    try {
      const { data, error } = await supabase
        .from('iam_companies')
        .select('*')
        .order('is_group_parent', { ascending: false });

      if (error) throw error;
      return (data || []).map(c => ({
        id: c.id,
        tenantId: c.tenant_id,
        code: c.code,
        legalName: c.legal_name,
        commercialName: c.commercial_name || c.legal_name,
        crNumber: c.cr_number || '',
        vatNumber: c.vat_number || '',
        logoUrl: c.logo_url,
        primaryColor: c.primary_color,
        isGroupParent: Boolean(c.is_group_parent),
        status: c.status as any,
      }));
    } catch (err) {
      console.warn('Fallback getCompanies:', err);
      return [];
    }
  }

  public async getBranches(companyId?: string): Promise<IamBranch[]> {
    try {
      let query = supabase.from('iam_branches').select('*').order('name', { ascending: true });
      if (companyId) query = query.eq('company_id', companyId);

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(b => ({
        id: b.id,
        companyId: b.company_id,
        code: b.code,
        name: b.name,
        city: b.city,
        address: b.address,
        phone: b.phone,
        isMainBranch: Boolean(b.is_main_branch),
        status: b.status as any,
      }));
    } catch (err) {
      console.warn('Fallback getBranches:', err);
      return [];
    }
  }

  public async getDepartments(companyId?: string): Promise<IamDepartment[]> {
    try {
      let query = supabase.from('iam_departments').select('*').order('name', { ascending: true });
      if (companyId) query = query.eq('company_id', companyId);

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(d => ({
        id: d.id,
        companyId: d.company_id,
        branchId: d.branch_id,
        parentId: d.parent_id,
        code: d.code,
        name: d.name,
        departmentType: d.department_type,
        managerId: d.manager_id,
        status: d.status as any,
      }));
    } catch (err) {
      console.warn('Fallback getDepartments:', err);
      return [];
    }
  }

  // ============================================================================
  // 2. USERS & MEMBERSHIPS
  // ============================================================================

  public async getUsers(): Promise<IamUser[]> {
    try {
      const { data, error } = await supabase
        .from('iam_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(u => ({
        id: u.id,
        identityId: u.identity_id,
        employeeNumber: u.employee_number || '',
        fullName: u.full_name,
        email: u.email,
        phone: u.phone || '',
        jobTitle: u.job_title || '',
        accountType: u.account_type as any,
        status: u.status as any,
        mfaEnabled: Boolean(u.mfa_enabled),
        mfaMethod: u.mfa_method as any,
        biometricEnabled: Boolean(u.biometric_enabled),
        biometricType: u.biometric_type as any,
        sessionTimeoutMinutes: u.session_timeout_minutes || 30,
        lastLoginAt: u.last_login_at,
        lastLoginIp: u.last_login_ip,
        created_at: u.created_at,
      }));
    } catch (err) {
      console.warn('Fallback getUsers:', err);
      return [];
    }
  }

  public async getUserMemberships(userId: string): Promise<IamMembership[]> {
    try {
      const { data, error } = await supabase
        .from('iam_memberships')
        .select(`
          *,
          company:iam_companies(id, code, legal_name, commercial_name, primary_color)
        `)
        .eq('user_id', userId)
        .eq('status', 'نشط');

      if (error) throw error;
      return (data || []).map(m => ({
        id: m.id,
        userId: m.user_id,
        companyId: m.company_id,
        companyCode: m.company?.code,
        companyName: m.company?.commercial_name || m.company?.legal_name,
        branchScope: Array.isArray(m.branch_scope) ? m.branch_scope : ['*'],
        departmentScope: Array.isArray(m.department_scope) ? m.department_scope : ['*'],
        isPrimary: Boolean(m.is_primary),
        status: m.status as any,
        validFrom: m.valid_from,
        validTo: m.valid_to,
      }));
    } catch (err) {
      console.warn('Fallback getUserMemberships:', err);
      return [];
    }
  }

  public async saveUser(user: Partial<IamUser>): Promise<IamUser> {
    const payload = {
      full_name: user.fullName,
      email: user.email,
      phone: user.phone,
      employee_number: user.employeeNumber || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      job_title: user.jobTitle,
      account_type: user.accountType || 'Employee',
      status: user.status || 'نشط',
      mfa_enabled: user.mfaEnabled ?? true,
      mfa_method: user.mfaMethod || 'Google Authenticator',
      biometric_enabled: user.biometricEnabled ?? false,
      biometric_type: user.biometricType || 'Touch ID',
      session_timeout_minutes: user.sessionTimeoutMinutes || 30,
      updated_at: new Date().toISOString(),
    };

    if (user.id && !user.id.startsWith('temp-')) {
      const { data, error } = await supabase
        .from('iam_users')
        .update(payload)
        .eq('id', user.id)
        .select()
        .single();
      if (error) throw error;
      return { ...user, ...data } as IamUser;
    } else {
      const { data, error } = await supabase
        .from('iam_users')
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      return {
        id: data.id,
        employeeNumber: data.employee_number,
        fullName: data.full_name,
        email: data.email,
        phone: data.phone,
        jobTitle: data.job_title,
        accountType: data.account_type,
        status: data.status,
        mfaEnabled: data.mfa_enabled,
        mfaMethod: data.mfa_method,
        biometricEnabled: data.biometric_enabled,
        biometricType: data.biometric_type,
        sessionTimeoutMinutes: data.session_timeout_minutes,
      };
    }
  }

  public async deleteUser(userId: string): Promise<boolean> {
    const { error } = await supabase.from('iam_users').delete().eq('id', userId);
    if (error) throw error;
    return true;
  }

  // ============================================================================
  // 3. ROLES & PERMISSIONS
  // ============================================================================

  public async getRoles(): Promise<IamRole[]> {
    try {
      const { data, error } = await supabase.from('iam_roles').select('*').order('name', { ascending: true });
      if (error) throw error;
      return (data || []).map(r => ({
        id: r.id,
        companyId: r.company_id,
        code: r.code,
        name: r.name,
        description: r.description || '',
        roleType: r.role_type as any,
        isSystemRole: Boolean(r.is_system_role),
        status: r.status as any,
      }));
    } catch (err) {
      console.warn('Fallback getRoles:', err);
      return [];
    }
  }

  public async getPermissions(): Promise<IamPermission[]> {
    try {
      const { data, error } = await supabase.from('iam_permissions').select('*').order('module', { ascending: true });
      if (error) throw error;
      return (data || []).map(p => ({
        id: p.id,
        code: p.code,
        resource: p.resource,
        action: p.action,
        name: p.name,
        module: p.module,
        sensitivityLevel: p.sensitivity_level as any,
        description: p.description,
      }));
    } catch (err) {
      console.warn('Fallback getPermissions:', err);
      return [];
    }
  }

  public async getRolePermissions(roleId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('iam_role_permissions')
        .select('permission:iam_permissions(code)')
        .eq('role_id', roleId);

      if (error) throw error;
      return (data || []).map((row: any) => row.permission?.code).filter(Boolean);
    } catch (err) {
      console.warn('Fallback getRolePermissions:', err);
      return [];
    }
  }

  // ============================================================================
  // 4. SEPARATION OF DUTIES (SoD) & VIOLATIONS
  // ============================================================================

  public async getSoDRules(): Promise<IamSoDRule[]> {
    try {
      const { data, error } = await supabase.from('iam_sod_rules').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      return (data || []).map(r => ({
        id: r.id,
        code: r.code,
        name: r.name,
        description: r.description,
        permissionA: r.permission_a,
        permissionB: r.permission_b,
        riskLevel: r.risk_level as any,
        mitigationControl: r.mitigation_control,
        status: r.status as any,
      }));
    } catch (err) {
      console.warn('Fallback getSoDRules:', err);
      return [];
    }
  }

  public async checkSoDConflicts(permissions: string[]): Promise<{ hasConflict: boolean; conflicts: IamSoDRule[] }> {
    const rules = await this.getSoDRules();
    const permSet = new Set(permissions);
    const conflicts: IamSoDRule[] = [];

    for (const rule of rules) {
      if (permSet.has(rule.permissionA) && permSet.has(rule.permissionB)) {
        conflicts.push(rule);
      }
    }

    return {
      hasConflict: conflicts.length > 0,
      conflicts,
    };
  }

  // ============================================================================
  // 5. DELEGATIONS & TEMPORARY ACCESS
  // ============================================================================

  public async getDelegations(companyId?: string): Promise<IamDelegation[]> {
    try {
      let query = supabase.from('iam_delegations').select('*').order('created_at', { ascending: false });
      if (companyId) query = query.eq('company_id', companyId);

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(d => ({
        id: d.id,
        fromUserId: d.from_user_id,
        toUserId: d.to_user_id,
        companyId: d.company_id,
        roleId: d.role_id,
        permissionsScope: Array.isArray(d.permissions_scope) ? d.permissions_scope : ['*'],
        reason: d.reason,
        validFrom: d.valid_from,
        validTo: d.valid_to,
        status: d.status as any,
      }));
    } catch (err) {
      console.warn('Fallback getDelegations:', err);
      return [];
    }
  }

  public async createDelegation(delegation: Omit<IamDelegation, 'id'>): Promise<IamDelegation> {
    const { data, error } = await supabase
      .from('iam_delegations')
      .insert([
        {
          from_user_id: delegation.fromUserId,
          to_user_id: delegation.toUserId,
          company_id: delegation.companyId,
          role_id: delegation.roleId,
          permissions_scope: delegation.permissionsScope,
          reason: delegation.reason,
          valid_from: delegation.validFrom,
          valid_to: delegation.validTo,
          status: delegation.status || 'نشط',
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return { ...delegation, id: data.id };
  }

  // ============================================================================
  // 6. ACCESS REQUESTS & REVIEWS
  // ============================================================================

  public async getAccessRequests(): Promise<IamAccessRequest[]> {
    try {
      const { data, error } = await supabase.from('iam_access_requests').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(req => ({
        id: req.id,
        requestNumber: req.request_number,
        userId: req.user_id,
        companyId: req.company_id,
        requestedRoles: Array.isArray(req.requested_roles) ? req.requested_roles : [],
        requestedPermissions: Array.isArray(req.requested_permissions) ? req.requested_permissions : [],
        justification: req.justification,
        departmentManagerStatus: req.department_manager_status,
        securityAdminStatus: req.security_admin_status,
        finalStatus: req.final_status,
        createdAt: req.created_at,
      }));
    } catch (err) {
      console.warn('Fallback getAccessRequests:', err);
      return [];
    }
  }

  public async getAccessReviews(): Promise<IamAccessReview[]> {
    try {
      const { data, error } = await supabase.from('iam_access_reviews').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(r => ({
        id: r.id,
        campaignName: r.campaign_name,
        quarter: r.quarter,
        reviewerId: r.reviewer_id,
        companyId: r.company_id,
        totalUsersReviewed: r.total_users_reviewed,
        revokedPermissionsCount: r.revoked_permissions_count,
        status: r.status,
        completedAt: r.completed_at,
        createdAt: r.created_at,
      }));
    } catch (err) {
      console.warn('Fallback getAccessReviews:', err);
      return [];
    }
  }

  // ============================================================================
  // 7. ACTIVE SESSIONS & AUDIT LOGS
  // ============================================================================

  public async getActiveSessions(): Promise<IamUserSession[]> {
    try {
      const { data, error } = await supabase.from('iam_user_sessions').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(s => ({
        id: s.id,
        userId: s.user_id,
        activeCompanyId: s.active_company_id,
        sessionToken: s.session_token,
        ipAddress: s.ip_address,
        userAgent: s.user_agent,
        deviceType: s.device_type,
        expiresAt: s.expires_at,
        status: s.status,
        createdAt: s.created_at,
      }));
    } catch (err) {
      console.warn('Fallback getActiveSessions:', err);
      return [];
    }
  }

  public async getAuditLogs(limit: number = 100): Promise<IamAuditLog[]> {
    try {
      const { data, error } = await supabase
        .from('iam_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []).map(l => ({
        id: l.id,
        actorId: l.actor_id,
        actorEmail: l.actor_email,
        companyId: l.company_id,
        companyCode: l.company_code,
        action: l.action,
        resource: l.resource,
        recordId: l.record_id,
        result: l.result,
        severity: l.severity,
        ipAddress: l.ip_address,
        userAgent: l.user_agent,
        oldValues: l.old_values,
        newValues: l.new_values,
        createdAt: l.created_at,
      }));
    } catch (err) {
      console.warn('Fallback getAuditLogs:', err);
      return [];
    }
  }

  public async logAudit(log: Omit<IamAuditLog, 'id' | 'createdAt'>): Promise<void> {
    try {
      await supabase.from('iam_audit_logs').insert([
        {
          actor_id: log.actorId,
          actor_email: log.actorEmail,
          company_id: log.companyId,
          company_code: log.companyCode,
          action: log.action,
          resource: log.resource,
          record_id: log.recordId,
          result: log.result,
          severity: log.severity || 'معلومات',
          ip_address: log.ipAddress || '127.0.0.1',
          user_agent: log.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Server'),
          old_values: log.oldValues,
          new_values: log.newValues,
        }
      ]);
    } catch (err) {
      console.warn('Could not record audit log:', err);
    }
  }
}

export const iamPolicyEngine = new IamPolicyEngine();
