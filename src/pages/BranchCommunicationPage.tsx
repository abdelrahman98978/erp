import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { realErpDataStore } from '../services/realErpDataStore';
import { ArrowLeftRight, Plus, Send, Lock, MessageSquare, Building2, Check, X, ShieldCheck } from 'lucide-react';

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
    to_branch: 'فرع جدة - طريق الملك',
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
    setTransferForm({ to_branch: 'فرع جدة - طريق الملك', req_type: 'مناقلة عمالة', details: '' });
  };

  const filteredMessages = messages.filter(m => activeChannel === 'المجموعة العامة' || m.channel === activeChannel);

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
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
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>BRANCH DISPATCH & TRANSFERS</span>
            </div>
            <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, margin: '0', letterSpacing: '-0.02em', color: '#ffffff', fontFamily: 'var(--font-family-display)' }}>
              مركز التواصل والمناقلات بين فروع الشركة
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#a1a1aa', fontWeight: 420 }}>
              مجموعة خالد السليم • البث المباشر بين الفروع، التعاميم الرسمية، مناقلات العمالة والسيولة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="button-white-pill"
            onClick={() => setShowTransferModal(true)}
            style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
          >
            <Plus className="w-4 h-4 ml-1" />
            <span>+ طلب مناقلة بين الفروع</span>
          </button>
        </div>
      </div>

      {/* Branch Metrics Cards */}
      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#71717a', fontWeight: 550 }}>الفرع الرئيسي (الرياض)</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>14 متصل</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>تزامن 100%</span>
        </div>

        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#71717a', fontWeight: 550 }}>فرع جدة (الغربية)</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>8 متصلين</div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '10px' }}>18 تفويض معتمد</span>
        </div>

        <div className="card-pistachio-band" style={{ padding: '24px', borderRadius: '16px' }}>
          <span style={{ fontSize: '13px', color: '#000000', fontWeight: 550 }}>فرع الخبر (الشرقية)</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>6 متصلين</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>جاهز للاستلام</span>
        </div>

        <div className="card-pricing-featured" style={{ padding: '24px', borderRadius: '16px', background: '#000000', color: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 550 }}>مركز الإيواء والتغذية</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#ffffff', marginTop: '6px', letterSpacing: '-0.02em' }}>61 عاملة</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>6 متاحات للمناقلة</span>
        </div>
      </div>

      {/* Main Grid Layout: Left Channels Menu & Right Chat View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Channels Menu */}
        <div className="card-pricing" style={{ padding: '20px', borderRadius: '24px', background: '#ffffff' }}>
          <h3 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-black" />
            <span>قنوات التواصل بين الفروع</span>
          </h3>

          <div className="space-y-1">
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
                className={`p-2.5 rounded-full cursor-pointer text-xs flex items-center justify-between transition-all ${activeChannel === c.id ? 'bg-black text-white font-bold' : 'bg-transparent text-zinc-700 hover:bg-zinc-50'}`}
              >
                <span>{c.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeChannel === c.id ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-600'}`}>
                  {c.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Messages & Direct Chat View */}
        <div className="md:col-span-2 card-pricing flex flex-col justify-between" style={{ padding: '20px', borderRadius: '24px', background: '#ffffff', minHeight: '460px' }}>
          <div>
            <div className="border-b border-zinc-100 pb-3 mb-3 flex justify-between items-center">
              <h3 className="text-sm font-bold text-black m-0">
                قناة المحادثة: {activeChannel}
              </h3>
              <div className="inline-flex items-center gap-1 bg-champagne-pale text-champagne-dark px-2.5 py-1 rounded-full text-[11px] font-bold border border-champagne/30">
                <Lock className="w-3 h-3 text-champagne-dark" />
                <span>تشفير مباشر آمن 256-bit</span>
              </div>
            </div>

            {/* Messages Stream */}
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {filteredMessages.map(m => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-2xl text-xs ${m.priority === 'تعميم رسمي' ? 'bg-zinc-900 text-white border border-zinc-800' : m.priority === 'عاجل' ? 'bg-rose-50 text-rose-950 border border-rose-200' : 'bg-zinc-50 text-black border border-zinc-200'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold">
                      {m.sender_name} <span className="text-[11px] font-normal opacity-70">({m.sender_branch} • {m.sender_role})</span>
                    </span>
                    <span className="text-[11px] font-mono opacity-60">{m.timestamp}</span>
                  </div>
                  <p className="m-0 leading-relaxed font-sans">
                    {m.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* New Message Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2 mt-4 pt-3 border-t border-zinc-100">
            <input
              type="text"
              value={newMessageText}
              onChange={e => setNewMessageText(e.target.value)}
              placeholder={`اكتب رسالة أو تعميم لقناة (${activeChannel})...`}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-2 px-4 text-xs text-black focus:border-black focus:outline-none"
            />
            <button type="submit" className="button-primary-pill" style={{ minHeight: '36px', padding: '6px 18px', fontSize: '12px' }}>
              <Send className="w-3.5 h-3.5 ml-1" />
              <span>إرسال</span>
            </button>
          </form>
        </div>
      </div>

      {/* Inter-Branch Transfer Requests Table */}
      <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
        <div className="p-4 border-b border-zinc-100 bg-white">
          <h3 className="text-sm font-bold text-black flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-black" />
            <span>سجل طلبات المناقلات والتنسيق بين الفروع (Inter-Branch Transfers Log)</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-zinc-700">
            <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">رقم الطلب</th>
                <th className="p-3.5">الفرع الطالب</th>
                <th className="p-3.5">الفرع المحوّل إليه</th>
                <th className="p-3.5">نوع المناقلة</th>
                <th className="p-3.5">التفاصيل والملاحظات</th>
                <th className="p-3.5">الحالة والاعتماد</th>
                <th className="p-3.5">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {transfers.map(t => (
                <tr key={t.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-black">{t.request_no}</td>
                  <td className="p-3.5 font-bold text-black">{t.from_branch}</td>
                  <td className="p-3.5 font-bold text-zinc-800">{t.to_branch}</td>
                  <td className="p-3.5 font-semibold text-black">{t.req_type}</td>
                  <td className="p-3.5 text-zinc-600 text-xs">{t.details}</td>
                  <td className="p-3.5">
                    <Badge text={t.status} type={t.status === 'تم القبول والتحويل' ? 'success' : 'warning'} />
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-zinc-400">{t.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Inter-Branch Transfer Request Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden font-sans">
            <div className="p-5 bg-black text-white flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-champagne-light" />
                <span>تقديم طلب مناقلة وتنسيق بين الفروع</span>
              </h3>
              <button onClick={() => setShowTransferModal(false)} className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTransfer} className="p-6 space-y-4 bg-white text-black">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">الفرع الهدف (المحوّل إليه) *</label>
                <select
                  value={transferForm.to_branch}
                  onChange={e => setTransferForm({ ...transferForm, to_branch: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                >
                  <option>فرع جدة - طريق الملك</option>
                  <option>فرع الخبر - المنطقة الشرقية</option>
                  <option>مركز الإيواء الرئيسي (الرياض)</option>
                  <option>الإدارة العامة والمالية</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">نوع المناقلة *</label>
                <select
                  value={transferForm.req_type}
                  onChange={e => setTransferForm({ ...transferForm, req_type: e.target.value as any })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                >
                  <option value="مناقلة عمالة">مناقلة عمالة ونقل سكن</option>
                  <option value="طلب سيولة تشغيلية">طلب سيولة مالية سريعة</option>
                  <option value="تأشيرة عاجلة">تنسيق تأشيرة عاجلة</option>
                  <option value="مساعدة استقدام">دعم إداري واستقدام</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">تفاصيل وشروط الطلب *</label>
                <textarea
                  rows={4}
                  placeholder="اكتب التفاصيل هنا (أرقام الجوازات، الأعداد المطلوبة، أو المبلغ المحول)..."
                  value={transferForm.details}
                  onChange={e => setTransferForm({ ...transferForm, details: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-100">
                <button type="button" className="button-outline-on-light" onClick={() => setShowTransferModal(false)} style={{ padding: '6px 16px', fontSize: '13px', minHeight: '36px' }}>
                  إلغاء
                </button>
                <button type="submit" className="button-primary-pill" style={{ padding: '6px 20px', fontSize: '13px', minHeight: '36px' }}>
                  <Check className="w-4 h-4 ml-1" />
                  <span>إرسال طلب المناقلة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchCommunicationPage;
