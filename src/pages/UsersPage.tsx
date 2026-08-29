import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';
import { useAppStore } from '../stores/appStore';
import { 
  UserCheck, ShieldCheck, Plus, FileSpreadsheet, FileText, Search, 
  Fingerprint, Lock, Shield, X, Check, QrCode, Smartphone, MessageSquare, 
  Mail, ArrowLeft, Trash2, UserX, UserCog, Edit3, Key, Star
} from 'lucide-react';

export interface UserAdmin {
  id: string;
  name: string;
  username: string;
  user_type: string;
  role: string;
  branch: string;
  phone: string;
  email: string;
  status: 'نشط' | 'محظور';
  two_factor_enabled: boolean;
  two_factor_method?: 'Google Authenticator' | 'SMS' | 'WhatsApp' | 'Email' | 'بصمة بيومترية (FIDO2)';
  biometric_enabled?: boolean;
  biometric_type?: 'Touch ID (بصمة إصبع)' | 'Face ID (بصمة وجه)' | 'بصمة مزدوجة';
}

const MOCK_USERS: UserAdmin[] = [
  {
    id: '1',
    name: 'مشرف admin (خالد السليم)',
    username: 'admin',
    user_type: 'الإدارة العليا والتنفيذية',
    role: 'Administrator',
    branch: 'الفرع الرئيسي',
    phone: '0512344321',
    email: 'admin@alsulaim.sa',
    status: 'نشط',
    two_factor_enabled: true,
    two_factor_method: 'Google Authenticator',
    biometric_enabled: true,
    biometric_type: 'بصمة مزدوجة'
  },
  {
    id: '2',
    name: 'محمد مصطفى',
    username: 'mohammed',
    user_type: 'الإدارة المالية',
    role: 'Financial Manager',
    branch: 'الفرع الرئيسي',
    phone: '0509082341',
    email: 'mohammed@alsulaim.sa',
    status: 'نشط',
    two_factor_enabled: true,
    two_factor_method: 'بصمة بيومترية (FIDO2)',
    biometric_enabled: true,
    biometric_type: 'Touch ID (بصمة إصبع)'
  },
  {
    id: '3',
    name: 'سارة خالد السليم',
    username: 'sara_hr',
    user_type: 'الموارد البشرية',
    role: 'HR Director',
    branch: 'فرع الرياض - اليرموك',
    phone: '0594249640',
    email: 'sara@alsalim.sa',
    status: 'نشط',
    two_factor_enabled: true,
    two_factor_method: 'SMS',
    biometric_enabled: true,
    biometric_type: 'Face ID (بصمة وجه)'
  },
  {
    id: '4',
    name: 'عبدالله الشمري',
    username: 'abdullah_ops',
    user_type: 'إدارة العمليات والتشغيل',
    role: 'Operations Lead',
    branch: 'فرع الخبر - الكورنيش',
    phone: '0567112233',
    email: 'abdullah@alsulaim.sa',
    status: 'نشط',
    two_factor_enabled: false,
    biometric_enabled: false
  },
  {
    id: '5',
    name: 'ريم القحطاني',
    username: 'reem_crm',
    user_type: 'خدمة العملاء والـ CRM',
    role: 'Customer Care Lead',
    branch: 'فرع جدة - التحلية',
    phone: '0543322114',
    email: 'reem@alsulaim.sa',
    status: 'نشط',
    two_factor_enabled: true,
    two_factor_method: 'WhatsApp',
    biometric_enabled: true,
    biometric_type: 'Face ID (بصمة وجه)'
  }
];

export const UsersPage: React.FC = () => {
  const { addNotification } = useAppStore();
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserAdmin | null>(null);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [userToEditRole, setUserToEditRole] = useState<UserAdmin | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'Google Authenticator' | 'SMS' | 'WhatsApp' | 'Email' | 'بصمة بيومترية (FIDO2)'>('Google Authenticator');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState('');

  // New User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    role: 'Operations Lead',
    user_type: 'إدارة العمليات والتشغيل',
    branch: 'الفرع الرئيسي',
    phone: '',
    email: '',
    two_factor_enabled: true,
    biometric_enabled: true,
    biometric_type: 'Touch ID (بصمة إصبع)' as const
  });

  // Edit Role Form State
  const [editRoleForm, setEditRoleForm] = useState({
    role: 'Operations Lead',
    user_type: 'إدارة العمليات والتشغيل',
    branch: 'الفرع الرئيسي',
    status: 'نشط' as 'نشط' | 'محظور'
  });

  useEffect(() => {
    realErpDataStore.getRecords<UserAdmin>('system_users', MOCK_USERS).then(data => setUsers(data));
  }, []);

  const handleOpen2FAModal = (user: UserAdmin) => {
    setSelectedUser(user);
    setSelectedMethod(user.two_factor_method || 'Google Authenticator');
    setOtpCode('');
    setStep(1);
    setShow2FAModal(true);
  };

  const handleOpenEditRoleModal = (user: UserAdmin) => {
    setUserToEditRole(user);
    setEditRoleForm({
      role: user.role,
      user_type: user.user_type,
      branch: user.branch,
      status: user.status
    });
    setShowEditRoleModal(true);
  };

  const handleSaveRoleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEditRole) return;

    const patch = {
      role: editRoleForm.role,
      user_type: editRoleForm.user_type,
      branch: editRoleForm.branch,
      status: editRoleForm.status
    };

    const updated = await realErpDataStore.updateRecord<UserAdmin>('system_users', userToEditRole.id, patch, MOCK_USERS);
    setUsers(updated);
    setShowEditRoleModal(false);

    // Audit log
    await realErpDataStore.addRecord('activity_log', {
      id: `LOG-${Date.now()}`,
      user_name: 'مدير النظام العام',
      role: 'Super Admin',
      action_type: 'تعديل',
      module: 'إدارة المستخدمين',
      details: `تعديل وترقية صلاحية المستخدم (${userToEditRole.name}) إلى دور (${editRoleForm.role}) بقسم (${editRoleForm.user_type})`,
      severity: 'تنبيه',
      ip_address: '192.168.1.1',
      device: 'Super Admin Terminal / Edge',
      created_at: new Date().toISOString().slice(0, 16).replace('T', ' ')
    });

    addNotification({
      title: 'تحديث صلاحيات ودور المستخدم',
      message: `تم تعديل دور وصلاحيات المستخدم (${userToEditRole.name}) إلى (${editRoleForm.role}) بنجاح.`,
      type: 'success',
    });
  };

  const handleToggle2FA = async () => {
    if (!selectedUser) return;
    const isEnabling = !selectedUser.two_factor_enabled;

    const patch = {
      two_factor_enabled: isEnabling,
      two_factor_method: isEnabling ? selectedMethod : undefined,
      biometric_enabled: isEnabling ? true : selectedUser.biometric_enabled
    };

    const updated = await realErpDataStore.updateRecord<UserAdmin>('system_users', selectedUser.id, patch, MOCK_USERS);
    setUsers(updated);
    setShow2FAModal(false);

    addNotification({
      title: isEnabling ? 'تفعيل 2FA بنجاح' : 'تعطيل 2FA',
      message: `تم ${isEnabling ? 'تفعيل' : 'إلغاء'} المصادقة الثنائية للمستخدم (${selectedUser.name}) بنجاح.`,
      type: isEnabling ? 'success' : 'info',
    });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.username) return;

    const createdRecord: UserAdmin = {
      id: String(Date.now()),
      name: newUser.name,
      username: newUser.username,
      role: newUser.role,
      user_type: newUser.user_type,
      branch: newUser.branch,
      phone: newUser.phone || '0500000000',
      email: newUser.email || `${newUser.username}@alsulaim.sa`,
      status: 'نشط',
      two_factor_enabled: newUser.two_factor_enabled,
      two_factor_method: newUser.two_factor_enabled ? 'Google Authenticator' : undefined,
      biometric_enabled: newUser.biometric_enabled,
      biometric_type: newUser.biometric_enabled ? newUser.biometric_type : undefined
    };

    const updated = await realErpDataStore.addRecord<UserAdmin>('system_users', createdRecord, MOCK_USERS);
    setUsers(updated);
    setShowAddUserModal(false);

    addNotification({
      title: 'إنشاء حساب مستخدم جديد',
      message: `تم إنشاء حساب المستخدم (${newUser.name}) بنجاح وتعيين الدور (${newUser.role}).`,
      type: 'success',
    });

    setNewUser({
      name: '',
      username: '',
      role: 'Operations Lead',
      user_type: 'إدارة العمليات والتشغيل',
      branch: 'الفرع الرئيسي',
      phone: '',
      email: '',
      two_factor_enabled: true,
      biometric_enabled: true,
      biometric_type: 'Touch ID (بصمة إصبع)'
    });
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف حساب المستخدم (${name})؟`)) return;
    const updated = await realErpDataStore.deleteRecord<UserAdmin>('system_users', id, MOCK_USERS);
    setUsers(updated);
    addNotification({
      title: 'حذف مستخدم',
      message: `تم حذف حساب المستخدم (${name}) من النظام.`,
      type: 'error',
    });
  };

  const handleToggleUserStatus = async (user: UserAdmin) => {
    const nextStatus = user.status === 'نشط' ? 'محظور' : 'نشط';
    const updated = await realErpDataStore.updateRecord<UserAdmin>('system_users', user.id, { status: nextStatus }, MOCK_USERS);
    setUsers(updated);
    addNotification({
      title: 'تغيير حالة المستخدم',
      message: `تم تعديل حالة (${user.name}) إلى (${nextStatus}).`,
      type: nextStatus === 'نشط' ? 'success' : 'warning',
    });
  };

  const filteredUsers = users.filter(u =>
    u.name.includes(searchQuery) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.branch.includes(searchQuery) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div
        className="card-feature-cinematic"
        style={{
          background: '#000000',
          borderRadius: '16px',
          padding: '28px',
          color: '#FFFFFF',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div className="flex items-center gap-3">
          <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>RBAC & ZERO TRUST AUTH</span>
              <span className="pill-tag-shade" style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', color: '#ffffff' }}>إدارة المستخدمين والصلاحيات</span>
            </div>
            <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
              مستخدمو النظام والتحكم بالصلاحيات
            </h1>
            <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '4px 0 0 0', fontWeight: 420 }}>
              إدارة حسابات الموظفين، تعيين الأدوار والصلاحيات، المصادقة الثنائية (2FA)، وتفويض البصمات البيومترية
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            className="button-white-pill"
            onClick={() => setShowAddUserModal(true)}
            style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
          >
            <Plus className="w-4 h-4 ml-1" />
            <span>+ مستخدم جديد</span>
          </button>
          <button
            className="button-outline-on-dark"
            onClick={() => exportData('system_users', filteredUsers, 'excel')}
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 ml-1 text-emerald-400" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#71717a', fontWeight: 550 }}>إجمالي المستخدمين</span>
          <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>{users.length} مستخدمين</div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '10px' }}>حسابات معتمدة</span>
        </div>

        <div className="card-pistachio-band" style={{ padding: '24px', borderRadius: '16px' }}>
          <span style={{ fontSize: '13px', color: '#000000', fontWeight: 550 }}>المصادقة الثنائية (2FA)</span>
          <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>
            {users.filter(u => u.two_factor_enabled).length} مفعلين
          </div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>حماية فائقة</span>
        </div>

        <div className="card-pricing-featured" style={{ padding: '24px', borderRadius: '16px', background: '#000000', color: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 550 }}>البصمة البيومترية</span>
          <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#ffffff', marginTop: '6px', letterSpacing: '-0.02em' }}>
            {users.filter(u => u.biometric_enabled).length} مسجلين
          </div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>Touch ID & Face ID</span>
        </div>

        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#71717a', fontWeight: 550 }}>الصلاحيات النشطة</span>
          <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>6 أدوار</div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '10px' }}>RBAC Matrix</span>
        </div>
      </div>

      {/* Users Table Card */}
      <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-white flex-wrap gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute right-3 top-3 text-zinc-400" />
            <input
              type="text"
              placeholder="البحث بالاسم، اسم المستخدم، الفرع، أو الدور..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-input"
              style={{ width: '100%', height: '36px', minHeight: '36px', borderRadius: '9999px', paddingRight: '36px', fontSize: '12px' }}
            />
          </div>
          <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
            المستخدمين المتاحين: {filteredUsers.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-zinc-700">
            <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">المستخدم</th>
                <th className="p-3.5">الدور الوظيفي (Role)</th>
                <th className="p-3.5">الفرع المخصص</th>
                <th className="p-3.5">المصادقة الثنائية (2FA)</th>
                <th className="p-3.5">البصمة البيومترية</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5 text-center">إدارة الصلاحيات والأمان</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-black">{u.name}</div>
                    <div className="text-[11px] text-zinc-400 font-mono">@{u.username} • {u.email}</div>
                  </td>
                  <td className="p-3.5">
                    <Badge text={u.role} type="purple" />
                    <div className="text-[11px] text-zinc-400 mt-0.5">{u.user_type}</div>
                  </td>
                  <td className="p-3.5 font-semibold text-zinc-800">{u.branch}</td>
                  <td className="p-3.5">
                    {u.two_factor_enabled ? (
                      <Badge text={`مفعلة (${u.two_factor_method || 'TOTP'})`} type="success" />
                    ) : (
                      <Badge text="غير مفعلة" type="warning" />
                    )}
                  </td>
                  <td className="p-3.5">
                    {u.biometric_enabled ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                        <Fingerprint className="w-3 h-3 text-emerald-600" />
                        <span>{u.biometric_type || 'بصمة معتمدة'}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-zinc-400">غير مسجلة</span>
                    )}
                  </td>
                  <td className="p-3.5"><Badge text={u.status} type={u.status === 'نشط' ? 'success' : 'danger'} /></td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => handleOpenEditRoleModal(u)}
                        className="button-outline-on-light"
                        style={{ padding: '3px 8px', fontSize: '11px', minHeight: '26px' }}
                        title="تعديل وترقية الدور والصلاحيات"
                      >
                        <UserCog className="w-3 h-3 ml-1 text-purple-600" />
                        <span>الصلاحيات</span>
                      </button>
                      <button
                        onClick={() => handleOpen2FAModal(u)}
                        className="button-outline-on-light"
                        style={{ padding: '3px 8px', fontSize: '11px', minHeight: '26px' }}
                        title="إعدادات المصادقة الثنائية والبصمة"
                      >
                        <Fingerprint className="w-3 h-3 ml-1 text-emerald-600" />
                        <span>{u.two_factor_enabled ? '2FA' : 'تفعيل 2FA'}</span>
                      </button>
                      <button
                        onClick={() => handleToggleUserStatus(u)}
                        className={`p-1 rounded-lg border transition-colors ${u.status === 'نشط' ? 'border-amber-200 text-amber-700 hover:bg-amber-50' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}`}
                        title={u.status === 'نشط' ? 'حظر المستخدم' : 'تفعيل المستخدم'}
                      >
                        {u.status === 'نشط' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="p-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                        title="حذف المستخدم نهائياً"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden font-sans">
            <div className="p-5 bg-black text-white flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>إنشاء مستخدم جديد وتعيين الصلاحيات</span>
              </h3>
              <button onClick={() => setShowAddUserModal(false)} className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4 bg-white text-black">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">اسم الموظف الثلاثي *</label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="مثال: خالد محمد العتيبي"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">اسم المستخدم (Username) *</label>
                  <input
                    type="text"
                    required
                    value={newUser.username}
                    onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                    placeholder="مثال: khaled_ops"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">الدور الوظيفي (Role)</label>
                  <select
                    value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  >
                    <option value="Administrator">Administrator (مدير نظام عام)</option>
                    <option value="HR Director">HR Director (مدير موارد بشرية)</option>
                    <option value="Financial Manager">Financial Manager (مدير مالي واعتمادات)</option>
                    <option value="Branch Manager">Branch Manager (مدير فرع)</option>
                    <option value="Operations Lead">Operations Lead (مشرف تشغيل وعقود)</option>
                    <option value="Shelter Supervisor">Shelter Supervisor (مشرف إيواء)</option>
                    <option value="Sales Agent">Sales Agent (مسؤول مبيعات وعملاء)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">الفرع المخصص</label>
                  <select
                    value={newUser.branch}
                    onChange={e => setNewUser({ ...newUser, branch: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  >
                    <option value="الفرع الرئيسي">الفرع الرئيسي - الرياض</option>
                    <option value="فرع الرياض - اليرموك">فرع الرياض - اليرموك</option>
                    <option value="فرع جدة - التحلية">فرع جدة - التحلية</option>
                    <option value="فرع الخبر - الكورنيش">فرع الخبر - الكورنيش</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">رقم الجوال للتحقق OTP</label>
                  <input
                    type="text"
                    value={newUser.phone}
                    onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="05XXXXXXXX"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">البريد الإلكتروني الرسمي</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="user@alsulaim.sa"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newUser.two_factor_enabled}
                    onChange={e => setNewUser({ ...newUser, two_factor_enabled: e.target.checked })}
                    className="rounded text-black focus:ring-0"
                  />
                  <span className="text-xs font-semibold text-black">تفعيل التحقق الثنائي (2FA) عند أول تسجيل دخول</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newUser.biometric_enabled}
                    onChange={e => setNewUser({ ...newUser, biometric_enabled: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-0"
                  />
                  <span className="text-xs font-semibold text-emerald-900">تمكين الدخول بالبصمة البيومترية (Touch ID / Face ID)</span>
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="button-outline-on-light"
                  style={{ minHeight: '36px', padding: '6px 16px', fontSize: '13px' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="button-primary-pill"
                  style={{ minHeight: '36px', padding: '6px 20px', fontSize: '13px' }}
                >
                  حفظ وإنشاء المستخدم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role & Permissions Modal */}
      {showEditRoleModal && userToEditRole && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden font-sans">
            <div className="p-5 bg-black text-white flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <UserCog className="w-4 h-4 text-purple-400" />
                <span>تعديل وترقية دور المستخدم الصلاحيات</span>
              </h3>
              <button onClick={() => setShowEditRoleModal(false)} className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoleChange} className="p-6 space-y-4 bg-white text-black">
              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
                <span className="text-[11px] text-zinc-500 font-semibold block">المستخدم المحدد:</span>
                <div className="font-bold text-sm text-black mt-0.5">{userToEditRole.name}</div>
                <div className="text-[11px] text-zinc-400 font-mono">@{userToEditRole.username} • {userToEditRole.email}</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">الدور الوظيفي في الـ ERP (RBAC Role) *</label>
                <select
                  value={editRoleForm.role}
                  onChange={e => setEditRoleForm({ ...editRoleForm, role: e.target.value })}
                  className="w-full bg-purple-50/50 border border-purple-200 rounded-2xl py-2 px-3 text-xs text-black font-bold focus:outline-none"
                >
                  <option value="Administrator">Administrator (مدير نظام عام - كافة الصلاحيات)</option>
                  <option value="Branch Manager">Branch Manager (مدير فرع)</option>
                  <option value="Financial Manager">Financial Manager (مدير مالي واعتمادات)</option>
                  <option value="HR Director">HR Director (مدير الموارد البشرية)</option>
                  <option value="Operations Lead">Operations Lead (مشرف تشغيل وعقود)</option>
                  <option value="Shelter Supervisor">Shelter Supervisor (مشرف إيواء)</option>
                  <option value="Sales Agent">Sales Agent (مسؤول مبيعات وعملاء)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">القسم الإداري *</label>
                <select
                  value={editRoleForm.user_type}
                  onChange={e => setEditRoleForm({ ...editRoleForm, user_type: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                >
                  <option value="الإدارة العليا والتنفيذية">الإدارة العليا والتنفيذية</option>
                  <option value="إدارة العمليات والتشغيل">إدارة العمليات والتشغيل</option>
                  <option value="الإدارة المالية">الإدارة المالية</option>
                  <option value="الموارد البشرية">الموارد البشرية</option>
                  <option value="خدمة العملاء والـ CRM">خدمة العملاء والـ CRM</option>
                  <option value="إدارة الإيواء والتسكين">إدارة الإيواء والتسكين</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">الفرع المخصص</label>
                <select
                  value={editRoleForm.branch}
                  onChange={e => setEditRoleForm({ ...editRoleForm, branch: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                >
                  <option value="الفرع الرئيسي">الفرع الرئيسي - الرياض</option>
                  <option value="فرع الرياض - اليرموك">فرع الرياض - اليرموك</option>
                  <option value="فرع جدة - التحلية">فرع جدة - التحلية</option>
                  <option value="فرع الخبر - الكورنيش">فرع الخبر - الكورنيش</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowEditRoleModal(false)}
                  className="button-outline-on-light"
                  style={{ minHeight: '36px', padding: '6px 16px', fontSize: '13px' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="button-primary-pill"
                  style={{ minHeight: '36px', padding: '6px 20px', fontSize: '13px' }}
                >
                  حفظ وتطبيق الدور
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2FA & Biometric Management Modal */}
      {show2FAModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden font-sans">
            <div className="p-5 bg-black text-white flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-emerald-400" />
                <span>إعدادات المصادقة الثنائية والبصمة ({selectedUser.name})</span>
              </h3>
              <button onClick={() => setShow2FAModal(false)} className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 bg-white text-black">
              {selectedUser.two_factor_enabled ? (
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-black">المصادقة الثنائية مفعلة بنجاح</h4>
                    <p className="text-xs text-zinc-500 mt-1">
                      الوسيلة الحالية: <span className="font-bold text-black">{selectedUser.two_factor_method || 'Google Authenticator'}</span>
                    </p>
                    {selectedUser.biometric_enabled && (
                      <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                        <Fingerprint className="w-3.5 h-3.5" />
                        <span>مفوض بالبصمة البيومترية ({selectedUser.biometric_type})</span>
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3 justify-center pt-2">
                    <button
                      onClick={handleToggle2FA}
                      className="button-outline-on-light text-rose-600 border-rose-200 hover:bg-rose-50"
                      style={{ minHeight: '36px', padding: '6px 16px', fontSize: '12px' }}
                    >
                      إلغاء تفعيل المصادقة الثنائية
                    </button>
                    <button
                      onClick={() => setShow2FAModal(false)}
                      className="button-primary-pill"
                      style={{ minHeight: '36px', padding: '6px 20px', fontSize: '12px' }}
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {step === 1 ? (
                    <div className="space-y-3">
                      <p className="text-xs text-zinc-600">
                        اختر وسيلة التحقق الإضافية لتأمين حساب الموظف ومنع الوصول غير المصرح:
                      </p>

                      <div className="space-y-2">
                        <label
                          onClick={() => setSelectedMethod('Google Authenticator')}
                          className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                            selectedMethod === 'Google Authenticator' ? 'border-black bg-zinc-50' : 'border-zinc-200 hover:bg-zinc-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="2fa-method"
                            checked={selectedMethod === 'Google Authenticator'}
                            onChange={() => setSelectedMethod('Google Authenticator')}
                            className="mt-1 accent-black"
                          />
                          <div>
                            <span className="font-bold text-xs text-black flex items-center gap-1">
                              <Smartphone className="w-3.5 h-3.5" />
                              <span>تطبيق المصادقة (Google / Microsoft Authenticator)</span>
                            </span>
                            <span className="text-[11px] text-zinc-500 block mt-0.5">رموز زمنية مشفرة (TOTP) تتغير كل 30 ثانية دون الحاجة للاتصال.</span>
                          </div>
                        </label>

                        <label
                          onClick={() => setSelectedMethod('بصمة بيومترية (FIDO2)')}
                          className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                            selectedMethod === 'بصمة بيومترية (FIDO2)' ? 'border-emerald-600 bg-emerald-50/40' : 'border-zinc-200 hover:bg-zinc-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="2fa-method"
                            checked={selectedMethod === 'بصمة بيومترية (FIDO2)'}
                            onChange={() => setSelectedMethod('بصمة بيومترية (FIDO2)')}
                            className="mt-1 accent-emerald-600"
                          />
                          <div>
                            <span className="font-bold text-xs text-emerald-950 flex items-center gap-1">
                              <Fingerprint className="w-3.5 h-3.5 text-emerald-600" />
                              <span>بصمة الإصبع أو الوجه (Touch ID / Face ID / Windows Hello)</span>
                            </span>
                            <span className="text-[11px] text-zinc-500 block mt-0.5">مصادقة مباشرة عبر شريحة الأمان للأجهزة الداعمة لـ WebAuthn.</span>
                          </div>
                        </label>

                        <label
                          onClick={() => setSelectedMethod('SMS')}
                          className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                            selectedMethod === 'SMS' ? 'border-black bg-zinc-50' : 'border-zinc-200 hover:bg-zinc-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="2fa-method"
                            checked={selectedMethod === 'SMS'}
                            onChange={() => setSelectedMethod('SMS')}
                            className="mt-1 accent-black"
                          />
                          <div>
                            <span className="font-bold text-xs text-black flex items-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>رسالة نصية قصيرة (SMS OTP)</span>
                            </span>
                            <span className="text-[11px] text-zinc-500 block mt-0.5">إرسال كود تحقق مكون من 6 أرقام إلى الهاتف المسجل ({selectedUser.phone}).</span>
                          </div>
                        </label>
                      </div>

                      <div className="flex gap-3 justify-end pt-3 border-t border-zinc-100">
                        <button className="button-outline-on-light" onClick={() => setShow2FAModal(false)} style={{ minHeight: '36px', padding: '6px 16px', fontSize: '13px' }}>
                          إلغاء
                        </button>
                        <button className="button-primary-pill" onClick={() => setStep(2)} style={{ minHeight: '36px', padding: '6px 20px', fontSize: '13px' }}>
                          <span>المتابعة وإظهار الرمز</span>
                          <ArrowLeft className="w-4 h-4 mr-1" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 text-center">
                      {selectedMethod === 'Google Authenticator' ? (
                        <div>
                          <p className="text-xs text-zinc-600 mb-3">
                            امسح كود الـ QR التالي بواسطة تطبيق Google Authenticator على جوالك:
                          </p>
                          
                          <div className="w-36 h-36 mx-auto mb-3 bg-zinc-100 border border-zinc-300 rounded-2xl flex flex-col items-center justify-center">
                            <QrCode className="w-20 h-20 text-black" />
                            <span className="text-[9px] text-zinc-500 font-mono mt-1 font-bold">ALSALIM 2FA KEY</span>
                          </div>

                          <div className="bg-zinc-100 p-2 rounded-xl text-xs font-mono font-bold text-black inline-block">
                            SECRET KEY: JBSW-Y3DP-EHPK-3PXP
                          </div>
                        </div>
                      ) : selectedMethod === 'بصمة بيومترية (FIDO2)' ? (
                        <div>
                          <Fingerprint className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                          <p className="text-sm font-bold text-emerald-900">
                            جاهز لتسجيل وتفويض البصمة البيومترية للمستخدم
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">
                            سيتم إنشاء مفتاح Passkey مشفر وتخزينه في Secure Storage للجهاز المعتمد.
                          </p>
                        </div>
                      ) : (
                        <div>
                          <MessageSquare className="w-10 h-10 text-black mx-auto mb-2" />
                          <p className="text-xs font-bold text-black">
                            سيتم إرسال رمز التحقق عند تسجيل الدخول القادم عبر {selectedMethod} إلى ({selectedUser.phone}).
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-zinc-700">
                          أدخل رمز التجربة (6 أرقام) للتأكيد وتفعيل الحماية *
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="123456"
                          value={otpCode}
                          onChange={e => setOtpCode(e.target.value)}
                          className="text-center text-lg font-mono font-bold tracking-widest w-44 mx-auto block bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 focus:border-black focus:outline-none"
                        />
                      </div>

                      <div className="flex gap-3 justify-end pt-3 border-t border-zinc-100">
                        <button className="button-outline-on-light" onClick={() => setStep(1)} style={{ minHeight: '36px', padding: '6px 16px', fontSize: '13px' }}>
                          رجوع
                        </button>
                        <button className="button-primary-pill" onClick={handleToggle2FA} style={{ minHeight: '36px', padding: '6px 20px', fontSize: '13px' }}>
                          <Check className="w-4 h-4 ml-1" />
                          <span>تأكيد وتفعيل الحماية</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
