'use client';
import { useState, useEffect } from 'react';

// --- FUNGSI PEMBERSIH EMAIL (KODE DARI KAMU) ---
const processEmailContent = (rawText) => {
  if (!rawText) return "<html><body><p>No message content.</p></body></html>";
  let content = rawText;
  
  // 1. Bersihkan karakter encoding aneh
  content = content.replace(/=\r\n/g, '').replace(/=\n/g, '').replace(/=3D/g, '=').replace(/=20/g, ' ');

  // 2. Coba cari bagian HTML
  const htmlStart = content.search(/<!DOCTYPE|<html|<body/i);
  if (htmlStart !== -1) {
    content = content.substring(htmlStart);
  } else {
    // Kalau tidak ketemu tag html, coba cari header Content-Type
    const parts = content.split('Content-Type: text/html');
    if (parts.length > 1) {
      content = parts[1];
      const firstTag = content.search(/</); 
      if (firstTag !== -1) content = content.substring(firstTag);
    }
  }

  // 3. Hapus boundary akhir
  content = content.replace(/--[a-zA-Z0-9._-]+--\s*$/, '');
  
  // 4. Pastikan link terbuka di tab baru (Security)
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
  
  // STATE TAMPILAN
  const [showCustom, setShowCustom] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copyTooltip, setCopyTooltip] = useState(false);
  
  // STATE POPUP PESAN (MODAL)
  const [openedMail, setOpenedMail] = useState(null); // Menyimpan email yang sedang dibuka

  // 1. Ambil Domain saat Load
  useEffect(() => {
    fetch('/api/email?action=domains')
      .then(res => res.json())
      .then(data => {
        if (data.domains && data.domains.length > 0) {
          setDomains(data.domains);
          setSelectedDomain(data.domains[0]);
          acakEmail(data.domains[0]);
        }
      });
  }, []);

  const acakEmail = (domain) => {
    const randomUser = 'user' + Math.floor(Math.random() * 99999);
    setUsername(randomUser);
    setFullEmail(`${randomUser}@${domain}`);
    setEmails([]); 
    setOpenedMail(null);
  };

  const checkInbox = async () => {
    if (!username || !selectedDomain) return;
    setLoading(true);
    const address = `${username}@${selectedDomain}`;
    try {
      const res = await fetch(`/api/email?action=inbox&address=${address}`);
      const data = await res.json();
      if (data.emails) setEmails(data.emails);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    if (fullEmail && !fullEmail.includes('Loading')) {
      const interval = setInterval(checkInbox, 10000);
      return () => clearInterval(interval);
    }
  }, [fullEmail]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullEmail);
    setCopyTooltip(true);
    setTimeout(() => setCopyTooltip(false), 2000);
  };

  const handleSimpan = () => {
    if (!username) return;
    setFullEmail(`${username}@${selectedDomain}`);
    setEmails([]);
    setOpenedMail(null);
    setShowCustom(false);
    checkInbox();
  };

  return (
    <div className="container-main">
        
      <div className="hero-text">
        <h1>Your 10 Minute Mail address</h1>
        <p>Forget about spam. Keep your real inbox clean and secure.</p>
      </div>

      <div className="control-panel">
        <div className="email-wrap">
          <input type="text" className="email-input" value={fullEmail} readOnly />
          <div className={`tooltip-copy ${copyTooltip ? 'show' : ''}`}>Disalin!</div>
          <button className="btn-copy" onClick={handleCopy}>
            <svg style={{width:'20px',height:'20px',fill:'none',stroke:'currentColor',strokeWidth:'2'}} viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
        </div>

        <div className="action-btns">
          <button className="btn-act" onClick={() => setShowCustom(!showCustom)}><i className="fa fa-pencil"></i> UBAH</button>
          <button className="btn-act" onClick={() => acakEmail(selectedDomain)}><i className="fa fa-random"></i> ACAK</button>
          <button className="btn-act" onClick={checkInbox}><i className={`fa fa-refresh ${loading ? 'fa-spin' : ''}`}></i> REFRESH</button>
        </div>

        {showCustom && (
          <div id="customWell" style={{display: 'block'}}>
            <label style={{fontSize:'11px', fontWeight:'700', color:'#888', marginBottom:'5px', display:'block'}}>BUAT EMAIL BARU</label>
            <div className="merged-group">
              <input type="text" className="inp-user" placeholder="User" value={username} onChange={(e) => setUsername(e.target.value)} />
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
            <button className="btn-save" onClick={handleSimpan}>SIMPAN PERUBAHAN</button>
          </div>
        )}
      </div>

      <div className="panel panel-info panel-inbox">
        <div className="panel-heading-inbox">
          <i className="fa fa-inbox"></i> KOTAK MASUK <span className="pull-right label label-success" style={{top:'2px', position:'relative'}}>Live</span>
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

          {/* LIST EMAIL (BISA DIKLIK) */}
          {emails.length > 0 && (
            <div className="list-group">
              {emails.map((mail, i) => (
                <div 
                  key={i} 
                  className="list-group-item" 
                  onClick={() => setOpenedMail(mail)} // SAAT DIKLIK, BUKA EMAIL
                  style={{cursor: 'pointer', borderLeft: '4px solid #007bff', marginBottom:'1px'}}
                >
                  <div style={{fontWeight:'bold', color:'#333'}}>
                    {mail.sender} 
                    <small className="pull-right text-muted">{new Date(mail.created_at).toLocaleTimeString()}</small>
                  </div>
                  <div style={{color:'#007bff', fontWeight:'500'}}>{mail.subject}</div>
                  {/* Preview singkat pesan */}
                  <div style={{fontSize:'12px', color:'#777', overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis', marginTop:'4px'}}>
                     {mail.message.substring(0, 50)}...
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* --- POPUP / MODAL UNTUK BACA EMAIL --- */}
      {openedMail && (
        <div style={{
          position: 'fixed', top:0, left:0, width:'100%', height:'100%', 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, 
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: '#fff', width: '90%', maxWidth: '800px', height: '80%', 
            borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}>
            {/* Header Popup */}
            <div style={{padding: '15px', borderBottom: '1px solid #eee', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#f8f9fa'}}>
              <div>
                <h4 style={{margin:0, color:'#333'}}>{openedMail.subject}</h4>
                <small style={{color:'#666'}}>From: {openedMail.sender}</small>
              </div>
              <button onClick={() => setOpenedMail(null)} style={{background:'none', border:'none', fontSize:'20px', cursor:'pointer'}}>&times;</button>
            </div>
            
            {/* Isi Email (iframe biar aman & rapi) */}
            <div style={{flex: 1, position: 'relative'}}>
              <iframe 
                srcDoc={processEmailContent(openedMail.message)} 
                style={{width: '100%', height: '100%', border: 'none'}} 
                title="Email Content"
              />
            </div>
            
            {/* Footer Popup */}
            <div style={{padding: '10px', textAlign: 'right', borderTop: '1px solid #eee'}}>
              <button className="btn-act" onClick={() => setOpenedMail(null)} style={{width:'auto', padding:'5px 15px'}}>Tutup</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
