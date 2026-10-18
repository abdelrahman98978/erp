import React from 'react';
import {
  AvatarArchetype,
  resolveAvatarArchetype,
} from '../../services/visualAssetsRegistry';

export interface CorporateAvatarProps {
  archetype?: AvatarArchetype;
  type?: AvatarArchetype;
  name?: string;
  role?: string;
  email?: string;
  departmentId?: string;
  profession?: string;
  gender?: 'male' | 'female';
  category?: string;
  isCandidate?: boolean;
  isClient?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  status?: 'online' | 'busy' | 'verified' | 'speaking' | 'listening' | 'none';
  badgeText?: string;
  className?: string;
}

const SIZE_MAP: Record<NonNullable<CorporateAvatarProps['size']>, number> = {
  xs: 28,
  sm: 36,
  md: 44,
  lg: 54,
  xl: 68,
  '2xl': 88,
};

export const CorporateAvatar: React.FC<CorporateAvatarProps> = ({
  archetype,
  type,
  name,
  role,
  email,
  departmentId,
  profession,
  gender,
  category,
  isCandidate,
  isClient,
  size = 'md',
  status = 'none',
  badgeText,
  className = '',
}) => {
  const resolved: AvatarArchetype =
    archetype ||
    type ||
    resolveAvatarArchetype({
      name,
      role,
      email,
      departmentId,
      profession,
      gender,
      category,
      isCandidate,
      isClient,
    });

  const px = SIZE_MAP[size] || 44;
  const uid = React.useId().replace(/:/g, '');

  const isSpeakingOrListening = status === 'speaking' || status === 'listening';

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: px, height: px }}
      title={name ? `${name}${role ? ` — ${role}` : ''}` : role || ''}
    >
      {/* Animated pulse ring for active voice / AI persona state */}
      {isSpeakingOrListening && (
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-40 pointer-events-none"
          style={{
            backgroundColor: status === 'listening' ? '#10B981' : '#B8924A',
          }}
        />
      )}

      <div
        className="w-full h-full rounded-full overflow-hidden flex items-center justify-center transition-transform duration-200 hover:scale-105"
        style={{
          boxShadow:
            resolved === 'saudi-executive' || resolved === 'ai-faris' || resolved === 'ai-noura'
              ? '0 0 0 2px #B8924A, 0 6px 14px rgba(29, 36, 40, 0.18)'
              : '0 0 0 1.5px rgba(184, 146, 74, 0.35), 0 4px 10px rgba(29, 36, 40, 0.1)',
          background:
            resolved === 'saudi-executive'
              ? 'linear-gradient(135deg, #1D2428 0%, #2C353B 100%)'
              : resolved === 'saudi-female-specialist'
              ? 'linear-gradient(135deg, #232B30 0%, #374147 100%)'
              : resolved === 'finance-cfo'
              ? 'linear-gradient(135deg, #1D2428 0%, #3E3117 100%)'
              : resolved === 'tenders-engineer'
              ? 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
              : resolved.startsWith('candidate-')
              ? 'linear-gradient(135deg, #F8FAFC 0%, #EDE9DE 100%)'
              : 'linear-gradient(135deg, #FBFBF5 0%, #EFECE1 100%)',
        }}
      >
        {resolved === 'ai-faris' ? (
          <img
            src="/mascot.png"
            alt="فارس"
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : resolved === 'ai-noura' ? (
          <img
            src="/noura.png"
            alt="نُورة"
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`gold-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DFC07A" />
                <stop offset="50%" stopColor="#B8924A" />
                <stop offset="100%" stopColor="#8C681E" />
              </linearGradient>
              <linearGradient id={`skin-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F3CFB3" />
                <stop offset="100%" stopColor="#DFB18B" />
              </linearGradient>
              <linearGradient id={`charcoal-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2C353B" />
                <stop offset="100%" stopColor="#14191C" />
              </linearGradient>
            </defs>

            {/* 1. SAUDI EXECUTIVE (Shemagh + Golden Bisht + Igal) */}
            {resolved === 'saudi-executive' && (
              <g>
                <circle cx="50" cy="50" r="48" fill={`url(#charcoal-${uid})`} />
                <circle cx="50" cy="50" r="44" fill="none" stroke={`url(#gold-${uid})`} strokeWidth="1.2" strokeDasharray="3 2" opacity="0.6" />
                {/* White Thobe & Dark/Gold Bisht Shoulders */}
                <path d="M16 96 C18 72, 32 65, 50 65 C68 65, 82 72, 84 96 Z" fill="#FFFFFF" />
                <path d="M14 98 C16 74, 28 66, 38 66 L34 98 Z" fill="#181D20" />
                <path d="M86 98 C84 74, 72 66, 62 66 L66 98 Z" fill="#181D20" />
                {/* Golden Bisht Zari Trim */}
                <path d="M38 66 L34 98" stroke={`url(#gold-${uid})`} strokeWidth="3.2" strokeLinecap="round" />
                <path d="M62 66 L66 98" stroke={`url(#gold-${uid})`} strokeWidth="3.2" strokeLinecap="round" />
                {/* Shemagh Drapes */}
                <path d="M24 42 C22 62, 26 78, 33 92 L40 66 L60 66 L67 92 C74 78, 78 62, 76 42 C74 22, 64 16, 50 16 C36 16, 26 22, 24 42 Z" fill="#FBFBF5" />
                <path d="M26 36 C25 56, 28 74, 34 86" stroke="#C83E3B" strokeWidth="1.5" strokeDasharray="3 2" fill="none" opacity="0.65" />
                <path d="M74 36 C75 56, 72 74, 66 86" stroke="#C83E3B" strokeWidth="1.5" strokeDasharray="3 2" fill="none" opacity="0.65" />
                {/* Neck & Head */}
                <rect x="43" y="55" width="14" height="12" rx="5" fill={`url(#skin-${uid})`} />
                <ellipse cx="50" cy="43" rx="15.5" ry="17.5" fill={`url(#skin-${uid})`} />
                {/* Facial Details (Executive Beard & Eyes) */}
                <path d="M36 47 C36 56, 43 60, 50 60 C57 60, 64 56, 64 47 C62 51, 56 54, 50 54 C44 54, 38 51, 36 47 Z" fill="#23292D" />
                <path d="M43 50 Q50 47 57 50" stroke="#23292D" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                <circle cx="44" cy="40" r="1.8" fill="#1D2428" />
                <circle cx="56" cy="40" r="1.8" fill="#1D2428" />
                <path d="M40 36 Q44 34.5 47 36" stroke="#23292D" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                <path d="M53 36 Q56 34.5 60 36" stroke="#23292D" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                {/* Shemagh Crown & Black/Gold Igal */}
                <path d="M31 32 C34 19, 66 19, 69 32 C64 27, 36 27, 31 32 Z" fill="#FBFBF5" />
                <rect x="30" y="24" width="40" height="4.2" rx="2.1" fill="#111417" />
                <rect x="31" y="28.2" width="38" height="3.5" rx="1.7" fill="#1D2428" />
                <rect x="47" y="24" width="6" height="7.7" rx="1.5" fill={`url(#gold-${uid})`} />
              </g>
            )}

            {/* 2. SAUDI SPECIALIST / FINANCE CFO / TENDERS ENGINEER */}
            {(resolved === 'saudi-specialist' ||
              resolved === 'finance-cfo' ||
              resolved === 'tenders-engineer') && (
              <g>
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill={
                    resolved === 'finance-cfo'
                      ? '#1F262A'
                      : resolved === 'tenders-engineer'
                      ? '#1E293B'
                      : '#F4F1E8'
                  }
                />
                {/* Crisp White Saudi Thobe & Collar */}
                <path d="M18 96 C20 73, 33 66, 50 66 C67 66, 80 73, 82 96 Z" fill="#FFFFFF" />
                {resolved === 'finance-cfo' && (
                  <path d="M20 96 C22 75, 32 68, 39 68 L36 96 Z M80 96 C78 75, 68 68, 61 68 L64 96 Z" fill="#2A3237" />
                )}
                <line x1="50" y1="68" x2="50" y2="92" stroke="#CBD5E1" strokeWidth="1.5" />
                <circle cx="50" cy="75" r="1.5" fill={`url(#gold-${uid})`} />
                <circle cx="50" cy="82" r="1.5" fill={`url(#gold-${uid})`} />
                {/* White Ghutra Side Drapes */}
                <path d="M25 42 C24 60, 27 76, 33 88 L39 66 L61 66 L67 88 C73 76, 76 60, 75 42 C73 22, 63 17, 50 17 C37 17, 27 22, 25 42 Z" fill="#FFFFFF" />
                {/* Face & Neat Beard */}
                <ellipse cx="50" cy="43" rx="15" ry="17" fill={`url(#skin-${uid})`} />
                <path d="M37 47 C37 55, 43 59, 50 59 C57 59, 63 55, 63 47 C61 50, 56 53, 50 53 C44 53, 39 50, 37 47 Z" fill="#2A3035" />
                <path d="M44 50 Q50 47.5 56 50" stroke="#2A3035" strokeWidth="2" fill="none" strokeLinecap="round" />
                <circle cx="44" cy="40" r="1.8" fill="#1D2428" />
                <circle cx="56" cy="40" r="1.8" fill="#1D2428" />
                <path d="M40 36.5 Q44 35 47 36.5" stroke="#2A3035" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <path d="M53 36.5 Q56 35 60 36.5" stroke="#2A3035" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                {/* Ghutra Top & Black Igal */}
                <path d="M32 32 C35 20, 65 20, 68 32 C63 27, 37 27, 32 32 Z" fill="#FFFFFF" />
                <rect x="31" y="24.5" width="38" height="4" rx="2" fill="#14181B" />
                <rect x="32" y="28.5" width="36" height="3.2" rx="1.6" fill="#22282D" />
                {/* Pin Badge on Lapel */}
                <circle cx="63" cy="79" r="4" fill={`url(#gold-${uid})`} />
              </g>
            )}

            {/* 3. SAUDI FEMALE SPECIALIST (Elegant Modest Hijab + Gold Trim Abaya) */}
            {resolved === 'saudi-female-specialist' && (
              <g>
                <circle cx="50" cy="50" r="48" fill="#232B30" />
                <circle cx="50" cy="50" r="44" fill="none" stroke={`url(#gold-${uid})`} strokeWidth="1" opacity="0.5" />
                {/* Modest Executive Abaya / Blazer */}
                <path d="M18 96 C20 73, 33 66, 50 66 C67 66, 80 73, 82 96 Z" fill="#161B1E" />
                <path d="M39 67 L50 84 L61 67" fill="#FBFBF5" />
                <path d="M37 67 L50 86 L63 67" fill="none" stroke={`url(#gold-${uid})`} strokeWidth="2.4" strokeLinecap="round" />
                {/* Hijab Drape */}
                <path d="M27 44 C26 24, 37 17, 50 17 C63 17, 74 24, 73 44 C73 60, 66 71, 50 72 C34 71, 27 60, 27 44 Z" fill="#1D2428" />
                <path d="M31 42 C31 27, 39 21, 50 21 C61 21, 69 27, 69 42" fill="none" stroke={`url(#gold-${uid})`} strokeWidth="1.5" opacity="0.85" />
                {/* Face */}
                <ellipse cx="50" cy="44" rx="13.5" ry="15.5" fill="#F6D7BF" />
                {/* Eyes & Friendly Smile */}
                <circle cx="44.5" cy="42" r="1.8" fill="#1D2428" />
                <circle cx="55.5" cy="42" r="1.8" fill="#1D2428" />
                <path d="M41 38.5 Q44.5 37 47.5 38.5" stroke="#3D2B1F" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                <path d="M52.5 38.5 Q55.5 37 59 38.5" stroke="#3D2B1F" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                <path d="M46 50 Q50 53 54 50" stroke="#B56557" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                <circle cx="62" cy="79" r="3.5" fill={`url(#gold-${uid})`} />
              </g>
            )}

            {/* 4. CANDIDATE / WORKER ARCHETYPES (Maid, Nurse, Driver, Chef) */}
            {resolved.startsWith('candidate-') && (
              <g>
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill={
                    resolved === 'candidate-nurse'
                      ? '#ECFEFF'
                      : resolved === 'candidate-driver'
                      ? '#F1F5F9'
                      : '#FAF7F0'
                  }
                />
                {/* Uniform Shoulders */}
                <path
                  d="M19 96 C21 74, 34 67, 50 67 C66 67, 79 74, 81 96 Z"
                  fill={
                    resolved === 'candidate-nurse'
                      ? '#0D9488'
                      : resolved === 'candidate-driver'
                      ? '#1E293B'
                      : resolved === 'candidate-chef'
                      ? '#FFFFFF'
                      : '#8C681E'
                  }
                />
                {/* White Collar / Apron detail */}
                <path d="M40 67 L50 79 L60 67 Z" fill="#FFFFFF" />
                {/* Hair / Cap */}
                <path
                  d="M31 42 C31 24, 39 19, 50 19 C61 19, 69 24, 69 42 C69 52, 65 58, 50 58 C35 58, 31 52, 31 42 Z"
                  fill="#27272A"
                />
                {resolved === 'candidate-driver' && (
                  <path d="M31 31 C35 21, 65 21, 69 31 Z" fill="#1E293B" />
                )}
                {/* Face */}
                <ellipse cx="50" cy="44" rx="13.5" ry="15" fill={`url(#skin-${uid})`} />
                <circle cx="44.5" cy="42" r="1.7" fill="#1D2428" />
                <circle cx="55.5" cy="42" r="1.7" fill="#1D2428" />
                <path d="M46 50 Q50 53 54 50" stroke="#9A4E40" strokeWidth="1.7" fill="none" strokeLinecap="round" />
              </g>
            )}

            {/* 5. CLIENT VIP / B2B ARCHETYPES */}
            {(resolved === 'client-vip' || resolved === 'client-b2b') && (
              <g>
                <circle cx="50" cy="50" r="48" fill="#1D2428" />
                {resolved === 'client-b2b' ? (
                  <>
                    {/* Isometric Corporate Tower Emblem */}
                    <rect x="33" y="26" width="22" height="50" rx="3" fill={`url(#gold-${uid})`} />
                    <rect x="51" y="38" width="17" height="38" rx="2" fill="#FBFBF5" />
                    <rect x="38" y="33" width="4" height="4" rx="1" fill="#1D2428" />
                    <rect x="45" y="33" width="4" height="4" rx="1" fill="#1D2428" />
                    <rect x="38" y="41" width="4" height="4" rx="1" fill="#1D2428" />
                    <rect x="45" y="41" width="4" height="4" rx="1" fill="#1D2428" />
                    <rect x="38" y="49" width="4" height="4" rx="1" fill="#1D2428" />
                    <rect x="45" y="49" width="4" height="4" rx="1" fill="#1D2428" />
                  </>
                ) : (
                  <>
                    {/* VIP Saudi Client */}
                    <path d="M19 96 C21 74, 34 67, 50 67 C66 67, 79 74, 81 96 Z" fill={`url(#gold-${uid})`} />
                    <path d="M27 42 C26 60, 29 74, 35 86 L40 67 L60 67 L65 86 C71 74, 74 60, 73 42 C71 23, 62 18, 50 18 C38 18, 29 23, 27 42 Z" fill="#FFFFFF" />
                    <ellipse cx="50" cy="44" rx="14" ry="16" fill={`url(#skin-${uid})`} />
                    <circle cx="44.5" cy="41" r="1.7" fill="#1D2428" />
                    <circle cx="55.5" cy="41" r="1.7" fill="#1D2428" />
                    <path d="M44 50 Q50 53 56 50" stroke="#23292D" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    <rect x="32" y="25" width="36" height="4" rx="2" fill="#14181B" />
                  </>
                )}
              </g>
            )}
          </svg>
        )}
      </div>

      {/* Status Dot / Verified Checkmark */}
      {status !== 'none' && (
        <span
          className="absolute -bottom-0.5 -left-0.5 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
          style={{
            width: Math.max(12, Math.round(px * 0.28)),
            height: Math.max(12, Math.round(px * 0.28)),
            backgroundColor:
              status === 'online' || status === 'verified' || status === 'listening'
                ? '#10B981'
                : status === 'speaking'
                ? '#B8924A'
                : '#F59E0B',
          }}
        >
          {status === 'verified' && (
            <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-white fill-current">
              <path d="M10.28 2.28L4.5 8.06 1.72 5.28a.75.75 0 00-1.06 1.06l3.31 3.31a.75.75 0 001.06 0l6.31-6.31a.75.75 0 00-1.06-1.06z" />
            </svg>
          )}
        </span>
      )}

      {/* Optional mini pill badge */}
      {badgeText && (
        <span
          className="absolute -bottom-1 right-0 px-1.5 py-0.2 rounded-full text-[9px] font-black tracking-tight shadow-sm border"
          style={{
            backgroundColor: '#1D2428',
            color: '#DFC07A',
            borderColor: '#B8924A',
            lineHeight: 1.2,
          }}
        >
          {badgeText}
        </span>
      )}
    </div>
  );
};

export default CorporateAvatar;
