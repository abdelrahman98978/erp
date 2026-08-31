import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { 
  BarChart3, FileSpreadsheet, FileText, TrendingUp, DollarSign, 
  Handshake, FileCheck, Building2, ArrowUpRight
} from 'lucide-react';

import { useAppStore } from '../stores/appStore';

export const ReportsPage: React.FC = () => {
  const storeActiveTab = useAppStore(state => state.activeTab);

  const getMappedReportTab = (tabKey: string): 'executive' | 'sales' | 'recruitment' | 'financial' => {
    switch (tabKey) {
      case 'sales-reports': return 'sales';
      case 'recruitment-reports': return 'recruitment';
      case 'financial-reports': return 'financial';
      default: return 'executive';
    }
  };

  const [activeReportTab, setActiveReportTab] = useState<'executive' | 'sales' | 'recruitment' | 'financial'>(() => getMappedReportTab(storeActiveTab));

  React.useEffect(() => {
    setActiveReportTab(getMappedReportTab(storeActiveTab));
  }, [storeActiveTab]);

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

      {/* Sub Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-3">
        {[
          { id: 'executive', label: '🏛️ الملخص التنفيذي الموحد' },
          { id: 'sales', label: '📈 تقارير المبيعات والتعاقدات' },
          { id: 'recruitment', label: '✈️ تقارير الاستقدام والمدد الزمنية' },
          { id: 'financial', label: '💰 التقارير المالية وهوامش الأرباح' },
        ].map((tab) => {
          const isActive = activeReportTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '6px 16px',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: isActive ? '#000000' : '#e4e4e7',
                backgroundColor: isActive ? '#000000' : '#ffffff',
                color: isActive ? '#ffffff' : '#27272a',
                fontWeight: isActive ? 550 : 420,
                fontSize: '12.5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
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

      {/* 1. Executive Summary Tab */}
      {activeReportTab === 'executive' && (
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
      )}

      {/* 2. Sales Reports Tab */}
      {activeReportTab === 'sales' && (
        <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
          <div className="p-4 border-b border-zinc-100 bg-white flex items-center justify-between">
            <h3 className="text-sm font-bold text-black">تقرير المبيعات والتعاقدات حسب القنوات وفروع المجموعة</h3>
            <span className="pill-tag-mint" style={{ fontSize: '11px' }}>إجمالي المبيعات: 590,400 ر.س</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3.5">قناة البيع / الفرع</th>
                  <th className="p-3.5">عدد العقود</th>
                  <th className="p-3.5">متوسط قيمة العقد</th>
                  <th className="p-3.5">إجمالي المبيعات</th>
                  <th className="p-3.5">نسبة المساهمة</th>
                  <th className="p-3.5">معدل التحويل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {[
                  { channel: 'منصة مساند الحكومية (Direct Musaned)', count: 142, avg: 14500, total: 2059000, share: '62.4%', conv: '84.2%' },
                  { channel: 'بوابة العملاء الإلكترونية (Customer Portal)', count: 54, avg: 14200, total: 766800, share: '23.2%', conv: '71.5%' },
                  { channel: 'المبيعات المباشرة والفروع (Walk-in / Branches)', count: 32, avg: 15000, total: 480000, share: '14.4%', conv: '89.0%' },
                ].map((s, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50">
                    <td className="p-3.5 font-bold text-black">{s.channel}</td>
                    <td className="p-3.5 font-mono">{s.count} عقد</td>
                    <td className="p-3.5 font-mono">{s.avg.toLocaleString()} ر.س</td>
                    <td className="p-3.5 font-mono font-bold text-emerald-700">{s.total.toLocaleString()} ر.س</td>
                    <td className="p-3.5 font-bold text-black">{s.share}</td>
                    <td className="p-3.5"><Badge text={s.conv} type="success" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Recruitment Logistics & Timelines Tab */}
      {activeReportTab === 'recruitment' && (
        <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
          <div className="p-4 border-b border-zinc-100 bg-white flex items-center justify-between">
            <h3 className="text-sm font-bold text-black">تقرير مدد الاستقدام ودورات الإنجاز حسب الدول والمكاتب</h3>
            <span className="pill-tag-mint" style={{ fontSize: '11px' }}>متوسط الوصول: 28 يوماً</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3.5">الدولة ومكتب المصدر</th>
                  <th className="p-3.5">العقود المنفذة</th>
                  <th className="p-3.5">متوسط مدة التفييز</th>
                  <th className="p-3.5">متوسط مدة الوصول</th>
                  <th className="p-3.5">نسبة الالتزام بالموعد</th>
                  <th className="p-3.5">معدل رضا العملاء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {[
                  { country: 'الفلبين - Manila Overseas Placement', count: 110, visa_days: '8 أيام', total_days: '24 يوماً', on_time: '98.2%', rating: '4.9 / 5.0' },
                  { country: 'إثيوبيا - Addis International Bureau', count: 78, visa_days: '11 يوماً', total_days: '27 يوماً', on_time: '96.5%', rating: '4.7 / 5.0' },
                  { country: 'الهند - Bombay Professional Manpower', count: 35, visa_days: '9 أيام', total_days: '22 يوماً', on_time: '99.0%', rating: '4.8 / 5.0' },
                  { country: 'أوغندا - Kampala Placement Agency', count: 18, visa_days: '14 يوماً', total_days: '34 يوماً', on_time: '91.0%', rating: '4.5 / 5.0' },
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50">
                    <td className="p-3.5 font-bold text-black">{item.country}</td>
                    <td className="p-3.5 font-mono">{item.count} تأشيرة</td>
                    <td className="p-3.5 font-mono text-zinc-600">{item.visa_days}</td>
                    <td className="p-3.5 font-mono font-bold text-emerald-800">{item.total_days}</td>
                    <td className="p-3.5 font-bold text-black">{item.on_time}</td>
                    <td className="p-3.5"><Badge text={item.rating} type="success" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Financial & Profit Margins Tab */}
      {activeReportTab === 'financial' && (
        <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
          <div className="p-4 border-b border-zinc-100 bg-white flex items-center justify-between">
            <h3 className="text-sm font-bold text-black">التقرير المالي التفصيلي وتكاليف التشغيل وهوامش الأرباح</h3>
            <span className="pill-tag-mint" style={{ fontSize: '11px' }}>صافي الأرباح: 340,400 ر.س</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3.5">بند الإيراد / التكلفة</th>
                  <th className="p-3.5">المبلغ الإجمالي</th>
                  <th className="p-3.5">الضريبة (15%)</th>
                  <th className="p-3.5">التكلفة المباشرة للوكالات</th>
                  <th className="p-3.5">المصروفات الإدارية</th>
                  <th className="p-3.5">صافي العائد</th>
                  <th className="p-3.5">الحالة المحاسبية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {[
                  { item: 'إيرادات عقود التوسط في الاستقدام', total: 1667500, vat: 250125, direct: 840000, admin: 180000, net: 647500, status: 'مطابق ومقفل' },
                  { item: 'إيرادات عقود تأجير العمالة المنزلية', total: 420000, vat: 63000, direct: 180000, admin: 45000, net: 195000, status: 'مطابق ومقفل' },
                  { item: 'رسوم خدمات إنجاز وتفاويض التأشيرات', total: 48500, vat: 7275, direct: 12000, admin: 5000, net: 31500, status: 'مطابق ومقفل' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50">
                    <td className="p-3.5 font-bold text-black">{row.item}</td>
                    <td className="p-3.5 font-mono font-bold text-black">{row.total.toLocaleString()} ر.س</td>
                    <td className="p-3.5 font-mono text-zinc-500">{row.vat.toLocaleString()} ر.س</td>
                    <td className="p-3.5 font-mono text-rose-700">{row.direct.toLocaleString()} ر.س</td>
                    <td className="p-3.5 font-mono text-zinc-600">{row.admin.toLocaleString()} ر.س</td>
                    <td className="p-3.5 font-mono font-bold text-emerald-700">{row.net.toLocaleString()} ر.س</td>
                    <td className="p-3.5"><Badge text={row.status} type="success" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;

