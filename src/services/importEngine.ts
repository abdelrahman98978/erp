/**
 * Enterprise Data Import Engine
 * Universal file import with column mapping, validation, and batch insertion
 * Supports: Excel (.xlsx/.xls), CSV, JSON
 *
 * Khalid Al-Sulaim Commercial Group ERP
 */
import * as XLSX from 'xlsx';
import { realErpDataStore } from './realErpDataStore';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FieldMapping {
  /** Internal system field key */
  systemField: string;
  /** Human-readable label (Arabic) */
  label: string;
  /** Is this field required? */
  required: boolean;
  /** Data type for validation */
  type: 'string' | 'number' | 'date' | 'email' | 'phone' | 'boolean';
  /** Default value if column is not mapped */
  defaultValue?: any;
}

export interface ImportTemplate {
  /** Unique key matching realErpDataStore entity */
  entityKey: string;
  /** Arabic display name */
  displayName: string;
  /** Icon class (FontAwesome) */
  icon: string;
  /** Material Symbols icon name */
  materialIcon: string;
  /** Color theme */
  color: string;
  /** Field definitions */
  fields: FieldMapping[];
  /** Example data for template download */
  exampleRows: Record<string, any>[];
}

export interface ColumnMap {
  /** File column header */
  fileColumn: string;
  /** System field key it maps to */
  systemField: string;
}

export interface ImportError {
  row: number;
  field: string;
  value: any;
  message: string;
}

export interface ImportWarning {
  row: number;
  field: string;
  value: any;
  message: string;
}

export interface ParsedFileData {
  headers: string[];
  rows: Record<string, any>[];
  totalRows: number;
  fileName: string;
  fileType: string;
}

export interface ValidationResult {
  valid: Record<string, any>[];
  warnings: ImportWarning[];
  errors: ImportError[];
}

export interface ImportResult {
  total: number;
  imported: number;
  failed: number;
  skipped: number;
  errors: ImportError[];
  warnings: ImportWarning[];
  entityKey: string;
  timestamp: string;
  duration: number;
}

// ─── Import Templates ────────────────────────────────────────────────────────

export const IMPORT_TEMPLATES: ImportTemplate[] = [
  {
    entityKey: 'clients',
    displayName: 'العملاء',
    icon: 'fa-solid fa-users',
    materialIcon: 'group',
    color: '#000000',
    fields: [
      { systemField: 'name', label: 'اسم العميل', required: true, type: 'string' },
      { systemField: 'phone', label: 'رقم الجوال', required: true, type: 'phone' },
      { systemField: 'national_id', label: 'رقم الهوية / الإقامة', required: false, type: 'string' },
      { systemField: 'email', label: 'البريد الإلكتروني', required: false, type: 'email' },
      { systemField: 'city', label: 'المدينة', required: false, type: 'string', defaultValue: 'الرياض' },
      { systemField: 'type', label: 'نوع العميل', required: false, type: 'string', defaultValue: 'شخص' },
      { systemField: 'address', label: 'العنوان', required: false, type: 'string' },
      { systemField: 'client_activity', label: 'النشاط', required: false, type: 'string' },
      { systemField: 'balance', label: 'الرصيد', required: false, type: 'number', defaultValue: 0 },
    ],
    exampleRows: [
      { name: 'أحمد محمد العتيبي', phone: '0551234567', national_id: '1098765432', email: 'ahmed@example.com', city: 'الرياض', type: 'شخص', balance: 0 },
      { name: 'شركة الأفق للمقاولات', phone: '0112345678', national_id: '7001234567', email: 'info@alofuq.com', city: 'جدة', type: 'شركة', balance: 15000 },
    ]
  },
  {
    entityKey: 'cvs',
    displayName: 'السير الذاتية',
    icon: 'fa-solid fa-id-card',
    materialIcon: 'badge',
    color: '#7C3AED',
    fields: [
      { systemField: 'maid_name', label: 'اسم العاملة', required: true, type: 'string' },
      { systemField: 'nationality', label: 'الجنسية', required: true, type: 'string' },
      { systemField: 'job', label: 'المهنة', required: true, type: 'string' },
      { systemField: 'passport_number', label: 'رقم الجواز', required: true, type: 'string' },
      { systemField: 'age', label: 'العمر', required: false, type: 'number' },
      { systemField: 'experience_years', label: 'سنوات الخبرة', required: false, type: 'number', defaultValue: 0 },
      { systemField: 'salary', label: 'الراتب', required: false, type: 'number', defaultValue: 1500 },
      { systemField: 'marital_status', label: 'الحالة الاجتماعية', required: false, type: 'string' },
      { systemField: 'religion', label: 'الديانة', required: false, type: 'string' },
      { systemField: 'external_office', label: 'المكتب الخارجي', required: false, type: 'string' },
      { systemField: 'type', label: 'نوع التعاقد', required: false, type: 'string', defaultValue: 'توسط' },
    ],
    exampleRows: [
      { maid_name: 'MARY JANE', nationality: 'الفلبين', job: 'عاملة منزلية', passport_number: 'P12345678', age: 28, experience_years: 3, salary: 1800 },
      { maid_name: 'ABEBA TEKLE', nationality: 'اثيوبيا', job: 'عاملة منزلية', passport_number: 'ET9876543', age: 25, experience_years: 1, salary: 1500 },
    ]
  },
  {
    entityKey: 'contracts',
    displayName: 'عقود الاستقدام',
    icon: 'fa-solid fa-file-signature',
    materialIcon: 'description',
    color: '#DC2626',
    fields: [
      { systemField: 'contract_number', label: 'رقم العقد', required: true, type: 'string' },
      { systemField: 'client_name', label: 'اسم العميل', required: true, type: 'string' },
      { systemField: 'client_phone', label: 'جوال العميل', required: false, type: 'phone' },
      { systemField: 'worker_name', label: 'اسم العاملة', required: true, type: 'string' },
      { systemField: 'nationality', label: 'الجنسية', required: false, type: 'string' },
      { systemField: 'amount', label: 'المبلغ', required: true, type: 'number' },
      { systemField: 'contract_date', label: 'تاريخ العقد', required: false, type: 'date' },
      { systemField: 'status', label: 'حالة العقد', required: false, type: 'string', defaultValue: 'جديد' },
    ],
    exampleRows: [
      { contract_number: 'SAF-2026-001', client_name: 'أحمد العتيبي', worker_name: 'MARY JANE', nationality: 'الفلبين', amount: 14500, contract_date: '2026-08-01', status: 'جديد' },
    ]
  },
  {
    entityKey: 'employees',
    displayName: 'الموظفين',
    icon: 'fa-solid fa-user-tie',
    materialIcon: 'person',
    color: '#0284C7',
    fields: [
      { systemField: 'name', label: 'اسم الموظف', required: true, type: 'string' },
      { systemField: 'employee_number', label: 'الرقم الوظيفي', required: false, type: 'string' },
      { systemField: 'department', label: 'القسم', required: false, type: 'string' },
      { systemField: 'position', label: 'المسمى الوظيفي', required: false, type: 'string' },
      { systemField: 'phone', label: 'رقم الجوال', required: false, type: 'phone' },
      { systemField: 'email', label: 'البريد الإلكتروني', required: false, type: 'email' },
      { systemField: 'national_id', label: 'رقم الهوية', required: false, type: 'string' },
      { systemField: 'salary', label: 'الراتب الأساسي', required: false, type: 'number' },
      { systemField: 'hire_date', label: 'تاريخ التعيين', required: false, type: 'date' },
      { systemField: 'branch', label: 'الفرع', required: false, type: 'string', defaultValue: 'فرع الرياض' },
    ],
    exampleRows: [
      { name: 'خالد محمد السليم', employee_number: 'EMP-001', department: 'الإدارة', position: 'مدير عام', phone: '0551234567', salary: 25000, hire_date: '2020-01-01' },
    ]
  },
  {
    entityKey: 'chart_of_accounts',
    displayName: 'دليل الحسابات',
    icon: 'fa-solid fa-sitemap',
    materialIcon: 'account_tree',
    color: '#059669',
    fields: [
      { systemField: 'account_code', label: 'رقم الحساب', required: true, type: 'string' },
      { systemField: 'account_name', label: 'اسم الحساب', required: true, type: 'string' },
      { systemField: 'account_type', label: 'نوع الحساب', required: true, type: 'string' },
      { systemField: 'parent_code', label: 'رقم الحساب الأب', required: false, type: 'string' },
      { systemField: 'is_active', label: 'نشط', required: false, type: 'boolean', defaultValue: true },
      { systemField: 'opening_balance', label: 'الرصيد الافتتاحي', required: false, type: 'number', defaultValue: 0 },
    ],
    exampleRows: [
      { account_code: '11010', account_name: 'الصندوق الرئيسي', account_type: 'أصول', parent_code: '11000', is_active: true, opening_balance: 50000 },
      { account_code: '41100', account_name: 'إيرادات عقود استقدام', account_type: 'إيرادات', parent_code: '41000', is_active: true, opening_balance: 0 },
    ]
  },
  {
    entityKey: 'journal_entries',
    displayName: 'قيود يومية',
    icon: 'fa-solid fa-book',
    materialIcon: 'menu_book',
    color: '#D97706',
    fields: [
      { systemField: 'entry_date', label: 'التاريخ', required: true, type: 'date' },
      { systemField: 'description', label: 'البيان', required: true, type: 'string' },
      { systemField: 'account_code', label: 'رقم الحساب', required: true, type: 'string' },
      { systemField: 'account_name', label: 'اسم الحساب', required: false, type: 'string' },
      { systemField: 'debit', label: 'مدين', required: false, type: 'number', defaultValue: 0 },
      { systemField: 'credit', label: 'دائن', required: false, type: 'number', defaultValue: 0 },
      { systemField: 'reference', label: 'المرجع', required: false, type: 'string' },
      { systemField: 'cost_center', label: 'مركز التكلفة', required: false, type: 'string' },
    ],
    exampleRows: [
      { entry_date: '2026-08-01', description: 'سداد إيجار المكتب', account_code: '51200', account_name: 'مصروف إيجار', debit: 15000, credit: 0, reference: 'JV-001' },
      { entry_date: '2026-08-01', description: 'سداد إيجار المكتب', account_code: '11010', account_name: 'الصندوق الرئيسي', debit: 0, credit: 15000, reference: 'JV-001' },
    ]
  },
  {
    entityKey: 'offices',
    displayName: 'المكاتب الخارجية',
    icon: 'fa-solid fa-building-columns',
    materialIcon: 'domain',
    color: '#6366F1',
    fields: [
      { systemField: 'name', label: 'اسم المكتب', required: true, type: 'string' },
      { systemField: 'country', label: 'الدولة', required: true, type: 'string' },
      { systemField: 'license_no', label: 'رقم الترخيص', required: false, type: 'string' },
      { systemField: 'contact_person', label: 'المسؤول', required: false, type: 'string' },
      { systemField: 'phone', label: 'رقم التواصل', required: false, type: 'phone' },
      { systemField: 'email', label: 'البريد الإلكتروني', required: false, type: 'email' },
      { systemField: 'status', label: 'الحالة', required: false, type: 'string', defaultValue: 'نشط' },
    ],
    exampleRows: [
      { name: 'DAMAS FOREIGN AGENCY', country: 'اثيوبيا', license_no: 'LIC-ET-001', contact_person: 'Ahmed Ali', phone: '+251911234567', status: 'نشط' },
    ]
  },
  {
    entityKey: 'invoices',
    displayName: 'الفواتير',
    icon: 'fa-solid fa-receipt',
    materialIcon: 'receipt_long',
    color: '#EA580C',
    fields: [
      { systemField: 'invoice_number', label: 'رقم الفاتورة', required: true, type: 'string' },
      { systemField: 'client_name', label: 'اسم العميل', required: true, type: 'string' },
      { systemField: 'invoice_date', label: 'التاريخ', required: true, type: 'date' },
      { systemField: 'subtotal', label: 'المبلغ قبل الضريبة', required: true, type: 'number' },
      { systemField: 'vat_amount', label: 'ضريبة القيمة المضافة', required: false, type: 'number', defaultValue: 0 },
      { systemField: 'total', label: 'الإجمالي', required: false, type: 'number' },
      { systemField: 'status', label: 'حالة الفاتورة', required: false, type: 'string', defaultValue: 'مسودة' },
      { systemField: 'description', label: 'الوصف', required: false, type: 'string' },
    ],
    exampleRows: [
      { invoice_number: 'INV-2026-001', client_name: 'أحمد العتيبي', invoice_date: '2026-08-01', subtotal: 14500, vat_amount: 2175, total: 16675, status: 'مدفوعة' },
    ]
  },
  {
    entityKey: 'rent_contracts',
    displayName: 'عقود التأجير والتشغيل',
    icon: 'fa-solid fa-handshake',
    materialIcon: 'handshake',
    color: '#0D9488',
    fields: [
      { systemField: 'contract_number', label: 'رقم العقد', required: true, type: 'string' },
      { systemField: 'client_name', label: 'اسم العميل', required: true, type: 'string' },
      { systemField: 'client_phone', label: 'جوال العميل', required: false, type: 'phone' },
      { systemField: 'worker_name', label: 'اسم العاملة/العامل', required: true, type: 'string' },
      { systemField: 'nationality', label: 'الجنسية', required: false, type: 'string' },
      { systemField: 'monthly_rate', label: 'القيمة الشهرية', required: true, type: 'number' },
      { systemField: 'duration_months', label: 'المدة (أشهر)', required: false, type: 'number', defaultValue: 3 },
      { systemField: 'start_date', label: 'تاريخ البداية', required: false, type: 'date' },
      { systemField: 'status', label: 'حالة العقد', required: false, type: 'string', defaultValue: 'ساري' },
    ],
    exampleRows: [
      { contract_number: 'RENT-2026-001', client_name: 'سارة خالد الدوسري', worker_name: 'ROSEMARIE', nationality: 'الفلبين', monthly_rate: 3450, duration_months: 3, start_date: '2026-08-01', status: 'ساري' },
    ]
  },
  {
    entityKey: 'attendances',
    displayName: 'سجلات الحضور والانصراف والبصمة',
    icon: 'fa-solid fa-user-clock',
    materialIcon: 'fingerprint',
    color: '#3B82F6',
    fields: [
      { systemField: 'employee_name', label: 'اسم الموظف', required: true, type: 'string' },
      { systemField: 'employee_number', label: 'الرقم الوظيفي', required: true, type: 'string' },
      { systemField: 'date', label: 'التاريخ', required: true, type: 'date' },
      { systemField: 'check_in', label: 'وقت الحضور', required: false, type: 'string' },
      { systemField: 'check_out', label: 'وقت الانصراف', required: false, type: 'string' },
      { systemField: 'status', label: 'الحالة', required: false, type: 'string', defaultValue: 'حاضر' },
      { systemField: 'delay_minutes', label: 'دقائق التأخير', required: false, type: 'number', defaultValue: 0 },
      { systemField: 'branch', label: 'الفرع', required: false, type: 'string', defaultValue: 'فرع الرياض' },
    ],
    exampleRows: [
      { employee_name: 'خالد السليم', employee_number: 'EMP-001', date: '2026-08-15', check_in: '08:00', check_out: '17:00', status: 'حاضر', delay_minutes: 0, branch: 'فرع الرياض' },
      { employee_name: 'محمد عبدالله', employee_number: 'EMP-002', date: '2026-08-15', check_in: '08:15', check_out: '17:00', status: 'تأخير', delay_minutes: 15, branch: 'فرع الرياض' },
    ]
  },
  {
    entityKey: 'custodies',
    displayName: 'العهد والأصول والمستلزمات',
    icon: 'fa-solid fa-vault',
    materialIcon: 'inventory_2',
    color: '#8B5CF6',
    fields: [
      { systemField: 'item_name', label: 'اسم العهدة / الأصل', required: true, type: 'string' },
      { systemField: 'code', label: 'كود الأصل', required: true, type: 'string' },
      { systemField: 'assigned_to', label: 'المستلم (الموظف)', required: true, type: 'string' },
      { systemField: 'category', label: 'التصنيف', required: false, type: 'string', defaultValue: 'أجهزة إلكترونية' },
      { systemField: 'cost', label: 'التكلفة التقديرية', required: false, type: 'number', defaultValue: 0 },
      { systemField: 'received_date', label: 'تاريخ الاستلام', required: false, type: 'date' },
      { systemField: 'status', label: 'الحالة', required: false, type: 'string', defaultValue: 'نشط' },
    ],
    exampleRows: [
      { item_name: 'كمبيوتر محمول Dell XPS', code: 'CUST-001', assigned_to: 'خالد السليم', category: 'أجهزة إلكترونية', cost: 6500, received_date: '2026-01-10', status: 'نشط' },
    ]
  },
  {
    entityKey: 'cost_centers',
    displayName: 'مراكز التكلفة',
    icon: 'fa-solid fa-diagram-project',
    materialIcon: 'account_tree',
    color: '#0284C7',
    fields: [
      { systemField: 'code', label: 'كود المركز', required: true, type: 'string' },
      { systemField: 'name', label: 'اسم مركز التكلفة', required: true, type: 'string' },
      { systemField: 'category', label: 'التصنيف/النشاط', required: false, type: 'string', defaultValue: 'استقدام' },
      { systemField: 'manager', label: 'المسؤول', required: false, type: 'string' },
      { systemField: 'budget', label: 'الميزانية المعتمدة', required: false, type: 'number', defaultValue: 0 },
      { systemField: 'status', label: 'الحالة', required: false, type: 'string', defaultValue: 'نشط' },
    ],
    exampleRows: [
      { code: 'CC-101', name: 'مركز استقدام الفلبين', category: 'استقدام', manager: 'خالد السليم', budget: 500000, status: 'نشط' },
      { code: 'CC-102', name: 'مركز التأجير والتشغيل', category: 'تشغيل', manager: 'سعود الفيصل', budget: 350000, status: 'نشط' },
    ]
  },
  {
    entityKey: 'shelter',
    displayName: 'إدارة مركز الإيواء والفرز',
    icon: 'fa-solid fa-hotel',
    materialIcon: 'apartment',
    color: '#F59E0B',
    fields: [
      { systemField: 'worker_name', label: 'اسم العاملة', required: true, type: 'string' },
      { systemField: 'passport_number', label: 'رقم الجواز', required: true, type: 'string' },
      { systemField: 'nationality', label: 'الجنسية', required: true, type: 'string' },
      { systemField: 'check_in_date', label: 'تاريخ الدخول', required: true, type: 'date' },
      { systemField: 'room_number', label: 'رقم الغرفة', required: false, type: 'string' },
      { systemField: 'reason', label: 'سبب الإيواء', required: false, type: 'string', defaultValue: 'وصول جديد' },
      { systemField: 'status', label: 'الحالة', required: false, type: 'string', defaultValue: 'داخل المقر' },
    ],
    exampleRows: [
      { worker_name: 'FATIMA BEGUM', passport_number: 'BD123456', nationality: 'بنغلاديش', check_in_date: '2026-08-10', room_number: '104', reason: 'وصول جديد', status: 'داخل المقر' },
    ]
  },
  {
    entityKey: 'sponsorship_transfers',
    displayName: 'نقل الكفالة والتنازل',
    icon: 'fa-solid fa-people-arrows',
    materialIcon: 'swap_horiz',
    color: '#EC4899',
    fields: [
      { systemField: 'worker_name', label: 'اسم العاملة', required: true, type: 'string' },
      { systemField: 'current_sponsor', label: 'الكفيل الحالي', required: true, type: 'string' },
      { systemField: 'new_sponsor', label: 'الكفيل الجديد', required: false, type: 'string' },
      { systemField: 'nationality', label: 'الجنسية', required: false, type: 'string' },
      { systemField: 'transfer_fee', label: 'رسوم التنازل', required: false, type: 'number', defaultValue: 0 },
      { systemField: 'request_date', label: 'تاريخ الطلب', required: false, type: 'date' },
      { systemField: 'status', label: 'الحالة', required: false, type: 'string', defaultValue: 'تحت التجربة' },
    ],
    exampleRows: [
      { worker_name: 'MERON HAILE', current_sponsor: 'سعد القحطاني', new_sponsor: 'فهد المطيري', nationality: 'اثيوبيا', transfer_fee: 18000, request_date: '2026-08-12', status: 'تحت التجربة' },
    ]
  },
  {
    entityKey: 'financial_requests',
    displayName: 'الطلبات والمصروفات المالية',
    icon: 'fa-solid fa-file-invoice-dollar',
    materialIcon: 'request_quote',
    color: '#10B981',
    fields: [
      { systemField: 'request_no', label: 'رقم الطلب', required: true, type: 'string' },
      { systemField: 'requester_name', label: 'مقدم الطلب', required: true, type: 'string' },
      { systemField: 'category', label: 'نوع المصروف', required: true, type: 'string' },
      { systemField: 'amount', label: 'المبلغ', required: true, type: 'number' },
      { systemField: 'request_date', label: 'تاريخ الطلب', required: false, type: 'date' },
      { systemField: 'notes', label: 'ملاحظات وتفاصيل', required: false, type: 'string' },
      { systemField: 'status', label: 'الحالة', required: false, type: 'string', defaultValue: 'بانتظار الموافقة' },
    ],
    exampleRows: [
      { request_no: 'REQ-2026-0801', requester_name: 'أحمد التميمي', category: 'مصاريف نقل وضيافة', amount: 1200, request_date: '2026-08-14', notes: 'استقبال وفد من المطار', status: 'بانتظار الموافقة' },
    ]
  },
  {
    entityKey: 'complaints',
    displayName: 'الشكاوى والتذاكر والدعم الفني',
    icon: 'fa-solid fa-headset',
    materialIcon: 'support_agent',
    color: '#E11D48',
    fields: [
      { systemField: 'ticket_no', label: 'رقم التذكرة', required: true, type: 'string' },
      { systemField: 'client_name', label: 'اسم العميل', required: true, type: 'string' },
      { systemField: 'client_phone', label: 'رقم الجوال', required: false, type: 'phone' },
      { systemField: 'subject', label: 'موضوع الشكوى', required: true, type: 'string' },
      { systemField: 'priority', label: 'الأولوية', required: false, type: 'string', defaultValue: 'متوسطة' },
      { systemField: 'status', label: 'حالة التذكرة', required: false, type: 'string', defaultValue: 'مفتوحة' },
      { systemField: 'created_date', label: 'تاريخ الفتح', required: false, type: 'date' },
    ],
    exampleRows: [
      { ticket_no: 'TCK-2026-010', client_name: 'منصور الدوسري', client_phone: '0501239876', subject: 'استفسار عن موعد وصول الرحلة', priority: 'عالية', status: 'قيد المتابعة', created_date: '2026-08-14' },
    ]
  },
];

// ─── File Parser ─────────────────────────────────────────────────────────────

export async function parseImportFile(file: File): Promise<ParsedFileData> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const fileName = file.name;

  if (['xlsx', 'xls'].includes(ext)) {
    return parseExcel(file, fileName);
  } else if (ext === 'csv') {
    return parseCSV(file, fileName);
  } else if (ext === 'json') {
    return parseJSON(file, fileName);
  }

  throw new Error(`نوع الملف غير مدعوم: .${ext}. الأنواع المدعومة: .xlsx, .xls, .csv, .json`);
}

async function parseExcel(file: File, fileName: string): Promise<ParsedFileData> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: '' });

  if (jsonData.length === 0) {
    throw new Error('الملف فارغ أو لا يحتوي على بيانات');
  }

  const headers = Object.keys(jsonData[0]);
  return { headers, rows: jsonData, totalRows: jsonData.length, fileName, fileType: 'Excel' };
}

async function parseCSV(file: File, fileName: string): Promise<ParsedFileData> {
  const text = await file.text();
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) throw new Error('ملف CSV فارغ أو يحتوي على سطر واحد فقط');

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows: Record<string, any>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, any> = {};
    headers.forEach((h, idx) => { row[h] = values[idx] || ''; });
    rows.push(row);
  }

  return { headers, rows, totalRows: rows.length, fileName, fileType: 'CSV' };
}

async function parseJSON(file: File, fileName: string): Promise<ParsedFileData> {
  const text = await file.text();
  const data = JSON.parse(text);
  const arr = Array.isArray(data) ? data : [data];
  if (arr.length === 0) throw new Error('ملف JSON فارغ');

  const headers = Object.keys(arr[0]);
  return { headers, rows: arr, totalRows: arr.length, fileName, fileType: 'JSON' };
}

// ─── Auto Column Matcher ────────────────────────────────────────────────────

const ARABIC_SYNONYMS: Record<string, string[]> = {
  name: ['الاسم', 'اسم', 'name', 'الاسم الكامل', 'full_name', 'اسم العميل', 'client_name', 'اسم الموظف', 'اسم المكتب'],
  phone: ['الجوال', 'جوال', 'هاتف', 'رقم الجوال', 'phone', 'mobile', 'tel', 'telephone', 'رقم الهاتف', 'جوال العميل'],
  email: ['البريد', 'ايميل', 'email', 'e-mail', 'البريد الإلكتروني', 'بريد'],
  national_id: ['الهوية', 'رقم الهوية', 'هوية', 'national_id', 'id_number', 'الإقامة', 'رقم الإقامة', 'iqama'],
  city: ['المدينة', 'مدينة', 'city', 'المنطقة'],
  address: ['العنوان', 'عنوان', 'address'],
  maid_name: ['اسم العاملة', 'worker_name', 'maid_name', 'الاسم', 'name', 'اسم العامل'],
  worker_name: ['اسم العاملة', 'اسم العامل', 'worker_name', 'maid_name', 'العاملة'],
  nationality: ['الجنسية', 'جنسية', 'nationality', 'country', 'الدولة'],
  job: ['المهنة', 'مهنة', 'job', 'profession', 'الوظيفة', 'occupation'],
  passport_number: ['الجواز', 'رقم الجواز', 'passport', 'passport_number', 'passport_no'],
  age: ['العمر', 'عمر', 'age'],
  salary: ['الراتب', 'راتب', 'salary', 'wage', 'المبلغ', 'الراتب الأساسي'],
  contract_number: ['رقم العقد', 'contract_number', 'contract_no', 'العقد', 'كود العقد'],
  amount: ['المبلغ', 'مبلغ', 'amount', 'total', 'الإجمالي', 'قيمة', 'القيمة'],
  status: ['الحالة', 'حالة', 'status', 'state'],
  department: ['القسم', 'قسم', 'department', 'dept', 'الإدارة'],
  position: ['المسمى', 'المسمى الوظيفي', 'position', 'title', 'الوظيفة'],
  account_code: ['رقم الحساب', 'كود الحساب', 'account_code', 'acc_code', 'الحساب'],
  account_name: ['اسم الحساب', 'account_name', 'acc_name'],
  account_type: ['نوع الحساب', 'تصنيف الحساب', 'account_type', 'type'],
  debit: ['مدين', 'debit', 'مبلغ مدين'],
  credit: ['دائن', 'credit', 'مبلغ دائن'],
  description: ['البيان', 'الوصف', 'description', 'بيان', 'وصف', 'notes', 'ملاحظات'],
  invoice_number: ['رقم الفاتورة', 'invoice_number', 'invoice_no', 'فاتورة'],
  invoice_date: ['تاريخ الفاتورة', 'invoice_date', 'التاريخ', 'date'],
  entry_date: ['التاريخ', 'تاريخ', 'date', 'entry_date'],
  monthly_rate: ['القيمة الشهرية', 'الإيجار الشهري', 'monthly_rate', 'الراتب الشهري'],
  employee_name: ['اسم الموظف', 'الموظف', 'employee_name', 'name'],
  employee_number: ['الرقم الوظيفي', 'كود الموظف', 'employee_number', 'emp_no', 'id'],
  check_in: ['وقت الحضور', 'دخول', 'check_in', 'time_in'],
  check_out: ['وقت الانصراف', 'خروج', 'check_out', 'time_out'],
  item_name: ['اسم العهدة', 'اسم الأصل', 'item_name', 'asset_name', 'الوصف'],
  code: ['الكود', 'كود الأصل', 'كود المركز', 'code', 'رمز'],
  assigned_to: ['المستلم', 'الموظف', 'assigned_to', 'المسؤول'],
  room_number: ['رقم الغرفة', 'الغرفة', 'room_number', 'room'],
  current_sponsor: ['الكفيل الحالي', 'الكفيل القديم', 'current_sponsor', 'صاحب العمل الحالي'],
  new_sponsor: ['الكفيل الجديد', 'صاحب العمل الجديد', 'new_sponsor'],
  request_no: ['رقم الطلب', 'كود الطلب', 'request_no', 'request_id'],
  requester_name: ['مقدم الطلب', 'الموظف', 'requester_name'],
  ticket_no: ['رقم التذكرة', 'رقم الشكوى', 'ticket_no', 'ticket_id'],
  subject: ['موضوع الشكوى', 'الموضوع', 'subject', 'عنوان الشكوى'],
};

export function autoMapColumns(
  fileHeaders: string[],
  template: ImportTemplate
): ColumnMap[] {
  const mappings: ColumnMap[] = [];

  for (const field of template.fields) {
    const synonyms = ARABIC_SYNONYMS[field.systemField] || [field.systemField, field.label];
    const allSynonyms = [...synonyms, field.label, field.systemField].map(s => s.toLowerCase().trim());

    let matched = false;
    for (const header of fileHeaders) {
      const normalizedHeader = header.toLowerCase().trim();
      if (allSynonyms.includes(normalizedHeader) || normalizedHeader === field.systemField.toLowerCase()) {
        mappings.push({ fileColumn: header, systemField: field.systemField });
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Try fuzzy: check if header contains the synonym
      for (const header of fileHeaders) {
        const nh = header.toLowerCase().trim();
        if (allSynonyms.some(s => nh.includes(s) || s.includes(nh))) {
          mappings.push({ fileColumn: header, systemField: field.systemField });
          matched = true;
          break;
        }
      }
    }

    // If still not matched, leave unmapped (user will manually set)
    if (!matched) {
      mappings.push({ fileColumn: '', systemField: field.systemField });
    }
  }

  return mappings;
}

// ─── Validators ──────────────────────────────────────────────────────────────

function validateField(value: any, field: FieldMapping, rowIndex: number): ImportError | null {
  const displayValue = value === undefined || value === null || value === '' ? '(فارغ)' : String(value);

  // Required check
  if (field.required && (value === undefined || value === null || String(value).trim() === '')) {
    return { row: rowIndex + 1, field: field.label, value: displayValue, message: `الحقل "${field.label}" مطلوب ولا يمكن أن يكون فارغاً` };
  }

  // Skip validation for empty optional fields
  if (!value && value !== 0) return null;

  switch (field.type) {
    case 'number':
      if (isNaN(Number(value))) {
        return { row: rowIndex + 1, field: field.label, value: displayValue, message: `القيمة "${displayValue}" يجب أن تكون رقماً` };
      }
      break;
    case 'email':
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
        return { row: rowIndex + 1, field: field.label, value: displayValue, message: `البريد "${displayValue}" غير صالح` };
      }
      break;
    case 'phone':
      if (value && !/^[\d+\-\s()]{7,20}$/.test(String(value))) {
        return { row: rowIndex + 1, field: field.label, value: displayValue, message: `رقم الهاتف "${displayValue}" غير صالح` };
      }
      break;
    case 'date':
      if (value && isNaN(Date.parse(String(value)))) {
        return { row: rowIndex + 1, field: field.label, value: displayValue, message: `التاريخ "${displayValue}" غير صالح` };
      }
      break;
  }

  return null;
}

// ─── Validation ──────────────────────────────────────────────────────────────

export function validateImportData(
  rows: Record<string, any>[],
  columnMaps: ColumnMap[],
  template: ImportTemplate
): ValidationResult {
  const valid: Record<string, any>[] = [];
  const errors: ImportError[] = [];
  const warnings: ImportWarning[] = [];

  for (let i = 0; i < rows.length; i++) {
    const rawRow = rows[i];
    const mappedRow: Record<string, any> = {
      id: `imp-${Date.now()}-${i}`,
      company_id: 'SAF',
      created_at: new Date().toISOString(),
    };
    let rowHasError = false;

    for (const field of template.fields) {
      const mapping = columnMaps.find(m => m.systemField === field.systemField);
      let value: any = undefined;

      if (mapping && mapping.fileColumn && rawRow[mapping.fileColumn] !== undefined) {
        value = rawRow[mapping.fileColumn];
      }

      // Apply default
      if ((value === undefined || value === null || String(value).trim() === '') && field.defaultValue !== undefined) {
        value = field.defaultValue;
      }

      // Type coercion
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        if (field.type === 'number') {
          value = Number(value);
        } else if (field.type === 'boolean') {
          value = value === true || value === 'true' || value === '1' || value === 'نعم' || value === 'yes';
        } else if (field.type === 'date') {
          const d = new Date(value);
          value = isNaN(d.getTime()) ? String(value) : d.toISOString().split('T')[0];
        } else {
          value = String(value).trim();
        }
      }

      // Validate
      const error = validateField(value, field, i);
      if (error) {
        if (field.required) {
          errors.push(error);
          rowHasError = true;
        } else {
          warnings.push({ ...error, message: `تحذير: ${error.message}` });
        }
      }

      mappedRow[field.systemField] = value ?? field.defaultValue ?? '';
    }

    if (!rowHasError) {
      valid.push(mappedRow);
    }
  }

  return { valid, warnings, errors };
}

// ─── Batch Import ────────────────────────────────────────────────────────────

export async function executeImport(
  validRows: Record<string, any>[],
  entityKey: string
): Promise<ImportResult> {
  const startTime = Date.now();
  let imported = 0;
  const failedErrors: ImportError[] = [];

  for (let i = 0; i < validRows.length; i++) {
    try {
      await realErpDataStore.addRecord(entityKey, validRows[i] as any);
      imported++;
    } catch (err: any) {
      failedErrors.push({
        row: i + 1,
        field: 'system',
        value: validRows[i],
        message: `فشل إدخال السجل: ${err?.message || 'خطأ غير معروف'}`
      });
    }
  }

  const result: ImportResult = {
    total: validRows.length,
    imported,
    failed: failedErrors.length,
    skipped: 0,
    errors: failedErrors,
    warnings: [],
    entityKey,
    timestamp: new Date().toISOString(),
    duration: Date.now() - startTime,
  };

  // Save import history
  saveImportHistory(result);

  return result;
}

// ─── Import History ──────────────────────────────────────────────────────────

const IMPORT_HISTORY_KEY = 'ALSULAIM_ERP_IMPORT_HISTORY';

export interface ImportHistoryEntry extends ImportResult {
  id: string;
  templateName: string;
}

export function saveImportHistory(result: ImportResult): void {
  try {
    const history = getImportHistory();
    const template = IMPORT_TEMPLATES.find(t => t.entityKey === result.entityKey);
    const entry: ImportHistoryEntry = {
      ...result,
      id: `imp-hist-${Date.now()}`,
      templateName: template?.displayName || result.entityKey,
    };
    history.unshift(entry);
    // Keep last 100 entries
    localStorage.setItem(IMPORT_HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
  } catch (e) {
    console.warn('Could not save import history', e);
  }
}

export function getImportHistory(): ImportHistoryEntry[] {
  try {
    const raw = localStorage.getItem(IMPORT_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ─── Template Download ───────────────────────────────────────────────────────

export function downloadTemplate(template: ImportTemplate): void {
  const headers = template.fields.map(f => f.label);
  const wsData = [headers];

  for (const example of template.exampleRows) {
    const row = template.fields.map(f => example[f.systemField] ?? '');
    wsData.push(row);
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  ws['!cols'] = headers.map(() => ({ wch: 22 }));

  XLSX.utils.book_append_sheet(wb, ws, template.displayName);
  XLSX.writeFile(wb, `قالب_استيراد_${template.displayName}.xlsx`);
}

/**
 * Universal Direct Importer for any file to target entity
 */
export async function importAnyFileToTable(
  entityKey: string,
  file: File
): Promise<{ success: boolean; importedCount: number; errors?: string[] }> {
  try {
    const template = IMPORT_TEMPLATES.find(t => t.entityKey === entityKey) || IMPORT_TEMPLATES[0];
    const parsed = await parseImportFile(file);
    const mappings = autoMapColumns(parsed.headers, template);
    const validation = validateImportData(parsed.rows, mappings, template);
    const result = await executeImport(validation.valid, template.entityKey);
    return {
      success: result.imported > 0 || validation.errors.length === 0,
      importedCount: result.imported,
      errors: result.errors.map(e => `سطر ${e.row}: ${e.message}`),
    };
  } catch (err: any) {
    return {
      success: false,
      importedCount: 0,
      errors: [err.message || 'فشل معالجة الملف'],
    };
  }
}
