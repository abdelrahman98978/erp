import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { MOCK_ORDERS } from '../data/mockData';
import { Order } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { realErpDataStore } from '../services/realErpDataStore';

export const OrdersPage: React.FC = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    realErpDataStore.getRecords<Order>('orders', MOCK_ORDERS).then(data => setOrders(data));
  }, []);

  const [addForm, setAddForm] = useState({
    client_name: '',
    client_phone: '',
    maid_name: '',
    nationality: 'إثيوبيا',
    passport_number: '',
    request_type: 'حسب المواصفات' as 'معروفة' | 'معينة' | 'حسب المواصفات',
    office_name: 'DAMAS AGENCY'
  });

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.client_name || !addForm.client_phone) return;

    const newOrder: Order = {
      id: `ORD-2026-${String(orders.length + 101).padStart(3, '0')}`,
      client_name: addForm.client_name,
      client_phone: addForm.client_phone,
      maid_name: addForm.maid_name || 'سيرة ذاتية مختارة',
      nationality: addForm.nationality,
      passport_number: addForm.passport_number || 'EP-882910',
      request_type: addForm.request_type,
      status: 'جديد',
      timer_status: 'عادي',
      deadline: '24 ساعة',
      contract_status: 'بدون عقد',
      created_at: new Date().toISOString().slice(0, 10),
      responsible_employee: 'فهد العتيبي (مسوق)',
      branch: 'فرع الرياض',
      office_name: addForm.office_name
    };

    const updated = await realErpDataStore.addRecord('orders', newOrder, MOCK_ORDERS);
    setOrders(updated);
    setShowAddModal(false);
    setAddForm({ client_name: '', client_phone: '', maid_name: '', nationality: 'إثيوبيا', passport_number: '', request_type: 'حسب المواصفات', office_name: 'DAMAS AGENCY' });
  };

  const handleConvertToContract = async (order: Order) => {
    const updated = await realErpDataStore.updateRecord('orders', order.id, { contract_status: 'تم التعاقد', status: 'تم التعاقد' }, MOCK_ORDERS);
    setOrders(updated);
  };

  const filteredOrders = orders.filter(ord => {
    if (activeFilter === 'new') return ord.status === 'جديد';
    if (activeFilter === 'contracted') return ord.contract_status === 'تم التعاقد';
    return true;
  });

  const columns: Column<Order>[] = [
    {
      header: t('orderNo', 'رقم الطلب'),
      accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>#{row.id}</span>
    },
    {
      header: t('clientPhone', 'العميل والجوال'),
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700' }}>{row.client_name}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.client_phone}</div>
        </div>
      )
    },
    {
      header: t('workerNationality', 'العاملة والجنسية'),
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700' }}>{row.maid_name}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.nationality} • {row.passport_number}</div>
        </div>
      )
    },
    {
      header: t('agency', 'المكتب الخارجي'),
      accessor: (row) => <span style={{ fontSize: '12px' }}>{row.office_name}</span>
    },
    {
      header: t('orderType', 'نوع الطلب'),
      accessor: (row) => <Badge text={row.request_type} type="purple" />
    },
    {
      header: t('deadlineStatus', 'حالة المهلة'),
      accessor: (row) => <Badge text={row.contract_status === 'تم التعاقد' ? 'تم التعاقد' : 'ضمن المهلة 24h'} type={row.contract_status === 'تم التعاقد' ? 'success' : 'warning'} />
    },
    {
      header: t('salesperson', 'المسوق المسؤول'),
      accessor: (row) => (
        <div>
          <span style={{ fontSize: '12px', fontWeight: '600' }}>{row.responsible_employee}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.created_at}</div>
        </div>
      )
    },
    {
      header: t('actions', 'الإجراءات'),
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          {row.contract_status !== 'تم التعاقد' ? (
            <button
              className="btn-odoo btn-odoo-primary"
              style={{ padding: '4px 8px', fontSize: '11px' }}
              onClick={() => handleConvertToContract(row)}
            >
              {t('convertContract', 'تحويل لعقد')}
            </button>
          ) : (
            <Badge text="عقد مساند محول" type="success" />
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-cart-shopping text-warning ml-2"></i> {t('ordersBookingsTitle', 'إدارة الطلبات والحجوزات الفورية')}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {t('ordersBookingsSub', 'تتبع حجز السير الذاتية المؤقت ومتابعة مهلة الـ 24 ساعة والتحويل المباشر لـ مساند')}
          </p>
        </div>

        <button className="btn-odoo btn-odoo-primary" onClick={() => setShowAddModal(true)}>
          <i className="fa-solid fa-plus ml-1"></i> {t('addNewOrder', 'إضافة طلب استقدام جديد')}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tab-bar" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button className={`btn-odoo ${activeFilter === 'all' ? 'btn-odoo-primary' : 'btn-odoo-secondary'}`} onClick={() => setActiveFilter('all')}>
          {t('allOrders', `جميع الطلبات (${orders.length})`)}
        </button>
        <button className={`btn-odoo ${activeFilter === 'new' ? 'btn-odoo-danger' : 'btn-odoo-secondary'}`} onClick={() => setActiveFilter('new')}>
          {t('newOrders24h', `الطلبات الجديدة (${orders.filter(o => o.status === 'جديد').length})`)}
        </button>
        <button className={`btn-odoo ${activeFilter === 'contracted' ? 'btn-odoo-success' : 'btn-odoo-secondary'}`} onClick={() => setActiveFilter('contracted')}>
          {t('contractedOrders', `تم التعاقد (${orders.filter(o => o.contract_status === 'تم التعاقد').length})`)}
        </button>
      </div>

      <DataTable
        columns={columns}
        data={filteredOrders}
        searchPlaceholder={t('searchOrderPlaceholder', 'ابحث برقم الطلب، اسم العميل، رقم الجوال، أو اسم العاملة...')}
        exportConfig={{ sectionKey: 'orders', rawData: filteredOrders }}
      />

      {/* Add Order Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="table-card" style={{ width: '500px', padding: '24px', background: 'white', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154' }}>إضافة طلب استقدام فوري جديد</h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setShowAddModal(false)}></i>
            </div>
            <form onSubmit={handleAddOrder}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="filter-group">
                  <label className="filter-label">اسم العميل *</label>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="الاسم..."
                    value={addForm.client_name}
                    onChange={e => setAddForm({ ...addForm, client_name: e.target.value })}
                    required
                  />
                </div>
                <div className="filter-group">
                  <label className="filter-label">جوال العميل *</label>
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
                  <label className="filter-label">الجنسية المطلوبة</label>
                  <select
                    className="filter-select"
                    value={addForm.nationality}
                    onChange={e => setAddForm({ ...addForm, nationality: e.target.value })}
                  >
                    <option>إثيوبيا</option>
                    <option>الفلبين</option>
                    <option>الهند</option>
                    <option>أوغندا</option>
                    <option>كينيا</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label className="filter-label">نوع الطلب</label>
                  <select
                    className="filter-select"
                    value={addForm.request_type}
                    onChange={e => setAddForm({ ...addForm, request_type: e.target.value as any })}
                  >
                    <option value="حسب المواصفات">حسب المواصفات</option>
                    <option value="معينة">معينة بالاسم</option>
                    <option value="معروفة">معروفة (نقل مباشر)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" className="btn-odoo btn-odoo-secondary" onClick={() => setShowAddModal(false)}>إلغاء</button>
                <button type="submit" className="btn-odoo btn-odoo-purple">حفظ الطلب الفوري</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
