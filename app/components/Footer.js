'use client';
import { CONFIG } from '../config';

export default function Footer() {
  // Ambil tahun sekarang secara otomatis
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container-main">
        
        <div className="footer-top">
          {/* ICON HOME (Kembali ke Halaman Utama) */}
          {/* Saya kasih style display:block biar dia posisinya DI ATAS teks */}
          <a href="/" style={{ display: 'block', marginBottom: '15px', color: '#555' }} aria-label="Back to Home">
            <svg viewBox="0 0 24 24" style={{ width: '30px', height: '30px', fill: 'currentColor', margin: '0 auto' }}>
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </a>

          {/* MENU BAHASA INGGRIS */}
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>

        <div className="footer-bottom clearfix">
          <div className="copyright">
            {/* TAHUN OTOMATIS */}
            Copyright &copy; {currentYear} {CONFIG.siteName} Service<br/>
            <small>{CONFIG.dom}</small>
          </div>
          
          {/* ICON SOSIAL MEDIA SUDAH DIHAPUS DI SINI */}
        </div>
        
      </div>
    </footer>
  );
}
