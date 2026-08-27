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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div
        className="card-feature-cinematic"
        style={{
          background: '#000000',
          borderRadius: '16px',
          padding: '28px',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
              GROUP EXECUTIVE GOVERNANCE
            </span>
            <span style={{ fontSize: '12px', color: '#a1a1aa' }}>خالد السليم للاستقدام والتشغيل</span>
          </div>
          <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, margin: '6px 0 0 0', letterSpacing: '-0.02em', color: '#ffffff', fontFamily: 'var(--font-family-display)' }}>
            مركز القيادة والرقابة التنفيذية للمجموعة
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowImpersonateModal(true)}
          className="button-aloe-pill"
          style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
        >
          <i className="fa-solid fa-user-secret ml-1"></i>
          <span>+ تفعيل محاكاة موظف (Act As Employee)</span>
        </button>
      </div>

      {/* Group Consolidated Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card-pistachio-band" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ fontSize: '13px', color: '#000000', fontWeight: 550 }}>إجمالي إيرادات المجموعة YTD</div>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>28,500,000 ر.س</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>+14.2% مقارنة بالعام الماضي</span>
        </div>

        <div className="card-pricing" style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #e4e4e7' }}>
          <div style={{ fontSize: '13px', color: '#71717a', fontWeight: 550 }}>إجمالي كادر المجموعة (HR)</div>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>450 موظف</div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '10px' }}>موزعين على 18 فرعاً</span>
        </div>

        <div className="card-pricing-featured" style={{ backgroundColor: '#000000', padding: '24px', borderRadius: '16px', color: '#ffffff' }}>
          <div style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 550 }}>الطلبات السارية في الشركات</div>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#ffffff', marginTop: '6px', letterSpacing: '-0.02em' }}>1,240 طلب</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>استقدام وتأجير وتشغيل</span>
        </div>

        <div className="card-pricing" style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #e4e4e7' }}>
          <div style={{ fontSize: '13px', color: '#71717a', fontWeight: 550 }}>مرشحو مسار ATS الدولي</div>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>3,410 مرشح</div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '10px' }}>من 5 مكاتب خارجية</span>
        </div>
      </div>

      {/* Group Companies Comparison Matrix */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #e4e4e7', padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000000', marginBottom: '16px' }}>
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
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #e4e4e7', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000000', margin: 0 }}>
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
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '28px', width: '480px', maxWidth: '90%', border: '1px solid #e4e4e7' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#ba1a1a', marginBottom: '16px', borderBottom: '1px solid #e4e4e7', paddingBottom: '12px' }}>
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
