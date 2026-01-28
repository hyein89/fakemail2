'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <div className="navbar-top">
      <div className="brand-logo">
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display:'flex', alignItems:'center', gap:'10px' }}>
          <svg viewBox="0 0 24 24" style={{width: '24px', height:'24px', fill:'currentColor'}}>
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          <span>EU.ORG<b>F-EMAIL</b></span>
        </Link>
      </div>
    </div>
  );
}
