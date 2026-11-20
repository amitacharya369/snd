import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '../../components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Signs & Decal Corp. outlining how project inquiry data and technical web metrics are collected, stored, and protected.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col bg-slate-50">
      <section className="bg-slate-100 border-b border-slate-300 py-16 px-4 sm:px-8 architectural-grid">
        <div className="max-w-5xl mx-auto space-y-4">
          <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />
          <h1 className="text-3xl sm:text-5xl font-bold text-[#0f2b48] tracking-tight uppercase font-condensed">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Last Updated: October 2026 • Signs &amp; Decal Corp.
          </p>
        </div>
      </section>

      <section className="py-16 bg-slate-50 px-4 sm:px-8 border-b border-slate-200">
        <div className="max-w-4xl mx-auto bg-white border border-slate-300 rounded-sm p-8 sm:p-12 shadow-sm space-y-8 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <div className="space-y-3">
            <h2 className="text-base font-bold text-[#0f2b48] uppercase tracking-wider font-condensed border-b border-slate-200 pb-2">
              1. Information We Collect
            </h2>
            <p>
              Signs &amp; Decal Corp. (“S+D”, “we”, “our”, or “us”) is a business-to-business architectural fabrication contractor. We collect only the information necessary to evaluate project inquiries, prepare preconstruction estimates, and communicate with contractors, architects, and public authorities.
            </p>
            <p>
              When you submit a project inquiry via our contact form, we collect your name, business email address, telephone number, company affiliation, project location, anticipated timeline, and project scope details.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-[#0f2b48] uppercase tracking-wider font-condensed border-b border-slate-200 pb-2">
              2. How We Use Collected Information
            </h2>
            <p>
              The information you provide is utilized solely for:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Preparing bid proposals, cost estimates, and technical submittals.</li>
              <li>Coordinating preconstruction planning and scheduling site mockups.</li>
              <li>Responding to specific technical, material, or employment inquiries.</li>
              <li>Maintaining internal records of contractor bid invitations.</li>
            </ul>
            <p>
              We do not sell, rent, monetize, or trade your contact information with any third-party marketing brokers.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-[#0f2b48] uppercase tracking-wider font-condensed border-b border-slate-200 pb-2">
              3. Server Logs &amp; Technical Security
            </h2>
            <p>
              Our web servers record standard technical metrics, such as IP addresses (masked for privacy), browser user agents, and page response times. These logs are used strictly for cybersecurity defense, spam prevention, rate limiting, and system monitoring.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-[#0f2b48] uppercase tracking-wider font-condensed border-b border-slate-200 pb-2">
              4. Cookies &amp; Tracking
            </h2>
            <p>
              Our website uses strictly necessary session cookies required for core navigation, security token validation, and form abuse prevention. We do not use third-party invasive behavioral advertising cookies.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-[#0f2b48] uppercase tracking-wider font-condensed border-b border-slate-200 pb-2">
              5. Contact Us Regarding Your Data
            </h2>
            <p>
              If you have any questions regarding this Privacy Policy or wish to review, update, or delete project correspondence, please contact:
            </p>
            <div className="p-4 bg-slate-50 rounded border border-slate-200 text-xs text-slate-700 space-y-1">
              <p className="font-semibold text-slate-900">Signs &amp; Decal Corp. — Administration</p>
              <p>410 Morgan Avenue, Brooklyn, NY 11211</p>
              <p>Telephone: (718) 486-6400</p>
              <p>Email: salesteam@signsanddecal.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
