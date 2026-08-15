import { CompanyId } from '../../types';
import { journalEngine, JournalEntry } from './journalEngine';

export interface InvoicePostingParams {
  invoiceNumber: string;
  clientName: string;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  branchName: string;
  createdBy: string;
  escrowAccountCode?: string;
  revenueAccountCode?: string;
  vatAccountCode?: string;
}

export interface ReceiptPostingParams {
  receiptNumber: string;
  payerName: string;
  amount: number;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'POS' | 'CHECK';
  bankOrCashAccountCode: string;
  bankOrCashAccountName: string;
  branchName: string;
  createdBy: string;
}

export const accountingAutomationEngine = {
  /**
   * Automatically post an Issued Sales / Recruitment Invoice to the Company Ledger
   */
  postInvoiceToLedger(
    companyId: CompanyId,
    params: InvoicePostingParams
  ): { entry: JournalEntry | null; error: string | null } {
    const description = `إثبات فاتورة ضريبية # ${params.invoiceNumber} - العميل: ${params.clientName}`;

    const escrowCode = params.escrowAccountCode || '11030';
    const revenueCode = params.revenueAccountCode || '41100';
    const vatCode = params.vatAccountCode || '21050';

    return journalEngine.createJournalEntry(companyId, {
      entryType: 'AUTOMATIC',
      sourceModule: 'INVOICE',
      sourceReference: params.invoiceNumber,
      description,
      branchName: params.branchName,
      createdBy: params.createdBy,
      autoPost: true,
      lines: [
        {
          accountCode: escrowCode,
          accountName: 'حساب أمانات والذمم المدينة',
          debit: params.totalAmount,
          credit: 0,
        },
        {
          accountCode: revenueCode,
          accountName: 'إيرادات عقود الاستقدام والخدمات',
          debit: 0,
          credit: params.subtotal,
        },
        {
          accountCode: vatCode,
          accountName: 'ضريبة القيمة المضافة المستحقة (15%)',
          debit: 0,
          credit: params.vatAmount,
        },
      ],
    });
  },

  /**
   * Automatically post a Receipt Voucher to the Company Ledger
   */
  postReceiptToLedger(
    companyId: CompanyId,
    params: ReceiptPostingParams
  ): { entry: JournalEntry | null; error: string | null } {
    const description = `سند قبض # ${params.receiptNumber} - من: ${params.payerName} (${params.paymentMethod})`;

    return journalEngine.createJournalEntry(companyId, {
      entryType: 'AUTOMATIC',
      sourceModule: 'RECEIPT',
      sourceReference: params.receiptNumber,
      description,
      branchName: params.branchName,
      createdBy: params.createdBy,
      autoPost: true,
      lines: [
        {
          accountCode: params.bankOrCashAccountCode,
          accountName: params.bankOrCashAccountName,
          debit: params.amount,
          credit: 0,
        },
        {
          accountCode: '11030',
          accountName: 'حساب أمانات والذمم المدينة',
          debit: 0,
          credit: params.amount,
        },
      ],
    });
  },

  /**
   * Automatically post Musaned Escrow Release to Company Revenue after 90 days guarantee period
   */
  postMusanedEscrowReleaseToLedger(
    companyId: CompanyId,
    params: {
      contractNumber: string;
      clientName: string;
      workerName: string;
      amount: number;
      branchName: string;
      createdBy: string;
    }
  ): { entry: JournalEntry | null; error: string | null } {
    const description = `تسوية وتحرير أمانات مساند بعد انتهاء فترة الضمان (90 يوم) - عقد #${params.contractNumber} - العامل/ة: ${params.workerName}`;

    return journalEngine.createJournalEntry(companyId, {
      entryType: 'AUTOMATIC',
      sourceModule: 'MUSANED_ESCROW',
      sourceReference: params.contractNumber,
      description,
      branchName: params.branchName,
      createdBy: params.createdBy,
      autoPost: true,
      lines: [
        {
          accountCode: '21060',
          accountName: 'أمانات مساند المعلقة (90 يوماً)',
          debit: params.amount,
          credit: 0,
        },
        {
          accountCode: '41100',
          accountName: 'إيرادات عقود الاستقدام المحققة',
          debit: 0,
          credit: params.amount,
        },
      ],
    });
  },

  /**
   * Automatically post Monthly Payroll to Ledger (WPS Compliant)
   */
  postPayrollToLedger(
    companyId: CompanyId,
    params: {
      monthYear: string;
      totalBasicSalaries: number;
      totalAllowances: number;
      totalDeductions: number;
      netPayable: number;
      bankAccountCode: string;
      branchName: string;
      createdBy: string;
    }
  ): { entry: JournalEntry | null; error: string | null } {
    const description = `مسير الرواتب الشهري المعتمد لبرنامج حماية الأجور (WPS) - شهر: ${params.monthYear}`;

    return journalEngine.createJournalEntry(companyId, {
      entryType: 'AUTOMATIC',
      sourceModule: 'PAYROLL',
      sourceReference: `WPS-${params.monthYear}`,
      description,
      branchName: params.branchName,
      createdBy: params.createdBy,
      autoPost: true,
      lines: [
        {
          accountCode: '51010',
          accountName: 'مصروف رواتب وأجور الموظفين',
          debit: params.totalBasicSalaries + params.totalAllowances,
          credit: 0,
        },
        {
          accountCode: '21040',
          accountName: 'استقطاعات وتأمينات مستحقة',
          debit: 0,
          credit: params.totalDeductions,
        },
        {
          accountCode: params.bankAccountCode || '11020',
          accountName: 'بنك الراجحي - الحساب التشغيلي الرئيسي',
          debit: 0,
          credit: params.netPayable,
        },
      ],
    });
  },
};

