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

      {/* 2. Executive Luxury Glassmorphic Chat Window */}
      {isOpen && (
        <div
          className="speech-bubble-anim"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            width: '450px',
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: '680px',
            height: '84vh',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            borderRadius: '28px',
            boxShadow: '0 24px 60px -12px rgba(9, 23, 37, 0.28), 0 0 0 1px rgba(207, 166, 74, 0.35), 0 8px 24px -6px rgba(207, 166, 74, 0.12)',
            border: '1.5px solid rgba(207, 166, 74, 0.45)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'var(--font-family-ui)',
            direction: 'rtl',
          }}
        >
          {/* Header - Luxury Champagne Gold & Executive Presence */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-b from-white via-white to-amber-50/40 border-b border-amber-200/50 shrink-0">
            {/* Row 1: Identity & Controls */}
            <div className="flex items-center justify-between gap-3">
              {/* Avatar & Title */}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`relative w-11 h-11 rounded-2xl p-0.5 shrink-0 transition-all duration-300 ${
                  persona === 'noura'
                    ? 'bg-gradient-to-tr from-amber-400 via-rose-300 to-amber-200 shadow-md shadow-amber-500/20'
                    : 'bg-gradient-to-tr from-amber-400 via-sky-300 to-amber-200 shadow-md shadow-amber-500/20'
                }`}>
                  <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center overflow-hidden">
                    <img
                      src={persona === 'noura' ? '/noura.png' : '/mascot.png'}
                      alt={persona === 'noura' ? 'نُورة' : 'فارس'}
                      className="w-full h-full object-contain p-0.5"
                    />
                  </div>
                  {/* Live Active Status Ring */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-[15px] text-zinc-900 tracking-tight m-0 truncate">
                      {persona === 'noura' ? 'نُورة • المرشدة الذكية' : 'فارس • المرشد التنفيذي'}
                    </h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-300/60 shrink-0">
                      {persona === 'noura' ? 'Noura AI' : 'Faris AI'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 m-0 truncate flex items-center gap-1 mt-0.5">
                    <Sparkles className="w-3 h-3 text-amber-500 shrink-0 inline" />
                    <span>ذكاء اصطناعي سيادي محلي • On-Device Qwen 3B</span>
                  </p>
                </div>
              </div>

              {/* Window Control Actions */}
              <div className="flex items-center gap-1 shrink-0">
                {/* Voice Toggle */}
                <button
                  type="button"
                  onClick={toggleVoice}
                  title={voiceEnabled ? 'تعطيل القراءة الصوتية' : 'تفعيل القراءة الصوتية بالذكاء الاصطناعي'}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    voiceEnabled
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Wake Word Mic */}
                <button
                  type="button"
                  onClick={toggleWakeWord}
                  title={wakeWordEnabled ? 'المناداة الصوتية مفعلة (يا فارس / يا نُورة)' : 'تفعيل المناداة الصوتية التلقائية'}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    wakeWordEnabled
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 hover:bg-emerald-200 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  {wakeWordEnabled ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4" />}
                </button>

                {/* Minimize to Dock */}
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setIsDocked(true);
                    localStorage.setItem('assistant_mascot_docked', 'true');
                  }}
                  title="تصغير إلى الشاشة (إخفاء مؤقت)"
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>

                {/* Close */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="إغلاق"
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Row 2: Persona Switcher & Company Scope Badges */}
            <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-amber-200/40">
              {/* Persona Switcher Pill */}
              <div className="inline-flex items-center bg-zinc-100/90 p-0.5 rounded-full border border-zinc-200/80 shadow-inner">
                <button
                  type="button"
                  onClick={() => switchPersona('faris')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                    persona === 'faris'
                      ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  <span>👨</span>
                  <span>فارس</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchPersona('noura')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                    persona === 'noura'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 shadow-sm font-black'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  <span>👩</span>
                  <span>نُورة</span>
                </button>
              </div>

              {/* Company Data Isolation Badge */}
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50/90 text-amber-900 border border-amber-300/70 truncate max-w-[220px]"
                title={`عزل بيانات سيادي مشفر: ${activeCompany.name}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="truncate">🔒 {activeCompany.name}</span>
              </div>
            </div>

            {/* Row 3: Dynamic Audio Equalizer Wave (shown when speaking or listening) */}
            {(isSpeaking || isListening) && (
              <div
                onClick={isSpeaking ? () => { stopAllAudio(); setIsSpeaking(false); } : undefined}
                className={`mt-2.5 px-3 py-1.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                  isSpeaking
                    ? 'bg-amber-500/15 border-amber-400/50 text-amber-900 hover:bg-amber-500/20'
                    : 'bg-emerald-500/15 border-emerald-400/50 text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isSpeaking ? (
                    <Volume2 className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
                  ) : (
                    <Mic className="w-4 h-4 text-emerald-600 animate-pulse shrink-0" />
                  )}
                  <span className="text-xs font-bold">
                    {isSpeaking
                      ? `${persona === 'noura' ? 'نُورة' : 'فارس'} تتحدث بالصوت الطبيعي... (انقر للإيقاف)`
                      : 'جاري الاستماع لصوتك عبر المايكروفون...'}
                  </span>
                </div>

                {/* 5-bar animated harmonic equalizer */}
                <div className="flex items-center gap-0.5 h-5 px-1">
                  <span className={`w-1 rounded-full ${isSpeaking ? 'bg-amber-500 anim-wave-1' : 'bg-emerald-500 anim-wave-1'}`} />
                  <span className={`w-1 rounded-full ${isSpeaking ? 'bg-amber-500 anim-wave-2' : 'bg-emerald-500 anim-wave-2'}`} />
                  <span className={`w-1 rounded-full ${isSpeaking ? 'bg-amber-500 anim-wave-3' : 'bg-emerald-500 anim-wave-3'}`} />
                  <span className={`w-1 rounded-full ${isSpeaking ? 'bg-amber-500 anim-wave-4' : 'bg-emerald-500 anim-wave-4'}`} />
                  <span className={`w-1 rounded-full ${isSpeaking ? 'bg-amber-500 anim-wave-5' : 'bg-emerald-500 anim-wave-5'}`} />
                </div>
              </div>
            )}
          </div>

          {/* Contextual Quick Suggestions Pill Bar */}
          <div className="px-3.5 py-2.5 bg-zinc-50/80 border-b border-zinc-200/70 flex gap-2 overflow-x-auto thin-scrollbar shrink-0">
            {getContextualPrompts().map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(qp.query)}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-white text-zinc-800 border border-zinc-200/90 hover:border-amber-400 hover:bg-amber-50/60 hover:text-amber-900 transition-all shadow-2xs whitespace-nowrap shrink-0 flex items-center gap-1.5 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{qp.label}</span>
              </button>
            ))}
          </div>

          {/* Chat Messages Section */}
          <div
            className="flex-1 p-3.5 sm:p-4 overflow-y-auto flex flex-col gap-3.5 bg-gradient-to-b from-[#FAF9F5] to-[#F5F3ED]"
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 items-start max-w-[90%] ${
                  msg.sender === 'user' ? 'self-start flex-row-reverse' : 'self-end'
                }`}
              >
                {/* Assistant Avatar for AI messages */}
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-300 p-0.5 shrink-0 overflow-hidden mt-1 shadow-xs">
                    <img
                      src={persona === 'noura' ? '/noura.png' : '/mascot.png'}
                      alt={persona === 'noura' ? 'نُورة' : 'فارس'}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  {/* Message Bubble */}
                  <div
                    className={`p-3.5 text-xs sm:text-[13px] leading-relaxed shadow-sm transition-all ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-tr from-[#091725] to-[#16304d] text-white rounded-2xl rounded-tl-xs shadow-md shadow-zinc-900/10'
                        : 'bg-white text-zinc-900 border border-amber-200/70 rounded-2xl rounded-tr-xs shadow-sm'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <p className="m-0 whitespace-pre-wrap font-medium">{msg.text}</p>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {msg.text.split('\n').map((line, lIdx) => {
                          const trimmed = line.trim();
                          if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
                            const content = trimmed.replace(/^[•\-\*]\s*/, '');
                            return (
                              <div key={lIdx} className="flex items-start gap-2 my-0.5 pr-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0 shadow-xs" />
                                <span className="leading-relaxed text-zinc-800">{content}</span>
                              </div>
                            );
                          }
                          if (!trimmed) {
                            return <div key={lIdx} className="h-1.5" />;
                          }
                          return (
                            <p key={lIdx} className="m-0 leading-relaxed text-zinc-800">
                              {line}
                            </p>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Direct Action Button (if present) */}
                  {msg.actionButton && onNavigate && (
                    <button
                      type="button"
                      onClick={() => {
                        if (msg.actionButton) {
                          onNavigate(msg.actionButton.actionKey, msg.actionButton.label);
                          setIsOpen(false);
                        }
                      }}
                      className="self-start mt-1 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-500 hover:to-amber-500 text-zinc-950 font-extrabold text-xs border border-amber-300 shadow-md shadow-amber-500/25 flex items-center gap-2 hover:-translate-y-0.5 transition-all cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current text-zinc-950" />
                      <span>{msg.actionButton.label}</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Timestamp & Speech Read Action */}
                  <div className="flex items-center justify-between gap-2 px-1 text-[10.5px] text-zinc-400">
                    <span>{msg.timestamp}</span>

                    {msg.sender === 'ai' && (
                      <button
                        type="button"
                        onClick={() => speakText(msg.text, persona, true)}
                        title={persona === 'noura' ? 'استمع لصوت نُورة الطبيعي' : 'استمع لصوت فارس الطبيعي'}
                        className="flex items-center gap-1.5 px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100 hover:border-amber-300 transition-all cursor-pointer"
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
              <div className="self-end flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-amber-200 text-zinc-600 text-xs shadow-sm">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-600 shrink-0" />
                <span className="font-semibold">
                  {persona === 'noura' ? 'نُورة تحلل السجلات وتستخرج البيانات...' : 'فارس يحلل السجلات ويستخرج البيانات...'}
                </span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input & Voice Controls Command Center */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 sm:p-3.5 bg-white border-t border-zinc-200/80 flex items-center gap-2 shrink-0"
          >
            {/* Voice Dictation Button */}
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? 'إيقاف الاستماع' : (persona === 'noura' ? 'تحدثي بالمايكروفون إلى نُورة' : 'تحدث بالمايكروفون إلى فارس')}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Input Field */}
            <input
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder={
                isListening
                  ? 'جاري الاستماع لصوتك الآن...'
                  : (persona === 'noura'
                    ? 'اكتبي استفساركِ أو اطلبي إجراءً من نُورة...'
                    : 'اكتب سؤالك أو اطلب إجراءً من فارس...')
              }
              className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all ${
                isListening
                  ? 'bg-rose-50/80 border-1.5 border-rose-300'
                  : 'bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
              }`}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              title="إرسال"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                inputQuery.trim()
                  ? 'bg-gradient-to-tr from-[#091725] to-[#1c3c60] text-amber-400 hover:scale-105 shadow-md shadow-zinc-900/20'
                  : 'bg-zinc-100 text-zinc-300 cursor-not-allowed border border-zinc-200'
              }`}
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

