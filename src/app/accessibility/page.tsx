import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Accessibility Statement',
  description: 'Signs & Decal Corp.’s commitment to digital accessibility, WCAG 2.2 Level AA guidelines, and instructions for reporting digital barriers.',
};

export default function AccessibilityPage() {
  return (
    <div className="flex flex-col bg-slate-50">
      <section className="bg-slate-100 border-b border-slate-300 py-16 px-4 sm:px-8 architectural-grid">
        <div className="max-w-5xl mx-auto space-y-4">
          <Breadcrumbs items={[{ label: 'Accessibility Statement' }]} />
          <h1 className="text-3xl sm:text-5xl font-bold text-[#0f2b48] tracking-tight uppercase font-condensed">
            Digital Accessibility Statement
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Conforming to WCAG 2.2 Level AA Standards • Signs &amp; Decal Corp.
          </p>
        </div>
      </section>

      <section className="py-16 bg-slate-50 px-4 sm:px-8 border-b border-slate-200">
        <div className="max-w-4xl mx-auto bg-white border border-slate-300 rounded-sm p-8 sm:p-12 shadow-sm space-y-10 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <div className="space-y-3">
            <h2 className="text-base font-bold text-[#0f2b48] uppercase tracking-wider font-condensed border-b border-slate-200 pb-2">
              Our Accessibility Commitment
            </h2>
            <p>
              Signs &amp; Decal Corp. is dedicated to ensuring digital accessibility for people of all abilities. As a premier fabricator of tactile Braille and ADA-compliant architectural signage for public facilities and transit hubs, we bring the same rigorous standards of accessibility to our online presence.
            </p>
            <p>
              We continuously audit and improve the user experience for everyone, applying relevant Web Content Accessibility Guidelines (WCAG 2.2, Level AA) as our benchmark.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-base font-bold text-[#0f2b48] uppercase tracking-wider font-condensed border-b border-slate-200 pb-2">
              Implemented Technical Accessibility Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Keyboard Navigation</span>
                </div>
                <p className="text-xs text-slate-600">
                  Full keyboard navigation across all menus, form inputs, and interactive components with visible, high-contrast focus rings.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Screen-Reader Landmarks</span>
                </div>
                <p className="text-xs text-slate-600">
                  Semantic HTML5 landmark tags (header, nav, main, footer, article, section) ensuring effortless assistive tech orientation.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Color Contrast Compliance</span>
                </div>
                <p className="text-xs text-slate-600">
                  Carefully calibrated contrast ratios exceeding the 4.5:1 minimum standard for all body copy and text elements.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Descriptive Alternative Text</span>
                </div>
                <p className="text-xs text-slate-600">
                  Every meaningful image and portfolio photograph incorporates accurate, descriptive alternative text.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Reduced Motion Support</span>
                </div>
                <p className="text-xs text-slate-600">
                  Respects system preferences for reduced motion, disabling all non-essential visual transitions and animations.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Accessible Form Feedback</span>
                </div>
                <p className="text-xs text-slate-600">
                  Contact forms provide semantic labeling, explicit error descriptions, and dynamic aria-live announcements.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-base font-bold text-[#0f2b48] uppercase tracking-wider font-condensed border-b border-slate-200 pb-2">
              Feedback &amp; Reporting Digital Barriers
            </h2>
            <p>
              We welcome your feedback on the accessibility of our website. If you encounter any accessibility barriers or have difficulty using any part of this site, please let us know:
            </p>
            <div className="p-6 bg-slate-50 border border-slate-200 rounded space-y-3">
              <p className="font-semibold text-slate-900">Signs &amp; Decal Corp. Accessibility Coordinator</p>
              <div className="space-y-1 text-xs text-slate-700">
                <p>Telephone: (718) 486-6400</p>
                <p>
                  Email:{' '}
                  <a
                    href="mailto:salesteam@signsanddecal.com?subject=Accessibility Feedback"
                    className="text-amber-700 hover:text-amber-800 underline font-medium"
                  >
                    salesteam@signsanddecal.com (Subject: Accessibility Feedback)
                  </a>
                </p>
                <p>Address: 410 Morgan Avenue, Brooklyn, NY 11211</p>
              </div>
              <p className="text-[11px] text-slate-500 pt-2">
                We make every effort to respond to accessibility inquiries within two business days.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
