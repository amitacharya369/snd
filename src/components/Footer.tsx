import React from 'react';
import Link from 'next/link';
import { COMPANY } from '../data/company';
import { FOOTER_LINKS } from '../data/navigation';
import { Logo } from './Logo';
import { Phone, Mail, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t-4 border-amber-500" aria-label="Footer">
      {/* Upper Industrial Trust Bar */}
      <div className="border-b border-slate-800 bg-[#0f2b48] py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-sm bg-amber-500 text-slate-950 shrink-0 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-condensed">
                Certified MBE Fabricator
              </h3>
              <p className="text-sm text-slate-200 mt-1 leading-relaxed">
                Certified Minority Business Enterprise with NYC Department of Small Business Services (SBS), NYC School Construction Authority (SCA), and PANYNJ.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-sm bg-slate-800 border border-slate-700 text-amber-400 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-condensed">
                Brooklyn Fabrication Plant
              </h3>
              <p className="text-sm text-slate-200 mt-1 leading-relaxed">
                410 Morgan Avenue, Brooklyn, NY 11211. In-house CNC cutting, heavy metal forming, spray finishing booths, and clean room assembly.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-sm bg-slate-800 border border-slate-700 text-amber-400 shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-condensed">
                Direct Estimating &amp; Sales
              </h3>
              <p className="text-sm text-slate-200 mt-1 leading-relaxed">
                (718) 486-6400 • salesteam@signsanddecal.com. Union field installation and rapid preconstruction bid takeoffs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Navigation Columns */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand & Corporate Overview */}
        <div className="lg:col-span-2 space-y-5">
          <Logo theme="dark" size="lg" />

          <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
            Signs &amp; Decal Corp. (S+D) is a premier architectural signage contractor and specialty fabricator based in Brooklyn, New York. Over five decades, we have engineered landmark wayfinding and metalwork for New York’s airports, rail terminals, stadiums, and high-rise commercial towers.
          </p>

          <div className="pt-2 text-sm space-y-2 text-slate-200">
            <p className="flex items-start gap-2">
              <span className="text-amber-400 font-bold uppercase text-xs shrink-0 mt-0.5">Plant:</span>
              <a 
                href={COMPANY.headquarters.mapsUrl}
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-amber-400 underline decoration-slate-600"
              >
                {COMPANY.headquarters.street}, {COMPANY.headquarters.city}, {COMPANY.headquarters.state} {COMPANY.headquarters.zip}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-amber-400 font-bold uppercase text-xs">Phone:</span>
              <a href={`tel:${COMPANY.headquarters.phoneRaw}`} className="hover:text-amber-400 font-bold">
                {COMPANY.headquarters.phone}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-amber-400 font-bold uppercase text-xs">Estimating:</span>
              <a href={`mailto:${COMPANY.headquarters.email}`} className="hover:text-amber-400 font-mono">
                {COMPANY.headquarters.email}
              </a>
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200 font-semibold">Affiliated Manufacturing Facility:</strong> {COMPANY.affiliatedBrand.name} provides specialized structural steel, AISC-certified heavy metal, and high-performance architectural glass fabrication.
            </p>
          </div>
        </div>

        {/* Capabilities Column */}
        <div>
          <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2.5 font-condensed">
            Trade Capabilities
          </h4>
          <ul className="space-y-2.5 text-sm">
            {FOOTER_LINKS.capabilities.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-amber-400 transition-colors inline-block text-slate-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Selected Landmark Projects */}
        <div>
          <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2.5 font-condensed">
            Featured Projects
          </h4>
          <ul className="space-y-2.5 text-sm">
            {FOOTER_LINKS.projects.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-amber-400 transition-colors inline-block text-slate-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company & Preconstruction */}
        <div>
          <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2.5 font-condensed">
            Preconstruction
          </h4>
          <ul className="space-y-2.5 text-sm">
            {FOOTER_LINKS.company.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-amber-400 transition-colors inline-block text-slate-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-400 hover:text-amber-300 group uppercase tracking-wider font-condensed"
            >
              <span>Submit Plans &amp; Specs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-slate-800 bg-slate-950 py-6 px-4 sm:px-8 text-xs sm:text-sm text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © 1971 – 2026 Signs &amp; Decal Corp. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-6">
            {FOOTER_LINKS.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="hover:text-amber-400 text-slate-400 font-bold transition-colors flex items-center gap-1"
            >
              <span>Admin Portal</span>
            </Link>
            <span className="text-slate-500">Brooklyn, New York</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
