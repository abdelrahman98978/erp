import { describe, it, expect } from 'vitest';
import {
  exportData,
  sanitizeCSVField,
  getActiveCompanyInfo,
  generateExecutiveReportHtml,
  numberToArabicTafqeet,
  SECTION_CONFIGS,
} from './exportService';

describe('Executive Export Suite 4.0 & Security Standards', () => {
  it('should sanitize CSV fields to prevent formula injection attacks (=, +, -, @)', () => {
    expect(sanitizeCSVField('=SUM(A1:A10)')).toBe("'=SUM(A1:A10)");
    expect(sanitizeCSVField('+cmd|/c calc.exe')).toBe("'+cmd|/c calc.exe");
    expect(sanitizeCSVField('-100')).toBe("'-100");
    expect(sanitizeCSVField('@SUM(1,2)')).toBe("'@SUM(1,2)");
    expect(sanitizeCSVField('Normal Text')).toBe('Normal Text');
    expect(sanitizeCSVField(15000)).toBe('15000');
  });

  it('should safely handle empty data arrays without throwing errors', () => {
    expect(() => {
      exportData('test_empty', [], 'csv');
    }).not.toThrow();
  });

  it('should resolve active company info with corporate fallback', () => {
    const company = getActiveCompanyInfo();
    expect(company).toBeDefined();
    expect(company.nameAr).toBeDefined();
    expect(company.crNumber).toBeDefined();
    expect(company.taxNumber).toBeDefined();
  });

  it('should convert financial amounts into official Saudi Arabic Tafqeet', () => {
    const tafqeet = numberToArabicTafqeet(14500.5);
    expect(tafqeet).toContain('فقط وقدره');
    expect(tafqeet).toContain('أربعة عشر ألفاً وخمسمائة');
    expect(tafqeet).toContain('ريال سعودي');
    expect(tafqeet).toContain('لا غير');
  });

  it('should generate executive HTML with ZATCA QR, KPIs, Arabic Tafqeet, and official tripartite signatures', () => {
    const sampleContracts = [
      {
        contract_number: 'SAF-RC-2026-0001',
        musaned_number: 'MSN-998811',
        client_name: 'أحمد محمد السديري',
        client_phone: '0501234567',
        maid_name: 'Maria Santos',
        nationality: 'الفلبين',
        external_office: 'Manila Recruitment Agency',
        stage: 'سداد الرسوم وتفويض إنجاز',
        amount: 14500,
        branch: 'الفرع الرئيسي - الرياض',
      },
    ];

    const html = generateExecutiveReportHtml(
      'contracts',
      sampleContracts,
      'كشف عقود الاستقدام المعتمدة',
      true,
      {
        executiveNote: 'معتمد للصرف والمطابقة الربعية',
        showTafqeet: true,
        showSignatures: true,
        showQrCode: true,
      }
    );

    // Validate core components
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('dir="rtl"');
    expect(html).toContain('س.ت:');
    expect(html).toContain('الرقم الضريبي:');
    expect(html).toContain('ZATCA & ERP COMPLIANT');
    expect(html).toContain('إجمالي السجلات');
    expect(html).toContain('SAF-RC-2026-0001');
    expect(html).toContain('أحمد محمد السديري');
    expect(html).toContain('فقط وقدره');
    expect(html).toContain('معتمد للصرف والمطابقة الربعية');
    expect(html).toContain('إعداد الموظف المختص');
    expect(html).toContain('تدقيق الإدارة المالية');
    expect(html).toContain('اعتماد الإدارة والختم الرسمي');
    expect(html).toContain('SHA256:');
  });

  it('should verify that all new operational and financial sections are registered in SECTION_CONFIGS', () => {
    expect(SECTION_CONFIGS['branches']).toBeDefined();
    expect(SECTION_CONFIGS['branch_departments']).toBeDefined();
    expect(SECTION_CONFIGS['vouchers']).toBeDefined();
    expect(SECTION_CONFIGS['ingaz_delegations']).toBeDefined();
    expect(SECTION_CONFIGS['ats_candidates']).toBeDefined();
    expect(SECTION_CONFIGS['contracts']).toBeDefined();
  });

  it('should support and safely execute all 12 enterprise export formats (Excel, PDF, Word, Print, HTML, PNG, WPS, XML, CSV, TSV, JSON, Markdown)', () => {
    const sampleData = [
      { id: '1', name: 'فرع الرياض', city: 'الرياض', budget: 50000 },
      { id: '2', name: 'فرع الدمام', city: 'الدمام', budget: 35000 },
    ];

    const allFormats = [
      'excel',
      'pdf',
      'csv',
      'print',
      'json',
      'word',
      'xml',
      'html',
      'tsv',
      'markdown',
      'png',
      'wps',
    ] as const;

    allFormats.forEach((fmt) => {
      expect(() => {
        exportData('branches', sampleData, fmt, 'تقرير الفروع الإقليمية');
      }).not.toThrow();
    });
  });
});
