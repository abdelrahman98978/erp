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
    primaryColor: '#0f172a',
    secondaryColor: '#475569',
    accentColor: '#3b82f6',
    logoUrl: '/logos/group-logo.png',
    headerLogoUrl: '/logos/group-logo.png',
    reportHeaderTemplate: 'MEMBER OF KHALID AL-SULAIM GROUP',
  },
};

export const COMPANIES_LIST: CompanyEntity[] = [
  {
    id: 'SAF',
    code: 'SAF',
    name: 'شركة السفير الماسي للاستقدام',
    nameEn: 'Al-Sfeer Al-Masi Recruitment Company',
    logo: '/logos/masi.png',
    taxNumber: '310123456700003',
    crNumber: '1010123456',
    address: 'الرياض - حي الملز - شارع الستين',
    phone: '0114001122',
    email: 'info@masi.com.sa',
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
      reportHeaderTemplate: 'شركة السفير الماسي للاستقدام - سجل تجاري 1010123456',
    },
  },
  {
    id: 'YAQ',
    code: 'YAQ',
    name: 'شركة ياقوت نجد للاستقدام',
    nameEn: 'Yaqoot Najd Recruitment Company',
    logo: '/logos/yaqoot.png',
    taxNumber: '310234567800003',
    crNumber: '1010234567',
    address: 'جدة - طريق المدينة المنورة',
    phone: '0126002233',
    email: 'contact@yaqoot.com.sa',
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
      reportHeaderTemplate: 'شركة ياقوت نجد للاستقدام - سجل تجاري 1010234567',
    },
  },
  {
    id: 'TOP',
    code: 'TOP',
    name: 'شركة توباز للاستقدام',
    nameEn: 'Topaz Recruitment Company',
    logo: '/logos/topaz.png',
    taxNumber: '310345678900003',
    crNumber: '1010345678',
    address: 'الدمام - شارع الأشرعة',
    phone: '0138003344',
    email: 'recruitment@topaz.com.sa',
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
      reportHeaderTemplate: 'شركة توباز للاستقدام - سجل تجاري 1010345678',
    },
  },
  {
    id: 'DAR',
    code: 'DAR',
    name: 'دار الرواد للاستقدام',
    nameEn: 'Dar Al-Ruwad Recruitment Entity',
    logo: '/logos/ruwad.png',
    taxNumber: '310456789000003',
    crNumber: '1010456789',
    address: 'الرياض - حي العليا',
    phone: '0112004455',
    email: 'info@ruwad.com.sa',
    branchesCount: 3,
    employeesCount: 75,
    activeOrdersCount: 150,
    revenueYTD: 3100000,
    vatRate: 0.15,
    currency: 'ر.س',
    branding: {
      primaryColor: '#7c3aed',
      secondaryColor: '#6d28d9',
      accentColor: '#a78bfa',
      logoUrl: '/logos/ruwad.png',
      headerLogoUrl: '/logos/ruwad.png',
      reportHeaderTemplate: 'دار الرواد للاستقدام - سجل تجاري 1010456789',
    },
  },
  {
    id: 'KAS',
    code: 'KAS',
    name: 'شركة كاس للتجارة',
    nameEn: 'KAS Trading Company',
    logo: '/logos/kas.png',
    taxNumber: '310567890100003',
    crNumber: '1010567890',
    address: 'الرياض - طريق الملك فهد - برج كاس التجاري',
    phone: '0114995566',
    email: 'info@kas.com.sa',
    branchesCount: 3,
    employeesCount: 85,
    activeOrdersCount: 210,
    revenueYTD: 5400000,
    vatRate: 0.15,
    currency: 'ر.س',
    branding: {
      primaryColor: '#d97706',
      secondaryColor: '#b45309',
      accentColor: '#f59e0b',
      logoUrl: '/logos/kas.png',
      headerLogoUrl: '/logos/kas.png',
      reportHeaderTemplate: 'شركة كاس للتجارة - سجل تجاري 1010567890',
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

