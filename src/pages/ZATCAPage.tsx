import React, { useState } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';

interface SharedInvoice {
  id: string;
  invoice_number: string;
  client_name: string;
  invoice_type: 'B2B (فاتورة ضريبية)' | 'B2C (مبسطة)';
  amount: number;
  tax: number;
  zatca_status: 'تمت المشاركة (Clearance)' | 'تم إبلاغ الهيئة (Reported)' | 'معلق' | 'مرفوض';
  uuid: string;
  hash: string;
  created_at: string;
}

const INITIAL_INVOICES: SharedInvoice[] = [
  { id: '1', invoice_number: 'SAF-INV-Z-2026-001', client_name: 'بندر صالح الهويريني', invoice_type: 'B2B (فاتورة ضريبية)', amount: 13800.00, tax: 1800.00, zatca_status: 'تمت المشاركة (Clearance)', uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', created_at: '2026-08-10 10:23' },
  { id: '2', invoice_number: 'SAF-INV-Z-2026-002', client_name: 'شركة دار الرواد للمقاولات', invoice_type: 'B2B (فاتورة ضريبية)', amount: 28750.00, tax: 3750.00, zatca_status: 'تمت المشاركة (Clearance)', uuid: 'b2c3d4e5-f6a7-8901-bcde-f23456789012', hash: '8743b52063cd84097a65d1633f5c74f5', created_at: '2026-08-11 14:15' },
  { id: '3', invoice_number: 'SAF-INV-Z-2026-003', client_name: 'سارة أحمد محمد', invoice_type: 'B2C (مبسطة)', amount: 3450.00, tax: 450.00, zatca_status: 'تم إبلاغ الهيئة (Reported)', uuid: 'c3d4e5f6-a7b8-9012-cdef-345678901234', hash: '9f86d081884c7d659a2feaa0c55ad015', created_at: '2026-08-12 09:40' }
];

export const ZATCAPage: React.FC = () => {
  const [invoices, setInvoices] = useState<SharedInvoice[]>(INITIAL_INVOICES);
  const [showCsidModal, setShowCsidModal] = useState(false);
  const [selectedInvoiceForXml, setSelectedInvoiceForXml] = useState<SharedInvoice | null>(null);

  const [csidForm, setCsidForm] = useState({
    vatNumber: '310928374100003',
    deviceOtp: '123456',
    environment: 'PRODUCTION' as 'SANDBOX' | 'SIMULATION' | 'PRODUCTION'
  });

  const columns: Column<SharedInvoice>[] = [
    { header: 'رقم الفاتورة الضريبية', accessor: (row) => <span style={{ fontWeight: '800', fontFamily: 'monospace', color: 'var(--odoo-purple)' }}>{row.invoice_number}</span> },
    { header: 'اسم العميل المفلتر', accessor: (row) => <span style={{ fontWeight: '700' }}>{row.client_name}</span> },
    { header: 'نوع الفاتورة', accessor: (row) => <Badge text={row.invoice_type} type="purple" /> },
    { header: 'المبلغ الإجمالي شامل الضريبة', accessor: (row) => <span style={{ fontWeight: '800' }}>{row.amount.toLocaleString()} ر.س</span> },
    { header: 'ضريبة (15%)', accessor: (row) => <span style={{ color: 'var(--status-warning)', fontWeight: '700' }}>{row.tax.toLocaleString()} ر.س</span> },
    { header: 'حالة الربط مع ZATCA', accessor: (row) => <Badge text={row.zatca_status} type="success" icon="fa-solid fa-qrcode" /> },
    { header: 'الرمز الفريد UUID', accessor: (row) => <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-muted)' }}>{row.uuid.slice(0, 16)}...</span> },
    {
      header: 'معاينة وفحص',
      accessor: (row) => (
        <button
          className="btn-odoo btn-odoo-purple"
          style={{ padding: '4px 8px', fontSize: '11.5px' }}
          onClick={() => setSelectedInvoiceForXml(row)}
        >
          <i className="fa-solid fa-code ml-1"></i> XML & QR
        </button>
      )
    }
  ];

  return (
    <div>
      {/* Top Banner Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Cairo, sans-serif' }}>
            <i className="fa-solid fa-qrcode text-purple ml-2"></i> هيئة الزكاة والضريبة والجمارك (ZATCA Integration Phase 2 Engine)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            إدارة الفواتير الإلكترونية المعتمدة، الختم التشفيري (CSID Onboarding)، وربط الفواتير المعتمدة بالتأشير
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn-odoo btn-odoo-purple" onClick={() => setShowCsidModal(true)}>
            <i className="fa-solid fa-key ml-1"></i> إعدادات الختم CSID
          </button>
          <button className="btn-odoo btn-odoo-primary" onClick={() => exportData('journals', invoices, 'excel')} title="تصدير Excel">
            <i className="fa-solid fa-file-excel ml-1"></i> Excel
          </button>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('journals', invoices, 'pdf')} title="تصدير PDF">
            <i className="fa-solid fa-file-pdf text-danger ml-1"></i> PDF
          </button>
        </div>
      </div>

      {/* ZATCA Status Banner */}
      <div style={{ background: 'linear-gradient(135deg, #005154 0%, #00A09D 100%)', borderRadius: '12px', padding: '18px 24px', color: 'white', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', opacity: 0.9 }}>حالة الربط المباشر ببيئة الإنتاج (Phase 2 Portal)</div>
          <h3 style={{ fontSize: '18px', fontWeight: '900', margin: '4px 0 0 0' }}>الرقم الضريبي الموحد: 310928374100003 • الختم CSID نشط وموثق</h3>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Badge text="مطابق معيار ZATCA UBL 2.1" type="success" />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={invoices}
        searchPlaceholder="ابحث برقم الفاتورة، اسم العميل، أو الـ UUID..."
      />

      {/* CSID Settings Modal */}
      {showCsidModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="table-card" style={{ width: '500px', padding: '24px', background: 'white', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154' }}>إعداد الختم التشفيري (CSID Onboarding)</h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setShowCsidModal(false)}></i>
            </div>

            <div className="filter-group" style={{ marginBottom: '12px' }}>
              <label className="filter-label">الرقم الضريبي للمنشأة (VAT Number) *</label>
              <input
                type="text"
                className="filter-input"
                value={csidForm.vatNumber}
                onChange={e => setCsidForm({ ...csidForm, vatNumber: e.target.value })}
              />
            </div>

            <div className="filter-group" style={{ marginBottom: '12px' }}>
              <label className="filter-label">رمز التحقق OTP الخاص بالجهاز (من بوابة فاتورة) *</label>
              <input
                type="text"
                className="filter-input"
                value={csidForm.deviceOtp}
                onChange={e => setCsidForm({ ...csidForm, deviceOtp: e.target.value })}
              />
            </div>

            <div className="filter-group" style={{ marginBottom: '16px' }}>
              <label className="filter-label">بيئة الربط (Environment) *</label>
              <select
                className="filter-select"
                value={csidForm.environment}
                onChange={e => setCsidForm({ ...csidForm, environment: e.target.value as any })}
              >
                <option value="PRODUCTION">البيئة الفعلية (Production Phase 2)</option>
                <option value="SIMULATION">بيئة المحاكاة والاختبار (Simulation)</option>
                <option value="SANDBOX">بيئة المطوّرين (Developer Sandbox)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-odoo btn-odoo-secondary" onClick={() => setShowCsidModal(false)}>إلغاء</button>
              <button type="button" className="btn-odoo btn-odoo-purple" onClick={() => setShowCsidModal(false)}>توليد وتوثيق الختم التشفيري</button>
            </div>
          </div>
        </div>
      )}

      {/* XML & QR Code Preview Modal */}
      {selectedInvoiceForXml && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="table-card" style={{ width: '640px', maxWidth: '95%', padding: '24px', background: 'white', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154', margin: 0 }}>
                <i className="fa-solid fa-qrcode ml-2 text-purple"></i> معاينة ZATCA XML & QR Code ({selectedInvoiceForXml.invoice_number})
              </h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setSelectedInvoiceForXml(null)}></i>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <i className="fa-solid fa-qrcode" style={{ fontSize: '72px', color: '#005154' }}></i>
                <div style={{ fontSize: '11px', marginTop: '8px', fontWeight: '700', color: 'var(--text-muted)' }}>TLV QR Base64</div>
              </div>
              <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
                <div><strong>UUID:</strong> <code style={{ color: '#005154' }}>{selectedInvoiceForXml.uuid}</code></div>
                <div><strong>SHA-256 Hash:</strong> <code style={{ fontSize: '11px' }}>{selectedInvoiceForXml.hash}</code></div>
                <div><strong>العميل:</strong> {selectedInvoiceForXml.client_name}</div>
                <div><strong>المبلغ الإجمالي:</strong> {selectedInvoiceForXml.amount.toLocaleString()} ر.س (شامل 15% VAT)</div>
              </div>
            </div>

            <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#714B67', marginBottom: '8px' }}>ملف الفاتورة الموقعة ZATCA UBL 2.1 XML:</h4>
            <pre style={{ background: '#1E293B', color: '#38BDF8', padding: '12px', borderRadius: '8px', fontSize: '11px', maxHeight: '160px', overflowY: 'auto', direction: 'ltr', textAlign: 'left' }}>
{`<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">
  <cbc:ProfileID>reporting:1.0</cbc:ProfileID>
  <cbc:ID>${selectedInvoiceForXml.invoice_number}</cbc:ID>
  <cbc:UUID>${selectedInvoiceForXml.uuid}</cbc:UUID>
  <cbc:IssueDate>${selectedInvoiceForXml.created_at.slice(0, 10)}</cbc:IssueDate>
  <cac:AccountingSupplierParty>
    <cac:PartyTaxScheme><cbc:CompanyID>310928374100003</cbc:CompanyID></cac:PartyTaxScheme>
  </cac:AccountingSupplierParty>
  <cac:LegalMonetaryTotal>
    <cbc:PayableAmount currencyID="SAR">${selectedInvoiceForXml.amount}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
</Invoice>`}
            </pre>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button className="btn-odoo btn-odoo-secondary" onClick={() => setSelectedInvoiceForXml(null)}>إغلاق</button>
              <button className="btn-odoo btn-odoo-purple" onClick={() => alert('تم تنزيل ملف XML الموثق بنجاح!')}>
                <i className="fa-solid fa-download ml-1"></i> تحميل XML الموثق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZATCAPage;
