import { CompanyId } from '../../types';
import { normalizeCompanyId } from '../../contexts/CompanyContext';

export interface CustomFieldDefinition {
  key: string;
  label: string;
  section: 'أصول' | 'خصوم' | 'حقوق ملكية' | 'إيرادات' | 'مصروفات' | 'ALL';
  fieldType: 'text' | 'number' | 'percent' | 'date';
  defaultValue?: string;
}

export interface AccountItem {
  id: string;
  companyId: CompanyId;
  code: string;
  nameAr: string;
  nameEn: string;
  category: 'أصول' | 'خصوم' | 'حقوق ملكية' | 'إيرادات' | 'مصروفات';
  nature: 'مدين' | 'دائن';
  statementType: 'قائمة المركز المالي (ميزانية)' | 'قائمة الدخل (أرباح وخسائر)' | 'قائمة التدفقات النقدية';
  level: number;
  subcategory?: string;
  parentCode?: string;
  openingBalance: number;
  currentDebit: number;
  currentCredit: number;
  balance: number;
  currency: string;
  isActive: boolean;
  isHeader?: boolean;
  notes?: string;
  ifrsCode?: string;
  costCenter?: string;
  customFields?: Record<string, string>;
}

export interface AccountTreeNode extends AccountItem {
  children?: AccountTreeNode[];
}

export const DEFAULT_CUSTOM_ASSET_FIELDS: CustomFieldDefinition[] = [
  { key: 'depreciationRate', label: 'نسبة الإهلاك السنوي (%)', section: 'أصول', fieldType: 'percent', defaultValue: '10%' },
  { key: 'usefulLifeYears', label: 'العمر الإنتاجي (سنوات)', section: 'أصول', fieldType: 'number', defaultValue: '5' },
  { key: 'assetLocation', label: 'موقع الأصل / الفرع', section: 'أصول', fieldType: 'text', defaultValue: 'الرياض - المقر الرئيسي' },
  { key: 'acquisitionDate', label: 'تاريخ الشراء / الاستحواذ', section: 'أصول', fieldType: 'date', defaultValue: '2025-01-15' },
  { key: 'salvageValue', label: 'القيمة التخريدية (⃁)', section: 'أصول', fieldType: 'number', defaultValue: '0' },
];

// ─── Standard Multi-Level Saudi Chart of Accounts Matrix (SMACC & IFRS Compliant) ─────────────────────
const STANDARD_SMACC_COA: Omit<AccountItem, 'id' | 'companyId'>[] = [
  // ═══ 1. الأصول (Assets) ═══
  { code: '1', nameAr: 'الأصول (Assets)', nameEn: 'Assets', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 1, balance: 2850000, openingBalance: 2400000, currentDebit: 850000, currentCredit: 400000, currency: 'SAR', isActive: true, isHeader: true, ifrsCode: 'A-01' },

  // 11. الأصول المتداولة
  { code: '11', nameAr: 'الأصول المتداولة (Current Assets)', nameEn: 'Current Assets', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 2, parentCode: '1', balance: 1967500, openingBalance: 1600000, currentDebit: 750000, currentCredit: 382500, currency: 'SAR', isActive: true, isHeader: true, ifrsCode: 'A-10' },

  // 1101. النقد وما في حكمه
  { code: '1101', nameAr: 'النقدية وما في حكمها (Cash & Cash Equivalents)', nameEn: 'Cash & Equivalents', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 3, parentCode: '11', balance: 230000, openingBalance: 190000, currentDebit: 120000, currentCredit: 80000, currency: 'SAR', isActive: true, isHeader: true, ifrsCode: 'A-10' },
  { code: '110101', nameAr: 'الصندوق الرئيسي (الخزينة المركزية)', nameEn: 'Main Treasury Cash Box', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 4, parentCode: '1101', balance: 185000, openingBalance: 150000, currentDebit: 95000, currentCredit: 60000, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'A-10', customFields: { assetLocation: 'الرياض - الإدارة المالية' } },
  { code: '110102', nameAr: 'عهد الفروع النقدية المؤقتة', nameEn: 'Branch Petty Cash', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 4, parentCode: '1101', balance: 45000, openingBalance: 40000, currentDebit: 25000, currentCredit: 20000, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'A-10', customFields: { assetLocation: 'فروع المملكة' } },

  // 1102. البنوك والحسابات المصرفية
  { code: '1102', nameAr: 'الحسابات المصرفية (Bank Accounts)', nameEn: 'Banks', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 3, parentCode: '11', balance: 742500, openingBalance: 610000, currentDebit: 320000, currentCredit: 187500, currency: 'SAR', isActive: true, isHeader: true, ifrsCode: 'A-10' },
  { code: '110201', nameAr: 'مصرف الراجحي - الحساب التشغيلي الرئيسي', nameEn: 'Al Rajhi Bank - Operating', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 4, parentCode: '1102', balance: 420000, openingBalance: 350000, currentDebit: 190000, currentCredit: 120000, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'A-10' },
  { code: '110202', nameAr: 'بنك الرياض - حساب عقود الاستقدام', nameEn: 'Riyad Bank - Recruitment', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 4, parentCode: '1102', balance: 322500, openingBalance: 260000, currentDebit: 130000, currentCredit: 67500, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'A-10' },

  // 1103. حسابات الضمان والأمانات الحكومية والمدينون
  { code: '1103', nameAr: 'حسابات ضمان منصة مساند (Musaned Escrow Accounts)', nameEn: 'Musaned Escrow Accounts', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 3, parentCode: '11', balance: 345000, openingBalance: 240000, currentDebit: 195000, currentCredit: 90000, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'A-07' },
  { code: '1104', nameAr: 'ذمم العملاء التجارية والمدينون (Trade Receivables)', nameEn: 'Trade Receivables', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 3, parentCode: '11', balance: 430000, openingBalance: 380000, currentDebit: 85000, currentCredit: 35000, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'A-07' },
  { code: '1105', nameAr: 'مصروفات مدفوعة مقدماً وسلف موظفين (Prepayments)', nameEn: 'Prepayments & Advances', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 3, parentCode: '11', balance: 220000, openingBalance: 180000, currentDebit: 65000, currentCredit: 25000, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'A-09' },

  // 12. الأصول غير المتداولة (الثابتة وغير الملموسة وحق الاستخدام)
  { code: '12', nameAr: 'الأصول غير المتداولة (Fixed & Non-Current Assets)', nameEn: 'Non-Current Assets', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 2, parentCode: '1', balance: 882500, openingBalance: 800000, currentDebit: 100000, currentCredit: 17500, currency: 'SAR', isActive: true, isHeader: true, ifrsCode: 'A-01' },
  { code: '1201', nameAr: 'أسطول السيارات وحافلات نقل الكوادر', nameEn: 'Vehicles & Buses Fleet', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 3, parentCode: '12', balance: 520000, openingBalance: 480000, currentDebit: 60000, currentCredit: 20000, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'A-01', customFields: { depreciationRate: '20%', usefulLifeYears: '5', assetLocation: 'الرياض - الحركة والنقل', acquisitionDate: '2024-03-10', salvageValue: '45000' } },
  { code: '1202', nameAr: 'أجهزة وأنظمة تقنية المعلومات والخوادم', nameEn: 'IT Hardware & Cloud Servers', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 3, parentCode: '12', balance: 142500, openingBalance: 120000, currentDebit: 30000, currentCredit: 7500, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'A-01', customFields: { depreciationRate: '25%', usefulLifeYears: '4', assetLocation: 'المقر الرئيسي - تقنية المعلومات', acquisitionDate: '2024-06-01', salvageValue: '5000' } },
  { code: '1203', nameAr: 'تجهيزات ومباني مراكز الإيواء والتسكين', nameEn: 'Shelter Center Leasehold & Facilities', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 3, parentCode: '12', balance: 220000, openingBalance: 200000, currentDebit: 30000, currentCredit: 10000, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'A-01', customFields: { depreciationRate: '10%', usefulLifeYears: '10', assetLocation: 'مركز الإيواء - الرياض', acquisitionDate: '2023-11-20', salvageValue: '15000' } },
  { code: '1204', nameAr: 'أصول حق الاستخدام - عقود إيجار المقرات (IFRS 16)', nameEn: 'Right-of-Use Assets (IFRS 16)', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 3, parentCode: '12', balance: 310000, openingBalance: 350000, currentDebit: 0, currentCredit: 40000, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'A-05', customFields: { depreciationRate: '20%', usefulLifeYears: '5', assetLocation: 'فروع الرياض وجدة والدمام', acquisitionDate: '2024-01-01', salvageValue: '0' } },

  // ═══ 2. الخصوم والالتزامات (Liabilities) ═══
  { code: '2', nameAr: 'الخصوم والالتزامات (Liabilities)', nameEn: 'Liabilities', category: 'خصوم', nature: 'دائن', statementType: 'قائمة المركز المالي (ميزانية)', level: 1, balance: 875000, openingBalance: 760000, currentDebit: 210000, currentCredit: 325000, currency: 'SAR', isActive: true, isHeader: true, ifrsCode: 'L-04' },
  { code: '21', nameAr: 'الالتزامات المتداولة (Current Liabilities)', nameEn: 'Current Liabilities', category: 'خصوم', nature: 'دائن', statementType: 'قائمة المركز المالي (ميزانية)', level: 2, parentCode: '2', balance: 541000, openingBalance: 470000, currentDebit: 190000, currentCredit: 261000, currency: 'SAR', isActive: true, isHeader: true, ifrsCode: 'L-04' },
  { code: '2101', nameAr: 'مستحقات الوكلاء الخارجيين والمكاتب الدولية', nameEn: 'Foreign Recruitment Agencies Payables', category: 'خصوم', nature: 'دائن', statementType: 'قائمة المركز المالي (ميزانية)', level: 3, parentCode: '21', balance: 189375, openingBalance: 175000, currentDebit: 85000, currentCredit: 99375, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'L-04' },
  { code: '2102', nameAr: 'أمانات ضريبة القيمة المضافة لهيئة الزكاة (VAT 15%)', nameEn: 'ZATCA VAT Output Liability', category: 'خصوم', nature: 'دائن', statementType: 'قائمة المركز المالي (ميزانية)', level: 3, parentCode: '21', balance: 124000, openingBalance: 110000, currentDebit: 45000, currentCredit: 59000, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'L-05' },
  { code: '2103', nameAr: 'أمانات التأمينات الاجتماعية والرواتب المستحقة (GOSI & WPS)', nameEn: 'GOSI & Accrued Payroll', category: 'خصوم', nature: 'دائن', statementType: 'قائمة المركز المالي (ميزانية)', level: 3, parentCode: '21', balance: 127625, openingBalance: 105000, currentDebit: 60000, currentCredit: 82625, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'L-05' },
  { code: '2104', nameAr: 'مخصص الزكاة الشرعية المستحقة (Zakat Provision)', nameEn: 'Zakat Payable Provision', category: 'خصوم', nature: 'دائن', statementType: 'قائمة المركز المالي (ميزانية)', level: 3, parentCode: '21', balance: 100000, openingBalance: 80000, currentDebit: 0, currentCredit: 20000, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'L-08' },
  { code: '22', nameAr: 'الالتزامات غير المتداولة (Non-Current Liabilities)', nameEn: 'Non-Current Liabilities', category: 'خصوم', nature: 'دائن', statementType: 'قائمة المركز المالي (ميزانية)', level: 2, parentCode: '2', balance: 334000, openingBalance: 290000, currentDebit: 20000, currentCredit: 64000, currency: 'SAR', isActive: true, isHeader: true, ifrsCode: 'L-03' },
  { code: '2201', nameAr: 'مخصص مكافأة نهاية الخدمة للموظفين (IAS 19 EOSB)', nameEn: 'Employees End of Service Benefits', category: 'خصوم', nature: 'دائن', statementType: 'قائمة المركز المالي (ميزانية)', level: 3, parentCode: '22', balance: 194000, openingBalance: 150000, currentDebit: 20000, currentCredit: 64000, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'L-03' },
  { code: '2202', nameAr: 'التزامات عقود الإيجار طويلة الأجل (IFRS 16)', nameEn: 'Long-Term Lease Liabilities', category: 'خصوم', nature: 'دائن', statementType: 'قائمة المركز المالي (ميزانية)', level: 3, parentCode: '22', balance: 140000, openingBalance: 140000, currentDebit: 0, currentCredit: 0, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'L-02' },

  // ═══ 3. حقوق الملكية (Equity) ═══
  { code: '3', nameAr: 'حقوق الملكية ورأس المال (Equity)', nameEn: 'Equity', category: 'حقوق ملكية', nature: 'دائن', statementType: 'قائمة المركز المالي (ميزانية)', level: 1, balance: 2285000, openingBalance: 1910000, currentDebit: 0, currentCredit: 375000, currency: 'SAR', isActive: true, isHeader: true, ifrsCode: 'E-01' },
  { code: '31', nameAr: 'رأس المال المدفوع', nameEn: 'Paid-in Capital', category: 'حقوق ملكية', nature: 'دائن', statementType: 'قائمة المركز المالي (ميزانية)', level: 2, parentCode: '3', balance: 1500000, openingBalance: 1500000, currentDebit: 0, currentCredit: 0, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'E-01' },
  { code: '32', nameAr: 'الاحتياطي النظامي (Statutory Reserve)', nameEn: 'Statutory Reserve', category: 'حقوق ملكية', nature: 'دائن', statementType: 'قائمة المركز المالي (ميزانية)', level: 2, parentCode: '3', balance: 150000, openingBalance: 120000, currentDebit: 0, currentCredit: 30000, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'E-02' },
  { code: '33', nameAr: 'الأرباح المبقاة والمدورة (Retained Earnings)', nameEn: 'Retained Earnings', category: 'حقوق ملكية', nature: 'دائن', statementType: 'قائمة المركز المالي (ميزانية)', level: 2, parentCode: '3', balance: 635000, openingBalance: 290000, currentDebit: 0, currentCredit: 345000, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'E-03' },

  // ═══ 4. الإيرادات التشغيلية (Revenues) ═══
  { code: '4', nameAr: 'الإيرادات التشغيلية والمبيعات (Revenues)', nameEn: 'Revenues', category: 'إيرادات', nature: 'دائن', statementType: 'قائمة الدخل (أرباح وخسائر)', level: 1, balance: 4890000, openingBalance: 0, currentDebit: 35000, currentCredit: 4925000, currency: 'SAR', isActive: true, isHeader: true, ifrsCode: 'R-01' },
  { code: '41', nameAr: 'إيرادات عقود التوسط والاستقدام (مساند)', nameEn: 'Recruitment Commission Revenue', category: 'إيرادات', nature: 'دائن', statementType: 'قائمة الدخل (أرباح وخسائر)', level: 2, parentCode: '4', balance: 3450000, openingBalance: 0, currentDebit: 25000, currentCredit: 3475000, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'R-01' },
  { code: '42', nameAr: 'إيرادات عقود التأجير والتشغيل المرن', nameEn: 'Flexible Rental Contracts Revenue', category: 'إيرادات', nature: 'دائن', statementType: 'قائمة الدخل (أرباح وخسائر)', level: 2, parentCode: '4', balance: 1240000, openingBalance: 0, currentDebit: 10000, currentCredit: 1250000, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'R-01' },
  { code: '43', nameAr: 'إيرادات نقل الكفالة والإيواء والخدمات الأخرى', nameEn: 'Sponsorship Transfer & Ancillary Revenue', category: 'إيرادات', nature: 'دائن', statementType: 'قائمة الدخل (أرباح وخسائر)', level: 2, parentCode: '4', balance: 200000, openingBalance: 0, currentDebit: 0, currentCredit: 200000, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'R-05' },

  // ═══ 5. المصروفات التشغيلية والإدارية (Expenses) ═══
  { code: '5', nameAr: 'المصروفات والأعباء التشغيلية (Expenses)', nameEn: 'Expenses', category: 'مصروفات', nature: 'مدين', statementType: 'قائمة الدخل (أرباح وخسائر)', level: 1, balance: 2160000, openingBalance: 0, currentDebit: 2160000, currentCredit: 0, currency: 'SAR', isActive: true, isHeader: true, ifrsCode: 'R-02' },
  { code: '51', nameAr: 'تكلفة الإيرادات المباشرة (المكاتب الخارجية والتأشيرات والطيران)', nameEn: 'Direct Cost of Revenues', category: 'مصروفات', nature: 'مدين', statementType: 'قائمة الدخل (أرباح وخسائر)', level: 2, parentCode: '5', balance: 1150000, openingBalance: 0, currentDebit: 1150000, currentCredit: 0, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'R-02' },
  { code: '52', nameAr: 'رواتب وأجور الموظفين والكادر الإداري', nameEn: 'Salaries, Wages & Benefits', category: 'مصروفات', nature: 'مدين', statementType: 'قائمة الدخل (أرباح وخسائر)', level: 2, parentCode: '5', balance: 640000, openingBalance: 0, currentDebit: 640000, currentCredit: 0, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'R-04' },
  { code: '53', nameAr: 'مصروفات تشغيل مراكز الإيواء والإعاشة والفحص الطبي', nameEn: 'Shelter Operations & Catering Expenses', category: 'مصروفات', nature: 'مدين', statementType: 'قائمة الدخل (أرباح وخسائر)', level: 2, parentCode: '5', balance: 210000, openingBalance: 0, currentDebit: 210000, currentCredit: 0, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'R-02' },
  { code: '54', nameAr: 'إيجارات مقرات الفروع والخدمات والتسويق', nameEn: 'Rent, Utilities & Marketing Expenses', category: 'مصروفات', nature: 'مدين', statementType: 'قائمة الدخل (أرباح وخسائر)', level: 2, parentCode: '5', balance: 160000, openingBalance: 0, currentDebit: 160000, currentCredit: 0, currency: 'SAR', isActive: true, isHeader: false, ifrsCode: 'R-03' },
];

const STORAGE_KEY_PREFIX = 'ALSULAIM_COA_V3_';
const CUSTOM_FIELDS_KEY_PREFIX = 'ALSULAIM_COA_FIELDS_V1_';

export const chartOfAccountsService = {
  /**
   * Get all accounts for a specific company or entire group
   */
  getAccountsByCompany(companyId: CompanyId): AccountItem[] {
    const norm = normalizeCompanyId(companyId);
    const key = `${STORAGE_KEY_PREFIX}${norm}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      // fallback
    }

    // Seed default SMACC chart
    const seeded: AccountItem[] = STANDARD_SMACC_COA.map((item, idx) => ({
      ...item,
      id: `${norm.toLowerCase()}-${item.code}-${idx}`,
      companyId: norm === 'all' ? 'SAF' : norm,
    }));
    try {
      localStorage.setItem(key, JSON.stringify(seeded));
    } catch (e) {
      // ignore
    }
    return seeded;
  },

  /**
   * Save entire account list for a company
   */
  saveAccountsForCompany(companyId: CompanyId, accounts: AccountItem[]): void {
    const norm = normalizeCompanyId(companyId);
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${norm}`, JSON.stringify(accounts));
    } catch (e) {
      // ignore
    }
  },

  /**
   * Get custom field definitions for Assets and expandable sections
   */
  getCustomFieldDefinitions(companyId: CompanyId): CustomFieldDefinition[] {
    const norm = normalizeCompanyId(companyId);
    try {
      const raw = localStorage.getItem(`${CUSTOM_FIELDS_KEY_PREFIX}${norm}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore
    }
    return DEFAULT_CUSTOM_ASSET_FIELDS;
  },

  /**
   * Save custom field definitions
   */
  saveCustomFieldDefinitions(companyId: CompanyId, defs: CustomFieldDefinition[]): void {
    const norm = normalizeCompanyId(companyId);
    try {
      localStorage.setItem(`${CUSTOM_FIELDS_KEY_PREFIX}${norm}`, JSON.stringify(defs));
    } catch (e) {
      // ignore
    }
  },

  /**
   * Build hierarchical tree node list from flat accounts
   */
  buildTree(accounts: AccountItem[]): AccountTreeNode[] {
    const map: Record<string, AccountTreeNode> = {};
    const roots: AccountTreeNode[] = [];

    accounts.forEach(acc => {
      map[acc.code] = { ...acc, children: [] };
    });

    accounts.forEach(acc => {
      const node = map[acc.code];
      if (acc.parentCode && map[acc.parentCode]) {
        map[acc.parentCode].children = map[acc.parentCode].children || [];
        map[acc.parentCode].children!.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  },

  /**
   * Add a new account node and persist to storage
   */
  addAccount(
    companyId: CompanyId,
    newAcc: Omit<AccountItem, 'id' | 'companyId' | 'currentDebit' | 'currentCredit' | 'balance'> & {
      currentDebit?: number;
      currentCredit?: number;
      balance?: number;
    }
  ): AccountItem {
    const norm = normalizeCompanyId(companyId);
    const current = this.getAccountsByCompany(companyId);

    if (current.some(a => a.code === newAcc.code)) {
      throw new Error(`كود الحساب (${newAcc.code}) مسجل مسبقاً في الدليل المحاسبي.`);
    }

    const opBal = Number(newAcc.openingBalance) || 0;
    const curDeb = Number(newAcc.currentDebit) || 0;
    const curCred = Number(newAcc.currentCredit) || 0;
    const computedBal =
      newAcc.balance !== undefined
        ? Number(newAcc.balance)
        : newAcc.nature === 'مدين'
        ? opBal + curDeb - curCred
        : opBal + curCred - curDeb;

    const created: AccountItem = {
      ...newAcc,
      id: `${norm.toLowerCase()}-${newAcc.code}-${Date.now()}`,
      companyId: norm === 'all' ? 'SAF' : norm,
      openingBalance: opBal,
      currentDebit: curDeb,
      currentCredit: curCred,
      balance: computedBal,
    };

    const updated = [...current, created].sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
    this.saveAccountsForCompany(companyId, updated);
    return created;
  },

  /**
   * Update an existing account
   */
  updateAccount(companyId: CompanyId, code: string, updates: Partial<AccountItem>): AccountItem {
    const current = this.getAccountsByCompany(companyId);
    const index = current.findIndex(a => a.code === code);
    if (index === -1) {
      throw new Error(`الحساب (${code}) غير موجود.`);
    }

    const existing = current[index];
    const next = { ...existing, ...updates };
    if (
      updates.openingBalance !== undefined ||
      updates.currentDebit !== undefined ||
      updates.currentCredit !== undefined
    ) {
      if (updates.balance === undefined) {
        const op = Number(next.openingBalance) || 0;
        const deb = Number(next.currentDebit) || 0;
        const cred = Number(next.currentCredit) || 0;
        next.balance = next.nature === 'مدين' ? op + deb - cred : op + cred - deb;
      }
    }

    current[index] = next;
    this.saveAccountsForCompany(companyId, current);
    return next;
  },

  /**
   * Delete account if it has no children
   */
  deleteAccount(companyId: CompanyId, code: string): boolean {
    const current = this.getAccountsByCompany(companyId);
    const hasChildren = current.some(a => a.parentCode === code);
    if (hasChildren) {
      return false;
    }

    const filtered = current.filter(a => a.code !== code);
    this.saveAccountsForCompany(companyId, filtered);
    return true;
  },

  /**
   * Find account by code
   */
  getAccountByCode(companyId: CompanyId, code: string): AccountItem | undefined {
    const accounts = this.getAccountsByCompany(companyId);
    return accounts.find(a => a.code === code);
  },
};
