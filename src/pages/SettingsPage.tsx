import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { realErpDataStore } from '../services/realErpDataStore';
import { useAppStore } from '../stores/appStore';
import { 
  Sliders, Fingerprint, Shield, Building2, Phone, Image, Link, 
  Key, Search, MessageSquare, FileText, Check, Save, ExternalLink
} from 'lucide-react';

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
    { id: 'security-2fa', name: 'أمان المصادقة والبصمة البيومترية', icon: Fingerprint },
    { id: 'rbac-matrix', name: 'مصفوفة الصلاحيات (RBAC Matrix)', icon: Shield },
    { id: 'general', name: 'البيانات الأساسية', icon: Building2 },
    { id: 'contacts', name: 'روابط التواصل والموقع', icon: Phone },
    { id: 'media', name: 'الهوية والوسائط والشعار', icon: Image },
    { id: 'quick-links', name: 'إدارة الروابط السريعة (Quick Links)', icon: Link },
    { id: 'login-config', name: 'تسجيل دخول الموقع الخارجي', icon: Key },
    { id: 'seo', name: 'إعدادات SEO & Tags', icon: Search },
    { id: 'zoho', name: 'إعدادات Zoho SalesIQ Live Chat', icon: MessageSquare },
    { id: 'stipulations', name: 'السياسات والشروط والضمان', icon: FileText }
  ];

  const handleSaveSettings = async () => {
    await realErpDataStore.addRecord('system_settings', {
      id: String(Date.now()),
      setting_key: 'SECURITY_2FA_CONFIG',
      setting_value: JSON.stringify({ require2FAAdmin, allowOptional2FA, allowBiometrics, allowFaceId, otpExpiryMinutes }),
      description: 'إعدادات المصادقة الثنائية والبصمة البيومترية'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Feature Cinematic Banner */}
      <div
        className="card-feature-cinematic"
        style={{
          background: '#000000',
          borderRadius: '16px',
          padding: '28px',
          color: '#FFFFFF',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <Sliders className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="pill-tag-mint" style={{ fontSize: '11px' }}>SYSTEM SETTINGS & CMS</span>
                <span className="pill-tag-shade" style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', color: '#ffffff' }}>الأمان والهوية والربط</span>
              </div>
              <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
                إعدادات النظام ومحتوى المنصة والأمان
              </h1>
              <p className="text-xs text-zinc-400 mt-1 font-sans">
                ضبط سياسات أمان المصادقة الثنائية (2FA)، اسم المنصة، الروابط السريعة الحكومية، ونصوص البوابة
              </p>
            </div>
          </div>

          <button
            className="button-white-pill"
            onClick={handleSaveSettings}
            style={{ fontSize: '12px', padding: '6px 18px', minHeight: '38px' }}
          >
            <Save className="w-3.5 h-3.5 ml-1 text-black" />
            <span>حفظ جميع التعديلات</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Side Settings Navigation Menu */}
        <div className="card-pricing md:col-span-1" style={{ padding: '12px', borderRadius: '24px', background: '#ffffff', height: 'fit-content' }}>
          <div className="space-y-1">
            {SECTIONS.map((sec) => {
              const isActive = activeSection === sec.id;
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: isActive ? 550 : 420,
                    border: '1px solid',
                    borderColor: isActive ? '#000000' : 'transparent',
                    backgroundColor: isActive ? '#000000' : 'transparent',
                    color: isActive ? '#ffffff' : '#27272a',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.15s ease',
                    textAlign: 'right',
                  }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ opacity: isActive ? 1 : 0.6 }} />
                  <span className="truncate">{sec.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side Settings Form View */}
        <div className="card-pricing md:col-span-3" style={{ padding: '28px', borderRadius: '24px', background: '#ffffff' }}>
          {activeSection === 'security-2fa' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-black border-b border-zinc-100 pb-3 m-0">
                إعدادات أمان المصادقة الثنائية (Two-Factor Authentication 2FA Policy)
              </h3>
              <p className="text-xs text-zinc-500">
                تعديل وتحديد سياسات الأمان والحماية لحسابات مديري النظام والموظفين بالفروع.
              </p>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={require2FAAdmin}
                    onChange={e => setRequire2FAAdmin(e.target.checked)}
                    className="rounded text-black focus:ring-0 w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-xs text-black block">
                      إلزامية المصادقة الثنائية (2FA) لجميع المديرين والمشرفين (Admins Only)
                    </span>
                    <span className="text-[11px] text-zinc-500 block mt-0.5">
                      منع تسجيل الدخول لأي حساب إداري ذو صلاحيات واسعة دون إدخال رمز التحقق الثنائي (TOTP / SMS).
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowOptional2FA}
                    onChange={e => setAllowOptional2FA(e.target.checked)}
                    className="rounded text-black focus:ring-0 w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-xs text-black block">
                      السماح للموظفين بتفعيل الـ 2FA اختيارياً
                    </span>
                    <span className="text-[11px] text-zinc-500 block mt-0.5">
                      تمكين موظفي الفروع والمكاتب من اختيار وتفعيل تطبيق المصادقة (Google Authenticator) للحفاظ على أمان حساباتهم.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowBiometrics}
                    onChange={e => setAllowBiometrics(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-0 w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-xs text-emerald-900 block flex items-center gap-1">
                      <Fingerprint className="w-3.5 h-3.5" />
                      <span>تفعيل الدخول ببصمة الإصبع (Touch ID / Windows Hello / WebAuthn)</span>
                    </span>
                    <span className="text-[11px] text-emerald-700 block mt-0.5">
                      السماح للمستخدمين بالدخول الفوري المشفر للمنظومة عبر مستشعر البصمة الحيوي للأجهزة المعتمدة.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowFaceId}
                    onChange={e => setAllowFaceId(e.target.checked)}
                    className="rounded text-black focus:ring-0 w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-xs text-black block">
                      تفعيل الدخول ببصمة الوجه ثلاثية الأبعاد (Face ID)
                    </span>
                    <span className="text-[11px] text-zinc-500 block mt-0.5">
                      تمكين تقنية التعرف على الوجه وفحص الحيوية (Liveness Detection) لتسجيل الدخول السريع والآمن.
                    </span>
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">صلاحية رمز التحقق OTP بالدقائق</label>
                  <select className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black focus:border-black focus:outline-none" value={otpExpiryMinutes} onChange={e => setOtpExpiryMinutes(Number(e.target.value))}>
                    <option value={3}>3 دقائق</option>
                    <option value={5}>5 دقائق (مستحسن)</option>
                    <option value={10}>10 دقائق</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">وسيلة الإرسال الافتراضية للرموز</label>
                  <select className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black focus:border-black focus:outline-none" defaultValue="Google Authenticator">
                    <option>تطبيق Google Authenticator (TOTP)</option>
                    <option>رسالة SMS نصية قصيرة</option>
                    <option>إشعار عبر الواتساب الرسمي</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'rbac-matrix' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-black border-b border-zinc-100 pb-3 m-0">
                مصفوفة الصلاحيات والأدوار (Role-Based Access Control - RBAC Matrix)
              </h3>
              <p className="text-xs text-zinc-500">
                تحديد دقيق لصلاحيات القراءة، الإنشاء، التعديل، الحذف، والاعتماد المالي لكل دور وظيفي.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs text-zinc-700">
                  <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                    <tr>
                      <th className="p-3.5">الدور الوظيفي (Role)</th>
                      <th className="p-3.5 text-center">عرض</th>
                      <th className="p-3.5 text-center">إنشاء</th>
                      <th className="p-3.5 text-center">تعديل</th>
                      <th className="p-3.5 text-center">حذف</th>
                      <th className="p-3.5 text-center">اعتماد مالي</th>
                      <th className="p-3.5 text-center">تصدير</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {[
                      { role: 'مدير النظام العام (Super Admin)', r: true, c: true, e: true, d: true, a: true, x: true, locked: true },
                      { role: 'مدير الفرع (Branch Manager)', r: true, c: true, e: true, d: false, a: true, x: true, locked: false },
                      { role: 'المحاسب المالي (Senior Accountant)', r: true, c: true, e: true, d: false, a: true, x: true, locked: false },
                      { role: 'أخصائي الموارد البشرية (HR Specialist)', r: true, c: true, e: true, d: false, a: false, x: true, locked: false },
                      { role: 'مشرف مركز الإيواء (Shelter Supervisor)', r: true, c: true, e: true, d: false, a: false, x: false, locked: false },
                      { role: 'مسؤول المبيعات (Sales Agent)', r: true, c: true, e: false, d: false, a: false, x: false, locked: false },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-zinc-50">
                        <td className="p-3.5 font-bold text-black">{row.role}</td>
                        <td className="p-3.5 text-center"><input type="checkbox" defaultChecked={row.r} disabled={row.locked} className="rounded text-black focus:ring-0" /></td>
                        <td className="p-3.5 text-center"><input type="checkbox" defaultChecked={row.c} disabled={row.locked} className="rounded text-black focus:ring-0" /></td>
                        <td className="p-3.5 text-center"><input type="checkbox" defaultChecked={row.e} disabled={row.locked} className="rounded text-black focus:ring-0" /></td>
                        <td className="p-3.5 text-center"><input type="checkbox" defaultChecked={row.d} disabled={row.locked} className="rounded text-black focus:ring-0" /></td>
                        <td className="p-3.5 text-center"><input type="checkbox" defaultChecked={row.a} disabled={row.locked} className="rounded text-black focus:ring-0" /></td>
                        <td className="p-3.5 text-center"><input type="checkbox" defaultChecked={row.x} disabled={row.locked} className="rounded text-black focus:ring-0" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'general' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-black border-b border-zinc-100 pb-3 m-0">
                1. البيانات الأساسية واسم المنصة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">اسم الموقع بالعربية *</label>
                  <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none" defaultValue="مجموعة خالد السليم للاستقدام والتشغيل" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">اسم الموقع بالإنجليزية *</label>
                  <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none" defaultValue="MAJMOAT KHALID ALSALIM ERP" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">العنوان الوطني والرسمي *</label>
                  <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none" defaultValue="اليرموك، الرياض 13251، المملكة العربية السعودية" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">البريد الإلكتروني الرسمي</label>
                  <input type="email" className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none" defaultValue="info@alsalim-group.sa" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">رقم الهاتف الرئيسي</label>
                  <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none" defaultValue="+966594249640" />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'quick-links' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-black border-b border-zinc-100 pb-3 m-0">
                4. إعدادات الروابط السريعة (Quick Links Bar)
              </h3>
              <p className="text-xs text-zinc-500">
                الروابط الظاهرة في الشريط العلوي للانتقال المباشر للمنصات الحكومية والخدمية
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs text-zinc-700">
                  <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                    <tr>
                      <th className="p-3.5">اسم الرابط Quick Link</th>
                      <th className="p-3.5">الرابط المباشر URL</th>
                      <th className="p-3.5">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {[
                      { name: 'مساند برو', url: 'https://pros.musaned.com.sa/login' },
                      { name: 'مساند توثيق', url: 'https://tawtheeq.musaned.com.sa/' },
                      { name: 'اللايف شات (Zoho)', url: 'https://salesiq.zoho.sa/platinumeastern/liveview' },
                      { name: 'منصة إنجاز', url: 'https://visa.mofa.gov.sa/enjaz/getvisainformation/' },
                      { name: 'منصة تأشير', url: 'https://ksavisa.sa/' },
                    ].map((link, idx) => (
                      <tr key={idx} className="hover:bg-zinc-50">
                        <td className="p-3.5 font-bold text-black">{link.name}</td>
                        <td className="p-3.5 font-mono text-zinc-500 text-[11px]">{link.url}</td>
                        <td className="p-3.5"><Badge text="مفعل" type="success" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection !== 'security-2fa' && activeSection !== 'rbac-matrix' && activeSection !== 'general' && activeSection !== 'quick-links' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-black border-b border-zinc-100 pb-3 m-0">
                إعدادات {SECTIONS.find(s => s.id === activeSection)?.name}
              </h3>
              <p className="text-xs text-zinc-500">
                يتم إدارة وتحديث هذه المحددات بصورة مستمرة وتطبيقها على كامل الموقع والموديلات المرتبطة.
              </p>
              <div className="p-8 text-center bg-zinc-50 rounded-2xl border border-zinc-200">
                <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <span className="text-xs font-bold text-black block">الإعدادات محدثة ومتوافقة مع المعايير</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
