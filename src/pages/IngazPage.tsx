import React, { useState } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { useLanguage } from '../i18n/LanguageContext';

export interface IngazDelegation {
  id: string;
  delegation_number: string;
  client_name: string;
  sponsor_id: string;
  visa_number: string;
  foreign_office: string;
  profession: string;
  nationality: string;
  fee_amount: number;
  status: 'تم التوثيق' | 'بانتظار الموافقة' | 'منتهي' | 'ملغى';
  created_at: string;
}

const MOCK_INGAZ_DELEGATIONS: IngazDelegation[] = [
  {
    id: '1',
    delegation_number: '#EGZ-2026-0891',
    client_name: 'نايف بن عبدالعزيز القحطاني',
    sponsor_id: '1098452391',
    visa_number: '1300984521',
    foreign_office: 'DAMAS FOREIGN AGENCY',
    profession: 'عاملة منزلية',
    nationality: 'اثيوبيا',
    fee_amount: 350.00,
    status: 'تم التوثيق',
    created_at: '2026-07-28'
  },
  {
    id: '2',
    delegation_number: '#EGZ-2026-0892',
    client_name: 'سليمان بن فهد العتيبي',
    sponsor_id: '1029384756',
    visa_number: '1300762145',
    foreign_office: 'VERSATILE OVERSEAS LTD',
    profession: 'سائق خاص',
    nationality: 'الهند',
    fee_amount: 400.00,
    status: 'بانتظار الموافقة',
    created_at: '2026-07-29'
  },
  {
    id: '3',
    delegation_number: '#EGZ-2026-0893',
    client_name: 'شركة الخالد للتشغيل',
    sponsor_id: '7019283746',
    visa_number: '1400293847',
    foreign_office: 'PLATINUM BROTHERS INT\'L',
    profession: 'عامل مهني',
    nationality: 'الفلبين',
    fee_amount: 450.00,
    status: 'تم التوثيق',
    created_at: '2026-07-30'
  }
];

export const IngazPage: React.FC = () => {
  const { t } = useLanguage();
  const [delegations, setDelegations] = useState<IngazDelegation[]>(MOCK_INGAZ_DELEGATIONS);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'pending'>('all');

  const [formData, setFormData] = useState({
    client_name: '',
    sponsor_id: '',
    visa_number: '',
    foreign_office: 'DAMAS FOREIGN AGENCY',
    profession: 'عاملة منزلية',
    nationality: 'اثيوبيا',
    fee_amount: '350'
  });

  const handleCreateDelegation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_name || !formData.visa_number) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const newDelegation: IngazDelegation = {
      id: String(delegations.length + 1),
      delegation_number: `#EGZ-2026-0${894 + delegations.length}`,
      client_name: formData.client_name,
      sponsor_id: formData.sponsor_id || '1000000000',
      visa_number: formData.visa_number,
      foreign_office: formData.foreign_office,
      profession: formData.profession,
      nationality: formData.nationality,
      fee_amount: parseFloat(formData.fee_amount) || 350,
      status: 'بانتظار الموافقة',
      created_at: new Date().toISOString().split('T')[0]
    };

    setDelegations([newDelegation, ...delegations]);
    setShowModal(false);
    setFormData({
      client_name: '',
      sponsor_id: '',
      visa_number: '',
      foreign_office: 'DAMAS FOREIGN AGENCY',
      profession: 'عاملة منزلية',
      nationality: 'اثيوبيا',
      fee_amount: '350'
    });
    alert('تم إضافة تفويض الإنجاز الإلكتروني بنجاح وربطه بمنصة مساند وتأشير!');
  };

  const filteredDelegations = delegations.filter(d => {
    if (activeTab === 'verified') return d.status === 'تم التوثيق';
    if (activeTab === 'pending') return d.status === 'بانتظار الموافقة';
    return true;
  });

  const columns: Column<IngazDelegation>[] = [
    {
      header: 'رقم التفويض',
      accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{row.delegation_number}</span>
    },
    {
      header: 'العميل ورقم الهوية/السجل',
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700' }}>{row.client_name}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>هوية: {row.sponsor_id}</div>
        </div>
      )
    },
    {
      header: 'رقم التأشيرة والمهنة',
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700', color: 'var(--odoo-teal-dark)' }}>{row.visa_number}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.profession} • {row.nationality}</div>
        </div>
      )
    },
    {
      header: 'المكتب الخارجي المفوض',
      accessor: (row) => <span style={{ fontSize: '12px', fontWeight: '600' }}>{row.foreign_office}</span>
    },
    {
      header: 'رسوم التفويض',
      accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-teal-dark)' }}>{row.fee_amount.toFixed(2)} ر.س</span>
    },
    {
      header: 'حالة التوثيق (Enjaz/Musaned)',
      accessor: (row) => (
        <Badge
          text={row.status}
          type={row.status === 'تم التوثيق' ? 'success' : row.status === 'بانتظار الموافقة' ? 'warning' : 'danger'}
          icon={row.status === 'تم التوثيق' ? 'fa-solid fa-passport' : 'fa-solid fa-clock'}
        />
      )
    },
    {
      header: 'تاريخ التفويض',
      accessor: (row) => <span style={{ fontSize: '12px' }}>{row.created_at}</span>
    },
    {
      header: 'الإجراءات',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="btn-odoo btn-odoo-primary"
            style={{ padding: '4px 8px', fontSize: '11px' }}
            onClick={() => alert(`طباعة وثيقة التفويض الإلكتروني رقم ${row.delegation_number}`)}
          >
            <i className="fa-solid fa-print ml-1"></i> طباعة التفويض
          </button>
          <button
            className="btn-odoo btn-odoo-secondary"
            style={{ padding: '4px 8px', fontSize: '11px' }}
            onClick={() => alert(`تحديث حالة التفويض مع منصة إنجاز للمستفيد ${row.client_name}`)}
          >
            تحديث
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-passport text-purple ml-2"></i> إدارة تفاويض الإنجاز الإلكترونية (Enjaz Delegations)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            إصدار ومتابعة تفاويض التأشيرات الخارجية، الربط مع منصة مساند وتأشير، وتوثيق المكاتب الخارجية
          </p>
        </div>

        <button className="btn-odoo btn-odoo-purple" onClick={() => setShowModal(true)}>
          <i className="fa-solid fa-plus ml-1"></i> إضافة تفويض جديد
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: 'white', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0', borderRight: '4px solid #005154' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>إجمالي التفاويض</span>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#005154', marginTop: '4px' }}>{delegations.length}</div>
        </div>

        <div style={{ background: 'white', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0', borderRight: '4px solid #10B981' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>الموثقة بنجاح</span>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#10B981', marginTop: '4px' }}>
            {delegations.filter(d => d.status === 'تم التوثيق').length}
          </div>
        </div>

        <div style={{ background: 'white', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0', borderRight: '4px solid #F59E0B' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>بانتظار الموافقة</span>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#F59E0B', marginTop: '4px' }}>
            {delegations.filter(d => d.status === 'بانتظار الموافقة').length}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          className={`btn-odoo ${activeTab === 'all' ? 'btn-odoo-purple' : 'btn-odoo-secondary'}`}
          onClick={() => setActiveTab('all')}
        >
          جميع التفاويض ({delegations.length})
        </button>
        <button
          className={`btn-odoo ${activeTab === 'verified' ? 'btn-odoo-primary' : 'btn-odoo-secondary'}`}
          onClick={() => setActiveTab('verified')}
        >
          الموثقة (Enjaz Done)
        </button>
        <button
          className={`btn-odoo ${activeTab === 'pending' ? 'btn-odoo-primary' : 'btn-odoo-secondary'}`}
          onClick={() => setActiveTab('pending')}
        >
          قيد المراجعة
        </button>
      </div>

      <DataTable
        columns={columns}
        data={filteredDelegations}
        searchPlaceholder="ابحث برقم التفويض، اسم العميل، رقم التأشيرة، أو اسم المكتب الخارجي..."
        addLabel="إضافة تفويض جديد"
        exportConfig={{ sectionKey: 'ingaz', rawData: delegations }}
      />

      {/* Create Delegation Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="table-card" style={{ width: '560px', padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154' }}>
                <i className="fa-solid fa-passport ml-2"></i> إصدار تفويض إنجاز إلكتروني جديد
              </h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setShowModal(false)}></i>
            </div>

            <form onSubmit={handleCreateDelegation}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="filter-group">
                  <label className="filter-label">اسم العميل / الكفيل *</label>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="مثال: نايف القحطاني"
                    value={formData.client_name}
                    onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                    required
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">رقم الهوية / السجل *</label>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="1098..."
                    value={formData.sponsor_id}
                    onChange={e => setFormData({ ...formData, sponsor_id: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="filter-group">
                  <label className="filter-label">رقم التأشيرة *</label>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="1300..."
                    value={formData.visa_number}
                    onChange={e => setFormData({ ...formData, visa_number: e.target.value })}
                    required
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">المكتب الخارجي المفوض *</label>
                  <select
                    className="filter-select"
                    value={formData.foreign_office}
                    onChange={e => setFormData({ ...formData, foreign_office: e.target.value })}
                  >
                    <option>DAMAS FOREIGN AGENCY</option>
                    <option>PLATINUM BROTHERS INT'L</option>
                    <option>VERSATILE OVERSEAS LTD</option>
                    <option>EARLY LEARNERS CONSULTANT</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div className="filter-group">
                  <label className="filter-label">المهنة</label>
                  <select
                    className="filter-select"
                    value={formData.profession}
                    onChange={e => setFormData({ ...formData, profession: e.target.value })}
                  >
                    <option>عاملة منزلية</option>
                    <option>سائق خاص</option>
                    <option>طباخ منزلية</option>
                    <option>عامل مهني</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">الجنسية</label>
                  <select
                    className="filter-select"
                    value={formData.nationality}
                    onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                  >
                    <option>اثيوبيا</option>
                    <option>الفلبين</option>
                    <option>الهند</option>
                    <option>اوغندا</option>
                    <option>كينيا</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">رسوم التفويض (ر.س)</label>
                  <input
                    type="number"
                    className="filter-input"
                    value={formData.fee_amount}
                    onChange={e => setFormData({ ...formData, fee_amount: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-odoo btn-odoo-secondary" onClick={() => setShowModal(false)}>
                  إلغاء
                </button>
                <button type="submit" className="btn-odoo btn-odoo-purple">
                  اعتماد وتوثيق التفويض
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngazPage;
