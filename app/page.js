'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [username, setUsername] = useState('');
  const [fullEmail, setFullEmail] = useState('');
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ambil daftar domain saat load
  useEffect(() => {
    fetch('/api/email?action=domains')
      .then(res => res.json())
      .then(data => {
        if (data.domains && data.domains.length > 0) {
          setDomains(data.domains);
          setSelectedDomain(data.domains[0]);
          setUsername('user' + Math.floor(Math.random() * 10000));
        }
      });
  }, []);

  // Fungsi Cek Inbox
  const checkInbox = async () => {
    if (!username || !selectedDomain) return;
    setLoading(true);
    const emailAddr = `${username}@${selectedDomain}`;
    setFullEmail(emailAddr);

    try {
      const res = await fetch(`/api/email?action=inbox&address=${emailAddr}`);
      const data = await res.json();
      if (data.emails) setEmails(data.emails);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>📨 Temp Mail Multi-Domain</h1>
      
      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', background: '#f9f9f9' }}>
        <label style={{display: 'block', marginBottom: '10px', fontWeight: 'bold'}}>Buat Email:</label>
        <div style={{ display: 'flex', gap: '5px' }}>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <span style={{padding: '10px'}}>@</span>
          <select 
            value={selectedDomain} 
            onChange={(e) => setSelectedDomain(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          >
            {domains.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        
        <button 
          onClick={checkInbox}
          style={{ 
            marginTop: '15px', 
            width: '100%', 
            padding: '12px', 
            background: 'black', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Sedang Memuat...' : 'Cek Inbox / Refresh'}
        </button>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Kotak Masuk: {fullEmail}</h3>
        <hr/>
        {emails.length === 0 ? (
          <p style={{color: '#888', textAlign: 'center'}}>Belum ada email masuk.</p>
        ) : (
          emails.map((m, index) => (
            <div key={index} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
              <div style={{fontWeight: 'bold', color: '#333'}}>Dari: {m.sender}</div>
              <div style={{color: '#0070f3'}}>Subjek: {m.subject}</div>
              <div style={{ marginTop: '10px', background: '#fff', padding: '10px', border: '1px solid #eee', borderRadius: '5px' }}>
                {m.message}
              </div>
              <small style={{color: '#999'}}>{new Date(m.created_at).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
