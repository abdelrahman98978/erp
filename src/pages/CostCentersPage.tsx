import React from 'react';
import { Badge } from '../components/ui/Badge';

interface CostCenter {
  code: string;
  name: string;
  parent: string;
  total_expenses: number;
  total_revenues: number;
}

const MOCK_COST_CENTERS: CostCenter[] = [
  { code: 'CC-01', name: 'مركز تكلفة عقود الاستقدام - الفرع الرئيسي', parent: 'الادارة العامة', total_expenses: 3200.00, total_revenues: 410000.00 },
  { code: 'CC-02', name: 'مركز تكلفة عقود التأجير والتشغيل', parent: 'إدارة التأجير', total_expenses: 1800.00, total_revenues: 115471.20 },
  { code: 'CC-03', name: 'مركز إيواء وتغذية حي الرمال', parent: 'إدارة الإيواء', total_expenses: 4500.00, total_revenues: 0.00 }
];

export const CostCentersPage: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-sitemap text-purple ml-2"></i> مراكز التكلفة وشجرة التوزيع المحاسبي (130 مركزاً)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>ربط إيرادات ومصروفات المشاريع والعقود ومقرات الإيواء بمراكز التكلفة</p>
        </div>
        <button className="btn-odoo btn-odoo-purple"><i className="fa-solid fa-plus"></i> إضافة مركز تكلفة</button>
      </div>

      <div className="table-card">
        <table className="odoo-data-table">
          <thead>
            <tr>
              <th>كود المركز</th>
              <th>اسم مركز التكلفة</th>
              <th>المركز الرئيسي التابع</th>
              <th>مصروفات المركز</th>
              <th>إيرادات المركز</th>
              <th>صافي المركز</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_COST_CENTERS.map((cc, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: '800', fontFamily: 'monospace', color: 'var(--odoo-purple)' }}>{cc.code}</td>
                <td style={{ fontWeight: '700' }}>{cc.name}</td>
                <td><Badge text={cc.parent} type="info" /></td>
                <td style={{ color: 'var(--status-danger)', fontWeight: '700' }}>{cc.total_expenses.toLocaleString()} ر.س</td>
                <td style={{ color: 'var(--odoo-teal-dark)', fontWeight: '700' }}>{cc.total_revenues.toLocaleString()} ر.س</td>
                <td style={{ fontWeight: '800', color: 'var(--status-success)' }}>{(cc.total_revenues - cc.total_expenses).toLocaleString()} ر.س</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
