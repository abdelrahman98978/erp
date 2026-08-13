import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { realErpDataStore } from '../services/realErpDataStore';

interface MessageLog {
  id: string;
  recipient_name: string;
  phone: string;
  channel: 'SMS' | 'WhatsApp';
  template: string;
  status: 'تم التسليم' | 'قيد الإرسال' | 'فشل الإرسال';
  sent_at: string;
}

const MOCK_MESSAGES: MessageLog[] = [
  { id: '1', recipient_name: 'سارة احمد محمد', phone: '+9660558025628', channel: 'WhatsApp', template: 'تحديث مرحلة التفييز للعقد #594', status: 'تم التسليم', sent_at: '2026-07-30 10:47' },
  { id: '2', recipient_name: 'نايف القحطاني', phone: '+966535355555', channel: 'SMS', template: 'تنبيه موعد التذكرة والوصول', status: 'تم التسليم', sent_at: '2026-07-29 16:20' }
];

export const SentMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<MessageLog[]>([]);

  useEffect(() => {
    realErpDataStore.getRecords<MessageLog>('sent_messages', MOCK_MESSAGES).then(data => setMessages(data));
  }, []);

  const columns: Column<MessageLog>[] = [
    { header: '#', accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{row.id}</span> },
    { header: 'المستلم والجوال', accessor: (row) => <div><span style={{ fontWeight: '700' }}>{row.recipient_name}</span><div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{row.phone}</div></div> },
    { header: 'قناة الإرسال', accessor: (row) => <Badge text={row.channel} type={row.channel === 'WhatsApp' ? 'success' : 'info'} icon={row.channel === 'WhatsApp' ? 'fa-brands fa-whatsapp' : 'fa-solid fa-comment-sms'} /> },
    { header: 'نموذج الرسالة', accessor: (row) => <span style={{ fontSize: '12.5px', fontWeight: '600' }}>{row.template}</span> },
    { header: 'تاريخ الإرسال', accessor: (row) => <span style={{ fontSize: '11.5px' }}>{row.sent_at}</span> },
    { header: 'حالة التسليم', accessor: (row) => <Badge text={row.status} type={row.status === 'تم التسليم' ? 'success' : 'warning'} /> }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-message text-purple ml-2"></i> أرشيف وسجل الرسائل المرسلة (SMS & WhatsApp Archive)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>متابعة حالة تسليم الرسائل التلقائية والإشعارات التنفيذية</p>
        </div>
      </div>
      <DataTable columns={columns} data={messages.length > 0 ? messages : MOCK_MESSAGES} searchPlaceholder="ابحث بالمستلم، رقم الجوال، أو نوع الرسالة..." />
    </div>
  );
};
