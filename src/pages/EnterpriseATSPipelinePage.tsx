import React, { useState } from 'react';
import { Candidate, CandidateStage } from '../types';
import { useCompany } from '../contexts/CompanyContext';

export const EnterpriseATSPipelinePage: React.FC = () => {
  const { activeCompany } = useCompany();

  const [candidates] = useState<Candidate[]>([
    {
      id: 'CND-8801',
      candidateCode: 'C-2026-091',
      name: 'مريم علي أحمد',
      email: 'mariam.ali@gmail.com',
      phone: '+639171234567',
      nationality: 'الفلبين',
      appliedPosition: 'سائقة خاصة / عاملة منزليّة',
      targetCompanyId: 'masi',
      targetBranch: 'فرع المنسكية',
      stage: 'تقديم جديد',
      aiScore: 94,
      experienceYears: 5,
      education: 'دبلوم التمريض ورعاية كبار السن',
      expectedSalary: 1800,
      source: 'مكتب خارجي',
      externalOfficeName: 'Manila Talent Agency Manila',
      appliedDate: '2026-08-01',
    },
    {
      id: 'CND-8802',
      candidateCode: 'C-2026-092',
      name: 'أبيبيتش تاديسي',
      email: 'abebetch.t@yahoo.com',
      phone: '+251911987654',
      nationality: 'إثيوبيا',
      appliedPosition: 'عاملة منزلية شاملة',
      targetCompanyId: 'yaqoot',
      targetBranch: 'فرع جدة الرئيسي',
      stage: 'مؤهل',
      aiScore: 88,
      experienceYears: 3,
      education: 'الثانوية العامة',
      expectedSalary: 1200,
      source: 'مكتب خارجي',
      externalOfficeName: 'Addis International Bureau',
      appliedDate: '2026-08-03',
    },
    {
      id: 'CND-8803',
      candidateCode: 'C-2026-093',
      name: 'راجيش كومار',
      email: 'rajesh.kumar@outlook.com',
      phone: '+919820011223',
      nationality: 'الهند',
      appliedPosition: 'سائق مهني حافلات',
      targetCompanyId: 'topaz',
      targetBranch: 'فرع الدمام',
      stage: 'عرض عمل',
      aiScore: 96,
      experienceYears: 8,
      education: 'رخصة قيادة دولية معتمدة',
      expectedSalary: 2500,
      source: 'وكيل',
      agentName: 'الوكيل السريع بومباي',
      appliedDate: '2026-07-28',
    },
    {
      id: 'CND-8804',
      candidateCode: 'C-2026-094',
      name: 'جين دبليو وانيوي',
      email: 'jane.w@gmail.com',
      phone: '+254712345678',
      nationality: 'كينيا',
      appliedPosition: 'مقدمة رعاية أطفال',
      targetCompanyId: 'ruwad',
      targetBranch: 'فرع العليا',
      stage: 'وصول وانضمام',
      aiScore: 91,
      experienceYears: 4,
      education: 'شهادة في التربية المبكرة',
      expectedSalary: 1500,
      source: 'مكتب خارجي',
      externalOfficeName: 'Nairobi Skilled Workers Ltd',
      appliedDate: '2026-07-15',
    },
  ]);

  const stagesList: CandidateStage[] = [
    'تقديم جديد',
    'فرز أولى',
    'مؤهل',
    'مقابلة أولى',
    'اختبار تقني',
    'المقابلة النهائية',
    'عرض عمل',
    'قبول العرض',
    'ما قبل الانضمام',
    'تأشيرة وتذكرة',
    'وصول وانضمام',
    'مرفوض',
  ];

  const [selectedStage, setSelectedStage] = useState<string>('الكل');

  const filteredCandidates = candidates.filter((c) => {
    if (selectedStage !== 'الكل' && c.stage !== selectedStage) return false;
    return true;
  });

  return (
    <div style={{ padding: '24px', backgroundColor: '#F8FAFC', minHeight: '85vh' }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
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
          <span
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '2px 10px',
              fontSize: '11px',
              fontWeight: '800',
            }}
          >
            ENTERPRISE ATS RECRUITMENT PIPELINE
          </span>
          <h1 style={{ fontSize: '24px', fontWeight: '900', margin: '4px 0 0 0', fontFamily: 'Cairo, sans-serif' }}>
            نظام تتبع المتقدمين والتوظيف الدولي (12 مرحلة متكاملة مع HRIS)
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#A7F3D0' }}>
            نطاق العرض الحالي: <strong>{activeCompany.name}</strong>
          </p>
        </div>

        <button
          type="button"
          style={{
            backgroundColor: '#FFFFFF',
            color: '#047857',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 20px',
            fontWeight: '800',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          + إضافة طلب احتياج وظيفي (Manpower Requisition)
        </button>
      </div>

      {/* Stage Selector Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => setSelectedStage('الكل')}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: selectedStage === 'الكل' ? '#0F172A' : '#FFFFFF',
            color: selectedStage === 'الكل' ? '#FFFFFF' : '#475569',
            fontWeight: '800',
            fontSize: '12px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          جميع المراحل (12)
        </button>
        {stagesList.map((stg) => (
          <button
            key={stg}
            type="button"
            onClick={() => setSelectedStage(stg)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: selectedStage === stg ? '#059669' : '#FFFFFF',
              color: selectedStage === stg ? '#FFFFFF' : '#475569',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}
          >
            {stg}
          </button>
        ))}
      </div>

      {/* Candidates Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredCandidates.map((cnd) => (
          <div
            key={cnd.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #E2E8F0',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B' }}>{cnd.candidateCode}</span>
                <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#0F172A', margin: '2px 0 0 0', fontFamily: 'Cairo, sans-serif' }}>
                  {cnd.name}
                </h3>
              </div>

              {/* AI Score Badge */}
              <div
                style={{
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  color: '#047857',
                  borderRadius: '10px',
                  padding: '4px 10px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '10px', fontWeight: '700' }}>AI Score</div>
                <div style={{ fontSize: '15px', fontWeight: '900' }}>{cnd.aiScore}%</div>
              </div>
            </div>

            <div style={{ fontSize: '13px', color: '#334155', marginBottom: '12px', fontWeight: '700' }}>
              الوظيفة: <span style={{ color: '#2563EB' }}>{cnd.appliedPosition}</span>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '8px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
              <div><strong>الجنسية:</strong> {cnd.nationality} ({cnd.education})</div>
              <div><strong>المصدر:</strong> {cnd.source} ({cnd.externalOfficeName || cnd.agentName})</div>
              <div><strong>الراتب المتوقع:</strong> {cnd.expectedSalary} ر.س</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>
                المرحلة: {cnd.stage}
              </span>

              <button
                type="button"
                style={{
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                نقل للمرحلة التالية
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
