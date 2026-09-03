import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  FileCode, 
  ChevronDown, 
  FileJson,
  Sparkles,
  Loader2,
  FileEdit,
  Globe,
  Database,
  Layers,
  Code
} from 'lucide-react';
import { exportData, ExportFormat } from '../../services/exportService';
import { useAppStore } from '../../stores/appStore';

export interface ExportDropdownProps {
  sectionKey: string;
  data: any[];
  customTitle?: string;
  buttonLabel?: string;
  variant?: 'outline-dark' | 'outline-light' | 'primary-pill' | 'compact';
  showCountBadge?: boolean;
  className?: string;
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({
  sectionKey,
  data,
  customTitle,
  buttonLabel = 'تصدير الكشوفات',
  variant = 'outline-light',
  showCountBadge = true,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { addNotification } = useAppStore();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = async (format: ExportFormat) => {
    if (!data || data.length === 0) {
      addNotification({
        title: 'تنبيه تصدير',
        message: 'لا توجد بيانات متاحة للتصدير في هذا القسم حالياً.',
        type: 'warning',
      });
      return;
    }
    
    setIsOpen(false);
    setIsExporting(true);

    try {
      await exportData(sectionKey, data, format, customTitle);
      addNotification({
        title: 'تصدير الوثيقة التنفيذية',
        message: `تم تجهيز واستخراج (${data.length}) سجل بصيغة ${format.toUpperCase()} بنجاح.`,
        type: 'success',
      });
    } catch (err) {
      console.error('Export failed:', err);
      addNotification({
        title: 'تعذر التصدير',
        message: 'حدث خطأ أثناء معالجة ملف التصدير، يرجى المحاولة مرة أخرى.',
        type: 'error',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getButtonClass = () => {
    switch (variant) {
      case 'outline-dark':
        return 'button-outline-on-dark';
      case 'primary-pill':
        return 'button-primary-pill';
      case 'compact':
        return 'button-outline-on-light !py-1.5 !px-3 !text-xs !min-h-[32px]';
      case 'outline-light':
      default:
        return 'button-outline-on-light';
    }
  };

  const documentFormats = [
    {
      id: 'excel' as ExportFormat,
      title: 'Microsoft Excel (.xlsx)',
      desc: 'جدول محاسبي متكامل بهيدر رسمي، مجاميع تلقائية وتوافق RTL',
      icon: FileSpreadsheet,
      badge: 'موصى به',
      color: 'emerald',
      bgColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
    },
    {
      id: 'pdf' as ExportFormat,
      title: 'مستند PDF تنفيذي معتمد (.pdf)',
      desc: 'تقرير رسمي عالي الدقة (300 DPI) بهيدر المجموعة والختم الرقمي',
      icon: FileText,
      badge: 'معتمد رسمياً',
      color: 'sky',
      bgColor: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400 border-sky-200 dark:border-sky-800'
    },
    {
      id: 'word' as ExportFormat,
      title: 'مستند Microsoft Word (.doc)',
      desc: 'مستند مكتبي قابل للتحرير والتنسيق المباشر مع الحفاظ على الجداول',
      icon: FileEdit,
      badge: 'قابل للتحرير',
      color: 'blue',
      bgColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800'
    },
    {
      id: 'print' as ExportFormat,
      title: 'طباعة فورية A4 (Print Preview)',
      desc: 'نافذة معاينة وطباعة فورية مع رمز ZATCA QR ومصفوفة التواقيع',
      icon: Printer,
      badge: 'طباعة فورية',
      color: 'purple',
      bgColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200 dark:border-purple-800'
    },
    {
      id: 'html' as ExportFormat,
      title: 'تقرير ويب مستقل تفاعلي (.html)',
      desc: 'صفحة تقرير كاملة تعمل دون اتصال بالإنترنت (Offline Report)',
      icon: Globe,
      badge: 'تفاعلي أوفلاين',
      color: 'indigo',
      bgColor: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
    }
  ];

  const dataFormats = [
    {
      id: 'csv' as ExportFormat,
      title: 'ملف مجدول CSV (UTF-8 BOM)',
      desc: 'متوافق تماماً مع Microsoft Excel والبرامج المحاسبية الخارجية',
      icon: FileCode,
      badge: 'توافق شامل',
      color: 'amber',
      bgColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800'
    },
    {
      id: 'tsv' as ExportFormat,
      title: 'ملف بنكي مجدول TSV / مساند (.tsv)',
      desc: 'مفصول بعلامة الجدولة للربط مع ملفات الرواتب والبنوك السعودية',
      icon: Layers,
      badge: 'نظام حماية الأجور',
      color: 'teal',
      bgColor: 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400 border-teal-200 dark:border-teal-800'
    },
    {
      id: 'xml' as ExportFormat,
      title: 'تكامل محاسبي وحكومي XML (.xml)',
      desc: 'ترميز XML قياسي مطابق لمحددات التبادل المؤسسي وهيئة الزكاة',
      icon: Code,
      badge: 'ZATCA / EDI',
      color: 'orange',
      bgColor: 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400 border-orange-200 dark:border-orange-800'
    },
    {
      id: 'json' as ExportFormat,
      title: 'بيانات برمجية مهيكلة JSON (.json)',
      desc: 'كائنات البيانات الخام متضمنة بيانات الحوكمة والترخيص للربط البرمجي',
      icon: FileJson,
      badge: 'API & Devs',
      color: 'zinc',
      bgColor: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
    },
    {
      id: 'markdown' as ExportFormat,
      title: 'مستند توثيق ماركداون (.md)',
      desc: 'جداول Markdown مهيكلة للأرشفة والمستودعات والذكاء الاصطناعي',
      icon: Database,
      badge: 'توثيق وذكاء اصطناعي',
      color: 'rose',
      bgColor: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800'
    }
  ];

  return (
    <div className={`relative inline-block text-right ${className}`} ref={dropdownRef}>
      <button
        onClick={() => !isExporting && setIsOpen(!isOpen)}
        disabled={isExporting}
        className={`${getButtonClass()} flex items-center gap-2 font-bold transition-all shadow-sm active:scale-95 ${isExporting ? 'opacity-70 cursor-wait' : ''}`}
        type="button"
        title="تصدير السجلات بكافة الصيغ المتاحة"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 text-emerald-500 shrink-0 animate-spin" />
        ) : (
          <Download className="w-4 h-4 text-emerald-500 shrink-0" />
        )}
        <span>{isExporting ? 'جاري التجهيز...' : buttonLabel}</span>
        {showCountBadge && data && !isExporting && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-black">
            {data.length}
          </span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Luxury Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 sm:right-auto mt-2 w-80 sm:w-[420px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl z-50 p-2.5 animate-in fade-in zoom-in-95 duration-150 max-h-[82vh] overflow-y-auto">
          {/* Header Info */}
          <div className="px-3.5 py-2.5 border-b border-zinc-100 dark:border-zinc-800/80 mb-2 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm z-10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-black text-slate-900 dark:text-white">
                تصدير الكشوفات والتقارير (10 صيغ)
              </span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 font-bold">
              {data.length} سجل جاهز
            </span>
          </div>

          {/* Section 1: Executive & Office Documents */}
          <div className="mb-2">
            <div className="px-3 py-1 text-[10px] font-black text-zinc-400 uppercase tracking-wider">
              المستندات التنفيذية والتقارير المعتمدة
            </div>
            <div className="space-y-1 mt-1">
              {documentFormats.map((fmt) => {
                const Icon = fmt.icon;
                return (
                  <button
                    key={fmt.id}
                    onClick={() => handleExport(fmt.id)}
                    className="w-full text-right p-2.5 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/80 border border-transparent hover:border-zinc-200/60 dark:hover:border-zinc-700/60 transition-all flex items-start gap-3 group"
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${fmt.bgColor} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {fmt.title}
                        </span>
                        {fmt.badge && (
                          <span className="pill-tag-mint text-[9px] font-black py-0.5 px-2">
                            {fmt.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-tight line-clamp-1 font-normal">
                        {fmt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Data Interchange & Integration */}
          <div>
            <div className="px-3 py-1 text-[10px] font-black text-zinc-400 uppercase tracking-wider border-t border-zinc-100 dark:border-zinc-800/80 pt-2">
              تكامل البيانات والأنظمة المحاسبية والبنكية
            </div>
            <div className="space-y-1 mt-1">
              {dataFormats.map((fmt) => {
                const Icon = fmt.icon;
                return (
                  <button
                    key={fmt.id}
                    onClick={() => handleExport(fmt.id)}
                    className="w-full text-right p-2.5 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/80 border border-transparent hover:border-zinc-200/60 dark:hover:border-zinc-700/60 transition-all flex items-start gap-3 group"
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${fmt.bgColor} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {fmt.title}
                        </span>
                        {fmt.badge && (
                          <span className="pill-tag-mint text-[9px] font-black py-0.5 px-2">
                            {fmt.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-tight line-clamp-1 font-normal">
                        {fmt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 px-3 py-1.5 flex items-center justify-between text-[10px] text-zinc-400 font-medium">
            <span>ترميز عربي موحد UTF-8</span>
            <span>مطابق لمعايير ZATCA & SAMA & WPS</span>
          </div>
        </div>
      )}
    </div>
  );
};

