import React, { useState } from 'react';
import {
  Users,
  Settings,
  Plus,
  Search,
  Filter,
  Sliders,
  DollarSign,
  Calculator,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Lock,
  UserCheck,
  CreditCard
} from 'lucide-react';
import { SmaccFormModal } from '../components/smacc/SmaccFormModal';

export const SmaccEmployeesSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'employees' | 'settings' | 'numbering'>('employees');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isEosbModalOpen, setIsEosbModalOpen] = useState(false);

  // General Settings Form State
  const [companySettings, setCompanySettings] = useState({
    companyName: 'مجموعة خالد السليم التجارية',
    taxNumber: '310998231000003',
    currency: 'SAR (ريال سعودي)',
    fiscalYearStart: '2026-01-01',
    mainBranch: 'فرع الرياض الرئيسي',
    vatRate: '15%',
  });

  // Auto Numbering Form State
  const [numberingRules, setNumberingRules] = useState({
    voucherPrefix: 'VOU-',
    voucherStart: '1001',
    journalPrefix: 'JV-',
    journalStart: '4001',
    invoicePrefix: 'INV-',
    invoiceStart: '8001',
    autoApprove: true,
  });

  // New Employee State
  const [newEmp, setNewEmp] = useState({
    name: '',
    nationalId: '',
    jobTitle: 'أخصائي استقدام',
    department: 'قسم العمليات التشغيلية',
    basicSalary: '',
    housingAllowance: '',
    transportAllowance: '',
    bankName: 'مصرف الراجحي',
    iban: '',
  });

  // EOSB Calc State
  const [eosbCalc, setEosbCalc] = useState({
    years: '3',
    lastSalary: '5000',
    result: 0,
  });

  const calculateEosb = () => {
    const yrs = parseFloat(eosbCalc.years) || 0;
    const sal = parseFloat(eosbCalc.lastSalary) || 0;
    let res = 0;
    if (yrs <= 5) {
      res = (sal / 2) * yrs;
    } else {
      res = (sal / 2) * 5 + sal * (yrs - 5);
    }
    setEosbCalc({ ...eosbCalc, result: res });
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmployeeModalOpen(false);
    alert(`تم تسجيل الموظف الجديد (${newEmp.name}) وإعداد مسير الراتب الخاص به بنجاح!`);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert('تم حفظ إعدادات المنشأة والترقيم التلقائي بنجاح في SMACC!');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div
        className="card-feature-cinematic"
        style={{
          background: '#000000',
          borderRadius: '16px',
          padding: '28px',
          color: '#FFFFFF',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div className="flex items-center gap-3">
          <div style={{ width: '44px', height: '44px', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pill-tag-mint" style={{ fontSize: '11px' }}>SMACC HR & SETTINGS</span>
            </div>
            <h1 className="display-sm" style={{ fontSize: '24px', fontWeight: 330, letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: 'var(--font-family-display)' }}>
              إدارة الموظفين والإعدادات العامة
            </h1>
            <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '4px 0 0 0', fontWeight: 420 }}>
              سجل الموظفين والرواتب، الترقيم التلقائي والتفويضات، وإعدادات المنشأة الضريبية
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center bg-white/10 p-1.5 rounded-full border border-white/15 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('employees')}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              fontWeight: activeTab === 'employees' ? 550 : 420,
              background: activeTab === 'employees' ? '#ffffff' : 'transparent',
              color: activeTab === 'employees' ? '#000000' : '#d4d4d8',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            سجل الموظفين
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              fontWeight: activeTab === 'settings' ? 550 : 420,
              background: activeTab === 'settings' ? '#ffffff' : 'transparent',
              color: activeTab === 'settings' ? '#000000' : '#d4d4d8',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            إعدادات النظام العامة
          </button>
          <button
            onClick={() => setActiveTab('numbering')}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              fontWeight: activeTab === 'numbering' ? 550 : 420,
              background: activeTab === 'numbering' ? '#ffffff' : 'transparent',
              color: activeTab === 'numbering' ? '#000000' : '#d4d4d8',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            الترقيم التلقائي والتفويضات
          </button>
        </div>
      </div>

      {/* TAB 1: Employees List */}
      {activeTab === 'employees' && (
        <div className="space-y-6">
          <div className="card-pricing" style={{ padding: '16px 20px', borderRadius: '16px', background: '#ffffff', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="البحث بالاسم أو رقم الهوية..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="text-input"
                style={{ width: '100%', height: '36px', minHeight: '36px', borderRadius: '9999px', paddingRight: '36px', fontSize: '12px' }}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEmployeeModalOpen(true)}
                className="button-primary-pill"
                style={{ fontSize: '12.5px', padding: '6px 18px', minHeight: '38px' }}
              >
                <Plus className="w-4 h-4 ml-1" />
                <span>+ إضافة موظف جديد</span>
              </button>
              <button
                onClick={() => setIsEosbModalOpen(true)}
                className="button-outline-on-light"
                style={{ fontSize: '12.5px', padding: '6px 16px', minHeight: '38px' }}
              >
                <Calculator className="w-4 h-4 ml-1 text-emerald-600" />
                <span>حاسبة مكافأة نهاية الخدمة</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-lg">
            <table className="w-full text-right text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-700">
                <tr>
                  <th className="p-3.5">اسم الموظف</th>
                  <th className="p-3.5">الهوية / الإقامة</th>
                  <th className="p-3.5">المسمى الوظيفي</th>
                  <th className="p-3.5">القسم</th>
                  <th className="p-3.5">الراتب الأساسي</th>
                  <th className="p-3.5">البدلات الشاملة</th>
                  <th className="p-3.5">إجمالي الرف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-sans">
                <tr className="hover:bg-slate-700/40">
                  <td className="p-3.5 font-bold text-white">أحمد محمود السعيد</td>
                  <td className="p-3.5 font-mono text-slate-400">1098231456</td>
                  <td className="p-3.5 text-indigo-300 font-semibold">بائع ومحصل مبيعات</td>
                  <td className="p-3.5 text-slate-300">قسم المبيعات والتحصيل</td>
                  <td className="p-3.5 font-bold text-white">4,500 ر.س</td>
                  <td className="p-3.5 text-slate-400">1,500 ر.س</td>
                  <td className="p-3.5 font-extrabold text-emerald-400">6,000.00 ر.س</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: General Settings */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-6 shadow-lg">
          <h3 className="font-bold text-white text-base border-b border-slate-700 pb-3">إعدادات المنشأة والنظام الضريبي</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-300 block mb-1 font-semibold">اسم المنشأة / التجاري</label>
              <input
                type="text"
                value={companySettings.companyName}
                onChange={e => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1 font-semibold">الرقم الضريبي (ZATCA 15%)</label>
              <input
                type="text"
                value={companySettings.taxNumber}
                onChange={e => setCompanySettings({ ...companySettings, taxNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1 font-semibold">العملة الأساسية للنظام</label>
              <input
                type="text"
                value={companySettings.currency}
                readOnly
                className="w-full bg-slate-950/60 border border-slate-700 rounded-xl py-2 px-3 text-xs text-slate-400 font-bold"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1 font-semibold">بداية السنة المالية</label>
              <input
                type="date"
                value={companySettings.fiscalYearStart}
                onChange={e => setCompanySettings({ ...companySettings, fiscalYearStart: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg"
          >
            حفظ إعدادات المنشأة
          </button>
        </form>
      )}

      {/* TAB 3: Auto Numbering Rules */}
      {activeTab === 'numbering' && (
        <form onSubmit={handleSaveSettings} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-6 shadow-lg">
          <h3 className="font-bold text-white text-base border-b border-slate-700 pb-3">الترقيم التلقائي وتفويضات الاعتماد</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-300 block mb-1 font-semibold">بادئة سندات القبض والصرف</label>
              <input
                type="text"
                value={numberingRules.voucherPrefix}
                onChange={e => setNumberingRules({ ...numberingRules, voucherPrefix: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1 font-semibold">بادئة قيود اليومية العامة</label>
              <input
                type="text"
                value={numberingRules.journalPrefix}
                onChange={e => setNumberingRules({ ...numberingRules, journalPrefix: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white font-mono"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg"
          >
            حفظ قواعد الترقيم
          </button>
        </form>
      )}

      {/* MODAL 1: Add New Employee Modal */}
      <SmaccFormModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        title="إضافة موظف جديد في سجل HR"
        subtitle="أدخل بيانات الموظف والراتب الأساسي والبدلات"
        onSubmit={handleSaveEmployee}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">الاسم الكامل للموظف</label>
            <input
              type="text"
              required
              placeholder="اسم الموظف..."
              value={newEmp.name}
              onChange={e => setNewEmp({ ...newEmp, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">رقم الهوية الوطنية / الإقامة</label>
            <input
              type="text"
              required
              placeholder="10xxxxxxxx"
              value={newEmp.nationalId}
              onChange={e => setNewEmp({ ...newEmp, nationalId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">الراتب الأساسي (ر.س)</label>
            <input
              type="number"
              required
              placeholder="0.00"
              value={newEmp.basicSalary}
              onChange={e => setNewEmp({ ...newEmp, basicSalary: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white font-bold text-emerald-400"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">بدل السكن (ر.س)</label>
            <input
              type="number"
              placeholder="0.00"
              value={newEmp.housingAllowance}
              onChange={e => setNewEmp({ ...newEmp, housingAllowance: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white font-bold"
            />
          </div>
        </div>
      </SmaccFormModal>

      {/* MODAL 2: EOSB Calculator Modal */}
      <SmaccFormModal
        isOpen={isEosbModalOpen}
        onClose={() => setIsEosbModalOpen(false)}
        title="حاسبة مكافأة نهاية الخدمة (EOSB Calculator)"
        subtitle="حسب قانون العمل السعودي"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-300 block mb-1 font-semibold">عدد سنوات الخدمة</label>
              <input
                type="number"
                value={eosbCalc.years}
                onChange={e => setEosbCalc({ ...eosbCalc, years: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1 font-semibold">الراتب الأخير الشامل (ر.س)</label>
              <input
                type="number"
                value={eosbCalc.lastSalary}
                onChange={e => setEosbCalc({ ...eosbCalc, lastSalary: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white font-bold"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={calculateEosb}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
          >
            احسب المكافأة المستحقة
          </button>

          {eosbCalc.result > 0 && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-center">
              <span className="text-xs text-slate-300 block">إجمالي المستحق لمكافأة نهاية الخدمة:</span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">{eosbCalc.result.toLocaleString()} ر.س</span>
            </div>
          )}
        </div>
      </SmaccFormModal>
    </div>
  );
};
