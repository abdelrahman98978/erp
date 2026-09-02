import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';
import { useAppStore } from '../stores/appStore';
import { RefreshCw, Plus, FileSpreadsheet, FileText, Search, Clock, Check, X, Trash2 } from 'lucide-react';

interface TransferRequest {
  id: string;
  contract_number: string;
  maid_name: string;
  nationality: string;
  job?: string;
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
    maid_name: 'أرليندا كراسنيكي (طاهية ومدبرة منزل)',
    nationality: 'ألبانيا',
    old_sponsor: 'سارة بنت أحمد المحمد',
    old_sponsor_phone: '+966558025628',
    new_sponsor: 'بندر بن صالح الهويريني',
    new_sponsor_phone: '+966555774494',
    trial_days_remaining: 6,
    contract_amount: 20000,
    status: 'فترة التجربة',
    created_at: '2026-07-25'
  },
  {
    id: 'TR-902',
    contract_number: '#TR-2026-002',
    maid_name: 'سلمى جبري تسفاي (رعاية كبار سن)',
    nationality: 'إثيوبيا',
    old_sponsor: 'عبدالله بن فهد المنصور',
    old_sponsor_phone: '+966500112233',
    new_sponsor: 'إياد بن سعد الخالدي',
    new_sponsor_phone: '+966562404213',
    trial_days_remaining: 0,
    contract_amount: 18000,
    status: 'تم النقل',
    created_at: '2026-07-10'
  }
];

export const SponsorshipTransferPage: React.FC = () => {
  const { addNotification } = useAppStore();
  const storeActiveTab = useAppStore(state => state.activeTab);
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredTransfers = transfers.filter(t => {
    const matchesSearch =
      t.contract_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.maid_name.includes(searchQuery) ||
      t.old_sponsor.includes(searchQuery) ||
      t.new_sponsor.includes(searchQuery);

    if (!matchesSearch) return false;
    if (storeActiveTab === 'trial-period') return t.status === 'فترة التجربة';
    if (storeActiveTab === 'transferred-done') return t.status === 'تم النقل';
    return true;
  });

  const trialCount = transfers.filter(t => t.status === 'فترة التجربة').length;
  const completedCount = transfers.filter(t => t.status === 'تم النقل').length;

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
    addNotification({
      title: 'تأكيد نقل الكفالة',
      message: `تم اعتماد نقل كفالة (${row.maid_name}) إلى الكفيل (${row.new_sponsor}) بنجاح.`,
      type: 'success',
    });
  };

  const handleDeleteTransfer = async (row: TransferRequest) => {
    if (window.confirm(`هل أنت متأكد من حذف طلب نقل كفالة (${row.maid_name})؟`)) {
      await realErpDataStore.deleteRecord('sponsorship_transfers', row.id);
      setTransfers(transfers.filter(t => t.id !== row.id));
      addNotification({
        title: 'حذف طلب نقل الكفالة',
        message: `تم حذف الطلب #${row.contract_number} بنجاح.`,
        type: 'error',
      });
    }
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
    addNotification({
      title: 'تسجيل طلب تنازل جديد',
      message: `تم تسجيل طلب نقل كفالة (${newForm.maid_name}) وبدء فترة التجربة (10 أيام).`,
      type: 'success',
    });
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

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div
        className="card-feature-cinematic"
        style={{
          background: '#000000',
          borderRadius: '16px',
          padding: '28px',
          color: '#FFFFFF',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div className="flex items-center gap-3">
          <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>QIWA & SPONSORSHIP TRANSFER</span>
            </div>
            <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
              إدارة طلبات نقل الكفالة والتنازل
            </h1>
            <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '4px 0 0 0', fontWeight: 420 }}>
              متابعة عداد فترة التجربة (10 أيام)، تحويل المبالغ بين الكفلاء، وإعادة التخصيص
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            className="button-white-pill"
            onClick={() => setShowAddModal(true)}
            style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
          >
            <Plus className="w-4 h-4 ml-1" />
            <span>+ إضافة طلب نقل كفالة</span>
          </button>
          <button
            className="button-outline-on-light"
            onClick={() => exportData('sponsorship-transfer', transfers, 'excel')}
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px', background: '#ffffff' }}
          >
            <FileSpreadsheet className="w-4 h-4 ml-1 text-champagne-dark" />
            <span>Excel</span>
          </button>
          <button
            className="button-outline-on-light"
            onClick={() => exportData('sponsorship-transfer', transfers, 'pdf')}
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px', background: '#ffffff' }}
          >
            <FileText className="w-4 h-4 ml-1 text-rose-600" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card-pistachio-band" style={{ padding: '24px', borderRadius: '16px' }}>
          <span style={{ fontSize: '13px', color: '#000000', fontWeight: 550 }}>إجمالي طلبات التنازل</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>{transfers.length} طلبات</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>مسجلة بالنظام</span>
        </div>

        <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#71717a', fontWeight: 550 }}>تحت فترة التجربة</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '6px', letterSpacing: '-0.02em' }}>{trialCount} عاملات</div>
          <span className="pill-tag-shade" style={{ fontSize: '11px', marginTop: '10px' }}>متابعة الضمان</span>
        </div>

        <div className="card-pricing-featured" style={{ padding: '24px', borderRadius: '16px', background: '#000000', color: '#ffffff' }}>
          <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 550 }}>تم اكتمال النقل والتوثيق</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#ffffff', marginTop: '6px', letterSpacing: '-0.02em' }}>{completedCount} مكتمل</div>
          <span className="pill-tag-mint" style={{ fontSize: '11px', marginTop: '10px' }}>توثيق مساند وأبشر</span>
        </div>
      </div>

      {/* Table */}
      <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-white flex-wrap gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute right-3 top-3 text-zinc-400" />
            <input
              type="text"
              placeholder="ابحث باسم العاملة، الكفيل، أو المهنة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-input"
              style={{ width: '100%', height: '36px', minHeight: '36px', borderRadius: '9999px', paddingRight: '36px', fontSize: '12px' }}
            />
          </div>
          <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
            العدد: {filteredTransfers.length} طلبات
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-zinc-700">
            <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">اسم العاملة</th>
                <th className="p-3.5">الجنسية والمهنة</th>
                <th className="p-3.5">الكفيل السابق</th>
                <th className="p-3.5">الكفيل الجديد</th>
                <th className="p-3.5">فترة التجربة</th>
                <th className="p-3.5">مبلغ التنازل</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredTransfers.map((row) => (
                <tr key={row.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="p-3.5 font-bold text-black">{row.maid_name}</td>
                  <td className="p-3.5">
                    <div className="font-semibold text-black">{row.nationality}</div>
                    <div className="text-zinc-400">{row.job}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-black">{row.old_sponsor}</div>
                    <div className="text-zinc-500 font-mono">{row.old_sponsor_phone}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-purple-800">{row.new_sponsor || 'بانتظار تخصيص'}</div>
                    <div className="text-zinc-500 font-mono">{row.new_sponsor_phone || '---'}</div>
                  </td>
                  <td className="p-3.5">
                    <span className={`font-bold font-mono flex items-center gap-1 ${row.trial_days_remaining > 0 ? 'text-amber-700' : 'text-champagne-dark'}`}>
                      <Clock className="w-3 h-3" />
                      {row.trial_days_remaining > 0 ? `${row.trial_days_remaining} أيام متبقية` : 'انتهت التجربة'}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-champagne-dark">{(row.contract_amount ?? 0).toLocaleString()} ر.س</td>
                  <td className="p-3.5">
                    <Badge
                      text={row.status}
                      type={row.status === 'تم النقل' ? 'success' : row.status === 'فترة التجربة' ? 'warning' : 'danger'}
                    />
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {row.status === 'فترة التجربة' && (
                        <button
                          onClick={() => handleConfirmTransfer(row)}
                          className="button-primary-pill"
                          style={{ padding: '3px 10px', fontSize: '11px', minHeight: '26px' }}
                        >
                          <Check className="w-3 h-3 ml-1" />
                          <span>تأكيد النقل</span>
                        </button>
                      )}
                      <button
                        onClick={() => exportData('sponsorship-transfer', [row], 'pdf', `عقد_تنازل_${row.maid_name}`)}
                        className="button-outline-on-light"
                        style={{ padding: '3px 10px', fontSize: '11px', minHeight: '26px' }}
                      >
                        طباعة
                      </button>
                      <button
                        onClick={() => handleDeleteTransfer(row)}
                        className="p-1 rounded-full hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition-colors"
                        title="حذف الطلب"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transfer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden font-sans">
            <div className="p-5 bg-black text-white flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-champagne-light" />
                <span>تسجيل طلب نقل كفالة وتنازل جديد</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTransfer} className="p-6 space-y-4 bg-white text-black">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">اسم العاملة *</label>
                  <input
                    type="text"
                    required
                    value={newForm.maid_name}
                    onChange={e => setNewForm({ ...newForm, maid_name: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                    placeholder="مثال: MERON HAILE"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">الجنسية *</label>
                  <select
                    value={newForm.nationality}
                    onChange={e => setNewForm({ ...newForm, nationality: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
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
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">الكفيل الحالي (المتنازل) *</label>
                  <input
                    type="text"
                    required
                    value={newForm.old_sponsor}
                    onChange={e => setNewForm({ ...newForm, old_sponsor: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                    placeholder="اسم الكفيل الحالي"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">جوال الكفيل الحالي</label>
                  <input
                    type="text"
                    value={newForm.old_sponsor_phone}
                    onChange={e => setNewForm({ ...newForm, old_sponsor_phone: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
                    placeholder="05xxxxxxxx"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">الكفيل الجديد (المستلم)</label>
                  <input
                    type="text"
                    value={newForm.new_sponsor}
                    onChange={e => setNewForm({ ...newForm, new_sponsor: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                    placeholder="اسم الكفيل الجديد"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">رسوم التنازل (ر.س)</label>
                  <input
                    type="number"
                    value={newForm.contract_amount}
                    onChange={e => setNewForm({ ...newForm, contract_amount: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono font-bold focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="button-outline-on-light"
                  style={{ minHeight: '36px', padding: '6px 16px', fontSize: '13px' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="button-primary-pill"
                  style={{ minHeight: '36px', padding: '6px 20px', fontSize: '13px' }}
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

export default SponsorshipTransferPage;
