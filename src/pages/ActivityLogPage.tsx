import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';

export interface ActivityItem {
  id: string;
  user_name: string;
  role: string;
  action_type: 'إنشاء' | 'تعديل' | 'حذف' | 'تسجيل دخول' | 'اعتماد مالي' | 'تصدير بيانات';
  module: 'عقود الاستقدام' | 'عقود التأجير' | 'المالية والمحاسبة' | 'الموارد البشرية' | 'الفاتورة الإلكترونية ZATCA' | 'إدارة المستخدمين';
  details: string;
  severity: 'عادي' | 'تنبيه' | 'حرج';
  ip_address: string;
  device: string;
  created_at: string;
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: 'LOG-9001',
    user_name: 'مشرف admin (خالد السليم)',
    role: 'Super Admin',
    action_type: 'إنشاء',
    module: 'عقود الاستقدام',
    details: 'تم إنشاء عقد استقدام مساند جديد #RC-2026-0594 للعميل بندر صالح الهويريني وتوثيق السند المالي',
    severity: 'عادي',
    ip_address: '192.168.1.45',
    device: 'Windows 11 / Chrome',
    created_at: '2026-08-17 14:32'
  },
  {
    id: 'LOG-9002',
    user_name: 'محمد مصطفى',
    role: 'مدير العمليات',
    action_type: 'اعتماد مالي',
    module: 'المالية والمحاسبة',
    details: 'اعتماد سند صرف رقم #VOU-2026-0089 بمبلغ 18,500 ر.س لحساب وكالة مانيلا الدولية',
    severity: 'تنبيه',
    ip_address: '192.168.1.12',
    device: 'MacBook Pro / Safari',
    created_at: '2026-08-17 13:50'
  },
  {
    id: 'LOG-9003',
    user_name: 'سهام الشاذلي',
    role: 'مسؤول الموارد البشرية',
    action_type: 'تصدير بيانات',
    module: 'الموارد البشرية',
    details: 'تصدير ملف حماية الأجور (WPS SIF File) لرواتب شهر أغسطس 2026 لـ 48 موظفاً',
    severity: 'عادي',
    ip_address: '192.168.1.88',
    device: 'Windows 10 / Edge',
    created_at: '2026-08-17 12:15'
  },
  {
    id: 'LOG-9004',
    user_name: 'نظام الفوترة التلقائي (ZATCA Engine)',
    role: 'System Bot',
    action_type: 'إنشاء',
    module: 'الفاتورة الإلكترونية ZATCA',
    details: 'إصدار وتوقيع الفاتورة الضريبية SAF-INV-2026-0002 وتوليد رمز QR مشفر بنجاح',
    severity: 'عادي',
    ip_address: '127.0.0.1',
    device: 'Internal ERP Service',
    created_at: '2026-08-17 11:05'
  },
  {
    id: 'LOG-9005',
    user_name: 'سالم الدوسري',
    role: 'موظف مبيعات',
    action_type: 'تعديل',
    module: 'عقود التأجير',
    details: 'تحديث بيانات باقة التأجير وتمديد فترة العقد للعاملة KIMBERLY لـ 3 أشهر إضافية',
    severity: 'عادي',
    ip_address: '192.168.1.60',
    device: 'iPhone / Safari',
    created_at: '2026-08-17 09:40'
  },
  {
    id: 'LOG-9006',
    user_name: 'مشرف admin (خالد السليم)',
    role: 'Super Admin',
    action_type: 'تسجيل دخول',
    module: 'إدارة المستخدمين',
    details: 'تسجيل دخول ناجح مع إتمام التحقق الثنائي (2FA OTP) من عنوان IP جديد',
    severity: 'تنبيه',
    ip_address: '192.168.60.167',
    device: 'Windows 11 / Chrome',
    created_at: '2026-08-17 08:30'
  }
];

export const ActivityLogPage: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('الكل');
  const [selectedAction, setSelectedAction] = useState<string>('الكل');

  useEffect(() => {
    realErpDataStore.getRecords<ActivityItem>('activity_log', MOCK_ACTIVITIES).then(data => setActivities(data));
  }, []);

  const modules = ['الكل', 'عقود الاستقدام', 'عقود التأجير', 'المالية والمحاسبة', 'الموارد البشرية', 'الفاتورة الإلكترونية ZATCA', 'إدارة المستخدمين'];
  const actions = ['الكل', 'إنشاء', 'تعديل', 'حذف', 'تسجيل دخول', 'اعتماد مالي', 'تصدير بيانات'];

  const filteredActivities = activities.filter(act => {
    if (selectedModule !== 'الكل' && act.module !== selectedModule) return false;
    if (selectedAction !== 'الكل' && act.action_type !== selectedAction) return false;
    return true;
  });

  const columns: Column<ActivityItem>[] = [
    {
      header: 'كود السجل',
      accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-purple)', fontFamily: 'monospace' }}>{row.id}</span>
    },
    {
      header: 'المستخدم والدور الوظيفي',
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '800', color: '#1E293B' }}>{row.user_name}</span>
          <div style={{ fontSize: '11.5px', color: '#64748B' }}>
            <Badge text={row.role} type={row.role === 'Super Admin' ? 'danger' : 'info'} />
          </div>
        </div>
      )
    },
    {
      header: 'نوع الإجراء',
      accessor: (row) => (
        <Badge
          text={row.action_type}
          type={row.action_type === 'اعتماد مالي' ? 'success' : row.action_type === 'حذف' ? 'danger' : row.action_type === 'تسجيل دخول' ? 'warning' : 'primary'}
        />
      )
    },
    {
      header: 'القسم / الموديول',
      accessor: (row) => (
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#047857' }}>
          {row.module}
        </span>
      )
    },
    {
      header: 'تفاصيل العملية والتغييرات',
      accessor: (row) => (
        <div style={{ maxWidth: '360px', fontSize: '12px', color: '#334155', lineHeight: '1.4' }}>
          {row.details}
        </div>
      )
    },
    {
      header: 'عنوان الـ IP والجهاز',
      accessor: (row) => (
        <div>
          <span style={{ fontFamily: 'monospace', fontSize: '11.5px', fontWeight: '700', color: '#475569' }}>{row.ip_address}</span>
          <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>{row.device}</div>
        </div>
      )
    },
    {
      header: 'الوقت والتاريخ',
      accessor: (row) => (
        <span style={{ fontSize: '11.5px', color: '#D97706', fontWeight: '800', fontFamily: 'monospace' }}>
          {row.created_at}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
        color: '#FFF',
        padding: '20px 24px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: '#4F46E5', color: '#FFF', padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' }}>
              SECURITY & AUDIT TRAIL
            </span>
            <span style={{ color: '#C7D2FE', fontSize: '12px' }}>سجل العمليات والرقابة الداخلية المباشرة</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '900', margin: '4px 0 0 0' }}>
            سجل النشاط وحركات التدقيق الأمني (Enterprise Audit Trail & Security Log)
          </h1>
          <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#E0E7FF' }}>
            تتبع غير قابل للتعديل لكافة العمليات المالية، إنشاء العقود، تسجيل الدخول، وتغييرات الصلاحيات
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('activity_log', filteredActivities, 'excel')} style={{ padding: '8px 16px', fontSize: '13px' }}>
            <i className="fa-solid fa-file-excel text-emerald-600 ml-1"></i> Excel
          </button>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('activity_log', filteredActivities, 'pdf')} style={{ padding: '8px 16px', fontSize: '13px' }}>
            <i className="fa-solid fa-file-pdf text-red-600 ml-1"></i> PDF
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatCard
          title="إجمالي العمليات المسجلة"
          value={`${activities.length} حركة`}
          icon="fa-solid fa-clock-rotate-left"
          subtext="سجل تدقيق مشفر غير قابل للتعديل"
          variant="purple"
        />
        <StatCard
          title="الاعتمادات المالية المنجزة"
          value="18 عملية"
          icon="fa-solid fa-file-circle-check"
          subtext="سندات صرف وقبض معتمدة"
          variant="teal"
        />
        <StatCard
          title="جلسات الدخول النشطة"
          value="4 مستخدمين"
          icon="fa-solid fa-users"
          subtext="تحقق ثنائي 2FA نشط"
          variant="info"
        />
        <StatCard
          title="مستوى الامتثال الأمني"
          value="100% ممتاز"
          icon="fa-solid fa-shield-halved"
          subtext="متوافق مع معايير الأمن السيبراني"
          variant="warning"
        />
      </div>

      {/* Filter Bars */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', background: '#FFF', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#1E293B' }}>تصفية بالقسم:</span>
          {modules.map(m => (
            <button
              key={m}
              onClick={() => setSelectedModule(m)}
              style={{
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '11.5px',
                fontWeight: '700',
                border: '1px solid #CBD5E1',
                background: selectedModule === m ? '#0F172A' : '#F8FAFC',
                color: selectedModule === m ? '#FFF' : '#475569',
                cursor: 'pointer'
              }}
            >
              {m}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#1E293B' }}>نوع الإجراء:</span>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: '700' }}
          >
            {actions.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredActivities}
        searchPlaceholder="ابحث باسم المستخدم، الإجراء، التفاصيل، أو عنوان الـ IP..."
        exportConfig={{ sectionKey: 'activity_log', rawData: filteredActivities }}
      />
    </div>
  );
};
