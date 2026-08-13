import { CompanyId } from '../../types';
import { normalizeCompanyId } from '../../contexts/CompanyContext';

export interface AccountItem {
  id: string;
  companyId: CompanyId;
  code: string;
  nameAr: string;
  nameEn: string;
  category: 'أصول' | 'خصوم' | 'حقوق ملكية' | 'إيرادات' | 'مصروفات';
  subcategory?: string;
  parentCode?: string;
  balance: number;
  currency: string;
  isActive: boolean;
  isHeader?: boolean;
}

// Company-specific Chart of Accounts Mock Datasets
const DEFAULT_ACCOUNTS_MAP: Record<string, AccountItem[]> = {
  SAF: [
    { id: 'saf-1', companyId: 'SAF', code: '1', nameAr: 'الأصول (Assets)', nameEn: 'Assets', category: 'أصول', balance: 1450000.00, currency: 'SAR', isActive: true, isHeader: true },
    { id: 'saf-11', companyId: 'SAF', code: '11', nameAr: 'الأصول المتداولة', nameEn: 'Current Assets', category: 'أصول', parentCode: '1', balance: 950000.00, currency: 'SAR', isActive: true, isHeader: true },
    { id: 'saf-11010', companyId: 'SAF', code: '11010', nameAr: 'الصندوق الرئيسي - السفير الماسي', nameEn: 'Main Treasury - SAF', category: 'أصول', parentCode: '11', balance: 185000.00, currency: 'SAR', isActive: true },
    { id: 'saf-11020', companyId: 'SAF', code: '11020', nameAr: 'بنك الراجحي - الحساب التشغيلي [SAF]', nameEn: 'Al Rajhi Bank - SAF', category: 'أصول', parentCode: '11', balance: 420000.00, currency: 'SAR', isActive: true },
    { id: 'saf-11030', companyId: 'SAF', code: '11030', nameAr: 'حساب أمانات مساند (SAF Escrow)', nameEn: 'Musaned Escrow - SAF', category: 'أصول', parentCode: '11', balance: 345000.00, currency: 'SAR', isActive: true },
    { id: 'saf-2', companyId: 'SAF', code: '2', nameAr: 'الخصوم (Liabilities)', nameEn: 'Liabilities', category: 'خصوم', balance: 220000.00, currency: 'SAR', isActive: true, isHeader: true },
    { id: 'saf-21010', companyId: 'SAF', code: '21010', nameAr: 'دائنو عقود الاستقدام - السفير الماسي', nameEn: 'Recruitment Payables - SAF', category: 'خصوم', parentCode: '2', balance: 120000.00, currency: 'SAR', isActive: true },
    { id: 'saf-3', companyId: 'SAF', code: '3', nameAr: 'حقوق الملكية (Equity)', nameEn: 'Equity', category: 'حقوق ملكية', balance: 1230000.00, currency: 'SAR', isActive: true, isHeader: true },
    { id: 'saf-4', companyId: 'SAF', code: '4', nameAr: 'الإيرادات (Revenues)', nameEn: 'Revenues', category: 'إيرادات', balance: 8900000.00, currency: 'SAR', isActive: true, isHeader: true },
    { id: 'saf-41100', companyId: 'SAF', code: '41100', nameAr: 'إيرادات عقود استقدام مساند - السفير الماسي', nameEn: 'Musaned Recruitment Revenue - SAF', category: 'إيرادات', parentCode: '4', balance: 6400000.00, currency: 'SAR', isActive: true },
    { id: 'saf-41200', companyId: 'SAF', code: '41200', nameAr: 'إيرادات خدمات التأجير التشغيلي - السفير الماسي', nameEn: 'Rental Operations Revenue - SAF', category: 'إيرادات', parentCode: '4', balance: 2500000.00, currency: 'SAR', isActive: true },
    { id: 'saf-5', companyId: 'SAF', code: '5', nameAr: 'المصروفات (Expenses)', nameEn: 'Expenses', category: 'مصروفات', balance: 4100000.00, currency: 'SAR', isActive: true, isHeader: true },
    { id: 'saf-51100', companyId: 'SAF', code: '51100', nameAr: 'تكاليف المكاتب الخارجية والرسوم الحكومية [SAF]', nameEn: 'Foreign Office Costs - SAF', category: 'مصروفات', parentCode: '5', balance: 2800000.00, currency: 'SAR', isActive: true },
  ],
  YAQ: [
    { id: 'yaq-1', companyId: 'YAQ', code: '1', nameAr: 'الأصول (Assets)', nameEn: 'Assets', category: 'أصول', balance: 1100000.00, currency: 'SAR', isActive: true, isHeader: true },
    { id: 'yaq-11010', companyId: 'YAQ', code: '11010', nameAr: 'الصندوق الرئيسي - ياقوت نجد', nameEn: 'Main Treasury - YAQ', category: 'أصول', parentCode: '1', balance: 140000.00, currency: 'SAR', isActive: true },
    { id: 'yaq-11020', companyId: 'YAQ', code: '11020', nameAr: 'بنك الرياض - الحساب التشغيلي [YAQ]', nameEn: 'Riyad Bank - YAQ', category: 'أصول', parentCode: '1', balance: 510000.00, currency: 'SAR', isActive: true },
    { id: 'yaq-4', companyId: 'YAQ', code: '4', nameAr: 'الإيرادات (Revenues)', nameEn: 'Revenues', category: 'إيرادات', balance: 6700000.00, currency: 'SAR', isActive: true, isHeader: true },
    { id: 'yaq-41100', companyId: 'YAQ', code: '41100', nameAr: 'إيرادات عقود استقدام ياقوت نجد', nameEn: 'Recruitment Revenue - YAQ', category: 'إيرادات', parentCode: '4', balance: 4200000.00, currency: 'SAR', isActive: true },
  ],
  TOP: [
    { id: 'top-1', companyId: 'TOP', code: '1', nameAr: 'الأصول (Assets)', nameEn: 'Assets', category: 'أصول', balance: 1650000.00, currency: 'SAR', isActive: true, isHeader: true },
    { id: 'top-11010', companyId: 'TOP', code: '11010', nameAr: 'الصندوق الرئيسي - توباز للاستقدام', nameEn: 'Main Treasury - TOP', category: 'أصول', parentCode: '1', balance: 210000.00, currency: 'SAR', isActive: true },
    { id: 'top-11020', companyId: 'TOP', code: '11020', nameAr: 'البنك الأهلي السعودي - [TOP]', nameEn: 'SNB Bank - TOP', category: 'أصول', parentCode: '1', balance: 790000.00, currency: 'SAR', isActive: true },
    { id: 'top-4', companyId: 'TOP', code: '4', nameAr: 'الإيرادات (Revenues)', nameEn: 'Revenues', category: 'إيرادات', balance: 9800000.00, currency: 'SAR', isActive: true, isHeader: true },
  ],
  DAR: [
    { id: 'dar-1', companyId: 'DAR', code: '1', nameAr: 'الأصول (Assets)', nameEn: 'Assets', category: 'أصول', balance: 620000.00, currency: 'SAR', isActive: true, isHeader: true },
    { id: 'dar-11010', companyId: 'DAR', code: '11010', nameAr: 'الصندوق الرئيسي - دار الرواد', nameEn: 'Main Treasury - DAR', category: 'أصول', parentCode: '1', balance: 95000.00, currency: 'SAR', isActive: true },
    { id: 'dar-11020', companyId: 'DAR', code: '11020', nameAr: 'مصرف الإنماء - [DAR]', nameEn: 'Alinma Bank - DAR', category: 'أصول', parentCode: '1', balance: 310000.00, currency: 'SAR', isActive: true },
    { id: 'dar-4', companyId: 'DAR', code: '4', nameAr: 'الإيرادات (Revenues)', nameEn: 'Revenues', category: 'إيرادات', balance: 3100000.00, currency: 'SAR', isActive: true, isHeader: true },
  ],
};

export const chartOfAccountsService = {
  /**
   * Get complete independent Chart of Accounts for a specific company
   */
  getAccountsByCompany(companyId: CompanyId): AccountItem[] {
    const norm = normalizeCompanyId(companyId);
    if (norm === 'all') {
      // Group view aggregates all company accounts
      return Object.values(DEFAULT_ACCOUNTS_MAP).flat();
    }
    return DEFAULT_ACCOUNTS_MAP[norm] || DEFAULT_ACCOUNTS_MAP['SAF'];
  },

  /**
   * Add account to company chart of accounts
   */
  addAccount(companyId: CompanyId, newAccount: Omit<AccountItem, 'id' | 'companyId'>): AccountItem {
    const norm = normalizeCompanyId(companyId);
    const targetKey = norm === 'all' ? 'SAF' : norm;
    const account: AccountItem = {
      ...newAccount,
      id: `${targetKey.toLowerCase()}-${Date.now()}`,
      companyId: targetKey,
    };
    if (!DEFAULT_ACCOUNTS_MAP[targetKey]) {
      DEFAULT_ACCOUNTS_MAP[targetKey] = [];
    }
    DEFAULT_ACCOUNTS_MAP[targetKey].push(account);
    return account;
  },

  /**
   * Find account by code within company
   */
  getAccountByCode(companyId: CompanyId, code: string): AccountItem | undefined {
    const accounts = this.getAccountsByCompany(companyId);
    return accounts.find((a) => a.code === code);
  },
};
