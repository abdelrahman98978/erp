import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';

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

  const columns: Column<AttendanceRecord>[] = [
    { header: 'اسم الموظف', accessor: (row) => <span style={{ fontWeight: '700' }}>{row.emp_name}</span> },
    { header: 'القسم والفرع', accessor: (row) => <Badge text={row.department} type="purple" /> },
    { header: 'التاريخ', accessor: (row) => <span style={{ fontSize: '12px' }}>{row.date}</span> },
    { header: 'وقت الحضور (Check-In)', accessor: (row) => <span style={{ fontFamily: 'monospace', color: 'var(--status-success)', fontWeight: '700' }}>{row.check_in}</span> },
    { header: 'وقت الانصراف (Check-Out)', accessor: (row) => <span style={{ fontFamily: 'monospace', color: 'var(--odoo-purple)', fontWeight: '700' }}>{row.check_out}</span> },
    { header: 'ساعات العمل', accessor: (row) => <span style={{ fontWeight: '800', color: '#005154' }}>{row.work_hours} س</span> },
    { header: 'حالة الحضور', accessor: (row) => <Badge text={row.status} type={row.status === 'حاضر' ? 'success' : row.status === 'متأخر' ? 'warning' : 'danger'} /> }
  ];

  const totalPresent = attendances.filter(a => a.status === 'حاضر').length;
  const totalLate = attendances.filter(a => a.status === 'متأخر').length;

  return (
    <div>
      {/* Top Banner Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Cairo, sans-serif' }}>
            <i className="fa-solid fa-clipboard-user text-purple ml-2"></i> سجل الحضور والانصراف والبصمة (Biometric Attendance Hub)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            رفع واستيراد كشوف البصمة الإلكترونية الجماعية، تتبع التأخيرات، ومطابقة ساعات العمل
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="button-primary-pill" onClick={() => setShowUploadModal(true)} style={{ fontSize: '13px', padding: '6px 18px', minHeight: '38px' }}>
            <i className="fa-solid fa-file-excel ml-1"></i> رفع شيت بصمة الإكسيل
          </button>
          <button className="button-outline-on-light" onClick={() => exportData('attendances', attendances, 'excel')} title="تصدير Excel" style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}>
            <i className="fa-solid fa-file-excel text-emerald-600 ml-1"></i> Excel
          </button>
          <button className="button-outline-on-light" onClick={() => exportData('attendances', attendances, 'csv')} title="تصدير CSV" style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}>
            <i className="fa-solid fa-file-csv ml-1"></i> CSV
          </button>
          <button className="button-outline-on-light" onClick={() => exportData('attendances', attendances, 'pdf')} title="تصدير PDF" style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}>
            <i className="fa-solid fa-file-pdf text-rose-600 ml-1"></i> PDF
          </button>
        </div>
      </div>

      {/* Stats Cards Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card-pistachio-band" style={{ padding: '20px', borderRadius: '16px' }}>
          <span style={{ fontSize: '12px', color: '#000000', fontWeight: 550 }}>الموظفون الحاضرون اليوم</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '4px', letterSpacing: '-0.02em' }}>{totalPresent} موظفاً</div>
        </div>
        <div className="card-pricing" style={{ padding: '20px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '12px', color: '#71717a', fontWeight: 550 }}>حالات التأخير المسجلة</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '4px', letterSpacing: '-0.02em' }}>{totalLate} حالات</div>
        </div>
        <div className="card-pricing" style={{ padding: '20px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '12px', color: '#71717a', fontWeight: 550 }}>معدل الانضباط العام</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '4px', letterSpacing: '-0.02em' }}>98.4%</div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={attendances}
        searchPlaceholder="ابحث باسم الموظف، القسم، أو التاريخ..."
        onAddClick={() => setShowManualModal(true)}
        addLabel="تسجيل حضور يدوي"
        exportConfig={{ sectionKey: 'attendances', rawData: attendances }}
      />

      {/* Biometric Upload Modal */}
      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card-pricing" style={{ width: '480px', padding: '28px', background: '#ffffff', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 550, color: '#000000', margin: 0 }}>
                <i className="fa-solid fa-file-excel ml-2 text-emerald-600"></i> استيراد شيت البصمة الجماعي
              </h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px', color: '#71717a' }} onClick={() => setShowUploadModal(false)}></i>
            </div>
            <p style={{ fontSize: '12.5px', color: '#71717a', marginBottom: '16px' }}>
              اختر ملف إكسيل (.xlsx / .csv) المصدَر من جهاز البصمة الإلكترونية للمعالجة التلقائية.
            </p>

            <div style={{ border: '1px dashed #e4e4e7', padding: '30px', textAlign: 'center', borderRadius: '12px', marginBottom: '20px', background: '#fafafa' }}>
              <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '32px', color: '#000000', marginBottom: '10px' }}></i>
              <div style={{ fontSize: '13px', fontWeight: 550, color: '#000000' }}>اسحب وأسقط ملف البصمة هنا</div>
              <span style={{ fontSize: '11.5px', color: '#71717a' }}>أو قم باختيار الملف من جهازك</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="button-outline-on-light" onClick={() => setShowUploadModal(false)}>إلغاء</button>
              <button className="button-primary-pill" onClick={handleSimulatedSheetImport}>
                معالجة واستيراد السجلات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Attendance Modal */}
      {showManualModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card-pricing" style={{ width: '480px', padding: '28px', background: '#ffffff', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 550, color: '#000000', margin: 0 }}>تسجيل حضور وانصراف يدوي</h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px', color: '#71717a' }} onClick={() => setShowManualModal(false)}></i>
            </div>
            <form onSubmit={handleManualSubmit}>
              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">اسم الموظف *</label>
                <input
                  type="text"
                  className="text-input"
                  placeholder="الاسم الثلاثي..."
                  value={manualForm.emp_name}
                  onChange={e => setManualForm({ ...manualForm, emp_name: e.target.value })}
                  style={{ width: '100%', height: '40px', borderRadius: '9999px', padding: '0 14px' }}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="filter-group">
                  <label className="filter-label">وقت الحضور *</label>
                  <input
                    type="time"
                    className="text-input"
                    value={manualForm.check_in}
                    onChange={e => setManualForm({ ...manualForm, check_in: e.target.value })}
                    style={{ width: '100%', height: '40px', borderRadius: '9999px', padding: '0 14px' }}
                    required
                  />
                </div>
                <div className="filter-group">
                  <label className="filter-label">وقت الانصراف *</label>
                  <input
                    type="time"
                    className="text-input"
                    value={manualForm.check_out}
                    onChange={e => setManualForm({ ...manualForm, check_out: e.target.value })}
                    style={{ width: '100%', height: '40px', borderRadius: '9999px', padding: '0 14px' }}
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="button-outline-on-light" onClick={() => setShowManualModal(false)}>إلغاء</button>
                <button type="submit" className="button-primary-pill">حفظ السجل</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancesPage;
