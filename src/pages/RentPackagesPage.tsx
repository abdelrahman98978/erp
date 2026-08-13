import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { realErpDataStore } from '../services/realErpDataStore';

interface RentPackage {
  id: string;
  name: string;
  duration_months: number;
  monthly_rate: number;
  discount_percentage: number;
  features: string[];
}

const MOCK_PACKAGES: RentPackage[] = [
  { id: '1', name: 'الباقة الشهرية المرنة', duration_months: 1, monthly_rate: 2300, discount_percentage: 0, features: ['ضمان بديل فوري', 'زيارة طبية شهرياً', 'خدمة توصيل للمنزل'] },
  { id: '2', name: 'الباقة ربع السنوية (3 أشهر)', duration_months: 3, monthly_rate: 2100, discount_percentage: 8, features: ['خصم 8% على الإجمالي', 'ضمان شامل 90 يوم', 'خدمة دعم 24/7'] },
  { id: '3', name: 'الباقة السنوية الكبرى (12 شهر)', duration_months: 12, monthly_rate: 1850, discount_percentage: 20, features: ['خصم 20% على الإجمالي', 'تأمين كامل ضد الهروب', 'سندات سداد ميسرة'] }
];

export const RentPackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<RentPackage[]>([]);

  useEffect(() => {
    realErpDataStore.getRecords<RentPackage>('rent_packages', MOCK_PACKAGES).then(data => setPackages(data));
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-boxes-packing text-teal ml-2"></i> باقات وبنود عقود التأجير والتشغيل
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>إدارة أسعار الباقات، مدد التعاقد، وبنود وثيقة عقد الإيجار الموحد</p>
        </div>
        <button className="btn-odoo btn-odoo-primary">
          <i className="fa-solid fa-plus"></i> إضافة باقة جديدة
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {(packages.length > 0 ? packages : MOCK_PACKAGES).map((pkg) => (
          <div key={pkg.id} className="table-card" style={{ padding: '24px', position: 'relative' }}>
            {pkg.discount_percentage > 0 && (
              <span className="badge-pill danger" style={{ position: 'absolute', top: '16px', left: '16px' }}>
                خصم {pkg.discount_percentage}%
              </span>
            )}
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>{pkg.name}</h3>
            <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--odoo-teal-dark)', marginBottom: '16px' }}>
              {pkg.monthly_rate.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: '600' }}>ر.س / شهرياً</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', fontSize: '13px' }}>
              {pkg.features.map((feat, fIdx) => (
                <li key={fIdx} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-check text-success"></i> {feat}
                </li>
              ))}
            </ul>

            <button className="btn-odoo btn-odoo-secondary" style={{ width: '100%' }}>تعديل تفاصيل الباقة</button>
          </div>
        ))}
      </div>
    </div>
  );
};
