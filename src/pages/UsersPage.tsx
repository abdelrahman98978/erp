import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';

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
    name: 'مشرف admin',
    username: 'admin',
    user_type: 'الإدارة العليا',
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
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserAdmin | null>(null);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'Google Authenticator' | 'SMS' | 'WhatsApp' | 'Email' | 'بصمة بيومترية (FIDO2)'>('Google Authenticator');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<1 | 2>(1);

  // New User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    role: 'Operations Lead',
    user_type: 'إدارة العمليات',
    branch: 'الفرع الرئيسي',
    phone: '',
    email: '',
    two_factor_enabled: true,
    biometric_enabled: true,
    biometric_type: 'Touch ID (بصمة إصبع)' as const
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
    alert(isEnabling ? `تم تفعيل المصادقة الثنائية (2FA) للمستخدم ${selectedUser.name} بنجاح عبر (${selectedMethod})!` : `تم تعطيل المصادقة للمستخدم ${selectedUser.name}.`);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.username) {
      alert('يرجى كتابة اسم الموظف واسم المستخدم');
      return;
    }

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
    setNewUser({
      name: '',
      username: '',
      role: 'Operations Lead',
      user_type: 'إدارة العمليات',
      branch: 'الفرع الرئيسي',
      phone: '',
      email: '',
      two_factor_enabled: true,
      biometric_enabled: true,
      biometric_type: 'Touch ID (بصمة إصبع)'
    });
    alert(`تم إنشاء حساب المستخدم ${createdRecord.name} بنجاح وتعيين الصلاحيات البيومترية!`);
  };

  const columns: Column<UserAdmin>[] = [
    {
      header: '#',
      accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{row.id}</span>
    },
    {
      header: 'الاسم واسم المستخدم',
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '800', color: '#0F172A' }}>{row.name}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>@{row.username} • {row.email}</div>
        </div>
      )
    },
    {
      header: 'الدور الوظيفي والصلاحيات',
      accessor: (row) => (
        <div>
          <Badge text={row.role} type="purple" />
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{row.user_type}</div>
        </div>
      )
    },
    {
      header: 'الفرع المخصص',
      accessor: (row) => <span style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>{row.branch}</span>
    },
    {
      header: 'المصادقة الثنائية (2FA)',
      accessor: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {row.two_factor_enabled ? (
            <Badge text={`مفعلة (${row.two_factor_method || 'TOTP'})`} type="success" icon="fa-solid fa-shield-halved" />
          ) : (
            <Badge text="غير مفعلة" type="warning" icon="fa-solid fa-lock-open" />
          )}
        </div>
      )
    },
    {
      header: 'البصمة البيومترية',
      accessor: (row) => (
        <div>
          {row.biometric_enabled ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 8px',
                borderRadius: '6px',
                background: '#ECFDF5',
                color: '#065F46',
                fontSize: '11px',
                fontWeight: '800',
                border: '1px solid #A7F3D0'
              }}
            >
              <i className="fa-solid fa-fingerprint text-emerald-600" aria-hidden="true"></i>
              {row.biometric_type || 'بصمة معتمدة'}
            </span>
          ) : (
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>غير مسجلة</span>
          )}
        </div>
      )
    },
    {
      header: 'الحالة',
      accessor: (row) => <Badge text={row.status} type={row.status === 'نشط' ? 'success' : 'danger'} />
    },
    {
      header: 'الإجراءات',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className={`btn-odoo ${row.two_factor_enabled ? 'btn-odoo-secondary' : 'btn-odoo-purple'}`}
            style={{ padding: '4px 10px', height: '30px', fontSize: '11.5px', fontWeight: '800' }}
            onClick={() => handleOpen2FAModal(row)}
          >
            <i className="fa-solid fa-fingerprint ml-1 text-emerald-600"></i> {row.two_factor_enabled ? 'إدارة الأمان' : 'تفعيل 2FA'}
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-user-shield text-purple ml-2"></i> مستخدمو النظام والتحكم بالصلاحيات والمصادقة البيومترية
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            إدارة موظفي الفروع، المكاتب الخارجية، تعيين الأدوار وتفعيل حماية البصمة (Touch ID / Face ID) والمصادقة الثنائية 2FA
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="button-primary-pill" onClick={() => setShowAddUserModal(true)} style={{ fontSize: '13px', padding: '6px 18px', minHeight: '38px' }}>
            <i className="fa-solid fa-user-plus ml-1"></i> + إضافة مستخدم جديد
          </button>
          <button className="button-outline-on-light" onClick={() => exportData('users', users, 'excel')} title="تصدير Excel" style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}>
            <i className="fa-solid fa-file-excel text-emerald-600 ml-1"></i> Excel
          </button>
          <button className="button-outline-on-light" onClick={() => exportData('users', users, 'pdf')} title="تصدير PDF" style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}>
            <i className="fa-solid fa-file-pdf text-rose-600 ml-1"></i> PDF
          </button>
        </div>
      </div>

      {/* 2FA & Biometrics Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card-pricing" style={{ padding: '20px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '12px', color: '#71717a', fontWeight: 550 }}>إجمالي المستخدمين</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '4px', letterSpacing: '-0.02em' }}>{users.length}</div>
        </div>

        <div className="card-pistachio-band" style={{ padding: '20px', borderRadius: '16px' }}>
          <span style={{ fontSize: '12px', color: '#000000', fontWeight: 550 }}>المصادقة 2FA مفعلة</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '4px', letterSpacing: '-0.02em' }}>
            {users.filter(u => u.two_factor_enabled).length}
          </div>
        </div>

        <div className="card-pricing-featured" style={{ padding: '20px', borderRadius: '16px', background: '#000000', color: '#ffffff' }}>
          <span style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: 550 }}>الدخول بالبصمة مسجل</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#ffffff', marginTop: '4px', letterSpacing: '-0.02em' }}>
            {users.filter(u => u.biometric_enabled).length}
          </div>
        </div>

        <div className="card-pricing" style={{ padding: '20px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '12px', color: '#71717a', fontWeight: 550 }}>حسابات بانتظار التوثيق</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '4px', letterSpacing: '-0.02em' }}>
            {users.filter(u => !u.two_factor_enabled).length}
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchPlaceholder="ابحث بالاسم، اسم المستخدم، البريد، أو الفرع..."
        onAddClick={() => setShowAddUserModal(true)}
        addLabel="إضافة مستخدم جديد"
        exportConfig={{ sectionKey: 'users', rawData: users }}
      />

      {/* Add User Modal */}
      {showAddUserModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(6px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#005154', margin: 0 }}>
                <i className="fa-solid fa-user-plus ml-2"></i> إنشاء مستخدم جديد وتعيين الصلاحيات
              </h3>
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '18px', color: '#64748B' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', display: 'block', marginBottom: '4px' }}>اسم الموظف الثلاثي *</label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="مثال: خالد محمد العتيبي"
                    className="filter-input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', display: 'block', marginBottom: '4px' }}>اسم المستخدم (Username) *</label>
                  <input
                    type="text"
                    required
                    value={newUser.username}
                    onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                    placeholder="مثال: khaled_ops"
                    className="filter-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', display: 'block', marginBottom: '4px' }}>الدور الوظيفي (Role)</label>
                  <select
                    value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                    className="filter-select"
                    style={{ width: '100%' }}
                  >
                    <option value="Administrator">Administrator (مدير نظام)</option>
                    <option value="HR Director">HR Director (مدير موارد بشرية)</option>
                    <option value="Financial Manager">Financial Manager (مدير مالي)</option>
                    <option value="Branch Manager">Branch Manager (مدير فرع)</option>
                    <option value="Operations Lead">Operations Lead (مشرف تشغيل وعقود)</option>
                    <option value="Customer Care Lead">Customer Care Lead (خدمة عملاء)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', display: 'block', marginBottom: '4px' }}>الفرع المخصص</label>
                  <select
                    value={newUser.branch}
                    onChange={e => setNewUser({ ...newUser, branch: e.target.value })}
                    className="filter-select"
                    style={{ width: '100%' }}
                  >
                    <option value="الفرع الرئيسي">الفرع الرئيسي - الرياض</option>
                    <option value="فرع الرياض - اليرموك">فرع الرياض - اليرموك</option>
                    <option value="فرع جدة - التحلية">فرع جدة - التحلية</option>
                    <option value="فرع الخبر - الكورنيش">فرع الخبر - الكورنيش</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', display: 'block', marginBottom: '4px' }}>رقم الجوال</label>
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="05XXXXXXXX"
                    className="filter-input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', display: 'block', marginBottom: '4px' }}>البريد الإلكتروني الرسمي</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="user@alsulaim.sa"
                    className="filter-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Security Toggles */}
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', fontWeight: '700' }}>
                  <input
                    type="checkbox"
                    checked={newUser.two_factor_enabled}
                    onChange={e => setNewUser({ ...newUser, two_factor_enabled: e.target.checked })}
                    style={{ accentColor: '#005154' }}
                  />
                  <span>إلزام الحساب بالمصادقة الثنائية (2FA OTP) عند تسجيل الدخول</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', fontWeight: '700' }}>
                  <input
                    type="checkbox"
                    checked={newUser.biometric_enabled}
                    onChange={e => setNewUser({ ...newUser, biometric_enabled: e.target.checked })}
                    style={{ accentColor: '#059669' }}
                  />
                  <span>تسجيل صلاحية الدخول بالبصمة الحيوية وبصمة الوجه (WebAuthn)</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="btn-odoo btn-odoo-secondary" onClick={() => setShowAddUserModal(false)}>إلغاء</button>
                <button type="submit" className="btn-odoo btn-odoo-primary">
                  <i className="fa-solid fa-check ml-1"></i> حفظ وإنشاء الحساب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2FA & Biometric Configuration Modal */}
      {show2FAModal && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="table-card" style={{ width: '540px', padding: '24px', background: '#FFFFFF', borderRadius: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154' }}>
                <i className="fa-solid fa-shield-halved ml-2"></i> المصادقة الثنائية والأمان البيومتري (2FA & Biometrics)
              </h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setShow2FAModal(false)}></i>
            </div>

            <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#181C1C' }}>المستخدم: {selectedUser.name} (@{selectedUser.username})</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>البريد: {selectedUser.email} • الهاتف: {selectedUser.phone}</div>
            </div>

            {selectedUser.two_factor_enabled ? (
              <div>
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '14px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <i className="fa-solid fa-circle-check" style={{ color: '#10B981', fontSize: '24px' }}></i>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#065F46' }}>المصادقة الثنائية مفعلة حالياً</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#047857' }}>وسيلة التحقق النشطة: {selectedUser.two_factor_method || 'Google Authenticator'}</p>
                    {selectedUser.biometric_enabled && (
                      <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#059669', fontWeight: '700' }}>
                        <i className="fa-solid fa-fingerprint me-1"></i> البصمة الحيوية: {selectedUser.biometric_type || 'Touch ID / Face ID'}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button className="btn-odoo btn-odoo-secondary" onClick={() => setShow2FAModal(false)}>إغلاق</button>
                  <button className="btn-odoo btn-odoo-danger" onClick={handleToggle2FA}>
                    <i className="fa-solid fa-trash-can ml-1"></i> تعطيل المصادقة 2FA
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {step === 1 ? (
                  <div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      اختر طريقة المصادقة الثنائية والأمان البيومتري لتأمين حساب المستخدم:
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        border: selectedMethod === 'Google Authenticator' ? '2px solid #005154' : '1px solid #E2E8F0',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        background: selectedMethod === 'Google Authenticator' ? 'rgba(0, 81, 84, 0.05)' : '#FFFFFF'
                      }}>
                        <input
                          type="radio"
                          name="2fa-method"
                          checked={selectedMethod === 'Google Authenticator'}
                          onChange={() => setSelectedMethod('Google Authenticator')}
                          style={{ accentColor: '#005154' }}
                        />
                        <div>
                          <span style={{ fontWeight: '800', fontSize: '13.5px', color: '#181C1C', display: 'block' }}>
                            <i className="fa-solid fa-mobile-screen-button text-purple ml-1"></i> تطبيق المصادقة (Google Authenticator / Authy / Microsoft)
                          </span>
                          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>توليد رموز OTP مؤقتة متغير كل 30 ثانية بدون الحاجة لإنترنت.</span>
                        </div>
                      </label>

                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        border: selectedMethod === 'بصمة بيومترية (FIDO2)' ? '2px solid #059669' : '1px solid #E2E8F0',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        background: selectedMethod === 'بصمة بيومترية (FIDO2)' ? '#ECFDF5' : '#FFFFFF'
                      }}>
                        <input
                          type="radio"
                          name="2fa-method"
                          checked={selectedMethod === 'بصمة بيومترية (FIDO2)'}
                          onChange={() => setSelectedMethod('بصمة بيومترية (FIDO2)')}
                          style={{ accentColor: '#059669' }}
                        />
                        <div>
                          <span style={{ fontWeight: '800', fontSize: '13.5px', color: '#065F46', display: 'block' }}>
                            <i className="fa-solid fa-fingerprint text-emerald-600 ml-1"></i> البصمة البيومترية المشفرة (Touch ID / Face ID Passkey)
                          </span>
                          <span style={{ fontSize: '11.5px', color: '#047857' }}>مصادقة مباشرة عبر شريحة الأمان للأجهزة الداعمة لـ WebAuthn.</span>
                        </div>
                      </label>

                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        border: selectedMethod === 'SMS' ? '2px solid #005154' : '1px solid #E2E8F0',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        background: selectedMethod === 'SMS' ? 'rgba(0, 81, 84, 0.05)' : '#FFFFFF'
                      }}>
                        <input
                          type="radio"
                          name="2fa-method"
                          checked={selectedMethod === 'SMS'}
                          onChange={() => setSelectedMethod('SMS')}
                          style={{ accentColor: '#005154' }}
                        />
                        <div>
                          <span style={{ fontWeight: '800', fontSize: '13.5px', color: '#181C1C', display: 'block' }}>
                            <i className="fa-solid fa-comment-sms text-primary ml-1"></i> رسالة نصية قصيرة (SMS OTP)
                          </span>
                          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>إرسال كود تحقق مكون من 6 أرقام إلى الهاتف المسجل ({selectedUser.phone}).</span>
                        </div>
                      </label>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className="btn-odoo btn-odoo-secondary" onClick={() => setShow2FAModal(false)}>إلغاء</button>
                      <button className="btn-odoo btn-odoo-purple" onClick={() => setStep(2)}>
                        المتابعة وإظهار الرمز <i className="fa-solid fa-arrow-left mr-1"></i>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {selectedMethod === 'Google Authenticator' ? (
                      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                          امسح كود الـ QR التالي بواسطة تطبيق Google Authenticator على جوالك:
                        </p>
                        
                        <div style={{
                          width: '150px',
                          height: '150px',
                          margin: '0 auto 12px auto',
                          background: '#F1F5F9',
                          border: '2px dashed #005154',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column'
                        }}>
                          <i className="fa-solid fa-qrcode" style={{ fontSize: '80px', color: '#005154' }}></i>
                          <span style={{ fontSize: '10px', color: '#005154', fontWeight: '700' }}>ALSALIM 2FA KEY</span>
                        </div>

                        <div style={{ background: '#F1F5F9', padding: '8px 12px', borderRadius: '6px', display: 'inline-block', fontSize: '12px', fontFamily: 'monospace', fontWeight: '800' }}>
                          SECRET KEY: JBSW-Y3DP-EHPK-3PXP
                        </div>
                      </div>
                    ) : selectedMethod === 'بصمة بيومترية (FIDO2)' ? (
                      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <i className="fa-solid fa-fingerprint text-emerald-600" style={{ fontSize: '48px', marginBottom: '12px' }}></i>
                        <p style={{ fontSize: '14px', fontWeight: '800', color: '#065F46' }}>
                          جاهز لتسجيل وتفويض البصمة البيومترية للمستخدم
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          سيتم إنشاء مفتاح Passkey مشفر وتخزينه في Secure Storage للجهاز المعتمد.
                        </p>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <i className="fa-solid fa-paper-plane text-purple" style={{ fontSize: '40px', marginBottom: '12px' }}></i>
                        <p style={{ fontSize: '13.5px', fontWeight: '700' }}>
                          سيتم إرسال رمز التحقق عند تسجيل الدخول القادم عبر {selectedMethod} إلى ({selectedUser.phone}).
                        </p>
                      </div>
                    )}

                    <div className="filter-group" style={{ marginBottom: '20px' }}>
                      <label className="filter-label" style={{ textAlign: 'center', display: 'block' }}>
                        أدخل رمز التجربة (6 أرقام) للتأكيد وتفعيل الحماية *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        className="filter-input"
                        placeholder="123456"
                        value={otpCode}
                        onChange={e => setOtpCode(e.target.value)}
                        style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '6px', fontWeight: '800', width: '200px', margin: '0 auto', display: 'block' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className="btn-odoo btn-odoo-secondary" onClick={() => setStep(1)}>رجوع</button>
                      <button className="btn-odoo btn-odoo-purple" onClick={handleToggle2FA}>
                        تأكيد وتفعيل الحماية
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
