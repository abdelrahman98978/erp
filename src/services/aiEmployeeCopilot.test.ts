import { describe, it, expect } from 'vitest';
import {
  AI_TOOL_REGISTRY,
  getToolById,
  getToolsForDepartment,
  getToolsForCompany,
  buildToolDescriptionsForLLM,
} from './aiToolRegistry';
import {
  inferToolCallFromArabicPrompt,
  validateToolCall,
  executeToolCall,
} from './aiToolExecutor';
import {
  getDepartmentTaskPlaybook,
  generateEmployeeDailyBriefing,
} from './localAiService';

describe('Employee Task Co-Pilot 2.0 (فارس ونُورة لكل الموظفين)', () => {
  it('registers all 22 operational tools across 9 departments', () => {
    expect(AI_TOOL_REGISTRY.length).toBeGreaterThanOrEqual(22);
    expect(getToolById('create_invoice')).toBeDefined();
    expect(getToolById('create_journal_entry')).toBeDefined();
    expect(getToolById('create_receipt_or_payment_voucher')).toBeDefined();
    expect(getToolById('create_recruitment_contract')).toBeDefined();
    expect(getToolById('create_rent_contract')).toBeDefined();
    expect(getToolById('create_candidate_cv')).toBeDefined();
    expect(getToolById('calculate_eos_benefits')).toBeDefined();
    expect(getToolById('create_client_record')).toBeDefined();
    expect(getToolById('create_complaint_ticket')).toBeDefined();
    expect(getToolById('draft_official_message')).toBeDefined();
    expect(getToolById('register_shelter_inmate')).toBeDefined();
    expect(getToolById('generate_boq_pricing')).toBeDefined();
    expect(getToolById('navigate_to_page')).toBeDefined();
  });

  it('scopes tools accurately by department and company', () => {
    const financeTools = getToolsForDepartment('finance', 'SAF');
    const financeIds = financeTools.map((t) => t.id);
    expect(financeIds).toContain('create_invoice');
    expect(financeIds).toContain('create_journal_entry');
    expect(financeIds).toContain('create_receipt_or_payment_voucher');

    const hrTools = getToolsForDepartment('hr', 'SAF');
    const hrIds = hrTools.map((t) => t.id);
    expect(hrIds).toContain('calculate_eos_benefits');
    expect(hrIds).toContain('draft_official_message');

    const allTools = getToolsForCompany('all');
    expect(allTools.length).toBeGreaterThanOrEqual(22);

    const promptDesc = buildToolDescriptionsForLLM('SAF', 'finance');
    expect(promptDesc).toContain('create_invoice');
    expect(promptDesc).toContain('create_journal_entry');
  });

  it('infers Arabic natural-language tool calls accurately', () => {
    const eosCall = inferToolCallFromArabicPrompt(
      'احسب مكافأة نهاية الخدمة راتب 10000 وخدمة 6 سنوات استقالة',
      'SAF'
    );
    expect(eosCall).not.toBeNull();
    expect(eosCall?.tool.id).toBe('calculate_eos_benefits');
    expect(eosCall?.params.monthly_salary).toBe(10000);
    expect(eosCall?.params.years_of_service).toBe(6);
    expect(String(eosCall?.params.reason)).toContain('استقال');

    const draftCall = inferToolCallFromArabicPrompt(
      'صياغة خطاب رسمي للعميل بخصوص تأخر السداد',
      'SAF'
    );
    expect(draftCall).not.toBeNull();
    expect(draftCall?.tool.id).toBe('draft_official_message');

    const journalCall = inferToolCallFromArabicPrompt(
      'سجل قيد يومية تحصيل عقود بمبلغ 25000 ريال',
      'SAF'
    );
    expect(journalCall).not.toBeNull();
    expect(journalCall?.tool.id).toBe('create_journal_entry');
    expect(journalCall?.params.amount).toBe(25000);
  });

  it('calculates Saudi Labor Law EOS benefits (Articles 84 & 85) accurately', async () => {
    const fullEndParsed = validateToolCall(
      {
        id: 'calculate_eos_benefits',
        params: {
          monthly_salary: 10000,
          years_of_service: 6,
          reason: 'انتهاء العقد / اتفاق الطرفين',
        },
      },
      'SAF',
      'hr@alsulaim.sa'
    );
    expect(fullEndParsed).not.toBeNull();
    const fullEndResult = await executeToolCall(fullEndParsed!, 'SAF', 'hr@alsulaim.sa');
    expect(fullEndResult.success).toBe(true);
    // 5 years * 0.5 * 10000 = 25,000 + 1 year * 1.0 * 10000 = 10,000 => 35,000 SAR
    expect((fullEndResult.data as Record<string, unknown>)?.netAward).toBe(35000);

    const resignationParsed = validateToolCall(
      {
        id: 'calculate_eos_benefits',
        params: {
          monthly_salary: 10000,
          years_of_service: 6,
          reason: 'استقالة الموظف',
        },
      },
      'SAF',
      'hr@alsulaim.sa'
    );
    expect(resignationParsed).not.toBeNull();
    const resignationResult = await executeToolCall(resignationParsed!, 'SAF', 'hr@alsulaim.sa');
    expect(resignationResult.success).toBe(true);
    // 6 years resignation (between 5 and 10 years) = 2/3 of 35,000 = 23,333.33 SAR
    expect((resignationResult.data as Record<string, unknown>)?.netAward).toBe(23333.33);
  });

  it('provides department playbooks and personalized daily briefings', () => {
    const financePlaybook = getDepartmentTaskPlaybook('finance', 'SAF');
    expect(financePlaybook.departmentId).toBe('finance');
    expect(financePlaybook.tasks.length).toBeGreaterThanOrEqual(4);

    const briefing = generateEmployeeDailyBriefing(
      { id: 'SAF', name: 'شركة السفير الماسي للاستقدام' },
      'faris'
    );
    expect(briefing).toContain('فارس');
    expect(briefing).toContain('شركة السفير الماسي للاستقدام');
    expect(briefing).toContain('ZATCA');
  });
});
