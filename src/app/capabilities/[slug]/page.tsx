import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { CAPABILITIES } from '../../../data/capabilities';
import { PROJECTS } from '../../../data/projects';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { ProjectCard } from '../../../components/ProjectCard';
import { ContactCta } from '../../../components/ContactCta';
import { DynamicIcon } from '../../../components/Icons';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  HardHat,
  Layers,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CAPABILITIES.map((capability) => ({
    slug: capability.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const capability = CAPABILITIES.find((c) => c.slug === slug);

  if (!capability) {
    return {
      title: 'Capability Not Found',
    };
  }

  return {
    title: capability.title,
    description: capability.overview,
    alternates: {
      canonical: `https://www.signsanddecal.com/capabilities/${capability.slug}`,
    },
    openGraph: {
      title: `${capability.title} | Signs & Decal Corp.`,
      description: capability.overview,
      url: `https://www.signsanddecal.com/capabilities/${capability.slug}`,
      images: ['/images/projects/laguardia.png'],
    },
  };
}

export default async function CapabilityDetailPage({ params }: Props) {
  const { slug } = await params;
  const capability = CAPABILITIES.find((c) => c.slug === slug);

  if (!capability) {
    notFound();
  }

  const relatedProjects = PROJECTS.filter((p) =>
    capability.relatedProjects.includes(p.slug) || p.capabilities.includes(capability.id)
  ).slice(0, 3);

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: capability.title,
    description: capability.overview,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Signs & Decal Corp.',
      telephone: '(718) 486-6400',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '410 Morgan Avenue',
        addressLocality: 'Brooklyn',
        addressRegion: 'NY',
        postalCode: '11211',
        addressCountry: 'US',
      },
    },
    areaServed: 'New York Metro & Nationwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: capability.shortTitle,
      itemListElement: capability.deliverables.map((d) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: d,
        },
      })),
    },
  };

  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      {/* Header */}
      <section className="bg-white border-b-2 border-slate-300 py-16 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 architectural-grid opacity-75 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto space-y-6">
          <Breadcrumbs
            items={[
              { label: 'Capabilities', href: '/capabilities' },
              { label: capability.shortTitle },
            ]}
          />

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-slate-50 border-2 border-slate-300 flex items-center justify-center text-amber-600 shadow-xs">
              <DynamicIcon name={capability.iconName} className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm uppercase tracking-widest font-bold text-amber-700">
              Specialized Discipline
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-[#0f2b48] tracking-tight uppercase max-w-4xl font-heading">
            {capability.title}
          </h1>

          <p className="text-lg sm:text-xl text-slate-700 max-w-3xl leading-relaxed font-normal">
            {capability.heroHeadline}
          </p>
        </div>
      </section>

      {/* Overview & Key Deliverables */}
      <section className="py-20 bg-slate-50 px-4 sm:px-8 border-b-2 border-slate-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content (2 cols) */}
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0f2b48] uppercase tracking-tight font-heading">
                Discipline Overview
              </h2>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                {capability.overview}
              </p>
            </div>

            {/* In-depth Features */}
            <div className="space-y-6 pt-6 border-t border-slate-200">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0f2b48] font-heading uppercase">
                Core Engineering &amp; Fabrication Features
              </h3>
              <div className="grid gap-6">
                {capability.keyCapabilities.map((kc) => (
                  <div
                    key={kc.title}
                    className="p-6 bg-white border-2 border-slate-200 rounded-sm space-y-2 shadow-xs"
                  >
                    <h4 className="text-lg sm:text-xl font-bold text-[#0f2b48] flex items-center gap-2 font-heading uppercase">
                      <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                      {kc.title}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed pl-7 font-normal">
                      {kc.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables List */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0f2b48] font-heading uppercase">
                Scope Deliverables &amp; Manufactured Components
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {capability.deliverables.map((deliv) => (
                  <li
                    key={deliv}
                    className="flex items-start gap-2.5 p-3.5 rounded bg-white border border-slate-200 text-sm text-slate-700 font-medium shadow-2xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{deliv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar Specifications (1 col) */}
          <div className="space-y-8">
            {/* Materials & Finishes Card */}
            <div className="p-6 bg-white border-2 border-slate-200 rounded-sm space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0f2b48] uppercase tracking-wider border-b border-slate-200 pb-3 font-condensed">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>Materials &amp; Finishes</span>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-700">
                {capability.materialsAndFinishes.map((mat) => (
                  <li key={mat} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                    <span className="font-medium">{mat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Engineering & Code Specs Card */}
            <div className="p-6 bg-white border-2 border-slate-200 rounded-sm space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0f2b48] uppercase tracking-wider border-b border-slate-200 pb-3 font-condensed">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Standards &amp; Testing</span>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-700">
                {capability.engineeringSpecs.map((spec) => (
                  <li key={spec} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
                    <span className="font-medium">{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preconstruction Estimating Box */}
            <div className="p-6 bg-[#0f2b48] text-white rounded-sm space-y-4 shadow-lg border-2 border-amber-500">
              <div className="flex items-center gap-2 text-amber-400 text-xs sm:text-sm font-bold uppercase tracking-wider font-condensed">
                <HardHat className="w-4 h-4" />
                <span>Bidding &amp; Estimating</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-normal">
                Have architectural drawings, elevation sheets, or signage schedules requiring competitive takeoffs? Submit your bid packages directly to our estimating team.
              </p>
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-sans font-extrabold text-sm uppercase tracking-wider rounded-sm transition-all shadow-md shadow-amber-500/30 border border-amber-300"
              >
                <span>Request Bid Submittal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Landmark Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-20 bg-white px-4 sm:px-8 border-b-2 border-slate-300">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-slate-200 pb-6">
              <div>
                <span className="text-xs sm:text-sm font-bold text-amber-700 uppercase tracking-widest">
                  Demonstrated Track Record
                </span>
                <h2 className="text-3xl font-bold text-[#0f2b48] tracking-tight font-heading uppercase mt-1">
                  Projects Utilizing {capability.shortTitle}
                </h2>
              </div>
              <Link
                href="/projects"
                className="text-sm font-bold text-[#0f2b48] hover:text-amber-700 uppercase tracking-wider inline-flex items-center gap-1 font-condensed"
              >
                <span>View Full Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other Capabilities Navigation */}
      <section className="py-12 bg-slate-100 px-4 sm:px-8 border-b-2 border-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs sm:text-sm uppercase font-bold text-[#0f2b48] tracking-wider font-heading">
            Explore Other Capabilities:
          </span>
          <div className="flex flex-wrap gap-2">
            {CAPABILITIES.filter((c) => c.slug !== capability.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/capabilities/${c.slug}`}
                className="px-3.5 py-2 rounded bg-white border border-slate-300 text-xs sm:text-sm font-bold text-[#0f2b48] hover:text-amber-700 hover:border-amber-500 transition-colors uppercase font-condensed"
              >
                {c.shortTitle}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContactCta />
    </div>
  );
}
