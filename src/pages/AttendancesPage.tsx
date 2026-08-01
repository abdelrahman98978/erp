import React from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';

interface AttendanceRecord {
  id: string;
  emp_name: string;
  department: string;
  date: string;
  check_in: string;
  check_out: string;
  status: 'حاضر' | 'متأخر' | 'غياب' | 'إجازة';
}

const MOCK_ATTENDANCES: AttendanceRecord[] = [
  { id: '1', emp_name: 'محمد مصطفي', department: 'الادارة العليا', date: '2026-07-30', check_in: '08:00 ص', check_out: '04:30 م', status: 'حاضر' },
  { id: '2', emp_name: 'سهام الشاذلي', department: 'الموارد البشرية', date: '2026-07-30', check_in: '08:15 ص', check_out: '04:30 م', status: 'متأخر' }
];

export const AttendancesPage: React.FC = () => {
  const columns: Column<AttendanceRecord>[] = [
    { header: 'اسم الموظف', accessor: (row) => <span style={{ fontWeight: '700' }}>{row.emp_name}</span> },
    { header: 'القسم', accessor: (row) => <Badge text={row.department} type="purple" /> },
    { header: 'التاريخ', accessor: (row) => <span>{row.date}</span> },
    { header: 'وقت الحضور', accessor: (row) => <span style={{ fontFamily: 'monospace', color: 'var(--status-success)', fontWeight: '700' }}>{row.check_in}</span> },
    { header: 'وقت الانصراف', accessor: (row) => <span style={{ fontFamily: 'monospace', color: 'var(--odoo-purple)', fontWeight: '700' }}>{row.check_out}</span> },
    { header: 'الحالة', accessor: (row) => <Badge text={row.status} type={row.status === 'حاضر' ? 'success' : row.status === 'متأخر' ? 'warning' : 'danger'} /> }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-clipboard-user text-primary ml-2"></i> سجل الحضور والانصراف وشيت الإكسيل (HR Attendance)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>رفع سجلات البصمة والحضور الجماعي وإصدار تقارير التأخيرات</p>
        </div>
        <button className="btn-odoo btn-odoo-primary">
          <i className="fa-solid fa-file-excel"></i> رفع شيت بصمة الإكسيل
        </button>
      </div>
      <DataTable columns={columns} data={MOCK_ATTENDANCES} searchPlaceholder="ابحث باسم الموظف، القسم، أو التاريخ..." addLabel="تسجيل حضور يدوي" />
    </div>
  );
};
