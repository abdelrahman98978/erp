import { describe, it, expect } from 'vitest';
import { chartOfAccountsService } from './chartOfAccountsService';

describe('chartOfAccountsService (Multi-Company Accounting Tree)', () => {
  it('should load chart of accounts for each specific company', () => {
    const safAccounts = chartOfAccountsService.getAccountsByCompany('SAF');
    expect(safAccounts.length).toBeGreaterThan(0);
    expect(safAccounts[0].companyId).toBe('SAF');

    const yaqAccounts = chartOfAccountsService.getAccountsByCompany('YAQ');
    expect(yaqAccounts.length).toBeGreaterThan(0);
    expect(yaqAccounts[0].companyId).toBe('YAQ');
  });

  it('should find specific account by code within company scope', () => {
    const cashAccount = chartOfAccountsService.getAccountByCode('SAF', '110101');
    expect(cashAccount).toBeDefined();
    expect(cashAccount?.code).toBe('110101');
    expect(cashAccount?.nameAr).toContain('الصندوق الرئيسي');
  });

  it('should successfully add new account to company chart of accounts', () => {
    const created = chartOfAccountsService.addAccount('SAF', {
      code: '110999',
      nameAr: 'حساب تجريبي جديد',
      nameEn: 'New Test Account',
      category: 'أصول',
      nature: 'مدين',
      statementType: 'قائمة المركز المالي (ميزانية)',
      level: 4,
      openingBalance: 50000,
      currency: 'SAR',
      isActive: true,
    });

    expect(created.id).toBeDefined();
    expect(created.code).toBe('110999');

    const found = chartOfAccountsService.getAccountByCode('SAF', '110999');
    expect(found).toBeDefined();
    expect(found?.nameAr).toBe('حساب تجريبي جديد');
  });

  it('should build a hierarchical tree structure', () => {
    const accounts = chartOfAccountsService.getAccountsByCompany('SAF');
    const tree = chartOfAccountsService.buildTree(accounts);
    expect(tree.length).toBeGreaterThan(0);
    expect(tree[0].children).toBeDefined();
  });
});
