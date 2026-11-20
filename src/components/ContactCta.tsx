import React from 'react';
import Link from 'next/link';
import { ArrowRight, Phone, FileText, HardHat } from 'lucide-react';
import { COMPANY } from '../data/company';

interface ContactCtaProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function ContactCta({
  title = 'Ready to Discuss Your Project Specifications?',
  subtitle = 'Whether you require comprehensive airport wayfinding, heavy transit architectural metal, or fast-track preconstruction estimates, our engineering and estimating teams are ready to collaborate.',
  className = '',
}: ContactCtaProps) {
  return (
    <section className={`relative overflow-hidden bg-white border-y-2 border-slate-300 py-16 px-4 sm:px-8 ${className}`}>
      {/* Background Blueprint Grid Pattern */}
      <div className="absolute inset-0 architectural-grid opacity-75 pointer-events-none" />
      <div className="absolute left-0 top-0 bottom-0 w-2 construction-stripe hidden sm:block" />

      <div className="relative max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-500/50 text-amber-950 text-xs sm:text-sm font-bold uppercase tracking-wider">
          <HardHat className="w-4 h-4 text-amber-700" />
          <span>Direct General Contractor &amp; Architect Collaboration</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold text-[#0f2b48] tracking-tight max-w-3xl mx-auto font-heading uppercase">
          {title}
        </h2>

        <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed font-normal">
          {subtitle}
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="relative group inline-flex items-center justify-center gap-3 px-9 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 bg-[length:200%_auto] hover:bg-right text-slate-950 font-sans font-extrabold text-sm sm:text-base tracking-wider uppercase rounded-sm transition-all duration-300 shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/50 hover:-translate-y-0.5 active:translate-y-0 border-2 border-amber-300"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-950" />
            </span>
            <span className="drop-shadow-xs">Request a Quote / Project Bid</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>

          <a
            href={`tel:${COMPANY.headquarters.phoneRaw}`}
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#0f2b48] hover:bg-slate-800 text-white font-sans font-bold text-sm sm:text-base uppercase tracking-wider rounded-sm transition-all shadow-md hover:shadow-lg border border-slate-700"
          >
            <Phone className="w-4 h-4 text-amber-400" />
            <span>Call Estimating: {COMPANY.headquarters.phone}</span>
          </a>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-700 border-t border-slate-200 max-w-xl mx-auto font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            Active Bidding &amp; Estimating
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            Certified NYC &amp; PANYNJ MBE
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
            100% Union Field Installation
          </span>
        </div>
      </div>
    </section>
  );
}
