/**
 * visualAssetsRegistry.ts
 * Central registry mapping Khalid Al-Sulaim Holding Group's 5 Companies, 9 Departments,
 * 28+ Staff Roles, Candidate Professions, and ERP Modules to Corporate Avatars
 * and IconScout-Style Business Illustrations.
 */

export type AvatarArchetype =
  | 'saudi-executive'
  | 'saudi-specialist'
  | 'saudi-female-specialist'
  | 'finance-cfo'
  | 'tenders-engineer'
  | 'candidate-maid'
  | 'candidate-nurse'
  | 'candidate-driver'
  | 'candidate-chef'
  | 'client-vip'
  | 'client-b2b'
  | 'ai-faris'
  | 'ai-noura';

export type IllustrationKey =
  | 'exec-command'
  | 'smacc-finance'
  | 'zatca-einvoice'
  | 'ocr-extractor'
  | 'musaned-recruitment'
  | 'flexible-rental'
  | 'ats-talent'
  | 'hr-wps'
  | 'crm-customer'
  | 'shelter-care'
  | 'kas-tenders'
  | 'empty-search';

export interface IllustrationMetadata {
  key: IllustrationKey;
  titleAr: string;
  subtitleAr: string;
  badgeAr: string;
  accentHex: string;
  secondaryHex: string;
}

export const ILLUSTRATION_METADATA: Record<IllustrationKey, IllustrationMetadata> = {
  'exec-command': {
    key: 'exec-command',
    titleAr: 'مركز القيادة التنفيذية والتحليلات الحية',
    subtitleAr: 'مراقبة الأداء المالي والتشغيلي الموحد عبر الشركات الـ 5 والأقسام الـ 9 لحظياً',
    badgeAr: 'حوكمة المجموعة 360°',
    accentHex: '#B8924A',
    secondaryHex: '#1D2428',
  },
  'smacc-finance': {
    key: 'smacc-finance',
    titleAr: 'منظومة سماك المحاسبية السحابية (SMACC 6-Divisions)',
    subtitleAr: 'دفتر الأستاذ العام، القيود المزدوجة المتوازنة، سندات القبض والصرف، ومراكز التكلفة',
    badgeAr: 'توازن محاسبي 100%',
    accentHex: '#B8924A',
    secondaryHex: '#0F172A',
  },
  'zatca-einvoice': {
    key: 'zatca-einvoice',
    titleAr: 'الفوترة الإلكترونية المشفرة (ZATCA المرحلة الثانية)',
    subtitleAr: 'ربط وتوقيع الفواتير الضريبية والمبسطة بصيغة XML UBL 2.1 وختم QR التشفيري',
    badgeAr: 'معتمد في منصة فاتورة',
    accentHex: '#059669',
    secondaryHex: '#1D2428',
  },
  'ocr-extractor': {
    key: 'ocr-extractor',
    titleAr: 'محرك الاستخلاص الذكي (100+ فاتورة وأي مستند)',
    subtitleAr: 'قراءة آلية لملفات PDF وExcel وWord وصور الفواتير وترحيلها مباشرة لدفتر سماك',
    badgeAr: 'ماسح OCR الذكي',
    accentHex: '#B8924A',
    secondaryHex: '#1D2428',
  },
  'musaned-recruitment': {
    key: 'musaned-recruitment',
    titleAr: 'منظومة عقود الاستقدام والربط الدولي (مساند)',
    subtitleAr: 'إدارة دورة حياة العقد، تفاويض التأشيرات، والربط مع الوكالات الخارجية حتى الوصول',
    badgeAr: 'تكامل مساند وإنجاز',
    accentHex: '#8C681E',
    secondaryHex: '#1D2428',
  },
  'flexible-rental': {
    key: 'flexible-rental',
    titleAr: 'عقود التأجير والتشغيل المرن (شركة الياقوت)',
    subtitleAr: 'إدارة الباقات الشهرية والموسمية، جدولة الكوادر، والتحصيل التلقائي للدفعات',
    badgeAr: 'تشغيل مرن بالساعة والشهر',
    accentHex: '#B8924A',
    secondaryHex: '#1D2428',
  },
  'ats-talent': {
    key: 'ats-talent',
    titleAr: 'بنك السير الذاتية واستقطاب الكفاءات (ATS)',
    subtitleAr: 'فرز ومطابقة المرشحين، فحص الجاهزية الطبية، وربط طلبات العملاء آلياً',
    badgeAr: 'توب تالنت ATS',
    accentHex: '#8C681E',
    secondaryHex: '#1D2428',
  },
  'hr-wps': {
    key: 'hr-wps',
    titleAr: 'إدارة رأس المال البشري وحماية الأجور (WPS)',
    subtitleAr: 'الملف الرقمي للموظف 360°، مسيرات الرواتب، الحضور الذكي، وحاسبة نهاية الخدمة',
    badgeAr: 'متوافق مع نظام العمل السعودي',
    accentHex: '#B8924A',
    secondaryHex: '#1D2428',
  },
  'crm-customer': {
    key: 'crm-customer',
    titleAr: 'منظومة علاقات العملاء والشكاوى والتواصل الموحد',
    subtitleAr: 'إدارة ملفات العملاء VIP والشركات، معالجة المطالبات، والتراسل عبر الواتساب والفروع',
    badgeAr: 'مركز إسعاد العملاء',
    accentHex: '#B8924A',
    secondaryHex: '#1D2428',
  },
  'shelter-care': {
    key: 'shelter-care',
    titleAr: 'بوابة دار الرواد لمراكز الإيواء والتسكين والرعاية',
    subtitleAr: 'متابعة إشغال الغرف، الإعاشة اليومية، الرعاية الطبية، وتسويات نقل الخدمات والترحيل',
    badgeAr: 'معايير الإيواء HRSD',
    accentHex: '#0D9488',
    secondaryHex: '#1D2428',
  },
  'kas-tenders': {
    key: 'kas-tenders',
    titleAr: 'منظومة كاس للمنافسات الحكومية وجداول الكميات (BOQ)',
    subtitleAr: 'رصد منافسات منصة اعتماد، التسعير الهندسي الدقيق، الضمانات البنكية، وأوامر التوريد',
    badgeAr: 'سحابة اعتماد كاس',
    accentHex: '#B8924A',
    secondaryHex: '#1D2428',
  },
  'empty-search': {
    key: 'empty-search',
    titleAr: 'لا توجد سجلات مطابقة لمعايير البحث الحالية',
    subtitleAr: 'جرب تعديل كلمات البحث أو إعادة ضبط الفلاتر أو إضافة سجل جديد مباشرة',
    badgeAr: 'البحث والتصفية الذكية',
    accentHex: '#B8924A',
    secondaryHex: '#64748B',
  },
};

export const BUSINESS_ILLUSTRATION_METADATA = ILLUSTRATION_METADATA;

const FEMALE_NAME_INDICATORS = [
  'نورة',
  'نُورة',
  'ريم',
  'منى',
  'سارة',
  'ساره',
  'فاطمة',
  'فاطمه',
  'عائشة',
  'نوف',
  'لولوة',
  'مها',
  'هدى',
  'أمل',
  'امل',
  'عبير',
  'حنان',
  'بنت',
  'أ. ريم',
  'أ. منى',
  'أ. نورة',
  'أ. سارة',
  'أ. نوف',
  'أ. مها',
  'أ. فاطمة',
  'maria',
  'kimberly',
  'siti',
  'amina',
  'grace',
  'joy',
  'fatima',
  'noura',
];

/**
 * Deterministically resolves the best Corporate Avatar archetype for any employee,
 * candidate, client, or AI persona across the ERP.
 */
export function resolveAvatarArchetype(params: {
  name?: string;
  role?: string;
  email?: string;
  departmentId?: string;
  profession?: string;
  gender?: 'male' | 'female';
  category?: string;
  isCandidate?: boolean;
  isClient?: boolean;
}): AvatarArchetype {
  const name = (params.name || '').toLowerCase();
  const role = (params.role || '').toLowerCase();
  const email = (params.email || '').toLowerCase();
  const dept = (params.departmentId || '').toLowerCase();
  const profession = (params.profession || '').toLowerCase();
  const jobCheck = `${profession} ${role}`;
  const category = (params.category || '').toLowerCase();

  if (name === 'فارس' || name === 'faris') return 'ai-faris';
  if (name === 'نورة' || name === 'نُورة' || name === 'noura') return 'ai-noura';

  // Client records
  if (params.isClient || category.includes('شرك') || category.includes('b2b') || category.includes('أفراد') || category.includes('vip')) {
    if (category.includes('شرك') || category.includes('b2b') || name.includes('شركة') || name.includes('مؤسسة') || name.includes('مجموعة')) {
      return 'client-b2b';
    }
    return 'client-vip';
  }

  // Candidate / CV / Shelter worker records (check both profession and role)
  if (
    params.isCandidate ||
    jobCheck.includes('ممرض') ||
    jobCheck.includes('رعاية كبار') ||
    jobCheck.includes('رعاية أطفال') ||
    jobCheck.includes('طباخ') ||
    jobCheck.includes('طاه') ||
    jobCheck.includes('سائق') ||
    jobCheck.includes('عاملة منزلية') ||
    jobCheck.includes('عامل منزلي') ||
    jobCheck.includes('housemaid') ||
    jobCheck.includes('nurse') ||
    jobCheck.includes('driver')
  ) {
    if (jobCheck.includes('ممرض') || jobCheck.includes('رعاية كبار') || jobCheck.includes('طبي') || jobCheck.includes('nurse')) {
      return 'candidate-nurse';
    }
    if (jobCheck.includes('سائق') || jobCheck.includes('نقل') || jobCheck.includes('driver')) {
      return 'candidate-driver';
    }
    if (jobCheck.includes('طاه') || jobCheck.includes('طباخ') || jobCheck.includes('شيف') || jobCheck.includes('cook')) {
      return 'candidate-chef';
    }
    if (
      jobCheck.includes('عامل') ||
      jobCheck.includes('منزل') ||
      jobCheck.includes('نظاف') ||
      jobCheck.includes('مرب') ||
      jobCheck.includes('رعاية أطفال') ||
      jobCheck.includes('housemaid')
    ) {
      return 'candidate-maid';
    }
  }

  // Female employees / supervisors
  const isFemale =
    params.gender === 'female' ||
    FEMALE_NAME_INDICATORS.some((ind) => name.includes(ind)) ||
    role.includes('مشرفة') ||
    role.includes('مسؤولة') ||
    role.includes('أخصائية') ||
    role.includes('مديرة');

  if (isFemale) {
    return 'saudi-female-specialist';
  }

  // Executive / Chairman / System Developer
  if (
    dept === 'executive' ||
    email.includes('chairman') ||
    email.includes('admin') ||
    email === 'abdo12uk@gmail.com' ||
    role.includes('رئيس') ||
    role.includes('تنفيذي') ||
    role.includes('مطور النظام') ||
    name.includes('الشيخ خالد')
  ) {
    return 'saudi-executive';
  }

  // Finance & SMACC Accounting
  if (
    dept === 'finance' ||
    dept.includes('مالي') ||
    dept.includes('محاسب') ||
    role.includes('محاسب') ||
    role.includes('مالي') ||
    role.includes('سماك')
  ) {
    return 'finance-cfo';
  }

  // KAS Tenders & Engineering
  if (
    dept === 'tenders' ||
    dept.includes('منافسات') ||
    role.includes('منافسات') ||
    role.includes('مهندس') ||
    role.includes('كميات')
  ) {
    return 'tenders-engineer';
  }

  return 'saudi-specialist';
}

/**
 * Resolves the appropriate IconScout-style Business Illustration for any active tab or department.
 */
export function resolveIllustrationForTab(
  tabKey?: string,
  departmentId?: string
): IllustrationKey {
  const t = (tabKey || '').toLowerCase();
  const d = (departmentId || '').toLowerCase();

  if (t.includes('zatca') || t.includes('invoices')) return 'zatca-einvoice';
  if (t.includes('extractor') || t.includes('import')) return 'ocr-extractor';
  if (t.includes('smacc') || t.includes('journal') || t.includes('voucher') || t.includes('finance') || t.includes('cost')) {
    return 'smacc-finance';
  }
  if (t.includes('kas') || t.includes('tender') || t.includes('boq') || t.includes('etmad')) {
    return 'kas-tenders';
  }
  if (t.includes('shelter') || t.includes('sponsorship') || t.includes('deportation')) {
    return 'shelter-care';
  }
  if (t.includes('rent')) return 'flexible-rental';
  if (t.includes('cv') || t.includes('ats') || t.includes('talent')) return 'ats-talent';
  if (t.includes('hr') || t.includes('attendance') || t.includes('wps') || t.includes('monitoring')) {
    return 'hr-wps';
  }
  if (t.includes('client') || t.includes('complaint') || t.includes('whatsapp') || t.includes('communication')) {
    return 'crm-customer';
  }
  if (t.includes('recruitment') || t.includes('musaned') || t.includes('order') || t.includes('office') || t.includes('ingaz')) {
    return 'musaned-recruitment';
  }

  // Fallback by departmentId
  switch (d) {
    case 'finance':
      return 'smacc-finance';
    case 'recruitment':
      return 'musaned-recruitment';
    case 'rental':
      return 'flexible-rental';
    case 'ats':
      return 'ats-talent';
    case 'hr':
      return 'hr-wps';
    case 'crm':
      return 'crm-customer';
    case 'shelter':
      return 'shelter-care';
    case 'tenders':
      return 'kas-tenders';
    default:
      return 'exec-command';
  }
}

/**
 * Resolves the appropriate IconScout-style Business Illustration for a company portal code.
 */
export function resolveIllustrationForPortal(portalCode?: string | null): IllustrationKey {
  const code = (portalCode || '').toUpperCase();
  switch (code) {
    case 'SAF':
      return 'musaned-recruitment';
    case 'YAQ':
      return 'flexible-rental';
    case 'TOP':
      return 'ats-talent';
    case 'KAS':
      return 'kas-tenders';
    case 'DAR':
    case 'SHELTER':
      return 'shelter-care';
    case 'ADMIN':
    case 'ALL':
    default:
      return 'exec-command';
  }
}

export function getIllustrationMetadata(key: IllustrationKey): IllustrationMetadata {
  return ILLUSTRATION_METADATA[key] || ILLUSTRATION_METADATA['exec-command'];
}
