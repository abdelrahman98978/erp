import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';

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
  const [terms, setTerms] = useState<ContractTermClause[]>(MOCK_TERMS);
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

  const calcTotalMonths = calcDuration;
  const calcSubtotal = calcBaseRate * calcDuration * calcWorkersCount;
  const calcDiscount = calcDuration >= 12 ? calcSubtotal * 0.2 : calcDuration >= 3 ? calcSubtotal * 0.1 : 0;
  const calcTotalAfterDiscount = calcSubtotal - calcDiscount;
  const calcVat = calcTotalAfterDiscount * 0.15;
  const calcGrandTotal = calcTotalAfterDiscount + calcVat;

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #047857 0%, #065F46 100%)',
        color: '#FFF',
        padding: '20px 24px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: '#10B981', color: '#FFF', padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' }}>
              RENTAL PACKAGES & SLAs
            </span>
            <span style={{ color: '#A7F3D0', fontSize: '12px' }}>محرك باقات وبنود عقود التأجير والتشغيل</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '900', margin: '4px 0 0 0' }}>
            باقات وبنود عقود التأجير والتشغيل (Rental Pricing & SLAs)
          </h1>
          <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#D1FAE5' }}>
            تحديد أسعار الباقات المرنة، الخصومات الترويجية، وحساب هوامش الأرباح وبنود العقد الموحد
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-odoo btn-odoo-primary"
            style={{ padding: '8px 18px', fontSize: '13px', background: '#0F172A', borderColor: '#0F172A' }}
          >
            <i className="fa-solid fa-plus ml-1"></i> إضافة باقة تأجير جديدة
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatCard
          title="إجمالي الباقات المعتمدة"
          value={`${packages.length} باقات`}
          icon="fa-solid fa-boxes-packing"
          subtext="أفراد وقطاع تجاري"
          variant="teal"
        />
        <StatCard
          title="عقود التأجير النشطة"
          value="50 عقداً"
          icon="fa-solid fa-handshake"
          subtext="إيرادات شهرية مستقرة"
          variant="purple"
        />
        <StatCard
          title="متوسط الإيجار الشهري"
          value="2,100 ر.س"
          icon="fa-solid fa-receipt"
          subtext="شامل الضمان والرعاية"
          variant="info"
        />
        <StatCard
          title="نسبة التجديد للعقود"
          value="92.4%"
          icon="fa-solid fa-rotate"
          subtext="رضا العملاء واستمرارية الخدمة"
          variant="warning"
        />
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #E2E8F0', paddingBottom: '8px' }}>
        <button
          onClick={() => setActiveTab('packages')}
          className={`btn-odoo ${activeTab === 'packages' ? 'btn-odoo-primary' : 'btn-odoo-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <i className="fa-solid fa-boxes-stacked ml-1"></i> قائمة الباقات والأسعار ({packages.length})
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`btn-odoo ${activeTab === 'calculator' ? 'btn-odoo-primary' : 'btn-odoo-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <i className="fa-solid fa-calculator ml-1"></i> حاسبة التكلفة والربحية
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`btn-odoo ${activeTab === 'terms' ? 'btn-odoo-primary' : 'btn-odoo-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <i className="fa-solid fa-scroll ml-1"></i> بنود وشروط العقد الموحد ({terms.length})
        </button>
      </div>

      {/* TAB 1: PACKAGES CARDS */}
      {activeTab === 'packages' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {(packages.length > 0 ? packages : MOCK_PACKAGES).map((pkg) => (
            <div
              key={pkg.id}
              style={{
                background: '#FFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '24px',
                position: 'relative',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <Badge text={pkg.category} type="info" />
                  {pkg.discount_percentage > 0 && (
                    <span style={{ background: '#EF4444', color: '#FFF', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>
                      خصم {pkg.discount_percentage}%
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>{pkg.name}</h3>
                <div style={{ fontSize: '28px', fontWeight: '900', color: '#047857', marginBottom: '4px' }}>
                  {(pkg.monthly_rate ?? 0).toLocaleString()} <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748B' }}>ر.س / شهرياً</span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '16px' }}>
                  تأمين مسترد: {(pkg.security_deposit ?? 0).toLocaleString()} ر.س | العقود السارية: <strong>{pkg.active_contracts ?? 0}</strong>
                </div>

                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '14px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>المزايا المشمولة في الباقة:</div>
                  <ul className="space-y-1.5" style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12.5px' }}>
                    {(Array.isArray(pkg.features) ? pkg.features : typeof pkg.features === 'string' ? (pkg.features as string).split('\n').filter(Boolean) : []).map((feat, fIdx) => (
                      <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#475569' }}>
                        <i className="fa-solid fa-circle-check text-emerald-600" style={{ fontSize: '14px' }}></i> {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '14px' }}>
                <button
                  className="btn-odoo btn-odoo-secondary"
                  style={{ flex: 1, fontSize: '12px' }}
                >
                  <i className="fa-solid fa-pen-to-square ml-1"></i> تعديل الباقة
                </button>
                <button
                  className="btn-odoo btn-odoo-primary"
                  style={{ flex: 1, fontSize: '12px', background: '#047857', borderColor: '#047857' }}
                >
                  <i className="fa-solid fa-file-signature ml-1"></i> إنشاء عقد بالباقة
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: PRICING CALCULATOR */}
      {activeTab === 'calculator' && (
        <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '16px' }}>
            <i className="fa-solid fa-calculator text-emerald-600 ml-2"></i> حاسبة عروض الأسعار وهوامش الربح لعقود التأجير
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="space-y-4">
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>مدة التعاقد (بالأشهر)</label>
                <select
                  value={calcDuration}
                  onChange={(e) => setCalcDuration(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                >
                  <option value={1}>شهر واحد (باقة مرنة)</option>
                  <option value={3}>3 أشهر (ربع سنوي - خصم 10%)</option>
                  <option value={6}>6 أشهر (نصف سنوي - خصم 15%)</option>
                  <option value={12}>12 شهراً (سنوي كامل - خصم 20%)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>عدد العاملات / الكوادر المطلوبة</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={calcWorkersCount}
                  onChange={(e) => setCalcWorkersCount(Math.max(1, Number(e.target.value)))}
                  style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>سعر الإيجار الشهري للعاملة الواحدة (ر.س)</label>
                <input
                  type="number"
                  step={50}
                  value={calcBaseRate}
                  onChange={(e) => setCalcBaseRate(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                />
              </div>
            </div>

            {/* Calculated Breakdown Card */}
            <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginBottom: '14px' }}>
                  تفاصيل العرض المالي للعقد الموحد
                </h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#64748B' }}>القيمة الأساسية ({calcDuration} شهر × {calcWorkersCount} عاملة):</span>
                  <span style={{ fontWeight: '700' }}>{calcSubtotal.toLocaleString()} ر.س</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#059669' }}>الخصم الترويجي المطبق:</span>
                  <span style={{ fontWeight: '800', color: '#059669' }}>- {calcDiscount.toLocaleString()} ر.س</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#64748B' }}>المبلغ الخاضع للضريبة:</span>
                  <span style={{ fontWeight: '700' }}>{calcTotalAfterDiscount.toLocaleString()} ر.س</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#64748B' }}>ضريبة القيمة المضافة (15% ZATCA):</span>
                  <span style={{ fontWeight: '700' }}>{calcVat.toLocaleString()} ر.س</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', padding: '12px 0', marginTop: '6px' }}>
                  <span style={{ fontWeight: '900', color: '#0F172A' }}>الإجمالي النهائي شامل الضريبة:</span>
                  <span style={{ fontWeight: '900', color: '#047857', fontSize: '20px' }}>{calcGrandTotal.toLocaleString()} ر.س</span>
                </div>
              </div>

              <button
                className="btn-odoo btn-odoo-primary"
                style={{ width: '100%', padding: '10px', fontSize: '13px', background: '#047857', borderColor: '#047857' }}
              >
                <i className="fa-solid fa-file-invoice-dollar ml-1"></i> تصدير عرض سعر رسمي (PDF Quotation)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONTRACT TERMS */}
      {activeTab === 'terms' && (
        <div className="space-y-3">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A' }}>
              بنود وشروط وثيقة عقد الإيجار والتشغيل المعتمدة
            </h2>
            <button className="btn-odoo btn-odoo-primary" style={{ fontSize: '12px', background: '#0F172A', borderColor: '#0F172A' }}>
              + إضافة بند شرطي جديد
            </button>
          </div>

          <div className="space-y-3">
            {terms.map((term) => (
              <div key={term.id} style={{ background: '#FFF', padding: '18px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ background: '#047857', color: '#FFF', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800' }}>
                      {term.clause_no}
                    </span>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>{term.title}</h3>
                  </div>
                  {term.is_mandatory && <Badge text="بند إلزامي نظاماً" type="purple" />}
                </div>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                  {term.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD PACKAGE MODAL */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{ background: '#FFF', borderRadius: '16px', maxWidth: '550px', width: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>
                <i className="fa-solid fa-plus text-emerald-600 ml-2"></i> إضافة باقة تأجير جديدة
              </h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleCreatePackage} className="space-y-4">
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>اسم الباقة</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: باقة نصف سنوية (6 أشهر)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>تصنيف الباقة</label>
                  <select
                    value={formData.category}
                    onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                  >
                    <option value="أفراد وعائلات">أفراد وعائلات</option>
                    <option value="شركات وقطاع تجاري">شركات وقطاع تجاري</option>
                    <option value="ساعات وضيافة">ساعات وضيافة</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>المدة بالأشهر</label>
                  <input
                    type="number"
                    value={formData.duration_months}
                    onChange={(e) => setFormData({ ...formData, duration_months: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>السعر الشهري (ر.س)</label>
                  <input
                    type="number"
                    value={formData.monthly_rate}
                    onChange={(e) => setFormData({ ...formData, monthly_rate: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>نسبة الخصم (%)</label>
                  <input
                    type="number"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>مزايا الباقة (كل ميزة في سطر منفصل)</label>
                <textarea
                  rows={3}
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-odoo btn-odoo-secondary"
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn-odoo btn-odoo-primary"
                  style={{ padding: '8px 20px', fontSize: '13px', background: '#047857', borderColor: '#047857' }}
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
