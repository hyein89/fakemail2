// app/layout.js

import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Script from 'next/script'; // <--- 1. IMPORT INI WAJIB
import { CONFIG } from './config';

// --- KONFIGURASI SEO TINGKAT TINGGI ---
export const metadata = {
  metadataBase: new URL(CONFIG.domainUrl),
  title: {
    default: CONFIG.siteName + ' - Instant Disposable Email Address',
    template: `%s | ${CONFIG.siteName}`
  },
  description: CONFIG.description,
  keywords: CONFIG.keywords,
  authors: [{ name: CONFIG.siteName }],
  creator: CONFIG.siteName,
  publisher: CONFIG.siteName,
  openGraph: {
    title: CONFIG.siteName,
    description: CONFIG.description,
    url: CONFIG.domainUrl,
    siteName: CONFIG.siteName,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `${CONFIG.siteName} Preview`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: CONFIG.siteName,
    description: CONFIG.description,
    images: [CONFIG.ogImage],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
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
  alternates: {
    canonical: CONFIG.domainUrl,
  },
};

// --- STRUKTUR HTML ---
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Load Library CSS Eksternal */}
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Oswald:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        
        {/* --- GOOGLE ANALYTICS (Start) --- */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7JJJMLRN3V"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7JJJMLRN3V');
          `}
        </Script>
        {/* --- GOOGLE ANALYTICS (End) --- */}

// Di dalam return statement JSX
<script 
  async 
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6506882590221776"
  crossOrigin="anonymous" // Perhatikan huruf 'O' besar
></script>



        <Header />
        
        <main style={{ minHeight: '80vh' }}>
          {children}
        </main>

        <Footer />
      </body>
    </html>
  )
}
