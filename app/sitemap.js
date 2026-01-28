import { CONFIG } from './config';

export default function sitemap() {
  const baseUrl = CONFIG.domainUrl;

  return [
    {
      url: baseUrl, // Halaman Utama
      lastModified: new Date(),
      changeFrequency: 'daily', // Kasih tahu Google konten ini sering update (karena ini tools)
      priority: 1, // Prioritas TERTINGGI
    },
    {
      url: `${baseUrl}/privacy`, // Halaman Privacy
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`, // Halaman Terms
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
