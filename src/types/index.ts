export type IndustryId = 
  | 'transportation'
  | 'airports'
  | 'commercial'
  | 'institutional'
  | 'infrastructure'
  | 'civic';

export type CapabilityId =
  | 'architectural-signage'
  | 'interior-signage'
  | 'exterior-signage'
  | 'illuminated-signage'
  | 'vinyl-graphics'
  | 'architectural-metal'
  | 'architectural-glass'
  | 'interior-partitions'
  | 'fabrication-installation';

export interface Project {
  slug: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  client: string;
  contractorOrPartner?: string;
  location: string;
  completionYear: string;
  industries: IndustryId[];
  capabilities: CapabilityId[];
  featuredImage: string;
  galleryImages?: string[];
  summary: string;
  verifiedScope: string[];
  specifications: {
    materials: string[];
    finishes: string[];
    disciplines: string[];
  };
  overviewText: string[];
  challengeAndSolution?: {
    challenge: string;
    solution: string;
  };
  highlightStat?: {
    value: string;
    label: string;
  };
}

export interface Capability {
  id: CapabilityId;
  slug: string;
  title: string;
  shortTitle: string;
  heroHeadline: string;
  tagline: string;
  iconName: string;
  featuredImage?: string;
  overview: string;
  deliverables: string[];
  keyCapabilities: {
    title: string;
    description: string;
  }[];
  materialsAndFinishes: string[];
  engineeringSpecs: string[];
  relatedIndustries: IndustryId[];
  relatedProjects: string[]; // project slugs
}

export interface Industry {
  id: IndustryId;
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  heroHeadline?: string;
  description: string;
  iconName: string;
  keyClients: string[];
  complianceStandards: string[];
  featuredProjects: string[]; // project slugs
  capabilitiesEmphasized: CapabilityId[];
}

export interface TeamMember {
  name: string;
  role: string;
  department: string;
  image: string;
  bio: string;
  experienceYears?: string;
}

export interface CompanyHistoryMilestone {
  period: string;
  title: string;
  description: string;
  highlights: string[];
}
