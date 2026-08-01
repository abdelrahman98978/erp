import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  subtext?: string;
  trend?: { type: 'up' | 'down'; text: string };
  variant?: 'teal' | 'purple' | 'warning' | 'danger' | 'info';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  subtext,
  trend,
  variant = 'teal',
  onClick
}) => {
  return (
    <div className={`stat-card ${variant}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="stat-card-accent-bar"></div>
      
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        <div className="stat-icon">
          <i className={icon}></i>
        </div>
      </div>

      <div className="stat-value">{value}</div>

      {(subtext || trend) && (
        <div className="stat-footer">
          <span>{subtext}</span>
          {trend && (
            <span className={`stat-badge ${trend.type}`}>
              <i className={`fa-solid fa-arrow-${trend.type === 'up' ? 'up' : 'down'}`}></i>
              {trend.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
