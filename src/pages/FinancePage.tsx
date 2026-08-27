import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useCompany } from '../contexts/CompanyContext';
import { useTableMutation, useCostCenters } from '../hooks/queries/useErpQueries';
import { chartOfAccountsService, AccountItem } from '../services/accounting/chartOfAccountsService';
import { useAppStore } from '../stores/appStore';

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
  { id: '1', name: "🇵🇭 PLATINUM BROTHERS INT'L", country: 'الفلبين - مانيلا', cv_count: 158, balance_usd: 34500, balance_sar: 129375, status: 'مطابق وموثق' },
  { id: '2', name: '🇪🇹 DAMAS FOREIGN EMPLOYMENT', country: 'إثيوبيا - أديس أبابا', cv_count: 42, balance_usd: 4200, balance_sar: 15750, status: 'مطابق' },
  { id: '3', name: '🇺🇬 Supreme Link Employment Agency', country: 'أوغندا - كمبالا', cv_count: 38, balance_usd: 11800, balance_sar: 44250, status: 'مطابق وموثق' },
];

export const FinancePage: React.FC = () => {
  const { activeCompany } = useCompany();
  const storeActiveTab = useAppStore(state => state.activeTab);

  const getMappedTab = (tabKey: string): 'overview' | 'financial-position' | 'trial-balance' | 'income-statement' | 'journals' | 'vouchers' | 'transfers' | 'suppliers-agents' | 'musaned-escrow' | 'eosb-zakat' | 'chart-of-accounts' | 'period-closing' | 'tax' => {
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

  const [activeTab, setActiveTab] = useState<'overview' | 'financial-position' | 'trial-balance' | 'income-statement' | 'journals' | 'vouchers' | 'transfers' | 'suppliers-agents' | 'musaned-escrow' | 'eosb-zakat' | 'chart-of-accounts' | 'period-closing' | 'tax'>(() => getMappedTab(storeActiveTab));

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
  const [showTransferModal, setShowTransferModal] = useState(false);

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

  const [transferForm, setTransferForm] = useState({
    from_account: 'الصندوق الرئيسي (نقدي)',
    to_account: 'بنك الراجحي - الحساب التشغيلي',
    amount: '',
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
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <i className="fa-solid fa-scale-balanced text-teal-700"></i>
            الإدارة المالية والقوائم الختامية (Enterprise Financial Suite)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            المركز المالي، ميزان المراجعة، قائمة الدخل، قيود اليومية، وتسويات مساند لـ{' '}
            <strong className="text-slate-700">{activeCompany.name}</strong>
          </p>
        </div>

        {/* Global Action & Export Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddJournalModal(true)}
            className="button-primary-pill"
            style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
          >
            <i className="fa-solid fa-plus text-xs"></i> + قيد يومية
          </button>
          <button
            onClick={() => setShowAddVoucherModal(true)}
            className="button-outline-on-light"
            style={{ fontSize: '12.5px', padding: '6px 16px', minHeight: '38px' }}
          >
            <i className="fa-solid fa-file-invoice-dollar ml-1"></i> سند قبض / صرف
          </button>

          {/* Direct Export Buttons */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-[#e4e4e7]">
            <button
              onClick={() => exportData('trial-balance', TRIAL_BALANCE_DATA, 'excel', `ميزان المراجعة - ${activeCompany.name}`)}
              className="button-outline-on-light"
              style={{ padding: '6px 12px', fontSize: '12px', minHeight: '32px' }}
              title="تصدير إكسيل"
            >
              <i className="fa-solid fa-file-excel text-emerald-600"></i> Excel
            </button>
            <button
              onClick={() => exportData('trial-balance', TRIAL_BALANCE_DATA, 'pdf', `ميزان المراجعة - ${activeCompany.name}`)}
              className="button-outline-on-light"
              style={{ padding: '6px 12px', fontSize: '12px', minHeight: '32px' }}
              title="تصدير PDF"
            >
              <i className="fa-solid fa-file-pdf text-rose-600"></i> PDF
            </button>
          </div>
        </div>
      </div>

      {/* 4-Category Accounting Sequence Header (SOCPA / IFRS Standard Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Category 1: القوائم والتقارير */}
        <div className="card-pricing" style={{ padding: '16px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '12px', fontWeight: 550, color: '#71717a', display: 'block', marginBottom: '10px' }}>📊 1. القوائم والمركز المالي</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { id: 'overview', label: '🏠 اللوحة المالية العامة', icon: 'fa-chart-pie' },
              { id: 'trial-balance', label: '📊 ميزان المراجعة (Trial Balance)', icon: 'fa-table-list' },
              { id: 'income-statement', label: '📈 قائمة الدخل والأرباح (P&L)', icon: 'fa-arrow-trend-up' },
              { id: 'financial-position', label: '⚖️ قائمة المركز المالي (Balance Sheet)', icon: 'fa-scale-balanced' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 12px',
                  borderRadius: '9999px',
                  border: '1px solid',
                  borderColor: activeTab === t.id ? '#000000' : 'transparent',
                  backgroundColor: activeTab === t.id ? '#000000' : '#fafafa',
                  color: activeTab === t.id ? '#ffffff' : '#27272a',
                  fontWeight: activeTab === t.id ? 550 : 420,
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{t.label}</span>
                <i className={`fa-solid ${t.icon}`} style={{ fontSize: '10.5px', opacity: activeTab === t.id ? 1 : 0.6 }}></i>
              </button>
            ))}
          </div>
        </div>

        {/* Category 2: العمليات اليومية */}
        <div className="card-pricing" style={{ padding: '16px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '12px', fontWeight: 550, color: '#71717a', display: 'block', marginBottom: '10px' }}>📜 2. القيود والعمليات اليومية</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { id: 'journals', label: '📜 دفتر القيود المحاسبية', icon: 'fa-book' },
              { id: 'vouchers', label: '📑 سندات القبض والصرف', icon: 'fa-receipt' },
              { id: 'transfers', label: '🔄 التحويلات البنكية والصناديق', icon: 'fa-money-bill-transfer' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 12px',
                  borderRadius: '9999px',
                  border: '1px solid',
                  borderColor: activeTab === t.id ? '#000000' : 'transparent',
                  backgroundColor: activeTab === t.id ? '#000000' : '#fafafa',
                  color: activeTab === t.id ? '#ffffff' : '#27272a',
                  fontWeight: activeTab === t.id ? 550 : 420,
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{t.label}</span>
                <i className={`fa-solid ${t.icon}`} style={{ fontSize: '10.5px', opacity: activeTab === t.id ? 1 : 0.6 }}></i>
              </button>
            ))}
          </div>
        </div>

        {/* Category 3: الاستقدام والشركاء والزكاة */}
        <div className="card-pricing" style={{ padding: '16px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '12px', fontWeight: 550, color: '#71717a', display: 'block', marginBottom: '10px' }}>🤝 3. الاستقدام والشركاء والزكاة</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { id: 'musaned-escrow', label: '🤝 أمانات مساند (90 يوماً)', icon: 'fa-shield-halved' },
              { id: 'suppliers-agents', label: '🚚 حسابات الوكلاء ($/SAR)', icon: 'fa-globe' },
              { id: 'eosb-zakat', label: '🕋 نهاية الخدمة والزكاة', icon: 'fa-hand-holding-dollar' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 12px',
                  borderRadius: '9999px',
                  border: '1px solid',
                  borderColor: activeTab === t.id ? '#000000' : 'transparent',
                  backgroundColor: activeTab === t.id ? '#000000' : '#fafafa',
                  color: activeTab === t.id ? '#ffffff' : '#27272a',
                  fontWeight: activeTab === t.id ? 550 : 420,
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{t.label}</span>
                <i className={`fa-solid ${t.icon}`} style={{ fontSize: '10.5px', opacity: activeTab === t.id ? 1 : 0.6 }}></i>
              </button>
            ))}
          </div>
        </div>

        {/* Category 4: الدليل والإقفالات */}
        <div className="card-pricing" style={{ padding: '16px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '12px', fontWeight: 550, color: '#71717a', display: 'block', marginBottom: '10px' }}>⚙️ 4. الهيكل المحاسبي والإقفال</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { id: 'chart-of-accounts', label: '🌳 شجرة الحسابات والدليل', icon: 'fa-sitemap' },
              { id: 'period-closing', label: '🔒 إقفال الفترات والسنوات', icon: 'fa-lock' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 12px',
                  borderRadius: '9999px',
                  border: '1px solid',
                  borderColor: activeTab === t.id ? '#000000' : 'transparent',
                  backgroundColor: activeTab === t.id ? '#000000' : '#fafafa',
                  color: activeTab === t.id ? '#ffffff' : '#27272a',
                  fontWeight: activeTab === t.id ? 550 : 420,
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{t.label}</span>
                <i className={`fa-solid ${t.icon}`} style={{ fontSize: '10.5px', opacity: activeTab === t.id ? 1 : 0.6 }}></i>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── TAB 1: OVERVIEW ─── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="stat-card-grid">
            <div className="card-pistachio-band" style={{ padding: '24px', borderRadius: '16px' }}>
              <div className="stat-header">
                <span style={{ fontSize: '13px', fontWeight: 550, color: '#000000' }}>إجمالي الإيرادات المحققة</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '9999px', background: '#ffffff', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-arrow-trend-up"></i>
                </div>
              </div>
              <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', letterSpacing: '-0.02em' }}>525,471.20 ر.س</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                <span className="pill-tag-mint">
                  <i className="fa-solid fa-arrow-up text-xs"></i> نمو شهري 14.8%
                </span>
                <span style={{ fontSize: '11.5px', color: '#71717a' }}>عقود استقدام وتأجير</span>
              </div>
            </div>

            <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
              <div className="stat-header">
                <span style={{ fontSize: '13px', fontWeight: 550, color: '#71717a' }}>إجمالي المصروفات والتشغيل</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '9999px', background: '#f4f4f5', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-arrow-trend-down"></i>
                </div>
              </div>
              <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', letterSpacing: '-0.02em' }}>220,500.00 ر.س</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                <span className="pill-tag-shade">
                  <i className="fa-solid fa-clock text-xs"></i> مصاريف الفترة
                </span>
                <span style={{ fontSize: '11.5px', color: '#71717a' }}>تأشيرات، رواتب، إعاشة</span>
              </div>
            </div>

            <div className="card-pricing-featured" style={{ padding: '24px', borderRadius: '16px', background: '#000000', color: '#ffffff' }}>
              <div className="stat-header">
                <span style={{ fontSize: '13px', fontWeight: 550, color: '#a1a1aa' }}>صافي الأرباح التشغيلية</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-vault"></i>
                </div>
              </div>
              <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#ffffff', letterSpacing: '-0.02em' }}>304,971.20 ر.س</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                <span className="pill-tag-mint">
                  <i className="fa-solid fa-check text-xs"></i> هامش ربح 58%
                </span>
                <span style={{ fontSize: '11.5px', color: '#a1a1aa' }}>أداء مالي قياسي</span>
              </div>
            </div>

            <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
              <div className="stat-header">
                <span style={{ fontSize: '13px', fontWeight: 550, color: '#71717a' }}>أمانات مساند المعلقة (90 يوماً)</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '9999px', background: '#f4f4f5', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
              </div>
              <div className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', letterSpacing: '-0.02em' }}>184,500.00 ر.س</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                <span className="pill-tag-shade">
                  <i className="fa-solid fa-hourglass-half text-xs"></i> فترة الضمان
                </span>
                <span style={{ fontSize: '11.5px', color: '#71717a' }}>حساب وسيط محمي</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: TRIAL BALANCE (ميزان المراجعة) ─── */}
      {activeTab === 'trial-balance' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-table-list text-teal-700"></i>
                ميزان المراجعة بالأرصدة والمجاميع (Trial Balance)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">مطابقة الأرصدة الافتتاحية وحركات الفترة والرصيد النهائي لجميع الحسابات</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportData('trial-balance', TRIAL_BALANCE_DATA, 'excel', `ميزان المراجعة - ${activeCompany.name}`)}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <i className="fa-solid fa-file-excel"></i> Excel
              </button>
              <button
                onClick={() => exportData('trial-balance', TRIAL_BALANCE_DATA, 'csv', `ميزان المراجعة - ${activeCompany.name}`)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <i className="fa-solid fa-file-csv"></i> CSV
              </button>
              <button
                onClick={() => exportData('trial-balance', TRIAL_BALANCE_DATA, 'pdf', `ميزان المراجعة - ${activeCompany.name}`)}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <i className="fa-solid fa-file-pdf"></i> PDF
              </button>
              <button
                onClick={() => exportData('trial-balance', TRIAL_BALANCE_DATA, 'print', `ميزان المراجعة - ${activeCompany.name}`)}
                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <i className="fa-solid fa-print"></i> طباعة رسمية
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">رمز الحساب</th>
                  <th className="py-3 px-3">اسم الحساب المحاسبي</th>
                  <th className="py-3 px-3">النوع</th>
                  <th className="py-3 px-3">افتتاحي مدين</th>
                  <th className="py-3 px-3">افتتاحي دائن</th>
                  <th className="py-3 px-3">حركة مدين</th>
                  <th className="py-3 px-3">حركة دائن</th>
                  <th className="py-3 px-3 font-black text-teal-900">الرصيد النهائي (ر.س)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {TRIAL_BALANCE_DATA.map((row) => (
                  <tr
                    key={row.code}
                    onClick={() => setSelectedAccountForDrilldown(row)}
                    className="hover:bg-teal-50/60 cursor-pointer transition-colors"
                    title="انقر هنا لمعاينة كشف الحساب والقيود المكونة لهذا الرصيد"
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-purple-700 flex items-center gap-1.5">
                      <i className="fa-solid fa-magnifying-glass-chart text-[10px] text-teal-600 opacity-60"></i>
                      <span>{row.code}</span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{row.name}</td>
                    <td className="py-2.5 px-3">
                      <Badge text={row.type} type="purple" />
                    </td>
                    <td className="py-2.5 px-3 font-mono">{row.opening_debit.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono">{row.opening_credit.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-700 font-bold">{row.period_debit.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono text-rose-700 font-bold">{row.period_credit.toLocaleString()}</td>
                    <td className={`py-2.5 px-3 font-mono font-black ${row.balance >= 0 ? 'text-teal-800' : 'text-purple-800'}`}>
                      {Math.abs(row.balance).toLocaleString()} {row.balance >= 0 ? 'مدين' : 'دائن'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 3: BALANCE SHEET (قائمة المركز المالي) ─── */}
      {activeTab === 'financial-position' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-scale-balanced text-teal-700"></i>
                قائمة المركز المالي الموحدة (Statement of Financial Position / Balance Sheet)
              </h3>
              <p className="text-xs text-slate-500 mt-1">مطابقة الأصول مع الخصوم وحقوق الملكية كما في نهاية الفترة المالية</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportData('balance-sheet', TRIAL_BALANCE_DATA, 'excel', `المركز المالي - ${activeCompany.name}`)}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <i className="fa-solid fa-file-excel"></i> Excel
              </button>
              <button
                onClick={() => exportData('balance-sheet', TRIAL_BALANCE_DATA, 'pdf', `المركز المالي - ${activeCompany.name}`)}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <i className="fa-solid fa-file-pdf"></i> PDF
              </button>
              <button
                onClick={() => exportData('balance-sheet', TRIAL_BALANCE_DATA, 'print', `قائمة المركز المالي - ${activeCompany.name}`)}
                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <i className="fa-solid fa-print"></i> طباعة رسمية
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assets */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="font-black text-teal-900 border-b-2 border-teal-700 pb-2 text-sm flex justify-between">
                <span>1. الأصول (Assets)</span>
                <span>2,132,971.20 ر.س</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="font-bold text-slate-700">أ. الأصول المتداولة (Current Assets):</div>
                <div className="flex justify-between py-1.5 border-b border-slate-200 text-slate-600">
                  <span>النقدية وما في حكمها (الصناديق والبنوك):</span>
                  <span className="font-bold font-mono">850,000.00 ر.س</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200 text-slate-600">
                  <span>أمانات مساند المعلقة (فترة التجربة 90 يوماً):</span>
                  <span className="font-bold font-mono">184,500.00 ر.س</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200 text-slate-600">
                  <span>المدينون وأرصدة العملاء:</span>
                  <span className="font-bold font-mono">215,971.20 ر.س</span>
                </div>
              </div>

              <div className="space-y-2 text-xs pt-2">
                <div className="font-bold text-slate-700">ب. الأصول غير المتداولة (Non-Current Assets):</div>
                <div className="flex justify-between py-1.5 border-b border-slate-200 text-slate-600">
                  <span>صافي الأصول الثابتة (المباني والحافلات):</span>
                  <span className="font-bold font-mono">882,500.00 ر.س</span>
                </div>
              </div>
            </div>

            {/* Liabilities & Equity */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="font-black text-purple-900 border-b-2 border-purple-700 pb-2 text-sm flex justify-between">
                <span>2. الخصوم وحقوق الملكية (Liabilities & Equity)</span>
                <span>2,132,971.20 ر.س</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="font-bold text-slate-700">أ. الخصوم والالتزامات المتداولة:</div>
                <div className="flex justify-between py-1.5 border-b border-slate-200 text-slate-600">
                  <span>مستحقات الموردين والوكلاء الخارجيين:</span>
                  <span className="font-bold font-mono">189,375.00 ر.س</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200 text-slate-600">
                  <span>مخصص مكافأة نهاية الخدمة (EOSB):</span>
                  <span className="font-bold font-mono">94,200.00 ر.س</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200 text-slate-600">
                  <span>ضريبة القيمة المضافة المستحقة (ZATCA VAT 15%):</span>
                  <span className="font-bold font-mono">124,000.00 ر.س</span>
                </div>
              </div>

              <div className="space-y-2 text-xs pt-2">
                <div className="font-bold text-slate-700">ب. حقوق الملكية (Owner's Equity):</div>
                <div className="flex justify-between py-1.5 border-b border-slate-200 text-slate-600">
                  <span>رأس المال المباشر المدفوع:</span>
                  <span className="font-bold font-mono">1,205,000.00 ر.س</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200 text-slate-600">
                  <span>الأرباح الصافية المرحلة:</span>
                  <span className="font-bold font-mono text-emerald-700">520,396.20 ر.س</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: INCOME STATEMENT (قائمة الدخل والأرباح) ─── */}
      {activeTab === 'income-statement' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-arrow-trend-up text-emerald-600"></i>
                قائمة الدخل والأرباح والخسائر (Income Statement / P&L)
              </h3>
              <p className="text-xs text-slate-500 mt-1">تحليل الإيرادات، التكاليف المباشرة، والمصروفات الإدارية وصافي الربح</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportData('income-statement', TRIAL_BALANCE_DATA, 'excel', `قائمة الدخل - ${activeCompany.name}`)}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <i className="fa-solid fa-file-excel"></i> Excel
              </button>
              <button
                onClick={() => exportData('income-statement', TRIAL_BALANCE_DATA, 'pdf', `قائمة الدخل - ${activeCompany.name}`)}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <i className="fa-solid fa-file-pdf"></i> PDF
              </button>
              <button
                onClick={() => exportData('income-statement', TRIAL_BALANCE_DATA, 'print', `قائمة الدخل - ${activeCompany.name}`)}
                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <i className="fa-solid fa-print"></i> طباعة رسمية
              </button>
            </div>
          </div>

          <div className="max-w-2xl mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-sm font-medium">
            <div className="flex justify-between py-2 border-b border-slate-200 font-bold text-slate-800">
              <span>إيرادات خدمات التوسط في الاستقدام (مساند):</span>
              <span className="font-mono">410,000.00 ر.س</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200 font-bold text-slate-800">
              <span>إيرادات عقود التأجير والتشغيل:</span>
              <span className="font-mono">115,471.20 ر.س</span>
            </div>
            <div className="flex justify-between py-2 bg-emerald-50/80 px-3 rounded-xl font-black text-emerald-900 border border-emerald-200">
              <span>إجمالي الإيرادات التشغيلية:</span>
              <span className="font-mono">525,471.20 ر.س</span>
            </div>

            <div className="pt-2 text-rose-800">
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span>تكلفة المكاتب الخارجية والتأشيرات:</span>
                <span className="font-mono">-65,000.00 ر.س</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span>مصاريف الإعاشة والإيواء والفحص الطبي:</span>
                <span className="font-mono">-25,000.00 ر.س</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span>الرواتب والأجور والمكافآت:</span>
                <span className="font-mono">-130,500.00 ر.س</span>
              </div>
            </div>

            <div className="flex justify-between py-3 bg-teal-900 text-white px-4 rounded-xl font-black text-base shadow-md">
              <span>صافي الربح للفترة (Net Income):</span>
              <span className="font-mono">304,971.20 ر.س</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 5: JOURNALS ─── */}
      {activeTab === 'journals' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-base text-slate-900">سجل القيود اليومية</h3>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
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
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <i className="fa-solid fa-file-excel"></i> Excel
              </button>
              <button
                onClick={() => exportData('journals', filteredJournals, 'pdf', `القيود اليومية - ${activeCompany.name}`)}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <i className="fa-solid fa-file-pdf"></i> PDF
              </button>
              <button
                onClick={() => exportData('journals', filteredJournals, 'print', `سجل القيود المحاسبية - ${activeCompany.name}`)}
                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <i className="fa-solid fa-print"></i> طباعة
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">رقم القيد</th>
                  <th className="py-3 px-4">التاريخ</th>
                  <th className="py-3 px-4">الفرع / مركز التكلفة</th>
                  <th className="py-3 px-4">البيان والشرح</th>
                  <th className="py-3 px-4">المبلغ</th>
                  <th className="py-3 px-4">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredJournals.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-purple-700">{j.ref_no}</td>
                    <td className="py-3 px-4 text-xs text-slate-500">{j.date}</td>
                    <td className="py-3 px-4 text-xs font-bold text-slate-700">{j.branch}</td>
                    <td className="py-3 px-4">{j.description}</td>
                    <td className="py-3 px-4 font-black text-teal-800">{j.amount.toLocaleString()} ر.س</td>
                    <td className="py-3 px-4">
                      <Badge text={j.status} type="success" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 6: VOUCHERS ─── */}
      {activeTab === 'vouchers' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="font-bold text-base text-slate-900">سجل سندات القبض والصرف</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => exportData('vouchers', vouchers, 'excel', `سندات القبض والصرف - ${activeCompany.name}`)}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <i className="fa-solid fa-file-excel"></i> Excel
              </button>
              <button
                onClick={() => exportData('vouchers', vouchers, 'pdf', `سندات القبض والصرف - ${activeCompany.name}`)}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <i className="fa-solid fa-file-pdf"></i> PDF
              </button>
              <button
                onClick={() => exportData('vouchers', vouchers, 'print', `سجل السندات المالية - ${activeCompany.name}`)}
                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <i className="fa-solid fa-print"></i> طباعة
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">رقم السند</th>
                  <th className="py-3 px-4">النوع</th>
                  <th className="py-3 px-4">التاريخ</th>
                  <th className="py-3 px-4">المدفوع له / القابض</th>
                  <th className="py-3 px-4">الخزينة / البنك</th>
                  <th className="py-3 px-4">المبلغ</th>
                  <th className="py-3 px-4">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {vouchers.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-teal-800">{v.voucher_no}</td>
                    <td className="py-3 px-4">
                      <Badge text={v.type} type={v.type === 'قبض' ? 'success' : 'danger'} />
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500">{v.date}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{v.payee_payer}</td>
                    <td className="py-3 px-4 text-xs font-bold text-slate-700">{v.treasury}</td>
                    <td className="py-3 px-4 font-black text-emerald-800">{v.amount.toLocaleString()} ر.س</td>
                    <td className="py-3 px-4">
                      <Badge text={v.status} type="success" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 7: SUPPLIERS / FOREIGN AGENCIES ($) ─── */}
      {activeTab === 'suppliers-agents' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="font-bold text-base text-slate-900">كشوفات حسابات الموردين والوكلاء الخارجيين بالدولار ($/SAR)</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => exportData('external-offices', SUPPLIERS_ACCOUNTS, 'excel', `حسابات الوكلاء الخارجيين - ${activeCompany.name}`)}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <i className="fa-solid fa-file-excel"></i> Excel
              </button>
              <button
                onClick={() => exportData('external-offices', SUPPLIERS_ACCOUNTS, 'pdf', `حسابات الوكلاء الخارجيين - ${activeCompany.name}`)}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <i className="fa-solid fa-file-pdf"></i> PDF
              </button>
              <button
                onClick={() => exportData('external-offices', SUPPLIERS_ACCOUNTS, 'print', `كشف حسابات الوكلاء الخارجيين - ${activeCompany.name}`)}
                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <i className="fa-solid fa-print"></i> طباعة رسمية
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">اسم الوكيل الخارجي</th>
                  <th className="py-3 px-4">الدولة والمدينة</th>
                  <th className="py-3 px-4">السير الذاتية</th>
                  <th className="py-3 px-4">الرصيد بالدولار ($)</th>
                  <th className="py-3 px-4">المقابل بالريال (SAR)</th>
                  <th className="py-3 px-4">حالة المطابقة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {SUPPLIERS_ACCOUNTS.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                    <td className="py-3 px-4 text-xs text-slate-500">{s.country}</td>
                    <td className="py-3 px-4 font-bold text-purple-700">{s.cv_count} سيرة ذاتية</td>
                    <td className="py-3 px-4 font-mono font-bold text-rose-600">${s.balance_usd.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono font-black text-teal-800">{s.balance_sar.toLocaleString()} ر.س</td>
                    <td className="py-3 px-4">
                      <Badge text={s.status} type="success" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 8: EOSB & ZAKAT CALCULATOR ─── */}
      {activeTab === 'eosb-zakat' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <i className="fa-solid fa-hand-holding-dollar text-purple-700"></i>
            حاسبة مخصص مكافأة نهاية الخدمة (EOSB) والزكاة الشرعية (نظام العمل السعودي)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-sm text-slate-800">بيانات احتساب مكافأة الموظف:</h4>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">الراتب الأساسي الأخير (ر.س)</label>
                <input
                  type="number"
                  value={eosbCalc.salary}
                  onChange={(e) => setEosbCalc({ ...eosbCalc, salary: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">سنوات الخدمة الإجمالية</label>
                <input
                  type="number"
                  step="0.5"
                  value={eosbCalc.years}
                  onChange={(e) => setEosbCalc({ ...eosbCalc, years: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">سبب انتهاء العلاقة العمالية</label>
                <select
                  value={eosbCalc.reason}
                  onChange={(e) => setEosbCalc({ ...eosbCalc, reason: e.target.value as any })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold"
                >
                  <option value="resignation">استقالة من الموظف (المادة 85)</option>
                  <option value="termination">إنهاء عقد من المنشأة / انتهاء المدة (المادة 84)</option>
                </select>
              </div>
            </div>

            <div className="bg-purple-900 text-white p-6 rounded-2xl shadow-lg space-y-4">
              <h4 className="font-bold text-base text-purple-200">النتيجة النظامية المعتمدة:</h4>
              <div className="text-3xl font-black text-white">
                {calculateEOSBResult().toLocaleString()} ر.س
              </div>
              <p className="text-xs text-purple-200 leading-relaxed">
                تم الاحتساب وفقاً للمادتين 84 و 85 من نظام العمل السعودي المعتمد من وزارة الموارد البشرية والتنمية الاجتماعية.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 11: CHART OF ACCOUNTS (شجرة الحسابات والدليل المحاسبي الموحد) ─── */}
      {activeTab === 'chart-of-accounts' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-sitemap text-teal-700"></i>
                شجرة الحسابات والدليل المحاسبي الموحد (Chart of Accounts - COA)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                الهيكل المحاسبي الشامل لـ ({activeCompany.name}) مقسم وفق المعايير المحاسبية (1: أصول، 2: خصوم، 3: حقوق ملكية، 4: إيرادات، 5: مصروفات)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddAccountModal(true)}
                className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-200 transition-all flex items-center gap-1.5"
              >
                <i className="fa-solid fa-plus"></i> إضافة حساب محاسبي فرعي
              </button>
              <button
                onClick={() => useAppStore.getState().setActiveTab('data-import', 'معالج استيراد البيانات الشامل (Excel / CSV)')}
                className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                title="استيراد دليل الحسابات من Excel / CSV"
              >
                <i className="fa-solid fa-file-import text-purple-600"></i> استيراد الدليل (Excel)
              </button>
              <button
                onClick={() => exportData('trial-balance', chartOfAccountsService.getAccountsByCompany(activeCompany.id as any), 'excel', `دليل_الحسابات_${activeCompany.name}`)}
                className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <i className="fa-solid fa-file-excel"></i> تصدير الدليل
              </button>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex items-center gap-1 flex-wrap">
              {['ALL', 'أصول', 'خصوم', 'حقوق ملكية', 'إيرادات', 'مصروفات'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCoaCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    coaCategoryFilter === cat
                      ? 'bg-teal-800 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'ALL' ? 'جميع الحسابات' : cat}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="text"
                value={coaSearchQuery}
                onChange={(e) => setCoaSearchQuery(e.target.value)}
                placeholder="بحث برقم الحساب أو الاسم..."
                className="px-3 py-1.5 pr-8 bg-white border border-slate-200 rounded-lg text-xs font-medium w-64 outline-none"
              />
              <i className="fa-solid fa-magnifying-glass absolute right-2.5 top-2.5 text-slate-400 text-xs"></i>
            </div>
          </div>

          {/* Accounts Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">رقم الحساب</th>
                  <th className="py-3 px-4">اسم الحساب (عربي)</th>
                  <th className="py-3 px-4">Account Name (EN)</th>
                  <th className="py-3 px-4">التصنيف المحاسبي</th>
                  <th className="py-3 px-4">الرصيد التراكمي</th>
                  <th className="py-3 px-4">طبيعة الحساب</th>
                  <th className="py-3 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
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
                      className={`hover:bg-teal-50/40 transition-colors ${
                        account.isHeader ? 'bg-slate-50 font-bold' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-purple-700">
                        {account.code}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                        {account.isHeader ? (
                          <i className="fa-solid fa-folder text-amber-500"></i>
                        ) : (
                          <i className="fa-solid fa-file-invoice text-teal-600"></i>
                        )}
                        <span>{account.nameAr}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">{account.nameEn}</td>
                      <td className="py-3 px-4">
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
                      <td className="py-3 px-4 font-mono font-bold text-teal-900">
                        {account.balance.toLocaleString()} {account.currency}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-600">
                        {account.category === 'أصول' || account.category === 'مصروفات' ? 'مدين بطبيعته' : 'دائن بطبيعته'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedAccountForDrilldown({
                            code: account.code,
                            name: account.nameAr,
                            type: account.category,
                            balance: account.balance
                          })}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-teal-100 text-teal-800 rounded-lg text-xs font-bold transition-all"
                        >
                          <i className="fa-solid fa-eye"></i> كشف الحساب
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 12: PERIOD CLOSING (إقفال الفترات والسنوات المالية) ─── */}
      {activeTab === 'period-closing' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-lock text-rose-700"></i>
                إقفال الفترات والسنوات المالية (Fiscal Year & Period Locks)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                قفل الفترات المحاسبية يمنع إجراء أي تعديلات أو إضافة قيود جديدة بأثر رجعي لحماية التقارير المالية والضريبية.
              </p>
            </div>

            <div className="px-3.5 py-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
              <i className="fa-solid fa-shield-check text-emerald-600 text-sm"></i>
              السنة المالية الحالية: 2026 (نشطة)
            </div>
          </div>

          {/* Months Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                      ? 'bg-slate-50 border-slate-200'
                      : period.m === 8
                      ? 'bg-teal-50/60 border-teal-300 shadow-sm'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-sm text-slate-900">{period.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isClosed ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isClosed ? '🔒 مغلق ومحمي' : '🟢 مفتوح ونشط'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">{period.desc}</p>
                  <button
                    onClick={() => {
                      if (isClosed) {
                        setClosedPeriods(closedPeriods.filter((p) => p !== period.m));
                      } else {
                        setClosedPeriods([...closedPeriods, period.m]);
                      }
                    }}
                    className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isClosed
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        : 'bg-rose-700 hover:bg-rose-800 text-white shadow-sm'
                    }`}
                  >
                    {isClosed ? 'طلب إعادة فتح الفترة' : 'قفل وإغلاق الفترة'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── MODAL: FINANCIAL DRILL-DOWN (كشف حساب وتحليل الحركات) ─── */}
      {selectedAccountForDrilldown && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden font-sans">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-list-check text-emerald-400"></i>
                <h3 className="font-bold text-base">
                  كشف حساب تفصيلي: {selectedAccountForDrilldown.name} ({selectedAccountForDrilldown.code})
                </h3>
              </div>
              <button
                onClick={() => setSelectedAccountForDrilldown(null)}
                className="text-slate-400 hover:text-white"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block font-bold">رمز الحساب:</span>
                  <span className="font-mono font-bold text-purple-700">{selectedAccountForDrilldown.code}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">النوع:</span>
                  <span className="font-bold text-slate-800">{selectedAccountForDrilldown.type || 'أصول'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">الرصيد التراكمي:</span>
                  <span className="font-mono font-black text-teal-800">
                    {Number(selectedAccountForDrilldown.balance || 0).toLocaleString()} ر.س
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700">سجل القيود المحاسبية المرتبطة بهذا الحساب:</h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs max-h-56 overflow-y-auto">
                  {journals.map((j) => (
                    <div key={j.id} className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{j.ref_no}</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">{j.description}</p>
                      </div>
                      <div className="text-left font-mono">
                        <span className="font-bold text-teal-900 block">{j.amount.toLocaleString()} ر.س</span>
                        <span className="text-[10px] text-slate-400">{j.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  onClick={() => exportData('journals', journals, 'excel', `كشف_حساب_${selectedAccountForDrilldown.code}`)}
                  className="px-4 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-file-excel"></i> تصدير كشف الحساب
                </button>
                <button
                  onClick={() => setSelectedAccountForDrilldown(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden font-sans">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">إصدار سند مالي جديد (قبض / صرف)</h3>
              <button onClick={() => setShowAddVoucherModal(false)} className="text-slate-400 hover:text-white">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">نوع السند *</label>
                <select
                  value={voucherForm.type}
                  onChange={(e) => setVoucherForm({ ...voucherForm, type: e.target.value as any })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                >
                  <option value="قبض">سند قبض (مقبوضات نقدية/بنكية)</option>
                  <option value="صرف">سند صرف (مصروفات/مستحقات)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم الدافع / المستفيد *</label>
                <input
                  type="text"
                  value={voucherForm.payee_payer}
                  onChange={(e) => setVoucherForm({ ...voucherForm, payee_payer: e.target.value })}
                  placeholder="اسم العميل، المورد، أو الموظف..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">الخزينة / الحساب البنكي</label>
                <select
                  value={voucherForm.treasury}
                  onChange={(e) => setVoucherForm({ ...voucherForm, treasury: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                >
                  <option>بنك الراجحي - الحساب التشغيلي</option>
                  <option>بنك الرياض - حساب الاستقدام</option>
                  <option>بنك مساند الموحد</option>
                  <option>الصندوق الرئيسي (نقدي)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">المبلغ بالريال السعودي *</label>
                <input
                  type="number"
                  step="0.01"
                  value={voucherForm.amount}
                  onChange={(e) => setVoucherForm({ ...voucherForm, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddVoucherModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-bold shadow-md shadow-teal-200"
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden font-sans">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">تسجيل قيد محاسبي يومي جديد</h3>
              <button onClick={() => setShowAddJournalModal(false)} className="text-slate-400 hover:text-white">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleCreateJournal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">الفرع المسؤول / مركز التكلفة</label>
                <select
                  value={journalForm.branch}
                  onChange={(e) => setJournalForm({ ...journalForm, branch: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                >
                  <option>فرع الرياض الرئيسي</option>
                  <option>فرع جدة</option>
                  <option>فرع الخبر والدمام</option>
                  <option>مركز الإيواء</option>
                  <option>الإدارة العامة</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">البيان والشرح التفصيلي للقيد *</label>
                <textarea
                  rows={3}
                  value={journalForm.description}
                  onChange={(e) => setJournalForm({ ...journalForm, description: e.target.value })}
                  placeholder="مثال: قيد إثبات استحقاق فاتورة رقم..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">المبلغ الإجمالي للقيد (ر.س) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={journalForm.amount}
                  onChange={(e) => setJournalForm({ ...journalForm, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddJournalModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-sm font-bold shadow-md shadow-purple-200"
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
