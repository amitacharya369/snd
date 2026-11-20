import React from 'react';
import Link from 'next/link';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 sm:px-8 bg-slate-50 architectural-grid text-center">
      <div className="max-w-xl mx-auto bg-white border border-slate-300 rounded-sm p-8 sm:p-12 shadow-sm space-y-6">
        <div className="inline-block px-3 py-1 rounded bg-amber-500/10 border border-amber-600/30 text-amber-700 font-mono text-xs font-bold tracking-widest uppercase">
          HTTP 404 — ROUTE NOT FOUND
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-[#0f2b48] tracking-tight uppercase font-condensed">
          Requested Page Not Found
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          The architectural route or document you requested does not exist or may have been relocated during our site modernization.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-semibold text-xs uppercase tracking-wider rounded-sm transition-all"
          >
            <Compass className="w-4 h-4 text-amber-600" />
            <span>View Projects</span>
          </Link>
        </div>

        <div className="pt-8 border-t border-slate-200 text-xs text-slate-500 space-y-1">
          <p>Need immediate estimating assistance?</p>
          <p>
            Call us directly at <a href="tel:+17184866400" className="text-amber-700 underline font-medium">(718) 486-6400</a> or email <a href="mailto:salesteam@signsanddecal.com" className="text-amber-700 underline font-medium">salesteam@signsanddecal.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
