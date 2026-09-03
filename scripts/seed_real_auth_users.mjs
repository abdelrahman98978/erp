/**
 * Seed Real Authentication Users into Supabase Auth & Public system_users
 * ERP Group Khalid Al-Sulaim
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://127.0.0.1:54421';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const USERS_TO_SEED = [
  {
    email: 'khalid@alsulaim.sa',
    password: 'Alsulaim@2026',
    username: 'khalid.admin',
    fullName: 'خالد السليم',
    role: 'رئيس المجموعة',
    branch: 'المقر الرئيسي',
    companyId: 'all'
  },
  {
    email: 'admin@alsulaim.sa',
    password: 'Alsulaim@2026',
    username: 'super.admin',
    fullName: 'مشرف الإدارة المركزية (Super Admin)',
    role: 'المدير العام',
    branch: 'المقر الرئيسي',
    companyId: 'all'
  },
  {
    email: 'finance@alsulaim.sa',
    password: 'Alsulaim@2026',
    username: 'finance.manager',
    fullName: 'أحمد المحاسب المالي',
    role: 'مدير الحسابات',
    branch: 'فرع الرياض الرئيسي',
    companyId: 'SAF'
  },
  {
    email: 'ops@alsulaim.sa',
    password: 'Alsulaim@2026',
    username: 'operation.user',
    fullName: 'فهد مسؤول العمليات والتشغيل',
    role: 'مشرف تشغيل',
    branch: 'فرع جدة',
    companyId: 'YAQ'
  },
  {
    email: 'saf.manager@alsulaim.sa',
    password: 'SafRecruit@2026',
    username: 'saf.manager',
    fullName: 'سليمان خالد (مدير الصفا الماسي)',
    role: 'مدير استقدام',
    branch: 'فرع الرياض الرئيسي',
    companyId: 'SAF'
  },
  {
    email: 'yaq.operations@alsulaim.sa',
    password: 'YaqootRent@2026',
    username: 'yaq.operations',
    fullName: 'عبدالرحمن العتيبي (مدير تأجير الياقوت)',
    role: 'مدير تأجير وتشغيل',
    branch: 'فرع الدمام',
    companyId: 'YAQ'
  },
  {
    email: 'top.hr@alsulaim.sa',
    password: 'TopTalent@2026',
    username: 'top.hr',
    fullName: 'سارة خالد (مسؤولة توظيف توب تالنت)',
    role: 'مدير توظيف ATS',
    branch: 'فرع الخبر',
    companyId: 'TOP'
  },
  {
    email: 'kas.tenders@alsulaim.sa',
    password: 'KasEtmad@2026',
    username: 'kas.tenders',
    fullName: 'م. بندر الهويريني (مدير منافسات كاس واعتماد)',
    role: 'مدير منافسات وتوريد',
    branch: 'المقر الرئيسي - كاس',
    companyId: 'all'
  },
  {
    email: 'client@alsulaim.sa',
    password: 'ClientPortal@2026',
    username: 'client.portal',
    fullName: 'بوابة العميل المعتمد (الخدمة الذاتية)',
    role: 'عميل مستفيد',
    branch: 'فرع الرياض الرئيسي',
    companyId: 'SAF'
  },
  {
    email: 'agent.manila@agency.ph',
    password: 'AgencyPartner@2026',
    username: 'agency.manila',
    fullName: 'وكالة مانيلا الدولية المعتمدة (Manila Global Agency)',
    role: 'شريك خارجي',
    branch: 'وكالات الفلبين',
    companyId: 'SAF'
  },
  {
    email: 'store.manager@alsulaim.sa',
    password: 'StoreOnline@2026',
    username: 'store.manager',
    fullName: 'مدير المتاجر الإلكترونية وقنوات البيع',
    role: 'مدير مبيعات إلكترونية',
    branch: 'المقر الرئيسي',
    companyId: 'SAF'
  }
];

async function seedAuthUsers() {
  console.log('====================================================');
  console.log('🚀 SEEDING REAL AUTH USERS IN SUPABASE & POSTGRESQL');
  console.log('====================================================\n');

  // 1. Fetch existing auth users
  const { data: existingAuth, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
  if (listErr) {
    console.error('❌ Failed to list auth users:', listErr.message);
    return;
  }
  const existingEmails = new Set((existingAuth?.users || []).map(u => u.email?.toLowerCase()));

  for (const user of USERS_TO_SEED) {
    let authUserId = null;

    if (existingEmails.has(user.email.toLowerCase())) {
      console.log(`ℹ️ Auth user already exists: ${user.email} -> Updating password & metadata`);
      const existing = existingAuth.users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
      authUserId = existing.id;
      await supabaseAdmin.auth.admin.updateUserById(authUserId, {
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.fullName,
          role: user.role,
          username: user.username,
          company_id: user.companyId
        }
      });
    } else {
      console.log(`➕ Creating new auth user: ${user.email}`);
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.fullName,
          role: user.role,
          username: user.username,
          company_id: user.companyId
        }
      });
      if (createErr) {
        console.error(`❌ Error creating ${user.email}:`, createErr.message);
        continue;
      }
      authUserId = created.user.id;
    }

    // 2. Upsert into public.system_users table
    const { error: sysErr } = await supabaseAdmin
      .from('system_users')
      .upsert({
        id: authUserId,
        username: user.username,
        full_name: user.fullName,
        email: user.email,
        role: user.role,
        branch: user.branch,
        status: 'نشط',
        created_at: new Date().toISOString()
      }, { onConflict: 'email' });

    if (sysErr) {
      console.warn(`⚠️ Warning syncing system_users for ${user.email}:`, sysErr.message);
    } else {
      console.log(`✅ Synced user in system_users: [${user.username}] -> ${user.fullName}`);
    }
  }

  console.log('\n🎉 ALL REAL AUTH USERS SUCCESSFULLY PROVISIONED!');
}

seedAuthUsers();
