'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface FormData {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  projectLocation: string;
  timeline: string;
  message: string;
  _hp_company_fax: string; // Honeypot field
}

export function ContactFormClient() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    projectType: 'Architectural Signage & Wayfinding',
    projectLocation: '',
    timeline: 'Within 30 Days (Active Bid)',
    message: '',
    _hp_company_fax: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successInfo, setSuccessInfo] = useState<{ message: string; refId?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    // Quick client-side sanity checks
    if (!formData.fullName.trim() || formData.fullName.length < 2) {
      setStatus('error');
      setErrorMessage('Please provide your full name.');
      return;
    }
    if (!formData.company.trim() || formData.company.length < 2) {
      setStatus('error');
      setErrorMessage('Please provide your company or contracting organization.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please provide a valid corporate or business email.');
      return;
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      setStatus('error');
      setErrorMessage('Please include project scope details or questions (at least 10 characters).');
      return;
    }

    try {
      const res = await fetch('/api/inquire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Server rejected the submission.');
      }

      setStatus('success');
      setSuccessInfo({
        message: data.message,
        refId: data.referenceId,
      });

      // Clear form
      setFormData({
        fullName: '',
        company: '',
        email: '',
        phone: '',
        projectType: 'Architectural Signage & Wayfinding',
        projectLocation: '',
        timeline: 'Within 30 Days (Active Bid)',
        message: '',
        _hp_company_fax: '',
      });
    } catch (err: unknown) {
      setStatus('error');
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to send inquiry. Please telephone (718) 486-6400 or email salesteam@signsanddecal.com directly.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Live Region for Screen Readers */}
      <div aria-live="polite" className="sr-only">
        {status === 'submitting' && 'Submitting your inquiry...'}
        {status === 'success' && 'Inquiry submitted successfully.'}
        {status === 'error' && `Error: ${errorMessage}`}
      </div>

      {/* Honeypot anti-spam trap (invisible to human users) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="_hp_company_fax">Leave this field blank</label>
        <input
          id="_hp_company_fax"
          type="text"
          name="_hp_company_fax"
          tabIndex={-1}
          autoComplete="off"
          value={formData._hp_company_fax}
          onChange={(e) => setFormData({ ...formData, _hp_company_fax: e.target.value })}
        />
      </div>

      {/* Success Notification */}
      {status === 'success' && successInfo && (
        <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-sm space-y-2 text-emerald-900">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Inquiry Received Successfully</span>
          </div>
          <p className="text-sm leading-relaxed text-emerald-800">
            {successInfo.message}
          </p>
          {successInfo.refId && (
            <p className="text-xs font-mono text-emerald-700 pt-1 font-semibold">
              Reference ID: {successInfo.refId}
            </p>
          )}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="text-xs sm:text-sm underline text-emerald-800 hover:text-emerald-950 font-semibold"
            >
              Submit Another Inquiry
            </button>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {status === 'error' && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-sm flex items-start gap-3 text-red-900 text-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-red-800">Submission Error</span>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="block text-xs sm:text-sm font-bold text-[#0f2b48] uppercase tracking-wider font-condensed">
            Your Name <span className="text-amber-600">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            required
            autoComplete="name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="John Smith"
            className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
          />
        </div>

        {/* Company / Organization */}
        <div className="space-y-1.5">
          <label htmlFor="company" className="block text-xs sm:text-sm font-bold text-[#0f2b48] uppercase tracking-wider font-condensed">
            Company / Contractor <span className="text-amber-600">*</span>
          </label>
          <input
            id="company"
            type="text"
            required
            autoComplete="organization"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Skanska / AECOM / Turner / Architecture Studio"
            className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
          />
        </div>

        {/* Corporate Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-[#0f2b48] uppercase tracking-wider font-condensed">
            Business Email <span className="text-amber-600">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="jsmith@contracting-firm.com"
            className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <label htmlFor="phone" className="block text-xs sm:text-sm font-bold text-[#0f2b48] uppercase tracking-wider font-condensed">
            Telephone Number <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="(212) 555-0199"
            className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
          />
        </div>

        {/* Project Type */}
        <div className="space-y-1.5">
          <label htmlFor="projectType" className="block text-xs sm:text-sm font-bold text-[#0f2b48] uppercase tracking-wider font-condensed">
            Primary Discipline / Scope
          </label>
          <select
            id="projectType"
            value={formData.projectType}
            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
            className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="Architectural Signage & Wayfinding">Architectural Signage &amp; Wayfinding</option>
            <option value="Interior Signage & ADA Compliance">Interior Signage &amp; ADA Compliance</option>
            <option value="Exterior & Monument Signage">Exterior &amp; Monument Signage</option>
            <option value="Illuminated & LED Systems">Illuminated &amp; LED Systems</option>
            <option value="Vinyl & Environmental Graphics">Vinyl &amp; Environmental Graphics</option>
            <option value="Miscellaneous & Architectural Metal">Miscellaneous &amp; Architectural Metal</option>
            <option value="Architectural Glass & Glazing Systems">Architectural Glass &amp; Glazing Systems</option>
            <option value="Interior Partitions & Demountable Walls">Interior Partitions &amp; Demountable Walls</option>
            <option value="Turnkey Fabrication & Union Installation">Turnkey Fabrication &amp; Union Installation</option>
          </select>
        </div>

        {/* Project Location */}
        <div className="space-y-1.5">
          <label htmlFor="projectLocation" className="block text-xs sm:text-sm font-bold text-[#0f2b48] uppercase tracking-wider font-condensed">
            Project Location <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            id="projectLocation"
            type="text"
            value={formData.projectLocation}
            onChange={(e) => setFormData({ ...formData, projectLocation: e.target.value })}
            placeholder="e.g. New York, NY / Newark, NJ"
            className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Timeline Selection */}
      <div className="space-y-1.5">
        <label htmlFor="timeline" className="block text-xs sm:text-sm font-bold text-[#0f2b48] uppercase tracking-wider font-condensed">
          Anticipated Bidding / Construction Timeline
        </label>
        <select
          id="timeline"
          value={formData.timeline}
          onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
          className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 cursor-pointer"
        >
          <option value="Within 30 Days (Active Bid)">Within 30 Days (Active Bid)</option>
          <option value="1 - 3 Months (Preconstruction)">1 – 3 Months (Preconstruction / Budgeting)</option>
          <option value="3 - 6 Months (Planning & Design)">3 – 6 Months (Planning &amp; Design Coordination)</option>
          <option value="Immediate Repair / Maintenance">Immediate Repair / Maintenance</option>
        </select>
      </div>

      {/* Message / Scope Description */}
      <div className="space-y-1.5">
        <label htmlFor="message" className="block text-xs sm:text-sm font-bold text-[#0f2b48] uppercase tracking-wider font-condensed">
          Project Scope Description &amp; Specifications <span className="text-amber-600">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Please describe project scope, dimensions, specified materials, drawings link (Dropbox/Procore), or specific bidding requirements..."
          className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 leading-relaxed transition-colors"
        />
        <p className="text-xs text-slate-500">
          For large drawing sets or BIM models, please include a secure download link (Procore, OneDrive, Box, Dropbox) in the scope description.
        </p>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 bg-[length:200%_auto] hover:bg-right disabled:bg-slate-200 disabled:text-slate-400 text-slate-950 font-sans font-extrabold text-sm sm:text-base tracking-wider uppercase rounded-sm transition-all duration-300 shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/50 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:cursor-not-allowed border-2 border-amber-300"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Transmitting Inquiry...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Project Inquiry</span>
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        By submitting this form, you acknowledge that project information is collected solely to evaluate your inquiry and prepare competitive bids in accordance with our{' '}
        <a href="/privacy-policy" className="underline hover:text-slate-800 font-semibold">
          Privacy Policy
        </a>
        . We never sell or share corporate contact information.
      </p>
    </form>
  );
}
