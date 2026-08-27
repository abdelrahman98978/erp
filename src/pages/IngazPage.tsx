import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';
import { Stamp, Plus, FileSpreadsheet, FileText, Search, Printer, RefreshCw, X } from 'lucide-react';

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
    foreign_office: "PLATINUM BROTHERS INT'L",
    profession: 'عامل مهني',
    nationality: 'الفلبين',
    fee_amount: 450.00,
    status: 'تم التوثيق',
    created_at: '2026-07-30'
  }
];

export const IngazPage: React.FC = () => {
  const [delegations, setDelegations] = useState<IngazDelegation[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    realErpDataStore.getRecords<IngazDelegation>('ingaz_delegations', MOCK_INGAZ_DELEGATIONS).then(data => setDelegations(data));
  }, []);

  const [formData, setFormData] = useState({
    client_name: '',
    sponsor_id: '',
    visa_number: '',
    foreign_office: 'DAMAS FOREIGN AGENCY',
    profession: 'عاملة منزلية',
    nationality: 'اثيوبيا',
    fee_amount: '350'
  });

  const handleCreateDelegation = async (e: React.FormEvent) => {
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

    const updated = await realErpDataStore.addRecord('ingaz_delegations', newDelegation, MOCK_INGAZ_DELEGATIONS);
    setDelegations(updated);
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
    const matchesSearch =
      d.delegation_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.client_name.includes(searchQuery) ||
      d.visa_number.includes(searchQuery) ||
      d.foreign_office.includes(searchQuery);

    if (!matchesSearch) return false;
    if (activeTab === 'verified') return d.status === 'تم التوثيق';
    if (activeTab === 'pending') return d.status === 'بانتظار الموافقة';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
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
            <Stamp className="w-5 h-5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>ENJAZ & MOFA VISA DELEGATIONS</span>
            </div>
            <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
              إدارة تفاويض الإنجاز الإلكترونية
            </h1>
            <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '4px 0 0 0', fontWeight: 420 }}>
              توثيق تفاويض التأشيرات عبر منصة إنجاز/مساند للمكاتب الخارجية المعتمدة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowModal(true)}
            className="button-white-pill"
            style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
          >
            <Plus className="w-4 h-4 ml-1" />
            <span>+ إضافة تفويض جديد</span>
          </button>
          <button
            onClick={() => exportData('ingaz', filteredDelegations, 'excel')}
            className="button-outline-on-light"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px', background: '#ffffff' }}
          >
            <FileSpreadsheet className="w-4 h-4 ml-1 text-emerald-600" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => exportData('ingaz', filteredDelegations, 'pdf')}
            className="button-outline-on-light"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px', background: '#ffffff' }}
          >
            <FileText className="w-4 h-4 ml-1 text-rose-600" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-3">
        {[
          { id: 'all', label: `جميع التفاويض (${delegations.length})` },
          { id: 'verified', label: 'تفاويض موثقة (Enjaz Valid)' },
          { id: 'pending', label: 'بانتظار الموافقة' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '6px 16px',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: isActive ? '#000000' : '#e4e4e7',
                backgroundColor: isActive ? '#000000' : '#ffffff',
                color: isActive ? '#ffffff' : '#27272a',
                fontWeight: isActive ? 550 : 420,
                fontSize: '12.5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Table Card */}
      <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-white flex-wrap gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute right-3 top-3 text-zinc-400" />
            <input
              type="text"
              placeholder="ابحث برقم التفويض، اسم العميل، أو التأشيرة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-input"
              style={{ width: '100%', height: '36px', minHeight: '36px', borderRadius: '9999px', paddingRight: '36px', fontSize: '12px' }}
            />
          </div>
          <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
            العدد: {filteredDelegations.length} تفويض
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-zinc-700">
            <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
              <tr>
                <th className="p-3.5">رقم التفويض</th>
                <th className="p-3.5">العميل ورقم الهوية</th>
                <th className="p-3.5">رقم التأشيرة والمهنة</th>
                <th className="p-3.5">المكتب الخارجي</th>
                <th className="p-3.5">رسوم التفويض</th>
                <th className="p-3.5">حالة التوثيق</th>
                <th className="p-3.5">التاريخ</th>
                <th className="p-3.5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredDelegations.map((row) => (
                <tr key={row.id} className="hover:bg-zinc-50">
                  <td className="p-3.5 font-mono font-bold text-black">{row.delegation_number}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-black">{row.client_name}</div>
                    <div className="text-zinc-500 font-mono text-[11px]">هوية: {row.sponsor_id}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-mono font-bold text-black">{row.visa_number}</div>
                    <div className="text-zinc-500 text-[11px]">{row.profession} • {row.nationality}</div>
                  </td>
                  <td className="p-3.5 font-semibold text-zinc-700">{row.foreign_office}</td>
                  <td className="p-3.5 font-mono font-bold text-emerald-700">{(row.fee_amount ?? 0).toFixed(2)} ر.س</td>
                  <td className="p-3.5">
                    <Badge
                      text={row.status}
                      type={row.status === 'تم التوثيق' ? 'success' : row.status === 'بانتظار الموافقة' ? 'warning' : 'danger'}
                    />
                  </td>
                  <td className="p-3.5 font-mono text-zinc-500">{row.created_at}</td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        className="button-outline-on-light"
                        style={{ padding: '3px 10px', fontSize: '11px', minHeight: '26px' }}
                        onClick={() => alert(`طباعة وثيقة التفويض الإلكتروني رقم ${row.delegation_number}`)}
                      >
                        <Printer className="w-3 h-3 ml-1" />
                        <span>طباعة</span>
                      </button>
                      <button
                        className="button-outline-on-light"
                        style={{ padding: '3px 8px', fontSize: '11px', minHeight: '26px' }}
                        onClick={() => alert(`تحديث حالة التفويض مع منصة إنجاز للمستفيد ${row.client_name}`)}
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden font-sans">
            <div className="p-5 bg-black text-white flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Stamp className="w-4 h-4 text-emerald-400" />
                <span>إضافة تفويض إنجاز إلكتروني جديد</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDelegation} className="p-6 space-y-4 bg-white text-black">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">اسم المستفيد / العميل *</label>
                  <input
                    type="text"
                    required
                    value={formData.client_name}
                    onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                    placeholder="اسم الكفيل"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">رقم الهوية / السجل *</label>
                  <input
                    type="text"
                    required
                    value={formData.sponsor_id}
                    onChange={e => setFormData({ ...formData, sponsor_id: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono focus:border-black focus:outline-none"
                    placeholder="10xxxxxxxx"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">رقم التأشيرة (MOFA) *</label>
                  <input
                    type="text"
                    required
                    value={formData.visa_number}
                    onChange={e => setFormData({ ...formData, visa_number: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono font-bold focus:border-black focus:outline-none"
                    placeholder="1300xxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">المكتب الخارجي المفوض</label>
                  <select
                    value={formData.foreign_office}
                    onChange={e => setFormData({ ...formData, foreign_office: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  >
                    <option>DAMAS FOREIGN AGENCY</option>
                    <option>PLATINUM BROTHERS INT'L</option>
                    <option>VERSATILE OVERSEAS LTD</option>
                    <option>AILEEN AGENT PLC</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">المهنة</label>
                  <input
                    type="text"
                    value={formData.profession}
                    onChange={e => setFormData({ ...formData, profession: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">الجنسية</label>
                  <select
                    value={formData.nationality}
                    onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black focus:border-black focus:outline-none"
                  >
                    <option>اثيوبيا</option>
                    <option>الفلبين</option>
                    <option>الهند</option>
                    <option>كينيا</option>
                    <option>اوغندا</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">رسوم التفويض</label>
                  <input
                    type="number"
                    value={formData.fee_amount}
                    onChange={e => setFormData({ ...formData, fee_amount: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2 px-3 text-xs text-black font-mono font-bold focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
                  توثيق التفويض
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
