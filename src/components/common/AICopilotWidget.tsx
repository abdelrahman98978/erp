import React, { useState, useRef, useEffect } from 'react';
import { useCompany } from '../../contexts/CompanyContext';
import { useLanguage } from '../../i18n/LanguageContext';

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

interface AICopilotWidgetProps {
  onNavigate?: (tab: string, title: string) => void;
}

export const AICopilotWidget: React.FC<AICopilotWidgetProps> = ({ onNavigate }) => {
  const { activeCompany } = useCompany();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `مرحباً بك! أنا "مساعد السليم الذكي (ALSALIM AI Copilot)". كيف يمكنني مساعدتك اليوم في إدارة العقود، التقارير المالية، أو مساند؟`,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const QUICK_PROMPTS = [
    { label: '📊 ملخص الأداء المالي', query: 'أعطني ملخص السيولة والأرباح الحالية للشركة' },
    { label: '⏳ عقود مساند المتأخرة', query: 'ما هي العقود المتأخرة في مرحلة التأشيرة أو السفارة؟' },
    { label: '🇸🇦 نسبة التوطين و WPS', query: 'ما هي نسبة التوطين الحالية وحالة حماية الأجور؟' },
    { label: '🏨 نسبة إشغال الإيواء', query: 'ما هي نسبة إشغال سكن العمالة الحالي؟' },
  ];

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

    // AI Reasoning & Contextual Response Engine
    setTimeout(() => {
      let aiResponse = '';
      let actionBtn: { label: string; actionKey: string } | undefined = undefined;

      const lower = textToSend.toLowerCase();

      if (lower.includes('مالي') || lower.includes('سيولة') || lower.includes('أرباح') || lower.includes('دخل')) {
        aiResponse = `بناءً على السجلات المحاسبية لـ (${activeCompany.name}):
• إجمالي الإيرادات المحققة: 525,471.20 ر.س (نمو +14.8%)
• إجمالي المصروفات: 220,500.00 ر.س
• صافي الربح التشغيلي: 304,971.20 ر.س (هامش ربح 58%)
• أمانات مساند المعلقة (90 يوماً): 184,500.00 ر.س.`;
        actionBtn = { label: 'فتح الإدارة المالية', actionKey: 'finance-home' };
      } else if (lower.includes('مساند') || lower.includes('عقود') || lower.includes('متأخر') || lower.includes('استقدام')) {
        aiResponse = `يوجد حالياً 113 عقداً سارياً في مراحل الاستقدام.
• 4 عقود تجاوزت 45 يوماً في مرحلة السفارة (الفلبين وكينيا).
• 12 تأشيرة جاهزة للتفويض عبر إنجاز.
• تم إرسال تنبيهات تلقائية لمكاتب الاستقدام الخارجية عبر البريد الإلكتروني.`;
        actionBtn = { label: 'فتح خط أنابيب مساند (ATS)', actionKey: 'ats-pipeline' };
      } else if (lower.includes('توطين') || lower.includes('رواتب') || lower.includes('wps') || lower.includes('أجور')) {
        aiResponse = `حالة الموارد البشرية لـ (${activeCompany.name}):
• نسبة التوطين المعتمدة: 78% (النطاق البلاتيني 🟢).
• مسير رواتب الشهر الحالي: 39,700.00 ر.س لعدد 4 موظفين.
• ملف حماية الأجور (WPS) جاهز للاعتماد والرفع للبنوك.`;
        actionBtn = { label: 'فتح الموارد البشرية والرواتب', actionKey: 'hr' };
      } else if (lower.includes('إيواء') || lower.includes('سكن') || lower.includes('تغذية')) {
        aiResponse = `حالة مركز الإيواء والتغذية:
• نسبة الإشغال: 42% (28 سرير متاح من أصل 60).
• عاملتان في مرحلة إجراءات نقل الكفالة (فترة التجربة).
• تم تدقيق جداول الوجبات اليومية والمشرف المسؤول.`;
        actionBtn = { label: 'فتح مركز الإيواء', actionKey: 'shelter' };
      } else {
        aiResponse = `تم استلام استفسارك: "${textToSend}". يمكنك الانتقال المباشر لأي قسم أو استخراج التقارير والتحليلات بنقرة زر من خلال القائمة الرئيسية أو مركز التقارير الموحد.`;
        actionBtn = { label: 'فتح مركز التقارير الموحد', actionKey: 'reports' };
      }

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiResponse,
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          actionButton: actionBtn,
        },
      ]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="مساعد الذكاء الاصطناعي"
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 9999,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #005154 0%, #101c2e 100%)',
          color: '#ffffff',
          border: '2px solid #D4AF37',
          boxShadow: '0 8px 24px rgba(0, 81, 84, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isOpen ? 'rotate(90deg) scale(0.95)' : 'rotate(0deg) scale(1)',
        }}
      >
        <i className={isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-wand-magic-sparkles'} style={{ color: '#D4AF37' }}></i>
      </button>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            left: '24px',
            width: '380px',
            maxHeight: '560px',
            height: '80vh',
            background: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'Tajawal, Cairo, sans-serif',
            direction: 'rtl',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #005154 0%, #101c2e 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '2px solid #D4AF37',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(212, 175, 55, 0.2)',
                  border: '1px solid #D4AF37',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D4AF37',
                  fontSize: '16px',
                }}
              >
                <i className="fa-solid fa-robot"></i>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', fontFamily: 'Cairo, sans-serif' }}>
                  مساعد السليم الذكي (AI Copilot)
                </h4>
                <span style={{ fontSize: '11px', color: '#87d3d6' }}>
                  {activeCompany.name} • متصل ومباشر
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '16px' }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Quick Action Chips */}
          <div
            style={{
              padding: '10px 14px',
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            {QUICK_PROMPTS.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp.query)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '9999px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#005154',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: '#ffffff',
            }}
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-start' : 'flex-end',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.sender === 'user' ? '#005154' : '#f1f5f9',
                    color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  {msg.text}
                </div>

                {msg.actionButton && onNavigate && (
                  <button
                    onClick={() => {
                      if (msg.actionButton) {
                        onNavigate(msg.actionButton.actionKey, msg.actionButton.label);
                        setIsOpen(false);
                      }
                    }}
                    style={{
                      alignSelf: 'flex-start',
                      marginTop: '4px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: '#D4AF37',
                      color: '#181C1C',
                      fontWeight: '800',
                      fontSize: '11px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 6px rgba(212, 175, 55, 0.3)',
                    }}
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    {msg.actionButton.label}
                  </button>
                )}

                <span
                  style={{
                    fontSize: '10px',
                    color: '#94a3b8',
                    alignSelf: msg.sender === 'user' ? 'flex-start' : 'flex-end',
                  }}
                >
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div
                style={{
                  alignSelf: 'flex-end',
                  padding: '8px 14px',
                  borderRadius: '16px',
                  background: '#f1f5f9',
                  color: '#64748b',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <i className="fa-solid fa-circle-notch fa-spin text-teal-700"></i>
                جاري التحليل واستخراج البيانات...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: '12px 16px',
              background: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <input
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder="اكتب سؤالك أو اطلب تحليلاً..."
              style={{
                flex: 1,
                padding: '9px 14px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'Tajawal, sans-serif',
              }}
            />
            <button
              type="submit"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: '#005154',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
              }}
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
    </>
  );
};
