import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';

interface MessageLog {
  id: string;
  recipient_name: string;
  phone: string;
  channel: 'SMS' | 'WhatsApp';
  template: string;
  content: string;
  status: 'تم التسليم' | 'قيد الإرسال' | 'فشل الإرسال';
  cost_sar: number;
  sent_at: string;
}

interface MessageTemplate {
  id: string;
  title: string;
  channel: 'SMS' | 'WhatsApp' | 'كلاهما';
  category: 'مساند واستقدام' | 'تأجير وتشغيل' | 'مالية وفواتير' | 'إشعار إداري';
  text: string;
  variables: string[];
}

const MOCK_MESSAGES: MessageLog[] = [
  {
    id: 'MSG-901',
    recipient_name: 'سارة احمد محمد',
    phone: '+966558025628',
    channel: 'WhatsApp',
    template: 'تحديث تفييز مساند',
    content: 'عزيزتنا سارة، نفيدكم بصدور تأشيرة الاستقدام وتفييز الجواز للعقد #RC-594 (العاملة MARIA SANTOS) وجارٍ حجز تذكرة الطيران.',
    status: 'تم التسليم',
    cost_sar: 0.15,
    sent_at: '2026-08-17 14:15'
  },
  {
    id: 'MSG-902',
    recipient_name: 'نايف القحطاني',
    phone: '+966535355555',
    channel: 'SMS',
    template: 'تنبيه موعد التذكرة والوصول',
    content: 'عميلنا العزيز نايف، موعد وصول رحلة الاستقدام غداً الساعة 04:30 مساءً على الرحلة SV-840 مطار الملك خالد بالرياض.',
    status: 'تم التسليم',
    cost_sar: 0.12,
    sent_at: '2026-08-17 13:40'
  },
  {
    id: 'MSG-903',
    recipient_name: 'عبدالله محمد الغامدي',
    phone: '+966501234567',
    channel: 'WhatsApp',
    template: 'إشعار الفاتورة الإلكترونية ZATCA',
    content: 'مرحباً عبدالله، تم إصدار الفاتورة الضريبية رقم SAF-INV-2026-0001 بمبلغ 13,800 ر.س معتمدة من هيئة الزكاة. رابط الفاتورة: https://alsulaim.sa/inv/9001',
    status: 'تم التسليم',
    cost_sar: 0.15,
    sent_at: '2026-08-17 11:20'
  },
  {
    id: 'MSG-904',
    recipient_name: 'شركة دار الرواد للمقاولات',
    phone: '+966544998877',
    channel: 'SMS',
    template: 'تجديد عقد تأجير',
    content: 'عقد التأجير #RENT-2026-0016 ينتهي بعد 7 أيام. للتجديد الفوري يرجى تأكيد الدفعة القادمة عبر المنصة.',
    status: 'قيد الإرسال',
    cost_sar: 0.12,
    sent_at: '2026-08-17 10:05'
  },
  {
    id: 'MSG-905',
    recipient_name: 'خالد إبراهيم الدوسري',
    phone: '+966599112233',
    channel: 'SMS',
    template: 'رمز التحقق 2FA',
    content: 'رمز التحقق الخاص بك لمنظومة السليم هو: 582914 صالح لمدة 5 دقائق. لا تشارك الرمز مع أحد.',
    status: 'تم التسليم',
    cost_sar: 0.12,
    sent_at: '2026-08-17 09:12'
  }
];

const MOCK_TEMPLATES: MessageTemplate[] = [
  {
    id: 'TMP-1',
    title: 'إشعار إصدار التأشيرة والتفييز',
    channel: 'كلاهما',
    category: 'مساند واستقدام',
    text: 'عميلنا العزيز {{customer_name}}، نفيدكم بصدور التأشيرة للعقد رقم {{contract_no}} للعاملة {{worker_name}} وجارٍ استكمال إجراءات السفر.',
    variables: ['customer_name', 'contract_no', 'worker_name']
  },
  {
    id: 'TMP-2',
    title: 'تأكيد تذكرة وموعد وصول رحلة الطيران',
    channel: 'WhatsApp',
    category: 'مساند واستقدام',
    text: 'مرحباً {{customer_name}}، تم تأكيد حجز رحلة الوصول على الخطوط {{flight_airline}} رقم الرحلة {{flight_no}} وموعد الهبوط {{arrival_time}} بمطار {{airport}}.',
    variables: ['customer_name', 'flight_airline', 'flight_no', 'arrival_time', 'airport']
  },
  {
    id: 'TMP-3',
    title: 'إشعار فاتورة ZATCA Phase 2 وسند القبض',
    channel: 'كلاهما',
    category: 'مالية وفواتير',
    text: 'تم إصدار الفاتورة الضريبية المعتمدة رقم {{invoice_no}} بمبلغ {{amount_sar}} ر.س. شكراً لتعاملكم مع مجموعة السليم.',
    variables: ['invoice_no', 'amount_sar']
  },
  {
    id: 'TMP-4',
    title: 'تنبيه انتهاء عقد التأجير الشهري',
    channel: 'SMS',
    category: 'تأجير وتشغيل',
    text: 'عقد التأجير رقم {{contract_no}} ينتهي بتاريخ {{expiry_date}}. يرجى سداد الدفعة لتجديد العقد أو ترتيب الاستلام.',
    variables: ['contract_no', 'expiry_date']
  }
];

export const SentMessagesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'logs' | 'compose' | 'templates' | 'gateways'>('logs');
  const [channelFilter, setChannelFilter] = useState<'all' | 'SMS' | 'WhatsApp'>('all');
  const [messages, setMessages] = useState<MessageLog[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>(MOCK_TEMPLATES);

  // Quick Composer State
  const [composeChannel, setComposeChannel] = useState<'SMS' | 'WhatsApp'>('WhatsApp');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  useEffect(() => {
    realErpDataStore.getRecords<MessageLog>('sent_messages', MOCK_MESSAGES).then(data => setMessages(data));
  }, []);

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tmpId = e.target.value;
    setSelectedTemplateId(tmpId);
    const found = templates.find(t => t.id === tmpId);
    if (found) {
      setMessageBody(found.text);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientPhone.trim() || !messageBody.trim()) return;

    setIsSending(true);
    await new Promise(r => setTimeout(r, 600));

    const newMsg: MessageLog = {
      id: `MSG-${Date.now().toString().slice(-4)}`,
      recipient_name: recipientName.trim() || 'عميل تجريبي',
      phone: recipientPhone.trim(),
      channel: composeChannel,
      template: selectedTemplateId ? templates.find(t => t.id === selectedTemplateId)?.title || 'مخصص' : 'رسالة فورية مخصصة',
      content: messageBody,
      status: 'تم التسليم',
      cost_sar: composeChannel === 'WhatsApp' ? 0.15 : 0.12,
      sent_at: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    const updated = await realErpDataStore.addRecord<MessageLog>('sent_messages', newMsg, MOCK_MESSAGES);
    setMessages(updated);
    setIsSending(false);
    setSendSuccess(true);
    setRecipientName('');
    setRecipientPhone('');
    setMessageBody('');
    setTimeout(() => setSendSuccess(false), 3000);
  };

  const filteredMessages = messages.filter(m => {
    if (channelFilter !== 'all' && m.channel !== channelFilter) return false;
    return true;
  });

  const columns: Column<MessageLog>[] = [
    {
      header: 'كود الرسالة',
      accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-purple)', fontFamily: 'monospace' }}>{row.id}</span>
    },
    {
      header: 'المستلم ورقم الجوال',
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700', color: '#1E293B' }}>{row.recipient_name}</span>
          <div style={{ fontSize: '11.5px', color: '#64748B', fontFamily: 'monospace', direction: 'ltr', textAlign: 'right' }}>
            {row.phone}
          </div>
        </div>
      )
    },
    {
      header: 'القناة',
      accessor: (row) => (
        <Badge
          text={row.channel}
          type={row.channel === 'WhatsApp' ? 'success' : 'info'}
          icon={row.channel === 'WhatsApp' ? 'fa-brands fa-whatsapp' : 'fa-solid fa-comment-sms'}
        />
      )
    },
    {
      header: 'نوع النموذج / المناسبة',
      accessor: (row) => (
        <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155' }}>
          {row.template}
        </span>
      )
    },
    {
      header: 'نص الرسالة',
      accessor: (row) => (
        <div style={{ maxWidth: '340px', fontSize: '12px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={row.content}>
          {row.content}
        </div>
      )
    },
    {
      header: 'التكلفة',
      accessor: (row) => (
        <span style={{ fontSize: '12px', fontWeight: '800', color: '#059669' }}>
          {row.cost_sar.toFixed(2)} ر.س
        </span>
      )
    },
    {
      header: 'تاريخ الإرسال',
      accessor: (row) => <span style={{ fontSize: '11.5px', color: '#64748B', fontFamily: 'monospace' }}>{row.sent_at}</span>
    },
    {
      header: 'الحالة',
      accessor: (row) => (
        <Badge
          text={row.status}
          type={row.status === 'تم التسليم' ? 'success' : row.status === 'قيد الإرسال' ? 'warning' : 'danger'}
          icon={row.status === 'تم التسليم' ? 'fa-solid fa-circle-check' : 'fa-solid fa-clock'}
        />
      )
    },
    {
      header: 'الإجراءات',
      accessor: (row) => (
        <button
          className="btn-odoo btn-odoo-secondary"
          style={{ padding: '4px 8px', fontSize: '11px', height: '28px' }}
          onClick={() => {
            setComposeChannel(row.channel);
            setRecipientName(row.recipient_name);
            setRecipientPhone(row.phone);
            setMessageBody(row.content);
            setActiveTab('compose');
          }}
        >
          <i className="fa-solid fa-rotate-right ml-1"></i> إعادة إرسال
        </button>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
        color: '#FFF',
        padding: '20px 24px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: '#4F46E5', color: '#FFF', padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' }}>
              COMMUNICATION HUB
            </span>
            <span style={{ color: '#C7D2FE', fontSize: '12px' }}>بوابات الرسائل والإشعارات المباشرة</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '900', margin: '4px 0 0 0' }}>
            مركز الرسائل الموحد (SMS & WhatsApp Business Center)
          </h1>
          <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#E0E7FF' }}>
            إرسال إشعارات مساند، تذاكر الوصول، الفواتير الإلكترونية ZATCA، والحملات التسويقية
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('compose')}
            className="btn-odoo btn-odoo-primary"
            style={{ padding: '8px 16px', fontSize: '13px', background: '#10B981', borderColor: '#10B981' }}
          >
            <i className="fa-solid fa-paper-plane ml-1"></i> إرسال رسالة فورية
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatCard
          title="رصيد الرسائل (SMS Gateway)"
          value="48,250 نقطة"
          icon="fa-solid fa-comment-sms"
          subtext="بوابة Unifonic / Taqnyat معتمدة"
          variant="purple"
        />
        <StatCard
          title="واتساب للأعمال (WhatsApp API)"
          value="99.8% تسليم"
          icon="fa-brands fa-whatsapp"
          subtext="Meta Verified Green Badge"
          variant="teal"
        />
        <StatCard
          title="الرسائل المرسلة اليوم"
          value={messages.length.toString()}
          icon="fa-solid fa-envelopes-bulk"
          subtext="إشعارات مساند وفواتير ZATCA"
          variant="info"
        />
        <StatCard
          title="متوسط تكلفة الرسالة"
          value="0.13 ر.س"
          icon="fa-solid fa-coins"
          subtext="وفر بنسبة 35% عبر قوالب واتساب"
          variant="warning"
        />
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #E2E8F0', paddingBottom: '8px' }}>
        <button
          onClick={() => setActiveTab('logs')}
          className={`btn-odoo ${activeTab === 'logs' ? 'btn-odoo-primary' : 'btn-odoo-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <i className="fa-solid fa-list-check ml-1"></i> سجل وأرشيف الرسائل ({messages.length})
        </button>
        <button
          onClick={() => setActiveTab('compose')}
          className={`btn-odoo ${activeTab === 'compose' ? 'btn-odoo-primary' : 'btn-odoo-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <i className="fa-solid fa-pen-to-square ml-1"></i> محرر الإرسال الفوري
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`btn-odoo ${activeTab === 'templates' ? 'btn-odoo-primary' : 'btn-odoo-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <i className="fa-solid fa-layer-group ml-1"></i> قوالب ونماذج الإشعارات ({templates.length})
        </button>
        <button
          onClick={() => setActiveTab('gateways')}
          className={`btn-odoo ${activeTab === 'gateways' ? 'btn-odoo-primary' : 'btn-odoo-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <i className="fa-solid fa-server ml-1"></i> إعدادات بوابات الربط (Gateways)
        </button>
      </div>

      {/* TAB 1: LOGS */}
      {activeTab === 'logs' && (
        <div className="space-y-3">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setChannelFilter('all')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  border: '1px solid #CBD5E1',
                  background: channelFilter === 'all' ? '#0F172A' : '#FFF',
                  color: channelFilter === 'all' ? '#FFF' : '#334155',
                  cursor: 'pointer'
                }}
              >
                الكل ({messages.length})
              </button>
              <button
                onClick={() => setChannelFilter('WhatsApp')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  border: '1px solid #10B981',
                  background: channelFilter === 'WhatsApp' ? '#10B981' : '#FFF',
                  color: channelFilter === 'WhatsApp' ? '#FFF' : '#047857',
                  cursor: 'pointer'
                }}
              >
                <i className="fa-brands fa-whatsapp ml-1"></i> واتساب
              </button>
              <button
                onClick={() => setChannelFilter('SMS')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  border: '1px solid #3B82F6',
                  background: channelFilter === 'SMS' ? '#3B82F6' : '#FFF',
                  color: channelFilter === 'SMS' ? '#FFF' : '#1D4ED8',
                  cursor: 'pointer'
                }}
              >
                <i className="fa-solid fa-comment-sms ml-1"></i> رسائل نصية (SMS)
              </button>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('sent_messages', filteredMessages, 'excel')} style={{ padding: '6px 12px', fontSize: '12px' }}>
                <i className="fa-solid fa-file-excel text-emerald-600 ml-1"></i> Excel
              </button>
              <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('sent_messages', filteredMessages, 'pdf')} style={{ padding: '6px 12px', fontSize: '12px' }}>
                <i className="fa-solid fa-file-pdf text-red-600 ml-1"></i> PDF
              </button>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filteredMessages}
            searchPlaceholder="ابحث بالاسم، رقم الجوال، الكود، أو نص الرسالة..."
          />
        </div>
      )}

      {/* TAB 2: COMPOSE */}
      {activeTab === 'compose' && (
        <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: '#1E293B' }}>
            <i className="fa-solid fa-paper-plane text-emerald-600 ml-2"></i> إرسال رسالة فورية أو تعميم
          </h2>

          {sendSuccess && (
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#047857', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontWeight: '700', fontSize: '13px' }}>
              <i className="fa-solid fa-circle-check ml-1"></i> تم إرسال الرسالة بنجاح وتسجيلها في الأرشيف المعتمد!
            </div>
          )}

          <form onSubmit={handleSendMessage} className="space-y-4">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: '#334155' }}>
                  قناة الإرسال
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', border: '1px solid #CBD5E1', borderRadius: '8px', cursor: 'pointer', background: composeChannel === 'WhatsApp' ? '#ECFDF5' : '#FFF' }}>
                    <input
                      type="radio"
                      name="channel"
                      value="WhatsApp"
                      checked={composeChannel === 'WhatsApp'}
                      onChange={() => setComposeChannel('WhatsApp')}
                    />
                    <i className="fa-brands fa-whatsapp text-emerald-600"></i> واتساب للأعمال
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', border: '1px solid #CBD5E1', borderRadius: '8px', cursor: 'pointer', background: composeChannel === 'SMS' ? '#EFF6FF' : '#FFF' }}>
                    <input
                      type="radio"
                      name="channel"
                      value="SMS"
                      checked={composeChannel === 'SMS'}
                      onChange={() => setComposeChannel('SMS')}
                    />
                    <i className="fa-solid fa-comment-sms text-blue-600"></i> رسالة نصية SMS
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: '#334155' }}>
                  اختيار قالب جاهز (اختياري)
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={handleTemplateSelect}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                >
                  <option value="">-- رسالة حرة مخصصة --</option>
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.title} ({t.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: '#334155' }}>
                  اسم المستلم / العميل
                </label>
                <input
                  type="text"
                  placeholder="مثال: فهد عبدالرحمن الشمري"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: '#334155' }}>
                  رقم الجوال (مع المفتاح الدولي)
                </label>
                <input
                  type="text"
                  placeholder="+9665XXXXXXXX"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', direction: 'ltr', textAlign: 'right' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: '#334155' }}>
                نص الرسالة
              </label>
              <textarea
                rows={4}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder="اكتب نص الرسالة هنا..."
                style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', lineHeight: '1.6' }}
                required
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                <span>عدد الحروف: {messageBody.length}</span>
                <span>{composeChannel === 'SMS' ? `عدد أجزاء الرسالة: ${Math.ceil(messageBody.length / 70) || 1}` : 'رسالة واتساب مشفرة'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="submit"
                disabled={isSending}
                className="btn-odoo btn-odoo-primary"
                style={{ padding: '10px 24px', fontSize: '14px', background: '#0F172A', borderColor: '#0F172A' }}
              >
                {isSending ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin ml-2"></i> جاري الإرسال الفوري...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane ml-2"></i> إرسال الرسالة الآن
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: TEMPLATES */}
      {activeTab === 'templates' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {templates.map(tmp => (
            <div key={tmp.id} style={{ background: '#FFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B' }}>{tmp.id}</span>
                  <Badge text={tmp.category} type="info" />
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>{tmp.title}</h3>
                <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', fontSize: '12.5px', color: '#334155', lineHeight: '1.6', marginBottom: '12px', border: '1px solid #F1F5F9' }}>
                  {tmp.text}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
                  {tmp.variables.map(v => (
                    <span key={v} style={{ background: '#EEF2FF', color: '#4F46E5', padding: '2px 6px', borderRadius: '4px', fontSize: '10.5px', fontWeight: '700', fontFamily: 'monospace' }}>
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              </div>

              <button
                className="btn-odoo btn-odoo-secondary"
                style={{ width: '100%', fontSize: '12px' }}
                onClick={() => {
                  setSelectedTemplateId(tmp.id);
                  setMessageBody(tmp.text);
                  setActiveTab('compose');
                }}
              >
                <i className="fa-solid fa-pen-nib ml-1"></i> استخدام هذا القالب في الإرسال
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: GATEWAYS */}
      {activeTab === 'gateways' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#FFF', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>
                <i className="fa-solid fa-tower-broadcast text-blue-600 ml-2"></i> بوابة SMS المعتمدة (Taqnyat / Unifonic)
              </h3>
              <Badge text="متصل ومفعل" type="success" />
            </div>
            <p style={{ fontSize: '12.5px', color: '#64748B', marginBottom: '12px' }}>
              بوابة إرسال الرسائل القصيرة الرسمية داخل المملكة العربية السعودية بمعرف Sender ID مسجل لدى هيئة الاتصالات.
            </p>
            <div className="space-y-1.5" style={{ background: '#F8FAFC', padding: '10px', borderRadius: '8px', fontSize: '12px' }}>
              <div><strong>اسم المرسل المعتمد:</strong> ALSULAIM</div>
              <div><strong>الرصيد المتبقي:</strong> 48,250 رسالة</div>
              <div><strong>زمن الاستجابة:</strong> 0.8 ثانية</div>
            </div>
          </div>

          <div style={{ background: '#FFF', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>
                <i className="fa-brands fa-whatsapp text-emerald-600 ml-2"></i> واتساب للأعمال (Meta Cloud API)
              </h3>
              <Badge text="توثيق معتمد" type="success" />
            </div>
            <p style={{ fontSize: '12.5px', color: '#64748B', marginBottom: '12px' }}>
              ربط مباشر وموثق بالعلامة الخضراء لإرسال قوالب التفييز والرحلات والفواتير الضريبية.
            </p>
            <div className="space-y-1.5" style={{ background: '#F8FAFC', padding: '10px', borderRadius: '8px', fontSize: '12px' }}>
              <div><strong>الرقم الموثق:</strong> +966 11 400 2026</div>
              <div><strong>مستوى الجودة (Quality):</strong> عالي (High)</div>
              <div><strong>حد الإرسال اليومي (Tier):</strong> غير محدود (Tier Unlimited)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
