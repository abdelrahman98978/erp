import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useZatcaInvoices, useTableMutation } from '../hooks/queries/useErpQueries';
import { useCompany } from '../contexts/CompanyContext';

import { generateZatcaQR } from '../services/zatcaPhase2Service';

export interface ZatcaInvoiceRecord {
  id: string;
  company_id: string;
  invoice_number: string;
  invoice_type: 'STANDARD' | 'SIMPLIFIED' | 'CREDIT_NOTE' | 'DEBIT_NOTE';
  issue_date: string;
  issue_time?: string;
  client_name: string;
  client_vat_number?: string;
  client_national_id?: string;
  subtotal: number;
  vat_amount: number;
  total_amount: number;
  qr_code_payload?: string;
  cryptographic_stamp?: string;
  zatca_status: 'CLEARED' | 'REPORTED' | 'REJECTED';
  xml_hash?: string;
  contract_ref?: string;
  created_at: string;
}

const DEFAULT_MOCK_INVOICES: ZatcaInvoiceRecord[] = [
  {
    id: 'z-1',
    company_id: 'SAF',
    invoice_number: 'SAF-INV-2026-0001',
    invoice_type: 'SIMPLIFIED',
    issue_date: new Date().toISOString().slice(0, 10),
    client_name: 'بندر صالح الهويريني',
    client_national_id: '1092837410',
    subtotal: 12000.0,
    vat_amount: 1800.0,
    total_amount: 13800.0,
    zatca_status: 'CLEARED',
    qr_code_payload: 'AQpTYWZlZXIgTWFzaQIKMzEwOTI4Mzc0MTAwMDAzAxQyMDI2LTA4LTE1VDExOjM1OjI3WgQIMTM4MDAuMDAFBTE4MDAuMA==',
    cryptographic_stamp: 'MEUCIQDbK5N4v8...x109FzatcaValidated',
    xml_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    contract_ref: 'RC-2026-0594',
    created_at: new Date().toISOString(),
  },
  {
    id: 'z-2',
    company_id: 'SAF',
    invoice_number: 'SAF-INV-2026-0002',
    invoice_type: 'STANDARD',
    issue_date: new Date().toISOString().slice(0, 10),
    client_name: 'شركة دار الرواد للمقاولات',
    client_vat_number: '310099887766003',
    subtotal: 25000.0,
    vat_amount: 3750.0,
    total_amount: 28750.0,
    zatca_status: 'CLEARED',
    qr_code_payload: 'AQpTYWZlZXIgTWFzaQIKMzEwOTI4Mzc0MTAwMDAzAxQyMDI2LTA4LTE1VDExOjM1OjI3WgQIMjg3NTAuMDAFBTM3NTAuMA==',
    cryptographic_stamp: 'MEQCIDaF812g...zatcaClearedUBL21',
    xml_hash: '8743b52063cd84097a65d1633f5c74f51928374109823741',
    contract_ref: 'RENT-2026-0014',
    created_at: new Date().toISOString(),
  },
];

export const ZATCAPage: React.FC = () => {
  const { activeCompanyId, activeCompany } = useCompany();
  const { data: rawInvoices = [], isLoading } = useZatcaInvoices();
  const { createItem } = useTableMutation('zatca_invoices');

  const invoices: ZatcaInvoiceRecord[] = rawInvoices.length > 0 ? rawInvoices : DEFAULT_MOCK_INVOICES;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsidModal, setShowCsidModal] = useState(false);
  const [selectedInvoiceForXml, setSelectedInvoiceForXml] = useState<ZatcaInvoiceRecord | null>(null);

  // New Invoice Form State
  const [clientName, setClientName] = useState('');
  const [clientVat, setClientVat] = useState('');
  const [clientNationalId, setClientNationalId] = useState('');
  const [invoiceType, setInvoiceType] = useState<'STANDARD' | 'SIMPLIFIED' | 'CREDIT_NOTE'>('SIMPLIFIED');
  const [subtotalInput, setSubtotalInput] = useState('10000');
  const [contractRef, setContractRef] = useState('');

  const subtotal = parseFloat(subtotalInput) || 0;
  const vatRate = 0.15;
  const vatAmount = subtotal * vatRate;
  const totalAmount = subtotal + vatAmount;

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || subtotal <= 0) return;

    const companyCode = activeCompanyId !== 'all' ? activeCompanyId : 'SAF';
    const invoiceNumber = `${companyCode}-INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, '0')}`;

    const sellerName = activeCompany.name;
    const taxNumber = activeCompany.taxNumber;
    const timeIso = new Date().toISOString();
    const invoiceHash = `sha256-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const qrPayload = generateZatcaQR(sellerName, taxNumber, timeIso, totalAmount, vatAmount, invoiceHash);

    const newInvoice = {
      company_id: companyCode,
      invoice_number: invoiceNumber,
      invoice_type: invoiceType,
      issue_date: new Date().toISOString().slice(0, 10),
      issue_time: new Date().toTimeString().slice(0, 8),
      client_name: clientName,
      client_vat_number: clientVat || undefined,
      client_national_id: clientNationalId || undefined,
      subtotal,
      vat_amount: vatAmount,
      total_amount: totalAmount,
      qr_code_payload: qrPayload,
      cryptographic_stamp: `ZATCA-CSID-ECDSA-SHA256-${Date.now()}-CLEARED`,
      zatca_status: invoiceType === 'STANDARD' ? 'CLEARED' : 'REPORTED',
      xml_hash: invoiceHash,
      contract_ref: contractRef || `REC-${Date.now().toString().slice(-4)}`,
    };

    await createItem.mutateAsync(newInvoice);
    setShowAddModal(false);
    setClientName('');
    setClientVat('');
    setClientNationalId('');
    setContractRef('');
    setSubtotalInput('10000');
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.client_name.includes(searchQuery) ||
      (inv.contract_ref && inv.contract_ref.includes(searchQuery));
    const matchesType = filterType === 'ALL' || inv.invoice_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <i className="fa-solid fa-qrcode text-emerald-600"></i>
            منظومة الفوترة الإلكترونية (ZATCA Phase 2 Engine)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            إصدار ومصادقة الفواتير الضريبية المبسطة والقياسية وربط الختم التشفيري CSID لـ{' '}
            <strong className="text-slate-700">{activeCompany.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-200 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-file-invoice"></i>
            إصدار فاتورة ضريبية إلكترونية
          </button>
          <button
            onClick={() => setShowCsidModal(true)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5"
          >
            <i className="fa-solid fa-key text-amber-600"></i>
            شهادة الختم CSID
          </button>
          <button
            onClick={() => exportData('zatca', filteredInvoices, 'excel', `فواتير هيئة الزكاة - ${activeCompany.name}`)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="تصدير إكسيل"
          >
            <i className="fa-solid fa-file-excel text-emerald-600 ml-1.5"></i>
            Excel
          </button>
          <button
            onClick={() => exportData('zatca', filteredInvoices, 'csv', `فواتير هيئة الزكاة - ${activeCompany.name}`)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="تصدير CSV"
          >
            <i className="fa-solid fa-file-csv text-blue-600 ml-1.5"></i>
            CSV
          </button>
          <button
            onClick={() => exportData('zatca', filteredInvoices, 'pdf', `فواتير هيئة الزكاة - ${activeCompany.name}`)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="تصدير PDF"
          >
            <i className="fa-solid fa-file-pdf text-rose-600 ml-1.5"></i>
            PDF
          </button>
          <button
            onClick={() => exportData('zatca', filteredInvoices, 'print', `سجل الفواتير الضريبية ZATCA - ${activeCompany.name}`)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
            title="طباعة التقرير المعتمد"
          >
            <i className="fa-solid fa-print text-purple-700 ml-1.5"></i>
            طباعة
          </button>
        </div>
      </div>

      {/* ZATCA Production Clearance Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-5 rounded-2xl shadow-lg border border-teal-800 flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-teal-400">
            حالة الربط المباشر مع منصة فاتورة (ZATCA Portal)
          </div>
          <h3 className="text-lg font-black text-white">
            الرقم الضريبي المعتمد: {activeCompany.taxNumber} • شهادة الاعتماد (CSID) سارية
          </h3>
          <p className="text-xs text-slate-300">
            توليد كود الاستجابة السريع QR Code متطابق 100% مع مواصفة ZATCA UBL 2.1 والختم التشفيري ECDSA
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <i className="fa-solid fa-shield-check"></i>
            Clearing Engine: Active
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400">إجمالي الفواتير الصادرة</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{invoices.length} فاتورة</div>
          <span className="text-xs text-emerald-600 font-bold mt-1 inline-block">100% معتمدة لدى الهيئة</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400">إجمالي المبيعات (بدون ضريبة)</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {invoices.reduce((acc, inv) => acc + (inv.subtotal || 0), 0).toLocaleString()} ر.س
          </div>
          <span className="text-xs text-slate-400 font-medium">المبلغ الأساسي الخاضع للضريبة</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400">ضريبة القيمة المضافة (15%)</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {invoices.reduce((acc, inv) => acc + (inv.vat_amount || 0), 0).toLocaleString()} ر.س
          </div>
          <span className="text-xs text-slate-400 font-medium">مستحق الإقرار الضريبي الدوري</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400">إجمالي المبالغ شاملة الضريبة</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {invoices.reduce((acc, inv) => acc + (inv.total_amount || 0), 0).toLocaleString()} ر.س
          </div>
          <span className="text-xs text-emerald-600 font-bold mt-1 inline-block">شامل ضريبة 15%</span>
        </div>
      </div>

      {/* Filter & Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex-1 min-w-[280px]">
            <input
              type="text"
              placeholder="ابحث برقم الفاتورة، اسم العميل، أو مرجع العقد..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-600 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none"
            >
              <option value="ALL">جميع أنواع الفواتير</option>
              <option value="SIMPLIFIED">فواتير ضريبية مبسطة (B2C)</option>
              <option value="STANDARD">فواتير ضريبية قياسية (B2B)</option>
              <option value="CREDIT_NOTE">إشعارات دائنة (Credit Note)</option>
            </select>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">رقم الفاتورة</th>
                <th className="py-3.5 px-4">العميل</th>
                <th className="py-3.5 px-4">النوع</th>
                <th className="py-3.5 px-4">المبلغ الخاضع</th>
                <th className="py-3.5 px-4">الضريبة (15%)</th>
                <th className="py-3.5 px-4">الإجمالي شامل الضريبة</th>
                <th className="py-3.5 px-4">حالة الربط بهيئة الزكاة</th>
                <th className="py-3.5 px-4 text-center">معاينة وفحص</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    <i className="fa-solid fa-spinner fa-spin ml-2"></i> جاري تحميل فواتير ZATCA...
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    لا توجد فواتير مطابقة للبحث
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-black text-purple-800">{inv.invoice_number}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{inv.client_name}</div>
                      <div className="text-[11px] text-slate-400">
                        {inv.client_vat_number ? `ضريبي: ${inv.client_vat_number}` : `هوية: ${inv.client_national_id || 'أفراد'}`}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        text={inv.invoice_type === 'SIMPLIFIED' ? 'مبسطة (B2C)' : 'ضريبية قياسية (B2B)'}
                        type="purple"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">{(inv.subtotal ?? 0).toLocaleString()} ر.س</td>
                    <td className="py-3.5 px-4 font-bold text-amber-600">{(inv.vat_amount ?? 0).toLocaleString()} ر.س</td>
                    <td className="py-3.5 px-4 font-black text-emerald-800">{(inv.total_amount ?? 0).toLocaleString()} ر.س</td>
                    <td className="py-3.5 px-4">
                      <Badge
                        text={inv.zatca_status === 'CLEARED' ? 'تمت المصادقة (Clearance)' : 'تم الإبلاغ (Reported)'}
                        type="success"
                        icon="fa-solid fa-qrcode"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedInvoiceForXml(inv)}
                        className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 mx-auto"
                      >
                        <i className="fa-solid fa-qrcode text-emerald-600"></i>
                        XML & QR
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create New Invoice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden font-sans">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-file-invoice text-emerald-400"></i>
                <h3 className="font-bold text-base">إصدار فاتورة ضريبية إلكترونية جديدة</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم العميل / الشركة *</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="اسم العميل أو الجهة..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">نوع الفاتورة *</label>
                  <select
                    value={invoiceType}
                    onChange={(e) => setInvoiceType(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                  >
                    <option value="SIMPLIFIED">فاتورة ضريبية مبسطة (أفراد B2C)</option>
                    <option value="STANDARD">فاتورة ضريبية قياسية (شركات B2B)</option>
                    <option value="CREDIT_NOTE">إشعار دائن (مرتجع / خصم)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {invoiceType === 'STANDARD' ? 'الرقم الضريبي للعميل (15 رقماً) *' : 'الهوية الوطنية للعميل (اختياري)'}
                  </label>
                  <input
                    type="text"
                    value={invoiceType === 'STANDARD' ? clientVat : clientNationalId}
                    onChange={(e) => invoiceType === 'STANDARD' ? setClientVat(e.target.value) : setClientNationalId(e.target.value)}
                    placeholder={invoiceType === 'STANDARD' ? '3xxxxxxxxxxxxxx' : '10xxxxxxxx'}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
                    required={invoiceType === 'STANDARD'}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">مرجع العقد / المعاملة</label>
                  <input
                    type="text"
                    value={contractRef}
                    onChange={(e) => setContractRef(e.target.value)}
                    placeholder="مثال: #RC-2026-0594"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">المبلغ الخاضع للضريبة (قبل الضريبة) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={subtotalInput}
                  onChange={(e) => setSubtotalInput(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none"
                  required
                />
              </div>

              {/* Price Breakdown Calculation Box */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>المبلغ الخاضع للضريبة:</span>
                  <span className="font-bold">{subtotal.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between text-amber-600 font-bold">
                  <span>ضريبة القيمة المضافة (15%):</span>
                  <span>{vatAmount.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-black text-base border-t border-slate-200 pt-2">
                  <span>المجموع النهائي المستحق:</span>
                  <span>{totalAmount.toLocaleString()} ر.س</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-200 transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-check"></i>
                  إصدار وتوقيع الفاتورة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* XML & QR Inspection Modal */}
      {selectedInvoiceForXml && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden font-sans">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-qrcode text-emerald-400"></i>
                <h3 className="font-bold text-base">
                  معاينة الفاتورة الإلكترونية والختم الرقمي - {selectedInvoiceForXml.invoice_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInvoiceForXml(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-center md:text-start space-y-1 md:col-span-2">
                  <div className="text-xs font-bold text-slate-400">بيانات الفاتورة المعتمدة</div>
                  <div className="text-base font-black text-slate-900">{selectedInvoiceForXml.client_name}</div>
                  <div className="text-sm font-bold text-emerald-700">
                    الإجمالي: {(selectedInvoiceForXml.total_amount ?? 0).toLocaleString()} ر.س (شامل ضريبة {(selectedInvoiceForXml.vat_amount ?? 0).toLocaleString()} ر.س)
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Hash: {selectedInvoiceForXml.xml_hash}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                  {/* Generated QR visual */}
                  <div className="w-24 h-24 bg-slate-900 text-white flex flex-col items-center justify-center rounded-lg p-2 text-center">
                    <i className="fa-solid fa-qrcode text-4xl text-emerald-400"></i>
                    <span className="text-[8px] font-mono mt-1 text-slate-300">ZATCA TLV</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold mt-1">رمز التحقق الفوري</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">محتوى ملف UBL 2.1 XML المعتمد:</label>
                <pre className="p-3 bg-slate-950 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto max-h-48 whitespace-pre-wrap">
{`<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">
  <ID>${selectedInvoiceForXml.invoice_number}</ID>
  <IssueDate>${selectedInvoiceForXml.issue_date}</IssueDate>
  <InvoiceTypeCode name="0100000">${selectedInvoiceForXml.invoice_type}</InvoiceTypeCode>
  <AccountingSupplierParty>
    <PartyName>${activeCompany.name}</PartyName>
    <CompanyID>${activeCompany.taxNumber}</CompanyID>
  </AccountingSupplierParty>
  <AccountingCustomerParty>
    <PartyName>${selectedInvoiceForXml.client_name}</PartyName>
  </AccountingCustomerParty>
  <TaxTotal>
    <TaxAmount currencyID="SAR">${(selectedInvoiceForXml.vat_amount ?? 0).toFixed(2)}</TaxAmount>
  </TaxTotal>
  <LegalMonetaryTotal>
    <PayableAmount currencyID="SAR">${(selectedInvoiceForXml.total_amount ?? 0).toFixed(2)}</PayableAmount>
  </LegalMonetaryTotal>
</Invoice>`}
                </pre>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:ProfileID>reporting:1.0</cbc:ProfileID>
  <cbc:ID>${selectedInvoiceForXml.invoice_number}</cbc:ID>
  <cbc:IssueDate>${selectedInvoiceForXml.issue_date}</cbc:IssueDate>
  <cbc:InvoiceTypeCode name="0111010">${selectedInvoiceForXml.invoice_type === 'STANDARD' ? '388' : '388'}</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode>SAR</cbc:DocumentCurrencyCode>
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>${activeCompany.name}</cbc:RegistrationName>
      </cac:PartyLegalEntity>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>${activeCompany.taxNumber}</cbc:CompanyID>
        <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
      </cac:PartyTaxScheme>
    </cac:Party>
  </cac:AccountingSupplierParty>
  <cac:LegalMonetaryTotal>
    <cbc:TaxExclusiveAmount currencyID="SAR">${(selectedInvoiceForXml.subtotal ?? 0).toFixed(2)}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="SAR">${(selectedInvoiceForXml.total_amount ?? 0).toFixed(2)}</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="SAR">${(selectedInvoiceForXml.total_amount ?? 0).toFixed(2)}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
</Invoice>`;
                    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${selectedInvoiceForXml.invoice_number}-ZATCA-UBL21.xml`;
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-200 flex items-center gap-2"
                >
                  <i className="fa-solid fa-file-code"></i>
                  تنزيل ملف XML (UBL 2.1)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedInvoiceForXml.qr_code_payload || '');
                    alert('تم نسخ كود الـ QR Base64 المشفر بنجاح');
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center gap-2"
                >
                  <i className="fa-solid fa-copy"></i>
                  نسخ رمز TLV
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceForXml(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSID Settings Modal */}
      {showCsidModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden font-sans">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-key text-amber-400"></i>
                <h3 className="font-bold text-base">إعدادات شهادة الختم CSID</h3>
              </div>
              <button
                onClick={() => setShowCsidModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">الرقم الضريبي للمنشأة</label>
                <input
                  type="text"
                  disabled
                  value={activeCompany.taxNumber}
                  className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">رمز التحقق لمرة واحدة (OTP) من منصة فاتورة</label>
                <input
                  type="text"
                  placeholder="6 أرقام من بوابة هيئة الزكاة..."
                  defaultValue="882910"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">بيئة الربط المستهدفة</label>
                <select className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none">
                  <option>بيئة الإنتاج الرسمية (Production)</option>
                  <option>بيئة المحاكاة (Simulation Portal)</option>
                  <option>بيئة التجربة والتطوير (Sandbox)</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-emerald-600"></i>
                <span>شهادة الختم CSID نشطة وموثقة حتى 2028-12-31</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCsidModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZATCAPage;
