import { CompanyId } from '../../types';
import { normalizeCompanyId } from '../../contexts/CompanyContext';

export type JournalEntryType =
  | 'MANUAL'
  | 'AUTOMATIC'
  | 'RECURRING'
  | 'ACCRUAL'
  | 'ADJUSTMENT'
  | 'CLOSING'
  | 'REVERSAL';

export type JournalStatus = 'DRAFT' | 'POSTED' | 'REVERSED' | 'CANCELLED';

export interface JournalLine {
  id: string;
  accountCode: string;
  accountName: string;
  description?: string;
  debit: number;
  credit: number;
  costCenterCode?: string;
  projectId?: string;
}

export interface JournalEntry {
  id: string;
  companyId: CompanyId;
  entryNumber: string; // e.g. SAF-JV-2026-0001
  entryDate: string;
  entryType: JournalEntryType;
  sourceModule: string;
  sourceReference?: string;
  description: string;
  totalDebit: number;
  totalCredit: number;
  status: JournalStatus;
  branchName: string;
  costCenterCode?: string;
  projectId?: string;
  createdBy: string;
  approvedBy?: string;
  postedAt?: string;
  lines: JournalLine[];
  createdAt: string;
}

// In-Memory Journal Repository per Company
const COMPANY_JOURNALS_MAP: Record<string, JournalEntry[]> = {
  SAF: [
    {
      id: 'JV-SAF-001',
      companyId: 'SAF',
      entryNumber: 'SAF-JV-2026-0001',
      entryDate: new Date().toISOString().split('T')[0],
      entryType: 'AUTOMATIC',
      sourceModule: 'INVOICE',
      sourceReference: 'SAF-INV-2026-0014',
      description: 'إثبات قيد فاتورة استقدام مساند - السفير الماسي / العميل أبو إياد',
      totalDebit: 1150.0,
      totalCredit: 1150.0,
      status: 'POSTED',
      branchName: 'فرع الرياض',
      createdBy: 'النظام المحاسبي التلقائي',
      approvedBy: 'مدير الحسابات - السفير الماسي',
      postedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      lines: [
        { id: 'l1', accountCode: '11030', accountName: 'حساب أمانات مساند (SAF Escrow)', debit: 1150.0, credit: 0.0 },
        { id: 'l2', accountCode: '41100', accountName: 'إيرادات عقود استقدام مساند - السفير الماسي', debit: 0.0, credit: 1000.0 },
        { id: 'l3', accountCode: '21050', accountName: 'ضريبة القيمة المضافة المستحقة (15%)', debit: 0.0, credit: 150.0 },
      ],
    },
  ],
  YAQ: [
    {
      id: 'JV-YAQ-001',
      companyId: 'YAQ',
      entryNumber: 'YAQ-JV-2026-0001',
      entryDate: new Date().toISOString().split('T')[0],
      entryType: 'AUTOMATIC',
      sourceModule: 'RECEIPT',
      sourceReference: 'YAQ-REC-2026-0005',
      description: 'سند قبض عقد تأجير عمالة - شركة ياقوت نجد / بنك الرياض',
      totalDebit: 3450.0,
      totalCredit: 3450.0,
      status: 'POSTED',
      branchName: 'فرع جدة الرئيسي',
      createdBy: 'النظام المحاسبي التلقائي',
      approvedBy: 'محاسب ياقوت نجد',
      postedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      lines: [
        { id: 'yl1', accountCode: '11020', accountName: 'بنك الرياض - الحساب التشغيلي [YAQ]', debit: 3450.0, credit: 0.0 },
        { id: 'yl2', accountCode: '41100', accountName: 'إيرادات عقود استقدام ياقوت نجد', debit: 0.0, credit: 3000.0 },
        { id: 'yl3', accountCode: '21050', accountName: 'ضريبة القيمة المضافة المستحقة (15%)', debit: 0.0, credit: 450.0 },
      ],
    },
  ],
  TOP: [],
  DAR: [],
};

const SEQUENCE_COUNTERS: Record<string, number> = {
  SAF: 2,
  YAQ: 2,
  TOP: 1,
  DAR: 1,
};

export const journalEngine = {
  /**
   * Get all journal entries for a company
   */
  getJournalsByCompany(companyId: CompanyId): JournalEntry[] {
    const norm = normalizeCompanyId(companyId);
    if (norm === 'all') {
      return Object.values(COMPANY_JOURNALS_MAP).flat();
    }
    return COMPANY_JOURNALS_MAP[norm] || [];
  },

  /**
   * Generate next sequential entry number for company (e.g. SAF-JV-2026-0002)
   */
  generateEntryNumber(companyId: CompanyId): string {
    const norm = normalizeCompanyId(companyId);
    const prefix = norm === 'all' ? 'SAF' : norm;
    const currentYear = new Date().getFullYear();
    const nextSeq = SEQUENCE_COUNTERS[prefix] || 1;
    SEQUENCE_COUNTERS[prefix] = nextSeq + 1;
    return `${prefix}-JV-${currentYear}-${String(nextSeq).padStart(4, '0')}`;
  },

  /**
   * Create a double-entry journal entry with strict Debit == Credit validation
   */
  createJournalEntry(
    companyId: CompanyId,
    params: {
      entryDate?: string;
      entryType?: JournalEntryType;
      sourceModule?: string;
      sourceReference?: string;
      description: string;
      branchName?: string;
      costCenterCode?: string;
      projectId?: string;
      createdBy: string;
      lines: Omit<JournalLine, 'id'>[];
      autoPost?: boolean;
    }
  ): { entry: JournalEntry | null; error: string | null } {
    const norm = normalizeCompanyId(companyId);
    const targetCompany = norm === 'all' ? 'SAF' : norm;

    // Calculate totals
    const totalDebit = params.lines.reduce((sum, l) => sum + (l.debit || 0), 0);
    const totalCredit = params.lines.reduce((sum, l) => sum + (l.credit || 0), 0);

    // Double Entry Golden Rule Validation
    if (Math.abs(totalDebit - totalCredit) > 0.001) {
      return {
        entry: null,
        error: `[Double Entry Error] القيد المحاسبي غير متوازن! إجمالي المدين (${totalDebit.toFixed(2)}) لا يساوي إجمالي الدائن (${totalCredit.toFixed(2)}).`,
      };
    }

    if (params.lines.length < 2) {
      return {
        entry: null,
        error: '[Double Entry Error] يجب أن يحتوي القيد على طرفين على الأقل (طرف مدين وطرف دائن).',
      };
    }

    const entryNumber = this.generateEntryNumber(targetCompany);
    const isPosted = params.autoPost ?? false;

    const newEntry: JournalEntry = {
      id: `jv-${targetCompany.toLowerCase()}-${Date.now()}`,
      companyId: targetCompany,
      entryNumber,
      entryDate: params.entryDate || new Date().toISOString().split('T')[0],
      entryType: params.entryType || 'MANUAL',
      sourceModule: params.sourceModule || 'GENERAL_LEDGER',
      sourceReference: params.sourceReference,
      description: params.description,
      totalDebit,
      totalCredit,
      status: isPosted ? 'POSTED' : 'DRAFT',
      branchName: params.branchName || 'الفرع الرئيسي',
      costCenterCode: params.costCenterCode,
      projectId: params.projectId,
      createdBy: params.createdBy,
      postedAt: isPosted ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      lines: params.lines.map((l, index) => ({
        ...l,
        id: `jl-${index}-${Date.now()}`,
      })),
    };

    if (!COMPANY_JOURNALS_MAP[targetCompany]) {
      COMPANY_JOURNALS_MAP[targetCompany] = [];
    }

    COMPANY_JOURNALS_MAP[targetCompany].unshift(newEntry);
    return { entry: newEntry, error: null };
  },

  /**
   * Post a draft journal entry (Irreversible without Reversal entry)
   */
  postJournalEntry(companyId: CompanyId, entryId: string, approvedBy: string): { success: boolean; error: string | null } {
    const journals = this.getJournalsByCompany(companyId);
    const entry = journals.find((j) => j.id === entryId);

    if (!entry) {
      return { success: false, error: 'القيد المحاسبي غير موجود.' };
    }

    if (entry.status === 'POSTED') {
      return { success: false, error: 'القيد مرحّل بالفعل ولا يمكن إعادة ترحيله.' };
    }

    entry.status = 'POSTED';
    entry.approvedBy = approvedBy;
    entry.postedAt = new Date().toISOString();

    return { success: true, error: null };
  },
};
