import React, { useState } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { MOCK_ORDERS } from '../data/mockData';
import { Order } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

export const OrdersPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');

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
      header: t('deadlineStatus', 'المهلة والتنبيهات'),
      accessor: (row) => {
        if (row.timer_status === 'متأخر') {
          return <Badge text={t('overdueDeadline', 'متأخر - تجاوز 24h')} type="danger" icon="fa-solid fa-triangle-exclamation" />;
        }
        return <Badge text={t('withinDeadline', 'ضمن المهلة')} type="success" icon="fa-solid fa-clock" />;
      }
    },
    {
      header: t('salesperson', 'المسوق/المضيف'),
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
          <button className="btn-odoo btn-odoo-primary" style={{ padding: '4px 8px', fontSize: '11px' }}>
            {t('convertContract', 'تحويل لعقد')}
          </button>
          <button className="btn-odoo btn-odoo-secondary" style={{ padding: '4px 8px', fontSize: '11px' }}>
            {t('details', 'التفاصيل')}
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
            <i className="fa-solid fa-cart-shopping text-warning ml-2"></i> {t('ordersBookingsTitle', 'إدارة الطلبات والحجوزات الفورية')}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {t('ordersBookingsSub', 'تتبع حجز السير الذاتية المؤقت ومتابعة مهلة الـ 24 ساعة والتحويل المباشر لـ مساند')}
          </p>
        </div>

        <button className="btn-odoo btn-odoo-primary">
          <i className="fa-solid fa-plus ml-1"></i> {t('addNewOrder', 'إضافة طلب استقدام جديد')}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tab-bar" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button className={`btn-odoo ${activeFilter === 'all' ? 'btn-odoo-primary' : 'btn-odoo-secondary'}`} onClick={() => setActiveFilter('all')}>
          {t('allOrders', 'جميع الطلبات (120)')}
        </button>
        <button className={`btn-odoo ${activeFilter === 'new' ? 'btn-odoo-danger' : 'btn-odoo-secondary'}`} onClick={() => setActiveFilter('new')}>
          {t('newOrders24h', 'الطلبات الجديدة (7) 24h')}
        </button>
        <button className={`btn-odoo ${activeFilter === 'contracted' ? 'btn-odoo-success' : 'btn-odoo-secondary'}`} onClick={() => setActiveFilter('contracted')}>
          {t('contractedOrders', 'تم التعاقد (106)')}
        </button>
      </div>

      <DataTable
        columns={columns}
        data={MOCK_ORDERS}
        searchPlaceholder={t('searchOrderPlaceholder', 'ابحث برقم الطلب، اسم العميل، رقم الجوال، أو اسم العاملة...')}
      />
    </div>
  );
};
