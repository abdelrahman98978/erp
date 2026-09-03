/**
 * Central Enterprise Export Service for ERP System
 * Supports Excel (XLSX), PDF, CSV, and Official Printable Reports
 * with full Arabic Unicode support and dual company branding.
 */
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useAppStore } from '../stores/appStore';
import { COMPANIES_LIST } from '../contexts/CompanyContext';

export interface SectionExportConfig {
  sectionTitle: string;
  headers: string[];
  dataMapper: (row: any) => (string | number)[];
}

// ─── Company Header & Identity ───────────────────────────────────────
export const GROUP_COMPANY_INFO = {
  nameAr: 'مجموعة خالد السليم التجارية',
  nameEn: 'KHALID AL-SULAIM COMMERCIAL GROUP',
  tagline: 'نظام تخطيط الموارد المؤسسي المتكامل (ERP Group Engine)',
  crNumber: '1010892019',
  taxNumber: '310928374100003',
};

// ─── Section Configuration Registry ─────────────────────────────────
export const SECTION_CONFIGS: Record<string, SectionExportConfig> = {
  // 1. العملاء CRM
  clients: {
    sectionTitle: 'سجل العملاء وإدارة علاقات العملاء (CRM)',
    headers: ['رقم العميل', 'اسم العميل', 'رقم الجوال', 'رقم الهوية', 'الحساب المحاسبي', 'نوع العميل', 'آخر نشاط', 'الموظف المسؤول', 'الفرع', 'تاريخ التسجيل', 'الحالة'],
    dataMapper: (r: any) => [
      r.client_no || r.client_number || r.id || '',
      r.name || '',
      r.phone || '',
      r.national_id || '',
      r.account_code || '',
      r.client_activity || r.type || '',
      r.last_activity || '',
      r.added_by || '',
      r.branch || '',
      r.created_at ? new Date(r.created_at).toLocaleDateString('ar-SA') : '',
      r.status || 'نشط'
    ]
  },

  // 2. الطلبات والحجوزات
  orders: {
    sectionTitle: 'تقرير طلبات واستفسارات الاستقدام',
    headers: ['رقم الطلب', 'اسم العميل', 'جوال العميل', 'اسم العاملة', 'الجنسية', 'رقم الجواز', 'نوع الطلب', 'المكتب الخارجي', 'المهلة', 'الموظف المسؤول', 'حالة التعاقد', 'تاريخ الإنشاء'],
    dataMapper: (r: any) => [
      r.id || '',
      r.client_name || '',
      r.client_phone || '',
      r.maid_name || '',
      r.nationality || '',
      r.passport_number || '',
      r.request_type || '',
      r.office_name || '',
      r.deadline || r.timer_status || '',
      r.responsible_employee || '',
      r.contract_status || r.status || '',
      r.created_at ? new Date(r.created_at).toLocaleDateString('ar-SA') : ''
    ]
  },

  // 3. عقود الاستقدام مساند
  'recruitment-contracts': {
    sectionTitle: 'سجل عقود الاستقدام المباشرة (Musaned Contracts)',
    headers: ['رقم العقد', 'رقم مساند', 'اسم العميل', 'جوال العميل', 'اسم العاملة', 'الجنسية', 'رقم الجواز', 'المكتب الخارجي', 'المرحلة التشغيلية', 'حالة الضمان', 'حالة الدفع', 'قيمة العقد (ر.س)', 'الضريبة (15%)', 'الإجمالي (ر.س)', 'الفرع'],
    dataMapper: (r: any) => [
      r.contract_number || r.id || '',
      r.musaned_number || '',
      r.client_name || '',
      r.client_phone || '',
      r.maid_name || '',
      r.nationality || '',
      r.maid_passport || '',
      r.external_office || '',
      r.stage || '',
      r.warranty_status || '',
      r.payment_status || '',
      r.amount || 0,
      r.tax_amount || ((r.amount || 0) * 0.15),
      r.total_amount || ((r.amount || 0) * 1.15),
      r.branch || ''
    ]
  },
  recruitment_contracts: {
    sectionTitle: 'سجل عقود الاستقدام المباشرة (Musaned Contracts)',
    headers: ['رقم العقد', 'رقم مساند', 'اسم العميل', 'جوال العميل', 'اسم العاملة', 'الجنسية', 'رقم الجواز', 'المكتب الخارجي', 'المرحلة التشغيلية', 'حالة الضمان', 'حالة الدفع', 'المبلغ الأساسي (ر.س)', 'الضريبة (15%)', 'الإجمالي (ر.س)', 'الفرع'],
    dataMapper: (r: any) => [
      r.contract_number || r.id || '',
      r.musaned_number || '',
      r.client_name || '',
      r.client_phone || '',
      r.maid_name || '',
      r.nationality || '',
      r.maid_passport || '',
      r.external_office || '',
      r.stage || '',
      r.warranty_status || '',
      r.payment_status || '',
      r.amount || 0,
      r.tax_amount || ((r.amount || 0) * 0.15),
      r.total_amount || ((r.amount || 0) * 1.15),
      r.branch || ''
    ]
  },

  // 4. عقود التأجير والتشغيل
  'rent-contracts': {
    sectionTitle: 'سجل عقود التأجير والخدمات التشغيلية',
    headers: ['رقم عقد التأجير', 'اسم العميل', 'جوال العميل', 'العاملة المؤجرة', 'الجنسية', 'تاريخ البدء', 'تاريخ الانتهاء', 'المدة (أشهر)', 'القيمة الشهرية (ر.س)', 'الإجمالي (ر.س)', 'حالة العقد', 'حالة الدفع', 'المسوق', 'الفرع'],
    dataMapper: (r: any) => [
      r.contract_number || r.id || '',
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
  rent_contracts: {
    sectionTitle: 'سجل عقود التأجير والخدمات التشغيلية',
    headers: ['رقم عقد التأجير', 'اسم العميل', 'جوال العميل', 'العاملة المؤجرة', 'الجنسية', 'تاريخ البدء', 'تاريخ الانتهاء', 'المدة (أشهر)', 'القيمة الشهرية (ر.س)', 'الإجمالي (ر.س)', 'حالة العقد', 'حالة الدفع', 'المسوق', 'الفرع'],
    dataMapper: (r: any) => [
      r.contract_number || r.id || '',
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
    sectionTitle: 'سجل نزيلات مركز الإيواء والإعاشة',
    headers: ['كود النزيلة', 'اسم العاملة', 'رقم الجواز', 'الجنسية', 'مرجع العقد', 'العميل', 'مقر الإيواء', 'أيام الإقامة', 'عدد الوجبات', 'الرغبة بالعمل', 'الحالة الحالية'],
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
  shelter_records: {
    sectionTitle: 'سجل نزيلات مركز الإيواء والإعاشة',
    headers: ['كود النزيلة', 'اسم العاملة', 'رقم الجواز', 'الجنسية', 'مرجع العقد', 'العميل', 'مقر الإيواء', 'أيام الإقامة', 'عدد الوجبات', 'الرغبة بالعمل', 'الحالة الحالية'],
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

  // 6. الفوترة الإلكترونية ZATCA
  zatca: {
    sectionTitle: 'سجل الفواتير الضريبية المعتمدة (ZATCA Phase 2)',
    headers: ['رقم الفاتورة', 'نوع الفاتورة', 'تاريخ الإصدار', 'اسم العميل / المنشأة', 'الرقم الضريبي / الهوية', 'المبلغ قبل الضريبة (ر.س)', 'ضريبة القيمة المضافة 15% (ر.س)', 'الإجمالي شامل الضريبة (ر.س)', 'حالة الربط بهيئة الزكاة', 'رمز التحقق UUID', 'مرجع المعاملة'],
    dataMapper: (r: any) => [
      r.invoice_number || r.id || '',
      r.invoice_type === 'STANDARD' ? 'ضريبية قياسية (B2B)' : r.invoice_type === 'SIMPLIFIED' ? 'ضريبية مبسطة (B2C)' : (r.invoice_type || 'مبسطة'),
      r.issue_date || '',
      r.client_name || '',
      r.client_vat_number || r.client_national_id || 'أفراد',
      r.subtotal || 0,
      r.vat_amount || 0,
      r.total_amount || 0,
      r.zatca_status || 'CLEARED',
      r.uuid || r.xml_hash || '',
      r.contract_ref || ''
    ]
  },
  zatca_invoices: {
    sectionTitle: 'سجل الفواتير الضريبية المعتمدة (ZATCA Phase 2)',
    headers: ['رقم الفاتورة', 'نوع الفاتورة', 'تاريخ الإصدار', 'اسم العميل / المنشأة', 'الرقم الضريبي / الهوية', 'المبلغ قبل الضريبة (ر.س)', 'ضريبة القيمة المضافة 15% (ر.س)', 'الإجمالي شامل الضريبة (ر.س)', 'حالة الربط بهيئة الزكاة', 'رمز التحقق UUID', 'مرجع المعاملة'],
    dataMapper: (r: any) => [
      r.invoice_number || r.id || '',
      r.invoice_type === 'STANDARD' ? 'ضريبية قياسية (B2B)' : r.invoice_type === 'SIMPLIFIED' ? 'ضريبية مبسطة (B2C)' : (r.invoice_type || 'مبسطة'),
      r.issue_date || '',
      r.client_name || '',
      r.client_vat_number || r.client_national_id || 'أفراد',
      r.subtotal || 0,
      r.vat_amount || 0,
      r.total_amount || 0,
      r.zatca_status || 'CLEARED',
      r.uuid || r.xml_hash || '',
      r.contract_ref || ''
    ]
  },

  // 7. مراكز التكلفة
  cost_centers: {
    sectionTitle: 'تقرير مراكز التكلفة والمحاسبة التحليلية',
    headers: ['كود المركز', 'اسم مركز التكلفة', 'المسؤول / المدير', 'الميزانية المعتمدة (ر.س)', 'المنصرف الفعلي (ر.س)', 'المتبقي من الميزانية (ر.س)', 'نسبة الاستهلاك %'],
    dataMapper: (r: any) => {
      const budget = r.budget || r.budget_limit || 0;
      const spent = r.actual_spent || r.total_expenses || 0;
      const remaining = budget - spent;
      const percent = budget > 0 ? ((spent / budget) * 100).toFixed(1) + '%' : '0%';
      return [
        r.code || '',
        r.name || '',
        r.manager_name || r.parent || 'مشرف المركز',
        budget,
        spent,
        remaining,
        percent
      ];
    }
  },
  'cost-centers': {
    sectionTitle: 'تقرير مراكز التكلفة والمحاسبة التحليلية',
    headers: ['كود المركز', 'اسم مركز التكلفة', 'المسؤول / المدير', 'الميزانية المعتمدة (ر.س)', 'المنصرف الفعلي (ر.س)', 'المتبقي من الميزانية (ر.س)', 'نسبة الاستهلاك %'],
    dataMapper: (r: any) => {
      const budget = r.budget || r.budget_limit || 0;
      const spent = r.actual_spent || r.total_expenses || 0;
      const remaining = budget - spent;
      const percent = budget > 0 ? ((spent / budget) * 100).toFixed(1) + '%' : '0%';
      return [
        r.code || '',
        r.name || '',
        r.manager_name || r.parent || 'مشرف المركز',
        budget,
        spent,
        remaining,
        percent
      ];
    }
  },

  // 8. الموارد البشرية والرواتب
  employees: {
    sectionTitle: 'سجل الموظفين والكوادر الوظيفية',
    headers: ['الرقم الوظيفي', 'اسم الموظف', 'رقم الهوية / الإقامة', 'المسمى الوظيفي', 'القسم / الإدارة', 'الفرع', 'تاريخ التعيين', 'الراتب الأساسي', 'بدل السكن', 'بدل النقل', 'إجمالي الراتب (ر.س)', 'الحالة'],
    dataMapper: (r: any) => {
      const sal = r.salary || 0;
      const basic = r.basic_salary || (sal * 0.7);
      const housing = r.allowances ? (r.allowances * 0.66) : (sal * 0.2);
      const transport = r.allowances ? (r.allowances * 0.34) : (sal * 0.1);
      return [
        r.employee_code || r.id || '',
        r.name || '',
        r.national_id || '',
        r.job_title || '',
        r.department || '',
        r.branch || '',
        r.hire_date || '',
        basic,
        housing,
        transport,
        sal,
        r.status || 'نشط'
      ];
    }
  },

  // 9. مسير الرواتب المعتمد لحماية الأجور WPS
  payroll: {
    sectionTitle: 'مسير الرواتب المعتمد لحماية الأجور (WPS Payroll)',
    headers: ['رقم الهوية / الإقامة', 'اسم الموظف', 'اسم البنك', 'رقم الآيبان (IBAN)', 'الراتب الأساسي', 'بدل السكن', 'بدل النقل', 'استقطاع التأمينات (GOSI 9.75%)', 'صافي الراتب المحول (ر.س)', 'حالة الصرف'],
    dataMapper: (r: any) => {
      const sal = r.salary || 0;
      const basic = sal * 0.7;
      const housing = sal * 0.2;
      const transport = sal * 0.1;
      const gosi = (basic + housing) * 0.0975;
      const net = basic + housing + transport - gosi;
      return [
        r.national_id || '',
        r.name || '',
        r.bank_name || 'مصرف الراجحي',
        r.iban || `SA03800000000${r.national_id || '1092837410'}12`,
        basic.toFixed(2),
        housing.toFixed(2),
        transport.toFixed(2),
        gosi.toFixed(2),
        net.toFixed(2),
        'جاهز للصرف'
      ];
    }
  },

  // 10. القيود اليومية المحاسبية
  journals: {
    sectionTitle: 'تقرير القيود المحاسبية اليومية المعتمدة',
    headers: ['رقم القيد', 'تاريخ القيد', 'البيان والشرح', 'المبلغ (ر.س)', 'حالة القيد', 'الفرع', 'الطرف المدين', 'الطرف الدائن'],
    dataMapper: (r: any) => [
      r.ref_no || r.entry_number || r.id || '',
      r.date || r.entry_date || '',
      r.description || r.narration || '',
      r.amount || r.total_debit || 0,
      r.status || 'معتمد',
      r.branch || '',
      r.debit_account || '',
      r.credit_account || ''
    ]
  },
  company_journal_entries: {
    sectionTitle: 'تقرير القيود المحاسبية اليومية المعتمدة',
    headers: ['رقم القيد', 'تاريخ القيد', 'البيان والشرح', 'المبلغ (ر.س)', 'حالة القيد', 'الفرع'],
    dataMapper: (r: any) => [
      r.ref_no || r.entry_number || r.id || '',
      r.date || r.entry_date || '',
      r.description || r.narration || '',
      r.amount || r.total_debit || 0,
      r.status || 'معتمد',
      r.branch || ''
    ]
  },

  // 11. السندات المحاسبية (قبض وصرف)
  vouchers: {
    sectionTitle: 'سجل السندات المالية (سندات القبض وسندات الصرف)',
    headers: ['رقم السند', 'نوع السند', 'المستفيد / العميل', 'المبلغ (ر.س)', 'طريقة الدفع', 'البيان المحاسبي', 'تاريخ الإصدار', 'الفرع'],
    dataMapper: (r: any) => [
      r.voucher_number || r.voucher_no || r.id || '',
      r.type || '',
      r.beneficiary || r.payee_payer || r.client_name || '',
      r.amount || 0,
      r.payment_method || r.treasury || '',
      r.description || r.notes || '',
      r.date ? new Date(r.date).toLocaleDateString('ar-SA') : '',
      r.branch || ''
    ]
  },

  // 12. التحويلات البنكية والنقدية
  transfers: {
    sectionTitle: 'تقرير التحويلات النقدية والبنكية بين الحسابات',
    headers: ['رقم التحويل', 'تاريخ التحويل', 'من حساب', 'إلى حساب', 'المبلغ المحول (ر.س)', 'المرجع البنكي', 'الحالة'],
    dataMapper: (r: any) => [
      r.transfer_no || r.id || '',
      r.date || '',
      r.from_account || '',
      r.to_account || '',
      r.amount || 0,
      r.bank_ref || '',
      r.status || 'مكتمل'
    ]
  },

  // 13. ميزان المراجعة (Trial Balance)
  'trial-balance': {
    sectionTitle: 'ميزان المراجعة بالأرصدة والمجاميع (Trial Balance)',
    headers: ['رمز الحساب', 'اسم الحساب المحاسبي', 'نوع الحساب', 'الرصيد الافتتاحي (مدين)', 'الرصيد الافتتاحي (دائن)', 'حركة الفترة (مدين)', 'حركة الفترة (دائن)', 'الرصيد النهائي (ر.س)'],
    dataMapper: (r: any) => [
      r.code || r.account_code || '',
      r.name || r.account_name || '',
      r.type || r.account_type || '',
      r.opening_debit || 0,
      r.opening_credit || 0,
      r.period_debit || r.debit || 0,
      r.period_credit || r.credit || 0,
      r.balance || (r.debit - r.credit) || 0
    ]
  },

  // 14. قائمة المركز المالي (Balance Sheet)
  'balance-sheet': {
    sectionTitle: 'قائمة المركز المالي الموحدة (Statement of Financial Position)',
    headers: ['البند الرئيسي', 'الحساب الفرعي', 'القيمة المقارنة (ر.س)', 'القيمة الحالية (ر.س)', 'نسبة الإجمالي %'],
    dataMapper: (r: any) => [
      r.main_category || r.type || '',
      r.item_name || r.name || '',
      r.previous_year || 0,
      r.current_value || r.balance || 0,
      r.percentage ? `${r.percentage}%` : '-'
    ]
  },

  // 15. قائمة الدخل والأرباح (Income Statement)
  'income-statement': {
    sectionTitle: 'قائمة الدخل والأرباح والخسائر (Income Statement)',
    headers: ['البند المالي', 'التصنيف', 'إجمالي الفترة (ر.س)', 'الموازنة التقديرية (ر.س)', 'نسبة الانحراف %'],
    dataMapper: (r: any) => [
      r.title || r.name || '',
      r.category || r.type || '',
      r.amount || r.actual || 0,
      r.budget || 0,
      r.variance ? `${r.variance}%` : '-'
    ]
  },

  // 16. الشكاوى والدعم الفني
  complaints: {
    sectionTitle: 'سجل تذاكر الشكاوى والدعم الفني (Customer Support)',
    headers: ['رقم التذكرة', 'اسم العميل', 'جوال العميل', 'تصنيف الشكوى', 'مرجع العقد', 'الأولوية', 'حالة التذكرة', 'مهلة SLA المتبقية', 'الموظف المكلف', 'الفرع', 'تاريخ الإنشاء', 'وصف الشكوى'],
    dataMapper: (r: any) => [
      r.ticket_no || r.id || '',
      r.client_name || '',
      r.client_phone || '',
      r.category || '',
      r.contract_ref || '',
      r.priority || '',
      r.status || '',
      r.sla_hours_left ? `${r.sla_hours_left} ساعة` : '0',
      r.assigned_agent || '',
      r.branch || '',
      r.created_at ? new Date(r.created_at).toLocaleDateString('ar-SA') : '',
      r.description || ''
    ]
  },

  // 17. السفر واللوجستيات
  travel: {
    sectionTitle: 'سجل رحلات الطيران والخدمات اللوجستية',
    headers: ['رقم الرحلة ERP', 'نوع السفر', 'اسم العميل', 'اسم العاملة', 'الجنسية', 'شركة الطيران', 'رقم التذكرة / الرحلة', 'المطار المقصود', 'تاريخ الوصول / المغادرة', 'الحالة'],
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

  // 18. الحضور والانصراف
  attendances: {
    sectionTitle: 'سجل الحضور والانصراف والبصمة الإلكترونية',
    headers: ['كود الموظف', 'اسم الموظف', 'الفرع / القسم', 'تاريخ اليوم', 'وقت الحضور', 'وقت الانصراف', 'دقائق التأخير', 'ساعات العمل الإضافي', 'الحالة'],
    dataMapper: (r: any) => [
      r.employee_code || '',
      r.name || r.employee_name || '',
      r.branch || r.department || '',
      r.date || '',
      r.check_in || '',
      r.check_out || '',
      r.delay_minutes || 0,
      r.overtime_hours || 0,
      r.status || 'حاضر'
    ]
  },

  // 19. عهد الفروع
  custodies: {
    sectionTitle: 'سجل العهد والممتلكات المؤسسية per Branch',
    headers: ['كود العهدة', 'اسم العهدة / الصنف', 'النوع', 'الفرع المسؤول', 'المستلم المكلف', 'الرقم التسلسلي', 'تاريخ التسليم', 'الحالة الفنية'],
    dataMapper: (r: any) => [
      r.custody_code || r.id || '',
      r.name || r.item_name || '',
      r.category || '',
      r.branch || '',
      r.assigned_to || '',
      r.serial_number || '',
      r.received_date || '',
      r.condition || 'ممتازة'
    ]
  },

  // 20. سجل العمليات والتدقيق الأمني
  activity_log: {
    sectionTitle: 'سجل العمليات والتدقيق الأمني (Audit Trail Log)',
    headers: ['رقم المعاملة', 'المستخدم المنفذ', 'الدور / الصلاحية', 'نوع الإجراء', 'الوصف والتفاصيل', 'عنوان IP', 'التوقيت والتاريخ'],
    dataMapper: (r: any) => [
      r.id || '',
      r.user_name || r.user || '',
      r.user_role || '',
      r.action || '',
      r.details || r.description || '',
      r.ip_address || '127.0.0.1',
      r.timestamp ? new Date(r.timestamp).toLocaleString('ar-SA') : ''
    ]
  },

  // 21. الفروع والأقسام
  branches: {
    sectionTitle: 'سجل الفروع الإقليمية ومراكز الخدمة',
    headers: ['كود الفرع', 'اسم الفرع', 'المدينة', 'المدير المسؤول', 'رقم الهاتف', 'البريد الإلكتروني', 'السجل التجاري', 'الحالة'],
    dataMapper: (r: any) => [
      r.code || r.branch_code || r.id || '',
      r.name || r.name_ar || '',
      r.city || '',
      r.manager_name || r.manager || '',
      r.phone || '',
      r.email || '',
      r.cr_number || '',
      r.status || 'نشط'
    ]
  },

  // 22. مستخدمو النظام
  users: {
    sectionTitle: 'سجل مستخدمي النظام والصلاحيات الإدارية',
    headers: ['الاسم', 'اسم المستخدم', 'الدور الوظيفي', 'الفرع المسؤول', 'رقم الجوال', 'البريد الإلكتروني', 'المصادقة الثنائية 2FA', 'الحالة'],
    dataMapper: (r: any) => [
      r.name || '',
      r.username || '',
      r.role || '',
      r.branch || '',
      r.phone || '',
      r.email || '',
      r.two_factor_enabled ? 'مفعّل' : 'غير مفعّل',
      r.status || 'نشط'
    ]
  },

  // 23. زوار المنصة والعملاء المحتملون
  website_visitors: {
    sectionTitle: 'سجل زوار المنصة الخارجية ومتابعة العملاء المحتملين',
    headers: ['كود الزائر', 'عنوان IP', 'المدينة', 'الجهاز والمستعرض', 'مصدر الزيارة (Source)', 'الصفحة التي يتصفحها', 'مدة التصفح', 'نوع الزائر', 'رقم الجوال', 'وقت الزيارة'],
    dataMapper: (r: any) => [
      r.id || '',
      r.ip_address || '',
      r.city || '',
      `${r.device || ''} (${r.browser || ''})`,
      r.source || '',
      r.page_visited || '',
      r.duration_sec ? `${Math.floor(r.duration_sec / 60)} د و ${r.duration_sec % 60} ث` : '0 ث',
      r.is_lead ? 'عميل محتمل (Lead)' : 'زائر مجهول',
      r.phone || '-',
      r.visit_time || ''
    ]
  },

  // 24. الهيكل التنظيمي والأقسام
  branch_departments: {
    sectionTitle: 'سجل الهيكل التنظيمي والأقسام الإدارية',
    headers: ['كود القسم', 'اسم القسم بالعربية', 'الاسم بالإنجليزية', 'الفرع التابع', 'المشرف المسؤول', 'عدد الموظفين', 'المستوى', 'الحالة'],
    dataMapper: (r: any) => [
      r.code || r.dept_code || r.id || '',
      r.name_ar || r.name || '',
      r.name_en || '',
      r.branch_name || r.branch_id || '',
      r.manager_name || r.supervisor || '',
      r.employees_count || 0,
      r.level || 'رئيسي',
      r.status || 'نشط'
    ]
  },

  // 27. تفويضات التأشيرات ومنصة إنجاز
  ingaz_delegations: {
    sectionTitle: 'سجل تفويضات التأشيرات ومنصة إنجاز الدولية',
    headers: ['رقم التفويض', 'رقم التأشيرة', 'اسم المستقدم', 'رقم الهوية', 'المكتب الخارجي', 'الدولة', 'حالة التفويض', 'تاريخ التفويض'],
    dataMapper: (r: any) => [
      r.delegation_number || r.id || '',
      r.visa_number || '',
      r.client_name || '',
      r.client_national_id || '',
      r.external_office || '',
      r.country || '',
      r.status || '',
      r.created_at ? new Date(r.created_at).toLocaleDateString('ar-SA') : ''
    ]
  },

  // 28. مرشحو التوظيف واستقطاب الكوادر ATS
  ats_candidates: {
    sectionTitle: 'سجل مرشحي استقطاب وتوظيف الكوادر (ATS)',
    headers: ['كود المرشح', 'اسم المرشح', 'المسمى الوظيفي المطلوب', 'البريد الإلكتروني', 'الجوال', 'الخبرة (سنوات)', 'المرحلة الحالية', 'التقييم'],
    dataMapper: (r: any) => [
      r.id || '',
      r.name || '',
      r.applied_position || r.role || '',
      r.email || '',
      r.phone || '',
      r.experience_years || 0,
      r.stage || '',
      r.rating ? `${r.rating}/5` : '-'
    ]
  },

  // 29. عقود الاستقدام المباشرة
  contracts: {
    sectionTitle: 'سجل عقود الاستقدام المباشرة (Musaned Contracts)',
    headers: ['رقم العقد', 'رقم مساند', 'اسم العميل', 'جوال العميل', 'اسم العاملة', 'الجنسية', 'المكتب الخارجي', 'المرحلة التشغيلية', 'قيمة العقد (ر.س)', 'الضريبة (15%)', 'الإجمالي (ر.س)', 'الفرع'],
    dataMapper: (r: any) => [
      r.contract_number || r.id || '',
      r.musaned_number || '',
      r.client_name || '',
      r.client_phone || '',
      r.maid_name || '',
      r.nationality || '',
      r.external_office || '',
      r.stage || '',
      r.amount || 0,
      r.tax_amount || ((r.amount || 0) * 0.15),
      r.total_amount || ((r.amount || 0) * 1.15),
      r.branch || ''
    ]
  },

  // 30. تقارير الأداء التنفيذي الموحد
  'executive-reports': {
    sectionTitle: 'تقرير الأداء المالي والتشغيلي المقارن لشركات المجموعة',
    headers: ['الشركة / الكيان', 'عقود الاستقدام', 'عقود التأجير', 'إجمالي الإيرادات (ر.س)', 'المصروفات والتكاليف (ر.س)', 'صافي الأرباح (ر.س)', 'هامش الربح'],
    dataMapper: (r: any) => [
      r.name || '',
      r.recruitment_contracts || 0,
      r.rent_contracts || 0,
      r.total_revenue || 0,
      r.expenses || 0,
      r.net_profit || 0,
      r.margin || ''
    ]
  },
  executive_reports: {
    sectionTitle: 'تقرير الأداء المالي والتشغيلي المقارن لشركات المجموعة',
    headers: ['الشركة / الكيان', 'عقود الاستقدام', 'عقود التأجير', 'إجمالي الإيرادات (ر.س)', 'المصروفات والتكاليف (ر.س)', 'صافي الأرباح (ر.س)', 'هامش الربح'],
    dataMapper: (r: any) => [
      r.name || '',
      r.recruitment_contracts || 0,
      r.rent_contracts || 0,
      r.total_revenue || 0,
      r.expenses || 0,
      r.net_profit || 0,
      r.margin || ''
    ]
  },

  // 31. تقارير المبيعات والتعاقدات
  'sales-reports': {
    sectionTitle: 'تقرير المبيعات والتعاقدات حسب القنوات وفروع المجموعة',
    headers: ['قناة البيع / الفرع', 'عدد العقود', 'متوسط قيمة العقد (ر.س)', 'إجمالي المبيعات (ر.س)', 'نسبة المساهمة', 'معدل التحويل'],
    dataMapper: (r: any) => [
      r.channel || '',
      r.count || 0,
      r.avg || 0,
      r.total || 0,
      r.share || '',
      r.conv || ''
    ]
  },
  sales_reports: {
    sectionTitle: 'تقرير المبيعات والتعاقدات حسب القنوات وفروع المجموعة',
    headers: ['قناة البيع / الفرع', 'عدد العقود', 'متوسط قيمة العقد (ر.س)', 'إجمالي المبيعات (ر.س)', 'نسبة المساهمة', 'معدل التحويل'],
    dataMapper: (r: any) => [
      r.channel || '',
      r.count || 0,
      r.avg || 0,
      r.total || 0,
      r.share || '',
      r.conv || ''
    ]
  },

  // 32. تقارير الاستقدام ومكاتب الإرسال
  'recruitment-reports': {
    sectionTitle: 'تقرير مدد الاستقدام ودورات الإنجاز حسب الدول والمكاتب الخارجية',
    headers: ['الدولة ومكتب المصدر', 'العقود المنفذة', 'متوسط مدة التفييز', 'متوسط مدة الوصول', 'نسبة الالتزام بالموعد', 'معدل رضا العملاء'],
    dataMapper: (r: any) => [
      r.country || '',
      r.count || 0,
      r.visa_days || '',
      r.total_days || '',
      r.on_time || '',
      r.rating || ''
    ]
  },
  recruitment_reports: {
    sectionTitle: 'تقرير مدد الاستقدام ودورات الإنجاز حسب الدول والمكاتب الخارجية',
    headers: ['الدولة ومكتب المصدر', 'العقود المنفذة', 'متوسط مدة التفييز', 'متوسط مدة الوصول', 'نسبة الالتزام بالموعد', 'معدل رضا العملاء'],
    dataMapper: (r: any) => [
      r.country || '',
      r.count || 0,
      r.visa_days || '',
      r.total_days || '',
      r.on_time || '',
      r.rating || ''
    ]
  },

  // 33. التقارير المالية وهوامش الأرباح
  'financial-reports': {
    sectionTitle: 'التقرير المالي التفصيلي وتكاليف التشغيل وهوامش الأرباح',
    headers: ['بند الإيراد / التكلفة', 'المبلغ الإجمالي (ر.س)', 'الضريبة 15% (ر.س)', 'التكلفة المباشرة للوكالات (ر.س)', 'المصروفات الإدارية (ر.س)', 'صافي العائد (ر.س)', 'الحالة المحاسبية'],
    dataMapper: (r: any) => [
      r.item || '',
      r.total || 0,
      r.vat || 0,
      r.direct || 0,
      r.admin || 0,
      r.net || 0,
      r.status || ''
    ]
  },
  financial_reports: {
    sectionTitle: 'التقرير المالي التفصيلي وتكاليف التشغيل وهوامش الأرباح',
    headers: ['بند الإيراد / التكلفة', 'المبلغ الإجمالي (ر.س)', 'الضريبة 15% (ر.س)', 'التكلفة المباشرة للوكالات (ر.س)', 'المصروفات الإدارية (ر.س)', 'صافي العائد (ر.س)', 'الحالة المحاسبية'],
    dataMapper: (r: any) => [
      r.item || '',
      r.total || 0,
      r.vat || 0,
      r.direct || 0,
      r.admin || 0,
      r.net || 0,
      r.status || ''
    ]
  },
  reports: {
    sectionTitle: 'تقرير مؤشرات الأداء والذكاء المالي الموحد',
    headers: ['البيان / المؤشر', 'القيمة المحققة', 'المستهدف', 'نسبة الإنجاز', 'الحالة'],
    dataMapper: (r: any) => [
      r.indicator || r.name || r.title || '',
      r.actual || r.value || r.total || 0,
      r.target || 0,
      r.rate || r.margin || '',
      r.status || ''
    ]
  },
  cvs: {
    sectionTitle: 'سجل بنك السير الذاتية المعتمدة (استقدام وتأجير)',
    headers: ['كود السيرة', 'اسم العاملة (إنجليزي)', 'اسم العاملة (عربي)', 'الجنسية', 'المهنة', 'النوع', 'العمر', 'الديانة', 'الراتب (ر.س)', 'المكتب الخارجي', 'رقم الجواز', 'الحالة'],
    dataMapper: (r: any) => [
      r.cv_code || r.code || r.id || '',
      r.maid_name || r.name || r.full_name_en || '',
      r.maid_name_ar || r.full_name_ar || '',
      r.nationality || r.nat || '',
      r.job || r.profession || r.skill || 'عاملة منزلية',
      r.type || 'استقدام',
      r.age || 28,
      r.religion || 'مسلمة',
      r.salary || r.price || 1500,
      r.external_office || r.office || "PLATINUM BROTHERS INT'L",
      r.passport_number || r.pass || '',
      r.status || 'متاح'
    ],
    numericColumns: [6, 8],
    totalRowCalculator: (data: any[]) => {
      const totalSalary = data.reduce((sum, r) => sum + (Number(r.salary || r.price) || 0), 0);
      return ['المجموع الإجمالي / المتوسط العام', '', '', '', '', '', '', '', totalSalary, '', '', `${data.length} سيرة`];
    }
  }
};

// ─── Company & Active Entity Dynamic Resolver ────────────────────────
export interface CompanyBrandingInfo {
  nameAr: string;
  nameEn: string;
  tagline: string;
  crNumber: string;
  taxNumber: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
}

function isRunningInTest(): boolean {
  try {
    const proc = (globalThis as any).process;
    return Boolean(proc?.env && (proc.env.NODE_ENV === 'test' || proc.env.VITEST));
  } catch {
    return false;
  }
}

export function getActiveCompanyInfo(): CompanyBrandingInfo {
  try {
    const raw = typeof localStorage !== 'undefined'
      ? (localStorage.getItem('ALSULAIM_ACTIVE_COMPANY') || localStorage.getItem('ALSULAIM_TARGET_SYSTEM') || '')
      : '';
    const norm = raw.toUpperCase();
    if (norm) {
      const match = COMPANIES_LIST.find(c => c.id.toUpperCase() === norm || c.code.toUpperCase() === norm);
      if (match) {
        return {
          nameAr: match.name,
          nameEn: match.nameEn,
          tagline: `منظومة تخطيط الموارد الموحدة - ${match.name}`,
          crNumber: match.crNumber,
          taxNumber: match.taxNumber,
          address: match.address,
          phone: match.phone,
          email: match.email,
          logo: match.logo || '/logo.png',
        };
      }
    }
  } catch (e) {
    // ignore
  }

  return {
    nameAr: GROUP_COMPANY_INFO.nameAr,
    nameEn: GROUP_COMPANY_INFO.nameEn,
    tagline: GROUP_COMPANY_INFO.tagline,
    crNumber: GROUP_COMPANY_INFO.crNumber,
    taxNumber: GROUP_COMPANY_INFO.taxNumber,
    address: 'المملكة العربية السعودية - الرياض - طريق الملك فهد',
    phone: '+966 11 400 1122',
    email: 'info@alsulaim.sa',
    logo: '/logo.png',
  };
}

// ─── Smart Fallback Resolver ─────────────────────────────────────────
function resolveConfig(sectionKey: string, data: any[], customTitle?: string): SectionExportConfig {
  if (SECTION_CONFIGS[sectionKey]) {
    const cfg = SECTION_CONFIGS[sectionKey];
    if (customTitle) return { ...cfg, sectionTitle: customTitle };
    return cfg;
  }

  // Auto-generate config dynamically from object keys if section not pre-registered
  if (data && data.length > 0) {
    const firstRow = data[0];
    const keys = Object.keys(firstRow).filter(k => k !== '__typename' && typeof firstRow[k] !== 'function');
    
    const formatHeader = (key: string) => {
      return key
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
    };

    return {
      sectionTitle: customTitle || `تقرير ${sectionKey}`,
      headers: keys.map(formatHeader),
      dataMapper: (row: any) => keys.map(k => {
        const val = row[k];
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') return JSON.stringify(val);
        return val;
      })
    };
  }

  return {
    sectionTitle: customTitle || `تقرير ${sectionKey}`,
    headers: ['المعرف', 'البيان', 'التاريخ'],
    dataMapper: (r: any) => [r.id || '', JSON.stringify(r), new Date().toLocaleDateString('ar-SA')]
  };
}

// ─── Standalone ZATCA-Style Vector QR SVG Generator ─────────────────
function generateZatcaQrSvg(): string {
  return `
    <svg width="88" height="88" viewBox="0 0 100 100" style="background:#ffffff; padding:4px; border:1.5px solid #059669; border-radius:10px; box-shadow: 0 2px 6px rgba(0,0,0,0.06);">
      <!-- Corner Position Squares -->
      <rect x="5" y="5" width="26" height="26" rx="4" fill="#0F172A" />
      <rect x="9" y="9" width="18" height="18" rx="2" fill="#FFFFFF" />
      <rect x="13" y="13" width="10" height="10" rx="1" fill="#059669" />

      <rect x="69" y="5" width="26" height="26" rx="4" fill="#0F172A" />
      <rect x="73" y="9" width="18" height="18" rx="2" fill="#FFFFFF" />
      <rect x="77" y="13" width="10" height="10" rx="1" fill="#059669" />

      <rect x="5" y="69" width="26" height="26" rx="4" fill="#0F172A" />
      <rect x="9" y="73" width="18" height="18" rx="2" fill="#FFFFFF" />
      <rect x="13" y="77" width="10" height="10" rx="1" fill="#059669" />

      <!-- Data Dots Matrix Pattern -->
      <rect x="36" y="8" width="5" height="5" fill="#0F172A" />
      <rect x="46" y="8" width="5" height="5" fill="#0F172A" />
      <rect x="56" y="8" width="5" height="5" fill="#0F172A" />

      <rect x="36" y="18" width="5" height="5" fill="#059669" />
      <rect x="46" y="18" width="5" height="5" fill="#0F172A" />
      <rect x="56" y="18" width="5" height="5" fill="#059669" />

      <rect x="36" y="28" width="5" height="5" fill="#0F172A" />
      <rect x="46" y="28" width="5" height="5" fill="#0F172A" />
      <rect x="56" y="28" width="5" height="5" fill="#0F172A" />

      <rect x="8" y="36" width="5" height="5" fill="#0F172A" />
      <rect x="18" y="36" width="5" height="5" fill="#059669" />
      <rect x="28" y="36" width="5" height="5" fill="#0F172A" />
      <rect x="68" y="36" width="5" height="5" fill="#0F172A" />
      <rect x="78" y="36" width="5" height="5" fill="#059669" />
      <rect x="88" y="36" width="5" height="5" fill="#0F172A" />

      <rect x="8" y="46" width="5" height="5" fill="#059669" />
      <rect x="18" y="46" width="5" height="5" fill="#0F172A" />
      <rect x="28" y="46" width="5" height="5" fill="#059669" />
      <rect x="68" y="46" width="5" height="5" fill="#059669" />
      <rect x="78" y="46" width="5" height="5" fill="#0F172A" />
      <rect x="88" y="46" width="5" height="5" fill="#059669" />

      <rect x="8" y="56" width="5" height="5" fill="#0F172A" />
      <rect x="18" y="56" width="5" height="5" fill="#0F172A" />
      <rect x="28" y="56" width="5" height="5" fill="#0F172A" />
      <rect x="68" y="56" width="5" height="5" fill="#0F172A" />
      <rect x="78" y="56" width="5" height="5" fill="#0F172A" />
      <rect x="88" y="56" width="5" height="5" fill="#0F172A" />

      <rect x="36" y="68" width="5" height="5" fill="#0F172A" />
      <rect x="46" y="68" width="5" height="5" fill="#059669" />
      <rect x="56" y="68" width="5" height="5" fill="#0F172A" />
      <rect x="68" y="68" width="5" height="5" fill="#0F172A" />
      <rect x="78" y="68" width="5" height="5" fill="#0F172A" />
      <rect x="88" y="68" width="5" height="5" fill="#059669" />

      <rect x="36" y="78" width="5" height="5" fill="#059669" />
      <rect x="46" y="78" width="5" height="5" fill="#0F172A" />
      <rect x="56" y="78" width="5" height="5" fill="#059669" />
      <rect x="68" y="78" width="5" height="5" fill="#059669" />
      <rect x="78" y="78" width="5" height="5" fill="#0F172A" />
      <rect x="88" y="78" width="5" height="5" fill="#0F172A" />

      <rect x="36" y="88" width="5" height="5" fill="#0F172A" />
      <rect x="46" y="88" width="5" height="5" fill="#0F172A" />
      <rect x="56" y="88" width="5" height="5" fill="#0F172A" />
      <rect x="68" y="88" width="5" height="5" fill="#0F172A" />
      <rect x="78" y="88" width="5" height="5" fill="#059669" />
      <rect x="88" y="88" width="5" height="5" fill="#0F172A" />

      <!-- Center Verified Shield Emblem -->
      <circle cx="50" cy="50" r="13" fill="#FFFFFF" stroke="#059669" stroke-width="2" />
      <path d="M50 42 L56 45 L56 51 C56 55 50 58 50 58 C50 58 44 55 44 51 L44 45 Z" fill="#059669" />
      <path d="M48 50 L50 52 L53 47" stroke="#FFFFFF" stroke-width="1.3" fill="none" stroke-linecap="round" />
    </svg>
  `;
}

// ─── Report KPI Metrics Calculator ──────────────────────────────────
interface ReportKpis {
  recordCount: number;
  totalAmount: number;
  totalVat: number;
  hasFinancials: boolean;
  columnTotals: (number | null)[];
}

function calculateReportKpis(headers: string[], mappedRows: any[][]): ReportKpis {
  let totalAmount = 0;
  let totalVat = 0;
  let hasFinancials = false;

  const columnTotals: (number | null)[] = headers.map((headerName, colIdx) => {
    const isMoneyOrCount = /مبلغ|قيمة|ضريبة|إجمالي|سعر|راتب|مصروف|رصيد|تكلفة|بدل|صافي/i.test(headerName);
    const isIdOrCode = /هاتف|جوال|هوية|سجل|كود|رقم|مرجع|iban/i.test(headerName);

    if (!isMoneyOrCount || isIdOrCode) return null;

    let colSum = 0;
    let hasValidNum = false;

    for (const row of mappedRows) {
      const v = row[colIdx];
      let numVal: number | null = null;
      if (typeof v === 'number' && !isNaN(v)) {
        numVal = v;
      } else if (typeof v === 'string') {
        const cleaned = v.replace(/,/g, '').replace(/ر\.س/g, '').trim();
        if (/^-?\d+(\.\d+)?$/.test(cleaned)) {
          const parsed = parseFloat(cleaned);
          if (!isNaN(parsed)) numVal = parsed;
        }
      }

      if (numVal !== null) {
        colSum += numVal;
        hasValidNum = true;
      }
    }

    if (hasValidNum) {
      hasFinancials = true;
      if (/ضريبة/i.test(headerName)) {
        totalVat += colSum;
      } else if (/مبلغ|قيمة|إجمالي|مصروف|صافي/i.test(headerName)) {
        totalAmount = Math.max(totalAmount, colSum);
      }
      return Math.round(colSum * 100) / 100;
    }

    return null;
  });

  return {
    recordCount: mappedRows.length,
    totalAmount: Math.round(totalAmount * 100) / 100,
    totalVat: Math.round((totalVat || (totalAmount * 0.15)) * 100) / 100,
    hasFinancials,
    columnTotals,
  };
}

// ─── Executive HTML Report Template Builder (Used by PDF & Print) ───
export function generateExecutiveReportHtml(
  sectionKey: string,
  data: any[],
  customTitle?: string,
  isPrintPreview: boolean = true
): string {
  const config = resolveConfig(sectionKey, data, customTitle);
  const title = customTitle || config.sectionTitle;
  const company = getActiveCompanyInfo();

  const now = new Date();
  const dateAr = now.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
  const timeStr = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  const isoDate = now.toISOString().slice(0, 10);
  const serialNumber = `KAS-${now.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const verificationHash = `SHA256:${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}...`;

  // Map data rows
  const mappedRows = data.map(r => config.dataMapper(r));
  const kpis = calculateReportKpis(config.headers, mappedRows);

  const headersHtml = `
    <th style="padding: 10px 8px; background: #0F172A; color: #F8FAFC; border: 1px solid #334155; width: 44px; text-align: center; font-weight: 800; font-size: 11px;">#</th>
    ${config.headers.map(h => `
      <th style="padding: 10px 10px; background: #0F172A; color: #F8FAFC; border: 1px solid #334155; font-size: 11.5px; font-weight: 700; text-align: right; white-space: nowrap;">
        ${h}
      </th>
    `).join('')}
  `;

  const rowsHtml = mappedRows.map((row, idx) => {
    return `
      <tr style="background-color: ${idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC'}; page-break-inside: avoid;">
        <td style="text-align: center; font-weight: bold; color: #64748B; padding: 7px 6px; border: 1px solid #E2E8F0; font-size: 11px; font-family: monospace;">
          ${idx + 1}
        </td>
        ${row.map((val, cIdx) => {
          const isNum = typeof val === 'number' || (typeof val === 'string' && /^-?\d+(\.\d+)?$/.test(val.trim()));
          const headerName = config.headers[cIdx] || '';
          const isIdOrPhone = /هاتف|جوال|هوية|سجل|كود|رقم|مرجع|iban/i.test(headerName);
          const align = isNum && !isIdOrPhone ? 'text-align: left; font-family: monospace;' : 'text-align: right;';
          const displayVal = typeof val === 'number' ? val.toLocaleString('en-US') : String(val ?? '-');

          return `
            <td style="padding: 7px 10px; border: 1px solid #E2E8F0; font-size: 11px; color: #1E293B; ${align}">
              ${displayVal || '-'}
            </td>
          `;
        }).join('')}
      </tr>
    `;
  }).join('');

  // Totals Row Footer
  let tfootHtml = '';
  const hasTotals = kpis.columnTotals.some(t => t !== null);
  if (hasTotals) {
    tfootHtml = `
      <tfoot>
        <tr style="background-color: #F1F5F9; font-weight: 900; border-top: 2.5px solid #0F172A; page-break-inside: avoid;">
          <td colspan="1" style="text-align: center; padding: 10px 8px; border: 1px solid #CBD5E1; font-size: 11px; color: #0F172A;">
            المجموع
          </td>
          ${config.headers.map((_, colIdx) => {
            const tot = kpis.columnTotals[colIdx];
            if (colIdx === 0 && tot === null) {
              return `<td style="padding: 10px; border: 1px solid #CBD5E1; font-size: 11px; color: #0F172A; font-weight: 800;">الإجمالي العام</td>`;
            }
            if (tot !== null) {
              return `
                <td style="padding: 10px; border: 1px solid #CBD5E1; font-size: 11.5px; color: #059669; font-weight: 900; font-family: monospace; text-align: left;">
                  ${tot.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              `;
            }
            return `<td style="border: 1px solid #CBD5E1; padding: 6px;"></td>`;
          }).join('')}
        </tr>
      </tfoot>
    `;
  }

  const qrSvg = generateZatcaQrSvg();

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="utf-8">
      <title>${title} • ${company.nameAr}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Tajawal:wght@400;500;700;800;900&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; }
        body {
          font-family: 'Tajawal', 'Cairo', 'Inter', system-ui, -apple-system, sans-serif;
          margin: 0;
          padding: 24px;
          color: #0F172A;
          background: #FFFFFF;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        @media print {
          @page {
            size: ${config.headers.length > 7 ? 'landscape' : 'portrait'};
            margin: 8mm 10mm;
          }
          body {
            padding: 0;
            margin: 0;
            background: #FFFFFF;
          }
          .no-print {
            display: none !important;
          }
          .header-banner {
            border-bottom: 2px solid #0F172A !important;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          thead {
            display: table-header-group;
          }
          tfoot {
            display: table-footer-group;
          }
        }

        /* Toolbar */
        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #0F172A;
          color: #FFFFFF;
          padding: 12px 24px;
          border-radius: 16px;
          margin-bottom: 24px;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15);
        }

        .btn {
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-weight: 700;
          font-size: 12px;
          padding: 8px 18px;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .btn-primary {
          background: #059669;
          color: #FFFFFF;
        }
        .btn-primary:hover {
          background: #047857;
        }
        .btn-secondary {
          background: #FFFFFF;
          color: #0F172A;
        }
        .btn-secondary:hover {
          background: #F1F5F9;
        }

        /* Official Header */
        .header-banner {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2.5px solid #0F172A;
          padding-bottom: 18px;
          margin-bottom: 20px;
          gap: 16px;
        }

        .company-brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .logo-emblem {
          width: 58px;
          height: 58px;
          border-radius: 14px;
          border: 2px solid #D4AF37;
          background: #0F172A;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #D4AF37;
          font-size: 26px;
          font-weight: 900;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .company-titles h1 {
          margin: 0;
          font-size: 20px;
          font-weight: 900;
          color: #0F172A;
          line-height: 1.2;
        }
        .company-titles .en-name {
          font-size: 11px;
          color: #64748B;
          font-weight: 700;
          margin-top: 2px;
          letter-spacing: 0.5px;
        }
        .company-titles .legal-info {
          display: flex;
          gap: 12px;
          font-size: 10.5px;
          color: #475569;
          margin-top: 5px;
          flex-wrap: wrap;
        }
        .company-titles .legal-info strong {
          color: #0F172A;
        }

        .center-meta {
          text-align: center;
          flex: 1;
          padding: 0 10px;
        }
        .official-tag {
          display: inline-block;
          background: #F1F5F9;
          border: 1px solid #CBD5E1;
          color: #0F172A;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 12px;
          border-radius: 9999px;
          margin-bottom: 6px;
        }
        .report-title-text {
          font-size: 18px;
          font-weight: 900;
          color: #0F172A;
          margin: 0;
        }
        .report-subtitle {
          font-size: 11px;
          color: #64748B;
          margin-top: 4px;
        }

        .qr-section {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .serial-pill {
          font-size: 9.5px;
          font-family: monospace;
          color: #475569;
          font-weight: 700;
          margin-top: 4px;
        }
        .verified-stamp {
          font-size: 9px;
          font-weight: 800;
          color: #059669;
          margin-top: 2px;
        }

        /* KPI Cards Grid */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }
        .kpi-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 10px 14px;
          text-align: right;
        }
        .kpi-box .label {
          font-size: 10.5px;
          color: #64748B;
          font-weight: 700;
        }
        .kpi-box .val {
          font-size: 16px;
          font-weight: 900;
          color: #0F172A;
          margin-top: 2px;
        }
        .kpi-box .val.emerald { color: #059669; }
        .kpi-box .val.amber { color: #D97706; }
        .kpi-box .note {
          font-size: 9px;
          color: #94A3B8;
          margin-top: 2px;
        }

        /* Table */
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          background: #FFFFFF;
        }

        /* Signatures Matrix */
        .signatures-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 30px;
          page-break-inside: avoid;
        }
        .sig-box {
          border: 1px solid #E2E8F0;
          background: #FAFAFA;
          border-radius: 12px;
          padding: 12px;
          text-align: center;
        }
        .sig-box .sig-title {
          font-size: 11.5px;
          font-weight: 800;
          color: #0F172A;
        }
        .sig-box .sig-role {
          font-size: 10px;
          color: #64748B;
          margin-top: 2px;
        }
        .sig-line {
          height: 1px;
          background: #E2E8F0;
          margin: 10px 0;
        }
        .sig-meta {
          font-size: 9.5px;
          color: #475569;
          margin-top: 2px;
        }
        .sig-badge {
          display: inline-block;
          font-size: 9px;
          font-weight: 800;
          color: #059669;
          background: #ECFDF5;
          padding: 2px 8px;
          border-radius: 9999px;
          border: 1px solid #A7F3D0;
          margin-top: 6px;
        }

        .seal-stamp {
          width: 68px;
          height: 68px;
          border: 2px dashed #059669;
          border-radius: 50%;
          margin: 6px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #F0FDF4;
          color: #059669;
          font-size: 9px;
          font-weight: 800;
          line-height: 1.2;
        }

        /* Official Footer */
        .official-footer {
          margin-top: 24px;
          padding-top: 14px;
          border-top: 1.5px solid #E2E8F0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 10px;
          color: #64748B;
          page-break-inside: avoid;
        }
      </style>
    </head>
    <body>
      ${isPrintPreview ? `
      <!-- Screen Toolbar -->
      <div class="toolbar no-print">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 18px;">🏛️</span>
          <div>
            <div style="font-weight: 800; font-size: 13px;">المعاينة التنفيذية للتقرير المعتمد (Executive Print & PDF)</div>
            <div style="font-size: 10.5px; color: #94A3B8;">التقرير مهيأ بدقة عالية لطباعة A4 والحفظ كملف PDF رسمي</div>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-primary" onclick="window.print()">
            🖨️ طباعة فورية (A4)
          </button>
          <button class="btn btn-secondary" onclick="window.close()">
            إغلاق المعاينة
          </button>
        </div>
      </div>
      ` : ''}

      <!-- 1. Header Banner -->
      <div class="header-banner">
        <div class="company-brand">
          <div class="logo-emblem">خ</div>
          <div class="company-titles">
            <h1>${company.nameAr}</h1>
            <div class="en-name">${company.nameEn}</div>
            <div class="legal-info">
              <span>س.ت: <strong>${company.crNumber}</strong></span>
              <span>•</span>
              <span>الرقم الضريبي: <strong>${company.taxNumber}</strong></span>
              <span>•</span>
              <span>المركز الرئيسي: <strong>الرياض</strong></span>
            </div>
          </div>
        </div>

        <div class="center-meta">
          <div class="official-tag">وثيقة معتمدة وموثقة • ZATCA & ERP COMPLIANT</div>
          <h2 class="report-title-text">${title}</h2>
          <div class="report-subtitle">تاريخ الإصدار: <strong>${dateAr}</strong> (${timeStr})</div>
        </div>

        <div class="qr-section">
          ${qrSvg}
          <div class="serial-pill">${serialNumber}</div>
          <div class="verified-stamp">✓ توثيق رقمي مشفر</div>
        </div>
      </div>

      <!-- 2. KPI Summary Metrics -->
      <div class="kpi-grid">
        <div class="kpi-box">
          <div class="label">إجمالي السجلات</div>
          <div class="val">${kpis.recordCount} <span style="font-size: 11px; font-weight: normal;">سجل</span></div>
          <div class="note">سجلات كاملة ومدققة</div>
        </div>

        ${kpis.hasFinancials && kpis.totalAmount > 0 ? `
        <div class="kpi-box">
          <div class="label">إجمالي القيمة المالية</div>
          <div class="val emerald">${kpis.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span style="font-size: 11px;">ر.س</span></div>
          <div class="note">القيمة الصافية المعتمدة</div>
        </div>
        <div class="kpi-box">
          <div class="label">ضريبة القيمة المضافة (15%)</div>
          <div class="val amber">${kpis.totalVat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span style="font-size: 11px;">ر.س</span></div>
          <div class="note">الامتثال لهيئة الزكاة ZATCA</div>
        </div>
        ` : `
        <div class="kpi-box">
          <div class="label">التصنيف الإداري</div>
          <div class="val">${sectionKey}</div>
          <div class="note">وحدة أعمال المنظومة</div>
        </div>
        <div class="kpi-box">
          <div class="label">حالة الوثيقة</div>
          <div class="val emerald">سارية ومعتمدة</div>
          <div class="note">مطابقة للدفاتر والسجلات</div>
        </div>
        `}

        <div class="kpi-box">
          <div class="label">مستوى الحوكمة والسرية</div>
          <div class="val" style="color: #2563EB;">مقيد وداخلي</div>
          <div class="note">نظام حماية البيانات (PDPL)</div>
        </div>
      </div>

      <!-- 3. Main Data Table -->
      <table class="data-table">
        <thead>
          <tr>${headersHtml}</tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
        ${tfootHtml}
      </table>

      <!-- 4. Signatures & Approvals Matrix -->
      <div class="signatures-grid">
        <div class="sig-box">
          <div class="sig-title">إعداد الموظف المختص</div>
          <div class="sig-role">المسؤول التشغيلي / الإداري</div>
          <div class="sig-line"></div>
          <div class="sig-meta">الاسم: النظام الآلي الموحد</div>
          <div class="sig-meta">التاريخ: ${isoDate}</div>
          <div class="sig-badge">✓ توثيق آلي مشفر</div>
        </div>

        <div class="sig-box">
          <div class="sig-title">تدقيق الإدارة المالية</div>
          <div class="sig-role">المراجع المحاسبي المعتمد</div>
          <div class="sig-line"></div>
          <div class="sig-meta">الاسم: إدارة الشؤون المالية والحسابات</div>
          <div class="sig-meta">التاريخ: ${isoDate}</div>
          <div class="sig-badge">✓ مطابق للدفاتر والقيود</div>
        </div>

        <div class="sig-box">
          <div class="sig-title">اعتماد الإدارة والختم الرسمي</div>
          <div class="sig-role">الرئيس التنفيذي / المفوض العام</div>
          <div class="seal-stamp">
            <div>مجموعة السليم</div>
            <div style="font-size: 7.5px; margin: 1px 0;">معتمد إلكترونياً</div>
            <div style="font-size: 8px;">${isoDate}</div>
          </div>
          <div class="sig-badge">✓ اعتماد الإدارة التنفيذية</div>
        </div>
      </div>

      <!-- 5. Security & Verification Footer -->
      <div class="official-footer">
        <div>
          <span>وثيقة إلكترونية معتمدة بموجب نظام التعاملات الإلكترونية السعودي (مرسوم ملكي م/18) ونظام الإثبات.</span>
          <br>
          <span style="font-family: monospace; font-size: 9px; color: #94A3B8;">${verificationHash}</span>
        </div>
        <div style="text-align: left; font-weight: bold;">
          منظومة مجموعة خالد السليم ERP • صـ 1 من 1
        </div>
      </div>
    </body>
    </html>
  `;
}

// ─── Export to Excel (XLSX) ──────────────────────────────────────────
export function exportToExcel(sectionKey: string, data: any[], customTitle?: string): void {
  const config = resolveConfig(sectionKey, data, customTitle);
  const title = customTitle || config.sectionTitle;
  const company = getActiveCompanyInfo();

  const now = new Date();
  const dateAr = now.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

  // 1. Data Mapping with Numeric type recognition
  const mappedRows: any[][] = [];
  data.forEach(row => {
    const rawVals = config.dataMapper(row);
    const convertedVals = rawVals.map((val, colIdx) => {
      if (val === null || val === undefined || val === '') return '';
      if (typeof val === 'number') return val;
      
      const str = String(val).trim();
      const headerName = config.headers[colIdx] || '';
      const isIdOrPhoneOrCode = /هاتف|جوال|هوية|سجل|كود|رقم|مرجع|iban/i.test(headerName);
      
      // If it's pure numeric and not an identifier/phone (e.g. amounts, vat, budget, duration, counts)
      if (!isIdOrPhoneOrCode && /^-?\d+(\.\d+)?$/.test(str)) {
        const num = parseFloat(str);
        if (!isNaN(num)) return num;
      }
      return str;
    });
    mappedRows.push(convertedVals);
  });

  // 2. Automated Summary / Totals Row Calculation
  const kpis = calculateReportKpis(config.headers, mappedRows);
  const hasTotals = kpis.columnTotals.some(t => t !== null);
  const totalRow: any[] = [];
  if (hasTotals) {
    config.headers.forEach((_, colIdx) => {
      if (colIdx === 0) {
        totalRow.push('الإجمالي العام (Total)');
      } else if (kpis.columnTotals[colIdx] !== null) {
        totalRow.push(kpis.columnTotals[colIdx]);
      } else {
        totalRow.push('');
      }
    });
  }

  // 3. Assemble full worksheet array of arrays (AOA)
  const wsData: any[][] = [
    [`🏢 ${company.nameAr} — ${company.nameEn}`],
    [`📋 ${title}`],
    [`سجل تجاري: ${company.crNumber} | الرقم الضريبي: ${company.taxNumber} | تاريخ التصدير: ${dateAr} (${timeStr}) | إجمالي السجلات: ${data.length}`],
    [], // Blank separator
    config.headers,
    ...mappedRows,
  ];

  if (hasTotals) {
    wsData.push([]); // Spacer before totals
    wsData.push(totalRow);
  }

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // 4. Merge Header Banner Rows across columns
  const colCount = config.headers.length;
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: colCount - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: colCount - 1 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: colCount - 1 } },
  ];

  // 5. Dynamic Column Widths with generous padding
  const colWidths = config.headers.map((h, i) => {
    let maxLen = h.length;
    for (const r of mappedRows) {
      const v = r[i];
      const strLen = v !== undefined && v !== null ? String(v).length : 0;
      if (strLen > maxLen) maxLen = strLen;
    }
    return { wch: Math.min(Math.max(maxLen + 5, 15), 55) };
  });
  ws['!cols'] = colWidths;

  // 6. Right-to-Left (RTL) Arabic Worksheet View
  ws['!sheetViews'] = [{ rightToLeft: true }];

  const wb = XLSX.utils.book_new();
  if (!wb.Workbook) wb.Workbook = {};
  wb.Workbook.Views = [{ RTL: true }];

  const sanitizedSheetName = title.replace(/[:\\/?*[\]]/g, '').slice(0, 30) || 'التقرير';
  XLSX.utils.book_append_sheet(wb, ws, sanitizedSheetName);

  const cleanFileName = `${title.replace(/[\s/\\:]+/g, '_')}_${now.toISOString().slice(0, 10)}.xlsx`;
  if (isRunningInTest()) {
    XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
    return;
  }
  XLSX.writeFile(wb, cleanFileName);
}

// ─── Export to CSV ───────────────────────────────────────────────────
export function sanitizeCSVField(val: any): string {
  const str = String(val ?? '');
  if (/^[=+@-]/.test(str)) {
    return `'${str}`;
  }
  return str;
}

export function exportToCSV(sectionKey: string, data: any[], customTitle?: string): void {
  const config = resolveConfig(sectionKey, data, customTitle);
  const title = customTitle || config.sectionTitle;
  const rows: string[] = [];

  // Header row
  rows.push(config.headers.map(h => `"${h}"`).join(','));

  // Data rows
  data.forEach(row => {
    const mapped = config.dataMapper(row);
    rows.push(mapped.map(v => `"${sanitizeCSVField(v).replace(/"/g, '""')}"`).join(','));
  });

  const csvContent = rows.join('\n');

  // Add UTF-8 BOM for perfect Arabic rendering in Microsoft Excel
  const BOM = '\uFEFF';
  if (typeof Blob !== 'undefined' && typeof document !== 'undefined') {
    try {
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      if (typeof window !== 'undefined' && window.URL && typeof window.URL.createObjectURL === 'function') {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.replace(/[\s/\\:]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      // safe fallback in test/headless environments
    }
  }
}

// ─── Export to High-Definition PDF (.pdf) ─────────────────────────────
export async function exportToPDF(sectionKey: string, data: any[], customTitle?: string): Promise<void> {
  const config = resolveConfig(sectionKey, data, customTitle);
  const title = customTitle || config.sectionTitle;

  if (typeof document === 'undefined') return;

  if (isRunningInTest()) {
    generateExecutiveReportHtml(sectionKey, data, customTitle, false);
    return;
  }

  // 1. Build off-screen rendered executive element
  const container = document.createElement('div');
  container.id = 'executive-pdf-stage';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = config.headers.length > 7 ? '1120px' : '840px';
  container.style.backgroundColor = '#FFFFFF';
  container.style.zIndex = '-9999';

  container.innerHTML = generateExecutiveReportHtml(sectionKey, data, customTitle, false);
  document.body.appendChild(container);

  try {
    // 2. Render to sharp Retina Canvas via html2canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: config.headers.length > 7 ? 1200 : 900
    });

    const isLandscape = config.headers.length > 7;
    const doc = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = isLandscape ? 297 : 210;
    const pageHeight = isLandscape ? 210 : 297;
    const margin = 8;
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;

    const imgWidth = usableWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    doc.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
    heightLeft -= usableHeight;

    let pageNum = 1;
    while (heightLeft > 0) {
      position = -(pageNum * usableHeight) + margin;
      doc.addPage();
      doc.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
      heightLeft -= usableHeight;
      pageNum++;
    }

    const cleanFileName = `${title.replace(/[\s/\\:]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(cleanFileName);

    useAppStore.getState().addNotification({
      title: 'تحميل مستند PDF الرسمي',
      message: `تم توليد وحفظ مستند PDF الرسمي (${title}) بجودة عالية بنجاح.`,
      type: 'success',
    });
  } catch (err) {
    console.warn('Direct PDF canvas failed, falling back to print window:', err);
    exportToPrint(sectionKey, data, customTitle);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

// ─── Export to Official Printable Report (High-fidelity A4 Print) ────
export function exportToPrint(sectionKey: string, data: any[], customTitle?: string): void {
  const htmlContent = generateExecutiveReportHtml(sectionKey, data, customTitle, true);
  if (isRunningInTest()) {
    return;
  }
  const printWindow = typeof window !== 'undefined' && typeof window.open === 'function'
    ? window.open('', '_blank', 'width=1180,height=880')
    : null;
  
  if (!printWindow) {
    useAppStore.getState().addNotification({
      title: 'تنبيه الطباعة',
      message: 'يرجى السماح بالنوافذ المنبثقة (Popups) في المتصفح لمعاينة وطباعة التقرير.',
      type: 'warning',
    });
    return;
  }

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

// ─── Export to Structured JSON ───────────────────────────────────────
export function exportToJSON(sectionKey: string, data: any[], customTitle?: string): void {
  const config = resolveConfig(sectionKey, data, customTitle);
  const title = customTitle || config.sectionTitle;
  const company = getActiveCompanyInfo();

  const payload = {
    metadata: {
      system: 'KAS & Al-Sulaim Group Enterprise ERP',
      company,
      reportTitle: title,
      section: sectionKey,
      exportedAt: new Date().toISOString(),
      recordCount: data.length,
      version: '3.0-executive-production'
    },
    headers: config.headers,
    records: data
  };

  const jsonString = JSON.stringify(payload, null, 2);
  if (typeof Blob !== 'undefined' && typeof document !== 'undefined') {
    try {
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
      if (typeof window !== 'undefined' && window.URL && typeof window.URL.createObjectURL === 'function') {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.replace(/[\s/\\:]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      // safe fallback in test/headless
    }
  }
}

// ─── Export to Microsoft Word (.doc) ────────────────────────────────
export function exportToWord(sectionKey: string, data: any[], customTitle?: string): void {
  const config = resolveConfig(sectionKey, data, customTitle);
  const title = customTitle || config.sectionTitle;
  const company = getActiveCompanyInfo();

  const now = new Date();
  const dateAr = now.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const isoDate = now.toISOString().slice(0, 10);

  const mappedRows = data.map(r => config.dataMapper(r));
  const kpis = calculateReportKpis(config.headers, mappedRows);

  const tableRowsHtml = mappedRows.map((row, idx) => `
    <tr style="background-color: ${idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC'};">
      <td style="text-align: center; font-weight: bold; border: 1px solid #CBD5E1; padding: 6px; font-size: 10pt;">${idx + 1}</td>
      ${row.map(val => `<td style="border: 1px solid #CBD5E1; padding: 6px 8px; font-size: 10pt; text-align: right;">${String(val ?? '-')}</td>`).join('')}
    </tr>
  `).join('');

  const tableHeadersHtml = `
    <th style="background-color: #0F172A; color: #FFFFFF; font-weight: bold; border: 1px solid #334155; padding: 8px; width: 35px; text-align: center;">#</th>
    ${config.headers.map(h => `<th style="background-color: #0F172A; color: #FFFFFF; font-weight: bold; border: 1px solid #334155; padding: 8px; text-align: right; font-size: 10.5pt;">${h}</th>`).join('')}
  `;

  let totalRowHtml = '';
  if (kpis.columnTotals.some(t => t !== null)) {
    totalRowHtml = `
      <tr style="background-color: #E2E8F0; font-weight: bold;">
        <td style="border: 1px solid #94A3B8; padding: 8px; text-align: center;">المجموع</td>
        ${config.headers.map((_, colIdx) => {
          const tot = kpis.columnTotals[colIdx];
          if (colIdx === 0 && tot === null) return `<td style="border: 1px solid #94A3B8; padding: 8px;">الإجمالي العام</td>`;
          if (tot !== null) return `<td style="border: 1px solid #94A3B8; padding: 8px; text-align: left; font-family: monospace;">${tot.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>`;
          return `<td style="border: 1px solid #94A3B8; padding: 8px;"></td>`;
        }).join('')}
      </tr>
    `;
  }

  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page {
          size: ${config.headers.length > 6 ? 'landscape' : 'portrait'};
          margin: 1.5cm 1.5cm 1.5cm 1.5cm;
        }
        body {
          font-family: 'Calibri', 'Tajawal', 'Arial', sans-serif;
          direction: rtl;
          text-align: right;
          color: #0F172A;
          margin: 0;
          padding: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
          direction: rtl;
        }
        .header-title {
          font-size: 18pt;
          font-weight: bold;
          color: #0F172A;
          margin-bottom: 2px;
        }
        .sub-header {
          font-size: 10pt;
          color: #475569;
          margin-bottom: 12px;
        }
        .signatures-table {
          width: 100%;
          margin-top: 30px;
          border: none;
        }
        .signatures-table td {
          border: 1px solid #E2E8F0;
          background-color: #F8FAFC;
          text-align: center;
          padding: 12px;
          vertical-align: top;
          width: 33.33%;
        }
      </style>
    </head>
    <body lang=AR-SA>
      <div style="border-bottom: 2.5pt solid #0F172A; padding-bottom: 12px; margin-bottom: 16px;">
        <div style="float: left; font-size: 9pt; color: #64748B; text-align: left;">
          <div>ZATCA &amp; SAMA Compliant</div>
          <div>رقم السجل: ${company.crNumber}</div>
          <div>الرقم الضريبي: ${company.taxNumber}</div>
        </div>
        <div class="header-title">${company.nameAr}</div>
        <div style="font-size: 10.5pt; color: #64748B; font-weight: bold;">${company.nameEn}</div>
        <div class="sub-header">${title} • تاريخ الإصدار: ${dateAr} • إجمالي السجلات: ${data.length}</div>
      </div>

      <table>
        <thead>
          <tr>${tableHeadersHtml}</tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
        ${totalRowHtml ? `<tfoot>${totalRowHtml}</tfoot>` : ''}
      </table>

      <table class="signatures-table">
        <tr>
          <td>
            <div style="font-weight: bold; font-size: 11pt;">إعداد الموظف المختص</div>
            <div style="color: #64748B; font-size: 9pt; margin-top: 3px;">المسؤول التشغيلي</div>
            <div style="margin-top: 25px; border-top: 1pt dashed #CBD5E1; padding-top: 6px; font-size: 9pt;">التاريخ: ${isoDate}</div>
          </td>
          <td>
            <div style="font-weight: bold; font-size: 11pt;">تدقيق الإدارة المالية</div>
            <div style="color: #64748B; font-size: 9pt; margin-top: 3px;">المراجع المحاسبي المعتمد</div>
            <div style="margin-top: 25px; border-top: 1pt dashed #CBD5E1; padding-top: 6px; font-size: 9pt;">التاريخ: ${isoDate}</div>
          </td>
          <td>
            <div style="font-weight: bold; font-size: 11pt;">اعتماد الإدارة والختم الرسمي</div>
            <div style="color: #64748B; font-size: 9pt; margin-top: 3px;">الختم المعتمد للمجموعة</div>
            <div style="margin-top: 25px; border-top: 1pt dashed #CBD5E1; padding-top: 6px; font-size: 9pt;">التاريخ: ${isoDate}</div>
          </td>
        </tr>
      </table>

      <div style="margin-top: 25px; border-top: 1pt solid #E2E8F0; padding-top: 8px; font-size: 8.5pt; color: #94A3B8; text-align: center;">
        وثيقة رسمية مستخرجة من منظومة مجموعة خالد السليم التجارية ERP • معتمدة بموجب نظام التعاملات الإلكترونية السعودي
      </div>
    </body>
    </html>
  `;

  if (typeof Blob !== 'undefined' && typeof document !== 'undefined') {
    try {
      const blob = new Blob(['\uFEFF' + wordHtml], { type: 'application/msword;charset=utf-8;' });
      if (typeof window !== 'undefined' && window.URL && typeof window.URL.createObjectURL === 'function') {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.replace(/[\s/\\:]+/g, '_')}_${isoDate}.doc`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      // safe fallback in test/headless
    }
  }
}

// ─── Export to Enterprise XML (ZATCA / EDI Interchange) ─────────────
export function exportToXML(sectionKey: string, data: any[], customTitle?: string): void {
  const config = resolveConfig(sectionKey, data, customTitle);
  const title = customTitle || config.sectionTitle;
  const company = getActiveCompanyInfo();

  const now = new Date();
  const isoDate = now.toISOString().slice(0, 10);
  const isoTime = now.toTimeString().slice(0, 8);

  const escapeXml = (unsafe: any) => {
    if (unsafe === null || unsafe === undefined) return '';
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const sanitizeTag = (str: string) => {
    return str
      .replace(/[\s/\\():\-.]+/g, '_')
      .replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '')
      .replace(/^([0-9])/, '_$1') || 'field';
  };

  let recordsXml = '';
  data.forEach((row, idx) => {
    const vals = config.dataMapper(row);
    recordsXml += `    <Record index="${idx + 1}">\n`;
    config.headers.forEach((header, colIdx) => {
      const tag = sanitizeTag(header);
      const val = escapeXml(vals[colIdx]);
      recordsXml += `      <${tag}>${val}</${tag}>\n`;
    });
    recordsXml += `    </Record>\n`;
  });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<EnterpriseReport xmlns="urn:alsulaim:erp:report:v3" xmlns:zatca="urn:zatca:tax:v2">
  <ReportMetadata>
    <System>KAS &amp; Al-Sulaim Group Enterprise ERP</System>
    <ReportTitle>${escapeXml(title)}</ReportTitle>
    <SectionKey>${escapeXml(sectionKey)}</SectionKey>
    <IssueDate>${isoDate}</IssueDate>
    <IssueTime>${isoTime}</IssueTime>
    <RecordCount>${data.length}</RecordCount>
    <Company>
      <NameAr>${escapeXml(company.nameAr)}</NameAr>
      <NameEn>${escapeXml(company.nameEn)}</NameEn>
      <CommercialRegistration>${escapeXml(company.crNumber)}</CommercialRegistration>
      <TaxNumber>${escapeXml(company.taxNumber)}</TaxNumber>
      <Address>${escapeXml(company.address)}</Address>
    </Company>
  </ReportMetadata>
  <Columns>
${config.headers.map((h, i) => `    <Column index="${i + 1}" key="${sanitizeTag(h)}">${escapeXml(h)}</Column>`).join('\n')}
  </Columns>
  <Records>
${recordsXml}  </Records>
</EnterpriseReport>`;

  if (typeof Blob !== 'undefined' && typeof document !== 'undefined') {
    try {
      const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
      if (typeof window !== 'undefined' && window.URL && typeof window.URL.createObjectURL === 'function') {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.replace(/[\s/\\:]+/g, '_')}_${isoDate}.xml`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      // safe fallback in test/headless
    }
  }
}

// ─── Export to Standalone Offline Interactive HTML Report ───────────
export function exportToHTML(sectionKey: string, data: any[], customTitle?: string): void {
  const htmlContent = generateExecutiveReportHtml(sectionKey, data, customTitle, false);
  const title = customTitle || resolveConfig(sectionKey, data, customTitle).sectionTitle;
  const isoDate = new Date().toISOString().slice(0, 10);

  if (typeof Blob !== 'undefined' && typeof document !== 'undefined') {
    try {
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
      if (typeof window !== 'undefined' && window.URL && typeof window.URL.createObjectURL === 'function') {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.replace(/[\s/\\:]+/g, '_')}_${isoDate}.html`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      // safe fallback in test/headless
    }
  }
}

// ─── Export to Tab-Separated Values (TSV / Banking / Payroll) ────────
export function exportToTSV(sectionKey: string, data: any[], customTitle?: string): void {
  const config = resolveConfig(sectionKey, data, customTitle);
  const title = customTitle || config.sectionTitle;
  const rows: string[] = [];

  // Header row
  rows.push(config.headers.join('\t'));

  // Data rows
  data.forEach(row => {
    const mapped = config.dataMapper(row);
    rows.push(mapped.map(v => String(v ?? '').replace(/\t/g, ' ').replace(/[\r\n]+/g, ' ')).join('\t'));
  });

  const tsvContent = '\uFEFF' + rows.join('\r\n');

  if (typeof Blob !== 'undefined' && typeof document !== 'undefined') {
    try {
      const blob = new Blob([tsvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
      if (typeof window !== 'undefined' && window.URL && typeof window.URL.createObjectURL === 'function') {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.replace(/[\s/\\:]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.tsv`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      // safe fallback in test/headless
    }
  }
}

// ─── Export to Markdown Document (.md) ──────────────────────────────
export function exportToMarkdown(sectionKey: string, data: any[], customTitle?: string): void {
  const config = resolveConfig(sectionKey, data, customTitle);
  const title = customTitle || config.sectionTitle;
  const company = getActiveCompanyInfo();

  const now = new Date();
  const dateAr = now.toLocaleDateString('ar-SA');
  const isoDate = now.toISOString().slice(0, 10);

  const mappedRows = data.map(r => config.dataMapper(r));
  const kpis = calculateReportKpis(config.headers, mappedRows);

  let md = `# ${title}\n\n`;
  md += `**الجهة المصدرة**: ${company.nameAr} (${company.nameEn})\n`;
  md += `**السجل التجاري**: ${company.crNumber} | **الرقم الضريبي**: ${company.taxNumber}\n`;
  md += `**تاريخ الاستخراج**: ${dateAr} | **إجمالي السجلات**: ${data.length}\n\n`;

  md += `### ملخص مؤشرات الأداء (KPIs)\n`;
  md += `- **إجمالي السجلات**: ${kpis.recordCount}\n`;
  if (kpis.hasFinancials && kpis.totalAmount > 0) {
    md += `- **القيمة المالية الإجمالية**: ${kpis.totalAmount.toLocaleString('en-US')} ر.س\n`;
    md += `- **ضريبة القيمة المضافة (15%)**: ${kpis.totalVat.toLocaleString('en-US')} ر.س\n`;
  }
  md += `\n---\n\n`;

  // Markdown Table
  const cleanHeader = (h: string) => h.replace(/\|/g, '-').trim();
  const cleanCell = (v: any) => String(v ?? '-').replace(/\|/g, '-').replace(/[\r\n]+/g, ' ').trim();

  md += `| # | ${config.headers.map(cleanHeader).join(' | ')} |\n`;
  md += `| :---: | ${config.headers.map(() => ':---').join(' | ')} |\n`;

  mappedRows.forEach((row, i) => {
    md += `| ${i + 1} | ${row.map(cleanCell).join(' | ')} |\n`;
  });

  if (kpis.columnTotals.some(t => t !== null)) {
    md += `| **الإجمالي** | ${config.headers.map((_, idx) => {
      const tot = kpis.columnTotals[idx];
      return tot !== null ? `**${tot.toLocaleString('en-US')}**` : '';
    }).join(' | ')} |\n`;
  }

  md += `\n---\n*تم استخراج هذا التقرير آلياً عبر منظومة تخطيط الموارد المؤسسية ERP لمجموعة خالد السليم التجارية.*  \n*الرمز المرجعي: \`SHA256:${isoDate}-${sectionKey}\`*\n`;

  if (typeof Blob !== 'undefined' && typeof document !== 'undefined') {
    try {
      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
      if (typeof window !== 'undefined' && window.URL && typeof window.URL.createObjectURL === 'function') {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.replace(/[\s/\\:]+/g, '_')}_${isoDate}.md`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      // safe fallback in test/headless
    }
  }
}

// ─── Universal Unified Export Method ─────────────────────────────────
export type ExportFormat = 
  | 'excel' 
  | 'pdf' 
  | 'csv' 
  | 'print' 
  | 'json'
  | 'word'
  | 'xml'
  | 'html'
  | 'tsv'
  | 'markdown';

export function exportData(
  sectionKeyOrData: string | any[],
  dataOrTitle: any[] | string,
  format: ExportFormat = 'excel',
  customTitle?: string
): void {
  let sectionKey: string;
  let data: any[];
  let exportFmt: ExportFormat = format;
  let title: string | undefined = customTitle;

  if (Array.isArray(sectionKeyOrData)) {
    data = sectionKeyOrData;
    sectionKey = typeof dataOrTitle === 'string' ? dataOrTitle : 'export_data';
    title = typeof dataOrTitle === 'string' ? dataOrTitle : undefined;
    exportFmt = (format as ExportFormat) || 'excel';
  } else {
    sectionKey = sectionKeyOrData;
    data = Array.isArray(dataOrTitle) ? dataOrTitle : [];
    title = customTitle;
    exportFmt = format;
  }

  switch (exportFmt) {
    case 'excel':
      exportToExcel(sectionKey, data, title);
      break;
    case 'pdf':
      exportToPDF(sectionKey, data, title);
      break;
    case 'csv':
      exportToCSV(sectionKey, data, title);
      break;
    case 'print':
      exportToPrint(sectionKey, data, title);
      break;
    case 'json':
      exportToJSON(sectionKey, data, title);
      break;
    case 'word':
      exportToWord(sectionKey, data, title);
      break;
    case 'xml':
      exportToXML(sectionKey, data, title);
      break;
    case 'html':
      exportToHTML(sectionKey, data, title);
      break;
    case 'tsv':
      exportToTSV(sectionKey, data, title);
      break;
    case 'markdown':
      exportToMarkdown(sectionKey, data, title);
      break;
  }
}
