import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useRecruitmentContracts, useTableMutation } from '../hooks/queries/useErpQueries';
import { useCompany } from '../contexts/CompanyContext';
import { DualBrandingDocumentGenerator } from '../components/common/DualBrandingDocumentGenerator';

export interface RecruitmentContractItem {
  id: string;
  company_id: string;
  contract_number: string;
  musaned_number?: string;
  client_name: string;
  client_phone: string;
  maid_name: string;
  maid_passport?: string;
  nationality: string;
  external_office?: string;
  amount: number;
  tax_amount?: number;
  total_amount?: number;
  stage: 'عقود جديدة' | 'مساند' | 'تفويض' | 'تفييز' | 'تذكرة' | 'وصول' | 'مكتمل' | 'مرتجع';
  warranty_status: string;
  payment_status: string;
  branch: string;
  created_at: string;
}

const STAGES_LIST: RecruitmentContractItem['stage'][] = [
  'عقود جديدة',
  'مساند',
  'تفويض',
  'تفييز',
  'تذكرة',
  'وصول',
  'مكتمل',
];

export const RecruitmentContractsPage: React.FC = () => {
  const { activeCompanyId, activeCompany } = useCompany();
  const { data: rawContracts = [], isLoading } = useRecruitmentContracts();
  const { createItem, updateItem } = useTableMutation('contracts');

  const contracts: RecruitmentContractItem[] = rawContracts as RecruitmentContractItem[];

  const [activeStage, setActiveStage] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedContractForPrint, setSelectedContractForPrint] = useState<RecruitmentContractItem | null>(null);

  // Add Contract Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [maidName, setMaidName] = useState('');
  const [maidPassport, setMaidPassport] = useState('');
  const [nationality, setNationality] = useState('الفلبين');
  const [externalOffice, setExternalOffice] = useState("PLATINUM BROTHERS INT'L");
  const [amountInput, setAmountInput] = useState('14500');
  const [branch, setBranch] = useState('فرع الرياض الرئيسي');

  const handleAddContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !maidName) return;

    const companyCode = activeCompanyId !== 'all' ? activeCompanyId : 'SAF';
    const contractNumber = `${companyCode}-RC-${new Date().getFullYear()}-${String(contracts.length + 1).padStart(4, '0')}`;
    const musanedNumber = `MSN-${Date.now().toString().slice(-6)}`;
    const amt = parseFloat(amountInput) || 14500;
    const tax = amt * 0.15;

    const newRecord = {
      company_id: companyCode,
      contract_number: contractNumber,
      musaned_number: musanedNumber,
      client_name: clientName,
      client_phone: clientPhone,
      maid_name: maidName,
      maid_passport: maidPassport || 'PHL-998201',
      nationality,
      external_office: externalOffice,
      amount: amt,
      tax_amount: tax,
      total_amount: amt + tax,
      stage: 'عقود جديدة',
      warranty_status: 'نشط (90 يوماً)',
      payment_status: 'تم الدفع',
      branch,
    };

    await createItem.mutateAsync(newRecord);
    setShowAddModal(false);
    setClientName('');
    setClientPhone('');
    setMaidName('');
    setMaidPassport('');
  };

  const handleAdvanceStage = async (contract: RecruitmentContractItem) => {
    const currIdx = STAGES_LIST.indexOf(contract.stage);
    if (currIdx < STAGES_LIST.length - 1) {
      const nextStage = STAGES_LIST[currIdx + 1];
      await updateItem.mutateAsync({
        id: contract.id,
        data: { stage: nextStage },
      });
    }
  };

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch =
      c.contract_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.client_name.includes(searchQuery) ||
      c.maid_name.includes(searchQuery) ||
      (c.maid_passport && c.maid_passport.includes(searchQuery));
    const matchesStage = activeStage === 'all' || c.stage === activeStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <i className="fa-solid fa-file-signature text-purple-700"></i>
            عقود الاستقدام المباشرة (Musaned Pipeline)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            متابعة مراحل عقود مساند، التفييز، وحجوزات الطيران لـ{' '}
            <strong className="text-slate-700">{activeCompany.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <i className="fa-solid fa-table-list"></i> جدول
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <i className="fa-solid fa-columns"></i> مسار Kanban
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-sm shadow-md shadow-purple-200 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i>
            إضافة عقد استقدام جديد
          </button>

          <button
            onClick={() => exportData('recruitment_contracts', filteredContracts, 'excel', `عقود الاستقدام - ${activeCompany.name}`)}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="تصدير إكسيل"
          >
            <i className="fa-solid fa-file-excel text-emerald-600 ml-1.5"></i>
            Excel
          </button>
          <button
            onClick={() => exportData('recruitment_contracts', filteredContracts, 'csv', `عقود الاستقدام - ${activeCompany.name}`)}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="تصدير CSV"
          >
            <i className="fa-solid fa-file-csv text-blue-600 ml-1.5"></i>
            CSV
          </button>
          <button
            onClick={() => exportData('recruitment_contracts', filteredContracts, 'pdf', `عقود الاستقدام - ${activeCompany.name}`)}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="تصدير PDF"
          >
            <i className="fa-solid fa-file-pdf text-rose-600 ml-1.5"></i>
            PDF
          </button>
          <button
            onClick={() => exportData('recruitment_contracts', filteredContracts, 'print', `سجل عقود الاستقدام ومساند - ${activeCompany.name}`)}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="طباعة التقرير المعتمد"
          >
            <i className="fa-solid fa-print text-purple-700 ml-1.5"></i>
            طباعة
          </button>
        </div>
      </div>

      {/* Stage Flow Badges Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveStage('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeStage === 'all'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>جميع العقود</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeStage === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
            {contracts.length}
          </span>
        </button>

        {STAGES_LIST.map((stg) => {
          const count = contracts.filter((c) => c.stage === stg).length;
          const isActive = activeStage === stg;
          return (
            <button
              key={stg}
              onClick={() => setActiveStage(stg)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{stg}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content View: Table or Kanban */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="ابحث برقم العقد، اسم العميل، اسم العاملة، أو الجواز..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-600 transition-colors"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">رقم العقد / مساند</th>
                  <th className="py-3.5 px-4">بيانات العميل</th>
                  <th className="py-3.5 px-4">بيانات العاملة</th>
                  <th className="py-3.5 px-4">المكتب الخارجي</th>
                  <th className="py-3.5 px-4">مرحلة العقد</th>
                  <th className="py-3.5 px-4">المبلغ والضمان</th>
                  <th className="py-3.5 px-4 text-center">إجراءات المسار</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      <i className="fa-solid fa-spinner fa-spin ml-2"></i> جاري استرجاع العقود من سوبابيس...
                    </td>
                  </tr>
                ) : filteredContracts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      لا توجد عقود مسجلة في هذه المرحلة
                    </td>
                  </tr>
                ) : (
                  filteredContracts.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-black text-purple-700">{c.contract_number}</div>
                        <div className="text-[11px] text-slate-400 font-mono">مساند: {c.musaned_number || 'MSN-PENDING'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{c.client_name}</div>
                        <div className="text-xs text-slate-400">{c.client_phone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{c.maid_name}</div>
                        <div className="text-xs text-slate-500 font-medium">{c.nationality} • {c.maid_passport}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-bold text-slate-600">
                        {c.external_office || 'مكتب مانيلا الدولي'}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge text={c.stage} type="purple" />
                        <div className="text-[10px] text-emerald-600 font-bold mt-1">{c.warranty_status}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-black text-teal-800">{c.amount.toLocaleString()} ر.س</div>
                        <div className="text-[11px] text-slate-400">{c.payment_status}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleAdvanceStage(c)}
                            className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                            title="تقديم للمرحلة التالية"
                          >
                            <span>المرحلة التالية</span>
                            <i className="fa-solid fa-arrow-left text-[10px]"></i>
                          </button>
                          <button
                            onClick={() => setSelectedContractForPrint(c)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors text-xs"
                            title="طباعة العقد الرسمي"
                          >
                            <i className="fa-solid fa-print text-slate-600"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban Pipeline View */
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {STAGES_LIST.map((stg) => {
            const stageItems = contracts.filter((c) => c.stage === stg);
            return (
              <div key={stg} className="bg-slate-100 rounded-2xl p-3 space-y-3 min-h-[500px]">
                <div className="flex items-center justify-between px-1">
                  <h4 className="font-bold text-xs text-slate-800">{stg}</h4>
                  <span className="bg-white text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {stageItems.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {stageItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-2 text-xs hover:border-purple-400 transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-[11px] text-purple-700">{item.contract_number}</span>
                        <Badge text={item.nationality} type="purple" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{item.client_name}</div>
                        <div className="text-slate-500 text-[11px]">العاملة: {item.maid_name}</div>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[11px]">
                        <span className="font-black text-teal-800">{item.amount.toLocaleString()} ر.س</span>
                        <button
                          onClick={() => handleAdvanceStage(item)}
                          className="text-purple-600 hover:text-purple-800 font-bold"
                        >
                          نقل ➔
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Contract Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden font-sans">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-file-signature text-purple-400"></i>
                <h3 className="font-bold text-base">تسجيل عقد استقدام مساند جديد</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleAddContract} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم العميل *</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="اسم العميل الرباعي..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم جوال العميل *</label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+9665..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم العاملة بالكامل *</label>
                  <input
                    type="text"
                    value={maidName}
                    onChange={(e) => setMaidName(e.target.value)}
                    placeholder="اسم العاملة حسب الجواز..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم جواز السفر *</label>
                  <input
                    type="text"
                    value={maidPassport}
                    onChange={(e) => setMaidPassport(e.target.value)}
                    placeholder="Passport Number..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">الجنسية *</label>
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                  >
                    <option>الفلبين</option>
                    <option>إندونيسيا</option>
                    <option>إثيوبيا</option>
                    <option>كينيا</option>
                    <option>أوغندا</option>
                    <option>سريلانكا</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">المكتب الخارجي الشريك *</label>
                  <select
                    value={externalOffice}
                    onChange={(e) => setExternalOffice(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                  >
                    <option>PLATINUM BROTHERS INT'L</option>
                    <option>DAMAS FOREIGN AGENCY</option>
                    <option>VERSATILE OVERSEAS</option>
                    <option>MANILA RECRUITMENT HUB</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">مبلغ العقد قبل الضريبة (ر.س) *</label>
                  <input
                    type="number"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">الفرع المسؤول</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                  >
                    <option>فرع الرياض الرئيسي</option>
                    <option>فرع جدة</option>
                    <option>فرع الخبر والدمام</option>
                    <option>الإدارة العامة للمجموعة</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-sm font-bold shadow-md shadow-purple-200 transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-check"></i>
                  اعتماد وحفظ العقد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contract Print Modal */}
      {selectedContractForPrint && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden font-sans">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">طباعة عقد الاستقدام الرسمي</h3>
              <button
                onClick={() => setSelectedContractForPrint(null)}
                className="text-slate-400 hover:text-white"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <div className="p-6">
              <DualBrandingDocumentGenerator
                documentTitle="عقد توسط في استقدام عمالة منزلية"
                documentNumber={selectedContractForPrint.contract_number}
                date={selectedContractForPrint.created_at ? new Date(selectedContractForPrint.created_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)}
              >
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-bold">اسم العميل:</span>
                    <span className="font-bold text-slate-900">{selectedContractForPrint.client_name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-bold">رقم توثيق مساند:</span>
                    <span className="font-bold text-purple-700 font-mono">{selectedContractForPrint.musaned_number || 'MSN-992011'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-bold">اسم العاملة والجنسية:</span>
                    <span className="font-bold text-slate-900">{selectedContractForPrint.maid_name} ({selectedContractForPrint.nationality})</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-bold">رقم جواز السفر:</span>
                    <span className="font-bold text-slate-700 font-mono">{selectedContractForPrint.maid_passport || 'PHL-998201'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-bold">المكتب الخارجي:</span>
                    <span className="font-bold text-slate-800">{selectedContractForPrint.external_office || 'مكتب مانيلا المعتمد'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-bold">المبلغ الإجمالي:</span>
                    <span className="font-black text-emerald-800 text-base">{selectedContractForPrint.amount.toLocaleString()} ر.س شامل الرسوم والضريبة</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-bold">مدة الضمان المعتمدة:</span>
                    <span className="font-bold text-slate-900">90 يوماً من تاريخ الوصول الفعلي</span>
                  </div>
                </div>
              </DualBrandingDocumentGenerator>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruitmentContractsPage;
