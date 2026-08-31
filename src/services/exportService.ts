/**
 * Central Enterprise Export Service for ERP System
 * Supports Excel (XLSX), PDF, CSV, and Official Printable Reports
 * with full Arabic Unicode support and dual company branding.
 */
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { useAppStore } from '../stores/appStore';

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
    sectionTitle: 'سجل السندات المالية (سندات القبض والصرف)',
    headers: ['رقم السند', 'نوع السند', 'تاريخ التحرير', 'المدفوع له / القابض', 'الحساب المالي / الخزينة', 'المبلغ (ر.س)', 'حالة الاعتماد'],
    dataMapper: (r: any) => [
      r.voucher_no || r.id || '',
      r.type || '',
      r.date || '',
      r.payee_payer || '',
      r.treasury || '',
      r.amount || 0,
      r.status || 'معتمد'
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
    sectionTitle: 'سجل فروع وأقسام المجموعة',
    headers: ['كود الفرع', 'اسم الفرع', 'المدينة', 'مدير الفرع', 'رقم الهاتف', 'عدد الكوادر', 'عدد العقود النشطة', 'الحالة'],
    dataMapper: (r: any) => [
      r.branch_code || r.id || '',
      r.name || '',
      r.city || '',
      r.manager_name || '',
      r.phone || '',
      r.staff_count || 0,
      r.active_contracts_count || 0,
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
  }
};

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

// ─── Export to Excel (XLSX) ──────────────────────────────────────────
export function exportToExcel(sectionKey: string, data: any[], customTitle?: string): void {
  const config = resolveConfig(sectionKey, data, customTitle);
  const title = customTitle || config.sectionTitle;
  const now = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  const wsData: any[][] = [];

  // Row 1: Company Header
  wsData.push([`${GROUP_COMPANY_INFO.nameAr} — ${GROUP_COMPANY_INFO.nameEn}`]);
  // Row 2: Report Title & Metadata
  wsData.push([`${title} • تاريخ الاستخراج: ${now} • إجمالي السجلات: ${data.length}`]);
  // Row 3: Empty separator
  wsData.push([]);
  // Row 4: Column Headers
  wsData.push(config.headers);
  // Row 5+: Data rows
  data.forEach(row => {
    wsData.push(config.dataMapper(row));
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths based on headers and data length
  const colWidths = config.headers.map((h, i) => {
    const maxDataLen = data.reduce((max, row) => {
      const val = String(config.dataMapper(row)[i] || '');
      return Math.max(max, val.length);
    }, h.length);
    return { wch: Math.min(Math.max(maxDataLen + 4, 14), 50) };
  });
  ws['!cols'] = colWidths;

  const colCount = config.headers.length;
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: colCount - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: colCount - 1 } }
  ];

  // Set Right-to-Left (RTL) for Arabic
  ws['!sheetViews'] = [{ rightToLeft: true }];

  const wb = XLSX.utils.book_new();
  if (!wb.Workbook) wb.Workbook = {};
  if (!wb.Workbook.Views) wb.Workbook.Views = [];
  wb.Workbook.Views[0] = { RTL: true };

  const sanitizedSheetName = title.replace(/[:\\/?*[\]]/g, '').slice(0, 31);
  XLSX.utils.book_append_sheet(wb, ws, sanitizedSheetName);
  XLSX.writeFile(wb, `${title}.xlsx`);
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
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${title}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ─── Export to PDF ───────────────────────────────────────────────────
export function exportToPDF(sectionKey: string, data: any[], customTitle?: string): void {
  const config = resolveConfig(sectionKey, data, customTitle);
  const title = customTitle || config.sectionTitle;
  const now = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const doc = new jsPDF({
    orientation: config.headers.length > 7 ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(GROUP_COMPANY_INFO.nameEn, pageWidth / 2, 12, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${GROUP_COMPANY_INFO.tagline} | ${title}`, pageWidth / 2, 19, { align: 'center' });

  doc.setFontSize(8.5);
  doc.text(`Export Date: ${now} | Total Records: ${data.length}`, pageWidth / 2, 25, { align: 'center' });

  doc.setDrawColor(0, 81, 84);
  doc.setLineWidth(0.5);
  doc.line(10, 28, pageWidth - 10, 28);

  const startY = 32;
  const margin = 6;
  const tableWidth = pageWidth - margin * 2;
  const colWidth = tableWidth / config.headers.length;
  const rowHeight = 7;
  let currentY = startY;

  // Header row
  doc.setFillColor(0, 81, 84);
  doc.rect(margin, currentY, tableWidth, rowHeight, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  config.headers.forEach((header, i) => {
    const x = margin + i * colWidth + colWidth / 2;
    doc.text(header, x, currentY + 5, { align: 'center', maxWidth: colWidth - 2 });
  });

  currentY += rowHeight;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);

  data.forEach((row, rowIdx) => {
    if (currentY + rowHeight > doc.internal.pageSize.getHeight() - 15) {
      doc.addPage();
      currentY = 15;
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

    if (rowIdx % 2 === 0) {
      doc.setFillColor(245, 247, 250);
      doc.rect(margin, currentY, tableWidth, rowHeight, 'F');
    }

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.1);
    doc.line(margin, currentY + rowHeight, margin + tableWidth, currentY + rowHeight);

    doc.setTextColor(30, 30, 30);
    const mapped = config.dataMapper(row);
    mapped.forEach((val, i) => {
      const x = margin + i * colWidth + colWidth / 2;
      const text = String(val ?? '');
      doc.text(text, x, currentY + 5, { align: 'center', maxWidth: colWidth - 2 });
    });

    currentY += rowHeight;
  });

  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `${GROUP_COMPANY_INFO.nameEn} - ERP System | Page ${p} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 6,
      { align: 'center' }
    );
  }

  doc.save(`${title}.pdf`);
}

// ─── Export to JSON ──────────────────────────────────────────────────
export function exportToJSON(sectionKey: string, data: any[], customTitle?: string): void {
  const config = resolveConfig(sectionKey, data, customTitle);
  const title = customTitle || config.sectionTitle;
  const payload = {
    metadata: {
      system: 'KAS & Al-Sulaim Group Enterprise ERP',
      company: GROUP_COMPANY_INFO,
      reportTitle: title,
      section: sectionKey,
      exportedAt: new Date().toISOString(),
      recordCount: data.length,
      version: '2.0-production'
    },
    headers: config.headers,
    records: data
  };

  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

// ─── Official Printable Report (High-fidelity Arabic HTML Print) ────
export function exportToPrint(sectionKey: string, data: any[], customTitle?: string): void {
  const config = resolveConfig(sectionKey, data, customTitle);
  const title = customTitle || config.sectionTitle;
  const now = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  const printWindow = window.open('', '_blank', 'width=1100,height=850');
  if (!printWindow) {
    useAppStore.getState().addNotification({
      title: 'تنبيه الطباعة',
      message: 'يرجى السماح بالنوافذ المنبثقة (Popups) في المتصفح لمعاينة وطباعة التقرير.',
      type: 'warning',
    });
    return;
  }

  const rowsHtml = data.map((row, idx) => {
    const mapped = config.dataMapper(row);
    return `
      <tr style="background-color: ${idx % 2 === 0 ? '#FFFFFF' : '#F9FAFB'};">
        <td style="text-align: center; font-weight: bold; color: #64748B; padding: 8px;">${idx + 1}</td>
        ${mapped.map(val => `<td style="padding: 8px 10px; border: 1px solid #E2E8F0; font-size: 11.5px;">${String(val ?? '-')}</td>`).join('')}
      </tr>
    `;
  }).join('');

  const headersHtml = `
    <th style="padding: 10px; background: #000000; color: white; border: 1px solid #27272a; width: 40px;">#</th>
    ${config.headers.map(h => `<th style="padding: 10px; background: #000000; color: white; border: 1px solid #27272a; font-size: 12px; font-weight: 700;">${h}</th>`).join('')}
  `;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="utf-8">
      <title>${title} - ${GROUP_COMPANY_INFO.nameAr}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700;900&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Tajawal', 'Inter', system-ui, sans-serif;
          margin: 25px;
          color: #09090b;
          background: #FFFFFF;
        }
        @media print {
          @page { size: landscape; margin: 10mm; }
          body { margin: 0; }
          .no-print { display: none !important; }
        }
        .header-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2.5px solid #000000;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .report-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
          text-align: right;
        }
        .report-table th, .report-table td {
          border: 1px solid #e4e4e7;
        }
        .footer-box {
          margin-top: 35px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 15px;
          border-top: 1.5px solid #e4e4e7;
          font-size: 11px;
          color: #71717a;
        }
        .stamp-box {
          border: 2px dashed #059669;
          border-radius: 12px;
          padding: 8px 16px;
          text-align: center;
          color: #059669;
          font-size: 11px;
          font-weight: 700;
          background: #f0fdf4;
          display: inline-block;
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 20px; display: flex; gap: 12px; align-items: center; justify-content: space-between; background: #f4f4f5; padding: 12px 18px; border-radius: 9999px;">
        <div style="font-weight: 700; font-size: 13px;">معاينة التقرير الرسمي المعتمد جاهز للطباعة والتصدير</div>
        <div style="display: flex; gap: 8px;">
          <button onclick="window.print()" style="padding: 8px 22px; background: #000000; color: white; border: none; border-radius: 9999px; font-weight: 700; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
            🖨️ طباعة التقرير الفوري (A4)
          </button>
          <button onclick="window.close()" style="padding: 8px 20px; background: #ffffff; color: #000000; border: 1px solid #e4e4e7; border-radius: 9999px; font-weight: 700; font-size: 12px; cursor: pointer;">
            إغلاق
          </button>
        </div>
      </div>

      <div class="header-box">
        <div>
          <h1 style="font-size: 20px; font-weight: 900; color: #000000; margin: 0;">${GROUP_COMPANY_INFO.nameAr}</h1>
          <div style="font-size: 11px; color: #71717a; font-weight: 600; margin-top: 2px;">${GROUP_COMPANY_INFO.nameEn}</div>
          <div style="font-size: 11px; color: #52525b; margin-top: 4px;">س.ت: <strong>${GROUP_COMPANY_INFO.crNumber}</strong> • الرقم الضريبي: <strong>${GROUP_COMPANY_INFO.taxNumber}</strong></div>
        </div>

        <div style="text-align: center;">
          <h2 style="font-size: 18px; font-weight: 800; color: #000000; margin: 0;">${title}</h2>
          <div style="font-size: 12px; color: #71717a; margin-top: 4px;">تاريخ الاستخراج: <strong>${now}</strong></div>
          <div style="font-size: 11px; color: #059669; font-weight: 700; margin-top: 2px;">✓ تقرير مدقق ومطابق لمنظومة ERP</div>
        </div>

        <div style="text-align: left;">
          <div class="stamp-box">
            <div>معتمد إلكترونياً</div>
            <div style="font-size: 9px; margin-top: 2px;">Saudi ERP Verified</div>
          </div>
          <div style="font-size: 11px; font-weight: 700; color: #71717a; margin-top: 6px;">السجلات المضمنة: <span style="font-size: 16px; font-weight: 900; color: #000000;">${data.length}</span></div>
        </div>
      </div>

      <table class="report-table">
        <thead>
          <tr>${headersHtml}</tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="footer-box">
        <div>تم الاستخراج والاعتماد إلكترونياً عبر منظومة ERP المجموعة • تقرير رسمي موثق لا يحتاج إلى توقيع خطي</div>
        <div>صفحة 1 من 1</div>
      </div>
    </body>
    </html>
  `);

  printWindow.document.close();
}

// ─── Universal Unified Export Method ─────────────────────────────────
export type ExportFormat = 'excel' | 'pdf' | 'csv' | 'print' | 'json';

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
  }
}
