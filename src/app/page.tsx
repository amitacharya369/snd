import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { COMPANY } from '../data/company';
import { PROJECTS } from '../data/projects';
import { CAPABILITIES } from '../data/capabilities';
import { INDUSTRIES } from '../data/industries';
import { ProjectCard } from '../components/ProjectCard';
import { ContactCta } from '../components/ContactCta';
import { DynamicIcon } from '../components/Icons';
import { DraftingWorkbench } from '../components/DraftingWorkbench';
import { PREMIER_PARTNERS } from '../components/TrustLogos';
import { getSiteConfig } from '../lib/storage';
import {
  ArrowRight,
  ShieldCheck,
  Building2,
  CheckCircle2,
  FileText,
  HardHat,
  Wrench,
} from 'lucide-react';

export default function HomePage() {
  const featuredProjects = PROJECTS.slice(0, 6);
  const config = getSiteConfig();

  return (
    <div className="flex flex-col">
      {/* 1. BRIGHT ARCHITECTURAL & CONSTRUCTION HERO SECTION WITH DRAFTING WORKBENCH */}
      <section className="relative overflow-hidden bg-white border-b-2 border-slate-300 py-16 lg:py-24 px-4 sm:px-8 scope-cursor">
        {/* Architectural Drafting Instruments & Visible Grid Background */}
        <DraftingWorkbench />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Architectural Drafting Typography */}
          <div className="lg:col-span-7 space-y-6">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-500/50 text-amber-950 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-xs">
              <HardHat className="w-4 h-4 text-amber-700" />
              <span>{config.hero.badgeText}</span>
            </div>

            {/* Main Headline (Dark Blue Blueprint Navy, Architectural Semi-Bold Stroke) */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#0f2b48] leading-[0.98] uppercase font-heading">
              {config.hero.headline}
            </h1>

            {/* Concise Supporting Copy */}
            <p className="text-lg sm:text-xl text-slate-700 max-w-2xl leading-relaxed font-normal">
              {config.hero.subheadline}
            </p>

            {/* Action CTAs with Seductive High-Emphasis Request a Quote Button */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="relative group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 bg-[length:200%_auto] hover:bg-right text-slate-950 font-sans font-extrabold text-sm sm:text-base tracking-wider uppercase rounded-sm transition-all duration-300 shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/50 hover:-translate-y-0.5 active:translate-y-0 border-2 border-amber-300"
              >
                {/* Glowing Radar Beacon */}
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-950" />
                </span>
                <span className="drop-shadow-xs">{config.hero.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>

              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-[#0f2b48] font-sans font-bold text-sm sm:text-base tracking-wide uppercase rounded-sm border-2 border-slate-300 transition-all hover:border-slate-400"
              >
                <span>{config.hero.secondaryCtaText}</span>
              </Link>
            </div>

            {/* Key Operating Metrics Bar */}
            <div className="pt-8 border-t-2 border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {(config.operatingStats || COMPANY.operatingStats).map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-bold text-[#0f2b48] tracking-tight font-heading">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-700">
                    {stat.label}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 font-medium">
                    {stat.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Featured Real Project Photography Card */}
          <div className="lg:col-span-5 relative w-full lg:-translate-y-16">
            <Link
              href="/projects/181st-street-station-escalator-railings"
              className="group block relative aspect-square w-full rounded-sm overflow-hidden border-2 border-slate-300 shadow-2xl bg-slate-900 transition-all duration-300 hover:border-amber-500"
            >
              <Image
                src="/images/projects/181station.jpg"
                alt="181st Street A-Train Station Heavy Architectural Metalwork by Signs & Decal Corp."
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-sm bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider shadow font-heading flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
                <span>Featured Installation</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-sm bg-white/95 backdrop-blur-md border border-slate-200 text-slate-900 shadow-lg">
                <p className="font-bold text-base uppercase font-heading text-[#0f2b48] group-hover:text-amber-700 transition-colors">
                  181st Street A-Train Station
                </p>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                  Heavy Architectural Stainless Steel Escalator Enclosures &amp; Safety Barriers
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. GENERAL CONTRACTOR & PUBLIC AUTHORITY TRUST BAR */}
      <section className="py-10 bg-slate-100 border-b-2 border-slate-200 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wide text-[#0f2b48] font-heading">
              Prequalified &amp; Trusted by Premier Construction Managers &amp; Public Authorities
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 items-stretch py-1">
            {PREMIER_PARTNERS.map((partner) => {
              const LogoComponent = partner.component;
              return (
                <div
                  key={partner.name}
                  className="flex items-center justify-center p-3 sm:p-4 bg-white rounded-sm border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 group min-h-[72px]"
                  title={`${partner.name} — ${partner.category}`}
                >
                  <LogoComponent />
                  <span className="sr-only">{partner.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FEATURED LANDMARK PROJECTS */}
      <section className="py-20 bg-slate-50 px-4 sm:px-8 border-b-2 border-slate-300">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-slate-200 pb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-700">
                <HardHat className="w-4 h-4" />
                <span>Verified Project Portfolio</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-[#0f2b48] tracking-tight font-heading uppercase">
                Landmark Infrastructure &amp; Commercial Work
              </h2>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                Explore real, verified architectural signage, heavy stainless escalator cladding, and transit wayfinding systems fabricated in our Brooklyn plant.
              </p>
            </div>

            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0f2b48] hover:text-amber-700 uppercase tracking-wider group shrink-0"
            >
              <span>View All 10 Featured Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, idx) => (
              <ProjectCard key={project.slug} project={project} priority={idx < 2} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. CORE CAPABILITIES OVERVIEW */}
      <section className="py-20 bg-white px-4 sm:px-8 border-b-2 border-slate-300">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-700">
              <Wrench className="w-4 h-4" />
              <span>Multi-Trade In-House Manufacturing</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#0f2b48] tracking-tight font-heading uppercase">
              Single-Source Architectural Fabrication &amp; Engineering
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              We manage the entire production chain under one roof in Brooklyn: design coordination, BIM clash detection, CNC machining, metal forming, spray finishing, and certified union site installation.
            </p>
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CAPABILITIES.slice(0, 6).map((cap) => (
              <div
                key={cap.id}
                className="group p-8 bg-slate-50 border-2 border-slate-200 rounded-sm hover:border-amber-500 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded bg-white border-2 border-slate-300 flex items-center justify-center text-amber-600 group-hover:border-amber-500 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shadow-xs">
                    <DynamicIcon name={cap.iconName} className="w-6 h-6" />
                  </div>

                  <h3 className="text-2xl font-bold text-[#0f2b48] group-hover:text-amber-700 transition-colors font-heading uppercase">
                    {cap.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {cap.overview}
                  </p>

                  <ul className="space-y-2 pt-2 text-sm text-slate-700 border-t border-slate-200 font-medium">
                    {cap.deliverables.slice(0, 3).map((d) => (
                      <li key={d} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <Link
                    href={`/capabilities/${cap.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-700 hover:text-amber-900 uppercase tracking-wider group-hover:translate-x-1 transition-transform"
                  >
                    <span>Technical Details &amp; Specs</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/capabilities"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-sm bg-[#0f2b48] hover:bg-slate-800 text-white font-bold text-sm uppercase tracking-wider font-condensed transition-colors shadow"
            >
              <span>Explore All 9 Fabrication Disciplines</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. SECTORS & ENVIRONMENTS SERVED */}
      <section className="py-20 bg-slate-100 px-4 sm:px-8 border-b-2 border-slate-300">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-slate-200 pb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-700">
                <Building2 className="w-4 h-4" />
                <span>Markets &amp; Infrastructure</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-[#0f2b48] tracking-tight font-heading uppercase">
                Engineered for High-Demanding Environments
              </h2>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                We organize our fabrication and engineering teams around the specific security clearances, building codes, and union constraints of each sector.
              </p>
            </div>

            <Link
              href="/industries"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0f2b48] hover:text-amber-700 uppercase tracking-wider group shrink-0"
            >
              <span>Explore All Industries</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INDUSTRIES.map((ind) => (
              <div
                key={ind.id}
                className="p-6 bg-white border-2 border-slate-200 rounded-sm hover:border-amber-500 hover:shadow-lg transition-all space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded bg-slate-100 text-amber-700 border border-slate-200">
                    <DynamicIcon name={ind.iconName} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0f2b48] font-heading uppercase">
                      {ind.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-amber-700 font-bold uppercase">
                      {ind.shortTitle}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 font-normal">
                  {ind.description}
                </p>

                <div className="pt-3 border-t border-slate-100 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Key Client Relationships:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 font-semibold truncate">
                    {ind.keyClients.slice(0, 3).join(' • ')}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/industries#${ind.id}`}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#0f2b48] hover:text-amber-700 uppercase tracking-wider"
                  >
                    <span>Sector Experience</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PROJECT DELIVERY & FABRICATION WORKFLOW */}
      <section className="py-20 bg-white px-4 sm:px-8 border-b-2 border-slate-300">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-700">
              <ShieldCheck className="w-4 h-4" />
              <span>Disciplined Quality Control</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#0f2b48] tracking-tight font-heading uppercase">
              Our 5-Stage Project Delivery Workflow
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              How Signs &amp; Decal Corp. ensures zero defects, seamless trade coordination, and on-schedule installation on major public and commercial construction sites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Estimating & Value Engineering',
                desc: 'Detailed drawing takeoffs, specification review, material cost optimization, and competitive bid submittals.',
              },
              {
                step: '02',
                title: 'BIM & Shop Drawings',
                desc: 'In-house CAD engineering, structural calculations, connection detailing, and trade clash detection.',
              },
              {
                step: '03',
                title: 'Precision Fabrication',
                desc: 'Fiber laser cutting, CNC press brake forming, AWS certified welding, and clean-room baking ovens.',
              },
              {
                step: '04',
                title: 'Rigorous QA Inspection',
                desc: 'UL 48 electrical safety verification, photometric testing, finish adhesion checks, and dimensional audits.',
              },
              {
                step: '05',
                title: 'Union Site Installation',
                desc: 'Licensed union riggers, nighttime work curfews, crane logistics, and complete punch-list closeout.',
              },
            ].map((stage) => (
              <div
                key={stage.step}
                className="p-6 bg-slate-50 border-2 border-slate-200 rounded-sm relative space-y-3 hover:border-amber-500 hover:bg-white transition-all shadow-xs"
              >
                <div className="text-4xl font-bold text-amber-500 font-heading">
                  {stage.step}
                </div>
                <h3 className="text-lg font-bold text-[#0f2b48] font-heading uppercase leading-snug">
                  {stage.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/quality-delivery"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0f2b48] hover:text-amber-700 uppercase tracking-wider font-condensed"
            >
              <span>Read Our Complete Quality Delivery &amp; Safety Protocol</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. BRIGHT CALL TO ACTION */}
      <ContactCta />
    </div>
  );
}
