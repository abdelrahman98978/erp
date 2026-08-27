import React, { useState } from 'react';
import {
  Building2,
  Package,
  Users,
  Search,
  Plus,
  Filter,
  Download,
  FileSpreadsheet,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Sliders,
  DollarSign,
  TrendingUp,
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
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400">إجمالي تكلفة الأصول</span>
              <p className="text-xl font-bold text-white mt-1">1,760,000 ر.س</p>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400">مجمع الإهلاك التراكمي</span>
              <p className="text-xl font-bold text-amber-400 mt-1">203,500 ر.س</p>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400">صافي القيمة الدفترية</span>
              <p className="text-xl font-bold text-emerald-400 mt-1">1,556,500 ر.س</p>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400">عدد الأصول المسجلة</span>
              <p className="text-xl font-bold text-blue-400 mt-1">4 أصول رئيسية</p>
            </div>
          </div>

          {/* Table Toolbar */}
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="البحث في الأصول الثابتة..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pr-9 pl-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-500 transition-colors flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                <span>إضافة أصل جديد</span>
              </button>
              <button className="px-3 py-2 bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-600 transition-colors flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4" />
                <span>احتساب الإهلاك الدوري</span>
              </button>
            </div>
          </div>

          {/* Fixed Assets Table */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full text-right text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-700">
                <tr>
                  <th className="p-3">رمز الأصل</th>
                  <th className="p-3">اسم الأصل الثابت</th>
                  <th className="p-3">التصنيف</th>
                  <th className="p-3">تاريخ الشراء</th>
                  <th className="p-3">تكلفة الشراء</th>
                  <th className="p-3">مجمع الإهلاك</th>
                  <th className="p-3">القيمة الدفترية</th>
                  <th className="p-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {fixedAssets.map(asset => (
                  <tr key={asset.id} className="hover:bg-slate-700/40">
                    <td className="p-3 font-mono text-blue-400 font-bold">{asset.id}</td>
                    <td className="p-3 font-semibold text-white">{asset.name}</td>
                    <td className="p-3">{asset.category}</td>
                    <td className="p-3 text-slate-400">{asset.purchaseDate}</td>
                    <td className="p-3">{asset.cost.toLocaleString()} ر.س</td>
                    <td className="p-3 text-amber-400">{asset.accumulatedDep.toLocaleString()} ر.س</td>
                    <td className="p-3 font-bold text-emerald-400">{asset.netBookValue.toLocaleString()} ر.س</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
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
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="البحث في المخزون والأصناف..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pr-9 pl-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-500 transition-colors flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                <span>إضافة صنف جديد</span>
              </button>
              <button className="px-3 py-2 bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-600 transition-colors flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4" />
                <span>تصدير الجرد</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full text-right text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-700">
                <tr>
                  <th className="p-3">رمز الصنف (SKU)</th>
                  <th className="p-3">اسم الصنف / الخدمة</th>
                  <th className="p-3">الفئة</th>
                  <th className="p-3">الكمية المتاحة</th>
                  <th className="p-3">سعر الوحدة</th>
                  <th className="p-3">حد إعادة الطلب</th>
                  <th className="p-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {inventoryItems.map(item => (
                  <tr key={item.code} className="hover:bg-slate-700/40">
                    <td className="p-3 font-mono text-blue-400 font-bold">{item.code}</td>
                    <td className="p-3 font-semibold text-white">{item.name}</td>
                    <td className="p-3">{item.category}</td>
                    <td className="p-3 font-bold text-white">{item.qty}</td>
                    <td className="p-3 font-bold text-emerald-400">{item.unitPrice.toLocaleString()} ر.س</td>
                    <td className="p-3 text-slate-400">{item.reorderLevel}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] border ${
                        item.status === 'متوفر'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>
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
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400">إجمالي البائعين النشطين</span>
              <p className="text-2xl font-bold text-blue-400 mt-1">2 بائعين</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400">إجمالي المحصلين</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">1 محصل مبيعات</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400">نسبة تحصيل المبيعات</span>
              <p className="text-2xl font-bold text-indigo-400 mt-[4px]">93.5%</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full text-right text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-700">
                <tr>
                  <th className="p-3">الرقم المرجعي</th>
                  <th className="p-3">الاسم الكامل</th>
                  <th className="p-3">الدور / المسمى</th>
                  <th className="p-3">رقم الجوال</th>
                  <th className="p-3">إجمالي المبيعات</th>
                  <th className="p-3">المبالغ المحصلة</th>
                  <th className="p-3">المبالغ المتبقية</th>
                  <th className="p-3">نسبة تحقيق الهدف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {salesReps.map(rep => (
                  <tr key={rep.id} className="hover:bg-slate-700/40">
                    <td className="p-3 font-mono text-blue-400 font-bold">{rep.id}</td>
                    <td className="p-3 font-semibold text-white">{rep.name}</td>
                    <td className="p-3">{rep.role}</td>
                    <td className="p-3 text-slate-400 font-mono">{rep.phone}</td>
                    <td className="p-3 font-bold text-white">{rep.totalSales.toLocaleString()} ر.س</td>
                    <td className="p-3 text-emerald-400 font-bold">{rep.collected.toLocaleString()} ر.س</td>
                    <td className="p-3 text-amber-400">{rep.pending.toLocaleString()} ر.س</td>
                    <td className="p-3 font-bold text-indigo-400">{rep.targetAchieved}</td>
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
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">ربط الفواتير الإلكترونية ZATCA المرحلة الثانية</h3>
                <p className="text-xs text-slate-400">توليد ملفات XML، التوقيع الرقمي، ورمز الاستجابة السريع (QR)</p>
              </div>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">حالة الاتصال بالهيئة:</span>
                <span className="text-emerald-400 font-bold">متصل ببيئة الإنتاج (Production)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">معرف الجهاز (CSID):</span>
                <span className="font-mono text-slate-300">ZATCA-PROD-998231</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">الربط مع منصة مساند والمكاتب الخارجية</h3>
                <p className="text-xs text-slate-400">مزامنة العقود والتدفقات المالية مع الوكلاء</p>
              </div>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">الوكلاء المتصلون:</span>
                <span className="text-blue-400 font-bold">12 مكتب خارجي (الفلبين، اندونيسيا، كينيا)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">مزامنة عقود مساند:</span>
                <span className="text-emerald-400 font-bold">تلقائية (كل 15 دقيقة)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
