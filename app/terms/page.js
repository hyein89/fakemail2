import { CONFIG } from '../config';

export const metadata = {
  title: 'Terms of Service - ' + CONFIG.siteName,
  description: 'Read our Terms of Service. Guidelines for using our disposable email service responsibly.',
};

export default function TermsPage() {
  return (
    <div className="container-main">
      
      {/* JUDUL HALAMAN (Style sama persis dengan Privacy) */}
      <div className="hero-text" style={{ padding: '30px 10px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px', marginTop: 0 }}>Terms of Service</h1>
        <p style={{ color: '#777', fontSize: '14px' }}>Last Updated: {new Date().getFullYear()}</p>
      </div>

      {/* KONTEN ARTIKEL (Style sama persis dengan Privacy) */}
      <div className="seo-content-final" style={{ 
          marginBottom: '80px', 
          textAlign: 'left',
          padding: '0 10px', // Jarak pinggir 10px biar lebar di HP
          color: '#555',
          lineHeight: '1.7',
          fontSize: '15px'
      }}>

        <p style={{ marginBottom: '25px' }}>
          Welcome to <strong>{CONFIG.siteName}</strong>, accessible at <strong>{CONFIG.dom}</strong>. By accessing this website, we assume you accept these terms and conditions. Do not continue to use <strong>{CONFIG.siteName}</strong> if you do not agree to take all of the terms and conditions stated on this page. These Terms of Service govern your use of our disposable email service. Our service is designed to provide privacy and anonymity by offering temporary email addresses. By using our service, you acknowledge that the email addresses provided are temporary, the data is ephemeral, and we hold no liability for any data loss associated with the expiration of these emails.
        </p>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginTop: '30px', marginBottom: '10px' }}>
          Service Description and Limitations
        </h3>
        <p style={{ marginBottom: '25px' }}>
          <strong>{CONFIG.siteName}</strong> provides a free, temporary email service that allows users to receive emails at a disposable address. This service is provided on an "as is" and "as available" basis. We explicitly state that the email addresses generated are not permanent. Any email received is stored for a limited time only and will be automatically deleted from our servers. We do not guarantee the delivery of every email, nor do we guarantee that the service will be available at all times without interruption. You understand and agree that <strong>{CONFIG.siteName}</strong> is not suitable for receiving sensitive, legal, medical, or banking information, as the inbox is public-facing (if the address is guessed) and the data is transient.
        </p>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginTop: '30px', marginBottom: '10px' }}>
          User Conduct and Prohibited Activities
        </h3>
        <p style={{ marginBottom: '25px' }}>
          You agree to use <strong>{CONFIG.siteName}</strong> only for lawful purposes. You are strictly prohibited from using our service for any illegal activities, including but not limited to: sending spam or unsolicited messages (although our service is receive-only, this applies to any potential exploits), registering accounts for the purpose of fraud, phishing, spreading malware, or engaging in harassment. You must not attempt to hack, destabilize, or overwhelm our servers. You must not use our service to verify accounts on platforms where such actions violate the terms of those platforms. We reserve the right to block any user or IP address found to be violating these terms without prior notice.
        </p>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginTop: '30px', marginBottom: '10px' }}>
          Intellectual Property Rights
        </h3>
        <p style={{ marginBottom: '25px' }}>
          Unless otherwise stated, <strong>{CONFIG.siteName}</strong> and/or its licensors own the intellectual property rights for all material on this website. All intellectual property rights are reserved. You may access this from <strong>{CONFIG.dom}</strong> for your own personal use subjected to restrictions set in these terms and conditions. You must not republish material from our site, sell, rent, or sub-license material from our site, reproduce, duplicate or copy material from our site, or redistribute content from <strong>{CONFIG.siteName}</strong>. The technology, code, and design of the temporary email system are proprietary to us.
        </p>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginTop: '30px', marginBottom: '10px' }}>
          Disclaimer of Warranties
        </h3>
        <p style={{ marginBottom: '25px' }}>
          To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this website. Nothing in this disclaimer will limit or exclude our or your liability for death or personal injury, limit or exclude our or your liability for fraud or fraudulent misrepresentation, or exclude any of our or your liabilities that may not be excluded under applicable law. The service is provided without any warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the service will meet your specific requirements or that the service will be uninterrupted, timely, secure, or error-free.
        </p>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginTop: '30px', marginBottom: '10px' }}>
          Limitation of Liability
        </h3>
        <p style={{ marginBottom: '25px' }}>
          In no event shall <strong>{CONFIG.siteName}</strong>, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service. This includes any conduct or content of any third party on the service. Because some jurisdictions do not allow the exclusion or the limitation of liability for consequential or incidental damages, in such jurisdictions, our liability shall be limited to the maximum extent permitted by law.
        </p>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginTop: '30px', marginBottom: '10px' }}>
          Links to Third-Party Websites
        </h3>
        <p style={{ marginBottom: '25px' }}>
          Our service primarily functions to receive emails from third parties. These emails often contain links to external websites that are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services. You acknowledge and agree that <strong>{CONFIG.siteName}</strong> shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services. We strongly advise you to read the terms and conditions and privacy policies of any third-party websites or services that you visit.
        </p>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginTop: '30px', marginBottom: '10px' }}>
          Modifications to Terms
        </h3>
        <p style={{ marginBottom: '25px' }}>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect, but we are not obligated to do so for minor changes. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service. It is your responsibility to check this page periodically for changes.
        </p>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginTop: '30px', marginBottom: '10px' }}>
          Governing Law
        </h3>
        <p style={{ marginBottom: '25px' }}>
          These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which the site operator is based, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have had between us regarding the Service.
        </p>

      </div>
    </div>
  );
}
