import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useCostCenters, useTableMutation } from '../hooks/queries/useErpQueries';
import { useCompany } from '../contexts/CompanyContext';

export interface CostCenterRecord {
  id: string;
  company_id: string;
  code: string;
  name: string;
  manager_name?: string;
  budget: number;
  actual_spent: number;
  created_at: string;
}

const DEFAULT_MOCK_COST_CENTERS: CostCenterRecord[] = [
  {
    id: 'cc-1',
    company_id: 'SAF',
    code: 'CC-OPS-01',
    name: 'مركز تكلفة عمليات الاستقدام ومساند',
    manager_name: 'فهد العتيبي',
    budget: 150000.0,
    actual_spent: 42500.0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'cc-2',
    company_id: 'SAF',
    code: 'CC-RENT-02',
    name: 'مركز تكلفة عقود التأجير والتشغيل',
    manager_name: 'محمد مصطفى',
    budget: 90000.0,
    actual_spent: 18400.0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'cc-3',
    company_id: 'SAF',
    code: 'CC-SHELTER-03',
    name: 'مركز إيواء وتغذية حي الرمال',
    manager_name: 'سهام الشاذلي',
    budget: 80000.0,
    actual_spent: 64500.0,
    created_at: new Date().toISOString(),
  },
];

export const CostCentersPage: React.FC = () => {
  const { activeCompanyId, activeCompany } = useCompany();
  const { data: rawCostCenters = [], isLoading } = useCostCenters();
  const { createItem } = useTableMutation('cost_centers');

  const costCenters: CostCenterRecord[] = rawCostCenters.length > 0 ? rawCostCenters : DEFAULT_MOCK_COST_CENTERS;

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [budget, setBudget] = useState('50000');

  const handleAddCostCenter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const companyCode = activeCompanyId !== 'all' ? activeCompanyId : 'SAF';
    const code = `CC-${companyCode}-${String(costCenters.length + 1).padStart(2, '0')}`;

    const newRecord = {
      company_id: companyCode,
      code,
      name,
      manager_name: managerName || 'مشرف القسم',
      budget: parseFloat(budget) || 50000,
      actual_spent: 0,
    };

    await createItem.mutateAsync(newRecord);
    setShowAddModal(false);
    setName('');
    setManagerName('');
    setBudget('50000');
  };

  const filteredCostCenters = costCenters.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.includes(searchQuery) ||
      (c.manager_name && c.manager_name.includes(searchQuery))
  );

  const totalBudget = costCenters.reduce((sum, c) => sum + (c.budget || 0), 0);
  const totalSpent = costCenters.reduce((sum, c) => sum + (c.actual_spent || 0), 0);
  const remainingBudget = totalBudget - totalSpent;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <i className="fa-solid fa-diagram-project text-purple-600"></i>
            مراكز التكلفة والمحاسبة التحليلية (Cost Centers)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            إدارة الميزانيات المعتمدة والمصروفات الفعلية per Cost Center لـ{' '}
            <strong className="text-slate-700">{activeCompany.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-sm shadow-md shadow-purple-200 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i>
            إضافة مركز تكلفة جديد
          </button>
          <button
            onClick={() => exportData('cost_centers', filteredCostCenters, 'excel', `مراكز التكلفة - ${activeCompany.name}`)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="تصدير إكسيل"
          >
            <i className="fa-solid fa-file-excel text-emerald-600 ml-1.5"></i>
            Excel
          </button>
          <button
            onClick={() => exportData('cost_centers', filteredCostCenters, 'csv', `مراكز التكلفة - ${activeCompany.name}`)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="تصدير CSV"
          >
            <i className="fa-solid fa-file-csv text-blue-600 ml-1.5"></i>
            CSV
          </button>
          <button
            onClick={() => exportData('cost_centers', filteredCostCenters, 'pdf', `مراكز التكلفة - ${activeCompany.name}`)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="تصدير PDF"
          >
            <i className="fa-solid fa-file-pdf text-rose-600 ml-1.5"></i>
            PDF
          </button>
          <button
            onClick={() => exportData('cost_centers', filteredCostCenters, 'print', `تقرير مراكز التكلفة والمحاسبة التحليلية - ${activeCompany.name}`)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="طباعة التقرير المعتمد"
          >
            <i className="fa-solid fa-print text-purple-700 ml-1.5"></i>
            طباعة
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400">إجمالي الميزانيات المخصصة</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalBudget.toLocaleString()} ر.س</div>
          <span className="text-xs text-purple-600 font-bold mt-1 inline-block">{costCenters.length} مراكز نشطة</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400">إجمالي المنصرف الفعلي</span>
          <div className="text-2xl font-black text-rose-700 mt-1">{totalSpent.toLocaleString()} ر.س</div>
          <span className="text-xs text-slate-400 font-medium">
            معدل الصرف: {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}%
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400">المتبقي من الميزانية المعتمدة</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{remainingBudget.toLocaleString()} ر.س</div>
          <span className="text-xs text-emerald-600 font-bold mt-1 inline-block">سيولة متبقية</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="ابحث بكود المركز، الاسم، أو المسؤول..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-600 transition-colors"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">كود المركز</th>
                <th className="py-3.5 px-4">اسم مركز التكلفة</th>
                <th className="py-3.5 px-4">المسؤول</th>
                <th className="py-3.5 px-4">الميزانية المعتمدة</th>
                <th className="py-3.5 px-4">المنصرف الفعلي</th>
                <th className="py-3.5 px-4">المتبقي</th>
                <th className="py-3.5 px-4">نسبة الاستهلاك</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    <i className="fa-solid fa-spinner fa-spin ml-2"></i> جاري استرجاع مراكز التكلفة...
                  </td>
                </tr>
              ) : filteredCostCenters.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    لا توجد مراكز تكلفة مطابقة للبحث
                  </td>
                </tr>
              ) : (
                filteredCostCenters.map((cc) => {
                  const spentPercent = cc.budget > 0 ? (cc.actual_spent / cc.budget) * 100 : 0;
                  const remaining = cc.budget - cc.actual_spent;
                  return (
                    <tr key={cc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-black text-purple-700">{cc.code}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{cc.name}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">{cc.manager_name || 'مشرف المركز'}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{cc.budget.toLocaleString()} ر.س</td>
                      <td className="py-3.5 px-4 font-bold text-rose-700">{cc.actual_spent.toLocaleString()} ر.س</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700">{remaining.toLocaleString()} ر.س</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${spentPercent > 90 ? 'bg-rose-500' : 'bg-purple-600'}`}
                              style={{ width: `${Math.min(spentPercent, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono font-bold">{spentPercent.toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Cost Center Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden font-sans">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-diagram-project text-purple-400"></i>
                <h3 className="font-bold text-base">إضافة مركز تكلفة جديد</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleAddCostCenter} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم مركز التكلفة *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: مركز إيواء حي الرمال / مركز شحنات الطيران..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم المدير / المشرف المسؤول</label>
                <input
                  type="text"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  placeholder="اسم مشرف المركز..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">الميزانية السنوية المعتمدة (ر.س) *</label>
                <input
                  type="number"
                  step="1000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none"
                  required
                />
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
                  حفظ مركز التكلفة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostCentersPage;
