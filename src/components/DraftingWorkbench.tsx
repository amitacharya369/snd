'use client';

import React, { useState, useEffect } from 'react';

export function DraftingWorkbench() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset || 0;
          // Progress from 0 to 1 over first 650px of scroll
          const progress = Math.min(Math.max(scrollY / 650, 0), 1);
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initialize
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compass geometry: Inverted "V" stance at scroll 0, rotates CLOCKWISE as user scrolls
  const originX = 110; // Needle anchor point X
  const originY = 175; // Needle anchor point Y
  const radius = 80;   // Distance between needle and pencil feet (span)

  // Starting angle: 0° (both feet resting on horizontal baseline, apex straight up)
  // Sweeps CLOCKWISE from 0° up to +68° as user scrolls
  const maxSweepDeg = 68;
  const currentAngleDeg = scrollProgress * maxSweepDeg;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  // Starting point (foot of inverted "V" at scroll 0)
  const startX = originX + radius;
  const startY = originY;

  // Dynamic pencil position as compass rotates clockwise
  const currentRad = toRad(currentAngleDeg);
  const pencilX = originX + radius * Math.cos(currentRad);
  const pencilY = originY + radius * Math.sin(currentRad);

  // Dynamic arc path (sweeps clockwise: sweep-flag = 1)
  const arcPathD =
    scrollProgress > 0.015
      ? `M ${startX.toFixed(1)} ${startY.toFixed(1)} A ${radius} ${radius} 0 0 1 ${pencilX.toFixed(1)} ${pencilY.toFixed(1)}`
      : '';


  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {/* 1. High-Visibility Architectural Blueprint Grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-70"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Minor Grid: 20px x 20px */}
          <pattern id="minorGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0f2b48" strokeWidth="0.6" strokeOpacity="0.14" />
          </pattern>
          {/* Major Grid: 100px x 100px with crosshairs */}
          <pattern id="majorGrid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#minorGrid)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#0f2b48" strokeWidth="1.2" strokeOpacity="0.28" />
            {/* Center crosshairs */}
            <path d="M 46 50 L 54 50 M 50 46 L 50 54" stroke="#d97706" strokeWidth="1.2" strokeOpacity="0.55" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#majorGrid)" />
      </svg>

      {/* 2. Architectural Blueprint Coordinates & Telemetry Stamp */}
      <div className="hidden md:flex items-center justify-between absolute top-3 left-6 right-6 font-mono text-[11px] font-semibold text-[#0f2b48]/60 tracking-wider">
        <div>
          BROOKLYN PLANT DATUM: 40°43&apos;03.4&quot;N 73°56&apos;07.8&quot;W • SPEC: CSI DIV 10 14 00 / DIV 05 50 00
        </div>
        <div className="flex items-center gap-3">
          <span className="text-amber-700 font-bold">
            SCALE: 1/4&quot; = 1&apos;-0&quot;
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-[#0f2b48]">
            SWEEP: {(Math.abs(currentAngleDeg)).toFixed(1)}°
          </span>
        </div>
      </div>

      {/* 3. DRAFTING INSTRUMENT: Triangular Architect's Scale Ruler (Bottom Edge, Full Width & Centered) */}
      <div className="hidden lg:block absolute bottom-0 left-8 right-8 h-14 translate-y-2 opacity-95 drop-shadow-md">
        <svg viewBox="0 0 1100 48" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ruler Body */}
          <rect x="10" y="8" width="1080" height="34" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* Center Color-coded Identification Groove (Safety Red/Amber stripe) */}
          <rect x="10" y="23" width="1080" height="4" fill="#d97706" />

          {/* Top Scale Label */}
          <text x="30" y="19" fill="#0f2b48" fontSize="9" fontWeight="bold" fontFamily="monospace">
            ARCHITECT&apos;S SCALE • 1/4&quot; = 1&apos;-0&quot;
          </text>
          <text x="940" y="19" fill="#0f2b48" fontSize="9" fontWeight="bold" fontFamily="monospace">
            SIGNS &amp; DECAL CORP. BROOKLYN
          </text>

          {/* Scale Tick Marks along top edge */}
          {Array.from({ length: 54 }).map((_, i) => {
            const x = 160 + i * 15;
            const isMajor = i % 4 === 0;
            const height = isMajor ? 10 : i % 2 === 0 ? 6 : 4;
            return (
              <g key={i}>
                <line x1={x} y1="8" x2={x} y2={8 + height} stroke="#0f2b48" strokeWidth={isMajor ? '1.2' : '0.7'} />
                {isMajor && (
                  <text x={x} y="22" fill="#0f2b48" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    {i / 4}&apos;
                  </text>
                )}
              </g>
            );
          })}

          {/* Metric / Engineering Ticks along bottom edge */}
          {Array.from({ length: 70 }).map((_, i) => {
            const x = 30 + i * 14.5;
            const isMajor = i % 5 === 0;
            const height = isMajor ? 8 : 4;
            return (
              <line key={i} x1={x} y1={42 - height} x2={x} y2="42" stroke="#64748b" strokeWidth={isMajor ? '1' : '0.6'} />
            );
          })}
        </svg>
      </div>

      {/* 4. DRAFTING INSTRUMENT: German Bow Compass (Inverted "V" Stance, Rotates CLOCKWISE on Scroll) */}
      <div className="block absolute bottom-6 sm:bottom-8 md:bottom-10 right-2 sm:right-6 md:right-10 w-72 h-72 sm:w-80 sm:h-80 md:w-88 md:h-88 z-20 drop-shadow-2xl">
        <svg viewBox="0 0 310 270" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Faint reference guide circle */}
          <circle cx={originX} cy={originY} r={radius} stroke="#0284c7" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />

          {/* Dynamic Arc drawn CLOCKWISE on scroll */}
          {arcPathD && (
            <path
              d={arcPathD}
              stroke="#d97706"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-all duration-75"
            />
          )}

          {/* Dimension Radius Line connecting needle center to moving pencil lead */}
          {scrollProgress > 0.02 && (
            <>
              <line
                x1={originX}
                y1={originY}
                x2={pencilX}
                y2={pencilY}
                stroke="#0f2b48"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.6"
              />
              <text
                x={originX + (radius * 0.52) * Math.cos(currentRad)}
                y={originY + (radius * 0.52) * Math.sin(currentRad)}
                fill="#0f2b48"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
                textAnchor="middle"
                className="select-none"
              >
                R = 8&apos;-0&quot;
              </text>
            </>
          )}

          {/* Needle Anchor Point (Center) */}
          <circle cx={originX} cy={originY} r="4.5" fill="#d97706" stroke="#0f2b48" strokeWidth="1.5" />
          <circle cx={originX} cy={originY} r="1.5" fill="#ffffff" />
          <line x1={originX - 7} y1={originY} x2={originX + 7} y2={originY} stroke="#0f2b48" strokeWidth="1" />
          <line x1={originX} y1={originY - 7} x2={originX} y2={originY + 7} stroke="#0f2b48" strokeWidth="1" />

          {/* Active Pencil Lead Contact Dot */}
          <circle cx={pencilX} cy={pencilY} r="4" fill="#d97706" className="drop-shadow-sm" />
          <circle cx={pencilX} cy={pencilY} r="1.8" fill="#1e293b" />

          {/* Compass Assembly — Perfectly symmetrical inverted "V" at 0°, rotates CLOCKWISE around needle point */}
          <g
            transform={`translate(${originX}, ${originY}) rotate(${currentAngleDeg})`}
            className="transition-transform duration-75 ease-out"
          >
            {/* Top Swivel Knurled Handle (Sits along vertical axis x = 40) */}
            <rect x="36" y="-152" width="8" height="20" rx="2" fill="#475569" stroke="#1e293b" strokeWidth="1.2" />
            <circle cx="40" cy="-154" r="3.5" fill="#cbd5e1" stroke="#334155" strokeWidth="1" />
            <line x1="40" y1="-120" x2="40" y2="-132" stroke="#64748b" strokeWidth="3.5" />

            {/* Main Circular Hinge Disc centered at (40, -120) */}
            <circle cx="40" cy="-120" r="13" fill="#e2e8f0" stroke="#334155" strokeWidth="2" />
            <circle cx="40" cy="-120" r="5.5" fill="#d97706" />

            {/* Micro-Adjustment Spindle & Brass Thumbwheel at y = -66 */}
            <line x1="14" y1="-66" x2="66" y2="-66" stroke="#cbd5e1" strokeWidth="2.2" />
            <rect x="34" y="-74" width="12" height="16" rx="2" fill="#d97706" stroke="#92400e" strokeWidth="1.2" />
            <line x1="38" y1="-74" x2="38" y2="-58" stroke="#78350f" strokeWidth="1" />
            <line x1="42" y1="-74" x2="42" y2="-58" stroke="#78350f" strokeWidth="1" />

            {/* Left Leg: Fixed Needle Leg reaching from (36, -110) down to (0, 0) */}
            <line x1="36" y1="-110" x2="12" y2="-28" stroke="#94a3b8" strokeWidth="5.5" strokeLinecap="round" />
            <line x1="36" y1="-110" x2="12" y2="-28" stroke="#334155" strokeWidth="1.2" />
            <line x1="12" y1="-28" x2="2.5" y2="-5" stroke="#64748b" strokeWidth="3.5" />
            <line x1="2.5" y1="-5" x2="0" y2="0" stroke="#0f2b48" strokeWidth="2.2" />

            {/* Right Leg: Lead Holder Leg reaching from (44, -110) down to (80, 0) */}
            <line x1="44" y1="-110" x2="68" y2="-28" stroke="#94a3b8" strokeWidth="5.5" strokeLinecap="round" />
            <line x1="44" y1="-110" x2="68" y2="-28" stroke="#334155" strokeWidth="1.2" />
            <line x1="68" y1="-28" x2="77.5" y2="-7" stroke="#64748b" strokeWidth="4" />
            <rect x="73" y="-11" width="10" height="8" rx="1.5" fill="#d97706" stroke="#92400e" strokeWidth="1" />
            <polygon points="78.5,-3 81.5,-3 80,0" fill="#0f172a" />
          </g>
        </svg>
      </div>

      {/* 5. DRAFTING INSTRUMENT: Acrylic 180° Semicircular Protractor (Left Side) */}
      <div className="hidden lg:block absolute top-14 -left-10 w-64 h-64 opacity-75 drop-shadow-md">
        <svg viewBox="0 0 240 240" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Transparent Acrylic Body */}
          <path
            d="M 20 180 A 100 100 0 0 1 220 180 Z"
            fill="rgba(240, 249, 255, 0.8)"
            stroke="#0284c7"
            strokeWidth="1.5"
          />
          {/* Inner Cutout */}
          <path
            d="M 60 180 A 60 60 0 0 1 180 180 Z"
            fill="none"
            stroke="#0284c7"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          {/* Origin Crosshair (120, 180) */}
          <circle cx="120" cy="180" r="3" fill="#d97706" />
          <line x1="110" y1="180" x2="130" y2="180" stroke="#0f2b48" strokeWidth="1" />
          <line x1="120" y1="170" x2="120" y2="185" stroke="#0f2b48" strokeWidth="1" />

          {/* Radial Degree Marks (0° to 180°) */}
          {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = 120 - 95 * Math.cos(rad);
            const y1 = 180 - 95 * Math.sin(rad);
            const x2 = 120 - 82 * Math.cos(rad);
            const y2 = 180 - 82 * Math.sin(rad);
            const textX = 120 - 72 * Math.cos(rad);
            const textY = 180 - 72 * Math.sin(rad);

            return (
              <g key={deg}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0f2b48" strokeWidth={deg % 45 === 0 ? '1.5' : '1'} />
                {deg % 30 === 0 && (
                  <text
                    x={textX}
                    y={textY}
                    fill="#0f2b48"
                    fontSize="7"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily="monospace"
                  >
                    {deg}°
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* 6. DRAFTING INSTRUMENT: 30°/60°/90° Acrylic Drafting Triangle */}
      <div className="hidden 2xl:block absolute top-1/3 right-1/4 w-48 h-48 opacity-45">
        <svg viewBox="0 0 160 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon
            points="10,150 150,150 10,20"
            fill="rgba(254, 243, 199, 0.45)"
            stroke="#d97706"
            strokeWidth="1.5"
          />
          <polygon
            points="35,130 115,130 35,60"
            fill="none"
            stroke="#b45309"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          {Array.from({ length: 13 }).map((_, i) => (
            <line
              key={i}
              x1="10"
              y1={20 + i * 10}
              x2={i % 5 === 0 ? '22' : '16'}
              y2={20 + i * 10}
              stroke="#0f2b48"
              strokeWidth="0.8"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
