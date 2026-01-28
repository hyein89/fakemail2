'use client';
import { CONFIG } from '../config';
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container-main">
        <div className="footer-top">
          <a href="/privacy">Kebijakan Privasi</a>
          <a href="/terms">Ketentuan Penggunaan</a>
        </div>
        <div className="footer-bottom clearfix">
          <div className="copyright">
            Copyright {CONFIG.siteName} Service<br/>
            <small>www.{CONFIG.dom}</small>
          </div>
          <div className="socials">
            <i className="fa fa-facebook-official"></i>
            <i className="fa fa-twitter"></i>
          </div>
        </div>
      </div>
    </footer>
  );
}
