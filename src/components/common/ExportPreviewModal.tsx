import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  FileSpreadsheet,
  FileText,
  Printer,
  FileEdit,
  Globe,
  FileCode,
  Layers,
  Code,
  FileJson,
  Database,
  Image as ImageIcon,
  Landmark,
  SlidersHorizontal,
  CheckSquare,
  Square,
  ShieldCheck,
  Sparkles,
  Eye,
  Building2,
  UserCheck,
  FileCheck2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  exportData,
  ExportFormat,
  ExportCustomizationOptions,
  resolveConfig,
  calculateReportKpis,
  generateExecutiveReportHtml,
  getActiveCompanyInfo,
  getAuthenticatedExporterInfo,
  numberToArabicTafqeet,
} from '../../services/exportService';
import { useAppStore } from '../../stores/appStore';

export interface ExportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionKey: string;
  data: any[];
  customTitle?: string;
}

export const ExportPreviewModal: React.FC<ExportPreviewModalProps> = ({
  isOpen,
  onClose,
  sectionKey,
  data,
  customTitle,
}) => {
  const { addNotification } = useAppStore();

  // Base resolved configuration (all columns)
  const baseConfig = useMemo(() => resolveConfig(sectionKey, data), [sectionKey, data]);
  const companyInfo = useMemo(() => getActiveCompanyInfo(), [isOpen]);
  const exporterInfo = useMemo(() => getAuthenticatedExporterInfo(), [isOpen]);

  // Customization states
  const [titleInput, setTitleInput] = useState<string>(customTitle || baseConfig.sectionTitle);
  const [executiveNote, setExecutiveNote] = useState<string>('');
  const [orientation, setOrientation] = useState<'auto' | 'portrait' | 'landscape'>('auto');
  const [showSignatures, setShowSignatures] = useState<boolean>(true);
  const [showTafqeet, setShowTafqeet] = useState<boolean>(true);
  const [showQrCode, setShowQrCode] = useState<boolean>(true);
  const [selectedColumnIndices, setSelectedColumnIndices] = useState<number[]>(() =>
    baseConfig.headers.map((_, idx) => idx)
  );
  const [zoomLevel, setZoomLevel] = useState<number>(85);
  const [activeExportingFormat, setActiveExportingFormat] = useState<ExportFormat | null>(null);

  // Sync state when sectionKey/customTitle/baseConfig changes
  useEffect(() => {
    setTitleInput(customTitle || baseConfig.sectionTitle);
    setSelectedColumnIndices(baseConfig.headers.map((_, idx) => idx));
  }, [customTitle, baseConfig.sectionTitle, baseConfig.headers.length, sectionKey]);

  const customizationOptions: ExportCustomizationOptions = useMemo(
    () => ({
      selectedColumnIndices,
      customTitle: titleInput,
      executiveNote: executiveNote.trim() || undefined,
      orientation,
      showSignatures,
      showTafqeet,
      showQrCode,
    }),
    [
      selectedColumnIndices,
      titleInput,
      executiveNote,
      orientation,
      showSignatures,
      showTafqeet,
      showQrCode,
    ]
  );

  const customizedConfig = useMemo(
    () => resolveConfig(sectionKey, data, titleInput, customizationOptions),
    [sectionKey, data, titleInput, customizationOptions]
  );

  const kpis = useMemo(
    () =>
      calculateReportKpis(
        customizedConfig.headers,
        (data || []).map((r) => customizedConfig.dataMapper(r))
      ),
    [data, customizedConfig]
  );

  const previewHtml = useMemo(() => {
    if (!isOpen || !data || data.length === 0) return '';
    return generateExecutiveReportHtml(
      sectionKey,
      data,
      titleInput,
      false,
      customizationOptions
    );
  }, [isOpen, sectionKey, data, titleInput, customizationOptions]);

  if (!isOpen || typeof document === 'undefined') return null;

  const toggleColumn = (idx: number) => {
    setSelectedColumnIndices((prev) => {
      if (prev.includes(idx)) {
        if (prev.length <= 1) return prev; // Keep at least 1 column
        return prev.filter((i) => i !== idx);
      }
      return [...prev, idx].sort((a, b) => a - b);
    });
  };

  const selectAllColumns = () => {
    setSelectedColumnIndices(baseConfig.headers.map((_, idx) => idx));
  };

  const selectCoreColumnsOnly = () => {
    const coreCount = Math.min(5, baseConfig.headers.length);
    setSelectedColumnIndices(Array.from({ length: coreCount }, (_, idx) => idx));
  };

  const handleRunExport = async (format: ExportFormat) => {
    if (!data || data.length === 0) {
      addNotification({
        title: 'لا توجد سجلات للتصدير',
        message: 'الجدول الحالي خالٍ من السجلات القابلة للتصدير.',
        type: 'warning',
      });
      return;
    }

    const isAsyncCanvasFormat = format === 'pdf' || format === 'png';
    if (isAsyncCanvasFormat) {
      setActiveExportingFormat(format);
    }
    try {
      await exportData(sectionKey, data, format, titleInput, customizationOptions);
      addNotification({
        title: 'تم إصدار الوثيقة المؤسسية المعتمدة',
        message: `تم تصدير (${data.length}) سجل من "${titleInput}" بصيغة ${format.toUpperCase()} بنجاح مع ترويسة ${companyInfo.nameAr}.`,
        type: 'success',
      });
    } catch (error) {
      console.error('Export studio error:', error);
      addNotification({
        title: 'خطأ في التصدير',
        message: 'تعذر إتمام عملية التصدير، يرجى المحاولة مرة أخرى.',
        type: 'error',
      });
    } finally {
      if (isAsyncCanvasFormat) {
        setActiveExportingFormat(null);
      }
    }
  };

  const primaryFormats: Array<{
    id: ExportFormat;
    label: string;
    sub: string;
    icon: React.FC<{ className?: string }>;
    style: string;
  }> = [
    {
      id: 'excel',
      label: 'إكسل مؤسسي (.xlsx)',
      sub: 'ورقتا عمل + معادلات',
      icon: FileSpreadsheet,
      style: 'bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-500',
    },
    {
      id: 'pdf',
      label: 'وثيقة PDF معتمدة',
      sub: 'دقة 300 DPI + ختم',
      icon: FileText,
      style: 'bg-[#1D2428] hover:bg-[#273136] text-[#CFA64A] border-[#CFA64A]/60',
    },
    {
      id: 'word',
      label: 'مستند Word (.doc)',
      sub: 'قابل للتحرير الرسمي',
      icon: FileEdit,
      style: 'bg-blue-700 hover:bg-blue-600 text-white border-blue-500',
    },
    {
      id: 'print',
      label: 'طباعة فورية A4',
      sub: 'معاينة طباعة مباشرة',
      icon: Printer,
      style: 'bg-[#CFA64A] hover:bg-[#d8b25a] text-[#1D2428] border-[#8C681E]',
    },
    {
      id: 'png',
      label: 'بطاقة مصورة (.png)',
      sub: 'صورة عالية الدقة 2x',
      icon: ImageIcon,
      style: 'bg-amber-700 hover:bg-amber-600 text-white border-amber-500',
    },
    {
      id: 'wps',
      label: 'حماية الأجور WPS',
      sub: 'ملف بنكي SAMA .sif',
      icon: Landmark,
      style: 'bg-teal-700 hover:bg-teal-600 text-white border-teal-500',
    },
  ];

  const secondaryFormats: Array<{
    id: ExportFormat;
    label: string;
    icon: React.FC<{ className?: string }>;
  }> = [
    { id: 'html', label: 'تقرير ويب تفاعلي (.html)', icon: Globe },
    { id: 'xml', label: 'تكامل ZATCA UBL (.xml)', icon: Code },
    { id: 'csv', label: 'جدول قياسي (.csv)', icon: FileCode },
    { id: 'tsv', label: 'جدول بنكي (.tsv)', icon: Layers },
    { id: 'json', label: 'بيانات برمجية (.json)', icon: FileJson },
    { id: 'markdown', label: 'توثيق ذكي (.md)', icon: Database },
  ];

  return createPortal(
    <div
      data-no-dyn-enhancer="true"
      className="fixed inset-0 z-[100000] bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 font-sans"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-[#FBFBF5] dark:bg-zinc-950 border-2 border-[#CFA64A]/60 rounded-3xl shadow-2xl w-full max-w-[1440px] h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Corporate Studio Header */}
        <div className="bg-[#1D2428] text-white px-5 py-3.5 border-b-2 border-[#CFA64A] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#CFA64A]/20 border border-[#CFA64A]/50 flex items-center justify-center text-[#CFA64A] shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-black text-white">
                  استوديو معاينة وتخصيص الوثائق المؤسسية المعتمدة (Enterprise Export Studio 4.0)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  12 صيغة قياسية
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-300 mt-0.5">
                <span className="inline-flex items-center gap-1 text-[#E6D3A7] font-bold">
                  <Building2 className="w-3.5 h-3.5 text-[#CFA64A]" />
                  <span>{companyInfo.nameAr}</span>
                </span>
                <span className="text-zinc-500">|</span>
                <span className="inline-flex items-center gap-1 text-emerald-300 font-bold">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>المُصدِر: {exporterInfo.name} ({exporterInfo.branch})</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-xs font-black text-[#CFA64A]">
              {data.length} سجل جاهز للتصدير
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/30 text-zinc-200 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="إغلاق المعاينة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Studio Body: Right Customization Sidebar + Left Live A4 Document Preview */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* Right Customization Sidebar */}
          <div className="w-full lg:w-[360px] xl:w-[390px] bg-white dark:bg-zinc-900 border-b lg:border-b-0 lg:border-l border-zinc-200 dark:border-zinc-800 p-4 overflow-y-auto space-y-4 shrink-0">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <SlidersHorizontal className="w-4 h-4 text-[#8C681E]" />
              <h3 className="text-xs font-black text-slate-900 dark:text-white">
                إعدادات وتخصيص الوثيقة الرسمية
              </h3>
            </div>

            {/* 1. Custom Report Title */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-slate-700 dark:text-zinc-300">
                عنوان الوثيقة / الكشف الرسمي:
              </label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="أدخل عنوان التقرير..."
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-[#FBFBF5] dark:bg-zinc-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#CFA64A]"
              />
            </div>

            {/* 2. Executive Note / Directive */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-slate-700 dark:text-zinc-300">
                مذكرة / توجيهات الإدارة التنفيذية (تظهر أعلى التقرير):
              </label>
              <textarea
                rows={2}
                value={executiveNote}
                onChange={(e) => setExecutiveNote(e.target.value)}
                placeholder="مثال: يعتمد الصرف بعد مطابقة الإدارة المالية ومراجعة العقود..."
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-[#FBFBF5] dark:bg-zinc-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#CFA64A] resize-none"
              />
            </div>

            {/* 3. Page Orientation */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-slate-700 dark:text-zinc-300">
                اتجاه الصفحة وتخطيط الطباعة (A4):
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                {(
                  [
                    { id: 'auto', label: 'تلقائي ذكي' },
                    { id: 'portrait', label: 'طولي Portrait' },
                    { id: 'landscape', label: 'عرضي Landscape' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setOrientation(opt.id)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                      orientation === opt.id
                        ? 'bg-[#1D2428] text-[#CFA64A] shadow-xs'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-slate-900'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Governance & Official Stamp Toggles */}
            <div className="space-y-2 pt-1">
              <label className="block text-[11px] font-black text-slate-700 dark:text-zinc-300">
                عناصر الحوكمة والتوثيق الرسمي:
              </label>
              <div className="space-y-1.5">
                {[
                  {
                    id: 'signatures',
                    checked: showSignatures,
                    onChange: () => setShowSignatures((v) => !v),
                    label: 'مصفوفة الاعتمادات الثلاثية والختم الرسمي',
                  },
                  {
                    id: 'tafqeet',
                    checked: showTafqeet,
                    onChange: () => setShowTafqeet((v) => !v),
                    label: 'شريط التفقيط المالي بالريال السعودي',
                  },
                  {
                    id: 'qrcode',
                    checked: showQrCode,
                    onChange: () => setShowQrCode((v) => !v),
                    label: 'باركود التحقق الرقمي المشفر (ZATCA QR)',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.onChange}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-right text-xs font-bold transition-all cursor-pointer ${
                      item.checked
                        ? 'bg-[#FBFBF5] dark:bg-zinc-800/90 border-[#CFA64A] text-slate-900 dark:text-white'
                        : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.checked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Column Selection Checklist */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-slate-700 dark:text-zinc-300">
                  الأعمدة الظاهرة ({selectedColumnIndices.length} من {baseConfig.headers.length}):
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={selectAllColumns}
                    className="text-[10px] font-black text-emerald-700 hover:underline cursor-pointer"
                  >
                    تحديد الكل
                  </button>
                  <span className="text-zinc-300">|</span>
                  <button
                    type="button"
                    onClick={selectCoreColumnsOnly}
                    className="text-[10px] font-black text-[#8C681E] hover:underline cursor-pointer"
                  >
                    الأعمدة الأساسية
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 max-h-[210px] overflow-y-auto p-1 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800">
                {baseConfig.headers.map((headerLabel, idx) => {
                  const isChecked = selectedColumnIndices.includes(idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleColumn(idx)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-right truncate transition-all cursor-pointer border ${
                        isChecked
                          ? 'bg-white dark:bg-zinc-800 border-[#CFA64A]/70 text-slate-900 dark:text-white shadow-2xs'
                          : 'bg-transparent border-transparent text-zinc-400 hover:bg-zinc-100'
                      }`}
                      title={headerLabel}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      )}
                      <span className="truncate">{headerLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Left/Center Live A4 Preview Pane */}
          <div className="flex-1 flex flex-col bg-zinc-200/80 dark:bg-zinc-950 min-h-0 overflow-hidden">
            {/* KPI & Preview Toolbar Strip */}
            <div className="bg-white dark:bg-zinc-900 px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1D2428] text-[#CFA64A] text-[11px] font-black">
                  <Eye className="w-3.5 h-3.5" />
                  <span>معاينة حية مطابقة للطباعة (Live A4 Preview)</span>
                </span>
                {kpis.hasFinancials && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-black">
                    <span>الإجمالي المالي:</span>
                    <span>
                      {kpis.totalAmount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      ر.س
                    </span>
                  </span>
                )}
                {kpis.hasFinancials && showTafqeet && (
                  <span className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FBFBF5] text-[#8C681E] border border-[#CFA64A]/50 text-[10.5px] font-bold">
                    <Sparkles className="w-3 h-3 text-[#CFA64A]" />
                    <span>{kpis.tafqeetAr || numberToArabicTafqeet(kpis.totalAmount)}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(60, z - 10))}
                  className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 cursor-pointer"
                  title="تصغير المعاينة"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono font-black text-zinc-600 px-1.5">
                  {zoomLevel}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(115, z + 10))}
                  className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 cursor-pointer"
                  title="تكبير المعاينة"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Live Document Iframe Canvas */}
            <div className="flex-1 overflow-auto p-3 sm:p-5 flex justify-center items-start">
              {data && data.length > 0 ? (
                <div
                  style={{
                    width:
                      orientation === 'landscape' ||
                      (orientation === 'auto' && customizedConfig.headers.length > 7)
                        ? '1120px'
                        : '860px',
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.15s ease, width 0.2s ease',
                  }}
                  className="bg-white rounded-2xl shadow-2xl border border-zinc-300 overflow-hidden shrink-0"
                >
                  <iframe
                    title="معاينة الوثيقة الرسمية"
                    srcDoc={previewHtml}
                    className="w-full h-[760px] border-0 bg-white"
                  />
                </div>
              ) : (
                <div className="my-auto text-center p-8 bg-white rounded-2xl border border-zinc-200 shadow-sm">
                  <p className="text-sm font-black text-slate-800">
                    لا توجد بيانات متاحة حالياً للمعاينة في هذا القسم
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom 12-Format Instant Export Action Bar */}
        <div className="bg-white dark:bg-zinc-900 border-t-2 border-[#CFA64A]/50 px-4 py-3 space-y-2.5 shrink-0">
          {/* Primary 6 Executive Formats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {primaryFormats.map((fmt) => {
              const Icon = fmt.icon;
              const isBusy = activeExportingFormat === fmt.id;
              return (
                <button
                  key={fmt.id}
                  type="button"
                  disabled={Boolean(activeExportingFormat)}
                  onClick={() => handleRunExport(fmt.id)}
                  className={`px-3 py-2 rounded-xl border font-bold text-right flex items-center gap-2.5 transition-all cursor-pointer shadow-xs active:scale-95 ${fmt.style} ${
                    activeExportingFormat && !isBusy ? 'opacity-60' : ''
                  }`}
                >
                  <span className={`inline-flex shrink-0 ${isBusy ? 'animate-spin' : ''}`}>
                    <Icon className="w-4 h-4 shrink-0" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black truncate">{fmt.label}</div>
                    <div className="text-[9.5px] opacity-85 truncate">{fmt.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Secondary 6 Data & Integration Formats */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10.5px] font-black text-zinc-500 ml-1">
                صيغ التكامل والأرشفة الإضافية:
              </span>
              {secondaryFormats.map((fmt) => {
                const Icon = fmt.icon;
                const isBusy = activeExportingFormat === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    disabled={Boolean(activeExportingFormat)}
                    onClick={() => handleRunExport(fmt.id)}
                    className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-[#1D2428] text-slate-800 hover:text-[#CFA64A] border border-zinc-200 text-[11px] font-extrabold inline-flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span className={`inline-flex shrink-0 ${isBusy ? 'animate-spin' : ''}`}>
                      <Icon className="w-3 h-3" />
                    </span>
                    <span>{fmt.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-[10.5px] font-bold text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>يتم تسجيل كافة عمليات التصدير آلياً في سجل الرقابة والتدقيق (Audit Log)</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ExportPreviewModal;
