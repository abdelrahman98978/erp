import React, { useState, useEffect } from 'react';
import { ExternalOffice } from '../types';
import { useCompany } from '../contexts/CompanyContext';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';
import { Badge } from '../components/ui/Badge';

interface OfficeUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  linked_office: string;
  nationality: string;
  status: 'نشط' | 'معلق';
}

interface OfficeFile {
  id: string;
  office_name: string;
  file_title: string;
  file_type: string;
  upload_date: string;
  file_size: string;
}

const INITIAL_OFFICES: ExternalOffice[] = [
  {
    id: 'OFF-PH-01',
    officeName: 'Manila Overseas Placement Agency',
    country: 'الفلبين',
    countryCode: 'PH',
    managerName: 'Maria Santos',
    phone: '+63281234567',
    email: 'info@manilaagency.ph',
    licenseNumber: 'POEA-2024-9981',
    activeCandidatesCount: 140,
    arrivedCountCount: 820,
    rating: 4.9,
    authorizedCompanies: ['masi', 'topaz'],
  },
  {
    id: 'OFF-ET-02',
    officeName: 'Addis International Recruitment Bureau',
    country: 'إثيوبيا',
    countryCode: 'ET',
    managerName: 'Bekele Tadesse',
    phone: '+251115512345',
    email: 'contact@addisbureau.et',
    licenseNumber: 'ETH-MOL-7741',
    activeCandidatesCount: 95,
    arrivedCountCount: 540,
    rating: 4.7,
    authorizedCompanies: ['yaqoot', 'ruwad'],
  },
  {
    id: 'OFF-IN-03',
    officeName: 'Bombay Professional Manpower Services',
    country: 'الهند',
    countryCode: 'IN',
    managerName: 'Rajesh Sharma',
    phone: '+912261234567',
    email: 'mumbai@manpower.in',
    licenseNumber: 'MEA-IND-3321',
    activeCandidatesCount: 210,
    arrivedCountCount: 1100,
    rating: 4.8,
    authorizedCompanies: ['masi', 'yaqoot', 'topaz', 'ruwad'],
  },
];

const MOCK_OFFICE_USERS: OfficeUser[] = [
  {
    id: 'OU-01',
    name: 'عبدالفتح (مسؤول الوكلاء)',
    phone: '+966558025628',
    email: 'abdelftah@alsulaim-group.com',
    linked_office: 'Manila Overseas Placement',
    nationality: 'الفلبين',
    status: 'نشط',
  },
  {
    id: 'OU-02',
    name: 'Bekele Tadesse',
    phone: '+251115512345',
    email: 'bekele@addisbureau.et',
    linked_office: 'Addis International Bureau',
    nationality: 'إثيوبيا',
    status: 'نشط',
  },
];

const MOCK_OFFICE_FILES: OfficeFile[] = [
  {
    id: 'OF-01',
    office_name: 'Manila Overseas Placement',
    file_title: 'ترخيص وزارة العمل الفلبينية POEA ساري',
    file_type: 'PDF',
    upload_date: '2026-01-10',
    file_size: '2.4 MB',
  },
  {
    id: 'OF-02',
    office_name: 'Addis International Bureau',
    file_title: 'عقد الشراكة والإرساليات المعتمد مع شركة السليم',
    file_type: 'PDF',
    upload_date: '2026-02-15',
    file_size: '4.1 MB',
  },
];

export const ExternalOfficesAgentsPage: React.FC = () => {
  const { activeCompany } = useCompany();
  const [offices, setOffices] = useState<ExternalOffice[]>([]);
  const [activeTab, setActiveTab] = useState<'offices' | 'users' | 'files'>('offices');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    realErpDataStore.getRecords<ExternalOffice>('external_recruitment_offices', INITIAL_OFFICES).then((data) => setOffices(data));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header Banner */}
      <div
        className="card-feature-cinematic"
        style={{
          backgroundColor: '#000000',
          borderRadius: '16px',
          padding: '28px',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        }}
      >
        <div>
          <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
            INTERNATIONAL RECRUITMENT NETWORK
          </span>
          <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, margin: '6px 0 0 0', letterSpacing: '-0.02em', color: '#ffffff', fontFamily: 'var(--font-family-display)' }}>
            بوابة المكاتب والوكلاء الخارجيين المعتمدين
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#a1a1aa', fontWeight: 420 }}>
            الربط المباشر مع مكاتب الفلبين، إثيوبيا، الهند، كينيا، وأوغندا وإدارة مستخدمي الوكلاء
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => exportData('external_offices', offices, 'excel', `المكاتب الخارجية - ${activeCompany.name}`)}
            className="button-outline-on-dark"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '38px' }}
          >
            <i className="fa-solid fa-file-excel text-emerald-400 ml-1"></i> Excel
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid #e4e4e7', paddingBottom: '12px' }}>
        {[
          { id: 'offices', label: `المكاتب الخارجية (${offices.length || 3})`, icon: 'fa-building' },
          { id: 'users', label: `مستخدمي الوكلاء (${MOCK_OFFICE_USERS.length})`, icon: 'fa-users-gear' },
          { id: 'files', label: `ملفات ووثائق الوكلاء (${MOCK_OFFICE_FILES.length})`, icon: 'fa-folder-open' },
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
                padding: '6px 16px',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: isActive ? '#000000' : '#e4e4e7',
                backgroundColor: isActive ? '#000000' : '#ffffff',
                color: isActive ? '#ffffff' : '#27272a',
                fontWeight: isActive ? 550 : 420,
                fontSize: '12.5px',
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

      {/* Tab 1: Offices Cards & Grid */}
      {activeTab === 'offices' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {(offices.length > 0 ? offices : INITIAL_OFFICES).map((office) => (
            <div
              key={office.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '15px', color: '#0F172A' }}>{office.officeName}</strong>
                <Badge text={office.country} type="purple" />
              </div>

              <div style={{ fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div><i className="fa-solid fa-id-badge ml-1.5 text-slate-400"></i> الترخيص: <strong style={{ fontFamily: 'monospace' }}>{office.licenseNumber}</strong></div>
                <div><i className="fa-solid fa-user-tie ml-1.5 text-slate-400"></i> المدير: {office.managerName}</div>
                <div><i className="fa-solid fa-phone ml-1.5 text-slate-400"></i> {office.phone}</div>
                <div><i className="fa-solid fa-envelope ml-1.5 text-slate-400"></i> {office.email}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '12px', fontSize: '12px' }}>
                <div>السير المتاحة: <strong style={{ color: '#005154' }}>{office.activeCandidatesCount}</strong></div>
                <div>العمالة الواصلة: <strong style={{ color: '#047857' }}>{office.arrivedCountCount}</strong></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Users */}
      {activeTab === 'users' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800' }}>مستخدمي الوكلاء والمكاتب الخارجية</h3>
          <table className="odoo-table" style={{ width: '100%', textAlign: 'right' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>اسم المستخدم</th>
                <th>بيانات التواصل</th>
                <th>المكتب المرتبط</th>
                <th>الدولة والجنسية</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_OFFICE_USERS.map((u, idx) => (
                <tr key={u.id}>
                  <td><strong>{idx + 1}</strong></td>
                  <td><strong style={{ color: '#005154' }}>{u.name}</strong></td>
                  <td>
                    <div>{u.phone}</div>
                    <div style={{ fontSize: '10px', color: '#64748B' }}>{u.email}</div>
                  </td>
                  <td><span style={{ fontWeight: '700' }}>{u.linked_office}</span></td>
                  <td>{u.nationality}</td>
                  <td><Badge text={u.status} type="success" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Files */}
      {activeTab === 'files' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800' }}>وثائق وتراخيص المكاتب الخارجية</h3>
          <table className="odoo-table" style={{ width: '100%', textAlign: 'right' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>المكتب الخارجي</th>
                <th>عنوان الوثيقة والملف</th>
                <th>نوع الملف</th>
                <th>تاريخ الرفع</th>
                <th>الحجم</th>
                <th>الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_OFFICE_FILES.map((f, idx) => (
                <tr key={f.id}>
                  <td><strong>{idx + 1}</strong></td>
                  <td><strong style={{ color: '#005154' }}>{f.office_name}</strong></td>
                  <td>{f.file_title}</td>
                  <td><Badge text={f.file_type} type="purple" /></td>
                  <td>{f.upload_date}</td>
                  <td>{f.file_size}</td>
                  <td>
                    <button style={{ backgroundColor: '#005154', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
                      <i className="fa-solid fa-download ml-1"></i> تحميل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
