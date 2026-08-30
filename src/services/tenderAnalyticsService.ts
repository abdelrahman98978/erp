import { TenderRecord, SupplierRecord } from '../types/tenders';

export type { SupplierRecord };

export interface TenderKPI {
  totalTenders: number;
  totalAwarded: number;
  totalDraft: number;
  totalInvoiced: number;
  totalSubmitted: number;
  winRate: number; // percentage
  totalRevenue: number;
  totalRevenueWithVat: number;
  avgTenderValue: number;
  topClient: { name: string; value: number; count: number };
  categoryBreakdown: { category: string; count: number; value: number }[];
  monthlyTrend: { month: string; count: number; value: number }[];
  statusDistribution: { status: string; count: number; color: string }[];
}

export function computeTenderKPIs(tenders: TenderRecord[]): TenderKPI {
  const totalTenders = tenders.length;
  const awarded = tenders.filter(t => t.status === 'ترسية واعتماد');
  const draft = tenders.filter(t => t.status === 'مسودة قيد الدراسة');
  const invoiced = tenders.filter(t => t.status === 'مكتملة ومفوترة');
  const submitted = tenders.filter(t => t.status === 'مقدمة ومسعرة');

  const totalRevenue = tenders.reduce((sum, t) => sum + t.subtotal, 0);
  const totalRevenueWithVat = tenders.reduce((sum, t) => sum + t.grandTotal, 0);
  const avgTenderValue = totalTenders > 0 ? totalRevenueWithVat / totalTenders : 0;
  const winRate = totalTenders > 0 ? ((awarded.length + invoiced.length) / totalTenders) * 100 : 0;

  // Top client by total value
  const clientMap = new Map<string, { value: number; count: number }>();
  tenders.forEach(t => {
    const existing = clientMap.get(t.clientName) || { value: 0, count: 0 };
    clientMap.set(t.clientName, {
      value: existing.value + t.grandTotal,
      count: existing.count + 1,
    });
  });
  let topClient = { name: 'لا يوجد', value: 0, count: 0 };
  clientMap.forEach((v, k) => {
    if (v.value > topClient.value) {
      topClient = { name: k, value: v.value, count: v.count };
    }
  });

  // Category breakdown
  const catMap = new Map<string, { count: number; value: number }>();
  tenders.forEach(t => {
    const existing = catMap.get(t.category) || { count: 0, value: 0 };
    catMap.set(t.category, { count: existing.count + 1, value: existing.value + t.grandTotal });
  });
  const categoryBreakdown = Array.from(catMap.entries()).map(([category, data]) => ({
    category,
    count: data.count,
    value: data.value,
  }));

  // Monthly trend
  const monthMap = new Map<string, { count: number; value: number }>();
  tenders.forEach(t => {
    const month = t.submissionDate ? t.submissionDate.substring(0, 7) : '2026-08';
    const existing = monthMap.get(month) || { count: 0, value: 0 };
    monthMap.set(month, { count: existing.count + 1, value: existing.value + t.grandTotal });
  });
  const monthlyTrend = Array.from(monthMap.entries()).map(([month, data]) => ({
    month,
    count: data.count,
    value: data.value,
  }));

  // Status distribution
  const statusColors: Record<string, string> = {
    'مسودة قيد الدراسة': '#eab308',
    'مقدمة ومسعرة': '#06b6d4',
    'ترسية واعتماد': '#10b981',
    'مكتملة ومفوترة': '#8b5cf6',
  };
  const statusCounts = new Map<string, number>();
  tenders.forEach(t => {
    statusCounts.set(t.status, (statusCounts.get(t.status) || 0) + 1);
  });
  const statusDistribution = Array.from(statusCounts.entries()).map(([status, count]) => ({
    status,
    count,
    color: statusColors[status] || '#64748b',
  }));

  return {
    totalTenders,
    totalAwarded: awarded.length,
    totalDraft: draft.length,
    totalInvoiced: invoiced.length,
    totalSubmitted: submitted.length,
    winRate: Number(winRate.toFixed(1)),
    totalRevenue,
    totalRevenueWithVat,
    avgTenderValue: Number(avgTenderValue.toFixed(2)),
    topClient,
    categoryBreakdown,
    monthlyTrend,
    statusDistribution,
  };
}


export const DEFAULT_SUPPLIERS: SupplierRecord[] = [
  {
    id: 'SUP-001',
    name: 'مؤسسة الضيافة الملكية للتموين',
    category: 'مواد غذائية وضيافة',
    contactPerson: 'فهد بن عبدالله العمري',
    phone: '0551234567',
    email: 'info@royalhospitality.sa',
    city: 'الرياض',
    rating: 5,
    qualityScore: 95,
    commitmentScore: 92,
    priceCompetitiveness: 88,
    totalDeals: 14,
    totalValue: 285000,
    lastDealDate: '2026-08-10',
    status: 'معتمد',
    notes: 'مورد معتمد للقهوة العربية والتمور والضيافة الوطنية',
  },
  {
    id: 'SUP-002',
    name: 'شركة الطباعة المتقدمة للدعاية والإعلان',
    category: 'طباعة ودعاية',
    contactPerson: 'سعد الشمري',
    phone: '0559876543',
    email: 'print@advancedprint.sa',
    city: 'جدة',
    rating: 4,
    qualityScore: 90,
    commitmentScore: 85,
    priceCompetitiveness: 92,
    totalDeals: 22,
    totalValue: 410000,
    lastDealDate: '2026-08-15',
    status: 'معتمد',
    notes: 'متخصص في طباعة الباك دروب واستيكرات المصاعد والواجهات',
  },
  {
    id: 'SUP-003',
    name: 'فرقة العرضة النجدية الرسمية',
    category: 'إنتاج وفعاليات',
    contactPerson: 'ناصر بن سعود الدوسري',
    phone: '0503456789',
    email: 'ardha@najdievents.sa',
    city: 'الرياض',
    rating: 5,
    qualityScore: 98,
    commitmentScore: 96,
    priceCompetitiveness: 75,
    totalDeals: 8,
    totalValue: 172000,
    lastDealDate: '2026-08-12',
    status: 'معتمد',
    notes: 'فرقة رسمية معتمدة للاحتفالات الوطنية والمناسبات الحكومية',
  },
  {
    id: 'SUP-004',
    name: 'مؤسسة الإضاءة الذكية للديكور',
    category: 'إنتاج وفعاليات',
    contactPerson: 'عمر الحربي',
    phone: '0507654321',
    email: 'light@smartdecor.sa',
    city: 'الرياض',
    rating: 4,
    qualityScore: 87,
    commitmentScore: 90,
    priceCompetitiveness: 85,
    totalDeals: 11,
    totalValue: 198000,
    lastDealDate: '2026-08-18',
    status: 'معتمد',
    notes: 'تجهيز إضاءة المباني الحكومية والمكعبات الداخلية للمناسبات',
  },
  {
    id: 'SUP-005',
    name: 'مصنع الهدايا التذكارية والشالات',
    category: 'أخرى',
    contactPerson: 'خالد المطيري',
    phone: '0561112233',
    email: 'gifts@souvenirs.sa',
    city: 'الدمام',
    rating: 3,
    qualityScore: 78,
    commitmentScore: 82,
    priceCompetitiveness: 95,
    totalDeals: 6,
    totalValue: 92000,
    lastDealDate: '2026-07-25',
    status: 'تحت التقييم',
    notes: 'يوفر شالات مطرزة وأكواب سيراميك محفورة بالشعارات الرسمية',
  },
];
