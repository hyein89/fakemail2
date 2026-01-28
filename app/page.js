'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  // --- STATE (Penyimpan Data) ---
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [username, setUsername] = useState('');
  const [fullEmail, setFullEmail] = useState('Loading...');
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State untuk Tampilan (Pengganti jQuery)
  const [showCustom, setShowCustom] = useState(false); // Untuk tombol UBAH
  const [showDropdown, setShowDropdown] = useState(false); // Untuk dropdown domain
  const [copyStatus, setCopyStatus] = useState(false); // Untuk tooltip copy

  // 1. Ambil daftar domain saat website dibuka
  useEffect(() => {
    fetch('/api/email?action=domains')
      .then(res => res.json())
      .then(data => {
        if (data.domains && data.domains.length > 0) {
          setDomains(data.domains);
          setSelectedDomain(data.domains[0]);
          generateRandomEmail(data.domains[0]);
        }
      });
  }, []);

  // 2. Fungsi Generate Email Acak
  const generateRandomEmail = (domain) => {
    const randomName = 'user' + Math.floor(Math.random() * 99999);
    setUsername(randomName);
    setFullEmail(`${randomName}@${domain}`);
    setEmails([]); // Reset inbox
  };

  // 3. Fungsi Cek Inbox (Refresh)
  const checkInbox = async () => {
    if (!username || !selectedDomain) return;
    setLoading(true);
    const emailAddr = `${username}@${selectedDomain}`;

    try {
      const res = await fetch(`/api/email?action=inbox&address=${emailAddr}`);
      const data = await res.json();
      if (data.emails) {
        setEmails(data.emails);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // 4. Fungsi Simpan Perubahan (Tombol Simpan)
  const handleSaveCustom = () => {
    if(!username) return alert("Nama pengguna tidak boleh kosong");
    setFullEmail(`${username}@${selectedDomain}`);
    setEmails([]); // Reset inbox karena ganti email
    setShowCustom(false); // Tutup menu ubah
    checkInbox(); // Langsung cek inbox
  };

  // 5. Fungsi Copy ke Clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(fullEmail);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000); // Hilangkan tooltip setelah 2 detik
  };

  // Auto refresh inbox setiap 10 detik
  useEffect(() => {
    if (fullEmail && !fullEmail.includes('Loading')) {
      const interval = setInterval(checkInbox, 10000);
      return () => clearInterval(interval);
    }
  }, [fullEmail]);


  // --- TAMPILAN HTML (JSX) ---
  return (
    <div className="container-main">
        
      <div className="hero-text">
        <h1>Your 10 Minute Mail address</h1>
        <p>Forget about spam and advertising mailings. Keep your real inbox clean and secure. 10 Minute Mail provides temporary, secure, anonymous, free, disposable email address for 10 minutes.</p>
      </div>

      <div className="control-panel">
        
        {/* Area Email Utama */}
        <div className="email-wrap">
          <input 
            type="text" 
            className="email-input" 
            value={fullEmail} 
            readOnly 
            id="myEmail" 
          />
          {/* Tooltip Copy */}
          <div className={`tooltip-copy ${copyStatus ? 'show' : ''}`} id="copyTooltip">
            Disalin!
          </div>
          <button className="btn-copy" onClick={handleCopy}>
            <svg style={{width:'20px', height:'20px', fill:'none', stroke:'currentColor', strokeWidth:2}} viewBox="0 0 24 24">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>

        {/* Tombol Aksi */}
        <div className="action-btns">
          <button className="btn-act" onClick={() => setShowCustom(!showCustom)}>
            <i className="fa fa-pencil"></i> UBAH
          </button>
          <button className="btn-act" onClick={() => generateRandomEmail(selectedDomain)}>
            <i className="fa fa-random"></i> ACAK
          </button>
          <button className="btn-act" onClick={checkInbox}>
            <i className={`fa fa-refresh ${loading ? 'fa-spin' : ''}`}></i> REFRESH
          </button>
        </div>

        {/* Menu Custom (Hidden by default) */}
        {showCustom && (
          <div id="customWell" style={{display: 'block'}}>
            <label style={{fontSize:'11px', fontWeight:700, color:'#888', textTransform:'uppercase', marginBottom:'5px', display:'block'}}>
              Buat Email Baru
            </label>
            
            <div className="merged-group">
              <input 
                type="text" 
                className="inp-user" 
                placeholder="Nama pengguna"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              
              {/* Dropdown Custom */}
              <div style={{position:'relative'}}>
                <div className="dd-trigger" onClick={() => setShowDropdown(!showDropdown)}>
                  <span id="txtDom">@{selectedDomain}</span>
                  <i className="fa fa-caret-down"></i>
                </div>

                {showDropdown && (
                  <div className="dd-menu" id="myDropdown" style={{display:'block'}}>
                    {domains.map((dom) => (
                      <div 
                        key={dom} 
                        className={`dd-item ${selectedDomain === dom ? 'selected' : ''}`} 
                        onClick={() => {
                          setSelectedDomain(dom);
                          setShowDropdown(false);
                        }}
                      >
                        @{dom}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button className="btn-save" onClick={handleSaveCustom}>SIMPAN PERUBAHAN</button>
          </div>
        )}
      </div>

      {/* Panel Inbox */}
      <div className="panel panel-info panel-inbox">
        <div className="panel-heading-inbox">
          <i className="fa fa-inbox"></i> KOTAK MASUK
          <span className="pull-right label label-success" style={{position:'relative', top:'2px'}}>Live</span>
        </div>
        
        <div className="panel-body" style={{minHeight:'250px', padding: emails.length === 0 ? '60px 0 0 0' : '0'}}>
          
          {loading && emails.length === 0 && (
             <div className="text-center"><div className="spinner"></div></div>
          )}

          {emails.length === 0 && !loading ? (
            <div className="text-center">
              <div className="spinner"></div> {/* Animasi spinner bawaan CSS kamu */}
              <h4 style={{color:'#555', marginBottom:'5px'}}>Inbox Kosong</h4>
              <p className="text-muted">Menunggu pesan masuk...</p>
            </div>
          ) : (
            // LIST EMAIL MASUK
            <div className="list-group">
              {emails.map((mail, idx) => (
                <div key={idx} className="list-group-item" style={{border:'none', borderBottom:'1px solid #eee', padding:'15px'}}>
                   <div style={{fontWeight:'bold', color:'#333', marginBottom:'5px'}}>
                      {mail.sender || 'Unknown'}
                      <small className="pull-right text-muted">{new Date(mail.created_at).toLocaleTimeString()}</small>
                   </div>
                   <div style={{color:'#007bff', fontWeight:'500'}}>{mail.subject}</div>
                   <div style={{marginTop:'8px', color:'#666', fontSize:'14px'}}>
                     {mail.message}
                   </div>
                </div>
              ))}
            </div>
          )}
          
        </div>
      </div>

    </div>
  );
}

