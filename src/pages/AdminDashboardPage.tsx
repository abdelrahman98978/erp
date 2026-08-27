import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { useLanguage } from '../i18n/LanguageContext';
import { realErpDataStore } from '../services/realErpDataStore';

export interface AdminDashboardPageProps {
  onNavigate?: (href: string, title: string) => void;
}

interface UserSession {
  id: string;
  username: string;
  name: string;
  role: string;
  ip_address: string;
  device: string;
  login_time: string;
  two_factor_status: 'مفعل (TOTP)' | 'مفعل (SMS)' | 'غير مفعل';
  status: 'نشط' | 'خامل';
}

const MOCK_ACTIVE_SESSIONS: UserSession[] = [
  {
    id: 's-1',
    username: 'admin',
    name: 'مشرف admin (المدير العام)',
    role: 'Administrator',
    ip_address: '197.34.110.42',
    device: 'Windows 11 / Chrome 126',
    login_time: 'منذ 14 دقيقة',
    two_factor_status: 'مفعل (TOTP)',
    status: 'نشط'
  },
  {
    id: 's-2',
    username: 'mohammed_finance',
    name: 'محمد مصطفى (المدير المالي)',
    role: 'Finance Manager',
    ip_address: '197.34.112.18',
    device: 'macOS Sonoma / Safari',
    login_time: 'منذ 45 دقيقة',
    two_factor_status: 'مفعل (TOTP)',
    status: 'نشط'
  },
  {
    id: 's-3',
    username: 'sara_hr',
    name: 'سارة خالد (مسؤولة HR)',
    role: 'HR Specialist',
    ip_address: '185.12.90.104',
    device: 'Android 14 / Chrome',
    login_time: 'منذ ساعتين',
    two_factor_status: 'مفعل (SMS)',
    status: 'خامل'
  }
];

const MODULE_PERMISSIONS = [
  { id: 'crm', name: 'إدارة العملاء والـ CRM' },
  { id: 'cvs', name: 'السير الذاتية والكوادر (136 حقل)' },
  { id: 'orders', name: 'الطلبات والحجوزات الفورية' },
  { id: 'recruitment-contracts', name: 'عقود الاستقدام المباشرة' },
  { id: 'rent-contracts', name: 'عقود التأجير التشغيلي' },
  { id: 'ingaz', name: 'تفاويض الإنجاز الإلكترونية' },
  { id: 'shelter', name: 'إدارة الإيواء والتغذية' },
  { id: 'finance', name: 'المحاسبة والمالية والدليل' },
  { id: 'zatca', name: 'الربط الضريبي ZATCA Phase 2' },
  { id: 'hr', name: 'الموارد البشرية ومسير الرواتب' },
  { id: 'settings', name: 'إعدادات النظام والـ CMS' }
];

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [currentUserRole, setCurrentUserRole] = useState<'Administrator' | 'BranchSpecialist'>('Administrator');
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'security' | 'devops' | 'rbac' | 'gateways' | 'ai-insights'>('overview');
  const [sessions, setSessions] = useState<UserSession[]>([]);

  useEffect(() => {
    realErpDataStore.getRecords<UserSession>('system_users', MOCK_ACTIVE_SESSIONS).then(data => setSessions(data));
  }, []);

  // Feature Toggle States for 30 Admin Tools
  const [emergencyLockdown, setEmergencyLockdown] = useState(false);
  const [global2FAForced, setGlobal2FAForced] = useState(true);
  const [dataMaskingEnabled, setDataMaskingEnabled] = useState(true);
  const [ipRestricted, setIpRestricted] = useState(false);
  const [autoSessionTimeout, setAutoSessionTimeout] = useState('15');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);

  // Permission Matrix State
  const [permissionsState, setPermissionsState] = useState<Record<string, Record<string, boolean>>>({
    'crm': { admin: true, manager: true, staff: true, agent: false },
    'cvs': { admin: true, manager: true, staff: true, agent: true },
    'recruitment-contracts': { admin: true, manager: true, staff: false, agent: false },
    'finance': { admin: true, manager: true, staff: false, agent: false },
    'zatca': { admin: true, manager: false, staff: false, agent: false },
    'settings': { admin: true, manager: false, staff: false, agent: false }
  });

  const handleForceLogout = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    alert('تم إنهاء جلسة المستخدم وإخراجه فورياً من النظام لأسباب أمنية.');
  };

  const togglePermission = (moduleId: string, roleKey: string) => {
    setPermissionsState(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [roleKey]: !prev[moduleId]?.[roleKey]
      }
    }));
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage) return;
    alert(`تم بث الرسالة العاجلة بنجاح لجميع المستخدمين المتصلين الان: "${broadcastMessage}"`);
    setBroadcastMessage('');
    setShowBroadcastModal(false);
  };

  // Restrict access if user is not Administrator
  if (currentUserRole !== 'Administrator') {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'center', padding: '40px' }} className="table-card">
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: '#FEE2E2',
          color: '#DC2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '36px',
          margin: '0 auto 20px auto'
        }}>
          <i className="fa-solid fa-lock"></i>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#991B1B', marginBottom: '12px' }}>
          403 Access Denied - منطقة محظورة للآدمن فقط
        </h2>
        <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: '1.7', marginBottom: '24px' }}>
          عذراً، هذه اللوحة مخصصة حصرياً لمديري النظام (Super Administrators). حسابك الحالي ذو دور <strong>({currentUserRole})</strong> ولا يملك صلاحيات الوصول إلى 30 ميزة تحكم الآدمن.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn-odoo btn-odoo-primary" onClick={() => setCurrentUserRole('Administrator')}>
            <i className="fa-solid fa-user-shield ml-1"></i> التبديل لحساب الآدمن (اختبار)
          </button>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => onNavigate && onNavigate('dashboard', 'الرئيسية والمؤشرات')}>
            الرجوع للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Emergency Lockdown Notice Banner if active */}
      {emergencyLockdown && (
        <div style={{
          background: '#DC2626',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: '800'
        }}>
          <div>
            <i className="fa-solid fa-triangle-exclamation ml-2"></i>
            وضع الطوارئ الفوري مفعّل (Emergency Lockdown Active) - تم تجميد تسجيلات الدخول وتعيين النظام على القراءة فقط.
          </div>
          <button className="btn-odoo" style={{ background: '#FFFFFF', color: '#DC2626', fontWeight: '900', padding: '4px 12px' }} onClick={() => setEmergencyLockdown(false)}>
            إلغاء الإغلاق
          </button>
        </div>
      )}

      {/* Super Admin Top Command Banner */}
      <div
        className="card-feature-cinematic"
        style={{
          background: '#000000',
          borderRadius: '16px',
          padding: '28px',
          color: '#FFFFFF',
          marginBottom: '24px',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          border: '1px solid #27272a'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
                SUPER ADMIN CONTROLLER (30 ADVANCED FEATURES)
              </span>
              <span className="pill-tag-shade" style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', color: '#ffffff' }}>System SLA 99.98%</span>
            </div>
            <h2 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
              لوحة التحكم الشاملة ومحرك الـ 30 ميزة للآدمن (Super Admin Suite)
            </h2>
            <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '4px 0 0 0', fontWeight: 420 }}>
              مجموعة خالد السليم • مركز السيطرة الأمنية والمالية والربط الحكومي والذكاء الاصطناعي
            </p>
          </div>

          {/* Quick Admin Actions & Emergency Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className="button-aloe-pill"
              onClick={() => setShowBroadcastModal(true)}
              style={{ fontSize: '12.5px', padding: '6px 16px', minHeight: '38px' }}
            >
              <i className="fa-solid fa-bullhorn ml-1"></i> بث رسالة عاجلة
            </button>
            <button
              className="button-outline-on-dark"
              onClick={() => setShowBackupModal(true)}
              style={{ fontSize: '12.5px', padding: '6px 16px', minHeight: '38px' }}
            >
              <i className="fa-solid fa-database ml-1"></i> النسخ والاستعادة DB
            </button>
            <button
              className="button-outline-on-dark"
              onClick={() => setEmergencyLockdown(!emergencyLockdown)}
              style={{ fontSize: '12.5px', padding: '6px 16px', minHeight: '38px', borderColor: emergencyLockdown ? '#10b981' : '#ef4444', color: emergencyLockdown ? '#10b981' : '#f87171' }}
            >
              <i className="fa-solid fa-skull-crossbones ml-1"></i> {emergencyLockdown ? 'فك الطوارئ' : 'زر الطوارئ Lock'}
            </button>
            <button
              className="button-outline-on-dark"
              onClick={() => setCurrentUserRole('BranchSpecialist')}
              title="اختبار تجربة المستخدم العادي وتقييد الوصول"
              style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
            >
              تبديل لنواة موظف فرع
            </button>
          </div>
        </div>

        {/* Global Live Indicators Ribbon */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>إجمالي أصول ومقبوضات المجموعة</span>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#34D399' }}>5,820,470 ر.س</div>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>العقود السارية (توسط وتأجير)</span>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#60A5FA' }}>1,450 عقد نشط</div>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>المستخدمون المتصلون الآن</span>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#FBBF24' }}>{sessions.length} مستخدم نشط</div>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>الربط الضريبي والحكومي</span>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#A7F3D0' }}>ZATCA & Musaned OK</div>
          </div>
        </div>
      </div>

      {/* Main Admin Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          className={`btn-odoo ${activeAdminTab === 'overview' ? 'btn-odoo-purple' : 'btn-odoo-secondary'}`}
          onClick={() => setActiveAdminTab('overview')}
        >
          <i className="fa-solid fa-grid-2 ml-1"></i> دليل الـ 30 ميزة والرقابة
        </button>
        <button
          className={`btn-odoo ${activeAdminTab === 'security' ? 'btn-odoo-purple' : 'btn-odoo-secondary'}`}
          onClick={() => setActiveAdminTab('security')}
        >
          <i className="fa-solid fa-shield-halved ml-1"></i> للأمان وحظر الـ IP (1-6)
        </button>
        <button
          className={`btn-odoo ${activeAdminTab === 'devops' ? 'btn-odoo-purple' : 'btn-odoo-secondary'}`}
          onClick={() => setActiveAdminTab('devops')}
        >
          <i className="fa-solid fa-server ml-1"></i> الخوادم والنسخ الاحتياطي (7-12)
        </button>
        <button
          className={`btn-odoo ${activeAdminTab === 'rbac' ? 'btn-odoo-purple' : 'btn-odoo-secondary'}`}
          onClick={() => setActiveAdminTab('rbac')}
        >
          <i className="fa-solid fa-user-lock ml-1"></i> الصلاحيات وحماية الهوية (13-18)
        </button>
        <button
          className={`btn-odoo ${activeAdminTab === 'gateways' ? 'btn-odoo-purple' : 'btn-odoo-secondary'}`}
          onClick={() => setActiveAdminTab('gateways')}
        >
          <i className="fa-solid fa-network-wired ml-1"></i> الربط الحكومي والبنوك (19-24)
        </button>
        <button
          className={`btn-odoo ${activeAdminTab === 'ai-insights' ? 'btn-odoo-purple' : 'btn-odoo-secondary'}`}
          onClick={() => setActiveAdminTab('ai-insights')}
        >
          <i className="fa-solid fa-wand-magic-sparkles ml-1"></i> الذكاء الاصطناعي والبث (25-30)
        </button>
      </div>

      {/* Tab 1: 30 Features Master Grid Overview */}
      {activeAdminTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="table-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#000000', marginBottom: '16px' }}>
              <i className="fa-solid fa-list-check ml-2"></i> دليل ميزات الآدمن الإضافية 30 (Complete Admin Feature Matrix)
            </h3>
            <p style={{ fontSize: '13px', color: '#71717a', marginBottom: '20px' }}>
              لوحة التحكم توفر أدوات كاملة للمدير العام لإدارة وحماية المنظومة ERP:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {/* Feature Cards 1 to 30 */}
              <div style={{ background: '#fbfbf5', padding: '16px', borderRadius: '12px', borderRight: '4px solid #000000', border: '1px solid #e4e4e7' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: '#000000', display: 'block' }}>1. زر الطوارئ والإغلاق الفوري</span>
                <span style={{ fontSize: '12px', color: '#71717a' }}>تجميد الوصول للنظام فورياً عند أي تهجم سيبراني.</span>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', borderRight: '4px solid #714B67' }}>
                <span style={{ fontWeight: '800', fontSize: '14px', color: '#714B67', display: 'block' }}>2. مدير النسخ واستعادة البيانات DB</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>جدولة واسترجاع نسخ احتياطية كاملة SQL/JSON.</span>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', borderRight: '4px solid #F59E0B' }}>
                <span style={{ fontWeight: '800', fontSize: '14px', color: '#F59E0B', display: 'block' }}>3. كاشف التهديدات والأنشطة الغريبة</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>تنبيه تلقائي لمحاولات تسجيل الدخول الفاشلة المتكررة.</span>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', borderRight: '4px solid #10B981' }}>
                <span style={{ fontWeight: '800', fontSize: '14px', color: '#10B981', display: 'block' }}>4. جدار الحماية وحظر الـ IPs</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>قائمة بيضاء وحمراء لعناوين الإنترنت المسموح بدخولها.</span>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', borderRight: '4px solid #3B82F6' }}>
                <span style={{ fontWeight: '800', fontSize: '14px', color: '#3B82F6', display: 'block' }}>5. سجل تدقيق كلمة المرور الصارم Audit</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>تتبع تغييرات كلمات السر والتعديلات على الحسابات.</span>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', borderRight: '4px solid #8B5CF6' }}>
                <span style={{ fontWeight: '800', fontSize: '14px', color: '#8B5CF6', display: 'block' }}>6. مركز البث الإداري المباشر Broadcast</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>إرسال إشعارات نافذة عاجلة لجميع المستخدمين المتصلين.</span>
              </div>

              <div style={{ background: '#fbfbf5', padding: '16px', borderRadius: '12px', borderRight: '4px solid #000000', border: '1px solid #e4e4e7' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: '#000000', display: 'block' }}>7. مستكشف سجلات السيرفر الحي Tail Logs</span>
                <span style={{ fontSize: '12px', color: '#71717a' }}>قراءة وفلترة أخطاء الخادم وقواعد البيانات مباشرة.</span>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', borderRight: '4px solid #EF4444' }}>
                <span style={{ fontWeight: '800', fontSize: '14px', color: '#EF4444', display: 'block' }}>8. سياسة تعقيد وتغيير كلمة السر الدوري</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>إجبار تغيير رمز المرور كل 90 يوماً مع شروط أمان عالية.</span>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', borderRight: '4px solid #10B981' }}>
                <span style={{ fontWeight: '800', fontSize: '14px', color: '#10B981', display: 'block' }}>9. إغلاق الجلسة التلقائي عند الخمول</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>إنهاء الجلسة بعد 15 دقيقة من عدم النشاط.</span>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', borderRight: '4px solid #F59E0B' }}>
                <span style={{ fontWeight: '800', fontSize: '14px', color: '#F59E0B', display: 'block' }}>10. منشئ التقارير التنفيذية Custom Reports</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>تصميم تقارير مخصصة لمجلس الإدارة وأصحاب القرار.</span>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', borderRight: '4px solid #3B82F6' }}>
                <span style={{ fontWeight: '800', fontSize: '14px', color: '#3B82F6', display: 'block' }}>11. هيكلة الفروع ومراكز التكلفة المتقدمة</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ربط الفروع بمراكز التكلفة وميزانيات المبيعات.</span>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', borderRight: '4px solid #8B5CF6' }}>
                <span style={{ fontWeight: '800', fontSize: '14px', color: '#8B5CF6', display: 'block' }}>12. متتبع أداء الموظفين والمسوقين KPI</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>متابعة مبيعات وسرعة إنجاز كل موظف بالشركة.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Security, 2FA, IP Firewall & Audit Trail (Features 1-6) */}
      {activeAdminTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="table-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000000', marginBottom: '16px' }}>
              <i className="fa-solid fa-shield-halved ml-2"></i> أدوات الأمان وحظر الـ IP وجدار الحماية (Features 1 to 6)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div style={{ background: '#fbfbf5', padding: '16px', borderRadius: '12px', border: '1px solid #e4e4e7' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#000000' }}>4. تقييد الدخول بعناوين الـ IP المعتمدة (IP Whitelisting)</h4>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '12px' }}>
                  <input
                    type="checkbox"
                    checked={ipRestricted}
                    onChange={e => setIpRestricted(e.target.checked)}
                    style={{ accentColor: '#000000', width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '13px', fontWeight: '700' }}>تفعيل حظر الدخول من الخارج وقصر الدخول على شريحة IP الشركة</span>
                </label>
                <input type="text" className="filter-input" defaultValue="197.34.110.0/24, 185.12.90.0/24" placeholder="أدخل عناوين IP المسموحة..." />
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '12px' }}>9. مهلة تسجيل الخروج التلقائي عند الخمول</h4>
                <select className="filter-select" value={autoSessionTimeout} onChange={e => setAutoSessionTimeout(e.target.value)}>
                  <option value="5">5 دقائق</option>
                  <option value="15">15 دقيقة (الموصى به)</option>
                  <option value="30">30 دقيقة</option>
                  <option value="60">ساعة واحدة</option>
                </select>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  سيتم قفل الشاشة وإلزام إدخال كلمة المرور عند ترك الجهاز دون استخدام.
                </p>
              </div>
            </div>

            <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '12px' }}>الجلسات الفعالة ومراقبة المستخدمين لحظياً</h4>
            <table className="odoo-data-table">
              <thead>
                <tr>
                  <th>المستخدم والدور</th>
                  <th>عنوان الـ IP</th>
                  <th>الجهاز والمتصفح</th>
                  <th>وقت التسجيل</th>
                  <th>حالة 2FA</th>
                  <th>الإجراءات الأمنية</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: '700' }}>
                      {s.name}
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>@{s.username} • {s.role}</div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontWeight: '700' }}>{s.ip_address}</td>
                    <td style={{ fontSize: '12px' }}>{s.device}</td>
                    <td style={{ fontSize: '12px' }}>{s.login_time}</td>
                    <td><Badge text={s.two_factor_status} type="success" icon="fa-solid fa-key" /></td>
                    <td>
                      <button className="btn-odoo btn-odoo-danger" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleForceLogout(s.id)}>
                        إنهاء الجلسة فوراً
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: DevOps, Server Logs & DB Backups (Features 7-12) */}
      {activeAdminTab === 'devops' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="table-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000000', marginBottom: '16px' }}>
              <i className="fa-solid fa-server ml-2"></i> إدارة DevOps والنسخ الاحتياطي وسجلات السيرفر (Features 7 to 12)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: '#fbfbf5', padding: '16px', borderRadius: '12px', border: '1px solid #e4e4e7' }}>
                <span style={{ fontSize: '12px', color: '#71717a', fontWeight: 600 }}>حجم قاعدة البيانات الحالية</span>
                <div style={{ fontSize: '22px', fontWeight: 330, color: '#000000', marginTop: '4px' }}>1.42 GB</div>
                <span style={{ fontSize: '11px', color: '#10B981' }}>آخر نسخة: اليوم 03:00 ص</span>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>مساحة التخزين السحابي (S3 Document Vault)</span>
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#3B82F6', marginTop: '4px' }}>48.6 GB / 500 GB</div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>مستندات وجوازات مفحوصة</span>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>نسبة النجاح للـ Cache (Redis Hit Ratio)</span>
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#10B981', marginTop: '4px' }}>96.4%</div>
                <span style={{ fontSize: '11px', color: '#10B981' }}>استجابة فائقة السرعة</span>
              </div>
            </div>

            <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '12px' }}>7. مستكشف سجلات السيرفر المباشر (Real-Time Tail Logs)</h4>
            <div style={{ background: '#0F172A', color: '#38BDF8', padding: '16px', borderRadius: '10px', fontFamily: 'monospace', fontSize: '12px', height: '160px', overflowY: 'auto' }}>
              <div>[2026-07-31 15:38:12] [INFO] system.auth: User 'admin' logged in from 197.34.110.42 (2FA TOTP Verified)</div>
              <div>[2026-07-31 15:38:15] [INFO] zatca.invoice: Signed bill #INV-Z-2026-002 Clearance successful CSID valid.</div>
              <div>[2026-07-31 15:38:22] [INFO] musaned.sync: Fetched 18 new delegations from Musaned API Gateway.</div>
              <div>[2026-07-31 15:38:40] [INFO] db.backup: Incremental snapshot completed successfully (Size 12.4 MB).</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: RBAC Matrix & Data Protection (Features 13-18) */}
      {activeAdminTab === 'rbac' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="table-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000000', marginBottom: '16px' }}>
              <i className="fa-solid fa-user-lock ml-2"></i> مصفوفة الصلاحيات وحجب البيانات الحساسة (Features 13 to 18)
            </h3>

            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '16px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1E40AF' }}>29. حجب البيانات الحساسة SAIF Masking</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#1E3A8A' }}>تشفير وحجب أرقام الهويات والجوازات عن الموظفين غير المصرح لهم بأمر الإدارة.</p>
              </div>
              <button
                className={`btn-odoo ${dataMaskingEnabled ? 'btn-odoo-success' : 'btn-odoo-secondary'}`}
                onClick={() => setDataMaskingEnabled(!dataMaskingEnabled)}
              >
                {dataMaskingEnabled ? 'الحجب مفعّل' : 'تعطيل الحجب'}
              </button>
            </div>

            <table className="odoo-data-table">
              <thead>
                <tr>
                  <th>القسم والوحدة المودل</th>
                  <th style={{ textAlign: 'center' }}>الآدمن (Super Admin)</th>
                  <th style={{ textAlign: 'center' }}>مدير القسم (Manager)</th>
                  <th style={{ textAlign: 'center' }}>موظف فرع (Staff)</th>
                  <th style={{ textAlign: 'center' }}>وكيل خارجي (Agency)</th>
                </tr>
              </thead>
              <tbody>
                {MODULE_PERMISSIONS.map(m => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: '800' }}>{m.name}</td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={!!permissionsState[m.id]?.admin}
                        onChange={() => togglePermission(m.id, 'admin')}
                        style={{ accentColor: '#000000', width: '18px', height: '18px' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={!!permissionsState[m.id]?.manager}
                        onChange={() => togglePermission(m.id, 'manager')}
                        style={{ accentColor: '#000000', width: '18px', height: '18px' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={!!permissionsState[m.id]?.staff}
                        onChange={() => togglePermission(m.id, 'staff')}
                        style={{ accentColor: '#000000', width: '18px', height: '18px' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={!!permissionsState[m.id]?.agent}
                        onChange={() => togglePermission(m.id, 'agent')}
                        style={{ accentColor: '#000000', width: '18px', height: '18px' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Government, Bank & API Gateways (Features 19-24) */}
      {activeAdminTab === 'gateways' && (
        <div className="table-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000000', marginBottom: '20px' }}>
            <i className="fa-solid fa-network-wired ml-2"></i> حالة الربط الحكومي، البنوك، وبوابات الرسائل (Features 19 to 24)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', borderRight: '4px solid #10B981' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>رصيد بوابة الـ SMS الرسمية</span>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#10B981', marginTop: '4px' }}>42,500 رسالة</div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>مزود الخدمة: Unifonic / Mobily</span>
            </div>

            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', borderRight: '4px solid #3B82F6' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>حالة الربط المصرفي (بنك الرياض B2B)</span>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#3B82F6', marginTop: '4px' }}>متصل ومفعل</div>
              <span style={{ fontSize: '11px', color: '#10B981' }}>الرواتب والتحويلات المباشرة</span>
            </div>
          </div>

          <table className="odoo-data-table">
            <thead>
              <tr>
                <th>البوابة / المنصة الحكومية</th>
                <th>طبيعة الخدمة والربط</th>
                <th>تاريخ صلاحية الشهادة CSID</th>
                <th>الحالة التشغيلية</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: '800' }}>15. هيئة الزكاة ZATCA Phase 2</td>
                <td>فواتير الفلترة Clearance</td>
                <td>صالحة حتى 2028-12-31</td>
                <td><Badge text="متصل وجاهز" type="success" /></td>
                <td><button className="btn-odoo btn-odoo-secondary" style={{ padding: '2px 8px', fontSize: '11px' }}>تحديث الشهادة CSID</button></td>
              </tr>
              <tr>
                <td style={{ fontWeight: '800' }}>16. منصة مساند توثيق وحقود</td>
                <td>استعلام عقود وتأشيرات</td>
                <td>ارتباط مباشر (Webhook)</td>
                <td><Badge text="متصل وجاهز" type="success" /></td>
                <td><button className="btn-odoo btn-odoo-secondary" style={{ padding: '2px 8px', fontSize: '11px' }}>مزامنة فورية</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 6: AI Executive Insights, Broadcast & Subsidiaries (Features 25-30) */}
      {activeAdminTab === 'ai-insights' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="table-card" style={{ padding: '24px', background: '#fbfbf5', border: '1px solid #e4e4e7' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#000000', marginBottom: '12px' }}>
              <i className="fa-solid fa-wand-magic-sparkles ml-2"></i> 20. مساعد الذكاء الاصطناعي للإدارة العليا (AI Executive Assistant)
            </h3>
            <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: '1.7', marginBottom: '16px' }}>
              تحليل توقعات الإيرادات والنمو الربع سنوي لمجموعة خالد السليم استناداً لبيانات عقود الاستقدام والتأجير:
            </p>

            <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #CBD5E1', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>💡 توصيات الذكاء الاصطناعي التشغيلية:</h4>
              <ul style={{ margin: 0, paddingRight: '20px', fontSize: '13px', color: '#475569', lineHeight: '1.8' }}>
                <li>ارتفاع الطلب على العمالة المنزلية الإثيوبية بنسبة +34% خلال الشهر القادم. يُنصح بزيادة التفاويض الخارجية لمكتب DAMAS.</li>
                <li>مؤشر سرعة إنجاز تفاويض إنجاز تسجل معدل قياسي (3.2 يوم).</li>
                <li>تنبيه: يوجد 7 عقود تأجير تحتاج تمديد خلال الأيام الـ 5 القادمة.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="table-card" style={{ width: '500px', padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px' }}>بث إشعار عاجل لجميع المستخدمين المتصلين</h3>
            <form onSubmit={handleSendBroadcast}>
              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label className="filter-label">نص الرسالة العاجلة *</label>
                <textarea className="filter-input" rows={4} value={broadcastMessage} onChange={e => setBroadcastMessage(e.target.value)} placeholder="مثال: يرجى العلم بوجود تحديث مجدول لسيرفرات النظام الساعة 12 منتصف الليل..." required />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-odoo btn-odoo-secondary" onClick={() => setShowBroadcastModal(false)}>إلغاء</button>
                <button type="submit" className="btn-odoo btn-odoo-purple">إرسال وبث الإشعار الان</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Backup Modal */}
      {showBackupModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="table-card" style={{ width: '520px', padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px' }}>إدارة النسخ الاحتياطي واستعادة البيانات (Backup Manager)</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              إنشاء وتنزيل نسخة شاسعة لقاعدة البيانات وحفظها بالسحابة آمنة.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <button className="btn-odoo btn-odoo-primary" onClick={() => { alert('تم بدء إنشاء النسخة الاحتياطية وتنزيل الملف DB_ALSALIM_2026.sql'); setShowBackupModal(false); }}>
                <i className="fa-solid fa-download ml-1"></i> إنشاء وتنزيل النسخة الحالية (.SQL)
              </button>
              <button className="btn-odoo btn-odoo-secondary" onClick={() => { alert('تم جدولة النسخ التلقائي اليومي الساعة 03:00 ص'); setShowBackupModal(false); }}>
                جدولة النسخ التلقائي اليومي
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-odoo btn-odoo-secondary" onClick={() => setShowBackupModal(false)}>إغلاق</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
