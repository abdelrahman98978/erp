import { describe, it, expect, vi } from 'vitest';
import { 
  exportData, 
  sanitizeCSVField, 
  getActiveCompanyInfo, 
  generateExecutiveReportHtml,
  SECTION_CONFIGS 
} from './exportService';

describe('Executive Export Suite & Security Standards', () => {
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

  it('should generate executive HTML with ZATCA QR, KPIs, and official tripartite signatures', () => {
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
        branch: 'الفرع الرئيسي - الرياض'
      }
    ];

    const html = generateExecutiveReportHtml('contracts', sampleContracts, 'كشف عقود الاستقدام المعتمدة', true);
    
    // Validate core components
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('dir="rtl"');
    expect(html).toContain('س.ت:');
    expect(html).toContain('الرقم الضريبي:');
    expect(html).toContain('ZATCA & ERP COMPLIANT');
    expect(html).toContain('إجمالي السجلات');
    expect(html).toContain('SAF-RC-2026-0001');
    expect(html).toContain('أحمد محمد السديري');
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
});

