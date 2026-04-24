import { useEffect } from 'react'
import { Link } from 'react-router-dom'
function Faqs() {
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
            <img src={img('next.jpeg')} alt="Max Tour & Safari Logo" />
            <span>Max Tour & Safari</span>
          </Link>

          <nav className="main-nav">
            <Link to="/">Home</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </nav>
        </div>
      </header>

      <section className="page-hero">
        <div className="wrapper hero-content">
          <span className="eyebrow">Need Help?</span>
          <h1>Frequently Asked Questions</h1>
          <p>Find quick answers about bookings, payments, tours, transport, and travel support.</p>
        </div>
      </section>

      <section className="legal-section">
        <div className="wrapper faq-layout">
          <div className="faq-card">
            <div className="card-head">
              <i data-lucide="circle-help"></i>
              <h2>General Questions</h2>
            </div>

            <div className="faq-list">
              <details>
                <summary>How do I book a tour?</summary>
                <p>You can book directly through our website booking form or contact our team for custom arrangements.</p>
              </details>

              <details>
                <summary>Do you offer private tours?</summary>
                <p>Yes, we offer both private and shared tours depending on the package and your travel preference.</p>
              </details>

              <details>
                <summary>Can you arrange airport transfer?</summary>
                <p>Yes, airport transfers can be arranged as part of your trip or as a separate service.</p>
              </details>

              <details>
                <summary>Do you help with hotel booking?</summary>
                <p>Yes, we can help arrange accommodation depending on your package and budget.</p>
              </details>
            </div>
          </div>

          <div className="faq-card">
            <div className="card-head">
              <i data-lucide="credit-card"></i>
              <h2>Booking & Payment</h2>
            </div>

            <div className="faq-list">
              <details>
                <summary>How much deposit is needed?</summary>
                <p>A deposit is usually required to confirm your trip, and the balance is completed before travel.</p>
              </details>

              <details>
                <summary>Which payment methods do you accept?</summary>
                <p>We accept bank transfer, card payments, and selected mobile money options.</p>
              </details>

              <details>
                <summary>Will I receive confirmation after payment?</summary>
                <p>Yes, once payment is received, we send booking confirmation and trip details.</p>
              </details>
            </div>
          </div>

          <div className="faq-card">
            <div className="card-head">
              <i data-lucide="ship-wheel"></i>
              <h2>Tours & Activities</h2>
            </div>

            <div className="faq-list">
              <details>
                <summary>Are snorkeling tours suitable for beginners?</summary>
                <p>Yes, many snorkeling tours are beginner-friendly, but basic comfort in water is recommended.</p>
              </details>

              <details>
                <summary>What should I wear during tours?</summary>
                <p>Light comfortable clothing is ideal, and modest dress is recommended for cultural areas such as Stone Town.</p>
              </details>

              <details>
                <summary>Can tour plans change due to weather?</summary>
                <p>Yes, some sea or outdoor tours may be adjusted for safety if weather conditions change.</p>
              </details>

              <details>
                <summary>Do you offer customized itineraries?</summary>
                <p>Yes, we can prepare custom itineraries for couples, families, groups, or special travel interests.</p>
              </details>
            </div>
          </div>

          <div className="faq-card">
            <div className="card-head">
              <i data-lucide="shield-check"></i>
              <h2>Travel Support</h2>
            </div>

            <div className="faq-list">
              <details>
                <summary>Do I need travel insurance?</summary>
                <p>Travel insurance is always recommended for medical support, delays, and unexpected changes.</p>
              </details>

              <details>
                <summary>Can I contact your team during my trip?</summary>
                <p>Yes, our team remains available to assist you during your stay and activities.</p>
              </details>

              <details>
                <summary>Do you assist international travelers?</summary>
                <p>Yes, we regularly work with international guests and help them plan smooth travel experiences.</p>
              </details>
            </div>
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

export default Faqs