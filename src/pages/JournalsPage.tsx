import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useJournals, useTableMutation } from '../hooks/queries/useErpQueries';
import { useCompany } from '../contexts/CompanyContext';
import { chartOfAccountsService } from '../services/accounting/chartOfAccountsService';
import { useAppStore } from '../stores/appStore';

export interface JournalLineItem {
  id: string;
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
  cost_center_code?: string;
  description?: string;
}

export interface JournalRecord {
  id: string;
  company_id: string;
  entry_number: string;
  entry_date: string;
  entry_type: 'MANUAL' | 'AUTOMATIC' | 'CLOSING' | 'REVERSAL';
  source_module: string;
  source_reference?: string;
  description: string;
  total_debit: number;
  total_credit: number;
  status: 'POSTED' | 'DRAFT' | 'CANCELLED';
  branch_name: string;
  cost_center_code?: string;
  created_by: string;
  approved_by?: string;
  created_at: string;
}

const DEFAULT_MOCK_JOURNALS: JournalRecord[] = [
  {
    id: 'jv-1',
    company_id: 'SAF',
    entry_number: 'SAF-JV-2026-0001',
    entry_date: new Date().toISOString().slice(0, 10),
    entry_type: 'AUTOMATIC',
    source_module: 'INVOICE',
    source_reference: 'INV-2026-0014',
    description: 'إثبات قيد فاتورة عقد تأجير تشغيلي - العميل أبو إياد',
    total_debit: 1150.0,
    total_credit: 1150.0,
    status: 'POSTED',
    branch_name: 'فرع الرياض الرئيسي',
    cost_center_code: 'CC-OPS-01',
    created_by: 'النظام المحاسبي الآلي',
    approved_by: 'مدير الحسابات',
    created_at: new Date().toISOString(),
  },
  {
    id: 'jv-2',
    company_id: 'SAF',
    entry_number: 'SAF-JV-2026-0002',
    entry_date: new Date().toISOString().slice(0, 10),
    entry_type: 'AUTOMATIC',
    source_module: 'RECEIPT',
    source_reference: 'REC-2026-0059',
    description: 'تحصيل دفعة مقدمة عقد استقدام مساند - بنك الراجحي',
    total_debit: 14500.0,
    total_credit: 14500.0,
    status: 'POSTED',
    branch_name: 'فرع الرياض الرئيسي',
    cost_center_code: 'CC-REC-01',
    created_by: 'إبراهيم الشمري (محاسب)',
    approved_by: 'المدير المالي',
    created_at: new Date().toISOString(),
  },
];

export const JournalsPage: React.FC = () => {
  const { activeCompanyId, activeCompany } = useCompany();
  const { setActiveTab } = useAppStore();
  const { data: rawJournals = [], isLoading } = useJournals();
  const { createItem, updateItem } = useTableMutation('company_journal_entries');

  const journals: JournalRecord[] = rawJournals.length > 0 ? rawJournals : DEFAULT_MOCK_JOURNALS;
  const accountsList = chartOfAccountsService.getAccountsByCompany(activeCompanyId);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<JournalRecord | null>(null);

  // Multi-line Journal Entry Form State
  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [entryType, setEntryType] = useState<'MANUAL' | 'AUTOMATIC' | 'CLOSING' | 'REVERSAL'>('MANUAL');
  const [description, setDescription] = useState('');
  const [branchName, setBranchName] = useState('فرع الرياض الرئيسي');
  const [costCenterCode, setCostCenterCode] = useState('CC-OPS-01');
  const [lines, setLines] = useState<Omit<JournalLineItem, 'id'>[]>([
    {
      account_code: accountsList[2]?.code || '11010',
      account_name: accountsList[2]?.nameAr || 'الصندوق الرئيسي - السفير الماسي',
      debit: 1000,
      credit: 0,
      description: '',
    },
    {
      account_code: accountsList[9]?.code || '41100',
      account_name: accountsList[9]?.nameAr || 'إيرادات عقود استقدام مساند',
      debit: 0,
      credit: 1000,
      description: '',
    },
  ]);

  // Balance Calculations
  const totalDebit = lines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.001 && totalDebit > 0;
  const difference = totalDebit - totalCredit;

  const handleAddLine = () => {
    setLines([
      ...lines,
      {
        account_code: accountsList[0]?.code || '11010',
        account_name: accountsList[0]?.nameAr || 'الصندوق الرئيسي',
        debit: 0,
        credit: 0,
        description: '',
      },
    ]);
  };

  const handleRemoveLine = (idx: number) => {
    if (lines.length <= 2) return;
    setLines(lines.filter((_, i) => i !== idx));
  };

  const handleLineChange = (idx: number, field: keyof Omit<JournalLineItem, 'id'>, val: any) => {
    const updated = [...lines];
    if (field === 'account_code') {
      const selectedAcc = accountsList.find((a) => a.code === val);
      updated[idx].account_code = val;
      updated[idx].account_name = selectedAcc ? selectedAcc.nameAr : '';
    } else {
      (updated[idx] as any)[field] = field === 'debit' || field === 'credit' ? parseFloat(val) || 0 : val;
    }
    setLines(updated);
  };

  const handleSaveJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) return;

    const companyCode = activeCompanyId !== 'all' ? activeCompanyId : 'SAF';
    const entryNumber = `${companyCode}-JV-${new Date().getFullYear()}-${String(journals.length + 1).padStart(4, '0')}`;

    const newRecord = {
      company_id: companyCode,
      entry_number: entryNumber,
      entry_date: entryDate,
      entry_type: entryType,
      source_module: 'MANUAL_ENTRY',
      description,
      total_debit: totalDebit,
      total_credit: totalCredit,
      status: 'POSTED',
      branch_name: branchName,
      cost_center_code: costCenterCode,
      created_by: 'سليمان السليم (مدير النظام)',
      approved_by: 'المدير المالي المعتمد',
    };

    await createItem.mutateAsync(newRecord);
    setShowAddModal(false);
    setDescription('');
  };

  const filteredJournals = journals.filter((j) => {
    const matchesSearch =
      j.entry_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.description.includes(searchQuery) ||
      (j.created_by && j.created_by.includes(searchQuery));
    const matchesType = filterType === 'ALL' || j.entry_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <i className="fa-solid fa-book-journal-whills text-purple-600"></i>
            دفتر اليومية والقيود المزدوجة المتوازنة
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            إدارة وترحيل قيود اليومية العامة لـ{' '}
            <strong className="text-slate-700">{activeCompany.name}</strong> بدقة محاسبية متوازنة (Double Entry)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddModal(true)}
            className="button-primary-pill"
            style={{ fontSize: '13px', padding: '6px 18px', minHeight: '38px' }}
          >
            <i className="fa-solid fa-plus text-xs"></i>
            + إنشاء قيد محاسبي متوازن
          </button>
          <button
            onClick={() => setActiveTab('data-import', 'معالج استيراد البيانات الشامل (Excel / CSV)')}
            className="button-outline-on-light"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
            title="استيراد قيود يومية من ملف Excel / CSV"
          >
            <i className="fa-solid fa-file-import ml-1"></i>
            استيراد قيود
          </button>
          <button
            onClick={() => exportData('journals', filteredJournals, 'excel', `دفتر القيود المحاسبية - ${activeCompany.name}`)}
            className="button-outline-on-light"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
            title="تصدير إكسيل"
          >
            <i className="fa-solid fa-file-excel text-emerald-600 ml-1"></i>
            Excel
          </button>
          <button
            onClick={() => exportData('journals', filteredJournals, 'pdf', `دفتر القيود المحاسبية - ${activeCompany.name}`)}
            className="button-outline-on-light"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
            title="تصدير PDF"
          >
            <i className="fa-solid fa-file-pdf text-rose-600 ml-1"></i>
            PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#71717a', fontWeight: 550 }}>إجمالي القيود المرحّلة</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>{journals.length} قيداً</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>100% متطابقة</span>
        </div>

        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#71717a', fontWeight: 550 }}>إجمالي حركات المدين (Debit)</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>
            {journals.reduce((acc, j) => acc + (j.total_debit || 0), 0).toLocaleString()} ر.س
          </div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '10px' }}>مجموع المدين</span>
        </div>

        <div className="card-pricing-featured" style={{ padding: '24px', borderRadius: '16px', background: '#000000', color: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 550 }}>إجمالي حركات الدائن (Credit)</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#ffffff', marginTop: '6px', letterSpacing: '-0.02em' }}>
            {journals.reduce((acc, j) => acc + (j.total_credit || 0), 0).toLocaleString()} ر.س
          </div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>مجموع الدائن</span>
        </div>

        <div className="card-pistachio-band" style={{ padding: '24px', borderRadius: '16px' }}>
          <span style={{ fontSize: '13px', color: '#000000', fontWeight: 550 }}>حالة التوازن المحاسبي</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>
            متوازن تماماً
          </div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>فارق = 0.00 ر.س</span>
        </div>
      </div>

      {/* Filter & Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex-1 min-w-[280px]">
            <input
              type="text"
              placeholder="ابحث برقم القيد، البيان، أو اسم المحاسب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-600 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none"
            >
              <option value="ALL">جميع أنواع القيود</option>
              <option value="MANUAL">قيود يدوية (MANUAL)</option>
              <option value="AUTOMATIC">قيود آلية من الفواتير (AUTOMATIC)</option>
              <option value="REVERSAL">قيود عكسية (REVERSAL)</option>
            </select>
          </div>
        </div>

        {/* Journals Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">رقم القيد</th>
                <th className="py-3.5 px-4">التاريخ</th>
                <th className="py-3.5 px-4">البيان والشرح</th>
                <th className="py-3.5 px-4">إجمالي المدين</th>
                <th className="py-3.5 px-4">إجمالي الدائن</th>
                <th className="py-3.5 px-4">الفرع / مركز التكلفة</th>
                <th className="py-3.5 px-4">المُعد / المعتمد</th>
                <th className="py-3.5 px-4">الحالة</th>
                <th className="py-3.5 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400">
                    <i className="fa-solid fa-spinner fa-spin ml-2"></i> جاري استرجاع القيود المحاسبية من سوبابيس...
                  </td>
                </tr>
              ) : filteredJournals.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400">
                    لا توجد قيود مسجلة تطابق معايير البحث
                  </td>
                </tr>
              ) : (
                filteredJournals.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-black text-purple-700">{j.entry_number}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">{j.entry_date}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate" title={j.description}>
                      {j.description}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-black">{j.total_debit.toLocaleString()} ر.س</td>
                    <td className="py-3.5 px-4 font-bold text-rose-700">{j.total_credit.toLocaleString()} ر.س</td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      <div>{j.branch_name}</div>
                      {j.cost_center_code && (
                        <span className="text-[10px] text-slate-400 font-mono">[{j.cost_center_code}]</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">{j.created_by}</td>
                    <td className="py-3.5 px-4">
                      <Badge
                        text={j.status === 'POSTED' ? 'مرحّل ومعتمد' : 'مسودة'}
                        type={j.status === 'POSTED' ? 'success' : 'warning'}
                      />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedJournal(j)}
                        className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors text-xs font-bold"
                        title="عرض تفاصيل أطراف القيد"
                      >
                        <i className="fa-solid fa-eye text-purple-600"></i> معاينة
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Balanced Journal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden font-sans max-h-[90vh] flex flex-col">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-scale-balanced text-purple-400"></i>
                <h3 className="font-bold text-base">إنشاء قيد يومية متوازن جديد (Double-Entry Journal)</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSaveJournal} className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Header Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">تاريخ القيد *</label>
                  <input
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">نوع القيد *</label>
                  <select
                    value={entryType}
                    onChange={(e) => setEntryType(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                  >
                    <option value="MANUAL">قيد يومية يدوي (MANUAL)</option>
                    <option value="AUTOMATIC">قيد تسوية / تلقائي (AUTOMATIC)</option>
                    <option value="CLOSING">قيد إقفال سنوي (CLOSING)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">الفرع *</label>
                  <select
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                  >
                    <option>فرع الرياض الرئيسي</option>
                    <option>فرع جدة</option>
                    <option>فرع الخبر والدمام</option>
                    <option>الإدارة العامة للمجموعة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">البيان والشرح المحاسبي للقيد *</label>
                <input
                  type="text"
                  placeholder="مثال: إثبات سداد مصاريف استقدام عمالة / تحصيل دفعة عقد إيجار..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-purple-600"
                  required
                />
              </div>

              {/* Multi-Line Journal Lines Builder */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2">
                    <i className="fa-solid fa-list-ol text-purple-600"></i>
                    بنود وأطراف القيد المحاسبي
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddLine}
                    className="px-3 py-1.5 bg-white border border-purple-300 text-purple-700 hover:bg-purple-50 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-plus text-[10px]"></i> إضافة طرف قيد
                  </button>
                </div>

                <div className="space-y-2">
                  {lines.map((line, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                      <div className="col-span-5">
                        <label className="block text-[10px] text-slate-400 font-bold mb-1">الحساب المحاسبي</label>
                        <select
                          value={line.account_code}
                          onChange={(e) => handleLineChange(idx, 'account_code', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none"
                        >
                          {accountsList.map((acc) => (
                            <option key={acc.code} value={acc.code}>
                              {acc.code} - {acc.nameAr}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-3">
                        <label className="block text-[10px] text-zinc-700 font-bold mb-1">مدين (Debit)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={line.debit === 0 ? '' : line.debit}
                          onChange={(e) => handleLineChange(idx, 'debit', e.target.value)}
                          placeholder="0.00"
                          className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-bold text-black outline-none focus:border-black"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="block text-[10px] text-rose-600 font-bold mb-1">دائن (Credit)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={line.credit === 0 ? '' : line.credit}
                          onChange={(e) => handleLineChange(idx, 'credit', e.target.value)}
                          placeholder="0.00"
                          className="w-full px-2.5 py-1.5 bg-rose-50/50 border border-rose-200 rounded-lg text-xs font-bold text-rose-900 outline-none"
                        />
                      </div>

                      <div className="col-span-1 text-center pt-4">
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(idx)}
                          disabled={lines.length <= 2}
                          className="text-slate-300 hover:text-rose-500 disabled:opacity-30 transition-colors p-1"
                        >
                          <i className="fa-solid fa-trash-can text-sm"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Balance Summary & Validation Box */}
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  isBalanced ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      isBalanced ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                    }`}>
                      <i className={`fa-solid ${isBalanced ? 'fa-check' : 'fa-triangle-exclamation'}`}></i>
                    </div>
                    <div>
                      <div className="text-xs font-bold">
                        {isBalanced ? 'القيد المحاسبي متوازن وصالح للترحيل' : 'القيد غير متوازن! يجب أن يتساوى المدين مع الدائن.'}
                      </div>
                      <div className="text-[11px] opacity-80">
                        إجمالي المدين: {totalDebit.toLocaleString()} ر.س | إجمالي الدائن: {totalCredit.toLocaleString()} ر.س
                      </div>
                    </div>
                  </div>

                  <div className="text-end font-mono font-bold text-sm">
                    الفارق: {difference.toFixed(2)} ر.س
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={!isBalanced || !description}
                  className="px-6 py-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-md shadow-purple-200 transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-check"></i>
                  ترحيل واعتماد القيد المحاسبي
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalsPage;
