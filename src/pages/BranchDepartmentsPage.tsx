import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { Network, Plus, FileSpreadsheet, FileText, Building2, Users, Check, X, Shield, Plane, Globe, Handshake, DollarSign, PhoneCall, Hotel, Stethoscope, Utensils, Archive, Gem, Landmark, Repeat, Crown, ShieldAlert } from 'lucide-react';

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
  icon?: string;
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
      { id: 'd-101', name: 'إدارة القيادة العليا والتخطيط الإستراتيجي', description: 'لوحة الآدمن الـ 30 ميزة، الحوكمة، وكشوفات الأرباح المجمعة.', head: 'عبد الفتاح السليم', staff_count: 3, status: 'مفعل', kpi: 'نسبة النمو 99.8%' },
      { id: 'd-102', name: 'إدارة الموارد البشرية والرواتب (HR & Payroll)', description: 'سجلات الموظفين، مسير الرواتب الشهرية، الحضور والانصراف.', head: 'سارة خالد', staff_count: 4, status: 'مفعل', kpi: 'مسير الرواتب 100%' },
      { id: 'd-103', name: 'الإدارة المالية والمحاسبة العامة (Central Finance)', description: 'شجرة الحسابات (336)، مراكز التكلفة، والربط الضريبي ZATCA.', head: 'محمد مصطفى', staff_count: 4, status: 'مفعل', kpi: 'مطابقة ضريبية 100%' },
      { id: 'd-104', name: 'إدارة الأمن وحوكمة المصادقة 2FA', description: 'مصفوفة الصلاحيات RBAC، سياسات 2FA، وجدار الحماية.', head: 'مشرف الأمان', staff_count: 3, status: 'مفعل', kpi: 'تأمين 2FA بنسبة 100%' }
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
      { id: 'd-201', name: 'إدارة الاستقبال والموانئ والمطارات', description: 'استقبال رحلات الوصول بمطار الملك عبد العزيز وتأكيد الجوازات.', head: 'أحمد الزهراني', staff_count: 2, status: 'مفعل', kpi: 'سرعة الاستلام 45 دقيقة' },
      { id: 'd-202', name: 'إدارة عقود الاستقدام وتفاويض الإنجاز', description: 'عقود مساند، توثيق تفاويض الإنجاز الإلكترونية، وتتبع التفييز.', head: 'ماجد الغامدي', staff_count: 3, status: 'مفعل', kpi: '891 تفويض موثق' },
      { id: 'd-203', name: 'قسم العلاقات مع الوكلاء الخارجيين', description: 'المتابعة مع مكاتب إثيوبيا DAMAS، الفلبين PLATINUM، والهند.', head: 'خالد العتيبي', staff_count: 3, status: 'مفعل', kpi: '18 مكتب خارجي' }
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
      { id: 'd-301', name: 'إدارة عقود التشغيل والتأجير للمؤسسات', description: 'إدارة عقود التأجير الشهرية والسنوية وباقات الكوادر.', head: 'عمر الدوسري', staff_count: 2, status: 'مفعل', kpi: '610 عقود تأجير' },
      { id: 'd-302', name: 'إدارة التحصيل والطلبات المالية بين الفروع', description: 'سندات القبض والصرف، وطلبات المناقلات المالية السريعة.', head: 'فهد الخالدي', staff_count: 2, status: 'مفعل', kpi: 'تحصيل 98%' },
      { id: 'd-303', name: 'مركز الاتصال والتسويق الرقمي CRM', description: 'متابعة زوار المنصة، محادثات الواتساب، والفرص البيعية.', head: 'نورة الشمري', staff_count: 2, status: 'مفعل', kpi: '241 عميل نشط' }
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
      { id: 'd-401', name: 'إدارة السكن والتسكين والغرف', description: 'تسجيل دخول وتسكين 61 عاملة بالنزل وتوزيع الغرف.', head: 'مريم العنزي', staff_count: 3, status: 'مفعل', kpi: 'سعة 120 أسرة' },
      { id: 'd-402', name: 'قسم الرعاية الطبية والفحوصات', description: 'الفحص الطبي الشامل، تأمين العيوب الخفية، واللياقة البدنية.', head: 'د. عادل القحطاني', staff_count: 3, status: 'مفعل', kpi: 'فحص 100% لائق' },
      { id: 'd-403', name: 'قسم التغذية والإعاشة والخدمات اللوجستية', description: 'الإعاشة اليومية وحافلات التوصيل اليومي بين الفروع.', head: 'سليمان الحربي', staff_count: 3, status: 'مفعل', kpi: '3 وجبات صحية/يوم' },
      { id: 'd-404', name: 'قسم فترة التجربة والترحيل (90 يوم)', description: 'متابعة فترة التجربة، حالات الباك أوت، وتذاكر المغادرة.', head: 'عبد الله الشهري', staff_count: 3, status: 'مفعل', kpi: 'ضمان 90 يوماً' }
    ]
  },

  // 2. Landing Page Group Subsidiaries & KAS Trading Network
  {
    id: 'b-kas',
    name: '🏛️ شركة كاس للتجارة (مؤسسة خالد عبدالعزيز السليم للتجارة)',
    code: 'HQ-KAS-RUH',
    category: 'شركة مجموعة',
    location: 'الرياض - طريق الملك فهد - برج كاس التجاري',
    manager: 'خالد عبدالعزيز السليم (المدير العام)',
    staff_count: 28,
    departments: [
      { id: 'd-kas-1', name: 'إدارة المناقصات وجداول الكميات والأسعار (BOQ)', description: 'دراسة وتحليل كراسات الشروط، تسعير جداول الكميات، والتفقيط المعتمد للمنافسات الحكومية.', head: 'م. أحمد حلمي', staff_count: 8, status: 'مفعل', kpi: 'ترسية منافسات 96.4%' },
      { id: 'd-kas-2', name: 'إدارة التوريدات الحكومية والتجارة العامة', description: 'تأمين مستلزمات اليوم الوطني، التمور الفاخرة، والضيافة المتكاملة للقطاعات الحكومية.', head: 'فيصل السليم', staff_count: 7, status: 'مفعل', kpi: 'توريد معتمد 100%' },
      { id: 'd-kas-3', name: 'إدارة المستودعات وسلاسل الإمداد اللوجستية', description: 'التخزين المركزي، إدارة المخزون، وسرعة تجهيز الشحنات والتوصيل خلال المواعيد المحددة.', head: 'سلطان الحربي', staff_count: 7, status: 'مفعل', kpi: 'تسليم قبل الموعد' },
      { id: 'd-kas-4', name: 'الإدارة المالية والمحاسبة التجارية والفوترة', description: 'الفوترة الإلكترونية ZATCA، سندات الصرف والقبض، ومتابعة التحصيل والدفعات التعاقدية.', head: 'عبدالله القحطاني', staff_count: 6, status: 'مفعل', kpi: 'تحصيل 99.1%' }
    ]
  },
  {
    id: 'b-kas-jed',
    name: '⚓ فرع شركة كاس للتجارة والخدمات اللوجستية - جدة',
    code: 'BR-KAS-JED',
    category: 'فرع منطقي',
    location: 'جدة - ميناء جدة الإسلامي وطريق المدينة',
    manager: 'عبدالرحمن الشهري',
    staff_count: 14,
    departments: [
      { id: 'd-kas-jed-1', name: 'قسم توريدات ميناء جدة الإسلامي والفعاليات', description: 'تنفيذ احتفالات اليوم الوطني 96 وتوريد بوكسات التوزيعات والضيافة لميناء جدة.', head: 'عبدالرحمن الشهري', staff_count: 7, status: 'مفعل', kpi: 'تنفيذ 100%' },
      { id: 'd-kas-jed-2', name: 'قسم التوزيع اللوجستي للمنطقة الغربية', description: 'التنسيق مع الموانئ والجمارك وتوصيل طلبيات القطاع الحكومي والخاص.', head: 'مازن الغامدي', staff_count: 7, status: 'مفعل', kpi: 'سرعة توصيل 24h' }
    ]
  },
  {
    id: 'b-kas-expo',
    name: '🎪 مؤسسة كاس لتنظيم المعارض والمؤتمرات',
    code: 'KAS-EXPO',
    category: 'شركة مجموعة',
    location: 'الرياض - مركز المؤتمرات والمعارض',
    manager: 'نايف السليم',
    staff_count: 16,
    departments: [
      { id: 'd-expo-1', name: 'إدارة تنظيم وتجهيز الفعاليات والمؤتمرات', description: 'إدارة وتخطيط المعارض، المسارح، منصات العرض، وتجهيز المواقع الاحتفالية.', head: 'نايف السليم', staff_count: 8, status: 'مفعل', kpi: 'تنظيم 34 فعالية' },
      { id: 'd-expo-2', name: 'قسم الضيافة والفرق الشعبية والعرضة النجدية', description: 'توفير فرق العرضة النجدية الرسمية، القهوة العربية، والمباشرين المحترفين.', head: 'سعد الدوسري', staff_count: 8, status: 'مفعل', kpi: 'أداء تراثي 100%' }
    ]
  },
  {
    id: 'b-sulaim-adv',
    name: '📢 وكالة خالد عبدالعزيز السليم للدعاية والإعلان',
    code: 'SULAIM-ADV',
    category: 'شركة مجموعة',
    location: 'الرياض - حي الملز - شارع الستين',
    manager: 'بدر التميمي',
    staff_count: 15,
    departments: [
      { id: 'd-adv-1', name: 'إدارة التصميم والإنتاج الإعلاني والطباعة', description: 'تصميم الهويات الوطنية، طباعة استيكرات الباك دروب، المصاعد، واللوحات الإرشادية.', head: 'بدر التميمي', staff_count: 8, status: 'مفعل', kpi: 'دقة طباعة 100%' },
      { id: 'd-adv-2', name: 'قسم التركيبات الميدانية والتجهيز الخارجي', description: 'فرق التركيب الميداني لاستيكرات الواجهات والمصاعد وأطقم الباك دروب 6*6.', head: 'طارق العلي', staff_count: 7, status: 'مفعل', kpi: 'تركيب فوري' }
    ]
  },
  {
    id: 'b-smart-bld',
    name: '🏗️ مؤسسة بنايات ذكية للمقاولات',
    code: 'SMART-BLD',
    category: 'شركة مجموعة',
    location: 'الرياض - حي العليا',
    manager: 'م. فهد السليم',
    staff_count: 22,
    departments: [
      { id: 'd-bld-1', name: 'إدارة المقاولات والتجهيزات الإنشائية الذكية', description: 'تنفيذ أعمال الديكورات، التجهيزات المعمارية، وتشييد منصات الفعاليات الكبرى.', head: 'م. فهد السليم', staff_count: 12, status: 'مفعل', kpi: 'جودة تنفيذ 100%' },
      { id: 'd-bld-2', name: 'قسم الصيانة والتشغيل والدعم الفني', description: 'أعمال الكهرباء، الإضاءات التفاعلية للمباني الخارجية، والإشراف الهندسي.', head: 'م. كمال الدين', staff_count: 10, status: 'مفعل', kpi: 'استجابة سريعة' }
    ]
  },
  {
    id: 'b-super-touch',
    name: '⚡ مؤسسة اللمسة الخارقة للاتصالات وتقنية المعلومات',
    code: 'SUPER-TOUCH',
    category: 'شركة مجموعة',
    location: 'الرياض - واحة التقنية الرقمية',
    manager: 'م. عاصم السليم',
    staff_count: 18,
    departments: [
      { id: 'd-touch-1', name: 'إدارة الحلول الرقمية وتطوير الأنظمة الذكية', description: 'تطوير وتشغيل منظومة الـ ERP، الربط السحابي، والذكاء الاصطناعي المؤسسي.', head: 'م. عاصم السليم', staff_count: 10, status: 'مفعل', kpi: 'تواجدية 99.9%' },
      { id: 'd-touch-2', name: 'قسم أمن المعلومات والشبكات والبنية التحتية', description: 'حماية الخوادم، تأمين البيانات السحابية، وضوابط الأمن السيبراني NCA.', head: 'م. رامي حسن', staff_count: 8, status: 'مفعل', kpi: 'حماية 100%' }
    ]
  },
  {
    id: 'b-topaz',
    name: '💎 شركة توباز (Topaz Group)',
    code: 'TPZ-GRP',
    category: 'شركة مجموعة',
    location: 'الرياض - البرج الرئيسي',
    manager: 'المهندس أحمد السليم',
    staff_count: 18,
    departments: [
      { id: 'd-topaz-1', name: 'إدارة الابتكار والحلول الصناعية المستقبلي', description: 'تطوير الحلول النوعية وتوجيه الاستقدام المتقدم للمؤسسات.', head: 'م. أحمد السليم', staff_count: 8, status: 'مفعل', kpi: 'ابتكار 100%' },
      { id: 'd-topaz-2', name: 'إدارة المشروعات والتعاقدات الإستراتيجية', description: 'إدارة المشاريع الكبرى للمجموعة وتوفير الكوادر التخصصية.', head: 'فيصل القحطاني', staff_count: 10, status: 'مفعل', kpi: '42 مشروع نشط' }
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
      { id: 'd-ruwad-1', name: 'إدارة التطوير العقاري والاستثمار النوعي', description: 'تطوير المقرات والمباني الإدارية ومجمعات الإيواء التابعة.', head: 'سليمان العتيبي', staff_count: 7, status: 'مفعل', kpi: 'استثمار عقاري 98%' },
      { id: 'd-ruwad-2', name: 'إدارة إدارة الأصول والأملاك التجارية', description: 'إدارة الأصول التأجيرية والمباني الاستثمارية لمجموعة السليم.', head: 'خالد المطيري', staff_count: 8, status: 'مفعل', kpi: 'عائد استثماري +14%' }
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
      { id: 'd-saffir-1', name: 'إدارة خدمات نقل الكفالة والتنازل', description: 'إدارة طلبات نقل الخدمة والتنازل وفترة التجربة (10 أيام).', head: 'عبد العزيز السليم', staff_count: 6, status: 'مفعل', kpi: '42 نقل نهائي' },
      { id: 'd-saffir-2', name: 'قسم الدبلوماسية والتواصل الخارجي', description: 'التنسيق مع السفارات ومراكز التوثيق والقنصليات.', head: 'ناصر السبيعي', staff_count: 6, status: 'مفعل', kpi: 'اعتماد 100%' }
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
      { id: 'd-masi-1', name: 'إدارة باقات التأجير والخدمات المنزلية VIP', description: 'تصميم باقات التأجير الفاخرة للكوادر المدربة وتأمين العيوب.', head: 'بندر الهويريني', staff_count: 5, status: 'مفعل', kpi: 'رضا العملاء 99%' },
      { id: 'd-masi-2', name: 'قسم الضمان والبديل الفوري خلال 24 ساعة', description: 'توفير البديل الفوري وتغطية التأمين الشامل للنزل والعملاء.', head: 'هند العلي', staff_count: 5, status: 'مفعل', kpi: 'استبدال 24h' }
    ]
  },
  {
    id: 'b-ayal',
    name: '✈️ وكالة الأَمْيال للسفر والسياحة',
    code: 'AYAL-TRV',
    category: 'شركة مجموعة',
    location: 'الرياض - طريق الملك فهد',
    manager: 'خالد السليم (الأَمْيال)',
    staff_count: 9,
    departments: [
      { id: 'd-ayal-1', name: 'إدارة حجز وتأكيد تذاكر الطيران (Ticketing)', description: 'إصدار حجوزات طيران الوصول والمغادرة للعمالة والعملاء.', head: 'خالد السليم', staff_count: 4, status: 'مفعل', kpi: '77 رحلة وصول' },
      { id: 'd-ayal-2', name: 'إدارة أسطول النقل البري والحافلات', description: 'إدارة الحافلات والسيارات الخاصة بنقل الكوادر من وإلى المطارات.', head: 'إبراهيم الفايز', staff_count: 5, status: 'مفعل', kpi: 'أسطول 12 حافلة' }
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
      { id: 'd-damas-1', name: 'قسم الفحص الطبي المقارن وتوثيق السفارة', description: 'إجراء الفحوصات الطبية واعتماد لياءة الكوادر بالسفارة السعودية.', head: 'Dr. Tadesse', staff_count: 12, status: 'مفعل', kpi: 'فحص لائق 100%' },
      { id: 'd-damas-2', name: 'قسم التدريب المنزلي واللغة العربية', description: 'تدريب العاملات على الطبخ والطهي الخليجي واللغة والأعراف.', head: 'Mrs. Aster', staff_count: 12, status: 'مفعل', kpi: 'تدريب 14 يوم' }
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
      { id: 'd-plt-1', name: 'قسم التدريب المهني والمهارات الفلبينية', description: 'اختبار مهارات التمريض والعناية بكبار السن والأطفال.', head: 'Maria Santos', staff_count: 15, status: 'مفعل', kpi: 'اعتماد POEA 100%' },
      { id: 'd-plt-2', name: 'قسم إنهاء إجراءات السفارة وتوثيق التأشيرات', description: 'تثبيت الفيزا والجوازات وإصدار تصاريح السفر الرسمية.', head: 'Juan Dela Cruz', staff_count: 15, status: 'مفعل', kpi: 'إنهاء خلال 7 أيام' }
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
      { id: 'd-vrst-1', name: 'قسم اختيار واختبار العمالة المهنية والسائقين', description: 'اختبار رخص القيادة المهنية والمهن الحرفية للمؤسسات.', head: 'Rajesh Kumar', staff_count: 11, status: 'مفعل', kpi: 'اختبار ميداني 100%' },
      { id: 'd-vrst-2', name: 'قسم الفحوصات الطبية والجوازات بالهند', description: 'المتابعة مع المراكز الطبية المعتمدة بـ WAMY والسفارة.', head: 'Amitabh Sharma', staff_count: 11, status: 'مفعل', kpi: 'اعتماد سفارة 100%' }
    ]
  }
];

export const BranchDepartmentsPage: React.FC = () => {
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
    if (!deptForm.name || !deptForm.description) return;

    const newDept: SubDepartment = {
      id: `d-${Date.now()}`,
      name: deptForm.name,
      description: deptForm.description,
      head: deptForm.head || 'غير محدد',
      staff_count: 2,
      status: 'مفعل',
      kpi: deptForm.kpi,
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
  };

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div
        className="card-feature-cinematic"
        style={{
          background: '#000000',
          borderRadius: '16px',
          padding: '28px',
          color: '#FFFFFF',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div className="flex items-center gap-3">
          <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>ORGANIZATIONAL MATRIX</span>
            </div>
            <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
              دليل الهيكلية والأقسام التخصصية للشركات والفروع
            </h1>
            <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '4px 0 0 0', fontWeight: 420 }}>
              مجموعة خالد السليم • توباز، دار الرواد، السفير، الماسي، الأيال للسفر، الفروع الإقليمية، والمكاتب الخارجية
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            className="button-white-pill"
            onClick={() => setShowAddDeptModal(true)}
            style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
          >
            <Plus className="w-4 h-4 ml-1" />
            <span>+ إضافة قسم تخصصي لـ ({selectedEntity.code})</span>
          </button>
          <button
            className="button-outline-on-dark"
            onClick={() => {
              const exportRows = entities.flatMap(ent =>
                ent.departments.map(d => ({
                  entity_code: ent.code,
                  entity_name: ent.name,
                  category: ent.category,
                  location: ent.location,
                  manager: ent.manager,
                  dept_name: d.name,
                  head: d.head,
                  staff_count: d.staff_count,
                  kpi: d.kpi,
                  status: d.status,
                }))
              );
              exportData('branches', exportRows, 'excel', 'الهيكل التنظيمي وأقسام المجموعة');
            }}
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
          >
            <FileSpreadsheet className="w-4 h-4 ml-1 text-emerald-400" />
            <span>Excel</span>
          </button>
          <button
            className="button-outline-on-dark"
            onClick={() => {
              const exportRows = entities.flatMap(ent =>
                ent.departments.map(d => ({
                  entity_code: ent.code,
                  entity_name: ent.name,
                  category: ent.category,
                  location: ent.location,
                  manager: ent.manager,
                  dept_name: d.name,
                  head: d.head,
                  staff_count: d.staff_count,
                  kpi: d.kpi,
                  status: d.status,
                }))
              );
              exportData('branches', exportRows, 'pdf', 'الهيكل التنظيمي وأقسام المجموعة');
            }}
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
          >
            <FileText className="w-4 h-4 ml-1 text-rose-400" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-3">
        {[
          { id: 'all', label: `جميع الكيانات والشركات والمكاتب (${entities.length})` },
          { id: 'فرع منطقي', label: '🏛️ الفروع الإقليمية والإيواء (4)' },
          { id: 'شركة مجموعة', label: '💎 شركات المجموعة الرئيسية (5)' },
          { id: 'مكتب خارجي', label: '🌍 المكاتب الخارجية والوكالات (3)' },
        ].map(tab => {
          const isActive = activeCategoryFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategoryFilter(tab.id as any)}
              style={{
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
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Group Entities Selector Bar */}
      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
        {filteredEntities.map(e => {
          const isSelected = selectedEntityId === e.id;
          return (
            <div
              key={e.id}
              onClick={() => setSelectedEntityId(e.id)}
              className={isSelected ? 'card-pricing-featured cursor-pointer' : 'card-pricing cursor-pointer'}
              style={{
                padding: '20px',
                borderRadius: '16px',
                background: isSelected ? '#000000' : '#ffffff',
                color: isSelected ? '#ffffff' : '#000000',
                transition: 'all 0.2s ease',
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={isSelected ? 'pill-tag-mint text-[10px]' : 'pill-tag-shade text-[10px]'}>
                  {e.code}
                </span>
                <Badge text={e.category} type={e.category === 'شركة مجموعة' ? 'purple' : e.category === 'مكتب خارجي' ? 'success' : 'info'} />
              </div>

              <h4 className="font-bold text-sm mb-1">{e.name}</h4>
              <span className={`text-xs block ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                المسؤول: {e.manager} • {e.departments.length} أقسام
              </span>
            </div>
          );
        })}
      </div>

      {/* Selected Entity Overview Banner */}
      <div className="card-pistachio-band" style={{ padding: '24px', borderRadius: '16px' }}>
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge text={selectedEntity.code} type="purple" />
              <Badge text={selectedEntity.category} type="info" />
              <span className="pill-tag-mint text-xs">إجمالي الكادر: {selectedEntity.staff_count} موظفين</span>
            </div>
            <h3 className="font-bold text-base text-black">
              {selectedEntity.name} - الموقع والفرع: {selectedEntity.location}
            </h3>
            <p className="text-xs text-zinc-700 mt-1">
              المشرف / المدير المسؤول: <strong>{selectedEntity.manager}</strong>
            </p>
          </div>

          <button
            className="button-primary-pill"
            onClick={() => setShowAddDeptModal(true)}
            style={{ padding: '6px 18px', fontSize: '12.5px', minHeight: '36px' }}
          >
            <Plus className="w-4 h-4 ml-1" />
            <span>تطوير وإضافة قسم تخصصي</span>
          </button>
        </div>
      </div>

      {/* Sub-Departments Cards Grid */}
      <div>
        <h3 className="text-base font-bold text-black mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-black" />
          <span>الأقسام التخصصية والوحدات المفعلة داخل ({selectedEntity.name})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedEntity.departments.map(dept => (
            <div key={dept.id} className="card-pricing flex flex-col justify-between" style={{ padding: '20px', borderRadius: '16px', background: '#ffffff' }}>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                    <Building2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="pill-tag-mint text-[11px]">{dept.kpi}</span>
                </div>

                <h4 className="font-bold text-sm text-black mb-2">{dept.name}</h4>
                <p className="text-xs text-zinc-600 leading-relaxed mb-4">{dept.description}</p>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex justify-between items-center text-xs text-zinc-600">
                <span>رئيس القسم: <strong className="text-black">{dept.head}</strong></span>
                <span className="text-emerald-700 font-bold">{dept.staff_count} موظفين مفعلين</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Sub-Department Modal */}
      {showAddDeptModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden font-sans">
            <div className="p-5 bg-black text-white flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>إضافة قسم تخصصي لـ ({selectedEntity.name})</span>
              </h3>
              <button onClick={() => setShowAddDeptModal(false)} className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubDepartment} className="p-6 space-y-4 bg-white text-black">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">اسم القسم التخصصي *</label>
                <input
                  type="text"
                  placeholder="مثال: إدارة الرعاية الطبية والفحوصات..."
                  value={deptForm.name}
                  onChange={e => setDeptForm({ ...deptForm, name: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">رئيس / مشرف القسم *</label>
                <input
                  type="text"
                  placeholder="اسم مسؤول القسم..."
                  value={deptForm.head}
                  onChange={e => setDeptForm({ ...deptForm, head: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">الوصف المهني ومسؤوليات القسم *</label>
                <textarea
                  rows={3}
                  placeholder="اكتب مهام وأهداف هذا القسم التخصصي..."
                  value={deptForm.description}
                  onChange={e => setDeptForm({ ...deptForm, description: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">مؤشر الأداء المستهدف KPI</label>
                <input
                  type="text"
                  value={deptForm.kpi}
                  onChange={e => setDeptForm({ ...deptForm, kpi: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-zinc-100">
                <button type="button" className="button-outline-on-light" onClick={() => setShowAddDeptModal(false)} style={{ minHeight: '36px', padding: '6px 16px', fontSize: '13px' }}>
                  إلغاء
                </button>
                <button type="submit" className="button-primary-pill" style={{ minHeight: '36px', padding: '6px 20px', fontSize: '13px' }}>
                  <Check className="w-4 h-4 ml-1" />
                  <span>اعتماد القسم التخصصي</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchDepartmentsPage;
