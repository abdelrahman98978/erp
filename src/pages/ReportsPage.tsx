import React, { useState } from 'react';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';

export const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'month' | 'quarter' | 'year'>('month');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');

  const reportData = [
    { id: '1', name: 'شركة السفير الماسي للاستقدام', recruitment_contracts: 115, rent_contracts: 22, total_revenue: 284500, expenses: 118000, net_profit: 166500, margin: '58.5%' },
    { id: '2', name: 'شركة ياقوت نجد للاستقدام', recruitment_contracts: 74, rent_contracts: 16, total_revenue: 162400, expenses: 68500, net_profit: 93900, margin: '57.8%' },
    { id: '3', name: 'شركة توباز للاستقدام والتشغيل', recruitment_contracts: 42, rent_contracts: 12, total_revenue: 98500, expenses: 44000, net_profit: 54500, margin: '55.3%' },
    { id: '4', name: 'شركة دار الرواد للمقاولات والخدمات', recruitment_contracts: 10, rent_contracts: 8, total_revenue: 45000, expenses: 19500, net_profit: 25500, margin: '56.6%' },
  ];

  const totalRevenue = reportData.reduce((s, r) => s + r.total_revenue, 0);
  const totalExpenses = reportData.reduce((s, r) => s + r.expenses, 0);
  const totalNetProfit = reportData.reduce((s, r) => s + r.net_profit, 0);
  const totalRecruitment = reportData.reduce((s, r) => s + r.recruitment_contracts, 0);
  const totalRent = reportData.reduce((s, r) => s + r.rent_contracts, 0);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        color: '#FFF',
        padding: '20px 24px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: '#3B82F6', color: '#FFF', padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' }}>
              EXECUTIVE BI & ANALYTICS
            </span>
            <span style={{ color: '#94A3B8', fontSize: '12px' }}>مركز التقارير التنفيذية والمالية الموحدة</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '900', margin: '4px 0 0 0' }}>
            التقارير التحليلية والمؤشرات المالية والتشغيلية للمجموعة
          </h1>
          <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#CBD5E1' }}>
            تحليل الأرباح والخسائر، عقود مساند، باقات التأجير، وهوامش ربحية الفروع والشركات
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => exportData('finance', reportData, 'excel')}
            className="btn-odoo btn-odoo-primary"
            style={{ padding: '8px 16px', fontSize: '13px', background: '#059669', borderColor: '#059669' }}
          >
            <i className="fa-solid fa-file-excel ml-1"></i> تصدير مصنف Excel
          </button>
          <button
            onClick={() => exportData('finance', reportData, 'pdf')}
            className="btn-odoo btn-odoo-secondary"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            <i className="fa-solid fa-file-pdf text-red-600 ml-1"></i> تصدير تقرير PDF
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatCard
          title="إجمالي الإيرادات المحققة"
          value={`${totalRevenue.toLocaleString()} ر.س`}
          icon="fa-solid fa-chart-line"
          subtext="نمو شهري +14.8%"
          variant="teal"
        />
        <StatCard
          title="صافي الأرباح التشغيلية"
          value={`${totalNetProfit.toLocaleString()} ر.س`}
          icon="fa-solid fa-coins"
          subtext="هامش ربح مجمع 57.6%"
          variant="purple"
        />
        <StatCard
          title="عقود الاستقدام (مساند)"
          value={`${totalRecruitment} عقد`}
          icon="fa-solid fa-file-signature"
          subtext="متوسط دورة الإنجاز 28 يوماً"
          variant="info"
        />
        <StatCard
          title="عقود التأجير والتشغيل"
          value={`${totalRent} عقد`}
          icon="fa-solid fa-handshake"
          subtext="تغطية تشغيلية كاملة"
          variant="warning"
        />
      </div>

      {/* Filters Bar */}
      <div style={{ background: '#FFF', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#1E293B', marginLeft: '6px' }}>الفترة الزمنية:</span>
          <button
            onClick={() => setSelectedPeriod('today')}
            style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: '1px solid #CBD5E1', background: selectedPeriod === 'today' ? '#0F172A' : '#F8FAFC', color: selectedPeriod === 'today' ? '#FFF' : '#334155', cursor: 'pointer' }}
          >
            اليوم
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: '1px solid #CBD5E1', background: selectedPeriod === 'month' ? '#0F172A' : '#F8FAFC', color: selectedPeriod === 'month' ? '#FFF' : '#334155', cursor: 'pointer' }}
          >
            هذا الشهر (أغسطس 2026)
          </button>
          <button
            onClick={() => setSelectedPeriod('quarter')}
            style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: '1px solid #CBD5E1', background: selectedPeriod === 'quarter' ? '#0F172A' : '#F8FAFC', color: selectedPeriod === 'quarter' ? '#FFF' : '#334155', cursor: 'pointer' }}
          >
            الربع الثالث (Q3)
          </button>
          <button
            onClick={() => setSelectedPeriod('year')}
            style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: '1px solid #CBD5E1', background: selectedPeriod === 'year' ? '#0F172A' : '#F8FAFC', color: selectedPeriod === 'year' ? '#FFF' : '#334155', cursor: 'pointer' }}
          >
            السنة المالية 2026
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#1E293B' }}>الشركة:</span>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: '700' }}
          >
            <option value="all">كافة شركات المجموعة الموحدة</option>
            <option value="masi">شركة السفير الماسي</option>
            <option value="yaqoot">شركة ياقوت نجد</option>
            <option value="topaz">شركة توباز للاستقدام</option>
            <option value="dar">دار الرواد</option>
          </select>
        </div>
      </div>

      {/* Main Breakdown Table */}
      <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', marginBottom: '16px' }}>
          <i className="fa-solid fa-table-cells text-emerald-600 ml-2"></i> جدول الأداء المالي والتشغيلي المقارن لشركات المجموعة
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                <th style={{ padding: '12px' }}>الشركة / الكيان</th>
                <th style={{ padding: '12px' }}>عقود الاستقدام</th>
                <th style={{ padding: '12px' }}>عقود التأجير</th>
                <th style={{ padding: '12px' }}>إجمالي الإيرادات (ر.س)</th>
                <th style={{ padding: '12px' }}>المصروفات والتكاليف (ر.س)</th>
                <th style={{ padding: '12px' }}>صافي الأرباح (ر.س)</th>
                <th style={{ padding: '12px' }}>هامش الربح</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 12px', fontWeight: '800', color: '#0F172A' }}>{row.name}</td>
                  <td style={{ padding: '14px 12px', fontWeight: '700', color: '#2563EB' }}>{row.recruitment_contracts} عقد</td>
                  <td style={{ padding: '14px 12px', fontWeight: '700', color: '#059669' }}>{row.rent_contracts} عقد</td>
                  <td style={{ padding: '14px 12px', fontWeight: '800', color: '#0F172A' }}>{(row.total_revenue ?? 0).toLocaleString()} ر.س</td>
                  <td style={{ padding: '14px 12px', fontWeight: '700', color: '#DC2626' }}>{(row.expenses ?? 0).toLocaleString()} ر.س</td>
                  <td style={{ padding: '14px 12px', fontWeight: '900', color: '#047857' }}>{(row.net_profit ?? 0).toLocaleString()} ر.س</td>
                  <td style={{ padding: '14px 12px' }}>
                    <Badge text={row.margin} type="success" />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#F8FAFC', borderTop: '2px solid #CBD5E1', fontWeight: '900' }}>
                <td style={{ padding: '14px 12px' }}>الإجمالي المجمع للمجموعة</td>
                <td style={{ padding: '14px 12px', color: '#2563EB' }}>{totalRecruitment} عقد</td>
                <td style={{ padding: '14px 12px', color: '#059669' }}>{totalRent} عقد</td>
                <td style={{ padding: '14px 12px' }}>{(totalRevenue ?? 0).toLocaleString()} ر.س</td>
                <td style={{ padding: '14px 12px', color: '#DC2626' }}>{(totalExpenses ?? 0).toLocaleString()} ر.س</td>
                <td style={{ padding: '14px 12px', color: '#047857', fontSize: '15px' }}>{(totalNetProfit ?? 0).toLocaleString()} ر.س</td>
                <td style={{ padding: '14px 12px' }}><Badge text="57.6%" type="purple" /></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
