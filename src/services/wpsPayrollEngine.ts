/**
 * Saudi Wages Protection System (WPS / SIF) & Labor Law Engine
 * Implements:
 * 1. Standard SAMA / Ministry of Human Resources SIF 4.0 file structure
 * 2. End of Service Calculator (Articles 84 & 85 of Saudi Labor Law)
 * 3. GOSI Contribution calculation (Saudi vs Non-Saudi)
 * 4. SIF (Salary Information File) text generation for all Saudi banks
 */

export interface EmployeePayrollRecord {
  employeeId: string;
  employeeNumber: string;
  nationalIdOrIqama: string;
  employeeName: string;
  bankCode: string; // e.g. 'ALRAJHI', 'NCB', 'RIBL', 'ALINMA', 'BSFR', 'SABB'
  iban: string;
  isSaudi: boolean;
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  otherAllowances: number;
  deductions: number;
  gosiDeduction: number;
  netSalary: number;
  workingDays: number;
}

export interface WpsSifHeader {
  employerCrNumber: string; // 10 digits CR or 700 MOL ID
  employerName: string;
  bankRoutingCode: string; // 4 digits bank routing code
  fileCreationDate: string; // YYYY-MM-DD
  fileCreationTime: string; // HH:mm
  payrollMonth: string; // YYYY-MM
  totalSalariesAmount: number;
  totalRecordsCount: number;
  currency: string; // 'SAR'
}

export interface EndOfServiceCalculation {
  serviceYears: number;
  serviceMonths: number;
  serviceDays: number;
  lastBasicSalary: number;
  totalAllowances: number;
  totalWage: number;
  contractType: 'FIXED_TERM' | 'UNLIMITED';
  separationReason: 'RESIGNATION' | 'TERMINATION_BY_EMPLOYER' | 'CONTRACT_EXPIRY' | 'FORCE_MAJEURE' | 'CONSENT';
  entitlementPercentage: number;
  awardAmount: number;
  leaveBalanceCompensation: number;
  gratuityTotal: number;
  legalArticleNote: string;
}

export class WpsPayrollEngine {
  /**
   * Bank Routing Codes mapping in Saudi Arabia
   */
  public static readonly SAUDI_BANKS_ROUTING: Record<string, { code: string; nameAr: string }> = {
    ALRAJHI: { code: '8000', nameAr: 'مصرف الراجحي' },
    SNB: { code: '1000', nameAr: 'البنك الأهلي السعودي' },
    RIBL: { code: '2000', nameAr: 'بنك الرياض' },
    ALINMA: { code: '0500', nameAr: 'مصرف الإنماء' },
    BSFR: { code: '4500', nameAr: 'البنك السعودي الفرنسي' },
    ANB: { code: '3000', nameAr: 'البنك العربي الوطني' },
    SABB: { code: '5000', nameAr: 'البنك الأول (SABB)' },
    BJAZ: { code: '6000', nameAr: 'بنك الجزيرة' },
    ALBILAD: { code: '1500', nameAr: 'بنك البلاد' },
    GIB: { code: '6500', nameAr: 'بنك الخليج الدولي (ميم)' },
  };

  /**
   * Generates standard Saudi Wages Protection File (.SIF) text
   */
  public static generateSifFileContent(
    header: WpsSifHeader,
    records: EmployeePayrollRecord[]
  ): string {
    const lines: string[] = [];

    // 1. Header Record (SCR: Salary Control Record)
    // Format: SCR,CRNumber,BankCode,FileCreationDate,FileCreationTime,EmployerName,TotalRecords,TotalAmount,Currency,PayrollMonth
    const cleanCr = header.employerCrNumber.padStart(10, '0');
    const dateFormatted = header.fileCreationDate.replace(/-/g, '');
    const timeFormatted = header.fileCreationTime.replace(/:/g, '');
    const totalAmtStr = header.totalSalariesAmount.toFixed(2);
    const countStr = records.length.toString();

    const scrLine = [
      'SCR',
      cleanCr,
      header.bankRoutingCode,
      dateFormatted,
      timeFormatted,
      header.employerName.replace(/,/g, ' '),
      countStr,
      totalAmtStr,
      'SAR',
      header.payrollMonth.replace(/-/g, ''),
    ].join(',');

    lines.push(scrLine);

    // 2. Employee Detail Records (DTR: Detail Transaction Record)
    // Format: DTR,EmployeeID,EmployeeName,NationalID/Iqama,IBAN,BankCode,BasicSalary,Housing,Transport,Other,Deductions,NetSalary,Days
    records.forEach((rec, idx) => {
      const basic = (Number(rec.basicSalary) || 0).toFixed(2);
      const housing = (Number(rec.housingAllowance) || 0).toFixed(2);
      const transport = (Number(rec.transportAllowance) || 0).toFixed(2);
      const other = (Number(rec.otherAllowances) || 0).toFixed(2);
      const deductions = ((Number(rec.deductions) || 0) + (Number(rec.gosiDeduction) || 0)).toFixed(2);
      const net = (Number(rec.netSalary) || 0).toFixed(2);
      const days = (rec.workingDays || 30).toString();

      const dtrLine = [
        'DTR',
        rec.employeeNumber || (idx + 1).toString(),
        rec.employeeName.replace(/,/g, ' '),
        rec.nationalIdOrIqama,
        rec.iban.replace(/\s+/g, ''),
        rec.bankCode || 'ALRAJHI',
        basic,
        housing,
        transport,
        other,
        deductions,
        net,
        days,
      ].join(',');

      lines.push(dtrLine);
    });

    return lines.join('\r\n');
  }

  /**
   * Calculates GOSI contributions according to Saudi GOSI Law
   * Saudi: 9.75% Employee + 11.75% Employer (capped at 45,000 SAR)
   * Non-Saudi: 0% Employee + 2% Occupational Hazard (Employer)
   */
  public static calculateGosi(
    basicSalary: number,
    housingAllowance: number,
    isSaudi: boolean
  ): {
    employeeShare: number;
    employerShare: number;
    totalGosi: number;
    contributoryWage: number;
  } {
    const rawWage = (Number(basicSalary) || 0) + (Number(housingAllowance) || 0);
    const contributoryWage = Math.min(rawWage, 45000); // 45,000 SAR ceiling

    if (isSaudi) {
      const employeeShare = Number((contributoryWage * 0.0975).toFixed(2)); // 9.75%
      const employerShare = Number((contributoryWage * 0.1175).toFixed(2)); // 11.75%
      return {
        employeeShare,
        employerShare,
        totalGosi: Number((employeeShare + employerShare).toFixed(2)),
        contributoryWage,
      };
    } else {
      const employeeShare = 0;
      const employerShare = Number((contributoryWage * 0.02).toFixed(2)); // 2% Occupational hazard
      return {
        employeeShare,
        employerShare,
        totalGosi: employerShare,
        contributoryWage,
      };
    }
  }

  /**
   * Calculates End of Service Gratuity according to Articles 84 and 85 of Saudi Labor Law
   */
  public static calculateEndOfService(params: {
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    lastBasicSalary: number;
    totalAllowances: number;
    contractType: 'FIXED_TERM' | 'UNLIMITED';
    separationReason: 'RESIGNATION' | 'TERMINATION_BY_EMPLOYER' | 'CONTRACT_EXPIRY' | 'FORCE_MAJEURE' | 'CONSENT';
    unusedLeaveDays?: number;
  }): EndOfServiceCalculation {
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    const diffTime = Math.max(0, end.getTime() - start.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const serviceYears = Math.floor(totalDays / 365.25);
    const remainingDaysAfterYears = totalDays % 365.25;
    const serviceMonths = Math.floor(remainingDaysAfterYears / 30.4375);
    const serviceDays = Math.floor(remainingDaysAfterYears % 30.4375);

    const totalWage = (Number(params.lastBasicSalary) || 0) + (Number(params.totalAllowances) || 0);
    const dailyWage = totalWage / 30;

    // Full entitlement base calculation (Article 84)
    // First 5 years: half month per year
    // Beyond 5 years: full month per year
    const exactYears = totalDays / 365.25;
    let baseGratuity = 0;

    if (exactYears <= 5) {
      baseGratuity = (totalWage / 2) * exactYears;
    } else {
      const firstFiveYearsGratuity = (totalWage / 2) * 5;
      const remainingYears = exactYears - 5;
      const beyondFiveYearsGratuity = totalWage * remainingYears;
      baseGratuity = firstFiveYearsGratuity + beyondFiveYearsGratuity;
    }

    // Determine percentage based on separation reason (Article 85)
    let entitlementPercentage = 100;
    let legalArticleNote = 'المادة (84): استحقاق كامل المكافأة.';

    if (params.separationReason === 'RESIGNATION') {
      if (exactYears < 2) {
        entitlementPercentage = 0;
        legalArticleNote = 'المادة (85): استقالة قبل إتمام سنتين (لا يستحق مكافأة).';
      } else if (exactYears >= 2 && exactYears < 5) {
        entitlementPercentage = 33.333; // One third
        legalArticleNote = 'المادة (85): استقالة بين سنتين و5 سنوات (يستحق ثلث المكافأة).';
      } else if (exactYears >= 5 && exactYears < 10) {
        entitlementPercentage = 66.666; // Two thirds
        legalArticleNote = 'المادة (85): استقالة بين 5 و10 سنوات (يستحق ثلثي المكافأة).';
      } else {
        entitlementPercentage = 100;
        legalArticleNote = 'المادة (85): استقالة بعد 10 سنوات خدمة (يستحق كامل المكافأة).';
      }
    } else if (params.separationReason === 'TERMINATION_BY_EMPLOYER' || params.separationReason === 'CONTRACT_EXPIRY' || params.separationReason === 'FORCE_MAJEURE' || params.separationReason === 'CONSENT') {
      entitlementPercentage = 100;
      legalArticleNote = 'المادة (84): إنهاء من صاحب العمل أو انتهاء العقد (استحقاق كامل 100%).';
    }

    const awardAmount = Number(((baseGratuity * entitlementPercentage) / 100).toFixed(2));
    const leaveBalanceCompensation = Number(((params.unusedLeaveDays || 0) * dailyWage).toFixed(2));
    const gratuityTotal = Number((awardAmount + leaveBalanceCompensation).toFixed(2));

    return {
      serviceYears,
      serviceMonths,
      serviceDays,
      lastBasicSalary: params.lastBasicSalary,
      totalAllowances: params.totalAllowances,
      totalWage,
      contractType: params.contractType,
      separationReason: params.separationReason,
      entitlementPercentage,
      awardAmount,
      leaveBalanceCompensation,
      gratuityTotal,
      legalArticleNote,
    };
  }
}
