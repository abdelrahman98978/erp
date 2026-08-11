import React, { useState } from 'react';
import { useCompany } from '../contexts/CompanyContext';
import { useImpersonation } from '../contexts/ImpersonationContext';
import { CompanyId } from '../types';

export const GroupCommandCenterPage: React.FC = () => {
  const { companies, setActiveCompanyId } = useCompany();
  const { startImpersonation, auditLogs } = useImpersonation();

  const [selectedEmpId, setSelectedEmpId] = useState<string>('EMP-1042');
  const [selectedEmpName, setSelectedEmpName] = useState<string>('فهد العتيبي');
  const [selectedEmpTitle, setSelectedEmpTitle] = useState<string>('مسؤول عقود واستقدام');
  const [selectedTargetCompany, setSelectedTargetCompany] = useState<CompanyId>('masi');
  const [impersonationReason, setImpersonationReason] = useState<string>('معاينة طلبات الاستقدام ومطابقة العروض مع العميل');
  const [showImpersonateModal, setShowImpersonateModal] = useState<boolean>(false);

  const handleExecuteImpersonation = (e: React.FormEvent) => {
    e.preventDefault();
    startImpersonation(
      selectedEmpId,
      selectedEmpName,
      selectedEmpTitle,
      selectedTargetCompany,
      'الفرع الرئيسي',
      impersonationReason
    );
    setShowImpersonateModal(false);
    setActiveCompanyId(selectedTargetCompany);
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#F8FAFC', minHeight: '85vh' }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderRadius: '16px',
          padding: '24px 32px',
          color: '#FFFFFF',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                backgroundColor: 'rgba(5, 150, 105, 0.2)',
                color: '#10B981',
                border: '1px solid #059669',
                borderRadius: '12px',
                padding: '2px 10px',
                fontSize: '11px',
                fontWeight: '800',
              }}
            >
              GROUP EXECUTIVE GOVERNANCE
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>خالد السليم للاستقدام والتشغيل</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', margin: 0, fontFamily: 'Cairo, sans-serif' }}>
            مركز القيادة والرقابة التنفيذية للمجموعة (Group Executive Command Center)
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowImpersonateModal(true)}
          style={{
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 20px',
            fontWeight: '800',
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <i className="fa-solid fa-user-secret"></i>
          <span>تفعيل محاكاة موظف (Act As Employee)</span>
        </button>
      </div>

      {/* Group Consolidated Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '700' }}>إجمالي إيرادات المجموعة YTD</div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#059669', marginTop: '6px' }}>28,500,000 ر.س</div>
          <div style={{ fontSize: '11px', color: '#10B981', marginTop: '4px', fontWeight: '700' }}>+14.2% مقارنة بالعام الماضي</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '700' }}>إجمالي كادر المجموعة (Consolidated HR)</div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#2563EB', marginTop: '6px' }}>450 موظف</div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>موزعين على 18 فرعاً</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '700' }}>الطلبات السارية في جميع الشركات</div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#7C3AED', marginTop: '6px' }}>1,240 طلب</div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>استقدام وتأجير وتشغيل</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '700' }}>مرشحو مسار ATS الدولي</div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#D97706', marginTop: '6px' }}>3,410 مرشح</div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>من 5 مكاتب خارجية</div>
        </div>
      </div>

      {/* Group Companies Comparison Matrix */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginBottom: '16px', fontFamily: 'Cairo, sans-serif' }}>
          مصفوفة أداء الكيانات الأربعة (Consolidated Companies Matrix):
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                <th style={{ padding: '12px' }}>اسم الشركة / الكيان</th>
                <th style={{ padding: '12px' }}>الفروع</th>
                <th style={{ padding: '12px' }}>الكادر الوظيفي</th>
                <th style={{ padding: '12px' }}>الطلبات النشطة</th>
                <th style={{ padding: '12px' }}>إيرادات YTD</th>
                <th style={{ padding: '12px' }}>حالة الربط المحاسبي</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>التحكم</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px', fontWeight: '800', color: '#0F172A' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fa-solid fa-building text-emerald-600"></i>
                      {c.name}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>{c.branchesCount} فروع</td>
                  <td style={{ padding: '12px', fontWeight: '700' }}>{c.employeesCount} موظف</td>
                  <td style={{ padding: '12px' }}>{c.activeOrdersCount} طلب</td>
                  <td style={{ padding: '12px', fontWeight: '800', color: '#059669' }}>
                    {c.revenueYTD.toLocaleString('ar-SA')} ر.س
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ backgroundColor: '#ECFDF5', color: '#047857', padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>
                      مستقل 100% (ZATCA Ready)
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setActiveCompanyId(c.id as CompanyId)}
                      style={{
                        backgroundColor: '#1E293B',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      دخول بيئة الشركة
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Trail Section */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0, fontFamily: 'Cairo, sans-serif' }}>
            سجلات التدقيق والحماية المركزية (Group Security Audit Trail):
          </h3>
          <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>سجلات غير قابلة للتعديل أو الحذف</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {auditLogs.map((log) => (
            <div
              key={log.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                backgroundColor: '#F8FAFC',
                borderRadius: '8px',
                borderRight: '4px solid #2563EB',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: '800', fontSize: '12px', color: '#1E293B' }}>{log.actorName}</span>
                  <span style={{ fontSize: '10px', backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                    {log.actionType}
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>IP: {log.ipAddress}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>{log.details}</div>
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>
                {new Date(log.timestamp).toLocaleTimeString('ar-SA')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impersonation Modal */}
      {showImpersonateModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '28px', width: '480px', maxWidth: '90%' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#991B1B', marginBottom: '16px', fontFamily: 'Cairo, sans-serif' }}>
              <i className="fa-solid fa-user-secret" style={{ marginLeft: '8px' }}></i>
              تأكيد دخول النظام بصلاحيات موظف (Act As Employee)
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '20px' }}>
              سيتم تسجيل هذا الدخول بالكامل في سجلات التدقيق (Audit Log) مع تسجيل السبب والتوقيت ورفع بصمة العملية.
            </p>

            <form onSubmit={handleExecuteImpersonation}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  اختيار الشركةTarget Company:
                </label>
                <select
                  value={selectedTargetCompany}
                  onChange={(e) => setSelectedTargetCompany(e.target.value as CompanyId)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                >
                  <option value="masi">شركة السفير الماسي</option>
                  <option value="yaqoot">شركة ياقوت نجد</option>
                  <option value="topaz">شركة توباز للاستقدام</option>
                  <option value="ruwad">دار الرواد</option>
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  الموظف المستهدف (Target Employee):
                </label>
                <input
                  type="text"
                  value={selectedEmpName}
                  onChange={(e) => setSelectedEmpName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  سبب المحاكاة والمراجعة (Reason for Audit Log):
                </label>
                <textarea
                  value={impersonationReason}
                  onChange={(e) => setImpersonationReason(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowImpersonateModal(false)}
                  style={{ backgroundColor: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '10px 18px', fontWeight: '700', cursor: 'pointer' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: '#DC2626', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '10px 18px', fontWeight: '800', cursor: 'pointer' }}
                >
                  تأكيد ودخول النمط
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
