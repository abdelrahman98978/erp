import React from 'react';
import { useCompany } from '../../contexts/CompanyContext';
import { CompanyId } from '../../types';
import { CompanyLogo } from '../common/CompanyLogo';

interface CompanySelectorPortalProps {
  onSelectCompany: (companyId: CompanyId) => void;
}

export const CompanySelectorPortal: React.FC<CompanySelectorPortalProps> = ({ onSelectCompany }) => {
  const { companies, activeCompanyId, setActiveCompanyId } = useCompany();

  const handleChoose = (id: CompanyId) => {
    setActiveCompanyId(id);
    onSelectCompany(id);
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#F8FAFC', minHeight: '85vh' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderRadius: '16px',
          padding: '32px',
          color: '#FFFFFF',
          marginBottom: '32px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span
              style={{
                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                color: '#F59E0B',
                border: '1px solid #D4AF37',
                borderRadius: '20px',
                padding: '4px 14px',
                fontSize: '12px',
                fontWeight: '800',
              }}
            >
              Enterprise Multi-Company Scope
            </span>
            <span style={{ fontSize: '13px', color: '#94A3B8' }}>مجموعة شركات خالد السليم</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', margin: '0 0 6px 0', color: '#ffffff' }}>
            بوابة اختيار الكيانات التشغيلية والشركات المستقلة
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '13.5px', margin: 0, maxWidth: '650px' }}>
            اختر بيئة العمل الخاصة بالشركة للوصول إلى الدفاتر المحاسبية المستقلة، سجلات الموظفين، عقود الاستقدام، والتقارير التنفيذية مع الحفاظ التام على عزل البيانات.
          </p>
        </div>

        {/* Global Group Admin Button */}
        <button
          type="button"
          onClick={() => handleChoose('all')}
          className="button-white-pill"
          style={{
            padding: '12px 24px',
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <i className="fa-solid fa-globe" style={{ fontSize: '16px' }}></i>
          <span>الدخول للإدارة المركزية للمجموعة (All Companies)</span>
        </button>
      </div>

      {/* Grid of 4 Operating Companies */}
      <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1E293B', marginBottom: '20px' }}>
        الشركات والكيانات التشغيلية المعتمدة (Legal Entities):
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {companies.map((comp) => {
          const isCurrent = activeCompanyId === comp.id;
          const isKas = comp.id === 'KAS' || comp.id === 'kas';
          return (
            <div
              key={comp.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: isKas 
                  ? '2px solid #059669' 
                  : isCurrent 
                  ? '2px solid #2563EB' 
                  : '1px solid #E2E8F0',
                boxShadow: isKas
                  ? '0 10px 30px rgba(5, 150, 105, 0.18)'
                  : isCurrent
                  ? '0 10px 30px rgba(37, 99, 235, 0.15)'
                  : '0 4px 15px rgba(0,0,0,0.05)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, boxShadow 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {isKas && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: '#059669',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: '900',
                    padding: '3px 16px',
                    borderBottomLeftRadius: '12px',
                    letterSpacing: '0.05em',
                  }}
                >
                  منظومة سحابة اعتماد
                </div>
              )}

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CompanyLogo companyId={comp.id as CompanyId} size={54} />
                    <span
                      style={{
                        backgroundColor: isKas ? '#064E3B' : '#0F172A',
                        color: isKas ? '#34D399' : '#38BDF8',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontWeight: '900',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                      }}
                    >
                      {comp.code}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      backgroundColor: '#F1F5F9',
                      color: '#475569',
                    }}
                  >
                    CR: {comp.crNumber}
                  </span>
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#000000', marginBottom: '4px' }}>
                  {comp.name}
                </h3>
                <div style={{ fontSize: '12px', color: '#71717a', marginBottom: '16px', fontWeight: 500 }}>
                  {isKas ? 'KAS Trading & Contracting • سحابة اعتماد وإدارة المنافسات' : comp.nameEn}
                </div>

                {/* Company Stats Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    backgroundColor: isKas ? '#F0FDF4' : '#F8FAFC',
                    padding: '12px',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    border: isKas ? '1px solid #BBF7D0' : 'none',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{isKas ? 'المنافسات النشطة' : 'الفروع النشطة'}</div>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: isKas ? '#059669' : '#0F172A' }}>
                      {isKas ? '6 منافسات' : `${comp.branchesCount} فروع`}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{isKas ? 'فريق العمل' : 'إجمالي الكادر'}</div>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#059669' }}>
                      {isKas ? '4 أعضاء' : `${comp.employeesCount} موظف`}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{isKas ? 'المبيعات المعتمدة' : 'الطلبات السارية'}</div>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#2563EB' }}>
                      {isKas ? '106,006 ر.س' : `${comp.activeOrdersCount} طلب`}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>الرقم الضريبي</div>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#475569', fontFamily: 'monospace' }}>
                      {comp.taxNumber.slice(0, 10)}...
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleChoose(comp.id as CompanyId)}
                className={isKas ? 'button-aloe-pill' : isCurrent ? 'button-aloe-pill' : 'button-primary-pill'}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  backgroundColor: isKas ? '#059669' : undefined,
                  color: isKas ? '#FFFFFF' : undefined,
                }}
              >
                <span>{isKas ? 'دخول بيئة عمل كاس وسحابة اعتماد' : isCurrent ? 'الشركة الحالية (مفعلة)' : 'دخول بيئة العمل'}</span>
                <i className="fa-solid fa-arrow-left"></i>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
