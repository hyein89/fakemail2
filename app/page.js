'use client';
import { useState, useEffect } from 'react';
import { CONFIG } from './config'; // <--- TAMBAHKAN INI DI PALING ATAS

// --- FUNGSI DECODER CANGGIH (Sama seperti sebelumnya) ---
const processEmailContent = (rawText) => {
  if (!rawText) return "<html><body><p>No message content.</p></body></html>";
  let content = rawText;
  try {
    content = content
      .replace(/=\r\n/g, '').replace(/=\n/g, '')
      .replace(/=([0-9A-F]{2})=([0-9A-F]{2})=([0-9A-F]{2})/gi, (m, h1, h2, h3) => decodeURIComponent(`%${h1}%${h2}%${h3}`))
      .replace(/=([0-9A-F]{2})=([0-9A-F]{2})/gi, (m, h1, h2) => decodeURIComponent(`%${h1}%${h2}`))
      .replace(/=([0-9A-F]{2})/gi, (m, hex) => {
        if (hex === '3D') return '=';
        if (hex === '20') return ' ';
        return String.fromCharCode(parseInt(hex, 16));
      });
  } catch (e) {}

  const htmlStart = content.search(/<!DOCTYPE|<html|<body|<div/i);
  if (htmlStart !== -1) {
    content = content.substring(htmlStart);
  } else {
    const parts = content.split('Content-Type: text/html');
    if (parts.length > 1) {
      let bodyPart = parts[1].replace(/Content-Transfer-Encoding:.*?\n\n/s, '');
      const firstTag = bodyPart.search(/</);
      if (firstTag !== -1) content = bodyPart.substring(firstTag);
    }
  }
  content = content.replace(/--[a-zA-Z0-9._-]+--\s*$/, '');
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
  
  // STATE UI
  const [showCustom, setShowCustom] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copyTooltip, setCopyTooltip] = useState(false);
  const [openedMail, setOpenedMail] = useState(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    fetch('/api/email?action=domains')
      .then(res => res.json())
      .then(data => {
        if (data.domains && data.domains.length > 0) {
          setDomains(data.domains);
          const savedEmail = localStorage.getItem('my_fake_email');
          if (savedEmail) {
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
            setSelectedDomain(data.domains[0]);
            acakEmail(data.domains[0]);
          }
        }
      });
  }, []);

  // --- LOGIC ---
  const simpanKeMemori = (emailBaru) => {
    localStorage.setItem('my_fake_email', emailBaru);
    setFullEmail(emailBaru);
    setEmails([]); 
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
      if (data.emails) setEmails(data.emails);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    if (fullEmail && !fullEmail.includes('Loading')) {
      const interval = setInterval(() => { cekInboxLangsung(fullEmail); }, 5000); 
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
        <p>Instantly generate a disposable 10 Minute Mail that self-destructed just after ten minutes. Keep your real email address private and your inbox clean from unwanted messages and spam.</p>
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
          <button className="btn-act" onClick={() => cekInboxLangsung(fullEmail)}>
            <i className={`fa fa-refresh ${loading ? 'fa-spin' : ''}`}></i> REFRESH
          </button>
        </div>

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

      {/* --- INBOX LIST (DESAIN BARU) --- */}
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
        
        <div className="panel-body" style={{minHeight:'250px', padding:0, background:'#f9f9f9'}}>
          
          {loading && emails.length === 0 && <div className="text-center" style={{paddingTop:'60px'}}><div className="spinner"></div></div>}
          
          {!loading && emails.length === 0 && (
            <div className="text-center" style={{paddingTop:'60px'}}>
              <div className="spinner"></div>
              <h4 style={{color:'#555'}}>Inbox Kosong</h4>
              <p className="text-muted">Menunggu pesan masuk...</p>
            </div>
          )}

          {/* LIST EMAIL GAYA GMAIL (Flexbox Layout) */}
          {emails.length > 0 && (
            <div className="list-group">
              {emails.map((mail, i) => (
                <div 
                  key={i} 
                  className="list-group-item" 
                  onClick={() => setOpenedMail(mail)} 
                  style={{
                    cursor: 'pointer', 
                    marginBottom:'1px', 
                    background:'#fff',
                    borderLeft: 'none', // Hapus border kiri lama
                    borderBottom: '1px solid #eee',
                    padding: '15px',
                    display: 'flex', // KUNCI UTAMA: Flexbox biar sejajar
                    alignItems: 'flex-start', // Rata atas
                    gap: '15px' // Jarak antara Icon dan Teks
                  }}
                >
                  {/* 1. ICON BESAR (Sebelah Kiri) */}
                  <div style={{
                    minWidth: '45px', 
                    height: '45px', 
                    background: '#e3f2fd', 
                    borderRadius: '50%', // Bulat
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#2196f3'
                  }}>
                    {/* SVG AMPLOP KEREN */}
                    <svg style={{width:'24px', height:'24px', fill:'currentColor'}} viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>

                  {/* 2. KONTEN TEKS (Sebelah Kanan) */}
                  <div style={{flex: 1, overflow:'hidden'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'3px'}}>
                        {/* Pengirim */}
                        <span style={{fontWeight:'bold', color:'#333', fontSize:'15px'}}>
                            {mail.sender.split('@')[0]} {/* Ambil nama depan aja biar gak kepanjangan */}
                        </span>
                        {/* Jam */}
                        <small style={{color:'#999', fontSize:'11px', whiteSpace:'nowrap'}}>
                            {new Date(mail.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                        </small>
                    </div>

                    {/* Subjek (Warna Biru) */}
                    <div style={{
                        color:'#007bff', fontWeight:'600', fontSize:'14px', 
                        marginBottom:'4px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'
                    }}>
                        {mail.subject}
                    </div>

                    {/* Preview (Abu-abu) */}
                    <div style={{
                        fontSize:'13px', color:'#666', 
                        whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'
                    }}>
                        {mail.sender}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          
         )}
        </div>
      </div>


      {/* --- AREA ARTIKEL SEO (MULAI) --- */}
      <div className="article-plain">

        <h2>The Ultimate Guide to 10 Minute Mail and Digital Privacy</h2>
        <p>
            In the rapidly expanding digital universe, personal data has become the most valuable currency. Every website, application, and online service seems to demand a piece of your identity, starting with your email address. This creates a significant dilemma for internet users who value their privacy. Enter <strong>{CONFIG.siteName}</strong>, a robust solution that provides what is commonly known as "10 Minute Mail" or disposable temporary email. This service is not just a tool; it is a digital shield designed to protect your primary identity from the overwhelming tide of spam, phishing attempts, and data tracking that plagues the modern web.
        </p>
        <p>
            Fundamentally, <strong>{CONFIG.siteName}</strong> provides users with a transient, self-destructing email address. Unlike standard email providers like Gmail, Yahoo, or Outlook, which require personal details, phone verification, and permanent storage, our service requires absolutely no information from you. You simply visit the site, and an email address is generated instantly. This address is fully functional, capable of receiving verification codes, activation links, and text messages just like a regular inbox. The crucial difference lies in its lifespan: it is programmed to expire after a set duration, typically ten minutes, ensuring that your digital footprint is erased automatically.
        </p>

        <h2>Why You Desperately Need an Anonymous Email</h2>
        <p>
            You might be asking yourself, "Why can't I just use my regular email address and delete the spam later?" The reality is that once your email address is shared with a third-party website, you lose control over it. Marketing databases are frequently sold, traded, or leaked. A single sign-up for a free eBook or a Wi-Fi connection at a coffee shop can lead to years of unsolicited marketing emails. <strong>{CONFIG.siteName}</strong> solves this problem at the root. By using a disposable address, the spam goes to a temporary inbox that ceases to exist after you are done with it. Your real inbox remains pristine, organized, and reserved for important personal and professional communication.
        </p>
        <p>
            Beyond mere annoyance, there is a serious security aspect to consider. Cybersecurity breaches are becoming increasingly common. When a forum or a minor website gets hacked, the attackers often dump the database of user emails and passwords online. If you use your main email for every random service, you are exposing your primary identity to hackers. By using <strong>{CONFIG.dom}</strong> for these low-trust interactions, you effectively quarantine potential threats. Even if the temporary email is compromised in a data breach, it leads nowhere. It cannot be traced back to you, it contains no personal history, and it has likely already been deleted from our servers.
        </p>
        <p>
            Furthermore, <strong>{CONFIG.siteName}</strong> is an invaluable tool for professionals. Software developers, Quality Assurance (QA) testers, and UX designers often need to test registration flows or user onboarding processes. Creating hundreds of permanent Gmail accounts for testing is impossible due to phone verification blocks. With our service, a developer can generate a fresh email, test the verification process, and discard it in seconds, streamlining the development workflow significantly.
        </p>

        <h2>How the Technology Works Behind the Scenes</h2>
        <p>
            The magic of <strong>{CONFIG.siteName}</strong> lies in its backend architecture, which balances complexity with user simplicity. When a user lands on our homepage, our server immediately allocates a unique identifier combined with one of our premium domain names. This creates a valid SMTP (Simple Mail Transfer Protocol) address. To the outside world, this looks exactly like a standard email address. We employ enterprise-grade mail servers that are constantly listening for incoming connections.
        </p>
        <p>
            On the user side, we utilize advanced asynchronous web technologies, specifically AJAX polling or WebSockets. This allows the browser to maintain an active connection with our database without requiring the user to refresh the page manually. As soon as an email arrives at our mail server, it is parsed, processed for safety, and instantly pushed to the frontend interface. This real-time synchronization ensures that you receive your verification codes the moment they are sent, often faster than traditional email providers which may have aggressive spam filtering delays.
        </p>
        <p>
            Privacy is hardcoded into our infrastructure. We operate on a strict "No-Logs" policy. The emails are stored in temporary memory (RAM) or transient database tables that are scheduled for hard deletion. Once the timer runs out, or if the user clicks the delete button, a cron job executes a purge command. This ensures that the data is not just hidden, but irretrievably destroyed. We do not track IP addresses for marketing purposes, nor do we analyze the content of your emails for ad targeting.
        </p>

        <h2>Step-by-Step Guide: How to Use 10 Minute Mail</h2>
        <p>
            We have designed <strong>{CONFIG.siteName}</strong> to be the most user-friendly privacy tool on the internet. There is zero learning curve. The first step is simply accessing <strong>{CONFIG.dom}</strong>. Unlike other tools that ask you to select a username or solve a captcha, our system auto-generates a ready-to-use address immediately upon loading. You will see this address displayed prominently in the central control box.
        </p>
        <p>
            The second step is to copy this address. We have provided a convenient "Copy" button or icon next to the address field. One click is all it takes to save the address to your clipboard. You will see a notification confirming the action. Now, leave our tab open and navigate to the website, app, or service where you need to register. Paste the copied address into their registration form and hit send.
        </p>
        <p>
            The final step is the verification. Return to the <strong>{CONFIG.siteName}</strong> tab. You do not need to do anything but watch. Within seconds, the incoming email will appear in the "Inbox" list below the main panel. Click on the subject line to expand the email. You can then read the content, click confirmation links, or copy OTP codes. If the email has not arrived yet, or if you need more time to complete a transaction, simply click the "Refresh" button. This resets the countdown timer, giving you another full ten minutes of usage.
        </p>

        <h2>Conclusion: Reclaiming Your Digital Freedom</h2>
        <p>
            In conclusion, the internet was built on the promise of connectivity, but it has evolved into a surveillance economy. <strong>{CONFIG.siteName}</strong> empowers you to take back control. It provides a simple, effective, and free method to interact with the web on your own terms. You no longer have to trade your privacy for access. You no longer have to fear that signing up for a newsletter will result in years of spam.
        </p>
        <p>
            Whether you are a privacy-conscious individual, a tech professional testing software, or someone who simply wants to keep their digital life organized, <strong>{CONFIG.dom}</strong> is your essential companion. It is fast, it is secure, and most importantly, it is completely anonymous. Bookmark our site today and make it your first line of defense in the digital world. Stop spam before it starts, and enjoy the freedom of a clean inbox.
        </p>

      </div>
      {/* --- AREA ARTIKEL SEO (SELESAI) --- */}


      {/* POPUP FULLSCREEN */}
      {openedMail && (
        <div style={{
          position: 'fixed', top:0, left:0, width:'100%', height:'100%', 
          backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 99999, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding:'10px'
        }}>
          <div style={{
            backgroundColor: '#fff', width: '100%', maxWidth: '700px', height: '95%', 
            borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }}>
            <div style={{padding: '15px', borderBottom: '1px solid #eee', background:'#f8f9fa', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h4 style={{margin:0, fontSize:'16px', fontWeight:'bold', color:'#333', overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis', maxWidth:'80%'}}>
                  {openedMail.subject}
              </h4>
              <button onClick={() => setOpenedMail(null)} style={{background:'#ff4d4d', color:'white', border:'none', width:'32px', height:'32px', borderRadius:'50%', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>
                 <i className="fa fa-times" style={{fontSize:'16px'}}></i>
              </button>
            </div>
            
            <div style={{flex: 1, position: 'relative', background:'#fff'}}>
              <iframe 
                srcDoc={processEmailContent(openedMail.message)} 
                style={{width: '100%', height: '100%', border: 'none'}} 
                title="Email Content"
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
              />
            </div>
            
            <div style={{padding: '12px', textAlign: 'center', borderTop: '1px solid #eee', background:'#fff'}}>
              <button className="btn-act" onClick={() => setOpenedMail(null)} style={{width:'100%', maxWidth:'200px', background:'#f1f1f1', color:'#333', border:'1px solid #ddd'}}>
                Tutup Pesan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
