import React, { useState } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';

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
  two_factor_method?: 'Google Authenticator' | 'SMS' | 'WhatsApp' | 'Email';
}

const MOCK_USERS: UserAdmin[] = [
  {
    id: '1',
    name: 'مشرف admin',
    username: 'admin',
    user_type: 'الادارة',
    role: 'Administrator',
    branch: 'الفرع الرئيسي',
    phone: '0512344321',
    email: 'admin@clickandmore.sa',
    status: 'نشط',
    two_factor_enabled: true,
    two_factor_method: 'Google Authenticator'
  },
  {
    id: '2',
    name: 'محمد مصطفي',
    username: 'mohammed',
    user_type: 'الادارة',
    role: 'Administrator',
    branch: 'الفرع الرئيسي',
    phone: '509082341',
    email: 'Mohammed@gmail.com',
    status: 'نشط',
    two_factor_enabled: false
  },
  {
    id: '3',
    name: 'سارة خالد',
    username: 'sara_hr',
    user_type: 'الموارد البشرية',
    role: 'HR Manager',
    branch: 'فرع الرياض - اليرموك',
    phone: '0594249640',
    email: 'sara@alsalim.sa',
    status: 'نشط',
    two_factor_enabled: true,
    two_factor_method: 'SMS'
  }
];

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserAdmin[]>(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState<UserAdmin | null>(null);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'Google Authenticator' | 'SMS' | 'WhatsApp' | 'Email'>('Google Authenticator');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<1 | 2>(1);

  const handleOpen2FAModal = (user: UserAdmin) => {
    setSelectedUser(user);
    setSelectedMethod(user.two_factor_method || 'Google Authenticator');
    setOtpCode('');
    setStep(1);
    setShow2FAModal(true);
  };

  const handleToggle2FA = () => {
    if (!selectedUser) return;
    const isEnabling = !selectedUser.two_factor_enabled;

    setUsers(prev => prev.map(u => {
      if (u.id === selectedUser.id) {
        return {
          ...u,
          two_factor_enabled: isEnabling,
          two_factor_method: isEnabling ? selectedMethod : undefined
        };
      }
      return u;
    }));

    setShow2FAModal(false);
    alert(isEnabling ? `تم تفعيل المصادقة الثنائية (2FA) للمستخدم ${selectedUser.name} بنجاح عبر (${selectedMethod})!` : `تم تعطيل المصادقة الثنائية للمستخدم ${selectedUser.name}.`);
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
          <span style={{ fontWeight: '700' }}>{row.name}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>@{row.username}</div>
        </div>
      )
    },
    {
      header: 'نوع المستخدم والدور',
      accessor: (row) => (
        <div>
          <Badge text={row.role} type="purple" />
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.user_type}</div>
        </div>
      )
    },
    {
      header: 'الفرع المخصص',
      accessor: (row) => <span style={{ fontSize: '12px', fontWeight: '600' }}>{row.branch}</span>
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
      header: 'الحالة',
      accessor: (row) => <Badge text={row.status} type={row.status === 'نشط' ? 'success' : 'danger'} />
    },
    {
      header: 'الإجراءات',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            className={`btn-odoo ${row.two_factor_enabled ? 'btn-odoo-secondary' : 'btn-odoo-purple'}`}
            style={{ padding: '4px 8px', height: '30px', fontSize: '12px' }}
            onClick={() => handleOpen2FAModal(row)}
          >
            <i className="fa-solid fa-key ml-1"></i> {row.two_factor_enabled ? 'إدارة 2FA' : 'تفعيل 2FA'}
          </button>
          <button className="btn-odoo btn-odoo-secondary" style={{ padding: '4px 8px', height: '30px', fontSize: '12px' }}>
            تعديل
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-user-shield text-purple ml-2"></i> مستخدمو النظام والتحكم بالصلاحيات والمصادقة الثنائية (2FA)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            إدارة موظفي الفروع، المكاتب الخارجية، تعيين الأدوار وتفعيل حماية المصادقة الثنائية 2FA لحسابات المستخدمين
          </p>
        </div>
      </div>

      {/* 2FA Stats Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: 'white', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0', borderRight: '4px solid #005154' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>إجمالي المستخدمين</span>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#005154', marginTop: '4px' }}>{users.length}</div>
        </div>

        <div style={{ background: 'white', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0', borderRight: '4px solid #10B981' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>المصادقة الثنائية 2FA مفعلة</span>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#10B981', marginTop: '4px' }}>
            {users.filter(u => u.two_factor_enabled).length}
          </div>
        </div>

        <div style={{ background: 'white', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0', borderRight: '4px solid #F59E0B' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>حسابات بانتظار التفعيل</span>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#F59E0B', marginTop: '4px' }}>
            {users.filter(u => !u.two_factor_enabled).length}
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchPlaceholder="ابحث بالاسم، اسم المستخدم، البريد، أو الفرع..."
        addLabel="إضافة مستخدم جديد"
        exportConfig={{ sectionKey: 'users', rawData: users }}
      />

      {/* 2FA Configuration Modal */}
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
                <i className="fa-solid fa-shield-halved ml-2"></i> المصادقة الثنائية (Two-Factor Authentication 2FA)
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
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button className="btn-odoo btn-odoo-secondary" onClick={() => setShow2FAModal(false)}>إغلاق</button>
                  <button className="btn-odoo btn-odoo-danger" onClick={handleToggle2FA}>
                    <i className="fa-solid fa-trash-can ml-1"></i> تعطيل المصادقة الثنائية 2FA
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {step === 1 ? (
                  <div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      اختر طريقة المصادقة الثنائية المفضلة لتأمين حساب المستخدم عند تسجيل الدخول:
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

                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        border: selectedMethod === 'WhatsApp' ? '2px solid #005154' : '1px solid #E2E8F0',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        background: selectedMethod === 'WhatsApp' ? 'rgba(0, 81, 84, 0.05)' : '#FFFFFF'
                      }}>
                        <input
                          type="radio"
                          name="2fa-method"
                          checked={selectedMethod === 'WhatsApp'}
                          onChange={() => setSelectedMethod('WhatsApp')}
                          style={{ accentColor: '#005154' }}
                        />
                        <div>
                          <span style={{ fontWeight: '800', fontSize: '13.5px', color: '#181C1C', display: 'block' }}>
                            <i className="fa-brands fa-whatsapp text-success ml-1"></i> عبر الواتساب (WhatsApp OTP)
                          </span>
                          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>إرسال رمز التوثيق مباشرة إلى رقم الواتساب الرسمي للموظف.</span>
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
                        
                        {/* Simulated QR Code Canvas Visual */}
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
                        أدخل رمز التجربة (6 أرقام) للتأكيد وتفعيل الـ 2FA *
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
                        تأكيد وتفعيل المصادقة 2FA
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
