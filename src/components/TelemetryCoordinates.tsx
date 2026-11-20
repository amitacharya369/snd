'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Compass, Crosshair } from 'lucide-react';

export function TelemetryCoordinates() {
  const [coords, setCoords] = useState({
    lat: '40°43\'03.4"N',
    lon: '73°56\'07.8"W',
    cadX: '1,420.0',
    cadY: '890.0',
    elev: '+14.2\'',
  });

  const mouseRef = useRef({ normX: 0, normY: 0 });

  useEffect(() => {
    let ticking = false;

    const updateTelemetry = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const { normX, normY } = mouseRef.current;

      // Brooklyn Plant base coordinate: 40.717611° N, 73.935500° W
      const baseLat = 40.717611;
      const baseLon = 73.935500;

      // Micro variations based on mouse position
      const currentLat = baseLat - normY * 0.0024;
      const currentLon = baseLon + normX * 0.0032;

      // Convert to DMS (Degrees Minutes Seconds)
      const latDeg = Math.floor(currentLat);
      const latMinFloat = (currentLat - latDeg) * 60;
      const latMin = Math.floor(latMinFloat);
      const latSec = ((latMinFloat - latMin) * 60).toFixed(2);

      const lonDeg = Math.floor(currentLon);
      const lonMinFloat = (currentLon - lonDeg) * 60;
      const lonMin = Math.floor(lonMinFloat);
      const lonSec = ((lonMinFloat - lonMin) * 60).toFixed(2);

      // Real-time CAD drawing coordinates in millimeters
      const cadX = (1420 + normX * 850).toFixed(1);
      // CAD Y reflects both mouse Y and vertical scroll position
      const cadY = (890 + scrollY * 0.65 - normY * 350).toFixed(1);

      // Elevation dynamically changes on scroll (even when mouse is still!)
      // Baseline 14.2' at plant ground, increasing as you scroll down the construction project
      const scrollElev = (14.2 + (scrollY * 0.09) - normY * 1.8).toFixed(1);

      setCoords({
        lat: `${latDeg}°${String(latMin).padStart(2, '0')}'${String(latSec).padStart(5, '0')}"N`,
        lon: `${lonDeg}°${String(lonMin).padStart(2, '0')}'${String(lonSec).padStart(5, '0')}"W`,
        cadX,
        cadY,
        elev: `+${scrollElev}'`,
      });

      ticking = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth || 1920;
      const h = window.innerHeight || 1080;
      mouseRef.current = {
        normX: e.clientX / w - 0.5,
        normY: e.clientY / h - 0.5,
      };

      if (!ticking) {
        window.requestAnimationFrame(updateTelemetry);
        ticking = true;
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateTelemetry);
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial calculation
    updateTelemetry();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <aside
      aria-label="Real-time Geographic and CAD Coordinates"
      className="fixed bottom-3 right-3 sm:right-4 z-40 pointer-events-auto select-none"
    >
      <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-sm bg-[#0f2b48]/90 hover:bg-[#0f2b48] backdrop-blur-md border border-slate-600/70 text-slate-200 shadow-xl transition-all duration-150">
        {/* Pulsing Drafting Sensor Indicator */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
        </span>

        {/* Telemetry Readout */}
        <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono font-medium tracking-tight">
          <span className="text-amber-400 font-bold hidden sm:inline flex items-center gap-1">
            <Compass className="w-3 h-3 text-amber-400" />
            <span>DATUM:</span>
          </span>

          <span className="text-white font-semibold">
            {coords.lat}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-white font-semibold">
            {coords.lon}
          </span>

          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline text-amber-300">
            CAD: ({coords.cadX}mm, {coords.cadY}mm)
          </span>

          <span className="text-slate-500">•</span>
          {/* Elevation number: dynamically changes as user scrolls or moves mouse */}
          <span className="text-amber-400 font-bold bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/40 font-mono">
            ELEV: {coords.elev}
          </span>
        </div>

        <Crosshair className="w-3.5 h-3.5 text-amber-400/80 shrink-0 hidden sm:block" />
      </div>
    </aside>
  );
}
