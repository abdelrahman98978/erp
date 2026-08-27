import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useEmployees, useTableMutation } from '../hooks/queries/useErpQueries';
import { useCompany } from '../contexts/CompanyContext';
import { Employee360DigitalFileModal } from '../components/hr/Employee360DigitalFileModal';
import { journalEngine } from '../services/accounting/journalEngine';
import { useAppStore } from '../stores/appStore';

export interface EmployeeRecord {
  id: string;
  company_id?: string;
  employee_code: string;
  name: string;
  national_id: string;
  job_title: string;
  department: string;
  branch: string;
  hire_date: string;
  basic_salary?: number;
  allowances?: number;
  salary: number;
  iban?: string;
  bank_name?: string;
  leave_balance?: number;
  status: 'نشط' | 'إجازة' | 'نهاية خدمة' | 'معلق';
}

interface VacationRequest {
  id: string;
  employee_name: string;
  vacation_type: string;
  balance: number;
  from_date: string;
  to_date: string;
  days_count: number;
  notes: string;
  status: 'معتمد' | 'بانتظار الموافقة' | 'مرفوض';
}

interface AdvanceRequest {
  id: string;
  employee_name: string;
  payment_method: string;
  amount: number;
  date: string;
  installments_count: number;
  status: 'معتمد' | 'بانتظار الصرف' | 'مسدد';
}

interface SanctionItem {
  id: string;
  employee_name: string;
  sanction_type: string;
  amount: number;
  date: string;
  deduct_from_salary: boolean;
  reason: string;
  status: 'معتمد' | 'قيد المراجعة';
}

interface PermissionRequest {
  id: string;
  employee_name: string;
  permission_type: string;
  date: string;
  time: string;
  reason: string;
  status: 'معتمد' | 'بانتظار المشرف';
}

interface RewardRequest {
  id: string;
  employee_name: string;
  reward_type: string;
  salary: number;
  net_reward: number;
  payout_timing: string;
  date: string;
  status: 'معتمد' | 'بانتظار الصرف';
}

const DEFAULT_MOCK_EMPLOYEES: EmployeeRecord[] = [
  {
    id: 'emp-101',
    company_id: 'SAF',
    employee_code: 'EMP-2026-001',
    name: 'عبدالفتح (مسؤول الوكلاء)',
    national_id: '1092837410',
    job_title: 'مدير شؤون المكاتب الخارجية',
    department: 'التشغيل والاستقدام',
    branch: 'الإدارة العامة - الرياض',
    hire_date: '2022-01-15',
    salary: 12500,
    status: 'نشط',
  },
  {
    id: 'emp-102',
    company_id: 'SAF',
    employee_code: 'EMP-2026-002',
    name: 'فهد العتيبي',
    national_id: '1088273641',
    job_title: 'مشرف التشغيل والإيواء',
    department: 'إدارة الإيواء',
    branch: 'فرع الرياض',
    hire_date: '2023-03-01',
    salary: 9800,
    status: 'نشط',
  },
  {
    id: 'emp-103',
    company_id: 'SAF',
    employee_code: 'EMP-2026-003',
    name: 'إبراهيم الشمري',
    national_id: '1077283940',
    job_title: 'محاسب عام قيد وسندات',
    department: 'الإدارة المالية',
    branch: 'الإدارة العامة',
    hire_date: '2023-06-10',
    salary: 8500,
    status: 'نشط',
  },
  {
    id: 'emp-104',
    company_id: 'SAF',
    employee_code: 'EMP-2026-004',
    name: 'سارة خالد',
    national_id: '1066283910',
    job_title: 'أخصائية خدمة عملاء وواتساب',
    department: 'خدمة العملاء (CRM)',
    branch: 'فرع جدة',
    hire_date: '2024-01-10',
    salary: 7200,
    status: 'نشط',
  },
];

export const HRPage: React.FC = () => {
  const { activeCompanyId, activeCompany } = useCompany();
  const { data: rawEmployees = [], isLoading } = useEmployees();
  const { createItem } = useTableMutation('employees');

  const employees: EmployeeRecord[] = rawEmployees.length > 0 ? (rawEmployees as EmployeeRecord[]) : DEFAULT_MOCK_EMPLOYEES;

  const storeActiveTab = useAppStore(state => state.activeTab);

  const getMappedTab = (tabKey: string): 'employees' | 'vacations' | 'advances' | 'sanctions' | 'permissions' | 'rewards' | 'payroll' => {
    switch (tabKey) {
      case 'employee-permissions':
      case 'permissions':
        return 'permissions';
      case 'leave-requests':
      case 'vacations':
        return 'vacations';
      case 'employee-advances':
      case 'advances':
        return 'advances';
      case 'employee-sanctions':
      case 'sanctions':
        return 'sanctions';
      case 'employee-rewards':
      case 'rewards':
        return 'rewards';
      case 'payrolls':
      case 'payroll':
      case 'wps':
      case 'salary':
      case 'salaries':
        return 'payroll';
      default:
        return 'employees';
    }
  };

  const [activeTab, setActiveTab] = useState<'employees' | 'vacations' | 'advances' | 'sanctions' | 'permissions' | 'rewards' | 'payroll'>(() => getMappedTab(storeActiveTab));

  useEffect(() => {
    setActiveTab(getMappedTab(storeActiveTab));
  }, [storeActiveTab]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [selectedEmpFor360, setSelectedEmpFor360] = useState<EmployeeRecord | null>(null);

  // Vacations Data
  const [vacations, setVacations] = useState<VacationRequest[]>([
    {
      id: 'VAC-01',
      employee_name: 'فهد العتيبي',
      vacation_type: 'إجازة اعتيادية سنوية',
      balance: 24,
      from_date: '2026-08-20',
      to_date: '2026-08-27',
      days_count: 7,
      notes: 'إجازة سنوية دورية',
      status: 'معتمد',
    },
    {
      id: 'VAC-02',
      employee_name: 'سارة خالد',
      vacation_type: 'إجازة اضطرارية',
      balance: 18,
      from_date: '2026-08-18',
      to_date: '2026-08-19',
      days_count: 2,
      notes: 'ظرف عائلي طارئ',
      status: 'بانتظار الموافقة',
    },
  ]);

  // Advances Data
  const [advances, setAdvances] = useState<AdvanceRequest[]>([
    {
      id: 'ADV-01',
      employee_name: 'إبراهيم الشمري',
      payment_method: 'تحويل بنكي راتب',
      amount: 3000,
      date: '2026-08-01',
      installments_count: 3,
      status: 'معتمد',
    },
  ]);

  // Sanctions Data
  const [sanctions, setSanctions] = useState<SanctionItem[]>([
    {
      id: 'SANC-01',
      employee_name: 'أحمد التميمي',
      sanction_type: 'تأخير غير مبرر عن الدوام',
      amount: 250,
      date: '2026-08-12',
      deduct_from_salary: true,
      reason: 'تكرار التأخير الصباحي لأكثر من 45 دقيقة',
      status: 'معتمد',
    },
  ]);

  // Permissions Data
  const [permissions, setPermissions] = useState<PermissionRequest[]>([
    {
      id: 'PERM-01',
      employee_name: 'سارة خالد',
      permission_type: 'استئذان شخصي (ساعتان)',
      date: '2026-08-17',
      time: '12:00 - 14:00',
      reason: 'مراجعة جهة حكومية رسمية',
      status: 'معتمد',
    },
  ]);

  // Rewards Data
  const [rewards, setRewards] = useState<RewardRequest[]>([
    {
      id: 'REW-01',
      employee_name: 'عبدالفتح (مسؤول الوكلاء)',
      reward_type: 'مكافأة تميز وتحقيق مستهدف العقود',
      salary: 12500,
      net_reward: 2500,
      payout_timing: 'مع راتب الشهر الحالي',
      date: '2026-08-15',
      status: 'معتمد',
    },
  ]);

  // Employee Add Form State
  const [selectedEmployeeForFile, setSelectedEmployeeForFile] = useState<EmployeeRecord | null>(null);
  const [name, setName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [jobTitle, setJobTitle] = useState('أخصائي استقدام');
  const [department, setDepartment] = useState('التشغيل والاستقدام');
  const [branch, setBranch] = useState('فرع الرياض الرئيسي');
  const [salary, setSalary] = useState('8000');

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !nationalId || !salary) return;

    const companyCode = activeCompanyId !== 'all' ? activeCompanyId : 'SAF';
    const employeeCode = `EMP-2026-${String(employees.length + 1).padStart(3, '0')}`;
    const sal = parseFloat(salary) || 8000;

    const newRecord = {
      company_id: companyCode,
      employee_code: employeeCode,
      name,
      national_id: nationalId,
      job_title: jobTitle,
      department,
      branch,
      hire_date: new Date().toISOString().slice(0, 10),
      basic_salary: sal * 0.7,
      allowances: sal * 0.3,
      salary: sal,
      leave_balance: 30,
      status: 'نشط' as const,
    };

    await createItem.mutateAsync(newRecord);
    setShowAddEmpModal(false);
    setName('');
    setNationalId('');
  };

  const handleExportWPS = () => {
    const headers = [
      'رقم الهوية / الإقامة',
      'اسم الموظف',
      'اسم البنك',
      'رقم الحساب (IBAN)',
      'الراتب الأساسي',
      'بدل السكن',
      'بدل النقل',
      'التأمينات GOSI (9.75%)',
      'صافي المحول للبنك',
      'رمز الحالة',
    ];

    const rows = employees.map((emp) => {
      const basic = emp.salary * 0.7;
      const housing = emp.salary * 0.2;
      const transport = emp.salary * 0.1;
      const gosi = (basic + housing) * 0.0975;
      const net = basic + housing + transport - gosi;
      return [
        `"${emp.national_id}"`,
        `"${emp.name}"`,
        `"مصرف الراجحي"`,
        `"SA03800000000${emp.national_id}12"`,
        basic.toFixed(2),
        housing.toFixed(2),
        transport.toFixed(2),
        gosi.toFixed(2),
        net.toFixed(2),
        `"PAID"`,
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `WPS_Payroll_KSA_${activeCompany.code}_${new Date().toISOString().slice(0, 7)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.includes(searchQuery) ||
      e.employee_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.national_id.includes(searchQuery) ||
      e.job_title.includes(searchQuery)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '900', margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-users-gear text-emerald-600"></i>
            إدارة الموارد البشرية والرواتب (HR & Payroll System)
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748B' }}>
            شؤون الموظفين، الإجازات، السلف، الجزاءات، الأذونات، مسير الرواتب WPS، والمكافآت
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowAddEmpModal(true)}
            className="button-primary-pill"
            style={{ fontSize: '13px', padding: '6px 18px', minHeight: '38px' }}
          >
            <i className="fa-solid fa-user-plus text-xs"></i>
            + إضافة موظف جديد
          </button>

          <button
            onClick={handleExportWPS}
            className="button-outline-on-light"
            style={{ fontSize: '12.5px', padding: '6px 16px', minHeight: '38px' }}
          >
            <i className="fa-solid fa-file-excel text-emerald-600 ml-1"></i>
            تصدير ملف WPS للبنك
          </button>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid #e4e4e7', paddingBottom: '12px' }}>
        {[
          { id: 'employees', label: `الموظفون (${employees.length})`, icon: 'fa-users' },
          { id: 'vacations', label: `طلبات الإجازات (${vacations.length})`, icon: 'fa-calendar-minus' },
          { id: 'advances', label: `طلبات السلف (${advances.length})`, icon: 'fa-hand-holding-dollar' },
          { id: 'sanctions', label: `جزاءات الموظف (${sanctions.length})`, icon: 'fa-scale-unbalanced' },
          { id: 'permissions', label: `طلبات الأذونات (${permissions.length})`, icon: 'fa-door-open' },
          { id: 'rewards', label: `طلبات المكافآت (${rewards.length})`, icon: 'fa-award' },
          { id: 'payroll', label: 'مسير الرواتب (WPS)', icon: 'fa-money-check-dollar' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: isActive ? '#000000' : '#e4e4e7',
                backgroundColor: isActive ? '#000000' : '#ffffff',
                color: isActive ? '#ffffff' : '#27272a',
                fontWeight: isActive ? 550 : 420,
                fontSize: '12.5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <i className={`fa-solid ${tab.icon}`} style={{ fontSize: '11px' }}></i>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Employees List */}
      {activeTab === 'employees' && (
        <div className="card-pricing" style={{ padding: 0, borderRadius: '16px', border: '1px solid #e4e4e7', background: '#ffffff', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #e4e4e7', background: '#ffffff', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', right: '14px', color: '#71717a', fontSize: '13px' }}></i>
              <input
                type="text"
                placeholder="البحث بالاسم، كود الموظف، الهوية، أو الوظيفة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-input"
                style={{
                  borderRadius: '9999px',
                  paddingRight: '36px',
                  paddingLeft: '16px',
                  height: '38px',
                  minHeight: '38px',
                  width: '320px',
                  fontSize: '13px',
                }}
              />
            </div>
            <span className="pill-tag-mint" style={{ fontSize: '12px' }}>
              إجمالي الموظفين: {filteredEmployees.length}
            </span>
          </div>

          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table className="odoo-data-table" style={{ width: '100%', textAlign: 'right' }}>
              <thead>
                <tr>
                  <th>كود الموظف</th>
                  <th>اسم الموظف</th>
                  <th>رقم الهوية</th>
                  <th>المسمى الوظيفي</th>
                  <th>القسم والفرع</th>
                  <th>الراتب الأساسي</th>
                  <th>الحالة</th>
                  <th>الملف الرقمي 360</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td style={{ fontWeight: 550, color: '#000000', fontFamily: 'monospace' }}>{emp.employee_code}</td>
                    <td>
                      <div style={{ fontWeight: 550, color: '#000000' }}>{emp.name}</div>
                      <div style={{ fontSize: '11px', color: '#71717a' }}>تاريخ التعيين: {emp.hire_date}</div>
                    </td>
                    <td style={{ fontFamily: 'monospace', color: '#71717a' }}>{emp.national_id}</td>
                    <td style={{ fontWeight: 550, color: '#000000' }}>{emp.job_title}</td>
                    <td>
                      <div>{emp.department}</div>
                      <div style={{ fontSize: '11px', color: '#71717a' }}>{emp.branch}</div>
                    </td>
                    <td style={{ fontWeight: 550, color: '#000000' }}>{(emp.salary ?? 0).toLocaleString()} ر.س</td>
                    <td><Badge text={emp.status} type={emp.status === 'نشط' ? 'success' : 'warning'} /></td>
                    <td>
                      <button
                        onClick={() => setSelectedEmployeeForFile(emp)}
                        className="button-outline-on-light"
                        style={{ padding: '4px 12px', fontSize: '11.5px', minHeight: '28px' }}
                      >
                        <i className="fa-solid fa-id-card-clip ml-1"></i> الملف الرقمي
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Vacations Requests */}
      {activeTab === 'vacations' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800' }}>طلبات الإجازات المسجلة</h3>
          <table className="odoo-table" style={{ width: '100%', textAlign: 'right' }}>
            <thead>
              <tr>
                <th>التسلسل</th>
                <th>الموظف</th>
                <th>نوع الإجازة</th>
                <th>رصيد الإجازات</th>
                <th>من تاريخ</th>
                <th>إلى تاريخ</th>
                <th>عدد الأيام</th>
                <th>ملاحظات</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {vacations.map((vac) => (
                <tr key={vac.id}>
                  <td><strong>{vac.id}</strong></td>
                  <td style={{ fontWeight: '800' }}>{vac.employee_name}</td>
                  <td>{vac.vacation_type}</td>
                  <td><strong style={{ color: '#2563EB' }}>{vac.balance} يوم</strong></td>
                  <td>{vac.from_date}</td>
                  <td>{vac.to_date}</td>
                  <td><strong>{vac.days_count} أيام</strong></td>
                  <td><span style={{ fontSize: '11px', color: '#64748B' }}>{vac.notes}</span></td>
                  <td><Badge text={vac.status} type={vac.status === 'معتمد' ? 'success' : 'warning'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Advances Requests */}
      {activeTab === 'advances' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800' }}>طلبات السلف المالية</h3>
          <table className="odoo-table" style={{ width: '100%', textAlign: 'right' }}>
            <thead>
              <tr>
                <th>التسلسل</th>
                <th>الموظف</th>
                <th>طريقة السداد</th>
                <th>القيمة</th>
                <th>التاريخ</th>
                <th>عدد الأقساط</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {advances.map((adv) => (
                <tr key={adv.id}>
                  <td><strong>{adv.id}</strong></td>
                  <td style={{ fontWeight: '800' }}>{adv.employee_name}</td>
                  <td>{adv.payment_method}</td>
                  <td><strong style={{ color: '#047857' }}>{(adv.amount ?? 0).toLocaleString()} ر.س</strong></td>
                  <td>{adv.date}</td>
                  <td>{adv.installments_count} أشهر</td>
                  <td><Badge text={adv.status} type="success" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Sanctions */}
      {activeTab === 'sanctions' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800' }}>جزاءات ومخالفات الموظف</h3>
          <table className="odoo-table" style={{ width: '100%', textAlign: 'right' }}>
            <thead>
              <tr>
                <th>التسلسل</th>
                <th>الموظف</th>
                <th>نوع الجزاء</th>
                <th>القيمة المخصومة</th>
                <th>التاريخ</th>
                <th>الخصم مع الراتب</th>
                <th>السبب</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {sanctions.map((sanc) => (
                <tr key={sanc.id}>
                  <td><strong>{sanc.id}</strong></td>
                  <td style={{ fontWeight: '800' }}>{sanc.employee_name}</td>
                  <td>{sanc.sanction_type}</td>
                  <td><strong style={{ color: '#DC2626' }}>{sanc.amount} ر.س</strong></td>
                  <td>{sanc.date}</td>
                  <td>{sanc.deduct_from_salary ? 'نعم (مباشر)' : 'لا'}</td>
                  <td style={{ fontSize: '11px', color: '#64748B' }}>{sanc.reason}</td>
                  <td><Badge text={sanc.status} type="danger" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 5: Permissions */}
      {activeTab === 'permissions' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800' }}>طلبات الأذونات والاستئذان</h3>
          <table className="odoo-table" style={{ width: '100%', textAlign: 'right' }}>
            <thead>
              <tr>
                <th>التسلسل</th>
                <th>الموظف</th>
                <th>نوع الإذن</th>
                <th>التاريخ</th>
                <th>الفترة الزمنية</th>
                <th>السبب</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm) => (
                <tr key={perm.id}>
                  <td><strong>{perm.id}</strong></td>
                  <td style={{ fontWeight: '800' }}>{perm.employee_name}</td>
                  <td>{perm.permission_type}</td>
                  <td>{perm.date}</td>
                  <td><strong>{perm.time}</strong></td>
                  <td style={{ fontSize: '11px', color: '#64748B' }}>{perm.reason}</td>
                  <td><Badge text={perm.status} type="success" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 6: Rewards */}
      {activeTab === 'rewards' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800' }}>طلبات الحوافز والمكافآت</h3>
          <table className="odoo-table" style={{ width: '100%', textAlign: 'right' }}>
            <thead>
              <tr>
                <th>التسلسل</th>
                <th>الموظف</th>
                <th>نوع المكافأة</th>
                <th>الراتب</th>
                <th>صافي قيمة المكافأة</th>
                <th>توقيت الصرف</th>
                <th>التاريخ</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {rewards.map((rew) => (
                <tr key={rew.id}>
                  <td><strong>{rew.id}</strong></td>
                  <td style={{ fontWeight: '800' }}>{rew.employee_name}</td>
                  <td>{rew.reward_type}</td>
                  <td>{rew.salary.toLocaleString()} ر.س</td>
                  <td><strong style={{ color: '#047857' }}>+{rew.net_reward.toLocaleString()} ر.س</strong></td>
                  <td>{rew.payout_timing}</td>
                  <td>{rew.date}</td>
                  <td><Badge text={rew.status} type="success" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 7: Payroll WPS */}
      {activeTab === 'payroll' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#0F172A' }}>
                مسير الرواتب المعتمد وحماية الأجور (WPS)
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748B' }}>
                احتساب التأمينات الاجتماعية (GOSI)، البدلات، والاستقطاعات البنكية المباشرة
              </p>
            </div>
            <button
              onClick={handleExportWPS}
              style={{
                backgroundColor: '#059669',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              تصدير شيت الرواتب
            </button>
          </div>

          <table className="odoo-table" style={{ width: '100%', textAlign: 'right' }}>
            <thead>
              <tr>
                <th>الموظف</th>
                <th>الراتب الأساسي (70%)</th>
                <th>بدل السكن (20%)</th>
                <th>بدل النقل (10%)</th>
                <th>التأمينات GOSI (9.75%)</th>
                <th>صافي المحول للبنك</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const basic = emp.salary * 0.7;
                const housing = emp.salary * 0.2;
                const transport = emp.salary * 0.1;
                const gosi = (basic + housing) * 0.0975;
                const net = basic + housing + transport - gosi;
                return (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ fontWeight: '800' }}>{emp.name}</div>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>{emp.job_title}</div>
                    </td>
                    <td>{basic.toLocaleString()} ر.س</td>
                    <td>{housing.toLocaleString()} ر.س</td>
                    <td>{transport.toLocaleString()} ر.س</td>
                    <td style={{ color: '#DC2626' }}>-{gosi.toFixed(2)} ر.س</td>
                    <td><strong style={{ color: '#047857' }}>{net.toFixed(2)} ر.س</strong></td>
                    <td><Badge text="جاهز للتحويل" type="success" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddEmpModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '540px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>
              إضافة موظف جديد لمنظومة العمل
            </h3>

            <form onSubmit={handleAddEmployee}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    اسم الموظف *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    رقم الهوية الوطنية / الإقامة *
                  </label>
                  <input
                    type="text"
                    required
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    المسمى الوظيفي *
                  </label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    القسم الإداري *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                  >
                    <option value="التشغيل والاستقدام">التشغيل والاستقدام</option>
                    <option value="إدارة الإيواء">إدارة الإيواء</option>
                    <option value="الإدارة المالية">الإدارة المالية</option>
                    <option value="خدمة العملاء (CRM)">خدمة العملاء (CRM)</option>
                    <option value="الموارد البشرية">الموارد البشرية</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    الفرع *
                  </label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    الراتب الإجمالي (ر.س) *
                  </label>
                  <input
                    type="number"
                    required
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddEmpModal(false)}
                  className="button-outline-on-light"
                  style={{ borderRadius: '9999px', fontSize: '12px', minHeight: '36px', padding: '6px 18px' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="button-primary-pill"
                  style={{ borderRadius: '9999px', fontSize: '12px', minHeight: '36px', padding: '6px 22px' }}
                >
                  حفظ الموظف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employee 360 Digital File Modal */}
      {selectedEmpFor360 && (
        <Employee360DigitalFileModal employee={selectedEmpFor360 as any} onClose={() => setSelectedEmpFor360(null)} />
      )}
    </div>
  );
};
