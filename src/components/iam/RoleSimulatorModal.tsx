import React, { useState } from 'react';
import { 
  X, ShieldAlert, CheckCircle2, Sliders, Building2, 
  MapPin, Layers, Lock, Shield, Sparkles, UserCheck, Eye
} from 'lucide-react';
import { useIamSession } from '../../contexts/IamSessionContext';
import { AccountType, DataScopeLevel, DataScopeName } from '../../types/iam';
import { useAppStore } from '../../stores/appStore';

interface RoleSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RoleOption {
  type: AccountType;
  title: string;
  scope: DataScopeLevel;
  scopeName: DataScopeName;
  badge: string;
  description: string;
  visibleSections: string[];
  restrictedSections: string[];
}

const ROLES: RoleOption[] = [
  {
    type: 'Group Super Admin',
    title: 'مدير عام المجموعة (Group Super Admin)',
    scope: 6,
    scopeName: 'Group',
    badge: 'صلاحيات مطلقة (Full Access)',
    description: 'تحكم كامل في كافة شركات وفروع المجموعة، مصفوفة الصلاحيات، القيود المالية، والإعدادات الأمنية.',
    visibleSections: ['كافة الشاشات (54 شاشة)', 'الربط الحكومي والمالي', 'إدارة الهوية والصلاحيات IAM'],
    restrictedSections: ['لا توجد قيود'],
  },
  {
    type: 'Board / Group Executive',
    title: 'عضو مجلس الإدارة / الإدارة العليا (Executive)',
    scope: 6,
    scopeName: 'Group',
    badge: 'استعراض ورقابة شاملة (Level 6)',
    description: 'رؤية موحدة وتقارير استراتيجية لكافة فروع وشركات المجموعة الأربع بدون صلاحيات تعديل تشغيلية.',
    visibleSections: ['مركز القيادة الموحد', 'التقارير التحليلية المجمعة', 'لوحات المتابعة الإدارية'],
    restrictedSections: ['التعديل والحذف والترحيل المالي'],
  },
  {
    type: 'Company Admin',
    title: 'المدير التنفيذي للشركة (Company Admin)',
    scope: 5,
    scopeName: 'Company',
    badge: 'كامل الشركة (Level 5)',
    description: 'إدارة تشغيلية ومالية كاملة لفروع الشركة النشطة فقط مع عزل تام عن الشركات الأخرى في المجموعة.',
    visibleSections: ['عقود الاستقدام', 'التأجير والتشغيل', 'العملاء والفوترة', 'فروع الشركة'],
    restrictedSections: ['شركات المجموعة الأخرى', 'إعدادات المنظومة الجذرية'],
  },
  {
    type: 'Branch Manager',
    title: 'مدير الفرع الإقليمي (Branch Manager)',
    scope: 4,
    scopeName: 'Branch',
    badge: 'نطاق الفرع (Level 4)',
    description: 'إدارة عمليات وعقود وفريق الفرع المحدد فقط، مع منع الوصول إلى بيانات الفروع الأخرى أو الإدارة العامة.',
    visibleSections: ['عقود فرع الرياض/جدة', 'طلبات الفرع', 'سندات وعمليات الفرع'],
    restrictedSections: ['الفروع الأخرى', 'التقارير المجمعة', 'إعدادات الحسابات العامة'],
  },
  {
    type: 'Department Manager',
    title: 'مدير القسم (Department Manager)',
    scope: 3,
    scopeName: 'Department',
    badge: 'نطاق القسم (Level 3)',
    description: 'إدارة واعتماد معاملات القسم المصرح به (مثل الموارد البشرية أو الإيواء أو التأجير).',
    visibleSections: ['معاملات القسم', 'طلبات وموظفي القسم', 'التقارير الخاصة بالقسم'],
    restrictedSections: ['أقسام الشركة الأخرى', 'القيود المحاسبية العامة'],
  },
  {
    type: 'Employee',
    title: 'موظف تشغيلي / أخصائي (Employee)',
    scope: 1,
    scopeName: 'Own',
    badge: 'شخصي فقط (Level 1)',
    description: 'الوصول محصور تماماً في السجلات والمعاملات المسندة للموظف مباشرة (Deny by Default).',
    visibleSections: ['المعاملات المسندة له', 'المهام اليومية الشخصية'],
    restrictedSections: ['سجلات باقي الزملاء', 'الفروع الأخرى', 'التقارير والإعدادات'],
  },
  {
    type: 'Auditor',
    title: 'مدقق داخلي ورقابي (Auditor)',
    scope: 5,
    scopeName: 'Company',
    badge: 'تدقيق وقراءة فقط (Read-Only)',
    description: 'استعراض وتدقيق السجلات والعمليات وسجلات التدقيق وسحابة اعتماد بدون إمكانية التعديل.',
    visibleSections: ['سجلات التدقيق الأمني', 'القيود المحاسبية', 'تقارير الامتثال والزكاة'],
    restrictedSections: ['الإنشاء والتعديل والحذف والاعتماد'],
  },
];

export const RoleSimulatorModal: React.FC<RoleSimulatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addNotification } = useAppStore();
  const { 
    currentUser, 
    activeCompany, 
    dataScope, 
    simulateRole, 
    switchCompany,
    allowedCompanyIds
  } = useIamSession();

  const [selectedRole, setSelectedRole] = useState<AccountType>(currentUser?.accountType || 'Group Super Admin');
  const [selectedCompanyCode, setSelectedCompanyCode] = useState<string>(activeCompany?.code || 'SAF');

  if (!isOpen) return null;

  const currentRoleConfig = ROLES.find(r => r.type === selectedRole) || ROLES[0];

  const handleApply = async () => {
    // 1. Switch company if changed
    if (selectedCompanyCode !== activeCompany?.code) {
      await switchCompany(selectedCompanyCode);
    }

    // 2. Simulate role & permissions
    simulateRole(selectedRole, currentRoleConfig.scope);

    addNotification({
      title: 'تطبيق المحاكاة الأمنية (IAM Live Simulation)',
      message: `تم تطبيق دور [${currentRoleConfig.title}] بنطاق بيانات [Level ${currentRoleConfig.scope} - ${currentRoleConfig.scopeName}] بنجاح.`,
      type: 'success',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[350] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div 
        className="bg-white rounded-3xl border border-zinc-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-6 bg-black text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400 border border-white/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white m-0 flex items-center gap-2">
                محاكي الأدوار والصلاحيات الحية (IAM Live Role Simulator)
              </h3>
              <p className="text-xs text-zinc-400 m-0 mt-0.5">
                اختبر تجربة تكيّف القوائم والشاشات ونطاقات البيانات لكل دور وظيفي لحظياً
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Company Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-black flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>الكيان المؤسسي النشط للعملية:</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { code: 'SAF', name: 'الصفا الماسي (SAF)' },
                { code: 'YAQ', name: 'الياقوت الشرقية (YAQ)' },
                { code: 'TOP', name: 'توب تالنت (TOP)' },
                { code: 'KAS', name: 'كاس واعتماد (KAS)' },
              ].map(c => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setSelectedCompanyCode(c.code)}
                  className={`p-2.5 rounded-2xl border text-xs font-bold transition-all text-center ${
                    selectedCompanyCode === c.code 
                      ? 'bg-black text-white border-black shadow-sm' 
                      : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Role Cards */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-black flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>اختر الدور الوظيفي لمحاكاته واختبار قيوده:</span>
            </label>
            <div className="space-y-2.5">
              {ROLES.map((role) => {
                const isSelected = selectedRole === role.type;
                return (
                  <div
                    key={role.type}
                    onClick={() => setSelectedRole(role.type)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-xs' 
                        : 'border-zinc-200 bg-white hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-zinc-300 bg-white'
                        }`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                        </span>
                        <h4 className="text-xs font-bold text-black m-0">{role.title}</h4>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-mono">
                        {role.badge}
                      </span>
                    </div>

                    <p className="text-[11.5px] text-zinc-600 m-0 mr-6 leading-relaxed">
                      {role.description}
                    </p>

                    {isSelected && (
                      <div className="mt-3 pt-2.5 border-t border-emerald-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] mr-6">
                        <div className="p-2 rounded-xl bg-white border border-emerald-200 text-emerald-900">
                          <strong className="block mb-0.5 text-emerald-800">الشاشات المتاحة:</strong>
                          <span>{role.visibleSections.join(' • ')}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white border border-rose-200 text-rose-900">
                          <strong className="block mb-0.5 text-rose-800">القيود والمحجوب (Deny):</strong>
                          <span>{role.restrictedSections.join(' • ')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between flex-shrink-0">
          <div className="text-xs text-zinc-500">
            النطاق المطبق: <strong className="text-black font-sans">Level {currentRoleConfig.scope} ({currentRoleConfig.scopeName})</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="button-outline-on-light"
              style={{ fontSize: '12px', padding: '6px 16px' }}
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="button-black-pill"
              style={{ fontSize: '12px', padding: '6px 22px' }}
            >
              <CheckCircle2 className="w-4 h-4 ml-1" />
              <span>تطبيق المحاكاة فوراً</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
