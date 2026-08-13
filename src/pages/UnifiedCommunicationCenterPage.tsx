import React, { useState, useEffect } from 'react';
import { useCompany } from '../contexts/CompanyContext';
import { realErpDataStore } from '../services/realErpDataStore';

interface UnifiedMessage {
  id: string;
  sender: string;
  receiver: string;
  subject: string;
  timestamp: string;
  type: string;
  status: string;
}

const INITIAL_MESSAGES: UnifiedMessage[] = [
  {
    id: 'MSG-301',
    sender: 'شركة السفير الماسي (قسم الاستقدام)',
    receiver: 'Manila Overseas Placement Agency',
    subject: 'طلب استكمال إجراءات تفييز 15 عاملة لفرع المنسكية',
    timestamp: '2026-08-11 11:30 AM',
    type: 'خارجي',
    status: 'تم الاستلام والرد',
  },
  {
    id: 'MSG-302',
    sender: 'شركة ياقوت نجد (جدة)',
    receiver: 'شركة توباز للاستقدام (الدمام)',
    subject: 'طلب تحويل 5 سير ذاتية سائقين مهنيين لعدم توفر الشاغر بفرع جدة',
    timestamp: '2026-08-11 10:15 AM',
    type: 'بين الشركات',
    status: 'قيد الإجراء',
  },
  {
    id: 'MSG-303',
    sender: 'نظام الإشعارات الآلي (System Auto)',
    receiver: 'المرشحة: مريم علي أحمد (C-2026-091)',
    subject: 'إرسال دعوة إجراء المقابلة المرئية عبر رابط المنصة',
    timestamp: '2026-08-11 09:00 AM',
    type: 'آلي ATS',
    status: 'تم الإرسال WhatsApp/Email',
  },
];

export const UnifiedCommunicationCenterPage: React.FC = () => {
  const { activeCompany } = useCompany();
  const [messages, setMessages] = useState<UnifiedMessage[]>([]);

  useEffect(() => {
    realErpDataStore.getRecords<UnifiedMessage>('sent_messages', INITIAL_MESSAGES).then(data => setMessages(data));
  }, []);

  return (
    <div style={{ padding: '24px', backgroundColor: '#F8FAFC', minHeight: '85vh' }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
          borderRadius: '16px',
          padding: '24px 32px',
          color: '#FFFFFF',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <span
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '2px 10px',
              fontSize: '11px',
              fontWeight: '800',
            }}
          >
            UNIFIED GROUP COMMUNICATION CENTER
          </span>
          <h1 style={{ fontSize: '24px', fontWeight: '900', margin: '4px 0 0 0', fontFamily: 'Cairo, sans-serif' }}>
            مركز التواصل والمراسلات الموحد للمجموعة والمكاتب والوكلاء
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#DDD6FE' }}>
            إدارة المراسلات بين الشركات، المكاتب الخارجية، المرشحين، والموظفين مع التوثيق المباشر.
          </p>
        </div>

        <button
          type="button"
          style={{
            backgroundColor: '#FFFFFF',
            color: '#6D28D9',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 20px',
            fontWeight: '800',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          + إنشاء مراسلة أو إشعار موحد
        </button>
      </div>

      {/* Messages Timeline Table */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginBottom: '16px', fontFamily: 'Cairo, sans-serif' }}>
          سجل المراسلات والخطابات النشطة (Communication Timeline):
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                <th style={{ padding: '12px' }}>رقم المراسلة</th>
                <th style={{ padding: '12px' }}>المرسل</th>
                <th style={{ padding: '12px' }}>المستقبل</th>
                <th style={{ padding: '12px' }}>موضوع المراسلة</th>
                <th style={{ padding: '12px' }}>النوع</th>
                <th style={{ padding: '12px' }}>التوقيت</th>
                <th style={{ padding: '12px' }}>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px', fontWeight: '800', color: '#6D28D9' }}>{m.id}</td>
                  <td style={{ padding: '12px', fontWeight: '700' }}>{m.sender}</td>
                  <td style={{ padding: '12px' }}>{m.receiver}</td>
                  <td style={{ padding: '12px', color: '#0F172A', fontWeight: '600' }}>{m.subject}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ backgroundColor: '#F3E8FF', color: '#6B21A8', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>
                      {m.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '11px', color: '#64748B' }}>{m.timestamp}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ backgroundColor: '#ECFDF5', color: '#047857', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
