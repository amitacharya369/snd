import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '../../components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms and conditions governing the use of Signs & Decal Corp.’s corporate website and intellectual property.',
};

export default function TermsOfUsePage() {
  return (
    <div className="flex flex-col bg-slate-50">
      <section className="bg-slate-100 border-b border-slate-300 py-16 px-4 sm:px-8 architectural-grid">
        <div className="max-w-5xl mx-auto space-y-4">
          <Breadcrumbs items={[{ label: 'Terms of Use' }]} />
          <h1 className="text-3xl sm:text-5xl font-bold text-[#0f2b48] tracking-tight uppercase font-condensed">
            Terms of Use
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Effective Date: October 2026 • Signs &amp; Decal Corp.
          </p>
        </div>
      </section>

      <section className="py-16 bg-slate-50 px-4 sm:px-8 border-b border-slate-200">
        <div className="max-w-4xl mx-auto bg-white border border-slate-300 rounded-sm p-8 sm:p-12 shadow-sm space-y-8 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <div className="space-y-3">
            <h2 className="text-base font-bold text-[#0f2b48] uppercase tracking-wider font-condensed border-b border-slate-200 pb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using this website, you agree to comply with and be bound by these Terms of Use. If you do not agree to these terms, please refrain from using this website.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-[#0f2b48] uppercase tracking-wider font-condensed border-b border-slate-200 pb-2">
              2. Intellectual Property Rights
            </h2>
            <p>
              All content on this website—including text, project descriptions, technical specifications, photography, graphics, logos, and custom icons—is the proprietary intellectual property of Signs &amp; Decal Corp. or its respective clients and partners, and is protected under United States and international copyright and trademark laws.
            </p>
            <p>
              No material from this site may be copied, reproduced, republished, uploaded, posted, transmitted, or distributed in any way without prior written permission from Signs &amp; Decal Corp.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-[#0f2b48] uppercase tracking-wider font-condensed border-b border-slate-200 pb-2">
              3. Project Inquiries &amp; Non-Binding Quotations
            </h2>
            <p>
              Information submitted via our contact forms does not create a binding construction contract or sub-contractual obligation. Formal bids, proposals, and pricing are subject to detailed drawing review, contract terms, union jurisdiction determinations, and formal execution by authorized corporate officers.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-[#0f2b48] uppercase tracking-wider font-condensed border-b border-slate-200 pb-2">
              4. Governing Law &amp; Jurisdiction
            </h2>
            <p>
              These Terms of Use shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions. Any legal action arising from the use of this website shall be filed exclusively in the state or federal courts located in Kings County (Brooklyn) or New York County (Manhattan), New York.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
