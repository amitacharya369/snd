import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { INDUSTRIES } from '../../data/industries';
import { PROJECTS } from '../../data/projects';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { ProjectCard } from '../../components/ProjectCard';
import { ContactCta } from '../../components/ContactCta';
import { DynamicIcon } from '../../components/Icons';
import { ArrowRight, ShieldCheck, CheckCircle2, Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Industries & Market Sectors Served',
  description: 'Specialized architectural signage and fabrication solutions engineered for airports, rail transit, commercial high-rise towers, stadiums, and institutional facilities.',
  alternates: {
    canonical: 'https://www.signsanddecal.com/industries',
  },
  openGraph: {
    title: 'Industries & Market Sectors | Signs & Decal Corp.',
    description: 'Specialized architectural fabrication for transit agencies, airports, commercial towers, and civil infrastructure.',
    images: ['/images/projects/laguardia.png'],
  },
};

export default function IndustriesPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-white border-b-2 border-slate-300 py-16 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 architectural-grid opacity-75 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto space-y-6">
          <Breadcrumbs items={[{ label: 'Industries' }]} />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-500/50 text-amber-950 text-xs sm:text-sm font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-amber-700" />
            <span>Specialized Market Sectors</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-[#0f2b48] tracking-tight uppercase max-w-4xl font-heading">
            Sectors &amp; Environments Engineered for High Performance
          </h1>

          <p className="text-lg sm:text-xl text-slate-700 max-w-3xl leading-relaxed font-normal">
            Signs &amp; Decal Corp. organizes its estimating, fabrication, and union field logistics to satisfy the rigorous security requirements, code standards, and operational constraints of each built sector.
          </p>
        </div>
      </section>

      {/* Industries Detailed List */}
      <section className="py-20 bg-slate-50 px-4 sm:px-8 border-b-2 border-slate-300">
        <div className="max-w-7xl mx-auto space-y-16">
          {INDUSTRIES.map((ind, idx) => {
            const featuredProjects = PROJECTS.filter((p) => ind.featuredProjects.includes(p.slug));

            return (
              <div
                key={ind.id}
                id={ind.id}
                className="scroll-mt-28 p-8 sm:p-12 bg-white border-2 border-slate-300 rounded-sm space-y-10 shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b-2 border-slate-200 pb-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3.5 rounded bg-slate-100 border-2 border-slate-300 text-amber-700 shrink-0 mt-1 shadow-xs">
                      <DynamicIcon name={ind.iconName} className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-700 font-condensed">
                        Sector Focus {String(idx + 1).padStart(2, '0')}
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2b48] tracking-tight font-heading uppercase">
                        {ind.title}
                      </h2>
                      <p className="text-sm sm:text-base font-semibold text-slate-500">
                        {ind.tagline}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm uppercase tracking-wider font-condensed rounded-sm shrink-0 transition-all border border-amber-600 shadow"
                  >
                    <span>Discuss {ind.shortTitle} Scope</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-[#0f2b48] uppercase tracking-wider font-heading">
                      Sector Overview &amp; Construction Demands
                    </h3>
                    <p className="text-base text-slate-700 leading-relaxed font-normal">
                      {ind.description}
                    </p>

                    <div className="pt-4 border-t border-slate-200 space-y-3">
                      <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
                        Applicable Code Compliance &amp; Standards:
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700 font-medium">
                        {ind.complianceStandards.map((std) => (
                          <li key={std} className="flex items-start gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{std}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-sm space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-[#0f2b48] border-b border-slate-200 pb-2 font-heading">
                      Key Agencies &amp; Client Partners:
                    </h4>
                    <ul className="space-y-2.5 text-sm text-slate-700">
                      {ind.keyClients.map((client) => (
                        <li key={client} className="flex items-start gap-2 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span>{client}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Featured Projects for this Industry */}
                {featuredProjects.length > 0 && (
                  <div className="pt-6 border-t-2 border-slate-200 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#0f2b48] font-heading">
                        Featured Case Studies in {ind.shortTitle}:
                      </h3>
                      <Link
                        href={`/projects`}
                        className="text-sm text-amber-700 hover:text-amber-900 inline-flex items-center gap-1 font-bold uppercase tracking-wider font-condensed"
                      >
                        <span>View in Portfolio</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {featuredProjects.map((p) => (
                        <ProjectCard key={p.slug} project={p} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <ContactCta />
    </div>
  );
}
