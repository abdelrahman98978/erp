import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';

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
  { id: '1', client_name: 'سارة احمد محمد', phone: '+9660558025628', last_message: 'السلام عليكم، هل وصلت التأشيرة من مساند؟', time: '10:45 ص', unread_count: 2, status: 'نشط' },
  { id: '2', client_name: 'نايف القحطاني', phone: '+966535355555', last_message: 'شكراً لكم، تم استلام حجز العاملة بنجاح.', time: 'أمس', unread_count: 0, status: 'نشط' },
  { id: '3', client_name: 'بندر صالح الهويريني', phone: '+966555774494', last_message: 'يرجى تزويدي بإيصال تحويل السداد.', time: '29/07', unread_count: 0, status: 'مغلق' }
];

export const WhatsAppInboxPage: React.FC = () => {
  const [activeChat, setActiveChat] = useState<WhatsAppChat>(MOCK_CHATS[0]);
  const [replyText, setReplyText] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'client', text: 'السلام عليكم، هل وصلت التأشيرة من مساند؟', time: '10:45 ص' },
    { sender: 'system', text: 'أهلاً بك أختي سارة! تم تفييز العقد رقم #594 ونحن بانتظار صدور التذكرة اليوم.', time: '10:47 ص' }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setMessages(prev => [...prev, { sender: 'system', text: replyText, time: 'الآن' }]);
    setReplyText('');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-brands fa-whatsapp text-success ml-2"></i> محادثات وإرسال رسائل الواتساب الفورية (WhatsApp Inbox)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            الرد المباشر على استفسارات العملاء وإرسال الحملات الترويجية المعتمدة
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '16px', height: '650px' }} className="table-card">
        {/* Left Side: Conversations List */}
        <div style={{ borderLeft: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #E5E7EB', background: '#F8FAFC' }}>
            <input type="text" className="filter-input" placeholder="ابحث باسم العميل أو رقم الواتساب..." style={{ width: '100%' }} />
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {MOCK_CHATS.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid #F1F5F9',
                  background: activeChat.id === chat.id ? 'var(--primary-light)' : 'transparent',
                  borderRight: activeChat.id === chat.id ? '3px solid var(--odoo-teal)' : 'none',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '700', fontSize: '13.5px' }}>{chat.client_name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{chat.time}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {chat.last_message}
                </div>
                {chat.unread_count > 0 && (
                  <span className="badge-pill success" style={{ fontSize: '10px', marginTop: '6px', padding: '1px 6px' }}>
                    {chat.unread_count} رسائل جديدة
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Chat Window */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Chat Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: '800', fontSize: '15px' }}>{activeChat.client_name}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginRight: '10px', fontFamily: 'monospace' }}>{activeChat.phone}</span>
            </div>
            <Badge text="متصل الآن (WhatsApp Web)" type="success" icon="fa-solid fa-circle" />
          </div>

          {/* Chat Messages */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#F3F4F6', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.sender === 'system' ? 'flex-start' : 'flex-end',
                  maxWidth: '70%',
                  background: msg.sender === 'system' ? 'var(--odoo-teal)' : '#FFFFFF',
                  color: msg.sender === 'system' ? '#FFFFFF' : 'var(--text-main)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-sm)',
                  fontSize: '13px'
                }}
              >
                <div>{msg.text}</div>
                <div style={{ fontSize: '10px', textAlign: 'left', marginTop: '4px', opacity: 0.8 }}>{msg.time}</div>
              </div>
            ))}
          </div>

          {/* Chat Reply Form */}
          <form onSubmit={handleSendMessage} style={{ padding: '14px 20px', borderTop: '1px solid #E5E7EB', background: 'white', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              className="filter-input"
              style={{ flex: 1 }}
              placeholder="اكتب ردك للعميل عبر الواتساب..."
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
            />
            <button type="submit" className="btn-odoo btn-odoo-primary">
              <i className="fa-solid fa-paper-plane"></i> إرسال
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
