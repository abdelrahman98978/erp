import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { useLanguage } from '../i18n/LanguageContext';

export interface BranchEntity {
  id: string;
  name: string;
  code: string;
  category: 'فرع منطقي' | 'شركة مجموعة' | 'مكتب خارجي';
  location: string;
  manager: string;
  staff_count: number;
  departments: SubDepartment[];
}

export interface SubDepartment {
  id: string;
  name: string;
  description: string;
  head: string;
  staff_count: number;
  status: 'مفعل' | 'قيد التطوير';
  kpi: string;
  icon: string;
}

const ALL_GROUP_ENTITIES: BranchEntity[] = [
  // 1. Regional Branches & Centers
  {
    id: 'b-1',
    name: 'الفرع الرئيسي (الإدارة العامة - الرياض)',
    code: 'HQ-RUH',
    category: 'فرع منطقي',
    location: 'الرياض - حي اليرموك',
    manager: 'عبد الفتاح السليم (المدير العام)',
    staff_count: 14,
    departments: [
      { id: 'd-101', name: 'إدارة القيادة العليا والتخطيط الإستراتيجي', description: 'لوحة الآدمن الـ 30 ميزة، الحوكمة، وكشوفات الأرباح المجمعة.', head: 'عبد الفتاح السليم', staff_count: 3, status: 'مفعل', kpi: 'نسبة النمو 99.8%', icon: 'fa-solid fa-user-shield' },
      { id: 'd-102', name: 'إدارة الموارد البشرية والرواتب (HR & Payroll)', description: 'سجلات الموظفين، مسير الرواتب الشهرية، الحضور والانصراف.', head: 'سارة خالد', staff_count: 4, status: 'مفعل', kpi: 'مسير الرواتب 100%', icon: 'fa-solid fa-users-viewfinder' },
      { id: 'd-103', name: 'الإدارة المالية والمحاسبة العامة (Central Finance)', description: 'شجرة الحسابات (336)، مراكز التكلفة، والربط الضريبي ZATCA.', head: 'محمد مصطفى', staff_count: 4, status: 'مفعل', kpi: 'مطابقة ضريبية 100%', icon: 'fa-solid fa-vault' },
      { id: 'd-104', name: 'إدارة الأمن وحوكمة المصادقة 2FA', description: 'مصفوفة الصلاحيات RBAC، سياسات 2FA، وجدار الحماية.', head: 'مشرف الأمان', staff_count: 3, status: 'مفعل', kpi: 'تأمين 2FA بنسبة 100%', icon: 'fa-solid fa-lock' }
    ]
  },
  {
    id: 'b-2',
    name: 'فرع جدة والمنطقة الغربية',
    code: 'BR-JED',
    category: 'فرع منطقي',
    location: 'جدة - طريق الملك عبد العزيز',
    manager: 'خالد العتيبي',
    staff_count: 8,
    departments: [
      { id: 'd-201', name: 'إدارة الاستقبال والموانئ والمطارات', description: 'استقبال رحلات الوصول بمطار الملك عبد العزيز وتأكيد الجوازات.', head: 'أحمد الزهراني', staff_count: 2, status: 'مفعل', kpi: 'سرعة الاستلام 45 دقيقة', icon: 'fa-solid fa-plane-arrival' },
      { id: 'd-202', name: 'إدارة عقود الاستقدام وتفاويض الإنجاز', description: 'عقود مساند، توثيق تفاويض الإنجاز الإلكترونية، وتتبع التفييز.', head: 'ماجد الغامدي', staff_count: 3, status: 'مفعل', kpi: '891 تفويض موثق', icon: 'fa-solid fa-passport' },
      { id: 'd-203', name: 'قسم العلاقات مع الوكلاء الخارجيين', description: 'المتابعة مع مكاتب إثيوبيا DAMAS، الفلبين PLATINUM، والهند.', head: 'خالد العتيبي', staff_count: 3, status: 'مفعل', kpi: '18 مكتب خارجي', icon: 'fa-solid fa-globe' }
    ]
  },
  {
    id: 'b-3',
    name: 'فرع الخبر والمنطقة الشرقية',
    code: 'BR-DMM',
    category: 'فرع منطقي',
    location: 'الخبر - شارع الظهران',
    manager: 'عمر الدوسري',
    staff_count: 6,
    departments: [
      { id: 'd-301', name: 'إدارة عقود التشغيل والتأجير للمؤسسات', description: 'إدارة عقود التأجير الشهرية والسنوية وباقات الكوادر.', head: 'عمر الدوسري', staff_count: 2, status: 'مفعل', kpi: '610 عقود تأجير', icon: 'fa-solid fa-handshake' },
      { id: 'd-302', name: 'إدارة التحصيل والطلبات المالية بين الفروع', description: 'سندات القبض والصرف، وطلبات المناقلات المالية السريعة.', head: 'فهد الخالدي', staff_count: 2, status: 'مفعل', kpi: 'تحصيل 98%', icon: 'fa-solid fa-money-bill-wave' },
      { id: 'd-303', name: 'مركز الاتصال والتسويق الرقمي CRM', description: 'متابعة زوار المنصة، محادثات الواتساب، والفرص البيعية.', head: 'نورة الشمري', staff_count: 2, status: 'مفعل', kpi: '241 عميل نشط', icon: 'fa-solid fa-phone-volume' }
    ]
  },
  {
    id: 'b-4',
    name: 'مركز الإيواء والرعاية الرئيسية (الرياض)',
    code: 'SHL-RUH',
    category: 'فرع منطقي',
    location: 'الرياض - مجمع الإيواء الموحد',
    manager: 'سارة خالد',
    staff_count: 12,
    departments: [
      { id: 'd-401', name: 'إدارة السكن والتسكين والغرف', description: 'تسجيل دخول وتسكين 61 عاملة بالنزل وتوزيع الغرف.', head: 'مريم العنزي', staff_count: 3, status: 'مفعل', kpi: 'سعة 120 أسرة', icon: 'fa-solid fa-hotel' },
      { id: 'd-402', name: 'قسم الرعاية الطبية والفحوصات', description: 'الفحص الطبي الشامل، تأمين العيوب الخفية، واللياقة البدنية.', head: 'د. عادل القحطاني', staff_count: 3, status: 'مفعل', kpi: 'فحص 100% لائق', icon: 'fa-solid fa-stethoscope' },
      { id: 'd-403', name: 'قسم التغذية والإعاشة والخدمات اللوجستية', description: 'الإعاشة اليومية وحافلات التوصيل اليومي بين الفروع.', head: 'سليمان الحربي', staff_count: 3, status: 'مفعل', kpi: '3 وجبات صحية/يوم', icon: 'fa-solid fa-utensils' },
      { id: 'd-404', name: 'قسم فترة التجربة والترحيل (90 يوم)', description: 'متابعة فترة التجربة، حالات الباك أوت، وتذاكر المغادرة.', head: 'عبد الله الشهري', staff_count: 3, status: 'مفعل', kpi: 'ضمان 90 يوماً', icon: 'fa-solid fa-[#000] fa-box-archive' }
    ]
  },

  // 2. Landing Page Group Subsidiaries
  {
    id: 'b-topaz',
    name: '💎 شركة توباز (Topaz Group)',
    code: 'TPZ-GRP',
    category: 'شركة مجموعة',
    location: 'الرياض - البرج الرئيسي',
    manager: 'المهندس أحمد السليم',
    staff_count: 18,
    departments: [
      { id: 'd-topaz-1', name: 'إدارة الابتكار والحلول الصناعية المستقبلي', description: 'تطوير الحلول النوعية وتوجيه الاستقدام المتقدم للمؤسسات.', head: 'م. أحمد السليم', staff_count: 8, status: 'مفعل', kpi: 'ابتكار 100%', icon: 'fa-solid fa-gem' },
      { id: 'd-topaz-2', name: 'إدارة المشروعات والتعاقدات الإستراتيجية', description: 'إدارة المشاريع الكبرى للمجموعة وتوفير الكوادر التخصصية.', head: 'فيصل القحطاني', staff_count: 10, status: 'مفعل', kpi: '42 مشروع نشط', icon: 'fa-solid fa-diagram-project' }
    ]
  },
  {
    id: 'b-ruwad',
    name: '🏗️ دار الرواد (Dar Al-Ruwad)',
    code: 'RWD-EST',
    category: 'شركة مجموعة',
    location: 'الرياض - حي طريق الملك فهد',
    manager: 'سليمان العتيبي',
    staff_count: 15,
    departments: [
      { id: 'd-ruwad-1', name: 'إدارة التطوير العقاري والاستثمار النوعي', description: 'تطوير المقرات والمباني الإدارية ومجمعات الإيواء التابعة.', head: 'سليمان العتيبي', staff_count: 7, status: 'مفعل', kpi: 'استثمار عقاري 98%', icon: 'fa-solid fa-building' },
      { id: 'd-ruwad-2', name: 'إدارة إدارة الأصول والأملاك التجارية', description: 'إدارة الأصول التأجيرية والمباني الاستثمارية لمجموعة السليم.', head: 'خالد المطيري', staff_count: 8, status: 'مفعل', kpi: 'عائد استثماري +14%', icon: 'fa-solid fa-landmark' }
    ]
  },
  {
    id: 'b-saffir',
    name: '🤝 شركة السفير (Al-Saffir Group)',
    code: 'SFR-AGY',
    category: 'شركة مجموعة',
    location: 'الرياض - طريق العليا العام',
    manager: 'عبد العزيز السليم',
    staff_count: 12,
    departments: [
      { id: 'd-saffir-1', name: 'إدارة خدمات نقل الكفالة والتنازل', description: 'إدارة طلبات نقل الخدمة والتنازل وفترة التجربة (10 أيام).', head: 'عبد العزيز السليم', staff_count: 6, status: 'مفعل', kpi: '42 نقل نهائي', icon: 'fa-solid fa-repeat' },
      { id: 'd-saffir-2', name: 'قسم الدبلوماسية والتواصل الخارجي', description: 'التنسيق مع السفارات ومراكز التوثيق والقنصليات.', head: 'ناصر السبيعي', staff_count: 6, status: 'مفعل', kpi: 'اعتماد 100%', icon: 'fa-solid fa-handshake-angle' }
    ]
  },
  {
    id: 'b-masi',
    name: '💠 شركة الماسي (Al-Masi Luxury)',
    code: 'MASI-LUX',
    category: 'شركة مجموعة',
    location: 'الرياض - حي العليا والخدمات الفاخرة',
    manager: 'بندر الهويريني',
    staff_count: 10,
    departments: [
      { id: 'd-masi-1', name: 'إدارة باقات التأجير والخدمات المنزلية VIP', description: 'تصميم باقات التأجير الفاخرة للكوادر المدربة وتأمين العيوب.', head: 'بندر الهويريني', staff_count: 5, status: 'مفعل', kpi: 'رضا العملاء 99%', icon: 'fa-solid fa-crown' },
      { id: 'd-masi-2', name: 'قسم الضمان والبديل الفوري خلال 24 ساعة', description: 'توفير البديل الفوري وتغطية التأمين الشامل للنزل والعملاء.', head: 'هند العلي', staff_count: 5, status: 'مفعل', kpi: 'استبدال 24h', icon: 'fa-solid fa-shield-cat' }
    ]
  },
  {
    id: 'b-ayal',
    name: '✈️ شركة الأيال للسفر والسياحة',
    code: 'AYAL-TRV',
    category: 'شركة مجموعة',
    location: 'الرياض - طريق الملك فهد',
    manager: 'خالد السليم (الأيال)',
    staff_count: 9,
    departments: [
      { id: 'd-ayal-1', name: 'إدارة حجز وتأكيد تذاكر الطيران (Ticketing)', description: 'إصدار حجوزات طيران الوصول والمغادرة للعمالة والعملاء.', head: 'خالد السليم', staff_count: 4, status: 'مفعل', kpi: '77 رحلة وصول', icon: 'fa-solid fa-plane-departure' },
      { id: 'd-ayal-2', name: 'إدارة أسطول النقل البري والحافلات', description: 'إدارة الحافلات والسيارات الخاصة بنقل الكوادر من وإلى المطارات.', head: 'إبراهيم الفايز', staff_count: 5, status: 'مفعل', kpi: 'أسطول 12 حافلة', icon: 'fa-solid fa-bus' }
    ]
  },

  // 3. International Foreign Agencies
  {
    id: 'b-damas',
    name: '🌍 مكتب داماس الإثيوبي (DAMAS Agency - Addis Ababa)',
    code: 'DAMAS-ETH',
    category: 'مكتب خارجي',
    location: 'أديس أبابا - إثيوبيا',
    manager: 'Mr. Solomon Bekele',
    staff_count: 24,
    departments: [
      { id: 'd-damas-1', name: 'قسم الفحص الطبي المقارن وتوثيق السفارة', description: 'إجراء الفحوصات الطبية واعتماد لياءة الكوادر بالسفارة السعودية.', head: 'Dr. Tadesse', staff_count: 12, status: 'مفعل', kpi: 'فحص لائق 100%', icon: 'fa-solid fa-hospital-user' },
      { id: 'd-damas-2', name: 'قسم التدريب المنزلي واللغة العربية', description: 'تدريب العاملات على الطبخ والطهي الخليجي واللغة والأعراف.', head: 'Mrs. Aster', staff_count: 12, status: 'مفعل', kpi: 'تدريب 14 يوم', icon: 'fa-solid fa-graduation-cap' }
    ]
  },
  {
    id: 'b-platinum',
    name: '🌍 مكتب بلاتينيوم الفلبيني (PLATINUM Brothers - Manila)',
    code: 'PLT-PHL',
    category: 'مكتب خارجي',
    location: 'مانيلا - الفلبين',
    manager: 'Mr. Ricardo Santos',
    staff_count: 30,
    departments: [
      { id: 'd-plt-1', name: 'قسم التدريب المهني والمهارات الفلبينية', description: 'اختبار مهارات التمريض والعناية بكبار السن والأطفال.', head: 'Maria Santos', staff_count: 15, status: 'مفعل', kpi: 'اعتماد POEA 100%', icon: 'fa-solid fa-user-nurse' },
      { id: 'd-plt-2', name: 'قسم إنهاء إجراءات السفارة وتوثيق التأشيرات', description: 'تثبيت الفيزا والجوازات وإصدار تصاريح السفر الرسمية.', head: 'Juan Dela Cruz', staff_count: 15, status: 'مفعل', kpi: 'إنهاء خلال 7 أيام', icon: 'fa-solid fa-file-shield' }
    ]
  },
  {
    id: 'b-versatile',
    name: '🌍 مكتب فيرساتيل الهندي (VERSATILE Overseas - New Delhi)',
    code: 'VRST-IND',
    category: 'مكتب خارجي',
    location: 'نيودلهي - الهند',
    manager: 'Mr. Rajesh Kumar',
    staff_count: 22,
    departments: [
      { id: 'd-vrst-1', name: 'قسم اختيار واختبار العمالة المهنية والسائقين', description: 'اختبار رخص القيادة المهنية والمهن الحرفية للمؤسسات.', head: 'Rajesh Kumar', staff_count: 11, status: 'مفعل', kpi: 'اختبار ميداني 100%', icon: 'fa-solid fa-id-card' },
      { id: 'd-vrst-2', name: 'قسم الفحوصات الطبية والجوازات بالهند', description: 'المتابعة مع المراكز الطبية المعتمدة بـ WAMY والسفارة.', head: 'Amitabh Sharma', staff_count: 11, status: 'مفعل', kpi: 'اعتماد سفارة 100%', icon: 'fa-solid fa-stamp' }
    ]
  }
];

export const BranchDepartmentsPage: React.FC = () => {
  const { t } = useLanguage();
  const [entities, setEntities] = useState<BranchEntity[]>(ALL_GROUP_ENTITIES);
  const [selectedEntityId, setSelectedEntityId] = useState<string>('b-1');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'فرع منطقي' | 'شركة مجموعة' | 'مكتب خارجي'>('all');
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);

  // Form State
  const [deptForm, setDeptForm] = useState({
    name: '',
    description: '',
    head: '',
    kpi: 'أداء 100%'
  });

  const filteredEntities = entities.filter(e => {
    if (activeCategoryFilter === 'all') return true;
    return e.category === activeCategoryFilter;
  });

  const selectedEntity = entities.find(e => e.id === selectedEntityId) || entities[0];

  const handleAddSubDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptForm.name || !deptForm.description) {
      alert('يرجى ملء كافة حقول القسم التخصصي الجديد');
      return;
    }

    const newDept: SubDepartment = {
      id: `d-${Date.now()}`,
      name: deptForm.name,
      description: deptForm.description,
      head: deptForm.head || 'غير محدد',
      staff_count: 2,
      status: 'مفعل',
      kpi: deptForm.kpi,
      icon: 'fa-solid fa-folder-plus'
    };

    setEntities(prev => prev.map(eItem => {
      if (eItem.id === selectedEntityId) {
        return {
          ...eItem,
          departments: [...eItem.departments, newDept],
          staff_count: eItem.staff_count + 2
        };
      }
      return eItem;
    }));

    setShowAddDeptModal(false);
    setDeptForm({ name: '', description: '', head: '', kpi: 'أداء 100%' });
    alert(`تمت إضافة وتفعيل قسم (${newDept.name}) بنجاح داخل ${selectedEntity.name}!`);
  };

  return (
    <div>
      {/* Page Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Cairo, sans-serif' }}>
            <i className="fa-solid fa-sitemap text-purple ml-2"></i> دليل الهيكلية والأقسام التخصصية الشاملة لجميع شركات المجموعة والمكاتب الخارجية
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            مجموعة خالد السليم • توباز، دار الرواد، السفير، الماسي، الأيال للسفر، الفروع الإقليمية، والمكاتب الخارجية (DAMAS, PLATINUM, VERSATILE)
          </p>
        </div>

        <button className="btn-odoo btn-odoo-purple" onClick={() => setShowAddDeptModal(true)}>
          <i className="fa-solid fa-plus ml-1"></i> إضافة قسم تخصصي لـ ({selectedEntity.code})
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button
          className={`btn-odoo ${activeCategoryFilter === 'all' ? 'btn-odoo-purple' : 'btn-odoo-secondary'}`}
          onClick={() => setActiveCategoryFilter('all')}
        >
          جميع الكيانات والشركات والمكاتب ({entities.length})
        </button>
        <button
          className={`btn-odoo ${activeCategoryFilter === 'فرع منطقي' ? 'btn-odoo-primary' : 'btn-odoo-secondary'}`}
          onClick={() => setActiveCategoryFilter('فرع منطقي')}
        >
          🏛️ الفروع الإقليمية والإيواء (4)
        </button>
        <button
          className={`btn-odoo ${activeCategoryFilter === 'شركة مجموعة' ? 'btn-odoo-primary' : 'btn-odoo-secondary'}`}
          onClick={() => setActiveCategoryFilter('شركة مجموعة')}
        >
          💎 شركات المجموعة الرئيسية (5)
        </button>
        <button
          className={`btn-odoo ${activeCategoryFilter === 'مكتب خارجي' ? 'btn-odoo-primary' : 'btn-odoo-secondary'}`}
          onClick={() => setActiveCategoryFilter('مكتب خارجي')}
        >
          🌍 المكاتب الخارجية والوكالات (3)
        </button>
      </div>

      {/* Group Entities Selector Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        {filteredEntities.map(e => (
          <div
            key={e.id}
            onClick={() => setSelectedEntityId(e.id)}
            style={{
              background: selectedEntityId === e.id ? '#005154' : '#FFFFFF',
              color: selectedEntityId === e.id ? '#FFFFFF' : '#181C1C',
              padding: '16px',
              borderRadius: '12px',
              cursor: 'pointer',
              border: '1px solid #E2E8F0',
              boxShadow: selectedEntityId === e.id ? '0 6px 16px rgba(0,81,84,0.25)' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: '900', background: selectedEntityId === e.id ? 'rgba(255,255,255,0.2)' : '#E2E8F0', padding: '2px 8px', borderRadius: '4px' }}>
                {e.code}
              </span>
              <Badge text={e.category} type={e.category === 'شركة مجموعة' ? 'purple' : e.category === 'مكتب خارجي' ? 'success' : 'info'} />
            </div>

            <h4 style={{ fontSize: '14px', fontWeight: '800', margin: '0 0 4px 0', fontFamily: 'Cairo, sans-serif' }}>
              {e.name}
            </h4>
            <span style={{ fontSize: '11.5px', opacity: 0.8, display: 'block' }}>المسؤول: {e.manager} • {e.departments.length} أقسام</span>
          </div>
        ))}
      </div>

      {/* Selected Entity Overview Banner */}
      <div className="table-card" style={{ padding: '20px', marginBottom: '24px', background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Badge text={selectedEntity.code} type="purple" />
              <Badge text={selectedEntity.category} type="info" />
              <Badge text={`إجمالي الكادر: ${selectedEntity.staff_count} موظفين`} type="success" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#005154', margin: 0 }}>
              {selectedEntity.name} - الموقع والفرع: {selectedEntity.location}
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              المشرف / المدير المسؤول: <strong>{selectedEntity.manager}</strong>
            </p>
          </div>

          <button className="btn-odoo btn-odoo-primary" onClick={() => setShowAddDeptModal(true)}>
            <i className="fa-solid fa-folder-plus ml-1"></i> تطوير وإضافة قسم تخصصي
          </button>
        </div>
      </div>

      {/* Sub-Departments Cards Grid */}
      <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#005154', marginBottom: '16px' }}>
        <i className="fa-solid fa-diagram-project ml-2"></i> الأقسام التخصصية والوحدات المفعلة داخل ({selectedEntity.name})
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {selectedEntity.departments.map(dept => (
          <div key={dept.id} className="table-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(0, 81, 84, 0.1)',
                  color: '#005154',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  <i className={dept.icon}></i>
                </div>
                <Badge text={dept.kpi} type="purple" />
              </div>

              <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#181C1C', marginBottom: '6px', fontFamily: 'Cairo, sans-serif' }}>
                {dept.name}
              </h4>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.6', margin: '0 0 12px 0' }}>
                {dept.description}
              </p>
            </div>

            <div style={{ paddingTop: '12px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
              <span>رئيس القسم: <strong>{dept.head}</strong></span>
              <span style={{ color: '#10B981', fontWeight: '700' }}>{dept.staff_count} موظفين مفعلين</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Sub-Department Modal */}
      {showAddDeptModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="table-card" style={{ width: '520px', padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154' }}>
                إضافة قسم تخصصي جديد لـ ({selectedEntity.name})
              </h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setShowAddDeptModal(false)}></i>
            </div>

            <form onSubmit={handleAddSubDepartment}>
              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">اسم القسم التخصصي *</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="مثال: إدارة الرعاية الطبية والفحوصات..."
                  value={deptForm.name}
                  onChange={e => setDeptForm({ ...deptForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">رئيس / مشرف القسم *</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="اسم مسؤول القسم..."
                  value={deptForm.head}
                  onChange={e => setDeptForm({ ...deptForm, head: e.target.value })}
                  required
                />
              </div>

              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">الوصف المهني ومسؤوليات القسم *</label>
                <textarea
                  className="filter-input"
                  rows={3}
                  placeholder="اكتب مهام وأهداف هذا القسم التخصصي..."
                  value={deptForm.description}
                  onChange={e => setDeptForm({ ...deptForm, description: e.target.value })}
                  required
                />
              </div>

              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label className="filter-label">مؤشر الأداء المستهدف KPI</label>
                <input
                  type="text"
                  className="filter-input"
                  value={deptForm.kpi}
                  onChange={e => setDeptForm({ ...deptForm, kpi: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-odoo btn-odoo-secondary" onClick={() => setShowAddDeptModal(false)}>إلغاء</button>
                <button type="submit" className="btn-odoo btn-odoo-purple">اعتماد القسم التخصصي</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchDepartmentsPage;
