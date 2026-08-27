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
    <div className="space-y-6 font-sans select-none dir-rtl text-right" style={{ fontFamily: 'var(--font-family-ui)', fontFeatureSettings: '"ss03" 1' }}>
      {/* Top Banner Header */}
      <div className="card-pricing" style={{ padding: '16px 20px', borderRadius: '16px', background: '#ffffff', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '9999px', background: '#000000', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '12px' }}>
            SMACC
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 550, color: '#000000', margin: 0 }}>لوحة التحكم الهيكلية (نظام SMACC للمحاسبة)</h3>
              <span className="pill-tag-mint" style={{ fontSize: '10.5px' }}>
                مطابق 100%
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#71717a', margin: '2px 0 0 0' }}>الصفحة الرئيسية • متابعة الحركة المالية والأقسام التشغيلية</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#71717a' }}>الفترة الزمنية:</span>
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="text-input"
            style={{ height: '36px', minHeight: '36px', borderRadius: '9999px', fontSize: '12px', padding: '0 14px' }}
          >
            <option value="الأيام الأخيرة">الأيام الأخيرة</option>
            <option value="هذا الشهر">هذا الشهر</option>
            <option value="الربع الحالي">الربع الحالي</option>
            <option value="السنة المالية 2026">السنة المالية 2026</option>
          </select>
        </div>
      </div>

      {/* Top 3 Stat Counter Cards with Level 3 Stacked Shadows and Thin 330 Display Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: عدد البائعين */}
        <div className="card-pricing" style={{ padding: '22px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 550, color: '#71717a', display: 'block', marginBottom: '4px' }}>عدد البائعين</span>
            <span className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', letterSpacing: '-0.02em' }}>2</span>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: '#000000', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: عدد العملاء */}
        <div className="card-pistachio-band" style={{ padding: '22px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 550, color: '#000000', display: 'block', marginBottom: '4px' }}>عدد العملاء</span>
            <span className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', letterSpacing: '-0.02em' }}>4</span>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: '#ffffff', color: '#000000', border: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: عدد محصلين المبيعات */}
        <div className="card-pricing" style={{ padding: '22px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 550, color: '#71717a', display: 'block', marginBottom: '4px' }}>عدد محصلين المبيعات</span>
            <span className="display-sm" style={{ fontSize: '36px', fontWeight: 330, color: '#000000', letterSpacing: '-0.02em' }}>1</span>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: '#f4f4f5', color: '#000000', border: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid Section 1: Financial Movement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box 1: مدفوعات (Payments) */}
        <div className="card-pricing" style={{ padding: '22px', borderRadius: '16px', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e4e4e7', paddingBottom: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#000000' }} />
              <h4 style={{ fontSize: '14px', fontWeight: 550, color: '#000000', margin: 0 }}>مدفوعات (Payment Summary)</h4>
            </div>
            <span className="pill-tag-shade" style={{ fontSize: '11px' }}>
              {periodFilter}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div style={{ background: '#fafafa', padding: '12px', borderRadius: '12px', border: '1px solid #e4e4e7' }}>
              <span style={{ fontSize: '11px', color: '#71717a', display: 'block' }}>إجمالي الدفعات</span>
              <span style={{ fontSize: '15px', fontWeight: 550, color: '#000000', marginTop: '2px', display: 'block' }}>0.00 ر.س</span>
            </div>
            <div style={{ background: '#fafafa', padding: '12px', borderRadius: '12px', border: '1px solid #e4e4e7' }}>
              <span style={{ fontSize: '11px', color: '#71717a', display: 'block' }}>المدفوعات النقدية</span>
              <span style={{ fontSize: '15px', fontWeight: 550, color: '#000000', marginTop: '2px', display: 'block' }}>0.00 ر.س</span>
            </div>
            <div style={{ background: '#fafafa', padding: '12px', borderRadius: '12px', border: '1px solid #e4e4e7' }}>
              <span style={{ fontSize: '11px', color: '#71717a', display: 'block' }}>مدفوعات الشيك</span>
              <span style={{ fontSize: '15px', fontWeight: 550, color: '#000000', marginTop: '2px', display: 'block' }}>0.00 ر.س</span>
            </div>
            <div style={{ background: '#fafafa', padding: '12px', borderRadius: '12px', border: '1px solid #e4e4e7' }}>
              <span style={{ fontSize: '11px', color: '#71717a', display: 'block' }}>الدفعات المحولة</span>
              <span style={{ fontSize: '15px', fontWeight: 550, color: '#000000', marginTop: '2px', display: 'block' }}>0.00 ر.س</span>
            </div>
          </div>

          <div style={{ padding: '12px', background: '#fafafa', borderRadius: '12px', textAlign: 'center', fontSize: '12px', color: '#71717a', border: '1px dashed #e4e4e7', marginTop: '12px' }}>
            السجل غير موجود (جاهز لاستقبال سندات الصرف الجديدة)
          </div>
        </div>

        {/* Box 2: ايصالات استلام (Receipt Vouchers) */}
        <div className="card-pricing" style={{ padding: '22px', borderRadius: '16px', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e4e4e7', paddingBottom: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#000000' }} />
              <h4 style={{ fontSize: '14px', fontWeight: 550, color: '#000000', margin: 0 }}>ايصالات استلام (Receipt Vouchers)</h4>
            </div>
            <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
              {periodFilter}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div style={{ background: '#fafafa', padding: '12px', borderRadius: '12px', border: '1px solid #e4e4e7' }}>
              <span style={{ fontSize: '11px', color: '#71717a', display: 'block' }}>إجمالي الايصالات</span>
              <span style={{ fontSize: '15px', fontWeight: 550, color: '#000000', marginTop: '2px', display: 'block' }}>0.00 ر.س</span>
            </div>
            <div style={{ background: '#fafafa', padding: '12px', borderRadius: '12px', border: '1px solid #e4e4e7' }}>
              <span style={{ fontSize: '11px', color: '#71717a', display: 'block' }}>سند استلام نقدي</span>
              <span style={{ fontSize: '15px', fontWeight: 550, color: '#000000', marginTop: '2px', display: 'block' }}>0.00 ر.س</span>
            </div>
            <div style={{ background: '#fafafa', padding: '12px', borderRadius: '12px', border: '1px solid #e4e4e7' }}>
              <span style={{ fontSize: '11px', color: '#71717a', display: 'block' }}>ايصالات الشيك</span>
              <span style={{ fontSize: '15px', fontWeight: 550, color: '#000000', marginTop: '2px', display: 'block' }}>0.00 ر.س</span>
            </div>
            <div style={{ background: '#fafafa', padding: '12px', borderRadius: '12px', border: '1px solid #e4e4e7' }}>
              <span style={{ fontSize: '11px', color: '#71717a', display: 'block' }}>الايصالات المحولة</span>
              <span style={{ fontSize: '15px', fontWeight: 550, color: '#000000', marginTop: '2px', display: 'block' }}>0.00 ر.س</span>
            </div>
          </div>

          <div style={{ padding: '12px', background: '#fafafa', borderRadius: '12px', textAlign: 'center', fontSize: '12px', color: '#71717a', border: '1px dashed #e4e4e7', marginTop: '12px' }}>
            السجل غير موجود (جاهز لاستقبال سندات القبض والإيداعات)
          </div>
        </div>
      </div>

      {/* Grid Section 2: Purchasing & Orders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Box 3: عرض اسعار المشتروات */}
        <div className="card-pricing" style={{ padding: '20px', borderRadius: '16px', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e4e4e7', paddingBottom: '10px', marginBottom: '14px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 550, color: '#000000', margin: 0 }}>عرض اسعار المشتروات</h4>
            <span className="pill-tag-shade" style={{ fontSize: '10.5px' }}>{periodFilter}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div style={{ background: '#fafafa', padding: '10px', borderRadius: '10px', border: '1px solid #e4e4e7' }}>
              <span style={{ fontSize: '10.5px', color: '#71717a', display: 'block' }}>عدد عروض الاسعار</span>
              <span style={{ fontWeight: 550, color: '#000000' }}>0.00</span>
            </div>
            <div style={{ background: '#fafafa', padding: '10px', borderRadius: '10px', border: '1px solid #e4e4e7' }}>
              <span style={{ fontSize: '10.5px', color: '#71717a', display: 'block' }}>إجمالي عروض الاسعار</span>
              <span style={{ fontWeight: 550, color: '#000000' }}>0.00</span>
            </div>
            <div style={{ background: '#fafafa', padding: '10px', borderRadius: '10px', border: '1px solid #e4e4e7' }}>
              <span style={{ fontSize: '10.5px', color: '#71717a', display: 'block' }}>كمية عروض الاسعار</span>
              <span style={{ fontWeight: 550, color: '#000000' }}>0.00</span>
            </div>
            <div style={{ background: '#fafafa', padding: '10px', borderRadius: '10px', border: '1px solid #e4e4e7' }}>
              <span style={{ fontSize: '10.5px', color: '#71717a', display: 'block' }}>الكمية المعالجة</span>
              <span style={{ fontWeight: 550, color: '#000000' }}>0.00</span>
            </div>
          </div>

          <div style={{ padding: '10px', background: '#fafafa', borderRadius: '10px', textAlign: 'center', fontSize: '11px', color: '#71717a', marginTop: '12px', border: '1px solid #e4e4e7' }}>
            السجل غير موجود
          </div>
        </div>

        {/* Box 4: فاتورة الشراء */}
        <div className="card-pricing" style={{ padding: '20px', borderRadius: '16px', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e4e4e7', paddingBottom: '10px', marginBottom: '14px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 550, color: '#000000', margin: 0 }}>فاتورة الشراء</h4>
            <span className="pill-tag-shade" style={{ fontSize: '10.5px' }}>{periodFilter}</span>
          </div>

          <div style={{ background: '#fafafa', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e4e4e7' }}>
            <span style={{ fontSize: '11px', color: '#71717a', display: 'block' }}>إجمالي قيمة فواتير الشراء</span>
            <span className="display-sm" style={{ fontSize: '24px', fontWeight: 330, color: '#000000', marginTop: '4px', display: 'block' }}>0.00 ر.س</span>
          </div>

          <div style={{ padding: '10px', background: '#fafafa', borderRadius: '10px', textAlign: 'center', fontSize: '11px', color: '#71717a', marginTop: '12px', border: '1px solid #e4e4e7' }}>
            السجل غير موجود
          </div>
        </div>

        {/* Box 5: أمر الشراء */}
        <div className="card-pricing" style={{ padding: '20px', borderRadius: '16px', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e4e4e7', paddingBottom: '10px', marginBottom: '14px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 550, color: '#000000', margin: 0 }}>أمر الشراء</h4>
            <span className="pill-tag-mint" style={{ fontSize: '10.5px' }}>{periodFilter}</span>
          </div>

          <div style={{ background: '#fafafa', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e4e4e7' }}>
            <span style={{ fontSize: '11px', color: '#71717a', display: 'block' }}>إجمالي أوامر الشراء المعتمدة</span>
            <span className="display-sm" style={{ fontSize: '24px', fontWeight: 330, color: '#000000', marginTop: '4px', display: 'block' }}>0.00 ر.س</span>
          </div>

          <div style={{ padding: '10px', background: '#fafafa', borderRadius: '10px', textAlign: 'center', fontSize: '11px', color: '#71717a', marginTop: '12px', border: '1px solid #e4e4e7' }}>
            السجل غير موجود
          </div>
        </div>
      </div>
    </div>
  );
};
