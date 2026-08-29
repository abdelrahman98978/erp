import React, { useState, useMemo } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';
import { useCompany } from '../contexts/CompanyContext';
import { useAppStore } from '../stores/appStore';
import { tafqeet } from '../services/tafqeetService';
import { computeTenderKPIs, DEFAULT_SUPPLIERS, SupplierRecord } from '../services/tenderAnalyticsService';
import { 
  Building2, Plus, FileSpreadsheet, FileText, Search, Printer, 
  Trash2, Edit3, CheckCircle2, AlertCircle, TrendingUp, DollarSign,
  Download, Eye, Calculator, ArrowRightLeft, Sparkles, Layers, 
  ShieldCheck, X, RefreshCw, Landmark, Tag, Check, Award, BarChart3,
  Users, Star, MapPin, Phone, Mail, PieChart, Activity
} from 'lucide-react';

export interface BOQItem {
  id: string;
  itemNumber: number;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  unitPriceInWords: string;
  totalPrice: number;
  totalPriceInWords: string;
  vat: number;
  totalWithVat: number;
  totalWithVatInWords: string;
}

export interface TenderRecord {
  id: string;
  referenceNumber: string;
  title: string;
  entityName: string;
  clientName: string;
  category: 'احتفالات ومواسم وطنية' | 'توريدات حكومية وتجهيزات' | 'معارض ومؤتمرات' | 'تقنية واتصالات';
  status: 'ترسية واعتماد' | 'مقدمة ومسعرة' | 'مسودة قيد الدراسة' | 'مكتملة ومفوترة';
  submissionDate: string;
  supplyDuration: string;
  commitmentDays: number;
  itemsCount: number;
  subtotal: number;
  subtotalInWords: string;
  vatAmount: number;
  vatInWords: string;
  grandTotal: number;
  grandTotalInWords: string;
  items: BOQItem[];
}

const DEFAULT_MOCK_TENDERS: TenderRecord[] = [
  {
    id: 'TND-2026-001',
    referenceNumber: '260839005291',
    title: 'احتفالية اليوم الوطني السعودي (96) لميناء جدة الإسلامي',
    entityName: 'مؤسسة خالد عبدالعزيز السليم للتجارة (شركة كاس للتجارة)',
    clientName: 'الهيئة العامة للموانئ - ميناء جدة الإسلامي',
    category: 'احتفالات ومواسم وطنية',
    status: 'ترسية واعتماد',
    submissionDate: '2026-08-15',
    supplyDuration: 'خلال 7 أيام من استلام التعميد',
    commitmentDays: 180,
    itemsCount: 8,
    subtotal: 82625.00,
    subtotalInWords: 'فقط اثنان وثمانون ألف وستمائة وخمسة وعشرون ريالاً سعودياً لا غير',
    vatAmount: 12393.75,
    vatInWords: 'فقط إثنى عشرة ألف وثلاثمائة وثلاثة وتسعون ريالاً سعودياً وخمسة وسبعون هللة لا غير',
    grandTotal: 95018.75,
    grandTotalInWords: 'فقط خمسة وتسعون ألف وثمانية عشر ريالاً سعودياً وخمسة وسبعون هللة لا غير',
    items: [
      {
        id: 'item-1',
        itemNumber: 1,
        description: 'بوكس توزيعات اليوم الوطني',
        unit: 'بوكس',
        quantity: 300,
        unitPrice: 95,
        unitPriceInWords: 'فقط خمسة وتسعون ريالاً سعودياً لا غير',
        totalPrice: 28500.00,
        totalPriceInWords: 'فقط ثمانية وعشرون ألف وخمسمائة ريالاً سعودياً لا غير',
        vat: 4275.00,
        totalWithVat: 32775.00,
        totalWithVatInWords: 'فقط اثنان وثلاثون ألف وسبعمائة وخمسة وسبعون ريالاً سعودياً لا غير',
      },
      {
        id: 'item-2',
        itemNumber: 2,
        description: 'تمر سكري فاخر',
        unit: 'كجم',
        quantity: 20,
        unitPrice: 155,
        unitPriceInWords: 'فقط مائة وخمسة وخمسون ريالاً سعودياً لا غير',
        totalPrice: 3100.00,
        totalPriceInWords: 'فقط ثلاثة آلاف ومائة ريالاً سعودياً لا غير',
        vat: 465.00,
        totalWithVat: 3565.00,
        totalWithVatInWords: 'فقط ثلاثة آلاف وخمسمائة وخمسة وستون ريالاً سعودياً لا غير',
      },
      {
        id: 'item-3',
        itemNumber: 3,
        description: 'القهوة العربية',
        unit: 'شخص',
        quantity: 300,
        unitPrice: 40,
        unitPriceInWords: 'فقط أربعون ريالاً سعودياً لا غير',
        totalPrice: 12000.00,
        totalPriceInWords: 'فقط إثنى عشرة ألف ريالاً سعودياً لا غير',
        vat: 1800.00,
        totalWithVat: 13800.00,
        totalWithVatInWords: 'فقط ثلاثة عشر ألف وثمانمائة ريالاً سعودياً لا غير',
      },
      {
        id: 'item-4',
        itemNumber: 4,
        description: 'مباشر الضيافة',
        unit: 'عدد',
        quantity: 6,
        unitPrice: 775,
        unitPriceInWords: 'فقط سبعمائة وخمسة وسبعون ريالاً سعودياً لا غير',
        totalPrice: 4650.00,
        totalPriceInWords: 'فقط أربعة آلاف وستمائة وخمسون ريالاً سعودياً لا غير',
        vat: 697.50,
        totalWithVat: 5347.50,
        totalWithVatInWords: 'فقط خمسة آلاف وثلاثمائة وسبعة وأربعون ريالاً سعودياً وخمسون هللة لا غير',
      },
      {
        id: 'item-5',
        itemNumber: 5,
        description: 'طباعة وتركيب استيكر مقاس backdrop 2.17*2.60',
        unit: 'عدد',
        quantity: 1,
        unitPrice: 3850,
        unitPriceInWords: 'فقط ثلاثة آلاف وثمانمائة وخمسون ريالاً سعودياً لا غير',
        totalPrice: 3850.00,
        totalPriceInWords: 'فقط ثلاثة آلاف وثمانمائة وخمسون ريالاً سعودياً لا غير',
        vat: 577.50,
        totalWithVat: 4427.50,
        totalWithVatInWords: 'فقط أربعة آلاف وأربعمائة وسبعة وعشرون ريالاً سعودياً وخمسون هللة لا غير',
      },
      {
        id: 'item-6',
        itemNumber: 6,
        description: 'طباعة استيكر باك دروب 3.66*2.40',
        unit: 'عدد',
        quantity: 1,
        unitPrice: 4650,
        unitPriceInWords: 'فقط أربعة آلاف وستمائة وخمسون ريالاً سعودياً لا غير',
        totalPrice: 4650.00,
        totalPriceInWords: 'فقط أربعة آلاف وستمائة وخمسون ريالاً سعودياً لا غير',
        vat: 697.50,
        totalWithVat: 5347.50,
        totalWithVatInWords: 'فقط خمسة آلاف وثلاثمائة وسبعة وأربعون ريالاً سعودياً وخمسون هللة لا غير',
      },
      {
        id: 'item-7',
        itemNumber: 7,
        description: 'فرقة عرضة نجدية (متطلبات الأداء والتجهيز والتنظيم)',
        unit: 'عدد',
        quantity: 1,
        unitPrice: 21500,
        unitPriceInWords: 'فقط واحد وعشرون ألف وخمسمائة ريالاً سعودياً لا غير',
        totalPrice: 21500.00,
        totalPriceInWords: 'فقط واحد وعشرون ألف وخمسمائة ريالاً سعودياً لا غير',
        vat: 3225.00,
        totalWithVat: 24725.00,
        totalWithVatInWords: 'فقط أربعة وعشرون ألف وسبعمائة وخمسة وعشرون ريالاً سعودياً لا غير',
      },
      {
        id: 'item-8',
        itemNumber: 8,
        description: 'طباعة استيكر أبواب المصاعد عرض 43*166*43 طول 43*212',
        unit: 'عدد',
        quantity: 5,
        unitPrice: 875,
        unitPriceInWords: 'فقط ثمانمائة وخمسة وسبعون ريالاً سعودياً لا غير',
        totalPrice: 4375.00,
        totalPriceInWords: 'فقط أربعة آلاف وثلاثمائة وخمسة وسبعون ريالاً سعودياً لا غير',
        vat: 656.25,
        totalWithVat: 5031.25,
        totalWithVatInWords: 'فقط خمسة آلاف وواحد وثلاثون ريالاً سعودياً وخمسة وعشرون هللة لا غير',
      },
    ]
  },
  {
    id: 'TND-2026-002',
    referenceNumber: '260839008717',
    title: 'تأمين مستلزمات الاحتفال باليوم الوطني لمبنى مديرية مكافحة المخدرات بمنطقة الرياض',
    entityName: 'مؤسسة خالد عبدالعزيز السليم للتجارة (شركة كاس للتجارة)',
    clientName: 'المديرية العامة لمكافحة المخدرات - منطقة الرياض',
    category: 'توريدات حكومية وتجهيزات',
    status: 'ترسية واعتماد',
    submissionDate: '2026-08-18',
    supplyDuration: 'خلال 5 أيام من استلام التعميد',
    commitmentDays: 180,
    itemsCount: 2,
    subtotal: 50300.00,
    subtotalInWords: 'فقط خمسون ألف وثلاثمائة ريالاً سعودياً لا غير',
    vatAmount: 7545.00,
    vatInWords: 'فقط سبعة آلاف وخمسمائة وخمسة وأربعون ريالاً سعودياً لا غير',
    grandTotal: 57845.00,
    grandTotalInWords: 'فقط سبعة وخمسون ألف وثمانمائة وخمسة وأربعون ريالاً سعودياً لا غير',
    items: [
      {
        id: 'item-201',
        itemNumber: 1,
        description: 'إضاءة باك روب عدد 6 للمبنى الخارجي بمساحة 6*6 بهوية اليوم الوطني وإضافة طقم مكعبات داخلية بهوية اليوم الوطني',
        unit: 'حبة',
        quantity: 6,
        unitPrice: 4550,
        unitPriceInWords: 'فقط أربعة آلاف وخمسمائة وخمسون ريالاً سعودياً لا غير',
        totalPrice: 27300.00,
        totalPriceInWords: 'فقط سبعة وعشرون ألف وثلاثمائة ريالاً سعودياً لا غير',
        vat: 4095.00,
        totalWithVat: 31395.00,
        totalWithVatInWords: 'فقط واحد وثلاثون ألف وثلاثمائة وخمسة وتسعون ريالاً سعودياً لا غير',
      },
      {
        id: 'item-202',
        itemNumber: 2,
        description: 'شالات مطرزة بهوية اليوم الوطني عدد 100 + أكواب سيراميك عدد 100 محفور عليه شعار سيفين ونخلة حسب النموذج المرفق',
        unit: 'حبة',
        quantity: 200,
        unitPrice: 115,
        unitPriceInWords: 'فقط مائة وخمسة عشر ريالاً سعودياً لا غير',
        totalPrice: 23000.00,
        totalPriceInWords: 'فقط ثلاثة وعشرون ألف ريالاً سعودياً لا غير',
        vat: 3450.00,
        totalWithVat: 26450.00,
        totalWithVatInWords: 'فقط ستة وعشرون ألف وأربعمائة وخمسون ريالاً سعودياً لا غير',
      }
    ]
  }
];

export const TendersBOQPage: React.FC = () => {
  const { activeCompany } = useCompany();
  const { addNotification } = useAppStore();

  const [tendersList, setTendersList] = useState<TenderRecord[]>(DEFAULT_MOCK_TENDERS);
  const [selectedTender, setSelectedTender] = useState<TenderRecord>(DEFAULT_MOCK_TENDERS[0]);
  const [activeTab, setActiveTab] = useState<'excel-boq' | 'directory' | 'awards' | 'suppliers' | 'analytics'>('excel-boq');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showNewTenderModal, setShowNewTenderModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>(DEFAULT_SUPPLIERS);

  // Editing state for active BOQ
  const [currentItems, setCurrentItems] = useState<BOQItem[]>(selectedTender.items);

  // Computed KPIs
  const kpis = useMemo(() => computeTenderKPIs(tendersList), [tendersList]);

  const handleSelectTender = (tender: TenderRecord) => {
    setSelectedTender(tender);
    setCurrentItems(tender.items);
  };

  const handleItemChange = (index: number, field: 'description' | 'unit' | 'quantity' | 'unitPrice', val: any) => {
    const updated = [...currentItems];
    const item = { ...updated[index] };

    if (field === 'description') item.description = val;
    if (field === 'unit') item.unit = val;
    if (field === 'quantity') item.quantity = parseFloat(val) || 0;
    if (field === 'unitPrice') item.unitPrice = parseFloat(val) || 0;

    // Recalculate values
    item.unitPriceInWords = tafqeet(item.unitPrice);
    item.totalPrice = item.quantity * item.unitPrice;
    item.totalPriceInWords = tafqeet(item.totalPrice);
    item.vat = Number((item.totalPrice * 0.15).toFixed(2));
    item.totalWithVat = Number((item.totalPrice + item.vat).toFixed(2));
    item.totalWithVatInWords = tafqeet(item.totalWithVat);

    updated[index] = item;
    setCurrentItems(updated);

    // Recalculate tender totals
    const newSubtotal = updated.reduce((sum, it) => sum + it.totalPrice, 0);
    const newVat = Number((newSubtotal * 0.15).toFixed(2));
    const newGrandTotal = Number((newSubtotal + newVat).toFixed(2));

    const updatedTender: TenderRecord = {
      ...selectedTender,
      items: updated,
      itemsCount: updated.length,
      subtotal: newSubtotal,
      subtotalInWords: tafqeet(newSubtotal),
      vatAmount: newVat,
      vatInWords: tafqeet(newVat),
      grandTotal: newGrandTotal,
      grandTotalInWords: tafqeet(newGrandTotal),
    };

    setSelectedTender(updatedTender);
    setTendersList(tendersList.map(t => t.id === updatedTender.id ? updatedTender : t));
  };

  const handleAddNewItem = () => {
    const nextNum = currentItems.length + 1;
    const newItem: BOQItem = {
      id: `item-${Date.now()}`,
      itemNumber: nextNum,
      description: 'بند توريد جديد',
      unit: 'عدد',
      quantity: 1,
      unitPrice: 1000,
      unitPriceInWords: tafqeet(1000),
      totalPrice: 1000,
      totalPriceInWords: tafqeet(1000),
      vat: 150,
      totalWithVat: 1150,
      totalWithVatInWords: tafqeet(1150),
    };

    const updated = [...currentItems, newItem];
    setCurrentItems(updated);

    const newSubtotal = updated.reduce((sum, it) => sum + it.totalPrice, 0);
    const newVat = Number((newSubtotal * 0.15).toFixed(2));
    const newGrandTotal = Number((newSubtotal + newVat).toFixed(2));

    const updatedTender: TenderRecord = {
      ...selectedTender,
      items: updated,
      itemsCount: updated.length,
      subtotal: newSubtotal,
      subtotalInWords: tafqeet(newSubtotal),
      vatAmount: newVat,
      vatInWords: tafqeet(newVat),
      grandTotal: newGrandTotal,
      grandTotalInWords: tafqeet(newGrandTotal),
    };

    setSelectedTender(updatedTender);
    setTendersList(tendersList.map(t => t.id === updatedTender.id ? updatedTender : t));

    addNotification({
      title: 'إضافة بند كميات',
      message: `تمت إضافة البند #${nextNum} وتحديث الحسابات والتفقيط التلقائي.`,
      type: 'success'
    });
  };

  const handleDeleteItem = (index: number) => {
    if (currentItems.length <= 1) return;
    const updated = currentItems.filter((_, idx) => idx !== index).map((it, idx) => ({ ...it, itemNumber: idx + 1 }));
    setCurrentItems(updated);

    const newSubtotal = updated.reduce((sum, it) => sum + it.totalPrice, 0);
    const newVat = Number((newSubtotal * 0.15).toFixed(2));
    const newGrandTotal = Number((newSubtotal + newVat).toFixed(2));

    const updatedTender: TenderRecord = {
      ...selectedTender,
      items: updated,
      itemsCount: updated.length,
      subtotal: newSubtotal,
      subtotalInWords: tafqeet(newSubtotal),
      vatAmount: newVat,
      vatInWords: tafqeet(newVat),
      grandTotal: newGrandTotal,
      grandTotalInWords: tafqeet(newGrandTotal),
    };

    setSelectedTender(updatedTender);
    setTendersList(tendersList.map(t => t.id === updatedTender.id ? updatedTender : t));
  };

  const handleExportBOQExcel = () => {
    const headers = [
      'الرقم التسلسلي',
      'وصف البند',
      'وحدة القياس',
      'الكمية',
      'سعر الوحدة',
      'سعر الوحدة كتابة',
      'السعر الإجمالي',
      'السعر الإجمالي كتابة',
      'الضريبة (15%)',
      'السعر الإجمالي شامل الضريبة',
      'السعر الإجمالي شامل الضريبة كتابة'
    ];

    const rows = currentItems.map(it => [
      it.itemNumber,
      `"${it.description}"`,
      `"${it.unit}"`,
      it.quantity,
      it.unitPrice.toFixed(2),
      `"${it.unitPriceInWords}"`,
      it.totalPrice.toFixed(2),
      `"${it.totalPriceInWords}"`,
      it.vat.toFixed(2),
      it.totalWithVat.toFixed(2),
      `"${it.totalWithVatInWords}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BOQ_${selectedTender.referenceNumber}_KAS_Trading.csv`;
    link.click();
    URL.revokeObjectURL(url);

    addNotification({
      title: 'تصدير جدول الكميات',
      message: `تم تصدير ملف جدول الكميات والأسعار (${selectedTender.referenceNumber}) بنجاح.`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div
        className="card-feature-cinematic"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
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
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pill-tag-mint" style={{ fontSize: '11px', background: '#059669', color: '#ffffff' }}>KAS TRADING & TENDERS</span>
              <span className="pill-tag-shade" style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', color: '#ffffff' }}>مؤسسة خالد عبدالعزيز السليم للتجارة</span>
            </div>
            <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0 }}>
              إدارة المناقصات وجداول الكميات والتوريدات (BOQ Platform)
            </h1>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0', fontWeight: 420 }}>
              محاكاة إكسيل الذكية، التسعير، الضريبة 15%، التفقيط التلقائي، والترسية المعتمدة لـ شركة كاس للتجارة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowPrintModal(true)}
            className="button-white-pill"
            style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px', backgroundColor: '#ffffff', color: '#000000', fontWeight: '700' }}
          >
            <Printer className="w-4 h-4 ml-1" />
            <span>طباعة عرض المنافسة الرسمي</span>
          </button>

          <button
            onClick={handleExportBOQExcel}
            className="button-outline-on-dark"
            style={{ fontSize: '12.5px', padding: '6px 16px', minHeight: '38px', borderColor: 'rgba(52, 211, 153, 0.5)', color: '#34d399' }}
          >
            <FileSpreadsheet className="w-4 h-4 ml-1 text-emerald-400" />
            <span>تصدير Excel (BOQ)</span>
          </button>
        </div>
      </div>

      {/* Tender Switcher Bar */}
      <div className="card-pricing" style={{ padding: '16px', borderRadius: '16px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-bold text-zinc-500 ml-1">المنافسات المعتمدة:</span>
          {tendersList.map((t) => {
            const isSelected = selectedTender.id === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTender(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected 
                    ? 'bg-emerald-800 text-white shadow-xs' 
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                <span>{t.title.slice(0, 32)}...</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-emerald-900 text-white' : 'bg-zinc-200 text-zinc-800'}`}>
                  {t.referenceNumber}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="pill-tag-mint text-xs font-bold">
            الإجمالي شامل الضريبة: {selectedTender.grandTotal.toLocaleString()} ر.س
          </span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-3">
        {[
          { id: 'excel-boq', label: 'محرر جدول الكميات والأسعار (Excel Live)', icon: FileSpreadsheet },
          { id: 'directory', label: `سجل المنافسات والعقود (${tendersList.length})`, icon: Layers },
          { id: 'analytics', label: 'لوحة مؤشرات المناقصات (KPIs)', icon: BarChart3 },
          { id: 'suppliers', label: `سجل الموردين المعتمدين (${suppliers.length})`, icon: Users },
          { id: 'awards', label: 'محاضر الترسية والربط المالي', icon: Award },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
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
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Live Interactive Excel-Style BOQ Table */}
      {activeTab === 'excel-boq' && (
        <div className="space-y-4">
          {/* Header Specs Card matching Excel File */}
          <div className="border border-emerald-700 rounded-2xl overflow-hidden shadow-sm">
            {/* Header Green Strip */}
            <div className="bg-[#107c41] text-white p-3.5 flex items-center justify-between flex-wrap gap-2 font-bold text-xs">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-900 px-2.5 py-1 rounded text-[11px] font-mono">رقم مرجعي: {selectedTender.referenceNumber}</span>
                <span className="text-sm">{selectedTender.entityName}</span>
              </div>
              <div className="text-sm">
                <span>{selectedTender.title}</span>
              </div>
            </div>

            {/* Quick Details Sub-strip */}
            <div className="bg-emerald-50 text-emerald-950 px-4 py-2 flex items-center justify-between text-xs border-b border-emerald-200 flex-wrap gap-2 font-semibold">
              <div>
                <span>الجهة الطالبة: </span>
                <span className="font-bold text-black">{selectedTender.clientName}</span>
              </div>
              <div>
                <span>مدة التوريد: </span>
                <span className="font-bold text-black">{selectedTender.supplyDuration}</span>
              </div>
              <div>
                <span>مدة الالتزام بالعرض: </span>
                <span className="font-bold text-black">{selectedTender.commitmentDays} يوماً</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddNewItem}
                  className="bg-[#107c41] text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-emerald-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ إضافة بند جديد</span>
                </button>
              </div>
            </div>

            {/* Live Excel Table */}
            <div className="overflow-x-auto bg-white">
              <table className="w-full text-right text-xs text-black border-collapse">
                <thead>
                  <tr className="bg-[#d9ead3] text-black font-bold border-b border-emerald-300 text-center">
                    <th className="p-2 border-r border-emerald-300 w-10">الرقم</th>
                    <th className="p-2 border-r border-emerald-300 min-w-[220px]">وصف البند</th>
                    <th className="p-2 border-r border-emerald-300 w-20">وحدة القياس</th>
                    <th className="p-2 border-r border-emerald-300 w-20">الكمية</th>
                    <th className="p-2 border-r border-emerald-300 w-24">سعر الوحدة</th>
                    <th className="p-2 border-r border-emerald-300 min-w-[160px]">سعر الوحدة كتابة</th>
                    <th className="p-2 border-r border-emerald-300 w-24">السعر الإجمالي</th>
                    <th className="p-2 border-r border-emerald-300 min-w-[180px]">السعر الإجمالي كتابة</th>
                    <th className="p-2 border-r border-emerald-300 w-20">الضريبة (15%)</th>
                    <th className="p-2 border-r border-emerald-300 w-28">الإجمالي شامل الضريبة</th>
                    <th className="p-2 border-r border-emerald-300 min-w-[200px]">السعر شامل الضريبة كتابة</th>
                    <th className="p-2 w-10">إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-emerald-50/40 border-b border-zinc-200 transition-colors">
                      <td className="p-2 text-center font-bold font-mono border-r border-zinc-200 bg-zinc-50">{item.itemNumber}</td>
                      <td className="p-1 border-r border-zinc-200">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          className="w-full bg-transparent px-2 py-1 text-xs text-black font-semibold focus:bg-white focus:outline-emerald-600 rounded"
                        />
                      </td>
                      <td className="p-1 border-r border-zinc-200 text-center">
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                          className="w-full bg-transparent text-center px-1 py-1 text-xs font-semibold focus:bg-white focus:outline-emerald-600 rounded"
                        />
                      </td>
                      <td className="p-1 border-r border-zinc-200 text-center">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-full bg-transparent text-center px-1 py-1 text-xs font-mono font-bold focus:bg-white focus:outline-emerald-600 rounded"
                        />
                      </td>
                      <td className="p-1 border-r border-zinc-200 text-center">
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                          className="w-full bg-transparent text-center px-1 py-1 text-xs font-mono font-bold text-emerald-800 focus:bg-white focus:outline-emerald-600 rounded"
                        />
                      </td>
                      <td className="p-2 border-r border-zinc-200 text-[11px] text-zinc-600 leading-snug">{item.unitPriceInWords}</td>
                      <td className="p-2 border-r border-zinc-200 font-mono font-bold text-black text-center">{item.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="p-2 border-r border-zinc-200 text-[11px] text-zinc-600 leading-snug">{item.totalPriceInWords}</td>
                      <td className="p-2 border-r border-zinc-200 font-mono text-emerald-800 font-bold text-center">{item.vat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="p-2 border-r border-zinc-200 font-mono font-bold text-emerald-900 bg-emerald-50/50 text-center">{item.totalWithVat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="p-2 border-r border-zinc-200 text-[11px] text-emerald-950 font-medium leading-snug">{item.totalWithVatInWords}</td>
                      <td className="p-1 text-center">
                        <button
                          onClick={() => handleDeleteItem(idx)}
                          className="p-1 text-zinc-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors"
                          title="حذف البند"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Excel Footer Calculations (Matching Image Exactly) */}
                <tfoot className="font-bold">
                  {/* Row 1: Subtotal */}
                  <tr className="bg-[#e2efda] border-t-2 border-emerald-600 text-black">
                    <td colSpan={6} className="p-2.5 text-left border-r border-emerald-300 font-bold">السعر الإجمالي (قبل الضريبة):</td>
                    <td colSpan={2} className="p-2.5 text-center font-mono font-bold text-sm border-r border-emerald-300">{selectedTender.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} ريال سعودي</td>
                    <td colSpan={4} className="p-2.5 text-xs text-zinc-700 font-medium">{selectedTender.subtotalInWords}</td>
                  </tr>

                  {/* Row 2: VAT 15% */}
                  <tr className="bg-[#e2efda] border-t border-emerald-300 text-black">
                    <td colSpan={6} className="p-2.5 text-left border-r border-emerald-300 font-bold">ضريبة القيمة المضافة (15%):</td>
                    <td colSpan={2} className="p-2.5 text-center font-mono font-bold text-sm border-r border-emerald-300 text-emerald-800">{selectedTender.vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} ريال سعودي</td>
                    <td colSpan={4} className="p-2.5 text-xs text-zinc-700 font-medium">{selectedTender.vatInWords}</td>
                  </tr>

                  {/* Row 3: Grand Total */}
                  <tr className="bg-[#107c41] text-white border-t-2 border-emerald-800">
                    <td colSpan={6} className="p-3 text-left border-r border-emerald-700 font-bold text-sm">الإجمالي شامل الضريبة:</td>
                    <td colSpan={2} className="p-3 text-center font-mono font-bold text-base border-r border-emerald-700 bg-[#0b5c30]">{selectedTender.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} ريال سعودي</td>
                    <td colSpan={4} className="p-3 text-xs font-semibold leading-relaxed">{selectedTender.grandTotalInWords}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Tenders Directory */}
      {activeTab === 'directory' && (
        <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
          <div className="p-4 border-b border-zinc-100 bg-white flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-bold text-black m-0">سجل مناقصات وعقود التوريد المعتمدة</h3>
              <p className="text-xs text-zinc-500 mt-0.5">كافة المنافسات المسجلة باسم مؤسسة خالد السليم للتجارة (شركة كاس)</p>
            </div>
            <button
              onClick={() => {
                setActiveTab('excel-boq');
                handleAddNewItem();
              }}
              className="button-primary-pill text-xs py-1.5 px-4"
            >
              + إنشاء منافسة جديدة
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3.5">الرقم المرجعي</th>
                  <th className="p-3.5">عنوان المنافسة والجهة</th>
                  <th className="p-3.5">الجهة التابعة</th>
                  <th className="p-3.5">عدد البنود</th>
                  <th className="p-3.5">الإجمالي (قبل الضريبة)</th>
                  <th className="p-3.5">الضريبة (15%)</th>
                  <th className="p-3.5">الإجمالي شامل الضريبة</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {tendersList.map((t) => (
                  <tr key={t.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-black">{t.referenceNumber}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-black">{t.title}</div>
                      <div className="text-[11px] text-zinc-500">{t.clientName}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-zinc-800">{t.entityName}</span>
                    </td>
                    <td className="p-3.5 font-mono text-center font-bold">{t.itemsCount} بنود</td>
                    <td className="p-3.5 font-mono font-bold text-black">{t.subtotal.toLocaleString()} ر.س</td>
                    <td className="p-3.5 font-mono text-emerald-800">{t.vatAmount.toLocaleString()} ر.س</td>
                    <td className="p-3.5 font-mono font-bold text-emerald-900 bg-emerald-50/50">{t.grandTotal.toLocaleString()} ر.س</td>
                    <td className="p-3.5"><Badge text={t.status} type="success" /></td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            handleSelectTender(t);
                            setActiveTab('excel-boq');
                          }}
                          className="button-outline-on-light text-xs py-1 px-3"
                        >
                          <Eye className="w-3 h-3 ml-1" />
                          <span>فتح BOQ</span>
                        </button>
                        <button
                          onClick={() => {
                            handleSelectTender(t);
                            setShowPrintModal(true);
                          }}
                          className="button-outline-on-light text-xs py-1 px-2.5"
                          title="طباعة العرض الرسمي"
                        >
                          <Printer className="w-3 h-3 text-black" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Analytics Dashboard */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'إجمالي المناقصات', value: kpis.totalTenders, icon: Layers, color: '#0f172a', bg: '#f1f5f9' },
              { label: 'المرسّاة والمعتمدة', value: kpis.totalAwarded, icon: CheckCircle2, color: '#059669', bg: '#ecfdf5' },
              { label: 'نسبة الفوز (Win Rate)', value: `${kpis.winRate}%`, icon: TrendingUp, color: '#0284c7', bg: '#f0f9ff' },
              { label: 'إجمالي الإيرادات شامل الضريبة', value: `${kpis.totalRevenueWithVat.toLocaleString()} ر.س`, icon: DollarSign, color: '#7c3aed', bg: '#f5f3ff' },
            ].map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div key={idx} className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: kpi.bg }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4" style={{ color: kpi.color }} />
                    <span className="text-[11px] font-medium text-zinc-600">{kpi.label}</span>
                  </div>
                  <div className="text-xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
                </div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <div className="card-pricing" style={{ padding: '24px', borderRadius: '20px', background: '#ffffff' }}>
              <h4 className="text-sm font-bold text-black mb-4 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-violet-600" />
                <span>توزيع المنافسات حسب الحالة</span>
              </h4>
              <div className="space-y-3">
                {kpis.statusDistribution.map((status, idx) => {
                  const percentage = kpis.totalTenders > 0 ? ((status.count / kpis.totalTenders) * 100).toFixed(0) : '0';
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: status.color }} />
                      <span className="text-xs font-medium text-zinc-700 flex-grow">{status.status}</span>
                      <span className="text-xs font-mono font-bold" style={{ color: status.color }}>{status.count}</span>
                      <div className="w-24 h-2 bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${percentage}%`, backgroundColor: status.color }} />
                      </div>
                      <span className="text-[10px] text-zinc-500 w-8 text-left">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="card-pricing" style={{ padding: '24px', borderRadius: '20px', background: '#ffffff' }}>
              <h4 className="text-sm font-bold text-black mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-sky-600" />
                <span>توزيع المنافسات حسب الفئة</span>
              </h4>
              <div className="space-y-3">
                {kpis.categoryBreakdown.map((cat, idx) => {
                  const maxVal = Math.max(...kpis.categoryBreakdown.map(c => c.value), 1);
                  const barWidth = ((cat.value / maxVal) * 100).toFixed(0);
                  const colors = ['#059669', '#0284c7', '#d97706', '#7c3aed', '#dc2626'];
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-zinc-700">{cat.category}</span>
                        <span className="text-xs font-mono font-bold text-zinc-900">{cat.value.toLocaleString()} ر.س ({cat.count})</span>
                      </div>
                      <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${barWidth}%`, backgroundColor: colors[idx % colors.length] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Additional KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
              <h4 className="text-xs font-bold text-zinc-500 mb-2">🏆 أعلى عميل بالقيمة</h4>
              <div className="text-sm font-bold text-black">{kpis.topClient.name}</div>
              <div className="text-xs text-zinc-600 mt-1">{kpis.topClient.value.toLocaleString()} ر.س — {kpis.topClient.count} منافسة</div>
            </div>
            <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
              <h4 className="text-xs font-bold text-zinc-500 mb-2">📊 متوسط قيمة المنافسة</h4>
              <div className="text-sm font-bold text-black">{kpis.avgTenderValue.toLocaleString()} ر.س</div>
              <div className="text-xs text-zinc-600 mt-1">شامل الضريبة 15%</div>
            </div>
            <div className="card-pricing" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
              <h4 className="text-xs font-bold text-zinc-500 mb-2">📋 حالة المنافسات</h4>
              <div className="flex gap-3 mt-1">
                <span className="text-xs"><span className="font-bold text-amber-600">{kpis.totalDraft}</span> مسودة</span>
                <span className="text-xs"><span className="font-bold text-sky-600">{kpis.totalSubmitted}</span> مقدمة</span>
                <span className="text-xs"><span className="font-bold text-violet-600">{kpis.totalInvoiced}</span> مفوترة</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Suppliers Registry */}
      {activeTab === 'suppliers' && (
        <div className="space-y-6">
          <div className="card-pricing" style={{ padding: '24px', borderRadius: '24px', background: '#ffffff' }}>
            <div className="border-b border-zinc-100 pb-3 mb-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-base font-bold text-black m-0 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span>سجل الموردين والمقاولين المعتمدين — كاس للتجارة</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-1">قاعدة بيانات الموردين مع التقييم والأداء وسجل التوريدات السابقة</p>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <div className="text-lg font-bold text-emerald-800">{suppliers.filter(s => s.status === 'معتمد').length}</div>
                <div className="text-[10px] text-emerald-700">موردين معتمدين</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <div className="text-lg font-bold text-amber-800">{suppliers.filter(s => s.status === 'تحت التقييم').length}</div>
                <div className="text-[10px] text-amber-700">تحت التقييم</div>
              </div>
              <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-center">
                <div className="text-lg font-bold text-sky-800">{suppliers.reduce((s, sup) => s + sup.totalDeals, 0)}</div>
                <div className="text-[10px] text-sky-700">إجمالي التعاملات</div>
              </div>
              <div className="p-3 rounded-xl bg-violet-50 border border-violet-200 text-center">
                <div className="text-lg font-bold text-violet-800">{suppliers.reduce((s, sup) => s + sup.totalValue, 0).toLocaleString()}</div>
                <div className="text-[10px] text-violet-700">إجمالي القيمة (ر.س)</div>
              </div>
            </div>

            {/* Suppliers Table */}
            <div className="overflow-x-auto" style={{ borderRadius: '16px', border: '1px solid #e4e4e7' }}>
              <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                    <th className="p-2.5 text-right border-r border-zinc-200">اسم المورد</th>
                    <th className="p-2.5 text-center border-r border-zinc-200 w-28">الفئة</th>
                    <th className="p-2.5 text-center border-r border-zinc-200 w-20">المدينة</th>
                    <th className="p-2.5 text-center border-r border-zinc-200 w-16">التقييم</th>
                    <th className="p-2.5 text-center border-r border-zinc-200 w-16">الجودة</th>
                    <th className="p-2.5 text-center border-r border-zinc-200 w-16">الالتزام</th>
                    <th className="p-2.5 text-center border-r border-zinc-200 w-16">السعر</th>
                    <th className="p-2.5 text-center border-r border-zinc-200 w-16">التعاملات</th>
                    <th className="p-2.5 text-center border-r border-zinc-200 w-24">إجمالي القيمة</th>
                    <th className="p-2.5 text-center w-20">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((sup) => {
                    const statusColor = sup.status === 'معتمد' ? '#059669' : sup.status === 'تحت التقييم' ? '#d97706' : '#dc2626';
                    const statusBg = sup.status === 'معتمد' ? '#ecfdf5' : sup.status === 'تحت التقييم' ? '#fffbeb' : '#fef2f2';
                    return (
                      <tr key={sup.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                        <td className="p-2.5 border-r border-zinc-100">
                          <div className="font-bold text-black">{sup.name}</div>
                          <div className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" /> {sup.phone}
                            <span className="mx-1">|</span>
                            <Mail className="w-3 h-3" /> {sup.email}
                          </div>
                        </td>
                        <td className="p-2 border-r border-zinc-100 text-center text-[10px]">{sup.category}</td>
                        <td className="p-2 border-r border-zinc-100 text-center">
                          <span className="flex items-center justify-center gap-1"><MapPin className="w-3 h-3 text-zinc-400" />{sup.city}</span>
                        </td>
                        <td className="p-2 border-r border-zinc-100 text-center">
                          <div className="flex items-center justify-center gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} className="w-3 h-3" style={{ color: s <= sup.rating ? '#f59e0b' : '#e4e4e7', fill: s <= sup.rating ? '#f59e0b' : 'none' }} />
                            ))}
                          </div>
                        </td>
                        <td className="p-2 border-r border-zinc-100 text-center">
                          <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${sup.qualityScore}%`, backgroundColor: sup.qualityScore >= 90 ? '#059669' : sup.qualityScore >= 70 ? '#d97706' : '#dc2626' }} />
                          </div>
                          <span className="text-[9px] text-zinc-500">{sup.qualityScore}%</span>
                        </td>
                        <td className="p-2 border-r border-zinc-100 text-center">
                          <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${sup.commitmentScore}%`, backgroundColor: sup.commitmentScore >= 90 ? '#059669' : sup.commitmentScore >= 70 ? '#d97706' : '#dc2626' }} />
                          </div>
                          <span className="text-[9px] text-zinc-500">{sup.commitmentScore}%</span>
                        </td>
                        <td className="p-2 border-r border-zinc-100 text-center">
                          <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${sup.priceCompetitiveness}%`, backgroundColor: sup.priceCompetitiveness >= 90 ? '#059669' : sup.priceCompetitiveness >= 70 ? '#0284c7' : '#d97706' }} />
                          </div>
                          <span className="text-[9px] text-zinc-500">{sup.priceCompetitiveness}%</span>
                        </td>
                        <td className="p-2 border-r border-zinc-100 text-center font-mono font-bold">{sup.totalDeals}</td>
                        <td className="p-2 border-r border-zinc-100 text-center font-mono font-bold">{sup.totalValue.toLocaleString()}</td>
                        <td className="p-2 text-center">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ color: statusColor, backgroundColor: statusBg }}>
                            {sup.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Awards & Financial Settlement */}
      {activeTab === 'awards' && (
        <div className="space-y-6">
          <div className="card-pricing" style={{ padding: '24px', borderRadius: '24px', background: '#ffffff' }}>
            <div className="border-b border-zinc-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-black m-0 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>محاضر الترسية والربط بالمشتريات والفوترة الإلكترونية ZATCA</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-1">تحويل العروض المعتمدة مباشرة إلى أوامر شراء (PO) أو فواتير مبيعات ضريبية</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <h4 className="font-bold text-xs text-emerald-950 mb-2">إصدار فاتورة مبيعات ضريبية فورية</h4>
                <p className="text-xs text-emerald-800 leading-relaxed mb-3">
                  توليد الفاتورة الإلكترونية المعتمدة ZATCA مباشرة لمنافسة ({selectedTender.title}) بقيمة {selectedTender.grandTotal.toLocaleString()} ر.س.
                </p>
                <button
                  onClick={() => {
                    addNotification({
                      title: 'إصدار فاتورة ZATCA',
                      message: `تم توليد الفاتورة الضريبية لمنافسة ${selectedTender.referenceNumber} وتضمين QR المشفر.`,
                      type: 'success'
                    });
                  }}
                  className="button-primary-pill text-xs py-1.5 px-4"
                >
                  إصدار فاتورة ZATCA الآن
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <h4 className="font-bold text-xs text-zinc-900 mb-2">توليد أمر شراء للتوريدات (PO)</h4>
                <p className="text-xs text-zinc-600 leading-relaxed mb-3">
                  إصدار أوامر توريد داخلية للمستودعات المركزية لشركة كاس لتجهيز البنود الـ {selectedTender.itemsCount}.
                </p>
                <button
                  onClick={() => {
                    addNotification({
                      title: 'أمر توريد مستودعي',
                      message: `تم إنشاء أمر الصرف والتوريد الداخلي لمستودعات شركة كاس للتجارة.`,
                      type: 'success'
                    });
                  }}
                  className="button-outline-on-light text-xs py-1.5 px-4"
                >
                  توليد أمر التوريد PO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Print Modal (Matching Excel Image Exactly) */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2200] flex items-center justify-center p-4">
          <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-zinc-300 overflow-hidden font-sans max-h-[95vh] flex flex-col">
            <div className="p-4 bg-black text-white flex items-center justify-between print:hidden">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>معاينة نموذج عرض المنافسة الرسمي لجدول الكميات والأسعار (BOQ)</span>
              </h3>
              <button onClick={() => setShowPrintModal(false)} className="p-1 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Print Body */}
            <div className="p-6 overflow-y-auto space-y-4 bg-white text-black">
              {/* Header Box matching Image */}
              <div className="border-2 border-emerald-800 rounded-xl overflow-hidden">
                <div className="bg-[#107c41] text-white p-3 text-center">
                  <div className="text-lg font-bold">{selectedTender.entityName}</div>
                  <div className="text-sm mt-0.5">{selectedTender.title}</div>
                  <div className="text-xs font-mono mt-0.5">رقم مرجعي: {selectedTender.referenceNumber}</div>
                </div>

                <div className="p-3 bg-emerald-50 flex justify-between text-xs font-semibold border-b border-emerald-200">
                  <div><strong>الجهة المستفيدة:</strong> {selectedTender.clientName}</div>
                  <div><strong>مدة التوريد:</strong> {selectedTender.supplyDuration}</div>
                  <div><strong>مدة الالتزام بالعرض:</strong> {selectedTender.commitmentDays} يوماً</div>
                </div>

                {/* Print Table */}
                <table className="w-full text-right text-xs text-black border-collapse">
                  <thead>
                    <tr className="bg-[#d9ead3] text-black font-bold border-b border-emerald-400 text-center">
                      <th className="p-2 border-r border-emerald-300 w-10">الرقم</th>
                      <th className="p-2 border-r border-emerald-300">وصف البند</th>
                      <th className="p-2 border-r border-emerald-300 w-16">الوحدة</th>
                      <th className="p-2 border-r border-emerald-300 w-16">الكمية</th>
                      <th className="p-2 border-r border-emerald-300 w-24">سعر الوحدة</th>
                      <th className="p-2 border-r border-emerald-300">سعر الوحدة كتابة</th>
                      <th className="p-2 border-r border-emerald-300 w-24">الإجمالي</th>
                      <th className="p-2 border-r border-emerald-300">الإجمالي كتابة</th>
                      <th className="p-2 border-r border-emerald-300 w-20">الضريبة 15%</th>
                      <th className="p-2 border-r border-emerald-300 w-28">الإجمالي شامل الضريبة</th>
                      <th className="p-2">الإجمالي شامل الضريبة كتابة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item) => (
                      <tr key={item.id} className="border-b border-zinc-200">
                        <td className="p-2 text-center font-bold font-mono border-r border-zinc-200">{item.itemNumber}</td>
                        <td className="p-2 border-r border-zinc-200 font-bold">{item.description}</td>
                        <td className="p-2 border-r border-zinc-200 text-center">{item.unit}</td>
                        <td className="p-2 border-r border-zinc-200 text-center font-mono font-bold">{item.quantity}</td>
                        <td className="p-2 border-r border-zinc-200 text-center font-mono font-bold">{item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className="p-2 border-r border-zinc-200 text-[10px] text-zinc-700">{item.unitPriceInWords}</td>
                        <td className="p-2 border-r border-zinc-200 text-center font-mono font-bold">{item.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className="p-2 border-r border-zinc-200 text-[10px] text-zinc-700">{item.totalPriceInWords}</td>
                        <td className="p-2 border-r border-zinc-200 text-center font-mono text-emerald-800 font-bold">{item.vat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className="p-2 border-r border-zinc-200 text-center font-mono font-bold text-emerald-900 bg-emerald-50">{item.totalWithVat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className="p-2 text-[10px] font-medium text-emerald-950">{item.totalWithVatInWords}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="font-bold">
                    <tr className="bg-[#e2efda] border-t-2 border-emerald-600">
                      <td colSpan={6} className="p-2 text-left border-r border-emerald-300">السعر الإجمالي (قبل الضريبة):</td>
                      <td colSpan={2} className="p-2 text-center font-mono">{selectedTender.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} ر.س</td>
                      <td colSpan={3} className="p-2 text-[11px]">{selectedTender.subtotalInWords}</td>
                    </tr>
                    <tr className="bg-[#e2efda] border-t border-emerald-300">
                      <td colSpan={6} className="p-2 text-left border-r border-emerald-300">ضريبة القيمة المضافة (15%):</td>
                      <td colSpan={2} className="p-2 text-center font-mono text-emerald-800">{selectedTender.vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} ر.س</td>
                      <td colSpan={3} className="p-2 text-[11px]">{selectedTender.vatInWords}</td>
                    </tr>
                    <tr className="bg-[#107c41] text-white">
                      <td colSpan={6} className="p-2.5 text-left border-r border-emerald-700">الإجمالي شامل الضريبة:</td>
                      <td colSpan={2} className="p-2.5 text-center font-mono text-sm bg-[#0b5c30]">{selectedTender.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} ر.س</td>
                      <td colSpan={3} className="p-2.5 text-[11px] leading-relaxed">{selectedTender.grandTotalInWords}</td>
                    </tr>
                  </tfoot>
                </table>

                {/* Signatures Footer */}
                <div className="p-6 grid grid-cols-2 gap-4 border-t-2 border-emerald-800 text-xs">
                  <div>
                    <div className="font-bold text-zinc-700">المدير العام / المفوض بالتوقيع:</div>
                    <div className="font-bold text-black mt-1">خالد عبدالعزيز السليم</div>
                    <div className="text-[11px] text-zinc-500">مؤسسة خالد عبدالعزيز السليم للتجارة (كاس)</div>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-zinc-700">الختم والاعتماد الرسمي:</div>
                    <div className="border border-emerald-300 rounded-lg p-2 mt-1 inline-block text-center text-emerald-800 font-bold text-[11px]">
                      معتمد ومطابق للأنظمة السعودية
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex justify-end gap-3 print:hidden">
              <button
                onClick={() => setShowPrintModal(false)}
                className="button-outline-on-light text-xs py-2 px-4"
              >
                إغلاق
              </button>
              <button
                onClick={() => window.print()}
                className="button-primary-pill text-xs py-2 px-5 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الوثيقة (Print)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TendersBOQPage;
