import React from 'react';
import {
  LayoutDashboard,
  UserPlus,
  Bed,
  Utensils,
  Stethoscope,
  HeartHandshake,
  PlaneTakeoff,
  MapPin,
  FileCheck2,
  Hotel,
  Building2,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles
} from 'lucide-react';

export type ShelterDepartmentId =
  | 'dashboard'
  | 'checkin'
  | 'rooms'
  | 'catering'
  | 'clinic'
  | 'welfare'
  | 'deportation'
  | 'branches'
  | 'compliance';

export interface ShelterSidebarStats {
  totalInmates: number;
  insideCount: number;
  availableBeds: number;
  cateringToday: number;
  medicalQuarantine: number;
  deportationCount: number;
  availableTransfer: number;
}

interface ShelterNavigationSidebarProps {
  activeDepartment: ShelterDepartmentId;
  onSelectDepartment: (dept: ShelterDepartmentId) => void;
  stats: ShelterSidebarStats;
  selectedBranch: string;
  onSelectBranch: (branch: string) => void;
  onReturnToErp?: () => void;
  onOpenCheckinModal?: () => void;
}

export const SHELTER_DEPARTMENTS: Array<{
  id: ShelterDepartmentId;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badgeKey?: keyof ShelterSidebarStats;
  badgeType?: 'primary' | 'warning' | 'danger' | 'success' | 'info';
}> = [
  {
    id: 'dashboard',
    title: '1. مركز القيادة والمؤشرات الحية',
    subtitle: 'نسب الإشغال والتحكم الميداني',
    icon: LayoutDashboard,
  },
  {
    id: 'checkin',
    title: '2. الاستقبال والتسكين المباشر',
    subtitle: 'تسجيل الوصول والفرز والأمتعة',
    icon: UserPlus,
    badgeKey: 'insideCount',
    badgeType: 'success',
  },
  {
    id: 'rooms',
    title: '3. إدارة الغرف وتوزيع الأسرة',
    subtitle: 'مخطط المهاجع والأجنحة والتعقيم',
    icon: Bed,
    badgeKey: 'availableBeds',
    badgeType: 'info',
  },
  {
    id: 'catering',
    title: '4. الإعاشة والتموين والوجبات',
    subtitle: 'سجل الوجبات الثلاث والمتعهدين',
    icon: Utensils,
    badgeKey: 'cateringToday',
    badgeType: 'warning',
  },
  {
    id: 'clinic',
    title: '5. العيادة والرعاية الصحية',
    subtitle: 'الفحص المخبري وجناح العزل',
    icon: Stethoscope,
    badgeKey: 'medicalQuarantine',
    badgeType: 'danger',
  },
  {
    id: 'welfare',
    title: '6. شؤون النزيلات والتنازل',
    subtitle: 'دراسة الرغبة بالعمل والوساطة',
    icon: HeartHandshake,
    badgeKey: 'availableTransfer',
    badgeType: 'primary',
  },
  {
    id: 'deportation',
    title: '7. الترحيل وتنسيق المطار',
    subtitle: 'الخروج النهائي وتذاكر السفر',
    icon: PlaneTakeoff,
    badgeKey: 'deportationCount',
    badgeType: 'danger',
  },
  {
    id: 'branches',
    title: '8. شبكة مراكز وفروع الإيواء',
    subtitle: 'الرياض، جدة، الدمام، المجمعة',
    icon: MapPin,
  },
  {
    id: 'compliance',
    title: '9. الامتثال والتفتيش (10 صيغ)',
    subtitle: 'كشوفات وزارة الموارد البشرية',
    icon: FileCheck2,
  },
];

export const SHELTER_BRANCHES = [
  { id: 'ALL', name: 'كافة مراكز وفروع الإيواء' },
  { id: 'RUH-MAIN', name: 'الرياض - المقر الرئيسي (حي الياسمين)' },
  { id: 'JED-AIRPORT', name: 'جدة - مركز ترانزيت المطار' },
  { id: 'DMM-EAST', name: 'الدمام - فرع المنطقة الشرقية' },
  { id: 'MAJ-SUD', name: 'المجمعة - فرع سدير' },
];

export const ShelterNavigationSidebar: React.FC<ShelterNavigationSidebarProps> = ({
  activeDepartment,
  onSelectDepartment,
  stats,
  selectedBranch,
  onSelectBranch,
  onReturnToErp,
  onOpenCheckinModal,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredDepts = React.useMemo(() => {
    if (!searchQuery.trim()) return SHELTER_DEPARTMENTS;
    const q = searchQuery.toLowerCase();
    return SHELTER_DEPARTMENTS.filter(
      (d) => d.title.toLowerCase().includes(q) || d.subtitle.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <aside className="w-72 bg-zinc-950 text-zinc-100 flex flex-col h-full border-l border-zinc-800 shrink-0 select-none shadow-2xl">
      {/* Header / Brand */}
      <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/50">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <Hotel className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>بوابة الإيواء والسكن</span>
                <span className="text-[9.5px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 font-mono font-normal">
                  HRSD
                </span>
              </div>
              <div className="text-[10px] text-zinc-400">مجموعة السليم المعتمدة</div>
            </div>
          </div>
        </div>

        {/* Branch Quick Switcher */}
        <div className="mt-3">
          <label className="block text-[10px] font-semibold text-zinc-400 mb-1 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-emerald-400" />
            <span>الفرع النشط:</span>
          </label>
          <select
            value={selectedBranch}
            onChange={(e) => onSelectBranch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg py-1.5 px-2.5 text-[11px] text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
          >
            {SHELTER_BRANCHES.map((b) => (
              <option key={b.id} value={b.id} className="bg-zinc-900 text-white">
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search inside Shelter departments */}
        <div className="relative mt-2.5">
          <Search className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="بحث في أقسام الإيواء..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-full py-1 pr-7 pl-2 text-[11px] text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Quick Action Button */}
      {onOpenCheckinModal && (
        <div className="px-3 pt-3">
          <button
            type="button"
            onClick={onOpenCheckinModal}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ تسكين نزيلة جديدة الآن</span>
          </button>
        </div>
      )}

      {/* Navigation Departments */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1 custom-scrollbar">
        <div className="text-[10px] font-bold text-zinc-400 px-2 py-1 uppercase tracking-wider">
          أقسام منظومة الإيواء (9 أقسام)
        </div>

        {filteredDepts.map((dept) => {
          const Icon = dept.icon;
          const isActive = activeDepartment === dept.id;
          const badgeValue = dept.badgeKey ? stats[dept.badgeKey] : undefined;

          return (
            <button
              key={dept.id}
              type="button"
              onClick={() => onSelectDepartment(dept.id)}
              className={`w-full text-right flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                isActive
                  ? 'bg-zinc-800/90 text-white shadow-md border-r-4 border-emerald-400 font-bold'
                  : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-zinc-900 text-zinc-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate text-right">
                  <div className="truncate font-semibold">{dept.title}</div>
                  <div className="text-[10px] text-zinc-400 truncate">{dept.subtitle}</div>
                </div>
              </div>

              {/* Badge */}
              {badgeValue !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full shrink-0 font-bold ${
                    dept.badgeType === 'danger'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : dept.badgeType === 'warning'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : dept.badgeType === 'info'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : dept.badgeType === 'success'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  {badgeValue}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Controls */}
      <div className="p-3 bg-zinc-900/90 border-t border-zinc-800 space-y-2 text-[11px]">
        {/* Compliance / Emergency pill */}
        <div className="p-2 rounded-lg bg-zinc-950/80 border border-zinc-800 flex items-center justify-between text-zinc-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10.5px]">رقم طوارئ الإيواء</span>
          </div>
          <span className="font-mono text-zinc-300 font-bold">9200-SHELTER</span>
        </div>

        {/* Return to General ERP Button */}
        {onReturnToErp && (
          <button
            type="button"
            onClick={onReturnToErp}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold transition-colors"
          >
            <span>العودة إلى الـ ERP العام</span>
            <ArrowRight className="w-3 h-3 text-zinc-400" />
          </button>
        )}
      </div>
    </aside>
  );
};
