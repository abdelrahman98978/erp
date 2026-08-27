import React, { useState } from 'react';
import {
  Building2,
  Package,
  Plus,
  Search,
  Filter,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  DollarSign,
  Box,
  Layers,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import { SmaccFormModal } from '../components/smacc/SmaccFormModal';

export const SmaccInventoryAssetsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assets' | 'inventory' | 'stock-vouchers'>('assets');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isStockVoucherModalOpen, setIsStockVoucherModalOpen] = useState(false);

  // New Asset State
  const [newAsset, setNewAsset] = useState({
    code: 'AST-005',
    name: '',
    category: 'وسائل النقل والسيارات',
    purchaseDate: '2026-08-18',
    cost: '',
    depreciationRate: '20',
    salvageValue: '0',
  });

  // New Inventory Item State
  const [newItem, setNewItem] = useState({
    sku: 'INV-105',
    name: '',
    category: 'خدمات استقدام',
    unit: 'عقد',
    costPrice: '',
    salePrice: '',
    reorderLevel: '5',
    taxRate: '15',
  });

  // New Stock Voucher State
  const [newStockVoucher, setNewStockVoucher] = useState({
    voucherNo: 'STK-2026-012',
    type: 'إضافة' as 'إضافة' | 'صرف',
    date: '2026-08-18',
    itemSku: 'INV-101',
    qty: '1',
    reason: '',
  });

  // Save Handlers
  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAssetModalOpen(false);
    alert(`تم إضافة الأصل الثابت (${newAsset.name}) وتجهيز سجل الإهلاك الخاص به بنجاح!`);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    setIsItemModalOpen(false);
    alert(`تم إضافة الصنف الجديد (${newItem.name}) بسعر بيع ${newItem.salePrice} ر.س إلى دليل المخزون!`);
  };

  const handleSaveStockVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setIsStockVoucherModalOpen(false);
    alert(`تم تنفيذ إذن ${newStockVoucher.type} المخزني رقم (${newStockVoucher.voucherNo}) بنجاح!`);
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-slate-100 font-sans space-y-6 dir-rtl text-right">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/30 rounded-2xl border border-blue-500/30 text-blue-400">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">إدارة الأصول الثابتة والمخزون (SMACC Assets & Stock)</h1>
            <p className="text-xs text-blue-200 mt-0.5">
              سجل الأصول والإهلاكات الدوري، دليل الأصناف والمنتجات، وأذونات الصرف والإضافة
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 space-x-1 space-x-reverse text-xs font-bold">
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'assets' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            سجل الأصول الثابتة
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'inventory' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            دليل أصناف المخزون
          </button>
          <button
            onClick={() => setActiveTab('stock-vouchers')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'stock-vouchers' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            أذونات الصرف والإضافة
          </button>
        </div>
      </div>

      {/* TAB 1: Fixed Assets */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="البحث في الأصول الثابتة..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pr-9 pl-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAssetModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 shadow-md transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة أصل ثابت جديد</span>
              </button>
              <button
                onClick={() => alert('تم تشغيل وإعادة احتساب الإهلاك التلقائي لجميع الأصول المسجلة وتوليد قيود اليومية!')}
                className="px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>احتساب الإهلاك الدوري</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-lg">
            <table className="w-full text-right text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-700">
                <tr>
                  <th className="p-3.5">رمز الأصل</th>
                  <th className="p-3.5">اسم الأصل الثابت</th>
                  <th className="p-3.5">الفئة / التصنيف</th>
                  <th className="p-3.5">تاريخ الشراء</th>
                  <th className="p-3.5">تكلفة الشراء</th>
                  <th className="p-3.5">نسبة الإهلاك</th>
                  <th className="p-3.5">مجمع الإهلاك</th>
                  <th className="p-3.5">القيمة الدفترية الحالية</th>
                  <th className="p-3.5 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-sans">
                <tr className="hover:bg-slate-700/40">
                  <td className="p-3.5 font-mono text-blue-400 font-bold">AST-001</td>
                  <td className="p-3.5 font-semibold text-white">سيارة تويوتا كامري 2024 (فرع الرياض)</td>
                  <td className="p-3.5 text-slate-300">وسائل النقل والسيارات</td>
                  <td className="p-3.5 text-slate-400">2024-01-15</td>
                  <td className="p-3.5 font-bold text-white">95,000 ر.س</td>
                  <td className="p-3.5 text-blue-400 font-bold">20%</td>
                  <td className="p-3.5 text-amber-400 font-bold">19,000 ر.س</td>
                  <td className="p-3.5 font-extrabold text-emerald-400">76,000 ر.س</td>
                  <td className="p-3.5 text-center">
                    <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold">
                      تفاصيل الأصل
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Inventory Items */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="البحث في أصناف المخزون..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pr-9 pl-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsItemModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 shadow-md transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة صنف جديد</span>
              </button>
              <button
                onClick={() => setIsStockVoucherModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <Box className="w-4 h-4" />
                <span>إذن صرف / إضافة مخزني</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-lg">
            <table className="w-full text-right text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-700">
                <tr>
                  <th className="p-3.5">رمز الصنف (SKU)</th>
                  <th className="p-3.5">اسم الصنف / الخدمة</th>
                  <th className="p-3.5">الفئة</th>
                  <th className="p-3.5">وحدة القياس</th>
                  <th className="p-3.5">سعر التكلفة</th>
                  <th className="p-3.5">سعر البيع</th>
                  <th className="p-3.5">الكمية الحالية</th>
                  <th className="p-3.5">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-sans">
                <tr className="hover:bg-slate-700/40">
                  <td className="p-3.5 font-mono text-blue-400 font-bold">INV-101</td>
                  <td className="p-3.5 font-semibold text-white">عقد استقدام عاملة منزلية (الفلبين)</td>
                  <td className="p-3.5">خدمات استقدام</td>
                  <td className="p-3.5">عقد</td>
                  <td className="p-3.5 text-slate-400">12,000 ر.س</td>
                  <td className="p-3.5 font-bold text-emerald-400">17,500 ر.س</td>
                  <td className="p-3.5 font-bold text-white">15 عقد</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      متوفر
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: Add New Asset Modal */}
      <SmaccFormModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        title="تسجيل أصل ثابت جديد في SMACC"
        subtitle="أدخل بيانات الشراء ونسبة الإهلاك السنوية لتوليد جدول الإهلاك"
        onSubmit={handleSaveAsset}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">كود الأصل (Asset Code)</label>
            <input
              type="text"
              value={newAsset.code}
              onChange={e => setNewAsset({ ...newAsset, code: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">اسم الأصل الثابت</label>
            <input
              type="text"
              required
              placeholder="مثال: سيارة تويوتا هايلوكس 2026"
              value={newAsset.name}
              onChange={e => setNewAsset({ ...newAsset, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">فئة الأصل</label>
            <select
              value={newAsset.category}
              onChange={e => setNewAsset({ ...newAsset, category: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
            >
              <option value="وسائل النقل والسيارات">وسائل النقل والسيارات</option>
              <option value="معدات وإلكترونيات">معدات وإلكترونيات</option>
              <option value="أثاث ومفروشات">أثاث ومفروشات</option>
              <option value="العقارات والمباني">العقارات والمباني</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">تاريخ الشراء والاستحواذ</label>
            <input
              type="date"
              value={newAsset.purchaseDate}
              onChange={e => setNewAsset({ ...newAsset, purchaseDate: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">تكلفة الشراء (ر.س)</label>
            <input
              type="number"
              required
              placeholder="0.00"
              value={newAsset.cost}
              onChange={e => setNewAsset({ ...newAsset, cost: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white font-bold text-emerald-400"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">نسبة الإهلاك السنوية (%)</label>
            <input
              type="number"
              value={newAsset.depreciationRate}
              onChange={e => setNewAsset({ ...newAsset, depreciationRate: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white font-mono"
            />
          </div>
        </div>
      </SmaccFormModal>

      {/* MODAL 2: Add New Inventory Item Modal */}
      <SmaccFormModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        title="إضافة صنف جديد في دليل المخزون"
        subtitle="حدد الكود ورسومات الضريبة والأسعار وحد الإعادة"
        onSubmit={handleSaveItem}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">رمز الباركون / SKU</label>
            <input
              type="text"
              value={newItem.sku}
              onChange={e => setNewItem({ ...newItem, sku: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">اسم الصنف أو الخدمة</label>
            <input
              type="text"
              required
              placeholder="اسم الصنف بالكامل..."
              value={newItem.name}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">سعر التكلفة (ر.س)</label>
            <input
              type="number"
              placeholder="0.00"
              value={newItem.costPrice}
              onChange={e => setNewItem({ ...newItem, costPrice: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white font-bold"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">سعر البيع الموصى به (ر.س)</label>
            <input
              type="number"
              required
              placeholder="0.00"
              value={newItem.salePrice}
              onChange={e => setNewItem({ ...newItem, salePrice: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white font-bold text-emerald-400"
            />
          </div>
        </div>
      </SmaccFormModal>

      {/* MODAL 3: Stock Voucher Modal (إذن إضافة/صرف مخزني) */}
      <SmaccFormModal
        isOpen={isStockVoucherModalOpen}
        onClose={() => setIsStockVoucherModalOpen(false)}
        title="إنشاء إذن مخزني (صرف / إضافة)"
        subtitle="تعديل الأرصدة المخزنية المتاحة مباشرة"
        onSubmit={handleSaveStockVoucher}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">نوع الإذن</label>
            <select
              value={newStockVoucher.type}
              onChange={e => setNewStockVoucher({ ...newStockVoucher, type: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
            >
              <option value="إضافة">إذن إضافة مخزنية (+)</option>
              <option value="صرف">إذن صرف مخزني (-)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">الكمية</label>
            <input
              type="number"
              required
              value={newStockVoucher.qty}
              onChange={e => setNewStockVoucher({ ...newStockVoucher, qty: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white font-bold"
            />
          </div>
        </div>
      </SmaccFormModal>
    </div>
  );
};
