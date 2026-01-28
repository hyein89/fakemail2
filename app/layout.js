import './globals.css'; // Memanggil CSS kamu
import Header from './components/Header';
import Footer from './components/Footer';

export const metadata = {
  title: 'FakeMail Pro - Temporary Email',
  description: 'Secure and anonymous disposable email address.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Load CSS Eksternal sesuai permintaan kamu */}
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Oswald:wght@500;700&display=swap" rel="stylesheet" />
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
