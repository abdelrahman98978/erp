import React, { useState, useMemo } from 'react';
import { 
  Building2, Briefcase, FileSpreadsheet, Layers, ShieldCheck, 
  Users, Truck, Receipt, CloudLightning, ShieldAlert, ArrowRight,
  ChevronLeft, Award, Sparkles, MapPin, PhoneCall, ExternalLink,
  CheckCircle2, Flame, Calculator, Store, Plus, Search, Filter,
  Download, Printer, Eye, Edit3, Trash2, Check, X, RefreshCw,
  QrCode, Calendar, Clock, DollarSign, TrendingUp, AlertCircle,
  FileCheck, Shield, ChevronDown, CheckCheck, Send, BarChart3,
  Percent, FileText, ArrowUpRight
} from 'lucide-react';
import { KasNavigationSidebar, KasDepartmentId, KAS_BRANCHES } from '../components/kas/KasNavigationSidebar';
import { ExportDropdown } from '../components/common/ExportDropdown';
import { useCompany } from '../contexts/CompanyContext';
import { useIamSession } from '../contexts/IamSessionContext';
import { useAppStore } from '../stores/appStore';
import { kasEtmadSuiteService } from '../services/kasEtmadSuiteService';
import { tafqeet } from '../services/tafqeetService';

interface KasSuitePortalPageProps {
  onReturnToErp?: () => void;
}

export const KasSuitePortalPage: React.FC<KasSuitePortalPageProps> = ({ onReturnToErp }) => {
  const { setActiveCompanyId } = useCompany();
  const { currentUser } = useIamSession();
  const { addNotification } = useAppStore();

  // Active Department
  const [activeDept, setActiveDept] = useState<KasDepartmentId>('command-center');
  const [selectedBranch, setSelectedBranch] = useState<string>(KAS_BRANCHES[0].name);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals state
  const [showAddTenderModal, setShowAddTenderModal] = useState<boolean>(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState<boolean>(false);
  const [showAddPoModal, setShowAddPoModal] = useState<boolean>(false);
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState<boolean>(false);

  // Form states
  const [newTender, setNewTender] = useState({
    title: '',
    referenceNumber: `KAS-ETM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    entity: 'وزارة الموارد البشرية والتنمية الاجتماعية',
    budget: 450000,
    deadline: '2026-10-15',
    category: 'توريدات وتشغيل',
  });

  const [newSupplier, setNewSupplier] = useState({
    name: '',
    commercialName: '',
    crNumber: '1010' + Math.floor(100000 + Math.random() * 900000),
    category: 'مواد ومستلزمات مكتبية وتقنية',
    contactPerson: '',
    phone: '05' + Math.floor(10000000 + Math.random() * 90000000),
    rating: 5,
  });

  const [newPO, setNewPO] = useState({
    poNumber: `PO-KAS-2026-${Math.floor(100 + Math.random() * 900)}`,
    supplierName: '',
    projectName: 'مشروع توريدات احتفالات اليوم الوطني',
    amount: 85000,
    deliveryDate: '2026-09-20',
  });

  const [newInvoice, setNewInvoice] = useState({
    invoiceNumber: `INV-KAS-${Math.floor(10000 + Math.random() * 90000)}`,
    clientName: 'الهيئة العامة للموانئ',
    amount: 95018.75,
    taxRate: 15,
    notes: 'توريدات وضيافة معتمدة',
  });

  // Dynamic lists from Service
  const [tenders, setTenders] = useState([
    {
      id: 'TND-01',
      referenceNumber: 'ETM-2026-88991',
      title: 'توريد وتشغيل تجهيزات ضيافة لفعاليات اليوم الوطني 96',
      entity: 'وزارة الثقافة — هيئة الفعاليات',
      budget: 680000,
      deadline: '2026-09-18',
      status: 'ترسية معتمدة',
      category: 'فعاليات وتوريد',
      itemsCount: 14,
    },
    {
      id: 'TND-02',
      referenceNumber: 'ETM-2026-90412',
      title: 'تأمين مستلزمات مكتبية وأجهزة تقنية للمقرات الإدارية',
      entity: 'الهيئة العامة للموانئ',
      budget: 340000,
      deadline: '2026-10-01',
      status: 'قيد التسعير',
      category: 'أجهزة وتقنية',
      itemsCount: 22,
    },
    {
      id: 'TND-03',
      referenceNumber: 'ETM-2026-91544',
      title: 'مشروع صيانة وتأهيل وحدات الاستقبال والضيافة',
      entity: 'أمانة منطقة الرياض',
      budget: 520000,
      deadline: '2026-10-10',
      status: 'طرح عام',
      category: 'تشغيل وصيانة',
      itemsCount: 9,
    },
    {
      id: 'TND-04',
      referenceNumber: 'ETM-2026-92811',
      title: 'توريد إعاشة وضيافة متكاملة للمراكز الميدانية',
      entity: 'وزارة الموارد البشرية',
      budget: 410000,
      deadline: '2026-10-25',
      status: 'قيد التقديم',
      category: 'إعاشة وضيافة',
      itemsCount: 35,
    },
  ]);

  const [suppliers, setSuppliers] = useState([
    { id: 'SUP-01', name: 'شركة التوريدات الصناعية المتحدة', category: 'مواد ومعدات', phone: '0501122334', rating: 4.9, activeProjects: 3, totalVolume: 420000 },
    { id: 'SUP-02', name: 'مؤسسة الرياض للضيافة والتموين', category: 'إعاشة وضيافة', phone: '0559988776', rating: 4.8, activeProjects: 2, totalVolume: 285000 },
    { id: 'SUP-03', name: 'شركة التقنية المتقدمة للحوسبة', category: 'أجهزة وأنظمة', phone: '0543322110', rating: 5.0, activeProjects: 4, totalVolume: 610000 },
    { id: 'SUP-04', name: 'مجموعة الأفق لتجهيز الفعاليات', category: 'ديكور وصوتيات', phone: '0538877665', rating: 4.7, activeProjects: 1, totalVolume: 150000 },
  ]);

  const [purchaseOrders, setPurchaseOrders] = useState([
    { id: 'PO-01', poNumber: 'PO-KAS-2026-881', supplierName: 'شركة التوريدات الصناعية المتحدة', project: 'مشروع فعاليات اليوم الوطني', amount: 95000, status: 'تم الصرف', date: '2026-09-01' },
    { id: 'PO-02', poNumber: 'PO-KAS-2026-882', supplierName: 'مؤسسة الرياض للضيافة والتموين', project: 'تجهيزات الإعاشة لهيئة الموانئ', amount: 48500, status: 'قيد التجهيز', date: '2026-09-03' },
    { id: 'PO-03', poNumber: 'PO-KAS-2026-883', supplierName: 'شركة التقنية المتقدمة للحوسبة', project: 'تحديث خوادم وأجهزة أمانة الرياض', amount: 124000, status: 'معتمد للتوريد', date: '2026-09-04' },
  ]);

  const [invoices, setInvoices] = useState([
    { id: 'INV-01', number: 'INV-KAS-9901', client: 'وزارة الثقافة — هيئة الفعاليات', amount: 245000, vat: 36750, total: 281750, date: '2026-09-02', status: 'معتمدة ZATCA', qr: true },
    { id: 'INV-02', number: 'INV-KAS-9902', client: 'الهيئة العامة للموانئ', amount: 82625, vat: 12393.75, total: 95018.75, date: '2026-09-04', status: 'معتمدة ZATCA', qr: true },
    { id: 'INV-03', number: 'INV-KAS-9903', client: 'أمانة منطقة الرياض', amount: 110000, vat: 16500, total: 126500, date: '2026-09-05', status: 'مسودة', qr: false },
  ]);

  // Handle Add Tender
  const handleCreateTender = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTender.title) return;

    const record = {
      id: `TND-${Date.now()}`,
      referenceNumber: newTender.referenceNumber,
      title: newTender.title,
      entity: newTender.entity,
      budget: Number(newTender.budget),
      deadline: newTender.deadline,
      status: 'قيد التسعير',
      category: newTender.category,
      itemsCount: 10,
    };

    setTenders([record, ...tenders]);
    setShowAddTenderModal(false);
    addNotification({
      type: 'success',
      title: 'تم تسجيل المنافسة في كاس بنجاح',
      message: `تم إضافة منافسة "${record.title}" برقم مرجعي ${record.referenceNumber}`,
    });
  };

  // Handle Add Supplier
  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplier.name) return;

    const record = {
      id: `SUP-${Date.now()}`,
      name: newSupplier.name,
      category: newSupplier.category,
      phone: newSupplier.phone,
      rating: Number(newSupplier.rating),
      activeProjects: 1,
      totalVolume: 50000,
    };

    setSuppliers([record, ...suppliers]);
    setShowAddSupplierModal(false);
    addNotification({
      type: 'success',
      title: 'تم اعتماد المورد بنجاح',
      message: `تم إدراج المورد "${record.name}" في سجل موردي كاس المعتمدين`,
    });
  };

  // Export dataset dynamically
  const getExportData = () => {
    switch (activeDept) {
      case 'monafasat':
        return tenders.map(t => ({
          'الرقم المرجعي': t.referenceNumber,
          'عنوان المنافسة': t.title,
          'الجهة الحكومية': t.entity,
          'الميزانية التقديرية (ر.س)': t.budget,
          'الموعد النهائي': t.deadline,
          'الحالة': t.status,
          'القطاع': t.category,
        }));
      case 'suppliers':
        return suppliers.map(s => ({
          'اسم المورد': s.name,
          'التصنيف': s.category,
          'الهاتف': s.phone,
          'التقييم': s.rating,
          'المشاريع النشطة': s.activeProjects,
          'إجمالي التعاملات (ر.س)': s.totalVolume,
        }));
      case 'purchase-orders':
        return purchaseOrders.map(p => ({
          'رقم أمر الصرف': p.poNumber,
          'المورد': p.supplierName,
          'المشروع': p.project,
          'المبلغ': p.amount,
          'الحالة': p.status,
          'التاريخ': p.date,
        }));
      case 'zatca-invoices':
      default:
        return invoices.map(i => ({
          'رقم الفاتورة': i.number,
          'العميل / الجهة': i.client,
          'المبلغ الخاضع للضريبة': i.amount,
          'ضريبة القيمة المضافة 15%': i.vat,
          'الإجمالي شامل الضريبة': i.total,
          'التاريخ': i.date,
          'حالة ZATCA': i.status,
        }));
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0d1013] text-zinc-100 overflow-hidden font-sans" dir="rtl">
      {/* 1. Dedicated KAS Navigation Sidebar */}
      <KasNavigationSidebar
        activeDept={activeDept}
        onSelectDept={setActiveDept}
        onReturnToErp={onReturnToErp}
        selectedBranch={selectedBranch}
        onSelectBranch={setSelectedBranch}
      />

      {/* 2. Main Executive Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0f1316]">
        {/* Top Header Bar with KAS Branding & Quick Controls */}
        <header className="h-16 border-b border-white/10 bg-[#14181c] px-6 flex items-center justify-between shrink-0 shadow-md">
          {/* Right side: Department Title & Active Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white m-0">
                  {activeDept === 'command-center' && 'مركز العمليات والمؤشرات التنفيذية — كاس'}
                  {activeDept === 'monafasat' && 'منصة اعتماد والمنافسات الحكومية المطروحة (2,651+ منافسة)'}
                  {activeDept === 'boq-editor' && 'محرر جداول الكميات والأسعار الذكي (Live Excel BOQ)'}
                  {activeDept === 'suppliers' && 'سجل الموردين والمقاولين المعتمدين لشركة كاس'}
                  {activeDept === 'purchase-orders' && 'أوامر التوريد وصرف المستودعات المركزية (PO)'}
                  {activeDept === 'contracts-projects' && 'ترسية المشاريع والعقود الحكومية السارية'}
                  {activeDept === 'zatca-invoices' && 'الفوترة الإلكترونية ZATCA المرحلة الثانية المشفرة'}
                  {activeDept === 'etmad-cloud-api' && 'مركز تكامل سحابة اعتماد والربط الشبكي (Etmad API)'}
                  {activeDept === 'audit-security' && 'سجل تدقيق الأمان وعزل البيانات والامتثال'}
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  كيان معزول 100%
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 m-0 font-sans">
                نطاق العمل: {selectedBranch} • السجل: 1010789234 • الرقم الضريبي: 310284759200003
              </p>
            </div>
          </div>

          {/* Left side: Export Dropdown, Quick Action, and Return Button */}
          <div className="flex items-center gap-2.5">
            <ExportDropdown
              sectionKey={`kas_${activeDept}`}
              data={getExportData()}
              customTitle={`تصدير بيانات كاس — ${activeDept}`}
              buttonLabel="تصدير بيانات كاس"
              variant="compact"
            />

            {activeDept === 'monafasat' && (
              <button
                type="button"
                onClick={() => setShowAddTenderModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-400 text-black hover:bg-amber-300 shadow-md shadow-amber-500/20 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة منافسة جديدة</span>
              </button>
            )}

            {activeDept === 'suppliers' && (
              <button
                type="button"
                onClick={() => setShowAddSupplierModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-400 text-black hover:bg-amber-300 shadow-md shadow-amber-500/20 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>اعتماد مورد جديد</span>
              </button>
            )}

            {activeDept === 'purchase-orders' && (
              <button
                type="button"
                onClick={() => setShowAddPoModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-400 text-black hover:bg-amber-300 shadow-md shadow-amber-500/20 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>إصدار أمر توريد</span>
              </button>
            )}

            {activeDept === 'zatca-invoices' && (
              <button
                type="button"
                onClick={() => setShowAddInvoiceModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-400 text-black hover:bg-emerald-300 shadow-md shadow-emerald-500/20 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>فاتورة ZATCA جديدة</span>
              </button>
            )}

            {onReturnToErp && (
              <button
                type="button"
                onClick={onReturnToErp}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-colors"
                title="الرجوع إلى لوحة تحكم المجموعة العامة"
              >
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                <span>نظام المجموعة ERP</span>
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Department Content Body */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">

          {/* ========================================================================= */}
          {/* DEPT 1: COMMAND CENTER & EXECUTIVE KPIS */}
          {/* ========================================================================= */}
          {activeDept === 'command-center' && (
            <div className="space-y-6">
              {/* Cinematic Hero Overview Card */}
              <div className="rounded-2xl p-6 bg-gradient-to-l from-[#182026] via-[#141a1f] to-[#101417] border border-amber-500/20 shadow-xl relative overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        KAS ENTERPRISE PLATFORM
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">
                        نطاق مستقل ومحمي — 0 تسريب بين الشركات
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white m-0">
                      لوحة قيادة العمليات والمنافسات — مؤسسة كاس
                    </h2>
                    <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
                      إدارة مركزية للمنافسات الحكومية عبر منصة اعتماد، كراسات وجداول الكميات (BOQ)، عقود التوريد والصرف للمشاريع، والفوترة الإلكترونية المشفرة لـ ZATCA بمعزل تام عن شركات الاستقدام الأخرى.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveDept('monafasat')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-black hover:bg-amber-300 shadow-md shadow-amber-500/20 flex items-center gap-2"
                    >
                      <Layers className="w-4 h-4" />
                      <span>تصفح المنافسات (2,651)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDept('boq-editor')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1d252c] text-white hover:bg-[#252f38] border border-white/15 flex items-center gap-2"
                    >
                      <Calculator className="w-4 h-4 text-emerald-400" />
                      <span>محرر BOQ الذكي</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl p-4 bg-[#14181c] border border-white/10 shadow-md">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                    <span>إجمالي المنافسات المسجلة</span>
                    <Layers className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white">2,651</div>
                  <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-bold">
                    <TrendingUp className="w-3 h-3" />
                    <span>سجل شيت كاس الشامل</span>
                  </div>
                </div>

                <div className="rounded-2xl p-4 bg-[#14181c] border border-white/10 shadow-md">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                    <span>المبيعات والفواتير المعتمدة</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400">106,006 ر.س</div>
                  <div className="text-[11px] text-zinc-400 mt-1 font-mono">
                    فواتير ZATCA المرحلة الثانية
                  </div>
                </div>

                <div className="rounded-2xl p-4 bg-[#14181c] border border-white/10 shadow-md">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                    <span>المشاريع والعقود الجارية</span>
                    <Award className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-black text-purple-300">12 مشروعاً</div>
                  <div className="text-[11px] text-emerald-400 mt-1 font-bold">
                    نسبة الترسية 56.6%
                  </div>
                </div>

                <div className="rounded-2xl p-4 bg-[#14181c] border border-white/10 shadow-md">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                    <span>الموردون المعتمدون</span>
                    <Store className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-blue-300">48 مورداً</div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    سجل الموردين والمقاولين
                  </div>
                </div>
              </div>

              {/* Two Column Section: Recent Tenders & Live Invoices */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Tenders */}
                <div className="rounded-2xl p-5 bg-[#14181c] border border-white/10 shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span>أحدث المنافسات الحكومية المعتمدة لشركة كاس</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveDept('monafasat')}
                      className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      <span>عرض الكل</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {tenders.slice(0, 3).map(t => (
                      <div key={t.id} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-400/10 px-1.5 py-0.5 rounded">
                              {t.referenceNumber}
                            </span>
                            <span className="text-[10.5px] px-2 py-0.2 rounded-full bg-white/5 text-zinc-300">
                              {t.entity}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-white mt-1 truncate">
                            {t.title}
                          </div>
                          <div className="text-[10.5px] text-zinc-400 mt-0.5">
                            الميزانية: <strong className="text-emerald-400 font-mono">{t.budget.toLocaleString()} ر.س</strong> • الموعد: {t.deadline}
                          </div>
                        </div>

                        <span className="text-[10px] px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold shrink-0">
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent ZATCA Invoices */}
                <div className="rounded-2xl p-5 bg-[#14181c] border border-white/10 shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-emerald-400" />
                      <span>الفواتير الضريبية المشفرة ZATCA</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveDept('zatca-invoices')}
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      <span>عرض الفواتير</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {invoices.map(inv => (
                      <div key={inv.id} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-400/10 px-1.5 py-0.5 rounded">
                              {inv.number}
                            </span>
                            <span className="text-xs font-bold text-white">{inv.client}</span>
                          </div>
                          <div className="text-[10.5px] text-zinc-400 mt-1 font-mono">
                            الإجمالي: <strong className="text-white">{inv.total.toLocaleString()} ر.س</strong> (شامل الضريبة 15%: {inv.vat.toLocaleString()} ر.س)
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {inv.qr && (
                            <span className="p-1 rounded bg-white/10 text-white" title="QR مشفر ZATCA">
                              <QrCode className="w-4 h-4 text-emerald-400" />
                            </span>
                          )}
                          <span className="text-[10px] px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold">
                            {inv.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DEPT 2: ETMAD MONAFASAT DIRECTORY */}
          {/* ========================================================================= */}
          {activeDept === 'monafasat' && (
            <div className="space-y-4">
              {/* Search & Filter bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#14181c] border border-white/10">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-zinc-400 absolute right-3 top-3" />
                  <input
                    type="text"
                    placeholder="ابحث برقم المنافسة أو الجهة الحكومية أو المسمى..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl pr-9 pl-3 py-2 text-xs text-white outline-none focus:border-amber-400 font-sans"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="all">كافة الحالات</option>
                    <option value="ترسية معتمدة">ترسية معتمدة</option>
                    <option value="قيد التسعير">قيد التسعير</option>
                    <option value="طرح عام">طرح عام</option>
                  </select>
                </div>
              </div>

              {/* Tenders Table */}
              <div className="rounded-2xl bg-[#14181c] border border-white/10 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-[#181d22] text-zinc-400 border-b border-white/10">
                      <tr>
                        <th className="p-3.5 font-bold">الرقم المرجعي</th>
                        <th className="p-3.5 font-bold">عنوان المنافسة</th>
                        <th className="p-3.5 font-bold">الجهة الحكومية</th>
                        <th className="p-3.5 font-bold">الميزانية التقديرية</th>
                        <th className="p-3.5 font-bold">تاريخ الإغلاق</th>
                        <th className="p-3.5 font-bold">البنود</th>
                        <th className="p-3.5 font-bold">الحالة</th>
                        <th className="p-3.5 font-bold text-center">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {tenders
                        .filter(t => statusFilter === 'all' || t.status === statusFilter)
                        .filter(t => !searchQuery || t.title.includes(searchQuery) || t.referenceNumber.includes(searchQuery) || t.entity.includes(searchQuery))
                        .map(t => (
                          <tr key={t.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3.5 font-mono font-bold text-amber-400">{t.referenceNumber}</td>
                            <td className="p-3.5 font-bold text-white max-w-xs truncate">{t.title}</td>
                            <td className="p-3.5 text-zinc-300">{t.entity}</td>
                            <td className="p-3.5 font-mono font-bold text-emerald-400">{t.budget.toLocaleString()} ر.س</td>
                            <td className="p-3.5 text-zinc-400">{t.deadline}</td>
                            <td className="p-3.5 text-zinc-400">{t.itemsCount} صنف</td>
                            <td className="p-3.5">
                              <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                {t.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveDept('boq-editor');
                                  addNotification({
                                    type: 'info',
                                    title: 'تم فتح كراسة BOQ',
                                    message: `تم تحميل بنود المنافسة ${t.referenceNumber} في محرر الأسعار الذكي`,
                                  });
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 font-bold text-[11px] inline-flex items-center gap-1"
                              >
                                <Calculator className="w-3 h-3" />
                                <span>تسعير BOQ</span>
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

          {/* ========================================================================= */}
          {/* DEPT 3: LIVE EXCEL BOQ EDITOR */}
          {/* ========================================================================= */}
          {activeDept === 'boq-editor' && (
            <div className="space-y-4">
              {/* BOQ Header Summary Card */}
              <div className="rounded-2xl p-4 bg-[#14181c] border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10.5px] font-bold">
                      BOQ-2026-ETM-88991
                    </span>
                    <span className="text-xs text-zinc-400">مؤسسة كاس للتجارة — كراسة التوريدات المعتمدة</span>
                  </div>
                  <h2 className="text-base font-bold text-white mt-1">
                    كراسة أسعار وتكاليف: توريد وتجهيزات ضيافة لفعاليات اليوم الوطني 96
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    حساب الهامش الربحي، الضريبة 15%، والتفقيط التلقائي بالريال السعودي
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-center">
                    <div className="text-[10px] text-zinc-400 font-bold">الإجمالي قبل الضريبة</div>
                    <div className="text-base font-black text-white font-mono">245,000 ر.س</div>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-center">
                    <div className="text-[10px] text-emerald-400 font-bold">الإجمالي شامل الضريبة 15%</div>
                    <div className="text-base font-black text-emerald-300 font-mono">281,750 ر.س</div>
                  </div>
                </div>
              </div>

              {/* Live BOQ Table */}
              <div className="rounded-2xl bg-[#14181c] border border-white/10 overflow-hidden shadow-lg">
                <div className="p-3 border-b border-white/10 bg-[#181d22] flex items-center justify-between">
                  <div className="text-xs font-bold text-zinc-300 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>جدول بنود الكميات والتسعير المعتمد (Live Sheet):</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    التفقيط: <strong>مائتان وواحد وثمانون ألفاً وسبعمائة وخمسون ريالاً سعودياً فقط لا غير</strong>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-[#12161a] text-zinc-400 border-b border-white/10">
                      <tr>
                        <th className="p-3 font-bold">#</th>
                        <th className="p-3 font-bold">وصف البند / الصنف</th>
                        <th className="p-3 font-bold">الوحدة</th>
                        <th className="p-3 font-bold">الكمية</th>
                        <th className="p-3 font-bold">سعر تكلفة الشراء</th>
                        <th className="p-3 font-bold">سعر بيع كاس</th>
                        <th className="p-3 font-bold">الهامش الربحي</th>
                        <th className="p-3 font-bold">الإجمالي (شامل الضريبة 15%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      <tr className="hover:bg-white/5">
                        <td className="p-3 text-zinc-500 font-sans">1</td>
                        <td className="p-3 font-bold text-white font-sans">أطقم ضيافة فاخرة متكاملة للصالات الرسمية</td>
                        <td className="p-3 text-zinc-400 font-sans">طقم</td>
                        <td className="p-3 text-white">40</td>
                        <td className="p-3 text-zinc-400">1,800 ر.س</td>
                        <td className="p-3 text-amber-300 font-bold">2,600 ر.س</td>
                        <td className="p-3 text-emerald-400 font-bold">+44.4%</td>
                        <td className="p-3 text-emerald-300 font-bold">119,600 ر.س</td>
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="p-3 text-zinc-500 font-sans">2</td>
                        <td className="p-3 font-bold text-white font-sans">تجهيز بوفيهات إعاشة وخدمة ضيافة VIP يومية</td>
                        <td className="p-3 text-zinc-400 font-sans">يوم</td>
                        <td className="p-3 text-white">5</td>
                        <td className="p-3 text-zinc-400">12,000 ر.س</td>
                        <td className="p-3 text-amber-300 font-bold">18,500 ر.س</td>
                        <td className="p-3 text-emerald-400 font-bold">+54.1%</td>
                        <td className="p-3 text-emerald-300 font-bold">106,375 ر.س</td>
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="p-3 text-zinc-500 font-sans">3</td>
                        <td className="p-3 font-bold text-white font-sans">شاشات عرض تفاعلية ونظم صوتية للمنصة الرئيسية</td>
                        <td className="p-3 text-zinc-400 font-sans">باقة</td>
                        <td className="p-3 text-white">2</td>
                        <td className="p-3 text-zinc-400">18,000 ر.س</td>
                        <td className="p-3 text-amber-300 font-bold">24,250 ر.س</td>
                        <td className="p-3 text-emerald-400 font-bold">+34.7%</td>
                        <td className="p-3 text-emerald-300 font-bold">55,775 ر.س</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DEPT 4: SUPPLIERS & SUBCONTRACTORS REGISTRY */}
          {/* ========================================================================= */}
          {activeDept === 'suppliers' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suppliers.map(sup => (
                  <div key={sup.id} className="p-4 rounded-2xl bg-[#14181c] border border-white/10 shadow-md space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{sup.name}</div>
                          <div className="text-[10.5px] text-zinc-400">{sup.category}</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300">
                        ⭐ {sup.rating}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-zinc-400">
                        <span>رقم الاتصال:</span>
                        <span className="text-white font-mono">{sup.phone}</span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-400">
                        <span>المشاريع المشتركة:</span>
                        <span className="text-emerald-400 font-bold">{sup.activeProjects} مشاريع</span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-400">
                        <span>إجمالي التعاملات:</span>
                        <span className="text-white font-mono font-bold">{sup.totalVolume.toLocaleString()} ر.س</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowAddPoModal(true);
                        setNewPO(prev => ({ ...prev, supplierName: sup.name }));
                      }}
                      className="w-full py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-amber-300 font-bold border border-white/10 flex items-center justify-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>إصدار أمر صرف / توريد للمورد</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DEPT 5: PURCHASE ORDERS & WAREHOUSING */}
          {/* ========================================================================= */}
          {activeDept === 'purchase-orders' && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-[#14181c] border border-white/10 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-[#181d22] text-zinc-400 border-b border-white/10">
                      <tr>
                        <th className="p-3.5 font-bold">رقم أمر الصرف</th>
                        <th className="p-3.5 font-bold">المورد المعتمد</th>
                        <th className="p-3.5 font-bold">المشروع المستفيد</th>
                        <th className="p-3.5 font-bold">المبلغ المصروف</th>
                        <th className="p-3.5 font-bold">تاريخ الإصدار</th>
                        <th className="p-3.5 font-bold">حالة التوريد</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {purchaseOrders.map(po => (
                        <tr key={po.id} className="hover:bg-white/5">
                          <td className="p-3.5 font-mono font-bold text-amber-400">{po.poNumber}</td>
                          <td className="p-3.5 font-bold text-white">{po.supplierName}</td>
                          <td className="p-3.5 text-zinc-300">{po.project}</td>
                          <td className="p-3.5 font-mono font-bold text-emerald-400">{po.amount.toLocaleString()} ر.س</td>
                          <td className="p-3.5 text-zinc-400">{po.date}</td>
                          <td className="p-3.5">
                            <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {po.status}
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

          {/* ========================================================================= */}
          {/* DEPT 6: AWARDS & CONTRACTS */}
          {/* ========================================================================= */}
          {activeDept === 'contracts-projects' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#14181c] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      مشروع ساري
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">CNT-KAS-2026-01</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">مشروع توريدات احتفالات اليوم الوطني 96 لميناء جدة</h3>
                  <p className="text-xs text-zinc-400">الجهة المتعاقدة: الهيئة العامة للموانئ • القيمة: 95,018.75 ر.س</p>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>نسبة الإنجاز المعتمدة:</span>
                      <span className="text-emerald-400 font-bold">85%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#14181c] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                      قيد التنفيذ
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">CNT-KAS-2026-02</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">عقد تأمين أجهزة وتقنيات المقرات الإدارية التابعة</h3>
                  <p className="text-xs text-zinc-400">الجهة المتعاقدة: أمانة منطقة الرياض • القيمة: 340,000 ر.س</p>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>نسبة الإنجاز المعتمدة:</span>
                      <span className="text-amber-400 font-bold">60%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: '60%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DEPT 7: ZATCA INVOICES & TAX */}
          {/* ========================================================================= */}
          {activeDept === 'zatca-invoices' && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-[#14181c] border border-white/10 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-[#181d22] text-zinc-400 border-b border-white/10">
                      <tr>
                        <th className="p-3.5 font-bold">رقم الفاتورة</th>
                        <th className="p-3.5 font-bold">الجهة / العميل</th>
                        <th className="p-3.5 font-bold">المبلغ قبل الضريبة</th>
                        <th className="p-3.5 font-bold">الضريبة 15%</th>
                        <th className="p-3.5 font-bold">الإجمالي النهائي</th>
                        <th className="p-3.5 font-bold">التاريخ</th>
                        <th className="p-3.5 font-bold text-center">رمز QR</th>
                        <th className="p-3.5 font-bold">حالة ZATCA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {invoices.map(inv => (
                        <tr key={inv.id} className="hover:bg-white/5">
                          <td className="p-3.5 font-bold text-emerald-400">{inv.number}</td>
                          <td className="p-3.5 font-sans font-bold text-white">{inv.client}</td>
                          <td className="p-3.5 text-zinc-300">{inv.amount.toLocaleString()} ر.س</td>
                          <td className="p-3.5 text-amber-300">{inv.vat.toLocaleString()} ر.س</td>
                          <td className="p-3.5 text-emerald-300 font-bold">{inv.total.toLocaleString()} ر.س</td>
                          <td className="p-3.5 text-zinc-400 font-sans">{inv.date}</td>
                          <td className="p-3.5 text-center">
                            {inv.qr ? (
                              <span className="p-1 rounded bg-emerald-500/20 text-emerald-400 inline-block" title="مشفر ZATCA">
                                <QrCode className="w-4 h-4" />
                              </span>
                            ) : (
                              <span className="text-zinc-500">—</span>
                            )}
                          </td>
                          <td className="p-3.5 font-sans">
                            <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {inv.status}
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

          {/* ========================================================================= */}
          {/* DEPT 8: ETMAD CLOUD API & INTEGRATION */}
          {/* ========================================================================= */}
          {activeDept === 'etmad-cloud-api' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-[#14181c] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                      <CloudLightning className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">بوابة الربط والتكامل المباشر مع منصة اعتماد الحكومية</h3>
                      <p className="text-xs text-zinc-400 font-mono">Etmad Cloud Gateway: https://api.etimad.sa/v2/monafasat/kas</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>متصل ونشط (Connected)</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs">
                    <span className="text-zinc-500 block mb-1">معرّف المورد المعتمد:</span>
                    <span className="text-amber-400 font-mono font-bold">KAS-VEND-99042</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs">
                    <span className="text-zinc-500 block mb-1">آخر مزامنة آلية:</span>
                    <span className="text-emerald-400 font-mono font-bold">منذ دقيقتين (2 mins ago)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs">
                    <span className="text-zinc-500 block mb-1">حالة الـ Webhooks:</span>
                    <span className="text-cyan-400 font-mono font-bold">Active (100% Delivery)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DEPT 9: AUDIT LOG & DATA ISOLATION */}
          {/* ========================================================================= */}
          {activeDept === 'audit-security' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-[#14181c] border border-emerald-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">شهادة الامتثال والعزل التام لمؤسسة كاس (Tenant Isolation Certificate)</h3>
                      <p className="text-xs text-zinc-400">Zero Cross-Tenant Leakage • معزولة كلياً عن شركات الاستقدام</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                    الامتثال 100%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-zinc-300 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم حجب أقسام شركة كاس بنجاح من القوائم الجانبية لشركات الصفا الماسي والياقوت وتوباز.</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>سجلات المناقصات والـ BOQ مقيدة بمفتاح tenantId و company_id = 'KAS'.</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>فواتير ZATCA مرتبطة بالرقم الضريبي المستقل 310284759200003 دون أي تداخل محاسبي.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD TENDER MODAL */}
      {/* ========================================================================= */}
      {showAddTenderModal && (
        <div className="fixed inset-0 z-[500] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#171c20] border border-white/15 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in">
            <div className="p-4 border-b border-white/10 bg-[#1a2126] flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>تسجيل منافسة جديدة — اعتماد كاس</span>
              </h3>
              <button onClick={() => setShowAddTenderModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTender} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1 font-bold">عنوان المنافسة:</label>
                <input
                  type="text"
                  required
                  value={newTender.title}
                  onChange={e => setNewTender({ ...newTender, title: e.target.value })}
                  placeholder="مثال: توريد وتجهيز منصات ومستلزمات ضيافة..."
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">الجهة الحكومية:</label>
                  <input
                    type="text"
                    required
                    value={newTender.entity}
                    onChange={e => setNewTender({ ...newTender, entity: e.target.value })}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">الميزانية التقديرية (ر.س):</label>
                  <input
                    type="number"
                    required
                    value={newTender.budget}
                    onChange={e => setNewTender({ ...newTender, budget: Number(e.target.value) })}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">تاريخ الإغلاق:</label>
                  <input
                    type="date"
                    required
                    value={newTender.deadline}
                    onChange={e => setNewTender({ ...newTender, deadline: e.target.value })}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">القطاع / التصنيف:</label>
                  <input
                    type="text"
                    value={newTender.category}
                    onChange={e => setNewTender({ ...newTender, category: e.target.value })}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTenderModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white bg-white/5"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-black hover:bg-amber-300 shadow-md"
                >
                  حفظ وتسجيل المنافسة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD SUPPLIER MODAL */}
      {/* ========================================================================= */}
      {showAddSupplierModal && (
        <div className="fixed inset-0 z-[500] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#171c20] border border-white/15 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in">
            <div className="p-4 border-b border-white/10 bg-[#1a2126] flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Store className="w-4 h-4 text-blue-400" />
                <span>اعتماد مورد / مقاول جديد لشركة كاس</span>
              </h3>
              <button onClick={() => setShowAddSupplierModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1 font-bold">اسم الشركة أو المورد:</label>
                <input
                  type="text"
                  required
                  value={newSupplier.name}
                  onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  placeholder="مثال: شركة التوريدات اللوجستية الحديثة"
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">التصنيف والنشاط:</label>
                  <input
                    type="text"
                    value={newSupplier.category}
                    onChange={e => setNewSupplier({ ...newSupplier, category: e.target.value })}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">رقم الهاتف / الجوال:</label>
                  <input
                    type="text"
                    value={newSupplier.phone}
                    onChange={e => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSupplierModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white bg-white/5"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-black hover:bg-amber-300 shadow-md"
                >
                  اعتماد المورد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD PURCHASE ORDER MODAL */}
      {/* ========================================================================= */}
      {showAddPoModal && (
        <div className="fixed inset-0 z-[500] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#171c20] border border-white/15 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in">
            <div className="p-4 border-b border-white/10 bg-[#1a2126] flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-purple-400" />
                <span>إصدار أمر توريد / صرف مستودعات (PO)</span>
              </h3>
              <button onClick={() => setShowAddPoModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setPurchaseOrders([{ id: `PO-${Date.now()}`, poNumber: newPO.poNumber, supplierName: newPO.supplierName || 'شركة التوريدات الصناعية', project: newPO.projectName, amount: Number(newPO.amount), status: 'معتمد للتوريد', date: '2026-09-05' }, ...purchaseOrders]);
                setShowAddPoModal(false);
                addNotification({ type: 'success', title: 'تم إصدار أمر التوريد', message: `تم تسجيل ${newPO.poNumber} لمستودعات كاس بنجاح` });
              }} 
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-zinc-300 mb-1 font-bold">اسم المورد:</label>
                <input
                  type="text"
                  required
                  value={newPO.supplierName}
                  onChange={e => setNewPO({ ...newPO, supplierName: e.target.value })}
                  placeholder="اختر أو اكتب اسم المورد المعتمد..."
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-bold">المشروع المستفيد:</label>
                <input
                  type="text"
                  required
                  value={newPO.projectName}
                  onChange={e => setNewPO({ ...newPO, projectName: e.target.value })}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">المبلغ (ر.س):</label>
                  <input
                    type="number"
                    required
                    value={newPO.amount}
                    onChange={e => setNewPO({ ...newPO, amount: Number(e.target.value) })}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">تاريخ التوريد المتوقع:</label>
                  <input
                    type="date"
                    required
                    value={newPO.deliveryDate}
                    onChange={e => setNewPO({ ...newPO, deliveryDate: e.target.value })}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPoModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white bg-white/5"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-500 text-white hover:bg-purple-400 shadow-md"
                >
                  اعتماد أمر الصرف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ADD ZATCA INVOICE MODAL */}
      {/* ========================================================================= */}
      {showAddInvoiceModal && (
        <div className="fixed inset-0 z-[500] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#171c20] border border-white/15 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in">
            <div className="p-4 border-b border-white/10 bg-[#1a2126] flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-400" />
                <span>إصدار فاتورة ضريبية ZATCA المرحلة 2</span>
              </h3>
              <button onClick={() => setShowAddInvoiceModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const vat = Number(newInvoice.amount) * 0.15;
                const total = Number(newInvoice.amount) + vat;
                setInvoices([{ id: `INV-${Date.now()}`, number: newInvoice.invoiceNumber, client: newInvoice.clientName, amount: Number(newInvoice.amount), vat, total, date: '2026-09-05', status: 'معتمدة ZATCA', qr: true }, ...invoices]);
                setShowAddInvoiceModal(false);
                addNotification({ type: 'success', title: 'تم اعتماد الفاتورة في ZATCA', message: `الفاتورة ${newInvoice.invoiceNumber} مشفرة بالـ QR وجاهزة للتسليم` });
              }} 
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-zinc-300 mb-1 font-bold">اسم الجهة / العميل:</label>
                <input
                  type="text"
                  required
                  value={newInvoice.clientName}
                  onChange={e => setNewInvoice({ ...newInvoice, clientName: e.target.value })}
                  placeholder="مثال: وزارة الموارد البشرية والتنمية الاجتماعية"
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">المبلغ الخاضع للضريبة (ر.س):</label>
                  <input
                    type="number"
                    required
                    value={newInvoice.amount}
                    onChange={e => setNewInvoice({ ...newInvoice, amount: Number(e.target.value) })}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">نسبة الضريبة:</label>
                  <input
                    type="text"
                    disabled
                    value="15% (ZATCA Standard)"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-emerald-400 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 text-zinc-300">
                <div className="flex items-center justify-between">
                  <span>قيمة الضريبة المضافة (15%):</span>
                  <span className="font-mono text-amber-300 font-bold">{(Number(newInvoice.amount) * 0.15).toLocaleString()} ر.س</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold pt-1 border-t border-white/5">
                  <span className="text-white">الإجمالي النهائي المطلوب:</span>
                  <span className="font-mono text-emerald-400">{(Number(newInvoice.amount) * 1.15).toLocaleString()} ر.س</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddInvoiceModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white bg-white/5"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400 shadow-md flex items-center gap-1.5"
                >
                  <QrCode className="w-4 h-4" />
                  <span>إصدار وتشفير ZATCA</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KasSuitePortalPage;
