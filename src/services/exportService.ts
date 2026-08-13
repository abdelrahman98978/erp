/**
 * Central Export Service for ERP System
 * Supports Excel (XLSX), PDF, and CSV export with proper Arabic headers
 * for all data sections across the application.
 */
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

// ─── Section Configuration Registry ─────────────────────────────────
// Each section has: title, Arabic column headers, and a data mapper function

export interface SectionExportConfig {
  sectionTitle: string;
  headers: string[];
  /** Maps raw data objects to flat arrays matching header order */
  dataMapper: (row: any) => (string | number)[];
}

export const SECTION_CONFIGS: Record<string, SectionExportConfig> = {
  // 1. العملاء CRM
  clients: {
    sectionTitle: 'تقرير العملاء الشامل',
    headers: ['رقم العميل', 'الاسم', 'رقم الجوال', 'رقم الهوية', 'الحساب المحاسبي', 'نشاط العميل', 'آخر نشاط', 'أضيف بواسطة', 'الفرع', 'تاريخ الإنشاء', 'الحالة'],
    dataMapper: (r: any) => [
      r.client_no || r.client_number || '',
      r.name || '',
      r.phone || '',
      r.national_id || '',
      r.account_code || '',
      r.client_activity || r.type || '',
      r.last_activity || '',
      r.added_by || '',
      r.branch || '',
      r.created_at || '',
      r.status || ''
    ]
  },

  // 2. الطلبات والحجوزات
  orders: {
    sectionTitle: 'تقرير طلبات الاستقدام',
    headers: ['رقم الطلب', 'العميل', 'جوال العميل', 'اسم العاملة', 'الجنسية', 'رقم الجواز', 'نوع الطلب', 'المكتب الخارجي', 'حالة المهلة', 'الموظف المسؤول', 'تاريخ الإنشاء', 'الحالة'],
    dataMapper: (r: any) => [
      r.id || '',
      r.client_name || '',
      r.client_phone || '',
      r.maid_name || '',
      r.nationality || '',
      r.passport_number || '',
      r.request_type || '',
      r.office_name || '',
      r.timer_status || '',
      r.responsible_employee || '',
      r.created_at || '',
      r.status || ''
    ]
  },

  // 3. عقود الاستقدام
  'recruitment-contracts': {
    sectionTitle: 'تقرير عقود الاستقدام',
    headers: ['رقم العقد', 'رقم مساند', 'العميل', 'جوال العميل', 'اسم العاملة', 'رقم الجواز', 'الجنسية', 'المكتب الخارجي', 'المرحلة', 'حالة الضمان', 'حالة الدفع', 'المبلغ (ر.س)', 'الفرع', 'التاريخ'],
    dataMapper: (r: any) => [
      r.contract_number || '',
      r.musaned_number || '',
      r.client_name || '',
      r.client_phone || '',
      r.maid_name || '',
      r.maid_passport || '',
      r.nationality || '',
      r.external_office || '',
      r.stage || '',
      r.warranty_status || '',
      r.payment_status || '',
      r.amount || 0,
      r.branch || '',
      r.created_at || ''
    ]
  },

  // 4. عقود التأجير
  'rent-contracts': {
    sectionTitle: 'تقرير عقود التأجير التشغيلي',
    headers: ['رقم العقد', 'العميل', 'جوال العميل', 'اسم العاملة', 'الجنسية', 'تاريخ البداية', 'تاريخ النهاية', 'المدة (أشهر)', 'التكلفة الشهرية', 'الإجمالي', 'الحالة', 'حالة الدفع', 'المسوق', 'الفرع'],
    dataMapper: (r: any) => [
      r.contract_number || '',
      r.client_name || '',
      r.client_phone || '',
      r.maid_name || '',
      r.nationality || '',
      r.start_date || '',
      r.end_date || '',
      r.duration_months || 0,
      r.monthly_cost || 0,
      r.total_amount || 0,
      r.status || '',
      r.payment_status || '',
      r.marketer || '',
      r.branch || ''
    ]
  },

  // 5. الإيواء والإعاشة
  shelter: {
    sectionTitle: 'تقرير الإيواء والإعاشة',
    headers: ['الرقم', 'اسم العاملة', 'رقم الجواز', 'الجنسية', 'مرجع العقد', 'العميل', 'موقع الإيواء', 'عدد الأيام', 'عدد الوجبات', 'الرغبة في العمل', 'الحالة'],
    dataMapper: (r: any) => [
      r.id || '',
      r.maid_name || '',
      r.passport || '',
      r.nationality || '',
      r.contract_ref || '',
      r.client_name || '',
      r.shelter_location || '',
      r.days_in_shelter || 0,
      r.catering_meals_count || 0,
      r.work_willingness || '',
      r.status || ''
    ]
  },

  // 6. السفر والرحلات
  travel: {
    sectionTitle: 'تقرير رحلات السفر واللوجستيات',
    headers: ['الرقم', 'نوع السفر', 'العميل', 'اسم العاملة', 'الجنسية', 'شركة الطيران', 'رقم الرحلة', 'المطار', 'تاريخ الرحلة', 'الحالة'],
    dataMapper: (r: any) => [
      r.id || '',
      r.travel_type || '',
      r.client_name || '',
      r.maid_name || '',
      r.nationality || '',
      r.airline || '',
      r.flight_number || '',
      r.airport || '',
      r.flight_date || '',
      r.status || ''
    ]
  },

  // 7. نقل الكفالة
  'sponsorship-transfer': {
    sectionTitle: 'تقرير نقل الكفالة',
    headers: ['رقم النقل', 'اسم العاملة', 'الجنسية', 'الكفيل القديم (المتنازل)', 'جوال القديم', 'الكفيل الجديد (المستلم)', 'جوال الجديد', 'أيام التجربة المتبقية', 'مبلغ العقد (ر.س)', 'الحالة', 'التاريخ'],
    dataMapper: (r: any) => [
      r.contract_number || '',
      r.maid_name || '',
      r.nationality || '',
      r.old_sponsor || '',
      r.old_sponsor_phone || '',
      r.new_sponsor || '',
      r.new_sponsor_phone || '',
      r.trial_days_remaining ?? 0,
      r.contract_amount || 0,
      r.status || '',
      r.created_at || ''
    ]
  },

  // 8. الشكاوى والدعم
  complaints: {
    sectionTitle: 'تقرير الشكاوى والدعم الفني',
    headers: ['رقم التذكرة', 'العميل', 'جوال العميل', 'التصنيف', 'مرجع العقد', 'الأولوية', 'الحالة', 'SLA (ساعات)', 'الموظف المعين', 'الفرع', 'تاريخ الإنشاء', 'الوصف'],
    dataMapper: (r: any) => [
      r.ticket_no || '',
      r.client_name || '',
      r.client_phone || '',
      r.category || '',
      r.contract_ref || '',
      r.priority || '',
      r.status || '',
      r.sla_hours_left ?? 0,
      r.assigned_agent || '',
      r.branch || '',
      r.created_at || '',
      r.description || ''
    ]
  },

  // 9. المكاتب الخارجية
  'external-offices': {
    sectionTitle: 'تقرير المكاتب الخارجية',
    headers: ['الرقم', 'اسم المكتب', 'الدولة', 'اسم المدير', 'رقم الجوال', 'البريد الإلكتروني', 'رقم الترخيص', 'المرشحون النشطون', 'إجمالي الواصلين', 'التقييم'],
    dataMapper: (r: any) => [
      r.id || '',
      r.officeName || '',
      r.country || '',
      r.managerName || '',
      r.phone || '',
      r.email || '',
      r.licenseNumber || '',
      r.activeCandidatesCount || 0,
      r.arrivedCountCount || 0,
      r.rating || 0
    ]
  },

  // 10. الطلبات المالية
  'financial-requests': {
    sectionTitle: 'تقرير الطلبات المالية التشغيلية',
    headers: ['رقم الطلب', 'نوع الطلب المالي', 'العميل', 'رقم العقد', 'المبلغ المطلوب (ر.س)', 'الأولوية', 'حالة الاعتماد', 'مقدم الطلب', 'التاريخ'],
    dataMapper: (r: any) => [
      r.request_number || '',
      r.type || '',
      r.client_name || '',
      r.contract_number || '',
      r.amount || 0,
      r.priority || '',
      r.status || '',
      r.applicant || '',
      r.created_at || ''
    ]
  },

  // 11. الموظفون HR
  employees: {
    sectionTitle: 'تقرير بيانات الموظفين',
    headers: ['الرقم الوظيفي', 'الاسم', 'رقم الهوية', 'المسمى الوظيفي', 'القسم / الإدارة', 'الفرع', 'تاريخ التوظيف', 'الراتب الأساسي (ر.س)', 'الحالة'],
    dataMapper: (r: any) => [
      r.employee_code || '',
      r.name || '',
      r.national_id || '',
      r.job_title || '',
      r.department || '',
      r.branch || '',
      r.hire_date || '',
      r.salary || 0,
      r.status || ''
    ]
  },

  // 12. القيود المحاسبية
  journals: {
    sectionTitle: 'تقرير القيود المحاسبية',
    headers: ['رقم القيد', 'التاريخ', 'البيان والوصف', 'المبلغ (ر.س)', 'حالة الاعتماد', 'الفرع'],
    dataMapper: (r: any) => [
      r.ref_no || '',
      r.date || '',
      r.description || '',
      r.amount || 0,
      r.status || '',
      r.branch || ''
    ]
  },

  // 13. السندات المالية
  vouchers: {
    sectionTitle: 'تقرير السندات المالية (قبض وصرف)',
    headers: ['رقم السند', 'النوع', 'التاريخ', 'المدفوع له / القابض', 'الخزينة / البنك', 'المبلغ (ر.س)', 'حالة الاعتماد'],
    dataMapper: (r: any) => [
      r.voucher_no || '',
      r.type || '',
      r.date || '',
      r.payee_payer || '',
      r.treasury || '',
      r.amount || 0,
      r.status || ''
    ]
  },

  // 14. المراسلات الجماعية
  'group-dispatch': {
    sectionTitle: 'تقرير المراسلات بين شركات المجموعة',
    headers: ['رقم المذكرة', 'الجهة المصدرة', 'الجهة المستهدفة', 'نوع المذكرة', 'الموضوع', 'الأولوية', 'الحالة', 'التاريخ', 'المسؤول المكلف'],
    dataMapper: (r: any) => [
      r.dispatch_no || '',
      r.source_entity || '',
      r.target_entity || '',
      r.dispatch_type || '',
      r.subject || '',
      r.priority || '',
      r.status || '',
      r.created_at || '',
      r.assigned_officer || ''
    ]
  },

  // 15. تفاويض الإنجاز
  ingaz: {
    sectionTitle: 'تقرير تفاويض الإنجاز',
    headers: ['رقم التفويض', 'العميل / الكفيل', 'رقم هوية الكفيل', 'رقم التأشيرة', 'المكتب الخارجي', 'المهنة', 'الجنسية', 'رسوم التوثيق (ر.س)', 'الحالة', 'التاريخ'],
    dataMapper: (r: any) => [
      r.delegation_number || '',
      r.client_name || '',
      r.sponsor_id || '',
      r.visa_number || '',
      r.foreign_office || '',
      r.profession || '',
      r.nationality || '',
      r.fee_amount || 0,
      r.status || '',
      r.created_at || ''
    ]
  },

  // 16. مستخدمو النظام
  users: {
    sectionTitle: 'تقرير مستخدمي النظام والصلاحيات',
    headers: ['الاسم', 'اسم المستخدم', 'نوع المستخدم', 'الصلاحية / الدور', 'الفرع', 'رقم الجوال', 'البريد الإلكتروني', 'الحالة', 'المصادقة الثنائية 2FA'],
    dataMapper: (r: any) => [
      r.name || '',
      r.username || '',
      r.user_type || '',
      r.role || '',
      r.branch || '',
      r.phone || '',
      r.email || '',
      r.status || '',
      r.two_factor_enabled ? 'مفعّل' : 'غير مفعّل'
    ]
  },

  // Inter-company disputes (sub-section of complaints)
  'inter-disputes': {
    sectionTitle: 'تقرير النزاعات بين شركات المجموعة',
    headers: ['رقم النزاع', 'الجهة المصدرة', 'الجهة المستهدفة', 'الموضوع', 'المبلغ المطالب (ر.س)', 'حالة التسوية', 'الأولوية', 'التاريخ', 'التفاصيل'],
    dataMapper: (r: any) => [
      r.dispute_no || '',
      r.sender_entity || '',
      r.target_entity || '',
      r.subject || '',
      r.amount_claimed || 0,
      r.executive_status || '',
      r.priority || '',
      r.date || '',
      r.details || ''
    ]
  }
};

// ─── Company Header Info ─────────────────────────────────────────────

const COMPANY_INFO = {
  nameAr: 'مجموعة خالد السليم التجارية',
  nameEn: 'KHALID AL-SULAIM COMMERCIAL GROUP',
  tagline: 'نظام تخطيط الموارد المؤسسي ERP',
};

// ─── Export to Excel (XLSX) ──────────────────────────────────────────

export function exportToExcel(
  sectionKey: string,
  data: any[],
  customTitle?: string
): void {
  const config = SECTION_CONFIGS[sectionKey];
  if (!config) {
    console.error(`Export config not found for section: ${sectionKey}`);
    return;
  }

  const title = customTitle || config.sectionTitle;
  const now = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  // Build worksheet data
  const wsData: any[][] = [];

  // Row 1: Company name
  wsData.push([`${COMPANY_INFO.nameAr} — ${COMPANY_INFO.nameEn}`]);
  // Row 2: Report title + date
  wsData.push([`${title} — تاريخ التصدير: ${now}`]);
  // Row 3: Empty separator
  wsData.push([]);
  // Row 4: Column headers
  wsData.push(config.headers);
  // Row 5+: Data rows
  data.forEach(row => {
    wsData.push(config.dataMapper(row));
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths based on header lengths
  const colWidths = config.headers.map((h, i) => {
    const maxDataLen = data.reduce((max, row) => {
      const val = String(config.dataMapper(row)[i] || '');
      return Math.max(max, val.length);
    }, h.length);
    return { wch: Math.min(Math.max(maxDataLen + 4, 12), 45) };
  });
  ws['!cols'] = colWidths;

  // Merge company name row across all columns
  const colCount = config.headers.length;
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: colCount - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: colCount - 1 } }
  ];

  // Set RTL for the sheet
  ws['!sheetViews'] = [{ rightToLeft: true }];

  const wb = XLSX.utils.book_new();
  // Set workbook RTL
  if (!wb.Workbook) wb.Workbook = {};
  if (!wb.Workbook.Views) wb.Workbook.Views = [];
  wb.Workbook.Views[0] = { RTL: true };

  XLSX.utils.book_append_sheet(wb, ws, title.slice(0, 31));
  XLSX.writeFile(wb, `${title}.xlsx`);
}

// ─── Export to CSV ───────────────────────────────────────────────────

export function exportToCSV(
  sectionKey: string,
  data: any[],
  customTitle?: string
): void {
  const config = SECTION_CONFIGS[sectionKey];
  if (!config) {
    console.error(`Export config not found for section: ${sectionKey}`);
    return;
  }

  const title = customTitle || config.sectionTitle;
  const rows: string[] = [];

  // Header row
  rows.push(config.headers.map(h => `"${h}"`).join(','));

  // Data rows
  data.forEach(row => {
    const mapped = config.dataMapper(row);
    rows.push(mapped.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
  });

  const csvContent = rows.join('\n');

  // Add UTF-8 BOM for Arabic support
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${title}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ─── Export to PDF ───────────────────────────────────────────────────

export function exportToPDF(
  sectionKey: string,
  data: any[],
  customTitle?: string
): void {
  const config = SECTION_CONFIGS[sectionKey];
  if (!config) {
    console.error(`Export config not found for section: ${sectionKey}`);
    return;
  }

  const title = customTitle || config.sectionTitle;
  const now = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  // Create landscape PDF for wider tables
  const doc = new jsPDF({
    orientation: config.headers.length > 8 ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // ── Header Section ──
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(COMPANY_INFO.nameEn, pageWidth / 2, 12, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${COMPANY_INFO.tagline} | ${title}`, pageWidth / 2, 19, { align: 'center' });

  doc.setFontSize(9);
  doc.text(`Export Date: ${now} | Total Records: ${data.length}`, pageWidth / 2, 25, { align: 'center' });

  // ── Horizontal line ──
  doc.setDrawColor(0, 81, 84); // #005154
  doc.setLineWidth(0.5);
  doc.line(10, 28, pageWidth - 10, 28);

  // ── Table ──
  const startY = 32;
  const margin = 6;
  const tableWidth = pageWidth - margin * 2;
  const colWidth = tableWidth / config.headers.length;
  const rowHeight = 7;
  let currentY = startY;

  // Header row background
  doc.setFillColor(0, 81, 84); // #005154
  doc.rect(margin, currentY, tableWidth, rowHeight, 'F');

  // Header text
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  config.headers.forEach((header, i) => {
    const x = margin + i * colWidth + colWidth / 2;
    doc.text(header, x, currentY + 5, { align: 'center', maxWidth: colWidth - 2 });
  });

  currentY += rowHeight;

  // Data rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);

  data.forEach((row, rowIdx) => {
    // Page break check
    if (currentY + rowHeight > doc.internal.pageSize.getHeight() - 15) {
      doc.addPage();
      currentY = 15;

      // Re-draw header on new page
      doc.setFillColor(0, 81, 84);
      doc.rect(margin, currentY, tableWidth, rowHeight, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      config.headers.forEach((header, i) => {
        const x = margin + i * colWidth + colWidth / 2;
        doc.text(header, x, currentY + 5, { align: 'center', maxWidth: colWidth - 2 });
      });
      currentY += rowHeight;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
    }

    // Alternating row colors
    if (rowIdx % 2 === 0) {
      doc.setFillColor(245, 247, 250);
      doc.rect(margin, currentY, tableWidth, rowHeight, 'F');
    }

    // Row borders
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.1);
    doc.line(margin, currentY + rowHeight, margin + tableWidth, currentY + rowHeight);

    // Cell data
    doc.setTextColor(30, 30, 30);
    const mapped = config.dataMapper(row);
    mapped.forEach((val, i) => {
      const x = margin + i * colWidth + colWidth / 2;
      const text = String(val);
      doc.text(text, x, currentY + 5, { align: 'center', maxWidth: colWidth - 2 });
    });

    currentY += rowHeight;
  });

  // ── Footer ──
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `${COMPANY_INFO.nameEn} - ERP System | Page ${p} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 6,
      { align: 'center' }
    );
  }

  doc.save(`${title}.pdf`);
}

// ─── Quick Export Utility ────────────────────────────────────────────
// Used by pages that want to offer all three formats in a single call

export type ExportFormat = 'excel' | 'pdf' | 'csv';

export function exportData(
  sectionKey: string,
  data: any[],
  format: ExportFormat,
  customTitle?: string
): void {
  switch (format) {
    case 'excel':
      exportToExcel(sectionKey, data, customTitle);
      break;
    case 'pdf':
      exportToPDF(sectionKey, data, customTitle);
      break;
    case 'csv':
      exportToCSV(sectionKey, data, customTitle);
      break;
  }
}
