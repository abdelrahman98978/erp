import React, { useState } from 'react';
import { Employee, EmployeeDocument } from '../../types';

interface Employee360DigitalFileModalProps {
  employee: Employee;
  onClose: () => void;
}

export const Employee360DigitalFileModal: React.FC<Employee360DigitalFileModalProps> = ({
  employee,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'documents' | 'contracts' | 'payroll' | 'attendance' | 'performance' | 'eos'>('info');

  const sampleDocs: EmployeeDocument[] = [
    {
      id: 'DOC-101',
      title: 'بطاقة الهوية الوطنية / الإقامة',
      category: 'هوية/إقامة',
      documentNumber: employee.national_id,
      issueDate: '2023-01-15',
      expiryDate: '2028-01-15',
      status: 'ساري',
      verified: true,
      version: 1,
    },
    {
      id: 'DOC-102',
      title: 'عقد العمل الإلكتروني التوثيقي',
      category: 'عقد عمل',
      documentNumber: 'CNT-99042',
      issueDate: employee.hire_date,
      expiryDate: '2026-08-01',
      status: 'ساري',
      verified: true,
      version: 2,
    },
    {
      id: 'DOC-103',
      title: 'شهادة الفحص الطبي المعتمدة',
      category: 'شهادة صحية',
      documentNumber: 'MED-7712',
      issueDate: '2024-02-10',
      expiryDate: '2025-02-10',
      status: 'قريب الانتهاء',
      verified: true,
      version: 1,
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          width: '900px',
          maxWidth: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            padding: '20px 24px',
            color: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#059669',
                color: '#FFFFFF',
                fontWeight: '900',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              {employee.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>
                {employee.name} (كود: {employee.employee_code})
              </div>
              <div style={{ fontSize: '12px', color: '#CBD5E1' }}>
                {employee.job_title} | {employee.department} | {employee.branch}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ backgroundColor: 'transparent', border: 'none', color: '#FFFFFF', fontSize: '20px', cursor: 'pointer' }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Modal Tabs Navigation */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            padding: '0 16px',
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'info', label: 'البيانات الشخصية والوظيفية', icon: 'fa-user' },
            { id: 'documents', label: 'مركز المستندات الرقمي', icon: 'fa-folder-open' },
            { id: 'contracts', label: 'العقود والدرجات', icon: 'fa-file-signature' },
            { id: 'payroll', label: 'الرواتب والأجور (WPS)', icon: 'fa-money-check-dollar' },
            { id: 'attendance', label: 'الحضور والإجازات', icon: 'fa-calendar-check' },
            { id: 'performance', label: 'تقييم الأداء KPIs', icon: 'fa-chart-line' },
            { id: 'eos', label: 'مكافأة نهاية الخدمة', icon: 'fa-hand-holding-dollar' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '14px 16px',
                border: 'none',
                backgroundColor: 'transparent',
                borderBottom: activeTab === tab.id ? '3px solid #059669' : '3px solid transparent',
                color: activeTab === tab.id ? '#059669' : '#64748B',
                fontWeight: activeTab === tab.id ? '800' : '600',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
              }}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Tab Contents */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'info' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '10px' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#0F172A', fontSize: '14px', fontWeight: '800' }}>
                  معلومات الهوية والاتصال:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <div><strong>رقم الهوية/الإقامة:</strong> {employee.national_id}</div>
                  <div><strong>الجنسية:</strong> {employee.nationality}</div>
                  <div><strong>البريد الإلكتروني:</strong> {employee.email}</div>
                  <div><strong>رقم الجوال:</strong> {employee.phone}</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '10px' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#0F172A', fontSize: '14px', fontWeight: '800' }}>
                  الموقع الهيكلي البنكي:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <div><strong>تاريخ التعيين:</strong> {employee.hire_date}</div>
                  <div><strong>مركز التكلفة:</strong> {employee.costCenter}</div>
                  <div><strong>البنك المعتمد:</strong> {employee.bankName}</div>
                  <div><strong>رقم الآيبان:</strong> <span style={{ fontFamily: 'monospace' }}>{employee.bankIban}</span></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800' }}>مستندات الموظف الموثقة (Document Versioning & Verification):</h4>
                <button type="button" style={{ backgroundColor: '#059669', color: '#FFF', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                  + رفع مستند جديد (OCR)
                </button>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                    <th style={{ padding: '10px' }}>عنوان المستند</th>
                    <th style={{ padding: '10px' }}>التصنيف</th>
                    <th style={{ padding: '10px' }}>رقم المستند</th>
                    <th style={{ padding: '10px' }}>تاريخ الانتهاء</th>
                    <th style={{ padding: '10px' }}>الحالة والتوثيق</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleDocs.map((doc) => (
                    <tr key={doc.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '10px', fontWeight: '700' }}>{doc.title} (V{doc.version})</td>
                      <td style={{ padding: '10px' }}>{doc.category}</td>
                      <td style={{ padding: '10px', fontFamily: 'monospace' }}>{doc.documentNumber}</td>
                      <td style={{ padding: '10px' }}>{doc.expiryDate}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{ backgroundColor: doc.status === 'ساري' ? '#ECFDF5' : '#FEF3C7', color: doc.status === 'ساري' ? '#047857' : '#D97706', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>
                          {doc.status} ({doc.verified ? 'موثق' : 'معلق'})
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'payroll' && (
            <div style={{ backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '12px' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800' }}>تفاصيل مسير الأجور وحماية الأجور (WPS):</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div style={{ backgroundColor: '#FFF', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>الراتب الأساسي</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>{(employee.basicSalary || 0).toLocaleString()} ر.س</div>
                </div>
                <div style={{ backgroundColor: '#FFF', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>البدلات المعتمدة</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#2563EB' }}>{(employee.allowances || 0).toLocaleString()} ر.س</div>
                </div>
                <div style={{ backgroundColor: '#FFF', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>إجمالي الراتب (Gross)</div>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: '#059669' }}>{employee.salary.toLocaleString()} ر.س</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'eos' && (
            <div style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', padding: '20px', borderRadius: '12px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#9A3412', fontSize: '15px', fontWeight: '800' }}>
                حساب التصفية النهائية ومكافأة نهاية الخدمة (End of Service Settlement):
              </h4>
              <p style={{ fontSize: '13px', color: '#C2410C', marginBottom: '14px' }}>
                بناءً على المادة 84 و 85 من نظام العمل السعودي، يستحق الموظف أجر نصف شهر عن كل سنة من السنوات الخمس الأولى، وأجر شهر عن كل سنة تالية.
              </p>
              <div style={{ fontSize: '16px', fontWeight: '900', color: '#9A3412' }}>
                المبلغ المقدر لمكافأة نهاية الخدمة: 42,500 ر.س (فترة خدمة: 3 سنوات و6 أشهر)
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '16px 24px', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{ backgroundColor: '#1E293B', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '8px 18px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
          >
            إغلاق الملف الرقمي
          </button>
        </div>
      </div>
    </div>
  );
};
