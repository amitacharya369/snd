import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/.inquiries_log/'],
      },
    ],
    sitemap: 'https://www.signsanddecal.com/sitemap.xml',
    host: 'https://www.signsanddecal.com',
  };
}
