import { describe, it, expect, vi } from 'vitest';
import { exportData, sanitizeCSVField } from './exportService';

describe('exportService & CSV Injection Protection', () => {
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
});
