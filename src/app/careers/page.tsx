import React from 'react';
import { Metadata } from 'next';
import { COMPANY } from '../../data/company';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { ContactCta } from '../../components/ContactCta';
import {
  Users,
  CheckCircle2,
  Mail,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers & Manufacturing Craftsmanship',
  description: 'Join the Signs & Decal Corp. team in Brooklyn, NY. Career opportunities in architectural metal fabrication, welding, CNC machining, CAD/BIM engineering, and project management.',
  alternates: {
    canonical: 'https://www.signsanddecal.com/careers',
  },
  openGraph: {
    title: 'Careers at Signs & Decal Corp. | Brooklyn, NY',
    description: 'Build New York’s landmark infrastructure with our family-owned architectural fabrication company.',
    images: ['/images/projects/laguardia.png'],
  },
};

export default function CareersPage() {
  const departments = [
    {
      title: 'Architectural Metal Fabrication & Welding',
      description: 'Positions for skilled fabricators and certified welders (MIG/TIG across stainless steel, aluminum, and architectural bronze).',
      requirements: ['AWS certification or demonstrated structural welding skill', 'Ability to read architectural shop drawings and blueprints', 'Safety-first mentality with OSHA 10/30 preferred'],
    },
    {
      title: 'CNC Machining & Fiber Laser Operations',
      description: 'Operating multi-axis CNC routers, high-precision fiber laser cutting systems, and computerized hydraulic press brakes.',
      requirements: ['Experience with G-code, CNC nesting software, and machine calibration', 'Familiarity with sheet aluminum, acrylic, brass, and stainless substrates', 'Attention to tight architectural tolerances (±0.005")'],
    },
    {
      title: 'CAD / BIM Engineering & Shop Drafting',
      description: 'Joining our Art & Engineering Department to produce comprehensive submittal packages, structural details, and Revit BIM models.',
      requirements: ['Proficiency in AutoCAD, Revit, and 3D modeling tools', 'Understanding of NYC Building Code, ADAAG, and architectural metal details', 'Strong communication with project managers and client architects'],
    },
    {
      title: 'Project Management & Estimating',
      description: 'Coordinating large-scale construction contracts, submittals, material purchasing, and field installation schedules.',
      requirements: ['Experience with Procore, PlanGrid, or general contractor construction platforms', 'Understanding of CSI Division 10 Signage and Division 05 Metals', 'Proven track record managing subcontractors and trade coordination'],
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-white border-b-2 border-slate-300 py-16 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 architectural-grid opacity-75 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto space-y-6">
          <Breadcrumbs items={[{ label: 'Careers' }]} />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-500/50 text-amber-950 text-xs sm:text-sm font-bold uppercase tracking-wider">
            <Users className="w-4 h-4 text-amber-700" />
            <span>Craftsmanship &amp; Careers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-[#0f2b48] tracking-tight uppercase max-w-4xl font-heading">
            Build New York’s Architectural Landmarks With Us
          </h1>

          <p className="text-lg sm:text-xl text-slate-700 max-w-3xl leading-relaxed font-normal">
            Signs &amp; Decal Corp. has provided high-quality manufacturing careers in New York City since 1971. We take pride in our diverse, family-oriented culture, investing in modern equipment, job training, and apprenticeships.
          </p>
        </div>
      </section>

      {/* Careers Info & Application Pathway */}
      <section className="py-20 bg-slate-50 px-4 sm:px-8 border-b-2 border-slate-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Active Disciplines (2 cols) */}
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0f2b48] uppercase tracking-tight font-heading">
                Our Primary Trade Disciplines
              </h2>
              <p className="text-base text-slate-700 leading-relaxed font-normal">
                We are continually seeking skilled craftspeople, experienced engineers, and motivated apprentices to join our Brooklyn manufacturing headquarters. Below are the primary disciplines active in our facility:
              </p>
            </div>

            <div className="grid gap-6">
              {departments.map((dept) => (
                <div
                  key={dept.title}
                  className="p-6 bg-white border-2 border-slate-200 rounded-sm space-y-4 shadow-xs hover:border-amber-500 transition-all"
                >
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0f2b48] font-heading uppercase">
                    {dept.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {dept.description}
                  </p>
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <span className="text-xs uppercase font-bold text-[#0f2b48] tracking-wider">
                      Core Qualifications:
                    </span>
                    <ul className="space-y-1.5 text-sm text-slate-700">
                      {dept.requirements.map((req) => (
                        <li key={req} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secure Application Pathway (1 col) */}
          <div className="space-y-8">
            <div className="p-8 bg-white border-2 border-slate-300 rounded-sm space-y-6 shadow-md">
              <div className="p-3.5 rounded bg-amber-500/10 text-amber-700 border border-amber-500/20 w-fit">
                <Mail className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-[#0f2b48] uppercase tracking-wider font-heading">
                How to Submit an Employment Inquiry
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                To protect applicant privacy, Signs &amp; Decal Corp. does not maintain a public applicant database. Qualified candidates are invited to submit their resume, portfolio, or statement of interest directly to our Human Resources department:
              </p>

              <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2 text-sm text-slate-700">
                <p className="font-bold text-[#0f2b48] uppercase">Email Submission:</p>
                <a
                  href={`mailto:${COMPANY.headquarters.email}?subject=Career Inquiry - Signs %26 Decal Corp.`}
                  className="text-amber-700 hover:text-amber-900 font-mono font-bold block text-sm sm:text-base"
                >
                  {COMPANY.headquarters.email}
                </a>
                <p className="text-xs text-slate-500 pt-1">
                  Attention: Clara Liranzo, HR &amp; Administration
                </p>
                <p className="text-xs text-slate-500">
                  Please specify your trade discipline and contact phone number.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0f2b48] block">
                  Equal Opportunity Employer (EOE)
                </span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Signs &amp; Decal Corp. is an Equal Opportunity Employer. We celebrate diversity and are committed to creating an inclusive, safe manufacturing environment for all employees.
                </p>
              </div>
            </div>

            <div className="p-6 bg-white border-2 border-slate-200 rounded-sm space-y-2 shadow-xs">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0f2b48] font-heading">
                Facility &amp; Work Location
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                All manufacturing and engineering positions are based on-site at our 410 Morgan Avenue, Brooklyn, NY 11211 facility. Accessible via public transit.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ContactCta />
    </div>
  );
}
