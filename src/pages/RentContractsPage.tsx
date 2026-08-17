import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useRentContracts, useTableMutation } from '../hooks/queries/useErpQueries';
import { useCompany } from '../contexts/CompanyContext';
import { DualBrandingDocumentGenerator } from '../components/common/DualBrandingDocumentGenerator';

export interface RentContractRecord {
  id: string;
  company_id: string;
  contract_number: string;
  client_name: string;
  client_phone: string;
  client_national_id?: string;
  maid_name: string;
  nationality: string;
  package_name?: string;
  start_date: string;
  end_date: string;
  duration_months: number;
  monthly_cost: number;
  tax_amount?: number;
  total_amount: number;
  status: 'جديد' | 'نشط' | 'مرسل' | 'موصد' | 'تم التسليم' | 'مكتمل' | 'ملغي';
  payment_status: 'معلق' | 'تم الدفع' | 'بانتظار التحويل';
  marketer?: string;
  branch: string;
  created_at: string;
}

interface RentPackage {
  id: string;
  title: string;
  nationality: string;
  order: number;
  rent_type: string;
  duration: string;
  price_before_tax: number;
  tax: number;
  total_price: number;
  days_count: number;
  is_visible: boolean;
}

const MOCK_PACKAGES: RentPackage[] = [
  {
    id: 'PKG-01',
    title: 'باقة الشهر - عمالة منزلية إندونيسية',
    nationality: 'إندونيسيا',
    order: 1,
    rent_type: 'شهري',
    duration: 'شهر واحد',
    price_before_tax: 3000,
    tax: 450,
    total_price: 3450,
    days_count: 30,
    is_visible: true,
  },
  {
    id: 'PKG-02',
    title: 'باقة الثلاثة أشهر - عمالة منزلية إثيوبية',
    nationality: 'إثيوبيا',
    order: 2,
    rent_type: '3 أشهر',
    duration: '3 أشهر',
    price_before_tax: 4500,
    tax: 675,
    total_price: 5175,
    days_count: 90,
    is_visible: true,
  },
];

const DEFAULT_MOCK_RENT_CONTRACTS: RentContractRecord[] = [
  {
    id: 'rent-1',
    company_id: 'SAF',
    contract_number: 'SAF-RENT-2026-0014',
    client_name: 'ابو عبدالله',
    client_phone: '+966535666840',
    client_national_id: '1088273619',
    maid_name: 'Rental A21221 (سيتي نورعيني)',
    nationality: 'إندونيسيا',
    package_name: 'باقة الشهر الإندونيسي',
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    duration_months: 1,
    monthly_cost: 3000.0,
    tax_amount: 450.0,
    total_amount: 3450.0,
    status: 'نشط',
    payment_status: 'تم الدفع',
    marketer: 'سارة خالد (مشرفة التأجير)',
    branch: 'فرع الرياض الرئيسي',
    created_at: new Date().toISOString(),
  },
  {
    id: 'rent-2',
    company_id: 'SAF',
    contract_number: 'SAF-RENT-2026-0016',
    client_name: 'ابو اياد',
    client_phone: '+966562404213',
    client_national_id: '1099281726',
    maid_name: 'Rental A2122121 (رحمة أديسي)',
    nationality: 'إثيوبيا',
    package_name: 'باقة الشهر الإثيوبي',
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    duration_months: 2,
    monthly_cost: 1500.0,
    tax_amount: 450.0,
    total_amount: 3450.0,
    status: 'نشط',
    payment_status: 'معلق',
    marketer: 'فهد العتيبي',
    branch: 'فرع الرياض الرئيسي',
    created_at: new Date().toISOString(),
  },
];

export const RentContractsPage: React.FC = () => {
  const { activeCompanyId, activeCompany } = useCompany();
  const { data: rawRentContracts = [], isLoading } = useRentContracts();
  const { createItem } = useTableMutation('rent_contracts');

  const rentContracts: RentContractRecord[] =
    rawRentContracts.length > 0 ? (rawRentContracts as RentContractRecord[]) : DEFAULT_MOCK_RENT_CONTRACTS;

  const [activeTab, setActiveTab] = useState<
    'all' | 'active' | 'sent' | 'locked' | 'delivered' | 'completed' | 'packages'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedContractForPrint, setSelectedContractForPrint] = useState<RentContractRecord | null>(null);

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNationalId, setClientNationalId] = useState('');
  const [maidName, setMaidName] = useState('');
  const [nationality, setNationality] = useState('إندونيسيا');
  const [durationMonths, setDurationMonths] = useState('1');
  const [monthlyCost, setMonthlyCost] = useState('3000');
  const [branch, setBranch] = useState('فرع الرياض الرئيسي');

  const months = parseInt(durationMonths) || 1;
  const monthly = parseFloat(monthlyCost) || 3000;
  const tax = monthly * months * 0.15;
  const totalAmount = monthly * months + tax;

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !maidName) return;

    const companyCode = activeCompanyId !== 'all' ? activeCompanyId : 'SAF';
    const contractNumber = `${companyCode}-RENT-${new Date().getFullYear()}-${String(rentContracts.length + 1).padStart(4, '0')}`;

    const newRecord = {
      company_id: companyCode,
      contract_number: contractNumber,
      client_name: clientName,
      client_phone: clientPhone,
      client_national_id: clientNationalId,
      maid_name: maidName,
      nationality,
      start_date: new Date().toISOString().slice(0, 10),
      end_date: new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      duration_months: months,
      monthly_cost: monthly,
      tax_amount: tax,
      total_amount: totalAmount,
      status: 'نشط' as const,
      payment_status: 'تم الدفع' as const,
      branch,
    };

    await createItem.mutateAsync(newRecord);
    setShowAddModal(false);
    setClientName('');
    setClientPhone('');
    setMaidName('');
  };

  const getFilteredContracts = () => {
    return rentContracts.filter((c) => {
      const matchesSearch =
        c.contract_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.client_name.includes(searchQuery) ||
        c.maid_name.includes(searchQuery);

      if (!matchesSearch) return false;

      if (activeTab === 'active') return c.status === 'نشط';
      if (activeTab === 'sent') return c.status === 'مرسل';
      if (activeTab === 'locked') return c.status === 'موصد';
      if (activeTab === 'delivered') return c.status === 'تم التسليم';
      if (activeTab === 'completed') return c.status === 'مكتمل';

      return true;
    });
  };

  const currentDisplayList = getFilteredContracts();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '900', margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-handshake text-blue-600"></i>
            عقود التأجير وباقات التشغيل (Rental Contracts Suite)
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748B' }}>
            إدارة عقود التأجير الشهري واليومي، باقات الأسعار، وتوثيق السندات لـ{' '}
            <strong style={{ color: '#005154' }}>{activeCompany.name}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              backgroundColor: '#005154',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 81, 84, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <i className="fa-solid fa-plus text-xs"></i>
            إضافة عقد تأجير جديد
          </button>

          <button
            onClick={() => exportData('rent_contracts', currentDisplayList, 'excel', `عقود التأجير - ${activeCompany.name}`)}
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
          >
            <i className="fa-solid fa-file-excel text-emerald-600 ml-1"></i> Excel
          </button>
        </div>
      </div>

      {/* Sub Tabs Navigation (ClickERP Full Structure) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
        {[
          { id: 'all', label: `جميع عقود التأجير (${rentContracts.length || 13})`, icon: 'fa-folder-open' },
          { id: 'active', label: 'عقود نشطة (2)', icon: 'fa-circle-play' },
          { id: 'sent', label: 'عقود مرسلة (1)', icon: 'fa-paper-plane' },
          { id: 'locked', label: 'عقود موصدة (2)', icon: 'fa-lock' },
          { id: 'delivered', label: 'تم التسليم (0)', icon: 'fa-truck' },
          { id: 'completed', label: 'عقود مكتملة (7)', icon: 'fa-circle-check' },
          { id: 'packages', label: `باقات التأجير (${MOCK_PACKAGES.length || 2})`, icon: 'fa-box-open' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: isActive ? '#005154' : '#E2E8F0',
                backgroundColor: isActive ? '#005154' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#334155',
                fontWeight: isActive ? '800' : '600',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <i className={`fa-solid ${tab.icon}`} style={{ fontSize: '11px' }}></i>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contracts Table */}
      {activeTab !== 'packages' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="البحث برقم العقد، اسم العميل، أو العاملة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', width: '320px' }}
            />
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '700' }}>
              العدد المعروض: {currentDisplayList.length} عقد
            </span>
          </div>

          <table className="odoo-table" style={{ width: '100%', textAlign: 'right' }}>
            <thead>
              <tr>
                <th>رقم العقد</th>
                <th>اسم العميل</th>
                <th>العاملة والجنسية</th>
                <th>مدة الإيجار</th>
                <th>تاريخ البداية والنهاية</th>
                <th>التكلفة الشهرية</th>
                <th>الإجمالي شامل الضريبة</th>
                <th>الحالة</th>
                <th>الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {currentDisplayList.map((c) => (
                <tr key={c.id}>
                  <td><strong style={{ color: '#005154' }}>{c.contract_number}</strong></td>
                  <td>
                    <div style={{ fontWeight: '800', color: '#0F172A' }}>{c.client_name}</div>
                    <div style={{ fontSize: '10px', color: '#64748B' }}>{c.client_phone}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '800', color: '#0F172A' }}>{c.maid_name}</div>
                    <div style={{ fontSize: '10px', color: '#64748B' }}>{c.nationality}</div>
                  </td>
                  <td><strong>{c.duration_months} شهر</strong></td>
                  <td><span style={{ fontSize: '11px', color: '#475569' }}>{c.start_date} إلى {c.end_date}</span></td>
                  <td>{(c.monthly_cost ?? 0).toLocaleString()} ر.س</td>
                  <td><strong style={{ color: '#047857' }}>{(c.total_amount ?? 0).toLocaleString()} ر.س</strong></td>
                  <td><Badge text={c.status} type="success" /></td>
                  <td>
                    <button
                      onClick={() => setSelectedContractForPrint(c)}
                      style={{ backgroundColor: 'rgba(0,81,84,0.08)', color: '#005154', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
                    >
                      طباعة العقد
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Packages Tab */}
      {activeTab === 'packages' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800' }}>باقات التأجير المعتمدة</h3>
          <table className="odoo-table" style={{ width: '100%', textAlign: 'right' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>عنوان الباقة</th>
                <th>الجنسية</th>
                <th>نوع الإيجار</th>
                <th>المدة</th>
                <th>السعر بدون ضريبة</th>
                <th>الضريبة (15%)</th>
                <th>الإجمالي بعد الضريبة</th>
                <th>عدد الأيام</th>
                <th>الظهور</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PACKAGES.map((pkg, idx) => (
                <tr key={pkg.id}>
                  <td><strong>{idx + 1}</strong></td>
                  <td style={{ fontWeight: '800' }}>{pkg.title}</td>
                  <td>{pkg.nationality}</td>
                  <td><Badge text={pkg.rent_type} type="purple" /></td>
                  <td>{pkg.duration}</td>
                  <td>{(pkg.price_before_tax ?? 0).toLocaleString()} ر.س</td>
                  <td>{(pkg.tax ?? 0).toLocaleString()} ر.س</td>
                  <td><strong style={{ color: '#047857' }}>{(pkg.total_price ?? 0).toLocaleString()} ر.س</strong></td>
                  <td>{pkg.days_count} يوم</td>
                  <td><Badge text="مفعل وظاهر" type="success" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Rent Contract Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '640px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>
              إضافة عقد تأجير جديد (ClickERP Form)
            </h3>

            <form onSubmit={handleCreateContract}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>اسم العميل *</label>
                  <input type="text" required value={clientName} onChange={(e) => setClientName(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>رقم الجوال *</label>
                  <input type="text" required value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="+9665..." style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>العاملة المطلوبة للتأجير *</label>
                  <input type="text" required value={maidName} onChange={(e) => setMaidName(e.target.value)} placeholder="سيتي نورعيني (سير تأجير نشطة)" style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>الجنسية *</label>
                  <select value={nationality} onChange={(e) => setNationality(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}>
                    <option>إندونيسيا</option>
                    <option>إثيوبيا</option>
                    <option>الفلبين</option>
                    <option>أوغندا</option>
                    <option>كينيا</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>المدة (بالشهور) *</label>
                  <input type="number" required value={durationMonths} onChange={(e) => setDurationMonths(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>السعر الشهري قبل الضريبة *</label>
                  <input type="number" required value={monthlyCost} onChange={(e) => setMonthlyCost(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>الإجمالي بعد الضريبة</label>
                  <div style={{ padding: '8px 10px', backgroundColor: '#F1F5F9', borderRadius: '8px', fontWeight: '800', color: '#047857', fontSize: '12px' }}>
                    {totalAmount.toLocaleString()} ر.س
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#64748B', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#005154', color: '#FFFFFF', fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}
                >
                  اعتماد وحفظ العقد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contract Print Modal */}
      {selectedContractForPrint && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '640px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>طباعة عقد التأجير المعتمد</h3>
              <button onClick={() => setSelectedContractForPrint(null)} style={{ border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#94A3B8' }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <DualBrandingDocumentGenerator
              documentTitle="عقد تقديم خدمات تأجير عمالة منزلية"
              documentNumber={selectedContractForPrint.contract_number}
              date={new Date().toISOString().slice(0, 10)}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B', fontWeight: '700' }}>اسم العميل:</span>
                  <strong style={{ color: '#0F172A' }}>{selectedContractForPrint.client_name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B', fontWeight: '700' }}>العاملة المؤجرة:</span>
                  <strong style={{ color: '#0F172A' }}>{selectedContractForPrint.maid_name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B', fontWeight: '700' }}>مدة العقد:</span>
                  <strong>{selectedContractForPrint.duration_months} شهر ({selectedContractForPrint.start_date} إلى {selectedContractForPrint.end_date})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B', fontWeight: '700' }}>الإجمالي شامل الضريبة:</span>
                  <strong style={{ color: '#047857' }}>{selectedContractForPrint.total_amount.toLocaleString()} ر.س</strong>
                </div>
              </div>
            </DualBrandingDocumentGenerator>
          </div>
        </div>
      )}
    </div>
  );
};
