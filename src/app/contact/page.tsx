import React from 'react';
import { Metadata } from 'next';
import { COMPANY } from '../../data/company';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { ContactFormClient } from './ContactFormClient';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  FileCheck,
  Building2,
  ExternalLink,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us / Discuss a Project',
  description: 'Connect with our Brooklyn estimating and engineering team. Request quotes, submit architectural drawings, and prequalify Signs & Decal Corp. as your MBE fabrication partner.',
  alternates: {
    canonical: 'https://www.signsanddecal.com/contact',
  },
  openGraph: {
    title: 'Contact Signs & Decal Corp. | Brooklyn, NY',
    description: '410 Morgan Avenue, Brooklyn, NY 11211 • (718) 486-6400 • salesteam@signsanddecal.com',
    images: ['/images/projects/laguardia.png'],
  },
};

export default function ContactPage() {
  return (
    <div className="flex flex-col bg-slate-50">
      {/* Header */}
      <section className="bg-slate-100 border-b border-slate-300 py-16 px-4 sm:px-8 architectural-grid">
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumbs items={[{ label: 'Contact' }]} />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-amber-400/20 border border-amber-500/50 text-amber-950 text-xs sm:text-sm font-bold uppercase tracking-wider font-condensed">
            <span>Preconstruction &amp; Project Inquiries</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-[#0f2b48] tracking-tight uppercase font-condensed max-w-4xl">
            Discuss a Project / Request a Bid Submittal
          </h1>

          <p className="text-base sm:text-lg text-slate-700 max-w-3xl leading-relaxed">
            Whether you need competitive pricing on an active general contracting tender, custom architectural metalwork, or comprehensive transit wayfinding, our Brooklyn estimating and engineering teams are ready to collaborate.
          </p>
        </div>
      </section>

      {/* Main Contact Form & Details Section */}
      <section className="py-16 bg-slate-50 px-4 sm:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Inquiry Form Column (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-300 rounded-sm p-8 sm:p-10 space-y-6 shadow-sm">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-bold text-[#0f2b48] uppercase tracking-tight font-condensed">
                Project Inquiry &amp; Scope Details
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Complete the fields below. Required fields are marked with an asterisk (*).
              </p>
            </div>

            <ContactFormClient />
          </div>

          {/* Contact Details & Estimating Checklist (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Headquarters Card */}
            <div className="p-8 bg-white border border-slate-300 rounded-sm space-y-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#0f2b48] uppercase tracking-wider font-condensed border-b border-slate-200 pb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-600" />
                <span>Brooklyn Headquarters &amp; Plant</span>
              </h3>

              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0f2b48] block font-bold">Signs &amp; Decal Corp.</strong>
                    <p className="text-slate-600">{COMPANY.headquarters.street}</p>
                    <p className="text-slate-600">{COMPANY.headquarters.city}, {COMPANY.headquarters.state} {COMPANY.headquarters.zip}</p>
                    <a
                      href={COMPANY.headquarters.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs sm:text-sm text-amber-700 hover:text-amber-800 font-bold mt-1"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                  <Phone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0f2b48] block font-bold">Telephone</strong>
                    <a
                      href={`tel:${COMPANY.headquarters.phoneRaw}`}
                      className="text-slate-700 hover:text-amber-700 font-semibold"
                    >
                      {COMPANY.headquarters.phone}
                    </a>
                    <p className="text-xs text-slate-500">Estimating &amp; Sales Line</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                  <Mail className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0f2b48] block font-bold">Direct Sales Email</strong>
                    <a
                      href={`mailto:${COMPANY.headquarters.email}`}
                      className="text-slate-700 hover:text-amber-700 font-mono font-semibold"
                    >
                      {COMPANY.headquarters.email}
                    </a>
                    <p className="text-xs text-slate-500">Send RFP/RFQ packages directly</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Estimating Submittal Checklist */}
            <div className="p-8 bg-white border border-slate-300 rounded-sm space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-[#0f2b48] uppercase tracking-wider font-condensed border-b border-slate-200 pb-3 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-600" />
                <span>Bidding &amp; Estimating Checklist</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To expedite your quotation, please ensure your invitation to bid includes:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                  <span>Architectural drawing sheets, elevations, and mounting details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                  <span>Specification manual (Division 10 14 00 Signage / Division 05 Metals)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                  <span>Project schedule, milestone handover dates, and site access constraints</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                  <span>MBE participation percentage goals and certified payroll requirements</span>
                </li>
              </ul>
            </div>

            {/* Verified Certifications Box */}
            <div className="p-6 bg-amber-50/70 border border-amber-300 rounded-sm space-y-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-900 uppercase tracking-wider font-condensed">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Prequalified Tier-1 Partner</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Certified Minority Business Enterprise (MBE) with NYC Department of Small Business Services (SBS), NYC School Construction Authority (SCA), and PANYNJ. Active Federal CAGE Code: 15HU7.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
