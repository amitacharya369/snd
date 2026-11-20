import type { Metadata, Viewport } from 'next';
import { Barlow, Barlow_Condensed } from 'next/font/google';
import './globals.css';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SkipLink } from '../components/SkipLink';
import { TelemetryCoordinates } from '../components/TelemetryCoordinates';
import { AiChatbot } from '../components/AiChatbot';
import { COMPANY } from '../data/company';

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.signsanddecal.com'),
  title: {
    default: 'Signs & Decal Corp. | Architectural Signage, Metal & Glass Contractor NYC',
    template: '%s | Signs & Decal Corp.',
  },
  description: 'Premier architectural signage, custom metal, architectural glass, and wayfinding contractor based in Brooklyn, NY since 1971. Certified MBE serving transit, airports, commercial, and civic infrastructure.',
  keywords: [
    'Architectural signage contractor',
    'Architectural signage fabrication',
    'Wayfinding signage systems',
    'Custom metal fabrication for construction',
    'Architectural glass and metal systems',
    'Commercial signage installation',
    'Transit and airport signage',
    'Architectural signage in New York City',
    'Certified MBE signage contractor',
    'PANYNJ wayfinding contractor',
    'Signs and Decal Corp',
  ],
  authors: [{ name: 'Signs & Decal Corp.' }],
  creator: 'Signs & Decal Corp.',
  publisher: 'Signs & Decal Corp.',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  icons: {
    icon: '/images/brand/favicon.png',
    apple: '/images/brand/favicon.png',
  },
  alternates: {
    canonical: 'https://www.signsanddecal.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.signsanddecal.com',
    siteName: 'Signs & Decal Corp.',
    title: 'Signs & Decal Corp. | Architectural Signage, Metal & Glass Contractor',
    description: 'Premier architectural signage, custom metal, glass, and wayfinding contractor based in Brooklyn, NY since 1971. Certified MBE serving major general contractors.',
    images: [
      {
        url: '/images/projects/laguardia.png',
        width: 1200,
        height: 630,
        alt: 'Signs & Decal Corp. Architectural Signage and Fabrication',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Signs & Decal Corp. | Architectural Signage & Metalwork',
    description: 'Premier architectural signage, custom metal, and wayfinding contractor based in Brooklyn, NY since 1971.',
    images: ['/images/projects/laguardia.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'GeneralContractor', 'Organization'],
    name: COMPANY.legalName,
    alternateName: COMPANY.brandNames,
    url: 'https://www.signsanddecal.com',
    logo: 'https://www.signsanddecal.com/images/brand/logo.svg',
    image: 'https://www.signsanddecal.com/images/projects/laguardia.png',
    description: COMPANY.tagline,
    telephone: COMPANY.headquarters.phone,
    email: COMPANY.headquarters.email,
    foundingDate: '1971',
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY.headquarters.street,
      addressLocality: COMPANY.headquarters.city,
      addressRegion: COMPANY.headquarters.state,
      postalCode: COMPANY.headquarters.zip,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '40.7176',
      longitude: '-73.9355',
    },
    areaServed: [
      'New York',
      'New Jersey',
      'Connecticut',
      'Massachusetts',
      'Pennsylvania',
      'Nationwide',
    ],
    priceRange: '$$$$',
    knowsAbout: [
      'Architectural Signage',
      'Transit Wayfinding Systems',
      'Miscellaneous Metal Fabrication',
      'Architectural Glass Systems',
      'High-Rise Life Safety Signage',
      'BIM Coordination and Shop Drawings',
    ],
  };

  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-amber-400 selection:text-slate-950 font-sans">
        <SkipLink />
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <TelemetryCoordinates />
        <AiChatbot />
        <Footer />
      </body>
    </html>
  );
}
