import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';
import { MessageSquare, PhoneCall, Send, Search, FileSpreadsheet, FileText, CheckCheck, Sparkles } from 'lucide-react';

interface WhatsAppChat {
  id: string;
  client_name: string;
  phone: string;
  last_message: string;
  time: string;
  unread_count: number;
  status: 'نشط' | 'مغلق';
}

const MOCK_CHATS: WhatsAppChat[] = [
  { id: '1', client_name: 'سارة أحمد محمد', phone: '+966558025628', last_message: 'السلام عليكم، هل صدرت التأشيرة من مساند؟', time: '10:45 ص', unread_count: 2, status: 'نشط' },
  { id: '2', client_name: 'نايف القحطاني', phone: '+966535355555', last_message: 'شكراً لكم، تم استلام حجز العاملة بنجاح.', time: 'أمس', unread_count: 0, status: 'نشط' },
  { id: '3', client_name: 'بندر صالح الهويريني', phone: '+966555774494', last_message: 'يرجى تزويدي بإيصال تحويل السداد المعتمد.', time: '29/07', unread_count: 0, status: 'مغلق' },
  { id: '4', client_name: 'شركة دار الرواد للمقاولات', phone: '+966501234567', last_message: 'نحتاج تجديد عقود التأجير لـ 5 عاملات هذا الشهر.', time: '28/07', unread_count: 1, status: 'نشط' }
];

const PRESET_TEMPLATES = [
  { id: 't-1', title: '📋 تحديث حالة العقد', text: 'مرحباً بك! نود إبلاغك بأنه تم تحديث حالة عقدكم رقم (#RC-2026-0594) بنجاح إلى مرحلة (التفييز وإصدار التذكرة). يمكنك متابعة التحديثات عبر البوابة.' },
  { id: 't-2', title: '✈️ إشعار وصول الرحلة', text: 'عميلنا العزيز، نود إشعاركم بوصول العاملة إلى مطار الملك خالد الدولي عبر الرحلة (SV-412) وسيتم إنهاء إجراءات الاستقبال فوراً.' },
  { id: 't-3', title: '💳 تأكيد سداد الفاتورة', text: 'تم استلام وتوثيق سند السداد الإلكتروني بنجاح بمبلغ (%AMOUNT% ر.س) وتم ترحيل القيد للفاتورة الضريبية ZATCA.' },
  { id: 't-4', title: '⏳ تذكير انتهاء فترة التجربة (90 يوم)', text: 'نود تذكيركم بقرب انتهاء فترة الضمان والتجربة النظامية (90 يوماً). نرجو تقييم الخدمة أو إبلاغنا بأي ملاحظات.' }
];

export const WhatsAppInboxPage: React.FC = () => {
  const [chats, setChats] = useState<WhatsAppChat[]>(MOCK_CHATS);
  const [activeChat, setActiveChat] = useState<WhatsAppChat>(MOCK_CHATS[0]);
  const [replyText, setReplyText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'client', text: 'السلام عليكم، هل وصلت التأشيرة من مساند؟', time: '10:45 ص' },
    { sender: 'system', text: 'أهلاً بك أختي سارة! تم تفييز العقد رقم #594 ونحن بانتظار صدور التذكرة اليوم.', time: '10:47 ص' }
  ]);

  useEffect(() => {
    realErpDataStore.getRecords<WhatsAppChat>('whatsapp_messages', MOCK_CHATS).then(data => {
      if (data && data.length > 0) {
        setChats(data);
        setActiveChat(data[0]);
      }
    });
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const newMsg = { sender: 'system', text: replyText, time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMsg]);
    setReplyText('');

    const updated = chats.map(c => c.id === activeChat.id ? { ...c, last_message: replyText, time: 'الآن' } : c);
    setChats(updated);
  };

  const handleSelectTemplate = (templateText: string) => {
    setReplyText(templateText);
  };

  const filteredChats = chats.filter(c =>
    c.client_name.includes(searchFilter) ||
    c.phone.includes(searchFilter) ||
    c.last_message.includes(searchFilter)
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div
        className="card-feature-cinematic"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#000000',
          color: '#FFF',
          padding: '28px',
          borderRadius: '16px',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div className="flex items-center gap-3">
          <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <PhoneCall className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>WHATSAPP BUSINESS HUB</span>
            </div>
            <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, margin: '0', letterSpacing: '-0.02em', color: '#ffffff', fontFamily: 'var(--font-family-display)' }}>
              منظومة رسائل الواتساب الموحدة
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#a1a1aa', fontWeight: 420 }}>
              الرد الآلي والفوري، قوالب الإشعارات المعتمدة، وإرسال تنبيهات العقود والفواتير للعملاء
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportData('clients', chats, 'excel', 'سجل محادثات الواتساب')}
            className="button-outline-on-dark"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
          >
            <FileSpreadsheet className="w-4 h-4 ml-1 text-emerald-400" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => exportData('clients', chats, 'pdf', 'سجل محادثات الواتساب')}
            className="button-outline-on-dark"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
          >
            <FileText className="w-4 h-4 ml-1 text-rose-400" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Templates Bar */}
      <div className="card-pricing flex items-center gap-2 overflow-x-auto" style={{ padding: '12px 16px', borderRadius: '16px', background: '#ffffff' }}>
        <div className="flex items-center gap-1 text-xs font-bold text-black whitespace-nowrap ml-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>قوالب سريعة:</span>
        </div>
        {PRESET_TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => handleSelectTemplate(tmpl.text)}
            className="button-outline-on-light"
            style={{ padding: '4px 14px', fontSize: '11.5px', minHeight: '30px', whiteSpace: 'nowrap' }}
          >
            <span>{tmpl.title}</span>
          </button>
        ))}
      </div>

      {/* Main Chat Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[620px] bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Left Side: Conversations List */}
        <div className="md:col-span-1 border-l border-zinc-200 flex flex-col h-full bg-zinc-50/50">
          <div className="p-3.5 border-b border-zinc-200 bg-white">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute right-3 top-2.5 text-zinc-400" />
              <input
                type="text"
                placeholder="ابحث بالاسم أو الرقم..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full pl-3 pr-8 py-1.5 bg-zinc-50 border border-zinc-200 rounded-full text-xs font-sans text-black focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`p-3.5 transition-all cursor-pointer ${
                  activeChat.id === chat.id
                    ? 'bg-zinc-100 border-r-4 border-black'
                    : 'hover:bg-zinc-100/50'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-xs text-black">{chat.client_name}</span>
                  <span className="text-[10px] font-mono text-zinc-400">{chat.time}</span>
                </div>
                <div className="text-xs text-zinc-500 truncate">{chat.last_message}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] font-mono text-emerald-700 font-bold">{chat.phone}</span>
                  {chat.unread_count > 0 && (
                    <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {chat.unread_count}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Active Chat Box */}
        <div className="md:col-span-2 flex flex-col h-full bg-white">
          {/* Chat Header */}
          <div className="p-3.5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-black text-white font-bold flex items-center justify-center text-xs shadow-sm">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-black">{activeChat.client_name}</h3>
                <span className="text-[11px] font-mono text-emerald-700 font-bold">{activeChat.phone}</span>
              </div>
            </div>
            <Badge text="متصل بـ WhatsApp Cloud API" type="success" />
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-zinc-50/40">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'system' ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'system'
                      ? 'bg-black text-white rounded-br-sm shadow-sm'
                      : 'bg-white text-black rounded-bl-sm border border-zinc-200'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-zinc-400 mt-1 px-1 font-mono">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-200 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder="اكتب ردك للعميل أو اختر قالباً جاهزاً من الأعلى..."
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              className="flex-1 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-full text-xs text-black focus:outline-none focus:border-black"
            />
            <button
              type="submit"
              className="button-primary-pill"
              style={{ padding: '6px 18px', minHeight: '36px', fontSize: '12px' }}
            >
              <Send className="w-3.5 h-3.5 ml-1" />
              <span>إرسال</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppInboxPage;
