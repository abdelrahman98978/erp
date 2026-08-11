import React, { createContext, useContext, useState, useEffect } from 'react';
import { CompanyId, CompanyEntity } from '../types';

export const GROUP_MASTER_ENTITY = {
  id: 'all' as CompanyId,
  name: 'خالد السليم للاستقدام والتشغيل',
  nameEn: 'Khalid Al-Sulaim Group for Recruitment & Operations',
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
};

export const COMPANIES_LIST: CompanyEntity[] = [
  {
    id: 'masi',
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
  },
  {
    id: 'yaqoot',
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
  },
  {
    id: 'topaz',
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
  },
  {
    id: 'ruwad',
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
  },
];

interface CompanyContextType {
  activeCompanyId: CompanyId;
  activeCompany: CompanyEntity;
  activeBranch: string;
  setActiveCompanyId: (id: CompanyId) => void;
  setActiveBranch: (branch: string) => void;
  companies: CompanyEntity[];
  isGroupAdminView: boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCompanyId, setActiveCompanyIdState] = useState<CompanyId>('all');
  const [activeBranch, setActiveBranch] = useState<string>('الفرع الرئيسي');

  const setActiveCompanyId = (id: CompanyId) => {
    setActiveCompanyIdState(id);
    localStorage.setItem('alsulaim_active_company', id);
  };

  useEffect(() => {
    const saved = localStorage.getItem('alsulaim_active_company') as CompanyId;
    if (saved) {
      setActiveCompanyIdState(saved);
    }
  }, []);

  const activeCompany =
    activeCompanyId === 'all'
      ? GROUP_MASTER_ENTITY
      : COMPANIES_LIST.find((c) => c.id === activeCompanyId) || GROUP_MASTER_ENTITY;

  const isGroupAdminView = activeCompanyId === 'all';

  return (
    <CompanyContext.Provider
      value={{
        activeCompanyId,
        activeCompany,
        activeBranch,
        setActiveCompanyId,
        setActiveBranch,
        companies: COMPANIES_LIST,
        isGroupAdminView,
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
