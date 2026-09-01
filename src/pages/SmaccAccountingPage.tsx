import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Search,
  FileSpreadsheet,
  Printer,
  Trash2,
  Edit2,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
} from 'lucide-react';
import { SmaccFormModal } from '../components/smacc/SmaccFormModal';
import { useAppStore } from '../stores/appStore';
import { exportData } from '../services/exportService';

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
  const { addNotification } = useAppStore();
  const [activeTab, setActiveTab] = useState<'coa' | 'cost-centers' | 'journals' | 'vouchers' | 'ledger' | 'trial-balance' | 'income-statement' | 'balance-sheet' | 'fiscal-closing'>('coa');
  const [selectedLedgerAccount, setSelectedLedgerAccount] = useState('1101');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucherType, setVoucherType] = useState<'قبض' | 'صرف'>('قبض');

  // New Account Form State
  const [newAccount, setNewAccount] = useState<{
    code: string;
    name: string;
    type: 'أصول' | 'خصوم' | 'حقوق ملكية' | 'إيرادات' | 'مصروفات';
    nature: 'مدين' | 'دائن';
    parentCode: string;
    openingBalance: string;
  }>({
    code: '',
    name: '',
    type: 'أصول',
    nature: 'مدين',
    parentCode: '1100',
    openingBalance: '0',
  });

  // New Voucher Form State
  const [newVoucher, setNewVoucher] = useState({
    voucherNo: 'VOU-2026-089',
    date: '2026-08-18',
    accountCode: '1101',
    amount: '15000',
    payeeOrPayer: 'شركة دار الرواد للتشغيل',
    payeeName: 'شركة دار الرواد للتشغيل',
    treasury: 'بنك الراجحي الرئيسي',
    costCenter: 'CC-01',
    notes: 'تحصيل دفعة عقد استقدام وإيداع في الصندوق',
  });

  // New Journal Entry Form State
  const [journalHeader, setJournalHeader] = useState({
    refNo: 'JV-2026-402',
    date: '2026-08-18',
    branch: 'الفرع الرئيسي - الرياض',
    description: 'إثبات مصروفات صيانة وسكن مركز الإيواء لشهر أغسطس',
    notes: 'إثبات مصروفات صيانة وسكن مركز الإيواء لشهر أغسطس',
  });

  const [journalLines, setJournalLines] = useState([
    { accountCode: '5101', accountName: 'مصروفات تشغيل ومراكز إيواء', debit: '8500', credit: '0', memo: 'صيانة دورية للمركز', costCenter: 'CC-03' },
    { accountCode: '1101', accountName: 'الصندوق الرئيسي (Cash)', debit: '0', credit: '8500', memo: 'صرف نقدي من الخزينة', costCenter: 'CC-01' },
  ]);

  // Initial Mock Chart of Accounts Tree
  const [chartOfAccounts, setChartOfAccounts] = useState<SmaccAccountNode[]>([
    { code: '1', name: 'الأصول (Assets)', type: 'أصول', nature: 'مدين', balance: 1882500, children: [
      { code: '11', name: 'الأصول المتداولة', type: 'أصول', nature: 'مدين', balance: 1000000, parentCode: '1', children: [
        { code: '1101', name: 'الصندوق الرئيسي (Cash)', type: 'أصول', nature: 'مدين', balance: 154200, parentCode: '11' },
        { code: '1102', name: 'بنك الراجحي التشغيلي', type: 'أصول', nature: 'مدين', balance: 275300, parentCode: '11' },
        { code: '1103', name: 'أمانات مساند المعلقة (90 يوماً)', type: 'أصول', nature: 'مدين', balance: 184500, parentCode: '11' },
        { code: '1104', name: 'المدينون - عملاء العقود', type: 'أصول', nature: 'مدين', balance: 386000, parentCode: '11' },
      ]},
      { code: '12', name: 'الأصول الثابتة (Fixed Assets)', type: 'أصول', nature: 'مدين', balance: 882500, parentCode: '1' }
    ]},
    { code: '2', name: 'الخصوم (Liabilities)', type: 'خصوم', nature: 'دائن', balance: 407575, children: [
      { code: '2101', name: 'مستحقات الموردين والوكلاء الخارجيين', type: 'خصوم', nature: 'دائن', balance: 189375, parentCode: '2' },
      { code: '2102', name: 'مخصص مكافأة نهاية الخدمة (EOSB)', type: 'خصوم', nature: 'دائن', balance: 94200, parentCode: '2' },
      { code: '2103', name: 'أمانات ضريبة القيمة المضافة (ZATCA 15%)', type: 'خصوم', nature: 'دائن', balance: 124000, parentCode: '2' },
    ]},
    { code: '3', name: 'حقوق الملكية (Equity)', type: 'حقوق ملكية', nature: 'دائن', balance: 1205000, children: [
      { code: '3101', name: 'رأس المال المدفوع', type: 'حقوق ملكية', nature: 'دائن', balance: 1205000, parentCode: '3' }
    ]},
    { code: '4', name: 'الإيرادات (Revenue)', type: 'إيرادات', nature: 'دائن', balance: 525471.2, children: [
      { code: '4101', name: 'إيرادات وساطة عقود الاستقدام', type: 'إيرادات', nature: 'دائن', balance: 410000, parentCode: '4' },
      { code: '4102', name: 'إيرادات عقود التأجير والتشغيل', type: 'إيرادات', nature: 'دائن', balance: 115471.2, parentCode: '4' },
    ]},
    { code: '5', name: 'المصروفات (Expenses)', type: 'مصروفات', nature: 'مدين', balance: 220500, children: [
      { code: '5101', name: 'مصروفات تشغيل ومراكز إيواء', type: 'مصروفات', nature: 'مدين', balance: 90000, parentCode: '5' },
      { code: '5102', name: 'رواتب وأجور الكوادر الإدارية', type: 'مصروفات', nature: 'مدين', balance: 130500, parentCode: '5' },
    ]},
  ]);

  // Handlers for dynamic Journal Lines
  const handleAddJournalLine = () => {
    setJournalLines(prev => [...prev, { accountCode: '1101', accountName: 'الصندوق الرئيسي (Cash)', debit: '0', credit: '0', memo: '', costCenter: 'CC-01' }]);
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
    if (!newAccount.code || !newAccount.name) {
      addNotification({
        title: 'تنبيه إدخال',
        message: 'يرجى كتابة رمز واسم الحساب.',
        type: 'warning',
      });
      return;
    }
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
    addNotification({
      title: 'إضافة حساب جديد',
      message: `تم إضافة الحساب (${newAccount.name} - #${newAccount.code}) بنجاح في دليل حسابات SMACC.`,
      type: 'success',
    });
  };

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isJournalBalanced) {
      addNotification({
        title: 'خطأ في توازن القيد',
        message: `يجب أن يتساوى إجمالي المدين (${totalDebit} ر.س) مع إجمالي الدائن (${totalCredit} ر.س) لاعتماد القيد.`,
        type: 'error',
      });
      return;
    }
    setIsJournalModalOpen(false);
    addNotification({
      title: 'حفظ قيد اليومية',
      message: `تم حفظ وترحيل قيد اليومية (${journalHeader.refNo}) بإجمالي متوازن ${totalDebit.toLocaleString()} ر.س بنجاح.`,
      type: 'success',
    });
  };

  const handleSaveVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVoucherModalOpen(false);
    addNotification({
      title: `حفظ وتأكيد سند ${voucherType}`,
      message: `تم حفظ وتأكيد سند ${voucherType} رقم (${newVoucher.voucherNo}) بقيمة ${newVoucher.amount} ر.س وترحيله للحسابات.`,
      type: 'success',
    });
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
              <Search className="w-4 h-4 absolute right-3 top-3 text-zinc-400" />
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
              <button
                onClick={() => {
                  const flattened = chartOfAccounts.flatMap(parent => [
                    { 'رمز الحساب': parent.code, 'اسم الحساب': parent.name, 'النوع': parent.type, 'الطبيعة': parent.nature, 'الرصيد': parent.balance },
                    ...(parent.children || []).map(c => ({ 'رمز الحساب': c.code, 'اسم الحساب': `  ↳ ${c.name}`, 'النوع': c.type, 'الطبيعة': c.nature, 'الرصيد': c.balance }))
                  ]);
                  exportData(flattened, 'دليل_الحسابات_المحاسبي_سماك', 'excel');
                  addNotification({ title: 'تصدير دليل الحسابات', message: 'تم تصدير شجرة الحسابات بنجاح إلى ملف Excel.', type: 'success' });
                }}
                className="button-outline-on-light"
                style={{ fontSize: '12.5px', padding: '6px 16px', minHeight: '38px' }}
              >
                <FileSpreadsheet className="w-4 h-4 ml-1 text-champagne-dark" />
                <span>تصدير دليل الحسابات</span>
              </button>
            </div>
          </div>

          {/* Tree View Table */}
          <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3.5">رمز الحساب</th>
                  <th className="p-3.5">اسم الحساب</th>
                  <th className="p-3.5">النوع الرئيسي</th>
                  <th className="p-3.5">طبيعة الحساب</th>
                  <th className="p-3.5">الرصيد الحالي</th>
                  <th className="p-3.5 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {chartOfAccounts.map(node => (
                  <React.Fragment key={node.code}>
                    <tr className="hover:bg-zinc-50 bg-zinc-50/50 font-bold text-black">
                      <td className="p-3.5 font-mono text-black">{node.code}</td>
                      <td className="p-3.5 text-sm">{node.name}</td>
                      <td className="p-3.5">
                        <span className="pill-tag-shade" style={{ fontSize: '10.5px', padding: '2px 8px' }}>
                          {node.type}
                        </span>
                      </td>
                      <td className="p-3.5">{node.nature}</td>
                      <td className="p-3.5 text-champagne-dark font-bold text-sm">{node.balance.toLocaleString()} ر.س</td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => setIsAccountModalOpen(true)}
                          className="button-outline-on-light"
                          style={{ padding: '3px 10px', fontSize: '11px', minHeight: '28px' }}
                        >
                          + حساب فرعي
                        </button>
                      </td>
                    </tr>

                    {/* Children rows */}
                    {node.children?.map(child => (
                      <tr key={child.code} className="hover:bg-zinc-50 bg-white">
                        <td className="p-3.5 pr-8 font-mono text-zinc-500">{child.code}</td>
                        <td className="p-3.5 pr-8 text-black">↳ {child.name}</td>
                        <td className="p-3.5 text-zinc-600">{child.type}</td>
                        <td className="p-3.5 text-zinc-600">{child.nature}</td>
                        <td className="p-3.5 font-bold text-champagne-dark">{child.balance.toLocaleString()} ر.س</td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                setNewAccount({
                                  code: child.code,
                                  name: child.name,
                                  type: child.type,
                                  nature: child.nature,
                                  parentCode: child.parentCode || node.code,
                                  openingBalance: String(child.balance),
                                });
                                setIsAccountModalOpen(true);
                              }}
                              className="p-1 hover:text-black text-zinc-400"
                            >
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
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 font-medium">تصفية القيود:</span>
              <select className="bg-zinc-50 border border-zinc-200 text-xs text-black rounded-full px-3 py-1.5 outline-none">
                <option value="all">جميع القيود المعتمدة والمسودة</option>
                <option value="posted">المعتمدة فقط</option>
                <option value="draft">المسودات</option>
              </select>
            </div>

            <button
              onClick={() => setIsJournalModalOpen(true)}
              className="button-primary-pill"
              style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
            >
              <Plus className="w-4 h-4 ml-1" />
              <span>إضافة قيد يومية جديد</span>
            </button>
          </div>

          {/* Journal Entries List */}
          <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
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
              <tbody className="divide-y divide-zinc-100">
                <tr className="hover:bg-zinc-50">
                  <td className="p-3.5 font-mono text-black font-bold">JV-2026-401</td>
                  <td className="p-3.5 text-zinc-500">2026-08-17</td>
                  <td className="p-3.5 font-semibold text-black">إثبات استلام رسوم عقد استقدام رقم REC-2026-0822 عبر بنك الراجحي</td>
                  <td className="p-3.5">فرع الرياض الرئيسي</td>
                  <td className="p-3.5 font-bold text-black">14,500.00 ر.س</td>
                  <td className="p-3.5">
                    <span className="pill-tag-mint" style={{ fontSize: '10.5px' }}>
                      معتمد ومرحل
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => {
                        window.print();
                        addNotification({ title: 'طباعة قيد اليومية', message: 'تم إرسال نموذج القيد JV-2026-401 للطباعة بنجاح.', type: 'info' });
                      }}
                      className="button-outline-on-light"
                      style={{ padding: '3px 12px', fontSize: '11px', minHeight: '28px' }}
                    >
                      طباعة القيد
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50">
                  <td className="p-3.5 font-mono text-black font-bold">JV-2026-400</td>
                  <td className="p-3.5 text-zinc-500">2026-08-16</td>
                  <td className="p-3.5 font-semibold text-black">إثبات مصروفات تشغيل عمالة مركز الإيواء ومستلزمات الضيافة</td>
                  <td className="p-3.5">مركز الإيواء</td>
                  <td className="p-3.5 font-bold text-black">2,133.00 ر.س</td>
                  <td className="p-3.5">
                    <span className="pill-tag-mint" style={{ fontSize: '10.5px' }}>
                      معتمد ومرحل
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => {
                        window.print();
                        addNotification({ title: 'طباعة قيد اليومية', message: 'تم إرسال نموذج القيد JV-2026-400 للطباعة بنجاح.', type: 'info' });
                      }}
                      className="button-outline-on-light"
                      style={{ padding: '3px 12px', fontSize: '11px', minHeight: '28px' }}
                    >
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
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setVoucherType('قبض'); setIsVoucherModalOpen(true); }}
                className="button-primary-pill"
                style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
              >
                <ArrowDownLeft className="w-4 h-4 ml-1" />
                <span>+ إضافة سند قبض جديد</span>
              </button>
              <button
                onClick={() => { setVoucherType('صرف'); setIsVoucherModalOpen(true); }}
                className="button-outline-on-light"
                style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
              >
                <ArrowUpRight className="w-4 h-4 ml-1" />
                <span>+ إضافة سند صرف جديد</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Receipt Vouchers Box */}
            <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h3 className="font-bold text-black text-sm flex items-center gap-2">
                  <ArrowDownLeft className="w-5 h-5 text-champagne-dark" />
                  <span>سندات القبض النقدية والبنكية</span>
                </h3>
                <span className="pill-tag-mint" style={{ fontSize: '11px' }}>إجمالي القبض: 42,550.00 ر.س</span>
              </div>
              <div className="space-y-2 mt-3">
                <div className="p-3 bg-zinc-50 rounded-2xl text-xs flex justify-between items-center border border-zinc-100">
                  <div>
                    <span className="font-mono text-black font-bold block">قبض #59</span>
                    <span className="text-zinc-600 font-semibold">العميل بندر صالح الهويريني</span>
                  </div>
                  <span className="font-extrabold text-black font-mono">13,800.00 ر.س</span>
                </div>
              </div>
            </div>

            {/* Payment Vouchers Box */}
            <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h3 className="font-bold text-black text-sm flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-rose-600" />
                  <span>سندات الصرف والتحويلات</span>
                </h3>
                <span className="pill-tag-shade" style={{ fontSize: '11px' }}>إجمالي الصرف: 18,200.00 ر.س</span>
              </div>
              <div className="space-y-2 mt-3">
                <div className="p-3 bg-zinc-50 rounded-2xl text-xs flex justify-between items-center border border-zinc-100">
                  <div>
                    <span className="font-mono text-rose-600 font-bold block">صرف #12</span>
                    <span className="text-zinc-600 font-semibold">مكتب بلاتينيوم مانيلا (تأشيرات)</span>
                  </div>
                  <span className="font-extrabold text-black font-mono">5,000.00 ر.س</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: Trial Balance (ميزان المراجعة) */}
      {activeTab === 'trial-balance' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-zinc-700">
              <span>الفترة من:</span>
              <input type="date" defaultValue="2026-01-01" className="bg-zinc-50 border border-zinc-200 px-2.5 py-1.5 rounded-full text-black" />
              <span>إلى:</span>
              <input type="date" defaultValue="2026-08-18" className="bg-zinc-50 border border-zinc-200 px-2.5 py-1.5 rounded-full text-black" />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  exportData([
                    { 'رمز الحساب': '1101', 'اسم الحساب': 'الصندوق الرئيسي (Cash)', 'أول المدة مدين': 150000, 'أول المدة دائن': 0, 'الحركة مدين': 45000, 'الحركة دائن': 40800, 'الرصيد الصافي': 154200 },
                    { 'رمز الحساب': '1102', 'اسم الحساب': 'بنك الراجحي التشغيلي', 'أول المدة مدين': 220000, 'أول المدة دائن': 0, 'الحركة مدين': 110300, 'الحركة دائن': 55000, 'الرصيد الصافي': 275300 }
                  ], 'ميزان_المراجعة_المحاسبي', 'excel');
                  addNotification({ title: 'تصدير ميزان المراجعة', message: 'تم تصدير ميزان المراجعة بصيغة Excel.', type: 'success' });
                }}
                className="button-outline-on-light"
                style={{ padding: '6px 14px', fontSize: '12px', minHeight: '34px' }}
              >
                <FileSpreadsheet className="w-4 h-4 ml-1 text-champagne-dark" />
                <span>تصدير Excel</span>
              </button>
              <button
                onClick={() => {
                  window.print();
                  addNotification({ title: 'طباعة ميزان المراجعة', message: 'جاري إعداد تقرير ميزان المراجعة بصيغة PDF.', type: 'info' });
                }}
                className="button-outline-on-light"
                style={{ padding: '6px 14px', fontSize: '12px', minHeight: '34px' }}
              >
                <Printer className="w-4 h-4 ml-1 text-rose-600" />
                <span>طباعة PDF</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
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
              <tbody className="divide-y divide-zinc-100 font-mono">
                <tr>
                  <td className="p-3 font-bold text-black">1101</td>
                  <td className="p-3 font-sans font-semibold text-black">الصندوق الرئيسي (Cash)</td>
                  <td className="p-3 text-zinc-600">150,000</td>
                  <td className="p-3 text-zinc-400">0</td>
                  <td className="p-3 text-champagne-dark font-bold">45,000</td>
                  <td className="p-3 text-zinc-700">40,800</td>
                  <td className="p-3 font-bold text-black">154,200 ر.س</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-black">1102</td>
                  <td className="p-3 font-sans font-semibold text-black">بنك الراجحي التشغيلي</td>
                  <td className="p-3 text-zinc-600">220,000</td>
                  <td className="p-3 text-zinc-400">0</td>
                  <td className="p-3 text-champagne-dark font-bold">110,300</td>
                  <td className="p-3 text-zinc-700">55,000</td>
                  <td className="p-3 font-bold text-black">275,300 ر.س</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4.5: Account Ledger (كشف حساب تفصيلي) */}
      {activeTab === 'ledger' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-700">
              <span>اختر الحساب:</span>
              <select
                value={selectedLedgerAccount}
                onChange={e => setSelectedLedgerAccount(e.target.value)}
                className="bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-full text-black font-bold outline-none"
              >
                <option value="1101">1101 - الصندوق الرئيسي (Cash)</option>
                <option value="1102">1102 - بنك الراجحي التشغيلي</option>
                <option value="4101">4101 - إيرادات وساطة الاستقدام</option>
                <option value="2101">2101 - مستحقات الموردين والوكلاء</option>
              </select>
              <span>من:</span>
              <input type="date" defaultValue="2026-08-01" className="bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-full text-black" />
              <span>إلى:</span>
              <input type="date" defaultValue="2026-08-18" className="bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-full text-black" />
            </div>

            <button
              onClick={() => {
                window.print();
                addNotification({ title: 'طباعة كشف الحساب', message: `تم إعداد كشف الحساب التفصيلي (${selectedLedgerAccount}) للطباعة.`, type: 'info' });
              }}
              className="button-primary-pill"
              style={{ padding: '6px 16px', fontSize: '12px', minHeight: '34px' }}
            >
              <Printer className="w-4 h-4 ml-1" />
              <span>طباعة كشف الحساب</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3">التاريخ</th>
                  <th className="p-3">رقم المرجع / السند</th>
                  <th className="p-3">البيان والشرح</th>
                  <th className="p-3">مدين</th>
                  <th className="p-3">دائن</th>
                  <th className="p-3">الرصيد التراكمي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-sans">
                <tr className="hover:bg-zinc-50">
                  <td className="p-3 text-zinc-500 font-mono">2026-08-01</td>
                  <td className="p-3 font-mono text-black font-bold">OB-2026</td>
                  <td className="p-3 font-semibold text-black">رصيد أول المدة المرحل</td>
                  <td className="p-3 font-mono text-champagne-dark font-bold">150,000.00</td>
                  <td className="p-3 font-mono text-zinc-400">0.00</td>
                  <td className="p-3 font-mono font-bold text-black">150,000.00 ر.س</td>
                </tr>
                <tr className="hover:bg-zinc-50">
                  <td className="p-3 text-zinc-500 font-mono">2026-08-17</td>
                  <td className="p-3 font-mono text-black font-bold">JV-2026-401</td>
                  <td className="p-3 font-semibold text-black">تحصيل إيداع عقد استقدام REC-2026-0822</td>
                  <td className="p-3 font-mono text-champagne-dark font-bold">14,500.00</td>
                  <td className="p-3 font-mono text-zinc-400">0.00</td>
                  <td className="p-3 font-mono font-bold text-champagne-dark">164,500.00 ر.س</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 5: Cost Centers (مراكز التكلفة) */}
      {activeTab === 'cost-centers' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 flex items-center justify-between">
            <h3 className="font-bold text-black text-sm">دليل مراكز التكلفة التشغيلية</h3>
            <button
              onClick={() => {
                addNotification({ title: 'إضافة مركز تكلفة', message: 'تم فتح نموذج تسجيل مركز تكلفة تشغيلي جديد.', type: 'info' });
              }}
              className="button-primary-pill"
              style={{ padding: '6px 16px', fontSize: '12px', minHeight: '34px' }}
            >
              <Plus className="w-4 h-4 ml-1" />
              <span>إضافة مركز تكلفة جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
              <span className="pill-tag-shade" style={{ fontSize: '10.5px' }}>CC-101</span>
              <h4 className="font-bold text-black text-sm mt-2">مركز الفرع الرئيسي - الرياض</h4>
              <p className="text-xs text-zinc-500 mt-1">إجمالي المصروفات: 145,000 ر.س</p>
            </div>
            <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
              <span className="pill-tag-shade" style={{ fontSize: '10.5px' }}>CC-102</span>
              <h4 className="font-bold text-black text-sm mt-2">مركز تشغيل الإيواء والضيافة</h4>
              <p className="text-xs text-zinc-500 mt-1">إجمالي المصروفات: 90,000 ر.س</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: Income Statement (قائمة الدخل والأرباح والخسائر) */}
      {activeTab === 'income-statement' && (
        <div className="space-y-6">
          <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 className="font-bold text-black text-base">قائمة الدخل والأرباح والخسائر (Profit & Loss Statement)</h3>
              <p className="text-xs text-zinc-500">السنة المالية الفعالة 2026</p>
            </div>
            <button
              onClick={() => {
                exportData([
                  { 'البند': 'إجمالي الإيرادات المحققة', 'القيمة': 525471.20 },
                  { 'البند': 'تكلفة المبيعات ومصروفات التشغيل', 'القيمة': -220500.00 },
                  { 'البند': 'صافي الربح التشغيلي قبل الزكاة', 'القيمة': 304971.20 }
                ], 'قائمة_الدخل_والأرباح_والخسائر', 'excel');
                addNotification({ title: 'تصدير قائمة الدخل', message: 'تم تصدير قائمة الدخل والأرباح والخسائر بنجاح.', type: 'success' });
              }}
              className="button-primary-pill"
              style={{ padding: '6px 18px', fontSize: '12px', minHeight: '36px' }}
            >
              <Printer className="w-4 h-4 ml-1" />
              <span>طباعة القائمة المعتمدة</span>
            </button>
          </div>

          <div className="card-pricing" style={{ padding: '24px', borderRadius: '24px', background: '#ffffff' }}>
            <div className="border-b border-zinc-100 pb-3 flex justify-between items-center text-sm font-bold text-champagne-dark">
              <span>إجمالي الإيرادات المحققة (عقود استقدام وتأجير)</span>
              <span className="font-mono">525,471.20 ر.س</span>
            </div>
            <div className="border-b border-zinc-100 pb-3 pt-3 flex justify-between items-center text-sm font-bold text-rose-700">
              <span>خصم: تكلفة المبيعات ومصروفات التشغيل</span>
              <span className="font-mono">(220,500.00 ر.س)</span>
            </div>
            <div className="mt-4 flex justify-between items-center text-base font-bold text-white bg-black p-4 rounded-2xl">
              <span>صافي الربح التشغيلي قبل الزكاة:</span>
              <span className="text-champagne-light font-mono">304,971.20 ر.س</span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 8: Balance Sheet (قائمة المركز المالي والميزانية العمومية) */}
      {activeTab === 'balance-sheet' && (
        <div className="space-y-6">
          <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 className="font-bold text-black text-base">قائمة المركز المالي والميزانية العمومية (Balance Sheet)</h3>
              <p className="text-xs text-zinc-500">كما هي في 18 أغسطس 2026</p>
            </div>
            <button
              onClick={() => {
                exportData([
                  { 'القسم': 'الأصول المتداولة', 'القيمة': 850000.00 },
                  { 'القسم': 'الأصول الثابتة', 'القيمة': 980000.00 },
                  { 'القسم': 'إجمالي الأصول', 'القيمة': 1830000.00 },
                  { 'القسم': 'الخصوم المتداولة', 'القيمة': 407575.00 },
                  { 'القسم': 'رأس المال وحقوق الملكية', 'القيمة': 1422425.00 }
                ], 'قائمة_المركز_المالي_والميزانية', 'excel');
                addNotification({ title: 'تصدير الميزانية العمومية', message: 'تم تصدير قائمة المركز المالي والميزانية العمومية بنجاح.', type: 'success' });
              }}
              className="button-primary-pill"
              style={{ padding: '6px 18px', fontSize: '12px', minHeight: '36px' }}
            >
              <Printer className="w-4 h-4 ml-1" />
              <span>تصدير الميزانية</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
              <h4 className="font-bold text-black text-sm border-b border-zinc-100 pb-2">الأصول (Assets)</h4>
              <div className="flex justify-between text-xs text-zinc-600 mt-3">
                <span>الأصول المتداولة (النقدية والبنوك والأمانات)</span>
                <span className="font-mono font-bold text-black">850,000.00 ر.س</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-600 mt-2">
                <span>الأصول الثابتة (صافي القيمة الدفترية)</span>
                <span className="font-mono font-bold text-black">980,000.00 ر.س</span>
              </div>
              <div className="pt-3 mt-3 border-t border-zinc-100 flex justify-between text-sm font-bold text-black">
                <span>إجمالي الأصول:</span>
                <span className="font-mono">1,830,000.00 ر.س</span>
              </div>
            </div>

            <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
              <h4 className="font-bold text-black text-sm border-b border-zinc-100 pb-2">الخصوم وحقوق الملكية (Liabilities & Equity)</h4>
              <div className="flex justify-between text-xs text-zinc-600 mt-3">
                <span>الخصوم والالتزامات المتداولة (الموردين والضريبة)</span>
                <span className="font-mono font-bold text-black">407,575.00 ر.س</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-600 mt-2">
                <span>رأس المال المدفوع</span>
                <span className="font-mono font-bold text-black">1,205,000.00 ر.س</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-600 mt-2">
                <span>الأرباح المبقاة والمرحلة</span>
                <span className="font-mono font-bold text-black">217,425.00 ر.س</span>
              </div>
              <div className="pt-3 mt-3 border-t border-zinc-100 flex justify-between text-sm font-bold text-black">
                <span>إجمالي الخصوم وحقوق الملكية:</span>
                <span className="font-mono">1,830,000.00 ر.س</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 9: Fiscal Closing (إقفال السنة والربط المالي) */}
      {activeTab === 'fiscal-closing' && (
        <div className="card-pricing" style={{ padding: '24px', borderRadius: '24px', background: '#ffffff' }}>
          <div className="flex items-center gap-3">
            <div style={{ width: '40px', height: '40px', borderRadius: '9999px', background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000000' }}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-black text-base">إقفال الفترات المالية وتدوير الأرصدة</h3>
              <p className="text-xs text-zinc-500">ترحيل الأرباح والخسائر وتوليد الأرصدة الافتتاحية للسنة القادمة</p>
            </div>
          </div>

          <div className="p-4 bg-zinc-50 rounded-2xl text-xs space-y-3 mt-4 border border-zinc-100">
            <div className="flex justify-between items-center">
              <span className="text-zinc-600">حالة السنة المالية 2026:</span>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>مفتوحة للعمليات والقيود اليومية</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-600">تاريخ آخر إقفال شهري:</span>
              <span className="text-zinc-500 font-mono">2026-07-31</span>
            </div>
          </div>

          <button
            onClick={() => {
              addNotification({
                title: 'جاهزية الإقفال السنوي',
                message: 'تم التحقق من توازن جميع حسابات الإيرادات والمصروفات، ومطابقة الأرصدة الافتتاحية وجاهزية تدوير السنة المالية بنجاح.',
                type: 'success',
              });
            }}
            className="button-primary-pill mt-4"
            style={{ padding: '8px 24px', fontSize: '12.5px', minHeight: '38px' }}
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
            <label className="text-xs text-zinc-700 block mb-1 font-semibold">رمز الحساب (Account Code)</label>
            <input
              type="text"
              required
              placeholder="مثال: 1105"
              value={newAccount.code}
              onChange={e => setNewAccount({ ...newAccount, code: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black placeholder-zinc-400 focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-700 block mb-1 font-semibold">اسم الحساب الكامل</label>
            <input
              type="text"
              required
              placeholder="مثال: عُهد الموظفين النقدية"
              value={newAccount.name}
              onChange={e => setNewAccount({ ...newAccount, name: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black placeholder-zinc-400 focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-700 block mb-1 font-semibold">النوع الرئيسي</label>
            <select
              value={newAccount.type}
              onChange={e => setNewAccount({ ...newAccount, type: e.target.value as any })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
            >
              <option value="أصول">أصول (Assets)</option>
              <option value="خصوم">خصوم (Liabilities)</option>
              <option value="حقوق ملكية">حقوق ملكية (Equity)</option>
              <option value="إيرادات">إيرادات (Revenues)</option>
              <option value="مصروفات">مصروفات (Expenses)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-700 block mb-1 font-semibold">طبيعة الحساب</label>
            <select
              value={newAccount.nature}
              onChange={e => setNewAccount({ ...newAccount, nature: e.target.value as any })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
            >
              <option value="مدين">مدين (Debit)</option>
              <option value="دائن">دائن (Credit)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-700 block mb-1 font-semibold">الرصيد الافتتاحي (ر.س)</label>
            <input
              type="number"
              value={newAccount.openingBalance}
              onChange={e => setNewAccount({ ...newAccount, openingBalance: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
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
              <label className="text-xs text-zinc-700 block mb-1 font-semibold">رقم المرجع (Ref No)</label>
              <input
                type="text"
                value={journalHeader.refNo}
                onChange={e => setJournalHeader({ ...journalHeader, refNo: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-700 block mb-1 font-semibold">التاريخ</label>
              <input
                type="date"
                value={journalHeader.date}
                onChange={e => setJournalHeader({ ...journalHeader, date: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-700 block mb-1 font-semibold">الفرع الرئيسي</label>
              <input
                type="text"
                value={journalHeader.branch}
                onChange={e => setJournalHeader({ ...journalHeader, branch: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-700 block mb-1 font-semibold">البيان الشامل للقيد</label>
            <input
              type="text"
              placeholder="شرح وتفاصيل القيد المحاسبي..."
              value={journalHeader.description}
              onChange={e => setJournalHeader({ ...journalHeader, description: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black placeholder-zinc-400 focus:border-black focus:outline-none"
            />
          </div>

          {/* Lines Table */}
          <div className="border border-zinc-200 rounded-2xl overflow-hidden">
            <table className="w-full text-right text-xs text-zinc-800">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-2.5">رمز الحساب</th>
                  <th className="p-2.5">اسم الحساب</th>
                  <th className="p-2.5">مدين (Debit)</th>
                  <th className="p-2.5">دائن (Credit)</th>
                  <th className="p-2.5">ملاحظات / البيان</th>
                  <th className="p-2.5 text-center">حذف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
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
                        className="w-24 bg-zinc-50 border border-zinc-200 rounded-xl p-1.5 text-xs font-mono text-black outline-none focus:border-black"
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
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-1.5 text-xs text-black outline-none focus:border-black"
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
                        className="w-28 bg-zinc-50 border border-zinc-200 rounded-xl p-1.5 text-xs text-black font-bold outline-none focus:border-black"
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
                        className="w-28 bg-zinc-50 border border-zinc-200 rounded-xl p-1.5 text-xs text-rose-700 font-bold outline-none focus:border-black"
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
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-1.5 text-xs text-zinc-700 outline-none focus:border-black"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveJournalLine(idx)}
                        className="text-zinc-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-3 bg-zinc-50 border-t border-zinc-100 flex justify-between items-center">
              <button
                type="button"
                onClick={handleAddJournalLine}
                className="button-outline-on-light"
                style={{ padding: '4px 12px', fontSize: '11px', minHeight: '30px' }}
              >
                + إضافة سطر محاسبي جديد
              </button>

              <div className="flex items-center gap-4 text-xs font-bold">
                <span>إجمالي المدين: <strong className="text-black">{totalDebit.toFixed(2)} ر.س</strong></span>
                <span>إجمالي الدائن: <strong className="text-rose-700">{totalCredit.toFixed(2)} ر.س</strong></span>
                <span className={`pill-tag-${isJournalBalanced ? 'mint' : 'shade'}`}>
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
            <label className="text-xs text-zinc-700 block mb-1 font-semibold">رقم السند</label>
            <input
              type="text"
              value={newVoucher.voucherNo}
              onChange={e => setNewVoucher({ ...newVoucher, voucherNo: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-700 block mb-1 font-semibold">تاريخ السند</label>
            <input
              type="date"
              value={newVoucher.date}
              onChange={e => setNewVoucher({ ...newVoucher, date: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-700 block mb-1 font-semibold">{voucherType === 'قبض' ? 'اسم المستلم منه (العميل/الجهة)' : 'اسم المستفيد (المورد/الجهة)'}</label>
            <input
              type="text"
              required
              placeholder="اسم الشخص أو الشركة..."
              value={newVoucher.payeeName}
              onChange={e => setNewVoucher({ ...newVoucher, payeeName: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black placeholder-zinc-400 focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-700 block mb-1 font-semibold">الصندوق / الحساب البنكي</label>
            <select
              value={newVoucher.treasury}
              onChange={e => setNewVoucher({ ...newVoucher, treasury: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
            >
              <option value="بنك الراجحي الرئيسي">بنك الراجحي الرئيسي</option>
              <option value="بنك الرياض - حساب الاستقدام">بنك الرياض - حساب الاستقدام</option>
              <option value="الصندوق الرئيسي (نقدي)">الصندوق الرئيسي (نقدي)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-700 block mb-1 font-semibold">المبلغ (ر.س)</label>
            <input
              type="number"
              required
              placeholder="0.00"
              value={newVoucher.amount}
              onChange={e => setNewVoucher({ ...newVoucher, amount: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-bold focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-700 block mb-1 font-semibold">مركز التكلفة</label>
            <select
              value={newVoucher.costCenter}
              onChange={e => setNewVoucher({ ...newVoucher, costCenter: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
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

export default SmaccAccountingPage;
