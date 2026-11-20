import { CompanyHistoryMilestone } from '../types';

export const COMPANY = {
  legalName: 'Signs & Decal Corp.',
  commercialName: 'Signs & Decal Corp.',
  brandNames: ['Signs+Decal', 'S+D'],
  tagline: 'Architectural Signage, Metal & Glass Engineering Since 1971',
  foundingYear: 1971,
  yearsOfExcellence: '50+',
  
  headquarters: {
    street: '410 Morgan Avenue',
    city: 'Brooklyn',
    state: 'NY',
    zip: '11211',
    country: 'United States',
    phone: '(718) 486-6400',
    phoneRaw: '+17184866400',
    email: 'salesteam@signsanddecal.com',
    mapsUrl: 'https://maps.google.com/?q=410+Morgan+Avenue,+Brooklyn,+NY+11211',
  },

  affiliatedBrand: {
    name: 'SD Works / SD Industries LLC',
    description: 'Affiliated advanced fabrication facility specializing in structural steel, heavy architectural metals, and high-performance architectural glass.',
    headquarters: '250 Pehle Ave, Ste 200, Saddle Brook, NJ 07663',
    facility: '213 Porter Rd, Conroe, TX 77301',
    phone: '(212) 348-8000',
    email: 'sales@sd-ind.com',
  },

  certifications: [
    {
      name: 'Minority Business Enterprise (MBE)',
      issuingAuthority: 'NYC Department of Small Business Services (SBS)',
      verified: true,
      scope: 'Custom architectural signage, metal fabrication, and installation',
    },
    {
      name: 'Minority Business Enterprise (MBE)',
      issuingAuthority: 'NYC School Construction Authority (SCA)',
      verified: true,
      scope: 'Educational facility signage, wayfinding, and architectural metalwork',
    },
    {
      name: 'MBE / DBE / ACDBE / SBE',
      issuingAuthority: 'Port Authority of New York & New Jersey (PANYNJ)',
      verified: true,
      scope: 'Aviation, transit terminals, bridges, tunnels, and port facilities',
    },
    {
      name: 'AISC Certified Building Fabricator',
      issuingAuthority: 'American Institute of Steel Construction (AISC)',
      verified: true,
      scope: 'Structural and miscellaneous steel components (via SD Industries/Works)',
    },
    {
      name: 'AWS Member',
      issuingAuthority: 'American Welding Society (AWS)',
      verified: true,
      scope: 'Certified architectural welding procedures (stainless steel, bronze, aluminum)',
    },
    {
      name: 'Federal CAGE Code: 15HU7',
      issuingAuthority: 'Defense Logistics Agency / SAM.gov',
      verified: true,
      scope: 'Federal infrastructure and public-sector contracting compliance',
    },
  ],

  operatingStats: [
    { value: '1971', label: 'Founded in NYC', detail: 'Over 50 years of continuous fabrication' },
    { value: '5,000+', label: 'Completed Projects', detail: 'Transit hubs, stadiums, high-rises, airports' },
    { value: '100%', label: 'Union Installation', detail: 'Fully prequalified with major general contractors' },
    { value: 'Certified MBE', label: 'Tier-1 Diversity Partner', detail: 'NYC SBS, NYC SCA & PANYNJ certified' },
  ],

  historyMilestones: [
    {
      period: '1971 – 1979',
      title: 'Our Founding on Northern Boulevard',
      description: 'Established our first fabrication workshop in 1971 on Northern Boulevard in New York. Starting with high-precision engraved room signs and corporate nameplates, we quickly built a reputation among local contractors for craftsmanship, speed, and dependable delivery.',
      highlights: [
        'Founded by Babu and Tazzim Khalfan',
        'Built proprietary mechanical engraving and metal chemical etching processes',
        'Supplied primary corporate offices across Midtown Manhattan',
      ],
    },
    {
      period: '1979 – 1998',
      title: 'Designer Collaboration & Landmark Civic Scale',
      description: 'Entered an expansive era through direct collaboration with two of the greatest graphic and environmental designers of the 20th century: Rudolf de Harak and Richard Poulin. S+D engineered and fabricated landmark specialty signage for the original World Trade Center complex and 599 Lexington Avenue, and initiated our first major transit contracts with the Metropolitan Transportation Authority (MTA).',
      highlights: [
        'Fabricated signage for the World Trade Center complex',
        'Engineered 599 Lexington Avenue architectural identity with Rudolf de Harak',
        'Awarded first comprehensive New York City MTA transit station contracts',
      ],
    },
    {
      period: '1998 – 2020',
      title: 'Grand-Scale Infrastructure & Stadium Works',
      description: 'Expanded into national infrastructure, delivering complex wayfinding and architectural metals for Pennsylvania Station, JFK International Airport, and Citi Field (completed in 2009 for Sterling Mets LP). Deepened in-house engineering, BIM coordination, and precision CNC metal forming.',
      highlights: [
        'Citi Field ballpark signage and exterior environmental graphics package',
        'JFK and Newark Airport international terminal signage systems',
        'Subway system safety railings and architectural metals for MTA NYCT',
      ],
    },
    {
      period: '2021 & Beyond',
      title: 'The Next 50 Years: SD Works & Manufacturing Expansion',
      description: 'Marked our 50th anniversary by expanding our 410 Morgan Avenue headquarters in Brooklyn to support manufacturing apprenticeships and specialized digital workflow. Formally launched our SD Works brand for heavy structural metals, custom glass, and architectural partition systems.',
      highlights: [
        'Expanded 410 Morgan Avenue Brooklyn fabrication headquarters',
        'Integration of 3D laser reality capture, BIM coordination, and multi-axis CNC',
        'Delivery of major infrastructure projects including Newark Terminal A and LaGuardia',
      ],
    },
  ] as CompanyHistoryMilestone[],
};
