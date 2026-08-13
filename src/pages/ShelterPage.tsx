import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { ShelterItem } from '../types';
import { exportData } from '../services/exportService';

const EXTENDED_SHELTER_DATA: ShelterItem[] = [
  {
    id: 'SH-2026-001',
    maid_name: 'Sara Ethiopian Maid',
    nationality: 'إثيوبيا',
    passport: 'EP9827341',
    client_name: 'شركة توباز للتأجير',
    contract_ref: 'RC-2026-0014',
    shelter_location: 'مقر الإيواء الرئيسي - الرياض',
    days_in_shelter: 12,
    catering_meals_count: 36,
    work_willingness: 'ترغب بالعمل',
    status: 'داخل الإيواء'
  },
  {
    id: 'SH-2026-002',
    maid_name: 'Mary Jane Santos',
    nationality: 'الفلبين',
    passport: 'PH8849201',
    client_name: 'دار الرواد للمقاولات',
    contract_ref: 'RC-2026-0012',
    shelter_location: 'مقر الإيواء - جدة',
    days_in_shelter: 4,
    catering_meals_count: 12,
    work_willingness: 'ترغب بالعمل',
    status: 'متاح للنقل'
  },
  {
    id: 'SH-2026-003',
    maid_name: 'Florence Nabatanzi',
    nationality: 'أوغندا',
    passport: 'UG1102938',
    client_name: 'السفير للخدمات',
    contract_ref: 'RC-2026-0009',
    shelter_location: 'مقر الإيواء - الخبر',
    days_in_shelter: 28,
    catering_meals_count: 84,
    work_willingness: 'لا ترغب بالعمل',
    status: 'مرحلة الترحيل'
  },
  {
    id: 'SH-2026-004',
    maid_name: 'Kavitha Rani',
    nationality: 'الهند',
    passport: 'IN9928374',
    client_name: 'شركة الماسي الفاخرة',
    contract_ref: 'RC-2026-0005',
    shelter_location: 'مقر الإيواء الرئيسي - الرياض',
    days_in_shelter: 2,
    catering_meals_count: 6,
    work_willingness: 'ترغب بالعمل',
    status: 'خارج الإيواء'
  }
];

export const ShelterPage: React.FC = () => {
  const [shelterItems, setShelterItems] = useState<ShelterItem[]>(EXTENDED_SHELTER_DATA);
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'inside' | 'outside' | 'transfer' | 'deportation' | 'deported' | 'locations'>('all');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);

  // Add Shelter Form State
  const [addForm, setAddForm] = useState({
    maid_name: '',
    nationality: 'إثيوبيا',
    passport: '',
    client_name: '',
    shelter_location: 'مقر الإيواء الرئيسي - الرياض',
    work_willingness: 'ترغب بالعمل' as 'ترغب بالعمل' | 'لا ترغب بالعمل' | 'غير محدد'
  });

  const filteredItems = shelterItems.filter(item => {
    if (activeSubTab === 'inside') return item.status === 'داخل الإيواء';
    if (activeSubTab === 'outside') return item.status === 'خارج الإيواء';
    if (activeSubTab === 'transfer') return item.status === 'متاح للنقل';
    if (activeSubTab === 'deportation') return item.status === 'مرحلة الترحيل';
    if (activeSubTab === 'deported') return item.status === 'تم الترحيل';
    return true;
  });

  const handleAddShelter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.maid_name || !addForm.passport) return;

    const newItem: ShelterItem = {
      id: `SH-2026-00${shelterItems.length + 1}`,
      maid_name: addForm.maid_name,
      nationality: addForm.nationality,
      passport: addForm.passport,
      client_name: addForm.client_name || 'تسكين مباشر للشركة',
      contract_ref: `RC-2026-00${20 + shelterItems.length}`,
      shelter_location: addForm.shelter_location,
      days_in_shelter: 1,
      catering_meals_count: 3,
      work_willingness: addForm.work_willingness,
      status: 'داخل الإيواء'
    };

    setShelterItems([newItem, ...shelterItems]);
    setShowAddModal(false);
    setAddForm({ maid_name: '', nationality: 'إثيوبيا', passport: '', client_name: '', shelter_location: 'مقر الإيواء الرئيسي - الرياض', work_willingness: 'ترغب بالعمل' });
    alert(`تم تسكين العاملة (${newItem.maid_name}) بمقر الإيواء وتوليد ملف الإعاشة تلقائياً!`);
  };

  return (
    <div>
      {/* Top Banner Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Cairo, sans-serif' }}>
            <i className="fa-solid fa-building-user text-purple ml-2"></i> منظومة إدارة الإيواء والإعاشة الموحدة (Shelter Management)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            متابعة العمالة بالإيواء (61 داخل المقر، 10 متاح للنقل، 8 بمرحلة الترحيل، 5 خارج الإيواء) والوجبات اليومية
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn-odoo btn-odoo-purple" onClick={() => setShowAddModal(true)}>
            <i className="fa-solid fa-plus ml-1"></i> إضافة تسكين للإيواء
          </button>
          <button className="btn-odoo btn-odoo-primary" onClick={() => setShowMealModal(true)}>
            <i className="fa-solid fa-utensils ml-1"></i> جدول الإعاشة والوجبات
          </button>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('shelter', filteredItems, 'excel')} title="تصدير Excel">
            <i className="fa-solid fa-file-excel text-success ml-1"></i> Excel
          </button>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('shelter', filteredItems, 'pdf')} title="تصدير PDF">
            <i className="fa-solid fa-file-pdf text-danger ml-1"></i> PDF
          </button>
          <button className="btn-odoo btn-odoo-secondary" onClick={() => exportData('shelter', filteredItems, 'csv')} title="تصدير CSV">
            <i className="fa-solid fa-file-csv text-primary ml-1"></i> CSV
          </button>
        </div>
      </div>

      {/* Stats Metric Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', borderRight: '4px solid #005154', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '700' }}>داخل الإيواء حالياً</span>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#005154', marginTop: '4px' }}>61 عاملة</div>
          <span style={{ fontSize: '11px', color: 'var(--status-success)' }}>تغطية إعاشة 100%</span>
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', borderRight: '4px solid #10B981', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '700' }}>متاحة للنقل والتأجير</span>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#10B981', marginTop: '4px' }}>10 عاملات</div>
          <span style={{ fontSize: '11px', color: '#10B981' }}>جاهزات للتسليم الفوري</span>
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', borderRight: '4px solid #F59E0B', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '700' }}>مرحلة الترحيل والمغادرة</span>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#F59E0B', marginTop: '4px' }}>8 عاملات</div>
          <span style={{ fontSize: '11px', color: '#F59E0B' }}>بانتظار تذاكر الطيران</span>
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', borderRight: '4px solid #6B7280', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '700' }}>خارج مقرات الإيواء</span>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#6B7280', marginTop: '4px' }}>5 عاملات</div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>مستضافات لدى العملاء</span>
        </div>
      </div>

      {/* Sub-Tabs Bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px', overflowX: 'auto' }}>
        {[
          { id: 'all', label: 'جميع العمالة بالإيواء' },
          { id: 'inside', label: 'داخل الإيواء (61)' },
          { id: 'transfer', label: 'متاح للنقل والتأجير (10)' },
          { id: 'deportation', label: 'مرحلة الترحيل (8)' },
          { id: 'outside', label: 'خارج الإيواء (5)' },
          { id: 'deported', label: 'تم الترحيل النهائي' },
          { id: 'locations', label: '📍 مقرات ومجمعات الإيواء' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`btn-odoo ${activeSubTab === tab.id ? 'btn-odoo-purple' : 'btn-odoo-secondary'}`}
            onClick={() => setActiveSubTab(tab.id as any)}
            style={{ whiteSpace: 'nowrap', fontSize: '12.5px' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Shelter Table */}
      <div className="table-card" style={{ padding: '20px' }}>
        <table className="odoo-data-table">
          <thead>
            <tr>
              <th>معرف الإيواء</th>
              <th>اسم العاملة والجواز</th>
              <th>العميل والعقد</th>
              <th>مقر الإيواء التابع</th>
              <th>أيام الإيواء والوجبات</th>
              <th>الرغبة بالعمل</th>
              <th>الحالة التشغيلية</th>
              <th>الإجراءات المتاحة</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td style={{ fontWeight: '800', color: 'var(--odoo-purple)' }}>{item.id}</td>
                <td>
                  <div style={{ fontWeight: '700' }}>{item.maid_name}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{item.nationality} • {item.passport}</div>
                </td>
                <td>
                  <div style={{ fontWeight: '700' }}>{item.client_name}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--odoo-teal-dark)' }}>{item.contract_ref}</div>
                </td>
                <td><Badge text={item.shelter_location} type="purple" icon="fa-solid fa-location-dot" /></td>
                <td>
                  <span style={{ fontWeight: '800', color: '#F59E0B' }}>{item.days_in_shelter} يوم</span>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.catering_meals_count} وجبة مسجلة</div>
                </td>
                <td>
                  <Badge
                    text={item.work_willingness}
                    type={item.work_willingness === 'ترغب بالعمل' ? 'success' : 'danger'}
                  />
                </td>
                <td>
                  <Badge
                    text={item.status}
                    type={item.status === 'متاح للنقل' ? 'success' : item.status === 'مرحلة الترحيل' ? 'warning' : 'info'}
                  />
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="btn-odoo btn-odoo-primary" style={{ padding: '4px 8px', fontSize: '11.5px' }} onClick={() => alert(`تجهيز تحويل العاملة ${item.maid_name} لعقد نقل كفالة أو تأجير`)}>
                      نقل كفالة / تأجير
                    </button>
                    <button className="btn-odoo btn-odoo-secondary" style={{ padding: '4px 8px', fontSize: '11.5px' }} onClick={() => alert(`طباعة سند الإعاشة الخاص بالعاملة ${item.maid_name}`)}>
                      سند إعاشة
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Shelter Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="table-card" style={{ width: '520px', padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154' }}>
                تسكين عاملة جديدة بالإيواء
              </h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setShowAddModal(false)}></i>
            </div>

            <form onSubmit={handleAddShelter}>
              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">اسم العاملة بالكامل *</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="اسم العاملة كما في الجواز..."
                  value={addForm.maid_name}
                  onChange={e => setAddForm({ ...addForm, maid_name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="filter-group">
                  <label className="filter-label">الجنسية *</label>
                  <select
                    className="filter-select"
                    value={addForm.nationality}
                    onChange={e => setAddForm({ ...addForm, nationality: e.target.value })}
                  >
                    <option>الفلبين</option>
                    <option>إثيوبيا</option>
                    <option>أوغندا</option>
                    <option>الهند</option>
                    <option>بنغلاديش</option>
                    <option>كينيا</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label className="filter-label">رقم جواز السفر *</label>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="رقم الجواز..."
                    value={addForm.passport}
                    onChange={e => setAddForm({ ...addForm, passport: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="filter-group" style={{ marginBottom: '12px' }}>
                <label className="filter-label">مقر الإيواء المخصص *</label>
                <select
                  className="filter-select"
                  value={addForm.shelter_location}
                  onChange={e => setAddForm({ ...addForm, shelter_location: e.target.value })}
                >
                  <option>مقر الإيواء الرئيسي - الرياض (حي الملز)</option>
                  <option>مقر الإيواء - جدة (حي السلامة)</option>
                  <option>مقر الإيواء - الخبر (حي الحزام)</option>
                </select>
              </div>

              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label className="filter-label">رغبة العاملة بالعمل *</label>
                <select
                  className="filter-select"
                  value={addForm.work_willingness}
                  onChange={e => setAddForm({ ...addForm, work_willingness: e.target.value as any })}
                >
                  <option value="ترغب بالعمل">ترغب بالعمل (متاحة للتأجير أو التنازل)</option>
                  <option value="لا ترغب بالعمل">لا ترغب بالعمل (مرحلة الترحيل)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-odoo btn-odoo-secondary" onClick={() => setShowAddModal(false)}>إلغاء</button>
                <button type="submit" className="btn-odoo btn-odoo-purple">إتمام التسكين بالإيواء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Catering Meal Distribution Modal */}
      {showMealModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="table-card" style={{ width: '480px', padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005154' }}>
                تسجيل وجبات وجدول الإعاشة اليومي
              </h3>
              <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setShowMealModal(false)}></i>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              تأكيد صرف 183 وجبة غذائية لجميع المقيمات بالإيواء (61 عاملة × 3 وجبات يومية)
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="btn-odoo btn-odoo-secondary" onClick={() => setShowMealModal(false)}>إغلاق</button>
              <button className="btn-odoo btn-odoo-purple" onClick={() => { setShowMealModal(false); alert('تم اعتماد وتسجيل كشف وجبات الإعاشة اليومي بنجاح!'); }}>تأكيد وصرف الوجبات اليومية</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShelterPage;
