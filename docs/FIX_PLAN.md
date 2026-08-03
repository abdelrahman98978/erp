# خطة الإصلاح الشاملة لمشروع ERP - مجموعة خالد السليم

## 📋 Context (السياق)

المشروع `erp-group-alsulaim` هو نظام ERP مبني بـ React 19 + TypeScript + Vite + Supabase، مخصص لمجموعة خالد السليم. تم إجراء **3 مراجعات متعمقة** (React/TS, Supabase Security, Accessibility/RTL) وكشفت عن:

- **مشاكل حرجة في الأمان**: تسجيل دخول وهمي (mock) بدون Supabase Auth، RLS policies تسمح للجميع (`USING (true)`)، بيانات اعتماد افتراضية مكشوفة.
- **مشاكل حرجة في الاستقرار**: لا يوجد ErrorBoundary، hardcoded fallback JWT في الـ bundle، fallback URL يشير لـ localhost.
- **مشاكل في النشر**: GitHub Pages يخدم `index.html` لكن `src/main.tsx` يُخدم كنص خام (يحتاج بناء).
- **مشاكل في إمكانية الوصول**: 6 مشاكل High و14 Medium و20 Low في a11y/RTL.

الإصلاحات السابقة (المسارات النسبية + workflow) مكتملة. هذه الخطة تنفّذ بقية الإصلاحات.

---

## 🎯 الأولويات (مرتّبة حسب التأثير/الجهد)

### المرحلة 1: الأمان الحرج (يوم 1) — يمنع تسريب البيانات فعلياً

#### 1.1 إصلاح تسجيل الدخول (Login Bypass) — `src/pages/LoginPage.tsx`
**المشكلة**: أي شخص يدخل 6 أرقام يدخل المنصة (لا يوجد `supabase.auth.signInWithPassword`).

**التعديلات**:
- [src/pages/LoginPage.tsx:11-12](src/pages/LoginPage.tsx#L11) — أزل البيانات الافتراضية: `useState('')` بدلاً من `'abdelftah'`
- [src/pages/LoginPage.tsx:197-202](src/pages/LoginPage.tsx#L197) — `handleInitialSubmit`: اتصل بـ `supabase.auth.signInWithPassword({ email: username, password })` قبل الانتقال للـ 2FA
- [src/pages/LoginPage.tsx:204-212](src/pages/LoginPage.tsx#L204) — `handle2FASubmit`: اتصل بـ `supabase.auth.mfa.challenge()` و `verify()` بدلاً من التحقق المحلي
- أضف عرض للأخطاء (`{error && <div className="error-banner">{error
</div>}`)

#### 1.2 إصلاح RLS Policies — `supabase/migrations/`
**المشكلة**: `supabase/migrations/20260731_complete_erp_schema.sql:282-283` و `20260731_complete_all_missing_tables.sql:221-222` يستخدمان `FOR ALL TO authenticated USING (true) WITH CHECK (true)`.

**التعديلات**:
- إنشاء migration جديدة `supabase/migrations/20260801_strict_rls_policies.sql`:
  - `DROP POLICY IF EXISTS` على الـ policies الحالية
  - كتابة policies جديدة لكل جدول تقيّد بـ `auth.uid()` و `users.org_id`
  - فصل `TO authenticated` و `TO anon` (anon = denied بشكل افتراضي)
  - سياسات CRUD granular (`FOR SELECT`, `FOR INSERT`, `FOR UPDATE`, `FOR DELETE`)
- تطبيق migration عبر Supabase CLI: `supabase db push` أو يدوياً

#### 1.3 إزالة Hardcoded JWT — `src/services/supabaseClient.ts:6`
**المشكلة**: `'eyJhbGciOiJIUzI1NiI...'...` مكتوب كقيمة افتراضية في الكود المصدري.

**التعديلات**:
- استبدل بـ `throw new Error('VITE_SUPABASE_ANON_KEY is required')` كقيمة افتراضية
- أضف `auth: { persistSession: true, autoRefreshToken: true }` عند `createClient`
- اشترط `import.meta.env.PROD` أنه إذا كان `VITE_SUPABASE_URL` يحتوي `127.0.0.1` → ارمي خطأ

---

### المرحلة 2: استقرار التطبيق (يوم 1-2)

#### 2.1 إضافة ErrorBoundary — ملف جديد
**المشكلة**: أي خطأ في lazy-loaded page يُسبّب شاشة بيضاء.

**التعديلات**:
- إنشاء `src/components/ErrorBoundary.tsx`:
```tsx
export class ErrorBoundary extends React.Component<{children: ReactNode; fallback?: ReactNode}, {hasError: boolean; error?: Error}> {
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) { console.error('ErrorBoundary caught:', error, info); }
  render() { return this.state.hasError ? (this.props.fallback || <DefaultErrorUI error={this.state.error}/>) : this.props.children; }
}
```
- لفّ `<App>` في [src/main.tsx:5-9](src/main.tsx#L5) داخل ErrorBoundary
- لفّ كل `<Suspense>` في [src/App.tsx:79, 88, 97, 305](src/App.tsx#L79) بـ ErrorBoundary خاص بكل صفحة

#### 2.2 إصلاح `document.getElementById('root')!` — `src/main.tsx:5`
**التعديل**: استبدل بـ:
```tsx
const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');
createRoot(rootEl).render(...);
```

#### 2.3 إصلاح silent error swallowing — `src/services/erpSupabaseService.ts`
**المشكلة**: `getClients` ترجع `[]` على الخطأ → UI تعرض "لا توجد بيانات".

**التعديلات**:
- غيّر توقيع الدوال إلى `{data, error}` بدلاً من إرجاع مصفوفة فقط
- مثال: `export const getClients = async (): Promise<{data: Client[] | null; error: string | null}> => {...}`
- في الصفحات، اعرض حالة خطأ فعلية

#### 2.4 إصلاح `insertTableRecord` (SQL injection-like typo risk) — `src/services/erpSupabaseService.ts:100-107`
**التعديلات**:
- استبدل بـ typed factory: `createTableAPI<'clients', Client>()(name)` 
- أو استخدم `type TableName = 'clients' | 'cvs' | 'orders' | ...` (discriminated union)
- اسم الجدول يُمرَّر كـ key ثابت وليس string حر

---

### المرحلة 3: نشر GitHub Pages (يوم 2) — مهم جداً

#### 3.1 تغيير مصدر Pages إلى GitHub Actions
- اذهب لإعدادات المستودع → Pages → Source: "GitHub Actions" بدلاً من "Deploy from a branch"
- أو عبر CLI: `gh api repos/abdelrahman98978/erp/pages -X PATCH` (لكن API محدود)

#### 3.2 إضافة Secrets للمشروع
في إعدادات المستودع → Secrets → Actions:
- `VITE_SUPABASE_URL` — رابط Supabase الحقيقي
- `VITE_SUPABASE_ANON_KEY` — anon key

#### 3.3 ملف workflow جاهز
الـ [deploy.yml](.github/workflows/deploy.yml) تم إنشاؤه بالفعل ويحتاج فقط تفعيله في GitHub.

#### 3.4 .gitignore ناقص — `/.gitignore`
أضف:
```
node_modules
.env
.env.local
dist
.DS_Store
supabase/.temp
supabase/.branches
*.log
.vite
```

---

### المرحلة 4: إمكانية الوصول و RTL (يوم 2-3)

#### 4.1 إصلاح `--text-light` contrast — `src/styles/tokens.css:99`
**التعديل**: غيّر `#6f7979` → `#5a6363` (5.05:1 ratio، يجتاز WCAG AA).

#### 4.2 إصلاح Login Form Labels — `src/pages/LoginPage.tsx`
- أضف `htmlFor="login-username"` و `id="login-username"` (سطر 468, 471)
- أضف `htmlFor="login-password"` و `id="login-password"` (سطر 497, 500)
- أضف `aria-label` و `aria-pressed` لزر إظهار/إخفاء كلمة المرور (سطر 524)
- أضف `inputMode="numeric"` و `autoComplete="one-time-code"` و `aria-label` لكل input OTP (سطر 677-699)
- أضف `onPaste` handler لـ OTP inputs

#### 4.3 تحويل LandingPage Cards إلى `<button>` — `src/pages/LandingPage.tsx:217-393`
**المشكلة**: 5 بطاقات تستخدم `<div onClick>` بدون keyboard accessibility.

**التعديلات**:
- حوّل كل `<div className="nav-card-landing">` إلى `<button type="button">`
- أضف `aria-label` لكل بطاقة
- أضف `aria-hidden="true"` على أيقونات Material Symbols داخل البطاقات

#### 4.4 إصلاح RTL bugs
- [src/pages/LoginPage.tsx:470, 499, 524](src/pages/LoginPage.tsx#L470) — استبدل `right:` / `left:` بـ `insetInlineStart` / `insetInlineEnd`
- [src/pages/LoginPage.tsx:480-481, 509-510](src/pages/LoginPage.tsx#L480) — استبدل `paddingRight/Left` بـ `paddingInlineStart/End`
- [src/pages/LoginPage.tsx:647](src/pages/LoginPage.tsx#L647) — غيّر `fa-arrow-right` إلى `fa-arrow-left` عندما `currentLanguage.dir === 'rtl'`
- [src/pages/LoginPage.tsx:705, 743](src/pages/LoginPage.tsx#L705) — استبدل `ml-1` / `mr-1` بـ `ms-1` / `me-1`
- [src/components/layout/Header.tsx:38, 76](src/components/layout/Header.tsx#L38) — أعد تسمية `header-right` / `header-left` إلى `header-start` / `header-end`

#### 4.5 إصلاح Three.js Canvas
- [src/pages/LoginPage.tsx:286-298](src/pages/LoginPage.tsx#L286) — أضف `aria-hidden="true"`
- [src/pages/LoginPage.tsx:35-195](src/pages/LoginPage.tsx#L35) — احترام `prefers-reduced-motion`: 
```tsx
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReduced) return; // لا تبدأ الـ animation
```
- أعد هيكلة الـ effect ليكون cleanup موثوق (عدم memory leak)

---

### المرحلة 5: تحسينات الأداء (يوم 3-4)

#### 5.1 useReducer بدلاً من 3 useState — `src/App.tsx:58-60`
دمج `flowState`, `activeTab`, `activeTabTitle` في state واحد:
```tsx
type State = { flow: 'landing'|'login'|'launcher'|'workspace'; activeTab: string; activeTabTitle: string };
const [state, dispatch] = useReducer(reducer, initial);
```

#### 5.2 useCallback/useMemo
- [src/App.tsx:62-70](src/App.tsx#L62) — لفّ `handleSelectTab` و `handleLogout` في `useCallback`
- [src/i18n/LanguageContext.tsx:43-57](src/i18n/LanguageContext.tsx#L43) — لفّ `t` في `useCallback` و `value` في `useMemo`
- [src/App.tsx:104-295](src/App.tsx#L104) — لفّ `renderPage` في `useMemo([activeTab])`

#### 5.3 useTransition للـ tab switching — `src/App.tsx`
```tsx
const [isPending, startTransition] = useTransition();
const handleSelectTab = (href, title) => startTransition(() => { dispatch({type:'SET_TAB', href, title}); });
```

#### 5.4 vite-env.d.ts (typed env) — ملف جديد `src/vite-env.d.ts`
```ts
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_APP_TITLE?: string;
  readonly VITE_APP_PORT?: string;
}
interface ImportMeta { readonly env: ImportMetaEnv; }
```
ثم احذف `(import.meta as any).env` من [src/services/supabaseClient.ts:3](src/services/supabaseClient.ts#L3).

#### 5.5 manualChunks لتقسيم الـ bundle — `vite.config.ts`
الـ `ReportsPage-D26LBjSq.js` كبير (850KB). أضف:
```ts
build: { rollupOptions: { output: { manualChunks: {
  'vendor-react': ['react', 'react-dom'],
  'vendor-charts': ['chart.js', 'react-chartjs-2'],
  'vendor-pdf': ['jspdf', 'html2canvas'],
  'vendor-xlsx': ['xlsx']
}}}}
```

#### 5.6 Lazy load Three.js
في [src/pages/LoginPage.tsx:35-195](src/pages/LoginPage.tsx#L35):
- استبدل polling بـ `const THREE = await import('three')`
- أو حمّل Three.js كـ npm dependency (`npm install three`) بدلاً من CDN

---

### المرحلة 6: تجربة المستخدم والصيانة (يوم 4-5)

#### 6.1 Router support (deep linking)
**المشكلة**: [src/App.tsx](src/App.tsx) بدون router → refresh على `/clients` يفقد الحالة.

**التعديل**: أضف `react-router-dom@7`، عرّف routes لكل صفحة، اربط `flowState` و `activeTab` بـ URL.

#### 6.2 Supabase RLS درع أمني
في Supabase Dashboard:
- عطّل `enable_signup = true` (أو اشترط تأكيد إيميل)
- فعّل TOTP MFA
- ارفع `minimum_password_length` إلى 12
- ضع `db.network_restrictions` لـ IP whitelist (في production)

#### 6.3 i18n fallbacks
- [src/i18n/TRANSLATIONS](src/i18n/languages.ts) — تأكد أن جميع الـ keys موجودة في `ar` و `en` (التحقق من t() fallback chain)
- استخدم `useTransition` للغة التغيير (UI optimistic)

#### 6.4 Documentation
- أضف `CONTRIBUTING.md` يشرح:
  - إعداد `.env` (URL + anon key)
  - تشغيل `supabase db push` بعد migrations
  - أوامر البناء والنشر

---

## 📁 الملفات المطلوب تعديلها (مرجع سريع)

| الملف | عدد المشاكل |
|---|---|
| [src/pages/LoginPage.tsx](src/pages/LoginPage.tsx) | 12+ (auth, a11y, RTL, perf) |
| [src/services/supabaseClient.ts](src/services/supabaseClient.ts) | 5 (env, persistence, hardcoded key) |
| [src/services/erpSupabaseService.ts](src/services/erpSupabaseService.ts) | 4 (typed, errors, pagination) |
| [src/App.tsx](src/App.tsx) | 6 (ErrorBoundary, useReducer, suspense, memoization) |
| [src/i18n/LanguageContext.tsx](src/i18n/LanguageContext.tsx) | 3 (memoization, transitions) |
| [src/styles/tokens.css](src/styles/tokens.css) | 2 (contrast) |
| [src/components/layout/Header.tsx](src/components/layout/Header.tsx) | 4 (a11y, RTL naming) |
| [src/components/layout/Sidebar.tsx](src/components/layout/Sidebar.tsx) | 1 (RTL naming) |
| [src/pages/LandingPage.tsx](src/pages/LandingPage.tsx) | 2 (button conversion, RTL) |
| `supabase/migrations/*.sql` | 1 (إنشاء migration جديدة) |
| `.gitignore` | 1 (إضافة dist, .env, .temp) |
| **ملفات جديدة** | `ErrorBoundary.tsx`, `vite-env.d.ts` |

---

## ✅ خطة التحقق (Verification)

بعد كل مرحلة:

1. **المرحلة 1**:
   ```bash
   npm run build   # يجب أن ينجح
   npm run dev     # جرّب Login → يجب أن يفشل مع كلمة مرور خاطئة
   ```

2. **المرحلة 2**:
   - افتح DevTools → اختبر أخطاء في lazy pages (يجب أن تظهر ErrorBoundary UI)
   - اختبر صفحة `ComplaintsPage` المعطوبة → لا شاشة بيضاء

3. **المرحلة 3**:
   - ادفع لـ `main` → GitHub Actions يجب أن يعمل
   - افتح `https://abdelrahman98978.github.io/erp/` → يعمل بدون 404

4. **المرحلة 4**:
   - فعّل `Lighthouse Accessibility` في Chrome → تحسّن من X إلى 90+
   - فعّل قارئ الشاشة (NVDA/VoiceOver) → تنقل صحيح

5. **المرحلة 5**:
   - `npm run build` → `dist/` أصغر، `manualChunks` تعمل
   - `npm run dev` → tab switching سلس، لا lag

6. **المرحلة 6**:
   - `/clients` مباشر → يفتح صفحة العملاء (deep link)
   - RLS policies تختبر في Supabase Dashboard: محاكاة user بدون role → لا وصول لـ `system_users`

---

## ⏱️ الجدول الزمني المقترح

| المرحلة | المدة | الأولوية |
|---|---|---|
| 1. الأمان | يوم 1 | P0 — لا تنشر قبل هذا |
| 2. الاستقرار | يوم 1-2 | P0 |
| 3. النشر | يوم 2 | P0 |
| 4. A11y/RTL | يوم 2-3 | P1 |
| 5. الأداء | يوم 3-4 | P2 |
| 6. الـ UX والصيانة | يوم 4-5 | P2 |

---

## 📚 وثائق للمطورين

### مطلوب إنشاؤها
- `README.md` - تم إنشاؤه (لكن محتواه ضعيف، يحتاج تحسين)
- `ARCHITECTURE.md` - بنية النظام
- `DATABASE.md` - مخطط قاعدة البيانات
- `DEPLOYMENT.md` - خطوات النشر
- `CONTRIBUTING.md` - إرشادات المساهمة
- `CHANGELOG.md` - سجل التغييرات

---

## 💰 تقدير حجم العمل

| الوحدة | عدد الجداول | عدد الصفحات | عدد التقارير |
|---|---|---|---|
| CRM | 3 | 4 | 8 |
| CVs | 1 | 5 | 5 |
| Orders | 2 | 6 | 6 |
| Recruitment Contracts | 2 | 5 | 7 |
| Rent Contracts | 2 | 4 | 6 |
| Shelter | 1 | 5 | 3 |
| Sponsorship Transfer | 1 | 3 | 2 |
| Travel | 2 | 3 | 2 |
| Complaints | 2 | 3 | 4 |
| Offices | 2 | 3 | 3 |
| Financial | 8 | 10 | 12 |
| HR | 4 | 4 | 6 |
| Reports | 1 | 5 | 30+ |
| Settings | 3 | 4 | 0 |
| Users/Roles | 4 | 3 | 0 |
| ZATCA | 2 | 3 | 2 |
| WhatsApp | 3 | 2 | 1 |
| System | 5 | 5 | 2 |
| **الإجمالي** | **48+** | **77+** | **99+** |

---

## 🚀 خارطة الطريق (Roadmap)

### Sprint 1 (الأسبوع 1-2): الأساسيات
- الأمان (المرحلة 1)
- الاستقرار (المرحلة 2)
- النشر (المرحلة 3)

### Sprint 2 (الأسبوع 3-4): CRM + الاستقدام
- إكمال CRM
- إكمال إدارة العقود
- سير العمل (Workflows)

### Sprint 3 (الأسبوع 5-6): المالية + HR
- إكمال المحاسبة
- إكمال الرواتب
- التقارير المالية

### Sprint 4 (الأسبوع 7-8): التحسينات
- A11y و RTL (المرحلة 4)
- الأداء (المرحلة 5)
- التقارير المتقدمة

### Sprint 5 (الأسبوع 9-10): التكاملات
- ZATCA
- WhatsApp API
- SMS Gateways
- مساند Integration

### Sprint 6 (الأسبوع 11-12): التطبيق المحمول
- PWA
- تطبيق الجوال للموظفين
- بوابة العميل

---

## 💡 ملاحظات ختامية

1. **النظام كبير جداً** (33 وحدة، 48+ جدول، 77+ صفحة) - يحتاج فريق من 3-5 مطورين لمدة 6 أشهر على الأقل.

2. **الأولويات** حسب الجدوى:
   - الأمان والاستقرار (ضروري قبل الإطلاق)
   - CRM + الطلبات + العقود (العمليات الأساسية)
   - المالية (لا غنى عنها)
   - HR (ضروري للموظفين)
   - التقارير (لاحقاً)

3. **التقنيات المقترحة للمستقبل**:
   - React Query (للبيانات)
   - Zustand أو Redux Toolkit (للحالة العامة)
   - React Hook Form + Zod (للنماذج)
   - date-fns أو day.js (للتواريخ)
   - i18next (متعدد اللغات - مُضاف)
   - XState (للـ workflows المعقدة)

---

**الخطة مكتملة الآن.** 

---

*تم إنشاؤه بتاريخ: 2026-08-03*
*الإصدار: 1.0*
*المشروع: ERP Group Khalid Al-Sulaim*