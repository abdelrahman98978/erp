import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useComplaints, useTableMutation } from '../hooks/queries/useErpQueries';
import { useCompany } from '../contexts/CompanyContext';
import { useAppStore } from '../stores/appStore';

export interface ComplaintTicket {
  id: string;
  ticket_no: string;
  client_name: string;
  client_phone: string;
  category: 'تأخير وصول' | 'رفض عمل' | 'استرجاع وتسوية مالية' | 'شكوى إيواء' | 'جودة وسلوك';
  contract_ref: string;
  priority: 'عادي' | 'مهم' | 'عاجل طارئ';
  status: 'جديدة' | 'قيد المعالجة' | 'مرفوعة للمشرف' | 'تم الحل وإغلاق الشكوى';
  sla_hours_left: number;
  assigned_agent: string;
  branch: string;
  created_at: string;
  description: string;
}

export interface InterCompanyDispute {
  id: string;
  dispute_no: string;
  sender_entity: string;
  target_entity: string;
  subject: string;
  amount_claimed: number;
  executive_status: 'مرفوع للإدارة العليا' | 'تحت مراجعة رئيس المجموعة' | 'تم التسوية والاعتماد';
  priority: 'عالي جداً VIP' | 'عاجل' | 'عادي';
  date: string;
  details: string;
}

const MOCK_COMPLAINTS: ComplaintTicket[] = [
  {
    id: 'c-101',
    ticket_no: 'TK-2026-0041',
    client_name: 'بندر صالح الهويريني',
    client_phone: '+966555774494',
    category: 'رفض عمل',
    contract_ref: 'RC-2026-0014',
    priority: 'عاجل طارئ',
    status: 'مرفوعة للمشرف',
    sla_hours_left: 2,
    assigned_agent: 'فهد العتيبي (مشرف التشغيل)',
    branch: 'فرع الرياض',
    created_at: '2026-07-31 09:30',
    description: 'العاملة ترغب بالامتناع عن العمل وتطالب بالتحويل للإيواء أو الترحيل.'
  },
  {
    id: 'c-102',
    ticket_no: 'TK-2026-0040',
    client_name: 'سارة أحمد محمد',
    client_phone: '+966558025628',
    category: 'تأخير وصول',
    contract_ref: 'REC-2026-0089',
    priority: 'مهم',
    status: 'قيد المعالجة',
    sla_hours_left: 8,
    assigned_agent: 'عبدالفتح (مسؤول الوكلاء)',
    branch: 'مكتب بلاتينيوم الفلبيني',
    created_at: '2026-07-30 14:15',
    description: 'تأخر إصدار تأشيرة المغادرة من السفارة بالفلبين لمدة 5 أيام عن الموعد.'
  },
  {
    id: 'c-103',
    ticket_no: 'TK-2026-0039',
    client_name: 'شركة دار الرواد للمقاولات',
    client_phone: '+966114889200',
    category: 'استرجاع وتسوية مالية',
    contract_ref: 'RC-2026-0010',
    priority: 'عادي',
    status: 'جديدة',
    sla_hours_left: 24,
    assigned_agent: 'إبراهيم الشمري (المحاسب)',
    branch: 'الإدارة المالية',
    created_at: '2026-07-31 11:00',
    description: 'طلب استرجاع المبلغ المتبقي من تأمين السكن لعقد تأجير منتهي.'
  }
];

const MOCK_INTER_DISPUTES: InterCompanyDispute[] = [
  {
    id: 'disp-1',
    dispute_no: 'EXEC-2026-001',
    sender_entity: '💎 شركة توباز (Topaz Group)',
    target_entity: '🇵🇭 مكتب بلاتينيوم الفلبيني (PLATINUM)',
    subject: 'تأخير إرسالية 12 سيرة ذاتية وتأشيرة موثقة بالربط',
    amount_claimed: 45000,
    executive_status: 'مرفوع للإدارة العليا',
    priority: 'عالي جداً VIP',
    date: '2026-07-30',
    details: 'عدم الالتزام بجدول وصول العمالة حسب العقد الإطاري المبرم مع مكتب بلاتينيوم مانيلا.'
  }
];

export const ComplaintsPage: React.FC = () => {
  const { activeCompanyId } = useCompany();
  const { data: rawComplaints = [], isLoading } = useComplaints();
  const { createItem, updateItem } = useTableMutation('complaints');

  const complaints: ComplaintTicket[] = rawComplaints.length > 0 ? (rawComplaints as any[]) : MOCK_COMPLAINTS;
  const [interDisputes, setInterDisputes] = useState<InterCompanyDispute[]>(MOCK_INTER_DISPUTES);

  const storeActiveTab = useAppStore(state => state.activeTab);

  const getMappedTab = (tabKey: string): 'tickets' | 'inter-company' | 'escalated' | 'whatsapp' | 'analytics' | 'sla' => {
    switch (tabKey) {
      case 'complaint-types':
      case 'complaint-analytics':
        return 'analytics';
      case 'inter-company-disputes':
        return 'inter-company';
      case 'escalated-complaints':
        return 'escalated';
      case 'sla-tracking':
        return 'sla';
      default:
        return 'tickets';
    }
  };

  const [activeTab, setActiveTab] = useState<'tickets' | 'inter-company' | 'escalated' | 'whatsapp' | 'analytics' | 'sla'>(() => getMappedTab(storeActiveTab));

  useEffect(() => {
    setActiveTab(getMappedTab(storeActiveTab));
    if (storeActiveTab === 'create-complaint') {
      setShowAddModal(true);
    }
  }, [storeActiveTab]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(() => storeActiveTab === 'create-complaint');
  const [showAddDisputeModal, setShowAddDisputeModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ComplaintTicket | null>(null);

  // Form State
  const [addForm, setAddForm] = useState({
    client_name: '',
    client_phone: '',
    category: 'رفض عمل' as any,
    contract_ref: '',
    priority: 'عادي' as any,
    branch: 'فرع الرياض',
    description: ''
  });

  // Inter Dispute Form State
  const [disputeForm, setDisputeForm] = useState({
    sender_entity: '💎 شركة توباز (Topaz Group)',
    target_entity: '🇵🇭 مكتب بلاتينيوم الفلبيني (PLATINUM)',
    subject: '',
    amount_claimed: '',
    priority: 'عالي جداً VIP' as any,
    details: ''
  });

  const handleAddTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.client_name || !addForm.client_phone || !addForm.description) return;

    const newTicket = {
      id: `c-${Date.now()}`,
      company_id: activeCompanyId !== 'all' ? activeCompanyId : 'SAF',
      ticket_no: `TK-2026-00${42 + complaints.length}`,
      client_name: addForm.client_name,
      client_phone: addForm.client_phone,
      category: addForm.category,
      contract_ref: addForm.contract_ref || 'عقد عام',
      priority: addForm.priority,
      status: 'جديدة',
      sla_hours_left: addForm.priority === 'عاجل طارئ' ? 4 : addForm.priority === 'مهم' ? 12 : 24,
      assigned_agent: 'فريق الدعم الفني المعتمد',
      branch: addForm.branch,
      description: addForm.description,
    };

    await createItem.mutateAsync(newTicket);
    setShowAddModal(false);
    setAddForm({ client_name: '', client_phone: '', category: 'رفض عمل', contract_ref: '', priority: 'عادي', branch: 'فرع الرياض', description: '' });
  };

  const handleAddInterDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeForm.subject || !disputeForm.details) return;

    const newDispute: InterCompanyDispute = {
      id: `disp-${Date.now()}`,
      dispute_no: `EXEC-2026-00${interDisputes.length + 1}`,
      sender_entity: disputeForm.sender_entity,
      target_entity: disputeForm.target_entity,
      subject: disputeForm.subject,
      amount_claimed: parseFloat(disputeForm.amount_claimed) || 0,
      executive_status: 'مرفوع للإدارة العليا',
      priority: disputeForm.priority,
      date: new Date().toISOString().slice(0, 10),
      details: disputeForm.details
    };

    setInterDisputes([newDispute, ...interDisputes]);
    setShowAddDisputeModal(false);
    setDisputeForm({ sender_entity: '💎 شركة توباز (Topaz Group)', target_entity: '🇵🇭 مكتب بلاتينيوم الفلبيني (PLATINUM)', subject: '', amount_claimed: '', priority: 'عالي جداً VIP', details: '' });
  };

  const handleResolveTicket = async (status: 'تم الحل وإغلاق الشكوى' | 'مرفوعة للمشرف') => {
    if (!selectedTicket) return;
    await updateItem.mutateAsync({
      id: selectedTicket.id,
      data: { status },
    });
    setSelectedTicket(null);
  };

  const filteredTickets = complaints.filter(ticket => {
    const matchesSearch = ticket.ticket_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.client_name.includes(searchQuery) ||
                          ticket.client_phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

    if (activeTab === 'escalated') {
      return matchesSearch && (ticket.priority === 'عاجل طارئ' || ticket.status === 'مرفوعة للمشرف');
    }
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div>
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 330, letterSpacing: '-0.02em', color: '#000000', margin: 0 }}>
            <i className="fa-solid fa-headset text-black ml-2"></i> مركز الشكاوى والدعم الفني والنزاعات بين الشركات (Executive Support Hub)
          </h2>
          <p style={{ fontSize: '13px', color: '#71717a', margin: '4px 0 0 0' }}>
            إدارة الشكاوى، الـ SLA، تصعيد البلاغات بين الشركات الـ 5 والمكاتب الخارجية الـ 3 لمكتب الإدارة العليا
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="button-primary-pill" onClick={() => setShowAddDisputeModal(true)} style={{ fontSize: '13px', padding: '6px 18px', minHeight: '38px' }}>
            <i className="fa-solid fa-building-circle-exclamation ml-1"></i> + رفع شكوى للإدارة العليا
          </button>
          <button className="button-outline-on-light" onClick={() => setShowAddModal(true)} style={{ fontSize: '13px', padding: '6px 16px', minHeight: '38px' }}>
            <i className="fa-solid fa-plus ml-1"></i> تسجيل شكوى عميل
          </button>
          <button className="button-outline-on-light" onClick={() => exportData('complaints', filteredTickets, 'excel')} title="تصدير Excel" style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}>
            <i className="fa-solid fa-file-excel text-emerald-600 ml-1"></i> Excel
          </button>
          <button className="button-outline-on-light" onClick={() => exportData('complaints', filteredTickets, 'pdf')} title="تصدير PDF" style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}>
            <i className="fa-solid fa-file-pdf text-rose-600 ml-1"></i> PDF
          </button>
        </div>
      </div>

      {/* Metric Cards Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card-pricing" style={{ padding: '20px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '12px', color: '#71717a', fontWeight: 550 }}>إجمالي التذاكر والشكاوى</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '4px', letterSpacing: '-0.02em' }}>{complaints.length} تذكرة</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '8px' }}>معالجة 88% هذا الشهر</span>
        </div>

        <div className="card-pricing-featured" style={{ padding: '20px', borderRadius: '16px', background: '#000000', color: '#ffffff' }}>
          <span style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: 550 }}>نزاعات الشركات المصعدة للإدارة</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#ffffff', marginTop: '4px', letterSpacing: '-0.02em' }}>{interDisputes.length} نزاعات</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '8px' }}>مرفوعة لمكتب خالد السليم</span>
        </div>

        <div className="card-pistachio-band" style={{ padding: '20px', borderRadius: '16px' }}>
          <span style={{ fontSize: '12px', color: '#000000', fontWeight: 550 }}>نسبة الالتزام بالـ SLA</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '4px', letterSpacing: '-0.02em' }}>96.8%</div>
          <span style={{ fontSize: '11.5px', color: '#000000', fontWeight: 500, marginTop: '6px', display: 'block' }}>إغلاق التذاكر ضمن الموعد</span>
        </div>

        <div className="card-pricing" style={{ padding: '20px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '12px', color: '#71717a', fontWeight: 550 }}>معدل رضا العملاء (CSAT)</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '4px', letterSpacing: '-0.02em' }}>4.8 / 5.0</div>
          <span style={{ fontSize: '11.5px', color: '#71717a', marginTop: '6px', display: 'block' }}>بناءً على 142 تقييم</span>
        </div>
      </div>

      {/* Tabs Row */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #e4e4e7', paddingBottom: '12px', overflowX: 'auto' }}>
        {[
          { id: 'tickets', label: '📥 تذاكر العملاء والدعم' },
          { id: 'inter-company', label: '🏢 شكاوى ونزاعات الشركات للإدارة العليا' },
          { id: 'escalated', label: '⚡ الشكاوى المصعدة للمشرفين' },
          { id: 'whatsapp', label: '💬 محادثات الواتساب الحية' },
          { id: 'analytics', label: '📊 تحليلات أسباب الشكاوى (RCA)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              border: '1px solid',
              borderColor: activeTab === tab.id ? '#000000' : '#e4e4e7',
              backgroundColor: activeTab === tab.id ? '#000000' : '#ffffff',
              color: activeTab === tab.id ? '#ffffff' : '#27272a',
              fontWeight: activeTab === tab.id ? 550 : 420,
              fontSize: '12.5px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Inter-Company Disputes Escalated to Executive Management */}
      {activeTab === 'inter-company' && (
        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 550, color: '#000000', margin: 0 }}>
                🏢 شكاوى ونزاعات الشركات والمكاتب المرفوعة للإدارة العليا
              </h3>
              <p style={{ fontSize: '12px', color: '#71717a', margin: '4px 0 0 0' }}>
                متابعة والبت بالشكاوى التشغيلية والمالية بين توباز، دار الرواد، السفير، الماسي، والأيال والمكاتب الخارجية
              </p>
            </div>
            <button className="button-primary-pill" onClick={() => setShowAddDisputeModal(true)} style={{ fontSize: '12.5px', padding: '6px 16px' }}>
              + رفع شكوى رسمية جديدة
            </button>
          </div>

          <table className="odoo-data-table">
            <thead>
              <tr>
                <th>رقم البلاغ</th>
                <th>الشركة المشتكية (المرفوع منها)</th>
                <th>الجهة المشتكى عليها</th>
                <th>موضوع النزاع / الشكوى</th>
                <th>المبلغ المطالب به</th>
                <th>الأولوية</th>
                <th>حالة البت بالإدارة العليا</th>
              </tr>
            </thead>
            <tbody>
              {interDisputes.map(disp => (
                <tr key={disp.id}>
                  <td style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{disp.dispute_no}</td>
                  <td style={{ fontWeight: '700' }}>{disp.sender_entity}</td>
                  <td style={{ fontWeight: '700', color: 'var(--odoo-teal-dark)' }}>{disp.target_entity}</td>
                  <td>
                    <div style={{ fontWeight: '800', fontSize: '13px' }}>{disp.subject}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{disp.details}</div>
                  </td>
                  <td style={{ fontWeight: '800', color: '#EF4444' }}>
                    {(disp.amount_claimed ?? 0) > 0 ? `${(disp.amount_claimed ?? 0).toLocaleString()} ر.س` : 'غير مالي'}
                  </td>
                  <td><Badge text={disp.priority} type={disp.priority.includes('VIP') ? 'danger' : 'warning'} /></td>
                  <td>
                    <Badge
                      text={disp.executive_status}
                      type={disp.executive_status === 'تم التسوية والاعتماد' ? 'success' : 'danger'}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Main Tickets List View */}
      {(activeTab === 'tickets' || activeTab === 'escalated') && (
        <div className="table-card" style={{ padding: '24px' }}>
          {/* Filters Bar */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <input
                type="text"
                className="filter-input"
                placeholder="ابحث برقم التذكرة، اسم العميل، أو الجوال..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">جميع الحالات</option>
                <option value="جديدة">جديدة</option>
                <option value="قيد المعالجة">قيد المعالجة</option>
                <option value="مرفوعة للمشرف">مرفوعة للمشرف</option>
                <option value="تم الحل وإغلاق الشكوى">تم الحل وإغلاق الشكوى</option>
              </select>
            </div>
            <div>
              <select className="filter-select" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                <option value="all">جميع الأولويات</option>
                <option value="عاجل طارئ">عاجل طارئ</option>
                <option value="مهم">مهم</option>
                <option value="عادي">عادي</option>
              </select>
            </div>
          </div>

          {/* Data Table */}
          <table className="odoo-data-table">
            <thead>
              <tr>
                <th>رقم التذكرة</th>
                <th>اسم العميل والجوال</th>
                <th>تصنيف الشكوى والعقد</th>
                <th>الأولوية والتصعيد</th>
                <th>الـ SLA المتبقي</th>
                <th>الموظف المكلَف</th>
                <th>الحالة الحالية</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map(ticket => (
                <tr key={ticket.id}>
                  <td style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{ticket.ticket_no}</td>
                  <td>
                    <div style={{ fontWeight: '700' }}>{ticket.client_name}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{ticket.client_phone}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '700' }}>{ticket.category}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--odoo-teal-dark)' }}>{ticket.contract_ref}</div>
                  </td>
                  <td>
                    <Badge
                      text={ticket.priority}
                      type={ticket.priority === 'عاجل طارئ' ? 'danger' : ticket.priority === 'مهم' ? 'warning' : 'info'}
                    />
                  </td>
                  <td>
                    {ticket.sla_hours_left > 0 ? (
                      <span style={{ fontWeight: '800', color: ticket.sla_hours_left <= 4 ? '#EF4444' : '#F59E0B' }}>
                        <i className="fa-solid fa-clock ml-1"></i> متبقي {ticket.sla_hours_left} ساعة
                      </span>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>مكتملة</span>
                    )}
                  </td>
                  <td style={{ fontSize: '12.5px' }}>{ticket.assigned_agent}</td>
                  <td>
                    <Badge
                      text={ticket.status}
                      type={ticket.status === 'تم الحل وإغلاق الشكوى' ? 'success' : ticket.status === 'مرفوعة للمشرف' ? 'danger' : 'warning'}
                    />
                  </td>
                  <td>
                    <button className="btn-odoo btn-odoo-purple" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => setSelectedTicket(ticket)}>
                      معاينة ومعالجة
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: WhatsApp Support Live Chat */}
      {activeTab === 'whatsapp' && (
        <div className="table-card" style={{ padding: '24px', background: '#F8FAFC' }}>
          <div style={{ display: 'flex', gap: '20px', minHeight: '400px' }}>
            <div style={{ width: '280px', background: 'white', borderRadius: '8px', padding: '12px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '12px' }}>محادثات الدعم النشطة</h4>
              {complaints.map(c => (
                <div key={c.id} style={{ padding: '10px', borderRadius: '6px', background: '#F1F5F9', marginBottom: '8px', cursor: 'pointer' }}>
                  <div style={{ fontWeight: '700', fontSize: '13px' }}>{c.client_name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.client_phone} • {c.ticket_no}</div>
                </div>
              ))}
            </div>

            <div style={{ flex: 1, background: 'white', borderRadius: '8px', padding: '16px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '10px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '800', margin: 0 }}>بندر صالح الهويريني (+966555774494)</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>تذكرة TK-2026-0041 • عقد RC-2026-0014</span>
                  </div>
                  <Badge text="مرفوعة للمشرف" type="danger" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ alignSelf: 'flex-start', background: '#fbfbf5', border: '1px solid #e4e4e7', padding: '10px 14px', borderRadius: '12px', maxWidth: '75%', fontSize: '13px', color: '#000000' }}>
                    السلام عليكم، العاملة ترغب بالامتناع عن العمل وتطالب بالتحويل للإيواء أو الترحيل. نأمل المعالجة عاجلاً.
                  </div>
                  <div style={{ alignSelf: 'flex-end', background: '#000000', color: '#ffffff', padding: '10px 14px', borderRadius: '12px', maxWidth: '75%', fontSize: '13px' }}>
                    وعليكم السلام أستاذ بندر، تم استلام الطلب وتصعيد التذكرة مباشرة لمشرف الإيواء لمتابعة حالة العاملة.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <input type="text" className="filter-input" placeholder="اكتب ردك المباشر للعميل عبر الواتساب..." />
                <button className="btn-odoo btn-odoo-purple"><i className="fa-solid fa-paper-plane ml-1"></i> إرسال</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Root Cause Analytics */}
      {activeTab === 'analytics' && (
        <div className="table-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000000', marginBottom: '16px' }}>
            📊 تحليلات أسباب الشكاوى الجذرية (Root Cause Analysis - RCA)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '12px' }}>توزيع مسببات الشكاوى</h4>
              {[
                { label: 'رفض عمل أو عدم رغبة العاملة', percent: 45, color: '#714B67' },
                { label: 'تأخير الوصول من المكتب الخارجي', percent: 25, color: '#EF4444' },
                { label: 'تسويات واسترجاع مالي', percent: 18, color: '#F59E0B' },
                { label: 'استفسارات عامة وسلوك', percent: 12, color: '#10B981' }
              ].map((item, idx) => (
                <div key={idx} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>
                    <span>{item.label}</span>
                    <span>{item.percent}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${item.percent}%`, height: '100%', background: item.color }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '12px' }}>إحصائيات الفروع والمكاتب الأكثر بلاغاً</h4>
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  • <strong>فرع الرياض</strong>: 52% من إجمالي التذاكر (متابعة الإيواء وتأجير العقود).
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  • <strong>مكتب بلاتينيوم الفلبيني</strong>: 28% من بلاغات تأخير إصدار التأشيرات.
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  • <strong>متوسط زمن حل الشكوى</strong>: 6.4 ساعات فقط.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Inter-Company Dispute Modal */}
      {showAddDisputeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="table-card" style={{ width: '520px', padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#EF4444' }}>
                رفع بلاغ / شكوى بين الشركات لرئاسة الإدارة العليا
              </h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setShowAddDisputeModal(false)}></i>
            </div>

            <form onSubmit={handleAddInterDispute}>
              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">الشركة / الفرع المشتكي *</label>
                <select
                  className="filter-select"
                  value={disputeForm.sender_entity}
                  onChange={e => setDisputeForm({ ...disputeForm, sender_entity: e.target.value })}
                >
                  <option>💎 شركة توباز (Topaz Group)</option>
                  <option>🏗️ دار الرواد (Dar Al-Ruwad)</option>
                  <option>🤝 السفير (Al-Saffir)</option>
                  <option>💠 الماسي (Al-Masi Luxury Services)</option>
                  <option>✈️ الأيال للسفر والسياحة (Al-Ayal Travel)</option>
                </select>
              </div>

              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">الجهة المشتكى عليها (الطرف الآخر) *</label>
                <select
                  className="filter-select"
                  value={disputeForm.target_entity}
                  onChange={e => setDisputeForm({ ...disputeForm, target_entity: e.target.value })}
                >
                  <option>🇵🇭 مكتب بلاتينيوم الفلبيني (PLATINUM)</option>
                  <option>🇪🇹 مكتب داماس الإثيوبي (DAMAS)</option>
                  <option>🇮🇳 مكتب فيرساتيل الهندي (VERSATILE)</option>
                  <option>🏢 قسم الإيواء الرئيسي (الرياض)</option>
                  <option>💼 الإدارة المالية للمجموعة</option>
                </select>
              </div>

              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">موضوع الشكوى والنزاع *</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="عنوان مختصر للنزاع..."
                  value={disputeForm.subject}
                  onChange={e => setDisputeForm({ ...disputeForm, subject: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="filter-group">
                  <label className="filter-label">المبلغ المطالب به (إن وجد)</label>
                  <input
                    type="number"
                    className="filter-input"
                    placeholder="0.00 ر.س"
                    value={disputeForm.amount_claimed}
                    onChange={e => setDisputeForm({ ...disputeForm, amount_claimed: e.target.value })}
                  />
                </div>
                <div className="filter-group">
                  <label className="filter-label">الأولوية والتصعيد *</label>
                  <select
                    className="filter-select"
                    value={disputeForm.priority}
                    onChange={e => setDisputeForm({ ...disputeForm, priority: e.target.value as any })}
                  >
                    <option value="عالي جداً VIP">عالي جداً VIP (خالد السليم)</option>
                    <option value="عاجل">عاجل</option>
                    <option value="عادي">عادي</option>
                  </select>
                </div>
              </div>

              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label className="filter-label">التفاصيل والأسباب الموجبة للتصعيد *</label>
                <textarea
                  className="filter-input"
                  rows={3}
                  placeholder="شرح أسباب البلاغ والطلب المطلوب من الإدارة العليا..."
                  value={disputeForm.details}
                  onChange={e => setDisputeForm({ ...disputeForm, details: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-odoo btn-odoo-secondary" onClick={() => setShowAddDisputeModal(false)}>إلغاء</button>
                <button type="submit" className="btn-odoo btn-odoo-danger">رفع البلاغ للإدارة العليا</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Client Complaint Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="table-card" style={{ width: '520px', padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e4e4e7', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000000', margin: 0 }}>
                تسجيل وتوجيه شكوى / تذكرة جديدة
              </h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setShowAddModal(false)}></i>
            </div>

            <form onSubmit={handleAddTicket}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="filter-group">
                  <label className="filter-label">اسم العميل بالكامل *</label>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="اسم العميل..."
                    value={addForm.client_name}
                    onChange={e => setAddForm({ ...addForm, client_name: e.target.value })}
                    required
                  />
                </div>
                <div className="filter-group">
                  <label className="filter-label">رقم الجوال *</label>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="+9665..."
                    value={addForm.client_phone}
                    onChange={e => setAddForm({ ...addForm, client_phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="filter-group">
                  <label className="filter-label">تصنيف الشكوى *</label>
                  <select
                    className="filter-select"
                    value={addForm.category}
                    onChange={e => setAddForm({ ...addForm, category: e.target.value as any })}
                  >
                    <option value="رفض عمل">رفض عمل</option>
                    <option value="تأخير وصول">تأخير وصول</option>
                    <option value="استرجاع وتسوية مالية">استرجاع وتسوية مالية</option>
                    <option value="شكوى إيواء">شكوى إيواء</option>
                    <option value="جودة وسلوك">جودة وسلوك</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label className="filter-label">مستوى الأولوية *</label>
                  <select
                    className="filter-select"
                    value={addForm.priority}
                    onChange={e => setAddForm({ ...addForm, priority: e.target.value as any })}
                  >
                    <option value="عادي">عادي (SLA 24 ساعة)</option>
                    <option value="مهم">مهم (SLA 12 ساعة)</option>
                    <option value="عاجل طارئ">عاجل طارئ (SLA 4 ساعات)</option>
                  </select>
                </div>
              </div>

              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">الفرع المكلَف *</label>
                <select
                  className="filter-select"
                  value={addForm.branch}
                  onChange={e => setAddForm({ ...addForm, branch: e.target.value })}
                >
                  <option>فرع الرياض الرئيسي</option>
                  <option>فرع جدة</option>
                  <option>فرع الخبر</option>
                  <option>مركز الإيواء</option>
                  <option>مكتب بلاتينيوم الفلبيني</option>
                  <option>مكتب DAMAS الإثيوبي</option>
                </select>
              </div>

              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label className="filter-label">شرح وتفاصيل الشكوى *</label>
                <textarea
                  className="filter-input"
                  rows={3}
                  placeholder="اكتب التفاصيل هنا..."
                  value={addForm.description}
                  onChange={e => setAddForm({ ...addForm, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-odoo btn-odoo-secondary" onClick={() => setShowAddModal(false)}>إلغاء</button>
                <button type="submit" className="btn-odoo btn-odoo-purple">تسجيل التذكرة وتفعيل SLA</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Action Modal */}
      {selectedTicket && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="table-card" style={{ width: '500px', padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e4e4e7', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000000', margin: 0 }}>
                معالجة التذكرة رقم ({selectedTicket.ticket_no})
              </h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setSelectedTicket(null)}></i>
            </div>

            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
              <div><strong>العميل:</strong> {selectedTicket.client_name} ({selectedTicket.client_phone})</div>
              <div style={{ marginTop: '4px' }}><strong>الشرح:</strong> {selectedTicket.description}</div>
              <div style={{ marginTop: '4px', color: 'var(--odoo-purple)' }}><strong>المسؤول الحلي:</strong> {selectedTicket.assigned_agent}</div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="btn-odoo btn-odoo-secondary" onClick={() => setSelectedTicket(null)}>إلغاء</button>
              <button className="btn-odoo btn-odoo-danger" onClick={() => handleResolveTicket('مرفوعة للمشرف')}>تصعيد للمشرف</button>
              <button className="btn-odoo btn-odoo-purple" onClick={() => handleResolveTicket('تم الحل وإغلاق الشكوى')}>إغلاق وإتمام الحل</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsPage;
