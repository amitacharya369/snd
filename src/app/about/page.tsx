import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { COMPANY } from '../../data/company';
import { LEADERSHIP } from '../../data/leadership';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { ContactCta } from '../../components/ContactCta';
import {
  ShieldCheck,
  Building2,
  Clock,
  Wrench,
  CheckCircle2,
  ArrowRight,
  HardHat,
  Users,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us — 50+ Years of Architectural Signage & Fabrication',
  description: 'Founded in 1971 in Brooklyn, NY, Signs & Decal Corp. is a certified MBE architectural signage and specialty metal fabricator for landmark transit and commercial infrastructure.',
  alternates: {
    canonical: 'https://www.signsanddecal.com/about',
  },
  openGraph: {
    title: 'About Signs & Decal Corp. | Brooklyn Architectural Fabricator',
    description: 'Over 50 years of master craftsmanship, advanced CNC manufacturing, and certified MBE qualifications.',
    images: ['/images/projects/laguardia.png'],
  },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-white border-b-2 border-slate-300 py-16 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 architectural-grid opacity-75 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto space-y-6">
          <Breadcrumbs items={[{ label: 'About Us' }]} />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-500/50 text-amber-950 text-xs sm:text-sm font-bold uppercase tracking-wider">
            <HardHat className="w-4 h-4 text-amber-700" />
            <span>Corporate History &amp; Leadership</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-[#0f2b48] tracking-tight uppercase max-w-4xl font-heading">
            Over 50 Years of Engineering &amp; Architectural Fabrication Excellence
          </h1>

          <p className="text-lg sm:text-xl text-slate-700 max-w-3xl leading-relaxed font-normal">
            Founded in 1971 on Northern Boulevard and headquartered at 410 Morgan Avenue in Brooklyn, Signs &amp; Decal Corp. has evolved into one of the nation’s foremost architectural fabricators for premier transit systems, airports, sports arenas, and high-rise commercial landmarks.
          </p>
        </div>
      </section>

      {/* Story & Evolution */}
      <section className="py-20 bg-slate-50 px-4 sm:px-8 border-b-2 border-slate-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2b48] tracking-tight font-heading uppercase">
              From Northern Boulevard Workshop to New York Infrastructure Fabricator
            </h2>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              When Babu and Tazzim Khalfan opened our first shop in 1971, New York was in the midst of major corporate growth. Starting small with mechanical engraving, chemical metal etching, and office nameplates, S+D quickly distinguished itself through obsessive precision, rapid turnaround, and dependability.
            </p>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              By the late 1970s and 1980s, direct partnerships with legendary environmental graphic designers—including Rudolf de Harak and Richard Poulin—propelled S+D into premier civic projects like the original World Trade Center complex and 599 Lexington Avenue. Soon after, the firm began its historic relationship fabricating transit signage for the Metropolitan Transportation Authority (MTA).
            </p>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              Today, entering our second half-century, S+D continues under family leadership with Haas and Abbas Khalfan, operating an expanded modern manufacturing facility at 410 Morgan Avenue in Brooklyn alongside our affiliated SD Works and SD Industries manufacturing plants.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-4">
              <div className="p-5 bg-white border-2 border-slate-200 rounded-sm shadow-xs">
                <div className="text-3xl sm:text-4xl font-bold text-[#0f2b48] font-heading">1971</div>
                <div className="text-xs sm:text-sm font-bold text-amber-700 mt-1 uppercase">Founded in NYC</div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">50+ years continuous operation</p>
              </div>
              <div className="p-5 bg-white border-2 border-slate-200 rounded-sm shadow-xs">
                <div className="text-3xl sm:text-4xl font-bold text-[#0f2b48] font-heading">410 Morgan</div>
                <div className="text-xs sm:text-sm font-bold text-amber-700 mt-1 uppercase">Brooklyn HQ</div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Expanded fabrication plant</p>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-sm overflow-hidden border-2 border-slate-300 shadow-2xl bg-slate-900">
            <Image
              src="/images/projects/wtc1.png"
              alt="One World Trade Center Signage Project by Signs & Decal Corp."
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-sm bg-white/95 backdrop-blur-md border border-slate-200 text-xs sm:text-sm shadow-lg">
              <p className="font-bold text-[#0f2b48] uppercase font-heading text-base">One World Trade Center Tower 1</p>
              <p className="text-slate-600 font-medium mt-0.5">Outfitted 104 stories of architectural and high-rise life safety signage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 50-Year Company Timeline */}
      <section id="timeline" className="py-20 bg-white px-4 sm:px-8 border-b-2 border-slate-300">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-700">
              <Clock className="w-4 h-4" />
              <span>Historical Milestones</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#0f2b48] tracking-tight font-heading uppercase">
              Five Decades of Innovation &amp; Growth
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              Trace the evolution of Signs &amp; Decal Corp. from a local engraving shop into an enterprise architectural fabrication powerhouse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COMPANY.historyMilestones.map((m) => (
              <div
                key={m.period}
                className="p-6 bg-slate-50 border-2 border-slate-200 rounded-sm relative space-y-4 flex flex-col justify-between hover:border-amber-500 hover:bg-white transition-all shadow-xs"
              >
                <div className="space-y-3">
                  <div className="inline-block px-3 py-1 rounded-sm bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider font-condensed">
                    {m.period}
                  </div>
                  <h3 className="text-xl font-bold text-[#0f2b48] font-heading uppercase leading-snug">
                    {m.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {m.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-[#0f2b48]">
                    Key Highlights:
                  </span>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                    {m.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Credentials & Certifications */}
      <section id="credentials" className="py-20 bg-slate-50 px-4 sm:px-8 border-b-2 border-slate-300">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-700">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Qualifications</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#0f2b48] tracking-tight font-heading uppercase">
              Certifications, Registrations &amp; Standards
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              We maintain active certifications with primary city, state, and port authority agencies, ensuring seamless compliance as a Tier-1 diversity and fabrication partner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMPANY.certifications.map((c) => (
              <div
                key={c.name + c.issuingAuthority}
                className="p-6 bg-white border-2 border-slate-200 rounded-sm space-y-3 hover:border-amber-500 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded bg-amber-500/10 text-amber-700 border border-amber-500/20">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Verified Active
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#0f2b48] font-heading uppercase">
                  {c.name}
                </h3>

                <p className="text-xs sm:text-sm font-bold text-amber-700">
                  {c.issuingAuthority}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 pt-2 border-t border-slate-100 font-normal">
                  {c.scope}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership & Senior Management */}
      <section id="leadership" className="py-20 bg-white px-4 sm:px-8 border-b-2 border-slate-300">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-slate-200 pb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-700">
                <Users className="w-4 h-4" />
                <span>Executive Leadership &amp; Technical Staff</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-[#0f2b48] tracking-tight font-heading uppercase">
                Decades of Specialized Fabrication Experience
              </h2>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                Meet the experienced leadership team directing estimating, CAD engineering, shop fabrication, and union field logistics.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {LEADERSHIP.map((leader) => (
              <div
                key={leader.name}
                className="bg-slate-50 border-2 border-slate-200 rounded-sm overflow-hidden flex flex-col group hover:border-amber-500 hover:shadow-lg transition-all"
              >
                <div className="relative aspect-[4/5] bg-slate-200 overflow-hidden border-b border-slate-200">
                  <Image
                    src={leader.image}
                    alt={`${leader.name} - ${leader.role} at Signs & Decal Corp.`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />
                  {leader.experienceYears && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-sm bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider font-condensed">
                      {leader.experienceYears}
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="font-bold text-lg text-[#0f2b48] group-hover:text-amber-700 transition-colors font-heading uppercase">
                      {leader.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-amber-700 font-bold">
                      {leader.role}
                    </p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
                      {leader.department}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 pt-2 border-t border-slate-200 leading-relaxed font-normal">
                    {leader.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities & Manufacturing Equipment */}
      <section className="py-20 bg-slate-50 px-4 sm:px-8 border-b-2 border-slate-300">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-700">
                <Wrench className="w-4 h-4" />
                <span>Manufacturing Plant</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-[#0f2b48] tracking-tight font-heading uppercase">
                Modern Brooklyn Equipment &amp; High Capacity
              </h2>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                Operating from 410 Morgan Avenue in Brooklyn, our facility integrates high-precision CNC machinery, fiber laser cutters, multi-axis press brakes, automated downdraft spray booths, and dedicated clean assembly rooms.
              </p>
              <ul className="space-y-3 text-sm text-slate-700 font-medium">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Multi-Axis Fiber Laser Cutting:</strong> High-speed sheet cutting across stainless steel, aluminum, brass, and architectural bronze.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Precision CNC Press Brakes:</strong> Hydraulic bending with multi-axis crowning compensation for heavy architectural panels.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Controlled Spray Finishing &amp; Baking Ovens:</strong> Applying high-durability Kynar 500, polyurethane, and anti-graffiti systems.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>SD Works Specialized Steel &amp; Glass:</strong> Expanded sister facility providing structural steel and bullet-resistant glass systems.</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-white border-2 border-slate-300 rounded-sm space-y-6 shadow-md">
              <h3 className="text-xl font-bold text-[#0f2b48] uppercase tracking-wider border-b-2 border-slate-200 pb-3 font-heading">
                Preconstruction &amp; Plant Visits
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                General contractors, architects, and transit authority representatives are welcome to schedule a facility inspection and shop tour to review ongoing fabrication, examine physical material mockups, or witness factory acceptance testing (FAT).
              </p>
              <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-1.5 text-xs sm:text-sm text-slate-700">
                <p className="font-bold text-[#0f2b48] uppercase">Signs &amp; Decal Corp. Headquarters</p>
                <p>410 Morgan Avenue, Brooklyn, NY 11211</p>
                <p>Telephone: (718) 486-6400</p>
                <p>Email: salesteam@signsanddecal.com</p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm uppercase tracking-wider font-condensed rounded-sm transition-all border border-amber-600 shadow"
              >
                <span>Schedule a Shop Inspection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ContactCta />
    </div>
  );
}
