import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  RefreshCw,
  Box
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
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>SMACC ASSETS & STOCK</span>
            </div>
            <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
              إدارة الأصول الثابتة والمخزون
            </h1>
            <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '4px 0 0 0', fontWeight: 420 }}>
              سجل الأصول والإهلاكات الدوري، دليل الأصناف والمنتجات، وأذونات الصرف والإضافة
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center bg-white/10 p-1.5 rounded-full border border-white/15 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('assets')}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              fontWeight: activeTab === 'assets' ? 550 : 420,
              background: activeTab === 'assets' ? '#ffffff' : 'transparent',
              color: activeTab === 'assets' ? '#000000' : '#d4d4d8',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            سجل الأصول الثابتة
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              fontWeight: activeTab === 'inventory' ? 550 : 420,
              background: activeTab === 'inventory' ? '#ffffff' : 'transparent',
              color: activeTab === 'inventory' ? '#000000' : '#d4d4d8',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            دليل أصناف المخزون
          </button>
          <button
            onClick={() => setActiveTab('stock-vouchers')}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              fontWeight: activeTab === 'stock-vouchers' ? 550 : 420,
              background: activeTab === 'stock-vouchers' ? '#ffffff' : 'transparent',
              color: activeTab === 'stock-vouchers' ? '#000000' : '#d4d4d8',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            أذونات الصرف والإضافة
          </button>
        </div>
      </div>

      {/* TAB 1: Fixed Assets */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          <div className="card-pricing" style={{ padding: '16px 20px', borderRadius: '16px', background: '#ffffff', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute right-3 top-3 text-zinc-400" />
              <input
                type="text"
                placeholder="البحث في الأصول الثابتة..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="text-input"
                style={{ width: '100%', height: '36px', minHeight: '36px', borderRadius: '9999px', paddingRight: '36px', fontSize: '12px' }}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAssetModalOpen(true)}
                className="button-primary-pill"
                style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
              >
                <Plus className="w-4 h-4 ml-1" />
                <span>+ إضافة أصل ثابت جديد</span>
              </button>
              <button
                onClick={() => alert('تم تشغيل وإعادة احتساب الإهلاك التلقائي لجميع الأصول المسجلة وتوليد قيود اليومية!')}
                className="button-outline-on-light"
                style={{ fontSize: '12.5px', padding: '6px 16px', minHeight: '38px' }}
              >
                <RefreshCw className="w-4 h-4 ml-1 text-emerald-600" />
                <span>احتساب الإهلاك الدوري</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
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
                  <th className="p-3.5">القيمة الدفترية الحالية</th>
                  <th className="p-3.5 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-sans">
                <tr className="hover:bg-zinc-50">
                  <td className="p-3.5 font-mono text-black font-bold">AST-001</td>
                  <td className="p-3.5 font-semibold text-black">سيارة تويوتا كامري 2024 (فرع الرياض)</td>
                  <td className="p-3.5 text-zinc-600">وسائل النقل والسيارات</td>
                  <td className="p-3.5 text-zinc-500 font-mono">2024-01-15</td>
                  <td className="p-3.5 font-bold font-mono text-black">95,000 ر.س</td>
                  <td className="p-3.5 text-black font-bold font-mono">20%</td>
                  <td className="p-3.5 text-zinc-600 font-mono">19,000 ر.س</td>
                  <td className="p-3.5 font-bold font-mono text-emerald-700">76,000 ر.س</td>
                  <td className="p-3.5 text-center">
                    <button className="button-outline-on-light" style={{ padding: '3px 12px', fontSize: '11px', minHeight: '28px' }}>
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
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute right-3 top-3 text-zinc-400" />
              <input
                type="text"
                placeholder="البحث في أصناف المخزون..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-2 pr-9 pl-3 text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsItemModalOpen(true)}
                className="button-primary-pill"
                style={{ padding: '6px 16px', fontSize: '12px', minHeight: '34px' }}
              >
                <Plus className="w-4 h-4 ml-1" />
                <span>إضافة صنف جديد</span>
              </button>
              <button
                onClick={() => setIsStockVoucherModalOpen(true)}
                className="button-outline-on-light"
                style={{ padding: '6px 16px', fontSize: '12px', minHeight: '34px' }}
              >
                <Box className="w-4 h-4 ml-1" />
                <span>إذن صرف / إضافة مخزني</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
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
              <tbody className="divide-y divide-zinc-100 font-sans">
                <tr className="hover:bg-zinc-50">
                  <td className="p-3.5 font-mono text-black font-bold">INV-101</td>
                  <td className="p-3.5 font-semibold text-black">عقد استقدام عاملة منزلية (الفلبين)</td>
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
