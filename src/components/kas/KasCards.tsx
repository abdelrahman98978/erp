import React from 'react';
import { 
  Award, DollarSign, CheckCircle2, Clock, Send, RefreshCw, 
  Briefcase, CheckSquare, TrendingUp, Building2, Eye, Edit3, 
  Trash2, Printer, FileSpreadsheet, QrCode, Phone, Mail, 
  MapPin, Star, ShieldCheck, ArrowUpRight, Copy, ChevronLeft,
  Activity, Check, Sparkles, Hash, Calendar, FileText
} from 'lucide-react';
import { Badge } from '../ui/Badge';

// ============================================================================
// 1. KAS KPI METRIC CARD (بطاقة المؤشرات المالية والتشغيلية الفاخرة)
// ============================================================================

export interface KasKpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: 'emerald' | 'gold' | 'sky' | 'purple' | 'rose' | 'slate';
  progressPct?: number;
  onClick?: () => void;
}

export const KasKpiCard: React.FC<KasKpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'emerald',
  progressPct,
  onClick,
}) => {
  const variantStyles = {
    emerald: {
      gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      border: 'border-emerald-500/20 hover:border-emerald-500/50',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      glow: 'group-hover:shadow-emerald-500/10',
      accent: 'text-emerald-600 dark:text-emerald-400',
      bar: 'bg-gradient-to-r from-emerald-600 to-teal-400',
    },
    gold: {
      gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
      border: 'border-amber-500/20 hover:border-amber-500/50',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      glow: 'group-hover:shadow-amber-500/10',
      accent: 'text-amber-600 dark:text-amber-400',
      bar: 'bg-gradient-to-r from-amber-500 to-yellow-400',
    },
    sky: {
      gradient: 'from-sky-500/10 via-sky-500/5 to-transparent',
      border: 'border-sky-500/20 hover:border-sky-500/50',
      iconBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
      glow: 'group-hover:shadow-sky-500/10',
      accent: 'text-sky-600 dark:text-sky-400',
      bar: 'bg-gradient-to-r from-sky-500 to-cyan-400',
    },
    purple: {
      gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
      border: 'border-purple-500/20 hover:border-purple-500/50',
      iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      glow: 'group-hover:shadow-purple-500/10',
      accent: 'text-purple-600 dark:text-purple-400',
      bar: 'bg-gradient-to-r from-purple-600 to-indigo-400',
    },
    rose: {
      gradient: 'from-rose-500/10 via-rose-500/5 to-transparent',
      border: 'border-rose-500/20 hover:border-rose-500/50',
      iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      glow: 'group-hover:shadow-rose-500/10',
      accent: 'text-rose-600 dark:text-rose-400',
      bar: 'bg-gradient-to-r from-rose-500 to-pink-400',
    },
    slate: {
      gradient: 'from-slate-500/10 via-slate-500/5 to-transparent',
      border: 'border-slate-200 dark:border-slate-800 hover:border-slate-400',
      iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
      glow: 'group-hover:shadow-slate-500/10',
      accent: 'text-slate-900 dark:text-white',
      bar: 'bg-gradient-to-r from-slate-600 to-slate-400',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/90 border ${style.border} p-5 shadow-lg ${style.glow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Subtle Background Glow Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`} />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
        {/* Top Row: Icon + Title + Trend */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl ${style.iconBg} flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 duration-200`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">{title}</span>
              {subtitle && <span className="text-[10px] text-slate-400 dark:text-slate-500">{subtitle}</span>}
            </div>
          </div>

          {trend && (
            <span className={`inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full ${
              trend.isPositive 
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
            }`}>
              <TrendingUp className={`w-3 h-3 ${trend.isPositive ? '' : 'rotate-180'}`} />
              {trend.value}
            </span>
          )}
        </div>

        {/* Value */}
        <div className="flex items-baseline justify-between pt-1">
          <div className={`text-2xl lg:text-3xl font-black font-mono tracking-tight ${style.accent}`}>
            {value}
          </div>
        </div>

        {/* Optional Progress Bar */}
        {progressPct !== undefined && (
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>نسبة الإنجاز</span>
              <span>{progressPct}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${Math.min(progressPct, 100)}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 2. KAS TENDER / COMPETITION CARD (بطاقة كراسة المنافسة وجدول الكميات الفاخرة)
// ============================================================================

export interface KasTenderCardProps {
  tender: {
    id: string;
    referenceNumber: string;
    title: string;
    clientName: string;
    entityName?: string;
    category?: string;
    status: string;
    grandTotal: number;
    subtotal?: number;
    vatAmount?: number;
    itemsCount: number;
    submissionDate?: string;
    supplyDuration?: string;
  };
  onOpenBOQ: () => void;
  onEdit?: () => void;
  onPrint?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export const KasTenderCard: React.FC<KasTenderCardProps> = ({
  tender,
  onOpenBOQ,
  onEdit,
  onPrint,
  onDuplicate,
  onDelete,
}) => {
  const isAwarded = tender.status.includes('ترسية') || tender.status.includes('فائز') || tender.status.includes('معتمد');

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between space-y-5 overflow-hidden">
      {/* Top Accent Strip */}
      <div className={`absolute top-0 right-0 left-0 h-1.5 ${
        isAwarded 
          ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600' 
          : 'bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400'
      }`} />

      {/* Header Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5" />
            {tender.referenceNumber}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
            isAwarded
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
              : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
          }`}>
            {tender.status}
          </span>
        </div>

        <h3 className="text-base font-black text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors pt-1">
          {tender.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{tender.clientName}</span>
        </div>
      </div>

      {/* Financial & Items Overview Box */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
        <div className="flex items-baseline justify-between">
          <span className="text-slate-500 dark:text-slate-400">القيمة شاملة الضريبة:</span>
          <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
            {tender.grandTotal.toLocaleString()} <span className="text-xs font-sans">ر.س</span>
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
          <span>بنود الكراسة: <strong className="text-slate-700 dark:text-slate-300 font-mono">{tender.itemsCount}</strong> بند</span>
          {tender.submissionDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {tender.submissionDate}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onOpenBOQ}
          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-2xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>محرر جدول الكميات (BOQ)</span>
        </button>

        {onPrint && (
          <button
            onClick={onPrint}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl transition"
            title="طباعة العرض الرسمي"
          >
            <Printer className="w-4 h-4" />
          </button>
        )}

        {onEdit && (
          <button
            onClick={onEdit}
            className="p-2.5 bg-slate-100 hover:bg-amber-50 hover:text-amber-600 dark:bg-slate-800 dark:hover:bg-amber-950 text-slate-700 dark:text-slate-300 rounded-2xl transition"
            title="تعديل المنافسة"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}

        {onDuplicate && (
          <button
            onClick={onDuplicate}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl transition"
            title="نسخ المنافسة"
          >
            <Copy className="w-4 h-4" />
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            className="p-2.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 dark:bg-slate-800 dark:hover:bg-red-950 text-slate-700 dark:text-slate-300 rounded-2xl transition"
            title="حذف المنافسة"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 3. KAS SUPPLIER SCORECARD CARD (بطاقة المورد المعتمد والتقييم)
// ============================================================================

export interface KasSupplierCardProps {
  supplier: {
    id: string;
    name: string;
    category: string;
    city: string;
    contactPerson?: string;
    phone: string;
    email?: string;
    rating: number;
    qualityScore: number;
    commitmentScore: number;
    priceCompetitiveness: number;
    totalDeals: number;
    totalValue: number;
    status: string;
  };
  onContactWhatsApp?: () => void;
  onEdit?: () => void;
}

export const KasSupplierCard: React.FC<KasSupplierCardProps> = ({
  supplier,
  onContactWhatsApp,
  onEdit,
}) => {
  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-300 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-200 dark:border-emerald-800">
            {supplier.category}
          </span>
          <h4 className="text-base font-black text-slate-900 dark:text-white mt-1 group-hover:text-emerald-600 transition-colors">
            {supplier.name}
          </h4>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{supplier.city}</span>
            <span>•</span>
            <span>{supplier.contactPerson}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-xl border border-amber-200 dark:border-amber-800">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="font-bold text-xs text-amber-700 dark:text-amber-300">{supplier.rating}.0</span>
        </div>
      </div>

      {/* Triple Score Metric Bars */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl space-y-2 text-xs">
        <div>
          <div className="flex justify-between text-[11px] font-semibold mb-1">
            <span className="text-slate-600 dark:text-slate-400">جودة المواد والتوريد</span>
            <span className="font-mono text-emerald-600">{supplier.qualityScore}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${supplier.qualityScore}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] font-semibold mb-1">
            <span className="text-slate-600 dark:text-slate-400">الالتزام بمواعيد التسليم</span>
            <span className="font-mono text-sky-600">{supplier.commitmentScore}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-sky-500 h-full rounded-full" style={{ width: `${supplier.commitmentScore}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] font-semibold mb-1">
            <span className="text-slate-600 dark:text-slate-400">التنافسية السعرية</span>
            <span className="font-mono text-amber-600">{supplier.priceCompetitiveness}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${supplier.priceCompetitiveness}%` }} />
          </div>
        </div>
      </div>

      {/* Contact Action */}
      <div className="flex items-center gap-2 pt-1">
        <a
          href={`tel:${supplier.phone}`}
          className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-600" />
          <span>اتصال</span>
        </a>
        <a
          href={`mailto:${supplier.email}`}
          className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
        >
          <Mail className="w-3.5 h-3.5 text-sky-600" />
          <span>بريد</span>
        </a>
      </div>
    </div>
  );
};

// ============================================================================
// 4. KAS INVOICE CARD (بطاقة الفاتورة الضريبية ZATCA الفاخرة)
// ============================================================================

export interface KasInvoiceCardProps {
  invoice: {
    id: string;
    invoiceNumber: string;
    clientName: string;
    amount: number;
    taxAmount: number;
    total?: number;
    date: string;
    dueDate: string;
    status: string;
    project?: string;
  };
  onViewZatca: () => void;
  onQuickPay?: () => void;
  onDelete?: () => void;
}

export const KasInvoiceCard: React.FC<KasInvoiceCardProps> = ({
  invoice,
  onViewZatca,
  onQuickPay,
  onDelete,
}) => {
  const isPaid = invoice.status === 'مدفوع';
  const grandTotal = invoice.total || (invoice.amount + invoice.taxAmount);

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-300 space-y-4 overflow-hidden">
      {/* Top Accent line */}
      <div className={`absolute top-0 right-0 left-0 h-1.5 ${
        isPaid 
          ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
          : 'bg-gradient-to-r from-amber-500 to-rose-400'
      }`} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
          <Hash className="w-3.5 h-3.5" />
          {invoice.invoiceNumber}
        </span>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
          isPaid
            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
        }`}>
          {invoice.status}
        </span>
      </div>

      <div>
        <h4 className="text-base font-black text-slate-900 dark:text-white leading-snug line-clamp-1 group-hover:text-emerald-600 transition-colors">
          {invoice.clientName}
        </h4>
        {invoice.project && (
          <span className="text-xs text-slate-400 mt-0.5 block truncate">
            المشروع: {invoice.project}
          </span>
        )}
      </div>

      {/* Financial Details */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
        <div className="flex items-baseline justify-between">
          <span className="text-slate-500 dark:text-slate-400">الإجمالي شامل الضريبة:</span>
          <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
            {grandTotal.toLocaleString()} <span className="text-xs font-sans">ر.س</span>
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
          <span>الضريبة (15%): <strong className="text-slate-600 dark:text-slate-300 font-mono">{invoice.taxAmount.toLocaleString()} ر.س</strong></span>
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3 text-slate-400" />
            استحقاق: {invoice.dueDate}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onViewZatca}
          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-2xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5"
        >
          <QrCode className="w-4 h-4" />
          <span>عرض / ZATCA Phase 2</span>
        </button>

        {!isPaid && onQuickPay && (
          <button
            onClick={onQuickPay}
            className="py-2.5 px-3 bg-sky-50 hover:bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 text-xs font-black rounded-2xl transition"
            title="تسجيل سداد"
          >
            سداد
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            className="p-2.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 dark:bg-slate-800 dark:hover:bg-red-950 text-slate-600 rounded-2xl transition"
            title="حذف الفاتورة"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

