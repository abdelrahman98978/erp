import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';
import { useCompany } from '../contexts/CompanyContext';

export interface UnifiedCorrespondence {
  id: string;
  memo_no: string;
  sender_entity: string;
  recipient_entity: string;
  subject: string;
  category: 'خطاب رسمي' | 'تعميم إداري' | 'طلب نقل كفالة' | 'تسوية مالية' | 'طلب استقدام دولي';
  priority: 'عاجل جداً' | 'سري وهام' | 'عادي';
  body: string;
  status: 'معتمد وموجه' | 'قيد المراجعة' | 'مؤرشف';
  attachment_name?: string;
  created_at: string;
  approved_by?: string;
}

const MOCK_CORRESPONDENCE: UnifiedCorrespondence[] = [
  {
    id: 'MEMO-101',
    memo_no: 'SAF-ADM-2026-081',
    sender_entity: 'شركة السفير الماسي للاستقدام',
    recipient_entity: 'وكالة مانيلا الدولية (الفلبين)',
    subject: 'طلب تفييز عاجل لـ 15 عقد استقدام مساند خاص بفرع الرياض',
    category: 'طلب استقدام دولي',
    priority: 'عاجل جداً',
    body: 'نحيطكم علماً بصدور تأشيرات العمل لـ 15 عاملة منزلية، يرجى التكرم بحجز تذاكر الطيران على الخطوط السعودية وإشعارنا برقم الرحلة قبل نهاية الأسبوع.',
    status: 'معتمد وموجه',
    attachment_name: 'قائمة_تأشيرات_الرياض_مساند.pdf',
    created_at: '2026-08-17 11:30',
    approved_by: 'خالد السليم (الرئيس التنفيذي)'
  },
  {
    id: 'MEMO-102',
    memo_no: 'YAQ-HR-2026-042',
    sender_entity: 'شركة ياقوت نجد (جدة)',
    recipient_entity: 'شركة توباز للاستقدام (الدمام)',
    subject: 'طلب تحويل 5 سير ذاتية لسائقين مهنيين لفرع الشرقية',
    category: 'طلب نقل كفالة',
    priority: 'عادي',
    body: 'نظراً لاكتفاء فرع جدة من طلبات السائقين المهنيين ووجود طلبات شاغرة بفرع الدمام، نرجو الموافقة على تحويل السير المرفقة للمتابعة.',
    status: 'معتمد وموجه',
    attachment_name: 'سير_السائقين_المهنيين.pdf',
    created_at: '2026-08-17 10:15',
    approved_by: 'عبدالرحمن العتيبي (مدير العمليات)'
  },
  {
    id: 'MEMO-103',
    memo_no: 'GRP-FIN-2026-019',
    sender_entity: 'الإدارة المركزية للمجموعة (Al-Sulaim HQ)',
    recipient_entity: 'كافة شركات وفروع المجموعة (الرياض، جدة، الدمام)',
    subject: 'تعميم إداري: اعتماد نموذج الفوترة الإلكترونية ZATCA Phase 2',
    category: 'تعميم إداري',
    priority: 'سري وهام',
    body: 'التزاماً بتعليمات هيئة الزكاة والضريبة والجمارك، يمنع إصدار أي فاتورة يدوية ويجب تصدير كافة الفواتير حصرياً عبر محرك ZATCA المعتمد في المنظومة.',
    status: 'معتمد وموجه',
    attachment_name: 'دليل_الفوترة_المرحلة_الثانية.pdf',
    created_at: '2026-08-16 09:00',
    approved_by: 'الإدارة المالية العليا'
  },
  {
    id: 'MEMO-104',
    memo_no: 'DAR-OPS-2026-008',
    sender_entity: 'شركة دار الرواد للمقاولات والتشغيل',
    recipient_entity: 'قسم الإيواء والرعاية الموحد',
    subject: 'طلب تجهيز سكن وإعاشة لـ 20 عاملاً لقطاع الضيافة',
    category: 'خطاب رسمي',
    priority: 'عاجل جداً',
    body: 'يرجى ترتيب الوجبات الغذائية وتخصيص غرف الإيواء بمركز الرمال استعداداً لانطلاق العقد التشغيلي ابتداءً من الأسبوع القادم.',
    status: 'قيد المراجعة',
    attachment_name: 'جدول_الكوادر_التشغيلية.pdf',
    created_at: '2026-08-15 14:20'
  }
];

export const UnifiedCommunicationCenterPage: React.FC = () => {
  const { activeCompany } = useCompany();
  const [correspondenceList, setCorrespondenceList] = useState<UnifiedCorrespondence[]>([]);
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose' | 'letterhead-preview'>('inbox');
  const [selectedMemo, setSelectedMemo] = useState<UnifiedCorrespondence | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('الكل');

  // New Memo State
  const [formData, setFormData] = useState({
    sender_entity: 'مجموعة شركات خالد السليم القابضة',
    recipient_entity: '',
    subject: '',
    category: 'خطاب رسمي' as const,
    priority: 'عادي' as const,
    body: '',
    attachment_name: ''
  });

  useEffect(() => {
    realErpDataStore.getRecords<UnifiedCorrespondence>('unified_correspondence', MOCK_CORRESPONDENCE).then(data => {
      setCorrespondenceList(data);
      if (data.length > 0) setSelectedMemo(data[0]);
    });
  }, []);

  const handleCreateMemo = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMemo: UnifiedCorrespondence = {
      id: `MEMO-${Date.now().toString().slice(-3)}`,
      memo_no: `GRP-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
      sender_entity: formData.sender_entity,
      recipient_entity: formData.recipient_entity,
      subject: formData.subject,
      category: formData.category,
      priority: formData.priority,
      body: formData.body,
      status: 'معتمد وموجه',
      attachment_name: formData.attachment_name || undefined,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
      approved_by: 'خالد السليم (الرئيس التنفيذي)'
    };

    const updated = await realErpDataStore.addRecord<UnifiedCorrespondence>('unified_correspondence', newMemo, MOCK_CORRESPONDENCE);
    setCorrespondenceList(updated);
    setSelectedMemo(newMemo);
    setActiveTab('inbox');
  };

  const categories = ['الكل', 'خطاب رسمي', 'تعميم إداري', 'طلب نقل كفالة', 'تسوية مالية', 'طلب استقدام دولي'];

  const filteredList = correspondenceList.filter(m => {
    if (filterCategory !== 'الكل' && m.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 100%)',
        color: '#FFF',
        padding: '20px 24px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: '#8B5CF6', color: '#FFF', padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' }}>
              INTER-COMPANY CORRESPONDENCE
            </span>
            <span style={{ color: '#DDD6FE', fontSize: '12px' }}>نظام الخطابات والتعميمات الإدارية الموثقة</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '900', margin: '4px 0 0 0' }}>
            مركز التواصل والمراسلات الموحد للمجموعة (Executive Memo & Dispatch Hub)
          </h1>
          <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#EDE9FE' }}>
            إصدار وتوثيق الخطابات الرسمية بين الشركات، التعميمات التنفيذية، والتوجيهات للمكاتب الخارجية
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('compose')}
            className="btn-odoo btn-odoo-primary"
            style={{ padding: '8px 18px', fontSize: '13px', background: '#10B981', borderColor: '#10B981' }}
          >
            <i className="fa-solid fa-file-pen ml-1"></i> تحرير خطاب رسمي جديد
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatCard
          title="إجمالي الخطابات والتعميمات"
          value={`${correspondenceList.length} مراسلة`}
          icon="fa-solid fa-envelopes-bulk"
          subtext="موثقة إلكترونياً بالكامل"
          variant="purple"
        />
        <StatCard
          title="المراسلات العاجلة"
          value="2 خطابات"
          icon="fa-solid fa-triangle-exclamation"
          subtext="تتطلب اتخاذ إجراء فوري"
          variant="warning"
        />
        <StatCard
          title="التوجيهات للمكاتب الدولية"
          value="18 توجيهاً"
          icon="fa-solid fa-earth-americas"
          subtext="الفلبين، إثيوبيا، أوغندا"
          variant="teal"
        />
        <StatCard
          title="نسبة الاعتماد والتنفيذ"
          value="98.5%"
          icon="fa-solid fa-stamp"
          subtext="حوكمة وتكامل بين الشركات"
          variant="info"
        />
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #E2E8F0', paddingBottom: '8px' }}>
        <button
          onClick={() => setActiveTab('inbox')}
          className={`btn-odoo ${activeTab === 'inbox' ? 'btn-odoo-primary' : 'btn-odoo-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <i className="fa-solid fa-inbox ml-1"></i> وارد وصادر المراسلات ({correspondenceList.length})
        </button>
        <button
          onClick={() => setActiveTab('compose')}
          className={`btn-odoo ${activeTab === 'compose' ? 'btn-odoo-primary' : 'btn-odoo-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <i className="fa-solid fa-feather-pointed ml-1"></i> منشئ الخطابات والتعميمات
        </button>
        {selectedMemo && (
          <button
            onClick={() => setActiveTab('letterhead-preview')}
            className={`btn-odoo ${activeTab === 'letterhead-preview' ? 'btn-odoo-primary' : 'btn-odoo-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            <i className="fa-solid fa-file-invoice ml-1"></i> معاينة الخطاب الرسمي المطبوع
          </button>
        )}
      </div>

      {/* TAB 1: INBOX & TIMELINE */}
      {activeTab === 'inbox' && (
        <div className="space-y-3">
          {/* Filter Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setFilterCategory(c)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700',
                    border: '1px solid #CBD5E1',
                    background: filterCategory === c ? '#4C1D95' : '#FFF',
                    color: filterCategory === c ? '#FFF' : '#334155',
                    cursor: 'pointer'
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('unified_correspondence', filteredList, 'excel')} style={{ padding: '6px 12px', fontSize: '12px' }}>
                <i className="fa-solid fa-file-excel text-emerald-600 ml-1"></i> Excel
              </button>
              <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('unified_correspondence', filteredList, 'pdf')} style={{ padding: '6px 12px', fontSize: '12px' }}>
                <i className="fa-solid fa-file-pdf text-red-600 ml-1"></i> PDF
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {filteredList.map(memo => (
              <div
                key={memo.id}
                style={{
                  background: '#FFF',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  padding: '20px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', fontFamily: 'monospace', color: '#6D28D9' }}>{memo.memo_no}</span>
                    <Badge
                      text={memo.priority}
                      type={memo.priority === 'عاجل جداً' ? 'danger' : memo.priority === 'سري وهام' ? 'warning' : 'info'}
                    />
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>{memo.subject}</h3>

                  <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', fontSize: '11.5px', color: '#475569', marginBottom: '12px', lineHeight: '1.6' }}>
                    <div><strong>الجهة المصدرة:</strong> {memo.sender_entity}</div>
                    <div><strong>الجهة المستلمة:</strong> {memo.recipient_entity}</div>
                  </div>

                  <p style={{ fontSize: '12.5px', color: '#334155', lineHeight: '1.5', margin: '0 0 12px 0' }}>
                    {memo.body}
                  </p>

                  {memo.attachment_name && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#2563EB', fontWeight: '700', marginBottom: '12px' }}>
                      <i className="fa-solid fa-paperclip"></i> مرفق: {memo.attachment_name}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>{memo.created_at}</span>
                  <button
                    className="btn-odoo btn-odoo-purple"
                    style={{ padding: '4px 12px', fontSize: '11.5px' }}
                    onClick={() => {
                      setSelectedMemo(memo);
                      setActiveTab('letterhead-preview');
                    }}
                  >
                    <i className="fa-solid fa-eye ml-1"></i> فتح الخطاب الرسمي
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: COMPOSE MEMO */}
      {activeTab === 'compose' && (
        <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '16px' }}>
            <i className="fa-solid fa-file-pen text-purple-600 ml-2"></i> تحرير خطاب رسمي أو تعميم تنفيذي
          </h2>

          <form onSubmit={handleCreateMemo} className="space-y-4">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>الجهة المصدرة للخطاب</label>
                <input
                  type="text"
                  value={formData.sender_entity}
                  onChange={(e) => setFormData({ ...formData, sender_entity: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>الجهة أو الشخص المستلم</label>
                <input
                  type="text"
                  placeholder="مثال: شركة توباز للاستقدام / وكالة مانيلا"
                  value={formData.recipient_entity}
                  onChange={(e) => setFormData({ ...formData, recipient_entity: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>تصنيف المراسلة</label>
                <select
                  value={formData.category}
                  onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                >
                  <option value="خطاب رسمي">خطاب رسمي</option>
                  <option value="تعميم إداري">تعميم إداري</option>
                  <option value="طلب نقل كفالة">طلب نقل كفالة</option>
                  <option value="تسوية مالية">تسوية مالية</option>
                  <option value="طلب استقدام دولي">طلب استقدام دولي</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>مستوى الأهمية والسرية</label>
                <select
                  value={formData.priority}
                  onChange={(e: any) => setFormData({ ...formData, priority: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                >
                  <option value="عادي">عادي</option>
                  <option value="عاجل جداً">عاجل جداً</option>
                  <option value="سري وهام">سري وهام</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>موضوع الخطاب</label>
              <input
                type="text"
                placeholder="اكتب عنوان وموضوع الخطاب..."
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>نص الخطاب / التوجيه الإداري</label>
              <textarea
                rows={5}
                placeholder="اكتب نص الخطاب هنا بالتفصيل..."
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', lineHeight: '1.6' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>اسم الملف المرفق (اختياري)</label>
              <input
                type="text"
                placeholder="مثال: ملحق_العقود_المعتمدة.pdf"
                value={formData.attachment_name}
                onChange={(e) => setFormData({ ...formData, attachment_name: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('inbox')}
                className="btn-odoo btn-odoo-secondary"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="btn-odoo btn-odoo-primary"
                style={{ padding: '8px 24px', fontSize: '13px', background: '#4C1D95', borderColor: '#4C1D95' }}
              >
                <i className="fa-solid fa-stamp ml-1"></i> اعتماد وإصدار الخطاب الرسمي
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: LETTERHEAD PREVIEW */}
      {activeTab === 'letterhead-preview' && selectedMemo && (
        <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '32px', maxWidth: '800px', margin: '0 auto', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          {/* Header of Letter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px double #0F172A', paddingBottom: '16px', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#0F172A', margin: 0 }}>مجموعة شركات خالد السليم للاستقدام والتشغيل</h2>
              <div style={{ fontSize: '12px', color: '#64748B' }}>المملكة العربية السعودية | المركز الرئيسي - الرياض</div>
            </div>
            <div style={{ textAlign: 'left', fontFamily: 'monospace', fontSize: '12px' }}>
              <div><strong>الرقم الإشاري:</strong> {selectedMemo.memo_no}</div>
              <div><strong>التاريخ:</strong> {selectedMemo.created_at}</div>
              <div><strong>التصنيف:</strong> {selectedMemo.category}</div>
            </div>
          </div>

          {/* Memo Title & Recipient */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#1E293B' }}>
              السادة / {selectedMemo.recipient_entity} المحترمون
            </div>
            <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
              السلام عليكم ورحمة الله وبركاته،،
            </div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '800', color: '#0F172A', marginBottom: '20px', border: '1px solid #E2E8F0' }}>
            الموضوع: {selectedMemo.subject}
          </div>

          {/* Memo Body */}
          <div style={{ fontSize: '14px', color: '#334155', lineHeight: '1.8', minHeight: '140px', whiteSpace: 'pre-wrap' }}>
            {selectedMemo.body}
          </div>

          {/* Signatures & Seal */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '40px', borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>الختم والتصديق الرقمي:</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ECFDF5', color: '#047857', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', marginTop: '4px' }}>
                <i className="fa-solid fa-certificate"></i> موثق إلكترونياً (ALSULAIM VERIFIED)
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#64748B' }}>المعتمد:</div>
              <div style={{ fontSize: '14px', fontWeight: '900', color: '#0F172A' }}>{selectedMemo.approved_by || 'الإدارة التنفيذية للمجموعة'}</div>
            </div>
          </div>

          {/* Print/Download Bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button
              className="btn-odoo btn-odoo-secondary"
              onClick={() => window.print()}
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              <i className="fa-solid fa-print ml-1"></i> طباعة الخطاب
            </button>
            <button
              className="btn-odoo btn-odoo-primary"
              onClick={() => exportData('unified_correspondence', [selectedMemo], 'pdf')}
              style={{ padding: '8px 18px', fontSize: '13px', background: '#4C1D95', borderColor: '#4C1D95' }}
            >
              <i className="fa-solid fa-file-pdf ml-1"></i> تحميل PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
