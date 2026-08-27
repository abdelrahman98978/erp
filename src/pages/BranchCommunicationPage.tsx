import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { useLanguage } from '../i18n/LanguageContext';
import { realErpDataStore } from '../services/realErpDataStore';

export interface BranchMessage {
  id: string;
  sender_name: string;
  sender_branch: string;
  sender_role: string;
  content: string;
  timestamp: string;
  channel: string;
  priority: 'عادي' | 'عاجل' | 'تعميم رسمي';
  attachments?: string[];
}

export interface InterBranchTransferReq {
  id: string;
  request_no: string;
  from_branch: string;
  to_branch: string;
  req_type: 'مناقلة عمالة' | 'طلب سيولة تشغيلية' | 'تأشيرة عاجلة' | 'مساعدة استقدام';
  details: string;
  status: 'بانتظار الاعتماد' | 'تم القبول والتحويل' | 'مرفوض';
  created_at: string;
}

const MOCK_BRANCH_MESSAGES: BranchMessage[] = [
  {
    id: 'm-1',
    sender_name: 'عبد الفتاح السليم',
    sender_branch: 'الإدارة العامة - الرياض',
    sender_role: 'المدير العام',
    content: 'تعميم رسمي: يرجى العلم ببدء ربط المرحلة الثانية ZATCA لجميع فروع المجموعة ابتداءً من الأسبوع القادم.',
    timestamp: '15:20',
    channel: 'المجموعة العامة',
    priority: 'تعميم رسمي'
  },
  {
    id: 'm-2',
    sender_name: 'خالد العتيبي',
    sender_branch: 'فرع جدة - طريق الملك',
    sender_role: 'مدير فرع جدة',
    content: 'تم استقبال وفد الوكالة الإثيوبية DAMAS بفرع جدة، وتم توثيق 18 تفويض إنجاز جديد.',
    timestamp: '14:45',
    channel: 'فرع جدة',
    priority: 'عادي'
  },
  {
    id: 'm-3',
    sender_name: 'سارة خالد',
    sender_branch: 'مركز الإيواء والتغذية - الرياض',
    sender_role: 'مشرفة الإيواء',
    content: 'عاجل: تم تجهيز 6 عاملات متميزات متاحين للنقل والتحويل لفرع الشرقية.',
    timestamp: '13:10',
    channel: 'قسم الإيواء',
    priority: 'عاجل'
  }
];

const MOCK_TRANSFERS: InterBranchTransferReq[] = [
  {
    id: 'tr-101',
    request_no: '#REQ-BR-2026-08',
    from_branch: 'مركز الإيواء الرئيسي (الرياض)',
    to_branch: 'فرع الشرقية (الخبر)',
    req_type: 'مناقلة عمالة',
    details: 'طلب نقل 4 عاملات إثيوبيات جاهزات للتأجير الفوري لفرع الخبر.',
    status: 'تم القبول والتحويل',
    created_at: '2026-07-31 10:30'
  },
  {
    id: 'tr-102',
    request_no: '#REQ-BR-2026-09',
    from_branch: 'فرع جدة',
    to_branch: 'الإدارة المالية - الرياض',
    req_type: 'طلب سيولة تشغيلية',
    details: 'طلب دعم سلفة عاجلة لسداد رسوم تأشيرات ومساند بمبلغ 25,000 ر.س.',
    status: 'بانتظار الاعتماد',
    created_at: '2026-07-31 12:15'
  }
];

export const BranchCommunicationPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeChannel, setActiveChannel] = useState('المجموعة العامة');
  const [messages, setMessages] = useState<BranchMessage[]>([]);
  const [transfers, setTransfers] = useState<InterBranchTransferReq[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);

  useEffect(() => {
    realErpDataStore.getRecords<BranchMessage>('branch_communications', MOCK_BRANCH_MESSAGES).then(data => setMessages(data));
  }, []);

  // New Transfer Request Form State
  const [transferForm, setTransferForm] = useState({
    to_branch: 'فرع جدة',
    req_type: 'مناقلة عمالة' as const,
    details: ''
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const newMsg: BranchMessage = {
      id: `m-${Date.now()}`,
      sender_name: 'مشرف admin',
      sender_branch: 'الإدارة العامة - الرياض',
      sender_role: 'Administrator',
      content: newMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel: activeChannel,
      priority: 'عادي'
    };

    setMessages([...messages, newMsg]);
    setNewMessageText('');
  };

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferForm.details.trim()) return;

    const newTr: InterBranchTransferReq = {
      id: `tr-${Date.now()}`,
      request_no: `#REQ-BR-2026-${10 + transfers.length}`,
      from_branch: 'الإدارة العامة (الرياض)',
      to_branch: transferForm.to_branch,
      req_type: transferForm.req_type,
      details: transferForm.details,
      status: 'بانتظار الاعتماد',
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setTransfers([newTr, ...transfers]);
    setShowTransferModal(false);
    setTransferForm({ to_branch: 'فرع جدة', req_type: 'مناقلة عمالة', details: '' });
    alert('تم رفع طلب المناقلة والتنسيق بين الفروع بنجاح وهو بانتظار الموافقة!');
  };

  const filteredMessages = messages.filter(m => activeChannel === 'المجموعة العامة' || m.channel === activeChannel);

  return (
    <div>
      {/* Top Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800' }}>
            <i className="fa-solid fa-comments-dollar text-purple ml-2"></i> مركز التواصل والمناقلات بين فروع الشركة
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            مجموعة خالد السليم • البث المباشر بين الفروع، التعاميم الرسمية، مناقلات العمالة والسيولة
          </p>
        </div>

        <button className="button-primary-pill" onClick={() => setShowTransferModal(true)} style={{ fontSize: '13px', padding: '6px 18px', minHeight: '38px' }}>
          <i className="fa-solid fa-right-left ml-1"></i> + طلب مناقلة بين الفروع
        </button>
      </div>

      {/* Branch Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card-pricing" style={{ padding: '20px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '12px', color: '#71717a', fontWeight: 550 }}>الفرع الرئيسي (الرياض)</span>
          <div className="display-sm" style={{ fontSize: '28px', fontWeight: 330, color: '#000000', marginTop: '4px', letterSpacing: '-0.02em' }}>14 متصل</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '8px' }}>تزامن 100%</span>
        </div>

        <div className="card-pricing" style={{ padding: '20px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '12px', color: '#71717a', fontWeight: 550 }}>فرع جدة (الغربية)</span>
          <div className="display-sm" style={{ fontSize: '28px', fontWeight: 330, color: '#000000', marginTop: '4px', letterSpacing: '-0.02em' }}>8 متصلين</div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '8px' }}>18 تفويض معتمد</span>
        </div>

        <div className="card-pistachio-band" style={{ padding: '20px', borderRadius: '16px' }}>
          <span style={{ fontSize: '12px', color: '#000000', fontWeight: 550 }}>فرع الخبر (الشرقية)</span>
          <div className="display-sm" style={{ fontSize: '28px', fontWeight: 330, color: '#000000', marginTop: '4px', letterSpacing: '-0.02em' }}>6 متصلين</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '8px' }}>جاهز للاستلام</span>
        </div>

        <div className="card-pricing-featured" style={{ padding: '20px', borderRadius: '16px', background: '#000000', color: '#ffffff' }}>
          <span style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: 550 }}>مركز الإيواء والتغذية</span>
          <div className="display-sm" style={{ fontSize: '28px', fontWeight: 330, color: '#ffffff', marginTop: '4px', letterSpacing: '-0.02em' }}>61 عاملة</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '8px' }}>6 متاحات للمناقلة</span>
        </div>
      </div>

      {/* Main Grid Layout: Left Chat Channels & Right Transfer Requests */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>
        {/* Left Channels Menu */}
        <div className="card-pricing" style={{ padding: '20px', borderRadius: '16px', background: '#ffffff' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#000000', marginBottom: '12px' }}>
            <i className="fa-solid fa-headset ml-1"></i> قنوات التواصل بين الفروع
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { id: 'المجموعة العامة', name: '📢 #المجموعة العامة (التعاميم)', badge: 'كل الفروع' },
              { id: 'فرع الرياض', name: '🏛️ #فرع-الرياض-الرئيسي', badge: '14 نشط' },
              { id: 'فرع جدة', name: '🏖️ #فرع-جدة-الغربية', badge: '8 نشط' },
              { id: 'فرع الشرقية', name: '🛢️ #فرع-الخبر-الشرقية', badge: '6 نشط' },
              { id: 'قسم الإيواء', name: '🏡 #قسم-الإيواء-والسكن', badge: '61 عاملة' }
            ].map(c => (
              <div
                key={c.id}
                onClick={() => setActiveChannel(c.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  fontSize: '12.5px',
                  fontWeight: activeChannel === c.id ? 550 : 420,
                  background: activeChannel === c.id ? '#000000' : 'transparent',
                  color: activeChannel === c.id ? '#ffffff' : '#27272a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{c.name}</span>
                <span className="pill-tag-shade" style={{ fontSize: '10px' }}>{c.badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Messages & Direct Chat View */}
        <div className="table-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', minHeight: '500px' }}>
          <div style={{ paddingBottom: '12px', borderBottom: '1px solid #E2E8F0', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#005154', margin: 0 }}>
              قناة المحادثة: {activeChannel}
            </h3>
            <Badge text="تشفير مباشر آمن 256-bit" type="success" icon="fa-solid fa-lock" />
          </div>

          {/* Messages Stream */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', maxHeight: '360px', paddingRight: '4px' }}>
            {filteredMessages.map(m => (
              <div key={m.id} style={{
                background: m.priority === 'تعميم رسمي' ? '#EFF6FF' : m.priority === 'عاجل' ? '#FEF2F2' : '#F8FAFC',
                border: m.priority === 'تعميم رسمي' ? '1px solid #BFDBFE' : m.priority === 'عاجل' ? '1px solid #FCA5A5' : '1px solid #E2E8F0',
                padding: '12px 16px',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '800', fontSize: '13px', color: '#005154' }}>
                    {m.sender_name} <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>({m.sender_branch} • {m.sender_role})</span>
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.timestamp}</span>
                </div>
                <p style={{ fontSize: '13.5px', color: '#181C1C', margin: 0, lineHeight: '1.6' }}>
                  {m.content}
                </p>
              </div>
            ))}
          </div>

          {/* New Message Input */}
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="filter-input"
              value={newMessageText}
              onChange={e => setNewMessageText(e.target.value)}
              placeholder={`اكتب رسالة أو تعميم لقناة (${activeChannel})...`}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn-odoo btn-odoo-purple">
              إرسال <i className="fa-solid fa-paper-plane mr-1"></i>
            </button>
          </form>
        </div>
      </div>

      {/* Inter-Branch Transfer Requests Table */}
      <div className="table-card" style={{ padding: '24px', marginTop: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#005154', marginBottom: '16px' }}>
          <i className="fa-solid fa-right-left ml-2"></i> سجل طلبات المناقلات والتنسيق بين الفروع (Inter-Branch Transfers Log)
        </h3>

        <table className="odoo-data-table">
          <thead>
            <tr>
              <th>رقم الطلب</th>
              <th>الفرع الطالب</th>
              <th>الفرع المحوّل إليه</th>
              <th>نوع المناقلة</th>
              <th>التفاصيل والملاحظات</th>
              <th>الحالة والاعتماد</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map(t => (
              <tr key={t.id}>
                <td style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{t.request_no}</td>
                <td style={{ fontWeight: '700' }}>{t.from_branch}</td>
                <td style={{ fontWeight: '700' }}>{t.to_branch}</td>
                <td><Badge text={t.req_type} type="purple" /></td>
                <td style={{ fontSize: '12.5px' }}>{t.details}</td>
                <td><Badge text={t.status} type={t.status === 'تم القبول والتحويل' ? 'success' : 'warning'} /></td>
                <td style={{ fontSize: '12px' }}>{t.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Inter-Branch Transfer Request Modal */}
      {showTransferModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="table-card" style={{ width: '520px', padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154' }}>
                <i className="fa-solid fa-right-left ml-2"></i> تقديم طلب مناقلة وتنسيق بين الفروع
              </h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setShowTransferModal(false)}></i>
            </div>

            <form onSubmit={handleCreateTransfer}>
              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">الفرع الهدف (المحوّل إليه) *</label>
                <select
                  className="filter-select"
                  value={transferForm.to_branch}
                  onChange={e => setTransferForm({ ...transferForm, to_branch: e.target.value })}
                >
                  <option>فرع جدة - طريق الملك</option>
                  <option>فرع الخبر - المنطقة الشرقية</option>
                  <option>مركز الإيواء الرئيسي (الرياض)</option>
                  <option>الإدارة العامة والمالية</option>
                </select>
              </div>

              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">نوع المناقلة *</label>
                <select
                  className="filter-select"
                  value={transferForm.req_type}
                  onChange={e => setTransferForm({ ...transferForm, req_type: e.target.value as any })}
                >
                  <option value="مناقلة عمالة">مناقلة عمالة ونقل سكن</option>
                  <option value="طلب سيولة تشغيلية">طلب سيولة مالية سريعة</option>
                  <option value="تأشيرة عاجلة">تنسيق تأشيرة عاجلة</option>
                  <option value="مساعدة استقدام">دعم إداري واستقدام</option>
                </select>
              </div>

              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label className="filter-label">تفاصيل وشروط الطلب *</label>
                <textarea
                  className="filter-input"
                  rows={4}
                  placeholder="اكتب التفاصيل هنا (أرقام الجوازات، الأعداد المطلوبة، أو المبلغ المحول)..."
                  value={transferForm.details}
                  onChange={e => setTransferForm({ ...transferForm, details: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-odoo btn-odoo-secondary" onClick={() => setShowTransferModal(false)}>إلغاء</button>
                <button type="submit" className="btn-odoo btn-odoo-purple">إرسال طلب المناقلة</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchCommunicationPage;
