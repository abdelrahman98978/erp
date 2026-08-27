import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  RefreshCw,
  Box,
  Layers,
  FileSpreadsheet
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
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    setIsItemModalOpen(false);
  };

  const handleSaveStockVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setIsStockVoucherModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
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
              <Box className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="pill-tag-mint" style={{ fontSize: '11px' }}>SMACC ASSETS & STOCK</span>
                <span className="pill-tag-shade" style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', color: '#ffffff' }}>الأصول والإهلاك والمخازن</span>
              </div>
              <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
                إدارة الأصول الثابتة والمخزون
              </h1>
              <p className="text-xs text-zinc-400 mt-1 font-sans">
                سجل الأصول والإهلاكات الدوري، دليل الأصناف والمنتجات، وأذونات الصرف والإضافة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsAssetModalOpen(true)}
              className="button-white-pill"
              style={{ fontSize: '12px', padding: '6px 18px', minHeight: '38px' }}
            >
              <Plus className="w-3.5 h-3.5 ml-1 text-black" />
              <span>+ أصل جديد</span>
            </button>
            <button
              onClick={() => setIsItemModalOpen(true)}
              className="button-outline-on-dark"
              style={{ fontSize: '12px', padding: '6px 16px', minHeight: '38px' }}
            >
              <Box className="w-3.5 h-3.5 ml-1" />
              <span>+ صنف مخزون</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation Buttons */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-3">
        {[
          { id: 'assets', label: 'سجل الأصول الثابتة', icon: Building2 },
          { id: 'inventory', label: 'دليل أصناف المخزون', icon: Box },
          { id: 'stock-vouchers', label: 'أذونات الصرف والإضافة', icon: Layers },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '6px 16px',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: isActive ? '#000000' : '#e4e4e7',
                backgroundColor: isActive ? '#000000' : '#ffffff',
                color: isActive ? '#ffffff' : '#27272a',
                fontWeight: isActive ? 550 : 420,
                fontSize: '12.5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Fixed Assets */}
      {activeTab === 'assets' && (
        <div className="space-y-4">
          <div className="card-pricing" style={{ padding: '16px 20px', borderRadius: '16px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute right-3 top-2.5 text-zinc-400" />
              <input
                type="text"
                placeholder="البحث في الأصول الثابتة..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 pr-9 pl-3 text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAssetModalOpen(true)}
                className="button-primary-pill"
                style={{ fontSize: '12px', padding: '6px 16px', minHeight: '34px' }}
              >
                <Plus className="w-3.5 h-3.5 ml-1" />
                <span>إضافة أصل ثابت</span>
              </button>
              <button
                onClick={() => alert('تم تشغيل وإعادة احتساب الإهلاك التلقائي لجميع الأصول المسجلة وتوليد قيود اليومية!')}
                className="button-outline-on-light"
                style={{ fontSize: '12px', padding: '6px 14px', minHeight: '34px' }}
              >
                <RefreshCw className="w-3.5 h-3.5 ml-1 text-emerald-600" />
                <span>احتساب الإهلاك الدوري</span>
              </button>
            </div>
          </div>

          <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs text-zinc-700">
                <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                  <tr>
                    <th className="p-3.5">رمز الأصل</th>
                    <th className="p-3.5">اسم الأصل الثابت</th>
                    <th className="p-3.5">الفئة / التصنيف</th>
                    <th className="p-3.5">تاريخ الشراء</th>
                    <th className="p-3.5">تكلفة الشراء</th>
                    <th className="p-3.5">نسبة الإهلاك</th>
                    <th className="p-3.5">مجمع الإهلاك</th>
                    <th className="p-3.5">القيمة الدفترية</th>
                    <th className="p-3.5 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="p-3.5 font-mono text-black font-bold">AST-001</td>
                    <td className="p-3.5 font-bold text-black">سيارة تويوتا كامري 2024 (فرع الرياض)</td>
                    <td className="p-3.5 text-zinc-600">وسائل النقل والسيارات</td>
                    <td className="p-3.5 text-zinc-500 font-mono">2024-01-15</td>
                    <td className="p-3.5 font-bold font-mono text-black">95,000 ر.س</td>
                    <td className="p-3.5 text-black font-bold font-mono">20%</td>
                    <td className="p-3.5 text-zinc-600 font-mono">19,000 ر.س</td>
                    <td className="p-3.5 font-bold font-mono text-emerald-700">76,000 ر.س</td>
                    <td className="p-3.5 text-center">
                      <button className="button-outline-on-light" style={{ padding: '2px 8px', fontSize: '10.5px', minHeight: '24px' }}>
                        تفاصيل الأصل
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Inventory Items */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="card-pricing" style={{ padding: '16px 20px', borderRadius: '16px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute right-3 top-2.5 text-zinc-400" />
              <input
                type="text"
                placeholder="البحث في أصناف المخزون..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 pr-9 pl-3 text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsItemModalOpen(true)}
                className="button-primary-pill"
                style={{ padding: '6px 16px', fontSize: '12px', minHeight: '34px' }}
              >
                <Plus className="w-3.5 h-3.5 ml-1" />
                <span>إضافة صنف جديد</span>
              </button>
              <button
                onClick={() => setIsStockVoucherModalOpen(true)}
                className="button-outline-on-light"
                style={{ padding: '6px 16px', fontSize: '12px', minHeight: '34px' }}
              >
                <Box className="w-3.5 h-3.5 ml-1" />
                <span>إذن صرف / إضافة</span>
              </button>
            </div>
          </div>

          <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs text-zinc-700">
                <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
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
                <tbody className="divide-y divide-zinc-100">
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="p-3.5 font-mono text-black font-bold">INV-101</td>
                    <td className="p-3.5 font-bold text-black">عقد استقدام عاملة منزلية (الفلبين)</td>
                    <td className="p-3.5 text-zinc-600">خدمات استقدام</td>
                    <td className="p-3.5">عقد</td>
                    <td className="p-3.5 text-zinc-500 font-mono">12,000 ر.س</td>
                    <td className="p-3.5 font-bold font-mono text-emerald-700">17,500 ر.س</td>
                    <td className="p-3.5 font-bold text-black">15 عقد</td>
                    <td className="p-3.5">
                      <span className="pill-tag-mint" style={{ fontSize: '10.5px' }}>
                        متوفر
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Stock Vouchers */}
      {activeTab === 'stock-vouchers' && (
        <div className="space-y-4">
          <div className="card-pricing" style={{ padding: '16px 20px', borderRadius: '16px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <h3 className="text-sm font-bold text-black m-0">سجل أذونات الصرف والإضافة المخزنية</h3>
            <button
              onClick={() => setIsStockVoucherModalOpen(true)}
              className="button-primary-pill"
              style={{ padding: '6px 16px', fontSize: '12px', minHeight: '34px' }}
            >
              <Plus className="w-3.5 h-3.5 ml-1" />
              <span>+ إذن مخزني جديد</span>
            </button>
          </div>

          <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs text-zinc-700">
                <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                  <tr>
                    <th className="p-3.5">رقم الإذن</th>
                    <th className="p-3.5">النوع</th>
                    <th className="p-3.5">التاريخ</th>
                    <th className="p-3.5">الصنف</th>
                    <th className="p-3.5">الكمية</th>
                    <th className="p-3.5">السبب / الملاحظات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  <tr className="hover:bg-zinc-50">
                    <td className="p-3.5 font-mono font-bold text-black">STK-2026-001</td>
                    <td className="p-3.5">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        إضافة (+)
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-zinc-500">2026-08-01</td>
                    <td className="p-3.5 font-bold text-black">INV-101 - استقدام الفلبين</td>
                    <td className="p-3.5 font-bold font-mono">10 عقود</td>
                    <td className="p-3.5 text-zinc-600">دفعة جديدة من الوكالة الخارجية</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
            <label className="text-xs text-zinc-700 block mb-1 font-semibold">كود الأصل (Asset Code)</label>
            <input
              type="text"
              value={newAsset.code}
              onChange={e => setNewAsset({ ...newAsset, code: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-700 block mb-1 font-semibold">اسم الأصل الثابت</label>
            <input
              type="text"
              required
              placeholder="مثال: سيارة تويوتا هايلوكس 2026"
              value={newAsset.name}
              onChange={e => setNewAsset({ ...newAsset, name: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black placeholder-zinc-400 focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-700 block mb-1 font-semibold">فئة الأصل</label>
            <select
              value={newAsset.category}
              onChange={e => setNewAsset({ ...newAsset, category: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
            >
              <option value="وسائل النقل والسيارات">وسائل النقل والسيارات</option>
              <option value="معدات وإلكترونيات">معدات وإلكترونيات</option>
              <option value="أثاث ومفروشات">أثاث ومفروشات</option>
              <option value="العقارات والمباني">العقارات والمباني</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-700 block mb-1 font-semibold">تاريخ الشراء والاستحواذ</label>
            <input
              type="date"
              value={newAsset.purchaseDate}
              onChange={e => setNewAsset({ ...newAsset, purchaseDate: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-700 block mb-1 font-semibold">تكلفة الشراء (ر.س)</label>
            <input
              type="number"
              required
              placeholder="0.00"
              value={newAsset.cost}
              onChange={e => setNewAsset({ ...newAsset, cost: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-bold focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-700 block mb-1 font-semibold">نسبة الإهلاك السنوية (%)</label>
            <input
              type="number"
              value={newAsset.depreciationRate}
              onChange={e => setNewAsset({ ...newAsset, depreciationRate: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
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
            <label className="text-xs text-zinc-700 block mb-1 font-semibold">رمز الباركود / SKU</label>
            <input
              type="text"
              value={newItem.sku}
              onChange={e => setNewItem({ ...newItem, sku: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-700 block mb-1 font-semibold">اسم الصنف أو الخدمة</label>
            <input
              type="text"
              required
              placeholder="اسم الصنف بالكامل..."
              value={newItem.name}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black placeholder-zinc-400 focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-700 block mb-1 font-semibold">سعر التكلفة (ر.س)</label>
            <input
              type="number"
              placeholder="0.00"
              value={newItem.costPrice}
              onChange={e => setNewItem({ ...newItem, costPrice: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-bold focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-700 block mb-1 font-semibold">سعر البيع الموصى به (ر.س)</label>
            <input
              type="number"
              required
              placeholder="0.00"
              value={newItem.salePrice}
              onChange={e => setNewItem({ ...newItem, salePrice: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-bold text-emerald-700 focus:border-black focus:outline-none"
            />
          </div>
        </div>
      </SmaccFormModal>

      {/* MODAL 3: Stock Voucher Modal */}
      <SmaccFormModal
        isOpen={isStockVoucherModalOpen}
        onClose={() => setIsStockVoucherModalOpen(false)}
        title="إنشاء إذن مخزني (صرف / إضافة)"
        subtitle="تعديل الأرصدة المخزنية المتاحة مباشرة"
        onSubmit={handleSaveStockVoucher}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-700 block mb-1 font-semibold">نوع الإذن</label>
            <select
              value={newStockVoucher.type}
              onChange={e => setNewStockVoucher({ ...newStockVoucher, type: e.target.value as any })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
            >
              <option value="إضافة">إذن إضافة مخزنية (+)</option>
              <option value="صرف">إذن صرف مخزني (-)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-700 block mb-1 font-semibold">الكمية</label>
            <input
              type="number"
              required
              value={newStockVoucher.qty}
              onChange={e => setNewStockVoucher({ ...newStockVoucher, qty: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-bold focus:border-black focus:outline-none"
            />
          </div>
        </div>
      </SmaccFormModal>
    </div>
  );
};

export default SmaccInventoryAssetsPage;
