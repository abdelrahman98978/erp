import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { AccountNode } from '../types';

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
  { id: 'j-282', ref_no: ' قيد #282', date: '2026-07-31', description: 'قيد فاتورة عقد تأجير رقم RC-2026-0014 / الفاتورة #12 / العميل ابو اياد', amount: 1150.00, status: 'بانتظار الاعتماد', branch: 'فرع الرياض' },
  { id: 'j-281', ref_no: ' قيد #281', date: '2026-07-31', description: 'سند قبض عقد تأجير رقم RC-2026-0013 / الفاتورة #11 / العميل ابو اياد / إيداع بنك الراجحي', amount: 138.00, status: 'بانتظار الاعتماد', branch: 'فرع الرياض' },
  { id: 'j-280', ref_no: ' قيد #280', date: '2026-07-31', description: 'قيد فاتورة عقد تأجير رقم RC-2026-0013 / الفاتورة #11 / العميل ابو اياد', amount: 138.00, status: 'بانتظار الاعتماد', branch: 'فرع الرياض' },
  { id: 'j-279', ref_no: ' قيد #279', date: '2026-07-30', description: 'إثبات مصاريف عاملة تأجير #2213 - sara / المكتب الخارجي: DAMAS FOREIGN EMPLOYMENT AGENCY', amount: 2133.00, status: 'بانتظار الاعتماد', branch: 'مركز الإيواء' },
  { id: 'j-278', ref_no: ' قيد #278', date: '2026-07-30', description: 'تحويل بنكي لحوالة مساند بدون مرجع من الحساب البنكي الرئيسي', amount: 3700.00, status: 'معتمد', branch: 'الإدارة العامة' }
];

const MOCK_VOUCHERS: Voucher[] = [
  { id: 'v-59', voucher_no: 'قبض #59', type: 'قبض', date: '2026-07-31', payee_payer: 'العميل سارة أحمد', treasury: 'بنك الراجحي', amount: 138.00, status: 'معتمد' },
  { id: 'v-58', voucher_no: 'قبض #58', type: 'قبض', date: '2026-07-31', payee_payer: 'عميل مساند', treasury: 'بنك مساند', amount: 3786.30, status: 'معتمد' },
  { id: 'v-57', voucher_no: 'قبض #57', type: 'قبض', date: '2026-07-31', payee_payer: 'عميل مساند', treasury: 'بنك مساند', amount: 1590.05, status: 'معتمد' },
  { id: 'v-1', voucher_no: 'صرف #1', type: 'صرف', date: '2026-07-30', payee_payer: 'ابو علي', treasury: 'الصندوق الرئيسي', amount: 5000.00, status: 'معتمد' }
];

const ACCOUNTS_TREE: AccountNode[] = [
  { code: '1', name: 'الأصول (Assets)', type: 'أصول', balance: 1250000.00, children_count: 42 },
  { code: '11', name: 'الأصول المتداولة (Current Assets)', type: 'أصول', balance: 850000.00, children_count: 18 },
  { code: '11030', name: 'حساب أمانات مساند المعلقة (90 يوماً)', type: 'أصول', balance: 184500.00 },
  { code: '12100', name: 'الصندوق الرئيسي (Cash)', type: 'أصول', balance: 154200.00 },
  { code: '1220100', name: 'بنك الرياض - حساب الاستقدام', type: 'أصول', balance: 420500.00 },
  { code: '1220200', name: 'بنك الراجحي - الحساب التشغيلي', type: 'أصول', balance: 275300.00 },
  { code: '2', name: 'الخصوم (Liabilities)', type: 'خصوم', balance: 45000.00, children_count: 14 },
  { code: '21040', name: 'مخصص مكافأة نهاية الخدمة (EOSB Provision)', type: 'خصوم', balance: 94200.00 },
  { code: '3', name: 'حقوق الملكية (Equity)', type: 'حقوق ملكية', balance: 1205000.00, children_count: 8 },
  { code: '4', name: 'الإيرادات (Revenues)', type: 'إيرادات', balance: 525471.20, children_count: 26 },
  { code: '41100', name: 'إيرادات عقود الاستقدام التوسط', type: 'إيرادات', balance: 410000.00 },
  { code: '41200', name: 'إيرادات عقود التأجير والتشغيل', type: 'إيرادات', balance: 115471.20 },
  { code: '5', name: 'المصروفات (Expenses)', type: 'مصروفات', balance: 5000.00, children_count: 35 }
];

export const FinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'financial-position' | 'zatca-ksa' | 'musaned-escrow' | 'eosb-zakat' | 'tree' | 'journals' | 'vouchers' | 'transfers' | 'suppliers-agents' | 'clients-balances' | 'assets-depreciation' | 'cost-centers' | 'financial-statements' | 'tax'
  >('overview');

  const [journals, setJournals] = useState<JournalEntry[]>(MOCK_JOURNALS);
  const [vouchers, setVouchers] = useState<Voucher[]>(MOCK_VOUCHERS);

  // Modals state
  const [showAddVoucherModal, setShowAddVoucherModal] = useState(false);
  const [showAddJournalModal, setShowAddJournalModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // EOSB Calculator State
  const [eosbCalc, setEosbCalc] = useState({
    salary: '8500',
    years: '3.5',
    reason: 'resignation' as 'resignation' | 'termination'
  });

  const calculateEOSBResult = () => {
    const sal = parseFloat(eosbCalc.salary) || 0;
    const yrs = parseFloat(eosbCalc.years) || 0;

    let base = 0;
    if (yrs <= 5) {
      base = yrs * (sal / 2);
    } else {
      base = 5 * (sal / 2) + (yrs - 5) * sal;
    }

    if (eosbCalc.reason === 'resignation') {
      if (yrs < 2) return 0;
      if (yrs >= 2 && yrs < 5) return base * (1 / 3);
      if (yrs >= 5 && yrs < 10) return base * (2 / 3);
      return base;
    }
    return base;
  };

  // New Voucher Form
  const [voucherForm, setVoucherForm] = useState({
    type: 'قبض' as 'قبض' | 'صرف',
    payee_payer: '',
    treasury: 'بنك الراجحي',
    amount: ''
  });

  // New Journal Form
  const [journalForm, setJournalForm] = useState({
    description: '',
    amount: '',
    branch: 'فرع الرياض'
  });

  // Transfer Form State
  const [transferForm, setTransferForm] = useState({
    from_account: 'الصندوق الرئيسي',
    to_account: 'بنك الراجحي - الحساب التشغيلي',
    amount: ''
  });

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
      status: 'معتمد'
    };

    setVouchers([newV, ...vouchers]);
    setShowAddVoucherModal(false);
    setVoucherForm({ type: 'قبض', payee_payer: '', treasury: 'بنك الراجحي', amount: '' });
    alert(`تمت إضافة وتثبيت سند ${newV.type} رقم (${newV.voucher_no}) بنجاح!`);
  };

  const handleCreateJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalForm.description || !journalForm.amount) return;

    const newJ: JournalEntry = {
      id: `j-${Date.now()}`,
      ref_no: `قيد #${283 + journals.length}`,
      date: new Date().toISOString().slice(0, 10),
      description: journalForm.description,
      amount: parseFloat(journalForm.amount) || 0,
      status: 'بانتظار الاعتماد',
      branch: journalForm.branch
    };

    setJournals([newJ, ...journals]);
    setShowAddJournalModal(false);
    setJournalForm({ description: '', amount: '', branch: 'فرع الرياض' });
    alert(`تم إنشاء وتوجيه القيد المحاسبي (${newJ.ref_no}) وهو بانتظار الاعتماد الإداري!`);
  };

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferForm.amount) return;
    alert(`تم تحويل مبلغ (${transferForm.amount} ر.س) من [${transferForm.from_account}] إلى [${transferForm.to_account}] وتوليد القيد المزدوج تلقائياً!`);
    setShowTransferModal(false);
    setTransferForm({ from_account: 'الصندوق الرئيسي', to_account: 'بنك الراجحي - الحساب التشغيلي', amount: '' });
  };

  return (
    <div>
      {/* Top Banner Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Cairo, sans-serif' }}>
            <i className="fa-solid fa-scale-balanced text-purple ml-2"></i> منظومة المحاسبة وقائمة المركز المالي الشاملة (Balance Sheet & KSA Engine)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            مجموعة خالد السليم • قائمة المركز المالي، شجرة الحسابات (336)، ZATCA Phase 2، تسويات مساند (90 يوماً)، ومكافأة نهاية الخدمة
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-odoo btn-odoo-purple" onClick={() => setShowAddJournalModal(true)}>
            <i className="fa-solid fa-plus ml-1"></i> إضافة قيد يومية
          </button>
          <button className="btn-odoo btn-odoo-primary" onClick={() => setShowAddVoucherModal(true)}>
            <i className="fa-solid fa-file-invoice-dollar ml-1"></i> أضف سند قبض / صرف
          </button>
        </div>
      </div>

      {/* Complete Financial Sub-modules Tabs Bar */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '8px' }}>
        {[
          { id: 'overview', label: '🏠 اللوحة المالية' },
          { id: 'financial-position', label: '⚖️ قائمة المركز المالي (Balance Sheet)' },
          { id: 'zatca-ksa', label: '⚡ الفوترة الإلكترونية ZATCA' },
          { id: 'musaned-escrow', label: '🤝 أمانات مساند والـ 90 يوماً' },
          { id: 'eosb-zakat', label: '⚖️ نهاية الخدمة والزكاة' },
          { id: 'tree', label: '🌴 شجرة الحسابات (336)' },
          { id: 'journals', label: '📜 القيود اليومية (282)' },
          { id: 'vouchers', label: '📑 السندات المحاسبية' },
          { id: 'transfers', label: '🔄 التحويلات النقدية والبنوك' },
          { id: 'suppliers-agents', label: '🚚 الموردين والوكلاء ($)' },
          { id: 'clients-balances', label: '👥 أرصدة العملاء والمدينون' },
          { id: 'assets-depreciation', label: '🏗️ الأصول والإهلاك الزكوي' },
          { id: 'cost-centers', label: '🏢 مراكز التكلفة (130)' },
          { id: 'financial-statements', label: '📈 القوائم المالية والأرباح' },
          { id: 'tax', label: '🧾 الإقرار الضريبي VAT 15%' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`btn-odoo ${activeTab === tab.id ? 'btn-odoo-purple' : 'btn-odoo-secondary'}`}
            onClick={() => setActiveTab(tab.id as any)}
            style={{ whiteSpace: 'nowrap', fontSize: '12.5px' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Statement of Financial Position (Balance Sheet - المركز المالي) */}
      {activeTab === 'financial-position' && (
        <div className="table-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#005154', margin: 0 }}>
                ⚖️ قائمة المركز المالي الموحدة (Statement of Financial Position / Balance Sheet)
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                مجموعة خالد السليم • مطابقة الأصول مع الخصوم وحقوق الملكية كما في 31 يوليو 2026
              </p>
            </div>
            <button className="btn-odoo btn-odoo-purple" onClick={() => alert('تصدير قائمة المركز المالي الرسمية بصيغة PDF Mapped')}>
              <i className="fa-solid fa-file-pdf ml-1"></i> تصدير PDF المعتمد
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Assets Column */}
            <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '900', color: '#005154', borderBottom: '2px solid #005154', paddingBottom: '8px', marginBottom: '16px' }}>
                1. الأصول (Assets)
              </h4>

              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--odoo-purple)', marginBottom: '8px' }}>أ. الأصول المتداولة (Current Assets)</h5>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '1px dashed #CBD5E1' }}>
                  <span>النقدية وما في حكمها (الصناديق والبنوك):</span>
                  <strong>850,000.00 ر.س</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '1px dashed #CBD5E1' }}>
                  <span>أمانات مساند المعلقة (فترة التجربة):</span>
                  <strong>184,500.00 ر.س</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '1px dashed #CBD5E1' }}>
                  <span>مدينون وأرصدة عملاء سارية:</span>
                  <strong>215,971.20 ر.س</strong>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--odoo-purple)', marginBottom: '8px' }}>ب. الأصول غير المتداولة (Non-Current Assets)</h5>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '1px dashed #CBD5E1' }}>
                  <span>صافي الأصول الثابتة (المباني والحافلات):</span>
                  <strong>882,500.00 ر.س</strong>
                </div>
              </div>

              <div style={{ background: '#005154', color: 'white', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '15px', marginTop: '20px' }}>
                <span>إجمالي الأصول (Total Assets):</span>
                <span>2,132,971.20 ر.س</span>
              </div>
            </div>

            {/* Liabilities & Equity Column */}
            <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '900', color: '#714B67', borderBottom: '2px solid #714B67', paddingBottom: '8px', marginBottom: '16px' }}>
                2. الخصوم وحقوق الملكية (Liabilities & Equity)
              </h4>

              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ fontSize: '13.5px', fontWeight: '800', color: '#EF4444', marginBottom: '8px' }}>أ. الخصوم المتداولة والالتزامات</h5>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '1px dashed #CBD5E1' }}>
                  <span>مستحقات الموردين والوكلاء الخارجيين:</span>
                  <strong>189,375.00 ر.س</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '1px dashed #CBD5E1' }}>
                  <span>مخصص مكافأة نهاية الخدمة (EOSB):</span>
                  <strong>94,200.00 ر.س</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '1px dashed #CBD5E1' }}>
                  <span>الضريبة المستحقة للهيئة (VAT 15%):</span>
                  <strong>124,000.00 ر.س</strong>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ fontSize: '13.5px', fontWeight: '800', color: '#10B981', marginBottom: '8px' }}>ب. حقوق الملكية (Owners Equity)</h5>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '1px dashed #CBD5E1' }}>
                  <span>رأس المال المباشر المدفوع:</span>
                  <strong>1,205,000.00 ر.س</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '1px dashed #CBD5E1' }}>
                  <span>الأرباح الصافية المرحلة للفترة:</span>
                  <strong>520,396.20 ر.س</strong>
                </div>
              </div>

              <div style={{ background: '#714B67', color: 'white', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '15px', marginTop: '20px' }}>
                <span>إجمالي الخصوم والملكية:</span>
                <span>2,132,971.20 ر.س</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Transfers */}
      {activeTab === 'transfers' && (
        <div className="table-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154', margin: 0 }}>
              🔄 التحويلات النقدية بين البنوك والصناديق (Cash & Bank Transfers)
            </h3>
            <button className="btn-odoo btn-odoo-purple" onClick={() => setShowTransferModal(true)}>
              + إجراء تحويل بين الحسابات
            </button>
          </div>

          <table className="odoo-data-table">
            <thead>
              <tr>
                <th>رقم التحويل</th>
                <th>من حساب (المرسل)</th>
                <th>إلى حساب (المستلم)</th>
                <th>المبلغ المحول</th>
                <th>التاريخ والوقت</th>
                <th>البيان</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>TRF-2026-009</td>
                <td>الصندوق الرئيسي (نقدي)</td>
                <td>بنك الراجحي - الحساب التشغيلي</td>
                <td style={{ fontWeight: '800', color: '#005154' }}>50,000.00 ر.س</td>
                <td>2026-07-30 11:30</td>
                <td>إيداع مقبوضات فروع الإيواء والتأجير</td>
                <td><Badge text="مكتمل ومرحّل" type="success" /></td>
              </tr>
              <tr>
                <td style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>TRF-2026-008</td>
                <td>بنك مساند الموحد</td>
                <td>بنك الرياض - حساب الاستقدام</td>
                <td style={{ fontWeight: '800', color: '#005154' }}>120,000.00 ر.س</td>
                <td>2026-07-28 14:00</td>
                <td>تسوية حوالة إرجاع مالي لعقود استقدام مكتملة</td>
                <td><Badge text="مكتمل ومرحّل" type="success" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 1: Financial Overview */}
      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', borderRight: '4px solid #005154', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>إجمالي الإيرادات المعتمدة</span>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#005154', marginTop: '6px' }}>525,471.20 ر.س</div>
              <span style={{ fontSize: '11.5px', color: '#10B981', fontWeight: '700' }}>هذا الشهر: 164,025.70 ر.س</span>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', borderRight: '4px solid #EF4444', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>إجمالي المصروفات والتشغيل</span>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#EF4444', marginTop: '6px' }}>5,000.00 ر.س</div>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>رسوم تأشيرات ومساند وإعاشة</span>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', borderRight: '4px solid #714B67', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>صافي التدفق النقدي والأرباح</span>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#714B67', marginTop: '6px' }}>520,471.20 ر.س</div>
              <span style={{ fontSize: '11.5px', color: '#714B67', fontWeight: '700' }}>هامش ربح صافي: 99.0%</span>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', borderRight: '4px solid #F59E0B', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>أمانات مساند المعلقة (90 يوماً)</span>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#F59E0B', marginTop: '6px' }}>184,500.00 ر.س</div>
              <span style={{ fontSize: '11.5px', color: '#F59E0B' }}>تحت فترة التجربة الإلزامية</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Suppliers & Foreign Agencies ($) */}
      {activeTab === 'suppliers-agents' && (
        <div className="table-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#005154', marginBottom: '16px' }}>
            🚚 كشوفات الموردين وحسابات الوكلاء الخارجيين (Foreign Agencies USD & SAR Accounts)
          </h3>
          <table className="odoo-data-table">
            <thead>
              <tr>
                <th>اسم الوكيل الخارجي / المورد</th>
                <th>الدولة والمدينة</th>
                <th>إجمالي السير الذاتية</th>
                <th>الرصيد المستحق بالدولار ($)</th>
                <th>المقابل بالريال (SAR)</th>
                <th>حالة المطابقة المالية</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>🇵🇭 PLATINUM BROTHERS INT'L</td>
                <td>الفلبين - مانيلا</td>
                <td>158 سيرة ذاتية</td>
                <td style={{ fontWeight: '800', color: '#EF4444' }}>$34,500.00</td>
                <td style={{ fontWeight: '800', color: '#005154' }}>129,375.00 ر.س</td>
                <td><Badge text="مطابق وموثق" type="success" /></td>
                <td><button className="btn-odoo btn-odoo-purple" style={{ padding: '4px 8px', fontSize: '11.5px' }} onClick={() => alert('توليد كشف حساب بالدولار لمكتب بلاتينيوم')}>كشف حساب $</button></td>
              </tr>
              <tr>
                <td style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>🇪🇹 DAMAS FOREIGN EMPLOYMENT</td>
                <td>إثيوبيا - أديس أبابا</td>
                <td>5 سير ذاتية</td>
                <td style={{ fontWeight: '800', color: '#EF4444' }}>$4,200.00</td>
                <td style={{ fontWeight: '800', color: '#005154' }}>15,750.00 ر.س</td>
                <td><Badge text="قيد مراجعة القيد #279" type="warning" /></td>
                <td><button className="btn-odoo btn-odoo-purple" style={{ padding: '4px 8px', fontSize: '11.5px' }} onClick={() => alert('توليد كشف حساب بالدولار لمكتب داماس')}>كشف حساب $</button></td>
              </tr>
              <tr>
                <td style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>🇺🇬 Supreme Link Employment Agency</td>
                <td>أوغندا - كمبالا</td>
                <td>38 سيرة ذاتية</td>
                <td style={{ fontWeight: '800', color: '#EF4444' }}>$11,800.00</td>
                <td style={{ fontWeight: '800', color: '#005154' }}>44,250.00 ر.س</td>
                <td><Badge text="مطابق وموثق" type="success" /></td>
                <td><button className="btn-odoo btn-odoo-purple" style={{ padding: '4px 8px', fontSize: '11.5px' }} onClick={() => alert('توليد كشف حساب بالدولار لمكتب سوبريم لينك')}>كشف حساب $</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Assets & Tax Depreciation */}
      {activeTab === 'assets-depreciation' && (
        <div className="table-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#005154', marginBottom: '16px' }}>
            🏗️ جدول الأصول الثابتة والإهلاك الزكوي (SOCPA / ZATCA Asset Depreciation)
          </h3>
          <table className="odoo-data-table">
            <thead>
              <tr>
                <th>اسم الأصل الثابت</th>
                <th>الموقع والفرع</th>
                <th>قيمة الشراء الأصلية</th>
                <th>نسبة الإهلاك السنوي (ZATCA)</th>
                <th>مجمع الإهلاك التراكمي</th>
                <th>القيم الدفترية الصافية</th>
                <th>الإجراء المالي</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: '800' }}>مجمع مبنى الإيواء الرئيسي (ملكية)</td>
                <td>الرياض - حي الملز</td>
                <td style={{ fontWeight: '700' }}>850,000 ر.س</td>
                <td><Badge text="5% سنوياً" type="purple" /></td>
                <td style={{ color: '#EF4444' }}>-127,500 ر.س</td>
                <td style={{ fontWeight: '900', color: '#005154' }}>722,500 ر.س</td>
                <td><button className="btn-odoo btn-odoo-secondary" style={{ padding: '4px 8px', fontSize: '11.5px' }} onClick={() => alert('تشغيل القيد الآلي للإهلاك الزكوي')}>قيد الإهلاك</button></td>
              </tr>
              <tr>
                <td style={{ fontWeight: '800' }}>أسطول حافلات نقل الكوادر والعمالة (4 حافلات)</td>
                <td>فروع المجموعة (الرياض، جدة، الخبر)</td>
                <td style={{ fontWeight: '700' }}>320,000 ر.س</td>
                <td><Badge text="25% سنوياً" type="danger" /></td>
                <td style={{ color: '#EF4444' }}>-160,000 ر.س</td>
                <td style={{ fontWeight: '900', color: '#005154' }}>160,000 ر.س</td>
                <td><button className="btn-odoo btn-odoo-secondary" style={{ padding: '4px 8px', fontSize: '11.5px' }} onClick={() => alert('تشغيل القيد الآلي للإهلاك الزكوي')}>قيد الإهلاك</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Financial Statements */}
      {activeTab === 'financial-statements' && (
        <div className="table-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#005154', marginBottom: '16px' }}>
            📈 القوائم المالية الرسمية (Income Statement, Profit & Loss, Trial Balance)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #CBD5E1', textAlign: 'center' }}>
              <i className="fa-solid fa-chart-line" style={{ fontSize: '32px', color: '#005154', marginBottom: '8px' }}></i>
              <h4 style={{ fontSize: '15px', fontWeight: '800', margin: '4px 0' }}>قائمة الدخل الشاملة</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>صافي ربح التشغيل: 520,471.20 ر.س</p>
              <button className="btn-odoo btn-odoo-purple" style={{ marginTop: '8px', width: '100%' }} onClick={() => alert('توليد طباعة قائمة الدخل الرسمية PDF')}>عرض وتصدير PDF</button>
            </div>

            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #CBD5E1', textAlign: 'center' }}>
              <i className="fa-solid fa-scale-balanced" style={{ fontSize: '32px', color: '#714B67', marginBottom: '8px' }}></i>
              <h4 style={{ fontSize: '15px', fontWeight: '800', margin: '4px 0' }}>ميزان المراجعة العام</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>توازن المدين والدائن: 1,820,471 ر.س</p>
              <button className="btn-odoo btn-odoo-purple" style={{ marginTop: '8px', width: '100%' }} onClick={() => alert('توليد ميزان المراجعة لـ 336 حساب')}>عرض ميزان المراجعة</button>
            </div>

            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #CBD5E1', textAlign: 'center' }}>
              <i className="fa-solid fa-calculator" style={{ fontSize: '32px', color: '#10B981', marginBottom: '8px' }}></i>
              <h4 style={{ fontSize: '15px', fontWeight: '800', margin: '4px 0' }}>ميزانية الموردين الشهرية</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>مطابقة التكاليف والفيز</p>
              <button className="btn-odoo btn-odoo-purple" style={{ marginTop: '8px', width: '100%' }} onClick={() => alert('مراجعة مطابقة ميزانية الموردين والمكاتب')}>مراجعة ميزانية الموردين</button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Accounts Tree */}
      {activeTab === 'tree' && (
        <div className="table-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154', margin: 0 }}>
              🌴 شجرة الدليل المحاسبي الموحد (336 حساب)
            </h3>
            <button className="btn-odoo btn-odoo-purple" onClick={() => alert('إضافة حساب فرعي جديد لجدول الحسابات')}>
              + إضافة حساب جديد
            </button>
          </div>
          <table className="odoo-data-table">
            <thead>
              <tr>
                <th>كود الحساب</th>
                <th>اسم الحساب المحاسبي</th>
                <th>التصنيف الرئيسية</th>
                <th>الرصيد المالي الحالي</th>
              </tr>
            </thead>
            <tbody>
              {ACCOUNTS_TREE.map((acc, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{acc.code}</td>
                  <td style={{ fontWeight: '700' }}>{acc.name}</td>
                  <td><Badge text={acc.type} type="purple" /></td>
                  <td style={{ fontWeight: '800', color: '#005154' }}>{acc.balance.toLocaleString()} ر.س</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 9: Journal Constraints */}
      {activeTab === 'journals' && (
        <div className="table-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154', margin: 0 }}>
              📜 القيود المحاسبية اليومية (282 قيداً)
            </h3>
            <button className="btn-odoo btn-odoo-purple" onClick={() => setShowAddJournalModal(true)}>
              + إضافة قيد محاسبي
            </button>
          </div>
          <table className="odoo-data-table">
            <thead>
              <tr>
                <th>رقم القيد</th>
                <th>التاريخ</th>
                <th>الفرع / مركز التكلفة</th>
                <th>شرح وبيان القيد المحاسبي</th>
                <th>المبلغ</th>
                <th>الحالة الاعتمادية</th>
              </tr>
            </thead>
            <tbody>
              {journals.map(j => (
                <tr key={j.id}>
                  <td style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{j.ref_no}</td>
                  <td>{j.date}</td>
                  <td><Badge text={j.branch} type="info" /></td>
                  <td style={{ fontSize: '13px' }}>{j.description}</td>
                  <td style={{ fontWeight: '800' }}>{j.amount.toLocaleString()} ر.س</td>
                  <td><Badge text={j.status} type={j.status === 'معتمد' ? 'success' : 'warning'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 10: Vouchers */}
      {activeTab === 'vouchers' && (
        <div className="table-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154', margin: 0 }}>
              📑 سندات القبض وسندات الصرف العامة
            </h3>
            <button className="btn-odoo btn-odoo-primary" onClick={() => setShowAddVoucherModal(true)}>
              + أضف سند جديد
            </button>
          </div>
          <table className="odoo-data-table">
            <thead>
              <tr>
                <th>رقم السند</th>
                <th>نوع السند</th>
                <th>التاريخ</th>
                <th>الدافع / المستفيد</th>
                <th>الخزنة / البنك</th>
                <th>المبلغ</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map(v => (
                <tr key={v.id}>
                  <td style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{v.voucher_no}</td>
                  <td><Badge text={v.type} type={v.type === 'قبض' ? 'success' : 'danger'} /></td>
                  <td>{v.date}</td>
                  <td style={{ fontWeight: '700' }}>{v.payee_payer}</td>
                  <td>{v.treasury}</td>
                  <td style={{ fontWeight: '800' }}>{v.amount.toLocaleString()} ر.س</td>
                  <td><Badge text={v.status} type="success" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="table-card" style={{ width: '500px', padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154' }}>
                إجراء تحويل نقدي بين الخزائن والبنوك
              </h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setShowTransferModal(false)}></i>
            </div>

            <form onSubmit={handleCreateTransfer}>
              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">من حساب (الصندوق/البنك المرسل) *</label>
                <select
                  className="filter-select"
                  value={transferForm.from_account}
                  onChange={e => setTransferForm({ ...transferForm, from_account: e.target.value })}
                >
                  <option>الصندوق الرئيسي (نقدي)</option>
                  <option>بنك الراجحي - الحساب الرئيسي</option>
                  <option>بنك مساند الموحد</option>
                  <option>بنك الرياض - حساب الاستقدام</option>
                </select>
              </div>

              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">إلى حساب (البنك المستلم) *</label>
                <select
                  className="filter-select"
                  value={transferForm.to_account}
                  onChange={e => setTransferForm({ ...transferForm, to_account: e.target.value })}
                >
                  <option>بنك الراجحي - الحساب التشغيلي</option>
                  <option>بنك الرياض - حساب الاستقدام</option>
                  <option>صندوق الإيواء</option>
                </select>
              </div>

              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label className="filter-label">المبلغ المحوّل بالريال *</label>
                <input
                  type="number"
                  className="filter-input"
                  placeholder="0.00"
                  value={transferForm.amount}
                  onChange={e => setTransferForm({ ...transferForm, amount: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-odoo btn-odoo-secondary" onClick={() => setShowTransferModal(false)}>إلغاء</button>
                <button type="submit" className="btn-odoo btn-odoo-purple">إتمام التحويل وتوليد القيد</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Voucher Modal */}
      {showAddVoucherModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="table-card" style={{ width: '500px', padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154' }}>
                أضف سند محاسبي جديد (قبض / صرف)
              </h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setShowAddVoucherModal(false)}></i>
            </div>

            <form onSubmit={handleCreateVoucher}>
              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">نوع السند *</label>
                <select
                  className="filter-select"
                  value={voucherForm.type}
                  onChange={e => setVoucherForm({ ...voucherForm, type: e.target.value as any })}
                >
                  <option value="قبض">سند قبض (إيراد)</option>
                  <option value="صرف">سند صرف (مصروف)</option>
                </select>
              </div>

              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">الدافع / المستفيد *</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="اسم العميل أو المورد أو الموظف..."
                  value={voucherForm.payee_payer}
                  onChange={e => setVoucherForm({ ...voucherForm, payee_payer: e.target.value })}
                  required
                />
              </div>

              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">الخزنة / البنك *</label>
                <select
                  className="filter-select"
                  value={voucherForm.treasury}
                  onChange={e => setVoucherForm({ ...voucherForm, treasury: e.target.value })}
                >
                  <option>بنك الراجحي - الحساب الرئيسي</option>
                  <option>بنك الرياض - حساب الاستقدام</option>
                  <option>بنك مساند</option>
                  <option>الصندوق الرئيسي (نقدي)</option>
                </select>
              </div>

              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label className="filter-label">المبلغ بالريال السعودي *</label>
                <input
                  type="number"
                  step="0.01"
                  className="filter-input"
                  placeholder="0.00"
                  value={voucherForm.amount}
                  onChange={e => setVoucherForm({ ...voucherForm, amount: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-odoo btn-odoo-secondary" onClick={() => setShowAddVoucherModal(false)}>إلغاء</button>
                <button type="submit" className="btn-odoo btn-odoo-purple">اعتماد وحفظ السند</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Journal Constraint Modal */}
      {showAddJournalModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="table-card" style={{ width: '520px', padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154' }}>
                إضافة وتوجيه قيد محاسبي جديد
              </h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setShowAddJournalModal(false)}></i>
            </div>

            <form onSubmit={handleCreateJournal}>
              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">الفرع / مركز التكلفة *</label>
                <select
                  className="filter-select"
                  value={journalForm.branch}
                  onChange={e => setJournalForm({ ...journalForm, branch: e.target.value })}
                >
                  <option>فرع الرياض الرئيسي</option>
                  <option>فرع جدة (الغربية)</option>
                  <option>فرع الخبر (الشرقية)</option>
                  <option>مركز الإيواء</option>
                </select>
              </div>

              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">البيان والشرح التفصيلي للقيد *</label>
                <textarea
                  className="filter-input"
                  rows={3}
                  placeholder="مثال: قيد إثبات فاتورة استقدام رقم..."
                  value={journalForm.description}
                  onChange={e => setJournalForm({ ...journalForm, description: e.target.value })}
                  required
                />
              </div>

              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label className="filter-label">قيمة القيد المحاسبي *</label>
                <input
                  type="number"
                  step="0.01"
                  className="filter-input"
                  placeholder="0.00"
                  value={journalForm.amount}
                  onChange={e => setJournalForm({ ...journalForm, amount: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-odoo btn-odoo-secondary" onClick={() => setShowAddJournalModal(false)}>إلغاء</button>
                <button type="submit" className="btn-odoo btn-odoo-purple">إرسال القيد للاعتماد</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancePage;
