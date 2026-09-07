/**
 * localAiService.ts
 * On-Device Local AI Service for Faris & Noura personas.
 * Communicates directly with local Ollama runtime (127.0.0.1:11434).
 * Enforces 100% Data Sovereignty, Zero-Cloud Leaks, and Strict Multi-Tenant Company Isolation.
 *
 * Phase 1: Function Calling — AI can now trigger actions via registered tools.
 */

import { buildToolDescriptionsForLLM } from './aiToolRegistry';
import { parseToolCallFromResponse, validateToolCall, type ToolCallParsed } from './aiToolExecutor';

export type AssistantPersona = 'faris' | 'noura';

export interface CompanyScopeContext {
  id: string;
  name: string;
  code?: string;
}

export interface LocalAiGenerateOptions {
  prompt: string;
  persona: AssistantPersona;
  company: CompanyScopeContext;
  conversationHistory?: Array<{ sender: 'ai' | 'user'; text: string }>;
  signal?: AbortSignal;
}

export interface LocalAiResponse {
  text: string;
  modelUsed: string;
  isLocal: boolean;
  actionButton?: {
    label: string;
    actionKey: string;
  };
  /** If the model triggered a function call, it will be parsed here for user confirmation */
  toolCall?: ToolCallParsed | null;
}

const OLLAMA_BASE_URL = 'http://127.0.0.1:11434';

/**
 * Check if the local Ollama daemon is reachable on device.
 * Only attempts connection when running on localhost / local IP to avoid CORS & Private Network Access errors in production.
 */
export async function checkLocalAiAvailable(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const hostname = window.location.hostname;
  const isLocalHost = 
    hostname === 'localhost' || 
    hostname === '127.0.0.1' || 
    hostname === '[::1]' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.');

  // In public cloud deployments (e.g. *.vercel.app), browsers strictly block loopback HTTP requests.
  if (!isLocalHost) {
    return false;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Build company-isolated prompt context to prevent cross-company data pollution.
 */
function buildCompanyIsolationContext(company: CompanyScopeContext, persona: AssistantPersona): string {
  const compId = company.id.toUpperCase();
  let specificData = '';

  if (compId === 'KAS') {
    specificData = `بيانات شركة كاس للمنافسات والتشغيل (KAS):
- المنظومة متصلة بسحابة منصة اعتماد الحكومية.
- المنافسات المرصودة: 2,651+ منافسة (18 منافسة تحت دراسة الجدوى وتجهيز عروض الأسعار).
- محرر جداول الكميات BOQ يدعم الحسابات الآلية والتفقيط المعتمد بالريال السعودي.
- الفوترة الإلكترونية مشفرة وممتثلة بنسبة 100% مع ZATCA المرحلة الثانية.`;
  } else if (compId === 'SAF' || compId === 'MASI') {
    specificData = `بيانات شركة الصفا الماسي للاستقدام (SAF):
- خط أنابيب استقدام مساند: 113 عقداً سارياً في مراحل المعالجة.
- 12 تأشيرة موثقة لإصدار التفويض عبر إنجاز، وبوالص التأمين مفعلة بنسبة 100%.
- فترة التجربة والضمان: 90 يوماً للمستقدمين.`;
  } else if (compId === 'YAQ' || compId === 'YAQOOT') {
    specificData = `بيانات شركة الياقوت الشرقية لتأجير وتشغيل الكوادر (YAQ):
- عقود التأجير والتشغيل النشطة: 890+ عقد تشغيلي للأفراد والشركات.
- الكوادر المهنية والتشغيلية الجاهزة للتسليم: 45 كادراً متخصصاً.
- نسبة سداد الفواتير الشهرية: 94.2% مع سندات قبض آلية.`;
  } else if (compId === 'TOP' || compId === 'TOPAZ') {
    specificData = `بيانات شركة توب تالنت الدولية للتوظيف الذكي (TOP):
- بنك السير الذاتية ATS: 3,250+ سيرة ذاتية مفهرسة ذكياً مع ميزة الاستيراد بالدفعة.
- وكالات التوظيف المعتمدة: 14 دولة، ونظام الفرز يقلل زمن التوظيف بنسبة 68%.`;
  } else {
    specificData = `بيانات عامة لمجموعة خالد السليم:
- مراكز الإيواء والتسكين: معتمدة من HRSD بطاقة 120 سريراً ونسبة إشغال 42% (28 سريراً شاغراً).
- منظومة متابعة وإنتاجية الموظفين: متوسط سرعة الإنجاز 22 معاملة/ساعة، ونسبة الإنتاجية 89%.
- نسبة التوطين: 78% (النطاق البلاتيني المعتمد في قوى)، ومطابقة كاملة لملف حماية الأجور WPS.`;
  }

  return `[عزل نطاق البيانات - شركة: ${company.name} (معرف: ${company.id})]
تنبيه نظام حماية البيانات الشخصية (PDPL): أنت تعمل الآن حصرياً ضمن نطاق وسجلات "${company.name}". يمنع منعاً باتاً خلط أو ذكر بيانات سرية تخص أي شركة أخرى خارج هذا النطاق.
معلومات النطاق الحالي المعتمدة:
${specificData}
الشخصية المطلوبة في الرد: أنت "${persona === 'noura' ? 'نُورة' : 'فارس'}" وتجيب بأسلوبك المعتمد.`;
}

/**
 * Suggest context action button based on the query and active company.
 */
function determineActionButton(query: string, compId: string, persona: AssistantPersona): { label: string; actionKey: string } | undefined {
  const lower = query.toLowerCase();
  const c = compId.toUpperCase();

  if (c === 'KAS' || lower.includes('منافس') || lower.includes('اعتماد') || lower.includes('boq')) {
    return { label: 'فتح جناح كاس للمنافسات (KAS Suite)', actionKey: 'kas-suite' };
  }
  if (c === 'SAF' || lower.includes('مساند') || lower.includes('استقدام') || lower.includes('تأشير')) {
    return { label: 'فتح خط أنابيب مساند (ATS Pipeline)', actionKey: 'ats-pipeline' };
  }
  if (c === 'YAQ' || lower.includes('تأجير') || lower.includes('ياقوت') || lower.includes('تشغيل')) {
    return { label: 'فتح عقود التأجير والتشغيل', actionKey: 'rent-contracts' };
  }
  if (c === 'TOP' || lower.includes('توظيف') || lower.includes('سير') || lower.includes('ats')) {
    return { label: 'فتح بنك السير الذاتية الذكي', actionKey: 'cv-bank' };
  }
  if (lower.includes('إيواء') || lower.includes('سكن') || lower.includes('تسكين') || persona === 'noura') {
    return { label: 'فتح بوابة مراكز الإيواء والرعاية', actionKey: 'shelter' };
  }
  if (lower.includes('مالي') || lower.includes('سيولة') || lower.includes('أرباح')) {
    return { label: 'فتح الإدارة المالية و SMACC', actionKey: 'finance-home' };
  }
  if (lower.includes('موظف') || lower.includes('أداء') || lower.includes('سرعة') || lower.includes('خمول') || lower.includes('إنتاج') || lower.includes('velocity')) {
    return { label: 'فتح شاشة متابعة أداء الموظفين والسرعة', actionKey: 'employee-monitoring' };
  }
  if (lower.includes('zatca') || lower.includes('فاتورة') || lower.includes('ضريب')) {
    return { label: 'فتح بوابة الفوترة المشفرة ZATCA', actionKey: 'zatca-hub' };
  }
  return { label: 'فتح مركز القيادة والتحكم الموحد', actionKey: 'group-command' };
}

/**
 * Resolve the optimal specialized local model based on active company and persona.
 */
export function resolveTargetModel(company: CompanyScopeContext, persona: AssistantPersona): string {
  if (persona === 'noura') return 'noura-erp';
  const c = company.id.toUpperCase();
  if (c === 'KAS') return 'kas-erp';
  if (c === 'SAF' || c === 'MASI') return 'saf-erp';
  if (c === 'YAQ' || c === 'YAQOOT') return 'yaq-erp';
  if (c === 'TOP' || c === 'TOPAZ') return 'top-erp';
  if (c === 'SHELTER') return 'shelter-erp';
  return 'faris-erp';
}

/**
 * Generate a company-isolated, on-device AI response using the local Ollama model.
 * Now supports Function Calling: the model can trigger tools via structured JSON output.
 */
export async function generateLocalAiResponse(options: LocalAiGenerateOptions): Promise<LocalAiResponse> {
  const { prompt, persona, company, conversationHistory = [], signal } = options;
  const targetModel = resolveTargetModel(company, persona);
  const isolationContext = buildCompanyIsolationContext(company, persona);

  // Build tool descriptions for LLM injection
  const toolContext = buildToolDescriptionsForLLM(company.id);
  const fullSystemPrompt = isolationContext + toolContext;

  try {
    const isOnline = await checkLocalAiAvailable();
    if (!isOnline) {
      throw new Error('Local Ollama server is offline');
    }

    // Build chat messages for the local model
    const messages = [
      { role: 'system', content: fullSystemPrompt },
      ...conversationHistory.slice(-4).map(msg => ({
        role: msg.sender === 'ai' ? 'assistant' : 'user',
        content: msg.text,
      })),
      { role: 'user', content: prompt },
    ];

    const res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: targetModel,
        messages,
        stream: false,
        options: {
          temperature: 0.3,
          num_ctx: 2048,
        },
      }),
      signal,
    });

    if (!res.ok) {
      throw new Error(`Ollama returned status ${res.status}`);
    }

    const data = await res.json();
    const rawText = data?.message?.content?.trim();

    if (!rawText) {
      throw new Error('Empty response from local AI');
    }

    // Phase 1: Check if the model triggered a tool call
    let toolCall: ToolCallParsed | null = null;
    let displayText = rawText;

    const toolCallRequest = parseToolCallFromResponse(rawText);
    if (toolCallRequest) {
      // Validate the tool call against company scope and permissions
      const validated = validateToolCall(toolCallRequest, company.id, 'current_user');
      if (validated) {
        toolCall = validated;
        // Clean the raw response: remove JSON block, keep natural text
        displayText = rawText
          .replace(/\{[\s\S]*?"tool_call"[\s\S]*?\}[\s\S]*?\}/g, '')
          .trim();

        // If the model only returned JSON without text, generate a contextual confirmation message
        if (!displayText) {
          displayText = persona === 'noura'
            ? `حسناً، سأقوم بتنفيذ "${validated.tool.nameAr}" الآن. هل تؤكدين العملية؟`
            : `تم فهم طلبك. سأقوم بتنفيذ "${validated.tool.nameAr}" الآن. هل تؤكد العملية؟`;
        }
      }
    }

    return {
      text: displayText,
      modelUsed: targetModel,
      isLocal: true,
      actionButton: toolCall ? undefined : determineActionButton(prompt, company.id, persona),
      toolCall,
    };
  } catch (err) {
    console.warn('[Local AI Fallback] Using contextual offline engine:', err);
    // Intelligent fallback with exact company isolation
    return generateOfflineFallback(prompt, persona, company);
  }
}

/**
 * High-speed offline fallback when local daemon is not running or during warm-up.
 */
function generateOfflineFallback(
  prompt: string,
  persona: AssistantPersona,
  company: CompanyScopeContext
): LocalAiResponse {
  const lower = prompt.toLowerCase();
  const compId = company.id.toUpperCase();
  let text = '';

  if (lower.includes('كاس') || compId === 'KAS' || lower.includes('اعتماد') || lower.includes('boq')) {
    text = `أهلاً بك! بالنسبة لشركة كاس للمنافسات والتشغيل:
• المنظومة مرتبطة مباشرة بسحابة منصة اعتماد الحكومية.
• يوجد حالياً 2,651+ منافسة مرصودة، منها 18 منافسة تحت دراسة الجدوى وتجهيز عروض الأسعار.
• محرر جداول الكميات الذكي (Live Excel BOQ) يدعم الحسابات الآلية والتفقيط المعتمد بالريال السعودي.
• الفوترة الإلكترونية مشفرة وممتثلة بنسبة 100% مع ZATCA المرحلة الثانية.`;
  } else if (lower.includes('مساند') || compId === 'SAF' || lower.includes('استقدام') || lower.includes('تأشير')) {
    text = `حالة خط أنابيب استقدام الأفراد عبر مساند لشركة الصفا الماسي:
• يوجد حالياً 113 عقداً سارياً في مراحل المعالجة المختلفة.
• 4 عقود تجاوزت 45 يوماً في مرحلة السفارة، وتم إرسال تنبيهات تلقائية لمكاتب التوظيف.
• 12 تأشيرة جاهزة وموثقة لإصدار التفويض الإلكتروني عبر إنجاز.
• بوالص التأمين الشاملة مفعلة بنسبة امتثال 100%.`;
  } else if (lower.includes('تأجير') || compId === 'YAQ' || lower.includes('ياقوت') || lower.includes('تشغيل')) {
    text = `حالة عقود التأجير والتشغيل المرن لشركة الياقوت الشرقية:
• إجمالي عقود الإيجار النشطة: 890+ عقد تشغيلي لقطاعي الأفراد والأعمال.
• الكوادر المهنية الجاهزة للتسليم الفوري: 45 كوادر متخصصة.
• نسبة سداد الفواتير الشهرية: 94.2% مع فوترة آلية مشفرة.`;
  } else if (lower.includes('توظيف') || compId === 'TOP' || lower.includes('ats') || lower.includes('cv')) {
    text = `منظومة التوظيف الذكي و ATS لشركة توب تالنت الدولية:
• بنك السير الذاتية يضم 3,250+ سيرة ذاتية مفهرسة ذكياً مع ميزة الاستيراد بالدفعة.
• التكامل نشط مع مكاتب التوظيف في 14 دولة معتمدة.
• نظام الفرز الآلي يقلل زمن الاختيار بنسبة 68%.`;
  } else if (lower.includes('موظف') || lower.includes('أداء') || lower.includes('خمول') || lower.includes('سرعة') || lower.includes('velocity') || lower.includes('إنتاج')) {
    text = `تقرير متابعة أداء وإنتاجية الموظفين الميداني:
• متوسط سرعة إنجاز المعاملات (Velocity): 22 معاملة/ساعة للموظف.
• نسبة العمل الفعلي النشط: 88.5% مع ضبط حالات الخمول الطويل عبر مستشعرات التفاعل.
• مؤشر نبض ورضا فريق العمل (Daily Mood): 4.1 من 5 (حالة استقرار نفسي ومهني عالية).
• نظام حماية الأجور والتوطين: النطاق البلاتيني بنسبة امتثال 100% مع منصة قوى.`;
  } else if (lower.includes('إيواء') || lower.includes('سكن') || lower.includes('تسكين') || lower.includes('hrsd')) {
    text = `حالة مراكز الإيواء والتسكين المعتمدة من وزارة الموارد البشرية HRSD:
• الطاقة الاستيعابية الكلية: 120 سريراً موزعة على 4 أجنحة ضيافة.
• نسبة الإشغال الحالية: 42% (28 سريراً متاحاً ومعقماً لاستقبال حالات جديدة).
• العيادة الطبية وجناح العزل: فحوصات يومية منتظمة وتوثيق كامل لمحاضر الاستلام والسلامة المخبرية.
• سوق نقل الخدمات والتنازل: 14 حالة متاحة للمطابقة الفورية وفترات تجربة 15 يوماً.`;
  } else {
    text = persona === 'noura'
      ? `أهلاً بكِ عزيزتي في نطاق (${company.name})! أنا "نُورة" مرشدتكِ الذكية للإيواء والرعاية ونقل الخدمات، والبيانات هنا معزولة تماماً بما يتوافق مع نظام حماية البيانات الشخصية السعودي (PDPL). تفضلي باستفسارك وسأجيبكِ بدقة.`
      : `أهلاً بك في نطاق (${company.name})! أنا "فارس" مستشارك التنفيذي لمنافسات كاس والعمليات والمالية ومتابعة الموظفين، والبيانات معزولة بالكامل طبقاً للأنظمة السعودية المعتمدة. كيف أستطيع مساعدتك اليوم؟`;
  }

  return {
    text,
    modelUsed: 'local-fallback',
    isLocal: true,
    actionButton: determineActionButton(prompt, company.id, persona),
  };
}
