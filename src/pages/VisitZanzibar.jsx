import { useState } from 'react'
import { Link } from 'react-router-dom'

function VisitZanzibar() {
  const base = import.meta.env.BASE_URL
  const img = (file) => `${base}img/${file}`

  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="site-header">
        <div className="wrapper nav-wrap">
          <Link to="/" className="brand">
            <img src={img('next.jpeg')} alt="Max Tour & Safari Logo" />
            <span>Max Tour & Safari</span>
          </Link>

          <button
            className="menu-toggle"
            id="menuToggle"
            aria-label="Open Menu"
            aria-expanded={menuOpen ? 'true' : 'false'}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            ☰
          </button>

          <nav className={`main-nav ${menuOpen ? 'active' : ''}`} id="mainNav">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/daily-tours" onClick={() => setMenuOpen(false)}>
              Day Tours
            </Link>
            <Link to="/holiday-packages" onClick={() => setMenuOpen(false)}>
              Holiday Packages
            </Link>
            <Link
              to="/visit-zanzibar"
              className="active"
              onClick={() => setMenuOpen(false)}
            >
              Visit Zanzibar
            </Link>
            <Link to="/agents" onClick={() => setMenuOpen(false)}>
              Agents
            </Link>
            <Link to="/gallery" onClick={() => setMenuOpen(false)}>
              Gallery
            </Link>
            <Link to="/booking" onClick={() => setMenuOpen(false)}>
              Book Now
            </Link>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>Visit Zanzibar</h1>
          <p>Beaches • Culture • History • Adventure</p>
        </div>
      </section>

      <section className="section">
        <div className="wrapper center">
          <h2>Why Visit Zanzibar?</h2>
          <p className="lead">
            Zanzibar is a paradise destination combining pristine beaches, rich culture,
            historical sites, and world-class snorkeling experiences.
          </p>
        </div>
      </section>

      <section className="section light">
        <div className="wrapper grid-2">
          <div>
            <h3>Zanzibar Overview</h3>
            <p>
              Zanzibar is an archipelago off the coast of Tanzania, famous for spices,
              Arab-influenced culture, and stunning tropical islands.
            </p>
            <p>
              Stone Town, a UNESCO World Heritage Site, offers history, culture, and
              unique architecture dating back centuries.
            </p>
          </div>

          <div>
            <img className="light-img" src={img('c (193).jpeg')} alt="Zanzibar Beach" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrapper">
          <h2 className="center">Top Attractions</h2>

          <div className="cards">
            <div className="card">
              <img src={img('c (153).jpeg')} alt="Stone Town" />
              <h4>Stone Town</h4>
              <p>Historic UNESCO site with rich Swahili culture and narrow streets.</p>
            </div>

            <div className="card">
              <img src={img('c (136).jpeg')} alt="Prison Island" />
              <h4>Prison Island</h4>
              <p>Visit giant tortoises and enjoy snorkeling in clear waters.</p>
            </div>

            <div className="card">
              <img src={img('c (177).jpeg')} alt="Safari Blue" />
              <h4>Safari Blue</h4>
              <p>Dhow cruise with snorkeling and seafood experience.</p>
            </div>

            <div className="card">
              <img src={img('Mnemba Island.jpeg')} alt="Mnemba Island" />
              <h4>Mnemba Island</h4>
              <p>Best snorkeling and marine life experience in Zanzibar.</p>
            </div>

            <div className="card">
              <img src={img('c (141).jpeg')} alt="Paje Beach" />
              <h4>Paje Beach</h4>
              <p>Perfect for kitesurfing, relaxation, and beach vibes.</p>
            </div>

            <div className="card">
              <img src={img('c (204).jpeg')} alt="Spice Tours" />
              <h4>Spice Tours</h4>
              <p>Explore Zanzibar’s spice farms and taste fresh spices.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section light">
        <div className="wrapper center">
          <h3>Best Time to Visit</h3>

          <div className="info-box">
            <p>
              <strong>June – October:</strong> Best for diving and cool weather
            </p>
            <p>
              <strong>December – February:</strong> Hot and perfect for beach
            </p>
            <p>
              <strong>All Year:</strong> Zanzibar is always a great destination
            </p>
          </div>
        </div>
      </section>

      <footer className="site-footer footer" style={{ textAlign: 'center' }}>
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

export default VisitZanzibar