import React from 'react';
import { CompanyId } from '../../types';

interface CompanyLogoProps {
  companyId: CompanyId;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  companyId,
  size = 48,
  style = {},
}) => {
  // 1. Al-Sfeer Al-Masi (Gold & Silver Diamond Logo)
  if (companyId === 'masi') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ borderRadius: '8px', ...style }}
      >
        <rect width="200" height="200" rx="20" fill="#FFFFFF" />
        {/* Diamond Polygons */}
        <polygon points="100,160 40,80 75,40 100,40" fill="#D4AF37" />
        <polygon points="100,160 160,80 125,40 100,40" fill="#94A3B8" />
        <polygon points="100,160 75,40 100,40" fill="#F59E0B" />
        <polygon points="100,160 125,40 100,40" fill="#CBD5E1" />
        <polygon points="40,80 75,40 100,40" fill="#B45309" opacity="0.8" />
        <polygon points="160,80 125,40 100,40" fill="#64748B" opacity="0.8" />
      </svg>
    );
  }

  // 2. Yaqoot Najd (Golden Starburst Crystal Logo)
  if (companyId === 'yaqoot') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ borderRadius: '8px', ...style }}
      >
        <rect width="200" height="200" rx="20" fill="#FFFFFF" />
        <g transform="translate(100, 100)">
          {/* Starburst Crystal Points */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <g key={i} transform={`rotate(${angle})`}>
              <polygon points="0,0 -12,-65 0,-85 12,-65" fill={i % 2 === 0 ? '#D4AF37' : '#EAB308'} />
              <polygon points="0,0 0,-85 12,-65" fill={i % 2 === 0 ? '#B45309' : '#CA8A04'} />
            </g>
          ))}
          <circle cx="0" cy="0" r="10" fill="#F59E0B" />
        </g>
      </svg>
    );
  }

  // 3. Topaz Recruitment (Blue Faceted Gem Logo)
  if (companyId === 'topaz') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ borderRadius: '8px', ...style }}
      >
        <rect width="200" height="200" rx="20" fill="#FFFFFF" />
        {/* Octagonal Blue Gem Pattern */}
        <g transform="translate(100, 100)">
          <circle cx="0" cy="0" r="60" fill="url(#topazGrad)" />
          {/* Facet Lines */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
            <line
              key={i}
              x1="0"
              y1="0"
              x2={60 * Math.cos((angle * Math.PI) / 180)}
              y2={60 * Math.sin((angle * Math.PI) / 180)}
              stroke="#FFFFFF"
              strokeWidth="2.5"
              opacity="0.7"
            />
          ))}
          <polygon points="-25,-25 25,-25 35,0 25,25 -25,25 -35,0" fill="none" stroke="#FFFFFF" strokeWidth="3" />
        </g>
        <defs>
          <radialGradient id="topazGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 0) scale(60)">
            <stop stopColor="#38BDF8" />
            <stop offset="0.7" stopColor="#0284C7" />
            <stop offset="1" stopColor="#1E3A8A" />
          </radialGradient>
        </defs>
      </svg>
    );
  }

  // 4. Dar Al-Ruwad (Blue Globe + Stylized 'R' Logo)
  if (companyId === 'ruwad') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ borderRadius: '8px', ...style }}
      >
        <rect width="200" height="200" rx="20" fill="#FFFFFF" />
        {/* Globe Grid */}
        <circle cx="100" cy="100" r="70" fill="#EFF6FF" stroke="#1E3A8A" strokeWidth="6" />
        <ellipse cx="100" cy="100" rx="70" ry="30" fill="none" stroke="#0284C7" strokeWidth="3" />
        <ellipse cx="100" cy="100" rx="30" ry="70" fill="none" stroke="#0284C7" strokeWidth="3" />
        <line x1="30" y1="100" x2="170" y2="100" stroke="#1E3A8A" strokeWidth="4" />
        <line x1="100" y1="30" x2="100" y2="170" stroke="#1E3A8A" strokeWidth="4" />
        {/* Stylized 'R' */}
        <path
          d="M 70,140 C 60,110 65,70 95,70 C 125,70 135,90 120,110 C 110,120 90,115 85,115 L 125,140"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Default: Group Master Logo
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: '8px', ...style }}
    >
      <rect width="200" height="200" rx="40" fill="#000000" />
      <circle cx="100" cy="100" r="75" fill="none" stroke="#D4AF37" strokeWidth="6" />
      <text x="100" y="115" textAnchor="middle" fill="#D4AF37" fontSize="55" fontWeight="900" fontFamily="var(--font-family-display)">
        KS
      </text>
    </svg>
  );
};
