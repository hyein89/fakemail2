// app/layout.js

import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { CONFIG } from './config'; // Kita panggil data dari config.js

// --- KONFIGURASI SEO TINGKAT TINGGI ---
export const metadata = {
  // 1. Base URL (Wajib agar gambar di sosmed muncul)
  metadataBase: new URL(CONFIG.domainUrl),

  // 2. Judul Halaman (Otomatis + Template)
  title: {
    default: CONFIG.siteName + ' - Instant Disposable Email Address',
    template: `%s | ${CONFIG.siteName}` // Format: "Halaman Lain | FakeMail Pro"
  },

  // 3. Deskripsi & Keyword
  description: CONFIG.description,
  keywords: CONFIG.keywords,

  // 4. Penulis & Hak Cipta
  authors: [{ name: CONFIG.siteName }],
  creator: CONFIG.siteName,
  publisher: CONFIG.siteName,

  // 5. Tampilan di Facebook / WhatsApp / LinkedIn (Open Graph)
  openGraph: {
    title: CONFIG.siteName,
    description: CONFIG.description,
    url: CONFIG.domainUrl,
    siteName: CONFIG.siteName,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: CONFIG.ogImage, // Mengambil gambar dari config
        width: 1200,
        height: 630,
        alt: `${CONFIG.siteName} Preview`,
      },
    ],
  },

  // 6. Tampilan di Twitter / X
  twitter: {
    card: 'summary_large_image',
    title: CONFIG.siteName,
    description: CONFIG.description,
    images: [CONFIG.ogImage], // Mengambil gambar yang sama
  },

  // 7. Ikon Website (Favicon)
  icons: {
    icon: '/favicon.ico', // Pastikan file ini ada di folder public
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png', // Ikon khusus iPhone
  },

  // 8. Robot Google (Izin Index)
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

  // 9. Canonical URL (Mencegah konten duplikat)
  alternates: {
    canonical: CONFIG.domainUrl,
  },
};

// --- STRUKTUR HTML ---
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Load Library CSS Eksternal (Bootstrap & FontAwesome) */}
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Oswald:wght@500;700&display=swap" rel="stylesheet" />
        
        {/* Verifikasi Google Search Console (Opsional, taruh kodenya di sini nanti) */}
        {/* <meta name="google-site-verification" content="KODE_DARI_GOOGLE" /> */}
      </head>
      <body>
        <Header />
        
        {/* Konten Utama */}
        <main style={{ minHeight: '80vh' }}>
          {children}
        </main>

        <Footer />
      </body>
    </html>
  )
}
