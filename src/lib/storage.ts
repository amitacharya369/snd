import fs from 'fs';
import path from 'path';
import { COMPANY } from '../data/company';

export interface SiteConfig {
  companyName: string;
  tagline: string;
  foundingYear: number;
  phone: string;
  salesEmail: string;
  notificationEmails: string[];
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  mbeCertificationText: string;
  hero: {
    badgeText: string;
    headline: string;
    subheadline: string;
    primaryCtaText: string;
    secondaryCtaText: string;
  };
  operatingStats: Array<{
    label: string;
    value: string;
    detail: string;
  }>;
  chatbot: {
    enabled: boolean;
    name?: string;
    avatarUrl?: string;
    welcomeMessage: string;
    escalationEmail: string;
    geminiApiKey?: string;
  };
}

export type InquiryStatus =
  | 'NEW'
  | 'IN_REVIEW'
  | 'FORWARDED_TO_SALES'
  | 'RESPONDED'
  | 'REJECTED'
  | 'WON';

export type InquirySource = 'Quote Request' | 'Contact Form' | 'AI Chatbot';

export interface Inquiry {
  id: string;
  createdAt: string;
  updatedAt: string;
  source: InquirySource;
  status: InquiryStatus;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  projectLocation: string;
  timeline?: string;
  budget?: string;
  message: string;
  chatSummary?: string;
  chatTranscript?: Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }>;
  internalNotes?: string;
  assignedTo?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'site-config.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    // Read-only filesystem in serverless environments (e.g. Vercel)
  }
}

export function getDefaultSiteConfig(): SiteConfig {
  return {
    companyName: COMPANY.legalName,
    tagline: COMPANY.tagline,
    foundingYear: COMPANY.foundingYear,
    phone: COMPANY.headquarters.phone,
    salesEmail: COMPANY.headquarters.email,
    notificationEmails: ['salesteam@signsanddecal.com', 'estimating@signsanddecal.com'],
    address: {
      street: COMPANY.headquarters.street,
      city: COMPANY.headquarters.city,
      state: COMPANY.headquarters.state,
      zip: COMPANY.headquarters.zip,
    },
    mbeCertificationText: 'Certified MBE Architectural Fabricator (NYC SBS, SCA & PANYNJ)',
    hero: {
      badgeText: 'Est. 1971 in Brooklyn, NY • Certified MBE Architectural Fabricator',
      headline: 'Architectural Signage, Metal & Glass Fabrication for Construction.',
      subheadline:
        'For over 50 years, Signs & Decal Corp. (S+D) has engineered, fabricated, and installed monumental wayfinding, structural glass, and specialty architectural metals for New York’s premier general contractors, transit agencies, and commercial developers.',
      primaryCtaText: 'Request a Quote / Project Bid',
      secondaryCtaText: 'Explore Landmark Work',
    },
    operatingStats: COMPANY.operatingStats,
    chatbot: {
      enabled: true,
      name: 'Sandra',
      avatarUrl: '/images/team/sandra.png',
      welcomeMessage: 'Hey I am Sandra from SND, how can I help you?',
      escalationEmail: 'salesteam@signsanddecal.com',
      geminiApiKey: '',
    },
  };
}

export function getSiteConfig(): SiteConfig {
  ensureDataDir();
  if (!fs.existsSync(CONFIG_FILE)) {
    const defaultConfig = getDefaultSiteConfig();
    try {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2), 'utf-8');
    } catch {
      // Ignored in read-only environment
    }
    return defaultConfig;
  }
  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading site config, returning default:', err);
    return getDefaultSiteConfig();
  }
}

export function saveSiteConfig(config: Partial<SiteConfig>): SiteConfig {
  const current = getSiteConfig();
  const updated: SiteConfig = {
    ...current,
    ...config,
    address: {
      ...current.address,
      ...(config.address || {}),
    },
    hero: {
      ...current.hero,
      ...(config.hero || {}),
    },
    chatbot: {
      ...current.chatbot,
      ...(config.chatbot || {}),
    },
  };
  try {
    ensureDataDir();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist site config to disk (read-only environment):', err);
  }
  return updated;
}

export function getDefaultInquiries(): Inquiry[] {
  return [
    {
      id: 'INQ-1001',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      source: 'Quote Request',
      status: 'IN_REVIEW',
      fullName: 'Marcus Vance',
      company: 'Skanska USA Building Inc.',
      email: 'm.vance@skanska.com',
      phone: '(212) 555-0142',
      projectType: 'Aviation Wayfinding & Exterior Canopies',
      projectLocation: 'Queens, NY (JFK New Terminal One)',
      timeline: 'Q3 2026',
      budget: '$250k - $500k',
      message:
        'Seeking qualified MBE fabricator for CSI Div 10 14 00 signage package and stainless steel directional pylons. Architectural drawings in review.',
      internalNotes: 'Drawings downloaded. Estimator assigned. Certified MBE documentation verified.',
      assignedTo: 'Haas Khalfan',
    },
    {
      id: 'INQ-1002',
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      source: 'AI Chatbot',
      status: 'FORWARDED_TO_SALES',
      fullName: 'Elena Rostova',
      company: 'AECOM Tishman',
      email: 'elena.rostova@aecom.com',
      phone: '(917) 555-8931',
      projectType: 'Architectural Metal & Glass Partitions',
      projectLocation: 'Midtown Manhattan Commercial Tower',
      timeline: 'Immediate / Next Month',
      budget: '$100k - $250k',
      message: 'Need illuminated lobby tenant directories and custom bronze glass partition trim.',
      chatSummary:
        'Client consulted with AI assistant regarding custom bronze finishes and lead times for 599 Lex refurbishment. AI summarized scope and confirmed 100% union installation capability.',
      internalNotes: 'Forwarded to Carlos Colon for site survey and engineering takeoff.',
      assignedTo: 'Carlos Colon',
    },
    {
      id: 'INQ-1003',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      source: 'Contact Form',
      status: 'RESPONDED',
      fullName: 'David O’Connor',
      company: 'MTA Capital Construction / NYCT',
      email: 'doconnor@mtacc.info',
      phone: '(718) 555-6674',
      projectType: 'Subway Station Enamel Wayfinding',
      projectLocation: 'Brooklyn & Manhattan Stations',
      timeline: 'Standard Bid Timeline',
      message:
        'Submitting request for porcelain enamel platform signage and tactile ADA braille plaques complying with MTA Section 17 standards.',
      internalNotes: 'Bid proposal #SD-2026-MTA-44 sent via email on Thursday. Follow up scheduled next week.',
      assignedTo: 'Babu Khalfan',
    },
    {
      id: 'INQ-1004',
      createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 50).toISOString(),
      source: 'Quote Request',
      status: 'WON',
      fullName: 'Robert Sterling',
      company: 'Tutor Perini Corp.',
      email: 'rsterling@tutorperini.com',
      phone: '(212) 555-4309',
      projectType: 'Monumental Transit Pylons & Escalator Cladding',
      projectLocation: 'Newark Liberty International Airport',
      timeline: 'Underway',
      budget: '$500k+',
      message: 'Executed subcontract for heavy stainless steel escalator cladding and overhead signage gantries.',
      internalNotes: 'Subcontract signed. Shop drawings approved. Fabrication in progress at Morgan Ave plant.',
      assignedTo: 'Haas Khalfan',
    },
    {
      id: 'INQ-1005',
      createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 90).toISOString(),
      source: 'Contact Form',
      status: 'REJECTED',
      fullName: 'Unknown Inquirer',
      company: 'Residential Sign Shop',
      email: 'signs4u@freemail.com',
      phone: 'Not provided',
      projectType: 'Vinyl Banners for Garage Sale',
      projectLocation: 'Ohio',
      timeline: 'Tomorrow',
      message: 'Can you print 2 plastic banners for $50 by tomorrow morning?',
      internalNotes: 'Disqualified: Residential small sign, outside commercial architectural fabrication scope.',
    },
  ];
}

export function getInquiries(): Inquiry[] {
  ensureDataDir();
  if (!fs.existsSync(INQUIRIES_FILE)) {
    const defaults = getDefaultInquiries();
    try {
      fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(defaults, null, 2), 'utf-8');
    } catch {
      // Ignored in read-only environment
    }
    return defaults;
  }
  try {
    const raw = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
    const items: Inquiry[] = JSON.parse(raw);
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error('Error reading inquiries, returning defaults:', err);
    return getDefaultInquiries();
  }
}

export function saveInquiries(inquiries: Inquiry[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist inquiries to disk (read-only environment):', err);
  }
}

export function addInquiry(data: {
  fullName: string;
  company: string;
  email: string;
  phone?: string;
  projectType?: string;
  projectLocation?: string;
  timeline?: string;
  budget?: string;
  message: string;
  source: InquirySource;
  chatSummary?: string;
  chatTranscript?: Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }>;
}): Inquiry {
  const inquiries = getInquiries();
  const newId = `INQ-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  const newInquiry: Inquiry = {
    id: newId,
    createdAt: now,
    updatedAt: now,
    source: data.source,
    status: 'NEW',
    fullName: data.fullName,
    company: data.company,
    email: data.email,
    phone: data.phone || 'Not provided',
    projectType: data.projectType || 'Architectural Signage / Metal Inquiry',
    projectLocation: data.projectLocation || 'New York Metro Area',
    timeline: data.timeline || 'Standard Bid Timeline',
    budget: data.budget || 'In Review',
    message: data.message,
    chatSummary: data.chatSummary,
    chatTranscript: data.chatTranscript,
    internalNotes: '',
  };

  inquiries.unshift(newInquiry);
  saveInquiries(inquiries);
  return newInquiry;
}

export function updateInquiry(
  id: string,
  updates: Partial<Pick<Inquiry, 'status' | 'internalNotes' | 'assignedTo'>>
): Inquiry | null {
  const inquiries = getInquiries();
  const index = inquiries.findIndex((i) => i.id === id);
  if (index === -1) return null;

  inquiries[index] = {
    ...inquiries[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveInquiries(inquiries);
  return inquiries[index];
}

export function deleteInquiry(id: string): boolean {
  const inquiries = getInquiries();
  const filtered = inquiries.filter((i) => i.id !== id);
  if (filtered.length === inquiries.length) return false;
  saveInquiries(filtered);
  return true;
}
