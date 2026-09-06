import React, { useState, useMemo } from 'react';
import { 
  WorkerProfile, 
  GROUP_COMPANIES,
  GROUP_OFFICES,
  GroupOfficeId
} from '../../types/shelterTransferSuite';
import { 
  Search, 
  Sparkles, 
  UserCheck, 
  Building2, 
  DollarSign, 
  Award, 
  Languages, 
  History,
  FileText
} from 'lucide-react';

interface AvailableWorkersCatalogProps {
  workers: WorkerProfile[];
  onBookTransfer: (worker: WorkerProfile) => void;
  onViewProfile: (worker: WorkerProfile) => void;
  onRefresh?: () => void;
}

export const AvailableWorkersCatalog: React.FC<AvailableWorkersCatalogProps> = ({
  workers,
  onBookTransfer,
  onViewProfile,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOffice, setSelectedOffice] = useState<string>('all');
  const [selectedNationality, setSelectedNationality] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [trialsFilter, setTrialsFilter] = useState<'all' | 'zero' | 'one_plus'>('all');

  // Filter available workers
  const availableWorkers = useMemo(() => {
    return workers.filter(w => {
      // Must be available for transfer
      if (w.operationalStatus !== 'متاحة لنقل الخدمات') return false;

      // Office filter
      if (selectedOffice !== 'all' && w.originalOfficeId !== selectedOffice) {
        return false;
      }

      // Nationality filter
      if (selectedNationality !== 'all' && w.nationality !== selectedNationality) {
        return false;
      }

      // Skill filter
      if (selectedSkill !== 'all' && !w.skills.some(s => s.toLowerCase().includes(selectedSkill.toLowerCase()))) {
        return false;
      }

      // Previous trials count
      if (trialsFilter === 'zero' && w.clientTrialsCount > 0) return false;
      if (trialsFilter === 'one_plus' && w.clientTrialsCount === 0) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (w.fullNameAr || '').toLowerCase().includes(q) || (w.fullNameEn || '').toLowerCase().includes(q);
        const matchesPassport = (w.passportNumber || '').toLowerCase().includes(q);
        const matchesNationality = (w.nationality || '').toLowerCase().includes(q);
        const matchesSkill = (w.skills || []).some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesPassport && !matchesNationality && !matchesSkill) {
          return false;
        }
      }

      return true;
    });
  }, [workers, selectedOffice, selectedNationality, selectedSkill, trialsFilter, searchQuery]);

  // Extract unique nationalities
  const nationalities = useMemo(() => {
    const set = new Set<string>();
    workers.forEach(w => {
      if (w.nationality) set.add(w.nationality);
    });
    return Array.from(set);
  }, [workers]);

  const allSkills = ['طبخ خليجي', 'رعاية أطفال', 'رعاية كبار السن', 'تنظيف شامل', 'غسيل وكوي', 'إدارة منزل'];

  // Helper for office badge
  const getOfficeBadge = (officeId: GroupOfficeId) => {
    const comp = GROUP_OFFICES[officeId];
    if (!comp) return { name: officeId, color: '#3b82f6', bg: '#eff6ff' };
    return { name: comp.name, color: comp.primaryColor, bg: `${comp.primaryColor}15` };
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls Bar */}
      <div className="bg-white rounded-3xl border border-zinc-200/90 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xl font-bold text-zinc-900 tracking-tight font-display">
                كتالوج العاملات المتاحة لنقل الخدمات المباشر
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300/50">
                {availableWorkers.length} عاملة جاهزة
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              عاملات مدربات، مفحوصات طبياً ومؤهلات للنقل الفوري والتجربة عبر مكاتب المجموعة الأربعة
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition-all"
              >
                تحديث الكتالوج
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-zinc-100">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute right-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالاسم، الجواز، المهارة..."
              className="w-full pr-9 pl-3 py-2 rounded-xl text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Original Office Filter */}
          <div>
            <select
              value={selectedOffice}
              onChange={(e) => setSelectedOffice(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-700 font-medium"
            >
              <option value="all">كافة المكاتب الأصلية (المجموعة)</option>
              {GROUP_COMPANIES.map((c: any) => (
                <option key={c.id} value={c.id}>
                  مكتب: {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Nationality Filter */}
          <div>
            <select
              value={selectedNationality}
              onChange={(e) => setSelectedNationality(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-700 font-medium"
            >
              <option value="all">كافة الجنسيات</option>
              {nationalities.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Skill / Experience Filter */}
          <div>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-700 font-medium"
            >
              <option value="all">كافة التخصصات والمهارات</option>
              {allSkills.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Tags Filter */}
        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
          <span className="text-zinc-400 font-bold ml-1">تصفية التجارب السابقة:</span>
          <button
            onClick={() => setTrialsFilter('all')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              trialsFilter === 'all' 
                ? 'bg-zinc-900 text-white' 
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setTrialsFilter('zero')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              trialsFilter === 'zero' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            استقدام جديد (0 تجارب سابقة)
          </button>
          <button
            onClick={() => setTrialsFilter('one_plus')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              trialsFilter === 'one_plus' 
                ? 'bg-amber-600 text-white' 
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            عاملات خاضت تجارب سابقة (تنازل كفيل أول / إرجاع)
          </button>
        </div>
      </div>

      {/* Workers Grid */}
      {availableWorkers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <UserCheck className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-zinc-800">لا توجد عاملات مطابقة لشروط البحث الحالية</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
            يرجى ضبط معايير الفلترة أو إعادة ضبط البحث للاطلاع على باقي العاملات المتوفرات بالسكن.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedOffice('all');
              setSelectedNationality('all');
              setSelectedSkill('all');
              setTrialsFilter('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-black transition-all"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableWorkers.map((worker) => {
            const office = getOfficeBadge(worker.originalOfficeId);
            return (
              <div
                key={worker.id}
                className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group relative"
              >
                {/* Top Accent Strip */}
                <div 
                  className="h-1.5 w-full" 
                  style={{ backgroundColor: office.color }}
                />

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col space-y-4">
                  {/* Worker Header with Avatar and Basic Info */}
                  <div className="flex items-start gap-4">
                    {/* Worker Avatar / Photo */}
                    <div className="relative">
                      {worker.photoUrl ? (
                        <img 
                          src={worker.photoUrl} 
                          alt={worker.fullNameAr} 
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-zinc-200 shadow-sm group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 text-amber-300 flex items-center justify-center font-bold text-lg border-2 border-amber-400/40 shadow-sm group-hover:scale-105 transition-transform">
                          {(worker.fullNameAr || 'ع').slice(0, 2)}
                        </div>
                      )}
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="متاحة فورا" />
                    </div>

                    {/* Name & Origin */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-zinc-900 truncate font-display">
                        {worker.fullNameAr}
                      </h3>
                      <p className="text-xs text-zinc-400 truncate dir-ltr text-right">
                        {worker.fullNameEn}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-zinc-100 text-zinc-700">
                          {worker.nationality}
                        </span>
                        {worker.religion && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 text-zinc-600">
                            {worker.religion}
                          </span>
                        )}
                        {worker.age && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 text-zinc-600">
                            {worker.age} سنة
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Decoupled Office Badge */}
                  <div 
                    className="p-2.5 rounded-2xl flex items-center justify-between text-xs"
                    style={{ backgroundColor: office.bg, border: `1px solid ${office.color}30` }}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5" style={{ color: office.color }} />
                      <span className="font-medium text-zinc-600">المكتب الأصلي:</span>
                    </div>
                    <span className="font-extrabold text-xs" style={{ color: office.color }}>
                      {office.name}
                    </span>
                  </div>

                  {/* Key Metrics: Salary & Previous Trials */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-zinc-50 rounded-2xl p-2.5 border border-zinc-100">
                      <div className="text-[11px] text-zinc-400 font-bold flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-amber-500" />
                        <span>الراتب الشهري</span>
                      </div>
                      <div className="text-sm font-extrabold text-zinc-900 mt-1">
                        {worker.requestedSalary?.toLocaleString('ar-SA') || '1,500'} <span className="text-[10px] text-zinc-500">ر.س</span>
                      </div>
                    </div>

                    <div className="bg-zinc-50 rounded-2xl p-2.5 border border-zinc-100">
                      <div className="text-[11px] text-zinc-400 font-bold flex items-center gap-1">
                        <History className="w-3 h-3 text-indigo-500" />
                        <span>تجارب سابقة</span>
                      </div>
                      <div className="text-sm font-extrabold text-zinc-900 mt-1">
                        {worker.clientTrialsCount === 0 ? (
                          <span className="text-emerald-700 font-black">جديدة (0)</span>
                        ) : (
                          <span className="text-amber-700 font-black">{worker.clientTrialsCount} تجارب</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Skills Chips */}
                  <div>
                    <div className="text-[11px] text-zinc-400 font-bold mb-1.5 flex items-center gap-1">
                      <Award className="w-3 h-3 text-emerald-500" />
                      <span>المهارات والخبرات:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {worker.skills && worker.skills.length > 0 ? (
                        worker.skills.slice(0, 4).map((skill, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-zinc-400 italic">أعمال منزلية عامة</span>
                      )}
                      {worker.skills && worker.skills.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded-lg text-[10px] font-bold bg-zinc-100 text-zinc-600">
                          +{worker.skills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Passport & Languages */}
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-100">
                    <div className="flex items-center gap-1">
                      <span className="font-mono font-bold text-zinc-700">جواز: {worker.passportNumber}</span>
                    </div>
                    {worker.languages && worker.languages.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Languages className="w-3 h-3 text-zinc-400" />
                        <span>{worker.languages.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-4 bg-zinc-50/80 border-t border-zinc-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onViewProfile(worker)}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-100 transition-all flex items-center justify-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-zinc-500" />
                    <span>الملف الشامل</span>
                  </button>

                  <button
                    onClick={() => onBookTransfer(worker)}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all flex items-center justify-center gap-1 group-hover:scale-[1.02]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                    <span>حجز لعميل</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
