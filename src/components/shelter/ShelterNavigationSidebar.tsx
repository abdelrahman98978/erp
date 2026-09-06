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
    <aside 
      className="w-72 bg-[#121619] text-zinc-200 border-l border-white/10 flex flex-col h-full select-none shrink-0 shadow-2xl overflow-hidden font-sans"
      dir="rtl"
    >
      {/* Brand & Entity Header */}
      <div className="p-4 border-b border-white/10 bg-[#171c20]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center font-black text-base shadow-lg shadow-amber-500/20 shrink-0">
            <Hotel className="w-5 h-5 text-black" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                منظومة معزولة
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">HRSD</span>
            </div>
            <h2 className="text-sm font-bold text-white truncate m-0 mt-0.5">
              بوابة مراكز الإيواء والتسكين
            </h2>
            <p className="text-[10px] text-zinc-400 truncate m-0 font-sans">
              مجموعة خالد السليم — الرعاية الفندقية والفرز الطبي
            </p>
          </div>
        </div>

        {/* Branch Quick Switcher */}
        <div className="mt-3">
          <label className="text-[10.5px] font-bold text-zinc-400 block mb-1 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-amber-400" />
            <span>نطاق فرع الإيواء النشط:</span>
          </label>
          <select
            value={selectedBranch}
            onChange={(e) => onSelectBranch(e.target.value)}
            className="w-full bg-black/60 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-amber-400 cursor-pointer font-sans"
          >
            {SHELTER_BRANCHES.map((b) => (
              <option key={b.id} value={b.id} className="bg-[#171c20] text-white">
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search inside Shelter departments */}
        <div className="relative mt-2.5">
          <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="بحث في أقسام الإيواء..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/60 border border-white/15 rounded-xl py-1.5 pr-8 pl-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-sans"
          />
        </div>
      </div>

      {/* Quick Action Button */}
      {onOpenCheckinModal && (
        <div className="px-3 pt-3">
          <button
            type="button"
            onClick={onOpenCheckinModal}
            className="w-full bg-amber-400 hover:bg-amber-300 text-black rounded-xl py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ تسكين نزيلة جديدة الآن</span>
          </button>
        </div>
      )}

      {/* 9 Specialized Departments Navigation List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
        <div className="px-2 py-1 text-[10.5px] font-bold text-zinc-400 uppercase tracking-wider">
          أقسام منظومة الإيواء المستقلة (9 أقسام):
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
              className={`w-full text-right p-2.5 rounded-xl transition-all duration-150 flex items-start gap-3 relative group cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-l from-amber-500/20 to-amber-500/5 text-white border border-amber-500/40 shadow-md shadow-amber-900/10'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <div 
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isActive 
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-500/30 font-bold' 
                    : 'bg-white/5 text-zinc-400 group-hover:text-white group-hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-xs font-bold truncate ${isActive ? 'text-amber-300' : 'text-zinc-200'}`}>
                    {dept.title}
                  </span>
                  {badgeValue !== undefined && (
                    <span
                      className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
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
                </div>
                <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5 leading-tight m-0">
                  {dept.subtitle}
                </p>
              </div>

              {isActive && (
                <div className="absolute right-0 top-2 bottom-2 w-1 bg-amber-400 rounded-l-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer: Emergency Hotline & Return to Central ERP */}
      <div className="p-3 border-t border-white/10 bg-[#171c20] space-y-2">
        <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-[10.5px] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-bold">رقم طوارئ الإيواء: 9200-SHELTER</span>
          </div>
          <span className="text-zinc-400 text-[9.5px] font-mono">HRSD</span>
        </div>

        {onReturnToErp && (
          <button
            type="button"
            onClick={onReturnToErp}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            <span>العودة لمنظومة المجموعة الرئيسية (ERP)</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default ShelterNavigationSidebar;
