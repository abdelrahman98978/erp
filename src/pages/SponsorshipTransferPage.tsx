import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';
import { useAppStore } from '../stores/appStore';

interface TransferRequest {
  id: string;
  contract_number: string;
  maid_name: string;
  nationality: string;
  old_sponsor: string;
  old_sponsor_phone: string;
  new_sponsor: string;
  new_sponsor_phone: string;
  trial_days_remaining: number;
  contract_amount: number;
  status: 'فترة التجربة' | 'تم النقل' | 'فشل التجربة' | 'بانتظار الموافقة';
  created_at: string;
}

const MOCK_TRANSFERS: TransferRequest[] = [
  {
    id: 'TR-901',
    contract_number: '#TR-2026-001',
    maid_name: 'عاملة تنازل ألبانية',
    nationality: 'ألبانيا',
    old_sponsor: 'سارة احمد محمد',
    old_sponsor_phone: '+9660558025628',
    new_sponsor: 'بندر صالح الهويريني',
    new_sponsor_phone: '+966555774494',
    trial_days_remaining: 6,
    contract_amount: 20000,
    status: 'فترة التجربة',
    created_at: '2026-07-25'
  },
  {
    id: 'TR-902',
    contract_number: '#TR-2026-002',
    maid_name: 'Made Transfer eth',
    nationality: 'اثيوبيا',
    old_sponsor: 'عميل التجربة القديم',
    old_sponsor_phone: '+966500000111',
    new_sponsor: 'ابو اياد',
    new_sponsor_phone: '+966562404213',
    trial_days_remaining: 0,
    contract_amount: 18000,
    status: 'تم النقل',
    created_at: '2026-07-10'
  }
];

export const SponsorshipTransferPage: React.FC = () => {
  const storeActiveTab = useAppStore(state => state.activeTab);
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newForm, setNewForm] = useState({
    maid_name: '',
    nationality: 'اثيوبيا',
    old_sponsor: '',
    old_sponsor_phone: '',
    new_sponsor: '',
    new_sponsor_phone: '',
    contract_amount: 18000,
  });

  useEffect(() => {
    realErpDataStore.getRecords<TransferRequest>('sponsorship_transfers', MOCK_TRANSFERS).then(data => setTransfers(data));
  }, []);

  const displayedTransfers = transfers.filter(t => {
    if (storeActiveTab === 'trial-period') return t.status === 'فترة التجربة';
    if (storeActiveTab === 'transferred-done') return t.status === 'تم النقل';
    return true;
  });

  const handleConfirmTransfer = async (row: TransferRequest) => {
    const updated = await realErpDataStore.updateRecord<TransferRequest>(
      'sponsorship_transfers',
      row.id,
      {
        status: 'تم النقل',
        trial_days_remaining: 0,
      },
      MOCK_TRANSFERS
    );
    setTransfers(updated);
  };

  const handleAddTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.maid_name || !newForm.old_sponsor) return;

    const newRec: TransferRequest = {
      id: `TR-${Date.now().toString().slice(-4)}`,
      contract_number: `#TR-2026-${String(transfers.length + 1).padStart(3, '0')}`,
      maid_name: newForm.maid_name,
      nationality: newForm.nationality,
      old_sponsor: newForm.old_sponsor,
      old_sponsor_phone: newForm.old_sponsor_phone,
      new_sponsor: newForm.new_sponsor || 'طرف تجريبي جديد',
      new_sponsor_phone: newForm.new_sponsor_phone,
      trial_days_remaining: 10,
      contract_amount: newForm.contract_amount,
      status: 'فترة التجربة',
      created_at: new Date().toISOString().split('T')[0],
    };

    const updated = await realErpDataStore.addRecord<TransferRequest>('sponsorship_transfers', newRec, MOCK_TRANSFERS);
    setTransfers(updated);
    setShowAddModal(false);
    setNewForm({
      maid_name: '',
      nationality: 'اثيوبيا',
      old_sponsor: '',
      old_sponsor_phone: '',
      new_sponsor: '',
      new_sponsor_phone: '',
      contract_amount: 18000,
    });
  };

  const columns: Column<TransferRequest>[] = [
    {
      header: 'رقم النقل والعقد',
      accessor: (row) => <span style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{row.contract_number}</span>
    },
    {
      header: 'اسم العاملة والجنسية',
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700' }}>{row.maid_name}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.nationality}</div>
        </div>
      )
    },
    {
      header: 'الكفيل القديم (المتنازل)',
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700' }}>{row.old_sponsor}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.old_sponsor_phone}</div>
        </div>
      )
    },
    {
      header: 'الكفيل الجديد (المستلم)',
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: '700', color: 'var(--odoo-purple)' }}>{row.new_sponsor || 'بانتظار تخصيص'}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.new_sponsor_phone || '---'}</div>
        </div>
      )
    },
    {
      header: 'فترة التجربة (10d)',
      accessor: (row) => (
        <span style={{ fontWeight: '800', color: row.trial_days_remaining > 0 ? '#D97706' : '#059669' }}>
          {row.trial_days_remaining > 0 ? `${row.trial_days_remaining} أيام متبقية` : 'انتهت التجربة'}
        </span>
      )
    },
    {
      header: 'رسوم التنازل',
      accessor: (row) => <span style={{ fontWeight: 600, color: '#000000' }}>{(row.contract_amount ?? 0).toLocaleString()} ر.س</span>
    },
    {
      header: 'الحالة',
      accessor: (row) => (
        <Badge
          text={row.status}
          type={row.status === 'تم النقل' ? 'success' : row.status === 'فترة التجربة' ? 'warning' : 'danger'}
        />
      )
    },
    {
      header: 'الإجراءات',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          {row.status === 'فترة التجربة' && (
            <button
              onClick={() => handleConfirmTransfer(row)}
              className="btn-odoo btn-odoo-primary"
              style={{ padding: '4px 8px', height: '30px', fontSize: '12px' }}
            >
              تأكيد النقل النهائي
            </button>
          )}
          <button
            onClick={() => exportData('sponsorship-transfer', [row], 'pdf', `عقد_تنازل_${row.maid_name}`)}
            className="btn-odoo btn-odoo-secondary"
            style={{ padding: '4px 8px', height: '30px', fontSize: '12px' }}
          >
            طباعة العقد
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-repeat text-purple ml-2"></i> إدارة طلبات نقل الكفالة والتنازل
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            متابعة عداد فترة التجربة (10 أيام)، تحويل المبالغ بين الكفلاء، وإعادة التخصيص
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="button-primary-pill" onClick={() => setShowAddModal(true)} style={{ fontSize: '13px', padding: '6px 18px', minHeight: '38px' }}>
            <i className="fa-solid fa-plus ml-1"></i> + إضافة طلب نقل كفالة
          </button>
          <button className="button-outline-on-light" onClick={() => exportData('sponsorship-transfer', transfers, 'excel')} title="تصدير Excel" style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}>
            <i className="fa-solid fa-file-excel text-emerald-600 ml-1"></i> Excel
          </button>
          <button className="button-outline-on-light" onClick={() => exportData('sponsorship-transfer', transfers, 'pdf')} title="تصدير PDF" style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}>
            <i className="fa-solid fa-file-pdf text-rose-600 ml-1"></i> PDF
          </button>
        </div>
      </div>

      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '24px' }}>
        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#71717a', fontWeight: 550 }}>طلبات نقل الكفالة</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>{transfers.length}</div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '10px' }}>إجمالي المعاملات</span>
        </div>

        <div className="card-pistachio-band" style={{ padding: '24px', borderRadius: '16px' }}>
          <span style={{ fontSize: '13px', color: '#000000', fontWeight: 550 }}>قيد التجربة (10 أيام)</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>
            {transfers.filter(t => t.status === 'فترة التجربة').length}
          </div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>عمالة قيد التجربة</span>
        </div>

        <div className="card-pricing-featured" style={{ padding: '24px', borderRadius: '16px', background: '#000000', color: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 550 }}>تم النقل النهائي</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#ffffff', marginTop: '6px', letterSpacing: '-0.02em' }}>
            {transfers.filter(t => t.status === 'تم النقل').length}
          </div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>معاملات مكتملة</span>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={displayedTransfers}
        searchPlaceholder="ابحث برقم العقد، اسم العاملة، الكفيل القديم أو الجديد..."
        onAddClick={() => setShowAddModal(true)}
        addLabel="إضافة طلب نقل كفالة"
        exportConfig={{ sectionKey: 'sponsorship-transfer', rawData: displayedTransfers }}
      />

      {/* Add Transfer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden font-sans">
            <div className="p-4 bg-black text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <i className="fa-solid fa-people-arrows" style={{ color: '#c1fbd4' }}></i>
                تسجيل طلب نقل كفالة وتنازل جديد
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleAddTransfer} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">اسم العاملة *</label>
                  <input
                    type="text"
                    required
                    value={newForm.maid_name}
                    onChange={e => setNewForm({ ...newForm, maid_name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                    placeholder="مثال: MERON HAILE"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الجنسية *</label>
                  <select
                    value={newForm.nationality}
                    onChange={e => setNewForm({ ...newForm, nationality: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                  >
                    <option>اثيوبيا</option>
                    <option>الفلبين</option>
                    <option>كينيا</option>
                    <option>اوغندا</option>
                    <option>ألبانيا</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الكفيل الحالي (المتنازل) *</label>
                  <input
                    type="text"
                    required
                    value={newForm.old_sponsor}
                    onChange={e => setNewForm({ ...newForm, old_sponsor: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                    placeholder="اسم الكفيل الحالي"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">جوال الكفيل الحالي</label>
                  <input
                    type="text"
                    value={newForm.old_sponsor_phone}
                    onChange={e => setNewForm({ ...newForm, old_sponsor_phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                    placeholder="05xxxxxxxx"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الكفيل الجديد (المستلم)</label>
                  <input
                    type="text"
                    value={newForm.new_sponsor}
                    onChange={e => setNewForm({ ...newForm, new_sponsor: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                    placeholder="اسم الكفيل الجديد"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رسوم التنازل (ر.س)</label>
                  <input
                    type="number"
                    value={newForm.contract_amount}
                    onChange={e => setNewForm({ ...newForm, contract_amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="button-outline-on-light"
                  style={{ borderRadius: '9999px', fontSize: '12px', minHeight: '36px', padding: '6px 18px' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="button-primary-pill"
                  style={{ borderRadius: '9999px', fontSize: '12px', minHeight: '36px', padding: '6px 22px' }}
                >
                  حفظ وتسجيل الطلب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
