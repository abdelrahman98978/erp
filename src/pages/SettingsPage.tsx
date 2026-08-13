import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { realErpDataStore } from '../services/realErpDataStore';

export const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('security-2fa');
  const [require2FAAdmin, setRequire2FAAdmin] = useState(true);
  const [allowOptional2FA, setAllowOptional2FA] = useState(true);
  const [otpExpiryMinutes, setOtpExpiryMinutes] = useState(5);

  const SECTIONS = [
    { id: 'security-2fa', name: 'أمان المصادقة الثنائية (2FA)', icon: 'fa-shield-halved' },
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
      setting_value: JSON.stringify({ require2FAAdmin, allowOptional2FA, otpExpiryMinutes }),
      description: 'إعدادات المصادقة الثنائية 2FA'
    });
    alert('تم حفظ جميع إعدادات النظام وسياسة المصادقة الثنائية بنجاح!');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-sliders text-primary ml-2"></i> إعدادات النظام ومحتوى المنصة والأمان
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            ضبط سياسات أمان المصادقة الثنائية (2FA)، اسم المنصة، الروابط السريعة الحكومية، ونصوص البوابة
          </p>
        </div>
        <button className="btn-odoo btn-odoo-primary" onClick={handleSaveSettings}>
          <i className="fa-solid fa-floppy-disk"></i> حفظ جميع التعديلات
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px' }}>
        {/* Left Side Settings Navigation Menu */}
        <div className="table-card" style={{ padding: '12px' }}>
          {SECTIONS.map((sec) => (
            <div
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                fontWeight: activeSection === sec.id ? '700' : '500',
                background: activeSection === sec.id ? 'var(--primary-light)' : 'transparent',
                color: activeSection === sec.id ? 'var(--primary)' : 'var(--text-main)',
                cursor: 'pointer',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <i className={`fa-solid ${sec.icon}`}></i>
              <span>{sec.name}</span>
            </div>
          ))}
        </div>

        {/* Right Side Settings Form View */}
        <div className="table-card" style={{ padding: '24px' }}>
          {activeSection === 'security-2fa' && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', color: '#005154', borderBottom: '2px solid #005154', paddingBottom: '8px' }}>
                إعدادات أمان المصادقة الثنائية (Two-Factor Authentication 2FA Policy)
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                تعديل وتحديد سياسات الأمان والحماية لحسابات مديري النظام والموظفين بالفروع.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F8FAFC', padding: '16px', borderRadius: '10px', cursor: 'pointer', border: '1px solid #E2E8F0' }}>
                  <input
                    type="checkbox"
                    checked={require2FAAdmin}
                    onChange={e => setRequire2FAAdmin(e.target.checked)}
                    style={{ accentColor: '#005154', width: '18px', height: '18px' }}
                  />
                  <div>
                    <span style={{ fontWeight: '800', fontSize: '14px', color: '#181C1C', display: 'block' }}>
                      إلزامية المصادقة الثنائية (2FA) لجميع المديرين والمشرفين (Admins Only)
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      منع تسجيل الدخول لأي حساب إداري ذو صلاحيات واسعة دون إدخال رمز التحقق الثنائي (TOTP / SMS).
                    </span>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F8FAFC', padding: '16px', borderRadius: '10px', cursor: 'pointer', border: '1px solid #E2E8F0' }}>
                  <input
                    type="checkbox"
                    checked={allowOptional2FA}
                    onChange={e => setAllowOptional2FA(e.target.checked)}
                    style={{ accentColor: '#005154', width: '18px', height: '18px' }}
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
