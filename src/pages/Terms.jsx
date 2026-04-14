import { useEffect } from 'react'
import { Link } from 'react-router-dom'
function Terms() {
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
            <Link to="/daily-tours">Day Tours</Link>
            <Link to="/holiday-packages">Holiday Tours</Link>
            <Link to="/agents">Agents</Link>
            <Link to="/faqs">FAQs</Link>
          </nav>
        </div>
      </header>

      <section className="page-hero">
        <div className="wrapper hero-content">
          <span className="eyebrow">Important Information</span>
          <h1>Terms & Conditions</h1>
          <p>
            Please review our booking, payment, travel, and service terms before confirming
            your trip.
          </p>
        </div>
      </section>

      <section className="legal-section">
        <div className="wrapper legal-layout">
          <aside className="legal-sidebar">
            <div className="sidebar-card">
              <h3>Quick Links</h3>
              <a href="#booking-payment">Booking & Payment</a>
              <a href="#cancellation">Cancellation Policy</a>
              <a href="#health-safety">Health & Safety</a>
              <a href="#what-to-pack">What to Pack</a>
              <a href="#important-info">Important Information</a>
              <a href="#extra-cost">Optional Add-ons</a>
              <a href="#support">Help & Support</a>
            </div>
          </aside>

          <div className="legal-content">
            <section className="legal-card" id="booking-payment">
              <div className="card-head">
                <i data-lucide="wallet"></i>
                <h2>Booking & Payment Terms</h2>
              </div>
              <ul className="legal-list">
                <li>Advance booking is recommended at least 21 days before travel.</li>
                <li>A 50% deposit is required to confirm the booking.</li>
                <li>The remaining balance should be completed 14 days before departure.</li>
                <li>
                  Accepted payment methods include bank transfer, Visa, Mastercard, and
                  mobile money.
                </li>
                <li>Booking confirmation is normally sent within 24 hours after deposit receipt.</li>
              </ul>
            </section>

            <section className="legal-card" id="cancellation">
              <div className="card-head">
                <i data-lucide="badge-alert"></i>
                <h2>Cancellation Policy</h2>
              </div>
              <ul className="legal-list">
                <li>More than 30 days before travel: refund available minus processing charges.</li>
                <li>21–30 days before travel: partial refund applies.</li>
                <li>14–20 days before travel: reduced refund applies.</li>
                <li>7–13 days before travel: limited refund applies.</li>
                <li>Less than 7 days before travel or no-show: no refund.</li>
                <li>In case of force majeure, guests may receive a refund or reschedule option.</li>
              </ul>
            </section>

            <section className="legal-card" id="health-safety">
              <div className="card-head">
                <i data-lucide="shield-plus"></i>
                <h2>Health & Safety</h2>
              </div>
              <ul className="legal-list">
                <li>Guests should be in suitable physical condition for water and outdoor activities.</li>
                <li>Swimming ability is recommended for snorkeling experiences.</li>
                <li>Please inform us in advance about allergies or medical conditions.</li>
                <li>Travelers should follow current Tanzania and Zanzibar health requirements.</li>
                <li>Basic first aid support is available during tours.</li>
              </ul>
            </section>

            <section className="legal-card" id="what-to-pack">
              <div className="card-head">
                <i data-lucide="briefcase"></i>
                <h2>What to Pack</h2>
              </div>
              <ul className="legal-list">
                <li>Valid passport and required travel documents.</li>
                <li>Sunscreen, sunglasses, hat, and light clothing.</li>
                <li>Swimwear, beach towel, and comfortable footwear.</li>
                <li>Insect repellent, personal medication, and toiletries.</li>
                <li>For cultural visits, modest clothing is recommended.</li>
              </ul>
            </section>

            <section className="legal-card" id="important-info">
              <div className="card-head">
                <i data-lucide="info"></i>
                <h2>Important Information</h2>
              </div>
              <ul className="legal-list">
                <li>Accommodation arrangements depend on the selected package.</li>
                <li>Check-in and check-out times follow property rules.</li>
                <li>Children’s rates may vary depending on age and package type.</li>
                <li>Itineraries may change slightly due to weather or operational reasons.</li>
                <li>
                  Zanzibar has strong cultural and religious values, so respectful dress is
                  appreciated.
                </li>
              </ul>
            </section>

            <section className="legal-card" id="extra-cost">
              <div className="card-head">
                <i data-lucide="plus-circle"></i>
                <h2>Optional Add-ons</h2>
              </div>
              <ul className="legal-list">
                <li>Scuba diving</li>
                <li>Sunset dhow cruise</li>
                <li>Spa treatments</li>
                <li>Kite surfing lessons</li>
                <li>Deep sea fishing</li>
                <li>Prison Island tour</li>
              </ul>
            </section>

            <section className="legal-card support-card" id="support">
              <div className="card-head">
                <i data-lucide="headset"></i>
                <h2>Help & Support</h2>
              </div>
              <div className="support-grid">
                <div className="support-item">
                  <i data-lucide="phone-call"></i>
                  <div>
                    <h4>Call Us</h4>
                    <p>+255 744 929 721</p>
                  </div>
                </div>

                <div className="support-item">
                  <i data-lucide="mail"></i>
                  <div>
                    <h4>Email</h4>
                    <p>tours@nextgencreatives.co.tz</p>
                  </div>
                </div>
              </div>
            </section>
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

export default Terms