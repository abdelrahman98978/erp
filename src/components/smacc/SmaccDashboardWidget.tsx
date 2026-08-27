import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  CreditCard,
  Receipt,
  FileText,
  ShoppingCart,
  RotateCcw,
  ChevronDown,
  Filter,
  BarChart2
} from 'lucide-react';

export const SmaccDashboardWidget: React.FC = () => {
  const [periodFilter, setPeriodFilter] = useState('الأيام الأخيرة');

  return (
    <div className="space-y-6 font-sans select-none dir-rtl text-right">
      {/* Top Banner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
            SMACC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">لوحة التحكم الهيكلية (نظام SMACC للمحاسبة)</h3>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                مطابق 100%
              </span>
            </div>
            <p className="text-xs text-slate-400">الصفحة الرئيسية • متابعة الحركة المالية والأقسام التشغيلية</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">الفترة الزمنية:</span>
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="الأيام الأخيرة">الأيام الأخيرة</option>
            <option value="هذا الشهر">هذا الشهر</option>
            <option value="الربع الحالي">الربع الحالي</option>
            <option value="السنة المالية 2026">السنة المالية 2026</option>
          </select>
        </div>
      </div>

      {/* Top 3 Stat Counter Cards matching SMACC Screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: عدد البائعين */}
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">عدد البائعين</span>
            <span className="text-3xl font-black text-white tracking-tight">2</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: عدد العملاء */}
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">عدد العملاء</span>
            <span className="text-3xl font-black text-white tracking-tight">4</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: عدد محصلين المبيعات */}
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">عدد محصلين المبيعات</span>
            <span className="text-3xl font-black text-white tracking-tight">1</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid Section 1: Financial Movement (مدفوعات & ايصالات استلام) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box 1: مدفوعات (Payments) */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-400" />
              <h4 className="font-bold text-white text-sm">مدفوعات (Payment Summary)</h4>
            </div>
            <div className="px-2.5 py-1 bg-slate-900 rounded-lg text-[11px] text-slate-300 border border-slate-700">
              {periodFilter}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">إجمالي الدفعات</span>
              <span className="text-base font-extrabold text-white mt-1 block">0.00 ر.س</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">المدفوعات النقدية</span>
              <span className="text-base font-extrabold text-white mt-1 block">0.00 ر.س</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">مدفوعات الشيك</span>
              <span className="text-base font-extrabold text-white mt-1 block">0.00 ر.س</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">الدفعات المحولة</span>
              <span className="text-base font-extrabold text-white mt-1 block">0.00 ر.س</span>
            </div>
          </div>

          <div className="p-4 bg-slate-900/50 rounded-xl text-center text-xs text-slate-500 border border-dashed border-slate-700">
            السجل غير موجود (جاهز لاستقبال سندات الصرف الجديدة)
          </div>
        </div>

        {/* Box 2: ايصالات استلام (Receipt Vouchers) */}
        <div className="bg-slate-800 rounded-2xl border border-blue-500/30 p-5 space-y-4 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1 bg-blue-500" />
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <h4 className="font-bold text-white text-sm">ايصالات استلام (Receipt Vouchers)</h4>
            </div>
            <div className="px-2.5 py-1 bg-slate-900 rounded-lg text-[11px] text-blue-300 border border-blue-500/30">
              {periodFilter}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">إجمالي الايصالات</span>
              <span className="text-base font-extrabold text-blue-400 mt-1 block">0.00 ر.س</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">سند استلام نقدي</span>
              <span className="text-base font-extrabold text-blue-400 mt-1 block">0.00 ر.س</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">ايصالات الشيك</span>
              <span className="text-base font-extrabold text-blue-400 mt-1 block">0.00 ر.س</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">الايصالات المحولة</span>
              <span className="text-base font-extrabold text-blue-400 mt-1 block">0.00 ر.س</span>
            </div>
          </div>

          <div className="p-4 bg-blue-950/30 rounded-xl text-center text-xs text-blue-400/70 border border-dashed border-blue-800/50">
            السجل غير موجود (جاهز لاستقبال سندات القبض والإيداعات)
          </div>
        </div>
      </div>

      {/* Grid Section 2: Purchasing & Orders (عرض اسعار المشتروات / امر الشراء / فاتورة الشراء) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Box 3: عرض اسعار المشتروات */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4 space-y-3 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
            <h4 className="font-bold text-white text-xs">عرض اسعار المشتروات</h4>
            <span className="text-[10px] text-slate-400">{periodFilter}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-900 p-2 rounded-lg">
              <span className="text-[10px] text-slate-400 block">عدد عروض الاسعار</span>
              <span className="font-bold text-white">0.00</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg">
              <span className="text-[10px] text-slate-400 block">إجمالي عروض الاسعار</span>
              <span className="font-bold text-white">0.00</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg">
              <span className="text-[10px] text-slate-400 block">كمية عروض الاسعار</span>
              <span className="font-bold text-white">0.00</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg">
              <span className="text-[10px] text-slate-400 block">الكمية التي تمت معالجتها</span>
              <span className="font-bold text-white">0.00</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/40 rounded-lg text-center text-[11px] text-slate-500">
            السجل غير موجود
          </div>
        </div>

        {/* Box 4: فاتورة الشراء */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4 space-y-3 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
            <h4 className="font-bold text-white text-xs">فاتورة الشراء</h4>
            <span className="text-[10px] text-slate-400">{periodFilter}</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl text-center">
            <span className="text-[11px] text-slate-400 block">إجمالي قيمة فواتير الشراء</span>
            <span className="text-xl font-bold text-white mt-1 block">0.00 ر.س</span>
          </div>

          <div className="p-3 bg-slate-900/40 rounded-lg text-center text-[11px] text-slate-500">
            السجل غير موجود
          </div>
        </div>

        {/* Box 5: أمر الشراء */}
        <div className="bg-slate-800 rounded-2xl border border-blue-500/40 p-4 space-y-3 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
            <h4 className="font-bold text-white text-xs">أمر الشراء</h4>
            <span className="text-[10px] text-blue-300">{periodFilter}</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl text-center border border-blue-900/40">
            <span className="text-[11px] text-slate-400 block">إجمالي أوامر الشراء المعتمدة</span>
            <span className="text-xl font-bold text-blue-400 mt-1 block">0.00 ر.س</span>
          </div>

          <div className="p-3 bg-blue-950/30 rounded-lg text-center text-[11px] text-blue-400/60">
            السجل غير موجود
          </div>
        </div>
      </div>
    </div>
  );
};
