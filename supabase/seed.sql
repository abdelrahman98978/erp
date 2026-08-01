-- Seed Data for ERP Group Khalid Al-Sulaim

-- 1. Initial Clients
INSERT INTO public.clients (client_no, name, phone, national_id, account_code, client_activity, branch, status) VALUES
  ('CLI-1001', 'عبدالله محمد الغامدي', '0501234567', '1098765432', '120101', 'عقد استقدام ساري', 'فرع الرياض', 'نشط'),
  ('CLI-1002', 'سارة خالد الدوسري', '0559876543', '1087654321', '120102', 'عقد تأجير تشغيلي', 'فرع جدة', 'نشط'),
  ('CLI-1003', 'شركة الأمل للمقاولات', '0541122334', '7001234567', '120103', 'توريد عمالة مهنية', 'فرع الدمام', 'نشط')
ON CONFLICT (client_no) DO NOTHING;

-- 2. Initial CVs
INSERT INTO public.cvs (cv_code, maid_name, nationality, job, passport_number, age, salary, external_office, type, status) VALUES
  ('CV-8801', 'ماريا سانتوس', 'الفلبين', 'عاملة منزلية', 'P9876543A', 28, 1500.00, 'مكتب مانيلا الدولي', 'توسط', 'متاح'),
  ('CV-8802', 'سيتي نورعيني', 'إندونيسيا', 'عاملة منزلية', 'A1234567B', 32, 1500.00, 'مكتب جاكرتا للخدمات', 'إيجار', 'متاح'),
  ('CV-8803', 'رحمة أديسي', 'أثيوبيا', 'عاملة منزلية', 'EP554433C', 26, 1200.00, 'مكتب أديس أبابا', 'توسط', 'متاح')
ON CONFLICT (cv_code) DO NOTHING;

-- 3. Initial Recruitment Contracts
INSERT INTO public.contracts (contract_number, musaned_number, client_name, client_phone, maid_name, nationality, external_office, amount, stage, branch) VALUES
  ('REC-2026-001', 'MSN-998811', 'عبدالله محمد الغامدي', '0501234567', 'ماريا سانتوس', 'الفلبين', 'مكتب مانيلا الدولي', 17500.00, 'وصول العمالة', 'فرع الرياض')
ON CONFLICT (contract_number) DO NOTHING;

-- 4. Initial System Users & Roles
INSERT INTO public.system_users (username, full_name, email, role, branch, status) VALUES
  ('khalid.admin', 'خالد السليم', 'khalid@alsulaim.sa', 'رئيس المجموعة', 'المقر الرئيسي', 'نشط'),
  ('finance.manager', 'أحمد المحاسب', 'finance@alsulaim.sa', 'مدير الحسابات', 'فرع الرياض', 'نشط'),
  ('operation.user', 'فهد العمليات', 'ops@alsulaim.sa', 'مشرف تشغيل', 'فرع جدة', 'نشط')
ON CONFLICT (username) DO NOTHING;

-- 5. System Settings Initial Seeds
INSERT INTO public.system_settings (setting_key, setting_value, description) VALUES
  ('COMPANY_NAME', 'مجموعة خالد السليم ERP', 'الاسم الرسمي للمجموعة'),
  ('CURRENCY', 'SAR', 'العملة الرئيسية للنظام'),
  ('TAX_RATE', '15%', 'نسبة ضريبة القيمة المضافة ZATCA')
ON CONFLICT (setting_key) DO NOTHING;
