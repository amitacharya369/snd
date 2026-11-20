'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MAIN_NAV } from '../data/navigation';
import { COMPANY } from '../data/company';
import { DynamicIcon } from './Icons';
import { Logo } from './Logo';
import { Phone, ChevronDown, Menu, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200">
      {/* Top Pre-Header Bar: Architectural Telemetry & Prequalification */}
      <div className="bg-[#0f2b48] border-b border-slate-700/80 text-xs sm:text-sm text-slate-200 py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-amber-400 text-slate-950 font-bold tracking-wide uppercase text-xs shadow-xs font-sans">
              <ShieldCheck className="w-3.5 h-3.5" />
              Certified MBE Fabricator
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-200 font-semibold text-xs sm:text-sm tracking-wide">
              NYC SBS • NYC SCA • PANYNJ Prequalified
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-slate-300 text-xs sm:text-sm font-mono">
              Plant: 410 Morgan Ave, Brooklyn, NY
            </span>
            <span className="text-slate-500 hidden md:inline">|</span>
            <a
              href={`tel:${COMPANY.headquarters.phoneRaw}`}
              className="inline-flex items-center gap-1.5 text-amber-300 hover:text-white font-bold transition-colors text-xs sm:text-sm tracking-wide font-sans"
              aria-label={`Call Signs & Decal Corp at ${COMPANY.headquarters.phone}`}
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{COMPANY.headquarters.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        aria-label="Main Navigation"
        className={`w-full transition-all duration-200 ${
          scrolled
            ? 'bg-white/98 backdrop-blur-md border-b border-slate-300 shadow-md'
            : 'bg-white border-b border-slate-200 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-20">
          {/* Brand Identity / Official Signs & Decal Corp. Logo */}
          <Link
            href="/"
            className="flex items-center group focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-sm py-1"
            aria-label="Signs & Decal Corp. Home"
          >
            <Logo theme="light" size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {MAIN_NAV.map((item) => {
              const hasChildren = Boolean(item.children && item.children.length > 0);
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const isOpen = activeDropdown === item.label;

              if (hasChildren) {
                return (
                  <div
                    key={item.label}
                    className="relative group"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(isOpen ? null : item.label)}
                      aria-expanded={isOpen}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-[14px] font-sans font-bold uppercase tracking-wider transition-all rounded-sm ${
                        isActive
                          ? 'bg-amber-400/25 text-[#0f2b48] border-b-2 border-amber-500 font-extrabold'
                          : 'text-[#0f2b48] hover:bg-amber-50/90 hover:text-amber-800'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-150 ${
                          isOpen ? 'rotate-180 text-amber-600' : 'text-slate-400'
                        }`}
                      />
                    </button>

                    {/* Mega Dropdown Menu */}
                    {isOpen && (
                      <div className="absolute top-full left-0 w-96 max-w-[90vw] pt-2 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="bg-white border-2 border-slate-300 rounded-sm shadow-2xl p-3 grid gap-1.5">
                          <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 mb-1 flex items-center justify-between rounded-xs">
                            <span className="text-xs uppercase tracking-wider font-extrabold text-[#0f2b48] font-sans">
                              {item.label} Directory
                            </span>
                            <Link
                              href={item.href}
                              className="text-xs text-amber-700 hover:text-amber-800 font-bold inline-flex items-center gap-1 font-sans"
                            >
                              View All <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                          {item.children?.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className="flex items-start gap-3 p-2.5 rounded hover:bg-amber-50 border border-transparent hover:border-amber-300 transition-colors group/item"
                            >
                              {sub.iconName && (
                                <span className="p-2 rounded bg-slate-100 border border-slate-200 text-amber-700 group-hover/item:border-amber-500 group-hover/item:bg-amber-500 group-hover/item:text-slate-950 transition-colors mt-0.5">
                                  <DynamicIcon name={sub.iconName} className="w-4 h-4" />
                                </span>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-[#0f2b48] group-hover/item:text-amber-700 transition-colors font-sans">
                                  {sub.label}
                                </div>
                                {sub.description && (
                                  <div className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                                    {sub.description}
                                  </div>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-3 py-2 text-[14px] font-sans font-bold uppercase tracking-wider transition-all rounded-sm flex items-center ${
                    isActive
                      ? 'bg-amber-400/25 text-[#0f2b48] border-b-2 border-amber-500 font-extrabold'
                      : 'text-[#0f2b48] hover:bg-amber-50/90 hover:text-amber-800'
                  }`}
                >
                  {/* Quality & Delivery strictly on 2 lines with balanced line-height */}
                  {item.label === 'Quality & Delivery' ? (
                    <span className="leading-[1.15] text-left inline-block">
                      <span className="block whitespace-nowrap">Quality &amp;</span>
                      <span className="block whitespace-nowrap">Delivery</span>
                    </span>
                  ) : (
                    <span className="whitespace-nowrap">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Seductive / High-Emphasis "Request a Quote" Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/contact"
              className="relative group inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-sm font-sans font-extrabold text-[13px] tracking-wider uppercase text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 bg-[length:200%_auto] hover:bg-right transition-all duration-300 shadow-md shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0 border-2 border-amber-300"
            >
              {/* Pulsing Beacon / Radar Dot */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950" />
              </span>

              <span>Request a Quote</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-[#0f2b48] hover:bg-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-200 bg-white px-4 py-6 max-h-[calc(100vh-5rem)] overflow-y-auto shadow-2xl">
            <div className="space-y-4">
              {MAIN_NAV.map((item) => (
                <div key={item.label} className="border-b border-slate-200 pb-3">
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base font-bold text-[#0f2b48] hover:text-amber-700 py-1 uppercase font-sans tracking-wide"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-3 mt-2 space-y-2 border-l-2 border-amber-500">
                      {item.children.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-sm text-slate-700 hover:text-amber-700 py-1 font-medium font-sans"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-2">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-slate-950 font-sans font-extrabold text-sm tracking-wider uppercase rounded-sm shadow-lg shadow-amber-500/30 active:translate-y-0.5 border-2 border-amber-300 transition-all"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-950" />
                  </span>
                  <span>Request a Quote / Project Bid</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="pt-4 text-xs text-slate-600 space-y-1 border-t border-slate-200 font-mono">
                <p className="font-bold text-[#0f2b48] uppercase font-sans">Signs &amp; Decal Corp. (S+D)</p>
                <p>410 Morgan Avenue, Brooklyn, NY 11211</p>
                <p>Telephone: (718) 486-6400</p>
                <p>Email: salesteam@signsanddecal.com</p>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
