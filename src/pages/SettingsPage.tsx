import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { realErpDataStore } from '../services/realErpDataStore';
import { useAppStore } from '../stores/appStore';

export const SettingsPage: React.FC = () => {
  const storeActiveTab = useAppStore(state => state.activeTab);

  const getMappedSection = (tabKey: string): string => {
    if (tabKey === 'rbac-matrix') return 'rbac-matrix';
    if (tabKey === 'settings-general' || tabKey === 'general') return 'general';
    if (tabKey === 'contacts') return 'contacts';
    if (tabKey === 'media') return 'media';
    if (tabKey === 'quick-links') return 'quick-links';
    if (tabKey === 'login-config') return 'login-config';
    if (tabKey === 'seo') return 'seo';
    if (tabKey === 'zoho') return 'zoho';
    if (tabKey === 'stipulations') return 'stipulations';
    return 'security-2fa';
  };

  const [activeSection, setActiveSection] = useState<string>(() => getMappedSection(storeActiveTab));

  useEffect(() => {
    setActiveSection(getMappedSection(storeActiveTab));
  }, [storeActiveTab]);

  const [require2FAAdmin, setRequire2FAAdmin] = useState(true);
  const [allowOptional2FA, setAllowOptional2FA] = useState(true);
  const [allowBiometrics, setAllowBiometrics] = useState(true);
  const [allowFaceId, setAllowFaceId] = useState(true);
  const [otpExpiryMinutes, setOtpExpiryMinutes] = useState(5);

  const SECTIONS = [
    { id: 'security-2fa', name: 'أمان المصادقة والبصمة البيومترية', icon: 'fa-fingerprint' },
    { id: 'rbac-matrix', name: 'مصفوفة الصلاحيات (RBAC Matrix)', icon: 'fa-user-lock' },
    { id: 'general', name: 'البيانات الأساسية', icon: 'fa-building' },
    { id: 'contacts', name: 'روابط التواصل والموقع', icon: 'fa-phone' },
    { id: 'media', name: 'الهوية والوسائط والشعار', icon: 'fa-image' },
    { id: 'quick-links', name: 'إدارة الروابط السريعة (Quick Links)', icon: 'fa-link' },
    { id: 'login-config', name: 'تسجيل دخول الموقع الخارجي', icon: 'fa-key' },
    { id: 'seo', name: 'إعدادات SEO & Tags', icon: 'fa-searchengin' },
    { id: 'zoho', name: 'إعدادات Zoho SalesIQ Live Chat', icon: 'fa-comments' },
    { id: 'stipulations', name: 'السياسات والشروط والضمان', icon: 'fa-file-lines' }
  ];

  const handleSaveSettings = async () => {
    await realErpDataStore.addRecord('system_settings', {
      id: String(Date.now()),
      setting_key: 'SECURITY_2FA_CONFIG',
      setting_value: JSON.stringify({ require2FAAdmin, allowOptional2FA, allowBiometrics, allowFaceId, otpExpiryMinutes }),
      description: 'إعدادات المصادقة الثنائية والبصمة البيومترية'
    });
    alert('تم حفظ جميع إعدادات النظام وسياسات البصمة والمصادقة الثنائية بنجاح!');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 550, color: '#000000', margin: 0 }}>
            <i className="fa-solid fa-sliders text-emerald-600 ml-2"></i> إعدادات النظام ومحتوى المنصة والأمان
          </h2>
          <p style={{ fontSize: '13px', color: '#71717a', margin: '4px 0 0 0' }}>
            ضبط سياسات أمان المصادقة الثنائية (2FA)، اسم المنصة، الروابط السريعة الحكومية، ونصوص البوابة
          </p>
        </div>
        <button className="button-primary-pill" onClick={handleSaveSettings} style={{ fontSize: '13px', padding: '8px 20px', minHeight: '38px' }}>
          <i className="fa-solid fa-floppy-disk ml-1"></i> حفظ جميع التعديلات
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px' }}>
        {/* Left Side Settings Navigation Menu */}
        <div className="card-pricing" style={{ padding: '12px', borderRadius: '16px', background: '#ffffff', height: 'fit-content' }}>
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <div
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '9999px',
                  fontSize: '12.5px',
                  fontWeight: isActive ? 550 : 420,
                  border: '1px solid',
                  borderColor: isActive ? '#000000' : 'transparent',
                  background: isActive ? '#000000' : 'transparent',
                  color: isActive ? '#ffffff' : '#27272a',
                  cursor: 'pointer',
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.15s ease',
                }}
              >
                <i className={`fa-solid ${sec.icon}`} style={{ fontSize: '12px', opacity: isActive ? 1 : 0.6 }}></i>
                <span>{sec.name}</span>
              </div>
            );
          })}
        </div>

        {/* Right Side Settings Form View */}
        <div className="card-pricing" style={{ padding: '28px', borderRadius: '16px', background: '#ffffff' }}>
          {activeSection === 'security-2fa' && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 550, marginBottom: '8px', color: '#000000', borderBottom: '1px solid #e4e4e7', paddingBottom: '10px' }}>
                إعدادات أمان المصادقة الثنائية (Two-Factor Authentication 2FA Policy)
              </h3>
              <p style={{ fontSize: '12.5px', color: '#71717a', marginBottom: '20px' }}>
                تعديل وتحديد سياسات الأمان والحماية لحسابات مديري النظام والموظفين بالفروع.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fbfbf5', padding: '16px', borderRadius: '10px', cursor: 'pointer', border: '1px solid #e4e4e7' }}>
                  <input
                    type="checkbox"
                    checked={require2FAAdmin}
                    onChange={e => setRequire2FAAdmin(e.target.checked)}
                    style={{ accentColor: '#000000', width: '18px', height: '18px' }}
                  />
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: '#000000', display: 'block' }}>
                      إلزامية المصادقة الثنائية (2FA) لجميع المديرين والمشرفين (Admins Only)
                    </span>
                    <span style={{ fontSize: '12px', color: '#71717a' }}>
                      منع تسجيل الدخول لأي حساب إداري ذو صلاحيات واسعة دون إدخال رمز التحقق الثنائي (TOTP / SMS).
                    </span>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fbfbf5', padding: '16px', borderRadius: '10px', cursor: 'pointer', border: '1px solid #e4e4e7' }}>
                  <input
                    type="checkbox"
                    checked={allowOptional2FA}
                    onChange={e => setAllowOptional2FA(e.target.checked)}
                    style={{ accentColor: '#000000', width: '18px', height: '18px' }}
                  />
                  <div>
                    <span style={{ fontWeight: '800', fontSize: '14px', color: '#181C1C', display: 'block' }}>
                      السماح للموظفين بتفعيل الـ 2FA اختيارياً
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      تمكين موظفي الفروع والمكاتب من اختيار وتفعيل تطبيق المصادقة (Google Authenticator) للحفاظ على أمان حساباتهم.
                    </span>
                  </div>
                </label>

                {/* Biometric Fingerprint Toggle */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#ECFDF5', padding: '16px', borderRadius: '10px', cursor: 'pointer', border: '1px solid #A7F3D0' }}>
                  <input
                    type="checkbox"
                    checked={allowBiometrics}
                    onChange={e => setAllowBiometrics(e.target.checked)}
                    style={{ accentColor: '#059669', width: '18px', height: '18px' }}
                  />
                  <div>
                    <span style={{ fontWeight: '800', fontSize: '14px', color: '#065F46', display: 'block' }}>
                      <i className="fa-solid fa-fingerprint me-1"></i> تفعيل الدخول ببصمة الإصبع (Touch ID / Windows Hello / WebAuthn)
                    </span>
                    <span style={{ fontSize: '12px', color: '#047857' }}>
                      السماح للمستخدمين بالدخول الفوري المشفر للمنظومة عبر مستشعر البصمة الحيوي للأجهزة المعتمدة.
                    </span>
                  </div>
                </label>

                {/* Biometric Face ID Toggle */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F5F3FF', padding: '16px', borderRadius: '10px', cursor: 'pointer', border: '1px solid #DDD6FE' }}>
                  <input
                    type="checkbox"
                    checked={allowFaceId}
                    onChange={e => setAllowFaceId(e.target.checked)}
                    style={{ accentColor: '#7C3AED', width: '18px', height: '18px' }}
                  />
                  <div>
                    <span style={{ fontWeight: '800', fontSize: '14px', color: '#5B21B6', display: 'block' }}>
                      <i className="fa-solid fa-face-viewfinder me-1"></i> تفعيل الدخول ببصمة الوجه ثلاثية الأبعاد (Face ID)
                    </span>
                    <span style={{ fontSize: '12px', color: '#6D28D9' }}>
                      تمكين تقنية التعرف على الوجه وفحص الحيوية (Liveness Detection) لتسجيل الدخول السريع والآمن.
                    </span>
                  </div>
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div className="filter-group">
                  <label className="filter-label">صلاحية رمز التحقق OTP بالدقائق</label>
                  <select className="filter-select" value={otpExpiryMinutes} onChange={e => setOtpExpiryMinutes(Number(e.target.value))}>
                    <option value={3}>3 دقائق</option>
                    <option value={5}>5 دقائق (مستحسن)</option>
                    <option value={10}>10 دقائق</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">وسيلة الإرسال الافتراضية للرموز</label>
                  <select className="filter-select" defaultValue="Google Authenticator">
                    <option>تطبيق Google Authenticator (TOTP)</option>
                    <option>رسالة SMS نصية قصيرة</option>
                    <option>إشعار عبر الواتساب الرسمي</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'rbac-matrix' && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', color: 'var(--odoo-purple)', borderBottom: '2px solid var(--odoo-purple)', paddingBottom: '8px' }}>
                مصفوفة الصلاحيات والأدوار (Role-Based Access Control - RBAC Matrix)
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                تحديد دقيق لصلاحيات القراءة، الإنشاء، التعديل، الحذف، والاعتماد المالي لكل دور وظيفي.
              </p>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'right' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                      <th style={{ padding: '12px' }}>الدور الوظيفي (Role)</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>عرض (Read)</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>إنشاء (Create)</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>تعديل (Edit)</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>حذف (Delete)</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>اعتماد مالي (Approve)</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>تصدير (Export)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px', fontWeight: '800', color: 'var(--odoo-purple)' }}>مدير النظام العام (Super Admin)</td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked disabled /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked disabled /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked disabled /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked disabled /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked disabled /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked disabled /></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px', fontWeight: '700' }}>مدير الفرع (Branch Manager)</td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked /></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px', fontWeight: '700' }}>المحاسب المالي (Senior Accountant)</td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked /></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px', fontWeight: '700' }}>أخصائي الموارد البشرية (HR Specialist)</td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked /></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px', fontWeight: '700' }}>مشرف مركز الإيواء (Shelter Supervisor)</td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" /></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px', fontWeight: '700' }}>مسؤول المبيعات وخدمة العملاء (Sales Agent)</td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'general' && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', color: 'var(--odoo-purple)', borderBottom: '2px solid var(--odoo-purple)', paddingBottom: '8px' }}>
                1. البيانات الأساسية واسم المنصة
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="filter-group">
                  <label className="filter-label">اسم الموقع بالعربية *</label>
                  <input type="text" className="filter-input" defaultValue="مجموعة الخالد السالم للاستقدام والتشغيل" />
                </div>
                <div className="filter-group">
                  <label className="filter-label">اسم الموقع بالإنجليزية *</label>
                  <input type="text" className="filter-input" defaultValue="MAJMOAT ALKHALID ALSALIM ERP" />
                </div>
                <div className="filter-group" style={{ gridColumn: 'span 2' }}>
                  <label className="filter-label">العنوان الوطني والرسمي *</label>
                  <input type="text" className="filter-input" defaultValue="اليرموك، الرياض 13251، المملكة العربية السعودية" />
                </div>
                <div className="filter-group">
                  <label className="filter-label">البريد الإلكتروني الرسمي</label>
                  <input type="email" className="filter-input" defaultValue="info@clickandmore.sa" />
                </div>
                <div className="filter-group">
                  <label className="filter-label">رقم الهاتف الرئيسي</label>
                  <input type="text" className="filter-input" defaultValue="+966594249640" />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'quick-links' && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', color: 'var(--odoo-teal-dark)', borderBottom: '2px solid var(--odoo-teal)', paddingBottom: '8px' }}>
                4. إعدادات الروابط السريعة الشفافة (Quick Links Bar)
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                الروابط الظاهرة في الشريط العلوي للانتقال المباشر للمنصات الحكومية والخدمية
              </p>

              <table className="odoo-data-table">
                <thead>
                  <tr>
                    <th>اسم الرابط Quick Link</th>
                    <th>الرابط المباشر URL</th>
                    <th>الأيقونة</th>
                    <th>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: '700' }}>مساند برو</td>
                    <td>https://pros.musaned.com.sa/login</td>
                    <td><code>fa-external-link</code></td>
                    <td><Badge text="مفعل" type="success" /></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: '700' }}>مساند توثيق</td>
                    <td>https://tawtheeq.musaned.com.sa/</td>
                    <td><code>fa-file-text-o</code></td>
                    <td><Badge text="مفعل" type="success" /></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: '700' }}>اللايف شات (Zoho)</td>
                    <td>https://salesiq.zoho.sa/platinumeastern/liveview</td>
                    <td><code>fa-comments</code></td>
                    <td><Badge text="مفعل" type="success" /></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: '700' }}>منصة إنجاز</td>
                    <td>https://visa.mofa.gov.sa/enjaz/getvisainformation/</td>
                    <td><code>fa-id-card-o</code></td>
                    <td><Badge text="مفعل" type="success" /></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: '700' }}>منصة تأشير</td>
                    <td>https://ksavisa.sa/</td>
                    <td><code>fa-plane</code></td>
                    <td><Badge text="مفعل" type="success" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
