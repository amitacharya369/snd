import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { ContactCta } from '../../components/ContactCta';
import {
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Wrench,
  Truck,
  HardHat,
  ClipboardList,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quality & Project Delivery Workflow',
  description: 'Detailed overview of Signs & Decal Corp.’s 5-stage project delivery protocol: estimating, engineering, precision fabrication, quality inspection, and union installation.',
  alternates: {
    canonical: 'https://www.signsanddecal.com/quality-delivery',
  },
  openGraph: {
    title: 'Quality & Project Delivery | Signs & Decal Corp.',
    description: 'Disciplined QA/QC from initial drawing takeoffs to zero-defect union jobsite handover.',
    images: ['/images/projects/laguardia.png'],
  },
};

export default function QualityDeliveryPage() {
  const steps = [
    {
      step: '01',
      title: 'Estimating, Scope Review & Prequalification',
      tagline: 'Precision cost engineering and specification compliance',
      icon: ClipboardList,
      description: 'Our estimating team, led by Carlos Colon, conducts thorough plan takeoffs from architectural drawings, elevation sheets, and project specification manuals (CSI Division 10 Signage, Division 05 Metals, Division 08 Glazing). We identify potential lead-time bottlenecks, recommend value-engineering opportunities where appropriate, and provide transparent, competitive proposals.',
      checks: [
        'Detailed quantity takeoffs and architectural schedule reconciliation',
        'Verification of prevailing wage and union trade jurisdiction requirements',
        'Certified MBE documentation and diversity utilization plan preparation',
        'Preliminary material availability and long-lead supply chain auditing',
      ],
    },
    {
      step: '02',
      title: 'In-House BIM Modeling & Engineering Submittals',
      tagline: '3D clash detection, shop drawings, and structural PE stamping',
      icon: Cpu,
      description: 'Our Art & Engineering Department translates architectural design intent into fully coordinated fabrication shop drawings and 3D BIM models. Every mounting detail, weld size, fastener type, and electrical penetration is resolved before cutting raw material, preventing costly field collisions.',
      checks: [
        'Detailed AutoCAD and Revit 3D submittal packages with comprehensive material callouts',
        'Structural engineering calculations stamped by licensed New York State Professional Engineers (PE)',
        'Wind load (up to 120 MPH), seismic, and dynamic vibration analysis for transit environments',
        'Full physical material sample submittals, finish color matching, and illuminated mockups',
      ],
    },
    {
      step: '03',
      title: 'Material Certification & Multi-Trade Fabrication',
      tagline: 'Controlled manufacturing at our 410 Morgan Ave Brooklyn plant',
      icon: Wrench,
      description: 'All primary fabrication takes place directly within our Brooklyn headquarters. Using high-speed fiber laser cutters, multi-axis hydraulic press brakes, and certified welding bays, our master craftspeople execute heavy aluminum framing, marine-grade 316 stainless steel enclosures, and cast bronze architectural monuments.',
      checks: [
        'Mill test reports (MTR) verifying domestic steel and aluminum chemical and physical properties',
        'Welders certified to American Welding Society (AWS D1.1, D1.2, D1.6) standards',
        'Multi-axis CNC routing and fiber laser cutting with tolerances to ±0.005 inches',
        'In-house automated finishing booths with baking ovens applying Kynar 500 PVDF and automotive urethanes',
      ],
    },
    {
      step: '04',
      title: 'Comprehensive QA Inspection & Factory Acceptance',
      tagline: 'Multi-point verification and UL 48 electrical listing',
      icon: ShieldCheck,
      description: 'Before components leave our factory floor, they undergo comprehensive inspection by our quality assurance team. Illuminated assemblies are energized for a minimum 48-hour continuous burn-in cycle, electrical components are tested to UL 48 standards, and finish thickness is measured with calibrated dry-film gauges.',
      checks: [
        'Dimensional inspection against approved shop drawings and laser level calibration',
        'Dry-film thickness (DFT), cross-hatch adhesion, and gloss level testing',
        'Full electrical safety testing, ground bond verification, and UL label application',
        'Optional Factory Acceptance Testing (FAT) with general contractors and transit authority reps',
      ],
    },
    {
      step: '05',
      title: 'Union Field Installation, Logistics & Closeout',
      tagline: 'Certified union riggers, nighttime curfews, and zero-defect punch list',
      icon: Truck,
      description: 'Our union installation team brings decades of experience navigating the complex logistical, safety, and security requirements of active airports, high-traffic rail terminals, and high-rise construction zones. We coordinate with general superintendent schedules, crane and rigging permits, and public safety requirements.',
      checks: [
        'OSHA 30 certified foremen and 100% union field installation crews',
        'Coordination with site safety managers, Port Authority SIDA, and transit security badging',
        'Execution during approved track outages, airport curfew windows, and off-hour periods',
        'Comprehensive closeout submittals: as-built drawings, maintenance manuals, and warranties',
      ],
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-white border-b-2 border-slate-300 py-16 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 architectural-grid opacity-75 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto space-y-6">
          <Breadcrumbs items={[{ label: 'Quality & Project Delivery' }]} />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-500/50 text-amber-950 text-xs sm:text-sm font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Engineering Discipline &amp; Rigorous QA/QC</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-[#0f2b48] tracking-tight uppercase max-w-4xl font-heading">
            From Drawings &amp; Specifications to Turnkey Installation
          </h1>

          <p className="text-lg sm:text-xl text-slate-700 max-w-3xl leading-relaxed font-normal">
            Signs &amp; Decal Corp. operates under strict Quality Assurance / Quality Control protocols designed to satisfy the rigorous specifications, safety codes, and tight project schedules of premier construction organizations.
          </p>
        </div>
      </section>

      {/* Step by Step Workflow */}
      <section className="py-20 bg-slate-50 px-4 sm:px-8 border-b-2 border-slate-300">
        <div className="max-w-5xl mx-auto space-y-12">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="p-8 sm:p-10 bg-white border-2 border-slate-300 rounded-sm space-y-6 relative shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-200 pb-6">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl font-bold text-amber-500 font-heading">
                      {s.step}
                    </span>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#0f2b48] font-heading uppercase">
                        {s.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-amber-700 font-bold uppercase tracking-wider font-condensed">
                        {s.tagline}
                      </p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded bg-slate-100 border-2 border-slate-200 text-amber-700 shrink-0 self-start sm:self-auto shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <p className="text-base text-slate-700 leading-relaxed font-normal">
                  {s.description}
                </p>

                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0f2b48]">
                    Quality Verification Checkpoints:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {s.checks.map((c) => (
                      <div
                        key={c}
                        className="flex items-start gap-2.5 p-3.5 rounded bg-slate-50 border border-slate-200 text-sm text-slate-700 font-medium"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Standards & Certifications Banner */}
      <section className="py-16 bg-white px-4 sm:px-8 border-b-2 border-slate-300">
        <div className="max-w-7xl mx-auto space-y-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0f2b48] uppercase tracking-tight font-heading">
            Industry Standards Maintained Across Every Contract
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="p-5 rounded bg-slate-50 border-2 border-slate-200 space-y-1 shadow-xs">
              <div className="text-2xl sm:text-3xl font-bold text-[#0f2b48] font-heading">UL 48</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-600">Electric Signs Safety Listed</div>
            </div>
            <div className="p-5 rounded bg-slate-50 border-2 border-slate-200 space-y-1 shadow-xs">
              <div className="text-2xl sm:text-3xl font-bold text-[#0f2b48] font-heading">AWS Certified</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-600">American Welding Society D1.1/D1.2</div>
            </div>
            <div className="p-5 rounded bg-slate-50 border-2 border-slate-200 space-y-1 shadow-xs">
              <div className="text-2xl sm:text-3xl font-bold text-[#0f2b48] font-heading">AISC Fabricator</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-600">AISC Building Fabricator Certified</div>
            </div>
            <div className="p-5 rounded bg-slate-50 border-2 border-slate-200 space-y-1 shadow-xs">
              <div className="text-2xl sm:text-3xl font-bold text-[#0f2b48] font-heading">OSHA 30</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-600">100% Certified Field Riggers</div>
            </div>
          </div>
        </div>
      </section>

      <ContactCta />
    </div>
  );
}
