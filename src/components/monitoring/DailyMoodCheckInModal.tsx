import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, Check, HeartHandshake, AlertCircle, 
  MessageSquare, Flame, Smile, ThumbsUp 
} from 'lucide-react';
import { 
  employeeMonitoringService, 
  MoodType, 
  ReasonCategory, 
  MOOD_META, 
  REASON_CATEGORIES, 
  DailyMoodRecord 
} from '../../services/employeeMonitoringService';

interface DailyMoodCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: {
    id: string;
    full_name: string;
    role: string;
    branch: string;
  } | null;
  onSaved?: (record: DailyMoodRecord) => void;
}

export const DailyMoodCheckInModal: React.FC<DailyMoodCheckInModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaved,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType>('happy');
  const [selectedCategory, setSelectedCategory] = useState<ReasonCategory>('workload');
  const [note, setNote] = useState('');
  const [doNotRemindToday, setDoNotRemindToday] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successSaved, setSuccessSaved] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser?.id) {
      // جلب تسجيل اليوم إن وجد لملء البيانات مسبقاً
      employeeMonitoringService.getTodayUserMood(currentUser.id).then(todayRecord => {
        if (todayRecord) {
          setSelectedMood(todayRecord.mood);
          setSelectedCategory(todayRecord.reason_category);
          setNote(todayRecord.note || '');
        }
      });
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const savedRecord = await employeeMonitoringService.recordDailyMood({
        user_id: currentUser?.id || 'USR-CURRENT',
        user_name: currentUser?.full_name || 'موظف النظام',
        role: currentUser?.role || 'عضو الفريق',
        branch: currentUser?.branch || 'الفرع الرئيسي',
        mood: selectedMood,
        energy_score: MOOD_META[selectedMood].score,
        reason_category: selectedCategory,
        note: note.trim() || undefined,
        date: new Date().toISOString().slice(0, 10),
      });

      if (doNotRemindToday) {
        localStorage.setItem(`mood_reminded_${new Date().toISOString().slice(0, 10)}`, 'true');
      }

      setSuccessSaved(true);
      setTimeout(() => {
        setSuccessSaved(false);
        setIsSubmitting(false);
        if (onSaved) onSaved(savedRecord);
        onClose();
      }, 900);
    } catch (err) {
      console.error('Error saving mood:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-all duration-300">
      <div 
        className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl text-white animate-in fade-in zoom-in-95 duration-200"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)'
        }}
      >
        {/* Top Decorative Accent Glow */}
        <div 
          className="absolute top-0 inset-x-0 h-1" 
          style={{ 
            background: `linear-gradient(90deg, #10b981 0%, ${MOOD_META[selectedMood].color} 50%, #6366f1 100%)` 
          }} 
        />

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 border border-white/10 flex items-center justify-center text-xl shadow-inner">
              {MOOD_META[selectedMood].emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full uppercase">
                  Daily Pulse & Wellness
                </span>
                <span className="text-xs text-zinc-400">
                  {new Date().toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                كيف تشعر حيال وتيرة عملك اليوم؟
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition-colors"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 1. Emoji Selection Grid */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-2.5">
              1. اختر حالتك المزاجية / مستوى الطاقة الآن:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(Object.keys(MOOD_META) as MoodType[]).map(key => {
                const item = MOOD_META[key];
                const isSelected = selectedMood === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedMood(key)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 group ${
                      isSelected
                        ? 'bg-zinc-800/90 border-emerald-500/80 shadow-lg scale-105'
                        : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850'
                    }`}
                    style={isSelected ? { borderColor: item.color, boxShadow: `0 0 15px ${item.color}30` } : {}}
                  >
                    <span className="text-3xl mb-1.5 transition-transform group-hover:scale-115">
                      {item.emoji}
                    </span>
                    <span className={`text-[11px] text-center font-medium leading-tight ${isSelected ? 'text-white font-bold' : 'text-zinc-400'}`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Reason Category Tags */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-2.5">
              2. ما العامل الأكثر تأثيراً على حالتك اليوم؟
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(REASON_CATEGORIES) as ReasonCategory[]).map(catKey => {
                const isSelected = selectedCategory === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setSelectedCategory(catKey)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-sm'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    {REASON_CATEGORIES[catKey]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Optional Note */}
          <div>
            <label className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-1.5">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                ملاحظة سريعة أو عائق تواجهه (اختياري للإدارة والتحسين):
              </span>
              <span className="text-[10px] text-zinc-500">سري وموجّه للمساندة</span>
            </label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="مثال: هناك تأخير في بوابة مساند، أو ضغط طلبات الاستقدام مرتفع..."
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/70 transition-colors"
            />
          </div>

          {/* Supportive Context Note */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/80 text-xs text-zinc-400">
            <HeartHandshake className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              تساعدنا هذه الاستجابة السريعة (3 ثوانٍ) في معرفة العوائق التقنية والتشغيلية فوراً وتوزيع أعباء العمل بما يحمي فريقنا من الإجهاد.
            </p>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
            <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={doNotRemindToday}
                onChange={e => setDoNotRemindToday(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
              />
              <span>عدم إظهار التذكير مرة أخرى اليوم</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
              >
                تخطي الآن
              </button>
              <button
                type="submit"
                disabled={isSubmitting || successSaved}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-50"
              >
                {successSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>تم الحفظ بنجاح!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{isSubmitting ? 'جاري الحفظ...' : 'حفظ ومتابعة العمل'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
