import React, { useState, useRef, useEffect } from 'react';
import { useCompany } from '../../contexts/CompanyContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  X, Send, Mic, MicOff, Volume2, VolumeX, Sparkles, 
  ArrowLeft, Bot, MessageSquare, CheckCircle2, RefreshCw, Zap
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionButton?: {
    label: string;
    actionKey: string;
  };
}

export type AssistantPersona = 'faris' | 'noura';

interface AICopilotWidgetProps {
  onNavigate?: (tab: string, title: string) => void;
}

export const AICopilotWidget: React.FC<AICopilotWidgetProps> = ({ onNavigate }) => {
  const { activeCompany } = useCompany();
  const { currentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [persona, setPersona] = useState<AssistantPersona>(() => {
    return (localStorage.getItem('assistant_persona') as AssistantPersona) || 'faris';
  });
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => {
    return localStorage.getItem('faris_voice_enabled') === 'true';
  });
  const [isListening, setIsListening] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const getInitialWelcome = (p: AssistantPersona, compName: string) => {
    if (p === 'noura') {
      return `أهلاً بكِ عزيزتي! أنا "نُورة"، مرشدتكِ الرقمية الذكية لمجموعة خالد السليم.
يسعدني تقديم الإرشاد والمساعدة الفورية في خدمات الأقسام النسائية ومراكز الإيواء وبيانات ${compName} بأعلى درجات الخصوصية والموثوقية.`;
    }
    return `أهلاً بك! أنا "فارس"، مرشدك الرقمي الذكي لمجموعة خالد السليم.
يسعدني مساعدتك في استعراض بيانات ${compName}، تتبع عقود مساند، فحص جداول كميات كاس، أو مراجعة الحسابات والفوترة المشفرة ZATCA.`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: getInitialWelcome((localStorage.getItem('assistant_persona') as AssistantPersona) || 'faris', activeCompany.name),
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Listen to external triggers (e.g. from LandingPage or LoginPage)
  useEffect(() => {
    const handleOpenAssistant = (event: any) => {
      setIsOpen(true);
      if (event.detail?.persona && (event.detail.persona === 'faris' || event.detail.persona === 'noura')) {
        setPersona(event.detail.persona);
        localStorage.setItem('assistant_persona', event.detail.persona);
      }
      if (event.detail?.query) {
        handleSendMessage(event.detail.query);
      }
    };

    const handlePersonaChange = (event: any) => {
      if (event.detail?.persona && (event.detail.persona === 'faris' || event.detail.persona === 'noura')) {
        setPersona(event.detail.persona);
      }
    };

    window.addEventListener('open-faris-assistant', handleOpenAssistant);
    window.addEventListener('assistant-persona-changed', handlePersonaChange);
    return () => {
      window.removeEventListener('open-faris-assistant', handleOpenAssistant);
      window.removeEventListener('assistant-persona-changed', handlePersonaChange);
    };
  }, [activeCompany]);

  // Switch persona manually
  const switchPersona = (newPersona: AssistantPersona) => {
    if (newPersona === persona) return;
    setPersona(newPersona);
    localStorage.setItem('assistant_persona', newPersona);
    window.dispatchEvent(new CustomEvent('assistant-persona-changed', { detail: { persona: newPersona } }));

    const newGreeting = newPersona === 'noura'
      ? `أهلاً بكِ! تحولت المحادثة الآن إلى "نُورة" المرشدة الرقمية الذكية. يسعدني خدمتكِ ومساعدتكِ في كافة إجراءات المنظومة ومراكز الإيواء.`
      : `أهلاً بك! تحولت المحادثة الآن إلى "فارس" المرشد الرقمي الذكي. جاهز لمساعدتك في العمليات ومنافسات كاس والأنظمة المركزية.`;

    setMessages(prev => [
      ...prev,
      {
        id: `switch-${Date.now()}`,
        sender: 'ai',
        text: newGreeting,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    if (voiceEnabled) {
      speakText(newGreeting, newPersona);
    }
  };

  // Voice Speech Synthesis
  const speakText = (text: string, overridePersona?: AssistantPersona) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const currentPers = overridePersona || persona;
      // Strip bullet points and technical brackets for natural speech
      const cleanText = text
        .replace(/•/g, '')
        .replace(/\(.*?\)/g, '')
        .replace(/\[.*?\]/g, '')
        .replace(/\+/g, ' زائد ');
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ar-SA';

      // Select system Arabic voices
      const voices = window.speechSynthesis.getVoices();
      const arabicVoices = voices.filter(v => v.lang && v.lang.toLowerCase().includes('ar'));

      if (currentPers === 'noura') {
        utterance.pitch = 1.25;
        utterance.rate = 0.98;
        const femaleVoice = arabicVoices.find(v => {
          const n = v.name.toLowerCase();
          return n.includes('female') || n.includes('salma') || n.includes('zariyah') || 
                 n.includes('laila') || n.includes('fatima') || n.includes('zeina') || 
                 n.includes('hoda') || n.includes('mariam') || n.includes('sana') || n.includes('nour');
        }) || arabicVoices[1] || arabicVoices[0];

        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }
      } else {
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
        const maleVoice = arabicVoices.find(v => {
          const n = v.name.toLowerCase();
          return n.includes('male') || n.includes('maged') || n.includes('naayf') || 
                 n.includes('hamed') || n.includes('tarik') || n.includes('shakir');
        }) || arabicVoices[0];

        if (maleVoice) {
          utterance.voice = maleVoice;
        }
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  const toggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    localStorage.setItem('faris_voice_enabled', String(next));
    if (!next && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Speech Recognition (Voice Input)
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('خاصية الإملاء الصوتي غير مدعومة في متصفحك الحالي، يرجى استخدام متصفح Chrome أو Edge الحديث.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  // Dynamic Contextual Quick Prompts based on activeCompany & persona
  const getContextualPrompts = () => {
    if (persona === 'noura') {
      return [
        { label: '🏢 مراكز الإيواء والتسكين', query: 'ما هي الطاقة الاستيعابية وحالة النزيلات في مراكز الإيواء؟' },
        { label: '👩‍💼 كوادر الصفا والياقوت النسائية', query: 'أريد معرفة جاهزية الكوادر النسائية وعقود التشغيل المرن' },
        { label: '🩺 الرعاية الصحية والغذائية', query: 'ما هي مؤشرات الرعاية الصحية والغذائية للنزيلات في المراكز؟' },
        { label: '🛡️ حماية الخصوصية و HRSD', query: 'استعرض إجراءات حماية الخصوصية والامتثال لوزارة الموارد البشرية' },
      ];
    }

    const companyId = activeCompany.id;

    if (companyId === 'KAS' || companyId === 'kas') {
      return [
        { label: '📄 منصة اعتماد والمنافسات', query: 'ما هي أحدث منافسات منصة اعتماد المتاحة للمشاركة؟' },
        { label: '📊 محرر جداول الكميات BOQ', query: 'أريد مراجعة بنود وتسعير جدول كميات المنافسة الحالية' },
        { label: '🧾 الفوترة المشفرة ZATCA', query: 'ما هي حالة الامتثال للفوترة الإلكترونية المشفرة للمرحلة الثانية؟' },
        { label: '🤝 سجل الموردين والمقاولين', query: 'استعرض سجل الموردين المعتمدين لشركة كاس' },
      ];
    }

    if (companyId === 'SAF' || companyId === 'masi') {
      return [
        { label: '⏳ عقود مساند المتأخرة', query: 'ما هي العقود المتأخرة في مرحلة التأشيرة أو السفارة؟' },
        { label: '✈️ تتبع وصول العمالة', query: 'ما هي الرحلات المجدولة لوصول العمالة المنزلية هذا الأسبوع؟' },
        { label: '🛡️ بوالص التأمين الشاملة', query: 'ما هي حالة توثيق بوالص التأمين على عقود الاستقدام؟' },
        { label: '📑 تفويض إنجاز الفوري', query: 'كيف أقوم بإصدار تفويض إلكتروني فوري عبر إنجاز؟' },
      ];
    }

    if (companyId === 'YAQ' || companyId === 'yaqoot') {
      return [
        { label: '📋 عقود التأجير والتشغيل', query: 'أعطني إحصائية عقود التأجير الشهرية والسنوية السارية' },
        { label: '👥 جاهزية الكوادر والتشغيل', query: 'ما هو عدد الكوادر المهنية الجاهزة للتسليم للعملاء؟' },
        { label: '💰 سندات القبض والتحصيل', query: 'ما هي مبالغ التحصيل المستحقة هذا الشهر للياقوت؟' },
        { label: '🏢 باقات قطاع الأعمال', query: 'ما هي العروض والخصومات المتاحة للشركات والمصانع؟' },
      ];
    }

    if (companyId === 'TOP' || companyId === 'topaz') {
      return [
        { label: '📂 فرز السير الذاتية ATS', query: 'ما هي السير الذاتية المطابقة لمعايير التوظيف الذكي؟' },
        { label: '🌐 وكالات التوظيف في 14 دولة', query: 'ما هي حالة الربط مع الوكالات الخارجية في الفلبين وإندونيسيا؟' },
        { label: '⏱️ متوسط زمن التوظيف', query: 'ما هو مؤشر سرعة فرز وتوظيف الكفاءات في توب تالنت؟' },
      ];
    }

    // Default / All / Super Admin
    return [
      { label: '📊 ملخص الأداء المالي والسيولة', query: 'أعطني ملخص السيولة والأرباح المجمعة لشركات المجموعة' },
      { label: '⏳ عقود مساند وسير العمل', query: 'ما هي عقود مساند النشطة وحالة الربط مع الوزارة؟' },
      { label: '🇸🇦 نسبة التوطين وحماية الأجور', query: 'ما هي نسبة التوطين المعتمدة وحالة ملف WPS؟' },
      { label: '🏨 نسبة إشغال مراكز الإيواء', query: 'ما هي الطاقة الاستيعابية الشاغرة لأسرة مراكز الإيواء؟' },
      { label: '🏢 بوابة منافسات كاس', query: 'كيف أنتقل إلى البوابة المستقلة لشركة كاس؟' },
    ];
  };

  const handleSendMessage = (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Faris / Noura AI Contextual Reasoning Engine
    setTimeout(() => {
      let aiResponse = '';
      let actionBtn: { label: string; actionKey: string } | undefined = undefined;

      const lower = textToSend.toLowerCase();

      if (lower.includes('كاس') || lower.includes('اعتماد') || lower.includes('منافس') || lower.includes('boq') || lower.includes('كميات')) {
        aiResponse = `أهلاً بك! بالنسبة لشركة كاس للمنافسات والتشغيل:
• المنظومة مرتبطة مباشرة بسحابة منصة اعتماد الحكومية.
• يوجد حالياً 2,651+ منافسة مرصودة، منها 18 منافسة تحت دراسة الجدوى وتجهيز عروض الأسعار.
• محرر جداول الكميات الذكي (Live Excel BOQ) يدعم الحسابات الآلية والتفقيط المعتمد بالريال السعودي.
• الفوترة الإلكترونية مشفرة وممتثلة بنسبة 100% مع ZATCA المرحلة الثانية.`;
        actionBtn = { label: 'فتح جناح كاس للمنافسات (KAS Suite)', actionKey: 'kas-suite' };
      } else if (lower.includes('مالي') || lower.includes('سيولة') || lower.includes('أرباح') || lower.includes('دخل') || lower.includes('محاسب') || lower.includes('smacc')) {
        aiResponse = `بناءً على القيود المحاسبية لنظام SMACC لـ (${activeCompany.name}):
• إجمالي الإيرادات المحققة: 525,471.20 ر.س (نمو +14.8%)
• إجمالي المصروفات التشغيلية: 220,500.00 ر.س
• صافي الربح التشغيلي: 304,971.20 ر.س (هامش ربح قياسي 58%)
• رصيد أمانات مساند المعلقة (فترة التجربة 90 يوماً): 184,500.00 ر.س.`;
        actionBtn = { label: 'فتح الإدارة المالية و SMACC', actionKey: 'finance-home' };
      } else if (lower.includes('مساند') || lower.includes('استقدام') || lower.includes('تأشير') || lower.includes('سفار') || lower.includes('صفا')) {
        aiResponse = `حالة خط أنابيب استقدام الأفراد عبر مساند لشركة الصفا الماسي:
• يوجد حالياً 113 عقداً سارياً في مراحل المعالجة المختلفة.
• 4 عقود تجاوزت 45 يوماً في مرحلة السفارة (الفلبين وكينيا)، وتم إرسال تنبيهات تلقائية لمكاتب التوظيف.
• 12 تأشيرة جاهزة وموثقة لإصدار التفويض الإلكتروني عبر إنجاز.
• بوالص التأمين الشاملة مفعلة بنسبة امتثال 100%.`;
        actionBtn = { label: 'فتح خط أنابيب مساند (ATS Pipeline)', actionKey: 'ats-pipeline' };
      } else if (lower.includes('تأجير') || lower.includes('ياقوت') || lower.includes('تشغيل') || lower.includes('باقات')) {
        aiResponse = `حالة عقود التأجير والتشغيل المرن لشركة الياقوت الشرقية:
• إجمالي عقود الإيجار النشطة: 890+ عقد تشغيلي لقطاعي الأفراد والأعمال.
• الكوادر المهنية الجاهزة للتسليم الفوري: 45 كوادر متخصصة.
• نسبة سداد الفواتير الشهرية: 94.2% مع فوترة آلية مشفرة.`;
        actionBtn = { label: 'فتح عقود التأجير والتشغيل', actionKey: 'rent-contracts' };
      } else if (lower.includes('توظيف') || lower.includes('سير') || lower.includes('ats') || lower.includes('تالنت') || lower.includes('cv')) {
        aiResponse = `منظومة التوظيف الذكي و ATS لشركة توب تالنت الدولية:
• بنك السير الذاتية يضم 3,250+ سيرة ذاتية مفهرسة ذكياً مع ميزة الاستيراد بالدفعة.
• التكامل نشط مع مكاتب التوظيف في 14 دولة معتمدة.
• نظام الفرز الآلي يقلل زمن الاختيار بنسبة 68%.`;
        actionBtn = { label: 'فتح بنك السير الذاتية الذكي', actionKey: 'cv-bank' };
      } else if (lower.includes('إيواء') || lower.includes('سكن') || lower.includes('تغذية') || lower.includes('تسكين') || lower.includes('hrsd')) {
        aiResponse = `حالة مراكز الإيواء والتسكين المعتمدة من وزارة الموارد البشرية HRSD:
• الطاقة الاستيعابية الكلية: 120 سريراً موزعة على 4 أجنحة ضيافة.
• نسبة الإشغال الحالية: 42% (28 سريراً متاحاً لاستقبال حالات جديدة).
• الرعاية الغذائية والصحية: فحوصات يومية منتظمة وتوثيق كامل لمحاضر الاستلام.`;
        actionBtn = { label: 'فتح بوابة مراكز الإيواء والرعاية', actionKey: 'shelter' };
      } else if (lower.includes('توطين') || lower.includes('رواتب') || lower.includes('wps') || lower.includes('أجور') || lower.includes('قوى')) {
        aiResponse = `مؤشرات الموارد البشرية والامتثال لـ (${activeCompany.name}):
• نسبة التوطين المعتمدة: 78% (النطاق البلاتيني 🟢 وفق تصنيف قوى).
• مسير رواتب الشهر الحالي: 39,700.00 ر.س لعدد 4 موظفين.
• ملف حماية الأجور (WPS) جاهز ومدقق ومطابق بنسبة 100%.`;
        actionBtn = { label: 'فتح الموارد البشرية والرواتب', actionKey: 'hr' };
      } else if (lower.includes('zatca') || lower.includes('فاتورة') || lower.includes('ضريب') || lower.includes('زكاة') || lower.includes('qr')) {
        aiResponse = `حالة تكامل الفوترة الإلكترونية ZATCA (المرحلة الثانية - الربط والتكامل):
• التشفير المعتمد: معيار ECDSA مع خوارزمية SHA-256 وأختام التشفير الرقمية.
• الفواتير المصدرة: يتم ختمها بـ QR مشفر فورياً وإرسال كود XML للهيئة.
• نسبة الامتثال الضريبي لشركات المجموعة: 100%.`;
        actionBtn = { label: 'فتح بوابة الفوترة المشفرة ZATCA', actionKey: 'zatca-hub' };
      } else {
        aiResponse = persona === 'noura'
          ? `أهلاً بكِ عزيزتي! تم استلام استفساركِ: "${textToSend}".
أنا "نُورة" مرشدتكِ الذكية، ومهمتي مرافقتكِ وتوجيهكِ في إدارة الأقسام النسائية ومراكز الإيواء والتسكين وكافة قطاعات المجموعة بأعلى موثوقية وخصوصية.
اختاري القسم أو الخدمة التي تودين الوصول إليها وسأرشدكِ فوراً.`
          : `أهلاً بك! تم استلام طلبك: "${textToSend}".
أنا "فارس" مرشدك الذكي، ومهمتي توجيهك ومساعدتك في إدارة كافة قطاعات المجموعة (الصفا الماسي للاستقدام، الياقوت للتشغيل والتأجير، توب تالنت للـ ATS، كاس للمنافسات واعتماد، ومراكز الإيواء).
اختر القسم الذي تود الانتقال إليه وسأقوم بنقلك فوراً.`;
        actionBtn = { label: persona === 'noura' ? 'فتح بوابة مراكز الإيواء والرعاية' : 'فتح مركز القيادة والتحكم الموحد', actionKey: persona === 'noura' ? 'shelter' : 'group-command' };
      }

      const newAiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        actionButton: actionBtn,
      };

      setMessages(prev => [...prev, newAiMsg]);
      setIsTyping(false);

      // Speak response if voice is active
      speakText(aiResponse);
    }, 700);
  };

  return (
    <>
      {/* 1. Floating Faris Trigger Button (With 3D Avatar & Live Status) */}
      <div 
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        {/* Floating Greeting Tooltip */}
        {!isOpen && showTooltip && (
          <div
            onClick={() => setIsOpen(true)}
            className="speech-bubble-anim"
            style={{
              marginBottom: '10px',
              padding: '8px 14px',
              background: '#ffffff',
              border: '1px solid #e4e4e7',
              borderRadius: '16px',
              boxShadow: '0 10px 25px -4px rgba(0, 0, 0, 0.12)',
              fontSize: '12px',
              fontWeight: 700,
              color: '#091725',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              direction: 'rtl',
              whiteSpace: 'nowrap',
            }}
          >
            <span className="live-pulse-dot" />
            <span>{persona === 'noura' ? 'نُورة جاهزة لمساعدتكِ!' : 'فارس جاهز لمساعدتك!'}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#a1a1aa',
                cursor: 'pointer',
                padding: '0 2px',
                fontSize: '12px'
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* The 3D Mascot Circular Trigger Button */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setShowTooltip(false);
          }}
          aria-label={persona === 'noura' ? 'تحدث مع نُورة' : 'تحدث مع فارس'}
          style={{
            position: 'relative',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ffffff 0%, #fbfbf5 100%)',
            border: '2.5px solid #CFA64A',
            boxShadow: '0 12px 30px -4px rgba(207, 166, 74, 0.35), 0 4px 12px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            padding: 0,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: isOpen ? 'scale(0.95)' : 'scale(1)',
          }}
        >
          {isOpen ? (
            <div 
              style={{
                width: '100%',
                height: '100%',
                background: '#091725',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <X className="w-6 h-6 text-amber-400" />
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center pt-1 overflow-hidden">
              <img
                src={persona === 'noura' ? '/noura.png' : '/mascot.png'}
                alt={persona === 'noura' ? 'نُورة - المرشدة الرقمية الذكية' : 'فارس - المساعد الرقمي الذكي'}
                className="w-14 h-14 object-contain object-top drop-shadow-md transition-transform hover:scale-110"
              />
              {/* Online Green Indicator Dot */}
              <span 
                style={{
                  position: 'absolute',
                  bottom: '3px',
                  right: '6px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  border: '2px solid #ffffff',
                  boxShadow: '0 0 6px #10B981',
                }}
              />
            </div>
          )}
        </button>
      </div>

      {/* 2. Executive White Chat Drawer / Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '96px',
            left: '24px',
            width: '430px',
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: '640px',
            height: '84vh',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 24px 60px -8px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.05)',
            border: '1.5px solid rgba(207, 166, 74, 0.4)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'var(--font-family-ui)',
            direction: 'rtl',
            animation: 'speechBubbleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Header - Luxury White with Champagne Gold */}
          <div
            style={{
              padding: '12px 16px',
              background: 'linear-gradient(to bottom, #ffffff, #faf8f5)',
              borderBottom: '1px solid #e4e4e7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '14px',
                  background: '#fefce8',
                  border: '1.5px solid #CFA64A',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(207, 166, 74, 0.2)'
                }}
              >
                <img
                  src={persona === 'noura' ? '/noura.png' : '/mascot.png'}
                  alt={persona === 'noura' ? 'نُورة' : 'فارس'}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: 800, color: '#091725' }}>
                    {persona === 'noura' ? 'نُورة • المرشدة الرقمية' : 'فارس • المرشد الرقمي'}
                  </h4>
                  <span className="live-pulse-dot" />
                </div>
                <span style={{ fontSize: '10.5px', color: '#71717a', display: 'block', marginTop: '1px' }}>
                  {persona === 'noura' ? 'الأقسام النسائية ومراكز الإيواء • توجيه معتمد' : `${activeCompany.name} • دعم مباشر وتوجيه فوري`}
                </span>
              </div>
            </div>

            {/* Action Buttons: Persona Switcher, Voice Toggle & Close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Persona Switcher Pill [ 👨 فارس | 👩 نُورة ] */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#f4f4f5',
                  borderRadius: '9999px',
                  padding: '2px',
                  border: '1px solid #e4e4e7',
                }}
              >
                <button
                  type="button"
                  onClick={() => switchPersona('faris')}
                  title="التبديل إلى فارس"
                  style={{
                    padding: '3px 7px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: persona === 'faris' ? '#ffffff' : 'transparent',
                    color: persona === 'faris' ? '#091725' : '#71717a',
                    fontSize: '10.5px',
                    fontWeight: persona === 'faris' ? 800 : 600,
                    boxShadow: persona === 'faris' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  👨 فارس
                </button>
                <button
                  type="button"
                  onClick={() => switchPersona('noura')}
                  title="التبديل إلى نُورة"
                  style={{
                    padding: '3px 7px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: persona === 'noura' ? '#ffffff' : 'transparent',
                    color: persona === 'noura' ? '#b45309' : '#71717a',
                    fontSize: '10.5px',
                    fontWeight: persona === 'noura' ? 800 : 600,
                    boxShadow: persona === 'noura' ? '0 1px 3px rgba(207, 166, 74, 0.25)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  👩 نُورة
                </button>
              </div>

              <button
                type="button"
                onClick={toggleVoice}
                title={voiceEnabled ? 'تعطيل القراءة الصوتية' : 'تفعيل القراءة الصوتية بالذكاء الاصطناعي'}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  background: voiceEnabled ? '#fefce8' : 'transparent',
                  border: voiceEnabled ? '1px solid #CFA64A' : 'none',
                  color: voiceEnabled ? '#b45309' : '#71717a',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="إغلاق"
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: 'none',
                  color: '#71717a',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Chips Bar */}
          <div
            style={{
              padding: '9px 14px',
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            {getContextualPrompts().map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(qp.query)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#091725',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#CFA64A';
                  e.currentTarget.style.background = '#fefce8';
                  e.currentTarget.style.color = '#b45309';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.color = '#091725';
                }}
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Section */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              backgroundColor: '#fafafa',
            }}
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-start' : 'flex-end',
                  maxWidth: '88%',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'flex-start',
                }}
              >
                {/* Assistant Avatar next to AI messages */}
                {msg.sender === 'ai' && (
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#fefce8',
                      border: '1px solid #CFA64A',
                      flexShrink: 0,
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2px',
                    }}
                  >
                    <img
                      src={persona === 'noura' ? '/noura.png' : '/mascot.png'}
                      alt={persona === 'noura' ? 'نُورة' : 'فارس'}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background: msg.sender === 'user' 
                        ? '#091725' 
                        : '#ffffff',
                      color: msg.sender === 'user' ? '#ffffff' : '#091725',
                      border: msg.sender === 'user' ? 'none' : '1px solid #e4e4e7',
                      fontSize: '12.5px',
                      lineHeight: '1.65',
                      whiteSpace: 'pre-wrap',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                  >
                    {msg.text}
                  </div>

                  {/* Direct Action Button */}
                  {msg.actionButton && onNavigate && (
                    <button
                      type="button"
                      onClick={() => {
                        if (msg.actionButton) {
                          onNavigate(msg.actionButton.actionKey, msg.actionButton.label);
                          setIsOpen(false);
                        }
                      }}
                      style={{
                        alignSelf: 'flex-start',
                        marginTop: '4px',
                        padding: '7px 14px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #CFA64A 0%, #b38938 100%)',
                        color: '#000000',
                        fontWeight: 800,
                        fontSize: '11px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 10px rgba(207, 166, 74, 0.3)',
                        transition: 'transform 0.2s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>{msg.actionButton.label}</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Timestamp & Speech Read Action */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      padding: '0 4px',
                    }}
                  >
                    <span style={{ fontSize: '10px', color: '#a1a1aa' }}>
                      {msg.timestamp}
                    </span>

                    {msg.sender === 'ai' && (
                      <button
                        type="button"
                        onClick={() => speakText(msg.text)}
                        title="استمع للإجابة بالصوت"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#71717a',
                          cursor: 'pointer',
                          fontSize: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          padding: 0,
                        }}
                      >
                        <Volume2 className="w-3 h-3 text-amber-600" />
                        <span>استمع</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div
                style={{
                  alignSelf: 'flex-end',
                  padding: '10px 16px',
                  borderRadius: '18px',
                  background: '#ffffff',
                  border: '1px solid #e4e4e7',
                  color: '#71717a',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                }}
              >
                <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                <span>{persona === 'noura' ? 'نُورة تحلل السجلات وتستخرج البيانات...' : 'فارس يحلل السجلات ويستخرج البيانات...'}</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input & Voice Controls Form */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: '12px 14px',
              background: '#ffffff',
              borderTop: '1px solid #e4e4e7',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {/* Voice Dictation Button */}
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? 'إيقاف الاستماع' : (persona === 'noura' ? 'تحدثي بالمايكروفون إلى نُورة' : 'تحدث بالمايكروفون إلى فارس')}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: isListening ? '#ef4444' : '#f4f4f5',
                color: isListening ? '#ffffff' : '#52525b',
                border: isListening ? 'none' : '1px solid #e4e4e7',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              {isListening ? <MicOff className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Input Text Box */}
            <input
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder={isListening ? 'جاري الاستماع لصوتك الآن...' : (persona === 'noura' ? 'اكتبي استفساركِ أو اطلبي إجراءً من نُورة...' : 'اكتب سؤالك أو اطلب إجراءً من فارس...')}
              style={{
                flex: 1,
                padding: '9px 14px',
                borderRadius: '12px',
                border: isListening ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                background: isListening ? '#fef2f2' : '#ffffff',
                fontSize: '13px',
                outline: 'none',
                color: '#091725',
              }}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              title="إرسال"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: inputQuery.trim() ? '#091725' : '#e4e4e7',
                color: inputQuery.trim() ? '#CFA64A' : '#a1a1aa',
                border: 'none',
                cursor: inputQuery.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AICopilotWidget;

