import React, { useState } from 'react';
import { realErpDataStore } from '../services/realErpDataStore';
import { useAppStore } from '../stores/appStore';

export const CreateCVPage: React.FC = () => {
  const { setActiveTab } = useAppStore();
  const [formData, setFormData] = useState({
    type_id: 'توسط',
    create_shelter_contract: false,
    nationality_id: 'اثيوبيا',
    office_id: 'DAMAS FOREIGN AGENCY',
    religion_id: 'مسلمة',
    social_status: 'متزوجة',
    children_count: 2,
    education_level: 'ثانوي',
    full_name: '',
    passport_number: '',
    passport_issue_date: '',
    passport_expiry_date: '',
    date_of_birth: '',
    age: '',
    cooking_experience: 'ممتاز',
    ironing: true,
    sewing: false,
    baby_care: true,
    elderly_care: true,
    cleaning: true,
    salary: 1200,
    cost_usd: 1000
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.passport_number) {
      alert('يرجى كتابة الاسم الكامل ورقم الجواز');
      return;
    }

    const newCV = {
      id: `cv-${Date.now()}`,
      cv_code: `CV-${Math.floor(1000 + Math.random() * 9000)}`,
      maid_name: formData.full_name,
      nationality: formData.nationality_id,
      job: 'عاملة منزلية',
      passport_number: formData.passport_number,
      age: parseInt(formData.age) || 28,
      salary: formData.salary,
      external_office: formData.office_id,
      type: formData.type_id,
      status: 'متاح'
    };

    await realErpDataStore.addRecord('cvs', newCV);
    alert('تم حفظ ونشر السيرة الذاتية بنجاح بنظام ERP KHALID AL-SULAIM GROUP!');
    window.history.back();
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800' }}>
            <i className="fa-solid fa-address-card text-purple ml-2"></i> إضافة سيرة ذاتية جديدة (نموذج 136 حقل)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            إدخال المهارات، بيانات الجواز، الفحوصات، وتفاصيل البدلات والرواتب بدقة متناهية
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn-odoo btn-odoo-primary"
            onClick={() => setActiveTab('data-import', 'معالج استيراد البيانات الشامل (Excel / CSV)')}
          >
            <i className="fa-solid fa-file-import ml-1"></i> استيراد سير بالجملة (Excel)
          </button>
          <button type="button" className="btn-odoo btn-odoo-secondary" onClick={() => window.history.back()}>
            <i className="fa-solid fa-arrow-right"></i> إلغاء ورجوع
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Section 1: Basic & Type Details */}
        <div className="table-card" style={{ padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px', color: 'var(--odoo-purple)', borderBottom: '2px solid var(--odoo-purple)', paddingBottom: '8px' }}>
            1. نوع السيرة والارتباط والمكتب الخارجي
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="filter-group">
              <label className="filter-label">نوع السيرة الذاتية *</label>
              <select className="filter-select" value={formData.type_id} onChange={e => setFormData({ ...formData, type_id: e.target.value })}>
                <option value="توسط">استقدام (توسط أفراد)</option>
                <option value="إيجار">تأجير وتدريب مسبق</option>
                <option value="فوري">استلام فوري</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">الجنسية *</label>
              <select className="filter-select" value={formData.nationality_id} onChange={e => setFormData({ ...formData, nationality_id: e.target.value })}>
                <option>اثيوبيا</option>
                <option>الفلبين</option>
                <option>الهند</option>
                <option>اوغندا</option>
                <option>كينيا</option>
                <option>سيريلانكا</option>
                <option>ألبانيا</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">المكتب الخارجي *</label>
              <select className="filter-select" value={formData.office_id} onChange={e => setFormData({ ...formData, office_id: e.target.value })}>
                <option>DAMAS FOREIGN AGENCY</option>
                <option>PLATINUM BROTHERS INT'L</option>
                <option>VERSATILE OVERSEAS LTD</option>
                <option>EARLY LEARNERS CONSULTANT</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">الديانة *</label>
              <select className="filter-select" value={formData.religion_id} onChange={e => setFormData({ ...formData, religion_id: e.target.value })}>
                <option>مسلمة</option>
                <option>مسيحية</option>
                <option>غير محدد</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">الحالة الاجتماعية</label>
              <select className="filter-select" value={formData.social_status} onChange={e => setFormData({ ...formData, social_status: e.target.value })}>
                <option>متزوجة</option>
                <option>عزباء</option>
                <option>مطلقة</option>
                <option>أرملة</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">عدد الأطفال</label>
              <input type="number" className="filter-input" value={formData.children_count} onChange={e => setFormData({ ...formData, children_count: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
        </div>

        {/* Section 2: Personal & Passport Data */}
        <div className="table-card" style={{ padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px', color: 'var(--odoo-teal-dark)', borderBottom: '2px solid var(--odoo-teal)', paddingBottom: '8px' }}>
            2. بيانات الجواز والاسم الرسمي باللغة الإنكليزية والعربية
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="filter-group" style={{ gridColumn: 'span 2' }}>
              <label className="filter-label">الاسم الكامل (كما في الجواز) *</label>
              <input type="text" className="filter-input" placeholder="e.g. MARYAM AHMED ALI" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} required />
            </div>

            <div className="filter-group">
              <label className="filter-label">رقم الجواز *</label>
              <input type="text" className="filter-input" placeholder="e.g. EP-998822" value={formData.passport_number} onChange={e => setFormData({ ...formData, passport_number: e.target.value })} required />
            </div>

            <div className="filter-group">
              <label className="filter-label">تاريخ الإصدار</label>
              <input type="date" className="filter-input" value={formData.passport_issue_date} onChange={e => setFormData({ ...formData, passport_issue_date: e.target.value })} />
            </div>

            <div className="filter-group">
              <label className="filter-label">تاريخ الانتهاء</label>
              <input type="date" className="filter-input" value={formData.passport_expiry_date} onChange={e => setFormData({ ...formData, passport_expiry_date: e.target.value })} />
            </div>

            <div className="filter-group">
              <label className="filter-label">تاريخ الميلاد</label>
              <input type="date" className="filter-input" value={formData.date_of_birth} onChange={e => setFormData({ ...formData, date_of_birth: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Section 3: Skills & Experience */}
        <div className="table-card" style={{ padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px', color: 'var(--text-main)', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
            3. مستوى الخبرات والمهارات وتدبير المنزل
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div className="filter-group">
              <label className="filter-label">خبرة الطبخ</label>
              <select className="filter-select" value={formData.cooking_experience} onChange={e => setFormData({ ...formData, cooking_experience: e.target.value })}>
                <option>ممتاز (أكلات خليجية)</option>
                <option>جيد جداً</option>
                <option>مبتدئ</option>
                <option>لا يوجد</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">الراتب الشهري (ر.س)</label>
              <input type="number" className="filter-input" value={formData.salary} onChange={e => setFormData({ ...formData, salary: parseFloat(e.target.value) || 0 })} />
            </div>

            <div className="filter-group">
              <label className="filter-label">التكلفة بالدولار ($)</label>
              <input type="number" className="filter-input" value={formData.cost_usd} onChange={e => setFormData({ ...formData, cost_usd: parseFloat(e.target.value) || 0 })} />
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', background: '#F8FAFC', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
              <input type="checkbox" checked={formData.ironing} onChange={e => setFormData({ ...formData, ironing: e.target.checked })} /> الكي والملابس
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
              <input type="checkbox" checked={formData.baby_care} onChange={e => setFormData({ ...formData, baby_care: e.target.checked })} /> العناية بالأطفال
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
              <input type="checkbox" checked={formData.elderly_care} onChange={e => setFormData({ ...formData, elderly_care: e.target.checked })} /> كبار السن
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
              <input type="checkbox" checked={formData.cleaning} onChange={e => setFormData({ ...formData, cleaning: e.target.checked })} /> التنظيف الشامل
            </label>
          </div>
        </div>

        {/* Form Submit Footer */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button type="button" className="btn-odoo btn-odoo-secondary">حفظ كمسودة</button>
          <button type="submit" className="btn-odoo btn-odoo-primary" style={{ padding: '10px 24px', fontSize: '14px' }}>
            <i className="fa-solid fa-check"></i> اعتمد واعتماد السيرة الذاتية
          </button>
        </div>
      </form>
    </div>
  );
};
