import { useEffect } from 'react'
import { Link } from 'react-router-dom'

function Privacy() {
  const base = import.meta.env.BASE_URL
  const img = (file) => `${base}img/${file}`

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }, [])

  return (
    <>
      <header className="site-header">
        <div className="wrapper nav-wrap">
          <Link to="/" className="brand">
            <img src={img('next.jpeg')} alt="Logo" />
            <span>Max Tour & Safari</span>
          </Link>

          <nav className="main-nav">
            <Link to="/">Home</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/faqs">FAQs</Link>
          </nav>
        </div>
      </header>

      <section className="page-hero">
        <div className="wrapper hero-content">
          <span className="eyebrow">Your Privacy Matters</span>
          <h1>Privacy Policy</h1>
          <p>We respect your privacy and are committed to protecting your personal information.</p>
        </div>
      </section>

      <section className="legal-section">
        <div className="wrapper legal-content">
          <div className="legal-card">
            <div className="card-head">
              <i data-lucide="database"></i>
              <h2>Information We Collect</h2>
            </div>
            <ul className="legal-list">
              <li>Personal details such as name, email, and phone number.</li>
              <li>Booking information submitted through our forms.</li>
              <li>Messages and inquiries you send through our website.</li>
            </ul>
          </div>

          <div className="legal-card">
            <div className="card-head">
              <i data-lucide="settings"></i>
              <h2>How We Use Your Information</h2>
            </div>
            <ul className="legal-list">
              <li>To process bookings and respond to inquiries.</li>
              <li>To provide customer support during your travel.</li>
              <li>To improve our services and user experience.</li>
            </ul>
          </div>

          <div className="legal-card">
            <div className="card-head">
              <i data-lucide="shield-check"></i>
              <h2>Data Protection</h2>
            </div>
            <ul className="legal-list">
              <li>Your data is securely stored and handled responsibly.</li>
              <li>We do not sell or share your personal data with third parties.</li>
              <li>Access to data is limited to authorized personnel only.</li>
            </ul>
          </div>

          <div className="legal-card">
            <div className="card-head">
              <i data-lucide="refresh-cw"></i>
              <h2>Your Rights</h2>
            </div>
            <ul className="legal-list">
              <li>You can request to update or delete your personal data.</li>
              <li>You can contact us anytime regarding your information.</li>
            </ul>
          </div>

          <div className="legal-card">
            <div className="card-head">
              <i data-lucide="headset"></i>
              <h2>Contact Us</h2>
            </div>
            <p>If you have any questions about this policy, contact us:</p>
            <br />
            <p><strong>Email:</strong> tours@nextgencreatives.co.tz</p>
            <p><strong>Phone:</strong> +255 744 929 721</p>
          </div>
        </div>
      </section>

      <footer className="site-footer" style={{ textAlign: 'center' }}>
        <div className="wrapper footer-simple">
          <p>© 2026 Max Tour & Safari</p>

          <div className="footer-links">
            <Link to="/terms">Terms</Link>
            <Link to="/faqs">FAQs</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Privacy