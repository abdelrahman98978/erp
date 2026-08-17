import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { exportData } from '../services/exportService';

interface ConstantItem {
  id: string;
  title: string;
  code?: string;
  subtext?: string;
  status: 'نشط' | 'معطل';
  icon?: string;
}

export const MasterConstantsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'nationalities' | 'professions' | 'religions' | 'skills' | 'airports' | 'social_statuses' | 'stages'
  >('nationalities');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [nationalities, setNationalities] = useState<ConstantItem[]>([
    { id: '1', title: 'إثيوبيا', code: 'ETH', subtext: 'متاحة للاستقدام والتأجير', status: 'نشط', icon: '🇪🇹' },
    { id: '2', title: 'الفلبين', code: 'PHL', subtext: 'متاحة للاستقدام والتأجير', status: 'نشط', icon: '🇵🇭' },
    { id: '3', title: 'الهند', code: 'IND', subtext: 'متاحة للاستقدام', status: 'نشط', icon: '🇮🇳' },
    { id: '4', title: 'أوغندا', code: 'UGA', subtext: 'متاحة للاستقدام والتأجير', status: 'نشط', icon: '🇺🇬' },
    { id: '5', title: 'بنغلاديش', code: 'BGD', subtext: 'متاحة للاستقدام', status: 'نشط', icon: '🇧🇩' },
    { id: '6', title: 'كينيا', code: 'KEN', subtext: 'متاحة للاستقدام والتأجير', status: 'نشط', icon: '🇰🇪' },
    { id: '7', title: 'سيريلانكا', code: 'LKA', subtext: 'متاحة للاستقدام', status: 'نشط', icon: '🇱🇰' },
    { id: '8', title: 'ألبانيا', code: 'ALB', subtext: 'متاحة للاستقدام والتنازل', status: 'نشط', icon: '🇦🇱' },
  ]);

  const [professions, setProfessions] = useState<ConstantItem[]>([
    { id: 'p1', title: 'عاملة منزلية', code: 'DOMESTIC', subtext: 'عمالة منزلية أفراد', status: 'نشط' },
    { id: 'p2', title: 'سائق خاص', code: 'DRIVER', subtext: 'عمالة منزلية أفراد', status: 'نشط' },
    { id: 'p3', title: 'طباخ منزلي / طباخة', code: 'COOK', subtext: 'عمالة منزلية أفراد', status: 'نشط' },
    { id: 'p4', title: 'مربية أطفال', code: 'NANNY', subtext: 'رعاية أطفال', status: 'نشط' },
    { id: 'p5', title: 'ممرض منزلي / ممرضة', code: 'NURSE', subtext: 'رعاية طبية', status: 'نشط' },
    { id: 'p6', title: 'حارس منزلي', code: 'GUARD', subtext: 'أمن وحراسة', status: 'نشط' },
    { id: 'p7', title: 'عامل مهني', code: 'PROFESSIONAL', subtext: 'عمالة مهنية مؤسسات', status: 'نشط' },
  ]);

  const [religions, setReligions] = useState<ConstantItem[]>([
    { id: 'r1', title: 'الإسلام', code: 'MUSLIM', subtext: 'مسلم / مسلمة', status: 'نشط' },
    { id: 'r2', title: 'المسيحية', code: 'CHRISTIAN', subtext: 'مسيحي / مسيحية', status: 'نشط' },
    { id: 'r3', title: 'أخرى / غير محدد', code: 'OTHER', subtext: 'ديانات أخرى', status: 'نشط' },
  ]);

  const [skills, setSkills] = useState<ConstantItem[]>([
    { id: 's1', title: 'رعاية الأطفال والرضع', code: 'CHILD_CARE', subtext: 'خبرة متقدمة', status: 'نشط' },
    { id: 's2', title: 'رعاية كبار السن وذوي الاحتياجات', code: 'ELDER_CARE', subtext: 'مهارة معتمدة', status: 'نشط' },
    { id: 's3', title: 'الطبخ الخليجي والعربي', code: 'COOKING_ARABIC', subtext: 'إجادة الأكلات الشعبية', status: 'نشط' },
    { id: 's4', title: 'التنظيف والترتيب الفندقي', code: 'CLEANING', subtext: 'إتقان عالي', status: 'نشط' },
    { id: 's5', title: 'الغسيل وكي الملابس الدقيقة', code: 'LAUNDRY', subtext: 'إتقان', status: 'نشط' },
    { id: 's6', title: 'التحدث باللغة العربية', code: 'ARABIC_LANG', subtext: 'مستوى جيد فما فوق', status: 'نشط' },
    { id: 's7', title: 'التحدث باللغة الإنجليزية', code: 'ENGLISH_LANG', subtext: 'مستوى محادثة', status: 'نشط' },
    { id: 's8', title: 'قيادة السيارات (رخصة سارية)', code: 'DRIVING', subtext: 'رخصة سعودية / دولية', status: 'نشط' },
  ]);

  const [airports, setAirports] = useState<ConstantItem[]>([
    { id: 'a1', title: 'مطار الملك خالد الدولي (RUH)', code: 'RUH', subtext: 'السعودية - الرياض', status: 'نشط' },
    { id: 'a2', title: 'مطار الملك عبدالعزيز الدولي (JED)', code: 'JED', subtext: 'السعودية - جدة', status: 'نشط' },
    { id: 'a3', title: 'مطار الملك فهد الدولي (DMM)', code: 'DMM', subtext: 'السعودية - الدمام', status: 'نشط' },
    { id: 'a4', title: 'مطار الأمير محمد بن عبدالعزيز (MED)', code: 'MED', subtext: 'السعودية - المدينة المنورة', status: 'نشط' },
    { id: 'a5', title: 'مطار أبها الإقليمي (AHB)', code: 'AHB', subtext: 'السعودية - أبها / خميس مشيط', status: 'نشط' },
    { id: 'a6', title: 'مطار نينوي أكينو الدولي - مانيلا (MNL)', code: 'MNL', subtext: 'الفلبين - مانيلا', status: 'نشط' },
    { id: 'a7', title: 'مطار بولي الدولي - أديس أبابا (ADD)', code: 'ADD', subtext: 'إثيوبيا - أديس أبابا', status: 'نشط' },
    { id: 'a8', title: 'مطار باندارانايكي - كولمبو (CMB)', code: 'CMB', subtext: 'سريلانكا - كولمبو', status: 'نشط' },
    { id: 'a9', title: 'مطار جومو كينياتا - نيروبي (NBO)', code: 'NBO', subtext: 'كينيا - نيروبي', status: 'نشط' },
    { id: 'a10', title: 'مطار عنتيبي الدولي (EBB)', code: 'EBB', subtext: 'أوغندا - كامبالا', status: 'نشط' },
    { id: 'a11', title: 'مطار حضرة شاه جلال - دكا (DAC)', code: 'DAC', subtext: 'بنغلاديش - دكا', status: 'نشط' },
  ]);

  const [socialStatuses, setSocialStatuses] = useState<ConstantItem[]>([
    { id: 'soc1', title: 'عزباء / أعزب', code: 'SINGLE', subtext: 'غير متزوج/ة', status: 'نشط' },
    { id: 'soc2', title: 'متزوجة / متزوج', code: 'MARRIED', subtext: 'لديه/ا عائلة', status: 'نشط' },
    { id: 'soc3', title: 'مطلقة / مطلق', code: 'DIVORCED', subtext: 'منفصل/ة', status: 'نشط' },
    { id: 'soc4', title: 'أرملة / أرمل', code: 'WIDOWED', subtext: 'أرمل/ة', status: 'نشط' },
  ]);

  const [stages, setStages] = useState<ConstantItem[]>([
    { id: 'stg1', title: 'عقود جديدة (بانتظار مساند)', code: 'NEW', subtext: 'المرحلة 1', status: 'نشط' },
    { id: 'stg2', title: 'توثيق مساند والتفويض الإلكتروني', code: 'MUSANED', subtext: 'المرحلة 2', status: 'نشط' },
    { id: 'stg3', title: 'حجز تساهيل والفحص الطبي الخارجي', code: 'MEDICAL_EXT', subtext: 'المرحلة 3', status: 'نشط' },
    { id: 'stg4', title: 'إصدار التأشيرة والتفييز بالسفارة', code: 'VISA_ISSUED', subtext: 'المرحلة 4', status: 'نشط' },
    { id: 'stg5', title: 'تصريح العمل وتذكرة الطيران', code: 'TICKET_BOOKED', subtext: 'المرحلة 5', status: 'نشط' },
    { id: 'stg6', title: 'الوصول للمملكة والفحص الطبي الداخلي', code: 'ARRIVED_KSA', subtext: 'المرحلة 6', status: 'نشط' },
    { id: 'stg7', title: 'التسليم النهائي وبدء فترة الضمان', code: 'DELIVERED', subtext: 'المرحلة 7', status: 'نشط' },
  ]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newItem: ConstantItem = {
      id: `item-${Date.now()}`,
      title: newTitle,
      code: newCode || 'CUSTOM',
      status: 'نشط',
    };

    if (activeTab === 'nationalities') setNationalities([...nationalities, newItem]);
    if (activeTab === 'professions') setProfessions([...professions, newItem]);
    if (activeTab === 'religions') setReligions([...religions, newItem]);
    if (activeTab === 'skills') setSkills([...skills, newItem]);
    if (activeTab === 'airports') setAirports([...airports, newItem]);
    if (activeTab === 'social_statuses') setSocialStatuses([...socialStatuses, newItem]);
    if (activeTab === 'stages') setStages([...stages, newItem]);

    setNewTitle('');
    setNewCode('');
    setShowAddModal(false);
  };

  const handleDeleteItem = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا البند من الثوابت؟')) return;
    if (activeTab === 'nationalities') setNationalities(nationalities.filter(i => i.id !== id));
    if (activeTab === 'professions') setProfessions(professions.filter(i => i.id !== id));
    if (activeTab === 'religions') setReligions(religions.filter(i => i.id !== id));
    if (activeTab === 'skills') setSkills(skills.filter(i => i.id !== id));
    if (activeTab === 'airports') setAirports(airports.filter(i => i.id !== id));
    if (activeTab === 'social_statuses') setSocialStatuses(socialStatuses.filter(i => i.id !== id));
    if (activeTab === 'stages') setStages(stages.filter(i => i.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    const toggle = (list: ConstantItem[]) =>
      list.map(i => i.id === id ? { ...i, status: (i.status === 'نشط' ? 'معطل' : 'نشط') as any } : i);

    if (activeTab === 'nationalities') setNationalities(toggle(nationalities));
    if (activeTab === 'professions') setProfessions(toggle(professions));
    if (activeTab === 'religions') setReligions(toggle(religions));
    if (activeTab === 'skills') setSkills(toggle(skills));
    if (activeTab === 'airports') setAirports(toggle(airports));
    if (activeTab === 'social_statuses') setSocialStatuses(toggle(socialStatuses));
    if (activeTab === 'stages') setStages(toggle(stages));
  };

  const getActiveList = () => {
    let list: ConstantItem[] = [];
    switch (activeTab) {
      case 'nationalities': list = nationalities; break;
      case 'professions': list = professions; break;
      case 'religions': list = religions; break;
      case 'skills': list = skills; break;
      case 'airports': list = airports; break;
      case 'social_statuses': list = socialStatuses; break;
      case 'stages': list = stages; break;
    }
    if (!searchTerm) return list;
    return list.filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase()) || i.code?.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const activeList = getActiveList();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '900', margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-sliders text-emerald-600"></i>
            ثوابت وإعدادات الاستقدام والتشغيل (Master Constants)
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748B' }}>
            إدارة الجنسيات والدول، المهن المعتمدة، الأديان، المهارات، المطارات، الحالات الاجتماعية، ومراحل العقود
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => exportData(`master_constants_${activeTab}`, activeList, 'excel')}
            className="btn-odoo btn-odoo-secondary"
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            <i className="fa-solid fa-file-excel ml-1"></i> Excel
          </button>
          <button
            onClick={() => exportData(`master_constants_${activeTab}`, activeList, 'pdf')}
            className="btn-odoo btn-odoo-secondary"
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            <i className="fa-solid fa-file-pdf text-danger ml-1"></i> PDF
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              backgroundColor: '#005154',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 81, 84, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <i className="fa-solid fa-plus text-xs"></i>
            إضافة بند جديد
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
        {[
          { id: 'nationalities', label: `الجنسيات (${nationalities.length})`, icon: 'fa-globe' },
          { id: 'professions', label: `المهن المعتمدة (${professions.length})`, icon: 'fa-user-tie' },
          { id: 'religions', label: `الأديان (${religions.length})`, icon: 'fa-kaaba' },
          { id: 'skills', label: `المهارات (${skills.length})`, icon: 'fa-star' },
          { id: 'airports', label: `المطارات (${airports.length})`, icon: 'fa-plane-departure' },
          { id: 'social_statuses', label: `الحالات الاجتماعية (${socialStatuses.length})`, icon: 'fa-heart' },
          { id: 'stages', label: `مراحل الاستقدام (${stages.length})`, icon: 'fa-timeline' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: isActive ? '#005154' : '#E2E8F0',
                backgroundColor: isActive ? '#005154' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#334155',
                fontWeight: isActive ? '800' : '600',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <i className={`fa-solid ${tab.icon}`} style={{ fontSize: '11px' }}></i>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div style={{ maxWidth: '360px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="بحث سريع في القائمة الحالية..."
          className="filter-input"
          style={{ width: '100%', padding: '8px 14px', borderRadius: '10px' }}
        />
      </div>

      {/* Constants Data Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
        {activeList.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              opacity: item.status === 'معطل' ? 0.6 : 1
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {item.icon ? (
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
              ) : (
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#F1F5F9',
                    color: '#005154',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '12px',
                  }}
                >
                  <i className="fa-solid fa-check"></i>
                </div>
              )}
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>{item.title}</h4>
                {item.subtext && <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748B' }}>{item.subtext}</p>}
                {item.code && (
                  <span style={{ fontSize: '10px', color: '#94A3B8', fontFamily: 'monospace', fontWeight: '700' }}>
                    كود: {item.code}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleToggleStatus(item.id)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '2px' }}
                title="تغيير الحالة"
              >
                <Badge text={item.status} type={item.status === 'نشط' ? 'success' : 'danger'} />
              </button>
              <button
                type="button"
                onClick={() => handleDeleteItem(item.id)}
                style={{ border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer', padding: '4px', fontSize: '12px' }}
                title="حذف"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '480px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>
              إضافة بند جديد في القاموس
            </h3>

            <form onSubmit={handleAddItem}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  اسم البند / العنوان *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: إندونيسيا، رعاية صحية، مطار دبي"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  الكود الإنجليزي / الرمز (اختياري)
                </label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="مثال: IDN, HEALTH_CARE, DXB"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#64748B', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#005154', color: '#FFFFFF', fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}
                >
                  حفظ البند
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
