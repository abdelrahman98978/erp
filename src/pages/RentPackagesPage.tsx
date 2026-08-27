import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { realErpDataStore } from '../services/realErpDataStore';
import { Package, Calculator, FileText, Plus, Check, PenSquare, FileSignature, FileSpreadsheet, X } from 'lucide-react';

export interface RentPackage {
  id: string;
  name: string;
  category: 'أفراد وعائلات' | 'شركات وقطاع تجاري' | 'ساعات وضيافة';
  duration_months: number;
  monthly_rate: number;
  vat_inclusive: boolean;
  discount_percentage: number;
  security_deposit: number;
  active_contracts: number;
  features: string[];
  terms_summary: string;
}

export interface ContractTermClause {
  id: string;
  clause_no: number;
  title: string;
  text: string;
  is_mandatory: boolean;
}

const MOCK_PACKAGES: RentPackage[] = [
  {
    id: 'PKG-01',
    name: 'الباقة الشهرية المرنة (Flexible Monthly)',
    category: 'أفراد وعائلات',
    duration_months: 1,
    monthly_rate: 2450,
    vat_inclusive: true,
    discount_percentage: 0,
    security_deposit: 500,
    active_contracts: 8,
    features: [
      'ضمان استبدال فوري خلال 48 ساعة',
      'تغطية تأمينية كاملة ضد هروب العاملة',
      'إشراف صحي ورعاية طبية شهرية',
      'خدمة توصيل مجانية لمقر العميل'
    ],
    terms_summary: 'تجديد شهري تلقائي ما لم يخطر الطرف الأول قبل 5 أيام من نهاية المدة.'
  },
  {
    id: 'PKG-02',
    name: 'باقة الـ 3 أشهر الذهبية (Quarterly)',
    category: 'أفراد وعائلات',
    duration_months: 3,
    monthly_rate: 2200,
    vat_inclusive: true,
    discount_percentage: 10,
    security_deposit: 1000,
    active_contracts: 14,
    features: [
      'خصم 10% على إجمالي قيمة العقد',
      'ضمان شامل واستبدال مرتين مجاناً',
      'دعم مباشر على مدار الساعة 24/7',
      'إمكانية التقسيط الشهري عبر سندات قبض'
    ],
    terms_summary: 'سداد الدفعة الأولى عند توقيع العقد والباقي وفق جدول الدفعات المحاسبي المعتمد.'
  },
  {
    id: 'PKG-03',
    name: 'الباقة السنوية الماسية (Annual 12 Months)',
    category: 'أفراد وعائلات',
    duration_months: 12,
    monthly_rate: 1950,
    vat_inclusive: true,
    discount_percentage: 20,
    security_deposit: 1500,
    active_contracts: 22,
    features: [
      'أعلى نسبة خصم (20% توفير سنوي)',
      'استبدال غير محدود طوال مدة العقد',
      'سندات سداد ميسرة مقسمة على 4 دفعات',
      'خدمة كبار العملاء VIP مع مدير حساب مخصص'
    ],
    terms_summary: 'تلتزم المجموعة بتوفير بديل مطابق للمواصفات في حال طلب العميل التغيير.'
  },
  {
    id: 'PKG-04',
    name: 'باقة قطاع الأعمال والشركات (Corporate Staff)',
    category: 'شركات وقطاع تجاري',
    duration_months: 12,
    monthly_rate: 1750,
    vat_inclusive: false,
    discount_percentage: 15,
    security_deposit: 2000,
    active_contracts: 6,
    features: [
      'إصدار فواتير ضريبية B2B معتمدة من ZATCA',
      'إشراف عمالي وإقامة وسكن مجهز',
      'نقل وتوزيع يومي عبر أسطول المجموعة',
      'عقود موحدة معتمدة من منصة قوى'
    ],
    terms_summary: 'تخضع للشروط العامة لعقود توريد الكوادر التشغيلية للشركات والمؤسسات.'
  }
];

const MOCK_TERMS: ContractTermClause[] = [
  {
    id: 'TRM-1',
    clause_no: 1,
    title: 'موضوع العقد والالتزامات العامة',
    text: 'يقوم الطرف الأول (مجموعة السليم) بتأجير وتقديم خدمات العمالة المنزلية المحددة بالملحق للطرف الثاني وفق المعايير والأنظمة المعمول بها في المملكة العربية السعودية.',
    is_mandatory: true
  },
  {
    id: 'TRM-2',
    clause_no: 2,
    title: 'الضمان والاستبدال',
    text: 'يحق للطرف الثاني طلب استبدال العاملة في حال رفض العمل أو عدم الكفاءة المهنية، وتلتزم الشركة بتوفير بديل خلال 48 ساعة عمل من تاريخ استلام الإشعار.',
    is_mandatory: true
  },
  {
    id: 'TRM-3',
    clause_no: 3,
    title: 'التأمين وحالات الهروب',
    text: 'تتحمل الشركة كافة الإجراءات النظامية والقانونية وإلغاء الإقامة وتوفير عاملة بديلة في حالة ثبوت هروب العاملة دون أي أعباء مالية إضافية على العميل.',
    is_mandatory: true
  },
  {
    id: 'TRM-4',
    clause_no: 4,
    title: 'شروط السداد والفواتير',
    text: 'يتم سداد القيمة الإيجارية وفق المواعيد المحددة في جدول الدفعات، ويصدر للمستأجر فاتورة ضريبية رسمية متوافقة مع متطلبات هيئة الزكاة والضريبة والجمارك (ZATCA).',
    is_mandatory: true
  }
];

export const RentPackagesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'packages' | 'calculator' | 'terms'>('packages');
  const [packages, setPackages] = useState<RentPackage[]>([]);
  const [terms] = useState<ContractTermClause[]>(MOCK_TERMS);
  const [showAddModal, setShowAddModal] = useState(false);

  // Pricing Calculator State
  const [calcDuration, setCalcDuration] = useState<number>(3);
  const [calcWorkersCount, setCalcWorkersCount] = useState<number>(1);
  const [calcBaseRate, setCalcBaseRate] = useState<number>(2200);

  // New Package Form
  const [formData, setFormData] = useState({
    name: '',
    category: 'أفراد وعائلات' as const,
    duration_months: 3,
    monthly_rate: 2200,
    discount_percentage: 10,
    security_deposit: 1000,
    featuresText: 'ضمان بديل فوري\nخدمة توصيل للمنزل\nدعم على مدار الساعة',
    terms_summary: 'تخضع للشروط والأحكام المعتمدة في عقد التأجير الموحد.'
  });

  useEffect(() => {
    realErpDataStore.getRecords<RentPackage>('rent_packages', MOCK_PACKAGES).then(data => setPackages(data));
  }, []);

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPkg: RentPackage = {
      id: `PKG-0${packages.length + 1}`,
      name: formData.name,
      category: formData.category,
      duration_months: Number(formData.duration_months),
      monthly_rate: Number(formData.monthly_rate),
      vat_inclusive: true,
      discount_percentage: Number(formData.discount_percentage),
      security_deposit: Number(formData.security_deposit),
      active_contracts: 0,
      features: formData.featuresText.split('\n').filter(f => f.trim()),
      terms_summary: formData.terms_summary
    };

    const updated = await realErpDataStore.addRecord<RentPackage>('rent_packages', newPkg, MOCK_PACKAGES);
    setPackages(updated);
    setShowAddModal(false);
  };

  const calcSubtotal = calcBaseRate * calcDuration * calcWorkersCount;
  const calcDiscount = calcDuration >= 12 ? calcSubtotal * 0.2 : calcDuration >= 3 ? calcSubtotal * 0.1 : 0;
  const calcTotalAfterDiscount = calcSubtotal - calcDiscount;
  const calcVat = calcTotalAfterDiscount * 0.15;
  const calcGrandTotal = calcTotalAfterDiscount + calcVat;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div
        className="card-feature-cinematic"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#000000',
          color: '#FFF',
          padding: '28px',
          borderRadius: '16px',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        }}
      >
        <div className="flex items-center gap-3">
          <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>PRICING & BUNDLES</span>
            </div>
            <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
              باقات التأجير وهوامش الربح
            </h1>
            <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '4px 0 0 0', fontWeight: 420 }}>
              هيكلة الأسعار، حاسبة عروض الأسعار B2B/B2C، وشروط وثيقة التعاقد
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="button-white-pill"
            style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
          >
            <Plus className="w-4 h-4 ml-1" />
            <span>+ إضافة باقة جديدة</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-200 pb-3">
        {[
          { id: 'packages', label: `الباقات المعتمدة (${packages.length})` },
          { id: 'calculator', label: 'حاسبة عروض الأسعار والهوامش' },
          { id: 'terms', label: 'بنود وشروط وثيقة التأجير' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
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
              }}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PACKAGES LIST */}
      {activeTab === 'packages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="card-pricing" style={{ padding: '24px', borderRadius: '24px', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="pill-tag-shade" style={{ fontSize: '11px' }}>{pkg.category}</span>
                  <span className="pill-tag-mint" style={{ fontSize: '11px' }}>{pkg.active_contracts} عقد نشط</span>
                </div>

                <h3 className="text-base font-bold text-black mb-1">{pkg.name}</h3>
                <p className="text-xs text-zinc-500 mb-4">{pkg.terms_summary}</p>

                <div className="py-3 px-4 bg-zinc-50 rounded-2xl mb-4 border border-zinc-100 flex justify-between items-baseline">
                  <div>
                    <span className="text-2xl font-mono font-bold text-black">{pkg.monthly_rate.toLocaleString()}</span>
                    <span className="text-xs text-zinc-500 mr-1">ر.س / شهر</span>
                  </div>
                  {pkg.discount_percentage > 0 && (
                    <span className="pill-tag-mint" style={{ fontSize: '10.5px' }}>خصم {pkg.discount_percentage}%</span>
                  )}
                </div>

                <div className="space-y-2 mb-6">
                  <span className="text-xs text-zinc-500 font-bold block mb-1">المزايا والضمانات المشمولة:</span>
                  <ul className="space-y-1.5 text-xs text-zinc-700">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-2 border-t border-zinc-100 pt-4">
                <button
                  className="button-outline-on-light flex-1"
                  style={{ fontSize: '12px', minHeight: '34px', padding: '4px 10px' }}
                >
                  <PenSquare className="w-3.5 h-3.5 ml-1" />
                  <span>تعديل الباقة</span>
                </button>
                <button
                  className="button-primary-pill flex-1"
                  style={{ fontSize: '12px', minHeight: '34px', padding: '4px 10px' }}
                >
                  <FileSignature className="w-3.5 h-3.5 ml-1" />
                  <span>إنشاء عقد</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: PRICING CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="card-pricing" style={{ padding: '28px', borderRadius: '24px', background: '#ffffff' }}>
          <h2 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            <span>حاسبة عروض الأسعار وهوامش الربح لعقود التأجير</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-700 block mb-1 font-semibold">مدة التعاقد (بالأشهر)</label>
                <select
                  value={calcDuration}
                  onChange={(e) => setCalcDuration(Number(e.target.value))}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2.5 px-3 text-xs text-black focus:border-black focus:outline-none"
                >
                  <option value={1}>شهر واحد (باقة مرنة)</option>
                  <option value={3}>3 أشهر (ربع سنوي - خصم 10%)</option>
                  <option value={6}>6 أشهر (نصف سنوي - خصم 15%)</option>
                  <option value={12}>12 شهراً (سنوي كامل - خصم 20%)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-700 block mb-1 font-semibold">عدد العاملات / الكوادر المطلوبة</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={calcWorkersCount}
                  onChange={(e) => setCalcWorkersCount(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-700 block mb-1 font-semibold">سعر الإيجار الشهري للعاملة الواحدة (ر.س)</label>
                <input
                  type="number"
                  step={50}
                  value={calcBaseRate}
                  onChange={(e) => setCalcBaseRate(Number(e.target.value))}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono font-bold focus:border-black focus:outline-none"
                />
              </div>
            </div>

            {/* Calculated Breakdown Card */}
            <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-black mb-3">تفاصيل العرض المالي للعقد الموحد</h3>

                <div className="flex justify-between text-xs py-2 border-b border-zinc-200 text-zinc-600">
                  <span>القيمة الأساسية ({calcDuration} شهر × {calcWorkersCount} عاملة):</span>
                  <span className="font-mono font-bold text-black">{calcSubtotal.toLocaleString()} ر.س</span>
                </div>

                <div className="flex justify-between text-xs py-2 border-b border-zinc-200 text-emerald-700 font-semibold">
                  <span>الخصم الترويجي المطبق:</span>
                  <span className="font-mono font-bold">- {calcDiscount.toLocaleString()} ر.س</span>
                </div>

                <div className="flex justify-between text-xs py-2 border-b border-zinc-200 text-zinc-600">
                  <span>المبلغ الخاضع للضريبة:</span>
                  <span className="font-mono font-bold text-black">{calcTotalAfterDiscount.toLocaleString()} ر.س</span>
                </div>

                <div className="flex justify-between text-xs py-2 border-b border-zinc-200 text-zinc-600">
                  <span>ضريبة القيمة المضافة (15% ZATCA):</span>
                  <span className="font-mono font-bold text-black">{calcVat.toLocaleString()} ر.س</span>
                </div>

                <div className="flex justify-between text-base py-3 font-bold text-black mt-2">
                  <span>الإجمالي النهائي شامل الضريبة:</span>
                  <span className="font-mono text-emerald-700 text-lg">{calcGrandTotal.toLocaleString()} ر.س</span>
                </div>
              </div>

              <button
                className="button-primary-pill w-full mt-4"
                style={{ minHeight: '38px', fontSize: '12.5px', padding: '8px 20px' }}
              >
                <FileSpreadsheet className="w-4 h-4 ml-1.5" />
                <span>تصدير عرض سعر رسمي (PDF Quotation)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONTRACT TERMS */}
      {activeTab === 'terms' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-black">بنود وشروط وثيقة عقد الإيجار والتشغيل المعتمدة</h2>
            <button className="button-primary-pill" style={{ fontSize: '12px', padding: '6px 16px', minHeight: '34px' }}>
              + إضافة بند شرطي جديد
            </button>
          </div>

          <div className="space-y-3">
            {terms.map((term) => (
              <div key={term.id} className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span style={{ width: '24px', height: '24px', borderRadius: '9999px', background: '#000000', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>
                      {term.clause_no}
                    </span>
                    <h3 className="text-sm font-bold text-black">{term.title}</h3>
                  </div>
                  {term.is_mandatory && <Badge text="بند إلزامي نظاماً" type="purple" />}
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed pr-8">{term.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD PACKAGE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in dir-rtl text-right">
          <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-black text-white flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 ml-1" />
                <span>إضافة باقة تأجير جديدة</span>
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePackage} className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 bg-white text-black">
              <div>
                <label className="text-xs text-zinc-700 block mb-1 font-semibold">اسم الباقة</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: باقة نصف سنوية (6 أشهر)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-700 block mb-1 font-semibold">تصنيف الباقة</label>
                  <select
                    value={formData.category}
                    onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  >
                    <option value="أفراد وعائلات">أفراد وعائلات</option>
                    <option value="شركات وقطاع تجاري">شركات وقطاع تجاري</option>
                    <option value="ساعات وضيافة">ساعات وضيافة</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-zinc-700 block mb-1 font-semibold">المدة بالأشهر</label>
                  <input
                    type="number"
                    value={formData.duration_months}
                    onChange={(e) => setFormData({ ...formData, duration_months: Number(e.target.value) })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-700 block mb-1 font-semibold">السعر الشهري (ر.س)</label>
                  <input
                    type="number"
                    value={formData.monthly_rate}
                    onChange={(e) => setFormData({ ...formData, monthly_rate: Number(e.target.value) })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono font-bold focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-700 block mb-1 font-semibold">نسبة الخصم (%)</label>
                  <input
                    type="number"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: Number(e.target.value) })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-700 block mb-1 font-semibold">مزايا الباقة (كل ميزة في سطر منفصل)</label>
                <textarea
                  rows={3}
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                />
              </div>

              <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-3 -mx-6 -mb-6 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="button-outline-on-light"
                  style={{ minHeight: '36px', padding: '6px 16px', fontSize: '13px' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="button-primary-pill"
                  style={{ minHeight: '36px', padding: '6px 20px', fontSize: '13px' }}
                >
                  حفظ واعتماد الباقة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentPackagesPage;
