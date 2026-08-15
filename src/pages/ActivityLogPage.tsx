import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';

interface ActivityItem {
  id: string;
  user_name: string;
  action_type: string;
  module: string;
  details: string;
  ip_address: string;
  created_at: string;
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  { id: '1', user_name: 'مشرف admin', action_type: 'إنشاء عقد', module: 'عقود الاستقدام', details: 'قام بإنشاء عقد جديد #RC-2026-0594 للعميل عميل التجريبي', ip_address: '192.168.1.45', created_at: '2026-07-30 21:15' },
  { id: '2', user_name: 'محمد مصطفي', action_type: 'تحديث حالة', module: 'الحجوزات', details: 'قام بتغيير حالة الطلب #564 إلى تحت الإجراء', ip_address: '192.168.1.12', created_at: '2026-07-30 20:00' },
  { id: '3', user_name: 'سهام الشاذلي', action_type: 'سند إعاشة', module: 'مركز الإيواء', details: 'تم إصدار قيد إعاشة إيواء الرمال بـ 61 وجبة', ip_address: '192.168.1.88', created_at: '2026-07-30 18:30' }
];

export const ActivityLogPage: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    realErpDataStore.getRecords<ActivityItem>('activity_logs', MOCK_ACTIVITIES).then(data => setActivities(data));
  }, []);

  const currentData = activities.length > 0 ? activities : MOCK_ACTIVITIES;

  const columns: Column<ActivityItem>[] = [
    { header: '#', accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{row.id}</span> },
    { header: 'المستخدم', accessor: (row) => <span style={{ fontWeight: '700' }}>{row.user_name}</span> },
    { header: 'نوع الإجراء', accessor: (row) => <Badge text={row.action_type} type="purple" /> },
    { header: 'الموديول', accessor: (row) => <Badge text={row.module} type="info" /> },
    { header: 'تفاصيل العملية والتغييرات', accessor: (row) => <span style={{ fontSize: '12.5px' }}>{row.details}</span> },
    { header: 'عنوان الـ IP', accessor: (row) => <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-muted)' }}>{row.ip_address}</span> },
    { header: 'الوقت والتاريخ', accessor: (row) => <span style={{ fontSize: '11.5px', color: 'var(--status-warning)', fontWeight: '700' }}>{row.created_at}</span> }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-clock-rotate-left text-purple ml-2"></i> سجل النشاط المباشر والتدقيق (Audit Activity Log)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>تتبع كافة عمليات الحفظ، التعديل، والحذف التي قام بها مستخدمو النظام بالوقت والتاريخ</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn-odoo btn-odoo-primary" onClick={() => exportData('activity_log', currentData, 'excel')} title="تصدير Excel">
            <i className="fa-solid fa-file-excel ml-1"></i> Excel
          </button>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('activity_log', currentData, 'csv')} title="تصدير CSV">
            <i className="fa-solid fa-file-csv text-primary ml-1"></i> CSV
          </button>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('activity_log', currentData, 'pdf')} title="تصدير PDF">
            <i className="fa-solid fa-file-pdf text-danger ml-1"></i> PDF
          </button>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('activity_log', currentData, 'print')} title="طباعة التقرير">
            <i className="fa-solid fa-print text-purple ml-1"></i> طباعة
          </button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={currentData}
        searchPlaceholder="ابحث باسم المستخدم، الإجراء، أو التفاصيل..."
        exportConfig={{ sectionKey: 'activity_log', rawData: currentData }}
      />
    </div>
  );
};
