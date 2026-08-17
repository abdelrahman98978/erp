import React, { useState, useEffect } from 'react';
import { Candidate, CandidateStage } from '../types';
import { useCompany } from '../contexts/CompanyContext';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';

const INITIAL_CANDIDATES: Candidate[] = [
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
    expectedSalary: 2200,
    source: 'مكتب خارجي',
    externalOfficeName: 'Mumbai Skills Center',
    appliedDate: '2026-08-05',
  },
  {
    id: 'CND-8804',
    candidateCode: 'C-2026-094',
    name: 'ساليوان بيسيتشا',
    email: 'saliwan.b@recruit.co.th',
    phone: '+66812345678',
    nationality: 'تايلاند',
    appliedPosition: 'طباخة ماهرة ومربية',
    targetCompanyId: 'masi',
    targetBranch: 'فرع العليا - الرياض',
    stage: 'تأشيرة وتذكرة',
    aiScore: 92,
    experienceYears: 6,
    education: 'دبلوم فنون الطهي والضيافة',
    expectedSalary: 2000,
    source: 'مكتب خارجي',
    externalOfficeName: 'Bangkok Hospitality Hub',
    appliedDate: '2026-08-07',
  }
];

export const EnterpriseATSPipelinePage: React.FC = () => {
  const { activeCompany } = useCompany();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedStage, setSelectedStage] = useState<string>('الكل');
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewDate, setInterviewDate] = useState('2026-08-20T10:00');
  const [interviewerName, setInterviewerName] = useState('عبدالعزيز التميمي');

  useEffect(() => {
    realErpDataStore.getRecords<Candidate>('ats_candidates', INITIAL_CANDIDATES).then(data => setCandidates(data));
  }, []);

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

  const handleMoveStage = async (candidateId: string, direction: 'next' | 'prev') => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    const currentIdx = stagesList.indexOf(candidate.stage);
    if (currentIdx === -1) return;

    let targetIdx = direction === 'next' ? currentIdx + 1 : currentIdx - 1;
    if (targetIdx < 0 || targetIdx >= stagesList.length) return;

    const newStage = stagesList[targetIdx];
    const updated = await realErpDataStore.updateRecord<Candidate>(
      'ats_candidates',
      candidateId,
      { stage: newStage },
      INITIAL_CANDIDATES
    );
    setCandidates(updated);
  };

  const filteredCandidates = candidates.filter((c) => {
    if (selectedStage !== 'الكل' && c.stage !== selectedStage) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        color: '#FFF',
        padding: '20px 24px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: '#10B981', color: '#FFF', padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' }}>
              ENTERPRISE ATS RECRUITMENT PIPELINE
            </span>
            <span style={{ color: '#A7F3D0', fontSize: '12px' }}>تتبع المتقدمين والتوظيف الدولي</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '900', margin: '4px 0 0 0' }}>
            نظام مسار التوظيف والفرز الذكي (12 مرحلة متكاملة مع مساند و HRIS)
          </h1>
          <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#D1FAE5' }}>
            تقييم السير بالذكاء الاصطناعي، جدولة المقابلات المرئية، وإصدار عروض العمل الرقمية
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn-odoo btn-odoo-primary"
            style={{ padding: '8px 18px', fontSize: '13px', background: '#0F172A', borderColor: '#0F172A' }}
          >
            <i className="fa-solid fa-user-plus ml-1"></i> طلب احتياج وظيفي جديد
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatCard
          title="إجمالي المتقدمين النشطين"
          value={`${candidates.length} مرشحاً`}
          icon="fa-solid fa-users"
          subtext="تم الفحص والتدقيق الأمني"
          variant="teal"
        />
        <StatCard
          title="متوسط توافق الـ AI"
          value="92.5%"
          icon="fa-solid fa-brain"
          subtext="مطابقة معايير التأشيرة والمهنة"
          variant="purple"
        />
        <StatCard
          title="عروض العمل المقبولة"
          value="8 عروض"
          icon="fa-solid fa-envelope-open-text"
          subtext="في مرحلة استخراج التأشيرة"
          variant="info"
        />
        <StatCard
          title="متوسط مدة الفرز والتوظيف"
          value="4.5 أيام"
          icon="fa-solid fa-clock-rotate-left"
          subtext="أسرع بـ 40% من الدورة التقليدية"
          variant="warning"
        />
      </div>

      {/* Stage Selector Pills */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', borderBottom: '1px solid #E2E8F0' }}>
        <button
          type="button"
          onClick={() => setSelectedStage('الكل')}
          style={{
            padding: '6px 14px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: selectedStage === 'الكل' ? '#0F172A' : '#FFFFFF',
            color: selectedStage === 'الكل' ? '#FFFFFF' : '#475569',
            fontWeight: '800',
            fontSize: '12px',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            whiteSpace: 'nowrap'
          }}
        >
          جميع المراحل ({candidates.length})
        </button>
        {stagesList.map((stg) => {
          const count = candidates.filter(c => c.stage === stg).length;
          return (
            <button
              key={stg}
              type="button"
              onClick={() => setSelectedStage(stg)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid #CBD5E1',
                backgroundColor: selectedStage === stg ? '#059669' : '#FFFFFF',
                color: selectedStage === stg ? '#FFFFFF' : '#475569',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {stg} {count > 0 && <span style={{ background: selectedStage === stg ? 'rgba(255,255,255,0.3)' : '#E2E8F0', padding: '1px 6px', borderRadius: '10px', fontSize: '10px', marginRight: '4px' }}>{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Candidates Visual Kanban Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {filteredCandidates.map((cnd) => (
          <div
            key={cnd.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', fontFamily: 'monospace' }}>{cnd.candidateCode}</span>
                  <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#0F172A', margin: '2px 0 0 0' }}>
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
                  <div style={{ fontSize: '10px', fontWeight: '800' }}>مطابقة AI</div>
                  <div style={{ fontSize: '15px', fontWeight: '900' }}>{cnd.aiScore}%</div>
                </div>
              </div>

              <div style={{ fontSize: '13px', color: '#334155', marginBottom: '10px', fontWeight: '700' }}>
                الوظيفة المطلوبة: <span style={{ color: '#047857' }}>{cnd.appliedPosition}</span>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px', border: '1px solid #F1F5F9' }}>
                <div><strong>الجنسية والخبرة:</strong> {cnd.nationality} ({cnd.experienceYears} سنوات خبرة)</div>
                <div><strong>المؤهل العلمي:</strong> {cnd.education}</div>
                <div><strong>المكتب المصدر:</strong> {cnd.externalOfficeName || 'وكالة دولية معتمدة'}</div>
                <div><strong>الراتب المتوقع:</strong> {cnd.expectedSalary.toLocaleString()} ر.س</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <Badge
                  text={`المرحلة: ${cnd.stage}`}
                  type={cnd.stage === 'وصول وانضمام' ? 'success' : cnd.stage === 'مرفوض' ? 'danger' : 'purple'}
                />
                <button
                  onClick={() => {
                    setActiveCandidate(cnd);
                    setShowInterviewModal(true);
                  }}
                  style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '11.5px', fontWeight: '800', cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-calendar-check ml-1"></i> جدولة مقابلة
                </button>
              </div>
            </div>

            {/* Stage Transition Buttons */}
            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
              <button
                type="button"
                onClick={() => handleMoveStage(cnd.id, 'prev')}
                disabled={stagesList.indexOf(cnd.stage) <= 0}
                className="btn-odoo btn-odoo-secondary"
                style={{ flex: 1, padding: '6px', fontSize: '11px', opacity: stagesList.indexOf(cnd.stage) <= 0 ? 0.4 : 1 }}
              >
                ← المرحلة السابقة
              </button>
              <button
                type="button"
                onClick={() => handleMoveStage(cnd.id, 'next')}
                disabled={stagesList.indexOf(cnd.stage) >= stagesList.length - 1}
                className="btn-odoo btn-odoo-primary"
                style={{ flex: 1, padding: '6px', fontSize: '11px', background: '#059669', borderColor: '#059669', opacity: stagesList.indexOf(cnd.stage) >= stagesList.length - 1 ? 0.4 : 1 }}
              >
                المرحلة التالية →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* INTERVIEW MODAL */}
      {showInterviewModal && activeCandidate && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{ background: '#FFF', borderRadius: '16px', maxWidth: '500px', width: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A' }}>
                <i className="fa-solid fa-video text-blue-600 ml-2"></i> جدولة مقابلة مرئية للمرشح: {activeCandidate.name}
              </h2>
              <button onClick={() => setShowInterviewModal(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>تاريخ وتوقيت المقابلة (بتوقيت الرياض)</label>
                <input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>المسؤول عن المقابلة</label>
                <input
                  type="text"
                  value={interviewerName}
                  onChange={(e) => setInterviewerName(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                />
              </div>

              <div style={{ background: '#EFF6FF', padding: '12px', borderRadius: '8px', fontSize: '12px', color: '#1E40AF', lineHeight: '1.5' }}>
                <i className="fa-solid fa-circle-info ml-1"></i> سيتم إرسال رابط المقابلة المرئية تلقائياً للمرشح عبر الواتساب والبريد الإلكتروني، وإشعار المكتب الخارجي.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowInterviewModal(false)}
                  className="btn-odoo btn-odoo-secondary"
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert(`تم تأكيد موعد المقابلة للمرشح ${activeCandidate.name} بنجاح.`);
                    setShowInterviewModal(false);
                  }}
                  className="btn-odoo btn-odoo-primary"
                  style={{ padding: '8px 20px', fontSize: '13px', background: '#059669', borderColor: '#059669' }}
                >
                  تأكيد وإرسال الدعوة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
