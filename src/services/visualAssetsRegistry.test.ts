import { describe, it, expect } from 'vitest';
import {
  resolveAvatarArchetype,
  resolveIllustrationForTab,
  resolveIllustrationForPortal,
  getIllustrationMetadata,
  BUSINESS_ILLUSTRATION_METADATA,
} from './visualAssetsRegistry';

describe('visualAssetsRegistry — Corporate Avatars & Business Illustrations Engine', () => {
  it('resolves AI personas Faris and Noura accurately', () => {
    expect(resolveAvatarArchetype({ name: 'فارس', role: 'المستشار التنفيذي' })).toBe('ai-faris');
    expect(resolveAvatarArchetype({ name: 'نُورة', role: 'المستشارة المؤسسية' })).toBe('ai-noura');
  });

  it('resolves Saudi Executive, CFO, Engineer, and Female Specialist archetypes', () => {
    expect(
      resolveAvatarArchetype({
        name: 'خالد السليم',
        email: 'admin@alsulaim.com',
        role: 'executive',
        departmentId: 'executive',
      })
    ).toBe('saudi-executive');

    expect(
      resolveAvatarArchetype({
        name: 'فهد المحاسبي',
        email: 'accounting@saf-rec.sa',
        departmentId: 'finance',
      })
    ).toBe('finance-cfo');

    expect(
      resolveAvatarArchetype({
        name: 'م. سلطان الحربي',
        departmentId: 'tenders',
      })
    ).toBe('tenders-engineer');

    expect(
      resolveAvatarArchetype({
        name: 'نورة القحطاني',
        email: 'shelter@dar.sa',
        departmentId: 'shelter',
      })
    ).toBe('saudi-female-specialist');
  });

  it('resolves candidate archetypes (nurse, chef, driver, maid)', () => {
    expect(resolveAvatarArchetype({ name: 'Grace', role: 'ممرضة ورعاية كبار السن' })).toBe('candidate-nurse');
    expect(resolveAvatarArchetype({ name: 'Siti', role: 'طباخة ماهرة' })).toBe('candidate-chef');
    expect(resolveAvatarArchetype({ name: 'Ahmed', role: 'سائق خاص' })).toBe('candidate-driver');
    expect(resolveAvatarArchetype({ name: 'Maria', role: 'عاملة منزلية شاملة' })).toBe('candidate-maid');
  });

  it('resolves IconScout business illustrations by department and tab', () => {
    expect(resolveIllustrationForTab('dashboard', 'executive')).toBe('exec-command');
    expect(resolveIllustrationForTab('smacc-accounting', 'finance')).toBe('smacc-finance');
    expect(resolveIllustrationForTab('zatca', 'finance')).toBe('zatca-einvoice');
    expect(resolveIllustrationForTab('data-import', 'operations')).toBe('ocr-extractor');
    expect(resolveIllustrationForTab('recruitment-contracts', 'recruitment')).toBe('musaned-recruitment');
    expect(resolveIllustrationForTab('rental-contracts', 'rental')).toBe('flexible-rental');
    expect(resolveIllustrationForTab('cvs', 'ats')).toBe('ats-talent');
    expect(resolveIllustrationForTab('employees', 'hr')).toBe('hr-wps');
    expect(resolveIllustrationForTab('clients', 'crm')).toBe('crm-customer');
    expect(resolveIllustrationForTab('shelter-workers', 'shelter')).toBe('shelter-care');
    expect(resolveIllustrationForTab('kas-tenders', 'tenders')).toBe('kas-tenders');
  });

  it('resolves company portal illustrations and metadata', () => {
    expect(resolveIllustrationForPortal('SAF')).toBe('musaned-recruitment');
    expect(resolveIllustrationForPortal('YAQ')).toBe('flexible-rental');
    expect(resolveIllustrationForPortal('TOP')).toBe('ats-talent');
    expect(resolveIllustrationForPortal('KAS')).toBe('kas-tenders');
    expect(resolveIllustrationForPortal('DAR')).toBe('shelter-care');
    expect(resolveIllustrationForPortal('ALL')).toBe('exec-command');

    const meta = getIllustrationMetadata('smacc-finance');
    expect(meta.titleAr).toContain('سماك');
    expect(Object.keys(BUSINESS_ILLUSTRATION_METADATA).length).toBe(12);
  });
});
