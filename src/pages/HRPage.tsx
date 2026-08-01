import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Employee } from '../types';

const MOCK_EMPLOYEES_FULL: Employee[] = [
  {
    id: 'emp-101',
    employee_code: 'EMP-2026-001',
    name: 'عبدالفتح (مسؤول الوكلاء)',
    national_id: '1092837410',
    job_title: 'مدير شؤون المكاتب الخارجية',
    department: 'التشغيل والاستقدام',
    branch: 'الإدارة العامة - الرياض',
    hire_date: '2022-01-15',
    salary: 12500,
    status: 'نشط'
  },
  {
    id: 'emp-102',
    employee_code: 'EMP-2026-002',
    name: 'فهد العتيبي',
    national_id: '1088273641',
    job_title: 'مشرف التشغيل والإيواء',
    department: 'إدارة الإيواء',
    branch: 'فرع الرياض',
    hire_date: '2023-03-01',
    salary: 9800,
    status: 'نشط'
  },
  {
    id: 'emp-103',
    employee_code: 'EMP-2026-003',
    name: 'إبراهيم الشمري',
    national_id: '1077283940',
    job_title: 'محاسب عام قيد وسندات',
    department: 'الإدارة المالية',
    branch: 'الإدارة العامة',
    hire_date: '2023-06-10',
    salary: 8500,
    status: 'نشط'
  },
  {
    id: 'emp-104',
    employee_code: 'EMP-2026-004',
    name: 'سارة خالد',
    national_id: '1066283910',
    job_title: 'أخصائية خدمة عملاء وواتساب',
    department: 'خدمة العملاء (CRM)',
    branch: 'فرع جدة',
    hire_date: '2024-01-10',
    salary: 7200,
    status: 'نشط'
  }
];

export const HRPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES_FULL);
  const [activeTab, setActiveTab] = useState<'employees' | 'attendances' | 'vacations' | 'payroll' | 'custodies'>('employees');

  // Modals
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);

  // Form State
  const [empForm, setEmpForm] = useState({
    name: '',
    national_id: '',
    job_title: 'أخصائي استقدام',
    department: 'التشغيل والاستقدام',
    branch: 'فرع الرياض',
    salary: ''
  });

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empForm.name || !empForm.national_id || !empForm.salary) return;

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      employee_code: `EMP-2026-00${employees.length + 1}`,
      name: empForm.name,
      national_id: empForm.national_id,
      job_title: empForm.job_title,
      department: empForm.department,
      branch: empForm.branch,
      hire_date: new Date().toISOString().slice(0, 10),
      salary: parseFloat(empForm.salary) || 0,
      status: 'نشط'
    };

    setEmployees([...employees, newEmp]);
    setShowAddEmpModal(false);
    setEmpForm({ name: '', national_id: '', job_title: 'أخصائي استقدام', department: 'التشغيل والاستقدام', branch: 'فرع الرياض', salary: '' });
    alert(`تمت إضافة الموظف الجديد (${newEmp.name}) وتوليد الملف الوظيفي والراتب بنجاح!`);
  };

  return (
    <div>
      {/* Top Banner Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Cairo, sans-serif' }}>
            <i className="fa-solid fa-users-viewfinder text-purple ml-2"></i> الموارد البشرية والرواتب (HR & Payroll Suite)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            إدارة بيانات الموظفين (34 كادر)، الحضور والانصراف، السلف، مسير الرواتب الشهرية، وعهد الفروع
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-odoo btn-odoo-purple" onClick={() => setShowAddEmpModal(true)}>
            <i className="fa-solid fa-user-plus ml-1"></i> إضافة موظف جديد
          </button>
          <button className="btn-odoo btn-odoo-primary" onClick={() => setShowAdvanceModal(true)}>
            <i className="fa-solid fa-hand-holding-dollar ml-1"></i> طلب سلفة / إجازة
          </button>
        </div>
      </div>

      {/* HR KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '18px', borderRadius: '12px', borderRight: '4px solid #005154', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '700' }}>إجمالي الموظفين والكوادر</span>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#005154', marginTop: '4px' }}>34 موظفاً</div>
          <span style={{ fontSize: '11.5px', color: 'var(--status-success)' }}>نسبة التوطين 78%</span>
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', borderRight: '4px solid #10B981', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '700' }}>معدل الحضور اليومي</span>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#10B981', marginTop: '4px' }}>98.2%</div>
          <span style={{ fontSize: '11.5px', color: '#10B981' }}>انضباط البصمة الإلكترونية</span>
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', borderRight: '4px solid #714B67', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '700' }}>مسير الرواتب الشهري</span>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#714B67', marginTop: '4px' }}>285,400 ر.س</div>
          <span style={{ fontSize: '11.5px', color: '#714B67', fontWeight: '700' }}>مكتمل وجاهز للصرف</span>
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', borderRight: '4px solid #F59E0B', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '700' }}>طلب إجازات وسلف قائمة</span>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#F59E0B', marginTop: '4px' }}>3 طلبات</div>
          <span style={{ fontSize: '11.5px', color: '#F59E0B' }}>بانتظار الاعتماد المالي</span>
        </div>
      </div>

      {/* Tabs Row */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px', overflowX: 'auto' }}>
        {[
          { id: 'employees', label: '👨‍💼 بيانات الموظفين (34)' },
          { id: 'attendances', label: '⏰ الحضور والانصراف والبصمة' },
          { id: 'vacations', label: '🏖️ طلبات الإجازات والسلف' },
          { id: 'payroll', label: '💵 مسير المرتبات والرواتب' },
          { id: 'custodies', label: '🔑 عهد وممتلكات الفروع' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`btn-odoo ${activeTab === tab.id ? 'btn-odoo-purple' : 'btn-odoo-secondary'}`}
            onClick={() => setActiveTab(tab.id as any)}
            style={{ whiteSpace: 'nowrap', fontSize: '12.5px' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Employees List */}
      {activeTab === 'employees' && (
        <div className="table-card" style={{ padding: '24px' }}>
          <table className="odoo-data-table">
            <thead>
              <tr>
                <th>كود الموظف</th>
                <th>اسم الموظف والهوية</th>
                <th>المسمى الوظيفي</th>
                <th>القسم والفرع</th>
                <th>تاريخ التعيين</th>
                <th>الراتب الأساسي</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{emp.employee_code}</td>
                  <td>
                    <div style={{ fontWeight: '700' }}>{emp.name}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>هوية: {emp.national_id}</div>
                  </td>
                  <td style={{ fontWeight: '600' }}>{emp.job_title}</td>
                  <td>
                    <Badge text={emp.department} type="purple" />
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{emp.branch}</div>
                  </td>
                  <td style={{ fontSize: '12.5px' }}>{emp.hire_date}</td>
                  <td style={{ fontWeight: '800', color: '#005154' }}>{emp.salary.toLocaleString()} ر.س</td>
                  <td><Badge text={emp.status} type="success" /></td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button className="btn-odoo btn-odoo-secondary" style={{ padding: '4px 8px', fontSize: '11.5px' }}>تعديل</button>
                      <button className="btn-odoo btn-odoo-purple" style={{ padding: '4px 8px', fontSize: '11.5px' }} onClick={() => alert(`توليد مفردات مرتب الموظف (${emp.name})`)}>مسير الراتب</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Payroll & Salaries */}
      {activeTab === 'payroll' && (
        <div className="table-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154', margin: 0 }}>
              💵 مسير الرواتب الشهرية والخصومات (شهر يوليو 2026)
            </h3>
            <button className="btn-odoo btn-odoo-purple" onClick={() => alert('تصدير كشف مسير الرواتب البنكي (WPS) لجميع الموظفين')}>
              <i className="fa-solid fa-file-export ml-1"></i> تصدير ملف البنك WPS
            </button>
          </div>

          <table className="odoo-data-table">
            <thead>
              <tr>
                <th>كود الموظف</th>
                <th>اسم الموظف</th>
                <th>الراتب الأساسي</th>
                <th>البدلات والمكافآت</th>
                <th>الخصومات والسلف</th>
                <th>صافي الراتب المستحق</th>
                <th>حالة الصرف</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{emp.employee_code}</td>
                  <td style={{ fontWeight: '700' }}>{emp.name}</td>
                  <td style={{ fontWeight: '700' }}>{emp.salary.toLocaleString()} ر.س</td>
                  <td style={{ color: '#10B981', fontWeight: '700' }}>+1,500.00 ر.س</td>
                  <td style={{ color: '#EF4444', fontWeight: '700' }}>-500.00 ر.س</td>
                  <td style={{ fontWeight: '900', color: '#005154' }}>{(emp.salary + 1000).toLocaleString()} ر.س</td>
                  <td><Badge text="مكتمل ومحول للبنك" type="success" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddEmpModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="table-card" style={{ width: '520px', padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154' }}>
                إضافة موظف جديد للنظام
              </h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setShowAddEmpModal(false)}></i>
            </div>

            <form onSubmit={handleAddEmployee}>
              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">اسم الموظف الرباعي *</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="الاسم الثلاثي أو الرباعي..."
                  value={empForm.name}
                  onChange={e => setEmpForm({ ...empForm, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="filter-group">
                  <label className="filter-label">رقم الهوية الوطنية / الإقامة *</label>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="10 أرقام..."
                    value={empForm.national_id}
                    onChange={e => setEmpForm({ ...empForm, national_id: e.target.value })}
                    required
                  />
                </div>
                <div className="filter-group">
                  <label className="filter-label">الراتب الأساسي بالريال *</label>
                  <input
                    type="number"
                    className="filter-input"
                    placeholder="0.00"
                    value={empForm.salary}
                    onChange={e => setEmpForm({ ...empForm, salary: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div className="filter-group">
                  <label className="filter-label">القسم المخصص *</label>
                  <select
                    className="filter-select"
                    value={empForm.department}
                    onChange={e => setEmpForm({ ...empForm, department: e.target.value })}
                  >
                    <option>التشغيل والاستقدام</option>
                    <option>إدارة الإيواء</option>
                    <option>الإدارة المالية</option>
                    <option>خدمة العملاء (CRM)</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label className="filter-label">الفرع المربوط *</label>
                  <select
                    className="filter-select"
                    value={empForm.branch}
                    onChange={e => setEmpForm({ ...empForm, branch: e.target.value })}
                  >
                    <option>فرع الرياض الرئيسي</option>
                    <option>فرع جدة</option>
                    <option>فرع الخبر</option>
                    <option>الإدارة العامة</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-odoo btn-odoo-secondary" onClick={() => setShowAddEmpModal(false)}>إلغاء</button>
                <button type="submit" className="btn-odoo btn-odoo-purple">إضافة الموظف واعتماد الملف</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Advance Request Modal */}
      {showAdvanceModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="table-card" style={{ width: '480px', padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154' }}>
                تقديم طلب سلفة أو إجازة موظف
              </h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setShowAdvanceModal(false)}></i>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              تقديم طلب سلفة راتب أو إجازة سنوية وتوجيهه تلقائياً للموارد البشرية والمالية للاعتماد.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="btn-odoo btn-odoo-secondary" onClick={() => setShowAdvanceModal(false)}>إلغاء</button>
              <button className="btn-odoo btn-odoo-purple" onClick={() => { setShowAdvanceModal(false); alert('تمت إضافة وإرسال الطلب للموارد البشرية بنجاح!'); }}>إرسال الطلب للاعتماد</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRPage;
