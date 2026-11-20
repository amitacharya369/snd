import React from 'react';
import { Metadata } from 'next';
import { PROJECTS } from '../../data/projects';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { ContactCta } from '../../components/ContactCta';
import { ProjectFilterClient } from './ProjectFilterClient';
import { HardHat } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Project Portfolio & Landmark Installations',
  description: 'Explore verified architectural signage and metalwork project case studies from LaGuardia Airport and One World Trade Center to Citi Field and the NYC Subway.',
  alternates: {
    canonical: 'https://www.signsanddecal.com/projects',
  },
  openGraph: {
    title: 'Project Portfolio & Landmark Installations | Signs & Decal Corp.',
    description: 'Explore verified architectural signage and metalwork case studies across New York City and nationwide infrastructure.',
    images: ['/images/projects/laguardia.png'],
  },
};

export default function ProjectsPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-white border-b-2 border-slate-300 py-16 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 architectural-grid opacity-75 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto space-y-6">
          <Breadcrumbs items={[{ label: 'Projects' }]} />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-500/50 text-amber-950 text-xs sm:text-sm font-bold uppercase tracking-wider">
            <HardHat className="w-4 h-4 text-amber-700" />
            <span>Verified Portfolio Case Studies</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-[#0f2b48] tracking-tight uppercase max-w-4xl font-heading">
            Selected Landmark Projects &amp; Architectural Installations
          </h1>

          <p className="text-lg sm:text-xl text-slate-700 max-w-3xl leading-relaxed font-normal">
            A comprehensive look at our verified architectural fabrication, wayfinding systems, and specialty metals delivered for premier general contractors, public transit authorities, and institutional clients.
          </p>
        </div>
      </section>

      {/* Filterable Portfolio Section */}
      <section className="py-16 bg-slate-50 px-4 sm:px-8 border-b-2 border-slate-300">
        <div className="max-w-7xl mx-auto">
          <ProjectFilterClient initialProjects={PROJECTS} />
        </div>
      </section>

      <ContactCta />
    </div>
  );
}
