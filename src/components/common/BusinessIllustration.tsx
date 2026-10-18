import React from 'react';
import {
  IllustrationKey,
  getIllustrationMetadata,
  resolveIllustrationForTab,
} from '../../services/visualAssetsRegistry';

export interface BusinessIllustrationProps {
  type?: IllustrationKey;
  tabKey?: string;
  departmentId?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
  showBackground?: boolean;
  variant?: 'funkyways' | 'vector';
}

const DIMENSIONS: Record<NonNullable<BusinessIllustrationProps['size']>, { w: number; h: number }> = {
  sm: { w: 84, h: 76 },
  md: { w: 140, h: 118 },
  lg: { w: 200, h: 164 },
  xl: { w: 270, h: 215 },
};

/**
 * Funkyways (Pixels Market) & IconScout Business Style Vector Illustration Engine
 * Renders authentic brand-recolored Funkyways SVGs (/illustrations/funkyways/*.svg)
 * in Khalid Group's Charcoal (#1D2428), Warm Champagne Gold (#B8924A), and Alabaster (#FBFBF5) palette.
 */
export const BusinessIllustration: React.FC<BusinessIllustrationProps> = ({
  type,
  tabKey,
  departmentId,
  size = 'md',
  className = '',
  animated = true,
  showBackground = true,
  variant = 'funkyways',
}) => {
  const [imgFailed, setImgFailed] = React.useState(false);
  const resolvedKey: IllustrationKey =
    type || resolveIllustrationForTab(tabKey, departmentId);
  const meta = getIllustrationMetadata(resolvedKey);
  const { w, h } = DIMENSIONS[size] || DIMENSIONS.md;
  const uid = React.useId().replace(/:/g, '');

  if (variant === 'funkyways' && meta?.funkywaysSvgUrl && !imgFailed) {
    return (
      <div
        className={`relative inline-flex items-center justify-center select-none shrink-0 ${
          showBackground
            ? 'rounded-2xl bg-[#FBFBF5] border border-[#B8924A]/35 shadow-xs p-1.5'
            : 'rounded-xl bg-[#FBFBF5]/95 border border-[#B8924A]/45 p-1'
        } ${animated ? 'transition-transform duration-300 hover:scale-105' : ''} ${className}`}
        style={{ width: w, height: h }}
        title={meta.titleAr}
      >
        <img
          src={meta.funkywaysSvgUrl}
          alt={meta.titleAr}
          onError={() => setImgFailed(true)}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${className}`}
      style={{ width: w, height: h }}
    >
      <svg
        viewBox="0 0 240 180"
        className="w-full h-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={meta.titleAr}
      >
        <defs>
          <linearGradient id={`ill-gold-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E5C882" />
            <stop offset="50%" stopColor="#B8924A" />
            <stop offset="100%" stopColor="#8C681E" />
          </linearGradient>
          <linearGradient id={`ill-charcoal-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2C353D" />
            <stop offset="100%" stopColor="#151A1E" />
          </linearGradient>
          <linearGradient id={`ill-card-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F6F4EC" />
          </linearGradient>
          <linearGradient id={`ill-emerald-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <filter id={`ill-shadow-${uid}`} x="-12%" y="-12%" width="124%" height="128%">
            <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#1D2428" floodOpacity="0.14" />
          </filter>
        </defs>

        {/* Ambient Isometric Background Aura */}
        <ellipse cx="120" cy="148" rx="92" ry="18" fill="#B8924A" opacity="0.12" />
        <circle cx="44" cy="38" r="18" fill="#B8924A" opacity="0.1" />
        <circle cx="198" cy="42" r="24" fill="#1D2428" opacity="0.06" />

        {/* 1. EXEC COMMAND & ANALYTICS */}
        {resolvedKey === 'exec-command' && (
          <g filter={`url(#ill-shadow-${uid})`}>
            {/* Main Executive Dashboard Screen */}
            <rect x="34" y="24" width="152" height="104" rx="14" fill={`url(#ill-charcoal-${uid})`} stroke={`url(#ill-gold-${uid})`} strokeWidth="2" />
            <circle cx="48" cy="36" r="3" fill="#EF4444" />
            <circle cx="58" cy="36" r="3" fill="#F59E0B" />
            <circle cx="68" cy="36" r="3" fill="#10B981" />
            <line x1="34" y1="46" x2="186" y2="46" stroke="#334155" strokeWidth="1" />
            {/* Rising Bar Chart */}
            <rect x="52" y="88" width="14" height="26" rx="3" fill="#475569" />
            <rect x="74" y="76" width="14" height="38" rx="3" fill="#64748B" />
            <rect x="96" y="64" width="14" height="50" rx="3" fill={`url(#ill-gold-${uid})`} />
            <rect x="118" y="54" width="14" height="60" rx="3" fill={`url(#ill-emerald-${uid})`} />
            {/* Trend Curve */}
            <path d="M56 82 L80 70 L102 58 L125 49 L158 38" fill="none" stroke="#E5C882" strokeWidth="3" strokeLinecap="round" />
            <circle cx="158" cy="38" r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
            {/* Floating KPI Card */}
            <g className={animated ? 'transition-transform duration-700' : ''}>
              <rect x="142" y="72" width="72" height="68" rx="12" fill={`url(#ill-card-${uid})`} stroke="#E2E8F0" strokeWidth="1.5" />
              <circle cx="178" cy="96" r="14" fill="none" stroke="#E2E8F0" strokeWidth="4" />
              <path d="M178 82 A14 14 0 1 1 165 102" fill="none" stroke={`url(#ill-gold-${uid})`} strokeWidth="4" strokeLinecap="round" />
              <text x="178" y="100" textAnchor="middle" fontSize="9" fontWeight="900" fill="#1D2428">99%</text>
              <rect x="154" y="118" width="48" height="6" rx="3" fill="#1D2428" opacity="0.8" />
              <rect x="162" y="128" width="32" height="5" rx="2.5" fill="#B8924A" />
            </g>
          </g>
        )}

        {/* 2. SMACC ACCOUNTING & GENERAL LEDGER */}
        {resolvedKey === 'smacc-finance' && (
          <g filter={`url(#ill-shadow-${uid})`}>
            {/* Double-Entry Ledger Book / Tablet */}
            <rect x="30" y="28" width="136" height="106" rx="12" fill={`url(#ill-card-${uid})`} stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="30" y="28" width="136" height="24" rx="12" fill={`url(#ill-charcoal-${uid})`} />
            <text x="98" y="44" textAnchor="middle" fontSize="10" fontWeight="800" fill="#E5C882">SMACC DOUBLE-ENTRY</text>
            {/* Debit & Credit Columns */}
            <rect x="44" y="62" width="50" height="8" rx="4" fill="#10B981" opacity="0.25" />
            <rect x="102" y="62" width="50" height="8" rx="4" fill="#B8924A" opacity="0.25" />
            <rect x="44" y="78" width="44" height="6" rx="3" fill="#94A3B8" />
            <rect x="102" y="78" width="44" height="6" rx="3" fill="#94A3B8" />
            <rect x="44" y="92" width="48" height="6" rx="3" fill="#CBD5E1" />
            <rect x="102" y="92" width="48" height="6" rx="3" fill="#CBD5E1" />
            {/* Balance Scale / Verified Equilibrium Badge */}
            <rect x="44" y="108" width="108" height="14" rx="6" fill="#ECFDF5" />
            <text x="98" y="118" textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#047857">مدين = دائن (متوازن 100%)</text>
            {/* Floating Calculator & Golden Coin */}
            <rect x="150" y="54" width="62" height="84" rx="12" fill={`url(#ill-charcoal-${uid})`} stroke={`url(#ill-gold-${uid})`} strokeWidth="2" />
            <rect x="160" y="64" width="42" height="16" rx="4" fill="#0F172A" />
            <text x="196" y="75" textAnchor="end" fontSize="9" fontWeight="800" fill="#34D399">25,000</text>
            {[0, 1, 2].map((r) =>
              [0, 1, 2].map((c) => (
                <rect
                  key={`${r}-${c}`}
                  x={160 + c * 15}
                  y={88 + r * 14}
                  width="11"
                  height="9"
                  rx="2.5"
                  fill={r === 2 && c === 2 ? `url(#ill-gold-${uid})` : '#334155'}
                />
              ))
            )}
            <circle cx="42" cy="130" r="16" fill={`url(#ill-gold-${uid})`} stroke="#FFFFFF" strokeWidth="2" />
            <text x="42" cy="134" y="134" textAnchor="middle" fontSize="10" fontWeight="900" fill="#1D2428">ر.س</text>
          </g>
        )}

        {/* 3. ZATCA E-INVOICE & CRYPTOGRAPHIC QR */}
        {resolvedKey === 'zatca-einvoice' && (
          <g filter={`url(#ill-shadow-${uid})`}>
            {/* Tax Invoice Document */}
            <rect x="48" y="18" width="114" height="134" rx="12" fill={`url(#ill-card-${uid})`} stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="48" y="18" width="114" height="26" rx="12" fill={`url(#ill-charcoal-${uid})`} />
            <text x="105" y="35" textAnchor="middle" fontSize="10" fontWeight="900" fill="#34D399">ZATCA PHASE 2</text>
            <rect x="62" y="54" width="60" height="7" rx="3.5" fill="#1D2428" />
            <rect x="62" y="67" width="84" height="6" rx="3" fill="#94A3B8" />
            <rect x="62" y="79" width="72" height="6" rx="3" fill="#CBD5E1" />
            {/* Cryptographic QR Code Block */}
            <rect x="64" y="96" width="42" height="42" rx="6" fill="#FFFFFF" stroke="#1D2428" strokeWidth="2" />
            <rect x="70" y="102" width="10" height="10" fill="#1D2428" />
            <rect x="90" y="102" width="10" height="10" fill="#1D2428" />
            <rect x="70" y="122" width="10" height="10" fill="#1D2428" />
            <rect x="82" y="114" width="8" height="8" fill="#B8924A" />
            <rect x="92" y="124" width="8" height="8" fill="#059669" />
            {/* Cleared Stamp Shield */}
            <circle cx="164" cy="108" r="28" fill={`url(#ill-emerald-${uid})`} stroke="#FFFFFF" strokeWidth="3" />
            <path d="M153 108 L161 116 L177 100" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}

        {/* 4. OCR 100+ INVOICE & DOCUMENT AUTO-EXTRACTOR */}
        {resolvedKey === 'ocr-extractor' && (
          <g filter={`url(#ill-shadow-${uid})`}>
            {/* Stacked Documents (PDF, Excel, Invoice) */}
            <rect x="34" y="36" width="86" height="106" rx="10" fill="#E2E8F0" transform="rotate(-6 77 89)" />
            <rect x="44" y="28" width="94" height="114" rx="10" fill={`url(#ill-card-${uid})`} stroke={`url(#ill-gold-${uid})`} strokeWidth="2" />
            <rect x="58" y="44" width="42" height="8" rx="4" fill="#1D2428" />
            <rect x="58" y="58" width="66" height="6" rx="3" fill="#94A3B8" />
            <rect x="58" y="70" width="58" height="6" rx="3" fill="#CBD5E1" />
            <rect x="58" y="92" width="66" height="6" rx="3" fill="#94A3B8" />
            <rect x="58" y="104" width="50" height="6" rx="3" fill="#CBD5E1" />
            {/* Laser OCR Scan Beam */}
            <line x1="36" y1="82" x2="148" y2="82" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" />
            <rect x="38" y="82" width="108" height="18" fill="#10B981" opacity="0.16" />
            {/* Arrow to Structured Database Card */}
            <path d="M146 82 L166 82" stroke={`url(#ill-gold-${uid})`} strokeWidth="3" strokeLinecap="round" />
            <rect x="164" y="48" width="54" height="68" rx="10" fill={`url(#ill-charcoal-${uid})`} stroke={`url(#ill-gold-${uid})`} strokeWidth="1.8" />
            <text x="191" y="72" textAnchor="middle" fontSize="11" fontWeight="900" fill="#E5C882">100+</text>
            <text x="191" y="88" textAnchor="middle" fontSize="8" fontWeight="700" fill="#FFFFFF">OCR AI</text>
            <rect x="174" y="96" width="34" height="7" rx="3.5" fill="#10B981" />
          </g>
        )}

        {/* 5. MUSANED RECRUITMENT & INTERNATIONAL CONTRACTS */}
        {resolvedKey === 'musaned-recruitment' && (
          <g filter={`url(#ill-shadow-${uid})`}>
            {/* Globe & Flight Arc */}
            <circle cx="88" cy="88" r="48" fill={`url(#ill-charcoal-${uid})`} stroke={`url(#ill-gold-${uid})`} strokeWidth="2" />
            <ellipse cx="88" cy="88" rx="24" ry="48" fill="none" stroke="#B8924A" strokeWidth="1.2" opacity="0.5" />
            <line x1="40" y1="88" x2="136" y2="88" stroke="#B8924A" strokeWidth="1.2" opacity="0.5" />
            <path d="M52 72 Q96 28 164 56" fill="none" stroke="#34D399" strokeWidth="3" strokeDasharray="4 3" strokeLinecap="round" />
            {/* Verified Musaned Contract Card */}
            <rect x="118" y="44" width="88" height="96" rx="12" fill={`url(#ill-card-${uid})`} stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="132" y="58" width="44" height="8" rx="4" fill={`url(#ill-gold-${uid})`} />
            <rect x="132" y="72" width="60" height="6" rx="3" fill="#1D2428" />
            <rect x="132" y="84" width="52" height="6" rx="3" fill="#94A3B8" />
            <rect x="132" y="96" width="58" height="6" rx="3" fill="#CBD5E1" />
            <circle cx="162" cy="120" r="11" fill="#10B981" />
            <path d="M157 120 L160.5 123.5 L167.5 116.5" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {/* 6. FLEXIBLE RENTAL & OPERATIONS (YAQOOT) */}
        {resolvedKey === 'flexible-rental' && (
          <g filter={`url(#ill-shadow-${uid})`}>
            {/* Smart Calendar & Hourly/Monthly Scheduler */}
            <rect x="38" y="30" width="128" height="106" rx="14" fill={`url(#ill-card-${uid})`} stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="38" y="30" width="128" height="26" rx="14" fill={`url(#ill-charcoal-${uid})`} />
            <circle cx="62" cy="30" r="5" fill={`url(#ill-gold-${uid})`} />
            <circle cx="142" cy="30" r="5" fill={`url(#ill-gold-${uid})`} />
            {[0, 1, 2].map((r) =>
              [0, 1, 2, 3].map((c) => (
                <rect
                  key={`${r}-${c}`}
                  x={52 + c * 26}
                  y={68 + r * 20}
                  width="18"
                  height="13"
                  rx="3.5"
                  fill={(r === 1 && c === 1) || (r === 0 && c === 2) ? `url(#ill-gold-${uid})` : '#E2E8F0'}
                />
              ))
            )}
            {/* Floating Clock / SLA Timer */}
            <circle cx="174" cy="104" r="30" fill={`url(#ill-charcoal-${uid})`} stroke={`url(#ill-gold-${uid})`} strokeWidth="2.5" />
            <line x1="174" y1="104" x2="174" y2="86" stroke="#E5C882" strokeWidth="3" strokeLinecap="round" />
            <line x1="174" y1="104" x2="190" y2="104" stroke="#34D399" strokeWidth="3" strokeLinecap="round" />
            <circle cx="174" cy="104" r="3.5" fill="#FFFFFF" />
          </g>
        )}

        {/* 7. ATS TALENT PIPELINE & CV BANK */}
        {resolvedKey === 'ats-talent' && (
          <g filter={`url(#ill-shadow-${uid})`}>
            {/* Candidate Profile Cards */}
            <rect x="32" y="38" width="96" height="98" rx="12" fill="#E2E8F0" transform="rotate(-4 80 87)" />
            <rect x="46" y="28" width="108" height="110" rx="14" fill={`url(#ill-card-${uid})`} stroke={`url(#ill-gold-${uid})`} strokeWidth="2" />
            <circle cx="100" cy="62" r="18" fill={`url(#ill-charcoal-${uid})`} />
            <circle cx="100" cy="57" r="7" fill="#F3CFB3" />
            <path d="M86 76 C88 67, 112 67, 114 76" fill={`url(#ill-gold-${uid})`} />
            <rect x="68" y="88" width="64" height="7" rx="3.5" fill="#1D2428" />
            <rect x="76" y="101" width="48" height="6" rx="3" fill="#94A3B8" />
            {/* 5-Star Rating & Verified Badge */}
            <rect x="70" y="114" width="60" height="14" rx="7" fill="#ECFDF5" />
            <text x="100" y="124" textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#059669">★★★★★ موثق</text>
            {/* Magnifier / AI Talent Match */}
            <circle cx="166" cy="96" r="24" fill={`url(#ill-charcoal-${uid})`} stroke={`url(#ill-gold-${uid})`} strokeWidth="3" />
            <path d="M157 96 L163 102 L176 89" fill="none" stroke="#34D399" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="184" y1="114" x2="202" y2="132" stroke={`url(#ill-gold-${uid})`} strokeWidth="6" strokeLinecap="round" />
          </g>
        )}

        {/* 8. HR, PAYROLL WPS & EMPLOYEE 360 */}
        {resolvedKey === 'hr-wps' && (
          <g filter={`url(#ill-shadow-${uid})`}>
            {/* Employee 360 Card & WPS Payroll Shield */}
            <rect x="36" y="26" width="138" height="112" rx="14" fill={`url(#ill-card-${uid})`} stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="36" y="26" width="138" height="26" rx="14" fill={`url(#ill-charcoal-${uid})`} />
            <text x="105" y="43" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#E5C882">WPS & HR 360°</text>
            <circle cx="72" cy="82" r="20" fill={`url(#ill-charcoal-${uid})`} stroke={`url(#ill-gold-${uid})`} strokeWidth="2" />
            <circle cx="72" cy="77" r="7" fill="#F3CFB3" />
            <path d="M58 96 C60 86, 84 86, 86 96" fill="#FFFFFF" />
            <rect x="102" y="66" width="56" height="8" rx="4" fill="#1D2428" />
            <rect x="102" y="80" width="46" height="6" rx="3" fill="#94A3B8" />
            <rect x="102" y="92" width="52" height="12" rx="6" fill="#ECFDF5" />
            <text x="128" y="101" textAnchor="middle" fontSize="8" fontWeight="900" fill="#047857">حماية الأجور ✓</text>
            {/* Biometric / Digital Signature Badge */}
            <circle cx="178" cy="108" r="26" fill={`url(#ill-gold-${uid})`} stroke="#FFFFFF" strokeWidth="2.5" />
            <text x="178" y="112" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#1D2428">EOS 84</text>
          </g>
        )}

        {/* 9. CRM CUSTOMER CARE & OMNICHANNEL */}
        {resolvedKey === 'crm-customer' && (
          <g filter={`url(#ill-shadow-${uid})`}>
            {/* Omnichannel Chat Bubbles & SLA Care */}
            <rect x="34" y="32" width="118" height="72" rx="14" fill={`url(#ill-charcoal-${uid})`} stroke={`url(#ill-gold-${uid})`} strokeWidth="2" />
            <circle cx="58" cy="68" r="14" fill={`url(#ill-gold-${uid})`} />
            <rect x="80" y="54" width="56" height="8" rx="4" fill="#FFFFFF" />
            <rect x="80" y="68" width="44" height="6" rx="3" fill="#94A3B8" />
            <rect x="88" y="78" width="118" height="64" rx="14" fill={`url(#ill-card-${uid})`} stroke="#10B981" strokeWidth="2" />
            <rect x="104" y="94" width="68" height="8" rx="4" fill="#1D2428" />
            <rect x="104" y="108" width="84" height="6" rx="3" fill="#64748B" />
            <circle cx="186" cy="98" r="12" fill="#10B981" />
            <path d="M181 98 L184.5 101.5 L191.5 94.5" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        )}

        {/* 10. DAR AL-RUWAD SHELTER & MEDICAL CARE */}
        {resolvedKey === 'shelter-care' && (
          <g filter={`url(#ill-shadow-${uid})`}>
            {/* Modern Shelter Care Building */}
            <rect x="48" y="34" width="112" height="108" rx="10" fill={`url(#ill-card-${uid})`} stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="44" y="26" width="120" height="16" rx="6" fill={`url(#ill-charcoal-${uid})`} />
            {/* Windows Grid */}
            {[0, 1, 2].map((r) =>
              [0, 1, 2].map((c) => (
                <rect
                  key={`${r}-${c}`}
                  x={62 + c * 32}
                  y={52 + r * 24}
                  width="20"
                  height="15"
                  rx="3"
                  fill={r === 0 && c === 1 ? `url(#ill-gold-${uid})` : '#E2E8F0'}
                />
              ))
            )}
            {/* Medical & HRSD Care Shield */}
            <circle cx="172" cy="104" r="28" fill={`url(#ill-emerald-${uid})`} stroke="#FFFFFF" strokeWidth="3" />
            <rect x="168" y="91" width="8" height="26" rx="2" fill="#FFFFFF" />
            <rect x="159" y="100" width="26" height="8" rx="2" fill="#FFFFFF" />
          </g>
        )}

        {/* 11. KAS TENDERS & BOQ ENGINEERING */}
        {resolvedKey === 'kas-tenders' && (
          <g filter={`url(#ill-shadow-${uid})`}>
            {/* BOQ Engineering Blueprint & Etimad Award */}
            <rect x="32" y="28" width="136" height="106" rx="12" fill="#0F172A" stroke={`url(#ill-gold-${uid})`} strokeWidth="2" />
            {/* Blueprint Grid Lines */}
            <line x1="32" y1="58" x2="168" y2="58" stroke="#1E293B" strokeWidth="1" />
            <line x1="32" y1="88" x2="168" y2="88" stroke="#1E293B" strokeWidth="1" />
            <line x1="78" y1="28" x2="78" y2="134" stroke="#1E293B" strokeWidth="1" />
            <line x1="124" y1="28" x2="124" y2="134" stroke="#1E293B" strokeWidth="1" />
            {/* Isometric BOQ Bars & Pricing */}
            <rect x="48" y="42" width="64" height="8" rx="4" fill="#E5C882" />
            <rect x="48" y="66" width="96" height="7" rx="3.5" fill="#38BDF8" opacity="0.85" />
            <rect x="48" y="80" width="80" height="7" rx="3.5" fill="#34D399" opacity="0.85" />
            <rect x="48" y="102" width="104" height="16" rx="6" fill={`url(#ill-gold-${uid})`} />
            <text x="100" y="113" textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#1D2428">ETIMAD BOQ AWARDED</text>
            {/* Golden Award Seal */}
            <circle cx="178" cy="88" r="26" fill={`url(#ill-card-${uid})`} stroke={`url(#ill-gold-${uid})`} strokeWidth="3" />
            <polygon points="178,70 183,81 195,82 186,90 189,102 178,95 167,102 170,90 161,82 173,81" fill={`url(#ill-gold-${uid})`} />
          </g>
        )}

        {/* 12. EMPTY SEARCH / FILTER RESET STATE */}
        {resolvedKey === 'empty-search' && (
          <g filter={`url(#ill-shadow-${uid})`}>
            <rect x="52" y="30" width="116" height="104" rx="14" fill={`url(#ill-card-${uid})`} stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="70" y="50" width="80" height="8" rx="4" fill="#E2E8F0" />
            <rect x="70" y="66" width="64" height="8" rx="4" fill="#F1F5F9" />
            <rect x="70" y="82" width="72" height="8" rx="4" fill="#F1F5F9" />
            <circle cx="156" cy="102" r="24" fill={`url(#ill-charcoal-${uid})`} stroke={`url(#ill-gold-${uid})`} strokeWidth="3" />
            <line x1="173" y1="119" x2="192" y2="138" stroke={`url(#ill-gold-${uid})`} strokeWidth="6" strokeLinecap="round" />
            <circle cx="156" cy="102" r="9" fill="none" stroke="#E5C882" strokeWidth="2" strokeDasharray="3 2" />
          </g>
        )}
      </svg>
    </div>
  );
};

export interface DepartmentHeroBannerProps {
  illustrationKey?: IllustrationKey;
  tabKey?: string;
  departmentId?: string;
  titleAr?: string;
  subtitleAr?: string;
  badgeAr?: string;
  actions?: React.ReactNode;
  compact?: boolean;
}

/**
 * Reusable Editorial Department Banner combining IconScout Business Illustration
 * with live section metadata and quick action buttons.
 */
export const DepartmentHeroBanner: React.FC<DepartmentHeroBannerProps> = ({
  illustrationKey,
  tabKey,
  departmentId,
  titleAr,
  subtitleAr,
  badgeAr,
  actions,
  compact = false,
}) => {
  const resolvedKey = illustrationKey || resolveIllustrationForTab(tabKey, departmentId);
  const meta = getIllustrationMetadata(resolvedKey);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border mb-5 transition-all"
      style={{
        background: 'linear-gradient(135deg, #1D2428 0%, #262F34 60%, #2E2718 100%)',
        borderColor: 'rgba(184, 146, 74, 0.35)',
        padding: compact ? '14px 20px' : '18px 24px',
        boxShadow: '0 12px 28px -8px rgba(29, 36, 40, 0.18)',
      }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="hidden sm:flex items-center justify-center rounded-xl p-1.5 bg-white/5 border border-white/10 shrink-0">
            <BusinessIllustration type={resolvedKey} size={compact ? 'sm' : 'md'} />
          </div>
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold mb-2 bg-[#B8924A]/20 text-[#E5C882] border border-[#B8924A]/40">
              <span>✦</span>
              <span>{badgeAr || meta.badgeAr}</span>
            </div>
            <h2 className="text-lg md:text-xl font-black text-white truncate">
              {titleAr || meta.titleAr}
            </h2>
            <p className="text-xs md:text-sm text-zinc-300 mt-1 line-clamp-2">
              {subtitleAr || meta.subtitleAr}
            </p>
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
};

export default BusinessIllustration;
