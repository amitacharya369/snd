import React from 'react';

interface LogoProps {
  className?: string;
  theme?: 'dark' | 'light';
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({
  className = '',
  theme = 'light',
  showSubtitle = true,
  size = 'md',
}: LogoProps) {
  // Original S+D Monogram SVG
  const isDark = theme === 'dark';
  const primaryColor = isDark ? '#ffffff' : '#0f2b48'; // Blueprint Navy on light, white on dark
  const plusColor = '#e11d48'; // Vibrant Signage Red (+)

  const sizeDimensions = {
    sm: { width: 44, height: 32 },
    md: { width: 56, height: 40 },
    lg: { width: 70, height: 50 },
  }[size];

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* Authentic S+D Interlocking Monogram Symbol */}
      <div className="shrink-0 relative flex items-center justify-center">
        <svg
          width={sizeDimensions.width}
          height={sizeDimensions.height}
          viewBox="0 0 70 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-xs transition-transform duration-200 group-hover:scale-105"
          aria-hidden="true"
        >
          {/* S & D Letters Body */}
          <path
            d="M69.9751 23.1974C69.0334 8.62137 64.2379 0.609185 48.7038 0.609185H33.494V29.7551C33.3443 29.3325 33.1822 28.916 33.0013 28.512C31.118 24.3536 27.7069 22.0848 19.7746 19.1758C16.8 17.8581 13.2766 17.1432 12.4472 14.3461C10.9568 9.51645 14.8356 4.99755 31.7853 9.23673V1.81505C20.2735 -1.53527 7.1029 -0.820453 2.58797 8.90108C1.45924 11.3252 1.09755 16.646 3.52339 20.8665C5.3755 24.0987 8.92383 26.7467 14.8731 28.8849C20.2735 31.3526 23.0049 32.1171 22.8615 37.1209C22.7617 40.5769 20.4356 42.4478 14.4864 42.4478C10.0214 42.4478 4.62717 41.9008 0 39.4829V47.7748C3.61069 49.136 9.03608 50.1679 14.5987 49.9752C22.3127 49.7017 25.0566 48.8625 29.2535 46.1276C31.2178 44.8533 32.6521 42.7586 33.494 40.3158V49.1485H52.3394C61.8183 48.875 70.58 44.2628 69.9688 23.1912M40.1978 35.8591H35.3648V40.6763H33.5189V35.8591H28.6922V34.0192H33.5189V29.2019H35.3648V34.0192H40.1978V35.8591ZM55.9189 39.4269C52.5577 42.3981 51.6722 42.0624 44.457 41.9568V7.90655C51.6722 7.79467 52.9443 8.18626 55.8067 11.7479C58.563 15.5396 58.7813 20.2076 58.8374 24.8757C58.8748 28.2385 58.8374 36.8474 55.9189 39.4269Z"
            fill={primaryColor}
          />
          {/* Authentic Center Plus Sign (+) */}
          <path
            d="M40.1978 35.8591H35.3648V40.6763H33.5189V35.8591H28.6922V34.0192H33.5189V29.2019H35.3648V34.0192H40.1978V35.8591Z"
            fill={plusColor}
          />
        </svg>
      </div>

      {/* Brand Name & Typography */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`font-bold tracking-tight uppercase font-condensed leading-none ${
              size === 'sm' ? 'text-lg sm:text-xl' : size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
            } ${isDark ? 'text-white' : 'text-[#0f2b48]'}`}
          >
            Signs &amp; Decal
          </span>
          <span
            className={`font-semibold text-xs uppercase tracking-widest ${
              isDark ? 'text-amber-400' : 'text-amber-600'
            }`}
          >
            Corp.
          </span>
        </div>

        {showSubtitle && (
          <span
            className={`text-[12px] font-semibold tracking-wider uppercase mt-0.5 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Architectural Signage &amp; Fabrication • Est. 1971
          </span>
        )}
      </div>
    </div>
  );
}
