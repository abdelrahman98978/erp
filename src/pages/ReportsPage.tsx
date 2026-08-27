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
    <div className="space-y-6">
      {/* Top Banner */}
      <div
        className="card-feature-cinematic"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#000000',
          color: '#FFF',
          padding: '28px',
          borderRadius: '16px',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
              EXECUTIVE BI & ANALYTICS
            </span>
            <span style={{ color: '#a1a1aa', fontSize: '12px' }}>مركز التقارير التنفيذية والمالية الموحدة</span>
          </div>
          <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, margin: '6px 0 0 0', letterSpacing: '-0.02em', color: '#ffffff', fontFamily: 'var(--font-family-display)' }}>
            التقارير التحليلية والمؤشرات المالية والتشغيلية للمجموعة
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#a1a1aa', fontWeight: 420 }}>
            تحليل الأرباح والخسائر، عقود مساند، باقات التأجير، وهوامش ربحية الفروع والشركات
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => exportData('finance', reportData, 'excel')}
            className="button-aloe-pill"
            style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
          >
            <i className="fa-solid fa-file-excel ml-1"></i> تصدير مصنف Excel
          </button>
          <button
            onClick={() => exportData('finance', reportData, 'pdf')}
            className="button-outline-on-dark"
            style={{ fontSize: '12.5px', padding: '6px 16px', minHeight: '38px' }}
          >
            <i className="fa-solid fa-file-pdf text-rose-400 ml-1"></i> تصدير تقرير PDF
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card-pistachio-band" style={{ padding: '24px', borderRadius: '16px' }}>
          <span style={{ fontSize: '13px', fontWeight: 550, color: '#000000' }}>إجمالي الإيرادات المحققة</span>
          <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>{totalRevenue.toLocaleString()} ر.س</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>نمو شهري +14.8%</span>
        </div>

        <div className="card-pricing-featured" style={{ padding: '24px', borderRadius: '16px', background: '#000000', color: '#ffffff' }}>
          <span style={{ fontSize: '13px', fontWeight: 550, color: '#a1a1aa' }}>صافي الأرباح التشغيلية</span>
          <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#ffffff', marginTop: '6px', letterSpacing: '-0.02em' }}>{totalNetProfit.toLocaleString()} ر.س</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>هامش ربح مجمع 57.6%</span>
        </div>

        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '13px', fontWeight: 550, color: '#71717a' }}>عقود الاستقدام (مساند)</span>
          <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>{totalRecruitment} عقد</div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '10px' }}>دورة الإنجاز 28 يوماً</span>
        </div>

        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '13px', fontWeight: 550, color: '#71717a' }}>عقود التأجير والتشغيل</span>
          <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>{totalRent} عقد</div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '10px' }}>تغطية تشغيلية كاملة</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card-pricing" style={{ padding: '14px 20px', borderRadius: '16px', background: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 550, color: '#000000', marginLeft: '6px' }}>الفترة الزمنية:</span>
          {(['today', 'month', 'quarter', 'year'] as const).map((p) => {
            const labels = { today: 'اليوم', month: 'هذا الشهر (أغسطس 2026)', quarter: 'الربع الثالث (Q3)', year: 'السنة المالية 2026' };
            const isActive = selectedPeriod === p;
            return (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                style={{
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  fontSize: '11.5px',
                  fontWeight: isActive ? 550 : 420,
                  border: '1px solid',
                  borderColor: isActive ? '#000000' : '#e4e4e7',
                  background: isActive ? '#000000' : '#ffffff',
                  color: isActive ? '#ffffff' : '#27272a',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {labels[p]}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 550, color: '#000000' }}>الشركة:</span>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="text-input"
            style={{ height: '36px', minHeight: '36px', borderRadius: '9999px', fontSize: '12px', padding: '0 14px' }}
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
      <div className="card-pricing" style={{ padding: 0, borderRadius: '16px', border: '1px solid #e4e4e7', background: '#ffffff', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e4e4e7', background: '#ffffff' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 550, color: '#000000', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-table-cells text-emerald-600"></i> جدول الأداء المالي والتشغيلي المقارن لشركات المجموعة
          </h2>
        </div>

        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table className="odoo-data-table" style={{ width: '100%', textAlign: 'right' }}>
            <thead>
              <tr>
                <th>الشركة / الكيان</th>
                <th>عقود الاستقدام</th>
                <th>عقود التأجير</th>
                <th>إجمالي الإيرادات (ر.س)</th>
                <th>المصروفات والتكاليف (ر.س)</th>
                <th>صافي الأرباح (ر.س)</th>
                <th>هامش الربح</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontWeight: 550, color: '#000000' }}>{row.name}</td>
                  <td>{row.recruitment_contracts} عقد</td>
                  <td>{row.rent_contracts} عقد</td>
                  <td style={{ fontWeight: 550, color: '#000000' }}>{(row.total_revenue ?? 0).toLocaleString()} ر.س</td>
                  <td>{(row.expenses ?? 0).toLocaleString()} ر.س</td>
                  <td style={{ fontWeight: 550, color: '#000000' }}>{(row.net_profit ?? 0).toLocaleString()} ر.س</td>
                  <td>
                    <Badge text={row.margin} type="success" />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#fafafa', borderTop: '1px solid #e4e4e7', fontWeight: 550 }}>
                <td>الإجمالي المجمع للمجموعة</td>
                <td>{totalRecruitment} عقد</td>
                <td>{totalRent} عقد</td>
                <td>{(totalRevenue ?? 0).toLocaleString()} ر.س</td>
                <td>{(totalExpenses ?? 0).toLocaleString()} ر.س</td>
                <td style={{ fontSize: '15px' }}>{(totalNetProfit ?? 0).toLocaleString()} ر.س</td>
                <td><Badge text="57.6%" type="purple" /></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
