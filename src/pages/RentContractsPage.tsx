import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useRentContracts, useTableMutation } from '../hooks/queries/useErpQueries';
import { useCompany } from '../contexts/CompanyContext';
import { DualBrandingDocumentGenerator } from '../components/common/DualBrandingDocumentGenerator';

export interface RentContractRecord {
  id: string;
  company_id: string;
  contract_number: string;
  client_name: string;
  client_phone: string;
  maid_name: string;
  nationality: string;
  start_date: string;
  end_date: string;
  duration_months: number;
  monthly_cost: number;
  total_amount: number;
  deposit_amount?: number;
  status: 'جديد' | 'نشط' | 'بانتظار التوقيع' | 'تم تسليم العاملة' | 'مكتمل' | 'تم النقل' | 'ملغي';
  payment_status: 'معلق' | 'تم الدفع' | 'بانتظار التحويل';
  marketer?: string;
  branch: string;
  created_at: string;
}

const DEFAULT_MOCK_RENT_CONTRACTS: RentContractRecord[] = [
  {
    id: 'rent-1',
    company_id: 'SAF',
    contract_number: 'SAF-RENT-2026-0014',
    client_name: 'ابو عبدالله',
    client_phone: '+966535666840',
    maid_name: 'Rental A21221 (سيتي نورعيني)',
    nationality: 'إندونيسيا',
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    duration_months: 1,
    monthly_cost: 3450.0,
    total_amount: 3450.0,
    status: 'نشط',
    payment_status: 'تم الدفع',
    marketer: 'سارة خالد (مشرفة التأجير)',
    branch: 'فرع الرياض الرئيسي',
    created_at: new Date().toISOString(),
  },
  {
    id: 'rent-2',
    company_id: 'SAF',
    contract_number: 'SAF-RENT-2026-0016',
    client_name: 'ابو اياد',
    client_phone: '+966562404213',
    maid_name: 'Rental A2122121 (رحمة أديسي)',
    nationality: 'إثيوبيا',
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    duration_months: 2,
    monthly_cost: 1725.0,
    total_amount: 3450.0,
    status: 'بانتظار التوقيع',
    payment_status: 'معلق',
    marketer: 'فهد العتيبي',
    branch: 'فرع الرياض الرئيسي',
    created_at: new Date().toISOString(),
  },
];

export const RentContractsPage: React.FC = () => {
  const { activeCompanyId, activeCompany } = useCompany();
  const { data: rawRentContracts = [], isLoading } = useRentContracts();
  const { createItem, updateItem } = useTableMutation('rent_contracts');

  const rentContracts: RentContractRecord[] = rawRentContracts.length > 0 ? (rawRentContracts as RentContractRecord[]) : DEFAULT_MOCK_RENT_CONTRACTS;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedContractForPrint, setSelectedContractForPrint] = useState<RentContractRecord | null>(null);

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [maidName, setMaidName] = useState('');
  const [nationality, setNationality] = useState('إندونيسيا');
  const [durationMonths, setDurationMonths] = useState('1');
  const [monthlyCost, setMonthlyCost] = useState('3450');
  const [marketer, setMarketer] = useState('سارة خالد');
  const [branch, setBranch] = useState('فرع الرياض الرئيسي');

  const months = parseInt(durationMonths) || 1;
  const monthly = parseFloat(monthlyCost) || 3450;
  const totalAmount = months * monthly;

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !maidName) return;

    const companyCode = activeCompanyId !== 'all' ? activeCompanyId : 'SAF';
    const contractNumber = `${companyCode}-RENT-${new Date().getFullYear()}-${String(rentContracts.length + 1).padStart(4, '0')}`;
    const startDate = new Date().toISOString().slice(0, 10);
    const endDate = new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const newRecord = {
      company_id: companyCode,
      contract_number: contractNumber,
      client_name: clientName,
      client_phone: clientPhone,
      maid_name: maidName,
      nationality,
      start_date: startDate,
      end_date: endDate,
      duration_months: months,
      monthly_cost: monthly,
      total_amount: totalAmount,
      deposit_amount: 500,
      status: 'نشط',
      payment_status: 'تم الدفع',
      marketer,
      branch,
    };

    await createItem.mutateAsync(newRecord);
    setShowAddModal(false);
    setClientName('');
    setClientPhone('');
    setMaidName('');
  };

  const handleExtendContract = async (contract: RentContractRecord) => {
    const newDuration = contract.duration_months + 1;
    const newTotal = newDuration * contract.monthly_cost;
    const newEndDate = new Date(new Date(contract.end_date).getTime() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    await updateItem.mutateAsync({
      id: contract.id,
      data: {
        duration_months: newDuration,
        total_amount: newTotal,
        end_date: newEndDate,
      },
    });
  };

  const filteredContracts = rentContracts.filter((c) => {
    const matchesSearch =
      c.contract_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.client_name.includes(searchQuery) ||
      c.maid_name.includes(searchQuery);
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <i className="fa-solid fa-handshake text-teal-700"></i>
            عقود التأجير والخدمات التشغيلية الدورية
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            إدارة عقود التأجير الشهري والسنوي، التجديد الآلي، وتأمين العمالة لـ{' '}
            <strong className="text-slate-700">{activeCompany.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-sm shadow-md shadow-teal-200 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i>
            إبرام عقد تأجير جديد
          </button>
          <button
            onClick={() => exportData('rent_contracts', filteredContracts, 'excel', `عقود التأجير - ${activeCompany.name}`)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="تصدير إكسيل"
          >
            <i className="fa-solid fa-file-excel text-emerald-600 ml-1.5"></i>
            Excel
          </button>
          <button
            onClick={() => exportData('rent_contracts', filteredContracts, 'csv', `عقود التأجير - ${activeCompany.name}`)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="تصدير CSV"
          >
            <i className="fa-solid fa-file-csv text-blue-600 ml-1.5"></i>
            CSV
          </button>
          <button
            onClick={() => exportData('rent_contracts', filteredContracts, 'pdf', `عقود التأجير - ${activeCompany.name}`)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="تصدير PDF"
          >
            <i className="fa-solid fa-file-pdf text-rose-600 ml-1.5"></i>
            PDF
          </button>
          <button
            onClick={() => exportData('rent_contracts', filteredContracts, 'print', `سجل عقود التأجير التشغيلي - ${activeCompany.name}`)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="طباعة التقرير المعتمد"
          >
            <i className="fa-solid fa-print text-purple-700 ml-1.5"></i>
            طباعة
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400">إجمالي عقود التأجير</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{rentContracts.length} عقداً</div>
          <span className="text-xs text-teal-600 font-bold mt-1 inline-block">تشغيل ومتابعة مستمرة</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400">العقود النشطة الحالية</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {rentContracts.filter((c) => c.status === 'نشط').length} عقداً
          </div>
          <span className="text-xs text-slate-400 font-medium">قيد الخدمة لدى العملاء</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400">الإيراد الشهري المتوقع</span>
          <div className="text-2xl font-black text-teal-800 mt-1">
            {rentContracts.reduce((acc, c) => acc + (c.monthly_cost || 0), 0).toLocaleString()} ر.س
          </div>
          <span className="text-xs text-slate-400 font-medium">مجموع العقود الشهرية</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400">متوسط مدة العقد</span>
          <div className="text-2xl font-black text-purple-700 mt-1">
            {(rentContracts.reduce((acc, c) => acc + (c.duration_months || 1), 0) / (rentContracts.length || 1)).toFixed(1)} شهر
          </div>
          <span className="text-xs text-purple-600 font-bold mt-1 inline-block">معدل التجديد 87%</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex-1 min-w-[280px]">
            <input
              type="text"
              placeholder="ابحث برقم العقد، اسم العميل، أو اسم العاملة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-600 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none"
            >
              <option value="ALL">جميع حالات العقود</option>
              <option value="نشط">عقود نشطة</option>
              <option value="بانتظار التوقيع">بانتظار التوقيع</option>
              <option value="مكتمل">عقود مكتملة</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">رقم العقد</th>
                <th className="py-3.5 px-4">العميل</th>
                <th className="py-3.5 px-4">العاملة والجنسية</th>
                <th className="py-3.5 px-4">المدة والفترة</th>
                <th className="py-3.5 px-4">المبلغ الشهري والإجمالي</th>
                <th className="py-3.5 px-4">المسوق / الفرع</th>
                <th className="py-3.5 px-4">الحالة</th>
                <th className="py-3.5 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    <i className="fa-solid fa-spinner fa-spin ml-2"></i> جاري استرجاع عقود التأجير...
                  </td>
                </tr>
              ) : filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    لا توجد عقود تأجير مطابقة للبحث
                  </td>
                </tr>
              ) : (
                filteredContracts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-black text-teal-800">{c.contract_number}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{c.client_name}</div>
                      <div className="text-xs text-slate-400">{c.client_phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{c.maid_name}</div>
                      <div className="text-xs text-slate-500">{c.nationality}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{c.duration_months} شهر</div>
                      <div className="text-[11px] text-slate-400">حتى {c.end_date}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-teal-700">{c.monthly_cost.toLocaleString()} ر.س/شهر</div>
                      <div className="text-[11px] font-mono text-slate-500">إجمالي: {c.total_amount.toLocaleString()} ر.س</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      <div>{c.marketer || 'مسؤول التأجير'}</div>
                      <div className="text-[10px] text-slate-400">{c.branch}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge text={c.status} type={c.status === 'نشط' ? 'success' : 'purple'} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleExtendContract(c)}
                          className="px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-xs font-bold transition-colors"
                          title="تمديد شهر إضافي"
                        >
                          + شهر
                        </button>
                        <button
                          onClick={() => setSelectedContractForPrint(c)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors text-xs"
                          title="طباعة العقد"
                        >
                          <i className="fa-solid fa-print"></i>
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

      {/* Add Rent Contract Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden font-sans">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-handshake text-teal-400"></i>
                <h3 className="font-bold text-base">إبرام عقد تأجير عمالة جديد</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleCreateContract} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم العميل *</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="اسم المستأجر..."
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
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم العاملة المؤجرة *</label>
                  <input
                    type="text"
                    value={maidName}
                    onChange={(e) => setMaidName(e.target.value)}
                    placeholder="اسم العاملة..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">الجنسية *</label>
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                  >
                    <option>إندونيسيا</option>
                    <option>الفلبين</option>
                    <option>إثيوبيا</option>
                    <option>كينيا</option>
                    <option>أوغندا</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">مدة العقد (بالأشهر) *</label>
                  <select
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                  >
                    <option value="1">شهر واحد (1 شهر)</option>
                    <option value="3">3 أشهر (ربع سنوي)</option>
                    <option value="6">6 أشهر (نصف سنوي)</option>
                    <option value="12">12 شهراً (عقد سنوي)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">القيمة الشهرية (ر.س) *</label>
                  <input
                    type="number"
                    value={monthlyCost}
                    onChange={(e) => setMonthlyCost(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-200 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-700">إجمالي قيمة العقد المستحقة:</span>
                <span className="text-base font-black text-teal-800">{totalAmount.toLocaleString()} ر.س</span>
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
                  className="px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-bold shadow-md shadow-teal-200 transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-check"></i>
                  اعتماد العقد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print Modal */}
      {selectedContractForPrint && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden font-sans">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">طباعة عقد التأجير التشغيلي</h3>
              <button onClick={() => setSelectedContractForPrint(null)} className="text-slate-400 hover:text-white">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <div className="p-6">
              <DualBrandingDocumentGenerator
                documentTitle="عقد تأجير وتقديم خدمات عمالة منزلية"
                documentNumber={selectedContractForPrint.contract_number}
                date={selectedContractForPrint.start_date}
              >
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-bold">اسم المستأجر:</span>
                    <span className="font-bold text-slate-900">{selectedContractForPrint.client_name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-bold">مدة العقد:</span>
                    <span className="font-bold text-teal-800">{selectedContractForPrint.duration_months} شهر (من {selectedContractForPrint.start_date} إلى {selectedContractForPrint.end_date})</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-bold">العاملة والجنسية:</span>
                    <span className="font-bold text-slate-900">{selectedContractForPrint.maid_name} ({selectedContractForPrint.nationality})</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-bold">التكلفة الشهرية:</span>
                    <span className="font-bold text-teal-700">{selectedContractForPrint.monthly_cost.toLocaleString()} ر.س/شهر</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-bold">المبلغ الإجمالي للعقد:</span>
                    <span className="font-black text-emerald-800 text-base">{selectedContractForPrint.total_amount.toLocaleString()} ر.س شامل الضريبة والتأمين</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-bold">شروط الاستبدال:</span>
                    <span className="font-bold text-slate-900">استبدال فوري خلال 24 ساعة في حال تعذر العمل</span>
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

export default RentContractsPage;
