import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';

export const MasterConstantsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'nationalities' | 'professions' | 'airports'>('nationalities');

  const NATIONALITIES = [
    { name: 'اثيوبيا', code: 'ETH', status: 'متاحة للاستقدام والتأجير', icon: '🇪🇹' },
    { name: 'الفلبين', code: 'PHL', status: 'متاحة للاستقدام والتأجير', icon: '🇵🇭' },
    { name: 'الهند', code: 'IND', status: 'متاحة للاستقدام', icon: '🇮🇳' },
    { name: 'اوغندا', code: 'UGA', status: 'متاحة للاستقدام والتأجير', icon: '🇺🇬' },
    { name: 'بنجلاديش', code: 'BGD', status: 'متاحة للاستقدام', icon: '🇧🇩' },
    { name: 'كينيا', code: 'KEN', status: 'متاحة للاستقدام والتأجير', icon: '🇰🇪' },
    { name: 'سيريلانكا', code: 'LKA', status: 'متاحة للاستقدام', icon: '🇱🇰' },
    { name: 'ألبانيا', code: 'ALB', status: 'متاحة للاستقدام والتنازل', icon: '🇦🇱' }
  ];

  const PROFESSIONS = [
    { name: 'عاملة منزلية', category: 'عمالة منزلية أفراد' },
    { name: 'سائق خاص', category: 'عمالة منزلية أفراد' },
    { name: 'طباخ منزلية', category: 'عمالة منزلية أفراد' },
    { name: 'عامل مهني', category: 'عمالة مهنية مؤسسات' }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            <i className="fa-solid fa-list-check text-primary ml-2"></i> ثوابت إعدادات الاستقدام (Master System Constants)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>إدارة دول المصدر والجنسيات المتاحة، المهن المعتمدة، المطارات، والأديان</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button className={`btn-odoo ${activeTab === 'nationalities' ? 'btn-odoo-purple' : 'btn-odoo-secondary'}`} onClick={() => setActiveTab('nationalities')}>
          الجنسيات والدول المتاحة (8)
        </button>
        <button className={`btn-odoo ${activeTab === 'professions' ? 'btn-odoo-purple' : 'btn-odoo-secondary'}`} onClick={() => setActiveTab('professions')}>
          المهن المعتمدة (4)
        </button>
      </div>

      {activeTab === 'nationalities' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {NATIONALITIES.map((nat, idx) => (
            <div key={idx} className="table-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px' }}>{nat.icon}</span>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: '800' }}>{nat.name} ({nat.code})</h4>
                <Badge text={nat.status} type="success" />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'professions' && (
        <div className="table-card">
          <table className="odoo-data-table">
            <thead>
              <tr>
                <th>اسم المهنة</th>
                <th>التصنيف الرئيسية</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {PROFESSIONS.map((prof, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '700' }}>{prof.name}</td>
                  <td><Badge text={prof.category} type="purple" /></td>
                  <td><Badge text="نشطة" type="success" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
