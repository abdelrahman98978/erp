import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { DASHBOARD_STATS_BY_PERIOD, MOCK_RECRUITMENT_CONTRACTS } from '../data/mockData';
import { SmaccDashboardWidget } from '../components/smacc/SmaccDashboardWidget';

interface DashboardPageProps {
  onNavigate: (href: string, title: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'all'>('today');

  const stats = DASHBOARD_STATS_BY_PERIOD[selectedPeriod];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* SMACC Structural Dashboard Replica */}
      <SmaccDashboardWidget />
      {/* Top Welcome Hero Banner with Period Filter (Exact ClickERP Feature Set) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #00383A 0%, #005154 50%, #046A6E 100%)',
          borderRadius: '16px',
          padding: '24px 28px',
          color: '#FFFFFF',
          boxShadow: '0 8px 24px rgba(0, 81, 84, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          {/* Right Header Title & Greeting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              🏢
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px', fontWeight: '800' }}>
                  مؤشرات فورية
                </span>
                <span style={{ fontSize: '11px', color: '#A7F3D0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34D399', display: 'inline-block' }}></span>
                  محدث الآن - آخر تحديث اليوم
                </span>
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '900', margin: 0, letterSpacing: '-0.3px' }}>
                مرحباً مكتب دار الرواد للاستقدام 👋
              </h2>
              <p style={{ fontSize: '12px', opacity: 0.85, margin: '4px 0 0 0', maxWidth: '600px' }}>
                تابع أداء العقود والطلبات والإيرادات لحظة بلحظة مع إمكانية التحكم الكامل في الأقسام والعمليات التشغيلية.
              </p>
            </div>
          </div>

          {/* Quick Action Navigation Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              onClick={() => onNavigate('create-contract', 'إضافة عقد استقدام')}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#005154',
                border: 'none',
                borderRadius: '20px',
                padding: '7px 16px',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <i className="fa-solid fa-plus text-xs"></i> عقد جديد
            </button>
            <button
              onClick={() => onNavigate('orders', 'الطلبات المباشرة')}
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '20px',
                padding: '7px 14px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              الطلبات المباشرة
            </button>
            <button
              onClick={() => onNavigate('branch-departments', 'إدارة الفرق')}
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '20px',
                padding: '7px 14px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              إدارة الفرق
            </button>
            <button
              onClick={() => onNavigate('reports', 'مركز التقارير')}
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '20px',
                padding: '7px 14px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              التقارير
            </button>
            <button
              onClick={() => onNavigate('finance-home', 'لوحة التحكم المالية')}
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '20px',
                padding: '7px 14px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              المالية
            </button>
          </div>
        </div>

        {/* Live Period Filter Buttons & Today Sub-cards */}
        <div
          style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', opacity: 0.9 }}>تحديث القيم فوراً:</span>
            <div style={{ display: 'flex', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '3px' }}>
              {(['today', 'week', 'month', 'all'] as const).map((period) => {
                const labels: Record<string, string> = {
                  today: 'اليوم',
                  week: 'هذا الأسبوع',
                  month: 'هذا الشهر',
                  all: 'الإجمالي',
                };
                const isActive = selectedPeriod === period;
                return (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setSelectedPeriod(period)}
                    style={{
                      border: 'none',
                      backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                      color: isActive ? '#005154' : '#FFFFFF',
                      fontWeight: isActive ? '900' : '600',
                      padding: '5px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
                    }}
                  >
                    {labels[period]}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '6px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <i className="fa-solid fa-file-contract text-emerald-300"></i>
              <span style={{ fontSize: '12px', fontWeight: '700' }}>عقود اليوم:</span>
              <span style={{ fontSize: '14px', fontWeight: '900', color: '#A7F3D0' }}>{stats.todayContractsCount}</span>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '6px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <i className="fa-solid fa-cart-arrow-down text-blue-300"></i>
              <span style={{ fontSize: '12px', fontWeight: '700' }}>طلبات اليوم:</span>
              <span style={{ fontSize: '14px', fontWeight: '900', color: '#93C5FD' }}>{stats.todayOrdersCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation 3-Card Portal Hub (ClickERP Featured Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <div
          onClick={() => onNavigate('shelter', 'إدارة الإيواء')}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid #E2E8F0',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#005154';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E2E8F0';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              <i className="fa-solid fa-house-chimney-user"></i>
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>إدارة الإيواء</h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748B' }}>الداخل والخارج والجاهز للنقل ومرحلة الترحيل</p>
            </div>
          </div>
          <i className="fa-solid fa-arrow-left text-slate-400 text-sm"></i>
        </div>

        <div
          onClick={() => onNavigate('finance-home', 'لوحة التحكم المالية')}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid #E2E8F0',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#005154';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E2E8F0';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              <i className="fa-solid fa-file-invoice-dollar"></i>
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>لوحة التحكم المالية</h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748B' }}>ملخص الحسابات والفواتير والحركات المالية</p>
            </div>
          </div>
          <i className="fa-solid fa-arrow-left text-slate-400 text-sm"></i>
        </div>

        <div
          onClick={() => onNavigate('reports', 'مركز التقارير')}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid #E2E8F0',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#005154';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E2E8F0';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#F5F3FF',
                color: '#7C3AED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              <i className="fa-solid fa-chart-pie"></i>
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>مركز التقارير</h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748B' }}>تقارير العقود والطلبات والإيواء مع خيارات التصدير</p>
            </div>
          </div>
          <i className="fa-solid fa-arrow-left text-slate-400 text-sm"></i>
        </div>
      </div>

      {/* 10 Main KPI Metrics Cards Grid (Exact ClickERP Structure & Sub-Breakdowns) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '16px' }}>
        {/* 1. جميع عقود الاستقدام */}
        <div
          onClick={() => onNavigate('recruitment-contracts', 'عقود الاستقدام')}
          className="metric-card-clickerp"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '16px',
            border: '1px solid #E2E8F0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>جميع عقود الاستقدام</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
              <i className="fa-solid fa-handshake"></i>
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', marginBottom: '8px' }}>
            {stats.recruitmentContracts.total}
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#F1F5F9', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{ width: '65%', height: '100%', backgroundColor: '#005154', borderRadius: '2px' }}></div>
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            <span>قبل الوصول: <strong style={{ color: '#0F172A' }}>{stats.recruitmentContracts.beforeArrival}</strong></span>
            <span>|</span>
            <span>وصول: <strong style={{ color: '#0F172A' }}>{stats.recruitmentContracts.arrivalStage}</strong></span>
            <span>|</span>
            <span>ضمان: <strong style={{ color: '#059669' }}>{stats.recruitmentContracts.underGuarantee}</strong></span>
          </div>
        </div>

        {/* 2. طلبات الاستقدام (الحجوزات) */}
        <div
          onClick={() => onNavigate('orders', 'طلبات الاستقدام')}
          className="metric-card-clickerp"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '16px',
            border: '1px solid #E2E8F0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>طلبات الاستقدام (الحجوزات)</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
              <i className="fa-solid fa-cart-shopping"></i>
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', marginBottom: '8px' }}>
            {stats.orders.total}
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#F1F5F9', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{ width: '85%', height: '100%', backgroundColor: '#059669', borderRadius: '2px' }}></div>
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            <span>جديدة: <strong style={{ color: '#047857' }}>{stats.orders.newOrders}</strong></span>
            <span>|</span>
            <span>إجراء: <strong style={{ color: '#D97706' }}>{stats.orders.inProgress}</strong></span>
            <span>|</span>
            <span>مكتملة: <strong style={{ color: '#2563EB' }}>{stats.orders.completed}</strong></span>
          </div>
        </div>

        {/* 3. عقود الإيجار */}
        <div
          onClick={() => onNavigate('rent-contracts', 'عقود التأجير')}
          className="metric-card-clickerp"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '16px',
            border: '1px solid #E2E8F0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>عقود الإيجار</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FDF4FF', color: '#C026D3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
              <i className="fa-solid fa-house-circle-check"></i>
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', marginBottom: '8px' }}>
            {stats.rentContracts.total}
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#F1F5F9', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{ width: '45%', height: '100%', backgroundColor: '#C026D3', borderRadius: '2px' }}></div>
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            <span>نشطة: <strong style={{ color: '#059669' }}>{stats.rentContracts.active}</strong></span>
            <span>|</span>
            <span>مرسلة: <strong style={{ color: '#2563EB' }}>{stats.rentContracts.sent}</strong></span>
            <span>|</span>
            <span>مكتملة: <strong style={{ color: '#0F172A' }}>{stats.rentContracts.completed}</strong></span>
          </div>
        </div>

        {/* 4. سير عاملات الإيجار */}
        <div
          onClick={() => onNavigate('cvs-rental', 'سير عاملات الإيجار')}
          className="metric-card-clickerp"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '16px',
            border: '1px solid #E2E8F0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>سير عاملات الإيجار</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
              <i className="fa-solid fa-person-dress"></i>
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', marginBottom: '8px' }}>
            {stats.rentMaids.total}
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#F1F5F9', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{ width: '50%', height: '100%', backgroundColor: '#D97706', borderRadius: '2px' }}></div>
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            <span>متاحة: <strong style={{ color: '#059669' }}>{stats.rentMaids.available}</strong></span>
            <span>|</span>
            <span>في سير إيجار نشط: <strong style={{ color: '#D97706' }}>{stats.rentMaids.activeRent}</strong></span>
          </div>
        </div>

        {/* 5. السير الذاتية */}
        <div
          onClick={() => onNavigate('create-cv', 'بنك السير الذاتية')}
          className="metric-card-clickerp"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '16px',
            border: '1px solid #E2E8F0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>السير الذاتية (CVs)</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F0FDFA', color: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
              <i className="fa-solid fa-address-card"></i>
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', marginBottom: '8px' }}>
            {stats.cvs.total}
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#F1F5F9', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{ width: '70%', height: '100%', backgroundColor: '#0D9488', borderRadius: '2px' }}></div>
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            <span>متاحة: <strong style={{ color: '#059669' }}>{stats.cvs.available}</strong></span>
            <span>|</span>
            <span>محجوزة: <strong style={{ color: '#EA580C' }}>{stats.cvs.reserved}</strong></span>
          </div>
        </div>

        {/* 6. العملاء */}
        <div
          onClick={() => onNavigate('clients', 'جميع العملاء')}
          className="metric-card-clickerp"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '16px',
            border: '1px solid #E2E8F0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>العملاء</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F1F5F9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
              <i className="fa-solid fa-users"></i>
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', marginBottom: '8px' }}>
            {stats.clients.total}
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#F1F5F9', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{ width: '25%', height: '100%', backgroundColor: '#2563EB', borderRadius: '2px' }}></div>
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            <span>لديهم طلبات: <strong style={{ color: '#059669' }}>{stats.clients.withOrders}</strong></span>
            <span>|</span>
            <span>بدون طلبات: <strong style={{ color: '#64748B' }}>{stats.clients.withoutOrders}</strong></span>
          </div>
        </div>

        {/* 7. تفاويض إنجاز */}
        <div
          onClick={() => onNavigate('ingaz', 'تفاويض الإنجاز')}
          className="metric-card-clickerp"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '16px',
            border: '1px solid #E2E8F0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>تفاويض إنجاز</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
              <i className="fa-solid fa-passport"></i>
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', marginBottom: '8px' }}>
            {stats.ingaz.total}
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#F1F5F9', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{ width: '100%', height: '100%', backgroundColor: '#D97706', borderRadius: '2px' }}></div>
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            <span>تحت الإجراء: <strong style={{ color: '#D97706' }}>{stats.ingaz.inProgress}</strong></span>
            <span>|</span>
            <span>تم الاعتماد: <strong style={{ color: '#059669' }}>{stats.ingaz.approved}</strong></span>
          </div>
        </div>

        {/* 8. الشكاوى */}
        <div
          onClick={() => onNavigate('complaints', 'إدارة الشكاوى')}
          className="metric-card-clickerp"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '16px',
            border: '1px solid #E2E8F0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>الشكاوى</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
              <i className="fa-solid fa-headset"></i>
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', marginBottom: '8px' }}>
            {stats.complaints.total}
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#F1F5F9', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{ width: '50%', height: '100%', backgroundColor: '#DC2626', borderRadius: '2px' }}></div>
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            <span>مفتوحة: <strong style={{ color: '#DC2626' }}>{stats.complaints.open}</strong></span>
            <span>|</span>
            <span>مغلقة: <strong style={{ color: '#059669' }}>{stats.complaints.closed}</strong></span>
          </div>
        </div>

        {/* 9. طلبات نقل الكفالة */}
        <div
          onClick={() => onNavigate('sponsorship-transfer', 'نقل الكفالة')}
          className="metric-card-clickerp"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '16px',
            border: '1px solid #E2E8F0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>طلبات نقل الكفالة</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
              <i className="fa-solid fa-retweet"></i>
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', marginBottom: '8px' }}>
            {stats.sponsorshipTransfers.total}
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#F1F5F9', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{ width: '20%', height: '100%', backgroundColor: '#16A34A', borderRadius: '2px' }}></div>
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            <span>فترة التجربة: <strong style={{ color: '#D97706' }}>{stats.sponsorshipTransfers.trialPeriod}</strong></span>
            <span>|</span>
            <span>تم النقل: <strong style={{ color: '#059669' }}>{stats.sponsorshipTransfers.transferred}</strong></span>
          </div>
        </div>

        {/* 10. داخل الإيواء */}
        <div
          onClick={() => onNavigate('shelter', 'إدارة الإيواء')}
          className="metric-card-clickerp"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '16px',
            border: '1px solid #E2E8F0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>داخل الإيواء</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
              <i className="fa-solid fa-hotel"></i>
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', marginBottom: '8px' }}>
            {stats.shelter.total}
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#F1F5F9', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{ width: '70%', height: '100%', backgroundColor: '#1D4ED8', borderRadius: '2px' }}></div>
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            <span>داخل الإيواء: <strong style={{ color: '#1D4ED8' }}>{stats.shelter.inside}</strong></span>
            <span>|</span>
            <span>خارج الإيواء: <strong style={{ color: '#64748B' }}>{stats.shelter.outside}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Contracts Table & Operations Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Recent Contracts Live View matching ClickERP Table Columns */}
        <div className="table-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '900', margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-file-contract text-emerald-600"></i>
                أحدث عقود الاستقدام المعتمدة (مساند)
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748B' }}>
                متابعة فورية لمراحل الاستقدام، المكاتب الخارجية، والوصول
              </p>
            </div>
            <button
              className="btn-odoo btn-odoo-secondary"
              style={{ fontSize: '12px', padding: '6px 14px' }}
              onClick={() => onNavigate('recruitment-contracts', 'عقود الاستقدام')}
            >
              عرض جميع العقود (115) <i className="fa-solid fa-arrow-left mr-1"></i>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="odoo-table" style={{ width: '100%', textAlign: 'right' }}>
              <thead>
                <tr>
                  <th>رقم العقد</th>
                  <th>معلومات العميل</th>
                  <th>العاملة</th>
                  <th>المكتب الخارجي</th>
                  <th>الفرع</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_RECRUITMENT_CONTRACTS.map((contract) => (
                  <tr key={contract.id}>
                    <td>
                      <strong style={{ color: '#005154' }}>{contract.contract_number}</strong>
                      <div style={{ fontSize: '10px', color: '#94A3B8' }}>مساند: {contract.musaned_number}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '800', color: '#0F172A' }}>{contract.client_name}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{contract.client_phone}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '700' }}>{contract.maid_name}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{contract.nationality} • {contract.maid_passport}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', color: '#334155' }}>{contract.external_office}</span>
                    </td>
                    <td>
                      <span className="badge-odoo badge-secondary" style={{ fontSize: '11px' }}>{contract.branch}</span>
                    </td>
                    <td>
                      <span
                        className={`badge-odoo ${
                          contract.stage === 'مكتمل'
                            ? 'badge-success'
                            : contract.stage === 'وصول'
                            ? 'badge-info'
                            : contract.stage === 'تفييز'
                            ? 'badge-warning'
                            : 'badge-primary'
                        }`}
                      >
                        {contract.stage}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => onNavigate('recruitment-contracts', 'عقود الاستقدام')}
                        style={{
                          backgroundColor: 'rgba(0, 81, 84, 0.08)',
                          color: '#005154',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '4px 10px',
                          fontSize: '11px',
                          fontWeight: '800',
                          cursor: 'pointer',
                        }}
                      >
                        عرض التفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Operations & Alerts Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Quick Musaned Status Tracker */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: '900', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-tower-broadcast text-blue-600"></i>
              حالة الربط مع المنصات الحكومية
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }}></span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E293B' }}>منصة مساند الحكومية</span>
                </div>
                <span style={{ fontSize: '11px', color: '#059669', fontWeight: '800' }}>متصل وموثق</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }}></span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E293B' }}>هيئة الزكاة (ZATCA Phase 2)</span>
                </div>
                <span style={{ fontSize: '11px', color: '#059669', fontWeight: '800' }}>Fatoora نشط</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }}></span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E293B' }}>منصة إنجاز والتأشيرات</span>
                </div>
                <span style={{ fontSize: '11px', color: '#059669', fontWeight: '800' }}>جاهز للتفويض</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Portal */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '900', color: '#0F172A' }}>
              إجراءات تشغيلية سريعة
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => onNavigate('create-cv', 'إضافة سيرة ذاتية')}
                style={{
                  width: '100%',
                  textAlign: 'right',
                  padding: '9px 12px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#1E293B',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <i className="fa-solid fa-plus-circle text-emerald-600"></i>
                إضافة سيرة ذاتية جديدة للبنك (136 حقل)
              </button>

              <button
                type="button"
                onClick={() => onNavigate('sponsorship-transfer', 'طلبات نقل الكفالة')}
                style={{
                  width: '100%',
                  textAlign: 'right',
                  padding: '9px 12px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#1E293B',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <i className="fa-solid fa-retweet text-blue-600"></i>
                تسجيل طلب نقل كفالة وتنازل
              </button>

              <button
                type="button"
                onClick={() => onNavigate('whatsapp-inbox', 'محادثات واتساب')}
                style={{
                  width: '100%',
                  textAlign: 'right',
                  padding: '9px 12px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#1E293B',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <i className="fa-brands fa-whatsapp text-emerald-600"></i>
                فتح شات الواتساب والمحادثات الحية
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
