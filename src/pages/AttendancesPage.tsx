import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';
import { ClipboardCheck, FileSpreadsheet, FileText, Upload, Plus, Search, X, Check, CloudUpload } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  emp_name: string;
  department: string;
  date: string;
  check_in: string;
  check_out: string;
  status: 'حاضر' | 'متأخر' | 'غياب' | 'إجازة';
  work_hours: number;
}

const INITIAL_ATTENDANCES: AttendanceRecord[] = [
  { id: '1', emp_name: 'محمد مصطفي', department: 'الإدارة العليا', date: '2026-08-12', check_in: '08:00 ص', check_out: '04:30 م', status: 'حاضر', work_hours: 8.5 },
  { id: '2', emp_name: 'سهام الشاذلي', department: 'الموارد البشرية', date: '2026-08-12', check_in: '08:15 ص', check_out: '04:30 م', status: 'متأخر', work_hours: 8.25 },
  { id: '3', emp_name: 'فهد العتيبي', department: 'التشغيل والاستقدام', date: '2026-08-12', check_in: '07:55 ص', check_out: '05:00 م', status: 'حاضر', work_hours: 9.0 },
  { id: '4', emp_name: 'عبدالفتح مسؤول الوكلاء', department: 'المكاتب الخارجية', date: '2026-08-12', check_in: '08:05 ص', check_out: '04:30 م', status: 'حاضر', work_hours: 8.4 },
  { id: '5', emp_name: 'سارة خالد', department: 'خدمة العملاء CRM', date: '2026-08-12', check_in: '09:30 ص', check_out: '04:30 م', status: 'متأخر', work_hours: 7.0 }
];

export const AttendancesPage: React.FC = () => {
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    realErpDataStore.getRecords<AttendanceRecord>('attendances', INITIAL_ATTENDANCES).then(data => setAttendances(data));
  }, []);

  const [manualForm, setManualForm] = useState({
    emp_name: '',
    department: 'الموارد البشرية',
    date: new Date().toISOString().slice(0, 10),
    check_in: '08:00',
    check_out: '16:30',
    status: 'حاضر' as 'حاضر' | 'متأخر' | 'غياب' | 'إجازة'
  });

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.emp_name) return;

    const newRec: AttendanceRecord = {
      id: String(Date.now()),
      emp_name: manualForm.emp_name,
      department: manualForm.department,
      date: manualForm.date,
      check_in: `${manualForm.check_in} ص`,
      check_out: `${manualForm.check_out} م`,
      status: manualForm.status,
      work_hours: 8.5
    };

    const updated = await realErpDataStore.addRecord('attendances', newRec, INITIAL_ATTENDANCES);
    setAttendances(updated);
    setShowManualModal(false);
    setManualForm({ emp_name: '', department: 'الموارد البشرية', date: new Date().toISOString().slice(0, 10), check_in: '08:00', check_out: '16:30', status: 'حاضر' });
  };

  const handleSimulatedSheetImport = () => {
    const imported: AttendanceRecord[] = [
      { id: String(Date.now() + 1), emp_name: 'علي حسن السليمان', department: 'المالية', date: new Date().toISOString().slice(0, 10), check_in: '07:50 ص', check_out: '04:30 م', status: 'حاضر', work_hours: 8.6 },
      { id: String(Date.now() + 2), emp_name: 'ريم الدوسري', department: 'خدمة العملاء', date: new Date().toISOString().slice(0, 10), check_in: '08:22 ص', check_out: '04:30 م', status: 'متأخر', work_hours: 8.1 }
    ];
    setAttendances([...imported, ...attendances]);
    setShowUploadModal(false);
  };

  const filteredAttendances = attendances.filter(a =>
    a.emp_name.includes(searchQuery) ||
    a.department.includes(searchQuery) ||
    a.date.includes(searchQuery)
  );

  const totalPresent = attendances.filter(a => a.status === 'حاضر').length;
  const totalLate = attendances.filter(a => a.status === 'متأخر').length;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div
        className="card-feature-cinematic"
        style={{
          background: '#000000',
          borderRadius: '16px',
          padding: '28px',
          color: '#FFFFFF',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div className="flex items-center gap-3">
          <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>BIOMETRIC ATTENDANCE</span>
            </div>
            <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
              سجل الحضور والانصراف والبصمة
            </h1>
            <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '4px 0 0 0', fontWeight: 420 }}>
              رفع واستيراد كشوف البصمة الإلكترونية الجماعية، تتبع التأخيرات، ومطابقة ساعات العمل
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            className="button-white-pill"
            onClick={() => setShowUploadModal(true)}
            style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
          >
            <Upload className="w-4 h-4 ml-1" />
            <span>رفع شيت بصمة الإكسيل</span>
          </button>
          <button
            className="button-outline-on-dark"
            onClick={() => setShowManualModal(true)}
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
          >
            <Plus className="w-4 h-4 ml-1" />
            <span>تسجيل يدوي</span>
          </button>
          <button
            className="button-outline-on-dark"
            onClick={() => exportData('attendances', attendances, 'excel')}
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
          >
            <FileSpreadsheet className="w-4 h-4 ml-1 text-champagne-light" />
            <span>Excel</span>
          </button>
          <button
            className="button-outline-on-dark"
            onClick={() => exportData('attendances', attendances, 'pdf')}
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
          >
            <FileText className="w-4 h-4 ml-1 text-rose-400" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Bar */}
      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card-pistachio-band" style={{ padding: '24px', borderRadius: '16px' }}>
          <span style={{ fontSize: '13px', color: '#000000', fontWeight: 550 }}>الموظفون الحاضرون اليوم</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>{totalPresent} موظفاً</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>حضور مكتمل</span>
        </div>
        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#71717a', fontWeight: 550 }}>حالات التأخير المسجلة</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>{totalLate} حالات</div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '10px' }}>بحاجة لمراجعة</span>
        </div>
        <div className="card-pricing-featured" style={{ padding: '24px', borderRadius: '16px', background: '#000000', color: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 550 }}>معدل الانضباط العام</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#ffffff', marginTop: '6px', letterSpacing: '-0.02em' }}>98.4%</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>ممتاز</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-white flex-wrap gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute right-3 top-3 text-zinc-400" />
            <input
              type="text"
              placeholder="ابحث باسم الموظف، القسم، أو التاريخ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-input"
              style={{ width: '100%', height: '36px', minHeight: '36px', borderRadius: '9999px', paddingRight: '36px', fontSize: '12px' }}
            />
          </div>
          <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
            العدد: {filteredAttendances.length} سجلات
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-zinc-700">
            <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">اسم الموظف</th>
                <th className="p-3.5">القسم والفرع</th>
                <th className="p-3.5">التاريخ</th>
                <th className="p-3.5">وقت الحضور (Check-In)</th>
                <th className="p-3.5">وقت الانصراف (Check-Out)</th>
                <th className="p-3.5">ساعات العمل</th>
                <th className="p-3.5">حالة الحضور</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredAttendances.map((row) => (
                <tr key={row.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="p-3.5 font-bold text-black">{row.emp_name}</td>
                  <td className="p-3.5"><Badge text={row.department} type="purple" /></td>
                  <td className="p-3.5 font-mono text-zinc-500">{row.date}</td>
                  <td className="p-3.5 font-mono font-bold text-champagne-dark">{row.check_in}</td>
                  <td className="p-3.5 font-mono font-bold text-zinc-800">{row.check_out}</td>
                  <td className="p-3.5 font-mono font-bold text-black">{row.work_hours} س</td>
                  <td className="p-3.5">
                    <Badge text={row.status} type={row.status === 'حاضر' ? 'success' : row.status === 'متأخر' ? 'warning' : 'danger'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Biometric Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden font-sans">
            <div className="p-5 bg-black text-white flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-champagne-light" />
                <span>استيراد شيت البصمة الجماعي</span>
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 bg-white text-black">
              <p className="text-xs text-zinc-600">
                اختر ملف إكسيل (.xlsx / .csv) المصدَر من جهاز البصمة الإلكترونية للمعالجة التلقائية.
              </p>

              <div className="border border-dashed border-zinc-300 p-8 text-center rounded-2xl bg-zinc-50 flex flex-col items-center justify-center">
                <CloudUpload className="w-10 h-10 text-black mb-2" />
                <div className="text-xs font-bold text-black">اسحب وأسقط ملف البصمة هنا</div>
                <span className="text-[11px] text-zinc-500 mt-1">أو قم باختيار الملف من جهازك</span>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-zinc-100">
                <button className="button-outline-on-light" onClick={() => setShowUploadModal(false)} style={{ minHeight: '36px', padding: '6px 16px', fontSize: '13px' }}>
                  إلغاء
                </button>
                <button className="button-primary-pill" onClick={handleSimulatedSheetImport} style={{ minHeight: '36px', padding: '6px 20px', fontSize: '13px' }}>
                  معالجة واستيراد السجلات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Attendance Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden font-sans">
            <div className="p-5 bg-black text-white flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-champagne-light" />
                <span>تسجيل حضور وانصراف يدوي</span>
              </h3>
              <button onClick={() => setShowManualModal(false)} className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="p-6 space-y-4 bg-white text-black">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">اسم الموظف *</label>
                <input
                  type="text"
                  placeholder="الاسم الثلاثي..."
                  value={manualForm.emp_name}
                  onChange={e => setManualForm({ ...manualForm, emp_name: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">وقت الحضور *</label>
                  <input
                    type="time"
                    value={manualForm.check_in}
                    onChange={e => setManualForm({ ...manualForm, check_in: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs font-mono text-black focus:border-black focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">وقت الانصراف *</label>
                  <input
                    type="time"
                    value={manualForm.check_out}
                    onChange={e => setManualForm({ ...manualForm, check_out: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs font-mono text-black focus:border-black focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-zinc-100">
                <button type="button" className="button-outline-on-light" onClick={() => setShowManualModal(false)} style={{ minHeight: '36px', padding: '6px 16px', fontSize: '13px' }}>
                  إلغاء
                </button>
                <button type="submit" className="button-primary-pill" style={{ minHeight: '36px', padding: '6px 20px', fontSize: '13px' }}>
                  <Check className="w-4 h-4 ml-1" />
                  <span>حفظ السجل</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancesPage;
