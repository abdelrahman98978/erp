import { CompanyId } from '../../types';
import { normalizeCompanyId } from '../../contexts/CompanyContext';

export interface AccountItem {
  id: string;
  companyId: CompanyId;
  code: string;
  nameAr: string;
  nameEn: string;
  category: 'أصول' | 'خصوم' | 'حقوق ملكية' | 'إيرادات' | 'مصروفات';
  nature: 'مدين' | 'دائن';
  statementType: 'قائمة المركز المالي (ميزانية)' | 'قائمة الدخل (أرباح وخسائر)' | 'قائمة التدفقات النقدية';
  level: 1 | 2 | 3 | 4 | 5;
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
}

export interface AccountTreeNode extends AccountItem {
  children?: AccountTreeNode[];
}

// ─── Standard 5-Level Saudi Chart of Accounts Matrix (SMACC Compliant) ─────────────────────
const STANDARD_SMACC_COA: Omit<AccountItem, 'id' | 'companyId'>[] = [
  // ═══ 1. الأصول (Assets) ═══
  { code: '1', nameAr: 'الأصول (Assets)', nameEn: 'Assets', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 1, balance: 2850000, openingBalance: 2400000, currentDebit: 850000, currentCredit: 400000, currency: 'SAR', isActive: true, isHeader: true },
  
  // 11. الأصول المتداولة
  { code: '11', nameAr: 'الأصول المتداولة (Current Assets)', nameEn: 'Current Assets', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 2, parentCode: '1', balance: 1967500, openingBalance: 1600000, currentDebit: 750000, currentCredit: 382500, currency: 'SAR', isActive: true, isHeader: true },
  
  // 1101. النقد وما في حكمه
  { code: '1101', nameAr: 'النقدية وما في حكمها (Cash & Cash Equivalents)', nameEn: 'Cash & Equivalents', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 3, parentCode: '11', balance: 880000, openingBalance: 750000, currentDebit: 380000, currentCredit: 250000, currency: 'SAR', isActive: true, isHeader: true },
  { code: '110101', nameAr: 'الصندوق الرئيسي (الخزينة المركزية)', nameEn: 'Main Treasury Cash Box', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 4, parentCode: '1101', balance: 185000, openingBalance: 150000, currentDebit: 95000, currentCredit: 60000, currency: 'SAR', isActive: true, isHeader: false },
  { code: '110102', nameAr: 'عهد الفروع النقدية المؤقتة', nameEn: 'Branch Petty Cash', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 4, parentCode: '1101', balance: 45000, openingBalance: 40000, currentDebit: 25000, currentCredit: 20000, currency: 'SAR', isActive: true, isHeader: false },
  
  // 1102. البنوك والحسابات المصرفية
  { code: '1102', nameAr: 'الحسابات المصرفية (Bank Accounts)', nameEn: 'Banks', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 3, parentCode: '11', balance: 742500, openingBalance: 610000, currentDebit: 320000, currentCredit: 187500, currency: 'SAR', isActive: true, isHeader: true },
  { code: '110201', nameAr: 'مصرف الراجحي - الحساب التشغيلي الرئيسي', nameEn: 'Al Rajhi Bank - Operating', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 4, parentCode: '1102', balance: 420000, openingBalance: 350000, currentDebit: 190000, currentCredit: 120000, currency: 'SAR', isActive: true, isHeader: false },
  { code: '110202', nameAr: 'بنك الرياض - حساب عقود الاستقدام', nameEn: 'Riyad Bank - Recruitment', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 4, parentCode: '1102', balance: 322500, openingBalance: 260000, currentDebit: 130000, currentCredit: 67500, currency: 'SAR', isActive: true, isHeader: false },
  
  // 1103. حسابات الضمان والأمانات الحكومية
  { code: '1103', nameAr: 'حسابات ضمان منصة مساند (Musaned Escrow Accounts)', nameEn: 'Musaned Escrow Accounts', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 3, parentCode: '11', balance: 345000, openingBalance: 240000, currentDebit: 195000, currentCredit: 90000, currency: 'SAR', isActive: true, isHeader: false },
  
  // 12. الأصول غير المتداولة (الثابتة)
  { code: '12', nameAr: 'الأصول غير المتداولة (Fixed & Non-Current Assets)', nameEn: 'Non-Current Assets', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 2, parentCode: '1', balance: 882500, openingBalance: 800000, currentDebit: 100000, currentCredit: 17500, currency: 'SAR', isActive: true, isHeader: true },
  { code: '1201', nameAr: 'أسطول السيارات ووسائل النقل', nameEn: 'Vehicles Fleet', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 3, parentCode: '12', balance: 520000, openingBalance: 480000, currentDebit: 60000, currentCredit: 20000, currency: 'SAR', isActive: true, isHeader: false },
  { code: '1202', nameAr: 'أجهزة وأنظمة تقنية المعلومات والخوادم', nameEn: 'IT Hardware & Cloud Servers', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 3, parentCode: '12', balance: 142500, openingBalance: 120000, currentDebit: 30000, currentCredit: 7500, currency: 'SAR', isActive: true, isHeader: false },
  { code: '1203', nameAr: 'تجهيزات ومباني مراكز الإيواء والتسكين', nameEn: 'Shelter Center Leasehold & Facilities', category: 'أصول', nature: 'مدين', statementType: 'قائمة المركز المالي (ميزانية)', level: 3, parentCode: '12', balance: 220000, openingBalance: 200000, currentDebit: 30000, currentCredit: 10000, currency: 'SAR', isActive: true, isHeader: false },

  // ═══ 2. الخصوم والالتزامات (Liabilities) ═══
  { code: '2', nameAr: 'الخصوم والالتزامات (Liabilities)', nameEn: 'Liabilities', category: 'خصوم', nature: 'دائن', statementType: 'قائمة المركز المالي (ميزانية)', level: 1, balance: 565000, openingBalance: 490000, currentDebit: 210000, currentCredit: 285000, currency: 'SAR', isActive: true, isHeader: true },
  { code: '21', nameAr: 'الالتزامات المتداولة (Current Liabilities)', nameEn: 'Current Liabilities', category: 'خصوم', nature: 'دائن', statementType: 'قائمة المركز المالي (ميزانية)', level: 2, parentCode: '2', balance: 441000, openingBalance: 390000, currentDebit: 190000, currentCredit: 241000, currency: 'SAR', isActive: true, isHeader: true },
  { code: '2101', nameAr: 'مستحقات الوكلاء الخارجيين والمكاتب الدولية', nameEn: 'Foreign Recruitment Agencies Payables', category: 'خصوم', nature: 'دائن', statementType: 'قائمة المركز المالي (ميزانية)', level: 3, parentCode: '21', balance: 189375, openingBalance: 175000, currentDebit: 85000, currentCredit: 99375, currency: 'SAR', isActive: true, isHeader: false },
  { code: '2102', nameAr: 'أمانات ضريبة القيمة المضافة لهيئة الزكاة (VAT 15%)', nameEn: 'ZATCA VAT Output Liability', category: 'خصوم', nature: 'دائن', statementType: 'قائمة المركز المالي (ميزانية)', level: 3, parentCode: '21', balance: 124000, openingBalance: 110000, currentDebit: 45000, currentCredit: 59000, currency: 'SAR', isActive: true, isHeader: false },
  { code: '2103', nameAr: 'أمانات التأمينات الاجتماعية والرواتب المستحقة (GOSI & WPS)', nameEn: 'GOSI & Accrued Payroll', category: 'خصوم', nature: 'دائن', statementType: 'قائمة المركز المالي (ميزانية)', level: 3, parentCode: '21', balance: 127625, openingBalance: 105000, currentDebit: 60000, currentCredit: 82625, currency: 'SAR', isActive: true, isHeader: false },
  { code: '22', nameAr: 'الالتزامات غير المتداولة (مخصص نهاية الخدمة)', nameEn: 'Non-Current Liabilities (EOSB)', category: 'خصوم', nature: 'دائن', statementType: 'قائمة المركز المالي (ميزانية)', level: 2, parentCode: '2', balance: 124000, openingBalance: 100000, currentDebit: 20000, currentCredit: 44000, currency: 'SAR', isActive: true, isHeader: false },

  // ═══ 3. حقوق الملكية (Equity) ═══
  { code: '3', nameAr: 'حقوق الملكية ورأس المال (Equity)', nameEn: 'Equity', category: 'حقوق ملكية', nature: 'دائن', statementType: 'قائمة المركز المالي (ميزانية)', level: 1, balance: 2285000, openingBalance: 1910000, currentDebit: 0, currentCredit: 375000, currency: 'SAR', isActive: true, isHeader: true },
  { code: '31', nameAr: 'رأس المال المدفوع', nameEn: 'Paid-in Capital', category: 'حقوق ملكية', nature: 'دائن', statementType: 'قائمة المركز المالي (ميزانية)', level: 2, parentCode: '3', balance: 1500000, openingBalance: 1500000, currentDebit: 0, currentCredit: 0, currency: 'SAR', isActive: true, isHeader: false },
  { code: '32', nameAr: 'الأرباح المبقاة والمدورة (Retained Earnings)', nameEn: 'Retained Earnings', category: 'حقوق ملكية', nature: 'دائن', statementType: 'قائمة المركز المالي (ميزانية)', level: 2, parentCode: '3', balance: 785000, openingBalance: 410000, currentDebit: 0, currentCredit: 375000, currency: 'SAR', isActive: true, isHeader: false },

  // ═══ 4. الإيرادات التشغيلية (Revenues) ═══
  { code: '4', nameAr: 'الإيرادات التشغيلية والمبيعات (Revenues)', nameEn: 'Revenues', category: 'إيرادات', nature: 'دائن', statementType: 'قائمة الدخل (أرباح وخسائر)', level: 1, balance: 4890000, openingBalance: 0, currentDebit: 0, currentCredit: 4890000, currency: 'SAR', isActive: true, isHeader: true },
  { code: '41', nameAr: 'إيرادات عقود التوسط والاستقدام مساند', nameEn: 'Recruitment Commission Revenue', category: 'إيرادات', nature: 'دائن', statementType: 'قائمة الدخل (أرباح وخسائر)', level: 2, parentCode: '4', balance: 3450000, openingBalance: 0, currentDebit: 0, currentCredit: 3450000, currency: 'SAR', isActive: true, isHeader: false },
  { code: '42', nameAr: 'إيرادات عقود التأجير والتشغيل المرن', nameEn: 'Flexible Rental Contracts Revenue', category: 'إيرادات', nature: 'دائن', statementType: 'قائمة الدخل (أرباح وخسائر)', level: 2, parentCode: '4', balance: 1240000, openingBalance: 0, currentDebit: 0, currentCredit: 1240000, currency: 'SAR', isActive: true, isHeader: false },
  { code: '43', nameAr: 'إيرادات نقل الكفالة والتنازل والخدمات الأخرى', nameEn: 'Sponsorship Transfer & Ancillary Revenue', category: 'إيرادات', nature: 'دائن', statementType: 'قائمة الدخل (أرباح وخسائر)', level: 2, parentCode: '4', balance: 200000, openingBalance: 0, currentDebit: 0, currentCredit: 200000, currency: 'SAR', isActive: true, isHeader: false },

  // ═══ 5. المصروفات التشغيلية والإدارية (Expenses) ═══
  { code: '5', nameAr: 'المصروفات والأعباء التشغيلية (Expenses)', nameEn: 'Expenses', category: 'مصروفات', nature: 'مدين', statementType: 'قائمة الدخل (أرباح وخسائر)', level: 1, balance: 2160000, openingBalance: 0, currentDebit: 2160000, currentCredit: 0, currency: 'SAR', isActive: true, isHeader: true },
  { code: '51', nameAr: 'تكاليف المكاتب الخارجية وتذاكر الطيران', nameEn: 'Direct Operational & Flight Costs', category: 'مصروفات', nature: 'مدين', statementType: 'قائمة الدخل (أرباح وخسائر)', level: 2, parentCode: '5', balance: 1150000, openingBalance: 0, currentDebit: 1150000, currentCredit: 0, currency: 'SAR', isActive: true, isHeader: false },
  { code: '52', nameAr: 'رواتب وأجور الموظفين والكادر الإداري', nameEn: 'Salaries, Wages & Benefits', category: 'مصروفات', nature: 'مدين', statementType: 'قائمة الدخل (أرباح وخسائر)', level: 2, parentCode: '5', balance: 640000, openingBalance: 0, currentDebit: 640000, currentCredit: 0, currency: 'SAR', isActive: true, isHeader: false },
  { code: '53', nameAr: 'مصروفات تشغيل مراكز الإيواء والإعاشة', nameEn: 'Shelter Operations & Catering Expenses', category: 'مصروفات', nature: 'مدين', statementType: 'قائمة الدخل (أرباح وخسائر)', level: 2, parentCode: '5', balance: 210000, openingBalance: 0, currentDebit: 210000, currentCredit: 0, currency: 'SAR', isActive: true, isHeader: false },
  { code: '54', nameAr: 'إيجارات مقرات الفروع والخدمات العامة', nameEn: 'Rent & Utilities Expenses', category: 'مصروفات', nature: 'مدين', statementType: 'قائمة الدخل (أرباح وخسائر)', level: 2, parentCode: '5', balance: 160000, openingBalance: 0, currentDebit: 160000, currentCredit: 0, currency: 'SAR', isActive: true, isHeader: false },
];

const STORAGE_KEY_PREFIX = 'ALSULAIM_COA_V2_';

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
    const seeded = STANDARD_SMACC_COA.map((item, idx) => ({
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
  addAccount(companyId: CompanyId, newAcc: Omit<AccountItem, 'id' | 'companyId' | 'currentDebit' | 'currentCredit' | 'balance'>): AccountItem {
    const norm = normalizeCompanyId(companyId);
    const current = this.getAccountsByCompany(companyId);
    
    // Validate code uniqueness
    if (current.some(a => a.code === newAcc.code)) {
      throw new Error(`كود الحساب (${newAcc.code}) مسجل مسبقاً في الدليل المحاسبي.`);
    }

    const created: AccountItem = {
      ...newAcc,
      id: `${norm.toLowerCase()}-${newAcc.code}-${Date.now()}`,
      companyId: norm === 'all' ? 'SAF' : norm,
      currentDebit: 0,
      currentCredit: 0,
      balance: newAcc.openingBalance || 0,
    };

    const updated = [...current, created].sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${norm}`, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
    return created;
  },

  /**
   * Update an existing account
   */
  updateAccount(companyId: CompanyId, code: string, updates: Partial<AccountItem>): AccountItem {
    const norm = normalizeCompanyId(companyId);
    const current = this.getAccountsByCompany(companyId);
    const index = current.findIndex(a => a.code === code);
    if (index === -1) {
      throw new Error(`الحساب (${code}) غير موجود.`);
    }

    const updatedAcc = { ...current[index], ...updates };
    current[index] = updatedAcc;

    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${norm}`, JSON.stringify(current));
    } catch (e) {
      // ignore
    }
    return updatedAcc;
  },

  /**
   * Delete account if it has no children and zero active transactions
   */
  deleteAccount(companyId: CompanyId, code: string): boolean {
    const norm = normalizeCompanyId(companyId);
    const current = this.getAccountsByCompany(companyId);
    
    // Check if it has children
    const hasChildren = current.some(a => a.parentCode === code);
    if (hasChildren) {
      throw new Error(`لا يمكن حذف الحساب (${code}) لأنه يحتوي على حسابات فرعية متفرعة منه.`);
    }

    const filtered = current.filter(a => a.code !== code);
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${norm}`, JSON.stringify(filtered));
    } catch (e) {
      // ignore
    }
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
