import React, { useState } from 'react';
import { ExternalOffice } from '../types';
import { useCompany } from '../contexts/CompanyContext';
import { exportData } from '../services/exportService';

export const ExternalOfficesAgentsPage: React.FC = () => {
  const { activeCompany } = useCompany();

  const [offices] = useState<ExternalOffice[]>([
    {
      id: 'OFF-PH-01',
      officeName: 'Manila Overseas Placement Agency',
      country: 'الفلبين',
      countryCode: 'PH',
      managerName: 'Maria Santos',
      phone: '+63281234567',
      email: 'info@manilaagency.ph',
      licenseNumber: 'POEA-2024-9981',
      activeCandidatesCount: 140,
      arrivedCountCount: 820,
      rating: 4.9,
      authorizedCompanies: ['masi', 'topaz'],
    },
    {
      id: 'OFF-ET-02',
      officeName: 'Addis International Recruitment Bureau',
      country: 'إثيوبيا',
      countryCode: 'ET',
      managerName: 'Bekele Tadesse',
      phone: '+251115512345',
      email: 'contact@addisbureau.et',
      licenseNumber: 'ETH-MOL-7741',
      activeCandidatesCount: 95,
      arrivedCountCount: 540,
      rating: 4.7,
      authorizedCompanies: ['yaqoot', 'ruwad'],
    },
    {
      id: 'OFF-IN-03',
      officeName: 'Bombay Professional Manpower Services',
      country: 'الهند',
      countryCode: 'IN',
      managerName: 'Rajesh Sharma',
      phone: '+912261234567',
      email: 'mumbai@manpower.in',
      licenseNumber: 'MEA-IND-3321',
      activeCandidatesCount: 210,
      arrivedCountCount: 1100,
      rating: 4.8,
      authorizedCompanies: ['masi', 'yaqoot', 'topaz', 'ruwad'],
    },
    {
      id: 'OFF-KE-04',
      officeName: 'Nairobi Skilled Recruitment Agency',
      country: 'كينيا',
      countryCode: 'KE',
      managerName: 'Grace Wambui',
      phone: '+254202123456',
      email: 'info@nairobiagency.co.ke',
      licenseNumber: 'NEA-KEN-4412',
      activeCandidatesCount: 80,
      arrivedCountCount: 390,
      rating: 4.6,
      authorizedCompanies: ['ruwad', 'topaz'],
    },
    {
      id: 'OFF-UG-05',
      officeName: 'Kampala Manpower Supply',
      country: 'أوغندا',
      countryCode: 'UG',
      managerName: 'Joseph Musisi',
      phone: '+256414123456',
      email: 'recruitment@kampala.ug',
      licenseNumber: 'MGLSD-UG-8812',
      activeCandidatesCount: 65,
      arrivedCountCount: 280,
      rating: 4.5,
      authorizedCompanies: ['masi'],
    },
  ]);

  return (
    <div style={{ padding: '24px', backgroundColor: '#F8FAFC', minHeight: '85vh' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
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
            INTERNATIONAL RECRUITMENT NETWORK
          </span>
          <h1 style={{ fontSize: '24px', fontWeight: '900', margin: '4px 0 0 0', fontFamily: 'Cairo, sans-serif' }}>
            بوابة المكاتب الخارجية والوكلاء المصرحين (5 دول معتمدة)
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#DBEAFE' }}>
            الربط المباشر مع مكاتب الفلبين، إثيوبيا، الهند، كينيا، وأوغندا بنظام صلاحيات مقيد.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#1E3A8A',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 20px',
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            + اعتماد مكتب خارجي جديد
          </button>
          <button
            type="button"
            onClick={() => exportData('external-offices', offices, 'excel')}
            title="تصدير Excel"
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '10px',
              padding: '12px 16px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            <i className="fa-solid fa-file-excel" style={{ marginLeft: '4px' }}></i> Excel
          </button>
          <button
            type="button"
            onClick={() => exportData('external-offices', offices, 'pdf')}
            title="تصدير PDF"
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '10px',
              padding: '12px 16px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            <i className="fa-solid fa-file-pdf" style={{ marginLeft: '4px' }}></i> PDF
          </button>
          <button
            type="button"
            onClick={() => exportData('external-offices', offices, 'csv')}
            title="تصدير CSV"
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '10px',
              padding: '12px 16px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            <i className="fa-solid fa-file-csv" style={{ marginLeft: '4px' }}></i> CSV
          </button>
        </div>
      </div>

      {/* Grid of External Offices */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {offices.map((off) => (
          <div
            key={off.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #E2E8F0',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#EFF6FF',
                    color: '#1D4ED8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    fontSize: '14px',
                  }}
                >
                  {off.countryCode}
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#0F172A', margin: 0, fontFamily: 'Cairo, sans-serif' }}>
                    {off.officeName}
                  </h3>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    الدولة: <strong>{off.country}</strong> | الترخيص: {off.licenseNumber}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '13px', fontWeight: '800', color: '#D97706' }}>
                <i className="fa-solid fa-star" style={{ marginLeft: '4px' }}></i>
                {off.rating}
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#F8FAFC',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '12px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginBottom: '14px',
              }}
            >
              <div>
                <span style={{ color: '#64748B' }}>المرشحون النشطون:</span>
                <div style={{ fontWeight: '800', fontSize: '14px', color: '#2563EB' }}>{off.activeCandidatesCount} مرشح</div>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>إجمالي الواصلين:</span>
                <div style={{ fontWeight: '800', fontSize: '14px', color: '#059669' }}>{off.arrivedCountCount} واصل</div>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: '#334155', marginBottom: '16px' }}>
              <strong>الشركات المصرحة للربط:</strong>{' '}
              {off.authorizedCompanies.map((cId) => (
                <span key={cId} style={{ backgroundColor: '#F1F5F9', color: '#1E293B', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px', fontSize: '11px', fontWeight: '700' }}>
                  {cId.toUpperCase()}
                </span>
              ))}
            </div>

            <button
              type="button"
              style={{
                width: '100%',
                backgroundColor: '#1E293B',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              عرض بوابات الإرساليات والسير الذاتية
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
