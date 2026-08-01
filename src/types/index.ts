/* TypeScript Types for ERP KALID G GROUP SULAIM */

export interface NavItem {
  id: string;
  title: string;
  icon?: string;
  href?: string;
  badge?: string | number;
  badgeType?: 'primary' | 'success' | 'warning' | 'danger' | 'purple';
  children?: NavItem[];
}

export interface Client {
  id: string;
  client_number: string;
  name: string;
  phone: string;
  national_id: string;
  city: string;
  status: 'نشط' | 'محظور';
  type: 'شخص' | 'شركة';
  orders_count: number;
  active_orders: number;
  recruitment_contracts: number;
  rent_contracts: number;
  created_at: string;
  added_by: string;
  branch: string;
}

export interface Order {
  id: string;
  maid_name: string;
  maid_photo?: string;
  client_name: string;
  client_phone: string;
  nationality: string;
  passport_number: string;
  request_type: 'معروفة' | 'معينة' | 'حسب المواصفات';
  status: 'جديد' | 'تحت الإجراء' | 'تم التعاقد' | 'مكتملة' | 'مرفوضة';
  timer_status: 'عادي' | 'عاجل' | 'متأخر';
  deadline: string;
  contract_status: 'بدون عقد' | 'تم التعاقد';
  created_at: string;
  responsible_employee: string;
  branch: string;
  office_name: string;
}

export interface RecruitmentContract {
  id: string;
  contract_number: string;
  client_name: string;
  client_phone: string;
  maid_name: string;
  maid_passport: string;
  nationality: string;
  musaned_number: string;
  external_office: string;
  stage: 'عقود جديدة' | 'مساند' | 'تفويض' | 'تفييز' | 'تذكرة' | 'وصول' | 'مكتمل' | 'مرتجع';
  warranty_status: 'نشط' | 'منتهي' | 'غير مطبق';
  payment_status: 'تم الدفع' | 'مدفوع جزئياً' | 'معلق';
  amount: number;
  created_at: string;
  branch: string;
}

export interface RentContract {
  id: string;
  contract_number: string;
  client_name: string;
  client_phone: string;
  maid_name: string;
  nationality: string;
  start_date: string;
  end_date: string;
  duration_months: number;
  monthly_cost: number;
  total_amount: number;
  status: 'جديد' | 'نشط' | 'بانتظار التوقيع' | 'تم تسليم العاملة' | 'مكتمل' | 'تم النقل' | 'ملغي';
  payment_status: 'معلق' | 'تم الدفع' | 'بانتظار التحويل';
  marketer: string;
  branch: string;
}

export interface ShelterItem {
  id: string;
  maid_name: string;
  passport: string;
  nationality: string;
  contract_ref: string;
  client_name: string;
  shelter_location: string;
  status: 'داخل الإيواء' | 'خارج الإيواء' | 'متاح للنقل' | 'مرحلة الترحيل' | 'تم الترحيل';
  days_in_shelter: number;
  catering_meals_count: number;
  work_willingness: 'ترغب بالعمل' | 'لا ترغب بالعمل' | 'غير محدد';
}

export interface Employee {
  id: string;
  employee_code: string;
  name: string;
  national_id: string;
  hire_date: string;
  job_title: string;
  department: string;
  status: 'نشط' | 'إجازة' | 'معطل';
  salary: number;
  branch: string;
}

export interface AccountNode {
  code: string;
  name: string;
  type: 'أصول' | 'خصوم' | 'حقوق ملكية' | 'إيرادات' | 'مصروفات';
  balance: number;
  children_count?: number;
}
