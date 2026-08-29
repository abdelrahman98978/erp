import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useEmployees, useTableMutation } from '../hooks/queries/useErpQueries';
import { useCompany } from '../contexts/CompanyContext';
import { Employee360DigitalFileModal } from '../components/hr/Employee360DigitalFileModal';
import { useAppStore } from '../stores/appStore';
import { Users, Plus, FileSpreadsheet, FileText, Search, UserCheck, CalendarMinus, DollarSign, AlertCircle, Clock, Award, ShieldCheck, X, Trash2 } from 'lucide-react';

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
  const { createItem, updateItem, deleteItem } = useTableMutation('employees');
  const { addNotification } = useAppStore();

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
    if (storeActiveTab === 'add-employee') {
      setShowAddEmpModal(true);
    }
  }, [storeActiveTab]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddEmpModal, setShowAddEmpModal] = useState(() => storeActiveTab === 'add-employee');
  const [selectedEmpFor360, setSelectedEmpFor360] = useState<EmployeeRecord | null>(null);

  // Form State for Adding Employee
  const [name, setName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [jobTitle, setJobTitle] = useState('أخصائي خدمة عملاء');
  const [department, setDepartment] = useState('إدارة العمليات');
  const [branch, setBranch] = useState('فرع الرياض الرئيسي');
  const [salary, setSalary] = useState('8000');

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !nationalId || !salary) return;

    const companyCode = activeCompanyId !== 'all' ? activeCompanyId : 'SAF';
    const employeeCode = `EMP-2026-${String(employees.length + 1).padStart(3, '0')}`;
    const sal = parseFloat(salary) || 8000;

    const newRecord = {
      id: employeeCode,
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
    addNotification({
      title: 'إضافة موظف جديد',
      message: `تم تسجيل الموظف (${name}) بكود #${employeeCode} في منظومة الموارد البشرية.`,
      type: 'success',
    });
    setShowAddEmpModal(false);
    setName('');
    setNationalId('');
  };

  const handleDeleteEmployee = async (emp: EmployeeRecord) => {
    if (window.confirm(`هل أنت متأكد من حذف ملف الموظف (${emp.name})؟`)) {
      await deleteItem.mutateAsync(emp.id);
      addNotification({
        title: 'حذف ملف موظف',
        message: `تم حذف ملف الموظف (${emp.name}) بنجاح.`,
        type: 'error',
      });
    }
  };

  // Vacations Data
  const [vacations] = useState<VacationRequest[]>([
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
  const [advances] = useState<AdvanceRequest[]>([
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
  const [sanctions] = useState<SanctionItem[]>([
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
  const [permissions] = useState<PermissionRequest[]>([
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
  const [rewards] = useState<RewardRequest[]>([
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
    <div className="space-y-6">
      {/* Top Banner */}
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
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>HR & PAYROLL SUITE</span>
            </div>
            <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
              إدارة الموارد البشرية والرواتب
            </h1>
            <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '4px 0 0 0', fontWeight: 420 }}>
              شؤون الموظفين، الإجازات، السلف، الجزاءات، الأذونات، مسير الرواتب WPS، والمكافآت لـ {activeCompany.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddEmpModal(true)}
            className="button-white-pill"
            style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
          >
            <Plus className="w-4 h-4 ml-1" />
            <span>+ إضافة موظف جديد</span>
          </button>

          <button
            onClick={handleExportWPS}
            className="button-outline-on-dark"
            style={{ fontSize: '12px', padding: '6px 16px', minHeight: '38px' }}
          >
            <FileSpreadsheet className="w-4 h-4 ml-1 text-emerald-400" />
            <span>تصدير ملف WPS للبنك</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-3">
        {[
          { id: 'employees', label: `الموظفون (${employees.length})`, icon: Users },
          { id: 'vacations', label: `طلبات الإجازات (${vacations.length})`, icon: CalendarMinus },
          { id: 'advances', label: `طلبات السلف (${advances.length})`, icon: DollarSign },
          { id: 'sanctions', label: `جزاءات الموظف (${sanctions.length})`, icon: AlertCircle },
          { id: 'permissions', label: `طلبات الأذونات (${permissions.length})`, icon: Clock },
          { id: 'rewards', label: `طلبات المكافآت (${rewards.length})`, icon: Award },
          { id: 'payroll', label: 'مسير الرواتب (WPS)', icon: ShieldCheck },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
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
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Employees List */}
      {activeTab === 'employees' && (
        <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
          <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-white flex-wrap gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute right-3 top-3 text-zinc-400" />
              <input
                type="text"
                placeholder="البحث بالاسم، كود الموظف، الهوية، أو الوظيفة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-input"
                style={{ width: '100%', height: '36px', minHeight: '36px', borderRadius: '9999px', paddingRight: '36px', fontSize: '12px' }}
              />
            </div>
            <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
              إجمالي الموظفين: {filteredEmployees.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3.5">كود الموظف</th>
                  <th className="p-3.5">اسم الموظف</th>
                  <th className="p-3.5">رقم الهوية</th>
                  <th className="p-3.5">المسمى الوظيفي</th>
                  <th className="p-3.5">القسم والفرع</th>
                  <th className="p-3.5">الراتب الأساسي</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5 text-center">الملف الرقمي 360</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-zinc-50">
                    <td className="p-3.5 font-mono font-bold text-black">{emp.employee_code}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-black">{emp.name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">تاريخ التعيين: {emp.hire_date}</div>
                    </td>
                    <td className="p-3.5 font-mono text-zinc-500">{emp.national_id}</td>
                    <td className="p-3.5 font-semibold text-black">{emp.job_title}</td>
                    <td className="p-3.5">
                      <div className="font-semibold text-zinc-800">{emp.department}</div>
                      <div className="text-[11px] text-zinc-400">{emp.branch}</div>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-700">{(emp.salary ?? 0).toLocaleString()} ر.س</td>
                    <td className="p-3.5"><Badge text={emp.status} type={emp.status === 'نشط' ? 'success' : 'warning'} /></td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedEmpFor360(emp)}
                          className="button-outline-on-light"
                          style={{ padding: '3px 10px', fontSize: '11px', minHeight: '26px' }}
                        >
                          <UserCheck className="w-3 h-3 ml-1" />
                          <span>الملف الرقمي</span>
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(emp)}
                          className="p-1 rounded-full hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition-colors"
                          title="حذف ملف الموظف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
        <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
          <div className="p-4 border-b border-zinc-100 bg-white">
            <h3 className="text-sm font-bold text-black">طلبات الإجازات المسجلة</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3.5">التسلسل</th>
                  <th className="p-3.5">الموظف</th>
                  <th className="p-3.5">نوع الإجازة</th>
                  <th className="p-3.5">رصيد الإجازات</th>
                  <th className="p-3.5">من تاريخ</th>
                  <th className="p-3.5">إلى تاريخ</th>
                  <th className="p-3.5">عدد الأيام</th>
                  <th className="p-3.5">ملاحظات</th>
                  <th className="p-3.5">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {vacations.map((vac) => (
                  <tr key={vac.id} className="hover:bg-zinc-50">
                    <td className="p-3.5 font-mono font-bold text-black">{vac.id}</td>
                    <td className="p-3.5 font-bold text-black">{vac.employee_name}</td>
                    <td className="p-3.5">{vac.vacation_type}</td>
                    <td className="p-3.5 font-mono font-bold text-black">{vac.balance} يوم</td>
                    <td className="p-3.5 font-mono text-zinc-500">{vac.from_date}</td>
                    <td className="p-3.5 font-mono text-zinc-500">{vac.to_date}</td>
                    <td className="p-3.5 font-bold text-black">{vac.days_count} أيام</td>
                    <td className="p-3.5 text-zinc-500">{vac.notes}</td>
                    <td className="p-3.5"><Badge text={vac.status} type={vac.status === 'معتمد' ? 'success' : 'warning'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Advances Requests */}
      {activeTab === 'advances' && (
        <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
          <div className="p-4 border-b border-zinc-100 bg-white">
            <h3 className="text-sm font-bold text-black">طلبات السلف المالية</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3.5">التسلسل</th>
                  <th className="p-3.5">الموظف</th>
                  <th className="p-3.5">طريقة السداد</th>
                  <th className="p-3.5">القيمة</th>
                  <th className="p-3.5">التاريخ</th>
                  <th className="p-3.5">عدد الأقساط</th>
                  <th className="p-3.5">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {advances.map((adv) => (
                  <tr key={adv.id} className="hover:bg-zinc-50">
                    <td className="p-3.5 font-mono font-bold text-black">{adv.id}</td>
                    <td className="p-3.5 font-bold text-black">{adv.employee_name}</td>
                    <td className="p-3.5">{adv.payment_method}</td>
                    <td className="p-3.5 font-mono font-bold text-emerald-700">{(adv.amount ?? 0).toLocaleString()} ر.س</td>
                    <td className="p-3.5 font-mono text-zinc-500">{adv.date}</td>
                    <td className="p-3.5 font-bold text-black">{adv.installments_count} أشهر</td>
                    <td className="p-3.5"><Badge text={adv.status} type="success" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Sanctions */}
      {activeTab === 'sanctions' && (
        <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
          <div className="p-4 border-b border-zinc-100 bg-white">
            <h3 className="text-sm font-bold text-black">جزاءات ومخالفات الموظف</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3.5">التسلسل</th>
                  <th className="p-3.5">الموظف</th>
                  <th className="p-3.5">نوع الجزاء</th>
                  <th className="p-3.5">القيمة المخصومة</th>
                  <th className="p-3.5">التاريخ</th>
                  <th className="p-3.5">الخصم مع الراتب</th>
                  <th className="p-3.5">السبب</th>
                  <th className="p-3.5">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {sanctions.map((sanc) => (
                  <tr key={sanc.id} className="hover:bg-zinc-50">
                    <td className="p-3.5 font-mono font-bold text-black">{sanc.id}</td>
                    <td className="p-3.5 font-bold text-black">{sanc.employee_name}</td>
                    <td className="p-3.5">{sanc.sanction_type}</td>
                    <td className="p-3.5 font-mono font-bold text-rose-700">{sanc.amount} ر.س</td>
                    <td className="p-3.5 font-mono text-zinc-500">{sanc.date}</td>
                    <td className="p-3.5">{sanc.deduct_from_salary ? 'نعم (مباشر)' : 'لا'}</td>
                    <td className="p-3.5 text-zinc-500">{sanc.reason}</td>
                    <td className="p-3.5"><Badge text={sanc.status} type="danger" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Permissions */}
      {activeTab === 'permissions' && (
        <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
          <div className="p-4 border-b border-zinc-100 bg-white">
            <h3 className="text-sm font-bold text-black">طلبات الأذونات والاستئذان</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3.5">التسلسل</th>
                  <th className="p-3.5">الموظف</th>
                  <th className="p-3.5">نوع الإذن</th>
                  <th className="p-3.5">التاريخ</th>
                  <th className="p-3.5">الفترة الزمنية</th>
                  <th className="p-3.5">السبب</th>
                  <th className="p-3.5">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {permissions.map((perm) => (
                  <tr key={perm.id} className="hover:bg-zinc-50">
                    <td className="p-3.5 font-mono font-bold text-black">{perm.id}</td>
                    <td className="p-3.5 font-bold text-black">{perm.employee_name}</td>
                    <td className="p-3.5">{perm.permission_type}</td>
                    <td className="p-3.5 font-mono text-zinc-500">{perm.date}</td>
                    <td className="p-3.5 font-bold text-black">{perm.time}</td>
                    <td className="p-3.5 text-zinc-500">{perm.reason}</td>
                    <td className="p-3.5"><Badge text={perm.status} type="success" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Rewards */}
      {activeTab === 'rewards' && (
        <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
          <div className="p-4 border-b border-zinc-100 bg-white">
            <h3 className="text-sm font-bold text-black">طلبات الحوافز والمكافآت</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3.5">التسلسل</th>
                  <th className="p-3.5">الموظف</th>
                  <th className="p-3.5">نوع المكافأة</th>
                  <th className="p-3.5">الراتب</th>
                  <th className="p-3.5">صافي قيمة المكافأة</th>
                  <th className="p-3.5">توقيت الصرف</th>
                  <th className="p-3.5">التاريخ</th>
                  <th className="p-3.5">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {rewards.map((rew) => (
                  <tr key={rew.id} className="hover:bg-zinc-50">
                    <td className="p-3.5 font-mono font-bold text-black">{rew.id}</td>
                    <td className="p-3.5 font-bold text-black">{rew.employee_name}</td>
                    <td className="p-3.5">{rew.reward_type}</td>
                    <td className="p-3.5 font-mono">{rew.salary.toLocaleString()} ر.س</td>
                    <td className="p-3.5 font-mono font-bold text-emerald-700">+{rew.net_reward.toLocaleString()} ر.س</td>
                    <td className="p-3.5 text-zinc-600">{rew.payout_timing}</td>
                    <td className="p-3.5 font-mono text-zinc-500">{rew.date}</td>
                    <td className="p-3.5"><Badge text={rew.status} type="success" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 7: Payroll WPS */}
      {activeTab === 'payroll' && (
        <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
          <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-white">
            <div>
              <h3 className="text-sm font-bold text-black">
                مسير الرواتب المعتمد وحماية الأجور (WPS)
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                احتساب التأمينات الاجتماعية (GOSI)، البدلات، والاستقطاعات البنكية المباشرة
              </p>
            </div>
            <button
              onClick={handleExportWPS}
              className="button-primary-pill"
              style={{ fontSize: '12px', padding: '6px 16px', minHeight: '34px' }}
            >
              <FileSpreadsheet className="w-4 h-4 ml-1" />
              <span>تصدير شيت الرواتب</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3.5">الموظف</th>
                  <th className="p-3.5">الراتب الأساسي (70%)</th>
                  <th className="p-3.5">بدل السكن (20%)</th>
                  <th className="p-3.5">بدل النقل (10%)</th>
                  <th className="p-3.5">التأمينات GOSI (9.75%)</th>
                  <th className="p-3.5">صافي المحول للبنك</th>
                  <th className="p-3.5">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {employees.map((emp) => {
                  const basic = emp.salary * 0.7;
                  const housing = emp.salary * 0.2;
                  const transport = emp.salary * 0.1;
                  const gosi = (basic + housing) * 0.0975;
                  const net = basic + housing + transport - gosi;
                  return (
                    <tr key={emp.id} className="hover:bg-zinc-50">
                      <td className="p-3.5">
                        <div className="font-bold text-black">{emp.name}</div>
                        <div className="text-[11px] text-zinc-400">{emp.job_title}</div>
                      </td>
                      <td className="p-3.5 font-mono">{basic.toLocaleString()} ر.س</td>
                      <td className="p-3.5 font-mono">{housing.toLocaleString()} ر.س</td>
                      <td className="p-3.5 font-mono">{transport.toLocaleString()} ر.س</td>
                      <td className="p-3.5 font-mono text-rose-700">-{gosi.toFixed(2)} ر.س</td>
                      <td className="p-3.5 font-mono font-bold text-emerald-700">{net.toFixed(2)} ر.س</td>
                      <td className="p-3.5"><Badge text="جاهز للتحويل" type="success" /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddEmpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden font-sans">
            <div className="p-5 bg-black text-white flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>إضافة موظف جديد لمنظومة العمل</span>
              </h3>
              <button onClick={() => setShowAddEmpModal(false)} className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="p-6 space-y-4 bg-white text-black">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">اسم الموظف *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">رقم الهوية / الإقامة *</label>
                  <input
                    type="text"
                    required
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">المسمى الوظيفي *</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">القسم الإداري *</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  >
                    <option value="التشغيل والاستقدام">التشغيل والاستقدام</option>
                    <option value="إدارة الإيواء">إدارة الإيواء</option>
                    <option value="الإدارة المالية">الإدارة المالية</option>
                    <option value="خدمة العملاء (CRM)">خدمة العملاء (CRM)</option>
                    <option value="الموارد البشرية">الموارد البشرية</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">الفرع *</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">الراتب الإجمالي (ر.س) *</label>
                  <input
                    type="number"
                    required
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono font-bold focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddEmpModal(false)}
                  className="button-outline-on-light"
                  style={{ minHeight: '36px', padding: '6px 16px', fontSize: '13px' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="button-primary-pill"
                  style={{ minHeight: '36px', padding: '6px 20px', fontSize: '13px' }}
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

export default HRPage;
