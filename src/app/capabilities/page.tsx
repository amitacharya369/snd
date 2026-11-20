import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { CAPABILITIES } from '../../data/capabilities';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { ContactCta } from '../../components/ContactCta';
import { DynamicIcon } from '../../components/Icons';
import { ArrowRight, CheckCircle2, ShieldCheck, Wrench, FileCheck, HardHat } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Capabilities & Specialized Fabrication Disciplines',
  description: 'Explore S+D’s comprehensive architectural signage, custom metalwork, architectural glass, illuminated systems, and union installation services in New York City.',
  alternates: {
    canonical: 'https://www.signsanddecal.com/capabilities',
  },
  openGraph: {
    title: 'Fabrication & Engineering Capabilities | Signs & Decal Corp.',
    description: 'Comprehensive single-source architectural fabrication, engineering coordination, and union installation.',
    images: ['/images/projects/laguardia.png'],
  },
};

export default function CapabilitiesPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-white border-b-2 border-slate-300 py-16 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 architectural-grid opacity-75 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto space-y-6">
          <Breadcrumbs items={[{ label: 'Capabilities' }]} />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-500/50 text-amber-950 text-xs sm:text-sm font-bold uppercase tracking-wider">
            <Wrench className="w-4 h-4 text-amber-700" />
            <span>Specialized Fabrication Services</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-[#0f2b48] tracking-tight uppercase max-w-4xl font-heading">
            Single-Source Architectural Signage, Metal &amp; Glass Capabilities
          </h1>

          <p className="text-lg sm:text-xl text-slate-700 max-w-3xl leading-relaxed font-normal">
            Signs &amp; Decal Corp. combines master craftsmanship with advanced multi-trade manufacturing technology. Explore our 9 specialized disciplines engineered to satisfy stringent architectural specifications and construction deadlines.
          </p>
        </div>
      </section>

      {/* Capabilities Index Grid */}
      <section className="py-20 bg-slate-50 px-4 sm:px-8 border-b-2 border-slate-300">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.id}
                className="group p-8 bg-white border-2 border-slate-200 rounded-sm hover:border-amber-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded bg-slate-50 border-2 border-slate-200 flex items-center justify-center text-amber-600 group-hover:border-amber-500 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shadow-xs">
                      <DynamicIcon name={cap.iconName} className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-heading">
                      {cap.shortTitle}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-[#0f2b48] group-hover:text-amber-700 transition-colors font-heading uppercase">
                    <Link href={`/capabilities/${cap.slug}`} className="focus:outline-none">
                      {cap.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {cap.overview}
                  </p>

                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <span className="text-xs uppercase font-bold text-[#0f2b48] tracking-wider">
                      Key Deliverables:
                    </span>
                    <ul className="space-y-2 text-sm text-slate-700 font-medium">
                      {cap.deliverables.slice(0, 3).map((d) => (
                        <li key={d} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    {cap.materialsAndFinishes.length} Materials Specified
                  </span>
                  <Link
                    href={`/capabilities/${cap.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-700 hover:text-amber-900 uppercase tracking-wider group/link font-condensed"
                  >
                    <span>View Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-Trade Coordination Callout */}
      <section className="py-16 bg-white border-b-2 border-slate-300 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-700">
              <HardHat className="w-4 h-4" />
              <span>Division 10 &amp; Division 05 Integration</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2b48] tracking-tight uppercase font-heading">
              Need Multi-Trade Engineering Submittals?
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              When architectural signage must integrate with heavy structural steel supports, curtainwall glazing, or complex electrical junctions, our in-house engineering department coordinates shop drawings and calculations to eliminate jobsite conflicts.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm uppercase tracking-wider font-condensed rounded-sm transition-all shadow-md"
            >
              <FileCheck className="w-4 h-4" />
              <span>Submit Plans for Review</span>
            </Link>

            <Link
              href="/quality-delivery"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-[#0f2b48] font-bold text-sm uppercase tracking-wider font-condensed rounded-sm border-2 border-slate-300 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>View Quality Assurance Process</span>
            </Link>
          </div>
        </div>
      </section>

      <ContactCta />
    </div>
  );
}
