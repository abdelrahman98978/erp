import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useCompany } from '../contexts/CompanyContext';
import { useTableMutation, useCostCenters } from '../hooks/queries/useErpQueries';
import { chartOfAccountsService, AccountItem } from '../services/accounting/chartOfAccountsService';
import { useAppStore } from '../stores/appStore';
import { BudgetVsActualWidget } from '../components/finance/BudgetVsActualWidget';
import { 
  Scale, Plus, FileSpreadsheet, FileText, Printer, FileCheck, 
  TrendingUp, TrendingDown, ShieldCheck, Lock, Unlock, Search, 
  Eye, X, ArrowLeft, ArrowRight, FolderTree, Receipt, PieChart, 
  Building2, Globe, DollarSign, Calculator, ChevronRight, Check,
  BookOpen, Landmark, Coins, AlertCircle, Clock, BarChart3, AlertTriangle
} from 'lucide-react';

export interface JournalEntry {
  id: string;
  ref_no: string;
  date: string;
  description: string;
  amount: number;
  status: 'معتمد' | 'بانتظار الاعتماد' | 'مسودة';
  branch: string;
}

export interface Voucher {
  id: string;
  voucher_no: string;
  type: 'قبض' | 'صرف';
  date: string;
  payee_payer: string;
  treasury: string;
  amount: number;
  status: 'معتمد' | 'بانتظار الاعتماد';
}

const MOCK_JOURNALS: JournalEntry[] = [
  { id: 'j-282', ref_no: 'قيد #282', date: '2026-07-31', description: 'قيد فاتورة عقد تأجير رقم RC-2026-0014 / الفاتورة #12 / العميل ابو اياد', amount: 1150.0, status: 'معتمد', branch: 'فرع الرياض الرئيسي' },
  { id: 'j-281', ref_no: 'قيد #281', date: '2026-07-31', description: 'سند قبض عقد تأجير رقم RC-2026-0013 / إيداع بنك الراجحي', amount: 138.0, status: 'معتمد', branch: 'فرع الرياض الرئيسي' },
  { id: 'j-280', ref_no: 'قيد #280', date: '2026-07-31', description: 'قيد إثبات إيراد وساطة استقدام مساند - عقد رقم REC-2026-0594', amount: 14500.0, status: 'معتمد', branch: 'فرع الرياض الرئيسي' },
  { id: 'j-279', ref_no: 'قيد #279', date: '2026-07-30', description: 'إثبات مصاريف عاملة تأجير #2213 - سارة / المكتب الخارجي DAMAS AGENCY', amount: 2133.0, status: 'معتمد', branch: 'مركز الإيواء' },
  { id: 'j-278', ref_no: 'قيد #278', date: '2026-07-30', description: 'تحويل بنكي لحساب الضمان مساند بدون مرجع من الحساب البنكي الرئيسي', amount: 3700.0, status: 'معتمد', branch: 'الإدارة العامة' },
];

const MOCK_VOUCHERS: Voucher[] = [
  { id: 'v-59', voucher_no: 'قبض #59', type: 'قبض', date: '2026-07-31', payee_payer: 'العميل بندر صالح الهويريني', treasury: 'بنك الراجحي', amount: 13800.0, status: 'معتمد' },
  { id: 'v-58', voucher_no: 'قبض #58', type: 'قبض', date: '2026-07-31', payee_payer: 'عميل مساند (سداد إلكتروني)', treasury: 'بنك مساند الموحد', amount: 3786.3, status: 'معتمد' },
  { id: 'v-57', voucher_no: 'قبض #57', type: 'قبض', date: '2026-07-31', payee_payer: 'شركة دار الرواد للمقاولات', treasury: 'بنك الرياض', amount: 28750.0, status: 'معتمد' },
  { id: 'v-1', voucher_no: 'صرف #1', type: 'صرف', date: '2026-07-30', payee_payer: 'مكتب بلاتينيوم مانيلا (تأشيرات)', treasury: 'الصندوق الرئيسي', amount: 5000.0, status: 'معتمد' },
];

const TRIAL_BALANCE_DATA = [
  { code: '1101', name: 'الصندوق الرئيسي (Cash)', type: 'أصول', opening_debit: 150000, opening_credit: 0, period_debit: 45000, period_credit: 40800, balance: 154200 },
  { code: '1102', name: 'بنك الرياض - حساب الاستقدام', type: 'أصول', opening_debit: 380000, opening_credit: 0, period_debit: 82000, period_credit: 41500, balance: 420500 },
  { code: '1103', name: 'بنك الراجحي - الحساب التشغيلي', type: 'أصول', opening_debit: 220000, opening_credit: 0, period_debit: 110300, period_credit: 55000, balance: 275300 },
  { code: '1104', name: 'أمانات مساند المعلقة (90 يوماً)', type: 'أصول', opening_debit: 160000, opening_credit: 0, period_debit: 54500, period_credit: 30000, balance: 184500 },
  { code: '1201', name: 'الأصول الثابتة (مباني وسيارات)', type: 'أصول', opening_debit: 882500, opening_credit: 0, period_debit: 0, period_credit: 0, balance: 882500 },
  { code: '2101', name: 'مستحقات الموردين والوكلاء الخارجيين', type: 'خصوم', opening_debit: 0, opening_credit: 175000, period_debit: 25000, period_credit: 39375, balance: -189375 },
  { code: '2102', name: 'مخصص مكافأة نهاية الخدمة (EOSB)', type: 'خصوم', opening_debit: 0, opening_credit: 88000, period_debit: 0, period_credit: 6200, balance: -94200 },
  { code: '2103', name: 'أمانات ضريبة القيمة المضافة (ZATCA 15%)', type: 'خصوم', opening_debit: 0, opening_credit: 110000, period_debit: 12000, period_credit: 26000, balance: -124000 },
  { code: '3101', name: 'رأس المال المدفوع', type: 'حقوق ملكية', opening_debit: 0, opening_credit: 1205000, period_debit: 0, period_credit: 0, balance: -1205000 },
  { code: '4101', name: 'إيرادات وساطة عقود الاستقدام', type: 'إيرادات', opening_debit: 0, opening_credit: 320000, period_debit: 0, period_credit: 90000, balance: -410000 },
  { code: '4102', name: 'إيرادات عقود التأجير والتشغيل', type: 'إيرادات', opening_debit: 0, opening_credit: 85000, period_debit: 0, period_credit: 30471.2, balance: -115471.2 },
  { code: '5101', name: 'مصروفات تشغيل ومراكز إيواء', type: 'مصروفات', opening_debit: 75000, opening_credit: 0, period_debit: 15000, period_credit: 0, balance: 90000 },
  { code: '5102', name: 'رواتب وأجور الكوادر الإدارية', type: 'مصروفات', opening_debit: 110000, opening_credit: 0, period_debit: 20500, period_credit: 0, balance: 130500 },
];

const SUPPLIERS_ACCOUNTS = [
  { id: '1', name: "PLATINUM BROTHERS INT'L", country: 'الفلبين - مانيلا', cv_count: 158, balance_usd: 34500, balance_sar: 129375, status: 'مطابق وموثق' },
  { id: '2', name: 'DAMAS FOREIGN EMPLOYMENT', country: 'إثيوبيا - أديس أبابا', cv_count: 42, balance_usd: 4200, balance_sar: 15750, status: 'مطابق' },
  { id: '3', name: 'Supreme Link Employment Agency', country: 'أوغندا - كمبالا', cv_count: 38, balance_usd: 11800, balance_sar: 44250, status: 'مطابق وموثق' },
];

export type FinanceTab = 
  | 'overview' 
  | 'financial-position' 
  | 'trial-balance' 
  | 'income-statement' 
  | 'cash-flow'
  | 'journals' 
  | 'vouchers' 
  | 'transfers' 
  | 'suppliers-agents' 
  | 'aging'
  | 'musaned-escrow' 
  | 'eosb-zakat' 
  | 'chart-of-accounts' 
  | 'budget'
  | 'period-closing' 
  | 'tax';

export const FinancePage: React.FC = () => {
  const { activeCompany } = useCompany();
  const storeActiveTab = useAppStore(state => state.activeTab);

  const getMappedTab = (tabKey: string): FinanceTab => {
    switch (tabKey) {
      case 'chart-accounts':
      case 'chart-of-accounts':
        return 'chart-of-accounts';
      case 'journals':
        return 'journals';
      case 'vouchers':
        return 'vouchers';
      case 'zatca':
      case 'tax':
        return 'tax';
      case 'trial-balance':
        return 'trial-balance';
      case 'income-statement':
        return 'income-statement';
      case 'financial-position':
        return 'financial-position';
      case 'cash-flow':
        return 'cash-flow';
      case 'aging':
        return 'aging';
      case 'budget':
        return 'budget';
      case 'period-closing':
        return 'period-closing';
      case 'musaned-escrow':
        return 'musaned-escrow';
      case 'suppliers-agents':
        return 'suppliers-agents';
      case 'transfers':
        return 'transfers';
      default:
        return 'overview';
    }
  };

  const [activeTab, setActiveTab] = useState<FinanceTab>(() => getMappedTab(storeActiveTab));

  useEffect(() => {
    setActiveTab(getMappedTab(storeActiveTab));
  }, [storeActiveTab]);

  const [journals, setJournals] = useState<JournalEntry[]>(MOCK_JOURNALS);
  const [vouchers, setVouchers] = useState<Voucher[]>(MOCK_VOUCHERS);
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  
  // Drill-down and Chart of Accounts state
  const [selectedAccountForDrilldown, setSelectedAccountForDrilldown] = useState<any | null>(null);
  const [coaCategoryFilter, setCoaCategoryFilter] = useState<string>('ALL');
  const [coaSearchQuery, setCoaSearchQuery] = useState<string>('');
  const [closedPeriods, setClosedPeriods] = useState<number[]>([1, 2, 3, 4, 5, 6]); // Jan to Jun closed
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [newAccountForm, setNewAccountForm] = useState({
    code: '',
    nameAr: '',
    nameEn: '',
    category: 'أصول' as const,
    balance: '0',
  });

  const { createItem: createJournalEntry } = useTableMutation('company_journal_entries');

  // Modals
  const [showAddVoucherModal, setShowAddVoucherModal] = useState(false);
  const [showAddJournalModal, setShowAddJournalModal] = useState(false);

  // Forms
  const [voucherForm, setVoucherForm] = useState({
    type: 'قبض' as 'قبض' | 'صرف',
    payee_payer: '',
    treasury: 'بنك الراجحي',
    amount: '',
  });

  const [journalForm, setJournalForm] = useState({
    description: '',
    amount: '',
    branch: 'فرع الرياض الرئيسي',
  });

  // EOSB Calculator
  const [eosbCalc, setEosbCalc] = useState({
    salary: '8500',
    years: '3.5',
    reason: 'resignation' as 'resignation' | 'termination',
  });

  const calculateEOSBResult = () => {
    const sal = parseFloat(eosbCalc.salary) || 0;
    const yrs = parseFloat(eosbCalc.years) || 0;
    let base = yrs <= 5 ? yrs * (sal / 2) : 5 * (sal / 2) + (yrs - 5) * sal;
    if (eosbCalc.reason === 'resignation') {
      if (yrs < 2) return 0;
      if (yrs >= 2 && yrs < 5) return base * (1 / 3);
      if (yrs >= 5 && yrs < 10) return base * (2 / 3);
      return base;
    }
    return base;
  };

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherForm.payee_payer || !voucherForm.amount) return;

    const newV: Voucher = {
      id: `v-${Date.now()}`,
      voucher_no: `${voucherForm.type} #${60 + vouchers.length}`,
      type: voucherForm.type,
      date: new Date().toISOString().slice(0, 10),
      payee_payer: voucherForm.payee_payer,
      treasury: voucherForm.treasury,
      amount: parseFloat(voucherForm.amount) || 0,
      status: 'معتمد',
    };

    setVouchers([newV, ...vouchers]);
    setShowAddVoucherModal(false);
    setVoucherForm({ type: 'قبض', payee_payer: '', treasury: 'بنك الراجحي', amount: '' });
  };

  const handleCreateJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalForm.description || !journalForm.amount) return;

    const amt = parseFloat(journalForm.amount) || 0;
    const newJ: JournalEntry = {
      id: `j-${Date.now()}`,
      ref_no: `قيد #${283 + journals.length}`,
      date: new Date().toISOString().slice(0, 10),
      description: journalForm.description,
      amount: amt,
      status: 'معتمد',
      branch: journalForm.branch,
    };

    await createJournalEntry.mutateAsync({
      company_id: activeCompany.code || 'SAF',
      entry_number: newJ.ref_no,
      entry_date: newJ.date,
      narration: newJ.description,
      total_debit: amt,
      total_credit: amt,
      status: 'POSTED',
      branch: newJ.branch,
    });

    setJournals([newJ, ...journals]);
    setShowAddJournalModal(false);
    setJournalForm({ description: '', amount: '', branch: 'فرع الرياض الرئيسي' });
  };

  const filteredJournals = selectedBranch === 'ALL' ? journals : journals.filter(j => j.branch.includes(selectedBranch));

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
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
              <Scale className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="pill-tag-mint" style={{ fontSize: '11px' }}>FINANCIAL & ACCOUNTING SUITE</span>
                <span className="pill-tag-shade" style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', color: '#ffffff' }}>المعايير المحاسبية SOCPA / IFRS</span>
              </div>
              <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
                الإدارة المالية والقوائم الختامية
              </h1>
              <p className="text-xs text-zinc-400 mt-1 font-sans">
                المركز المالي، ميزان المراجعة، قائمة الدخل، قيود اليومية، وتسويات مساند لـ <strong className="text-white">{activeCompany.name}</strong>
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowAddJournalModal(true)}
              className="button-white-pill"
              style={{ fontSize: '12px', padding: '6px 18px', minHeight: '38px' }}
            >
              <Plus className="w-4 h-4 ml-1 text-black" />
              <span>قيد يومية جديد</span>
            </button>
            <button
              onClick={() => setShowAddVoucherModal(true)}
              className="button-outline-on-dark"
              style={{ fontSize: '12px', padding: '6px 16px', minHeight: '38px' }}
            >
              <Receipt className="w-3.5 h-3.5 ml-1 text-emerald-400" />
              <span>سند قبض / صرف</span>
            </button>

            <button
              onClick={() => exportData('trial-balance', TRIAL_BALANCE_DATA, 'excel', `ميزان المراجعة - ${activeCompany.name}`)}
              className="button-outline-on-dark"
              style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 ml-1 text-emerald-400" />
              <span>Excel</span>
            </button>
            <button
              onClick={() => exportData('trial-balance', TRIAL_BALANCE_DATA, 'pdf', `ميزان المراجعة - ${activeCompany.name}`)}
              className="button-outline-on-dark"
              style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
            >
              <FileText className="w-3.5 h-3.5 ml-1 text-rose-400" />
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4-Category Accounting Sequence Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Category 1: القوائم والمركز المالي */}
        <div className="card-pricing p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-100">
            <PieChart className="w-4 h-4 text-black" />
            <span className="text-xs font-bold text-zinc-900">1. القوائم والمركز المالي</span>
          </div>
          <div className="space-y-1.5">
            {[
              { id: 'overview', label: 'اللوحة المالية العامة', icon: PieChart },
              { id: 'trial-balance', label: 'ميزان المراجعة (Trial Balance)', icon: Scale },
              { id: 'income-statement', label: 'قائمة الدخل والأرباح (P&L)', icon: TrendingUp },
              { id: 'financial-position', label: 'قائمة المركز المالي (Balance Sheet)', icon: Landmark },
              { id: 'cash-flow', label: 'قائمة التدفقات النقدية (Cash Flow)', icon: Coins },
            ].map(t => {
              const isActive = activeTab === t.id;
              const IconComp = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-full text-xs transition-all ${
                    isActive
                      ? 'bg-black text-white font-bold shadow-sm'
                      : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-medium'
                  }`}
                >
                  <span>{t.label}</span>
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Category 2: القيود والعمليات اليومية */}
        <div className="card-pricing p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-100">
            <Receipt className="w-4 h-4 text-black" />
            <span className="text-xs font-bold text-zinc-900">2. القيود والعمليات اليومية</span>
          </div>
          <div className="space-y-1.5">
            {[
              { id: 'journals', label: 'دفتر القيود المحاسبية', icon: BookOpen },
              { id: 'vouchers', label: 'سندات القبض والصرف', icon: Receipt },
              { id: 'transfers', label: 'التحويلات البنكية والصناديق', icon: Coins },
            ].map(t => {
              const isActive = activeTab === t.id;
              const IconComp = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-full text-xs transition-all ${
                    isActive
                      ? 'bg-black text-white font-bold shadow-sm'
                      : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-medium'
                  }`}
                >
                  <span>{t.label}</span>
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Category 3: الاستقدام والشركاء والزكاة */}
        <div className="card-pricing p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-100">
            <Globe className="w-4 h-4 text-black" />
            <span className="text-xs font-bold text-zinc-900">3. الاستقدام والشركاء والزكاة</span>
          </div>
          <div className="space-y-1.5">
            {[
              { id: 'musaned-escrow', label: 'أمانات مساند (90 يوماً)', icon: ShieldCheck },
              { id: 'suppliers-agents', label: 'حسابات الوكلاء (SAR / $)', icon: Globe },
              { id: 'aging', label: 'أعمار الذمم والتقادم (Aging)', icon: Clock },
              { id: 'eosb-zakat', label: 'نهاية الخدمة والزكاة', icon: Calculator },
            ].map(t => {
              const isActive = activeTab === t.id;
              const IconComp = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-full text-xs transition-all ${
                    isActive
                      ? 'bg-black text-white font-bold shadow-sm'
                      : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-medium'
                  }`}
                >
                  <span>{t.label}</span>
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Category 4: الهيكل المحاسبي والإقفال */}
        <div className="card-pricing p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-100">
            <FolderTree className="w-4 h-4 text-black" />
            <span className="text-xs font-bold text-zinc-900">4. الهيكل المحاسبي والإقفال</span>
          </div>
          <div className="space-y-1.5">
            {[
              { id: 'chart-of-accounts', label: 'شجرة الحسابات والدليل', icon: FolderTree },
              { id: 'budget', label: 'الميزانية التقديرية vs الفعلي', icon: BarChart3 },
              { id: 'period-closing', label: 'إقفال الفترات والسنوات', icon: Lock },
            ].map(t => {
              const isActive = activeTab === t.id;
              const IconComp = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-full text-xs transition-all ${
                    isActive
                      ? 'bg-black text-white font-bold shadow-sm'
                      : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-medium'
                  }`}
                >
                  <span>{t.label}</span>
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <div className="card-pistachio-band" style={{ padding: '24px', borderRadius: '16px' }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: '13px', fontWeight: 550, color: '#000000' }}>إجمالي الإيرادات المحققة</span>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', letterSpacing: '-0.02em' }}>525,471.20 ر.س</div>
              <div className="flex items-center justify-between mt-3">
                <span className="pill-tag-mint">نمو شهري +14.8%</span>
                <span className="text-[11px] text-zinc-600">عقود استقدام وتأجير</span>
              </div>
            </div>

            <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: '13px', fontWeight: 550, color: '#71717a' }}>إجمالي المصروفات والتشغيل</span>
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700">
                  <TrendingDown className="w-4 h-4" />
                </div>
              </div>
              <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', letterSpacing: '-0.02em' }}>220,500.00 ر.س</div>
              <div className="flex items-center justify-between mt-3">
                <span className="pill-tag-shade">مصاريف الفترة</span>
                <span className="text-[11px] text-zinc-500">تأشيرات، رواتب، إعاشة</span>
              </div>
            </div>

            <div className="card-pricing-featured" style={{ padding: '24px', borderRadius: '16px', background: '#000000', color: '#ffffff' }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: '13px', fontWeight: 550, color: '#a1a1aa' }}>صافي الأرباح التشغيلية</span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <Coins className="w-4 h-4" />
                </div>
              </div>
              <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#ffffff', letterSpacing: '-0.02em' }}>304,971.20 ر.س</div>
              <div className="flex items-center justify-between mt-3">
                <span className="pill-tag-mint">هامش ربح 58%</span>
                <span className="text-[11px] text-zinc-400">أداء مالي قياسي</span>
              </div>
            </div>

            <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: '13px', fontWeight: 550, color: '#71717a' }}>أمانات مساند المعلقة (90 يوماً)</span>
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', letterSpacing: '-0.02em' }}>184,500.00 ر.س</div>
              <div className="flex items-center justify-between mt-3">
                <span className="pill-tag-shade">فترة الضمان</span>
                <span className="text-[11px] text-zinc-500">حساب وسيط محمي</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRIAL BALANCE */}
      {activeTab === 'trial-balance' && (
        <div className="card-pricing p-6 bg-white rounded-3xl border border-zinc-200 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-zinc-100">
            <div>
              <h3 className="text-sm font-bold text-black m-0 flex items-center gap-2">
                <Scale className="w-4 h-4 text-black" />
                <span>ميزان المراجعة بالأرصدة والمجاميع (Trial Balance)</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-1">مطابقة الأرصدة الافتتاحية وحركات الفترة والرصيد النهائي لجميع الحسابات</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportData('trial-balance', TRIAL_BALANCE_DATA, 'excel', `ميزان المراجعة - ${activeCompany.name}`)}
                className="button-outline-on-light"
                style={{ padding: '4px 12px', fontSize: '11px', minHeight: '30px' }}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 ml-1 text-emerald-600" />
                <span>Excel</span>
              </button>
              <button
                onClick={() => exportData('trial-balance', TRIAL_BALANCE_DATA, 'pdf', `ميزان المراجعة - ${activeCompany.name}`)}
                className="button-outline-on-light"
                style={{ padding: '4px 12px', fontSize: '11px', minHeight: '30px' }}
              >
                <FileText className="w-3.5 h-3.5 ml-1 text-rose-600" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => exportData('trial-balance', TRIAL_BALANCE_DATA, 'print', `ميزان المراجعة - ${activeCompany.name}`)}
                className="button-primary-pill"
                style={{ padding: '4px 14px', fontSize: '11px', minHeight: '30px' }}
              >
                <Printer className="w-3.5 h-3.5 ml-1" />
                <span>طباعة</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3">رمز الحساب</th>
                  <th className="p-3">اسم الحساب المحاسبي</th>
                  <th className="p-3">النوع</th>
                  <th className="p-3 font-mono">افتتاحي مدين</th>
                  <th className="p-3 font-mono">افتتاحي دائن</th>
                  <th className="p-3 font-mono">حركة مدين</th>
                  <th className="p-3 font-mono">حركة دائن</th>
                  <th className="p-3 font-mono font-bold text-black">الرصيد النهائي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {TRIAL_BALANCE_DATA.map((row) => (
                  <tr
                    key={row.code}
                    onClick={() => setSelectedAccountForDrilldown(row)}
                    className="hover:bg-zinc-50 cursor-pointer transition-colors"
                  >
                    <td className="p-3 font-mono font-bold text-black">{row.code}</td>
                    <td className="p-3 font-bold text-black">{row.name}</td>
                    <td className="p-3">
                      <Badge text={row.type} type="purple" />
                    </td>
                    <td className="p-3 font-mono">{row.opening_debit.toLocaleString()}</td>
                    <td className="p-3 font-mono">{row.opening_credit.toLocaleString()}</td>
                    <td className="p-3 font-mono text-emerald-700 font-bold">{row.period_debit.toLocaleString()}</td>
                    <td className="p-3 font-mono text-rose-700 font-bold">{row.period_credit.toLocaleString()}</td>
                    <td className="p-3 font-mono font-bold text-black">
                      {Math.abs(row.balance).toLocaleString()} {row.balance >= 0 ? 'مدين' : 'دائن'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BALANCE SHEET */}
      {activeTab === 'financial-position' && (
        <div className="card-pricing p-6 bg-white rounded-3xl border border-zinc-200 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-zinc-100">
            <div>
              <h3 className="text-sm font-bold text-black m-0 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-black" />
                <span>قائمة المركز المالي الموحدة (Balance Sheet)</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-1">مطابقة الأصول مع الخصوم وحقوق الملكية كما في نهاية الفترة المالية</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportData('balance-sheet', TRIAL_BALANCE_DATA, 'excel', `المركز المالي - ${activeCompany.name}`)}
                className="button-outline-on-light"
                style={{ padding: '4px 12px', fontSize: '11px', minHeight: '30px' }}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 ml-1 text-emerald-600" />
                <span>Excel</span>
              </button>
              <button
                onClick={() => exportData('balance-sheet', TRIAL_BALANCE_DATA, 'pdf', `المركز المالي - ${activeCompany.name}`)}
                className="button-outline-on-light"
                style={{ padding: '4px 12px', fontSize: '11px', minHeight: '30px' }}
              >
                <FileText className="w-3.5 h-3.5 ml-1 text-rose-600" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
              <div className="flex justify-between items-center font-bold text-black border-b border-zinc-200 pb-2 text-sm">
                <span>1. الأصول (Assets)</span>
                <span className="font-mono">2,132,971.20 ر.س</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="font-bold text-zinc-700">الأصول المتداولة:</div>
                <div className="flex justify-between py-1 border-b border-zinc-200/60 text-zinc-600">
                  <span>النقدية والصناديق والبنوك:</span>
                  <span className="font-bold font-mono text-black">850,000.00 ر.س</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200/60 text-zinc-600">
                  <span>أمانات مساند المعلقة (90 يوماً):</span>
                  <span className="font-bold font-mono text-black">184,500.00 ر.س</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200/60 text-zinc-600">
                  <span>المدينون وأرصدة العملاء:</span>
                  <span className="font-bold font-mono text-black">215,971.20 ر.س</span>
                </div>
                <div className="font-bold text-zinc-700 pt-2">الأصول غير المتداولة:</div>
                <div className="flex justify-between py-1 text-zinc-600">
                  <span>صافي الأصول الثابتة:</span>
                  <span className="font-bold font-mono text-black">882,500.00 ر.س</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
              <div className="flex justify-between items-center font-bold text-black border-b border-zinc-200 pb-2 text-sm">
                <span>2. الخصوم وحقوق الملكية (Liabilities & Equity)</span>
                <span className="font-mono">2,132,971.20 ر.س</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="font-bold text-zinc-700">الخصوم المتداولة:</div>
                <div className="flex justify-between py-1 border-b border-zinc-200/60 text-zinc-600">
                  <span>مستحقات الموردين والوكلاء:</span>
                  <span className="font-bold font-mono text-black">189,375.00 ر.س</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200/60 text-zinc-600">
                  <span>مخصص مكافأة نهاية الخدمة:</span>
                  <span className="font-bold font-mono text-black">94,200.00 ر.س</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200/60 text-zinc-600">
                  <span>ضريبة القيمة المضافة ZATCA 15%:</span>
                  <span className="font-bold font-mono text-black">124,000.00 ر.س</span>
                </div>
                <div className="font-bold text-zinc-700 pt-2">حقوق الملكية:</div>
                <div className="flex justify-between py-1 border-b border-zinc-200/60 text-zinc-600">
                  <span>رأس المال المدفوع:</span>
                  <span className="font-bold font-mono text-black">1,205,000.00 ر.س</span>
                </div>
                <div className="flex justify-between py-1 text-zinc-600">
                  <span>الأرباح الصافية المرحلة:</span>
                  <span className="font-bold font-mono text-emerald-700">520,396.20 ر.س</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INCOME STATEMENT */}
      {activeTab === 'income-statement' && (
        <div className="card-pricing p-6 bg-white rounded-3xl border border-zinc-200 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-zinc-100">
            <div>
              <h3 className="text-sm font-bold text-black m-0 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-black" />
                <span>قائمة الدخل والأرباح والخسائر (Income Statement / P&L)</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-1">تحليل الإيرادات، التكاليف المباشرة، والمصروفات الإدارية وصافي الربح</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportData('income-statement', TRIAL_BALANCE_DATA, 'excel', `قائمة الدخل - ${activeCompany.name}`)}
                className="button-outline-on-light"
                style={{ padding: '4px 12px', fontSize: '11px', minHeight: '30px' }}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 ml-1 text-emerald-600" />
                <span>Excel</span>
              </button>
              <button
                onClick={() => exportData('income-statement', TRIAL_BALANCE_DATA, 'pdf', `قائمة الدخل - ${activeCompany.name}`)}
                className="button-outline-on-light"
                style={{ padding: '4px 12px', fontSize: '11px', minHeight: '30px' }}
              >
                <FileText className="w-3.5 h-3.5 ml-1 text-rose-600" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-zinc-200 font-bold text-zinc-900">
              <span>إيرادات خدمات التوسط في الاستقدام (مساند):</span>
              <span className="font-mono">410,000.00 ر.س</span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-200 font-bold text-zinc-900">
              <span>إيرادات عقود التأجير والتشغيل:</span>
              <span className="font-mono">115,471.20 ر.س</span>
            </div>
            <div className="flex justify-between py-2.5 bg-emerald-50 px-3 rounded-xl font-black text-emerald-900 border border-emerald-200">
              <span>إجمالي الإيرادات التشغيلية:</span>
              <span className="font-mono">525,471.20 ر.س</span>
            </div>

            <div className="pt-2 text-rose-700 space-y-1">
              <div className="flex justify-between py-1.5 border-b border-zinc-200">
                <span>تكلفة المكاتب الخارجية والتأشيرات:</span>
                <span className="font-mono">-65,000.00 ر.س</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-200">
                <span>مصاريف الإعاشة والإيواء والفحص:</span>
                <span className="font-mono">-25,000.00 ر.س</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-200">
                <span>الرواتب والأجور والمكافآت:</span>
                <span className="font-mono">-130,500.00 ر.س</span>
              </div>
            </div>

            <div className="flex justify-between py-3.5 bg-black text-white px-5 rounded-2xl font-bold text-sm">
              <span>صافي الربح للفترة (Net Income):</span>
              <span className="font-mono text-emerald-400">304,971.20 ر.س</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CASH FLOW STATEMENT */}
      {activeTab === 'cash-flow' && (
        <div className="card-pricing p-6 bg-white rounded-3xl border border-zinc-200 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-zinc-100">
            <div>
              <h3 className="text-sm font-bold text-black m-0 flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-600" />
                <span>قائمة التدفقات النقدية (Cash Flow Statement)</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                حركة السيولة النقدية من الأنشطة التشغيلية والاستثمارية والتمويلية لـ {activeCompany.name}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="pill-tag-mint text-xs font-bold">
                صافي التغير النقدي: +155,000.00 ر.س
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
              <div className="text-xs font-bold text-emerald-900 mb-1">صافي التدفقات التشغيلية</div>
              <div className="text-xl font-bold font-mono text-emerald-950">+200,000.00 ر.س</div>
              <div className="text-[10px] text-emerald-700 mt-1">مقبوضات العقود ناقص الرواتب والتشغيل</div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
              <div className="text-xs font-bold text-zinc-800 mb-1">صافي التدفقات الاستثمارية</div>
              <div className="text-xl font-bold font-mono text-rose-700">-45,000.00 ر.س</div>
              <div className="text-[10px] text-zinc-500 mt-1">تجهيزات ومعدات إيواء وسيارات</div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
              <div className="text-xs font-bold text-zinc-800 mb-1">صافي التدفقات التمويلية</div>
              <div className="text-xl font-bold font-mono text-zinc-700">0.00 ر.س</div>
              <div className="text-[10px] text-zinc-500 mt-1">لا توجد قروض أو توزيعات نقدية</div>
            </div>
          </div>

          {/* Detailed Statement Table */}
          <div className="max-w-3xl mx-auto bg-zinc-50 rounded-2xl border border-zinc-200 p-6 space-y-4 text-xs">
            <div>
              <div className="font-bold text-zinc-900 pb-2 border-b border-zinc-300">1. التدفقات النقدية من الأنشطة التشغيلية:</div>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-zinc-700">
                  <span>صافي الربح للفترة:</span>
                  <span className="font-mono font-bold">304,971.20 ر.س</span>
                </div>
                <div className="flex justify-between text-zinc-700">
                  <span>(+) استهلاك الأصول الثابتة (غير نقدي):</span>
                  <span className="font-mono font-bold">+12,500.00 ر.س</span>
                </div>
                <div className="flex justify-between text-zinc-700">
                  <span>(-) الزيادة في المدينين وحسابات مساند المعلقة:</span>
                  <span className="font-mono font-bold text-rose-600">-62,471.20 ر.س</span>
                </div>
                <div className="flex justify-between text-zinc-700">
                  <span>(-) سداد مستحقات الوكلاء الخارجيين:</span>
                  <span className="font-mono font-bold text-rose-600">-55,000.00 ر.س</span>
                </div>
                <div className="flex justify-between bg-emerald-100/60 p-2 rounded-lg font-bold text-emerald-950">
                  <span>صافي النقد المتوفر من الأنشطة التشغيلية:</span>
                  <span className="font-mono">200,000.00 ر.س</span>
                </div>
              </div>
            </div>

            <div>
              <div className="font-bold text-zinc-900 pb-2 border-b border-zinc-300">2. التدفقات النقدية من الأنشطة الاستثمارية:</div>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-zinc-700">
                  <span>شراء أصول ثابتة وتجهيزات فروع:</span>
                  <span className="font-mono font-bold text-rose-600">-45,000.00 ر.س</span>
                </div>
                <div className="flex justify-between bg-zinc-200/60 p-2 rounded-lg font-bold text-zinc-900">
                  <span>صافي النقد المستخدم في الأنشطة الاستثمارية:</span>
                  <span className="font-mono">-45,000.00 ر.س</span>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-zinc-300 pt-3 space-y-2">
              <div className="flex justify-between text-zinc-800 font-bold">
                <span>رصيد النقدية وما في حكمها في بداية الفترة:</span>
                <span className="font-mono">750,000.00 ر.س</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>صافي الزيادة في النقدية خلال الفترة:</span>
                <span className="font-mono">+155,000.00 ر.س</span>
              </div>
              <div className="flex justify-between bg-black text-white p-4 rounded-xl font-bold text-sm">
                <span>رصيد النقدية وما في حكمها في نهاية الفترة (البنوك والصناديق):</span>
                <span className="font-mono text-emerald-400">905,000.00 ر.س</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: JOURNALS */}
      {activeTab === 'journals' && (
        <div className="card-pricing p-6 bg-white rounded-3xl border border-zinc-200 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-bold text-black m-0">سجل القيود اليومية المحاسبية</h3>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-zinc-50 border border-zinc-200 rounded-full py-1 px-3 text-xs text-black focus:border-black focus:outline-none"
              >
                <option value="ALL">جميع الفروع</option>
                <option value="الرياض">فرع الرياض</option>
                <option value="جدة">فرع جدة</option>
                <option value="الخبر">فرع الخبر</option>
                <option value="الإيواء">مركز الإيواء</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportData('journals', filteredJournals, 'excel', `القيود اليومية - ${activeCompany.name}`)}
                className="button-outline-on-light"
                style={{ padding: '4px 12px', fontSize: '11px', minHeight: '30px' }}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 ml-1 text-emerald-600" />
                <span>Excel</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3">رقم القيد</th>
                  <th className="p-3">التاريخ</th>
                  <th className="p-3">الفرع</th>
                  <th className="p-3">البيان والشرح</th>
                  <th className="p-3 font-mono">المبلغ</th>
                  <th className="p-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredJournals.map((j) => (
                  <tr key={j.id} className="hover:bg-zinc-50">
                    <td className="p-3 font-mono font-bold text-black">{j.ref_no}</td>
                    <td className="p-3 text-zinc-500 font-mono">{j.date}</td>
                    <td className="p-3 font-bold text-black">{j.branch}</td>
                    <td className="p-3 text-zinc-700">{j.description}</td>
                    <td className="p-3 font-mono font-bold text-black">{j.amount.toLocaleString()} ر.س</td>
                    <td className="p-3">
                      <Badge text={j.status} type="success" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: VOUCHERS */}
      {activeTab === 'vouchers' && (
        <div className="card-pricing p-6 bg-white rounded-3xl border border-zinc-200 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-zinc-100">
            <h3 className="text-sm font-bold text-black m-0">سجل سندات القبض والصرف</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => exportData('vouchers', vouchers, 'excel', `سندات القبض والصرف - ${activeCompany.name}`)}
                className="button-outline-on-light"
                style={{ padding: '4px 12px', fontSize: '11px', minHeight: '30px' }}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 ml-1 text-emerald-600" />
                <span>Excel</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3">رقم السند</th>
                  <th className="p-3">النوع</th>
                  <th className="p-3">التاريخ</th>
                  <th className="p-3">المدفوع له / القابض</th>
                  <th className="p-3">الخزينة / الحساب</th>
                  <th className="p-3 font-mono">المبلغ</th>
                  <th className="p-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {vouchers.map((v) => (
                  <tr key={v.id} className="hover:bg-zinc-50">
                    <td className="p-3 font-mono font-bold text-black">{v.voucher_no}</td>
                    <td className="p-3">
                      <Badge text={v.type} type={v.type === 'قبض' ? 'success' : 'danger'} />
                    </td>
                    <td className="p-3 text-zinc-500 font-mono">{v.date}</td>
                    <td className="p-3 font-bold text-black">{v.payee_payer}</td>
                    <td className="p-3 text-zinc-600">{v.treasury}</td>
                    <td className="p-3 font-mono font-bold text-black">{v.amount.toLocaleString()} ر.س</td>
                    <td className="p-3">
                      <Badge text={v.status} type="success" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: SUPPLIERS / FOREIGN AGENCIES ($) */}
      {activeTab === 'suppliers-agents' && (
        <div className="card-pricing p-6 bg-white rounded-3xl border border-zinc-200 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-zinc-100">
            <h3 className="text-sm font-bold text-black m-0">كشوفات حسابات الموردين والوكلاء الخارجيين بالدولار ($/SAR)</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => exportData('external-offices', SUPPLIERS_ACCOUNTS, 'excel', `حسابات الوكلاء الخارجيين - ${activeCompany.name}`)}
                className="button-outline-on-light"
                style={{ padding: '4px 12px', fontSize: '11px', minHeight: '30px' }}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 ml-1 text-emerald-600" />
                <span>Excel</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3">اسم الوكيل الخارجي</th>
                  <th className="p-3">الدولة والمدينة</th>
                  <th className="p-3">السير الذاتية</th>
                  <th className="p-3 font-mono">الرصيد بالدولار ($)</th>
                  <th className="p-3 font-mono">المقابل بالريال (SAR)</th>
                  <th className="p-3">حالة المطابقة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {SUPPLIERS_ACCOUNTS.map((s) => (
                  <tr key={s.id} className="hover:bg-zinc-50">
                    <td className="p-3 font-bold text-black">{s.name}</td>
                    <td className="p-3 text-zinc-600">{s.country}</td>
                    <td className="p-3 font-bold text-black">{s.cv_count} سيرة ذاتية</td>
                    <td className="p-3 font-mono font-bold text-rose-700">${s.balance_usd.toLocaleString()}</td>
                    <td className="p-3 font-mono font-bold text-emerald-700">{s.balance_sar.toLocaleString()} ر.س</td>
                    <td className="p-3">
                      <Badge text={s.status} type="success" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: EOSB & ZAKAT CALCULATOR */}
      {activeTab === 'eosb-zakat' && (
        <div className="card-pricing p-6 bg-white rounded-3xl border border-zinc-200 space-y-6">
          <h3 className="text-sm font-bold text-black m-0 flex items-center gap-2 pb-3 border-b border-zinc-100">
            <Calculator className="w-4 h-4 text-black" />
            <span>حاسبة مخصص مكافأة نهاية الخدمة (EOSB) والزكاة الشرعية (نظام العمل السعودي)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
              <h4 className="font-bold text-xs text-zinc-800">بيانات احتساب مكافأة الموظف:</h4>
              <div>
                <label className="block text-xs font-bold text-zinc-600 mb-1">الراتب الأساسي الأخير (ر.س)</label>
                <input
                  type="number"
                  value={eosbCalc.salary}
                  onChange={(e) => setEosbCalc({ ...eosbCalc, salary: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-full text-xs font-bold text-black focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 mb-1">سنوات الخدمة الإجمالية</label>
                <input
                  type="number"
                  step="0.5"
                  value={eosbCalc.years}
                  onChange={(e) => setEosbCalc({ ...eosbCalc, years: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-full text-xs font-bold text-black focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 mb-1">سبب انتهاء العلاقة العمالية</label>
                <select
                  value={eosbCalc.reason}
                  onChange={(e) => setEosbCalc({ ...eosbCalc, reason: e.target.value as any })}
                  className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-full text-xs font-bold text-black focus:border-black focus:outline-none"
                >
                  <option value="resignation">استقالة من الموظف (المادة 85)</option>
                  <option value="termination">إنهاء عقد من المنشأة / انتهاء المدة (المادة 84)</option>
                </select>
              </div>
            </div>

            <div className="bg-black text-white p-6 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-zinc-400">النتيجة النظامية المعتمدة:</h4>
              <div className="text-3xl font-light font-mono text-emerald-400">
                {calculateEOSBResult().toLocaleString()} ر.س
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                تم الاحتساب وفقاً للمادتين 84 و 85 من نظام العمل السعودي المعتمد من وزارة الموارد البشرية والتنمية الاجتماعية.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: AGING REPORT (تقرير أعمار الذمم والتقادم) */}
      {activeTab === 'aging' && (
        <div className="card-pricing p-6 bg-white rounded-3xl border border-zinc-200 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-zinc-100">
            <div>
              <h3 className="text-sm font-bold text-black m-0 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>تقرير أعمار الذمم والتقادم المالي (Accounts Aging Report)</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                توزيع مستحقات العملاء المدينة والتزامات الموردين الدائنة حسب فترات الاستحقاق لمتابعة التحصيل والسيولة
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="pill-tag-mint text-xs font-bold">
                إجمالي الذمم المدينة: 149,550.00 ر.س
              </span>
            </div>
          </div>

          {/* Aging Summary Buckets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center">
              <div className="text-[11px] font-bold text-emerald-800 mb-1">0 - 30 يوماً (ساري)</div>
              <div className="text-lg font-bold font-mono text-emerald-950">13,800.00 ر.س</div>
              <div className="text-[10px] text-emerald-600 mt-0.5">عميل واحد (تحصيل ممتاز)</div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 text-center">
              <div className="text-[11px] font-bold text-sky-800 mb-1">31 - 60 يوماً (مستحق)</div>
              <div className="text-lg font-bold font-mono text-sky-950">28,750.00 ر.س</div>
              <div className="text-[10px] text-sky-600 mt-0.5">عميل واحد (ضمن فترة السماح)</div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-center">
              <div className="text-[11px] font-bold text-amber-800 mb-1">61 - 90 يوماً (تنبيه متأخر)</div>
              <div className="text-lg font-bold font-mono text-amber-950">42,000.00 ر.س</div>
              <div className="text-[10px] text-amber-700 mt-0.5">عميل واحد (يتطلب متابعة فورية)</div>
            </div>

            <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 text-center">
              <div className="text-[11px] font-bold text-red-800 mb-1">+90 يوماً (حرج / ديون مشكوك فيها)</div>
              <div className="text-lg font-bold font-mono text-red-950">65,000.00 ر.س</div>
              <div className="text-[10px] text-red-700 mt-0.5">عميل واحد (تحت الإجراء القانوني)</div>
            </div>
          </div>

          {/* Accounts Receivable Table */}
          <div className="bg-zinc-50/60 rounded-2xl border border-zinc-200 p-4 space-y-3">
            <h4 className="text-xs font-bold text-zinc-900 flex items-center justify-between">
              <span>أعمار ذمم العملاء المدينة (Accounts Receivable)</span>
              <span className="text-[11px] font-mono text-zinc-500">4 حسابات عملاء نشطة</span>
            </h4>

            <div className="overflow-x-auto bg-white rounded-xl border border-zinc-200">
              <table className="w-full text-xs text-right">
                <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                  <tr>
                    <th className="p-3">اسم العميل / الجهة</th>
                    <th className="p-3 text-center">إجمالي الرصيد</th>
                    <th className="p-3 text-center">0 - 30 يوم</th>
                    <th className="p-3 text-center">31 - 60 يوم</th>
                    <th className="p-3 text-center">61 - 90 يوم</th>
                    <th className="p-3 text-center">+90 يوم</th>
                    <th className="p-3 text-center">حالة التحصيل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-mono">
                  <tr className="hover:bg-zinc-50">
                    <td className="p-3 font-sans font-bold text-zinc-900">بندر صالح الهويريني</td>
                    <td className="p-3 text-center font-bold">13,800.00</td>
                    <td className="p-3 text-center text-emerald-700 font-bold">13,800.00</td>
                    <td className="p-3 text-center text-zinc-300">-</td>
                    <td className="p-3 text-center text-zinc-300">-</td>
                    <td className="p-3 text-center text-zinc-300">-</td>
                    <td className="p-3 text-center font-sans">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">منتظم</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50">
                    <td className="p-3 font-sans font-bold text-zinc-900">شركة دار الرواد للمقاولات</td>
                    <td className="p-3 text-center font-bold">28,750.00</td>
                    <td className="p-3 text-center text-zinc-300">-</td>
                    <td className="p-3 text-center text-sky-700 font-bold">28,750.00</td>
                    <td className="p-3 text-center text-zinc-300">-</td>
                    <td className="p-3 text-center text-zinc-300">-</td>
                    <td className="p-3 text-center font-sans">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">فترة سماح</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50">
                    <td className="p-3 font-sans font-bold text-zinc-900">مؤسسة أفق المستقبل للتجارة</td>
                    <td className="p-3 text-center font-bold">42,000.00</td>
                    <td className="p-3 text-center text-zinc-300">-</td>
                    <td className="p-3 text-center text-zinc-300">-</td>
                    <td className="p-3 text-center text-amber-700 font-bold">42,000.00</td>
                    <td className="p-3 text-center text-zinc-300">-</td>
                    <td className="p-3 text-center font-sans">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">إشعار مطالبة</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50">
                    <td className="p-3 font-sans font-bold text-zinc-900">شركة البناء الحديث المحدودة</td>
                    <td className="p-3 text-center font-bold text-red-700">65,000.00</td>
                    <td className="p-3 text-center text-zinc-300">-</td>
                    <td className="p-3 text-center text-zinc-300">-</td>
                    <td className="p-3 text-center text-zinc-300">-</td>
                    <td className="p-3 text-center text-red-700 font-bold">65,000.00</td>
                    <td className="p-3 text-center font-sans">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">تحت التحصيل القانوني</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 11: CHART OF ACCOUNTS */}
      {activeTab === 'chart-of-accounts' && (
        <div className="card-pricing p-6 bg-white rounded-3xl border border-zinc-200 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-zinc-100">
            <div>
              <h3 className="text-sm font-bold text-black m-0 flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-black" />
                <span>شجرة الحسابات والدليل المحاسبي الموحد (Chart of Accounts)</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                الهيكل المحاسبي الشامل لـ ({activeCompany.name}) مقسم وفق المعايير المحاسبية (1: أصول، 2: خصوم، 3: حقوق ملكية، 4: إيرادات، 5: مصروفات)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportData('trial-balance', chartOfAccountsService.getAccountsByCompany(activeCompany.id as any), 'excel', `دليل_الحسابات_${activeCompany.name}`)}
                className="button-outline-on-light"
                style={{ padding: '6px 14px', fontSize: '11.5px', minHeight: '34px' }}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 ml-1 text-emerald-600" />
                <span>تصدير الدليل</span>
              </button>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center justify-between flex-wrap gap-3 bg-zinc-50 p-3 rounded-2xl border border-zinc-200">
            <div className="flex items-center gap-1.5 flex-wrap">
              {['ALL', 'أصول', 'خصوم', 'حقوق ملكية', 'إيرادات', 'مصروفات'].map((cat) => {
                const isActive = coaCategoryFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCoaCategoryFilter(cat)}
                    style={{
                      padding: '4px 14px',
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
                    {cat === 'ALL' ? 'جميع الحسابات' : cat}
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              value={coaSearchQuery}
              onChange={(e) => setCoaSearchQuery(e.target.value)}
              placeholder="بحث برقم الحساب أو الاسم..."
              className="bg-white border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black w-60"
            />
          </div>

          {/* Accounts Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3">رقم الحساب</th>
                  <th className="p-3">اسم الحساب (عربي)</th>
                  <th className="p-3">Account Name (EN)</th>
                  <th className="p-3">التصنيف المحاسبي</th>
                  <th className="p-3 font-mono">الرصيد التراكمي</th>
                  <th className="p-3">طبيعة الحساب</th>
                  <th className="p-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {chartOfAccountsService
                  .getAccountsByCompany(activeCompany.id as any)
                  .filter((acc) => {
                    const matchesCategory = coaCategoryFilter === 'ALL' || acc.category === coaCategoryFilter;
                    const matchesSearch =
                      acc.code.includes(coaSearchQuery) ||
                      acc.nameAr.includes(coaSearchQuery) ||
                      acc.nameEn.toLowerCase().includes(coaSearchQuery.toLowerCase());
                    return matchesCategory && matchesSearch;
                  })
                  .map((account) => (
                    <tr
                      key={account.id}
                      className="hover:bg-zinc-50 transition-colors"
                    >
                      <td className="p-3 font-mono font-bold text-black">{account.code}</td>
                      <td className="p-3 font-bold text-black">{account.nameAr}</td>
                      <td className="p-3 font-mono text-zinc-400">{account.nameEn}</td>
                      <td className="p-3">
                        <Badge
                          text={account.category}
                          type={
                            account.category === 'أصول'
                              ? 'info'
                              : account.category === 'إيرادات'
                              ? 'success'
                              : account.category === 'مصروفات'
                              ? 'danger'
                              : 'purple'
                          }
                        />
                      </td>
                      <td className="p-3 font-mono font-bold text-black">
                        {account.balance.toLocaleString()} {account.currency}
                      </td>
                      <td className="p-3 text-zinc-600 font-medium">
                        {account.category === 'أصول' || account.category === 'مصروفات' ? 'مدين بطبيعته' : 'دائن بطبيعته'}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setSelectedAccountForDrilldown({
                            code: account.code,
                            name: account.nameAr,
                            type: account.category,
                            balance: account.balance
                          })}
                          className="button-outline-on-light"
                          style={{ padding: '3px 10px', fontSize: '10.5px', minHeight: '26px' }}
                        >
                          <Eye className="w-3 h-3 ml-1" />
                          <span>كشف الحساب</span>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: BUDGET VS ACTUAL */}
      {activeTab === 'budget' && (
        <div className="card-pricing p-6 bg-white rounded-3xl border border-zinc-200 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-zinc-100">
            <div>
              <h3 className="text-sm font-bold text-black m-0 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>الموازنة التقديرية مقابل الفعلي (Budget vs. Actual Variance)</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                مقارنة المخصصات المعتمدة بالمصروفات الفعلية والالتزامات لكل قطاع في {activeCompany.name}
              </p>
            </div>
          </div>

          <BudgetVsActualWidget />
        </div>
      )}

      {/* TAB 12: PERIOD CLOSING */}
      {activeTab === 'period-closing' && (
        <div className="card-pricing p-6 bg-white rounded-3xl border border-zinc-200 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-zinc-100">
            <div>
              <h3 className="text-sm font-bold text-black m-0 flex items-center gap-2">
                <Lock className="w-4 h-4 text-black" />
                <span>إقفال الفترات والسنوات المالية (Fiscal Period Locks)</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                قفل الفترات المحاسبية يمنع إجراء أي تعديلات أو إضافة قيود جديدة بأثر رجعي لحماية التقارير المالية والضريبية.
              </p>
            </div>

            <span className="pill-tag-mint">السنة المالية الحالية: 2026</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { m: 1, name: 'يناير 2026', desc: 'تم الإقفال والمطابقة الضريبية' },
              { m: 2, name: 'فبراير 2026', desc: 'تم الإقفال والمطابقة الضريبية' },
              { m: 3, name: 'مارس 2026', desc: 'إقفال الربع الأول (Q1)' },
              { m: 4, name: 'أبريل 2026', desc: 'تم الإقفال والمطابقة الضريبية' },
              { m: 5, name: 'مايو 2026', desc: 'تم الإقفال والمطابقة الضريبية' },
              { m: 6, name: 'يونيو 2026', desc: 'إقفال الربع الثاني (Q2)' },
              { m: 7, name: 'يوليو 2026', desc: 'فترة مفتوحة للتسويات' },
              { m: 8, name: 'أغسطس 2026', desc: 'الشهر الحالي النشط' },
              { m: 9, name: 'سبتمبر 2026', desc: 'فترة مستقبلية' },
              { m: 10, name: 'أكتوبر 2026', desc: 'فترة مستقبلية' },
              { m: 11, name: 'نوفمبر 2026', desc: 'فترة مستقبلية' },
              { m: 12, name: 'ديسمبر 2026', desc: 'إقفال نهاية العام (FY2026)' },
            ].map((period) => {
              const isClosed = closedPeriods.includes(period.m);
              return (
                <div
                  key={period.m}
                  className={`p-4 rounded-2xl border transition-all ${
                    isClosed
                      ? 'bg-zinc-50 border-zinc-200'
                      : period.m === 8
                      ? 'bg-emerald-50/40 border-emerald-300'
                      : 'bg-white border-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-black">{period.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold ${
                        isClosed ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {isClosed ? 'مغلق' : 'مفتوح'}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-zinc-500 mb-3">{period.desc}</p>
                  <button
                    onClick={() => {
                      if (isClosed) {
                        setClosedPeriods(closedPeriods.filter((p) => p !== period.m));
                      } else {
                        setClosedPeriods([...closedPeriods, period.m]);
                      }
                    }}
                    className={`w-full py-1 rounded-full text-xs font-bold transition-all ${
                      isClosed
                        ? 'button-outline-on-light'
                        : 'button-primary-pill'
                    }`}
                    style={{ minHeight: '28px', fontSize: '11px' }}
                  >
                    {isClosed ? 'طلب إعادة الفتح' : 'إقفال الفترة'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: FINANCIAL DRILL-DOWN */}
      {selectedAccountForDrilldown && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="p-4 bg-black text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white m-0">
                  كشف حساب تفصيلي: {selectedAccountForDrilldown.name} ({selectedAccountForDrilldown.code})
                </h3>
              </div>
              <button
                onClick={() => setSelectedAccountForDrilldown(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3 bg-zinc-50 p-3 rounded-2xl border border-zinc-200 text-xs">
                <div>
                  <span className="text-zinc-400 block font-bold">رمز الحساب:</span>
                  <span className="font-mono font-bold text-black">{selectedAccountForDrilldown.code}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block font-bold">النوع:</span>
                  <span className="font-bold text-black">{selectedAccountForDrilldown.type || 'أصول'}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block font-bold">الرصيد التراكمي:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {Number(selectedAccountForDrilldown.balance || 0).toLocaleString()} ر.س
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-700">سجل القيود المحاسبية المرتبطة بهذا الحساب:</h4>
                <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-2xl overflow-hidden text-xs max-h-56 overflow-y-auto">
                  {journals.map((j) => (
                    <div key={j.id} className="p-3 bg-white hover:bg-zinc-50 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-black">{j.ref_no}</span>
                        <p className="text-[11px] text-zinc-500 mt-0.5">{j.description}</p>
                      </div>
                      <div className="text-left font-mono">
                        <span className="font-bold text-black block">{j.amount.toLocaleString()} ر.س</span>
                        <span className="text-[10px] text-zinc-400">{j.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                <button
                  onClick={() => exportData('journals', journals, 'excel', `كشف_حساب_${selectedAccountForDrilldown.code}`)}
                  className="button-white-pill"
                  style={{ padding: '6px 16px', fontSize: '11.5px', background: '#000000', color: '#ffffff' }}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 ml-1" />
                  <span>تصدير كشف الحساب</span>
                </button>
                <button
                  onClick={() => setSelectedAccountForDrilldown(null)}
                  className="button-outline-on-light"
                  style={{ padding: '6px 16px', fontSize: '11.5px' }}
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Voucher Modal */}
      {showAddVoucherModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="p-4 bg-black text-white flex items-center justify-between">
              <h3 className="font-bold text-sm text-white m-0">إصدار سند مالي جديد (قبض / صرف)</h3>
              <button onClick={() => setShowAddVoucherModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">نوع السند *</label>
                <select
                  value={voucherForm.type}
                  onChange={(e) => setVoucherForm({ ...voucherForm, type: e.target.value as any })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black focus:border-black focus:outline-none"
                >
                  <option value="قبض">سند قبض (مقبوضات نقدية/بنكية)</option>
                  <option value="صرف">سند صرف (مصروفات/مستحقات)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">اسم الدافع / المستفيد *</label>
                <input
                  type="text"
                  value={voucherForm.payee_payer}
                  onChange={(e) => setVoucherForm({ ...voucherForm, payee_payer: e.target.value })}
                  placeholder="اسم العميل، المورد، أو الموظف..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black focus:border-black focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">الخزينة / الحساب البنكي</label>
                <select
                  value={voucherForm.treasury}
                  onChange={(e) => setVoucherForm({ ...voucherForm, treasury: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black focus:border-black focus:outline-none"
                >
                  <option>بنك الراجحي - الحساب التشغيلي</option>
                  <option>بنك الرياض - حساب الاستقدام</option>
                  <option>بنك مساند الموحد</option>
                  <option>الصندوق الرئيسي (نقدي)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">المبلغ بالريال السعودي *</label>
                <input
                  type="number"
                  step="0.01"
                  value={voucherForm.amount}
                  onChange={(e) => setVoucherForm({ ...voucherForm, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black focus:border-black focus:outline-none font-mono font-bold"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddVoucherModal(false)}
                  className="button-outline-on-light"
                  style={{ minHeight: '34px', padding: '6px 16px', fontSize: '12px' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="button-primary-pill"
                  style={{ minHeight: '34px', padding: '6px 20px', fontSize: '12px' }}
                >
                  حفظ واعتماد السند
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Journal Modal */}
      {showAddJournalModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="p-4 bg-black text-white flex items-center justify-between">
              <h3 className="font-bold text-sm text-white m-0">تسجيل قيد محاسبي يومي جديد</h3>
              <button onClick={() => setShowAddJournalModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJournal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">الفرع المسؤول / مركز التكلفة</label>
                <select
                  value={journalForm.branch}
                  onChange={(e) => setJournalForm({ ...journalForm, branch: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black focus:border-black focus:outline-none"
                >
                  <option>فرع الرياض الرئيسي</option>
                  <option>فرع جدة</option>
                  <option>فرع الخبر والدمام</option>
                  <option>مركز الإيواء</option>
                  <option>الإدارة العامة</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">البيان والشرح التفصيلي للقيد *</label>
                <textarea
                  rows={3}
                  value={journalForm.description}
                  onChange={(e) => setJournalForm({ ...journalForm, description: e.target.value })}
                  placeholder="مثال: قيد إثبات استحقاق فاتورة رقم..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-3 text-xs text-black focus:border-black focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">المبلغ الإجمالي للقيد (ر.س) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={journalForm.amount}
                  onChange={(e) => setJournalForm({ ...journalForm, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-3 text-xs text-black focus:border-black focus:outline-none font-mono font-bold"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddJournalModal(false)}
                  className="button-outline-on-light"
                  style={{ minHeight: '34px', padding: '6px 16px', fontSize: '12px' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="button-primary-pill"
                  style={{ minHeight: '34px', padding: '6px 20px', fontSize: '12px' }}
                >
                  ترحيل القيد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancePage;
