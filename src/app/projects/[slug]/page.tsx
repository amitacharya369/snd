import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PROJECTS } from '../../../data/projects';
import { CAPABILITIES } from '../../../data/capabilities';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { ProjectCard } from '../../../components/ProjectCard';
import { ContactCta } from '../../../components/ContactCta';
import {
  MapPin,
  Calendar,
  Building2,
  HardHat,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} — ${project.client}`,
    description: project.summary,
    alternates: {
      canonical: `https://www.signsanddecal.com/projects/${project.slug}`,
    },
    openGraph: {
      title: `${project.title} | Signs & Decal Corp.`,
      description: project.summary,
      url: `https://www.signsanddecal.com/projects/${project.slug}`,
      images: [project.featuredImage],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const relatedCaps = CAPABILITIES.filter((c) =>
    project.capabilities.includes(c.id)
  );

  const otherProjects = PROJECTS.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-white border-b-2 border-slate-300 py-16 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 architectural-grid opacity-75 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto space-y-6">
          <Breadcrumbs
            items={[
              { label: 'Projects', href: '/projects' },
              { label: project.shortTitle },
            ]}
          />

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-amber-500 text-slate-950 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-xs font-condensed">
              <Building2 className="w-3.5 h-3.5" />
              {project.client}
            </span>
            {project.contractorOrPartner && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-slate-100 border border-slate-300 text-slate-800 text-xs sm:text-sm font-bold uppercase">
                <HardHat className="w-3.5 h-3.5 text-amber-600" />
                GC: {project.contractorOrPartner}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-slate-100 border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              {project.location}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-slate-100 border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Completed: {project.completionYear}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0f2b48] tracking-tight uppercase max-w-4xl font-heading">
            {project.title}
          </h1>

          <p className="text-lg sm:text-xl text-amber-700 font-bold max-w-3xl leading-relaxed">
            {project.subtitle}
          </p>
        </div>
      </section>

      {/* Hero Media Container */}
      <section className="bg-slate-100 py-12 px-4 sm:px-8 border-b-2 border-slate-300">
        <div className="max-w-7xl mx-auto">
          <div className="relative aspect-[16/9] w-full rounded-sm overflow-hidden border-2 border-slate-300 shadow-2xl bg-slate-900">
            <Image
              src={project.featuredImage}
              alt={project.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            {project.highlightStat && (
              <div className="absolute bottom-6 right-6 p-4 rounded-sm bg-white/95 backdrop-blur-md border border-slate-200 text-right shadow-xl">
                <div className="text-3xl sm:text-4xl font-bold text-[#0f2b48] font-heading">
                  {project.highlightStat.value}
                </div>
                <div className="text-xs sm:text-sm uppercase font-bold text-amber-700 tracking-wider">
                  {project.highlightStat.label}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Project Details & Technical Specifications */}
      <section className="py-20 bg-slate-50 px-4 sm:px-8 border-b-2 border-slate-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Scope & Narrative (2 cols) */}
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0f2b48] uppercase tracking-tight font-heading">
                Project Overview &amp; Execution
              </h2>
              {project.overviewText.map((p, idx) => (
                <p key={idx} className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                  {p}
                </p>
              ))}
            </div>

            {/* Verified Scope Breakdown */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0f2b48] uppercase tracking-tight flex items-center gap-2 font-heading">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <span>Verified Scope of Work</span>
              </h3>
              <ul className="space-y-3">
                {project.verifiedScope.map((scope) => (
                  <li
                    key={scope}
                    className="flex items-start gap-3 p-4 rounded bg-white border border-slate-200 text-sm text-slate-700 font-medium shadow-2xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{scope}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Challenge and Solution Callout */}
            {project.challengeAndSolution && (
              <div className="p-8 bg-white border-2 border-slate-300 rounded-sm space-y-6 shadow-xs">
                <h3 className="text-xl sm:text-2xl font-bold text-[#0f2b48] uppercase tracking-wider font-heading">
                  Technical Challenge &amp; Engineering Solution
                </h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="font-bold text-amber-700 uppercase tracking-wider text-xs sm:text-sm block mb-1">
                      The Construction Challenge:
                    </span>
                    <p className="text-slate-700 leading-relaxed font-normal">
                      {project.challengeAndSolution.challenge}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <span className="font-bold text-emerald-700 uppercase tracking-wider text-xs sm:text-sm block mb-1">
                      The S+D Engineering Solution:
                    </span>
                    <p className="text-slate-700 leading-relaxed font-normal">
                      {project.challengeAndSolution.solution}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Technical Specifications Sidebar (1 col) */}
          <div className="space-y-8">
            {/* Specifications Card */}
            <div className="p-6 bg-white border-2 border-slate-200 rounded-sm space-y-6 shadow-xs">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0f2b48] uppercase tracking-wider border-b border-slate-200 pb-3 font-condensed">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>Technical Specifications</span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Specified Materials
                </span>
                <ul className="space-y-2 text-sm text-slate-700">
                  {project.specifications.materials.map((m) => (
                    <li key={m} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="font-medium">{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Finishes &amp; Coatings
                </span>
                <ul className="space-y-2 text-sm text-slate-700">
                  {project.specifications.finishes.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      <span className="font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Engineering Disciplines
                </span>
                <ul className="space-y-2 text-sm text-slate-700">
                  {project.specifications.disciplines.map((d) => (
                    <li key={d} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span className="font-medium">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Related Capabilities */}
            <div className="p-6 bg-white border-2 border-slate-200 rounded-sm space-y-4 shadow-xs">
              <h4 className="text-xs sm:text-sm font-bold text-[#0f2b48] uppercase tracking-wider border-b border-slate-200 pb-3 font-heading">
                Capabilities Utilized
              </h4>
              <div className="space-y-2">
                {relatedCaps.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/capabilities/${c.slug}`}
                    className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 hover:text-amber-700 hover:border-amber-500 transition-colors group"
                  >
                    <span>{c.shortTitle}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Estimating Contact Box */}
            <div className="p-6 bg-[#0f2b48] text-white rounded-sm space-y-4 shadow-lg border-2 border-amber-500">
              <div className="flex items-center gap-2 text-amber-400 text-xs sm:text-sm font-bold uppercase tracking-wider font-condensed">
                <HardHat className="w-4 h-4" />
                <span>Bidding Similar Scope?</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-normal">
                Connect with our Brooklyn estimating team to discuss project specifications, drawings, and competitive bids.
              </p>
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-sans font-extrabold text-sm uppercase tracking-wider rounded-sm transition-all shadow-md shadow-amber-500/30 border border-amber-300"
              >
                <span>Discuss Project Specifications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Other Projects Section */}
      <section className="py-20 bg-white px-4 sm:px-8 border-b-2 border-slate-300">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-slate-200 pb-6">
            <div>
              <span className="text-xs sm:text-sm font-bold text-amber-700 uppercase tracking-widest">
                Explore More Work
              </span>
              <h2 className="text-3xl font-bold text-[#0f2b48] tracking-tight font-heading uppercase mt-1">
                Related Landmark Installations
              </h2>
            </div>
            <Link
              href="/projects"
              className="text-sm font-bold text-[#0f2b48] hover:text-amber-700 uppercase tracking-wider inline-flex items-center gap-1 font-condensed"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {otherProjects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
      </section>

      <ContactCta />
    </div>
  );
}
