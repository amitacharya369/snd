import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { addInquiry, InquirySource } from '../../../lib/storage';

// In-memory token bucket rate limiter
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

// Clean up old rate limit entries every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.lastReset > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  }
}, 30 * 60 * 1000);

function sanitizeInput(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // strip html tags
    .replace(/[\r\n]+/g, ' ') // prevent header injection
    .trim();
}

function sanitizeMultiLine(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim();
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting by IP
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    const now = Date.now();

    const rateEntry = rateLimitMap.get(ip) || { count: 0, lastReset: now };
    if (now - rateEntry.lastReset > RATE_LIMIT_WINDOW_MS) {
      rateEntry.count = 0;
      rateEntry.lastReset = now;
    }

    rateEntry.count += 1;
    rateLimitMap.set(ip, rateEntry);

    if (rateEntry.count > MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        { error: 'Too many inquiries submitted from this connection. Please wait 10 minutes or telephone our office directly.' },
        { status: 429 }
      );
    }

    // 2. Parse body
    const body = await req.json();

    // 3. Honeypot check (hidden bot field)
    if (body._hp_company_fax && body._hp_company_fax.trim() !== '') {
      // Silently reject spam bots with generic success
      return NextResponse.json({ success: true, delivered: true });
    }

    // 4. Validate & sanitize required fields
    const fullName = sanitizeInput(body.fullName);
    const company = sanitizeInput(body.company);
    const email = sanitizeInput(body.email).toLowerCase();
    const phone = sanitizeInput(body.phone);
    const projectType = sanitizeInput(body.projectType);
    const projectLocation = sanitizeInput(body.projectLocation);
    const timeline = sanitizeInput(body.timeline);
    const message = sanitizeMultiLine(body.message);

    if (!fullName || fullName.length < 2 || fullName.length > 80) {
      return NextResponse.json({ error: 'Please provide a valid contact name (2-80 characters).' }, { status: 400 });
    }

    if (!company || company.length < 2 || company.length > 100) {
      return NextResponse.json({ error: 'Please provide a valid company or organization name.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email) || email.length > 100) {
      return NextResponse.json({ error: 'Please provide a valid corporate or business email address.' }, { status: 400 });
    }

    if (!message || message.length < 10 || message.length > 3000) {
      return NextResponse.json({ error: 'Please include project details or scope description (at least 10 characters).' }, { status: 400 });
    }

    const source: InquirySource = body.source === 'Quote Request' ? 'Quote Request' : 'Contact Form';
    
    // Save to persistent Inquiries CRM Store
    const savedInquiry = addInquiry({
      fullName,
      company,
      email,
      phone,
      projectType,
      projectLocation,
      timeline,
      budget: body.budget,
      message,
      source,
    });

    const inquiryRecord = {
      id: savedInquiry.id,
      timestamp: savedInquiry.createdAt,
      fullName,
      company,
      email,
      phone: phone || 'Not provided',
      projectType: projectType || 'General Architectural Inquiry',
      projectLocation: projectLocation || 'Unspecified',
      timeline: timeline || 'Standard Bid Timeline',
      messageLength: message.length,
      ipSubnet: ip.split('.').slice(0, 2).join('.') + '.x.x',
    };

    // 5. Server-Side Audit Logging
    const isSmtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);

    try {
      const logDir = path.join(process.cwd(), '.inquiries_log');
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      const logFile = path.join(logDir, 'inquiries_audit.jsonl');
      fs.appendFileSync(logFile, JSON.stringify(inquiryRecord) + '\n');
    } catch (logErr) {
      console.error('Audit log write error:', logErr);
    }

    return NextResponse.json({
      success: true,
      delivered: isSmtpConfigured,
      message: isSmtpConfigured
        ? 'Your project inquiry has been delivered directly to our estimating team.'
        : 'Your project inquiry has been securely recorded on the server. Our estimating team at salesteam@signsanddecal.com will review it shortly.',
      referenceId: savedInquiry.id,
    });
  } catch (err: unknown) {
    console.error('Inquiry API Error:', err);
    return NextResponse.json(
      { error: 'An unexpected server error occurred while processing your inquiry. Please email salesteam@signsanddecal.com directly.' },
      { status: 500 }
    );
  }
}
