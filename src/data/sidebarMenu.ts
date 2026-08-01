import { NavItem } from '../types';

export const SIDEBAR_MENU: NavItem[] = [
  {
    id: 'dashboard',
    title: 'الرئيسية والمؤشرات',
    icon: 'fa-solid fa-chart-pie',
    href: 'dashboard'
  },
  {
    id: 'admin-dashboard',
    title: 'لوحة تحكم الآدمن الشاملة',
    icon: 'fa-solid fa-user-shield',
    href: 'admin-dashboard',
    badge: 'آدمن',
    badgeType: 'danger'
  },
  {
    id: 'branch-communication',
    title: 'مركز التواصل بين الفروع',
    icon: 'fa-solid fa-comments-dollar',
    href: 'branch-communication',
    badge: 'مباشر',
    badgeType: 'success'
  },
  {
    id: 'group-dispatch',
    title: 'تواصل شركات المجموعة والمكاتب',
    icon: 'fa-solid fa-paper-plane',
    href: 'group-dispatch',
    badge: 'جديد',
    badgeType: 'purple'
  },
  {
    id: 'branch-departments',
    title: 'هيكلة الأقسام التخصصية للفروع',
    icon: 'fa-solid fa-sitemap',
    href: 'branch-departments',
    badge: 'خطة',
    badgeType: 'primary'
  },
  {
    id: 'crm',
    title: 'إدارة العملاء (CRM)',
    icon: 'fa-solid fa-users-gear',
    children: [
      { id: 'clients', title: 'جميع العملاء', href: 'clients', badge: 241, badgeType: 'primary' },
      { id: 'visitors', title: 'زوار الموقع', href: 'visitors' },
      { id: 'whatsapp-inbox', title: 'محادثات واتساب', href: 'whatsapp-inbox' },
      { id: 'whatsapp-dispatch', title: 'إرسال رسائل واتساب', href: 'whatsapp-dispatch' },
      { id: 'messages', title: 'جميع الرسائل المرسلة', href: 'messages' }
    ]
  },
  {
    id: 'cvs',
    title: 'إدارة السير الذاتية (CVs)',
    icon: 'fa-solid fa-address-card',
    children: [
      { id: 'create-cv', title: 'إضافة سيرة ذاتية (136 حقل)', href: 'create-cv', badge: 'جديد', badgeType: 'success' },
      { id: 'cvs-recruitment', title: 'سير ذاتية التوسط', href: 'cvs-recruitment', badge: 142 },
      { id: 'cvs-rental', title: 'سير ذاتية الإيجار', href: 'cvs-rental', badge: 56 },
      { id: 'cvs-backout', title: 'سير ذاتية باك أوت', href: 'cvs-backout' },
      { id: 'cvs-deleted', title: 'السير المحذوفة', href: 'cvs-deleted' },
      { id: 'cvs-pending', title: 'بانتظار المراجعة', href: 'cvs-pending', badge: 12, badgeType: 'warning' }
    ]
  },
  {
    id: 'orders',
    title: 'إدارة الطلبات والحجوزات',
    icon: 'fa-solid fa-cart-flatbed',
    children: [
      { id: 'all-orders', title: 'جميع الطلبات (الحجوزات)', href: 'orders', badge: 120, badgeType: 'primary' },
      { id: 'new-orders', title: 'الطلبات الجديدة (24h)', href: 'new-orders', badge: 7, badgeType: 'danger' },
      { id: 'in-progress-orders', title: 'طلبات تحت الإجراء (48h)', href: 'in-progress-orders', badge: 7, badgeType: 'warning' },
      { id: 'contracted-orders', title: 'طلبات تم التعاقد', href: 'contracted-orders', badge: 106, badgeType: 'success' },
      { id: 'professional-requests', title: 'طلب عمالة مهنية', href: 'professional-requests' },
      { id: 'special-requests', title: 'طلبات خاصة', href: 'special-requests' },
      { id: 'known-service', title: 'طلبات الخدمة المعروفة', href: 'known-service' }
    ]
  },
  {
    id: 'recruitment-contracts',
    title: 'عقود الاستقدام',
    icon: 'fa-solid fa-file-signature',
    children: [
      { id: 'create-contract', title: 'إضافة عقد استقدام', href: 'create-contract' },
      { id: 'current-contracts', title: 'عقود سارية', href: 'recruitment-contracts', badge: 27, badgeType: 'primary' },
      { id: 'completed-contracts', title: 'عقود مكتملة', href: 'completed-contracts', badge: 6, badgeType: 'success' },
      { id: 'returned-contracts', title: 'عقود مرتجعة', href: 'returned-contracts', badge: 11, badgeType: 'danger' },
      { id: 'dispatches', title: 'الإرساليات الخارجية', href: 'dispatches', badge: 26 }
    ]
  },
  {
    id: 'rent-contracts',
    title: 'عقود التأجير والتشغيل',
    icon: 'fa-solid fa-handshake-simple',
    children: [
      { id: 'create-rent', title: 'إضافة عقد تأجير', href: 'create-rent' },
      { id: 'all-rent-contracts', title: 'جميع عقود التأجير', href: 'rent-contracts', badge: 13, badgeType: 'primary' },
      { id: 'active-rent', title: 'العقود النشطة', href: 'active-rent', badge: 2, badgeType: 'success' },
      { id: 'transferred-rent', title: 'تم النقل', href: 'transferred-rent', badge: 1 },
      { id: 'rent-packages', title: 'باقات التأجير', href: 'rent-packages' }
    ]
  },
  {
    id: 'ingaz',
    title: 'تفاويض الإنجاز',
    icon: 'fa-solid fa-passport',
    children: [
      { id: 'create-ingaz', title: 'إضافة تفويض جديد', href: 'create-ingaz' },
      { id: 'ingaz-delegations', title: 'تفاويض الإنجاز', href: 'ingaz-delegations', badge: 18 }
    ]
  },
  {
    id: 'shelter',
    title: 'إدارة الإيواء والتغذية',
    icon: 'fa-solid fa-building-user',
    children: [
      { id: 'create-shelter', title: 'إضافة للإيواء', href: 'create-shelter' },
      { id: 'inside-shelter', title: 'داخل الإيواء', href: 'shelter', badge: 61, badgeType: 'primary' },
      { id: 'outside-shelter', title: 'خارج الإيواء', href: 'outside-shelter' },
      { id: 'available-transfer', title: 'متاح للنقل', href: 'available-transfer', badge: 14, badgeType: 'success' },
      { id: 'deportation-stage', title: 'مرحلة الترحيل', href: 'deportation-stage' }
    ]
  },
  {
    id: 'sponsorship-transfer',
    title: 'نقل الكفالة والتنازل',
    icon: 'fa-solid fa-repeat',
    children: [
      { id: 'transfer-requests', title: 'طلبات نقل الكفالة', href: 'sponsorship-transfer' },
      { id: 'trial-period', title: 'فترة التجربة (10 أيام)', href: 'trial-period', badge: 8, badgeType: 'warning' },
      { id: 'transferred-done', title: 'تم النقل النهائي', href: 'transferred-done', badge: 42, badgeType: 'success' }
    ]
  },
  {
    id: 'logistics',
    title: 'الخدمات اللوجستية والسفر',
    icon: 'fa-solid fa-plane-departure',
    children: [
      { id: 'arrival-flights', title: 'رحلات الاستقدام والوصول', href: 'arrival-flights', badge: 77, badgeType: 'primary' },
      { id: 'deportation-flights', title: 'رحلات الترحيل والمغادرة', href: 'deportation-flights' }
    ]
  },
  {
    id: 'complaints',
    title: 'إدارة الشكاوى والدعم',
    icon: 'fa-solid fa-headset',
    children: [
      { id: 'complaints-list', title: 'جميع الشكاوى والتذاكر', href: 'complaints', badge: 26, badgeType: 'danger' },
      { id: 'create-complaint', title: 'إضافة شكوى جديدة', href: 'create-complaint' },
      { id: 'complaint-types', title: 'أنواع الشكاوى', href: 'complaint-types' }
    ]
  },
  {
    id: 'offices',
    title: 'إدارة الوكلاء الخارجيين',
    icon: 'fa-solid fa-globe',
    children: [
      { id: 'offices-list', title: 'الوكلاء الخارجيين', href: 'offices', badge: 22 },
      { id: 'agent-imports', title: 'ملفات السير المرفوعة', href: 'agent-imports' }
    ]
  },
  {
    id: 'financial-requests',
    title: 'إدارة الطلبات المالية',
    icon: 'fa-solid fa-money-bill-transfer',
    children: [
      { id: 'all-fin-requests', title: 'كل الطلبات المالية', href: 'financial-requests' },
      { id: 'create-fin-request', title: 'طلب مالي جديد', href: 'create-fin-request' }
    ]
  },
  {
    id: 'hr',
    title: 'إدارة الموارد البشرية (HR)',
    icon: 'fa-solid fa-users-viewfinder',
    children: [
      { id: 'employees', title: 'سجل الموظفين', href: 'employees', badge: 34 },
      { id: 'salaries', title: 'المرتبات ومسير الرواتب', href: 'salaries', badge: 'جديد', badgeType: 'success' },
      { id: 'attendances', title: 'الحضور والانصراف (Excel)', href: 'attendances' },
      { id: 'custodies', title: 'عُهد الموظفين ومقراتها', href: 'custodies' }
    ]
  },
  {
    id: 'finance-erp',
    title: 'إدارة الماليات والمحاسبة',
    icon: 'fa-solid fa-vault',
    children: [
      { id: 'finance-home', title: 'لوحة التحكم المالية', href: 'finance-home' },
      { id: 'chart-accounts', title: 'شجرة الدليل المحاسبي (336)', href: 'chart-accounts', badge: 336, badgeType: 'primary' },
      { id: 'cost-centers', title: 'مراكز التكلفة (130)', href: 'cost-centers', badge: 130 },
      { id: 'invoices', title: 'الفواتير والإشعارات', href: 'invoices' },
      { id: 'journals', title: 'القيود المحاسبية والسندات', href: 'journals' }
    ]
  },
  {
    id: 'zatca',
    title: 'هيئة الزكاة والضريبة (ZATCA)',
    icon: 'fa-solid fa-qrcode',
    children: [
      { id: 'zatca-settings', title: 'إعدادات المرحلة الثانية ZATCA', href: 'zatca-settings' },
      { id: 'shared-bills', title: 'فواتير تمت مشاركتها', href: 'shared-bills' }
    ]
  },
  {
    id: 'reports',
    title: 'إدارة التقارير الموحدة',
    icon: 'fa-solid fa-file-chart-column',
    children: [
      { id: 'reports-hub', title: 'مركز التقارير (13 تقرير)', href: 'reports', badge: 13, badgeType: 'purple' }
    ]
  },
  {
    id: 'users-access',
    title: 'التحكم بالوصول والأدوار',
    icon: 'fa-solid fa-user-shield',
    children: [
      { id: 'users-list', title: 'المستخدمين وموظفو الفروع', href: 'users' },
      { id: 'roles-permissions', title: 'الأدوار وتعيين الصلاحيات', href: 'roles-permissions' },
      { id: 'activity-log', title: 'سجل النشاط المباشر', href: 'activity-log' }
    ]
  },
  {
    id: 'settings',
    title: 'إعدادات النظام والـ CMS',
    icon: 'fa-solid fa-sliders',
    children: [
      { id: 'general-settings', title: 'الإعدادات العامة وهيكلية النظام', href: 'settings' },
      { id: 'quick-links-settings', title: 'إدارة الروابط السريعة', href: 'quick-links-settings' },
      { id: 'nationalities-jobs', title: 'ثوابت الاستقدام (الجنسيات والمهن)', href: 'nationalities-jobs' }
    ]
  }
];
