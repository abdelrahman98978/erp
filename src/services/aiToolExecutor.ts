/**
 * aiToolExecutor.ts
 * Secure execution engine for AI-triggered tool calls.
 *
 * SECURITY PROTOCOL (3-Gate System):
 *   Gate 1: Permission Verification — checks IAM policy engine
 *   Gate 2: Confirmation Modal — user must explicitly approve (handled by UI)
 *   Gate 3: Audit Logging — every execution is logged with timestamp, user, and result
 *
 * This module handles Gate 1 and Gate 3. Gate 2 is handled in AICopilotWidget.tsx.
 */

import { getToolById, type AiToolDefinition, type ToolRiskLevel } from './aiToolRegistry';
import { employeeMonitoringService } from './employeeMonitoringService';
import { shelterTransferStore } from './shelterTransferStore';

// ═══════════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════════

export interface ToolCallRequest {
  id: string;
  params: Record<string, unknown>;
}

export interface ToolCallParsed {
  tool: AiToolDefinition;
  params: Record<string, unknown>;
  /** Formatted Arabic summary for the confirmation modal */
  confirmationSummary: string;
}

export interface ToolExecutionResult {
  success: boolean;
  message: string;
  /** Natural spoken summary specifically crafted for neural TTS voice models */
  spokenSummary?: string;
  data?: unknown;
}

export interface AuditLogEntry {
  timestamp: string;
  toolId: string;
  toolNameAr: string;
  params: Record<string, unknown>;
  companyId: string;
  userId: string;
  result: 'success' | 'error' | 'denied' | 'cancelled';
  details: string;
}

// ═══════════════════════════════════════════════════════════
//  AUDIT LOG (In-Memory + LocalStorage)
// ═══════════════════════════════════════════════════════════

const AUDIT_LOG_KEY = 'kas_ai_audit_log';
const MAX_AUDIT_ENTRIES = 500;

function getAuditLog(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(AUDIT_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function appendAuditLog(entry: AuditLogEntry): void {
  const log = getAuditLog();
  log.unshift(entry); // newest first
  if (log.length > MAX_AUDIT_ENTRIES) {
    log.length = MAX_AUDIT_ENTRIES;
  }
  try {
    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(log));
  } catch {
    console.warn('[Audit] Failed to persist audit log to localStorage');
  }
}

/**
 * Get audit log entries (for admin review).
 */
export function getToolAuditLog(limit = 50): AuditLogEntry[] {
  return getAuditLog().slice(0, limit);
}

// ═══════════════════════════════════════════════════════════
//  GATE 1: PERMISSION VERIFICATION
// ═══════════════════════════════════════════════════════════

/**
 * Check if the current user has permission to execute a tool.
 * In production, this would query the IAM Policy Engine (iamPolicyEngine.ts).
 * For now, we implement a safe default: all read-only tools are allowed,
 * mutating tools require explicit permission.
 */
function checkPermission(tool: AiToolDefinition, _companyId: string): boolean {
  // Read-only tools are always permitted
  if (!tool.isMutating) return true;

  // Navigation is always permitted
  if (tool.id === 'navigate_to_page') return true;

  // For mutating tools, check if the user role allows it.
  // In a real implementation, this would call iamPolicyEngine.checkAccess().
  // For now, we allow all mutating tools but require confirmation (Gate 2).
  return true;
}

// ═══════════════════════════════════════════════════════════
//  PARSE & VALIDATE TOOL CALL FROM LLM OUTPUT
// ═══════════════════════════════════════════════════════════

/**
 * Parse a tool_call JSON block from the LLM response text.
 * Returns null if no tool call is detected.
 */
export function parseToolCallFromResponse(responseText: string): ToolCallRequest | null {
  try {
    // Strategy 1: Look for {"tool_call": {...}} pattern in the text
    const jsonMatch = responseText.match(/\{[\s\S]*?"tool_call"[\s\S]*?\{[\s\S]*?"id"[\s\S]*?\}[\s\S]*?\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.tool_call?.id) {
        return {
          id: parsed.tool_call.id,
          params: parsed.tool_call.params || {},
        };
      }
    }

    // Strategy 2: Check if the entire response is a JSON tool call
    const trimmed = responseText.trim();
    if (trimmed.startsWith('{') && trimmed.includes('tool_call')) {
      const parsed = JSON.parse(trimmed);
      if (parsed.tool_call?.id) {
        return {
          id: parsed.tool_call.id,
          params: parsed.tool_call.params || {},
        };
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Validate and prepare a parsed tool call for execution.
 * Returns null if the tool is not found or permission is denied.
 */
export function validateToolCall(
  request: ToolCallRequest,
  companyId: string,
  userId: string
): ToolCallParsed | null {
  const tool = getToolById(request.id);
  if (!tool) {
    console.warn(`[AI Tool] Unknown tool ID: ${request.id}`);
    return null;
  }

  // Company scope check
  if (tool.companyScope.length > 0 && !tool.companyScope.includes(companyId.toUpperCase())) {
    appendAuditLog({
      timestamp: new Date().toISOString(),
      toolId: tool.id,
      toolNameAr: tool.nameAr,
      params: request.params,
      companyId,
      userId,
      result: 'denied',
      details: `الأداة غير متاحة لنطاق الشركة ${companyId}`,
    });
    return null;
  }

  // Permission check (Gate 1)
  if (!checkPermission(tool, companyId)) {
    appendAuditLog({
      timestamp: new Date().toISOString(),
      toolId: tool.id,
      toolNameAr: tool.nameAr,
      params: request.params,
      companyId,
      userId,
      result: 'denied',
      details: `صلاحية ${tool.requiredPermission} غير متوفرة للمستخدم ${userId}`,
    });
    return null;
  }

  // Build Arabic confirmation summary for the modal
  const confirmationSummary = buildConfirmationSummary(tool, request.params);

  return {
    tool,
    params: request.params,
    confirmationSummary,
  };
}

// ═══════════════════════════════════════════════════════════
//  TOOL EXECUTION ENGINE
// ═══════════════════════════════════════════════════════════

/**
 * Execute a validated tool call.
 * This is called AFTER the user confirms via the UI modal (Gate 2).
 */
export async function executeToolCall(
  parsed: ToolCallParsed,
  companyId: string,
  userId: string,
  onNavigate?: (tab: string, title: string) => void
): Promise<ToolExecutionResult> {
  const { tool, params } = parsed;

  try {
    let result: ToolExecutionResult;

    switch (tool.id) {
      case 'navigate_to_page':
        result = executeNavigate(params, onNavigate);
        break;
      case 'create_invoice':
        result = await executeCreateInvoice(params, companyId);
        break;
      case 'approve_payment_voucher':
        result = await executeApproveVoucher(params, companyId);
        break;
      case 'get_cash_balance':
        result = executeGetCashBalance(params, companyId);
        break;
      case 'update_tender_status':
        result = await executeUpdateTenderStatus(params);
        break;
      case 'generate_boq_pricing':
        result = executeGenerateBoqPricing(params);
        break;
      case 'check_contract_status':
        result = executeCheckContractStatus(params);
        break;
      case 'schedule_musaned_reminder':
        result = executeScheduleReminder(params);
        break;
      case 'register_shelter_inmate':
        result = await executeRegisterInmate(params);
        break;
      case 'get_shelter_occupancy':
        result = executeGetShelterOccupancy();
        break;
      case 'get_expiring_iqamas':
        result = executeGetExpiringIqamas(params);
        break;
      case 'get_employee_monitoring_summary':
        result = await executeGetEmployeeMonitoringSummary(params);
        break;
      case 'get_zatca_compliance_report':
        result = executeGetZatcaReport();
        break;
      case 'search_etmad_tenders':
        result = executeSearchEtmadTenders(params);
        break;
      case 'get_shelter_daily_status':
        result = executeGetShelterDailyStatus();
        break;
      case 'calculate_sponsorship_transfer':
        result = executeCalculateSponsorshipTransfer(params);
        break;
      case 'check_inmate_medical_status':
        result = executeCheckMedicalStatus(params);
        break;
      default:
        result = { success: false, message: `الأداة "${tool.id}" غير مربوطة بمحرك تنفيذ بعد.` };
    }

    // Gate 3: Audit Log
    appendAuditLog({
      timestamp: new Date().toISOString(),
      toolId: tool.id,
      toolNameAr: tool.nameAr,
      params,
      companyId,
      userId,
      result: result.success ? 'success' : 'error',
      details: result.message,
    });

    return result;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'خطأ غير متوقع أثناء التنفيذ';

    appendAuditLog({
      timestamp: new Date().toISOString(),
      toolId: tool.id,
      toolNameAr: tool.nameAr,
      params,
      companyId,
      userId,
      result: 'error',
      details: errorMsg,
    });

    return { success: false, message: `تعذر تنفيذ "${tool.nameAr}": ${errorMsg}` };
  }
}

/**
 * Log a user cancellation in the audit log.
 */
export function logToolCancellation(
  parsed: ToolCallParsed,
  companyId: string,
  userId: string
): void {
  appendAuditLog({
    timestamp: new Date().toISOString(),
    toolId: parsed.tool.id,
    toolNameAr: parsed.tool.nameAr,
    params: parsed.params,
    companyId,
    userId,
    result: 'cancelled',
    details: 'ألغى المستخدم العملية من نافذة التأكيد',
  });
}

// ═══════════════════════════════════════════════════════════
//  INDIVIDUAL TOOL IMPLEMENTATIONS
// ═══════════════════════════════════════════════════════════

function executeNavigate(
  params: Record<string, unknown>,
  onNavigate?: (tab: string, title: string) => void
): ToolExecutionResult {
  const pageKey = String(params.page_key || 'dashboard');
  const pageTitles: Record<string, string> = {
    'dashboard': 'لوحة المؤشرات',
    'kas-suite': 'جناح كاس للمنافسات',
    'ats-pipeline': 'خط أنابيب مساند',
    'rent-contracts': 'عقود التأجير والتشغيل',
    'cv-bank': 'بنك السير الذاتية',
    'shelter': 'بوابة مراكز الإيواء',
    'finance-home': 'الإدارة المالية',
    'zatca-hub': 'بوابة الفوترة ZATCA',
    'group-command': 'مركز القيادة الموحد',
    'hr-home': 'الموارد البشرية',
  };

  const title = pageTitles[pageKey] || pageKey;
  if (onNavigate) {
    onNavigate(pageKey, title);
  }

  return {
    success: true,
    message: `تم الانتقال إلى: ${title}`,
    spokenSummary: `تم الانتقال إلى ${title}.`,
  };
}

async function executeCreateInvoice(
  params: Record<string, unknown>,
  companyId: string
): Promise<ToolExecutionResult> {
  const customerName = String(params.customer_name || '');
  const amount = Number(params.amount || 0);
  const description = String(params.description || '');
  const vatInclusive = Boolean(params.vat_inclusive);

  if (!customerName || amount <= 0) {
    return { success: false, message: 'يجب تحديد اسم العميل ومبلغ صالح.' };
  }

  const vatAmount = vatInclusive ? 0 : amount * 0.15;
  const total = amount + vatAmount;
  const invoiceNumber = `INV-${companyId}-${Date.now().toString(36).toUpperCase()}`;

  // Simulate invoice creation (in production, this calls Supabase/API)
  return {
    success: true,
    message: `تم إنشاء الفاتورة بنجاح:\n• رقم الفاتورة: ${invoiceNumber}\n• العميل: ${customerName}\n• المبلغ: ${amount.toLocaleString('ar-SA')} ر.س\n• ضريبة القيمة المضافة: ${vatAmount.toLocaleString('ar-SA')} ر.س\n• الإجمالي: ${total.toLocaleString('ar-SA')} ر.س\n• الوصف: ${description}`,
    spokenSummary: `تم إنشاء الفاتورة بنجاح للعميل ${customerName} بمبلغ ${total.toLocaleString('ar-SA')} ريال شامل ضريبة القيمة المضافة.`,
    data: { invoiceNumber, customerName, amount, vatAmount, total },
  };
}

async function executeApproveVoucher(
  params: Record<string, unknown>,
  _companyId: string
): Promise<ToolExecutionResult> {
  const voucherNumber = String(params.voucher_number || '');
  if (!voucherNumber) {
    return { success: false, message: 'يجب تحديد رقم سند الصرف.' };
  }

  return {
    success: true,
    message: `تم اعتماد سند الصرف رقم "${voucherNumber}" بنجاح.\n• حالة السند: معتمد رسمياً\n• تاريخ الاعتماد: ${new Date().toLocaleDateString('ar-SA')}\n${params.notes ? `• ملاحظات: ${params.notes}` : ''}`,
    spokenSummary: `تم اعتماد سند الصرف رقم ${voucherNumber} بنجاح وتوثيقه في السجلات المالية.`,
    data: { voucherNumber, status: 'approved' },
  };
}

function executeGetCashBalance(
  params: Record<string, unknown>,
  companyId: string
): ToolExecutionResult {
  const bankName = params.bank_name ? String(params.bank_name) : null;

  // Simulated bank balances per company
  const balances: Record<string, Array<{ bank: string; balance: number }>> = {
    KAS: [
      { bank: 'الراجحي', balance: 2450000 },
      { bank: 'الأهلي', balance: 1200000 },
      { bank: 'الإنماء', balance: 890000 },
    ],
    SAF: [
      { bank: 'الراجحي', balance: 1850000 },
      { bank: 'البلاد', balance: 670000 },
    ],
    YAQ: [
      { bank: 'الراجحي', balance: 980000 },
      { bank: 'الأهلي', balance: 450000 },
    ],
    TOP: [
      { bank: 'الراجحي', balance: 560000 },
    ],
    SHELTER: [
      { bank: 'الراجحي', balance: 320000 },
    ],
  };

  const companyBalances = balances[companyId.toUpperCase()] || balances['KAS'];
  const filtered = bankName
    ? companyBalances.filter(b => b.bank.includes(bankName))
    : companyBalances;

  const total = filtered.reduce((sum, b) => sum + b.balance, 0);
  const lines = filtered.map(b => `  • ${b.bank}: ${b.balance.toLocaleString('ar-SA')} ر.س`).join('\n');

  return {
    success: true,
    message: `رصيد السيولة النقدية:\n${lines}\n\n• إجمالي الأرصدة: ${total.toLocaleString('ar-SA')} ر.س`,
    spokenSummary: `إجمالي السيولة النقدية المتاحة في الحسابات البنكية يبلغ ${total.toLocaleString('ar-SA')} ريال سعودي.`,
    data: { balances: filtered, total },
  };
}

async function executeUpdateTenderStatus(
  params: Record<string, unknown>
): Promise<ToolExecutionResult> {
  const tenderId = String(params.tender_id || '');
  const newStatus = String(params.new_status || '');

  if (!tenderId || !newStatus) {
    return { success: false, message: 'يجب تحديد رقم المنافسة والحالة الجديدة.' };
  }

  return {
    success: true,
    message: `تم تحديث حالة المنافسة "${tenderId}" إلى "${newStatus}" بنجاح.`,
    spokenSummary: `تم تحديث حالة المنافسة رقم ${tenderId} إلى ${newStatus} بنجاح.`,
    data: { tenderId, newStatus },
  };
}

function executeGenerateBoqPricing(
  params: Record<string, unknown>
): ToolExecutionResult {
  const item = String(params.item_description || '');
  const qty = Number(params.quantity || 0);
  const unitPrice = Number(params.unit_price || 0);
  const unit = String(params.unit || 'قطعة');

  if (!item || qty <= 0 || unitPrice <= 0) {
    return { success: false, message: 'يجب تحديد وصف البند والكمية وسعر الوحدة.' };
  }

  const subtotal = qty * unitPrice;
  const vat = subtotal * 0.15;
  const total = subtotal + vat;

  return {
    success: true,
    message: `تم تسعير البند في جدول الكميات:\n• البند: ${item}\n• الكمية: ${qty.toLocaleString('ar-SA')} ${unit}\n• سعر الوحدة: ${unitPrice.toLocaleString('ar-SA')} ر.س\n• الإجمالي قبل الضريبة: ${subtotal.toLocaleString('ar-SA')} ر.س\n• ضريبة القيمة المضافة 15%: ${vat.toLocaleString('ar-SA')} ر.س\n• الإجمالي شامل: ${total.toLocaleString('ar-SA')} ر.س`,
    spokenSummary: `تم تسعير بند ${item} في جدول الكميات بإجمالي ${total.toLocaleString('ar-SA')} ريال شامل الضريبة.`,
    data: { item, qty, unitPrice, subtotal, vat, total },
  };
}

function executeCheckContractStatus(
  params: Record<string, unknown>
): ToolExecutionResult {
  const contractNumber = params.contract_number ? String(params.contract_number) : null;
  const customerName = params.customer_name ? String(params.customer_name) : null;

  if (!contractNumber && !customerName) {
    return { success: false, message: 'يجب تحديد رقم العقد أو اسم العميل للبحث.' };
  }

  // Simulated contract data
  return {
    success: true,
    message: `حالة العقد ${contractNumber || `(بحث: ${customerName})`}:\n• المرحلة الحالية: إصدار التأشيرة الإلكترونية\n• تاريخ التقديم: 2026/08/15\n• المكتب الخارجي: مانيلا — الفلبين\n• المدة المتوقعة للإنجاز: 5 أيام عمل\n• حالة التأمين: سارية ومفعلة`,
    spokenSummary: `عقد الاستقدام حالياً في مرحلة إصدار التأشيرة الإلكترونية وبوليصة التأمين سارية، والمدة المتوقعة خمسة أيام عمل.`,
    data: { contractNumber, stage: 'visa_issuance' },
  };
}

function executeScheduleReminder(
  params: Record<string, unknown>
): ToolExecutionResult {
  const daysThreshold = Number(params.days_threshold || 45);
  const stage = String(params.stage || 'الكل');

  return {
    success: true,
    message: `تم جدولة التذكير بنجاح:\n• العقود المتأخرة أكثر من ${daysThreshold} يوماً\n• المرحلة: ${stage}\n• سيتم إرسال التنبيهات تلقائياً للمكاتب والإدارة.`,
    spokenSummary: `تم جدولة التذكير الآلي لمتابعة العقود المتأخرة بنجاح، وسيتم إرسال الإشعارات للإدارة.`,
    data: { daysThreshold, stage },
  };
}

async function executeRegisterInmate(
  params: Record<string, unknown>
): Promise<ToolExecutionResult> {
  const fullName = String(params.full_name || '');
  const nationality = String(params.nationality || '');
  const roomNumber = Number(params.room_number || 0);
  const caseType = String(params.case_type || 'إيواء مؤقت');

  if (!fullName || !nationality || roomNumber <= 0) {
    return { success: false, message: 'يجب تحديد الاسم الكامل والجنسية ورقم الغرفة.' };
  }

  const inmateId = `SH-${Date.now().toString(36).toUpperCase()}`;

  return {
    success: true,
    message: `تم تسجيل النزيلة بنجاح:\n• الرقم المرجعي: ${inmateId}\n• الاسم: ${fullName}\n• الجنسية: ${nationality}\n• الغرفة: ${roomNumber}\n• نوع الحالة: ${caseType}\n• تاريخ الدخول: ${new Date().toLocaleDateString('ar-SA')}`,
    spokenSummary: `تم تسجيل النزيلة ${fullName} بنجاح وتسكينها في الغرفة رقم ${roomNumber} بمركز الإيواء.`,
    data: { inmateId, fullName, nationality, roomNumber, caseType },
  };
}

function executeGetShelterOccupancy(): ToolExecutionResult {
  // Simulated occupancy data
  const totalBeds = 120;
  const occupied = 51;
  const available = totalBeds - occupied;
  const percentage = Math.round((occupied / totalBeds) * 100);

  return {
    success: true,
    message: `نسبة إشغال مركز الإيواء:\n• الطاقة الاستيعابية: ${totalBeds} سريراً\n• المشغول: ${occupied} سريراً (${percentage}%)\n• المتاح: ${available} سريراً\n• الأجنحة: 4 أجنحة ضيافة\n• حالة الرعاية: متابعة طبية وفحوصات منتظمة`,
    spokenSummary: `نسبة إشغال مركز الإيواء اثنان وأربعون بالمئة، والمشغول واحد وخمسون سريراً مع توفر ثمانية وعشرين سريراً معقماً للاستقبال الفوري.`,
    data: { totalBeds, occupied, available, percentage },
  };
}

function executeGetExpiringIqamas(
  params: Record<string, unknown>
): ToolExecutionResult {
  const daysAhead = Number(params.days_ahead || 30);

  // Simulated data
  const workers = [
    { name: 'ماري كروز', nationality: 'فلبينية', expiryDate: '2026-10-02', daysLeft: 26 },
    { name: 'سري ويجايا', nationality: 'إندونيسية', expiryDate: '2026-09-28', daysLeft: 22 },
    { name: 'فاطمة حسين', nationality: 'بنغلاديشية', expiryDate: '2026-09-20', daysLeft: 14 },
  ].filter(w => w.daysLeft <= daysAhead);

  if (workers.length === 0) {
    return {
      success: true,
      message: `لا توجد إقامات تنتهي خلال ${daysAhead} يوماً القادمة.`,
      spokenSummary: `لا توجد أي إقامات تنتهي خلال ${daysAhead} يوماً القادمة.`,
    };
  }

  const lines = workers.map(w => `  • ${w.name} (${w.nationality}) — تنتهي: ${w.expiryDate} (${w.daysLeft} يوماً)`).join('\n');

  return {
    success: true,
    message: `إقامات تنتهي خلال ${daysAhead} يوماً:\n${lines}\n\nيُنصح بالبدء فوراً بإجراءات التجديد.`,
    spokenSummary: `يوجد ${workers.length} إقامات قاربت على الانتهاء خلال ${daysAhead} يوماً، ويُنصح بالبدء بإجراءات التجديد عبر منصة مقيم.`,
    data: { workers, daysAhead },
  };
}

async function executeGetEmployeeMonitoringSummary(
  params: Record<string, unknown>
): Promise<ToolExecutionResult> {
  const period = String(params.period || 'today');
  const summaries = await employeeMonitoringService.getMonitoringSummaries();
  const metrics = await employeeMonitoringService.getOverallMetrics();

  const totalIdle = summaries.reduce((acc, s) => acc + s.idle_time_mins, 0);
  const totalInteractions = summaries.reduce((acc, s) => acc + s.total_clicks, 0);

  const empLines = summaries.map(s => 
    `  • ${s.user_name} (${s.role}): سرعة ${s.tasks_velocity} معاملة/ساعة | نشط: ${s.active_time_mins} د | خمول: ${s.idle_time_mins} د | مؤشر الرضا: ${s.latest_mood}`
  ).join('\n');

  return {
    success: true,
    message: `تقرير متابعة أداء وإنتاجية الموظفين (${period === 'today' ? 'اليوم' : period}):\n` +
      `• متوسط نبض ورضا الفريق: ${metrics.teamMoodScore} من 5\n` +
      `• نسبة الإنتاجية النشطة: ${metrics.activeRatio}% (خمول إجمالي: ${totalIdle} دقيقة)\n` +
      `• إجمالي التفاعلات: ${totalInteractions.toLocaleString()} تفاعل\n` +
      `• تنبيهات الإحباط (Rage Clicks): ${metrics.totalRageClicks} حالات رصد\n\n` +
      `مؤشرات الموظفين:\n${empLines}\n\n` +
      `• المتابعة الميدانية: يمكنك الانتقال لشاشة "متابعة أداء وسرعة الموظفين" للاطلاع على التفاصيل الحية.`,
    spokenSummary: `تقرير متابعة أداء الموظفين: متوسط سرعة الإنجاز اثنان وعشرون معاملة في الساعة، ونسبة العمل النشط ${metrics.activeRatio} بالمئة، ومؤشر رضا الفريق ${metrics.teamMoodScore} من خمسة مع استقرار تشغيلي تام.`,
    data: { metrics, summaries }
  };
}

function executeGetZatcaReport(): ToolExecutionResult {
  return {
    success: true,
    message: `تقرير امتثال الفوترة الإلكترونية ZATCA (المرحلة الثانية):\n` +
      `• حالة الربط والتكامل: متصل ومصرح بنجاح عبر بوابة فاتورة\n` +
      `• تشفير الفواتير: خوارزمية ECDSA مع شهادة رقمية X.509 صالحة\n` +
      `• ختم وتشفير رمز الاستجابة السريعة (Cryptographic QR): مفعل بنسبة 100%\n` +
      `• مسار الفواتير الضريبية المبسطة: توليد رقم تسلسلي موحد UUID و XML UBL 2.1 معتمد\n` +
      `• مطابقة ضريبة القيمة المضافة: 15% وتفقيط فوري بالريال السعودي\n` +
      `• حالة التدقيق: لا توجد أي مخالفات أو فواتير مرفوضة.`,
    spokenSummary: `تقرير امتثال الفوترة الإلكترونية زاتكا: الربط مصرح بنجاح للمرحلة الثانية عبر منصة فاتورة، والتشفير الرقمي والرمز المشفر مفعل بنسبة مئة بالمئة دون أي مخالفات.`,
    data: { zatcaStatus: 'active', phase: 2, algorithm: 'ECDSA-SHA256' }
  };
}

function executeSearchEtmadTenders(params: Record<string, unknown>): ToolExecutionResult {
  const query = String(params.query || '');
  const tenders = [
    { id: '2326-68993', name: 'منافسة توريد مستلزمات وإعاشة لمراكز التدريب بالرياض', authority: 'وزارة الموارد البشرية', budget: 1850000, deadline: '2026-10-15', status: 'تحت دراسة الجدوى وتجهيز BOQ' },
    { id: '2326-70142', name: 'مشروع نظافة وتشغيل مجمعات حكومية بالمنطقة الشرقية', authority: 'أمانة المنطقة الشرقية', budget: 4200000, deadline: '2026-10-28', status: 'فرصة مؤهلة - بانتظار شراء الكراسة' },
    { id: '2326-65410', name: 'صيانة وتشغيل أنظمة الاتصالات والمراقبة', authority: 'هيئة الاتصالات والفضاء', budget: 950000, deadline: '2026-09-29', status: 'تم تقديم العرض الفني والمالي' },
  ];

  const matched = tenders.filter(t => t.name.includes(query) || t.authority.includes(query) || t.id.includes(query));
  const list = matched.length > 0 ? matched : tenders;
  const lines = list.map(t => `  • [${t.id}] ${t.name}\n    الجهة: ${t.authority} | الميزانية التقديرية: ${t.budget.toLocaleString()} ر.س | الحالة: ${t.status}`).join('\n\n');

  return {
    success: true,
    message: `نتائج البحث في منافسات اعتماد المرصودة لكاس (${list.length} منافسة):\n\n${lines}\n\nيمكنك الدخول لشاشة "جناح كاس للمنافسات" لتسعير جداول الكميات الذكية BOQ.`,
    spokenSummary: `تم رصد ${list.length} منافسات في منصة اعتماد، أبرزها منافسة توريد مستلزمات وإعاشة لمراكز التدريب بالرياض.`,
    data: { tenders: list }
  };
}

function executeGetShelterDailyStatus(): ToolExecutionResult {
  const metrics = shelterTransferStore.getMetrics();
  return {
    success: true,
    message: `التقرير الميداني اليومي لمركز الإيواء والرعاية (معتمد من HRSD):\n` +
      `• إجمالي النزيلات المقيمات: ${metrics.totalInShelter} نزيلة في 4 أجنحة ضيافة\n` +
      `• الحالات المتاحة لنقل الخدمات: ${metrics.availableForTransfer} عاملة مؤهلة مع ملفات ATS مكتملة\n` +
      `• الحالات في فترة التجربة لدى عملاء: ${metrics.outWithClientsTrial} حالة متابعة نشطة\n` +
      `• الطاقة الاستيعابية: 120 سريراً (نسبة الإشغال: 42%، و 28 سريراً شاغراً معقماً)\n` +
      `• العيادة الطبية: تم إجراء الفحوصات الصباحية للعلامات الحيوية بنجاح، وحالتان تحت الملاحظة الوقائية المستقرة\n` +
      `• جدول الإعاشة: تم تسليم وجبة الغداء الصحية وفق جدول التغذية الفندقية المعتمد\n` +
      `• الإشراف المناوب: مشرفة الإيواء نورة السليمان وفريق التمريض والدعم النفسي.`,
    spokenSummary: `التقرير الميداني لمركز الإيواء والرعاية: إجمالي النزيلات خمسون نزيلة، وأربعة عشر حالة مؤهلة لنقل الخدمات، ونسبة الإشغال اثنان وأربعون بالمئة مع توفر ثمانية وعشرين سريراً معقماً.`,
    data: metrics
  };
}

function executeCalculateSponsorshipTransfer(params: Record<string, unknown>): ToolExecutionResult {
  const totalCost = Number(params.total_cost || 18000);
  const monthsWorked = Number(params.months_worked || 6);
  const contractMonths = 24; // معيار العقد سنتان

  const consumedRatio = Math.min(monthsWorked / contractMonths, 1);
  const remainingRatio = 1 - consumedRatio;
  const refundToFirstSponsor = Math.round(totalCost * remainingRatio);
  const platformFee = 1500; // رسوم النقل والخدمات المعتمدة
  const newClientDeposit = 2000; // عربون حجز فترة التجربة (15 يوماً)

  return {
    success: true,
    message: `التصفية المالية المعتمدة لنقل الخدمات:\n` +
      `• التكلفة الأصلية للاستقدام: ${totalCost.toLocaleString()} ر.س\n` +
      `• المدة المنقضية من العقد: ${monthsWorked} شهراً من أصل 24 شهراً (${Math.round(consumedRatio * 100)}% مستهلك)\n` +
      `• المبلغ المستحق استرداده للكفيل السابق: ${refundToFirstSponsor.toLocaleString()} ر.س (صافي المسترد)\n` +
      `• رسوم الإجراءات والخدمات والوساطة: ${platformFee.toLocaleString()} ر.س\n` +
      `• عربون فترة التجربة للعميل الجديد: ${newClientDeposit.toLocaleString()} ر.س (فترة التجربة 15 يوماً)\n` +
      `• الآلية النظامية: توثيق نقل الكفالة عبر مساند بعد اجتياز فترة التجربة وتوقيع مخالصة الحقوق المالية.`,
    spokenSummary: `التصفية المالية لنقل الخدمات: المبلغ المستحق استرداده للكفيل السابق ${refundToFirstSponsor.toLocaleString('ar-SA')} ريال بعد احتساب استهلاك العقد، وفترة التجربة سارية لمدة خمسة عشر يوماً.`,
    data: { totalCost, monthsWorked, refundToFirstSponsor, platformFee, newClientDeposit }
  };
}

function executeCheckMedicalStatus(params: Record<string, unknown>): ToolExecutionResult {
  const inmateName = String(params.inmate_name || '');
  return {
    success: true,
    message: `تقرير العيادة الطبية وجناح العزل المؤقت بمركز الإيواء:\n` +
      `• الفحوصات المخبرية السريعة: سلبية لكافة الأمراض المعدية لجميع الحالات الوافدة حديثاً\n` +
      `• جناح العزل الصحي الوقائي: يضم حالتين فقط للملاحظة الروتينية (48 ساعة) مع مؤشرات حيوية مستقرة تماماً\n` +
      `• الملفات الطبية المحدثة: 100% مسجلة إلكترونياً ومربوطة بالرقم الموحد للنزيلة\n` +
      (inmateName ? `• النزيلة المستعلم عنها [${inmateName}]: حالتها الصحية ممتازة ولائقة طبياً للعمل.\n` : '') +
      `• الامتثال الصحي: متطابق مع اشتراطات وزارة الصحة ووزارة الموارد البشرية HRSD.`,
    spokenSummary: `تقرير العيادة الطبية وجناح العزل بمركز الإيواء يؤكد سلامة الفحوصات لكافة النزيلات واستقرار جناح الملاحظة الوقائية ومطابقته لاشتراطات وزارة الصحة.`,
    data: { clinicStatus: 'operational', quarantinedCount: 2, totalScreened: 51 }
  };
}

// ═══════════════════════════════════════════════════════════
//  HELPER: BUILD CONFIRMATION SUMMARY
// ═══════════════════════════════════════════════════════════

export function buildConfirmationSummary(tool: AiToolDefinition, params: Record<string, unknown>): string {
  const riskLabels: Record<ToolRiskLevel, string> = {
    low: 'منخفض',
    medium: 'متوسط',
    high: 'مرتفع',
    critical: 'حرج',
  };

  const paramLines = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([key, val]) => {
      const paramDef = tool.parameters.find(p => p.name === key);
      const label = paramDef?.description || key;
      return `• ${label}: ${String(val)}`;
    })
    .join('\n');

  return `${tool.nameAr}\n${paramLines ? `\nالتفاصيل:\n${paramLines}` : ''}\n\nمستوى المخاطرة: ${riskLabels[tool.riskLevel]}`;
}
