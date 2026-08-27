import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  subtext?: string;
  trend?: { type: 'up' | 'down'; text: string };
  variant?: 'teal' | 'purple' | 'warning' | 'danger' | 'info' | 'featured' | 'mint';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  subtext,
  trend,
  variant = 'teal',
  onClick,
}) => {
  const isFeatured = variant === 'featured' || variant === 'mint';

  return (
    <div
      className={isFeatured ? 'card-pricing-featured' : 'card-pricing'}
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        padding: '24px 28px',
        borderRadius: '12px',
        position: 'relative',
        minHeight: '140px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span
          className="eyebrow-cap"
          style={{
            color: isFeatured ? '#000000' : 'var(--color-shade-50)',
            fontWeight: 600,
            fontSize: '13px',
          }}
        >
          {title}
        </span>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '9999px',
            backgroundColor: isFeatured ? '#000000' : '#f4f4f5',
            color: isFeatured ? '#ffffff' : '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
          }}
        >
          <i className={icon}></i>
        </div>
      </div>

      <div
        className="display-md"
        style={{
          color: '#000000',
          fontSize: '32px',
          fontWeight: 330,
          lineHeight: '1.14',
          marginBottom: '8px',
        }}
      >
        {value}
      </div>

      {(subtext || trend) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '4px' }}>
          {subtext && (
            <span className="caption" style={{ color: isFeatured ? '#27272a' : 'var(--color-shade-50)', fontSize: '13px' }}>
              {subtext}
            </span>
          )}
          {trend && (
            <span className={trend.type === 'up' ? 'pill-tag-mint' : 'pill-tag-shade'} style={{ fontSize: '11px' }}>
              <i className={`fa-solid fa-arrow-${trend.type === 'up' ? 'up' : 'down'}`} style={{ fontSize: '9px', marginLeft: '4px' }}></i>
              {trend.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

