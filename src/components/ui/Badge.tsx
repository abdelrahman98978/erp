import React from 'react';

interface BadgeProps {
  text: string;
  type?: 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'primary' | 'mint' | 'shade';
  icon?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ text, type = 'shade', icon, className = '' }) => {
  if (type === 'mint' || type === 'success') {
    return (
      <span className={`pill-tag-mint ${className}`}>
        {icon && <i className={icon} style={{ fontSize: '10px' }}></i>}
        <span>{text}</span>
      </span>
    );
  }

  if (type === 'shade') {
    return (
      <span className={`pill-tag-shade ${className}`}>
        {icon && <i className={icon} style={{ fontSize: '10px' }}></i>}
        <span>{text}</span>
      </span>
    );
  }

  return (
    <span className={`badge-pill ${type} ${className}`} style={{ borderRadius: '9999px', fontFeatureSettings: '"ss03" 1' }}>
      {icon && <i className={icon}></i>}
      {text}
    </span>
  );
};

