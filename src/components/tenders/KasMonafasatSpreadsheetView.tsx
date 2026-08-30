import React, { useState, useMemo, useEffect } from 'react';
import { Badge } from '../ui/Badge';
import { 
  Building2, Plus, FileSpreadsheet, FileText, Search, Printer, 
  Trash2, Edit3, CheckCircle2, AlertCircle, TrendingUp, DollarSign,
  Download, Eye, Calculator, ArrowRightLeft, Sparkles, Layers, 
  ShieldCheck, X, RefreshCw, Landmark, Tag, Check, Award, BarChart3,
  Users, Star, MapPin, Phone, Mail, PieChart, Activity, Copy,
  Upload, FileUp, QrCode, Percent, ArrowUpRight, Shield, CheckSquare,
  Filter, ChevronRight, ChevronLeft, Calendar, FileCheck, HelpCircle,
  Clock, Hash, ExternalLink
} from 'lucide-react';
import { KasTenderItem, SheetCategory, KasSheetMeta } from '../../types/kasMonafasat';
import { kasMonafasatService, KAS_SHEETS_META } from '../../services/kasMonafasatService';
import { generateZatcaQR } from '../../services/zatcaPhase2Service';
import { useAppStore } from '../../stores/appStore';
import { tafqeet } from '../../services/tafqeetService';

interface Props {
  onConvertToBOQ?: (tender: KasTenderItem) => void;
}

export const KasMonafasatSpreadsheetView: React.FC<Props> = ({ onConvertToBOQ }) => {
  const { addNotification } = useAppStore();

  // Navigation & Sheet selection
  const [activeCategory, setActiveCategory] = useState<SheetCategory>('companies');
  const [selectedSheetName, setSelectedSheetName] = useState<string>('تجارة');
  
  // Data state
  const [tenders, setTenders] = useState<KasTenderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [reasonFilter, setReasonFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  // Modals state
  const [selectedItem, setSelectedItem] = useState<KasTenderItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<KasTenderItem>>({});

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    seq: true,
    company: true,
    tenderCode: true,
    title: true,
    referenceNumber: true,
    entity: true,
    manager: true,
    deadlineDate: true,
    duration: true,
    bidValue: true,
    winningBidValue: true,
    notes: true,
    rejectionReason: true,
    boqStatus: true,
    city: false,
    platform: false,
    actions: true,
  });
  const [showColSettings, setShowColSettings] = useState<boolean>(false);

  // Load data based on selected sheet / category
  const loadData = () => {
    setLoading(true);
    try {
      if (activeCategory === 'all') {
        const all = kasMonafasatService.getAllTenders();
        setTenders(all);
      } else {
        const items = kasMonafasatService.getSheetTenders(selectedSheetName);
        setTenders(items);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    setCurrentPage(1);
  }, [selectedSheetName, activeCategory]);

  // Sheets available for active category
  const categorySheets = useMemo(() => {
    if (activeCategory === 'all') return [];
    return KAS_SHEETS_META.filter(s => s.category === activeCategory);
  }, [activeCategory]);

  // Ensure selectedSheetName matches active category
  const handleCategoryChange = (cat: SheetCategory) => {
    setActiveCategory(cat);
    if (cat === 'companies') setSelectedSheetName('تجارة');
    else if (cat === 'medical') setSelectedSheetName('August26 الادارة الطبية ');
    else if (cat === 'monthly') setSelectedSheetName('August26');
    else if (cat === 'archive') setSelectedSheetName('منافسات عامة');
    else if (cat === 'all') setSelectedSheetName('all');
  };

  // KPI Calculations
  const kpis = useMemo(() => {
    return kasMonafasatService.computeKPIs(tenders);
  }, [tenders]);

  // Filter options extraction
  const filterOptions = useMemo(() => {
    const statuses = new Set<string>();
    const reasons = new Set<string>();
    const cities = new Set<string>();

    tenders.forEach(t => {
      if (t.notes) statuses.add(t.notes.trim());
      if (t.rejectionReason) reasons.add(t.rejectionReason.trim());
      if (t.city) cities.add(t.city.trim());
    });

    return {
      statuses: Array.from(statuses).filter(Boolean).slice(0, 15),
      reasons: Array.from(reasons).filter(Boolean).slice(0, 15),
      cities: Array.from(cities).filter(Boolean).slice(0, 15),
    };
  }, [tenders]);

  // Filtered and searched data
  const filteredTenders = useMemo(() => {
    let list = tenders;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(t => 
        (t.title && t.title.toLowerCase().includes(q)) ||
        (t.referenceNumber && t.referenceNumber.toLowerCase().includes(q)) ||
        (t.tenderCode && t.tenderCode.toLowerCase().includes(q)) ||
        (t.entity && t.entity.toLowerCase().includes(q)) ||
        (t.company && t.company.toLowerCase().includes(q)) ||
        (t.managerName && t.managerName.toLowerCase().includes(q)) ||
        (t.notes && t.notes.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'all') {
      list = list.filter(t => t.notes && t.notes.includes(statusFilter));
    }

    if (reasonFilter !== 'all') {
      list = list.filter(t => t.rejectionReason && t.rejectionReason.includes(reasonFilter));
    }

    if (cityFilter !== 'all') {
      list = list.filter(t => t.city && t.city.includes(cityFilter));
    }

    return list;
  }, [tenders, searchQuery, statusFilter, reasonFilter, cityFilter]);

  // Paginated slices
  const totalPages = Math.ceil(filteredTenders.length / pageSize) || 1;
  const paginatedTenders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTenders.slice(start, start + pageSize);
  }, [filteredTenders, currentPage, pageSize]);

  // Handlers
  const handleOpenAdd = () => {
    setFormData({
      sheetName: selectedSheetName,
      company: selectedSheetName === 'تجارة' ? 'مؤسسة خالد السليم للتجارة' : selectedSheetName,
      seq: tenders.length + 1,
      boqStatus: 'تم',
      filePrepStatus: 'تم',
      platformType: 'منصة اعتماد',
      notes: 'مرحلة فحص العروض',
      rejectionReason: 'معلقة',
      sampleRequired: 'لا',
      siteVisitRequired: 'لا',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.title || !formData.title.trim()) {
      alert('يرجى إدخال اسم المنافسة');
      return;
    }
    const targetSheet = formData.sheetName || selectedSheetName;
    const newItem = kasMonafasatService.addTender(targetSheet, formData as any);
    addNotification({
      title: 'تمت إضافة منافسة جديدة',
      message: `تم حفظ المنافسة "${newItem.title}" في سجل ${targetSheet} بنجاح.`,
      type: 'success',
    });
    setIsAddModalOpen(false);
    loadData();
  };

  const handleOpenEdit = (item: KasTenderItem) => {
    setSelectedItem(item);
    setFormData({ ...item });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedItem) return;
    const ok = kasMonafasatService.updateTender(selectedItem.sheetName, selectedItem.id, formData);
    if (ok) {
      addNotification({
        title: 'تم تحديث المنافسة',
        message: `تم تحديث بيانات المنافسة "${formData.title || selectedItem.title}" بنجاح.`,
        type: 'success',
      });
      setIsEditModalOpen(false);
      loadData();
    }
  };

  const handleDelete = (item: KasTenderItem) => {
    if (window.confirm(`هل أنت متأكد من حذف المنافسة: "${item.title}"؟`)) {
      const ok = kasMonafasatService.deleteTender(item.sheetName, item.id);
      if (ok) {
        addNotification({
          title: 'تم حذف المنافسة',
          message: `تم حذف المنافسة "${item.title}" بنجاح.`,
          type: 'info',
        });
        loadData();
      }
    }
  };

  const handleExportXLSX = () => {
    if (activeCategory === 'all') {
      kasMonafasatService.exportFullWorkbook();
      addNotification({
        title: 'تم تصدير المصنف الكامل',
        message: 'تم تصدير جميع الشيتات في ملف Excel متعدد التبويبات بنجاح.',
        type: 'success',
      });
    } else {
      kasMonafasatService.exportSheetToXLSX(selectedSheetName, filteredTenders);
      addNotification({
        title: 'تم تصدير الشيت',
        message: `تم تصدير سجل "${selectedSheetName}" (${filteredTenders.length} منافسة) كملف Excel بنجاح.`,
        type: 'success',
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const res = await kasMonafasatService.importFromXLSX(file);
    setLoading(false);
    if (res.success) {
      addNotification({
        title: 'نجاح استيراد ملف الإكسل',
        message: res.message,
        type: 'success',
      });
      setIsImportModalOpen(false);
      loadData();
    } else {
      alert(res.message);
    }
  };

  // Helper badge color
  const getStatusBadge = (notes: string, reason: string) => {
    const txt = `${notes} ${reason}`.toLowerCase();
    if (txt.includes('تم الترسية') || txt.includes('معتمد') || txt.includes('تم اعتماد')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          🏆 {notes || 'تمت الترسية'}
        </span>
      );
    }
    if (txt.includes('مرتفع')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
          📈 عرض مالي مرتفع
        </span>
      );
    }
    if (txt.includes('إلغاء') || txt.includes('الغاء') || txt.includes('لاغي')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs text-rose-600 bg-rose-500/10 border border-rose-500/20">
          ❌ {notes || 'ملغية'}
        </span>
      );
    }
    if (txt.includes('غير مطابق') || txt.includes('غير مقبول')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs text-red-600 bg-red-500/10 border border-red-500/20">
          ⚠️ {notes || reason || 'غير مطابق'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-sky-500/10 text-sky-600 border border-sky-500/20">
        ⏳ {notes || reason || 'قيد الفحص'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Actions */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 text-white shadow-xl border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-inner backdrop-blur-md">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold tracking-tight">سجل ومنظومة منافسات شركة كاس والمجموعة</h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Google Sheet Live Synchronizer
                </span>
              </div>
              <p className="text-emerald-200/80 text-sm mt-1">
                إدارة ومتابعة أكثر من 11,700 منافسة حكومية وترسية تعاقدية لكافة مؤسسات وشركات المجموعة عبر منصة اعتماد والجهات الرسمية
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة منافسة جديدة</span>
            </button>

            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm flex items-center gap-2 backdrop-blur-md border border-white/10 transition-all"
              title="استيراد وتحديث من ملف Excel"
            >
              <FileUp className="w-4 h-4 text-emerald-300" />
              <span>استيراد إكسل</span>
            </button>

            <button
              onClick={handleExportXLSX}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm flex items-center gap-2 backdrop-blur-md border border-white/10 transition-all"
              title="تصدير الشيت الحالي إكسل"
            >
              <Download className="w-4 h-4 text-teal-300" />
              <span>تصدير XLSX</span>
            </button>

            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm flex items-center gap-2 backdrop-blur-md border border-white/10 transition-all"
              title="طباعة كشف المنافسات"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>طباعة كشف</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Category Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => handleCategoryChange('companies')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              activeCategory === 'companies'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>المؤسسات والأنشطة (6)</span>
          </button>

          <button
            onClick={() => handleCategoryChange('medical')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              activeCategory === 'medical'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>الإدارة الطبية (12 شهراً)</span>
          </button>

          <button
            onClick={() => handleCategoryChange('monthly')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              activeCategory === 'monthly'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>المتابعة الشهرية (12 شهراً)</span>
          </button>

          <button
            onClick={() => handleCategoryChange('archive')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              activeCategory === 'archive'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>أرشيف المنافسات (2024 & عامة)</span>
          </button>

          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              activeCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>اللوحة الإجمالية (11,700+ سجل)</span>
          </button>
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-2 font-mono">
          <span>إجمالي السجلات:</span>
          <span className="font-bold text-foreground bg-secondary px-2 py-0.5 rounded-md">{filteredTenders.length.toLocaleString()}</span>
        </div>
      </div>

      {/* Sub-sheets Pills (if category is not 'all') */}
      {activeCategory !== 'all' && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-secondary/30 rounded-2xl border border-border/50">
          <span className="text-xs font-semibold text-muted-foreground ml-2">اختر الشيت:</span>
          {categorySheets.map(s => {
            const isSelected = selectedSheetName === s.name;
            const count = kasMonafasatService.getSheetTenders(s.name).length;
            return (
              <button
                key={s.name}
                onClick={() => setSelectedSheetName(s.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-foreground text-background shadow-md'
                    : 'bg-card text-foreground hover:bg-secondary/80 border border-border/40'
                }`}
              >
                <span>{s.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSelected ? 'bg-background text-foreground' : 'bg-secondary text-muted-foreground'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* KPI Cards Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>المنافسات</span>
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">
            {kpis.totalTenders.toLocaleString()}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">سجل مسجل بالشيت</div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>قيمة العروض المقدمة</span>
            <DollarSign className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2 text-xl font-bold text-sky-600 truncate" title={`${kpis.totalBidValue.toLocaleString()} ريال`}>
            {kpis.totalBidValue > 1000000 
              ? `${(kpis.totalBidValue / 1000000).toFixed(2)} م.ر`
              : `${kpis.totalBidValue.toLocaleString()} ر.س`}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">إجمالي عروض كاس</div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>الترسيات المعتمدة</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-xl font-bold text-emerald-600 truncate" title={`${kpis.totalWinningValue.toLocaleString()} ريال`}>
            {kpis.totalWinningValue > 1000000 
              ? `${(kpis.totalWinningValue / 1000000).toFixed(2)} م.ر`
              : `${kpis.totalWinningValue.toLocaleString()} ر.س`}
          </div>
          <div className="text-[11px] text-emerald-600/80 font-medium mt-1">{kpis.wonCount} ترسية ناجحة</div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>نسبة الترسية والفوز</span>
            <Percent className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-indigo-600">
            {kpis.winRate}%
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">من العروض المفحوصة</div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>عروض قيد الفحص</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-600">
            {kpis.pendingCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">بانتظار قرار الترسية</div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>سعر مرتفع / لم ترسى</span>
            <TrendingUp className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-600">
            {kpis.highBidCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">فرص تحسين التسعير</div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Universal Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث برقم المنافسة، الرقم المرجعي، اسم المنافسة، الجهة الحكومية، المسؤول، المدينة..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-secondary/50 border border-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-secondary/50 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">كل الحالات (الملاحظات)</option>
              {filterOptions.statuses.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            <select
              value={reasonFilter}
              onChange={e => setReasonFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-secondary/50 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">كل أسباب الترسية/الاستبعاد</option>
              {filterOptions.reasons.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            {filterOptions.cities.length > 0 && (
              <select
                value={cityFilter}
                onChange={e => setCityFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-secondary/50 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">كل المدن</option>
                {filterOptions.cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}

            {(statusFilter !== 'all' || reasonFilter !== 'all' || cityFilter !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setReasonFilter('all');
                  setCityFilter('all');
                  setSearchQuery('');
                }}
                className="px-3 py-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 text-xs font-medium transition-all"
              >
                مسح الفلاتر
              </button>
            )}

            <button
              onClick={() => setShowColSettings(!showColSettings)}
              className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 border border-border"
              title="تخصيص الأعمدة"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Column Settings Toggle Dropdown */}
        {showColSettings && (
          <div className="p-3 bg-secondary/40 rounded-xl border border-border/60 flex flex-wrap gap-3 text-xs">
            <span className="font-semibold text-muted-foreground w-full">إظهار / إخفاء الأعمدة:</span>
            {Object.keys(visibleColumns).map(colKey => (
              <label key={colKey} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns[colKey]}
                  onChange={e => setVisibleColumns(prev => ({ ...prev, [colKey]: e.target.checked }))}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>{colKey}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Main Spreadsheet Grid Table */}
      <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[650px]">
          <table className="w-full text-xs text-right border-collapse select-text">
            <thead className="sticky top-0 z-20 bg-secondary text-foreground font-semibold border-b border-border shadow-sm">
              <tr className="divide-x divide-x-reverse divide-border/40">
                {visibleColumns.seq && <th className="p-3 w-12 text-center">#</th>}
                {visibleColumns.company && <th className="p-3 min-w-[140px]">المؤسسة</th>}
                {visibleColumns.tenderCode && <th className="p-3 min-w-[90px]">كود المنافسة</th>}
                {visibleColumns.title && <th className="p-3 min-w-[280px]">اسم المنافسة والمشروع</th>}
                {visibleColumns.referenceNumber && <th className="p-3 min-w-[130px]">الرقم المرجعي / اعتماد</th>}
                {visibleColumns.entity && <th className="p-3 min-w-[160px]">الجهة الحكومية</th>}
                {visibleColumns.manager && <th className="p-3 min-w-[130px]">المسؤول / التواصل</th>}
                {visibleColumns.deadlineDate && <th className="p-3 min-w-[100px]">انتهاء التقديم</th>}
                {visibleColumns.duration && <th className="p-3 min-w-[80px]">مدة التنفيذ</th>}
                {visibleColumns.bidValue && <th className="p-3 min-w-[110px] text-left">قيمة العرض (ر.س)</th>}
                {visibleColumns.winningBidValue && <th className="p-3 min-w-[110px] text-left">المبلغ الفائز (ر.س)</th>}
                {visibleColumns.notes && <th className="p-3 min-w-[140px]">الحالة (الملاحظات)</th>}
                {visibleColumns.rejectionReason && <th className="p-3 min-w-[140px]">سبب الترسية / الاستبعاد</th>}
                {visibleColumns.boqStatus && <th className="p-3 min-w-[80px] text-center">جدول الكميات</th>}
                {visibleColumns.city && <th className="p-3 min-w-[80px]">المدينة</th>}
                {visibleColumns.platform && <th className="p-3 min-w-[90px]">المنصة</th>}
                {visibleColumns.actions && <th className="p-3 w-28 text-center sticky left-0 bg-secondary z-30 shadow-l">الإجراءات</th>}
              </tr>
            </thead>

            <tbody className="divide-y divide-border/40">
              {paginatedTenders.length === 0 ? (
                <tr>
                  <td colSpan={17} className="p-12 text-center text-muted-foreground">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground/60" />
                    <p className="font-semibold text-sm">لا توجد منافسات مطابقة للبحث أو الفلتر المحدد</p>
                    <p className="text-xs mt-1">جرّب تغيير كلمات البحث أو اختيار شيت آخر</p>
                  </td>
                </tr>
              ) : (
                paginatedTenders.map((item, idx) => {
                  const bid = Number(item.bidValue) || 0;
                  const win = Number(item.winningBidValue) || 0;
                  const gap = bid > 0 && win > 0 ? bid - win : 0;
                  const gapPercent = win > 0 && gap !== 0 ? ((gap / win) * 100).toFixed(1) : null;

                  return (
                    <tr 
                      key={item.id || idx}
                      className="hover:bg-emerald-500/5 transition-colors group cursor-pointer"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsDetailModalOpen(true);
                      }}
                    >
                      {visibleColumns.seq && (
                        <td className="p-3 text-center text-muted-foreground font-mono">
                          {item.seq || (idx + 1 + (currentPage - 1) * pageSize)}
                        </td>
                      )}

                      {visibleColumns.company && (
                        <td className="p-3 font-medium text-foreground truncate max-w-[150px]" title={item.company}>
                          {item.company || 'كاس للتجارة'}
                        </td>
                      )}

                      {visibleColumns.tenderCode && (
                        <td className="p-3 font-mono font-bold text-emerald-600">
                          {item.tenderCode || '-'}
                        </td>
                      )}

                      {visibleColumns.title && (
                        <td className="p-3 font-medium text-foreground max-w-[320px]">
                          <div className="line-clamp-2 leading-relaxed" title={item.title}>
                            {item.title}
                          </div>
                        </td>
                      )}

                      {visibleColumns.referenceNumber && (
                        <td className="p-3 font-mono text-muted-foreground">
                          {item.referenceNumber || item.tenderNumber || '-'}
                        </td>
                      )}

                      {visibleColumns.entity && (
                        <td className="p-3 text-foreground truncate max-w-[180px]" title={item.entity}>
                          {item.entity || '-'}
                        </td>
                      )}

                      {visibleColumns.manager && (
                        <td className="p-3 text-muted-foreground text-[11px]">
                          <div>{item.managerName || '-'}</div>
                          {item.managerPhone && <div className="text-[10px] font-mono text-muted-foreground/80">{item.managerPhone}</div>}
                        </td>
                      )}

                      {visibleColumns.deadlineDate && (
                        <td className="p-3 font-mono text-muted-foreground text-[11px]">
                          {item.deadlineDate || '-'}
                        </td>
                      )}

                      {visibleColumns.duration && (
                        <td className="p-3 text-muted-foreground text-[11px]">
                          {item.executionDuration || (item.durationDays ? `${item.durationDays} يوم` : '-')}
                        </td>
                      )}

                      {visibleColumns.bidValue && (
                        <td className="p-3 text-left font-mono font-semibold text-foreground">
                          {bid > 0 ? `${bid.toLocaleString()} ر.س` : '-'}
                        </td>
                      )}

                      {visibleColumns.winningBidValue && (
                        <td className="p-3 text-left font-mono text-emerald-600 font-semibold">
                          {win > 0 ? (
                            <div>
                              <span>{win.toLocaleString()} ر.س</span>
                              {gapPercent && Number(gapPercent) > 0 && (
                                <div className="text-[10px] text-amber-600 font-mono">
                                  +{gapPercent}% فارق
                                </div>
                              )}
                            </div>
                          ) : '-'}
                        </td>
                      )}

                      {visibleColumns.notes && (
                        <td className="p-3">
                          {getStatusBadge(item.notes, item.rejectionReason)}
                        </td>
                      )}

                      {visibleColumns.rejectionReason && (
                        <td className="p-3 text-muted-foreground text-[11px] truncate max-w-[150px]" title={item.rejectionReason}>
                          {item.rejectionReason || '-'}
                        </td>
                      )}

                      {visibleColumns.boqStatus && (
                        <td className="p-3 text-center">
                          {item.boqStatus === 'تم' ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                              ✓ تم
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-[10px]">-</span>
                          )}
                        </td>
                      )}

                      {visibleColumns.city && (
                        <td className="p-3 text-muted-foreground text-[11px]">
                          {item.city || '-'}
                        </td>
                      )}

                      {visibleColumns.platform && (
                        <td className="p-3 text-muted-foreground text-[11px]">
                          {item.platformType || '-'}
                        </td>
                      )}

                      {visibleColumns.actions && (
                        <td 
                          className="p-3 text-center sticky left-0 bg-card group-hover:bg-muted/50 z-10 shadow-l"
                          onClick={e => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setIsDetailModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                              title="معاينة التفاصيل"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-emerald-600"
                              title="تعديل"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {onConvertToBOQ && (
                              <button
                                onClick={() => onConvertToBOQ(item)}
                                className="p-1.5 rounded-lg hover:bg-emerald-500/20 text-emerald-600"
                                title="تحويل لكراسة BOQ والتفقيط"
                              >
                                <Calculator className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(item)}
                              className="p-1.5 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-600"
                              title="حذف"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-border bg-secondary/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>عرض</span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 rounded-md bg-secondary border border-border text-xs focus:outline-none"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={250}>250</option>
              <option value={filteredTenders.length}>الكل ({filteredTenders.length})</option>
            </select>
            <span>سجل لكل صفحة</span>
            <span className="mx-2">•</span>
            <span>الصفحة {currentPage} من {totalPages}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded-md bg-card border border-border disabled:opacity-40 hover:bg-secondary font-mono"
            >
              «
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded-md bg-card border border-border disabled:opacity-40 hover:bg-secondary font-mono flex items-center"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <span className="px-3 py-1 font-mono font-bold bg-emerald-500/10 text-emerald-600 rounded-md border border-emerald-500/20">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded-md bg-card border border-border disabled:opacity-40 hover:bg-secondary font-mono flex items-center"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded-md bg-card border border-border disabled:opacity-40 hover:bg-secondary font-mono"
            >
              »
            </button>
          </div>
        </div>
      </div>

      {/* Modal: View Tender Detail Card */}
      {isDetailModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-bold">
                  {selectedItem.company || 'كاس للتجارة'}
                </span>
                <h3 className="text-lg font-bold text-foreground mt-2 leading-relaxed">
                  {selectedItem.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 font-mono">
                  <span>كود: {selectedItem.tenderCode || '-'}</span>
                  <span>•</span>
                  <span>مرجع اعتماد: {selectedItem.referenceNumber || '-'}</span>
                </div>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-secondary/40 rounded-xl border border-border/60">
                <span className="text-muted-foreground block">الجهة الحكومية:</span>
                <span className="font-semibold text-foreground mt-1 block">{selectedItem.entity || '-'}</span>
              </div>
              <div className="p-3 bg-secondary/40 rounded-xl border border-border/60">
                <span className="text-muted-foreground block">المسؤول:</span>
                <span className="font-semibold text-foreground mt-1 block">{selectedItem.managerName || '-'}</span>
                {selectedItem.managerPhone && <span className="font-mono text-muted-foreground text-[10px] block mt-0.5">{selectedItem.managerPhone}</span>}
              </div>
              <div className="p-3 bg-secondary/40 rounded-xl border border-border/60">
                <span className="text-muted-foreground block">المدينة:</span>
                <span className="font-semibold text-foreground mt-1 block">{selectedItem.city || '-'}</span>
              </div>
              <div className="p-3 bg-secondary/40 rounded-xl border border-border/60">
                <span className="text-muted-foreground block">تاريخ البدء:</span>
                <span className="font-mono font-semibold text-foreground mt-1 block">{selectedItem.startDate || '-'}</span>
              </div>
              <div className="p-3 bg-secondary/40 rounded-xl border border-border/60">
                <span className="text-muted-foreground block">تاريخ انتهاء التقديم:</span>
                <span className="font-mono font-semibold text-foreground mt-1 block">{selectedItem.deadlineDate || '-'}</span>
              </div>
              <div className="p-3 bg-secondary/40 rounded-xl border border-border/60">
                <span className="text-muted-foreground block">مدة التنفيذ:</span>
                <span className="font-semibold text-foreground mt-1 block">{selectedItem.executionDuration || '-'}</span>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground block">قيمة العرض المقدم (كاس):</span>
                <span className="text-base font-bold font-mono text-foreground mt-1 block">
                  {selectedItem.bidValue ? `${selectedItem.bidValue.toLocaleString()} ر.س` : 'غير محدد'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">المبلغ الحاصل على المنافسة:</span>
                <span className="text-base font-bold font-mono text-emerald-600 mt-1 block">
                  {selectedItem.winningBidValue ? `${selectedItem.winningBidValue.toLocaleString()} ر.س` : 'غير محدد'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">الحالة والترسية:</span>
                <div className="mt-1">
                  {getStatusBadge(selectedItem.notes, selectedItem.rejectionReason)}
                </div>
              </div>
            </div>

            {selectedItem.notes && (
              <div className="p-3 bg-secondary/30 rounded-xl border border-border/60 text-xs">
                <span className="font-semibold text-muted-foreground block mb-1">الملاحظات والتفاصيل:</span>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">{selectedItem.notes}</p>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleOpenEdit(selectedItem);
                  }}
                  className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-medium text-xs flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>تعديل السجل</span>
                </button>

                {onConvertToBOQ && (
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      onConvertToBOQ(selectedItem);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>تحويل لمحرر جداول الكميات (BOQ)</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-secondary text-muted-foreground hover:text-foreground text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add / Edit Tender */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <span>{isAddModalOpen ? 'إضافة منافسة جديدة إلى السجل' : 'تعديل بيانات المنافسة'}</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="col-span-full">
                <label className="block font-medium text-foreground mb-1">اسم المنافسة والمشروع *</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                  placeholder="مثال: تأمين مستلزمات اليوم الوطني لميناء جدة..."
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border focus:ring-1 focus:ring-emerald-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">المؤسسة / الشركة</label>
                <select
                  value={formData.company || ''}
                  onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border focus:ring-1 focus:ring-emerald-500 text-xs"
                >
                  <option value="مؤسسة خالد السليم للتجارة">مؤسسة خالد السليم للتجارة (كاس)</option>
                  <option value="مؤسسة كاس لتنظيم المعارض والمؤتمرات">مؤسسة كاس لتنظيم المعارض والمؤتمرات</option>
                  <option value="مؤسسة خالد السليم للدعاية والإعلان">مؤسسة خالد السليم للدعاية والإعلان</option>
                  <option value="مؤسسة بنايات ذكية للمقاولات">مؤسسة بنايات ذكية للمقاولات</option>
                  <option value="وكالة الأميال للسفر والسياحة">وكالة الأميال للسفر والسياحة</option>
                  <option value="مؤسسة اللمسة الخارقة للاتصالات والتقنية">مؤسسة اللمسة الخارقة للاتصالات والتقنية</option>
                  <option value="الادارة الطبية">الادارة الطبية</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">كود المنافسة</label>
                <input
                  type="text"
                  value={formData.tenderCode || ''}
                  onChange={e => setFormData(p => ({ ...p, tenderCode: e.target.value }))}
                  placeholder="مثال: A1246, F0258..."
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">الرقم المرجعي (اعتماد)</label>
                <input
                  type="text"
                  value={formData.referenceNumber || ''}
                  onChange={e => setFormData(p => ({ ...p, referenceNumber: e.target.value }))}
                  placeholder="مثال: 240739001563"
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">الجهة الحكومية</label>
                <input
                  type="text"
                  value={formData.entity || ''}
                  onChange={e => setFormData(p => ({ ...p, entity: e.target.value }))}
                  placeholder="مثال: وزارة الحرس الوطني..."
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">اسم المسؤول</label>
                <input
                  type="text"
                  value={formData.managerName || ''}
                  onChange={e => setFormData(p => ({ ...p, managerName: e.target.value }))}
                  placeholder="اسم مسؤول المنافسة..."
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">هاتف المسؤول</label>
                <input
                  type="text"
                  value={formData.managerPhone || ''}
                  onChange={e => setFormData(p => ({ ...p, managerPhone: e.target.value }))}
                  placeholder="05XXXXXXXX"
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">قيمة عرض كاس (ر.س)</label>
                <input
                  type="number"
                  value={formData.bidValue || ''}
                  onChange={e => setFormData(p => ({ ...p, bidValue: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">المبلغ الفائز (ر.س)</label>
                <input
                  type="number"
                  value={formData.winningBidValue || ''}
                  onChange={e => setFormData(p => ({ ...p, winningBidValue: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">تاريخ انتهاء التقديم</label>
                <input
                  type="date"
                  value={formData.deadlineDate || ''}
                  onChange={e => setFormData(p => ({ ...p, deadlineDate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">الحالة (الملاحظات)</label>
                <select
                  value={formData.notes || ''}
                  onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border focus:ring-1 focus:ring-emerald-500 text-xs"
                >
                  <option value="مرحلة فحص العروض">مرحلة فحص العروض</option>
                  <option value="تم اعتماد الترسية">تم اعتماد الترسية</option>
                  <option value="معتمدة">معتمدة</option>
                  <option value="تم الإلغاء">تم الإلغاء</option>
                  <option value="بانتظار اعتماد تقييم العروض الفنية">بانتظار اعتماد تقييم العروض الفنية</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">سبب الترسية / الاستبعاد</label>
                <select
                  value={formData.rejectionReason || ''}
                  onChange={e => setFormData(p => ({ ...p, rejectionReason: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border focus:ring-1 focus:ring-emerald-500 text-xs"
                >
                  <option value="معلقة">معلقة</option>
                  <option value="تم الترسية">تم الترسية</option>
                  <option value="عرض مالي مرتفع">عرض مالي مرتفع</option>
                  <option value="غير مطابق فنياً">غير مطابق فنياً</option>
                  <option value="غير مطابق مالياً و فنياً">غير مطابق مالياً و فنياً</option>
                  <option value="تم الإلغاء">تم الإلغاء</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">المدينة</label>
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                  placeholder="الرياض، جدة، الدمام..."
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={isAddModalOpen ? handleSaveAdd : handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <Check className="w-4 h-4" />
                <span>{isAddModalOpen ? 'حفظ وإضافة المنافسة' : 'حفظ التعديلات'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Import Excel File */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <FileUp className="w-5 h-5 text-emerald-600" />
                <span>استيراد ملف إكسل المنافسات</span>
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              يمكنك رفع أي ملف إكسل (.xlsx / .xls) مطابق لتنسيق Google Sheet الخاص بمنافسات كاس لتحديث البيانات وإضافة المنافسات تلقائياً.
            </p>

            <div className="p-8 border-2 border-dashed border-border rounded-2xl text-center bg-secondary/20 hover:bg-secondary/40 transition-colors">
              <Upload className="w-10 h-10 mx-auto text-emerald-600 mb-3" />
              <label className="block text-xs font-semibold text-foreground cursor-pointer">
                <span className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl inline-block shadow-md">
                  اختر ملف Excel من جهازك
                </span>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[11px] text-muted-foreground block mt-2">يدعم صيغ .xlsx أو .xls</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-secondary text-muted-foreground hover:text-foreground text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Printable Official Tenders Report */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-4xl w-full p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:border-none">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-xl">
                  KAS
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">مؤسسة خالد عبدالعزيز السليم للتجارة والمقاولات</h2>
                  <p className="text-xs text-slate-500">كشف وسجل المنافسات الحكومية المعتمد - شيت {selectedSheetName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الآن</span>
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Print Header KPIs */}
            <div className="grid grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block">إجمالي المنافسات:</span>
                <span className="font-bold text-slate-900 font-mono text-sm">{filteredTenders.length}</span>
              </div>
              <div>
                <span className="text-slate-500 block">قيمة العروض:</span>
                <span className="font-bold text-slate-900 font-mono text-sm">{kpis.totalBidValue.toLocaleString()} ر.س</span>
              </div>
              <div>
                <span className="text-slate-500 block">الترسيات المعتمدة:</span>
                <span className="font-bold text-emerald-700 font-mono text-sm">{kpis.wonCount} ترسية</span>
              </div>
              <div>
                <span className="text-slate-500 block">تاريخ التقرير:</span>
                <span className="font-bold text-slate-900 font-mono text-sm">{new Date().toISOString().split('T')[0]}</span>
              </div>
            </div>

            {/* Print Table */}
            <table className="w-full text-xs text-right border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 font-bold">
                  <th className="p-2 border border-slate-200 text-center">#</th>
                  <th className="p-2 border border-slate-200">كود / مرجع</th>
                  <th className="p-2 border border-slate-200">اسم المنافسة</th>
                  <th className="p-2 border border-slate-200">الجهة الحكومية</th>
                  <th className="p-2 border border-slate-200 text-left">قيمة العرض</th>
                  <th className="p-2 border border-slate-200 text-left">المبلغ الفائز</th>
                  <th className="p-2 border border-slate-200">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenders.slice(0, 100).map((t, i) => (
                  <tr key={t.id || i} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-2 border border-slate-200 text-center font-mono text-slate-500">{i + 1}</td>
                    <td className="p-2 border border-slate-200 font-mono text-slate-700">{t.tenderCode || t.referenceNumber || '-'}</td>
                    <td className="p-2 border border-slate-200 font-medium text-slate-900">{t.title}</td>
                    <td className="p-2 border border-slate-200 text-slate-700">{t.entity || '-'}</td>
                    <td className="p-2 border border-slate-200 text-left font-mono">{t.bidValue ? `${t.bidValue.toLocaleString()} ر.س` : '-'}</td>
                    <td className="p-2 border border-slate-200 text-left font-mono text-emerald-700 font-semibold">{t.winningBidValue ? `${t.winningBidValue.toLocaleString()} ر.س` : '-'}</td>
                    <td className="p-2 border border-slate-200 text-slate-700 text-[11px]">{t.notes || t.rejectionReason || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTenders.length > 100 && (
              <p className="text-[11px] text-slate-400 text-center">
                * تم عرض أول 100 منافسة في هذا الكشف. لتصدير كامل السجلات ({filteredTenders.length}) يرجى استخدام تصدير Excel.
              </p>
            )}

            <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-200 pt-4">
              <span>نظام ERP مجموعة خالد السليم - إدارة المنافسات والعقود</span>
              <span>صفحة 1 من 1</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
