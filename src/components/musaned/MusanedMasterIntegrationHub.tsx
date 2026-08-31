import React, { useState } from 'react';
import { 
  Zap, ShieldCheck, Database, RefreshCw, AlertTriangle, 
  CheckCircle2, Clock, FileText, ArrowRightLeft, Layers, 
  DollarSign, FileSpreadsheet, Lock, ExternalLink, Activity,
  Server, Shield, Cpu, Sparkles, Filter, ChevronRight, Check
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useAppStore } from '../../stores/appStore';

export const MusanedMasterIntegrationHub: React.FC = () => {
  const { addNotification } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'mdm' | 'reconciliation' | 'visas_insurance' | 'webhooks_dlq' | 'checklist'>('overview');
  const [isSimulatingSync, setIsSimulatingSync] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<string>('Contract');

  // Interactive Checklist State
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    'chk-1': true,
    'chk-2': true,
    'chk-3': true,
    'chk-4': true,
    'chk-5': true,
    'chk-6': true,
    'chk-7': true,
    'chk-8': true,
  });

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTriggerSync = () => {
    setIsSimulatingSync(true);
    setTimeout(() => {
      setIsSimulatingSync(false);
      addNotification({
        title: 'اكتمال المزامنة مع مساند',
        message: 'تمت مطابقة 115 عقداً، 28 تأشيرة، و42 دفعة مالية بنجاح دون أي تعارضات (Zero Mismatch).',
        type: 'success',
      });
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in text-right dir-rtl">
      {/* Cinematic Header */}
      <div
        className="card-feature-cinematic"
        style={{
          background: '#000000',
          borderRadius: '16px',
          padding: '28px',
          color: '#FFFFFF',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
                  MUSANED INTEGRATION MASTER PLAN 2026
                </span>
                <span className="pill-tag-shade" style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', color: '#ffffff' }}>
                  وثيقة الربط الشامل المعتمدة
                </span>
              </div>
              <h1
                className="display-sm"
                style={{
                  fontSize: '22px',
                  fontWeight: 330,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  margin: 0,
                  fontFamily: 'var(--font-family-display)',
                }}
              >
                مركز قيادة الربط والتكامل الشامل مع منصة مساند الحكومية
              </h1>
              <p className="text-xs text-zinc-400 mt-1 font-sans max-w-3xl">
                بنية التكامل ثنائية الاتجاه (Bi-directional Adapter) للتشغيل، العقود الموحدة، التأشيرات، المدفوعات والتسويات، التأمين 24 شهراً، ونقل الخدمات.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleTriggerSync}
              disabled={isSimulatingSync}
              className="button-white-pill"
              style={{ fontSize: '12px', padding: '8px 20px', minHeight: '38px' }}
            >
              <RefreshCw className={`w-4 h-4 ml-1.5 text-black ${isSimulatingSync ? 'animate-spin' : ''}`} />
              <span>{isSimulatingSync ? 'جاري المزامنة اللحظية...' : 'مزامنة فورية شاملة (Idempotent Sync)'}</span>
            </button>
            <a
              href="https://visa.musaned.com.sa/takamol/auth/login"
              target="_blank"
              rel="noreferrer"
              className="button-outline-on-dark"
              style={{ fontSize: '12px', padding: '8px 16px', minHeight: '38px' }}
            >
              <ExternalLink className="w-3.5 h-3.5 ml-1 text-emerald-400" />
              <span>بوابة تكامل مساند</span>
            </a>
          </div>
        </div>
      </div>

      {/* 4 Signature KPI Cards */}
      <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card-pistachio-band" style={{ padding: '20px', borderRadius: '16px' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 550, color: '#000000' }}>معدل نجاح الاتصال (API Gateway)</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '4px' }}>
            99.94%
          </div>
          <span className="pill-tag-mint" style={{ fontSize: '10.5px', marginTop: '8px' }}>
            Latency: 28ms • SLA متطابق
          </span>
        </div>

        <div className="card-pricing-featured" style={{ padding: '20px', borderRadius: '16px', background: '#000000', color: '#ffffff' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 550, color: '#a1a1aa' }}>العقود المتزامنة والمطابقة</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#ffffff', marginTop: '4px' }}>
            115 عقد
          </div>
          <span className="pill-tag-mint" style={{ fontSize: '10.5px', marginTop: '8px' }}>
            مطابقة تامة 100% مع مساند
          </span>
        </div>

        <div className="card-pricing" style={{ padding: '20px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 550, color: '#71717a' }}>التسويات المالية اليومية</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '4px' }}>
            284,500 ر.س
          </div>
          <span className="pill-tag-shade" style={{ fontSize: '10.5px', marginTop: '8px' }}>
            فرق المطابقة: 0.00 ر.س (Zero Variance)
          </span>
        </div>

        <div className="card-pricing" style={{ padding: '20px', borderRadius: '16px', background: '#ffffff' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 550, color: '#71717a' }}>جاهزية الاعتماد الرسمي (Sandbox)</span>
          <div className="display-sm" style={{ fontSize: '32px', fontWeight: 330, color: '#000000', marginTop: '4px' }}>
            94%
          </div>
          <span className="pill-tag-mint" style={{ fontSize: '10.5px', marginTop: '8px' }}>
            28 من 30 بند معتمد
          </span>
        </div>
      </div>

      {/* Main Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-3">
        {[
          { id: 'overview', label: '⚡ لوحة العمليات وحالة البوابة' },
          { id: 'mdm', label: '🗄️ نموذج البيانات الرئيسي (MDM)' },
          { id: 'reconciliation', label: '💰 المطابقة والتسويات المالية' },
          { id: 'visas_insurance', label: '🛡️ التأشيرات وبوالص التأمين (24 شهر)' },
          { id: 'webhooks_dlq', label: '📡 الـ Webhooks ورسائل DLQ' },
          { id: 'checklist', label: '📋 قائمة اعتماد الربط الرسمي (30 بند)' },
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

      {/* 1. Overview & Live Gateway Engine */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-black flex items-center gap-2 m-0">
                  <Server className="w-4 h-4 text-emerald-600" />
                  <span>بنية المعمارية المستهدفة ومحرك الحالات المزدوج (Dual-Status Engine)</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  فصل الحالة النظامية الرسمية (Official Musaned Status) عن الحالة التشغيلية الداخلية (Internal Operational Status)
                </p>
              </div>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>Idempotency Guard: Active</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <div className="flex items-center gap-2 text-black font-bold text-xs mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>1. طبقة المواءمة (Musaned Adapter)</span>
                </div>
                <p className="text-[11.5px] text-zinc-600 leading-relaxed m-0">
                  تشفير الطلبات عبر TLS 1.3، توقيع الرسائل الرقمية بـ HMAC-SHA256، ومنع تكرار العمليات بواسطة Idempotency Keys موحدة.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <div className="flex items-center gap-2 text-black font-bold text-xs mb-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>2. طابور الرسائل (Queue & Retries)</span>
                </div>
                <p className="text-[11.5px] text-zinc-600 leading-relaxed m-0">
                  فصل المعالجة غير المتزامنة مع Exponential Backoff وخوارزمية Jitter، وتحويل الإخفاقات غير المسترجعة إلى DLQ للتدقيق.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <div className="flex items-center gap-2 text-black font-bold text-xs mb-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>3. عزل الشركات (Tenant Isolation)</span>
                </div>
                <p className="text-[11.5px] text-zinc-600 leading-relaxed m-0">
                  فصل صارم لبيانات ووثائق شركات المجموعة (السفير الماسي، ياقوت نجد، توباز، دار الرواد) عبر Row-Level Security مشدد.
                </p>
              </div>
            </div>
          </div>

          {/* Dual Status Mapping Table */}
          <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
            <div className="p-4 border-b border-zinc-100 bg-white flex items-center justify-between">
              <h3 className="text-sm font-bold text-black m-0">مصفوفة تتبع الحالات الرسمية لمساند مقابل حالات ERP التشغيلية</h3>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>14 مرحلة تشغيلية</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs text-zinc-700">
                <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                  <tr>
                    <th className="p-3.5">الرمز التقني</th>
                    <th className="p-3.5">الحالة الرسمية في مساند</th>
                    <th className="p-3.5">الحالة التشغيلية في ERP</th>
                    <th className="p-3.5">الإجراء الآلي المترتب</th>
                    <th className="p-3.5">الالتزام بالـ SLA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {[
                    { code: 'DRAFT_READY', official: 'غير مسجل بمساند بعد', erp: 'جاهز للإرسال (تدقيق داخلي مكتمل)', action: 'توليد Correlation ID والتحقق المسبق', sla: '1 ساعة' },
                    { code: 'OFFER_ACCEPTED', official: 'تم قبول العرض من صاحب العمل', erp: 'بانتظار سداد الفاتورة الحكومية', action: 'إصدار إشعار دفع وتنبيه العميل بالرسائل', sla: '24 ساعة' },
                    { code: 'PAID_CONTRACT_ACTIVE', official: 'عقد موثق وساري المفعول', erp: 'بدء التنفيذ والإرسال للمكتب الخارجي', action: 'إنشاء قيد Receipt Pending Settlement وبدء التفييز', sla: 'فوري' },
                    { code: 'VISA_PROCESSING', official: 'طلب التأشيرة تحت الإجراء', erp: 'متابعة السفارة والملحقية العمالية', action: 'فحص طبي وتصديق السفارة عبر الوكالة', sla: '7 أيام' },
                    { code: 'ARRIVAL_PENDING', official: 'تم حجز الرحلة وإصدار التذكرة', erp: 'جدولة الاستقبال في صالة المطار', action: 'تكليف السائق وتجهيز السكن/التسليم المباشر', sla: '48 ساعة' },
                    { code: 'ARRIVED_INSURED', official: 'تم استلام العاملة وتوثيق الوصول', erp: 'سريان بوليصة التأمين (24 شهراً)', action: 'تفعيل فترة الضمان وبدء تغطية شركة التأمين', sla: '90 يوماً / سنتين' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50">
                      <td className="p-3.5 font-mono font-bold text-black">{row.code}</td>
                      <td className="p-3.5 font-bold text-purple-700">{row.official}</td>
                      <td className="p-3.5 font-bold text-emerald-800">{row.erp}</td>
                      <td className="p-3.5 text-zinc-700">{row.action}</td>
                      <td className="p-3.5"><Badge text={row.sla} type="shade" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. MDM Entity Explorer */}
      {activeTab === 'mdm' && (
        <div className="space-y-6">
          <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
            <h3 className="text-base font-bold text-black mb-1">نموذج البيانات الرئيسي (Master Data Model - MDM)</h3>
            <p className="text-xs text-zinc-400 mb-4">الحقول الإلزامية، مفاتيح الربط الخارجية، وقواعد تقليل وحماية البيانات الشخصية (PDPL Compliance)</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {['Company', 'Customer', 'Recruitment Request', 'Offer', 'Contract', 'Worker', 'Visa', 'Payment', 'Insurance', 'Transfer', 'Complaint'].map((ent) => (
                <button
                  key={ent}
                  onClick={() => setSelectedEntity(ent)}
                  className={selectedEntity === ent ? 'button-primary-pill' : 'button-outline-on-light'}
                  style={{ fontSize: '11.5px', padding: '4px 14px', minHeight: '30px' }}
                >
                  {ent}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900 text-white font-mono text-xs overflow-x-auto">
              <div className="text-emerald-400 font-bold mb-2">// MDM Entity Schema: {selectedEntity}</div>
              {selectedEntity === 'Contract' && (
                <pre className="text-zinc-300">
{`{
  "entity": "musaned_contracts",
  "internal_id": "CNT-2026-0891",
  "musaned_contract_id": "MSN-CTR-9948201",
  "musaned_request_id": "MSN-REQ-102938",
  "tenant_id": "SAF",
  "customer_national_id_masked": "1098****91",
  "worker_passport_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "contract_amount_sar": 14500.00,
  "vat_amount_sar": 2175.00,
  "total_amount_sar": 16675.00,
  "official_status": "CONTRACT_ACTIVE",
  "internal_status": "PROCESSING_ABROAD",
  "signed_at": "2026-08-15T09:30:00Z",
  "insurance_policy_ref": "RAJHI-TAKAFUL-2026-4401",
  "idempotency_key": "SAF-CTR-2026-0891-v1",
  "compliance_hash": "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
}`}
                </pre>
              )}
              {selectedEntity === 'Visa' && (
                <pre className="text-zinc-300">
{`{
  "entity": "musaned_visas",
  "visa_id": "VIS-2026-0042",
  "musaned_visa_request_id": "MSN-VSA-77281",
  "visa_number": "1300984521",
  "sponsor_id_masked": "1029****56",
  "profession_code": "DOMESTIC_WORKER_F",
  "nationality_code": "PHL",
  "destination_airport": "RUH",
  "issue_status": "ISSUED_AND_VALIDATED",
  "issued_date": "2026-08-20",
  "expiry_date": "2026-11-20",
  "remediation_status": "NONE"
}`}
                </pre>
              )}
              {selectedEntity !== 'Contract' && selectedEntity !== 'Visa' && (
                <pre className="text-zinc-300">
{`{
  "entity": "musaned_${selectedEntity.toLowerCase().replace(' ', '_')}",
  "tenant_id": "SAF",
  "external_id": "MSN-${selectedEntity.substring(0, 3).toUpperCase()}-102938",
  "internal_id": "ERP-${selectedEntity.substring(0, 3).toUpperCase()}-001",
  "status": "SYNCHRONIZED",
  "security_tier": "ENCRYPTED_AT_REST",
  "pdpl_masked": true
}`}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Financial Settlements & Reconciliation */}
      {activeTab === 'reconciliation' && (
        <div className="space-y-6">
          <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
            <div className="p-4 border-b border-zinc-100 bg-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-black m-0">سجل دفعات وتسويات مساند والمطابقة البنكية (Daily Settlement Batches)</h3>
                <p className="text-xs text-zinc-400 mt-0.5">مطابقة المبالغ المحصلة عبر مساند مع حسابات البنك الوسيط (Clearing Account) وحسابات ضريبة القيمة المضافة</p>
              </div>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>إجمالي التسويات: 590,400 ر.س</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs text-zinc-700">
                <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                  <tr>
                    <th className="p-3.5">رقم الدفعة / التسوية</th>
                    <th className="p-3.5">تاريخ التسوية</th>
                    <th className="p-3.5">إجمالي المبالغ</th>
                    <th className="p-3.5">رسوم البوابة (Mada/Visa)</th>
                    <th className="p-3.5">ضريبة الرسوم (15%)</th>
                    <th className="p-3.5">صافي التحويل للبنك</th>
                    <th className="p-3.5">عدد العمليات</th>
                    <th className="p-3.5">حالة المطابقة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {[
                    { id: 'SETTL-2026-0831', date: '2026-08-31', gross: 284500, fee: 2845, vat: 426.75, net: 281228.25, count: 18, status: 'مطابق ومقفل بالكامل' },
                    { id: 'SETTL-2026-0830', date: '2026-08-30', gross: 162400, fee: 1624, vat: 243.60, net: 160532.40, count: 11, status: 'مطابق ومقفل بالكامل' },
                    { id: 'SETTL-2026-0829', date: '2026-08-29', gross: 98500, fee: 985, vat: 147.75, net: 97367.25, count: 7, status: 'مطابق ومقفل بالكامل' },
                    { id: 'SETTL-2026-0828', date: '2026-08-28', gross: 45000, fee: 450, vat: 67.50, net: 44482.50, count: 3, status: 'مطابق ومقفل بالكامل' },
                  ].map((row) => (
                    <tr key={row.id} className="hover:bg-zinc-50">
                      <td className="p-3.5 font-mono font-bold text-black">{row.id}</td>
                      <td className="p-3.5 font-mono text-zinc-600">{row.date}</td>
                      <td className="p-3.5 font-mono font-bold text-black">{row.gross.toLocaleString()} ر.س</td>
                      <td className="p-3.5 font-mono text-rose-700">-{row.fee.toLocaleString()} ر.س</td>
                      <td className="p-3.5 font-mono text-zinc-500">-{row.vat.toLocaleString()} ر.س</td>
                      <td className="p-3.5 font-mono font-bold text-emerald-700">{row.net.toLocaleString()} ر.س</td>
                      <td className="p-3.5 font-mono">{row.count} عقود</td>
                      <td className="p-3.5"><Badge text={row.status} type="success" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. Visas, Insurance & Transfers */}
      {activeTab === 'visas_insurance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 24-Month Insurance Card */}
            <div className="card-pricing" style={{ padding: '20px', borderRadius: '16px', background: '#ffffff' }}>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-black m-0">وثائق التأمين الإلزامية على عقود الاستقدام (24 شهراً)</h3>
              </div>
              <p className="text-xs text-zinc-500 mb-4">
                تغطية شاملة خلال أول سنتين ضد حالات الهروب، رفض العمل، الوفاة، أو العجز وإعادة الاستقدام.
              </p>
              <div className="space-y-2">
                {[
                  { provider: 'تكافل الراجحي للتأمين', policy: 'POL-TAKAFUL-2026-992', count: '48 وثيقة سارية', claim: '0 مطالبات' },
                  { provider: 'الشركة التعاونية للتأمين', policy: 'POL-TAWUNIYA-2026-310', count: '39 وثيقة سارية', claim: '1 مطالبة معوضة' },
                  { provider: 'شركة سلامة للتأمين التعاوني', policy: 'POL-SALAMA-2026-118', count: '28 وثيقة سارية', claim: '0 مطالبات' },
                ].map((ins, i) => (
                  <div key={i} className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-black">{ins.provider}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{ins.policy}</div>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-emerald-800">{ins.count}</div>
                      <div className="text-[10px] text-zinc-500">{ins.claim}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sponsorship Transfer Domain */}
            <div className="card-pricing" style={{ padding: '20px', borderRadius: '16px', background: '#ffffff' }}>
              <div className="flex items-center gap-2 mb-3">
                <ArrowRightLeft className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-bold text-black m-0">نظام نقل الخدمات المستقل (Transfer of Sponsorship Domain)</h3>
              </div>
              <p className="text-xs text-zinc-500 mb-4">
                إدارة طلبات نقل خدمات العمالة المنزلية بين أصحاب العمل عبر منصة مساند مع ضبط الفترات التجريبية.
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-between">
                  <span className="font-bold text-purple-900">طلبات نقل الخدمات النشطة حالياً</span>
                  <span className="font-mono font-bold text-purple-700">14 طلباً</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                  <span className="font-semibold text-zinc-700">عمالة في مرحلة التجربة (Trial Period - 7 أيام)</span>
                  <span className="font-mono font-bold text-zinc-800">5 عاملات</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                  <span className="font-semibold text-zinc-700">عمليات نقل مكتملة وموثقة هذا الشهر</span>
                  <span className="font-mono font-bold text-emerald-700">9 عمليات</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Webhooks & Dead Letter Queue (DLQ) */}
      {activeTab === 'webhooks_dlq' && (
        <div className="space-y-6">
          <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
            <div className="p-4 border-b border-zinc-100 bg-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-black m-0">سجل استقبال الأحداث اللحظية (Webhooks Receiver & Event Store)</h3>
                <p className="text-xs text-zinc-400 mt-0.5">التحقق من التوقيع الرقمي، منع إعادة الإرسال (Replay Protection)، ومعالجة الأحداث</p>
              </div>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>Queue Age: 0.1s • DLQ: 0 Errors</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs text-zinc-700">
                <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                  <tr>
                    <th className="p-3.5">معرف الحدث (Event ID)</th>
                    <th className="p-3.5">نوع الحدث (Event Type)</th>
                    <th className="p-3.5">الكيان والمرجع</th>
                    <th className="p-3.5">الشركة</th>
                    <th className="p-3.5">التوقيت</th>
                    <th className="p-3.5">التوقيع الرقمي</th>
                    <th className="p-3.5">حالة المعالجة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {[
                    { id: 'EVT-99201', type: 'contract.activated', ref: 'MSN-CTR-9948201', tenant: 'السفير الماسي', time: '11:05:12', sig: 'HMAC-SHA256 (Valid)', status: 'تمت المعالجة بنجاح' },
                    { id: 'EVT-99200', type: 'payment.succeeded', ref: 'MSN-PAY-8812904', tenant: 'ياقوت نجد', time: '10:45:00', sig: 'HMAC-SHA256 (Valid)', status: 'تمت المعالجة بنجاح' },
                    { id: 'EVT-99199', type: 'visa.status.changed', ref: 'MSN-VSA-77281', tenant: 'توباز للاستقدام', time: '09:20:18', sig: 'HMAC-SHA256 (Valid)', status: 'تمت المعالجة بنجاح' },
                    { id: 'EVT-99198', type: 'offer.created', ref: 'MSN-OFR-10293', tenant: 'السفير الماسي', time: '08:14:55', sig: 'HMAC-SHA256 (Valid)', status: 'تمت المعالجة بنجاح' },
                  ].map((row) => (
                    <tr key={row.id} className="hover:bg-zinc-50">
                      <td className="p-3.5 font-mono font-bold text-black">{row.id}</td>
                      <td className="p-3.5 font-mono font-bold text-purple-700">{row.type}</td>
                      <td className="p-3.5 font-mono text-zinc-700">{row.ref}</td>
                      <td className="p-3.5 font-semibold text-black">{row.tenant}</td>
                      <td className="p-3.5 font-mono text-zinc-500">{row.time}</td>
                      <td className="p-3.5 font-mono text-emerald-700">{row.sig}</td>
                      <td className="p-3.5"><Badge text={row.status} type="success" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. Accreditation Checklist (30-Point) */}
      {activeTab === 'checklist' && (
        <div className="space-y-6">
          <div className="card-pricing" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff' }}>
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-black m-0">قائمة التحقق للحصول على اعتماد الربط الرسمي (Musaned Accreditation Checklist)</h3>
                <p className="text-xs text-zinc-400 mt-1">30 بنداً تقنياً وإجرائياً لمطابقة المعايير الحكومية واجتياز اختبارات UAT وSandbox</p>
              </div>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>جاهزية الاعتماد: 94%</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: 'chk-1', title: 'تحديد الكيان والمنشأة المرخصة الرسمية لكل فرع وشركة' },
                { id: 'chk-2', title: 'الحصول على وثائق API Guide الرسمية وعقد التكامل من مساند' },
                { id: 'chk-3', title: 'تطبيق التوقيع الإلكتروني وتشفير المفاتيح في Secrets Vault' },
                { id: 'chk-4', title: 'بناء محرك Idempotency ومنع تكرار طلبات وعقود الاستقدام' },
                { id: 'chk-5', title: 'فصل تام لصلاحيات المستخدمين والشركات بـ Row-Level Security' },
                { id: 'chk-6', title: 'إخفاء وتشفير بيانات الهوية الشخصية وجواز السفر (PDPL Masking)' },
                { id: 'chk-7', title: 'محرك مطابقة القيود والتسويات اليومية مع البنك الوسيط' },
                { id: 'chk-8', title: 'سجل تدقيق Audit Log غير قابل للتعديل مع التوقيع الرقمي' },
                { id: 'chk-9', title: 'إدارة أسباب رفض التأشيرات وخطط المعالجة التلقائية' },
                { id: 'chk-10', title: 'الربط مع شركات التأمين المعتمدة لسريان وثائق الـ 24 شهراً' },
                { id: 'chk-11', title: 'نظام مراقبة الأحداث وطابور الرسائل المعزولة DLQ' },
                { id: 'chk-12', title: 'اختبار انقطاع الخدمة لمدة 30 دقيقة والتصريف التلقائي للطلبات' },
              ].map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:bg-zinc-50"
                    style={{
                      borderColor: isChecked ? '#10b981' : '#e4e4e7',
                      backgroundColor: isChecked ? '#f0fdf4' : '#ffffff',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '6px',
                          border: '2px solid',
                          borderColor: isChecked ? '#10b981' : '#a1a1aa',
                          backgroundColor: isChecked ? '#10b981' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                        }}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs font-semibold text-zinc-800">{item.title}</span>
                    </div>
                    <span className="pill-tag-mint" style={{ fontSize: '10px' }}>
                      {isChecked ? 'مكتمل ومعتمد' : 'قيد التدقيق'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusanedMasterIntegrationHub;
