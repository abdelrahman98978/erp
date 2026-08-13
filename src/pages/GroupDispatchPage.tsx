import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { useLanguage } from '../i18n/LanguageContext';
import { exportData } from '../services/exportService';

export interface GroupDispatchMemo {
  id: string;
  dispatch_no: string;
  source_entity: string;
  target_entity: string;
  dispatch_type: 'خطاب تكليف رسمي' | 'طلب استقدام عاجل' | 'حجز رحلات وسفر' | 'اعتماد مالي' | 'توثيق جوازات';
  subject: string;
  details: string;
  priority: 'عادي' | 'هام' | 'عاجل جداً' | 'تعميم مالي';
  status: 'تم الاستلام والتنفيذ' | 'قيد المراجعة' | 'بانتظار الاعتماد' | 'مكتمل';
  created_at: string;
  assigned_officer: string;
}

const GROUP_COMPANIES = [
  { id: 'topaz', name: 'شركة توباز (Topaz Group)', icon: 'diamond', color: '#0f6b6e' },
  { id: 'ruwad', name: 'دار الرواد (Dar Al-Ruwad)', icon: 'architecture', color: '#005154' },
  { id: 'saffir', name: 'السفير (Al-Saffir)', icon: 'handshake', color: '#535f74' },
  { id: 'masi', name: 'الماسي (Al-Masi Luxury)', icon: 'token', color: '#181c1c' },
  { id: 'ayal', name: 'الأيال للسفر والسياحة (Al-Ayal Travel)', icon: 'flight_takeoff', color: '#6f3b18' },
  { id: 'damas', name: 'مكتب داماس الإثيوبي (DAMAS Agency)', icon: 'public', color: '#059669' },
  { id: 'platinum', name: 'مكتب بلاتينيوم الفلبيني (PLATINUM Int\'l)', icon: 'public', color: '#2563EB' },
  { id: 'versatile', name: 'مكتب فيرساتيل الهندي (VERSATILE Ltd)', icon: 'public', color: '#D97706' }
];

const MOCK_DISPATCHES: GroupDispatchMemo[] = [
  {
    id: 'd-1',
    dispatch_no: '#DISP-2026-0491',
    source_entity: 'شركة توباز (Topaz)',
    target_entity: 'الأيال للسفر والسياحة (Al-Ayal)',
    dispatch_type: 'حجز رحلات وسفر',
    subject: 'طلب اصدار تذاكر وصول لدفعة عمالة إثيوبية (12 عاملة)',
    details: 'يرجى إصدار وتأكيد حجوزات الطيران القادمة من أديس أبابا إلى مطار الرياض الملك خالد.',
    priority: 'عاجل جداً',
    status: 'تم الاستلام والتنفيذ',
    created_at: '2026-07-31 11:20',
    assigned_officer: 'خالد السليم (الأيال)'
  },
  {
    id: 'd-2',
    dispatch_no: '#DISP-2026-0492',
    source_entity: 'دار الرواد (Dar Al-Ruwad)',
    target_entity: 'السفير (Al-Saffir)',
    dispatch_type: 'خطاب تكليف رسمي',
    subject: 'تفويض استلام حافلات نقل الكوادر لمشاريع دار الرواد',
    details: 'المواكبة التشغيلية وتخصيص سائقين ونقل الكوادر من سكن الإيواء للمواقع.',
    priority: 'هام',
    status: 'قيد المراجعة',
    created_at: '2026-07-31 13:45',
    assigned_officer: 'فهد العتيبي'
  },
  {
    id: 'd-3',
    dispatch_no: '#DISP-2026-0493',
    source_entity: 'الماسي (Al-Masi Luxury)',
    target_entity: 'مكتب داماس الإثيوبي (DAMAS Agency)',
    dispatch_type: 'طلب استقدام عاجل',
    subject: 'طلب 15 سيرة ذاتية بمواصفات عالية لـ باقات التأجير الفاخرة',
    details: 'يشترط الخبرة السابقة بالخليج وإتقان اللغة والطهي المتقدم.',
    priority: 'عاجل جداً',
    status: 'بانتظار الاعتماد',
    created_at: '2026-07-31 14:10',
    assigned_officer: 'Mr. Solomon (DAMAS)'
  }
];

export const GroupDispatchPage: React.FC = () => {
  const { t } = useLanguage();
  const [dispatches, setDispatches] = useState<GroupDispatchMemo[]>(MOCK_DISPATCHES);
  const [selectedEntity, setSelectedEntity] = useState<string>('all');
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState<GroupDispatchMemo | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    source_entity: 'شركة توباز (Topaz Group)',
    target_entity: 'الأيال للسفر والسياحة (Al-Ayal Travel)',
    dispatch_type: 'حجز رحلات وسفر' as const,
    subject: '',
    details: '',
    priority: 'عاجل جداً' as const
  });

  const handleCreateDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.details) {
      alert('يرجى ملء كافة حقول المعاملة الرسمية');
      return;
    }

    const newDisp: GroupDispatchMemo = {
      id: `d-${Date.now()}`,
      dispatch_no: `#DISP-2026-0${494 + dispatches.length}`,
      source_entity: formData.source_entity,
      target_entity: formData.target_entity,
      dispatch_type: formData.dispatch_type,
      subject: formData.subject,
      details: formData.details,
      priority: formData.priority,
      status: 'قيد المراجعة',
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
      assigned_officer: 'مدير المتابعة الموحدة'
    };

    setDispatches([newDisp, ...dispatches]);
    setShowDispatchModal(false);
    setFormData({
      source_entity: 'شركة توباز (Topaz Group)',
      target_entity: 'الأيال للسفر والسياحة (Al-Ayal Travel)',
      dispatch_type: 'حجز رحلات وسفر',
      subject: '',
      details: '',
      priority: 'عاجل جداً'
    });
    alert('تم توجيه وإرسال الخطاب/المعاملة بين شركات المجموعة بنجاح وتنبيه الجهة المستلمة!');
  };

  const filteredDispatches = dispatches.filter(d => {
    if (selectedEntity === 'all') return true;
    return d.source_entity.includes(selectedEntity) || d.target_entity.includes(selectedEntity);
  });

  const columns = [
    {
      header: 'رقم المعاملة',
      accessor: (row: GroupDispatchMemo) => <span style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{row.dispatch_no}</span>
    },
    {
      header: 'الجهة المُرْسِلة والجهة المُسْتَلِمَة',
      accessor: (row: GroupDispatchMemo) => (
        <div>
          <span style={{ fontWeight: '800', color: '#005154' }}>من: {row.source_entity}</span>
          <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#714B67', marginTop: '2px' }}>إلى: {row.target_entity}</div>
        </div>
      )
    },
    {
      header: 'نوع الخطاب والموضوع',
      accessor: (row: GroupDispatchMemo) => (
        <div>
          <Badge text={row.dispatch_type} type="purple" />
          <div style={{ fontWeight: '700', fontSize: '13px', marginTop: '4px' }}>{row.subject}</div>
        </div>
      )
    },
    {
      header: 'الأولوية',
      accessor: (row: GroupDispatchMemo) => (
        <Badge
          text={row.priority}
          type={row.priority === 'عاجل جداً' ? 'danger' : row.priority === 'هام' ? 'warning' : 'info'}
          icon="fa-solid fa-[#000] fa-paper-plane"
        />
      )
    },
    {
      header: 'الحالة والمتابعة',
      accessor: (row: GroupDispatchMemo) => (
        <div>
          <Badge text={row.status} type={row.status === 'تم الاستلام والتنفيذ' ? 'success' : 'warning'} />
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>المسؤول: {row.assigned_officer}</div>
        </div>
      )
    },
    {
      header: 'التاريخ',
      accessor: (row: GroupDispatchMemo) => <span style={{ fontSize: '12px' }}>{row.created_at}</span>
    },
    {
      header: 'الإجراءات',
      accessor: (row: GroupDispatchMemo) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="btn-odoo btn-odoo-primary"
            style={{ padding: '4px 8px', fontSize: '11px' }}
            onClick={() => setSelectedMemo(row)}
          >
            <i className="fa-solid fa-eye ml-1"></i> عرض الخطاب
          </button>
          <button
            className="btn-odoo btn-odoo-secondary"
            style={{ padding: '4px 8px', fontSize: '11px' }}
            onClick={() => alert(`طباعة المعاملة الرسمية رقم ${row.dispatch_no}`)}
          >
            طباعة
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      {/* Top Banner Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Cairo, sans-serif' }}>
            <i className="fa-solid fa-paper-plane text-purple ml-2"></i> مركز التواصل والإرسال الموحد لشركات المجموعة والمكاتب الخارجية
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            مجموعة خالد السليم • توباز، دار الرواد، السفير، الماسي، الأيال للسفر والسياحة، والمكاتب الخارجية (DAMAS, PLATINUM, VERSATILE)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn-odoo btn-odoo-purple" onClick={() => setShowDispatchModal(true)}>
            <i className="fa-solid fa-plus ml-1"></i> توجيه معاملة / خطاب جديد
          </button>
          <button className="btn-odoo btn-odoo-primary" onClick={() => exportData('group-dispatch', filteredDispatches, 'excel')} title="تصدير Excel">
            <i className="fa-solid fa-file-excel ml-1"></i> Excel
          </button>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('group-dispatch', filteredDispatches, 'pdf')} title="تصدير PDF">
            <i className="fa-solid fa-file-pdf text-danger ml-1"></i> PDF
          </button>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('group-dispatch', filteredDispatches, 'csv')} title="تصدير CSV">
            <i className="fa-solid fa-file-csv text-primary ml-1"></i> CSV
          </button>
        </div>
      </div>

      {/* Group Companies Interactive Selector Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        <div
          onClick={() => setSelectedEntity('all')}
          style={{
            background: selectedEntity === 'all' ? '#005154' : '#FFFFFF',
            color: selectedEntity === 'all' ? '#FFFFFF' : '#181C1C',
            padding: '14px 16px',
            borderRadius: '12px',
            cursor: 'pointer',
            border: '1px solid #E2E8F0',
            textAlign: 'center',
            fontWeight: '800',
            fontSize: '13px',
            boxShadow: selectedEntity === 'all' ? '0 4px 12px rgba(0,81,84,0.2)' : 'none'
          }}
        >
          <span className="material-symbols-outlined" style={{ display: 'block', fontSize: '28px', marginBottom: '4px' }}>domain</span>
          جميع الشركات والمكاتب ({dispatches.length})
        </div>

        {GROUP_COMPANIES.map(c => (
          <div
            key={c.id}
            onClick={() => setSelectedEntity(c.name.split(' ')[1] || c.id)}
            style={{
              background: selectedEntity.includes(c.id) || selectedEntity.includes(c.name.split(' ')[1]) ? c.color : '#FFFFFF',
              color: selectedEntity.includes(c.id) || selectedEntity.includes(c.name.split(' ')[1]) ? '#FFFFFF' : '#181C1C',
              padding: '14px 16px',
              borderRadius: '12px',
              cursor: 'pointer',
              border: '1px solid #E2E8F0',
              textAlign: 'center',
              fontWeight: '800',
              fontSize: '13px',
              transition: 'all 0.3s ease'
            }}
          >
            <span className="material-symbols-outlined" style={{ display: 'block', fontSize: '28px', marginBottom: '4px' }}>{c.icon}</span>
            {c.name}
          </div>
        ))}
      </div>

      {/* Data Table */}
      <div className="table-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#005154', margin: 0 }}>
            سجل المراسلات والمعاملات الرسمية بين شركات المجموعة
          </h3>
          <Badge text={`${filteredDispatches.length} معاملة`} type="purple" />
        </div>

        <table className="odoo-data-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredDispatches.map(row => (
              <tr key={row.id}>
                {columns.map((col, idx) => (
                  <td key={idx}>{col.accessor(row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dispatch Modal */}
      {showDispatchModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="table-card" style={{ width: '560px', padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154' }}>
                <i className="fa-solid fa-paper-plane ml-2"></i> توجيه خطاب / معاملة رسمية بين الشركات
              </h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setShowDispatchModal(false)}></i>
            </div>

            <form onSubmit={handleCreateDispatch}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="filter-group">
                  <label className="filter-label">الجهة المُرسِلة *</label>
                  <select
                    className="filter-select"
                    value={formData.source_entity}
                    onChange={e => setFormData({ ...formData, source_entity: e.target.value })}
                  >
                    {GROUP_COMPANIES.map(c => <option key={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">الجهة المُستلِمة *</label>
                  <select
                    className="filter-select"
                    value={formData.target_entity}
                    onChange={e => setFormData({ ...formData, target_entity: e.target.value })}
                  >
                    {GROUP_COMPANIES.map(c => <option key={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="filter-group">
                  <label className="filter-label">نوع الخطاب / المعاملة *</label>
                  <select
                    className="filter-select"
                    value={formData.dispatch_type}
                    onChange={e => setFormData({ ...formData, dispatch_type: e.target.value as any })}
                  >
                    <option value="خطاب تكليف رسمي">خطاب تكليف رسمي</option>
                    <option value="طلب استقدام عاجل">طلب استقدام عاجل</option>
                    <option value="حجز رحلات وسفر">حجز رحلات وتذاكر طيران (الأيال)</option>
                    <option value="اعتماد مالي">اعتماد مصروف مالي</option>
                    <option value="توثيق جوازات">توثيق واستلام جوازات</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">درجة الأولوية</label>
                  <select
                    className="filter-select"
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                  >
                    <option value="عادي">عادي</option>
                    <option value="هام">هام</option>
                    <option value="عاجل جداً">عاجل جداً</option>
                    <option value="تعميم مالي">تعميم مالي</option>
                  </select>
                </div>
              </div>

              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">موضوع الخطاب / المعاملة *</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="مثال: طلب اصدار وتأكيد حجوزات طيران..."
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label className="filter-label">تفاصيل ونص المعاملة *</label>
                <textarea
                  className="filter-input"
                  rows={4}
                  placeholder="اكتب التوجيهات والقرارات التفصيلية هنا..."
                  value={formData.details}
                  onChange={e => setFormData({ ...formData, details: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-odoo btn-odoo-secondary" onClick={() => setShowDispatchModal(false)}>إلغاء</button>
                <button type="submit" className="btn-odoo btn-odoo-purple">اعتماد وإرسال المعاملة</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Memo Details Modal */}
      {selectedMemo && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="table-card" style={{ width: '560px', padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '2px solid #005154', paddingBottom: '8px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154', margin: 0 }}>
                وثيقة الخطاب والمعاملة الرسمية {selectedMemo.dispatch_no}
              </h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setSelectedMemo(null)}></i>
            </div>

            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '10px', marginBottom: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px', fontSize: '13px' }}>
                <div><strong>من:</strong> {selectedMemo.source_entity}</div>
                <div><strong>إلى:</strong> {selectedMemo.target_entity}</div>
                <div><strong>نوع الخطاب:</strong> {selectedMemo.dispatch_type}</div>
                <div><strong>التاريخ:</strong> {selectedMemo.created_at}</div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '12px 0' }} />

              <h4 style={{ fontSize: '14px', fontWeight: '800', margin: '0 0 8px 0' }}>الموضوع: {selectedMemo.subject}</h4>
              <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: '1.7', margin: 0 }}>
                {selectedMemo.details}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="btn-odoo btn-odoo-secondary" onClick={() => setSelectedMemo(null)}>إغلاق</button>
              <button className="btn-odoo btn-odoo-primary" onClick={() => { alert(`تم طباعة وتحميل الخطاب PDF لـ ${selectedMemo.dispatch_no}`); setSelectedMemo(null); }}>
                <i className="fa-solid fa-print ml-1"></i> طباعة الوثيقة الرسمية PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDispatchPage;
