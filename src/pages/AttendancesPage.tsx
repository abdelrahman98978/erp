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
          <button className="btn-odoo btn-odoo-purple" onClick={() => setShowUploadModal(true)}>
            <i className="fa-solid fa-file-excel ml-1"></i> رفع شيت بصمة الإكسيل
          </button>
          <button className="btn-odoo btn-odoo-primary" onClick={() => exportData('employees', attendances, 'excel')} title="تصدير Excel">
            <i className="fa-solid fa-file-excel ml-1"></i> Excel
          </button>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('employees', attendances, 'pdf')} title="تصدير PDF">
            <i className="fa-solid fa-file-pdf text-danger ml-1"></i> PDF
          </button>
        </div>
      </div>

      {/* Stats Cards Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', borderRight: '4px solid #10B981', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>الموظفون الحاضرون اليوم</span>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#10B981', marginTop: '4px' }}>{totalPresent} موظفاً</div>
        </div>
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', borderRight: '4px solid #F59E0B', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>حالات التأخير المسجلة</span>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#F59E0B', marginTop: '4px' }}>{totalLate} حالات</div>
        </div>
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', borderRight: '4px solid #005154', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>معدل الانضباط العام</span>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#005154', marginTop: '4px' }}>98.4%</div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={attendances}
        searchPlaceholder="ابحث باسم الموظف، القسم، أو التاريخ..."
        onAddClick={() => setShowManualModal(true)}
        addLabel="تسجيل حضور يدوي"
      />

      {/* Biometric Upload Modal */}
      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="table-card" style={{ width: '480px', padding: '24px', background: 'white', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154' }}>
                <i className="fa-solid fa-file-excel ml-2 text-success"></i> استيراد شيت البصمة الجماعي
              </h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setShowUploadModal(false)}></i>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              اختر ملف إكسيل (.xlsx / .csv) المصدَر من جهاز البصمة الإلكترونية للمعالجة التلقائية.
            </p>

            <div style={{ border: '2px dashed #CBD5E1', padding: '30px', textAlign: 'center', borderRadius: '8px', marginBottom: '20px', background: '#F8FAFC' }}>
              <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '36px', color: '#0284C7', marginBottom: '10px' }}></i>
              <div style={{ fontSize: '13px', fontWeight: '700' }}>اسحب وأسقط ملف البصمة هنا</div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>أو قم باختيار الملف من جهازك</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="btn-odoo btn-odoo-secondary" onClick={() => setShowUploadModal(false)}>إلغاء</button>
              <button className="btn-odoo btn-odoo-purple" onClick={handleSimulatedSheetImport}>
                معالجة واستيراد السجلات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Attendance Modal */}
      {showManualModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="table-card" style={{ width: '480px', padding: '24px', background: 'white', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154' }}>تسجيل حضور وانصراف يدوي</h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setShowManualModal(false)}></i>
            </div>
            <form onSubmit={handleManualSubmit}>
              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">اسم الموظف *</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="الاسم الثلاثي..."
                  value={manualForm.emp_name}
                  onChange={e => setManualForm({ ...manualForm, emp_name: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="filter-group">
                  <label className="filter-label">وقت الحضور *</label>
                  <input
                    type="time"
                    className="filter-input"
                    value={manualForm.check_in}
                    onChange={e => setManualForm({ ...manualForm, check_in: e.target.value })}
                    required
                  />
                </div>
                <div className="filter-group">
                  <label className="filter-label">وقت الانصراف *</label>
                  <input
                    type="time"
                    className="filter-input"
                    value={manualForm.check_out}
                    onChange={e => setManualForm({ ...manualForm, check_out: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" className="btn-odoo btn-odoo-secondary" onClick={() => setShowManualModal(false)}>إلغاء</button>
                <button type="submit" className="btn-odoo btn-odoo-purple">حفظ السجل</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancesPage;
