'use client';
import { useState, useEffect } from 'react';

// --- FUNGSI DECODER CANGGIH (Memperbaiki Huruf Aneh & HTML Patah) ---
const processEmailContent = (rawText) => {
  if (!rawText) return "<html><body><p>No message content.</p></body></html>";
  
  let content = rawText;

  // 1. Cek apakah ini Quoted-Printable? (Tandanya banyak simbol =)
  // Kita decode dulu karakter hex-nya (misal: =E2=80=99 jadi ’)
  try {
    content = content
      .replace(/=\r\n/g, '') // Hapus enter sambungan
      .replace(/=\n/g, '')
      .replace(/=([0-9A-F]{2})=([0-9A-F]{2})=([0-9A-F]{2})/gi, (m, h1, h2, h3) => {
        // Decode 3-byte UTF-8 (seperti emoji atau tanda kutip miring)
        return decodeURIComponent(`%${h1}%${h2}%${h3}`);
      })
      .replace(/=([0-9A-F]{2})=([0-9A-F]{2})/gi, (m, h1, h2) => {
        // Decode 2-byte UTF-8
        return decodeURIComponent(`%${h1}%${h2}`);
      })
      .replace(/=([0-9A-F]{2})/gi, (m, hex) => {
        // Decode 1-byte ASCII standard
        if (hex === '3D') return '=';
        if (hex === '20') return ' ';
        return String.fromCharCode(parseInt(hex, 16));
      });
  } catch (e) {
    // Kalau error decode, biarkan original (fallback)
    console.log("Decode error, using raw", e);
  }

  // 2. Ambil hanya bagian HTML murni
  // (Membuang header teknis yang bikin pusing)
  const htmlStart = content.search(/<!DOCTYPE|<html|<body|<div/i);
  if (htmlStart !== -1) {
    content = content.substring(htmlStart);
  } else {
    // Teknik cadangan: Cari boundary text/html
    const parts = content.split('Content-Type: text/html');
    if (parts.length > 1) {
      let bodyPart = parts[1];
      // Hapus header Content-Transfer-Encoding jika ada
      bodyPart = bodyPart.replace(/Content-Transfer-Encoding:.*?\n\n/s, '');
      const firstTag = bodyPart.search(/</);
      if (firstTag !== -1) content = bodyPart.substring(firstTag);
    }
  }

  // 3. Bersihkan sisa-sisa sampah di ujung file (Boundary footer)
  content = content.replace(/--[a-zA-Z0-9._-]+--\s*$/, '');

  // 4. Paksa semua link buka di tab baru & perbaiki CSS yang hilang
  const baseTag = '<base target="_blank"><style>body{margin:0;font-family:Arial,sans-serif;} img{max-width:100%;height:auto;}</style>';
  if (content.includes('<head>')) {
    content = content.replace('<head>', '<head>' + baseTag);
  } else {
    content = baseTag + content;
  }

  return content;
};

export default function Home() {
  // STATE DATA
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [username, setUsername] = useState('');
  const [fullEmail, setFullEmail] = useState('Loading...');
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // STATE TAMPILAN
  const [showCustom, setShowCustom] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copyTooltip, setCopyTooltip] = useState(false);
  const [openedMail, setOpenedMail] = useState(null);

  // --- 1. INITIALIZATION (Load Domain & Cek Memori HP) ---
  useEffect(() => {
    fetch('/api/email?action=domains')
      .then(res => res.json())
      .then(data => {
        if (data.domains && data.domains.length > 0) {
          setDomains(data.domains);
          
          // CEK MEMORI: Apakah user pernah punya email sebelumnya?
          const savedEmail = localStorage.getItem('my_fake_email');
          
          if (savedEmail) {
            // Restore email lama biar gak ganti-ganti
            const parts = savedEmail.split('@');
            if(parts.length === 2) {
                setUsername(parts[0]);
                setSelectedDomain(parts[1]);
                setFullEmail(savedEmail);
                cekInboxLangsung(savedEmail); 
            } else {
                setSelectedDomain(data.domains[0]);
                acakEmail(data.domains[0]);
            }
          } else {
            // Buat baru kalau belum pernah pakai
            setSelectedDomain(data.domains[0]);
            acakEmail(data.domains[0]);
          }
        }
      });
  }, []);

  // --- 2. LOGIKA UTAMA ---
  const simpanKeMemori = (emailBaru) => {
    localStorage.setItem('my_fake_email', emailBaru);
    setFullEmail(emailBaru);
    setEmails([]); // Bersihkan inbox saat ganti email
  };

  const acakEmail = (domain) => {
    const randomUser = 'user' + Math.floor(Math.random() * 99999);
    setUsername(randomUser);
    const emailBaru = `${randomUser}@${domain}`;
    simpanKeMemori(emailBaru);
  };

  const handleSimpanCustom = () => {
    if (!username) return;
    const emailBaru = `${username}@${selectedDomain}`;
    simpanKeMemori(emailBaru);
    setShowCustom(false);
    cekInboxLangsung(emailBaru);
  };

  const cekInboxLangsung = async (alamatEmail) => {
    if (!alamatEmail || alamatEmail.includes('Loading')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/email?action=inbox&address=${alamatEmail}`);
      const data = await res.json();
      if (data.emails) {
        setEmails(data.emails);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  // Auto Refresh setiap 5 detik
  useEffect(() => {
    if (fullEmail && !fullEmail.includes('Loading')) {
      const interval = setInterval(() => {
        cekInboxLangsung(fullEmail);
      }, 5000); 
      return () => clearInterval(interval);
    }
  }, [fullEmail]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullEmail);
    setCopyTooltip(true);
    setTimeout(() => setCopyTooltip(false), 2000);
  };

  return (
    <div className="container-main">
        
      <div className="hero-text">
        <h1>Your 10 Minute Mail address</h1>
        <p>Forget about spam. Keep your real inbox clean and secure.</p>
      </div>

      <div className="control-panel">
        {/* BOX EMAIL */}
        <div className="email-wrap">
          <input type="text" className="email-input" value={fullEmail} readOnly />
          <div className={`tooltip-copy ${copyTooltip ? 'show' : ''}`}>Disalin!</div>
          <button className="btn-copy" onClick={handleCopy}>
            <svg style={{width:'20px',height:'20px',fill:'none',stroke:'currentColor',strokeWidth:'2'}} viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
        </div>

        {/* TOMBOL AKSI */}
        <div className="action-btns">
          <button className="btn-act" onClick={() => setShowCustom(!showCustom)}><i className="fa fa-pencil"></i> UBAH</button>
          <button className="btn-act" onClick={() => acakEmail(selectedDomain)}><i className="fa fa-random"></i> ACAK</button>
          <button className="btn-act" onClick={() => cekInboxLangsung(fullEmail)}>
            <i className={`fa fa-refresh ${loading ? 'fa-spin' : ''}`}></i> REFRESH
          </button>
        </div>

        {/* MENU EDIT CUSTOM */}
        {showCustom && (
          <div id="customWell" style={{display: 'block'}}>
            <label style={{fontSize:'11px', fontWeight:'700', color:'#888', marginBottom:'5px', display:'block'}}>BUAT EMAIL BARU</label>
            <div className="merged-group">
              <input type="text" className="inp-user" placeholder="Nama user" value={username} onChange={(e) => setUsername(e.target.value)} />
              <div className="dd-trigger" onClick={() => setShowDropdown(!showDropdown)}>
                <span id="txtDom">@{selectedDomain}</span> <i className="fa fa-caret-down"></i>
              </div>
              {showDropdown && (
                <div className="dd-menu" style={{display:'block'}}>
                  {domains.map((dom) => (
                    <div key={dom} className={`dd-item ${selectedDomain === dom ? 'selected' : ''}`} onClick={() => { setSelectedDomain(dom); setShowDropdown(false); }}>@{dom}</div>
                  ))}
                </div>
              )}
            </div>
            <button className="btn-save" onClick={handleSimpanCustom}>SIMPAN PERUBAHAN</button>
          </div>
        )}
      </div>

      {/* INBOX LIST */}
      <div className="panel panel-info panel-inbox">
        <div className="panel-heading-inbox">
          <i className="fa fa-inbox"></i> KOTAK MASUK 
          {emails.length > 0 ? (
            <span className="pull-right label label-danger" style={{top:'2px', position:'relative', fontSize:'11px'}}>
              {emails.length} Pesan
            </span>
          ) : (
            <span className="pull-right label label-success" style={{top:'2px', position:'relative'}}>Live</span>
          )}
        </div>
        
        <div className="panel-body" style={{minHeight:'250px', padding:0}}>
          {loading && emails.length === 0 && <div className="text-center" style={{paddingTop:'60px'}}><div className="spinner"></div></div>}
          
          {!loading && emails.length === 0 && (
            <div className="text-center" style={{paddingTop:'60px'}}>
              <div className="spinner"></div>
              <h4 style={{color:'#555'}}>Inbox Kosong</h4>
              <p className="text-muted">Menunggu pesan masuk...</p>
            </div>
          )}

          {emails.length > 0 && (
            <div className="list-group">
              {emails.map((mail, i) => (
                <div 
                  key={i} 
                  className="list-group-item" 
                  onClick={() => setOpenedMail(mail)} 
                  style={{cursor: 'pointer', borderLeft: '4px solid #007bff', marginBottom:'1px', background:'#fff'}}
                >
                  <div style={{fontWeight:'bold', color:'#333', fontSize:'14px', marginBottom:'3px'}}>
                    {mail.sender} <small className="pull-right text-muted" style={{fontWeight:'normal', fontSize:'11px'}}>{new Date(mail.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</small>
                  </div>
                  <div style={{color:'#007bff', fontWeight:'600', fontSize:'13px'}}>{mail.subject}</div>
                  <div style={{fontSize:'12px', color:'#777', marginTop:'3px'}}>Klik untuk membaca...</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL POPUP (FULL SCREEN DI HP) */}
      {openedMail && (
        <div style={{
          position: 'fixed', top:0, left:0, width:'100%', height:'100%', 
          backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 99999, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding:'10px'
        }}>
          <div style={{
            backgroundColor: '#fff', width: '100%', maxWidth: '700px', height: '95%', 
            borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }}>
            {/* Header Popup */}
            <div style={{padding: '15px', borderBottom: '1px solid #eee', background:'#f5f5f5', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h4 style={{margin:0, fontSize:'16px', fontWeight:'bold', color:'#333', overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis', maxWidth:'80%'}}>
                  {openedMail.subject}
              </h4>
              <button onClick={() => setOpenedMail(null)} style={{background:'red', color:'white', border:'none', width:'30px', height:'30px', borderRadius:'50%', cursor:'pointer', fontWeight:'bold'}}>X</button>
            </div>
            
            {/* ISI EMAIL (IFRAME) */}
            <div style={{flex: 1, position: 'relative', background:'#fff'}}>
              <iframe 
                srcDoc={processEmailContent(openedMail.message)} 
                style={{width: '100%', height: '100%', border: 'none'}} 
                title="Email Content"
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
              />
            </div>
            
            <div style={{padding: '10px', textAlign: 'center', borderTop: '1px solid #eee', background:'#f5f5f5'}}>
              <button className="btn-act" onClick={() => setOpenedMail(null)} style={{width:'100%', maxWidth:'200px'}}>TUTUP PESAN</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
