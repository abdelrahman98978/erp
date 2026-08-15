import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';

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
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <i className="fa-brands fa-whatsapp text-emerald-600 text-3xl"></i>
            منظومة رسائل الواتساب الموحدة (WhatsApp Business Omni-Channel Hub)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            الرد الآلي والفوري، قوالب الإشعارات المعتمدة، وإرسال تنبيهات العقود والفواتير للعملاء
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportData('clients', chats, 'excel', 'سجل محادثات الواتساب')}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="تصدير Excel"
          >
            <i className="fa-solid fa-file-excel text-emerald-600 ml-1.5"></i> Excel
          </button>
          <button
            onClick={() => exportData('clients', chats, 'pdf', 'سجل محادثات الواتساب')}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="تصدير PDF"
          >
            <i className="fa-solid fa-file-pdf text-rose-600 ml-1.5"></i> PDF
          </button>
        </div>
      </div>

      {/* Preset Quick Templates Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-bold text-slate-500 whitespace-nowrap ml-2">⚡ قوالب سريعة:</span>
        {PRESET_TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => handleSelectTemplate(tmpl.text)}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1"
          >
            <span>{tmpl.title}</span>
          </button>
        ))}
      </div>

      {/* Main Chat Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[620px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Left Side: Conversations List */}
        <div className="md:col-span-1 border-l border-slate-100 flex flex-col h-full bg-slate-50/50">
          <div className="p-3.5 border-b border-slate-200 bg-white">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث باسم العميل أو رقم الواتساب..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500"
              />
              <i className="fa-solid fa-magnifying-glass absolute right-3 top-2.5 text-slate-400 text-xs"></i>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`p-3.5 transition-all cursor-pointer ${
                  activeChat.id === chat.id
                    ? 'bg-emerald-50/80 border-r-4 border-emerald-600'
                    : 'hover:bg-slate-100/60'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-xs text-slate-900">{chat.client_name}</span>
                  <span className="text-[10px] font-mono text-slate-400">{chat.time}</span>
                </div>
                <div className="text-xs text-slate-500 truncate">{chat.last_message}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] font-mono text-emerald-800">{chat.phone}</span>
                  {chat.unread_count > 0 && (
                    <span className="bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
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
          <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                <i className="fa-brands fa-whatsapp text-lg"></i>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">{activeChat.client_name}</h3>
                <span className="text-xs font-mono text-emerald-700">{activeChat.phone}</span>
              </div>
            </div>
            <Badge text="متصل بـ WhatsApp Cloud API" type="success" />
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#EFEAE2]/30">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'system' ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs shadow-sm leading-relaxed ${
                    msg.sender === 'system'
                      ? 'bg-teal-900 text-white rounded-br-sm'
                      : 'bg-white text-slate-900 rounded-bl-sm border border-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder="اكتب ردك للعميل أو اختر قالباً جاهزاً من الأعلى..."
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-200 transition-all flex items-center gap-1.5"
            >
              <i className="fa-solid fa-paper-plane"></i> إرسال واتساب
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppInboxPage;
