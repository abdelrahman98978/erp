# دليل الذاكرة والأداء العالي والتوسعية (High-Performance & Memory Architecture)
## ISR • Caching • CDN • Database Optimization • Load Testing
### منظومة ERP مجموعة خالد السليم القابضة

---

### 1. التوليد المتزايد للصفحات العامة (Public Pages ISR Architecture)

#### 1.1. المفهوم والهدف (Incremental Static Regeneration)
تعتمد الصفحات العامة الموجهة للعملاء والشركاء (مثل: صفحة الهبوط الرئيسية، بوابة تتبع العقد للعميل، بوابة التحقق من العمالة، وبوابة الوكالات الخارجية) على نموذج **التوليد المسبق مع التحديث اللحظي في الخلفية (ISR)** لضمان:
- سرعة تحميل أولية فائقة (TTFB < 50ms) من أقرب نقطة تواجد (Edge CDN).
- استهلاك شبه منعدم لموارد خادم قاعدة البيانات عند تصفح آلاف العملاء المتزامنين.

#### 1.2. إعدادات التوليد وإعادة التنشيط (Revalidation Strategy)
```typescript
// استراتيجية إعادة توليد الصفحات العامة
export const revalidateConfig = {
  // إعادة التحقق الزمني الدوري (Time-based ISR)
  landingPage: 3600,        // كل ساعة
  portalStatus: 60,         // كل 60 ثانية لحالات تتبع العقود
  agencyVerify: 300,        // كل 5 دقائق لبوابات الوكلاء

  // رؤوس التحكم في التخزين المؤقت (HTTP Cache-Control Headers)
  headers: {
    'Cache-Control': 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400',
    'CDN-Cache-Control': 'max-age=3600',
    'Vary': 'Accept-Encoding, Accept-Language'
  }
};
```

#### 1.3. إعادة التوليد الفوري المبني على الأحداث (On-Demand Webhook Revalidation)
عند حدوث أي تغيير تشغيلي في قاعدة البيانات (مثل: تغيير مرحلة عقد استقدام في مساند إلى "وصول"):
1. يطلق مشغل قاعدة البيانات (PostgreSQL Trigger) حدث Webhook نحو دالة Edge Function.
2. تقوم الدالة بإبطال الذاكرة المؤقتة لمسار الصفحة المحدد فوراً:
   `POST /api/revalidate?secret=SECURE_TOKEN&path=/portal/client/[contract_id]`
3. يرى العميل البيانات الجديدة فورياً في الزيارة التالية دون انتظار انتهاء فترة الـ `s-maxage`.

---

### 2. هرمية التخزين المؤقت متعدد المستويات (Multi-Tier Caching Taxonomy)

```
[المستخدم] ──► [L1: متصفح العميل (React Query / SWR)]
                    │
                    ▼
          [L2: شبكة الحافة والـ CDN (Cloudflare Edge Cache)]
                    │
                    ▼
          [L3: بوابة التطبيق والـ Reverse Proxy]
                    │
                    ▼
          [L4: مجمّع اتصالات وقاموس قاعدة البيانات (PostgreSQL Buffer)]
```

#### 2.1. الطبقة الأولى (L1 - In-Memory Client Cache):
- استخدام **TanStack React Query** مع ضبط مفاتيح الاستعلام ومواقيت الصلاحية بدقة:
  ```typescript
  // إعدادات الذاكرة المؤقتة للواجهة
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,    // 5 دقائق للبيانات شبه الثابتة (الشركات، الفروع)
        cacheTime: 30 * 60 * 1000,   // الاحتفاظ بالبيانات في الذاكرة 30 دقيقة
        refetchOnWindowFocus: false, // منع إعادة الجلب غير الضرورية
        retry: 2,
      },
    },
  });
  ```

#### 2.2. الطبقة الثانية (L2 - Edge Cache):
- تخزين الأصول الثابتة (JS, CSS, الصور المعمارية, الأيقونات) بعمر افتراضي مدته سنة كاملة `max-age=31536000, immutable` بالاعتماد على أسماء الملفات المشفرة بالهاش (Hashed Bundles).

#### 2.3. الطبقة الثالثة (L3 - Server/Edge Functions):
- تخزين استجابات الاستعلامات العامة المتكررة (مثل قائمة الجنسيات المتاحة، باقات التأجير) في ذاكرة التوزيع اللحظي (Edge KV Store).

---

### 3. بنية شبكة توزيع المحتوى (CDN & Edge Topology)

#### 3.1. التواجد الجغرافي ونقاط الوصول (Point of Presence - PoPs)
- توجيه حركة المرور حصراً عبر أقرب مراكز بيانات داخل المملكة العربية السعودية ودول الخليج العربي:
  - **الرياض (RUH)**: زمن وصول أقل من 12 ميلي ثانية لكافة الفروع ومقر الإدارة.
  - **جدة (JED)**: زمن وصول أقل من 18 ميلي ثانية لفروع المنطقة الغربية.
  - **الدمام / الخبر (DMM)**: تغطية فروع شركة الياقوت الشرقية.

#### 3.2. ضغط وتحسين الأصول الرقمية (Asset Compression & Optimization)
- تفعيل ضغط **Brotli (br)** بمستوى جودة 11 لملفات JavaScript وCSS مما يقلل الحجم الإجمالي بنسبة 35% مقارنة بـ Gzip.
- التحويل الفوري التلقائي للصور إلى صيغتي **WebP** و **AVIF** مع الحفاظ على دقة الأصول المعمارية الفاخرة.

#### 3.3. حماية الحافة والجدار الناري (Edge Security & WAF)
- تفعيل حماية ضد هجمات حجب الخدمة (DDoS Mitigation Layer 3/4/7).
- تحديد معدل الطلبات (Rate Limiting):
  - مسارات المصادقة وتسجيل الدخول: بحد أقصى 10 محاولات كل 5 دقائق لكل عنوان IP.
  - مسارات الاستعلام العادية: بحد أقصى 300 طلب/دقيقة.

---

### 4. تحسين استعلامات قواعد البيانات (Database Querier & Engine Tuning)

#### 4.1. مجمّع الاتصالات (Connection Pooling via Supavisor)
- تشغيل مجمّع اتصالات Supabase في وضع العمليات (Transaction Mode):
  - الحد الأقصى للاتصالات المتزامنة المجمعة: 200 اتصال.
  - زمن إرجاع الاتصال الخامل (Idle Timeout): 10 ثوانٍ لمنع استنزاف ذاكرة الخادم (RAM Exhaustion).

#### 4.2. تحسين قواعد أمان الصفوف (RLS Optimization Invariant)
> **قاعدة ذهبية حرجة**: يُحظر استدعاء دوال المصادقة مثل `auth.uid()` مباشرة في شروط WHERE لأنها تعيد التقييم لكل صف (Per-row evaluation). يجب تغليفها في استعلام فرعي:
```sql
-- الأسلوب المحسن هندسياً (Zero Table-Scan)
CREATE POLICY "Optimal_Tenant_Isolation" ON recruitment_contracts
FOR SELECT TO authenticated
USING (
  company_id = (SELECT (auth.jwt() -> 'app_metadata' ->> 'company_id'))
);
```

#### 4.3. استراتيجية الفهارس المركبة والجزئية (Composite & Partial Indexing)
```sql
-- فهرس مركب للاستعلامات التشغيلية اليومية لخطوط أنابيب مساند
CREATE INDEX idx_contracts_lookup ON recruitment_contracts (company_id, stage, created_at DESC);

-- فهرس جزئي سريع للعمليات الحرجة المتأخرة فقط
CREATE INDEX idx_delayed_orders ON orders (company_id, deadline)
WHERE status = 'تحت الإجراء' AND timer_status = 'متأخر';

-- فهرس GIN للبحث السريع داخل وثائق وجداول الكميات
CREATE INDEX idx_boq_items_gin ON tenders_boq_items USING GIN (specifications jsonb_path_ops);
```

#### 4.4. ميزانية زمن تنفيذ الاستعلامات (Query Budget Enforcement)
- **استعلامات المعاملات الفورية (OLTP)**: مهلة قصوى 100 ميلي ثانية (يتم إلغاء الاستعلام إذا تجاوزها لمنع تعليق قاعدة البيانات).
- **التقارير التحليلية الضخمة (OLAP)**: توجيهها إلى نسخة القراءة المتماثلة (Read-Replica) أو تشغيلها عبر استعلامات تجميعية مجدولة مسبقاً (Materialized Views).

---

### 5. بروتوكول اختبارات الحمل والضغط (Load Testing & Chaos Engineering)

#### 5.1. أهداف ومؤشرات الأداء المستهدفة (Service Level Objectives - SLOs)
- **المستخدمون المتزامنون (Concurrency)**: 5,000 مستخدم نشط يعملون في نفس اللحظة.
- **معدل الطلبات المستهدف (Throughput)**: 1,200 طلب/ثانية في أوقات الذروة الصباحية.
- **أزمنة الاستجابة (Latency SLOs)**:
  - 50% من الطلبات (p50): أقل من 80 ميلي ثانية.
  - 95% من الطلبات (p95): أقل من 250 ميلي ثانية.
  - 99% من الطلبات (p99): أقل من 500 ميلي ثانية.
  - معدل الأخطاء (Error Rate): أقل من 0.01% (أقل من خطأ واحد لكل 10,000 طلب).

#### 5.2. سيناريو اختبار الحمل بواسطة K6 (K6 Load Script Profile)
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 500 },   // إحماء تدريجي
    { duration: '5m', target: 2500 },  // حمل ساعات العمل الاعتيادية
    { duration: '3m', target: 5000 },  // ذروة الحمل القصوى (Peak Spike)
    { duration: '2m', target: 0 },     // تبريد تدريجي
  ],
  thresholds: {
    http_req_duration: ['p(95)<250'], // يجب أن ينجح 95% تحت 250ms
    http_req_failed: ['rate<0.01'],   // نسبة الفشل أقل من 1%
  },
};

export default function () {
  const res = http.get('http://localhost:3000/api/contracts/summary', {
    headers: { 'Authorization': 'Bearer SIMULATED_TOKEN' },
  });
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response under 200ms': (r) => r.timings.duration < 200,
  });
  sleep(1);
}
```

#### 5.3. اختبارات الصمود والتعافي التلقائي (Resilience & Chaos Plan)
- **انقطاع شبكة مساند أو بوابة الدفع**: العودة التلقائية للوضع غير المتزامن (Queue fallback) وحفظ الطلبات في طابور محلي مشفر مع إعادة المحاولة الأسية (Exponential Backoff).
- **فقدان الاتصال اللحظي للعميل**: تفعيل التخزين المؤقت المحلي (Optimistic Local UI Updates) مع التزامن التلقائي عند استعادة الشبكة.
