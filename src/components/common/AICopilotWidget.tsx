import React, { useState, useRef, useEffect } from 'react';
import { useCompany } from '../../contexts/CompanyContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  X, Send, Mic, MicOff, Volume2, VolumeX, Sparkles, 
  ArrowLeft, Bot, MessageSquare, CheckCircle2, RefreshCw, Zap,
  Minimize2
} from 'lucide-react';
import { playPersonaSwitchGreeting, playPersonaChime, speakDynamicSpeech, stopAllAudio } from '../../services/audioVoiceService';
import { generateLocalAiResponse, checkLocalAiAvailable } from '../../services/localAiService';

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
    const saved = localStorage.getItem('faris_voice_enabled');
    return saved !== 'false'; // Default to true so voice works out of the box
  });
  const [isDocked, setIsDocked] = useState<boolean>(() => {
    return localStorage.getItem('assistant_mascot_docked') === 'true';
  });
  const [wakeWordEnabled, setWakeWordEnabled] = useState<boolean>(() => {
    return localStorage.getItem('assistant_wake_word_enabled') === 'true';
  });
  const [isListening, setIsListening] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [isLocalAiOnline, setIsLocalAiOnline] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const wakeRecognitionRef = useRef<any>(null);

  // Monitor local AI daemon availability
  useEffect(() => {
    checkLocalAiAvailable().then(avail => setIsLocalAiOnline(avail));
    const interval = setInterval(() => {
      checkLocalAiAvailable().then(avail => setIsLocalAiOnline(avail));
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Pre-load browser voices on component mount
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

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

  // Listen to external triggers (e.g. from LandingPage or LoginPage or Header)
  useEffect(() => {
    const handleOpenAssistant = (event: any) => {
      setIsDocked(false);
      localStorage.setItem('assistant_mascot_docked', 'false');
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

  // Global Hotkeys: Ctrl+Space to summon/toggle, Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.code === 'Space' || e.key === ' ')) {
        e.preventDefault();
        setIsDocked(false);
        localStorage.setItem('assistant_mascot_docked', 'false');
        setIsOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        if (isOpen) {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Voice Wake-Word Detection ("يا فارس" / "يا نُورة")
  useEffect(() => {
    if (!wakeWordEnabled) {
      if (wakeRecognitionRef.current) {
        try {
          wakeRecognitionRef.current.stop();
        } catch (_) {}
        wakeRecognitionRef.current = null;
      }
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) return;

    let rec: any;
    let isCancelled = false;

    const startWake = () => {
      if (isCancelled) return;
      try {
        rec = new SpeechRec();
        rec.lang = 'ar-SA';
        rec.continuous = true;
        rec.interimResults = true;

        rec.onresult = (event: any) => {
          const lastRes = event.results[event.results.length - 1];
          const text = (lastRes[0]?.transcript || '').trim().toLowerCase();

          const calledFaris = text.includes('فارس') || text.includes('يا فارس');
          const calledNoura = text.includes('نورة') || text.includes('نوره') || text.includes('يا نورة') || text.includes('يا نوره');
          const calledGeneral = text.includes('يا مرشد') || text.includes('يا مساعد');

          if (calledFaris || calledNoura || calledGeneral) {
            const targetPersona = calledNoura ? 'noura' : calledFaris ? 'faris' : persona;
            if (targetPersona !== persona) {
              setPersona(targetPersona);
              localStorage.setItem('assistant_persona', targetPersona);
              window.dispatchEvent(new CustomEvent('assistant-persona-changed', { detail: { persona: targetPersona } }));
            }
            setIsDocked(false);
            localStorage.setItem('assistant_mascot_docked', 'false');
            setIsOpen(true);

            const wakeGreeting = targetPersona === 'noura'
              ? 'لبيكِ يا عزيزتي! أنا نُورة معكِ، تفضلي بسؤالكِ.'
              : 'لبيك! أنا فارس معك، تفضل بسؤالك.';
            speakText(wakeGreeting, targetPersona, true);
          }
        };

        rec.onerror = (err: any) => {
          if (err.error === 'not-allowed') {
            setWakeWordEnabled(false);
            localStorage.setItem('assistant_wake_word_enabled', 'false');
          }
        };

        rec.onend = () => {
          if (!isCancelled && wakeWordEnabled) {
            setTimeout(() => {
              if (!isCancelled && wakeWordEnabled) {
                try {
                  rec.start();
                } catch (_) {}
              }
            }, 1000);
          }
        };

        wakeRecognitionRef.current = rec;
        rec.start();
      } catch (e) {
        console.warn('Wake word init error:', e);
      }
    };

    startWake();

    return () => {
      isCancelled = true;
      if (wakeRecognitionRef.current) {
        try {
          wakeRecognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, [wakeWordEnabled, persona]);

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

    // Force speech playback so the user immediately hears the new persona's voice!
    playPersonaSwitchGreeting(newPersona);
  };

  // Voice Speech Synthesis Engine
  const speakText = (text: string, overridePersona?: AssistantPersona, force = false) => {
    if (!voiceEnabled && !force) return;
    const currentPers = overridePersona || persona;
    playPersonaChime(currentPers);
    speakDynamicSpeech(text, currentPers, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const toggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    localStorage.setItem('faris_voice_enabled', String(next));
    if (!next) {
      stopAllAudio();
    } else {
      playPersonaSwitchGreeting(persona);
    }
  };

  // Voice Wake-Word Listener Toggle (المناداة: يا فارس / يا نُورة)
  const toggleWakeWord = () => {
    const next = !wakeWordEnabled;
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (next && !SpeechRec) {
      alert('خاصية المناداة الصوتية الذكية تتطلب متصفحاً يدعم الميكروفون مثل Google Chrome أو Microsoft Edge.');
      return;
    }
    setWakeWordEnabled(next);
    localStorage.setItem('assistant_wake_word_enabled', String(next));
    if (next) {
      const intro = persona === 'noura'
        ? 'تم تفعيل الاستماع للمناداة. يمكنكِ مناداتي في أي وقت بقولكِ: يا نُورة.'
        : 'تم تفعيل الاستماع للمناداة. يمكنك مناداتي في أي وقت بقولك: يا فارس.';
      speakText(intro, persona, true);
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

  const handleSendMessage = async (queryText?: string) => {
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

    try {
      // Execute company-scoped inference on local model (faris-erp / noura-erp)
      const aiRes = await generateLocalAiResponse({
        prompt: textToSend,
        persona,
        company: {
          id: activeCompany.id,
          name: activeCompany.name,
          code: (activeCompany as any).code,
        },
        conversationHistory: messages.map(m => ({ sender: m.sender, text: m.text })),
      });

      const newAiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiRes.text,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        actionButton: aiRes.actionButton,
      };

      setMessages(prev => [...prev, newAiMsg]);
      setIsTyping(false);

      // Speak response out loud automatically using persona's voice!
      speakText(aiRes.text, persona);
    } catch (err) {
      console.error('[AI Copilot] Inference error:', err);
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* 1. Docked Edge Pill Tab (When minimized/docked) */}
      {isDocked && !isOpen && (
        <div
          className="dock-pill-slide-in"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            zIndex: 9999,
            direction: 'rtl',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setIsDocked(false);
              localStorage.setItem('assistant_mascot_docked', 'false');
            }}
            className="group flex items-center gap-2.5 px-3.5 py-2 bg-white/95 backdrop-blur-md border border-amber-300/80 rounded-full shadow-lg hover:shadow-xl hover:bg-amber-50/90 transition-all duration-300 cursor-pointer"
            title={`إظهار ${persona === 'noura' ? 'نُورة' : 'فارس'} — اختصار: Ctrl + Space`}
          >
            <div className="relative w-8 h-8 flex-shrink-0">
              <img
                src={persona === 'noura' ? '/noura.png' : '/mascot.png'}
                alt={persona === 'noura' ? 'نُورة' : 'فارس'}
                className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
            </div>

            <div className="flex flex-col text-right">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-zinc-900">
                  {persona === 'noura' ? 'نُورة' : 'فارس'}
                </span>
                <span className="text-[9.5px] text-emerald-700 font-bold bg-emerald-50 px-1 rounded border border-emerald-200">
                  جاهز للمناداة
                </span>
              </div>
              <span className="text-[10px] text-zinc-500">
                انقر للإظهار • <span className="font-mono text-amber-700 font-bold">Ctrl+Space</span>
              </span>
            </div>

            <div className="mr-1 text-amber-600 group-hover:translate-x-[-2px] transition-transform">
              <Bot className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* 2. Frameless 3D Mascot Character (Without circular frame, standing directly) */}
      {!isDocked && !isOpen && (
        <div
          className="mascot-pop-in group"
          style={{
            position: 'fixed',
            bottom: '16px',
            left: '24px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            direction: 'rtl',
          }}
        >
          {/* Floating Greeting Bubble with Persona Switcher & Dismiss/Dock Button */}
          {showTooltip && (
            <div
              className="speech-bubble-anim relative mb-2 max-w-[270px] bg-white/95 backdrop-blur-md border border-amber-300/80 rounded-2xl p-2.5 shadow-xl select-none"
            >
              {/* Top Control Bar: Persona Switcher & Minimize to Dock */}
              <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-zinc-100 text-[10.5px]">
                <div className="inline-flex items-center bg-zinc-100 rounded-full p-0.5 border border-zinc-200">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      switchPersona('faris');
                    }}
                    className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                      persona === 'faris' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    👨 فارس
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      switchPersona('noura');
                    }}
                    className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                      persona === 'noura' ? 'bg-amber-100 text-amber-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    👩 نُورة
                  </button>
                </div>

                {/* Quick Dismiss / Minimize to Dock */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDocked(true);
                    localStorage.setItem('assistant_mascot_docked', 'true');
                  }}
                  className="text-zinc-400 hover:text-rose-600 p-1 rounded-full hover:bg-zinc-100 transition-colors"
                  title="تصغير إلى الشريط الجانبي (إخفاء)"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bubble Message / Click Prompt */}
              <div 
                onClick={() => {
                  setIsOpen(true);
                  setShowTooltip(false);
                }}
                className="cursor-pointer hover:text-amber-800 transition-colors"
              >
                <p className="text-xs font-bold text-zinc-900 leading-snug m-0">
                  {persona === 'noura' ? 'أهلاً بكِ! أنا نُورة، مرشدتكِ الرقمية' : 'أهلاً بك! أنا فارس، مرشدك الرقمي'}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1 mb-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600 inline shrink-0" />
                  <span>انقر للبدء أو نادني: </span>
                  <strong className="text-amber-700 font-black whitespace-nowrap">
                    {persona === 'noura' ? '"يا نُورة"' : '"يا فارس"'}
                  </strong>
                </p>
              </div>

              {/* Bubble Pointer Arrow pointing down to character */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: '-6px',
                  left: '36px',
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#ffffff',
                  borderRight: '1px solid rgba(252, 211, 77, 0.8)',
                  borderBottom: '1px solid rgba(252, 211, 77, 0.8)',
                  transform: 'rotate(45deg)',
                }}
              />
            </div>
          )}

          {/* The Frameless 3D Mascot Character (No circular frame, standing directly) */}
          <div
            onClick={() => {
              setIsOpen(true);
              setShowTooltip(false);
            }}
            className="relative cursor-pointer select-none flex flex-col items-center"
            title={persona === 'noura' ? 'انقري للتحدث مع نُورة' : 'انقر للتحدث مع فارس'}
          >
            {/* Floating Mascot Image with soft ambient lighting */}
            <div className="mascot-float relative transition-all duration-300 group-hover:scale-105">
              <img
                src={persona === 'noura' ? '/noura.png' : '/mascot.png'}
                alt={persona === 'noura' ? 'نُورة - المرشدة الرقمية الذكية' : 'فارس - المرشد الرقمي الذكي'}
                className="w-auto h-32 sm:h-36 object-contain pointer-events-auto"
                style={{
                  filter: 'drop-shadow(0 12px 18px rgba(0,0,0,0.18)) drop-shadow(0 0 12px rgba(207, 166, 74, 0.22))',
                }}
                loading="eager"
              />

              {/* Floating status dot on character */}
              <span 
                style={{
                  position: 'absolute',
                  bottom: '14px',
                  right: '12px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  border: '2px solid #ffffff',
                  boxShadow: '0 0 8px #10B981',
                }}
                title="متصل بالخدمة"
              />
            </div>

            {/* Realistic Soft Radial Ground Shadow Under Character Feet */}
            <div 
              className="mascot-shadow w-24 h-3.5 rounded-full pointer-events-none -mt-1"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.38) 0%, rgba(15, 23, 42, 0.1) 55%, transparent 75%)',
              }}
            />
          </div>
        </div>
      )}

      {/* 2. Executive White Chat Drawer / Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
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
                  {isSpeaking && (
                    <span style={{
                      fontSize: '10px',
                      color: '#b45309',
                      background: '#fef3c7',
                      padding: '1px 6px',
                      borderRadius: '9999px',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      border: '1px solid #fde68a'
                    }}>
                      <Volume2 className="w-3 h-3 animate-pulse" /> يتحدث الآن...
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '9.5px',
                    fontWeight: 700,
                    color: isLocalAiOnline ? '#065f46' : '#71717a',
                    background: isLocalAiOnline ? '#ecfdf5' : '#f4f4f5',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    border: `1px solid ${isLocalAiOnline ? '#a7f3d0' : '#e4e4e7'}`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: isLocalAiOnline ? '#10b981' : '#9ca3af' }} />
                    {persona === 'noura' ? 'noura-erp' : 'faris-erp'} (محلي On-Device)
                  </span>
                  <span style={{
                    fontSize: '9.5px',
                    fontWeight: 700,
                    color: '#1e3a8a',
                    background: '#eff6ff',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    border: '1px solid #bfdbfe'
                  }}>
                    🔒 عزل بيانات: {activeCompany.name}
                  </span>
                </div>
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
                onClick={toggleWakeWord}
                title={wakeWordEnabled ? 'إيقاف الاستماع للمناداة الصوتية (يا فارس / يا نُورة)' : 'تفعيل الاستماع للمناداة الصوتية: يمكنك مناداة "يا فارس" أو "يا نُورة" بأي وقت'}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  background: wakeWordEnabled ? '#ecfdf5' : 'transparent',
                  border: wakeWordEnabled ? '1px solid #10b981' : 'none',
                  color: wakeWordEnabled ? '#047857' : '#71717a',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                {wakeWordEnabled ? <Mic className="w-4 h-4 text-emerald-600 animate-pulse" /> : <MicOff className="w-4 h-4" />}
              </button>

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
                onClick={() => {
                  setIsOpen(false);
                  setIsDocked(true);
                  localStorage.setItem('assistant_mascot_docked', 'true');
                }}
                title="تصغير إلى الشريط الجانبي (إخفاء مؤقت)"
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
                  transition: 'all 0.2s ease',
                }}
              >
                <Minimize2 className="w-4 h-4" />
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
                        onClick={() => speakText(msg.text, persona, true)}
                        title={persona === 'noura' ? 'استمع لصوت نُورة' : 'استمع لصوت فارس'}
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

