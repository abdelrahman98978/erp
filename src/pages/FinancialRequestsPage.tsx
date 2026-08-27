import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useCompany } from '../contexts/CompanyContext';

export interface FinancialReq {
  id: string;
  request_number: string;
  paid_to: string;
  branch: string;
  accounting_name: string;
  request_type: 'سداد مساند' | 'رسوم إقامة' | 'فحص طبي' | 'تذكرة طيران' | 'تسوية وكيل' | 'عهدة فرع' | 'أخرى';
  escalation: 'عادي' | 'هام' | 'شديد الأهمية';
  date: string;
  amount: number;
  entry_type: 'مدين' | 'دائن';
  payment_method: 'تحويل بنكي' | 'نقداً من الصندوق' | 'بطاقة مدى' | 'شيك مصرفي';
  description: string;
  accounting_account: string;
  bank_name: string;
  account_owner: string;
  account_number: string;
  iban: string;
  status: 'تجهيز' | 'بانتظار الاعتماد' | 'تم السداد' | 'طلب إقفال';
  applicant: string;
}

const MOCK_FIN_REQUESTS: FinancialReq[] = [
  {
    id: 'FIN-01',
    request_number: '#FIN-2026-001',
    paid_to: 'منصة مساند الحكومية',
    branch: 'الفرع الرئيسي - الرياض',
    accounting_name: 'رسوم توثيق عقود استقدام مساند',
    request_type: 'سداد مساند',
    escalation: 'هام',
    date: '2026-08-10',
    amount: 150.0,
    entry_type: 'مدين',
    payment_method: 'تحويل بنكي',
    description: 'سداد رسوم العقد الإلكتروني رقم #RC-2026-0592',
    accounting_account: '52010 - مصروفات وتراخيص حكومية',
    bank_name: 'مصرف الراجحي',
    account_owner: 'شركة خالد السليم للاستقدام',
    account_number: '10928374112',
    iban: 'SA038000000010928374112',
    status: 'تم السداد',
    applicant: 'فهد العتيبي (مسؤول التشغيل)',
  },
  {
    id: 'FIN-02',
    request_number: '#FIN-2026-002',
    paid_to: 'المديرية العامة للجوازات',
    branch: 'فرع جدة',
    accounting_name: 'رسوم إصدار وتجديد إقامة',
    request_type: 'رسوم إقامة',
    escalation: 'شديد الأهمية',
    date: '2026-08-12',
    amount: 650.0,
    entry_type: 'مدين',
    payment_method: 'بطاقة مدى',
    description: 'رسوم إقامة للعاملة ماريا سانتوس لعقد الإيجار الشهري',
    accounting_account: '52020 - رسوم الجوازات والإقامات',
    bank_name: 'البنك الأهلي السعودي',
    account_owner: 'شركة خالد السليم',
    account_number: '20938475611',
    iban: 'SA031000000020938475611',
    status: 'بانتظار الاعتماد',
    applicant: 'سارة خالد',
  },
  {
    id: 'FIN-03',
    request_number: '#FIN-2026-003',
    paid_to: 'PLATINUM BROTHERS INT’L',
    branch: 'الإدارة العامة للمجموعة',
    accounting_name: 'دفعة حساب وكيل خارجي',
    request_type: 'تسوية وكيل',
    escalation: 'شديد الأهمية',
    date: '2026-08-15',
    amount: 18500.0,
    entry_type: 'مدين',
    payment_method: 'تحويل بنكي',
    description: 'تسوية إرسالية عدد 15 جواز سفر معتمد للسفارة',
    accounting_account: '21040 - حسابات المكاتب الخارجية الدائنة',
    bank_name: 'بنك الرياض',
    account_owner: 'PLATINUM BROTHERS AGENCY',
    account_number: '99018273645',
    iban: 'PH0380000099018273645',
    status: 'تجهيز',
    applicant: 'عبدالفتح (مسؤول الوكلاء)',
  },
];

export const FinancialRequestsPage: React.FC = () => {
  const { activeCompany } = useCompany();
  const [requests, setRequests] = useState<FinancialReq[]>(MOCK_FIN_REQUESTS);
  const [activeTab, setActiveTab] = useState<'all' | 'incomplete' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State (Full ClickERP Fields)
  const [paidTo, setPaidTo] = useState('');
  const [branch, setBranch] = useState('الفرع الرئيسي - الرياض');
  const [accountingName, setAccountingName] = useState('');
  const [requestType, setRequestType] = useState<FinancialReq['request_type']>('سداد مساند');
  const [escalation, setEscalation] = useState<FinancialReq['escalation']>('عادي');
  const [amount, setAmount] = useState('');
  const [entryType, setEntryType] = useState<'مدين' | 'دائن'>('مدين');
  const [paymentMethod, setPaymentMethod] = useState<FinancialReq['payment_method']>('تحويل بنكي');
  const [description, setDescription] = useState('');
  const [bankName, setBankName] = useState('مصرف الراجحي');
  const [accountOwner, setAccountOwner] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [iban, setIban] = useState('');

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paidTo || !amount) return;

    const newReq: FinancialReq = {
      id: `FIN-${Date.now().toString().slice(-4)}`,
      request_number: `#FIN-2026-00${requests.length + 1}`,
      paid_to: paidTo,
      branch,
      accounting_name: accountingName || 'طلب مصروفات تشغيلية',
      request_type: requestType,
      escalation,
      date: new Date().toISOString().slice(0, 10),
      amount: parseFloat(amount) || 0,
      entry_type: entryType,
      payment_method: paymentMethod,
      description,
      accounting_account: '51000 - المصروفات التشغيلية',
      bank_name: bankName,
      account_owner: accountOwner || paidTo,
      account_number: accountNumber || '10000000',
      iban: iban || 'SA0000000000000000',
      status: 'بانتظار الاعتماد',
      applicant: 'المستخدم الحالي',
    };

    setRequests([newReq, ...requests]);
    setShowAddModal(false);
    setPaidTo('');
    setAmount('');
    setDescription('');
  };

  const getFilteredRequests = () => {
    return requests.filter((r) => {
      const matchesSearch =
        r.request_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.paid_to.includes(searchQuery) ||
        r.description.includes(searchQuery);

      if (!matchesSearch) return false;

      if (activeTab === 'incomplete') return r.status === 'تجهيز' || r.status === 'بانتظار الاعتماد';
      if (activeTab === 'paid') return r.status === 'تم السداد' || r.status === 'طلب إقفال';

      return true;
    });
  };

  const currentDisplayList = getFilteredRequests();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '900', margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-file-invoice-dollar text-emerald-600"></i>
            إدارة الطلبات المالية والتشغيلية (Financial Operational Requests)
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#71717a' }}>
            إصدار طلبات سداد الرسوم الحكومية، الجوازات، تذاكر الطيران، وتسويات المكاتب الخارجية لـ{' '}
            <strong style={{ color: '#000000' }}>{activeCompany.name}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowAddModal(true)}
            className="button-primary-pill"
            style={{ fontSize: '13px', padding: '6px 18px', minHeight: '38px' }}
          >
            <i className="fa-solid fa-plus text-xs"></i>
            + إنشاء طلب مالي جديد
          </button>

          <button
            onClick={() => exportData('financial_requests', currentDisplayList, 'excel', `الطلبات المالية - ${activeCompany.name}`)}
            className="button-outline-on-light"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
          >
            <i className="fa-solid fa-file-excel text-emerald-600 ml-1"></i> Excel
          </button>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid #e4e4e7', paddingBottom: '12px' }}>
        {[
          { id: 'all', label: `جميع الطلبات المالية (${requests.length})`, icon: 'fa-folder-open' },
          { id: 'incomplete', label: 'الطلبات غير المكتملة / قيد المراجعة', icon: 'fa-clock' },
          { id: 'paid', label: 'الطلبات المسددة والمقفلة', icon: 'fa-circle-check' },
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
              <i className={`fa-solid ${tab.icon}`} style={{ fontSize: '11px' }}></i>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Requests Table */}
      <div className="card-pricing" style={{ padding: 0, borderRadius: '16px', border: '1px solid #e4e4e7', background: '#ffffff', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #e4e4e7', background: '#ffffff' }}>
          <input
            type="text"
            placeholder="البحث بالرقم، المدفوع له، أو الوصف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-input"
            style={{ borderRadius: '9999px', padding: '0 16px', height: '38px', minHeight: '38px', width: '320px', fontSize: '13px' }}
          />
          <span className="pill-tag-shade" style={{ fontSize: '12px' }}>
            العدد المعروض: {currentDisplayList.length} طلب
          </span>
        </div>

        <table className="odoo-table" style={{ width: '100%', textAlign: 'right' }}>
          <thead>
            <tr>
              <th>رقم الطلب</th>
              <th>المدفوع له</th>
              <th>نوع الطلب</th>
              <th>الفرع</th>
              <th>المبلغ المطلوب</th>
              <th>طريقة الدفع</th>
              <th>الأولوية والتصعيد</th>
              <th>الحالة</th>
              <th>مقدم الطلب</th>
            </tr>
          </thead>
          <tbody>
            {currentDisplayList.map((r) => (
              <tr key={r.id}>
                <td><strong style={{ color: '#000000' }}>{r.request_number}</strong></td>
                <td>
                  <div style={{ fontWeight: 600, color: '#000000' }}>{r.paid_to}</div>
                  <div style={{ fontSize: '10px', color: '#71717a' }}>{r.accounting_name}</div>
                </td>
                <td><Badge text={r.request_type} type="purple" /></td>
                <td>{r.branch}</td>
                <td><strong style={{ color: '#000000' }}>{r.amount.toLocaleString()} ر.س</strong></td>
                <td><span style={{ fontSize: '11px', color: '#475569' }}>{r.payment_method}</span></td>
                <td><Badge text={r.escalation} type={r.escalation === 'شديد الأهمية' ? 'danger' : 'warning'} /></td>
                <td><Badge text={r.status} type={r.status === 'تم السداد' ? 'success' : 'warning'} /></td>
                <td><span style={{ fontSize: '11px', fontWeight: '700' }}>{r.applicant}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal (ClickERP 20 Fields) */}
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
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '740px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: '#0F172A' }}>
                إنشاء طلب مالي جديد (ClickERP Complete Form)
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#94A3B8' }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>المدفوع له *</label>
                  <input type="text" required value={paidTo} onChange={(e) => setPaidTo(e.target.value)} placeholder="جهة الصرف أو المستفيد" style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>الفرع *</label>
                  <select value={branch} onChange={(e) => setBranch(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}>
                    <option>الفرع الرئيسي - الرياض</option>
                    <option>فرع جدة</option>
                    <option>فرع الدمام</option>
                    <option>فرع خميس مشيط</option>
                    <option>الإدارة العامة للمجموعة</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>نوع الطلب *</label>
                  <select value={requestType} onChange={(e) => setRequestType(e.target.value as any)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}>
                    <option value="سداد مساند">سداد مساند</option>
                    <option value="رسوم إقامة">رسوم إقامة</option>
                    <option value="فحص طبي">فحص طبي</option>
                    <option value="تذكرة طيران">تذكرة طيران</option>
                    <option value="تسوية وكيل">تسوية وكيل</option>
                    <option value="عهدة فرع">عهدة فرع</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>المبلغ المطلوب (ر.س) *</label>
                  <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>طريقة الدفع *</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}>
                    <option value="تحويل بنكي">تحويل بنكي</option>
                    <option value="نقداً من الصندوق">نقداً من الصندوق</option>
                    <option value="بطاقة مدى">بطاقة مدى</option>
                    <option value="شيك مصرفي">شيك مصرفي</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>الأولوية / التصعيد *</label>
                  <select value={escalation} onChange={(e) => setEscalation(e.target.value as any)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}>
                    <option value="عادي">عادي</option>
                    <option value="هام">هام</option>
                    <option value="شديد الأهمية">شديد الأهمية VIP</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>وصف الدفع والغرض منه *</label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="سبب الصرف وتفاصيل المعاملة..."
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>اسم البنك المستفيد</label>
                  <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>رقم الآيبان (IBAN)</label>
                  <input type="text" value={iban} onChange={(e) => setIban(e.target.value)} placeholder="SA..." style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
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
                  حفظ وإرسال الطلب للاعتماد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
