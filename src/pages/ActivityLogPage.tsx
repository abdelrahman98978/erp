import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-clock-rotate-left text-purple ml-2"></i> سجل النشاط المباشر والتدقيق (Audit Activity Log)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>تتبع كافة عمليات الحفظ، التعديل، والحذف التي قام بها مستخدمو النظام بالوقت والتاريخ</p>
        </div>
      </div>
      <DataTable columns={columns} data={activities.length > 0 ? activities : MOCK_ACTIVITIES} searchPlaceholder="ابحث باسم المستخدم، الإجراء، أو التفاصيل..." />
    </div>
  );
};
