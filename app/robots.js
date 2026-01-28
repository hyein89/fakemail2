import { CONFIG } from './config';

export default function robots() {
  return {
    rules: {
      userAgent: '*', // Semua robot (Google, Bing, dll) boleh masuk
      allow: '/',     // Boleh akses semua halaman
      disallow: '/api/', // (Opsional) Jangan index folder API biar aman
    },
    sitemap: `${CONFIG.domainUrl}/sitemap.xml`, // Link sitemap otomatis
  }
}
