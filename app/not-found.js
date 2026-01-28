import Link from 'next/link';

export const metadata = {
  title: '404 - Page Not Found',
};

export default function NotFound() {
  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      textAlign: 'center',
      padding: '20px'
    }}>
      
      {/* --- CSS KHUSUS ANIMASI (Hanya jalan di halaman ini) --- */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(0.8); opacity: 0.05; }
          100% { transform: scale(1); opacity: 0.1; }
        }
        .ghost-icon {
          animation: float 3s ease-in-out infinite;
        }
        .shadow-effect {
          width: 120px;
          height: 15px;
          background: #000;
          border-radius: 50%;
          margin: 20px auto 0;
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>

      {/* --- ANIMASI IKON --- */}
      <div className="ghost-icon">
        {/* SVG Amplop Sedih / Hantu */}
        <svg 
          viewBox="0 0 24 24" 
          style={{ width: '150px', height: '150px', fill: '#e0e0e0', stroke: '#333', strokeWidth: '1.5' }}
        >
          {/* Badan Amplop */}
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#f8f9fa"/>
          {/* Mata (Biar jadi Hantu) */}
          <circle cx="8" cy="11" r="1.5" fill="#333"/>
          <circle cx="16" cy="11" r="1.5" fill="#333"/>
          {/* Mulut Sedih */}
          <path d="M9 15c1-1 5-1 6 0" stroke="#333" fill="none" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Bayangan di bawah amplop */}
      <div className="shadow-effect"></div>

      {/* --- TEKS --- */}
      <h1 style={{ fontSize: '80px', fontWeight: 'bold', color: '#333', margin: '20px 0 0 0', lineHeight: 1 }}>
        404
      </h1>
      <h3 style={{ margin: '10px 0 20px 0', color: '#666' }}>
        Oops! Lost Page.
      </h3>
      <p style={{ color: '#888', maxWidth: '400px', margin: '0 auto 30px auto' }}>
        It looks like the page you''re looking for has expired or been deleted, just like our temporary email.
      </p>

      {/* --- TOMBOL BALIK --- */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <button style={{
          background: '#007bff',
          color: 'white',
          border: 'none',
          padding: '12px 30px',
          borderRadius: '50px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0,123,255,0.3)',
          transition: '0.3s'
        }}>
          <i className="fa fa-arrow-left" style={{ marginRight: '8px' }}></i>
          BACK TO HOME
        </button>
      </Link>

    </div>
  );
}
