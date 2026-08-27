import React, { useState } from 'react';
import {
  Building2,
  Search,
  Plus,
  FileSpreadsheet,
  RefreshCw,
  ShieldCheck,
  Globe
} from 'lucide-react';

export const SmaccModulesPage: React.FC = () => {
  const [activeModuleTab, setActiveModuleTab] = useState<'fixed-assets' | 'inventory' | 'sales-collectors' | 'external-links'>('fixed-assets');
  const [searchTerm, setSearchTerm] = useState('');

  // Fixed Assets Data Mock
  const fixedAssets = [
    { id: 'AST-001', name: 'سيارة تويوتا كامي 2024 (فرع الرياض)', category: 'وسائل النقل', purchaseDate: '2024-01-15', cost: 95000, accumulatedDep: 19000, netBookValue: 76000, status: 'نشط' },
    { id: 'AST-002', name: 'أجهزة حاسوب وسيرفرات إدارية', category: 'معدات وإلكترونيات', purchaseDate: '2023-06-10', cost: 45000, accumulatedDep: 22500, netBookValue: 22500, status: 'نشط' },
    { id: 'AST-003', name: 'تأثيث وتجهيز مركز الإيواء الرئيسي', category: 'أثاث ومفروشات', purchaseDate: '2024-03-01', cost: 120000, accumulatedDep: 12000, netBookValue: 108000, status: 'نشط' },
    { id: 'AST-004', name: 'مبنى المقر الرئيسي - الرياض', category: 'العقارات والمباني', purchaseDate: '2020-01-01', cost: 1500000, accumulatedDep: 150000, netBookValue: 1350000, status: 'نشط' },
  ];

  // Inventory Items Mock
  const inventoryItems = [
    { code: 'INV-101', name: 'عقد استقدام عاملة منزلية (الفلبين)', category: 'خدمات استقدام', qty: 15, unitPrice: 17500, reorderLevel: 5, status: 'متوفر' },
    { code: 'INV-102', name: 'عقد تأجير شهري (عمالة مهنية)', category: 'تأجير تشغيلي', qty: 42, unitPrice: 3500, reorderLevel: 10, status: 'متوفر' },
    { code: 'INV-103', name: 'عقد استقدام سائق خاص (الهند)', category: 'خدمات استقدام', qty: 8, unitPrice: 13000, reorderLevel: 3, status: 'منخفض' },
    { code: 'INV-104', name: 'باقة تنظيف منازل يومية', category: 'خدمات سريعة', qty: 100, unitPrice: 250, reorderLevel: 20, status: 'متوفر' },
  ];

  // Sales Representatives & Collectors Mock
  const salesReps = [
    { id: 'REP-01', name: 'أحمد محمود السعيد', role: 'بائع رئيسي', phone: '0501234567', totalSales: 450000, collected: 410000, pending: 40000, targetAchieved: '92%' },
    { id: 'REP-02', name: 'محمد عبد الله العتيبي', role: 'محصل مبيعات', phone: '0559876543', totalSales: 320000, collected: 320000, pending: 0, targetAchieved: '100%' },
    { id: 'REP-03', name: 'سارة خالد الدوسري', role: 'بائع ومحصل', phone: '0541122334', totalSales: 280000, collected: 250000, pending: 30000, targetAchieved: '89%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
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
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>SMACC REPLACEMENT</span>
            </div>
            <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
              نظام الأقسام الداخلية والخارجية
            </h1>
            <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '4px 0 0 0', fontWeight: 420 }}>
              إدارة الأصول الثابتة، المخزون، البائعين والمحصلين، والربط الإلكتروني الخارجي
            </p>
          </div>
        </div>

        {/* Quick Module Tabs */}
        <div className="flex flex-wrap items-center bg-white/10 p-1.5 rounded-full border border-white/15 gap-1 text-xs">
          {[
            { id: 'fixed-assets', label: 'الأصول الثابتة' },
            { id: 'inventory', label: 'المخزون' },
            { id: 'sales-collectors', label: 'البائعون والمحصلون' },
            { id: 'external-links', label: 'الربط الخارجي' },
          ].map(tab => {
            const isActive = activeModuleTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveModuleTab(tab.id as any)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  fontWeight: isActive ? 550 : 420,
                  background: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? '#000000' : '#d4d4d8',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Module 1: Fixed Assets */}
      {activeModuleTab === 'fixed-assets' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
              <span className="text-xs text-zinc-500 font-medium">إجمالي تكلفة الأصول</span>
              <p className="text-xl font-mono font-bold text-black mt-1">1,760,000 ر.س</p>
            </div>
            <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
              <span className="text-xs text-zinc-500 font-medium">مجمع الإهلاك التراكمي</span>
              <p className="text-xl font-mono font-bold text-black mt-1">203,500 ر.س</p>
            </div>
            <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
              <span className="text-xs text-zinc-500 font-medium">صافي القيمة الدفترية</span>
              <p className="text-xl font-mono font-bold text-emerald-700 mt-1">1,556,500 ر.س</p>
            </div>
            <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
              <span className="text-xs text-zinc-500 font-medium">عدد الأصول المسجلة</span>
              <p className="text-xl font-bold text-black mt-1">4 أصول رئيسية</p>
            </div>
          </div>

          {/* Table Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute right-3 top-3 text-zinc-400" />
              <input
                type="text"
                placeholder="البحث في الأصول الثابتة..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-2 pr-9 pl-3 text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="button-primary-pill" style={{ padding: '6px 16px', fontSize: '12px', minHeight: '34px' }}>
                <Plus className="w-4 h-4 ml-1" />
                <span>إضافة أصل جديد</span>
              </button>
              <button className="button-outline-on-light" style={{ padding: '6px 16px', fontSize: '12px', minHeight: '34px' }}>
                <RefreshCw className="w-4 h-4 ml-1" />
                <span>احتساب الإهلاك الدوري</span>
              </button>
            </div>
          </div>

          {/* Fixed Assets Table */}
          <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3.5">رمز الأصل</th>
                  <th className="p-3.5">اسم الأصل الثابت</th>
                  <th className="p-3.5">التصنيف</th>
                  <th className="p-3.5">تاريخ الشراء</th>
                  <th className="p-3.5">تكلفة الشراء</th>
                  <th className="p-3.5">مجمع الإهلاك</th>
                  <th className="p-3.5">القيمة الدفترية</th>
                  <th className="p-3.5">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {fixedAssets.map(asset => (
                  <tr key={asset.id} className="hover:bg-zinc-50">
                    <td className="p-3.5 font-mono text-black font-bold">{asset.id}</td>
                    <td className="p-3.5 font-semibold text-black">{asset.name}</td>
                    <td className="p-3.5 text-zinc-600">{asset.category}</td>
                    <td className="p-3.5 text-zinc-500 font-mono">{asset.purchaseDate}</td>
                    <td className="p-3.5 font-mono">{asset.cost.toLocaleString()} ر.س</td>
                    <td className="p-3.5 font-mono text-zinc-600">{asset.accumulatedDep.toLocaleString()} ر.س</td>
                    <td className="p-3.5 font-bold font-mono text-emerald-700">{asset.netBookValue.toLocaleString()} ر.س</td>
                    <td className="p-3.5">
                      <span className="pill-tag-mint" style={{ fontSize: '10.5px' }}>
                        {asset.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Module 2: Inventory */}
      {activeModuleTab === 'inventory' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute right-3 top-3 text-zinc-400" />
              <input
                type="text"
                placeholder="البحث في المخزون والأصناف..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-2 pr-9 pl-3 text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="button-primary-pill" style={{ padding: '6px 16px', fontSize: '12px', minHeight: '34px' }}>
                <Plus className="w-4 h-4 ml-1" />
                <span>إضافة صنف جديد</span>
              </button>
              <button className="button-outline-on-light" style={{ padding: '6px 16px', fontSize: '12px', minHeight: '34px' }}>
                <FileSpreadsheet className="w-4 h-4 ml-1 text-emerald-600" />
                <span>تصدير الجرد</span>
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
                  <th className="p-3.5">الكمية المتاحة</th>
                  <th className="p-3.5">سعر الوحدة</th>
                  <th className="p-3.5">حد إعادة الطلب</th>
                  <th className="p-3.5">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {inventoryItems.map(item => (
                  <tr key={item.code} className="hover:bg-zinc-50">
                    <td className="p-3.5 font-mono text-black font-bold">{item.code}</td>
                    <td className="p-3.5 font-semibold text-black">{item.name}</td>
                    <td className="p-3.5 text-zinc-600">{item.category}</td>
                    <td className="p-3.5 font-bold font-mono text-black">{item.qty}</td>
                    <td className="p-3.5 font-bold font-mono text-emerald-700">{item.unitPrice.toLocaleString()} ر.س</td>
                    <td className="p-3.5 text-zinc-500 font-mono">{item.reorderLevel}</td>
                    <td className="p-3.5">
                      <span className={item.status === 'متوفر' ? 'pill-tag-mint' : 'pill-tag-shade'} style={{ fontSize: '10.5px' }}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Module 3: Sales Representatives & Collectors */}
      {activeModuleTab === 'sales-collectors' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
              <span className="text-xs text-zinc-500 font-medium">إجمالي البائعين النشطين</span>
              <p className="text-2xl font-bold text-black mt-1">2 بائعين</p>
            </div>
            <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
              <span className="text-xs text-zinc-500 font-medium">إجمالي المحصلين</span>
              <p className="text-2xl font-bold text-black mt-1">1 محصل مبيعات</p>
            </div>
            <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
              <span className="text-xs text-zinc-500 font-medium">نسبة تحصيل المبيعات</span>
              <p className="text-2xl font-bold text-emerald-700 font-mono mt-1">93.5%</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3.5">الرقم المرجعي</th>
                  <th className="p-3.5">الاسم الكامل</th>
                  <th className="p-3.5">الدور / المسمى</th>
                  <th className="p-3.5">رقم الجوال</th>
                  <th className="p-3.5">إجمالي المبيعات</th>
                  <th className="p-3.5">المبالغ المحصلة</th>
                  <th className="p-3.5">المبالغ المتبقية</th>
                  <th className="p-3.5">نسبة تحقيق الهدف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {salesReps.map(rep => (
                  <tr key={rep.id} className="hover:bg-zinc-50">
                    <td className="p-3.5 font-mono text-black font-bold">{rep.id}</td>
                    <td className="p-3.5 font-semibold text-black">{rep.name}</td>
                    <td className="p-3.5 text-zinc-600">{rep.role}</td>
                    <td className="p-3.5 text-zinc-500 font-mono">{rep.phone}</td>
                    <td className="p-3.5 font-bold font-mono text-black">{rep.totalSales.toLocaleString()} ر.س</td>
                    <td className="p-3.5 text-emerald-700 font-mono font-bold">{rep.collected.toLocaleString()} ر.س</td>
                    <td className="p-3.5 text-zinc-500 font-mono">{rep.pending.toLocaleString()} ر.س</td>
                    <td className="p-3.5 font-bold font-mono text-black">{rep.targetAchieved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Module 4: External Integrations */}
      {activeModuleTab === 'external-links' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-pricing" style={{ padding: '24px', borderRadius: '24px', background: '#ffffff' }}>
            <div className="flex items-center gap-3">
              <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000000' }}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-black text-sm">ربط الفواتير الإلكترونية ZATCA المرحلة الثانية</h3>
                <p className="text-xs text-zinc-500">توليد ملفات XML، التوقيع الرقمي، ورمز الاستجابة السريع (QR)</p>
              </div>
            </div>
            <div className="p-3 bg-zinc-50 rounded-2xl text-xs space-y-2 mt-4 border border-zinc-100">
              <div className="flex justify-between">
                <span className="text-zinc-600">حالة الاتصال بالهيئة:</span>
                <span className="pill-tag-mint" style={{ fontSize: '11px' }}>متصل ببيئة الإنتاج (Production)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">معرف الجهاز (CSID):</span>
                <span className="font-mono text-black font-bold">ZATCA-PROD-998231</span>
              </div>
            </div>
          </div>

          <div className="card-pricing" style={{ padding: '24px', borderRadius: '24px', background: '#ffffff' }}>
            <div className="flex items-center gap-3">
              <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000000' }}>
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-black text-sm">الربط مع منصة مساند والمكاتب الخارجية</h3>
                <p className="text-xs text-zinc-500">مزامنة العقود والتدفقات المالية مع الوكلاء</p>
              </div>
            </div>
            <div className="p-3 bg-zinc-50 rounded-2xl text-xs space-y-2 mt-4 border border-zinc-100">
              <div className="flex justify-between">
                <span className="text-zinc-600">الوكلاء المتصلون:</span>
                <span className="text-black font-bold">12 مكتب خارجي (الفلبين، اندونيسيا، كينيا)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">مزامنة عقود مساند:</span>
                <span className="pill-tag-mint" style={{ fontSize: '11px' }}>تلقائية (كل 15 دقيقة)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmaccModulesPage;
