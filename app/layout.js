import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

// --- SETTINGAN SEO "SULTAN" (LENGKAP) ---
export const metadata = {
  // 1. Base URL (Penting untuk SEO Gambar) - Ganti dengan domain aslimu jika berubah
  metadataBase: new URL('https://suaranesianew.eu.org'),

  // 2. Title & Description Utama
  title: {
    default: 'Temp Mail - Free Instant Disposable Email Address',
    template: '%s | Temp Mail Pro' // Kalau halaman lain punya judul, formatnya jadi "Judul | Temp Mail Pro"
  },
  description: 'Forget about spam, advertising mailings, hacking and attacking robots. Keep your real mailbox clean and secure. Temp Mail provides temporary, secure, anonymous, free, disposable email address.',
  
  // 3. Keywords (Kata Kunci yang dicari orang)
  keywords: ['temp mail', 'disposable email', '10 minute mail', 'fake email', 'anonymous email', 'temporary email generator', 'secure email', 'trash mail', 'throwaway email'],
  
  // 4. Informasi Pembuat
  authors: [{ name: 'Temp Mail Service' }],
  creator: 'Temp Mail Service',
  publisher: 'Temp Mail Service',
  
  // 5. Open Graph (Untuk Tampilan di Facebook, WA, LinkedIn)
  openGraph: {
    title: 'Temp Mail - Free Instant Disposable Email Address',
    description: 'Keep your real inbox clean. Get a free temporary email to stop spam and protect your privacy. Anonymous and fast.',
    url: 'https://suaranesianew.eu.org',
    siteName: 'Temp Mail Pro',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg', // Pastikan kamu punya gambar ini di folder public
        width: 1200,
        height: 630,
        alt: 'Temp Mail Pro Preview',
      },
    ],
  },

  // 6. Twitter Card (Untuk Tampilan di Twitter/X)
  twitter: {
    card: 'summary_large_image',
    title: 'Temp Mail - Free Instant Disposable Email Address',
    description: 'Stop spam now! Get a free disposable email address instantly.',
    images: ['/og-image.jpg'], // Mengambil gambar yang sama
  },

  // 7. Icons (Favicon di Tab Browser)
  icons: {
    icon: '/favicon.ico', // Gambar kecil di tab
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png', // Ikon untuk pengguna iPhone
  },

  // 8. Robot (Izin Google)
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Load CSS Eksternal sesuai permintaan kamu */}
        {/* Bootstrap 3 */}
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" />
        {/* Font Awesome */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
        {/* Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Oswald:wght@500;700&display=swap" rel="stylesheet" />
        
        {/* Google AdSense (Opsional: Kalau nanti mau pasang iklan, taruh kodenya di sini) */}
      </head>
      <body>
        <Header />
        
        {/* Area konten berubah-ubah di sini */}
        <main style={{ minHeight: '80vh' }}>
          {children}
        </main>

        <Footer />
      </body>
    </html>
  )
}
