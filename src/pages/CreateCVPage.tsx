import React, { useState } from 'react';
import { realErpDataStore } from '../services/realErpDataStore';
import { useAppStore } from '../stores/appStore';
import { Badge } from '../components/ui/Badge';

export const CreateCVPage: React.FC = () => {
  const { setActiveTab } = useAppStore();
  const [activeStep, setActiveStep] = useState<number>(1);

  const [formData, setFormData] = useState({
    // 1. Basic & Agency
    type_id: 'توسط',
    create_shelter_contract: false,
    nationality_id: 'الفلبين',
    office_id: "PLATINUM BROTHERS INT'L",
    job_title: 'عاملة منزلية',
    monthly_salary: 1500,
    cost_usd: 1200,

    // 2. Personal Information
    full_name_en: '',
    full_name_ar: '',
    passport_number: '',
    passport_issue_date: '',
    passport_expiry_date: '',
    date_of_birth: '',
    age: '28',
    religion: 'مسلمة',
    marital_status: 'متزوجة',
    children_count: '2',
    height_cm: '160',
    weight_kg: '58',
    complexion: 'حنطية',
    living_country: 'الفلبين',

    // 3. Contact Details
    phone_number: '',
    whatsapp_number: '',
    city: 'مانيلا',
    address: '',

    // 4. Skills & Competencies
    baby_care: true,
    elderly_care: true,
    cooking_arabic: true,
    cleaning: true,
    washing_ironing: true,
    driving: false,
    sewing: false,
    arabic_level: 'متوسط',
    english_level: 'ممتاز',

    // 5. Experience
    experience_type: 'خبرة سابقة بالخليج',
    prev_country: 'السعودية (الرياض)',
    prev_duration: 'سنتان',

    // 6. Media & Links
    video_url: '',
    medical_report_status: 'سليم ولائق طبياً',
    police_clearance: 'سارية وخالية من السوابق',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name_en || !formData.passport_number) {
      alert('يرجى ملء الاسم الكامل ورقم جواز السفر');
      return;
    }

    const newCV = {
      id: `cv-${Date.now()}`,
      cv_code: `CV-${Math.floor(1000 + Math.random() * 9000)}`,
      maid_name: formData.full_name_en,
      maid_name_ar: formData.full_name_ar,
      nationality: formData.nationality_id,
      job: formData.job_title,
      passport_number: formData.passport_number,
      age: parseInt(formData.age) || 28,
      salary: formData.monthly_salary,
      external_office: formData.office_id,
      type: formData.type_id,
      status: 'متاح',
      created_at: new Date().toISOString(),
    };

    await realErpDataStore.addRecord('cvs', newCV);
    alert('تم حفظ ونشر السيرة الذاتية بنجاح بنظام ERP الموحد!');
    setActiveTab('operations-cv-recruitment', 'السير الذاتية المتاحة للاستقدام');
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#000000', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-address-card"></i>
            إضافة سيرة ذاتية جديدة
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#71717a' }}>
            إدخال البيانات الشخصية، الجواز، المهارات، الفحوصات الطبية، والوسائط بدقة متناهية
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('data-import', 'معالج استيراد البيانات الشامل (Excel / CSV)')}
            className="button-primary-pill"
            style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
          >
            <i className="fa-solid fa-file-import ml-1"></i> + استيراد جماعي (Excel)
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="button-outline-on-light"
            style={{ fontSize: '12.5px', padding: '6px 16px', minHeight: '38px' }}
          >
            إلغاء ورجوع
          </button>
        </div>
      </div>

      {/* Step Indicators */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {[
          { step: 1, title: '1. الوكالة والنوع', icon: 'fa-building' },
          { step: 2, title: '2. البيانات الشخصية', icon: 'fa-id-card' },
          { step: 3, title: '3. المهارات واللغات', icon: 'fa-star' },
          { step: 4, title: '4. المرفقات والتكلفة', icon: 'fa-paperclip' },
        ].map((s) => {
          const isActive = activeStep === s.step;
          return (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStep(s.step)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: isActive ? '#000000' : '#e4e4e7',
                backgroundColor: isActive ? '#000000' : '#ffffff',
                color: isActive ? '#ffffff' : '#71717a',
                fontWeight: isActive ? 550 : 420,
                fontSize: '12.5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <i className={`fa-solid ${s.icon}`}></i>
              <span>{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit}>
        {/* Step 1: Agency & Type */}
        {activeStep === 1 && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800', color: '#005154' }}>
              القسم 1: نوع السيرة والوكالة الخارجية
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>نوع السيرة الذاتية *</label>
                <select
                  value={formData.type_id}
                  onChange={(e) => setFormData({ ...formData, type_id: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                >
                  <option value="توسط">استقدام (توسط أفراد)</option>
                  <option value="إيجار">تأجير وتشغيل</option>
                  <option value="نقل كفالة">نقل كفالة وتنازل</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>الجنسية *</label>
                <select
                  value={formData.nationality_id}
                  onChange={(e) => setFormData({ ...formData, nationality_id: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                >
                  <option value="الفلبين">الفلبين (PHL)</option>
                  <option value="إثيوبيا">إثيوبيا (ETH)</option>
                  <option value="أوغندا">أوغندا (UGA)</option>
                  <option value="كينيا">كينيا (KEN)</option>
                  <option value="سريلانكا">سريلانكا (LKA)</option>
                  <option value="الهند">الهند (IND)</option>
                  <option value="بنغلاديش">بنغلاديش (BGD)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>المكتب الخارجي الشريك *</label>
                <select
                  value={formData.office_id}
                  onChange={(e) => setFormData({ ...formData, office_id: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                >
                  <option value="PLATINUM BROTHERS INT'L">PLATINUM BROTHERS INT'L (مانيلا)</option>
                  <option value="DAMAS FOREIGN AGENCY">DAMAS FOREIGN AGENCY (أديس أبابا)</option>
                  <option value="VERSATILE OVERSEAS">VERSATILE OVERSEAS (نيروبي)</option>
                  <option value="KAMPALA GLOBAL MANPOWER">KAMPALA GLOBAL MANPOWER (أوغندا)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>المهنة المطلوبة *</label>
                <select
                  value={formData.job_title}
                  onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                >
                  <option value="عاملة منزلية">عاملة منزلية</option>
                  <option value="مربية أطفال">مربية أطفال</option>
                  <option value="طباخة منزلية">طباخة منزلية</option>
                  <option value="ممرضة منزلية">ممرضة منزلية</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#005154', color: '#FFFFFF', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
              >
                التالي: البيانات الشخصية <i className="fa-solid fa-arrow-left mr-1"></i>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Personal Information */}
        {activeStep === 2 && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800', color: '#005154' }}>
              القسم 2: البيانات الشخصية وجواز السفر
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>الاسم الكامل بالإنجليزية *</label>
                <input
                  type="text"
                  required
                  value={formData.full_name_en}
                  onChange={(e) => setFormData({ ...formData, full_name_en: e.target.value })}
                  placeholder="MARIA SANTOS CORTEZ"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>الاسم بالعربية</label>
                <input
                  type="text"
                  value={formData.full_name_ar}
                  onChange={(e) => setFormData({ ...formData, full_name_ar: e.target.value })}
                  placeholder="ماريا سانتوس كورتيز"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>رقم جواز السفر *</label>
                <input
                  type="text"
                  required
                  value={formData.passport_number}
                  onChange={(e) => setFormData({ ...formData, passport_number: e.target.value })}
                  placeholder="P9982710B"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>العمر *</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>الديانة *</label>
                <select
                  value={formData.religion}
                  onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
                >
                  <option>مسلمة</option>
                  <option>مسيحية</option>
                  <option>أخرى</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>الحالة الاجتماعية</label>
                <select
                  value={formData.marital_status}
                  onChange={(e) => setFormData({ ...formData, marital_status: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
                >
                  <option>عزباء</option>
                  <option>متزوجة</option>
                  <option>مطلقة</option>
                  <option>أرملة</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>عدد الأطفال</label>
                <input
                  type="number"
                  value={formData.children_count}
                  onChange={(e) => setFormData({ ...formData, children_count: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#64748B', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
              >
                السابق
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#005154', color: '#FFFFFF', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
              >
                التالي: المهارات واللغات <i className="fa-solid fa-arrow-left mr-1"></i>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Skills & Experience */}
        {activeStep === 3 && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800', color: '#005154' }}>
              القسم 3: المهارات والخبرات العملية واللغات
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              {[
                { id: 'baby_care', label: 'رعاية الأطفال والرضع' },
                { id: 'elderly_care', label: 'رعاية كبار السن' },
                { id: 'cooking_arabic', label: 'الطبخ وإعداد الوجبات' },
                { id: 'cleaning', label: 'التنظيف والترتيب' },
                { id: 'washing_ironing', label: 'الغسيل وكي الملابس' },
                { id: 'driving', label: 'قيادة السيارات' },
                { id: 'sewing', label: 'الخياطة والحياكة' },
              ].map((sk) => (
                <label
                  key={sk.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#334155',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={(formData as any)[sk.id]}
                    onChange={(e) => setFormData({ ...formData, [sk.id]: e.target.checked })}
                  />
                  <span>{sk.label}</span>
                </label>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>مستوى التحدث بالعربية</label>
                <select
                  value={formData.arabic_level}
                  onChange={(e) => setFormData({ ...formData, arabic_level: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                >
                  <option>ممتاز / طليق</option>
                  <option>متوسط / مفهوم</option>
                  <option>مبتدئ / بسيط</option>
                  <option>لا تتحدث العربية</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>مستوى التحدث بالإنجليزية</label>
                <select
                  value={formData.english_level}
                  onChange={(e) => setFormData({ ...formData, english_level: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                >
                  <option>ممتاز / Fluent</option>
                  <option>جيد / Good</option>
                  <option>متوسط</option>
                  <option>بسيط</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#64748B', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
              >
                السابق
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(4)}
                style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#005154', color: '#FFFFFF', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
              >
                التالي: المرفقات والاعتماد <i className="fa-solid fa-arrow-left mr-1"></i>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Media, Cost, & Submission */}
        {activeStep === 4 && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800', color: '#005154' }}>
              القسم 4: التكاليف، الوسائط، وحفظ السيرة
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>الراتب الشهري (ر.س) *</label>
                <input
                  type="number"
                  required
                  value={formData.monthly_salary}
                  onChange={(e) => setFormData({ ...formData, monthly_salary: parseFloat(e.target.value) || 1500 })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>التكلفة للمكتب الخارجي ($)</label>
                <input
                  type="number"
                  value={formData.cost_usd}
                  onChange={(e) => setFormData({ ...formData, cost_usd: parseFloat(e.target.value) || 1200 })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>رابط الفيديو التعريفي (YouTube / Drive)</label>
                <input
                  type="text"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://..."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>حالة الفحص الطبي</label>
                <select
                  value={formData.medical_report_status}
                  onChange={(e) => setFormData({ ...formData, medical_report_status: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                >
                  <option>سليم ولائق طبياً (مرفق)</option>
                  <option>قيد الفحص المخبري</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#64748B', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
              >
                السابق
              </button>
              <button
                type="submit"
                style={{ padding: '10px 28px', borderRadius: '8px', border: 'none', backgroundColor: '#005154', color: '#FFFFFF', fontWeight: '900', fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,81,84,0.25)' }}
              >
                <i className="fa-solid fa-check ml-1"></i> حفظ ونشر السيرة الذاتية
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
