import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useEmployees, useTableMutation } from '../hooks/queries/useErpQueries';
import { useCompany } from '../contexts/CompanyContext';
import { Employee360DigitalFileModal } from '../components/hr/Employee360DigitalFileModal';

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

  const [activeTab, setActiveTab] = useState<'employees' | 'payroll' | 'vacations'>('employees');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [selectedEmpFor360, setSelectedEmpFor360] = useState<EmployeeRecord | null>(null);

  // Form State
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
      status: 'نشط',
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

  const filteredEmployees = employees.filter((e) =>
    e.name.includes(searchQuery) ||
    e.employee_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.national_id.includes(searchQuery) ||
    e.job_title.includes(searchQuery)
  );

  const totalPayroll = employees.reduce((acc, e) => acc + (e.salary || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <i className="fa-solid fa-users-viewfinder text-purple-700"></i>
            الموارد البشرية ومسير الرواتب (HRIS & WPS Payroll Suite)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            إدارة الكوادر الوظيفية، مسير الرواتب المعتمد لحماية الأجور، والإجازات لـ{' '}
            <strong className="text-slate-700">{activeCompany.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddEmpModal(true)}
            className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-sm shadow-md shadow-purple-200 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-user-plus"></i>
            إضافة موظف جديد
          </button>
          <button
            onClick={handleExportWPS}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-200 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-file-invoice-dollar"></i>
            تصدير ملف حماية الأجور (WPS)
          </button>
          <button
            onClick={() => exportData('employees', filteredEmployees, 'excel', `سجل الموظفين - ${activeCompany.name}`)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="تصدير إكسيل"
          >
            <i className="fa-solid fa-file-excel text-emerald-600 ml-1.5"></i>
            Excel
          </button>
          <button
            onClick={() => exportData('employees', filteredEmployees, 'csv', `سجل الموظفين - ${activeCompany.name}`)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="تصدير CSV"
          >
            <i className="fa-solid fa-file-csv text-blue-600 ml-1.5"></i>
            CSV
          </button>
          <button
            onClick={() => exportData('employees', filteredEmployees, 'pdf', `سجل الموظفين - ${activeCompany.name}`)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="تصدير PDF"
          >
            <i className="fa-solid fa-file-pdf text-rose-600 ml-1.5"></i>
            PDF
          </button>
          <button
            onClick={() => exportData('employees', filteredEmployees, 'print', `سجل الموظفين والكوادر - ${activeCompany.name}`)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="طباعة التقرير المعتمد"
          >
            <i className="fa-solid fa-print text-purple-700 ml-1.5"></i>
            طباعة
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400">إجمالي الكوادر المسجلة</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{employees.length} موظفاً</div>
          <span className="text-xs text-emerald-600 font-bold mt-1 inline-block">نسبة التوطين 78%</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400">مسير الرواتب الشهري</span>
          <div className="text-2xl font-black text-purple-700 mt-1">{totalPayroll.toLocaleString()} ر.س</div>
          <span className="text-xs text-slate-400 font-medium">شامل البدلات والتأمينات</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400">متوسط الراتب</span>
          <div className="text-2xl font-black text-teal-700 mt-1">
            {(totalPayroll / (employees.length || 1)).toFixed(0)} ر.س
          </div>
          <span className="text-xs text-slate-400 font-medium">معدل الرواتب</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400">طلبات الإجازات القائمة</span>
          <div className="text-2xl font-black text-amber-600 mt-1">2 طلبات</div>
          <span className="text-xs text-amber-600 font-bold mt-1 inline-block">بانتظار الاعتماد</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'employees' ? 'bg-purple-700 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <i className="fa-solid fa-users"></i>
          سجل الموظفين والملفات ({employees.length})
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'payroll' ? 'bg-purple-700 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <i className="fa-solid fa-money-check-dollar"></i>
          مسير الرواتب المعتمد (WPS)
        </button>
      </div>

      {/* Content */}
      {activeTab === 'employees' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="ابحث باسم الموظف، الكود، أو الهوية الوطنية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-600 transition-colors"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">كود الموظف</th>
                  <th className="py-3.5 px-4">اسم الموظف والهوية</th>
                  <th className="py-3.5 px-4">المسمى الوظيفي</th>
                  <th className="py-3.5 px-4">القسم والفرع</th>
                  <th className="py-3.5 px-4">تاريخ التعيين</th>
                  <th className="py-3.5 px-4">الراتب الإجمالي</th>
                  <th className="py-3.5 px-4">الحالة</th>
                  <th className="py-3.5 px-4 text-center">الملف 360°</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-slate-400">
                      <i className="fa-solid fa-spinner fa-spin ml-2"></i> جاري استرجاع سجلات الموظفين...
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-slate-400">
                      لا يوجد موظفون مطابقون للبحث
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-black text-purple-700">{emp.employee_code}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{emp.name}</div>
                        <div className="text-xs text-slate-400 font-mono">هوية: {emp.national_id}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{emp.job_title}</td>
                      <td className="py-3.5 px-4 text-xs">
                        <Badge text={emp.department} type="purple" />
                        <div className="text-slate-400 mt-0.5">{emp.branch}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">{emp.hire_date}</td>
                      <td className="py-3.5 px-4 font-bold text-teal-800">{emp.salary.toLocaleString()} ر.س</td>
                      <td className="py-3.5 px-4">
                        <Badge text={emp.status} type="success" />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setSelectedEmpFor360(emp)}
                          className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 mx-auto"
                        >
                          <i className="fa-solid fa-id-card"></i> الملف الرقمي 360°
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Payroll Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-file-invoice-dollar text-emerald-600"></i>
              كشف مسير الرواتب الشهرية المعتمد لحماية الأجور (WPS Payroll Sheet)
            </h3>
            <button
              onClick={handleExportWPS}
              className="px-3.5 py-1.5 bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm hover:bg-emerald-800 transition-all flex items-center gap-1.5"
            >
              <i className="fa-solid fa-download"></i> تصدير ملف البنك
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">اسم الموظف</th>
                  <th className="py-3.5 px-4">الراتب الأساسي (70%)</th>
                  <th className="py-3.5 px-4">بدل السكن (20%)</th>
                  <th className="py-3.5 px-4">بدل النقل (10%)</th>
                  <th className="py-3.5 px-4">التأمينات GOSI (9.75%)</th>
                  <th className="py-3.5 px-4 font-black text-emerald-800">صافي الراتب المحول</th>
                  <th className="py-3.5 px-4">حالة المسير</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {employees.map((emp) => {
                  const basic = emp.salary * 0.7;
                  const housing = emp.salary * 0.2;
                  const transport = emp.salary * 0.1;
                  const gosi = (basic + housing) * 0.0975;
                  const net = basic + housing + transport - gosi;
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{emp.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{emp.national_id}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{basic.toLocaleString()} ر.س</td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">{housing.toLocaleString()} ر.س</td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">{transport.toLocaleString()} ر.س</td>
                      <td className="py-3.5 px-4 text-xs font-bold text-rose-600">{gosi.toFixed(2)} ر.س</td>
                      <td className="py-3.5 px-4 font-black text-emerald-700">{net.toFixed(2)} ر.س</td>
                      <td className="py-3.5 px-4">
                        <Badge text="معتمد وجاهز للصرف" type="success" />
                      </td>
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden font-sans">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-user-plus text-purple-400"></i>
                <h3 className="font-bold text-base">تسجيل موظف جديد بالنظام</h3>
              </div>
              <button onClick={() => setShowAddEmpModal(false)} className="text-slate-400 hover:text-white">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم الموظف بالكامل *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="الاسم الرباعي..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم الهوية الوطنية / الإقامة *</label>
                  <input
                    type="text"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="10 أرقام..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">المسمى الوظيفي *</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="المسمى الوظيفي..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">القسم / الإدارة</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                  >
                    <option>التشغيل والاستقدام</option>
                    <option>إدارة الإيواء</option>
                    <option>الإدارة المالية</option>
                    <option>خدمة العملاء (CRM)</option>
                    <option>الموارد البشرية</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">الراتب الإجمالي (ر.س) *</label>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddEmpModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-sm font-bold shadow-md shadow-purple-200 transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-check"></i>
                  حفظ وتسجيل الموظف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employee 360 Modal */}
      {selectedEmpFor360 && (
        <Employee360DigitalFileModal
          employee={selectedEmpFor360 as any}
          onClose={() => setSelectedEmpFor360(null)}
        />
      )}
    </div>
  );
};

export default HRPage;
