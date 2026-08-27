import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { 
  BarChart3, FileSpreadsheet, FileText, TrendingUp, DollarSign, 
  Handshake, FileCheck, Building2, ArrowUpRight
} from 'lucide-react';

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
          background: '#000000',
          borderRadius: '16px',
          padding: '28px',
          color: '#FFFFFF',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <BarChart3 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
                  EXECUTIVE BI & ANALYTICS
                </span>
                <span className="pill-tag-shade" style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', color: '#ffffff' }}>المؤشرات التنفيذية الموحدة</span>
              </div>
              <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
                التقارير التحليلية والمؤشرات المالية والتشغيلية للمجموعة
              </h1>
              <p className="text-xs text-zinc-400 mt-1 font-sans">
                تحليل الأرباح والخسائر، عقود مساند، باقات التأجير، وهوامش ربحية الفروع والشركات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => exportData('finance', reportData, 'excel')}
              className="button-white-pill"
              style={{ fontSize: '12px', padding: '6px 18px', minHeight: '38px' }}
            >
              <FileSpreadsheet className="w-4 h-4 ml-1 text-black" />
              <span>تصدير مصنف Excel</span>
            </button>
            <button
              onClick={() => exportData('finance', reportData, 'pdf')}
              className="button-outline-on-dark"
              style={{ fontSize: '12px', padding: '6px 16px', minHeight: '38px' }}
            >
              <FileText className="w-3.5 h-3.5 ml-1 text-rose-400" />
              <span>تصدير PDF</span>
            </button>
          </div>
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
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs font-semibold text-zinc-700 ml-2">الفترة الزمنية:</span>
          {(['today', 'month', 'quarter', 'year'] as const).map((p) => {
            const labels = { today: 'اليوم', month: 'هذا الشهر', quarter: 'الربع الثالث (Q3)', year: 'السنة المالية 2026' };
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
                  backgroundColor: isActive ? '#000000' : '#ffffff',
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

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-700">الشركة:</span>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black focus:border-black focus:outline-none"
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
      <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
        <div className="p-4 border-b border-zinc-100 bg-white">
          <h2 className="text-sm font-bold text-black flex items-center gap-2 m-0">
            <Building2 className="w-4 h-4 text-black" />
            <span>جدول الأداء المالي والتشغيلي المقارن لشركات المجموعة</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-zinc-700">
            <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">الشركة / الكيان</th>
                <th className="p-3.5">عقود الاستقدام</th>
                <th className="p-3.5">عقود التأجير</th>
                <th className="p-3.5">إجمالي الإيرادات</th>
                <th className="p-3.5">المصروفات والتكاليف</th>
                <th className="p-3.5">صافي الأرباح</th>
                <th className="p-3.5">هامش الربح</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {reportData.map((row) => (
                <tr key={row.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="p-3.5 font-bold text-black">{row.name}</td>
                  <td className="p-3.5 font-mono">{row.recruitment_contracts} عقد</td>
                  <td className="p-3.5 font-mono">{row.rent_contracts} عقد</td>
                  <td className="p-3.5 font-mono font-bold text-black">{(row.total_revenue ?? 0).toLocaleString()} ر.س</td>
                  <td className="p-3.5 font-mono text-zinc-500">{(row.expenses ?? 0).toLocaleString()} ر.س</td>
                  <td className="p-3.5 font-mono font-bold text-emerald-700">{(row.net_profit ?? 0).toLocaleString()} ر.س</td>
                  <td className="p-3.5">
                    <Badge text={row.margin} type="success" />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-zinc-50 font-bold text-black border-t border-zinc-200">
                <td className="p-3.5">الإجمالي المجمع للمجموعة</td>
                <td className="p-3.5 font-mono">{totalRecruitment} عقد</td>
                <td className="p-3.5 font-mono">{totalRent} عقد</td>
                <td className="p-3.5 font-mono">{(totalRevenue ?? 0).toLocaleString()} ر.س</td>
                <td className="p-3.5 font-mono">{(totalExpenses ?? 0).toLocaleString()} ر.س</td>
                <td className="p-3.5 font-mono text-emerald-700">{(totalNetProfit ?? 0).toLocaleString()} ر.س</td>
                <td className="p-3.5"><Badge text="57.6%" type="purple" /></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
