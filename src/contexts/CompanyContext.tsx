import React, { createContext, useContext, useState, useEffect } from 'react';
import { CompanyId, CompanyEntity } from '../types';

export const GROUP_MASTER_ENTITY: CompanyEntity = {
  id: 'all' as CompanyId,
  code: 'GRP',
  name: 'مجموعة السليم القابضة للاستقدام والخدمات التشغيلية',
  nameEn: 'Al-Sulaim Holding Group for Recruitment & Operations',
  logo: '/logos/group-logo.png',
  taxNumber: '310099887766003',
  crNumber: '1010998877',
  address: 'الرياض - طريق الملك فهد - البرج الموحد للمجموعة',
  phone: '920001234',
  email: 'group@alsulaim.com.sa',
  branchesCount: 18,
  employeesCount: 450,
  activeOrdersCount: 1240,
  revenueYTD: 28500000,
  vatRate: 0.15,
  currency: 'ر.س',
  branding: {
    primaryColor: '#1D2428',
    secondaryColor: '#A98232',
    accentColor: '#CFA64A',
    logoUrl: '/logos/group-logo.png',
    headerLogoUrl: '/logos/group-logo.png',
    reportHeaderTemplate: 'MEMBER OF KHALID AL-SULAIM GROUP',
  },
};

export const COMPANIES_LIST: CompanyEntity[] = [
  {
    id: 'SAF',
    code: 'SAF',
    name: 'شركة الصفا الماسي للاستقدام',
    nameEn: 'Al-Safa Al-Masi Recruitment Company (SAF RC01)',
    logo: '/logos/masi.png',
    taxNumber: '310123456700003',
    crNumber: '1010123456',
    address: 'الرياض - حي الملز - شارع الستين',
    phone: '0114001122',
    email: 'info@saf-rec.sa',
    branchesCount: 5,
    employeesCount: 120,
    activeOrdersCount: 380,
    revenueYTD: 8900000,
    vatRate: 0.15,
    currency: 'ر.س',
    branding: {
      primaryColor: '#0284c7',
      secondaryColor: '#0369a1',
      accentColor: '#38bdf8',
      logoUrl: '/logos/masi.png',
      headerLogoUrl: '/logos/masi.png',
      reportHeaderTemplate: 'شركة الصفا الماسي للاستقدام (SAF RC01) - سجل تجاري 1010123456',
    },
  },
  {
    id: 'YAQ',
    code: 'YAQ',
    name: 'شركة الياقوت الشرقية للتشغيل والتأجير',
    nameEn: 'Al-Yaqoot Al-Sharqiah Operations & Rental (YAQ RC02)',
    logo: '/logos/yaqoot.png',
    taxNumber: '310234567800003',
    crNumber: '1010234567',
    address: 'جدة - طريق المدينة المنورة',
    phone: '0126002233',
    email: 'contact@yaqoot-ops.sa',
    branchesCount: 4,
    employeesCount: 95,
    activeOrdersCount: 290,
    revenueYTD: 6700000,
    vatRate: 0.15,
    currency: 'ر.س',
    branding: {
      primaryColor: '#b91c1c',
      secondaryColor: '#991b1b',
      accentColor: '#f87171',
      logoUrl: '/logos/yaqoot.png',
      headerLogoUrl: '/logos/yaqoot.png',
      reportHeaderTemplate: 'شركة الياقوت الشرقية للتشغيل والتأجير (YAQ RC02) - سجل تجاري 1010234567',
    },
  },
  {
    id: 'TOP',
    code: 'TOP',
    name: 'شركة توب تالنت الدولية للتوظيف',
    nameEn: 'Top Talent International Recruitment (TOP RC03)',
    logo: '/logos/topaz.png',
    taxNumber: '310345678900003',
    crNumber: '1010345678',
    address: 'الدمام - شارع الأشرعة',
    phone: '0138003344',
    email: 'recruitment@toptalent.sa',
    branchesCount: 6,
    employeesCount: 160,
    activeOrdersCount: 420,
    revenueYTD: 9800000,
    vatRate: 0.15,
    currency: 'ر.س',
    branding: {
      primaryColor: '#0d9488',
      secondaryColor: '#0f766e',
      accentColor: '#2dd4bf',
      logoUrl: '/logos/topaz.png',
      headerLogoUrl: '/logos/topaz.png',
      reportHeaderTemplate: 'شركة توب تالنت الدولية للتوظيف (TOP RC03) - سجل تجاري 1010345678',
    },
  },
  {
    id: 'KAS',
    code: 'KAS',
    name: 'مؤسسة كاس وسحابة اعتماد للمنافسات والتشغيل',
    nameEn: 'KAS Foundation & Etimad Cloud Operations (KAS RC04)',
    logo: '/logos/kas.png',
    taxNumber: '310284759200003',
    crNumber: '1010789234',
    address: 'الرياض - طريق الملك فهد - مجمع كاس للأعمال',
    phone: '0114995566',
    email: 'info@kas-etimad.sa',
    branchesCount: 3,
    employeesCount: 85,
    activeOrdersCount: 210,
    revenueYTD: 5400000,
    vatRate: 0.15,
    currency: 'ر.س',
    branding: {
      primaryColor: '#1D2428',
      secondaryColor: '#A98232',
      accentColor: '#CFA64A',
      logoUrl: '/logos/kas.png',
      headerLogoUrl: '/logos/kas.png',
      reportHeaderTemplate: 'مؤسسة كاس وسحابة اعتماد للمنافسات والتشغيل (KAS RC04) - سجل تجاري 1010789234',
    },
  },
];

// Helper to normalize legacy IDs (masi, yaqoot, topaz, ruwad, kas) to official codes
export const normalizeCompanyId = (id: CompanyId | string): CompanyId => {
  switch (id) {
    case 'masi':
      return 'SAF';
    case 'yaqoot':
      return 'YAQ';
    case 'topaz':
      return 'TOP';
    case 'ruwad':
      return 'DAR';
    case 'kas':
      return 'KAS';
    default:
      return id as CompanyId;
  }
};

interface CompanyContextType {
  activeCompanyId: CompanyId;
  activeCompany: CompanyEntity;
  activeBranch: string;
  setActiveCompanyId: (id: CompanyId) => void;
  setActiveBranch: (branch: string) => void;
  companies: CompanyEntity[];
  isGroupAdminView: boolean;
  getCompanyByCode: (code: string) => CompanyEntity | undefined;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCompanyId, setActiveCompanyIdState] = useState<CompanyId>('all');
  const [activeBranch, setActiveBranch] = useState<string>('الفرع الرئيسي');

  const setActiveCompanyId = (id: CompanyId) => {
    const normalized = normalizeCompanyId(id);
    setActiveCompanyIdState(normalized);
    localStorage.setItem('alsulaim_active_company', normalized);
  };

  useEffect(() => {
    const saved = localStorage.getItem('alsulaim_active_company') as CompanyId;
    if (saved) {
      setActiveCompanyIdState(normalizeCompanyId(saved));
    }
  }, []);

  const normalizedId = normalizeCompanyId(activeCompanyId);

  const activeCompany =
    normalizedId === 'all'
      ? GROUP_MASTER_ENTITY
      : COMPANIES_LIST.find((c) => c.id === normalizedId || c.code === normalizedId) || GROUP_MASTER_ENTITY;

  const isGroupAdminView = normalizedId === 'all';

  const getCompanyByCode = (code: string): CompanyEntity | undefined => {
    const norm = normalizeCompanyId(code);
    return COMPANIES_LIST.find((c) => c.id === norm || c.code === norm);
  };

  return (
    <CompanyContext.Provider
      value={{
        activeCompanyId: normalizedId,
        activeCompany,
        activeBranch,
        setActiveCompanyId,
        setActiveBranch,
        companies: COMPANIES_LIST,
        isGroupAdminView,
        getCompanyByCode,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = (): CompanyContextType => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

