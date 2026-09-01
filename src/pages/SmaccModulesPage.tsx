import React, { useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { exportData } from '../services/exportService';
import {
  Building2,
  Search,
  Plus,
  FileSpreadsheet,
  RefreshCw,
  ShieldCheck,
  Globe,
  Box,
  Users,
  ShoppingBag,
  Store,
  CreditCard,
  CheckCircle2,
  ExternalLink,
  Zap,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { EcommerceStore, EcommerceStoreOrder } from '../types';

export const SmaccModulesPage: React.FC = () => {
  const { addNotification } = useAppStore();
  const [activeModuleTab, setActiveModuleTab] = useState<'fixed-assets' | 'inventory' | 'sales-collectors' | 'external-links' | 'ecommerce-stores'>('ecommerce-stores');
  const [searchTerm, setSearchTerm] = useState('');
  const [syncingStoreId, setSyncingStoreId] = useState<string | null>(null);

  // E-Commerce Stores Data
  const [stores, setStores] = useState<EcommerceStore[]>([
    {
      id: 'STR-SALLA-01',
      name: 'متجر سلة الرسمي (باقات التأجير والخدمات)',
      platform: 'سلة (Salla)',
      companyId: 'SAF',
      storeUrl: 'https://salla.sa/alsalim-group',
      status: 'متصل',
      lastSyncTime: 'منذ 3 دقائق',
      syncedOrdersCount: 248,
      syncedProductsCount: 18,
      webhookStatus: 'نشط',
      autoSyncOrders: true,
      autoSyncInventory: true
    },
    {
      id: 'STR-ZID-02',
      name: 'منصة زد الرقمية (خدمات التوسط والاستقدام)',
      platform: 'زد (Zid)',
      companyId: 'YAQ',
      storeUrl: 'https://zid.store/yaqoot-recruitment',
      status: 'متصل',
      lastSyncTime: 'منذ 8 دقائق',
      syncedOrdersCount: 114,
      syncedProductsCount: 12,
      webhookStatus: 'نشط',
      autoSyncOrders: true,
      autoSyncInventory: true
    },
    {
      id: 'STR-SHOPIFY-03',
      name: 'متجر شوبيفاي للمجموعة (Shopify Global Portal)',
      platform: 'شوبيفاي (Shopify)',
      companyId: 'KAS',
      storeUrl: 'https://kas-group.myshopify.com',
      status: 'متصل',
      lastSyncTime: 'منذ 15 دقيقة',
      syncedOrdersCount: 89,
      syncedProductsCount: 24,
      webhookStatus: 'نشط',
      autoSyncOrders: true,
      autoSyncInventory: false
    },
    {
      id: 'STR-WOO-04',
      name: 'بوابة ووكومرس للشركات (B2B WooCommerce)',
      platform: 'ووكومرس (WooCommerce)',
      companyId: 'TOP',
      storeUrl: 'https://top-talent.sa/b2b-portal',
      status: 'متصل',
      lastSyncTime: 'منذ 25 دقيقة',
      syncedOrdersCount: 62,
      syncedProductsCount: 8,
      webhookStatus: 'نشط',
      autoSyncOrders: true,
      autoSyncInventory: true
    },
    {
      id: 'STR-MOYASAR-05',
      name: 'بوابة الدفع الإلكتروني المباشر (Moyasar API Gateway)',
      platform: 'بوابة الدفع (Moyasar)',
      companyId: 'SAF',
      storeUrl: 'https://api.moyasar.com/v1',
      status: 'متصل',
      lastSyncTime: 'لحظي (Real-time)',
      syncedOrdersCount: 513,
      syncedProductsCount: 0,
      webhookStatus: 'نشط',
      autoSyncOrders: true,
      autoSyncInventory: false
    }
  ]);

  // E-Commerce Synced Orders Data
  const [storeOrders, setStoreOrders] = useState<EcommerceStoreOrder[]>([
    {
      id: 'EORD-9912',
      storeId: 'STR-SALLA-01',
      platform: 'سلة (Salla)',
      externalOrderNo: '#SAL-2026-881',
      customerName: 'فهد محمد القحطاني',
      customerPhone: '0551122334',
      serviceType: 'باقة تأجير عمالة منزلية (3 أشهر)',
      totalAmount: 6600,
      paymentStatus: 'مدفوع',
      orderStatus: 'قيد التنفيذ',
      createdAt: '2026-08-31 18:20'
    },
    {
      id: 'EORD-9911',
      storeId: 'STR-ZID-02',
      platform: 'زد (Zid)',
      externalOrderNo: '#ZID-55420',
      customerName: 'شركة اليمامة للمقاولات',
      customerPhone: '0509988776',
      serviceType: 'حجز 5 سائقين مهنيين (عقد سنوي)',
      totalAmount: 18500,
      paymentStatus: 'مدفوع',
      orderStatus: 'جديد',
      createdAt: '2026-08-31 17:45'
    },
    {
      id: 'EORD-9910',
      storeId: 'STR-SHOPIFY-03',
      platform: 'شوبيفاي (Shopify)',
      externalOrderNo: '#SH-10492',
      customerName: 'نورة عبد العزيز السبيعي',
      customerPhone: '0543322110',
      serviceType: 'استقدام عاملة منزلية (الفلبين)',
      totalAmount: 17250,
      paymentStatus: 'مدفوع',
      orderStatus: 'مكتمل',
      createdAt: '2026-08-31 16:30'
    },
    {
      id: 'EORD-9909',
      storeId: 'STR-WOO-04',
      platform: 'ووكومرس (WooCommerce)',
      externalOrderNo: '#WC-88219',
      customerName: 'مؤسسة أفق التقنية',
      customerPhone: '0567788990',
      serviceType: 'باقة ضيافة وتنظيف مكتبي شهري',
      totalAmount: 4200,
      paymentStatus: 'مدفوع',
      orderStatus: 'قيد التنفيذ',
      createdAt: '2026-08-31 15:10'
    }
  ]);

  const handleSyncStore = (store: EcommerceStore) => {
    setSyncingStoreId(store.id);
    setTimeout(() => {
      setSyncingStoreId(null);
      addNotification({
        title: `مزامنة ${store.platform}`,
        message: `تم التحقق من ربط متجر (${store.name}) وتحديث المنتجات والمخزون وسحب كافة الطلبات الجديدة بنجاح.`,
        type: 'success'
      });
      setStores(prev => prev.map(s => s.id === store.id ? { ...s, lastSyncTime: 'الآن', syncedOrdersCount: s.syncedOrdersCount + 1 } : s));
    }, 900);
  };

  const handleSyncAllStores = () => {
    setSyncingStoreId('ALL');
    setTimeout(() => {
      setSyncingStoreId(null);
      addNotification({
        title: 'مزامنة كافة المتاجر الإلكترونية',
        message: 'تمت مزامنة قنوات التجارة الإلكترونية (سلة، زد، شوبيفاي، ووكومرس، وبوابات الدفع) ومطابقة الأرصدة مع القيود المحاسبية بنجاح.',
        type: 'success'
      });
      setStores(prev => prev.map(s => ({ ...s, lastSyncTime: 'الآن', status: 'متصل' })));
    }, 1200);
  };

  // Fixed Assets Data Mock
  const fixedAssets = [
    { id: 'AST-001', name: 'سيارة تويوتا كامري 2024 (فرع الرياض)', category: 'وسائل النقل', purchaseDate: '2024-01-15', cost: 95000, accumulatedDep: 19000, netBookValue: 76000, status: 'نشط' },
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
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <Building2 className="w-5 h-5 text-champagne-light" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="pill-tag-mint" style={{ fontSize: '11px' }}>SMACC EXTENDED SUITE</span>
                <span className="pill-tag-shade" style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', color: '#ffffff' }}>الأصول والمخزون والبائعين</span>
              </div>
              <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
                نظام الأقسام الداخلية والخارجية
              </h1>
              <p className="text-xs text-zinc-400 mt-1 font-sans">
                إدارة الأصول الثابتة، المخزون، البائعين والمحصلين، والربط الإلكتروني الخارجي
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveModuleTab('fixed-assets')}
              className="button-white-pill"
              style={{ fontSize: '12px', padding: '6px 16px', minHeight: '38px' }}
            >
              <Plus className="w-3.5 h-3.5 ml-1 text-black" />
              <span>إضافة أصل</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-3">
        {[
          { id: 'ecommerce-stores', label: 'ربط المتاجر الإلكترونية (سلة، زد، شوبيفاي)', icon: ShoppingBag },
          { id: 'fixed-assets', label: 'الأصول الثابتة', icon: Building2 },
          { id: 'inventory', label: 'المخزون', icon: Box },
          { id: 'sales-collectors', label: 'البائعون والمحصلون', icon: Users },
          { id: 'external-links', label: 'الربط الحكومي والمكاتب', icon: Globe },
        ].map((tab) => {
          const isActive = activeModuleTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveModuleTab(tab.id as any)}
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

      {/* Module: E-Commerce & Online Stores */}
      {activeModuleTab === 'ecommerce-stores' && (
        <div className="space-y-6">
          {/* Top Banner with Action Controls */}
          <div className="card-pricing" style={{ padding: '24px', borderRadius: '24px', background: '#ffffff' }}>
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-black m-0">مركز ربط وتزامن المتاجر الإلكترونية وقنوات البيع الرقمية</h2>
                    <span className="pill-tag-mint" style={{ fontSize: '11px' }}>Omnichannel Active</span>
                  </div>
                  <p className="text-xs text-zinc-500 m-0 mt-0.5">
                    الربط اللحظي مع منصات سلة (Salla API v2)، زد (Zid OAuth)، شوبيفاي (Shopify GraphQL)، ووكومرس، وبوابات الدفع
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={syncingStoreId === 'ALL'}
                  onClick={handleSyncAllStores}
                  className="button-primary-pill"
                  style={{ padding: '8px 20px', fontSize: '12px', minHeight: '38px' }}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ml-1.5 ${syncingStoreId === 'ALL' ? 'animate-spin' : ''}`} />
                  <span>{syncingStoreId === 'ALL' ? 'جاري المزامنة الشاملة...' : 'مزامنة جميع المتاجر الآن'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    exportData('سجل_المتاجر_المتصلة', stores, 'excel', 'تقرير_المتاجر_الإلكترونية_المتصلة');
                    addNotification({
                      title: 'تصدير بيانات المتاجر',
                      message: 'تم تصدير تقرير قنوات البيع والمتاجر الإلكترونية بنجاح.',
                      type: 'success'
                    });
                  }}
                  className="button-outline-on-light"
                  style={{ padding: '8px 18px', fontSize: '12px', minHeight: '38px' }}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 ml-1.5 text-champagne-dark" />
                  <span>تصدير تقرير المتاجر</span>
                </button>
              </div>
            </div>

            {/* KPI Cards Band */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <span className="text-xs font-semibold text-zinc-500 block">إجمالي المتاجر المتصلة</span>
                <div className="text-xl font-bold text-black mt-1">{stores.length} قنوات رقمية</div>
                <span className="text-[11px] text-champagne-dark font-semibold mt-0.5 block">✓ 100% متصلة بالإنتاج</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <span className="text-xs font-semibold text-zinc-500 block">إجمالي الطلبات المستلمة</span>
                <div className="text-xl font-mono font-bold text-black mt-1">
                  {stores.reduce((acc, s) => acc + s.syncedOrdersCount, 0).toLocaleString()} طلب
                </div>
                <span className="text-[11px] text-zinc-500 mt-0.5 block">مربوطة بالقيود المحاسبية</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <span className="text-xs font-semibold text-zinc-500 block">الخدمات والباقات المنشورة</span>
                <div className="text-xl font-mono font-bold text-black mt-1">
                  {stores.reduce((acc, s) => acc + s.syncedProductsCount, 0)} باقة معتمدة
                </div>
                <span className="text-[11px] text-zinc-500 mt-0.5 block">تزامن أسعار فوري ZATCA</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <span className="text-xs font-semibold text-zinc-500 block">حالة الـ Webhooks المباشرة</span>
                <div className="text-xl font-bold text-champagne-dark mt-1">نشط ومفعل</div>
                <span className="text-[11px] text-champagne-dark mt-0.5 block">استقبال لحظي &lt; 800ms</span>
              </div>
            </div>
          </div>

          {/* Connected Stores Table */}
          <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
            <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
              <h3 className="text-sm font-bold text-black m-0 flex items-center gap-2">
                <Store className="w-4 h-4 text-black" />
                <span>قائمة المتاجر والقنوات الإلكترونية المربوطة بالنظام</span>
              </h3>
              <span className="text-xs text-zinc-500 font-mono">آخر تدقيق: {new Date().toLocaleTimeString('ar-SA')}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs text-zinc-700">
                <thead className="bg-zinc-100 text-zinc-700 font-bold border-b border-zinc-200">
                  <tr>
                    <th className="p-3.5">المنصة والقناة</th>
                    <th className="p-3.5">اسم المتجر الإلكتروني</th>
                    <th className="p-3.5">الشركة التابعة</th>
                    <th className="p-3.5">رابط المتجر</th>
                    <th className="p-3.5">حالة الربط والـ API</th>
                    <th className="p-3.5">الطلبات المتزامنة</th>
                    <th className="p-3.5">آخر مزامنة</th>
                    <th className="p-3.5 text-center">الإجراءات التفاعلية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {stores.map(store => (
                    <tr key={store.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="p-3.5 font-bold text-black">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-champagne"></span>
                          <span>{store.platform}</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-bold text-black">{store.name}</td>
                      <td className="p-3.5">
                        <span className="pill-tag-shade" style={{ fontSize: '10.5px' }}>{store.companyId}</span>
                      </td>
                      <td className="p-3.5 font-mono text-zinc-600">
                        <a href={store.storeUrl} target="_blank" rel="noreferrer" className="text-black hover:underline flex items-center gap-1">
                          <span>{store.storeUrl.replace('https://', '')}</span>
                          <ExternalLink className="w-3 h-3 text-zinc-400" />
                        </a>
                      </td>
                      <td className="p-3.5">
                        <span className="pill-tag-mint" style={{ fontSize: '10.5px' }}>
                          ✓ {store.status}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-black">{store.syncedOrdersCount} طلب</td>
                      <td className="p-3.5 font-mono text-zinc-500">{store.lastSyncTime}</td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            disabled={syncingStoreId === store.id}
                            onClick={() => handleSyncStore(store)}
                            className="button-primary-pill"
                            style={{ padding: '4px 12px', fontSize: '11px', minHeight: '28px' }}
                          >
                            <RefreshCw className={`w-3 h-3 ml-1 ${syncingStoreId === store.id ? 'animate-spin' : ''}`} />
                            <span>{syncingStoreId === store.id ? 'مزامنة...' : 'مزامنة فورية'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              addNotification({
                                title: `فحص Webhook ${store.platform}`,
                                message: `تم إرسال اختبار Ping لـ Webhook متجر (${store.name}) وجاء الرد (HTTP 200 OK - 42ms).`,
                                type: 'success'
                              });
                            }}
                            className="button-outline-on-light"
                            style={{ padding: '4px 10px', fontSize: '11px', minHeight: '28px' }}
                          >
                            فحص API
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Synced Orders Table */}
          <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
            <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50 flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-bold text-black m-0 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-black" />
                  <span>سجل الطلبات المتزامنة لحظياً من المتاجر الإلكترونية (Live Store Orders)</span>
                </h3>
                <p className="text-xs text-zinc-500 m-0 mt-0.5">يتم إنشاء العقود وتوليد الفواتير الضريبية تلقائياً فور إتمام الدفع بالمتجر</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    exportData('طلبات_المتاجر_الإلكترونية', storeOrders, 'excel', 'سجل_طلبات_المتاجر');
                    addNotification({
                      title: 'تصدير الطلبات',
                      message: 'تم تصدير سجل طلبات المتاجر الإلكترونية بنجاح.',
                      type: 'success'
                    });
                  }}
                  className="button-outline-on-light"
                  style={{ padding: '6px 14px', fontSize: '11.5px', minHeight: '32px' }}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 ml-1 text-champagne-dark" />
                  <span>تصدير الطلبات Excel</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs text-zinc-700">
                <thead className="bg-zinc-100 text-zinc-700 font-bold border-b border-zinc-200">
                  <tr>
                    <th className="p-3.5">رقم الطلب الخارجي</th>
                    <th className="p-3.5">المنصة</th>
                    <th className="p-3.5">اسم العميل</th>
                    <th className="p-3.5">رقم الجوال</th>
                    <th className="p-3.5">الباقة / الخدمة المطلوبة</th>
                    <th className="p-3.5">المبلغ الإجمالي</th>
                    <th className="p-3.5">حالة الدفع</th>
                    <th className="p-3.5">حالة الطلب</th>
                    <th className="p-3.5">تاريخ ووقت الطلب</th>
                    <th className="p-3.5 text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {storeOrders.map(order => (
                    <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-black">{order.externalOrderNo}</td>
                      <td className="p-3.5 font-bold text-black">{order.platform}</td>
                      <td className="p-3.5 font-bold text-black">{order.customerName}</td>
                      <td className="p-3.5 font-mono text-zinc-600">{order.customerPhone}</td>
                      <td className="p-3.5 text-zinc-700">{order.serviceType}</td>
                      <td className="p-3.5 font-mono font-bold text-champagne-dark">{order.totalAmount.toLocaleString()} ر.س</td>
                      <td className="p-3.5">
                        <span className="pill-tag-mint" style={{ fontSize: '10px' }}>
                          ✓ {order.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="pill-tag-shade" style={{ fontSize: '10px' }}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-zinc-500">{order.createdAt}</td>
                      <td className="p-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            addNotification({
                              title: 'عرض وتوثيق الطلب',
                              message: `تم ربط الطلب (${order.externalOrderNo}) وإصدار مسودة العقد الموحد والفاتورة الضريبية ZATCA.`,
                              type: 'success'
                            });
                          }}
                          className="button-primary-pill"
                          style={{ padding: '3px 10px', fontSize: '10.5px', minHeight: '26px' }}
                        >
                          معالجة العقد
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Module 1: Fixed Assets */}
      {activeModuleTab === 'fixed-assets' && (
        <div className="space-y-4">
          <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
              <span className="text-xs text-zinc-500 font-semibold">إجمالي تكلفة الأصول</span>
              <p className="text-xl font-mono font-bold text-black mt-1">1,760,000 ر.س</p>
            </div>
            <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
              <span className="text-xs text-zinc-500 font-semibold">مجمع الإهلاك التراكمي</span>
              <p className="text-xl font-mono font-bold text-black mt-1">203,500 ر.س</p>
            </div>
            <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
              <span className="text-xs text-zinc-500 font-semibold">صافي القيمة الدفترية</span>
              <p className="text-xl font-mono font-bold text-champagne-dark mt-1">1,556,500 ر.س</p>
            </div>
            <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
              <span className="text-xs text-zinc-500 font-semibold">عدد الأصول المسجلة</span>
              <p className="text-xl font-bold text-black mt-1">4 أصول رئيسية</p>
            </div>
          </div>

          <div className="card-pricing" style={{ padding: '16px 20px', borderRadius: '16px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute right-3 top-2.5 text-zinc-400" />
              <input
                type="text"
                placeholder="البحث في الأصول الثابتة..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 pr-9 pl-3 text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  addNotification({
                    title: 'إضافة أصل ثابت جديد',
                    message: 'تم فتح نموذج تسجيل بيانات الأصل الثابت في دليل SMACC.',
                    type: 'info',
                  });
                }}
                className="button-primary-pill"
                style={{ padding: '6px 16px', fontSize: '12px', minHeight: '34px' }}
              >
                <Plus className="w-3.5 h-3.5 ml-1" />
                <span>إضافة أصل جديد</span>
              </button>
              <button
                onClick={() => {
                  addNotification({
                    title: 'احتساب الإهلاك الدوري',
                    message: 'تم احتساب أقساط الإهلاك الشهري وتوليد قيود التسوية المحاسبية تلقائياً.',
                    type: 'success',
                  });
                }}
                className="button-outline-on-light"
                style={{ padding: '6px 16px', fontSize: '12px', minHeight: '34px' }}
              >
                <RefreshCw className="w-3.5 h-3.5 ml-1" />
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
                    <tr key={asset.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="p-3.5 font-mono text-black font-bold">{asset.id}</td>
                      <td className="p-3.5 font-bold text-black">{asset.name}</td>
                      <td className="p-3.5 text-zinc-600">{asset.category}</td>
                      <td className="p-3.5 text-zinc-500 font-mono">{asset.purchaseDate}</td>
                      <td className="p-3.5 font-mono font-bold text-black">{asset.cost.toLocaleString()} ر.س</td>
                      <td className="p-3.5 font-mono text-zinc-600">{asset.accumulatedDep.toLocaleString()} ر.س</td>
                      <td className="p-3.5 font-bold font-mono text-champagne-dark">{asset.netBookValue.toLocaleString()} ر.س</td>
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
        </div>
      )}

      {/* Module 2: Inventory */}
      {activeModuleTab === 'inventory' && (
        <div className="space-y-4">
          <div className="card-pricing" style={{ padding: '16px 20px', borderRadius: '16px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute right-3 top-2.5 text-zinc-400" />
              <input
                type="text"
                placeholder="البحث في المخزون والأصناف..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 pr-9 pl-3 text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  addNotification({
                    title: 'إضافة صنف مخزني',
                    message: 'تم فتح نموذج تسجيل صنف / خدمة جديدة في المخزون.',
                    type: 'info',
                  });
                }}
                className="button-primary-pill"
                style={{ padding: '6px 16px', fontSize: '12px', minHeight: '34px' }}
              >
                <Plus className="w-3.5 h-3.5 ml-1" />
                <span>إضافة صنف جديد</span>
              </button>
              <button
                onClick={() => {
                  exportData(inventoryItems.map(item => ({
                    'رمز الصنف': item.code,
                    'اسم الصنف / الخدمة': item.name,
                    'الفئة': item.category,
                    'الكمية المتاحة': item.qty,
                    'سعر الوحدة': item.unitPrice,
                    'حد إعادة الطلب': item.reorderLevel,
                    'الحالة': item.status
                  })), 'جرد_المخزون_SMACC', 'excel');
                  addNotification({
                    title: 'تصدير الجرد',
                    message: 'تم تصدير تقرير جرد المخزون والأصناف بنجاح إلى ملف Excel.',
                    type: 'success',
                  });
                }}
                className="button-outline-on-light"
                style={{ padding: '6px 16px', fontSize: '12px', minHeight: '34px' }}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 ml-1 text-champagne-dark" />
                <span>تصدير الجرد</span>
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
                    <th className="p-3.5">الكمية المتاحة</th>
                    <th className="p-3.5">سعر الوحدة</th>
                    <th className="p-3.5">حد إعادة الطلب</th>
                    <th className="p-3.5">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {inventoryItems.map(item => (
                    <tr key={item.code} className="hover:bg-zinc-50 transition-colors">
                      <td className="p-3.5 font-mono text-black font-bold">{item.code}</td>
                      <td className="p-3.5 font-bold text-black">{item.name}</td>
                      <td className="p-3.5 text-zinc-600">{item.category}</td>
                      <td className="p-3.5 font-bold font-mono text-black">{item.qty}</td>
                      <td className="p-3.5 font-bold font-mono text-champagne-dark">{item.unitPrice.toLocaleString()} ر.س</td>
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
        </div>
      )}

      {/* Module 3: Sales Representatives & Collectors */}
      {activeModuleTab === 'sales-collectors' && (
        <div className="space-y-4">
          <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
              <span className="text-xs text-zinc-500 font-semibold">إجمالي البائعين النشطين</span>
              <p className="text-2xl font-bold text-black mt-1">2 بائعين</p>
            </div>
            <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
              <span className="text-xs text-zinc-500 font-semibold">إجمالي المحصلين</span>
              <p className="text-2xl font-bold text-black mt-1">1 محصل مبيعات</p>
            </div>
            <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
              <span className="text-xs text-zinc-500 font-semibold">نسبة تحصيل المبيعات</span>
              <p className="text-2xl font-bold text-champagne-dark font-mono mt-1">93.5%</p>
            </div>
          </div>

          <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
            <div className="overflow-x-auto">
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
                    <th className="p-3.5">تحقيق الهدف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {salesReps.map(rep => (
                    <tr key={rep.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="p-3.5 font-mono text-black font-bold">{rep.id}</td>
                      <td className="p-3.5 font-bold text-black">{rep.name}</td>
                      <td className="p-3.5 text-zinc-600">{rep.role}</td>
                      <td className="p-3.5 text-zinc-500 font-mono">{rep.phone}</td>
                      <td className="p-3.5 font-bold font-mono text-black">{rep.totalSales.toLocaleString()} ر.س</td>
                      <td className="p-3.5 text-champagne-dark font-mono font-bold">{rep.collected.toLocaleString()} ر.س</td>
                      <td className="p-3.5 text-zinc-500 font-mono">{rep.pending.toLocaleString()} ر.س</td>
                      <td className="p-3.5 font-bold font-mono text-black">{rep.targetAchieved}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Module 4: External Integrations */}
      {activeModuleTab === 'external-links' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-pricing" style={{ padding: '24px', borderRadius: '24px', background: '#ffffff' }}>
            <div className="flex items-center gap-3">
              <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000000' }}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-black text-sm m-0">ربط الفواتير الإلكترونية ZATCA المرحلة الثانية</h3>
                <p className="text-xs text-zinc-500 m-0 mt-0.5">توليد ملفات XML، التوقيع الرقمي، ورمز الاستجابة السريع (QR)</p>
              </div>
            </div>
            <div className="p-3.5 bg-zinc-50 rounded-2xl text-xs space-y-2 mt-4 border border-zinc-100">
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">حالة الاتصال بالهيئة:</span>
                <span className="pill-tag-mint" style={{ fontSize: '11px' }}>متصل ببيئة الإنتاج (Production)</span>
              </div>
              <div className="flex justify-between items-center">
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
                <h3 className="font-bold text-black text-sm m-0">الربط مع منصة مساند والمكاتب الخارجية</h3>
                <p className="text-xs text-zinc-500 m-0 mt-0.5">مزامنة العقود والتدفقات المالية مع الوكلاء</p>
              </div>
            </div>
            <div className="p-3.5 bg-zinc-50 rounded-2xl text-xs space-y-2 mt-4 border border-zinc-100">
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">الوكلاء المتصلون:</span>
                <span className="text-black font-bold">12 مكتب خارجي (الفلبين، اندونيسيا، كينيا)</span>
              </div>
              <div className="flex justify-between items-center">
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
