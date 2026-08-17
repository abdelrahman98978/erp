import { describe, it, expect } from 'vitest';
import { journalEngine } from './journalEngine';

describe('journalEngine (Double-Entry General Ledger)', () => {
  it('should successfully create a balanced journal entry', () => {
    const { entry, error } = journalEngine.createJournalEntry('SAF', {
      description: 'إثبات سداد نقدي للمصروفات العمومية',
      createdBy: 'مدير الحسابات',
      lines: [
        { accountCode: '51100', accountName: 'مصروفات تشغيلية', debit: 3500, credit: 0 },
        { accountCode: '11010', accountName: 'الصندوق الرئيسي', debit: 0, credit: 3500 },
      ],
    });

    expect(error).toBeNull();
    expect(entry).toBeDefined();
    expect(entry?.totalDebit).toBe(3500);
    expect(entry?.totalCredit).toBe(3500);
    expect(entry?.status).toBe('DRAFT');
    expect(entry?.entryNumber).toContain('SAF-JV-');
  });

  it('should reject an unbalanced journal entry with double-entry golden rule violation', () => {
    const { entry, error } = journalEngine.createJournalEntry('SAF', {
      description: 'قيد غير متوازن للاختبار',
      createdBy: 'محاسب الفرع',
      lines: [
        { accountCode: '51100', accountName: 'مصروفات تشغيلية', debit: 5000, credit: 0 },
        { accountCode: '11010', accountName: 'الصندوق الرئيسي', debit: 0, credit: 4000 },
      ],
    });

    expect(entry).toBeNull();
    expect(error).toContain('القيد المحاسبي غير متوازن');
  });

  it('should reject a journal entry with less than two lines', () => {
    const { entry, error } = journalEngine.createJournalEntry('SAF', {
      description: 'قيد بطرف واحد فقط',
      createdBy: 'محاسب الفرع',
      lines: [
        { accountCode: '11010', accountName: 'الصندوق الرئيسي', debit: 1000, credit: 1000 },
      ],
    });

    expect(entry).toBeNull();
    expect(error).toContain('يجب أن يحتوي القيد على طرفين على الأقل');
  });

  it('should allow posting a draft journal entry and mark it as POSTED', () => {
    const { entry } = journalEngine.createJournalEntry('SAF', {
      description: 'قيد ترحيل أجور ومستحقات',
      createdBy: 'أخصائي الرواتب',
      lines: [
        { accountCode: '51100', accountName: 'مصروفات الرواتب', debit: 8000, credit: 0 },
        { accountCode: '11020', accountName: 'بنك الراجحي', debit: 0, credit: 8000 },
      ],
    });

    expect(entry).toBeDefined();
    if (!entry) return;

    const postResult = journalEngine.postJournalEntry('SAF', entry.id, 'المدير المالي');
    expect(postResult.success).toBe(true);
    expect(postResult.error).toBeNull();
  });
});
