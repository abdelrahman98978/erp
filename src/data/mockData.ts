import { Client, Order, RecruitmentContract, RentContract, ShelterItem, Employee } from '../types';

export const MOCK_CLIENTS: Client[] = [
  {
    id: '2518',
    client_number: '2518',
    name: 'سارة احمد محمد',
    phone: '+9660558025628',
    national_id: '1100000001',
    city: 'الرياض',
    status: 'نشط',
    type: 'شخص',
    orders_count: 1,
    active_orders: 0,
    recruitment_contracts: 1,
    rent_contracts: 0,
    created_at: '2026-07-28',
    added_by: 'مشرف',
    branch: 'الفرع الرئيسي'
  },
  {
    id: '2517',
    client_number: '2517',
    name: 'عميل المالية التجريبي',
    phone: '+966561375411',
    national_id: '1200958625',
    city: 'جدة',
    status: 'نشط',
    type: 'شركة',
    orders_count: 4,
    active_orders: 1,
    recruitment_contracts: 3,
    rent_contracts: 0,
    created_at: '2026-07-26',
    added_by: 'محمد مصطفي',
    branch: 'الفرع الرئيسي'
  },
  {
    id: '2516',
    client_number: '2516',
    name: 'ابو اياد Al Yarmouk',
    phone: '+966562404213',
    national_id: '1030400444',
    city: 'الرياض',
    status: 'نشط',
    type: 'شخص',
    orders_count: 2,
    active_orders: 1,
    recruitment_contracts: 1,
    rent_contracts: 1,
    created_at: '2026-07-20',
    added_by: 'احمد',
    branch: 'الفرع الرئيسي'
  },
  {
    id: '2515',
    client_number: '2515',
    name: 'بندر صالح الهويريني',
    phone: '+966555774494',
    national_id: '1088449922',
    city: 'بريدة',
    status: 'نشط',
    type: 'شخص',
    orders_count: 3,
    active_orders: 1,
    recruitment_contracts: 2,
    rent_contracts: 1,
    created_at: '2026-06-22',
    added_by: 'أحمد محمد اختبار',
    branch: 'فرع الرياض'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: '564',
    maid_name: 'عاملة استقدام دماس',
    client_name: 'نايف القحطاني',
    client_phone: '+966535355555',
    nationality: 'اثيوبيا',
    passport_number: 'A21221',
    request_type: 'حسب المواصفات',
    status: 'جديد',
    timer_status: 'متأخر',
    deadline: '2026-07-15 18:15',
    contract_status: 'بدون عقد',
    created_at: '2026-07-14 18:15',
    responsible_employee: 'Mohameed',
    branch: 'الفرع الرئيسي',
    office_name: 'DAMAS FOREGIN EMPLOYMENT AGENCY'
  },
  {
    id: '561',
    maid_name: 'عاملة فلبينية بلاتينيوم',
    client_name: 'محمد مصطفى',
    client_phone: '+966539803014',
    nationality: 'الفلبين',
    passport_number: 'ANON-PS-00074',
    request_type: 'حسب المواصفات',
    status: 'جديد',
    timer_status: 'متأخر',
    deadline: '2026-07-05 15:57',
    contract_status: 'بدون عقد',
    created_at: '2026-07-04 15:57',
    responsible_employee: 'Mohameed',
    branch: 'الفرع الرئيسي',
    office_name: "PLATINUM BROTHERS INT'L MANPOWER"
  },
  {
    id: '560',
    maid_name: 'سارة ألبانيا',
    client_name: 'سارة احمد محمد',
    client_phone: '+9660558025628',
    nationality: 'ألبانيا',
    passport_number: 'ALB-99882',
    request_type: 'معينة',
    status: 'تم التعاقد',
    timer_status: 'عادي',
    deadline: '2026-07-30 12:00',
    contract_status: 'تم التعاقد',
    created_at: '2026-07-28 10:00',
    responsible_employee: 'سهام',
    branch: 'الفرع الرئيسي',
    office_name: 'EARLY LEARNERS CONSULTANT'
  }
];

export const MOCK_RECRUITMENT_CONTRACTS: RecruitmentContract[] = [
  {
    id: '594',
    contract_number: '#RC-2026-0594',
    client_name: 'عميل المالية التجريبي',
    client_phone: '+966561375411',
    maid_name: 'عاملة تجريبية 99',
    maid_passport: 'ETH-887711',
    nationality: 'اثيوبيا',
    musaned_number: 'MS-88992211',
    external_office: 'DAMAS FOREGIN EMPLOYMENT AGENCY',
    stage: 'تفييز',
    warranty_status: 'نشط',
    payment_status: 'تم الدفع',
    amount: 14500,
    created_at: '2026-07-29',
    branch: 'الفرع الرئيسي'
  },
  {
    id: '592',
    contract_number: '#RC-2026-0592',
    client_name: 'نايف القحطاني',
    client_phone: '+966535355555',
    maid_name: 'KIMBERLY',
    maid_passport: 'PHL-998231',
    nationality: 'الفلبين',
    musaned_number: 'MS-77665544',
    external_office: "PLATINUM BROTHERS INT'L",
    stage: 'وصول',
    warranty_status: 'نشط',
    payment_status: 'تم الدفع',
    amount: 18500,
    created_at: '2026-07-20',
    branch: 'الفرع الرئيسي'
  },
  {
    id: '588',
    contract_number: '#RC-2026-0588',
    client_name: 'سارة احمد محمد',
    client_phone: '+9660558025628',
    maid_name: 'Sara',
    maid_passport: 'KNY-554411',
    nationality: 'كينيا',
    musaned_number: 'MS-11223344',
    external_office: 'VERSATILE OVERSEAS LTD',
    stage: 'مكتمل',
    warranty_status: 'نشط',
    payment_status: 'تم الدفع',
    amount: 12000,
    created_at: '2026-06-15',
    branch: 'فرع الرياض'
  }
];

export const MOCK_RENT_CONTRACTS: RentContract[] = [
  {
    id: '16',
    contract_number: '#RENT-2026-0016',
    client_name: 'ابو اياد',
    client_phone: '+966562404213',
    maid_name: 'Rental maid A2122121',
    nationality: 'اثيوبيا',
    start_date: '2026-07-30',
    end_date: '2026-08-29',
    duration_months: 1,
    monthly_cost: 1150,
    total_amount: 1150,
    status: 'بانتظار التوقيع',
    payment_status: 'معلق',
    marketer: 'مشرف',
    branch: 'الفرع الرئيسي'
  },
  {
    id: '14',
    contract_number: '#RENT-2026-0014',
    client_name: 'ابو عبدالله',
    client_phone: '+9660535666840',
    maid_name: 'Rental A21221',
    nationality: 'بنجلاديش',
    start_date: '2026-07-01',
    end_date: '2026-07-31',
    duration_months: 1,
    monthly_cost: 2300,
    total_amount: 2300,
    status: 'نشط',
    payment_status: 'بانتظار التحويل',
    marketer: 'مشرف',
    branch: 'الفرع الرئيسي'
  }
];

export const MOCK_SHELTER_ITEMS: ShelterItem[] = [
  {
    id: 'SH-101',
    maid_name: 'عاملة إيواء سهام',
    passport: 'A2122100',
    nationality: 'اثيوبيا',
    contract_ref: '#583',
    client_name: 'سهام الشاذلى',
    shelter_location: 'إيواء حي الرمال',
    status: 'داخل الإيواء',
    days_in_shelter: 15,
    catering_meals_count: 45,
    work_willingness: 'ترغب بالعمل'
  },
  {
    id: 'SH-102',
    maid_name: 'عاملة تجريبية 98',
    passport: 'A9988221',
    nationality: 'اثيوبيا',
    contract_ref: '#585',
    client_name: 'شركة سلسك',
    shelter_location: 'مقر المجمعه',
    status: 'متاح للنقل',
    days_in_shelter: 12,
    catering_meals_count: 36,
    work_willingness: 'ترغب بالعمل'
  }
];

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-01',
    employee_code: 'A43434',
    name: 'محمد مصطفي',
    national_id: '1099283741',
    hire_date: '2024-05-19',
    job_title: 'مدير تنفيذى',
    department: 'الادارة العليا',
    status: 'نشط',
    salary: 15000,
    branch: 'الفرع الرئيسي'
  },
  {
    id: 'EMP-02',
    employee_code: 'A21221',
    name: 'سهام الشاذلي',
    national_id: '1088273645',
    hire_date: '2025-01-10',
    job_title: 'أخصائي موارد بشرية',
    department: 'الموارد البشرية',
    status: 'نشط',
    salary: 8500,
    branch: 'الفرع الرئيسي'
  }
];
