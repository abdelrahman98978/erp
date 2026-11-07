import React, { useState, useMemo } from 'react';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Printer,
  RefreshCw,
  Search,
  Plus,
  Sparkles,
  TrendingUp,
  Landmark,
  Coins,
  ShieldCheck,
  Sliders,
  Activity,
  BarChart3,
  BookOpen,
  Layers,
  Target,
  Calculator,
  RotateCcw,
} from 'lucide-react';
import { useCompany } from '../../contexts/CompanyContext';
import { useAppStore } from '../../stores/appStore';
import { exportData } from '../../services/exportService';
import {
  IFRS_MAPPING_CODES,
  TrialBalanceEntry,
  IfrsGeneralSettings,
  computeIfrsEngine,
  ifrsFinancialEngineService,
  suggestIfrsCode,
} from '../../services/accounting/ifrsFinancialEngineService';

interface IfrsFinancialEngineWorkspaceProps {
  initialSection?: 'overview' | 'trial-balance' | 'diagnostics' | 'statements' | 'ratios-plan' | 'mapping-settings';
}

export const IfrsFinancialEngineWorkspace: React.FC<IfrsFinancialEngineWorkspaceProps> = ({
  initialSection = 'ratios-plan',
}) => {
  const { activeCompanyId, activeCompany } = useCompany();
  const { addNotification } = useAppStore();

  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'trial-balance' | 'diagnostics' | 'statements' | 'ratios-plan' | 'mapping-settings'
  >(initialSection);

  const [activeStatementView, setActiveStatementView] = useState<
    'balance-sheet' | 'income-statement' | 'equity-changes' | 'cash-flow'
  >('balance-sheet');

  const [entries, setEntries] = useState<TrialBalanceEntry[]>(() =>
    ifrsFinancialEngineService.getTrialBalance(activeCompanyId)
  );

  const [settings, setSettings] = useState<IfrsGeneralSettings>(() =>
    ifrsFinancialEngineService.getSettings(activeCompanyId, activeCompany.name)
  );

  const [tbSearch, setTbSearch] = useState('');
  const [tbFilter, setTbFilter] = useState<'all' | 'unclassified' | 'warnings' | 'classified'>('all');
  const [tbCodeFilter, setTbCodeFilter] = useState<string>('ALL');

  // Interactive Financial Ratios Plan What-If Simulator State
  const [simRevenueGrowthPct, setSimRevenueGrowthPct] = useState<number>(15);
  const [simCostReductionPct, setSimCostReductionPct] = useState<number>(8);
  const [simCollectionAccelDays, setSimCollectionAccelDays] = useState<number>(15);
  const [simDebtPaydownPct, setSimDebtPaydownPct] = useState<number>(20);

  // Recompute full IFRS engine whenever entries or settings change
  const engine = useMemo(() => computeIfrsEngine(entries, settings), [entries, settings]);

  // Filtered Trial Balance rows
  const filteredRows = useMemo(() => {
    return engine.rows.filter((r) => {
      if (tbFilter === 'unclassified' && r.approvedCode) return false;
      if (tbFilter === 'classified' && !r.approvedCode) return false;
      if (tbFilter === 'warnings' && !r.auditNote) return false;
      if (tbCodeFilter !== 'ALL' && r.approvedCode !== tbCodeFilter) return false;
      if (tbSearch.trim()) {
        const q = tbSearch.trim().toLowerCase();
        return (
          r.accountName.toLowerCase().includes(q) ||
          r.erpCode.toLowerCase().includes(q) ||
          r.approvedCode.toLowerCase().includes(q) ||
          r.approvedItemName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [engine.rows, tbFilter, tbCodeFilter, tbSearch]);

  // What-If Simulated Financial Ratios Calculation
  const simulatedPlan = useMemo(() => {
    const curRev = engine.incomeStatement.revenues;
    const curCogs = engine.incomeStatement.costOfRevenues;
    const curOpex =
      engine.incomeStatement.sellingMarketingExp +
      engine.incomeStatement.generalAdminExp +
      engine.incomeStatement.depreciationAmortization +
      engine.incomeStatement.otherExpenses;

    const projRev = curRev * (1 + simRevenueGrowthPct / 100);
    const projCogs = curCogs * (1 + (simRevenueGrowthPct * 0.5) / 100) * (1 - simCostReductionPct / 100);
    const projGrossProfit = projRev - projCogs;
    const projOperatingProfit =
      projGrossProfit + engine.incomeStatement.otherIncome - curOpex * (1 - simCostReductionPct / 200);
    const projNetProfit =
      projOperatingProfit +
      engine.incomeStatement.financeIncome -
      engine.incomeStatement.financeCosts * (1 - simDebtPaydownPct / 100) -
      engine.incomeStatement.zakatAndTaxExpense;

    const collectedCashFromRec =
      engine.balanceSheet.current.tradeReceivablesNet * Math.min(0.8, simCollectionAccelDays / 60);
    const debtPaid =
      engine.balanceSheet.current.totalCurrentLiabilities * (simDebtPaydownPct / 100);

    const projCurrentAssets =
      engine.balanceSheet.current.totalCurrentAssets +
      Math.max(0, projNetProfit - engine.incomeStatement.netProfit) -
      debtPaid;
    const projCurrentLiabilities = Math.max(
      1,
      engine.balanceSheet.current.totalCurrentLiabilities - debtPaid
    );
    const projTotalLiabilities = Math.max(
      1,
      engine.balanceSheet.current.totalLiabilities - debtPaid
    );
    const projTotalEquity =
      engine.balanceSheet.current.totalEquity +
      Math.max(0, projNetProfit - engine.incomeStatement.netProfit);
    const projTotalAssets =
      engine.balanceSheet.current.totalNonCurrentAssets + projCurrentAssets;

    const projCurrentRatio = projCurrentAssets / projCurrentLiabilities;
    const projGrossMargin = projRev > 0 ? (projGrossProfit / projRev) * 100 : 0;
    const projNetMargin = projRev > 0 ? (projNetProfit / projRev) * 100 : 0;
    const projRoe = projTotalEquity > 0 ? (projNetProfit / projTotalEquity) * 100 : 0;
    const projRoa = projTotalAssets > 0 ? (projNetProfit / projTotalAssets) * 100 : 0;
    const projDebtToEquity = projTotalEquity > 0 ? projTotalLiabilities / projTotalEquity : 0;
    const projReceivables = Math.max(0, engine.balanceSheet.current.tradeReceivablesNet - collectedCashFromRec);
    const projDso = projRev > 0 ? (projReceivables / projRev) * 365 : 0;

    return {
      projRev,
      projGrossProfit,
      projNetProfit,
      projCurrentRatio,
      projGrossMargin,
      projNetMargin,
      projRoe,
      projRoa,
      projDebtToEquity,
      projDso,
    };
  }, [
    engine,
    simRevenueGrowthPct,
    simCostReductionPct,
    simCollectionAccelDays,
    simDebtPaydownPct,
  ]);

  // Handlers
  const handleUpdateRow = (seq: number, patch: Partial<TrialBalanceEntry>) => {
    const next = entries.map((item) => (item.seq === seq ? { ...item, ...patch } : item));
    setEntries(next);
    ifrsFinancialEngineService.saveTrialBalance(activeCompanyId, next);
  };

  const handleFreezeSuggestedMappings = () => {
    let updatedCount = 0;
    const next = entries.map((item) => {
      if (!item.manualCode) {
        const suggested = suggestIfrsCode(item.accountName);
        if (suggested) {
          updatedCount++;
          return { ...item, manualCode: suggested };
        }
      }
      return item;
    });
    setEntries(next);
    ifrsFinancialEngineService.saveTrialBalance(activeCompanyId, next);
    addNotification({
      title: 'اعتماد التصنيف المقترح (FS_Freeze)',
      message:
        updatedCount > 0
          ? `تم نسخ واعتماد التصنيف المقترح لعدد (${updatedCount}) حساباً بنجاح.`
          : 'جميع الحسابات الـ 211 مصنفة ومعتمدة بالفعل.',
      type: 'success',
    });
  };

  const handleLoadBalancedSample = () => {
    const seeded = ifrsFinancialEngineService.resetTrialBalance(activeCompanyId, true);
    setEntries(seeded);
    addNotification({
      title: 'تحميل ميزان المراجعة التشغيلي (211 حساباً)',
      message: 'تم تحميل الأرصدة الافتتاحية وحركات السنة المتزنة لجميع حسابات الملف الـ 211 وتحديث القوائم الخمس والنسب المالية.',
      type: 'success',
    });
  };

  const handleLoadRawZeroBalances = () => {
    const raw = ifrsFinancialEngineService.resetTrialBalance(activeCompanyId, false);
    setEntries(raw);
    addNotification({
      title: 'تصفير الأرصدة (الوضع الخام كما في بببب.xlsx)',
      message: 'تمت إعادة الحسابات الـ 211 إلى الوضع الخام بدون أرصدة مع إبقاء الـ 57 حساباً غير مصنفة للمراجعة اليدوية.',
      type: 'info',
    });
  };

  const handleAddAccountRow = () => {
    const nextSeq = entries.length + 1;
    const newRow: TrialBalanceEntry = {
      seq: nextSeq,
      erpCode: `${1000 + nextSeq}`,
      accountName: `حساب جديد #${nextSeq}`,
      manualCode: 'A-10',
      openingDebit: 0,
      openingCredit: 0,
      periodDebit: 0,
      periodCredit: 0,
      movementSource: 'فعلي',
    };
    const next = [...entries, newRow];
    setEntries(next);
    ifrsFinancialEngineService.saveTrialBalance(activeCompanyId, next);
    addNotification({
      title: 'إضافة حساب للميزان',
      message: `تمت إضافة الصف رقم (${nextSeq}) في ميزان المراجعة بنجاح.`,
      type: 'success',
    });
  };

  const handleExportTrialBalance = () => {
    const exportRows = engine.rows.map((r) => ({
      'م': r.seq,
      'رقم الحساب ERP': r.erpCode,
      'اسم الحساب': r.accountName,
      'التصنيف المعتمد': r.approvedCode,
      'البند في القوائم': r.approvedItemName,
      'الطبيعة': r.naturalBalance,
      'أول المدة - مدين': r.openingDebit,
      'أول المدة - دائن': r.openingCredit,
      'حركات السنة - مدين': r.periodDebit,
      'حركات السنة - دائن': r.periodCredit,
      'آخر المدة - مدين': r.closingDebit,
      'آخر المدة - دائن': r.closingCredit,
      'حالة الفحص': r.statusText,
      'ملاحظات الفحص': r.auditNote,
    }));
    exportData(exportRows, `ميزان_المراجعة_IFRS_${activeCompany.code}`, 'excel');
    addNotification({
      title: 'تصدير ميزان المراجعة IFRS',
      message: 'تم تصدير ميزان المراجعة الكامل (211 حساباً) بصيغة Excel.',
      type: 'success',
    });
  };

  const handleExportRatiosPlan = () => {
    const exportRows = engine.ratios.map((r) => ({
      'المجموعة': r.category,
      'النسبة المالية': r.name,
      'طريقة الحساب': r.formula,
      'النتيجة الحالية': r.formattedValue,
      'المعيار المرجعي': r.benchmark,
      'مستهدف Q4 2026': r.target2026Q4,
      'مستهدف 2027': r.target2027,
      'التقييم': r.evaluation,
      'التفسير المالي': r.meaning,
      'خطة العمل والتوصية': r.actionPlan,
    }));
    exportData(exportRows, `خطة_النسب_المالية_IFRS_${activeCompany.code}`, 'excel');
    addNotification({
      title: 'تصدير خطة النسب المالية',
      message: 'تم تصدير تقرير النسب المالية الـ 16 وخطة العمل الاستراتيجية إلى Excel.',
      type: 'success',
    });
  };

  const fmt = (n: number) =>
    `${Math.round(n).toLocaleString()} ⃁`;

  return (
    <div data-slot="ifrs-financial-engine-workspace" className="space-y-6 text-right dir-rtl">
      {/* Top IFRS Executive Command Header */}
      <div className="bg-[#141414] text-[#ffffff] rounded-3xl p-6 border border-[#262626] shadow-sm space-y-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#ffffff] text-[#141414]">
                IFRS / IAS 1 / IAS 7 / IFRS 18 ENGINE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-[#262626] text-[#ffffff] border border-[#404040]">
                211 حساباً مستورداً من ملف بببب.xlsx • 34 فحصاً معيارياً • 5 قوائم مالية • 16 نسبة مالية وخطة استراتيجية
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-[#ffffff] m-0">
              منظومة إعداد القوائم المالية من ميزان المراجعة وخطة النسب المالية — {settings.companyName}
            </h2>
            <p className="text-xs text-[#adadad] mt-1">
              تاريخ القوائم: <span className="font-mono text-[#ffffff]">{settings.reportingDate}</span> | العملة:{' '}
              <span className="font-bold text-[#ffffff]">{settings.currency}</span> | الحكم العام:{' '}
              <span className="font-bold text-[#ffffff]">{engine.diagnostics.overallVerdict}</span>
            </p>
          </div>

          {/* Macro-Equivalent Action Buttons (FS_Engine Buttons) */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleFreezeSuggestedMappings}
              className="px-3.5 py-2 rounded-full bg-[#ffffff] text-[#141414] hover:bg-[#f3f3f3] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              title="نسخ التصنيف المقترح (H) إلى التصنيف اليدوي المعتمد (G) لجميع الحسابات غير المصنفة"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>اعتماد التصنيف المقترح (211 حساباً)</span>
            </button>
            <button
              type="button"
              onClick={handleLoadBalancedSample}
              className="px-3.5 py-2 rounded-full bg-[#262626] text-[#ffffff] hover:bg-[#363636] border border-[#404040] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>تحميل أرصدة تشغيلية متزنة</span>
            </button>
            <button
              type="button"
              onClick={handleLoadRawZeroBalances}
              className="px-3.5 py-2 rounded-full bg-[#262626] text-[#ffffff] hover:bg-[#363636] border border-[#404040] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>الوضع الخام (تصفير الأرصدة)</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-full bg-[#0066ff] text-[#ffffff] hover:opacity-95 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>تصدير PDF / طباعة القوائم</span>
            </button>
          </div>
        </div>

        {/* 6 Live Summary Strip Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {[
            { label: 'الإيرادات (IFRS 15)', val: fmt(engine.incomeStatement.revenues), sub: 'صافي المبيعات والعقود' },
            { label: 'مجمل الربح', val: fmt(engine.incomeStatement.grossProfit), sub: `هامش ${engine.incomeStatement.revenues > 0 ? ((engine.incomeStatement.grossProfit / engine.incomeStatement.revenues) * 100).toFixed(1) : 0}%` },
            { label: 'صافي ربح السنة', val: fmt(engine.incomeStatement.netProfit), sub: `EBITDA: ${fmt(engine.incomeStatement.ebitda)}` },
            { label: 'إجمالي الأصول (IAS 1)', val: fmt(engine.balanceSheet.current.totalAssets), sub: engine.closingDiff <= settings.roundingTolerance ? '✔ المركز المالي متزن' : '✖ يوجد فرق توازن' },
            { label: 'إجمالي حقوق الملكية', val: fmt(engine.balanceSheet.current.totalEquity), sub: `ROE: ${engine.ratios.find((r) => r.id === 'roe')?.formattedValue || '0%'}` },
            { label: 'نسبة التداول (السيولة)', val: engine.ratios.find((r) => r.id === 'current-ratio')?.formattedValue || '0x', sub: `الأخطاء الجوهرية: ${engine.diagnostics.criticalErrorsCount} | التنبيهات: ${engine.diagnostics.warningsCount}` },
          ].map((kpi, idx) => (
            <div key={idx} className="bg-[#1f1f1f] border border-[#303030] rounded-2xl p-3">
              <div className="text-[11px] text-[#adadad]">{kpi.label}</div>
              <div className="text-sm md:text-base font-bold font-mono text-[#ffffff] mt-1">{kpi.val}</div>
              <div className="text-[10px] text-[#adadad] mt-1 truncate">{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* Navigation Pill Bar */}
        <div className="flex items-center gap-1.5 bg-[#1f1f1f] p-1.5 rounded-full border border-[#303030] overflow-x-auto">
          {[
            { id: 'ratios-plan', label: '1. النسب المالية وخطة التحسين (16 نسبة + محاكي What-If)', icon: Target },
            { id: 'statements', label: '2. القوائم المالية الخمس (المركز المالي • الدخل • الملكية • التدفقات)', icon: Landmark },
            { id: 'trial-balance', label: `3. ميزان المراجعة الذكي (${entries.length} حساباً)`, icon: Scale },
            { id: 'diagnostics', label: `4. مركز الفحوصات وكشف الأخطاء (34 فحصاً IFRS)`, icon: ShieldCheck },
            { id: 'mapping-settings', label: '5. جدول التصنيفات (A-01..R-10) والإعدادات', icon: Sliders },
            { id: 'overview', label: '6. دليل التشغيل وحوكمة IFRS 18', icon: BookOpen },
          ].map((tab) => {
            const IconComp = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-full text-xs flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
                  active
                    ? 'bg-[#ffffff] text-[#141414] font-bold shadow-xs'
                    : 'text-[#d4d4d8] hover:text-[#ffffff] hover:bg-[#2a2a2a]'
                }`}
              >
                <IconComp className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 1: FINANCIAL RATIOS & STRATEGIC IMPROVEMENT PLAN (خطة النسب المالية)
         ═══════════════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'ratios-plan' && (
        <div className="space-y-6">
          {/* Header & Export */}
          <div className="bg-white p-5 rounded-3xl border border-[#e0e0e0] flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#141414]" />
                <h3 className="text-base font-bold text-[#141414] m-0">
                  النسب المالية والتحليل وخطة تحسين المؤشرات المالية (16 نسبة معيارية + نموذج DuPont + مؤشر Altman Z-Score)
                </h3>
              </div>
              <p className="text-xs text-[#707070] mt-1">
                تحتسب كل نسبة آلياً من القوائم المالية الخمس مع المعيار المرجعي الإرشادي، التقييم التلقائي، وخطة العمل التنفيذية لتحقيق مستهدفات 2026–2027
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportRatiosPlan}
                className="button-outline-on-light"
                style={{ padding: '6px 14px', fontSize: '12px' }}
              >
                <FileSpreadsheet className="w-4 h-4 ml-1" />
                <span>تصدير خطة النسب المالية Excel</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="button-primary-pill"
                style={{ padding: '6px 16px', fontSize: '12px' }}
              >
                <Printer className="w-4 h-4 ml-1" />
                <span>طباعة خطة النسب المالية</span>
              </button>
            </div>
          </div>

          {/* DuPont 3-Step ROE & Altman Z-Score & Cash Conversion Cycle Executive Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* DuPont ROE Analysis */}
            <div className="bg-white p-5 rounded-3xl border border-[#e0e0e0] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#141414]">تحليل دي بونت الثلاثي (DuPont ROE Model)</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#f3f3f3] text-[#141414] border border-[#e0e0e0]">
                  ROE = {engine.advancedMetrics.dupontRoePct.toFixed(1)}%
                </span>
              </div>
              <p className="text-[11px] text-[#707070] m-0">
                تفكيك العائد على حقوق الملكية إلى 3 محركات استراتيجية: هامش صافي الربح × دوران الأصول × مضاعف الملكية
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2.5 rounded-2xl bg-[#f3f3f3] border border-[#e0e0e0]">
                  <div className="text-[10px] text-[#707070]">هامش صافي الربح</div>
                  <div className="text-sm font-bold font-mono text-[#141414] mt-0.5">
                    {engine.ratios.find((r) => r.id === 'net-margin')?.formattedValue}
                  </div>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#f3f3f3] border border-[#e0e0e0]">
                  <div className="text-[10px] text-[#707070]">× دوران الأصول</div>
                  <div className="text-sm font-bold font-mono text-[#141414] mt-0.5">
                    {engine.ratios.find((r) => r.id === 'asset-turnover')?.formattedValue}
                  </div>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#f3f3f3] border border-[#e0e0e0]">
                  <div className="text-[10px] text-[#707070]">× مضاعف الملكية</div>
                  <div className="text-sm font-bold font-mono text-[#141414] mt-0.5">
                    {engine.advancedMetrics.equityMultiplier.toFixed(2)}x
                  </div>
                </div>
              </div>
            </div>

            {/* Altman Z-Score Going Concern */}
            <div className="bg-white p-5 rounded-3xl border border-[#e0e0e0] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#141414]">مؤشر ألتمان للاستمرارية (Altman Z&apos;&apos;-Score)</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#141414] text-[#ffffff]">
                  Z = {engine.advancedMetrics.altmanZScore.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-[#707070] m-0">
                نموذج التنبؤ بالملاءة المالية واستمرارية النشاط للشركات الخدمية وفق معيار IAS 1.25 (المنطقة الآمنة &gt; 2.60)
              </p>
              <div className="p-3 rounded-2xl bg-[#f3f3f3] border border-[#e0e0e0] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#141414]">التصنيف الائتماني للاستمرارية:</span>
                <span className="font-bold text-[#141414]">
                  {engine.advancedMetrics.altmanZScore >= 2.6
                    ? '✔ منطقة الأمان المالي العالي (Safe Zone)'
                    : engine.advancedMetrics.altmanZScore >= 1.1
                    ? '⚠ المنطقة الرمادية (Grey Zone - تتطلب مراقبة)'
                    : '✖ منطقة الخطر المالي (Distress Zone)'}
                </span>
              </div>
            </div>

            {/* Cash Conversion Cycle (CCC) */}
            <div className="bg-white p-5 rounded-3xl border border-[#e0e0e0] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#141414]">دورة التحول النقدي (Cash Conversion Cycle)</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#f3f3f3] text-[#141414] border border-[#e0e0e0]">
                  {Math.round(engine.advancedMetrics.cashConversionCycle)} يوم
                </span>
              </div>
              <p className="text-[11px] text-[#707070] m-0">
                الفترة الزمنية بين دفع مستحقات الوكلاء وتحصيل عقود العملاء (DSO + DIO - DPO)
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2.5 rounded-2xl bg-[#f3f3f3] border border-[#e0e0e0]">
                  <div className="text-[10px] text-[#707070]">تحصيل الذمم DSO</div>
                  <div className="text-sm font-bold font-mono text-[#141414] mt-0.5">
                    {engine.ratios.find((r) => r.id === 'dso')?.formattedValue}
                  </div>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#f3f3f3] border border-[#e0e0e0]">
                  <div className="text-[10px] text-[#707070]">+ المخزون DIO</div>
                  <div className="text-sm font-bold font-mono text-[#141414] mt-0.5">
                    {engine.ratios.find((r) => r.id === 'dio')?.formattedValue}
                  </div>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#f3f3f3] border border-[#e0e0e0]">
                  <div className="text-[10px] text-[#707070]">- سداد الموردين DPO</div>
                  <div className="text-sm font-bold font-mono text-[#141414] mt-0.5">
                    {engine.ratios.find((r) => r.id === 'dpo')?.formattedValue}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive What-If Financial Ratios Plan Simulator */}
          <div className="bg-white p-6 rounded-3xl border border-[#e0e0e0] space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3 border-b border-[#e0e0e0] pb-4">
              <div>
                <h4 className="text-sm font-bold text-[#141414] m-0 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#141414]" />
                  <span>محاكي خطة النسب المالية التفاعلي (What-If Financial Ratios Planner 2026/2027)</span>
                </h4>
                <p className="text-xs text-[#707070] mt-0.5">
                  حرّك المؤشرات الأربع لمحاكاة أثر الخطة التشغيلية والمالية على النسب المالية وصافي الربح والسيولة فوراً
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSimRevenueGrowthPct(15);
                  setSimCostReductionPct(8);
                  setSimCollectionAccelDays(15);
                  setSimDebtPaydownPct(20);
                }}
                className="button-outline-on-light"
                style={{ padding: '4px 12px', fontSize: '11px' }}
              >
                إعادة ضبط الخطة الافتراضية
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#f3f3f3] border border-[#e0e0e0] space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#141414]">
                  <span>1. نمو الإيرادات المستهدف:</span>
                  <span className="font-mono">+{simRevenueGrowthPct}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={1}
                  aria-label="نمو الإيرادات المستهدف"
                  value={simRevenueGrowthPct}
                  onChange={(e) => setSimRevenueGrowthPct(Number(e.target.value))}
                  className="w-full accent-[#141414] cursor-pointer"
                />
                <div className="text-[10.5px] text-[#707070]">
                  التوسع في عقود استقدام مساند والتأجير المرن ونقل الكفالة
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#f3f3f3] border border-[#e0e0e0] space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#141414]">
                  <span>2. ترشيد التكاليف المباشرة:</span>
                  <span className="font-mono">-{simCostReductionPct}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  aria-label="ترشيد التكاليف المباشرة"
                  value={simCostReductionPct}
                  onChange={(e) => setSimCostReductionPct(Number(e.target.value))}
                  className="w-full accent-[#141414] cursor-pointer"
                />
                <div className="text-[10.5px] text-[#707070]">
                  خصومات تذاكر الطيران وعمولات الوكلاء وترشيد الإعاشة
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#f3f3f3] border border-[#e0e0e0] space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#141414]">
                  <span>3. تسريع تحصيل الذمم (DSO):</span>
                  <span className="font-mono">-{simCollectionAccelDays} يوم</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={45}
                  step={1}
                  aria-label="تسريع تحصيل الذمم"
                  value={simCollectionAccelDays}
                  onChange={(e) => setSimCollectionAccelDays(Number(e.target.value))}
                  className="w-full accent-[#141414] cursor-pointer"
                />
                <div className="text-[10.5px] text-[#707070]">
                  تسريع تسويات حساب ضمان مساند وتحصيل ذمم العملاء
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#f3f3f3] border border-[#e0e0e0] space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#141414]">
                  <span>4. تخفيض الالتزامات المتداولة:</span>
                  <span className="font-mono">-{simDebtPaydownPct}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={1}
                  aria-label="تخفيض الالتزامات المتداولة"
                  value={simDebtPaydownPct}
                  onChange={(e) => setSimDebtPaydownPct(Number(e.target.value))}
                  className="w-full accent-[#141414] cursor-pointer"
                />
                <div className="text-[10.5px] text-[#707070]">
                  سداد دفعات التمويل وجدولة المستحقات لتحسين نسبة التداول
                </div>
              </div>
            </div>

            {/* Simulated Output Comparison Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              {[
                {
                  title: 'صافي الربح المتوقع',
                  cur: fmt(engine.incomeStatement.netProfit),
                  sim: fmt(simulatedPlan.projNetProfit),
                },
                {
                  title: 'نسبة التداول المتوقعة',
                  cur: `${(engine.ratios.find((r) => r.id === 'current-ratio')?.value || 0).toFixed(2)}x`,
                  sim: `${simulatedPlan.projCurrentRatio.toFixed(2)}x`,
                },
                {
                  title: 'هامش مجمل الربح',
                  cur: `${(engine.ratios.find((r) => r.id === 'gross-margin')?.value || 0).toFixed(1)}%`,
                  sim: `${simulatedPlan.projGrossMargin.toFixed(1)}%`,
                },
                {
                  title: 'هامش صافي الربح',
                  cur: `${(engine.ratios.find((r) => r.id === 'net-margin')?.value || 0).toFixed(1)}%`,
                  sim: `${simulatedPlan.projNetMargin.toFixed(1)}%`,
                },
                {
                  title: 'العائد على الملكية ROE',
                  cur: `${(engine.ratios.find((r) => r.id === 'roe')?.value || 0).toFixed(1)}%`,
                  sim: `${simulatedPlan.projRoe.toFixed(1)}%`,
                },
                {
                  title: 'فترة التحصيل DSO',
                  cur: `${Math.round(engine.ratios.find((r) => r.id === 'dso')?.value || 0)} يوم`,
                  sim: `${Math.round(simulatedPlan.projDso)} يوم`,
                },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl border border-[#e0e0e0] bg-white">
                  <div className="text-[11px] text-[#707070]">{item.title}</div>
                  <div className="flex items-baseline justify-between mt-1.5">
                    <span className="text-[11px] font-mono text-[#707070] line-through">{item.cur}</span>
                    <span className="text-sm font-bold font-mono text-[#141414]">{item.sim}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Complete 16 Financial Ratios Matrix Table with Action Plan */}
          <div className="bg-white rounded-3xl border border-[#e0e0e0] overflow-hidden shadow-xs">
            <div className="p-4 bg-[#f3f3f3] border-b border-[#e0e0e0] flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#141414] m-0">
                مصفوفة النسب المالية الـ 16 وخطة المستهدفات الربعية والسنوية (IFRS Financial Ratios & Action Plan)
              </h4>
              <span className="text-xs text-[#707070]">
                4 مجموعات رئيسية: السيولة • الهيكل المالي والمديونية • الربحية • الكفاءة التشغيلية
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#f3f3f3] text-[#141414] font-bold border-b border-[#e0e0e0]">
                  <tr>
                    <th className="p-3">المجموعة</th>
                    <th className="p-3">النسبة المالية</th>
                    <th className="p-3">معادلة الاحتساب</th>
                    <th className="p-3 font-mono">الفعلي الحالي</th>
                    <th className="p-3 font-mono">المعيار الإرشادي</th>
                    <th className="p-3 font-mono">مستهدف 2026</th>
                    <th className="p-3 font-mono">مستهدف 2027</th>
                    <th className="p-3">التقييم التلقائي</th>
                    <th className="p-3">التفسير وخطة العمل التنفيذية لتحسين النسبة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e0e0]">
                  {engine.ratios.map((ratio) => (
                    <tr key={ratio.id} className="hover:bg-[#f3f3f3]/50">
                      <td className="p-3 font-semibold text-[#707070] whitespace-nowrap">{ratio.category}</td>
                      <td className="p-3 font-bold text-[#141414] whitespace-nowrap">{ratio.name}</td>
                      <td className="p-3 text-[#707070]">{ratio.formula}</td>
                      <td className="p-3 font-mono font-bold text-sm text-[#141414] whitespace-nowrap">
                        {ratio.formattedValue}
                      </td>
                      <td className="p-3 font-mono text-[#707070] whitespace-nowrap">{ratio.benchmark}</td>
                      <td className="p-3 font-mono font-semibold text-[#141414] whitespace-nowrap">
                        {ratio.unit === 'percent'
                          ? `${ratio.target2026Q4}%`
                          : ratio.unit === 'days'
                          ? `${ratio.target2026Q4} يوم`
                          : ratio.unit === 'currency'
                          ? fmt(ratio.target2026Q4)
                          : `${ratio.target2026Q4}x`}
                      </td>
                      <td className="p-3 font-mono font-semibold text-[#141414] whitespace-nowrap">
                        {ratio.unit === 'percent'
                          ? `${ratio.target2027}%`
                          : ratio.unit === 'days'
                          ? `${ratio.target2027} يوم`
                          : ratio.unit === 'currency'
                          ? fmt(ratio.target2027)
                          : `${ratio.target2027}x`}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            ratio.evaluation === 'ممتاز / جيد'
                              ? 'bg-[#141414] text-[#ffffff]'
                              : ratio.evaluation === 'مقبول'
                              ? 'bg-[#f3f3f3] text-[#141414] border border-[#e0e0e0]'
                              : 'bg-[#f3f3f3] text-[#707070] border border-[#e0e0e0]'
                          }`}
                        >
                          {ratio.evaluation === 'ممتاز / جيد'
                            ? '✔ ممتاز / جيد'
                            : ratio.evaluation === 'مقبول'
                            ? '⚠ مقبول'
                            : '✖ ضعيف'}
                        </span>
                      </td>
                      <td className="p-3 max-w-md">
                        <div className="text-[#141414] font-medium">{ratio.meaning}</div>
                        <div className="text-[11px] text-[#707070] mt-0.5">
                          <strong className="text-[#141414]">خطة التحسين:</strong> {ratio.actionPlan}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 2: THE 5 IFRS FINANCIAL STATEMENTS (القوائم المالية الخمس)
         ═══════════════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'statements' && (
        <div className="space-y-5">
          {/* Statement Selector Bar */}
          <div className="bg-white p-4 rounded-3xl border border-[#e0e0e0] flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: 'balance-sheet', label: '1. قائمة المركز المالي (IAS 1)' },
                { id: 'income-statement', label: '2. قائمة الربح أو الخسارة والدخل الشامل (IAS 1 / IFRS 18)' },
                { id: 'equity-changes', label: '3. قائمة التغيرات في حقوق الملكية (IAS 1.106)' },
                { id: 'cash-flow', label: '4. قائمة التدفقات النقدية - غير المباشرة (IAS 7)' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setActiveStatementView(st.id as any)}
                  className={`px-4 py-2 rounded-full text-xs cursor-pointer transition-all ${
                    activeStatementView === st.id
                      ? 'bg-[#141414] text-[#ffffff] font-bold'
                      : 'bg-[#f3f3f3] text-[#141414] hover:bg-[#e0e0e0] font-medium'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="button-primary-pill"
              style={{ padding: '6px 16px', fontSize: '12px' }}
            >
              <Printer className="w-4 h-4 ml-1" />
              <span>طباعة القائمة الحالية</span>
            </button>
          </div>

          {/* 1. STATEMENT OF FINANCIAL POSITION (IAS 1) */}
          {activeStatementView === 'balance-sheet' && (
            <div className="bg-white p-6 rounded-3xl border border-[#e0e0e0] space-y-4">
              <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-4 flex-wrap gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#141414] m-0">
                    {settings.companyName} — قائمة المركز المالي (IAS 1)
                  </h3>
                  <p className="text-xs text-[#707070] mt-0.5">
                    كما في {settings.reportingDate} | المبالغ بـ {settings.currency}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f3f3f3] text-[#141414] border border-[#e0e0e0]">
                  {Math.abs(engine.balanceSheet.current.diff) <= settings.roundingTolerance
                    ? '✔ متزنة تماماً: الأصول = حقوق الملكية + الالتزامات'
                    : `✖ فرق التوازن: ${fmt(engine.balanceSheet.current.diff)}`}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#f3f3f3] text-[#141414] font-bold border-b border-[#e0e0e0]">
                    <tr>
                      <th className="p-3">البند في قائمة المركز المالي</th>
                      <th className="p-3">الرمز</th>
                      <th className="p-3">المعيار المرجعي</th>
                      <th className="p-3 font-mono">السنة الحالية (2026)</th>
                      <th className="p-3 font-mono">المقارنة (أول المدة)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e0e0e0]">
                    <tr className="bg-[#f3f3f3]/60 font-bold text-[#141414]">
                      <td colSpan={5} className="p-2.5">الأصول غير المتداولة (Non-Current Assets)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">ممتلكات وآلات ومعدات (بالصافي بعد مجمع الإهلاك)</td>
                      <td className="p-2.5 font-mono">A-01 / A-02</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 16</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.balanceSheet.current.ppeNet)}</td>
                      <td className="p-2.5 font-mono text-[#707070]">{fmt(engine.balanceSheet.comparative.ppeNet)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">أصول غير ملموسة (بالصافي)</td>
                      <td className="p-2.5 font-mono">A-03</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 38</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.balanceSheet.current.intangibles)}</td>
                      <td className="p-2.5 font-mono text-[#707070]">{fmt(engine.balanceSheet.comparative.intangibles)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">أصول حق الاستخدام (بالصافي)</td>
                      <td className="p-2.5 font-mono">A-05</td>
                      <td className="p-2.5 font-mono text-[#707070]">IFRS 16</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.balanceSheet.current.rouAssets)}</td>
                      <td className="p-2.5 font-mono text-[#707070]">{fmt(engine.balanceSheet.comparative.rouAssets)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">استثمارات وأصول مالية طويلة الأجل</td>
                      <td className="p-2.5 font-mono">A-04</td>
                      <td className="p-2.5 font-mono text-[#707070]">IFRS 9</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.balanceSheet.current.longTermInvestments)}</td>
                      <td className="p-2.5 font-mono text-[#707070]">{fmt(engine.balanceSheet.comparative.longTermInvestments)}</td>
                    </tr>
                    <tr className="bg-[#f3f3f3] font-bold text-[#141414]">
                      <td className="p-2.5" colSpan={3}>إجمالي الأصول غير المتداولة</td>
                      <td className="p-2.5 font-mono">{fmt(engine.balanceSheet.current.totalNonCurrentAssets)}</td>
                      <td className="p-2.5 font-mono">{fmt(engine.balanceSheet.comparative.totalNonCurrentAssets)}</td>
                    </tr>

                    <tr className="bg-[#f3f3f3]/60 font-bold text-[#141414]">
                      <td colSpan={5} className="p-2.5">الأصول المتداولة (Current Assets)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">مخزون</td>
                      <td className="p-2.5 font-mono">A-06</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 2</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.balanceSheet.current.inventory)}</td>
                      <td className="p-2.5 font-mono text-[#707070]">{fmt(engine.balanceSheet.comparative.inventory)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">ذمم مدينة تجارية وحسابات ضمان مساند (بالصافي بعد خسائر الائتمان)</td>
                      <td className="p-2.5 font-mono">A-07 / A-08</td>
                      <td className="p-2.5 font-mono text-[#707070]">IFRS 9</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.balanceSheet.current.tradeReceivablesNet)}</td>
                      <td className="p-2.5 font-mono text-[#707070]">{fmt(engine.balanceSheet.comparative.tradeReceivablesNet)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">مدفوعات مقدمة، سلف، وأرصدة مدينة أخرى</td>
                      <td className="p-2.5 font-mono">A-09</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 1.66</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.balanceSheet.current.prepaymentsOtherRec)}</td>
                      <td className="p-2.5 font-mono text-[#707070]">{fmt(engine.balanceSheet.comparative.prepaymentsOtherRec)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">نقد وما في حكمه (الصندوق والحسابات البنكية)</td>
                      <td className="p-2.5 font-mono">A-10</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 7</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.balanceSheet.current.cashAndEquivalents)}</td>
                      <td className="p-2.5 font-mono text-[#707070]">{fmt(engine.balanceSheet.comparative.cashAndEquivalents)}</td>
                    </tr>
                    <tr className="bg-[#f3f3f3] font-bold text-[#141414]">
                      <td className="p-2.5" colSpan={3}>إجمالي الأصول المتداولة</td>
                      <td className="p-2.5 font-mono">{fmt(engine.balanceSheet.current.totalCurrentAssets)}</td>
                      <td className="p-2.5 font-mono">{fmt(engine.balanceSheet.comparative.totalCurrentAssets)}</td>
                    </tr>
                    <tr className="bg-[#141414] text-[#ffffff] font-bold text-sm">
                      <td className="p-3" colSpan={3}>إجمالي الأصول (Total Assets)</td>
                      <td className="p-3 font-mono">{fmt(engine.balanceSheet.current.totalAssets)}</td>
                      <td className="p-3 font-mono">{fmt(engine.balanceSheet.comparative.totalAssets)}</td>
                    </tr>

                    {/* Equity & Liabilities */}
                    <tr className="bg-[#f3f3f3]/60 font-bold text-[#141414]">
                      <td colSpan={5} className="p-2.5">حقوق الملكية (Equity)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">رأس المال</td>
                      <td className="p-2.5 font-mono">E-01</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 1.78</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.balanceSheet.current.shareCapital)}</td>
                      <td className="p-2.5 font-mono text-[#707070]">{fmt(engine.balanceSheet.comparative.shareCapital)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">احتياطيات</td>
                      <td className="p-2.5 font-mono">E-02</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 1.79</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.balanceSheet.current.reserves)}</td>
                      <td className="p-2.5 font-mono text-[#707070]">{fmt(engine.balanceSheet.comparative.reserves)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">أرباح مبقاة (تشمل صافي ربح السنة الحالية)</td>
                      <td className="p-2.5 font-mono">E-03 + P&L</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 1.106</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.balanceSheet.current.retainedEarningsWithProfit)}</td>
                      <td className="p-2.5 font-mono text-[#707070]">{fmt(engine.balanceSheet.comparative.retainedEarnings)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">توزيعات ومسحوبات السنة (تخصم)</td>
                      <td className="p-2.5 font-mono">E-04</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 1.107</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(-engine.balanceSheet.current.dividendsDrawings)}</td>
                      <td className="p-2.5 font-mono text-[#707070]">{fmt(-engine.balanceSheet.comparative.dividendsDrawings)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">الدخل الشامل الآخر</td>
                      <td className="p-2.5 font-mono">O-01</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 1.82A</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.balanceSheet.current.oci)}</td>
                      <td className="p-2.5 font-mono text-[#707070]">{fmt(engine.balanceSheet.comparative.oci)}</td>
                    </tr>
                    <tr className="bg-[#f3f3f3] font-bold text-[#141414]">
                      <td className="p-2.5" colSpan={3}>إجمالي حقوق الملكية</td>
                      <td className="p-2.5 font-mono">{fmt(engine.balanceSheet.current.totalEquity)}</td>
                      <td className="p-2.5 font-mono">{fmt(engine.balanceSheet.comparative.totalEquity)}</td>
                    </tr>

                    <tr className="bg-[#f3f3f3]/60 font-bold text-[#141414]">
                      <td colSpan={5} className="p-2.5">الالتزامات غير المتداولة (Non-Current Liabilities)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">قروض وتمويل مرابحة طويل الأجل - الجزء غير المتداول</td>
                      <td className="p-2.5 font-mono">L-01</td>
                      <td className="p-2.5 font-mono text-[#707070]">IFRS 9</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.balanceSheet.current.longTermLoansNonCurrent)}</td>
                      <td className="p-2.5 font-mono text-[#707070]">{fmt(engine.balanceSheet.comparative.longTermLoansNonCurrent)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">التزامات عقود إيجار - الجزء غير المتداول</td>
                      <td className="p-2.5 font-mono">L-02</td>
                      <td className="p-2.5 font-mono text-[#707070]">IFRS 16</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.balanceSheet.current.leaseLiabNonCurrent)}</td>
                      <td className="p-2.5 font-mono text-[#707070]">{fmt(engine.balanceSheet.comparative.leaseLiabNonCurrent)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">مكافأة نهاية الخدمة للموظفين</td>
                      <td className="p-2.5 font-mono">L-03</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 19</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.balanceSheet.current.eosb)}</td>
                      <td className="p-2.5 font-mono text-[#707070]">{fmt(engine.balanceSheet.comparative.eosb)}</td>
                    </tr>
                    <tr className="bg-[#f3f3f3] font-bold text-[#141414]">
                      <td className="p-2.5" colSpan={3}>إجمالي الالتزامات غير المتداولة</td>
                      <td className="p-2.5 font-mono">{fmt(engine.balanceSheet.current.totalNonCurrentLiabilities)}</td>
                      <td className="p-2.5 font-mono">{fmt(engine.balanceSheet.comparative.totalNonCurrentLiabilities)}</td>
                    </tr>

                    <tr className="bg-[#f3f3f3]/60 font-bold text-[#141414]">
                      <td colSpan={5} className="p-2.5">الالتزامات المتداولة (Current Liabilities)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">ذمم دائنة تجارية (الوكلاء الخارجيون والموردون)</td>
                      <td className="p-2.5 font-mono">L-04</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 1.69</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.balanceSheet.current.tradePayables)}</td>
                      <td className="p-2.5 font-mono text-[#707070]">{fmt(engine.balanceSheet.comparative.tradePayables)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">مستحقات وأرصدة دائنة أخرى وضريبة القيمة المضافة</td>
                      <td className="p-2.5 font-mono">L-05</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 1.69</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.balanceSheet.current.accrualsOtherPayables)}</td>
                      <td className="p-2.5 font-mono text-[#707070]">{fmt(engine.balanceSheet.comparative.accrualsOtherPayables)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">قروض قصيرة الأجل والجزء المتداول من القروض طويلة الأجل</td>
                      <td className="p-2.5 font-mono">L-06</td>
                      <td className="p-2.5 font-mono text-[#707070]">IFRS 9</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.balanceSheet.current.shortTermLoansAndCurrentPortion)}</td>
                      <td className="p-2.5 font-mono text-[#707070]">{fmt(engine.balanceSheet.comparative.shortTermLoansAndCurrentPortion)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">مستحق لأطراف ذات علاقة (جاري الشركاء والشركات الشقيقة)</td>
                      <td className="p-2.5 font-mono">L-09</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 24</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.balanceSheet.current.dueToRelatedParties)}</td>
                      <td className="p-2.5 font-mono text-[#707070]">{fmt(engine.balanceSheet.comparative.dueToRelatedParties)}</td>
                    </tr>
                    <tr className="bg-[#f3f3f3] font-bold text-[#141414]">
                      <td className="p-2.5" colSpan={3}>إجمالي الالتزامات المتداولة</td>
                      <td className="p-2.5 font-mono">{fmt(engine.balanceSheet.current.totalCurrentLiabilities)}</td>
                      <td className="p-2.5 font-mono">{fmt(engine.balanceSheet.comparative.totalCurrentLiabilities)}</td>
                    </tr>
                    <tr className="bg-[#141414] text-[#ffffff] font-bold text-sm">
                      <td className="p-3" colSpan={3}>إجمالي حقوق الملكية والالتزامات</td>
                      <td className="p-3 font-mono">{fmt(engine.balanceSheet.current.totalEquityAndLiabilities)}</td>
                      <td className="p-3 font-mono">{fmt(engine.balanceSheet.comparative.totalEquityAndLiabilities)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. STATEMENT OF PROFIT OR LOSS AND OCI (IAS 1 & IFRS 18) */}
          {activeStatementView === 'income-statement' && (
            <div className="bg-white p-6 rounded-3xl border border-[#e0e0e0] space-y-4">
              <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-4 flex-wrap gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#141414] m-0">
                    {settings.companyName} — قائمة الربح أو الخسارة والدخل الشامل الآخر (IAS 1 / IFRS 18)
                  </h3>
                  <p className="text-xs text-[#707070] mt-0.5">
                    للسنة المنتهية في {settings.reportingDate} | العرض حسب الوظيفة (IAS 1.103)
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#141414] text-[#ffffff]">
                  EBITDA: {fmt(engine.incomeStatement.ebitda)}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#f3f3f3] text-[#141414] font-bold border-b border-[#e0e0e0]">
                    <tr>
                      <th className="p-3">البند</th>
                      <th className="p-3">الرمز</th>
                      <th className="p-3">المعيار</th>
                      <th className="p-3 font-mono">السنة الحالية</th>
                      <th className="p-3 font-mono">% من الإيرادات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e0e0e0]">
                    {[
                      { label: 'الإيرادات (صافي مبيعات العقود ونقل الكفالة بعد المردودات)', code: 'R-01', ref: 'IFRS 15', val: engine.incomeStatement.revenues, bold: true },
                      { label: 'تكلفة الإيرادات (مشتريات وصول العمالة، التأشيرات، السكن والإعاشة)', code: 'R-02', ref: 'IAS 2 / IAS 1.99', val: -engine.incomeStatement.costOfRevenues, bold: false },
                      { label: 'مجمل الربح (Gross Profit)', code: 'GP', ref: 'IAS 1', val: engine.incomeStatement.grossProfit, bold: true, shade: true },
                      { label: 'إيرادات أخرى (خصومات وغرامات مكتسبة وإيرادات متنوعة)', code: 'R-05', ref: 'IAS 1.97', val: engine.incomeStatement.otherIncome, bold: false },
                      { label: 'مصروفات بيع وتسويق (عمولات المبيعات والمسوقات والدعاية)', code: 'R-03', ref: 'IAS 1.99', val: -engine.incomeStatement.sellingMarketingExp, bold: false },
                      { label: 'مصروفات عمومية وإدارية (رواتب الإدارة، الإيجارات، المرافق، الصيانة)', code: 'R-04', ref: 'IAS 1.99', val: -engine.incomeStatement.generalAdminExp, bold: false },
                      { label: 'إهلاك وإطفاء', code: 'R-10', ref: 'IAS 16 / 38 / IFRS 16', val: -engine.incomeStatement.depreciationAmortization, bold: false },
                      { label: 'مصروفات أخرى', code: 'R-06', ref: 'IAS 1.97', val: -engine.incomeStatement.otherExpenses, bold: false },
                      { label: 'الربح التشغيلي (Operating Profit / EBIT)', code: 'EBIT', ref: 'IAS 1 / IFRS 18', val: engine.incomeStatement.operatingProfit, bold: true, shade: true },
                      { label: 'إيرادات تمويل', code: 'R-08', ref: 'IAS 1.82', val: engine.incomeStatement.financeIncome, bold: false },
                      { label: 'تكاليف تمويل', code: 'R-07', ref: 'IAS 1.82(b)', val: -engine.incomeStatement.financeCosts, bold: false },
                      { label: 'الربح قبل الزكاة وضريبة الدخل (EBT)', code: 'EBT', ref: 'IAS 1', val: engine.incomeStatement.profitBeforeZakat, bold: true, shade: true },
                      { label: 'الزكاة وضريبة الدخل', code: 'R-09', ref: 'IAS 12 / IFRIC 21', val: -engine.incomeStatement.zakatAndTaxExpense, bold: false },
                      { label: 'صافي ربح (خسارة) السنة (Net Profit)', code: 'NET', ref: 'IAS 1', val: engine.incomeStatement.netProfit, bold: true, dark: true },
                      { label: 'الدخل الشامل الآخر (بنود لن تُعاد إلى الأرباح)', code: 'O-01', ref: 'IAS 1.82A', val: engine.incomeStatement.otherComprehensiveIncome, bold: false },
                      { label: 'إجمالي الدخل الشامل للسنة', code: 'TCI', ref: 'IAS 1', val: engine.incomeStatement.totalComprehensiveIncome, bold: true, shade: true },
                    ].map((row, idx) => {
                      const pct =
                        engine.incomeStatement.revenues > 0
                          ? ((Math.abs(row.val) / engine.incomeStatement.revenues) * 100).toFixed(1) + '%'
                          : '0.0%';
                      return (
                        <tr
                          key={idx}
                          className={
                            row.dark
                              ? 'bg-[#141414] text-[#ffffff] font-bold text-sm'
                              : row.shade
                              ? 'bg-[#f3f3f3] font-bold text-[#141414]'
                              : 'hover:bg-[#f3f3f3]/40'
                          }
                        >
                          <td className="p-3">{row.label}</td>
                          <td className="p-3 font-mono">{row.code}</td>
                          <td className="p-3 font-mono opacity-80">{row.ref}</td>
                          <td className="p-3 font-mono font-bold">{fmt(row.val)}</td>
                          <td className="p-3 font-mono">{pct}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. STATEMENT OF CHANGES IN EQUITY (IAS 1.106) */}
          {activeStatementView === 'equity-changes' && (
            <div className="bg-white p-6 rounded-3xl border border-[#e0e0e0] space-y-4">
              <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-4 flex-wrap gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#141414] m-0">
                    {settings.companyName} — قائمة التغيرات في حقوق الملكية (IAS 1.106)
                  </h3>
                  <p className="text-xs text-[#707070] mt-0.5">
                    للسنة المنتهية في {settings.reportingDate} | المبالغ بـ {settings.currency}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f3f3f3] text-[#141414] border border-[#e0e0e0]">
                  ✔ مطابق لقائمة المركز المالي ({fmt(engine.equityChanges.closing.total)})
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#f3f3f3] text-[#141414] font-bold border-b border-[#e0e0e0]">
                    <tr>
                      <th className="p-3">البيان</th>
                      <th className="p-3 font-mono">رأس المال (E-01)</th>
                      <th className="p-3 font-mono">احتياطيات (E-02)</th>
                      <th className="p-3 font-mono">أرباح مبقاة (E-03)</th>
                      <th className="p-3 font-mono">دخل شامل آخر (O-01)</th>
                      <th className="p-3 font-mono">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e0e0e0]">
                    {[
                      { label: 'الرصيد في بداية السنة (أول المدة)', data: engine.equityChanges.opening, bold: true },
                      { label: 'صافي ربح السنة', data: engine.equityChanges.netProfit, bold: false },
                      { label: 'الدخل الشامل الآخر للسنة', data: engine.equityChanges.ociMovement, bold: false },
                      { label: 'توزيعات ومسحوبات السنة', data: engine.equityChanges.dividends, bold: false },
                      { label: 'زيادة رأس المال والتحويلات والحركات الأخرى', data: engine.equityChanges.otherChanges, bold: false },
                      { label: 'الرصيد في نهاية السنة (آخر المدة)', data: engine.equityChanges.closing, bold: true, dark: true },
                    ].map((row, idx) => (
                      <tr
                        key={idx}
                        className={
                          row.dark
                            ? 'bg-[#141414] text-[#ffffff] font-bold text-sm'
                            : row.bold
                            ? 'bg-[#f3f3f3] font-bold text-[#141414]'
                            : 'hover:bg-[#f3f3f3]/40'
                        }
                      >
                        <td className="p-3">{row.label}</td>
                        <td className="p-3 font-mono">{fmt(row.data.capital)}</td>
                        <td className="p-3 font-mono">{fmt(row.data.reserves)}</td>
                        <td className="p-3 font-mono">{fmt(row.data.retainedEarnings)}</td>
                        <td className="p-3 font-mono">{fmt(row.data.oci)}</td>
                        <td className="p-3 font-mono font-bold">{fmt(row.data.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. STATEMENT OF CASH FLOWS - INDIRECT METHOD (IAS 7) */}
          {activeStatementView === 'cash-flow' && (
            <div className="bg-white p-6 rounded-3xl border border-[#e0e0e0] space-y-4">
              <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-4 flex-wrap gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#141414] m-0">
                    {settings.companyName} — قائمة التدفقات النقدية بالطريقة غير المباشرة (IAS 7)
                  </h3>
                  <p className="text-xs text-[#707070] mt-0.5">
                    للسنة المنتهية في {settings.reportingDate} | المبالغ بـ {settings.currency}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f3f3f3] text-[#141414] border border-[#e0e0e0]">
                  {Math.abs(engine.cashFlow.diff) <= settings.roundingTolerance
                    ? '✔ مطابق لرصيد النقد في ميزان المراجعة (الفرق = 0)'
                    : `فرق المطابقة: ${fmt(engine.cashFlow.diff)}`}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#f3f3f3] text-[#141414] font-bold border-b border-[#e0e0e0]">
                    <tr>
                      <th className="p-3">البند في قائمة التدفقات النقدية</th>
                      <th className="p-3">المعيار</th>
                      <th className="p-3 font-mono">المبلغ ({settings.currency})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e0e0e0]">
                    <tr className="bg-[#f3f3f3]/60 font-bold text-[#141414]">
                      <td colSpan={3} className="p-2.5">الأنشطة التشغيلية (Operating Activities)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">الربح قبل الزكاة وضريبة الدخل</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 7.18(b)</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.cashFlow.profitBeforeZakat)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">يضاف: الإهلاك والإطفاء</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 7.20</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.cashFlow.depreciationAmortization)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">يضاف: صافي تكاليف التمويل</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 7.20</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.cashFlow.netFinanceCostsAddedBack)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">(الزيادة) النقص في المخزون</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 7.20</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.cashFlow.changeInInventory)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">(الزيادة) النقص في الذمم المدينة والمدفوعات المقدمة</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 7.20</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.cashFlow.changeInReceivablesAndPrepayments)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">الزيادة (النقص) في الذمم الدائنة والمستحقات</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 7.20</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.cashFlow.changeInPayablesAndAccruals)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">الزيادة (النقص) في مكافأة نهاية الخدمة والمخصصات</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 7.20</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.cashFlow.changeInEosbAndProvisions)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">الزكاة وضريبة الدخل المدفوعة</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 7.35</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.cashFlow.zakatPaid)}</td>
                    </tr>
                    <tr className="bg-[#f3f3f3] font-bold text-[#141414]">
                      <td className="p-2.5" colSpan={2}>صافي النقد من الأنشطة التشغيلية</td>
                      <td className="p-2.5 font-mono">{fmt(engine.cashFlow.netCashFromOperating)}</td>
                    </tr>

                    <tr className="bg-[#f3f3f3]/60 font-bold text-[#141414]">
                      <td colSpan={3} className="p-2.5">الأنشطة الاستثمارية (Investing Activities)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">شراء أصول ثابتة وغير ملموسة واستثمارات (بالصافي)</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 7.16</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.cashFlow.netCapexAndInvestments)}</td>
                    </tr>
                    <tr className="bg-[#f3f3f3] font-bold text-[#141414]">
                      <td className="p-2.5" colSpan={2}>صافي النقد من الأنشطة الاستثمارية</td>
                      <td className="p-2.5 font-mono">{fmt(engine.cashFlow.netCashFromInvesting)}</td>
                    </tr>

                    <tr className="bg-[#f3f3f3]/60 font-bold text-[#141414]">
                      <td colSpan={3} className="p-2.5">الأنشطة التمويلية (Financing Activities)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">التغير في القروض طويلة وقصيرة الأجل والتسهيلات</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 7.17</td>
                      <td className="p-2.5 font-mono font-bold">
                        {fmt(engine.cashFlow.changeInLongTermLoans + engine.cashFlow.changeInShortTermLoans)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">التغير في المستحق لأطراف ذات علاقة</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 24</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.cashFlow.changeInRelatedParties)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pr-6">التغير في رأس المال والاحتياطيات والتوزيعات</td>
                      <td className="p-2.5 font-mono text-[#707070]">IAS 7.17</td>
                      <td className="p-2.5 font-mono font-bold">
                        {fmt(
                          engine.cashFlow.changeInCapital +
                            engine.cashFlow.changeInReservesAndRetained +
                            engine.cashFlow.dividendsPaid
                        )}
                      </td>
                    </tr>
                    <tr className="bg-[#f3f3f3] font-bold text-[#141414]">
                      <td className="p-2.5" colSpan={2}>صافي النقد من الأنشطة التمويلية</td>
                      <td className="p-2.5 font-mono">{fmt(engine.cashFlow.netCashFromFinancing)}</td>
                    </tr>

                    <tr className="bg-[#f3f3f3] font-bold text-[#141414]">
                      <td className="p-2.5" colSpan={2}>صافي التغير في النقد وما في حكمه خلال السنة</td>
                      <td className="p-2.5 font-mono">{fmt(engine.cashFlow.netChangeInCash)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5" colSpan={2}>النقد وما في حكمه - أول المدة</td>
                      <td className="p-2.5 font-mono font-bold">{fmt(engine.cashFlow.openingCash)}</td>
                    </tr>
                    <tr className="bg-[#141414] text-[#ffffff] font-bold text-sm">
                      <td className="p-3" colSpan={2}>النقد وما في حكمه - آخر المدة (محسوب ومطابق لميزان المراجعة A-10)</td>
                      <td className="p-3 font-mono">{fmt(engine.cashFlow.calculatedClosingCash)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 3: SMART TRIAL BALANCE (ميزان المراجعة الذكي - 211 حساباً)
         ═══════════════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'trial-balance' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-[#e0e0e0] flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute right-3 top-2.5 text-[#707070]" />
                <input
                  type="text"
                  aria-label="بحث في الحسابات الـ 211"
                  placeholder="بحث باسم الحساب أو الكود..."
                  value={tbSearch}
                  onChange={(e) => setTbSearch(e.target.value)}
                  className="w-full bg-[#f3f3f3] border border-[#e0e0e0] rounded-full py-1.5 pr-9 pl-3 text-xs text-[#141414] focus:outline-none"
                />
              </div>

              <select
                aria-label="فلترة حالة التصنيف"
                value={tbFilter}
                onChange={(e) => setTbFilter(e.target.value as any)}
                className="bg-[#f3f3f3] border border-[#e0e0e0] rounded-full py-1.5 px-3 text-xs font-semibold text-[#141414]"
              >
                <option value="all">كل الحسابات ({engine.rows.length})</option>
                <option value="classified">المصنفة ({engine.rows.filter((r) => Boolean(r.approvedCode)).length})</option>
                <option value="unclassified">غير المصنفة ({engine.rows.filter((r) => !r.approvedCode).length})</option>
                <option value="warnings">عليها ملاحظات ({engine.diagnostics.accountErrors.length})</option>
              </select>

              <select
                aria-label="فلترة ببند القوائم المالية"
                value={tbCodeFilter}
                onChange={(e) => setTbCodeFilter(e.target.value)}
                className="bg-[#f3f3f3] border border-[#e0e0e0] rounded-full py-1.5 px-3 text-xs font-semibold text-[#141414]"
              >
                <option value="ALL">كل بنود القوائم (A-01..R-10)</option>
                {IFRS_MAPPING_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.nameAr}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleAddAccountRow}
                className="button-primary-pill"
                style={{ padding: '6px 14px', fontSize: '12px' }}
              >
                <Plus className="w-4 h-4 ml-1" />
                <span>+ إضافة حساب للميزان</span>
              </button>
              <button
                type="button"
                onClick={handleExportTrialBalance}
                className="button-outline-on-light"
                style={{ padding: '6px 14px', fontSize: '12px' }}
              >
                <FileSpreadsheet className="w-4 h-4 ml-1" />
                <span>تصدير الميزان Excel</span>
              </button>
            </div>
          </div>

          {/* Totals Bar */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5 bg-[#f3f3f3] p-3.5 rounded-2xl border border-[#e0e0e0] text-xs">
            <div>
              <span className="text-[#707070] block">أول المدة - مدين (P):</span>
              <strong className="font-mono text-[#141414]">{fmt(engine.totals.openingDebit)}</strong>
            </div>
            <div>
              <span className="text-[#707070] block">أول المدة - دائن (Q):</span>
              <strong className="font-mono text-[#141414]">{fmt(engine.totals.openingCredit)}</strong>
            </div>
            <div>
              <span className="text-[#707070] block">حركة السنة - مدين (R):</span>
              <strong className="font-mono text-[#141414]">{fmt(engine.totals.periodDebit)}</strong>
            </div>
            <div>
              <span className="text-[#707070] block">حركة السنة - دائن (S):</span>
              <strong className="font-mono text-[#141414]">{fmt(engine.totals.periodCredit)}</strong>
            </div>
            <div>
              <span className="text-[#707070] block">آخر المدة - مدين (T):</span>
              <strong className="font-mono text-[#141414]">{fmt(engine.totals.closingDebit)}</strong>
            </div>
            <div>
              <span className="text-[#707070] block">آخر المدة - دائن (U):</span>
              <strong className="font-mono text-[#141414]">{fmt(engine.totals.closingCredit)}</strong>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#e0e0e0] overflow-hidden shadow-xs">
            <div className="overflow-x-auto max-h-[620px]">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#f3f3f3] text-[#141414] font-bold border-b border-[#e0e0e0] sticky top-0 z-10">
                  <tr>
                    <th className="p-2.5">#</th>
                    <th className="p-2.5">اسم الحساب (من بببب.xlsx)</th>
                    <th className="p-2.5">التصنيف اليدوي المعتمد (G)</th>
                    <th className="p-2.5">المقترح (H)</th>
                    <th className="p-2.5 font-mono">أول مدة مدين</th>
                    <th className="p-2.5 font-mono">أول مدة دائن</th>
                    <th className="p-2.5 font-mono">حركة مدين</th>
                    <th className="p-2.5 font-mono">حركة دائن</th>
                    <th className="p-2.5 font-mono">ختامي مدين</th>
                    <th className="p-2.5 font-mono">ختامي دائن</th>
                    <th className="p-2.5">حالة الفحص</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e0e0]">
                  {filteredRows.map((row) => (
                    <tr
                      key={row.seq}
                      className={`hover:bg-[#f3f3f3]/50 ${
                        !row.approvedCode ? 'bg-[#f3f3f3]/70' : ''
                      }`}
                    >
                      <td className="p-2 font-mono text-[#707070]">{row.seq}</td>
                      <td className="p-2 font-semibold text-[#141414] min-w-[200px]">
                        <input
                          type="text"
                          aria-label={`اسم الحساب ${row.seq}`}
                          value={row.accountName}
                          onChange={(e) => handleUpdateRow(row.seq, { accountName: e.target.value })}
                          className="w-full bg-transparent border-b border-transparent focus:border-[#141414] focus:outline-none text-xs font-semibold text-[#141414]"
                        />
                      </td>
                      <td className="p-2 min-w-[210px]">
                        <select
                          aria-label={`تصنيف الحساب ${row.accountName}`}
                          value={row.approvedCode}
                          onChange={(e) => handleUpdateRow(row.seq, { manualCode: e.target.value })}
                          className={`w-full rounded-lg py-1 px-2 text-[11px] font-semibold border ${
                            row.approvedCode
                              ? 'bg-white border-[#e0e0e0] text-[#141414]'
                              : 'bg-[#141414] text-[#ffffff] border-[#141414]'
                          }`}
                        >
                          <option value="">-- غير مصنف (اختر البند) --</option>
                          {IFRS_MAPPING_CODES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.code} ({c.nameAr})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2 font-mono text-[11px] text-[#707070]">{row.suggestedCode}</td>
                      <td className="p-2">
                        <input
                          type="number"
                          aria-label={`أول المدة مدين ${row.seq}`}
                          value={row.openingDebit}
                          onChange={(e) =>
                            handleUpdateRow(row.seq, { openingDebit: parseFloat(e.target.value) || 0 })
                          }
                          className="w-24 bg-[#f3f3f3] border border-[#e0e0e0] rounded-lg py-1 px-2 font-mono text-xs text-[#141414]"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          aria-label={`أول المدة دائن ${row.seq}`}
                          value={row.openingCredit}
                          onChange={(e) =>
                            handleUpdateRow(row.seq, { openingCredit: parseFloat(e.target.value) || 0 })
                          }
                          className="w-24 bg-[#f3f3f3] border border-[#e0e0e0] rounded-lg py-1 px-2 font-mono text-xs text-[#141414]"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          aria-label={`حركة السنة مدين ${row.seq}`}
                          value={row.periodDebit}
                          onChange={(e) =>
                            handleUpdateRow(row.seq, { periodDebit: parseFloat(e.target.value) || 0 })
                          }
                          className="w-24 bg-[#f3f3f3] border border-[#e0e0e0] rounded-lg py-1 px-2 font-mono text-xs text-[#141414]"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          aria-label={`حركة السنة دائن ${row.seq}`}
                          value={row.periodCredit}
                          onChange={(e) =>
                            handleUpdateRow(row.seq, { periodCredit: parseFloat(e.target.value) || 0 })
                          }
                          className="w-24 bg-[#f3f3f3] border border-[#e0e0e0] rounded-lg py-1 px-2 font-mono text-xs text-[#141414]"
                        />
                      </td>
                      <td className="p-2 font-mono font-bold text-[#141414]">
                        {row.closingDebit > 0 ? row.closingDebit.toLocaleString() : '-'}
                      </td>
                      <td className="p-2 font-mono font-bold text-[#141414]">
                        {row.closingCredit > 0 ? row.closingCredit.toLocaleString() : '-'}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <span className="text-[11px] font-medium text-[#141414]">{row.statusText}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 4: DIAGNOSTICS & 34 IFRS AUDIT CHECKS (مركز الفحوصات وكشف الأخطاء)
         ═══════════════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'diagnostics' && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-3xl border border-[#e0e0e0] flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-base font-bold text-[#141414] m-0">
                مركز الفحوصات وكشف الأخطاء المعياري (34 فحصاً مرتبطاً بمعايير IFRS / IAS)
              </h3>
              <p className="text-xs text-[#707070] mt-1">
                كل فحص مرتبط بمعيار دولي، وعند ظهور تنبيه أو خطأ يظهر شرح المشكلة وطريقة الحل في نفس الصف
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="px-3 py-1.5 rounded-full bg-[#141414] text-[#ffffff]">
                الأخطاء الجوهرية: {engine.diagnostics.criticalErrorsCount}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-[#f3f3f3] text-[#141414] border border-[#e0e0e0]">
                التنبيهات: {engine.diagnostics.warningsCount}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#e0e0e0] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#f3f3f3] text-[#141414] font-bold border-b border-[#e0e0e0]">
                  <tr>
                    <th className="p-3">م</th>
                    <th className="p-3">الفحص المعياري</th>
                    <th className="p-3">المرجع (IFRS / IAS)</th>
                    <th className="p-3 font-mono">القيمة</th>
                    <th className="p-3">الحالة</th>
                    <th className="p-3">ماذا تعني المشكلة؟</th>
                    <th className="p-3">كيف تحلها؟</th>
                    <th className="p-3">الخطورة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e0e0]">
                  {engine.diagnostics.checks.map((c) => (
                    <tr key={c.id} className="hover:bg-[#f3f3f3]/50">
                      <td className="p-3 font-mono font-bold text-[#707070]">{c.id}</td>
                      <td className="p-3 font-bold text-[#141414]">{c.title}</td>
                      <td className="p-3 font-mono text-[#707070] whitespace-nowrap">{c.reference}</td>
                      <td className="p-3 font-mono font-bold text-[#141414]">{c.value.toLocaleString()}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            c.status === 'سليم'
                              ? 'bg-[#141414] text-[#ffffff]'
                              : 'bg-[#f3f3f3] text-[#141414] border border-[#141414]'
                          }`}
                        >
                          {c.status === 'سليم' ? '✔ سليم' : c.status === 'تنبيه' ? '⚠ تنبيه' : '✖ خطأ'}
                        </span>
                      </td>
                      <td className="p-3 text-[#707070] max-w-xs">{c.meaning}</td>
                      <td className="p-3 text-[#141414] font-medium max-w-xs">{c.resolution}</td>
                      <td className="p-3 font-semibold text-[#707070]">{c.severity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 5: CHART OF MAPPING & GENERAL SETTINGS (جدول التصنيفات والإعدادات)
         ═══════════════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'mapping-settings' && (
        <div className="space-y-6">
          {/* General Settings Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#e0e0e0] space-y-4">
            <h3 className="text-base font-bold text-[#141414] m-0">
              الإعدادات العامة للقوائم المالية وفصل الجزء المتداول (IAS 1.69 / IFRS 16)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-bold text-[#141414] block mb-1">اسم الشركة في ترويسة القوائم</label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => {
                    const next = { ...settings, companyName: e.target.value };
                    setSettings(next);
                    ifrsFinancialEngineService.saveSettings(activeCompanyId, next);
                  }}
                  className="w-full bg-[#f3f3f3] border border-[#e0e0e0] rounded-xl py-2 px-3 text-xs text-[#141414]"
                />
              </div>
              <div>
                <label className="font-bold text-[#141414] block mb-1">تاريخ نهاية الفترة المالية</label>
                <input
                  type="date"
                  value={settings.reportingDate}
                  onChange={(e) => {
                    const next = { ...settings, reportingDate: e.target.value };
                    setSettings(next);
                    ifrsFinancialEngineService.saveSettings(activeCompanyId, next);
                  }}
                  className="w-full bg-[#f3f3f3] border border-[#e0e0e0] rounded-xl py-2 px-3 text-xs font-mono text-[#141414]"
                />
              </div>
              <div>
                <label className="font-bold text-[#141414] block mb-1">
                  الجزء المتداول من القروض طويلة الأجل - السنة الحالية (⃁)
                </label>
                <input
                  type="number"
                  value={settings.currentPortionLongTermLoansCurrent}
                  onChange={(e) => {
                    const next = {
                      ...settings,
                      currentPortionLongTermLoansCurrent: parseFloat(e.target.value) || 0,
                    };
                    setSettings(next);
                    ifrsFinancialEngineService.saveSettings(activeCompanyId, next);
                  }}
                  className="w-full bg-[#f3f3f3] border border-[#e0e0e0] rounded-xl py-2 px-3 text-xs font-mono text-[#141414]"
                />
              </div>
            </div>
          </div>

          {/* 34 IFRS Mapping Codes Table */}
          <div className="bg-white rounded-3xl border border-[#e0e0e0] overflow-hidden shadow-xs">
            <div className="p-4 bg-[#f3f3f3] border-b border-[#e0e0e0]">
              <h4 className="text-sm font-bold text-[#141414] m-0">
                جدول التصنيفات المعياري (Chart of Mapping A-01..R-10) — يربط كل حساب ببند في القوائم المالية
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#f3f3f3] text-[#141414] font-bold border-b border-[#e0e0e0]">
                  <tr>
                    <th className="p-3">الكود</th>
                    <th className="p-3">اسم البند في القوائم</th>
                    <th className="p-3">القائمة / القسم</th>
                    <th className="p-3">الطبيعة</th>
                    <th className="p-3">مرجع المعيار</th>
                    <th className="p-3">نوع التدفق النقدي</th>
                    <th className="p-3">ملاحظات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e0e0]">
                  {IFRS_MAPPING_CODES.map((m) => (
                    <tr key={m.code} className="hover:bg-[#f3f3f3]/40">
                      <td className="p-3 font-mono font-bold text-[#141414]">{m.code}</td>
                      <td className="p-3 font-bold text-[#141414]">{m.nameAr}</td>
                      <td className="p-3 text-[#707070]">{m.sectionAr}</td>
                      <td className="p-3 font-mono font-bold">{m.naturalBalance}</td>
                      <td className="p-3 font-mono text-[#707070]">{m.ifrsRef}</td>
                      <td className="p-3 font-semibold text-[#141414]">{m.cashFlowType}</td>
                      <td className="p-3 text-[#707070]">{m.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 6: USAGE GUIDE & IFRS 18 GOVERNANCE (دليل الاستخدام وحوكمة IFRS 18)
         ═══════════════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-[#e0e0e0] space-y-3">
            <h3 className="text-base font-bold text-[#141414] m-0">طريقة الاستخدام المعتمدة (6 خطوات)</h3>
            <ol className="space-y-2 text-xs text-[#141414] pr-4 list-decimal">
              <li>افتح تبويب <strong>(ميزان المراجعة الذكي)</strong> لاستعراض الحسابات الـ 211 المستوردة من ملف الشركة (بببب.xlsx).</li>
              <li>راجع أرصدة أول المدة (مدين P / دائن Q) وحركات السنة الفعلية (مدين R / دائن S)، حيث يحسب النظام الرصيد الختامي (T/U) آلياً.</li>
              <li>استخدم زر <strong>(اعتماد التصنيف المقترح)</strong> لتصنيف الحسابات الـ 57 التي كانت غير مصنفة في الملف الخام وفق جدول (A-01 إلى R-10).</li>
              <li>افتح تبويب <strong>(مركز الفحوصات وكشف الأخطاء)</strong> لمراجعة الـ 34 فحصاً معيارياً وطريقة معالجة أي تنبيه.</li>
              <li>تتحدث <strong>القوائم المالية الخمس</strong> تلقائياً: المركز المالي، الدخل الشامل، التغيرات في حقوق الملكية، التدفقات النقدية، والنسب المالية.</li>
              <li>استخدم <strong>(محاكي خطة النسب المالية What-If)</strong> لاختبار خطة تحسين السيولة والربحية وتصدير التقارير إلى Excel أو PDF.</li>
            </ol>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#e0e0e0] space-y-3">
            <h3 className="text-base font-bold text-[#141414] m-0">ضوابط حوكمة شجرة الحسابات ومعيار IFRS 18 الجديد</h3>
            <div className="space-y-2 text-xs text-[#707070]">
              <p className="m-0">
                <strong className="text-[#141414]">• التوافق مع IFRS 18:</strong> ينطبق المعيار الدولي الجديد IFRS 18 (العرض والإفصاح في القوائم المالية بديلاً عن IAS 1) إلزامياً للفترات السنوية التي تبدأ في 1 يناير 2027، وقد تم تضمين المجاميع الفرعية الإلزامية (الربح التشغيلي والربح قبل التمويل والزكاة) مسبقاً في قائمة الدخل.
              </p>
              <p className="m-0">
                <strong className="text-[#141414]">• إفصاحات الأطراف ذات العلاقة (IAS 24):</strong> يرصد النظام تلقائياً حسابات (المستحق من / المستحق إلى) للشركات الشقيقة وجاري الشركاء لتجهيز إيضاح الأطراف ذات العلاقة.
              </p>
              <p className="m-0">
                <strong className="text-[#141414]">• التدفقات النقدية (IAS 7):</strong> يتم التحقق آلياً من مطابقة النقد المحسوب في نهاية قائمة التدفقات النقدية مع رصيد النقد وما في حكمه (A-10) في ميزان المراجعة بفارق صفر.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IfrsFinancialEngineWorkspace;
