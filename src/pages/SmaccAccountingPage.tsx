import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  FileText,
  CreditCard,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Printer,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronLeft,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart
} from 'lucide-react';
import { SmaccFormModal } from '../components/smacc/SmaccFormModal';

export interface SmaccAccountNode {
  code: string;
  name: string;
  type: 'أصول' | 'خصوم' | 'حقوق ملكية' | 'إيرادات' | 'مصروفات';
  nature: 'مدين' | 'دائن';
  balance: number;
  parentCode?: string;
  children?: SmaccAccountNode[];
}

export const SmaccAccountingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'coa' | 'cost-centers' | 'journals' | 'vouchers' | 'ledger' | 'trial-balance' | 'income-statement' | 'balance-sheet' | 'fiscal-closing'>('coa');
  const [selectedLedgerAccount, setSelectedLedgerAccount] = useState('1101');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucherType, setVoucherType] = useState<'قبض' | 'صرف'>('قبض');

  // New Account Form State
  const [newAccount, setNewAccount] = useState({
    code: '',
    name: '',
    type: 'أصول' as const,
    nature: 'مدين' as const,
    parentCode: '1100',
    openingBalance: '0',
  });

  // New Voucher Form State
  const [newVoucher, setNewVoucher] = useState({
    voucherNo: 'VOU-2026-089',
    date: '2026-08-18',
    payeeName: '',
    treasury: 'بنك الراجحي الرئيسي',
    amount: '',
    vatInclusive: true,
    description: '',
    costCenter: 'مركز الرياض التشغيلي',
  });

  // New Journal Entry State
  const [journalHeader, setJournalHeader] = useState({
    refNo: 'JV-2026-402',
    date: '2026-08-18',
    description: '',
    branch: 'فرع الرياض الرئيسي',
  });

  const [journalLines, setJournalLines] = useState([
    { accountCode: '1101', accountName: 'الصندوق الرئيسي', debit: '1000', credit: '0', memo: 'إيداع نقدي' },
    { accountCode: '4101', accountName: 'إيرادات عقود الاستقدام', debit: '0', credit: '1000', memo: 'إثبات الإيراد' },
  ]);

  // Initial Mock Chart of Accounts Tree
  const [chartOfAccounts, setChartOfAccounts] = useState<SmaccAccountNode[]>([
    {
      code: '1000',
      name: 'الأصول (Assets)',
      type: 'أصول',
      nature: 'مدين',
      balance: 1830000,
      children: [
        { code: '1100', name: 'الأصول المتداولة', type: 'أصول', nature: 'مدين', balance: 850000, parentCode: '1000' },
        { code: '1101', name: 'الصندوق الرئيسي (Cash)', type: 'أصول', nature: 'مدين', balance: 154200, parentCode: '1100' },
        { code: '1102', name: 'بنك الراجحي - الحساب التشغيلي', type: 'أصول', nature: 'مدين', balance: 420500, parentCode: '1100' },
        { code: '1200', name: 'الأصول الثابتة', type: 'أصول', nature: 'مدين', balance: 980000, parentCode: '1000' },
      ],
    },
    {
      code: '2000',
      name: 'الخصوم والالتزامات (Liabilities)',
      type: 'خصوم',
      nature: 'دائن',
      balance: 407575,
      children: [
        { code: '2101', name: 'مستحقات الموردين والوكلاء', type: 'خصوم', nature: 'دائن', balance: 189375, parentCode: '2000' },
        { code: '2103', name: 'أمانات ضريبة القيمة المضافة (ZATCA 15%)', type: 'خصوم', nature: 'دائن', balance: 124000, parentCode: '2000' },
      ],
    },
    {
      code: '3000',
      name: 'حقوق الملكية (Equity)',
      type: 'حقوق ملكية',
      nature: 'دائن',
      balance: 1205000,
    },
    {
      code: '4000',
      name: 'الإيرادات (Revenues)',
      type: 'إيرادات',
      nature: 'دائن',
      balance: 525471,
    },
    {
      code: '5000',
      name: 'المصروفات (Expenses)',
      type: 'مصروفات',
      nature: 'مدين',
      balance: 220500,
    },
  ]);

  // Handlers for dynamic Journal Lines
  const handleAddJournalLine = () => {
    setJournalLines(prev => [
      ...prev,
      { accountCode: '', accountName: '', debit: '0', credit: '0', memo: '' },
    ]);
  };

  const handleRemoveJournalLine = (index: number) => {
    if (journalLines.length > 2) {
      setJournalLines(prev => prev.filter((_, i) => i !== index));
    }
  };

  const totalDebit = journalLines.reduce((acc, line) => acc + (parseFloat(line.debit) || 0), 0);
  const totalCredit = journalLines.reduce((acc, line) => acc + (parseFloat(line.credit) || 0), 0);
  const isJournalBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

  // Save Handlers
  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const newAccNode: SmaccAccountNode = {
      code: newAccount.code,
      name: newAccount.name,
      type: newAccount.type,
      nature: newAccount.nature,
      balance: parseFloat(newAccount.openingBalance) || 0,
      parentCode: newAccount.parentCode,
    };
    setChartOfAccounts(prev => [...prev, newAccNode]);
    setIsAccountModalOpen(false);
    alert('تم إضافة الحساب الجديد بنجاح في دليل حسابات SMACC!');
  };

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isJournalBalanced) {
      alert('خطأ: يجب أن يتساوى إجمالي المدين مع إجمالي الدائن لاعتماد القيد!');
      return;
    }
    setIsJournalModalOpen(false);
    alert(`تم حفظ وتوزيع قيد اليومية (${journalHeader.refNo}) بنجاح!`);
  };

  const handleSaveVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVoucherModalOpen(false);
    alert(`تم حفظ وتأكيد سند ${voucherType} رقم (${newVoucher.voucherNo}) بقيمة ${newVoucher.amount} ر.س!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Section Navigation */}
      <div
        className="card-feature-cinematic"
        style={{
          background: '#000000',
          borderRadius: '16px',
          padding: '28px',
          color: '#FFFFFF',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div className="flex items-center gap-3">
          <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>SMACC FINANCIAL SUITE</span>
            </div>
            <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
              قسم المحاسبة المالية الشامل
            </h1>
            <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '4px 0 0 0', fontWeight: 420 }}>
              دليل الحسابات، قيود اليومية، سندات القبض والصرف، ميزان المراجعة، ومراكز التكلفة
            </p>
          </div>
        </div>

        {/* Tab Buttons ordered exactly matching SMACC ERP */}
        <div className="flex flex-wrap items-center bg-white/10 p-1.5 rounded-full border border-white/15 gap-1 text-xs">
          {[
            { id: 'coa', label: '1. دليل الحسابات' },
            { id: 'cost-centers', label: '2. مراكز التكلفة' },
            { id: 'journals', label: '3. قيود اليومية' },
            { id: 'vouchers', label: '4. سندات القبض والصرف' },
            { id: 'ledger', label: '5. كشف حساب تفصيلي' },
            { id: 'trial-balance', label: '6. ميزان المراجعة' },
            { id: 'income-statement', label: '7. قائمة الدخل (P&L)' },
            { id: 'balance-sheet', label: '8. المركز المالي' },
            { id: 'fiscal-closing', label: '9. الإقفال والربط' },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontWeight: isActive ? 550 : 420,
                  background: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? '#000000' : '#d4d4d8',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: Chart of Accounts (دليل الحسابات الشجري) */}
      {activeTab === 'coa' && (
        <div className="space-y-6">
          <div className="card-pricing" style={{ padding: '16px 20px', borderRadius: '16px', background: '#ffffff', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="البحث بالرمز أو اسم الحساب..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="text-input"
                style={{ width: '100%', height: '36px', minHeight: '36px', borderRadius: '9999px', paddingRight: '36px', fontSize: '12px' }}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAccountModalOpen(true)}
                className="button-primary-pill"
                style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
              >
                <Plus className="w-4 h-4 ml-1" />
                <span>+ إضافة حساب جديد</span>
              </button>
              <button className="button-outline-on-light" style={{ fontSize: '12.5px', padding: '6px 16px', minHeight: '38px' }}>
                <FileSpreadsheet className="w-4 h-4 ml-1 text-emerald-600" />
                <span>تصدير دليل الحسابات</span>
              </button>
            </div>
          </div>

          {/* Tree View Table */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-lg">
            <table className="w-full text-right text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-700">
                <tr>
                  <th className="p-3.5">رمز الحساب</th>
                  <th className="p-3.5">اسم الحساب</th>
                  <th className="p-3.5">النوع الرئيسي</th>
                  <th className="p-3.5">طبيعة الحساب</th>
                  <th className="p-3.5">الرصيد الحالي</th>
                  <th className="p-3.5 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {chartOfAccounts.map(node => (
                  <React.Fragment key={node.code}>
                    <tr className="hover:bg-slate-700/40 bg-slate-800/80 font-bold text-white">
                      <td className="p-3.5 font-mono text-blue-400">{node.code}</td>
                      <td className="p-3.5 text-sm">{node.name}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-md text-[11px] bg-blue-600/20 text-blue-300 border border-blue-500/30">
                          {node.type}
                        </span>
                      </td>
                      <td className="p-3.5">{node.nature}</td>
                      <td className="p-3.5 text-emerald-400 font-bold text-sm">{node.balance.toLocaleString()} ر.س</td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => setIsAccountModalOpen(true)}
                          className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-[11px] font-semibold"
                        >
                          + حساب فرعي
                        </button>
                      </td>
                    </tr>

                    {/* Children rows */}
                    {node.children?.map(child => (
                      <tr key={child.code} className="hover:bg-slate-700/30 bg-slate-900/40">
                        <td className="p-3.5 pr-8 font-mono text-slate-400">{child.code}</td>
                        <td className="p-3.5 pr-8 text-slate-200">↳ {child.name}</td>
                        <td className="p-3.5 text-slate-400">{child.type}</td>
                        <td className="p-3.5 text-slate-400">{child.nature}</td>
                        <td className="p-3.5 font-bold text-emerald-400">{child.balance.toLocaleString()} ر.س</td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button className="p-1 hover:text-blue-400 text-slate-400">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: Journal Entries (قيود اليومية) */}
      {activeTab === 'journals' && (
        <div className="space-y-6">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">تصفية القيود:</span>
              <select className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-2">
                <option value="all">جميع القيود المعتمدة والمسودة</option>
                <option value="posted">المعتمدة فقط</option>
                <option value="draft">المسودات</option>
              </select>
            </div>

            <button
              onClick={() => setIsJournalModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة قيد يومية جديد</span>
            </button>
          </div>

          {/* Journal Entries List */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-lg">
            <table className="w-full text-right text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-700">
                <tr>
                  <th className="p-3.5">رقم القيد</th>
                  <th className="p-3.5">تاريخ القيد</th>
                  <th className="p-3.5">البيان / الشرح التفصيلي</th>
                  <th className="p-3.5">الفرع / المركز</th>
                  <th className="p-3.5">إجمالي المبلغ</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                <tr className="hover:bg-slate-700/40">
                  <td className="p-3.5 font-mono text-blue-400 font-bold">JV-2026-401</td>
                  <td className="p-3.5 text-slate-400">2026-08-17</td>
                  <td className="p-3.5 font-semibold text-white">إثبات استلام رسوم عقد استقدام رقم REC-2026-0822 عبر بنك الراجحي</td>
                  <td className="p-3.5">فرع الرياض الرئيسي</td>
                  <td className="p-3.5 font-bold text-emerald-400">14,500.00 ر.س</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      معتمد ومرحل
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold">
                      طباعة القيد
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-700/40">
                  <td className="p-3.5 font-mono text-blue-400 font-bold">JV-2026-400</td>
                  <td className="p-3.5 text-slate-400">2026-08-16</td>
                  <td className="p-3.5 font-semibold text-white">إثبات مصروفات تشغيل عمالة مركز الإيواء ومستلزمات الضيافة</td>
                  <td className="p-3.5">مركز الإيواء</td>
                  <td className="p-3.5 font-bold text-emerald-400">2,133.00 ر.س</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      معتمد ومرحل
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold">
                      طباعة القيد
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: Vouchers (سندات القبض والصرف) */}
      {activeTab === 'vouchers' && (
        <div className="space-y-6">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setVoucherType('قبض'); setIsVoucherModalOpen(true); }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>+ إضافة سند قبض جديد</span>
              </button>
              <button
                onClick={() => { setVoucherType('صرف'); setIsVoucherModalOpen(true); }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>+ إضافة سند صرف جديد</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Receipt Vouchers Box */}
            <div className="bg-slate-800 p-5 rounded-2xl border border-emerald-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
                  <span>سندات القبض النقدية والبنكية</span>
                </h3>
                <span className="text-xs text-emerald-400 font-bold">إجمالي القبض: 42,550.00 ر.س</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-slate-900 rounded-xl text-xs flex justify-between items-center">
                  <div>
                    <span className="font-mono text-emerald-400 font-bold block">قبض #59</span>
                    <span className="text-slate-300 font-semibold">العميل بندر صالح الهويريني</span>
                  </div>
                  <span className="font-extrabold text-white">13,800.00 ر.س</span>
                </div>
              </div>
            </div>

            {/* Payment Vouchers Box */}
            <div className="bg-slate-800 p-5 rounded-2xl border border-rose-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-rose-400" />
                  <span>سندات الصرف والتحويلات</span>
                </h3>
                <span className="text-xs text-rose-400 font-bold">إجمالي الصرف: 18,200.00 ر.س</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-slate-900 rounded-xl text-xs flex justify-between items-center">
                  <div>
                    <span className="font-mono text-rose-400 font-bold block">صرف #12</span>
                    <span className="text-slate-300 font-semibold">مكتب بلاتينيوم مانيلا (تأشيرات)</span>
                  </div>
                  <span className="font-extrabold text-white">5,000.00 ر.س</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: Trial Balance (ميزان المراجعة) */}
      {activeTab === 'trial-balance' && (
        <div className="space-y-6">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span>الفترة من:</span>
              <input type="date" defaultValue="2026-01-01" className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-white" />
              <span>إلى:</span>
              <input type="date" defaultValue="2026-08-18" className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-white" />
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4" />
                <span>تصدير Excel</span>
              </button>
              <button className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <Printer className="w-4 h-4" />
                <span>طباعة PDF</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-lg">
            <table className="w-full text-right text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-700">
                <tr>
                  <th className="p-3">رمز الحساب</th>
                  <th className="p-3">اسم الحساب</th>
                  <th className="p-3">أول المدة مدين</th>
                  <th className="p-3">أول المدة دائن</th>
                  <th className="p-3">الحركة مدين</th>
                  <th className="p-3">الحركة دائن</th>
                  <th className="p-3">الرصيد الصافي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-mono">
                <tr>
                  <td className="p-3 font-bold text-blue-400">1101</td>
                  <td className="p-3 font-sans font-semibold text-white">الصندوق الرئيسي (Cash)</td>
                  <td className="p-3 text-slate-300">150,000</td>
                  <td className="p-3 text-slate-500">0</td>
                  <td className="p-3 text-emerald-400">45,000</td>
                  <td className="p-3 text-amber-400">40,800</td>
                  <td className="p-3 font-extrabold text-white">154,200 ر.س</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-blue-400">1102</td>
                  <td className="p-3 font-sans font-semibold text-white">بنك الراجحي التشغيلي</td>
                  <td className="p-3 text-slate-300">220,000</td>
                  <td className="p-3 text-slate-500">0</td>
                  <td className="p-3 text-emerald-400">110,300</td>
                  <td className="p-3 text-amber-400">55,000</td>
                  <td className="p-3 font-extrabold text-white">275,300 ر.س</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4.5: Account Ledger (كشف حساب تفصيلي) */}
      {activeTab === 'ledger' && (
        <div className="space-y-6">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span>اختر الحساب:</span>
              <select
                value={selectedLedgerAccount}
                onChange={e => setSelectedLedgerAccount(e.target.value)}
                className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-white font-bold"
              >
                <option value="1101">1101 - الصندوق الرئيسي (Cash)</option>
                <option value="1102">1102 - بنك الراجحي التشغيلي</option>
                <option value="4101">4101 - إيرادات وساطة الاستقدام</option>
                <option value="2101">2101 - مستحقات الموردين والوكلاء</option>
              </select>
              <span>من:</span>
              <input type="date" defaultValue="2026-08-01" className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-white" />
              <span>إلى:</span>
              <input type="date" defaultValue="2026-08-18" className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-white" />
            </div>

            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Printer className="w-4 h-4" />
              <span>طباعة كشف الحساب</span>
            </button>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-lg">
            <table className="w-full text-right text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-700">
                <tr>
                  <th className="p-3">التاريخ</th>
                  <th className="p-3">رقم المرجع / السند</th>
                  <th className="p-3">البيان والشرح</th>
                  <th className="p-3">مدين</th>
                  <th className="p-3">دائن</th>
                  <th className="p-3">الرصيد التراكمي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-sans">
                <tr className="hover:bg-slate-700/40">
                  <td className="p-3 text-slate-400 font-mono">2026-08-01</td>
                  <td className="p-3 font-mono text-blue-400 font-bold">OB-2026</td>
                  <td className="p-3 font-semibold text-white">رصيد أول المدة المرحل</td>
                  <td className="p-3 font-mono text-emerald-400 font-bold">150,000.00</td>
                  <td className="p-3 font-mono text-slate-500">0.00</td>
                  <td className="p-3 font-mono font-extrabold text-white">150,000.00 ر.س</td>
                </tr>
                <tr className="hover:bg-slate-700/40">
                  <td className="p-3 text-slate-400 font-mono">2026-08-17</td>
                  <td className="p-3 font-mono text-blue-400 font-bold">JV-2026-401</td>
                  <td className="p-3 font-semibold text-white">تحصيل إيداع عقد استقدام REC-2026-0822</td>
                  <td className="p-3 font-mono text-emerald-400 font-bold">14,500.00</td>
                  <td className="p-3 font-mono text-slate-500">0.00</td>
                  <td className="p-3 font-mono font-extrabold text-emerald-400">164,500.00 ر.س</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 5: Cost Centers (مراكز التكلفة) */}
      {activeTab === 'cost-centers' && (
        <div className="space-y-6">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">دليل مراكز التكلفة التشغيلية</h3>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>إضافة مركز تكلفة جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-2">
              <span className="text-xs text-blue-400 font-mono font-bold">CC-101</span>
              <h4 className="font-bold text-white text-sm">مركز الفرع الرئيسي - الرياض</h4>
              <p className="text-xs text-slate-400">إجمالي المصروفات: 145,000 ر.س</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-2">
              <span className="text-xs text-blue-400 font-mono font-bold">CC-102</span>
              <h4 className="font-bold text-white text-sm">مركز تشغيل الإيواء والضيافة</h4>
              <p className="text-xs text-slate-400">إجمالي المصروفات: 90,000 ر.س</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: Income Statement (قائمة الدخل والأرباح والخسائر) */}
      {activeTab === 'income-statement' && (
        <div className="space-y-6">
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white text-base">قائمة الدخل والأرباح والخسائر (Profit & Loss Statement)</h3>
              <p className="text-xs text-slate-400">السنة المالية الفعالة 2026</p>
            </div>
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Printer className="w-4 h-4" />
              <span>طباعة القائمة المعتمدة</span>
            </button>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-4 shadow-lg">
            <div className="border-b border-slate-700 pb-3 flex justify-between items-center text-sm font-bold text-emerald-400">
              <span>إجمالي الإيرادات المحققة (عقود استقدام وتأجير)</span>
              <span>525,471.20 ر.س</span>
            </div>
            <div className="border-b border-slate-700 pb-3 flex justify-between items-center text-sm font-bold text-rose-400">
              <span>خصم: تكلفة المبيعات ومصروفات التشغيل</span>
              <span>(220,500.00 ر.س)</span>
            </div>
            <div className="pt-2 flex justify-between items-center text-base font-extrabold text-white bg-slate-900 p-4 rounded-xl border border-blue-500/40">
              <span>صافي الربح التشغيلي قبل الزكاة:</span>
              <span className="text-emerald-400">304,971.20 ر.س</span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 8: Balance Sheet (قائمة المركز المالي والميزانية العمومية) */}
      {activeTab === 'balance-sheet' && (
        <div className="space-y-6">
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white text-base">قائمة المركز المالي والميزانية العمومية (Balance Sheet)</h3>
              <p className="text-xs text-slate-400">كما هي في 18 أغسطس 2026</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Printer className="w-4 h-4" />
              <span>تصدير الميزانية</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3">
              <h4 className="font-bold text-blue-400 text-sm border-b border-slate-700 pb-2">الأصول (Assets)</h4>
              <div className="flex justify-between text-xs text-slate-300">
                <span>الأصول المتداولة (النقدية والبنوك والأمانات)</span>
                <span className="font-mono font-bold">850,000.00 ر.س</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>الأصول الثابتة (صافي القيمة الدفترية)</span>
                <span className="font-mono font-bold">980,000.00 ر.س</span>
              </div>
              <div className="pt-3 border-t border-slate-700 flex justify-between text-sm font-extrabold text-white">
                <span>إجمالي الأصول:</span>
                <span className="text-blue-400">1,830,000.00 ر.س</span>
              </div>
            </div>

            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3">
              <h4 className="font-bold text-amber-400 text-sm border-b border-slate-700 pb-2">الخصوم وحقوق الملكية (Liabilities & Equity)</h4>
              <div className="flex justify-between text-xs text-slate-300">
                <span>الخصوم والالتزامات المتداولة (الموردين والضريبة)</span>
                <span className="font-mono font-bold">407,575.00 ر.س</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>رأس المال المدفوع الأسباب</span>
                <span className="font-mono font-bold">1,205,000.00 ر.س</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>الأرباح المبقاة والمرحلة</span>
                <span className="font-mono font-bold">217,425.00 ر.س</span>
              </div>
              <div className="pt-3 border-t border-slate-700 flex justify-between text-sm font-extrabold text-white">
                <span>إجمالي الخصوم وحقوق الملكية:</span>
                <span className="text-amber-400">1,830,000.00 ر.س</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 9: Fiscal Closing (إقفال السنة والربط المالي) */}
      {activeTab === 'fiscal-closing' && (
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500/20 rounded-xl text-rose-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">إقفال الفترات المالية وتدوير الأرصدة</h3>
              <p className="text-xs text-slate-400">ترحيل الأرباح والخسائر وتوليد الأرصدة الافتتاحية للسنة القادمة</p>
            </div>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl text-xs space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">حالة السنة المالية 2026:</span>
              <span className="text-emerald-400 font-bold">مفتوحة للعمليات والقيود اليومية</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">تاريخ آخر إقفال شهري:</span>
              <span className="text-slate-400 font-mono">2026-07-31</span>
            </div>
          </div>

          <button
            onClick={() => alert('تم التحقق من توازن جميع حسابات الإيرادات والمصروفات وجاهزية تدوير السنة!')}
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg"
          >
            بدء إجراءات الإقفال السنوي
          </button>
        </div>
      )}

      {/* MODAL 1: Add New Account Modal */}
      <SmaccFormModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        title="إضافة حساب جديد في دليل SMACC"
        subtitle="حدد الرمز، الاسم، والحساب الأب وطبيعة الحساب"
        onSubmit={handleSaveAccount}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">رمز الحساب (Account Code)</label>
            <input
              type="text"
              required
              placeholder="مثال: 1105"
              value={newAccount.code}
              onChange={e => setNewAccount({ ...newAccount, code: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">اسم الحساب الكامل</label>
            <input
              type="text"
              required
              placeholder="مثال: عُهد الموظفين النقدية"
              value={newAccount.name}
              onChange={e => setNewAccount({ ...newAccount, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">النوع الرئيسي</label>
            <select
              value={newAccount.type}
              onChange={e => setNewAccount({ ...newAccount, type: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="أصول">أصول (Assets)</option>
              <option value="خصوم">خصوم (Liabilities)</option>
              <option value="حقوق ملكية">حقوق ملكية (Equity)</option>
              <option value="إيرادات">إيرادات (Revenues)</option>
              <option value="مصروفات">مصروفات (Expenses)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">طبيعة الحساب</label>
            <select
              value={newAccount.nature}
              onChange={e => setNewAccount({ ...newAccount, nature: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="مدين">مدين (Debit)</option>
              <option value="دائن">دائن (Credit)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">الرصيد الافتتاحي (ر.س)</label>
            <input
              type="number"
              value={newAccount.openingBalance}
              onChange={e => setNewAccount({ ...newAccount, openingBalance: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </SmaccFormModal>

      {/* MODAL 2: Add Journal Entry Modal */}
      <SmaccFormModal
        isOpen={isJournalModalOpen}
        onClose={() => setIsJournalModalOpen(false)}
        title="إضافة قيد يومية جديد (Journal Entry)"
        subtitle="أدخل تفاصيل الحسابات والمدين والدائن للحفاظ على توازن القيد"
        size="xl"
        onSubmit={handleSaveJournal}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-300 block mb-1 font-semibold">رقم المرجع (Ref No)</label>
              <input
                type="text"
                value={journalHeader.refNo}
                onChange={e => setJournalHeader({ ...journalHeader, refNo: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1 font-semibold">التاريخ</label>
              <input
                type="date"
                value={journalHeader.date}
                onChange={e => setJournalHeader({ ...journalHeader, date: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1 font-semibold">الفرع الرئيسي</label>
              <input
                type="text"
                value={journalHeader.branch}
                onChange={e => setJournalHeader({ ...journalHeader, branch: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">البيان الشامل للقيد</label>
            <input
              type="text"
              placeholder="شرح وتفاصيل القيد المحاسبي..."
              value={journalHeader.description}
              onChange={e => setJournalHeader({ ...journalHeader, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500"
            />
          </div>

          {/* Lines Table */}
          <div className="border border-slate-700 rounded-xl overflow-hidden">
            <table className="w-full text-right text-xs text-slate-200">
              <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-700">
                <tr>
                  <th className="p-2.5">رمز الحساب</th>
                  <th className="p-2.5">اسم الحساب</th>
                  <th className="p-2.5">مدين (Debit)</th>
                  <th className="p-2.5">دائن (Credit)</th>
                  <th className="p-2.5">ملاحظات / البيان</th>
                  <th className="p-2.5 text-center">حذف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {journalLines.map((line, idx) => (
                  <tr key={idx}>
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="1101"
                        value={line.accountCode}
                        onChange={e => {
                          const val = e.target.value;
                          setJournalLines(prev => prev.map((l, i) => i === idx ? { ...l, accountCode: val } : l));
                        }}
                        className="w-24 bg-slate-900 border border-slate-700 rounded-lg p-1 text-xs font-mono text-blue-400"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="الصندوق الرئيسي"
                        value={line.accountName}
                        onChange={e => {
                          const val = e.target.value;
                          setJournalLines(prev => prev.map((l, i) => i === idx ? { ...l, accountName: val } : l));
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1 text-xs text-white"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={line.debit}
                        onChange={e => {
                          const val = e.target.value;
                          setJournalLines(prev => prev.map((l, i) => i === idx ? { ...l, debit: val } : l));
                        }}
                        className="w-28 bg-slate-900 border border-slate-700 rounded-lg p-1 text-xs text-emerald-400 font-bold"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={line.credit}
                        onChange={e => {
                          const val = e.target.value;
                          setJournalLines(prev => prev.map((l, i) => i === idx ? { ...l, credit: val } : l));
                        }}
                        className="w-28 bg-slate-900 border border-slate-700 rounded-lg p-1 text-xs text-rose-400 font-bold"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="ملاحظات..."
                        value={line.memo}
                        onChange={e => {
                          const val = e.target.value;
                          setJournalLines(prev => prev.map((l, i) => i === idx ? { ...l, memo: val } : l));
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1 text-xs text-slate-300"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveJournalLine(idx)}
                        className="text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
              <button
                type="button"
                onClick={handleAddJournalLine}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-lg text-xs font-bold flex items-center gap-1"
              >
                + إضافة سطر محاسبي جديد
              </button>

              <div className="flex items-center gap-4 text-xs font-bold">
                <span>إجمالي المدين: <strong className="text-emerald-400">{totalDebit.toFixed(2)} ر.س</strong></span>
                <span>إجمالي الدائن: <strong className="text-rose-400">{totalCredit.toFixed(2)} ر.س</strong></span>
                <span className={`px-2.5 py-1 rounded-full ${isJournalBalanced ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>
                  {isJournalBalanced ? '✓ القيد متوازن' : '✕ غير متوازن'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </SmaccFormModal>

      {/* MODAL 3: Add Voucher Modal (سند قبض / صرف) */}
      <SmaccFormModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        title={`إضافة سند ${voucherType} جديد`}
        subtitle="أدخل تفاصيل المبلغ والجهة والضريبة"
        onSubmit={handleSaveVoucher}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">رقم السند</label>
            <input
              type="text"
              value={newVoucher.voucherNo}
              onChange={e => setNewVoucher({ ...newVoucher, voucherNo: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">تاريخ السند</label>
            <input
              type="date"
              value={newVoucher.date}
              onChange={e => setNewVoucher({ ...newVoucher, date: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">{voucherType === 'قبض' ? 'اسم المستلم منه (العميل/الجهة)' : 'اسم المستفيد (المورد/الجهة)'}</label>
            <input
              type="text"
              required
              placeholder="اسم الشخص أو الشركة..."
              value={newVoucher.payeeName}
              onChange={e => setNewVoucher({ ...newVoucher, payeeName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">الصندوق / الحساب البنكي</label>
            <select
              value={newVoucher.treasury}
              onChange={e => setNewVoucher({ ...newVoucher, treasury: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
            >
              <option value="بنك الراجحي الرئيسي">بنك الراجحي الرئيسي</option>
              <option value="بنك الرياض - حساب الاستقدام">بنك الرياض - حساب الاستقدام</option>
              <option value="الصندوق الرئيسي (نقدي)">الصندوق الرئيسي (نقدي)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">المبلغ (ر.س)</label>
            <input
              type="number"
              required
              placeholder="0.00"
              value={newVoucher.amount}
              onChange={e => setNewVoucher({ ...newVoucher, amount: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white font-bold text-emerald-400"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">مركز التكلفة</label>
            <select
              value={newVoucher.costCenter}
              onChange={e => setNewVoucher({ ...newVoucher, costCenter: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
            >
              <option value="مركز الرياض التشغيلي">مركز الرياض التشغيلي</option>
              <option value="مركز الإيواء والضيافة">مركز الإيواء والضيافة</option>
            </select>
          </div>
        </div>
      </SmaccFormModal>
    </div>
  );
};
