import React from 'react';

interface BadgeProps {
  text: string;
  type?: 'success' | 'warning' | 'danger' | 'info' | 'purple';
  icon?: string;
}

export const Badge: React.FC<BadgeProps> = ({ text, type = 'info', icon }) => {
  return (
    <span className={`badge-pill ${type}`}>
      {icon && <i className={icon}></i>}
      {text}
    </span>
  );
};
