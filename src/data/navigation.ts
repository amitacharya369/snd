export interface NavItem {
  label: string;
  href: string;
  badge?: string;
  description?: string;
  children?: {
    label: string;
    href: string;
    description: string;
    iconName?: string;
  }[];
}

export const MAIN_NAV: NavItem[] = [
  {
    label: 'Capabilities',
    href: '/capabilities',
    children: [
      {
        label: 'Architectural Signage & Wayfinding',
        href: '/capabilities/architectural-signage',
        description: 'Transit wayfinding, suspended sign boxes, and directional systems.',
        iconName: 'Compass',
      },
      {
        label: 'Interior & ADA Signage',
        href: '/capabilities/interior-signage',
        description: 'Tactile Braille, room markers, and Local Law 26 photoluminescent egress.',
        iconName: 'Building2',
      },
      {
        label: 'Exterior & Monument Signage',
        href: '/capabilities/exterior-signage',
        description: 'Pylons, campus monuments, and heavy weatherproof identity structures.',
        iconName: 'Landmark',
      },
      {
        label: 'Illuminated & LED Systems',
        href: '/capabilities/illuminated-signage',
        description: 'UL-48 listed face-lit, halo channel letters, and low-voltage light panels.',
        iconName: 'Sun',
      },
      {
        label: 'Vinyl & Environmental Graphics',
        href: '/capabilities/vinyl-graphics',
        description: 'Wide-format UV murals, glass privacy films, and architectural graphics.',
        iconName: 'Palette',
      },
      {
        label: 'Miscellaneous & Architectural Metal',
        href: '/capabilities/architectural-metal',
        description: 'Heavy stainless steel railings, escalator enclosures, canopies, and bronze.',
        iconName: 'Shield',
      },
      {
        label: 'Architectural Glass & Glazing',
        href: '/capabilities/architectural-glass',
        description: 'Structural glass balustrades, ballistic security glazing, and acoustic glass.',
        iconName: 'Layers',
      },
      {
        label: 'Interior Partitions & Systems',
        href: '/capabilities/interior-partitions',
        description: 'Demountable aluminum and acoustic glass modular interior divide systems.',
        iconName: 'Maximize2',
      },
      {
        label: 'Fabrication & Union Installation',
        href: '/capabilities/fabrication-installation',
        description: 'Brooklyn manufacturing plant, BIM clash detection, and certified union riggers.',
        iconName: 'Wrench',
      },
    ],
  },
  {
    label: 'Projects',
    href: '/projects',
    children: [
      {
        label: 'All Projects',
        href: '/projects',
        description: 'Filter our landmark portfolio by industry, trade capability, and location.',
        iconName: 'Grid',
      },
      {
        label: 'LaGuardia West Parking Garage',
        href: '/projects/laguardia-west-parking-garage',
        description: 'Airport terminal multi-level vehicular wayfinding system.',
      },
      {
        label: 'WTC Oculus Wayfinding',
        href: '/projects/oculus-world-trade-center-wayfinding',
        description: 'Transit hub directional & cantilevered blade signage.',
      },
      {
        label: 'One World Trade Center',
        href: '/projects/one-world-trade-center',
        description: 'High-rise identification and 104 stories of life-safety signage.',
      },
      {
        label: '181st Street Subway Escalators',
        href: '/projects/181st-street-station-escalator-railings',
        description: 'Heavy mirror-polished stainless steel transit escalator balustrades.',
      },
      {
        label: 'Citi Field Ballpark',
        href: '/projects/citi-field-mets-stadium',
        description: 'Ballpark wayfinding, concourse directional, and halo-lit letters.',
      },
    ],
  },
  {
    label: 'Industries',
    href: '/industries',
    children: [
      {
        label: 'Transit & Rail Authorities',
        href: '/industries#transportation',
        description: 'Subways, commuter rail, and multi-modal transit networks.',
        iconName: 'Train',
      },
      {
        label: 'Airports & Aviation',
        href: '/industries#airports',
        description: 'Terminal wayfinding, gate pylons, and international concourses.',
        iconName: 'Plane',
      },
      {
        label: 'Commercial & Corporate High-Rise',
        href: '/industries#commercial',
        description: 'Lobbies, tenant directories, and architectural interior metals.',
        iconName: 'Building',
      },
      {
        label: 'Education & Institutional',
        href: '/industries#institutional',
        description: 'Campus wayfinding, donor walls, and public authority projects.',
        iconName: 'GraduationCap',
      },
      {
        label: 'Public Infrastructure & Civil',
        href: '/industries#infrastructure',
        description: 'Bridge portals, flood barrier walls, and municipal seals.',
        iconName: 'Dam',
      },
    ],
  },
  {
    label: 'Quality & Delivery',
    href: '/quality-delivery',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Careers',
    href: '/careers',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

export const FOOTER_LINKS = {
  capabilities: [
    { label: 'Architectural Signage & Wayfinding', href: '/capabilities/architectural-signage' },
    { label: 'Interior & ADA Signage', href: '/capabilities/interior-signage' },
    { label: 'Exterior Monument Signage', href: '/capabilities/exterior-signage' },
    { label: 'Illuminated & LED Systems', href: '/capabilities/illuminated-signage' },
    { label: 'Vinyl & Environmental Graphics', href: '/capabilities/vinyl-graphics' },
    { label: 'Architectural & Misc Metal', href: '/capabilities/architectural-metal' },
    { label: 'Architectural Glass Systems', href: '/capabilities/architectural-glass' },
    { label: 'Interior Partitions', href: '/capabilities/interior-partitions' },
    { label: 'Fabrication & Installation', href: '/capabilities/fabrication-installation' },
  ],
  projects: [
    { label: 'LaGuardia West Garage', href: '/projects/laguardia-west-parking-garage' },
    { label: 'WTC Oculus Wayfinding', href: '/projects/oculus-world-trade-center-wayfinding' },
    { label: 'One World Trade Center', href: '/projects/one-world-trade-center' },
    { label: 'GWB Bus Station', href: '/projects/george-washington-bridge-bus-station' },
    { label: 'Citi Field Stadium', href: '/projects/citi-field-mets-stadium' },
    { label: 'Cornell NYC Tech Campus', href: '/projects/cornell-nyc-tech-campus' },
    { label: '181st St Subway Escalators', href: '/projects/181st-street-station-escalator-railings' },
    { label: '120 Broadway Lobby', href: '/projects/120-broadway-equitable-building' },
    { label: 'Queens Midtown Tunnel Seal', href: '/projects/flood-gate-wall-queens-midtown-tunnel' },
    { label: 'Newark Terminal A', href: '/projects/newark-airport-terminal-a' },
  ],
  company: [
    { label: 'About Signs & Decal Corp.', href: '/about' },
    { label: '50-Year Company History', href: '/about#timeline' },
    { label: 'Leadership & Team', href: '/about#leadership' },
    { label: 'MBE & Trade Credentials', href: '/about#credentials' },
    { label: 'Quality Assurance & Delivery', href: '/quality-delivery' },
    { label: 'Careers & Apprenticeships', href: '/careers' },
    { label: 'Discuss a Project / RFQ', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Use', href: '/terms-of-use' },
    { label: 'Accessibility Statement', href: '/accessibility' },
  ],
};
