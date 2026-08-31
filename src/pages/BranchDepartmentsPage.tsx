import React, { useState, useMemo } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { 
  Network, Plus, FileSpreadsheet, FileText, Building2, Users, 
  Check, X, Shield, Plane, Globe, Handshake, DollarSign, 
  PhoneCall, Hotel, Stethoscope, Utensils, Archive, Gem, 
  Landmark, Repeat, Crown, ShieldAlert, Sparkles, Activity,
  Briefcase, CheckCircle2, TrendingUp, Compass, Award, ArrowUpRight,
  Layers, MapPin, Search
} from 'lucide-react';
import { KasKpiCard } from '../components/kas/KasCards';

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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);

  // Form State
  const [deptForm, setDeptForm] = useState({
    name: '',
    description: '',
    head: '',
    kpi: 'أداء 100%'
  });

  const filteredEntities = useMemo(() => {
    return entities.filter(e => {
      if (activeCategoryFilter !== 'all' && e.category !== activeCategoryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = e.name.toLowerCase().includes(q);
        const matchCode = e.code.toLowerCase().includes(q);
        const matchLoc = e.location.toLowerCase().includes(q);
        const matchMgr = e.manager.toLowerCase().includes(q);
        const matchDept = e.departments.some(d => d.name.toLowerCase().includes(q) || d.head.toLowerCase().includes(q));
        if (!matchName && !matchCode && !matchLoc && !matchMgr && !matchDept) return false;
      }
      return true;
    });
  }, [entities, activeCategoryFilter, searchQuery]);

  const selectedEntity = entities.find(e => e.id === selectedEntityId) || filteredEntities[0] || entities[0];

  // Overall KPI statistics
  const stats = useMemo(() => {
    const totalStaff = entities.reduce((acc, curr) => acc + curr.staff_count, 0);
    const totalDepts = entities.reduce((acc, curr) => acc + curr.departments.length, 0);
    const branchesCount = entities.filter(e => e.category === 'فرع منطقي').length;
    const companiesCount = entities.filter(e => e.category === 'شركة مجموعة').length;
    const agenciesCount = entities.filter(e => e.category === 'مكتب خارجي').length;

    return {
      totalEntities: entities.length,
      totalStaff,
      totalDepts,
      branchesCount,
      companiesCount,
      agenciesCount
    };
  }, [entities]);

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
      {/* Luxury Cinematic Header */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 p-7 text-white shadow-2xl border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-xl backdrop-blur-md">
              <Network className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl lg:text-3xl font-black tracking-tight">دليل الهيكلية والأقسام التخصصية للشركات والفروع</h2>
                <span className="px-3 py-1 text-xs font-black rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Enterprise Matrix
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/70 mt-1 font-medium">
                مجموعة خالد السليم • توباز، دار الرواد، السفير، الماسي، الأيام للسفر، كاس للتجارة والمعارض، الفروع الإقليمية، والوكالات الدولية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setShowAddDeptModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة قسم لـ ({selectedEntity.code})</span>
            </button>

            <button
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
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 backdrop-blur-md border border-white/10 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>تصدير Excel</span>
            </button>

            <button
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
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 backdrop-blur-md border border-white/10 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-rose-400" />
              <span>تصدير PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Luxury KPI Cards Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <KasKpiCard
          title="إجمالي الكيانات"
          value={stats.totalEntities.toString()}
          subtitle="شركات، فروع ومكاتب"
          icon={Building2}
          variant="emerald"
        />

        <KasKpiCard
          title="شركات المجموعة"
          value={stats.companiesCount.toString()}
          subtitle="توباز، دار الرواد، كاس.."
          icon={Gem}
          variant="gold"
        />

        <KasKpiCard
          title="الفروع ومراكز الإيواء"
          value={stats.branchesCount.toString()}
          subtitle="الرياض، جدة، الخبر"
          icon={Landmark}
          variant="sky"
        />

        <KasKpiCard
          title="الوكالات الخارجية"
          value={stats.agenciesCount.toString()}
          subtitle="إثيوبيا، الفلبين، الهند"
          icon={Globe}
          variant="purple"
        />

        <KasKpiCard
          title="الأقسام التخصصية"
          value={stats.totalDepts.toString()}
          subtitle="وحدات تشغيلية مفعلة"
          icon={Layers}
          variant="slate"
        />

        <KasKpiCard
          title="القوة البشرية الإجمالية"
          value={`${stats.totalStaff} موظف`}
          subtitle="كوادر إدارية وميدانية"
          icon={Users}
          variant="rose"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: `الكل (${entities.length})`, icon: Sparkles },
            { id: 'فرع منطقي', label: `الفروع والإيواء (${stats.branchesCount})`, icon: Landmark },
            { id: 'شركة مجموعة', label: `شركات المجموعة (${stats.companiesCount})`, icon: Gem },
            { id: 'مكتب خارجي', label: `المكاتب الخارجية (${stats.agenciesCount})`, icon: Globe },
          ].map(tab => {
            const isActive = activeCategoryFilter === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategoryFilter(tab.id as any)}
                className={isActive ? 'button-primary-pill text-xs font-bold flex items-center gap-1.5' : 'button-outline-on-light text-xs font-medium flex items-center gap-1.5'}
                style={{ padding: '6px 18px', minHeight: '36px' }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="بحث بالاسم، الكود، المدير أو القسم..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Group Entities Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredEntities.map(e => {
          const isSelected = selectedEntityId === e.id;
          return (
            <div
              key={e.id}
              onClick={() => setSelectedEntityId(e.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'bg-gradient-to-br from-slate-900 to-emerald-950 text-white border-emerald-500/50 shadow-xl shadow-emerald-950/20 scale-[1.02]'
                  : 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/40 hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black font-mono border ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                }`}>
                  {e.code}
                </span>
                <span className={isSelected ? 'pill-tag-mint text-[10px]' : 'pill-tag-shade text-[10px]'}>
                  {e.category}
                </span>
              </div>

              <h4 className="font-black text-sm mb-1 line-clamp-1 leading-snug">{e.name}</h4>
              <div className={`text-xs mt-2 flex items-center justify-between font-medium ${
                isSelected ? 'text-emerald-100/70' : 'text-zinc-500 dark:text-zinc-400'
              }`}>
                <span className="truncate max-w-[140px]">{e.manager}</span>
                <span className="font-bold text-[11px] shrink-0 font-mono">{e.departments.length} أقسام • {e.staff_count} موظف</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Entity Hero Overview Banner */}
      {selectedEntity && (
        <div className="rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50/80 dark:from-emerald-950/40 dark:to-teal-950/20 border border-emerald-200/80 dark:border-emerald-800/50 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-mono font-black text-xs">
                  {selectedEntity.code}
                </span>
                <span className="pill-tag-mint text-xs">
                  {selectedEntity.category}
                </span>
                <span className="pill-tag-shade text-xs font-mono">
                  👥 إجمالي الكادر: {selectedEntity.staff_count} موظف
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{selectedEntity.name}</span>
                <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400 font-medium">({selectedEntity.location})</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                المشرف / المدير المسؤول: <strong className="text-emerald-700 dark:text-emerald-400">{selectedEntity.manager}</strong>
              </p>
            </div>

            <button
              onClick={() => setShowAddDeptModal(true)}
              className="button-primary-pill text-xs font-black flex items-center gap-2 shadow-lg self-start md:self-center cursor-pointer"
              style={{ padding: '8px 22px', minHeight: '38px' }}
            >
              <Plus className="w-4 h-4" />
              <span>تطوير وإضافة قسم تخصصي</span>
            </button>
          </div>
        </div>
      )}

      {/* Sub-Departments Cards Grid */}
      {selectedEntity && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span>الأقسام التخصصية والوحدات المفعلة داخل ({selectedEntity.name})</span>
            </h3>
            <span className="pill-tag-mint text-xs font-mono">
              {selectedEntity.departments.length} أقسام تشغيلية
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {selectedEntity.departments.map(dept => (
              <div 
                key={dept.id} 
                className="card-pricing border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between group bg-white dark:bg-zinc-900"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center font-bold shadow-xs">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <span className="pill-tag-mint text-xs font-black">
                      {dept.kpi}
                    </span>
                  </div>

                  <h4 className="font-black text-base text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {dept.name}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium mb-4">
                    {dept.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs">
                  <div className="text-zinc-500 dark:text-zinc-400">
                    <span>رئيس القسم: </span>
                    <strong className="text-slate-900 dark:text-white font-bold">{dept.head}</strong>
                  </div>
                  <span className="pill-tag-shade text-xs font-mono">
                    {dept.staff_count} كوادر
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Sub-Department Modal */}
      {showAddDeptModal && selectedEntity && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-pricing bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 text-slate-900 dark:text-white relative">
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 rounded-t-3xl" />

            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span>إضافة قسم تخصصي لـ ({selectedEntity.name})</span>
              </h3>
              <button 
                onClick={() => setShowAddDeptModal(false)} 
                className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubDepartment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">اسم القسم التخصصي *</label>
                <input
                  type="text"
                  placeholder="مثال: إدارة الرعاية الطبية والفحوصات..."
                  value={deptForm.name}
                  onChange={e => setDeptForm({ ...deptForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">رئيس / مشرف القسم *</label>
                <input
                  type="text"
                  placeholder="اسم مسؤول القسم..."
                  value={deptForm.head}
                  onChange={e => setDeptForm({ ...deptForm, head: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">الوصف المهني ومسؤوليات القسم *</label>
                <textarea
                  rows={3}
                  placeholder="اكتب مهام وأهداف هذا القسم التخصصي..."
                  value={deptForm.description}
                  onChange={e => setDeptForm({ ...deptForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">مؤشر الأداء المستهدف KPI</label>
                <input
                  type="text"
                  value={deptForm.kpi}
                  onChange={e => setDeptForm({ ...deptForm, kpi: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500 font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button 
                  type="button" 
                  onClick={() => setShowAddDeptModal(false)} 
                  className="button-outline-on-light text-xs font-bold"
                  style={{ padding: '8px 20px' }}
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  className="button-primary-pill text-xs font-bold flex items-center gap-2"
                  style={{ padding: '8px 22px' }}
                >
                  <Check className="w-4 h-4" />
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
