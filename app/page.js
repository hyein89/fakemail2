'use client';
import { useState, useEffect } from 'react';

// --- FUNGSI PARSER EMAIL (Agar Rapi & Bersih) ---
const processEmailContent = (rawText) => {
  if (!rawText) return "<html><body><p>No message content.</p></body></html>";
  let content = rawText;
  
  // Bersihkan encoding aneh
  content = content.replace(/=\r\n/g, '').replace(/=\n/g, '').replace(/=3D/g, '=').replace(/=20/g, ' ');

  // Ambil bagian HTML saja
  const htmlStart = content.search(/<!DOCTYPE|<html|<body/i);
  if (htmlStart !== -1) {
    content = content.substring(htmlStart);
  } else {
    const parts = content.split('Content-Type: text/html');
    if (parts.length > 1) {
      content = parts[1];
      const firstTag = content.search(/</); 
      if (firstTag !== -1) content = content.substring(firstTag);
    }
  }
  content = content.replace(/--[a-zA-Z0-9._-]+--\s*$/, '');
  
  // Tambahkan base target agar link terbuka di tab baru
  const baseTag = '<base target="_blank">';
  if (content.includes('<head>')) {
    content = content.replace('<head>', '<head>' + baseTag);
  } else {
    content = baseTag + content;
  }
  return content;
};

export default function Home() {
  // STATE
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [username, setUsername] = useState('');
  const [fullEmail, setFullEmail] = useState('Loading...');
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // STATE UI
  const [showCustom, setShowCustom] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copyTooltip, setCopyTooltip] = useState(false);
  const [openedMail, setOpenedMail] = useState(null); // Untuk Popup Pesan

  // --- 1. INITIALIZATION (Jalan Sekali saat Web Dibuka) ---
  useEffect(() => {
    // Ambil daftar domain dulu
    fetch('/api/email?action=domains')
      .then(res => res.json())
      .then(data => {
        if (data.domains && data.domains.length > 0) {
          setDomains(data.domains);
          
          // CEK APAKAH ADA EMAIL TERSIMPAN DI MEMORI HP?
          const savedEmail = localStorage.getItem('my_fake_email');
          
          if (savedEmail) {
            // Kalau ada, PAKAI ITU (Jangan acak baru)
            const [user, dom] = savedEmail.split('@');
            setUsername(user);
            setSelectedDomain(dom);
            setFullEmail(savedEmail);
            cekInboxLangsung(savedEmail); // Langsung cek inbox
          } else {
            // Kalau tidak ada, baru buat baru
            setSelectedDomain(data.domains[0]);
            acakEmail(data.domains[0]);
          }
        }
      });
  }, []);

  // --- 2. LOGIKA EMAIL ---
  
  // Simpan email ke memori biar gak hilang pas refresh
  const simpanKeMemori = (emailBaru) => {
    localStorage.setItem('my_fake_email', emailBaru);
    setFullEmail(emailBaru);
    setEmails([]); // Reset inbox kalau ganti email
  };

  const acakEmail = (domain) => {
    const randomUser = 'user' + Math.floor(Math.random() * 99999);
    setUsername(randomUser);
    const emailBaru = `${randomUser}@${domain}`;
    
    // Update State & Memori
    simpanKeMemori(emailBaru);
  };

  const handleSimpanCustom = () => {
    if (!username) return;
    const emailBaru = `${username}@${selectedDomain}`;
    
    // Update State & Memori
    simpanKeMemori(emailBaru);
    setShowCustom(false);
  };

  // --- 3. SYSTEM INBOX ---

  // Fungsi Cek Inbox (Bisa dipanggil manual atau otomatis)
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

  // Auto Refresh setiap 5 detik (Lebih cepat dari sebelumnya)
  useEffect(() => {
    if (fullEmail && !fullEmail.includes('Loading')) {
      const interval = setInterval(() => {
        cekInboxLangsung(fullEmail);
      }, 5000); 
      return () => clearInterval(interval);
    }
  }, [fullEmail]);

  // --- 4. FUNGSI UI LAINNYA ---
  const handleCopy = () => {
    navigator.clipboard.writeText(fullEmail);
    setCopyTooltip(true);
    setTimeout(() => setCopyTooltip(false), 2000);
  };

  // --- RENDER HTML (SESUAI DESAIN KAMU) ---
  return (
    <div className="container-main">
        
      <div className="hero-text">
        <h1>Your 10 Minute Mail address</h1>
        <p>Forget about spam. Keep your real inbox clean and secure.</p>
      </div>

      <div className="control-panel">
        
        {/* BOX EMAIL UTAMA */}
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
          
          {/* Tombol Acak (Akan generate baru & simpan memori) */}
          <button className="btn-act" onClick={() => acakEmail(selectedDomain)}><i className="fa fa-random"></i> ACAK</button>
          
          <button className="btn-act" onClick={() => cekInboxLangsung(fullEmail)}>
            <i className={`fa fa-refresh ${loading ? 'fa-spin' : ''}`}></i> REFRESH
          </button>
        </div>

        {/* MENU CUSTOM EDIT */}
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

      {/* PANEL INBOX */}
      <div className="panel panel-info panel-inbox">
        <div className="panel-heading-inbox">
          <i className="fa fa-inbox"></i> KOTAK MASUK 
          
          {/* COUNTER PESAN (Ganti 'Live' jadi Jumlah Pesan) */}
          {emails.length > 0 ? (
            <span className="pull-right label label-danger" style={{top:'2px', position:'relative', fontSize:'11px'}}>
              {emails.length} Pesan Baru
            </span>
          ) : (
            <span className="pull-right label label-success" style={{top:'2px', position:'relative'}}>Live</span>
          )}
        </div>
        
        <div className="panel-body" style={{minHeight:'250px', padding:0, position:'relative'}}>
          
          {/* LOADING */}
          {loading && emails.length === 0 && (
             <div className="text-center" style={{paddingTop:'60px'}}><div className="spinner"></div></div>
          )}

          {/* KOSONG */}
          {!loading && emails.length === 0 && (
            <div className="text-center" style={{paddingTop:'60px'}}>
              <div className="spinner"></div>
              <h4 style={{color:'#555'}}>Inbox Kosong</h4>
              <p className="text-muted">Menunggu pesan masuk...</p>
            </div>
          )}

          {/* LIST EMAIL (TAMPILAN RAPI SEPERTI GMAIL) */}
          {emails.length > 0 && (
            <div className="list-group">
              {emails.map((mail, i) => (
                <div 
                  key={i} 
                  className="list-group-item" 
                  onClick={() => setOpenedMail(mail)} // KLIK UNTUK BACA
                  style={{
                    cursor: 'pointer', 
                    borderLeft: '4px solid #007bff', 
                    marginBottom:'1px',
                    backgroundColor: '#fff',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                >
                  <div style={{fontWeight:'bold', color:'#333', fontSize:'14px', marginBottom:'4px'}}>
                    {mail.sender} 
                    <small className="pull-right text-muted" style={{fontWeight:'normal', fontSize:'11px'}}>
                        {new Date(mail.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </small>
                  </div>
                  <div style={{color:'#007bff', fontWeight:'600', fontSize:'13px'}}>{mail.subject}</div>
                  <div style={{fontSize:'12px', color:'#777', overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis', marginTop:'2px'}}>
                     Klik untuk membaca pesan selengkapnya...
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- POPUP / MODAL UNTUK BACA EMAIL (FULLSCREEN MOBILE FRIENDLY) --- */}
      {openedMail && (
        <div style={{
          position: 'fixed', top:0, left:0, width:'100%', height:'100%', 
          backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 99999, 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '10px'
        }}>
          <div style={{
            backgroundColor: '#fff', width: '100%', maxWidth: '700px', height: '90%', 
            borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
          }}>
            {/* Header Popup */}
            <div style={{
                padding: '15px', borderBottom: '1px solid #eee', 
                background:'#f8f9fa', display:'flex', justifyContent:'space-between', alignItems:'center'
            }}>
              <div style={{overflow:'hidden'}}>
                <h4 style={{margin:'0 0 5px 0', color:'#333', fontSize:'16px', fontWeight:'bold', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                    {openedMail.subject}
                </h4>
                <small style={{color:'#666', display:'block'}}>From: {openedMail.sender}</small>
              </div>
              <button 
                onClick={() => setOpenedMail(null)} 
                style={{
                    background:'#ff4d4d', color:'#fff', border:'none', 
                    width:'30px', height:'30px', borderRadius:'50%', 
                    fontSize:'18px', cursor:'pointer', flexShrink:0, marginLeft:'10px'
                }}>
                &times;
              </button>
            </div>
            
            {/* Isi Email (IFRAME AGAR RAPI & TIDAK BOCOR CSS) */}
            <div style={{flex: 1, position: 'relative', backgroundColor:'#fff'}}>
              <iframe 
                srcDoc={processEmailContent(openedMail.message)} 
                style={{width: '100%', height: '100%', border: 'none', display:'block'}} 
                title="Email Content"
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
              />
            </div>
            
            {/* Footer Popup */}
            <div style={{padding: '10px', textAlign: 'right', borderTop: '1px solid #eee', background:'#fff'}}>
              <button className="btn-act" onClick={() => setOpenedMail(null)} style={{width:'auto', padding:'8px 20px', background:'#eee', color:'#333'}}>
                Tutup Pesan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
