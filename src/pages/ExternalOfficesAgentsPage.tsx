import React, { useState, useEffect } from 'react';
import { ExternalOffice } from '../types';
import { useCompany } from '../contexts/CompanyContext';
import { exportData } from '../services/exportService';
import { realErpDataStore } from '../services/realErpDataStore';
import { Badge } from '../components/ui/Badge';
import { Globe, Building2, Users, FolderOpen, FileSpreadsheet, Download, Phone, Mail, UserCheck, ShieldCheck } from 'lucide-react';

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

  useEffect(() => {
    realErpDataStore.getRecords<ExternalOffice>('external_recruitment_offices', INITIAL_OFFICES).then((data) => setOffices(data));
  }, []);

  return (
    <div className="space-y-6">
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
        <div className="flex items-center gap-3">
          <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>
                INTERNATIONAL RECRUITMENT NETWORK
              </span>
            </div>
            <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, margin: 0, letterSpacing: '-0.02em', color: '#ffffff', fontFamily: 'var(--font-family-display)' }}>
              بوابة المكاتب والوكلاء الخارجيين المعتمدين
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#a1a1aa', fontWeight: 420 }}>
              الربط المباشر مع مكاتب الفلبين، إثيوبيا، الهند، كينيا، وأوغندا وإدارة مستخدمي الوكلاء
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportData('external_offices', offices, 'excel', `المكاتب الخارجية - ${activeCompany.name}`)}
            className="button-white-pill"
            style={{ fontSize: '12px', padding: '6px 16px', minHeight: '38px' }}
          >
            <FileSpreadsheet className="w-4 h-4 ml-1 text-emerald-600" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-3">
        {[
          { id: 'offices', label: `المكاتب الخارجية (${offices.length || 3})`, icon: Building2 },
          { id: 'users', label: `مستخدمي الوكلاء (${MOCK_OFFICE_USERS.length})`, icon: Users },
          { id: 'files', label: `ملفات ووثائق الوكلاء (${MOCK_OFFICE_FILES.length})`, icon: FolderOpen },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
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
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Offices Cards & Grid */}
      {activeTab === 'offices' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(offices.length > 0 ? offices : INITIAL_OFFICES).map((office) => (
            <div
              key={office.id}
              className="card-pricing"
              style={{
                borderRadius: '24px',
                background: '#ffffff',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-black text-base">{office.officeName}</h3>
                  <Badge text={office.country} type="purple" />
                </div>

                <div className="text-xs text-zinc-600 space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                    <span>الترخيص: <strong className="font-mono text-black">{office.licenseNumber}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-zinc-400" />
                    <span>المدير: <strong className="text-black">{office.managerName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="font-mono">{office.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{office.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between border-t border-zinc-100 pt-3 text-xs bg-zinc-50 -mx-6 -mb-6 p-4 rounded-b-3xl">
                <div>السير المتاحة: <strong className="text-black font-mono font-bold">{office.activeCandidatesCount}</strong></div>
                <div>العمالة الواصلة: <strong className="text-emerald-700 font-mono font-bold">{office.arrivedCountCount}</strong></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Users */}
      {activeTab === 'users' && (
        <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
          <div className="p-4 border-b border-zinc-100 bg-white">
            <h3 className="text-sm font-bold text-black">مستخدمي الوكلاء والمكاتب الخارجية</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3.5">#</th>
                  <th className="p-3.5">اسم المستخدم</th>
                  <th className="p-3.5">بيانات التواصل</th>
                  <th className="p-3.5">المكتب المرتبط</th>
                  <th className="p-3.5">الدولة والجنسية</th>
                  <th className="p-3.5">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {MOCK_OFFICE_USERS.map((u, idx) => (
                  <tr key={u.id} className="hover:bg-zinc-50">
                    <td className="p-3.5 font-bold font-mono text-black">{idx + 1}</td>
                    <td className="p-3.5 font-bold text-black">{u.name}</td>
                    <td className="p-3.5">
                      <div className="font-mono">{u.phone}</div>
                      <div className="text-[11px] text-zinc-400">{u.email}</div>
                    </td>
                    <td className="p-3.5 font-semibold text-black">{u.linked_office}</td>
                    <td className="p-3.5 text-zinc-600">{u.nationality}</td>
                    <td className="p-3.5"><Badge text={u.status} type="success" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Files */}
      {activeTab === 'files' && (
        <div className="card-pricing" style={{ padding: 0, borderRadius: '24px', background: '#ffffff', overflow: 'hidden' }}>
          <div className="p-4 border-b border-zinc-100 bg-white">
            <h3 className="text-sm font-bold text-black">وثائق وتراخيص المكاتب الخارجية</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3.5">#</th>
                  <th className="p-3.5">المكتب الخارجي</th>
                  <th className="p-3.5">عنوان الوثيقة والملف</th>
                  <th className="p-3.5">نوع الملف</th>
                  <th className="p-3.5">تاريخ الرفع</th>
                  <th className="p-3.5">الحجم</th>
                  <th className="p-3.5 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {MOCK_OFFICE_FILES.map((f, idx) => (
                  <tr key={f.id} className="hover:bg-zinc-50">
                    <td className="p-3.5 font-bold font-mono text-black">{idx + 1}</td>
                    <td className="p-3.5 font-bold text-black">{f.office_name}</td>
                    <td className="p-3.5 font-semibold text-zinc-800">{f.file_title}</td>
                    <td className="p-3.5"><Badge text={f.file_type} type="purple" /></td>
                    <td className="p-3.5 font-mono text-zinc-500">{f.upload_date}</td>
                    <td className="p-3.5 font-mono">{f.file_size}</td>
                    <td className="p-3.5 text-center">
                      <button className="button-outline-on-light" style={{ padding: '3px 10px', fontSize: '11px', minHeight: '26px' }}>
                        <Download className="w-3 h-3 ml-1" />
                        <span>تحميل</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExternalOfficesAgentsPage;
