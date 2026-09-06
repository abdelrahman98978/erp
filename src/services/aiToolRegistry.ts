/**
 * aiToolRegistry.ts
 * Central registry of all tools (functions) available for AI-driven execution.
 * Each tool declares its name, description (Arabic), required parameters,
 * company scope, required permissions, and risk level.
 *
 * SECURITY: All tools are descriptive metadata only — actual execution is in aiToolExecutor.ts.
 */

export type ToolRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ToolParameterSchema {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  description: string;
  required: boolean;
  enumValues?: string[];
}

export interface AiToolDefinition {
  /** Unique tool identifier (snake_case) */
  id: string;
  /** Arabic display name shown in confirmation modal */
  nameAr: string;
  /** Arabic description for the LLM system prompt */
  descriptionAr: string;
  /** Which companies can use this tool (empty = all companies) */
  companyScope: string[];
  /** Required IAM permission key (checked before execution) */
  requiredPermission: string;
  /** Risk level determines confirmation UI severity */
  riskLevel: ToolRiskLevel;
  /** Parameter schema for structured extraction */
  parameters: ToolParameterSchema[];
  /** Category for grouping in UI */
  category: 'finance' | 'hr' | 'operations' | 'shelter' | 'recruitment' | 'general';
  /** Whether this tool modifies data (vs. read-only) */
  isMutating: boolean;
}

/**
 * Master Tool Registry
 * All tools that Faris/Noura can invoke via Function Calling.
 */
export const AI_TOOL_REGISTRY: AiToolDefinition[] = [
  // ═══════════════════════════════════════════════════════════
  //  FINANCE & ACCOUNTING
  // ═══════════════════════════════════════════════════════════
  {
    id: 'create_invoice',
    nameAr: 'إنشاء فاتورة إلكترونية',
    descriptionAr: 'إنشاء فاتورة إلكترونية مشفرة جديدة ممتثلة لمعايير ZATCA المرحلة الثانية. يجب تحديد اسم العميل والمبلغ والوصف.',
    companyScope: [], // All companies
    requiredPermission: 'finance.invoice.create',
    riskLevel: 'medium',
    category: 'finance',
    isMutating: true,
    parameters: [
      { name: 'customer_name', type: 'string', description: 'اسم العميل أو الشركة المستفيدة', required: true },
      { name: 'amount', type: 'number', description: 'المبلغ الإجمالي بالريال السعودي', required: true },
      { name: 'description', type: 'string', description: 'وصف الخدمة أو البند', required: true },
      { name: 'vat_inclusive', type: 'boolean', description: 'هل المبلغ شامل ضريبة القيمة المضافة 15%؟', required: false },
    ],
  },
  {
    id: 'approve_payment_voucher',
    nameAr: 'اعتماد سند صرف',
    descriptionAr: 'اعتماد سند صرف مالي بعد التحقق من الرصيد والصلاحيات. يجب تحديد رقم السند.',
    companyScope: [],
    requiredPermission: 'finance.voucher.approve',
    riskLevel: 'high',
    category: 'finance',
    isMutating: true,
    parameters: [
      { name: 'voucher_number', type: 'string', description: 'رقم سند الصرف المراد اعتماده', required: true },
      { name: 'notes', type: 'string', description: 'ملاحظات الاعتماد (اختياري)', required: false },
    ],
  },
  {
    id: 'get_cash_balance',
    nameAr: 'استعراض رصيد السيولة',
    descriptionAr: 'عرض رصيد السيولة النقدية الحالي لحساب بنكي أو جميع الحسابات البنكية.',
    companyScope: [],
    requiredPermission: 'finance.balance.read',
    riskLevel: 'low',
    category: 'finance',
    isMutating: false,
    parameters: [
      { name: 'bank_name', type: 'string', description: 'اسم البنك (اختياري — لعرض كل البنوك اتركه فارغاً)', required: false },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  //  KAS — TENDERS & OPERATIONS
  // ═══════════════════════════════════════════════════════════
  {
    id: 'update_tender_status',
    nameAr: 'تحديث حالة المنافسة',
    descriptionAr: 'تحديث حالة منافسة حكومية على منصة اعتماد (تحت الدراسة، تقدمنا بعرض، تمت الترسية، لم يتم الترسية).',
    companyScope: ['KAS'],
    requiredPermission: 'kas.tender.update',
    riskLevel: 'medium',
    category: 'operations',
    isMutating: true,
    parameters: [
      { name: 'tender_id', type: 'string', description: 'رقم المنافسة (مثال: 2326-68993)', required: true },
      { name: 'new_status', type: 'string', description: 'الحالة الجديدة', required: true, enumValues: ['تحت الدراسة', 'تقدمنا بعرض', 'تمت الترسية', 'لم يتم الترسية', 'ملغاة'] },
    ],
  },
  {
    id: 'generate_boq_pricing',
    nameAr: 'تسعير بند في جدول الكميات',
    descriptionAr: 'إضافة أو تسعير بند في جدول الكميات BOQ لمنافسة كاس. يحسب الإجمالي والضريبة والتفقيط تلقائياً.',
    companyScope: ['KAS'],
    requiredPermission: 'kas.boq.edit',
    riskLevel: 'medium',
    category: 'operations',
    isMutating: true,
    parameters: [
      { name: 'item_description', type: 'string', description: 'وصف البند (مثال: توريد 500 كرسي مكتبي)', required: true },
      { name: 'quantity', type: 'number', description: 'الكمية', required: true },
      { name: 'unit_price', type: 'number', description: 'سعر الوحدة بالريال السعودي', required: true },
      { name: 'unit', type: 'string', description: 'وحدة القياس (قطعة، متر، لتر...)', required: false },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  //  SAF — MUSANED RECRUITMENT
  // ═══════════════════════════════════════════════════════════
  {
    id: 'check_contract_status',
    nameAr: 'استعراض حالة عقد استقدام',
    descriptionAr: 'البحث عن عقد استقدام عبر مساند بالرقم أو اسم العميل وعرض حالته التفصيلية.',
    companyScope: ['SAF', 'MASI'],
    requiredPermission: 'saf.contract.read',
    riskLevel: 'low',
    category: 'recruitment',
    isMutating: false,
    parameters: [
      { name: 'contract_number', type: 'string', description: 'رقم العقد (مثال: 2026-0089)', required: false },
      { name: 'customer_name', type: 'string', description: 'اسم العميل / الكفيل', required: false },
    ],
  },
  {
    id: 'schedule_musaned_reminder',
    nameAr: 'جدولة تذكير مساند',
    descriptionAr: 'إنشاء تذكير آلي للعقود المتأخرة في مراحل السفارة أو التأشيرة بعد عدد أيام محدد.',
    companyScope: ['SAF', 'MASI'],
    requiredPermission: 'saf.reminder.create',
    riskLevel: 'low',
    category: 'recruitment',
    isMutating: true,
    parameters: [
      { name: 'days_threshold', type: 'number', description: 'عدد الأيام المتأخرة (مثال: 45)', required: true },
      { name: 'stage', type: 'string', description: 'المرحلة المستهدفة', required: false, enumValues: ['السفارة', 'التأشيرة', 'الحجز', 'الوصول', 'الكل'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  //  SHELTER — CARE CENTERS
  // ═══════════════════════════════════════════════════════════
  {
    id: 'register_shelter_inmate',
    nameAr: 'تسجيل نزيلة جديدة',
    descriptionAr: 'تسجيل نزيلة جديدة في مركز الإيواء مع بياناتها الشخصية ورقم الغرفة المخصصة.',
    companyScope: ['SHELTER'],
    requiredPermission: 'shelter.inmate.create',
    riskLevel: 'high',
    category: 'shelter',
    isMutating: true,
    parameters: [
      { name: 'full_name', type: 'string', description: 'الاسم الكامل للنزيلة', required: true },
      { name: 'nationality', type: 'string', description: 'الجنسية', required: true },
      { name: 'room_number', type: 'number', description: 'رقم الغرفة المخصصة', required: true },
      { name: 'case_type', type: 'string', description: 'نوع الحالة', required: false, enumValues: ['إيواء مؤقت', 'نقل خدمات', 'ترحيل', 'حالة طوارئ'] },
    ],
  },
  {
    id: 'get_shelter_occupancy',
    nameAr: 'استعراض نسبة إشغال المركز',
    descriptionAr: 'عرض نسبة الإشغال الحالية لمركز الإيواء مع عدد الأسرة المتاحة والمشغولة.',
    companyScope: ['SHELTER'],
    requiredPermission: 'shelter.occupancy.read',
    riskLevel: 'low',
    category: 'shelter',
    isMutating: false,
    parameters: [],
  },

  // ═══════════════════════════════════════════════════════════
  //  GENERAL — ALL COMPANIES
  // ═══════════════════════════════════════════════════════════
  {
    id: 'navigate_to_page',
    nameAr: 'التنقل إلى صفحة',
    descriptionAr: 'التنقل مباشرة إلى صفحة أو قسم محدد في النظام (مثال: لوحة المؤشرات، الفوترة، مراكز الإيواء).',
    companyScope: [],
    requiredPermission: 'system.navigate',
    riskLevel: 'low',
    category: 'general',
    isMutating: false,
    parameters: [
      { name: 'page_key', type: 'string', description: 'مفتاح الصفحة المطلوبة', required: true, enumValues: [
        'dashboard', 'kas-suite', 'ats-pipeline', 'rent-contracts', 'cv-bank',
        'shelter', 'finance-home', 'zatca-hub', 'group-command', 'hr-home',
      ]},
    ],
  },
  {
    id: 'get_expiring_iqamas',
    nameAr: 'استعراض الإقامات المنتهية قريباً',
    descriptionAr: 'عرض قائمة العمالة التي تنتهي إقاماتها خلال فترة محددة بالأيام.',
    companyScope: [],
    requiredPermission: 'hr.iqama.read',
    riskLevel: 'low',
    category: 'hr',
    isMutating: false,
    parameters: [
      { name: 'days_ahead', type: 'number', description: 'عدد الأيام المتبقية (مثال: 30 يوماً)', required: true },
    ],
  },
];

/**
 * Get tools available for a specific company context.
 */
export function getToolsForCompany(companyId: string): AiToolDefinition[] {
  const cid = companyId.toUpperCase();
  return AI_TOOL_REGISTRY.filter(tool =>
    tool.companyScope.length === 0 || tool.companyScope.includes(cid)
  );
}

/**
 * Find a tool definition by its ID.
 */
export function getToolById(toolId: string): AiToolDefinition | undefined {
  return AI_TOOL_REGISTRY.find(t => t.id === toolId);
}

/**
 * Build an LLM-friendly tool description list for the system prompt.
 * This is injected into the Ollama chat context so the model knows what tools are available.
 */
export function buildToolDescriptionsForLLM(companyId: string): string {
  const tools = getToolsForCompany(companyId);
  if (tools.length === 0) return '';

  const lines = tools.map(tool => {
    const params = tool.parameters
      .map(p => `    - ${p.name} (${p.type}${p.required ? ', مطلوب' : ', اختياري'}): ${p.description}${p.enumValues ? ` [القيم: ${p.enumValues.join(' | ')}]` : ''}`)
      .join('\n');

    return `• ${tool.id}: ${tool.descriptionAr}\n  المعاملات:\n${params || '    (بدون معاملات)'}`;
  });

  return `\n[الأدوات المتاحة للتنفيذ المباشر]\nإذا طلب المستخدم تنفيذ إجراء محدد من القائمة التالية، أجب بتنسيق JSON دقيق كالتالي:
{"tool_call": {"id": "tool_id_here", "params": {"param1": "value1"}}}
لا تضع tool_call إلا إذا كان المستخدم يطلب تنفيذ إجراء فعلي وليس مجرد سؤال. إذا كان السؤال استفسارياً فقط، أجب بنص عادي بدون tool_call.

الأدوات المتاحة:
${lines.join('\n\n')}`;
}
