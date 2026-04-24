import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabaseClient } from '../lib/supabase'

function HolidayPackages() {
  const base = import.meta.env.BASE_URL
  const img = (file) => `${base}img/${file}`

  const [menuOpen, setMenuOpen] = useState(false)
  const [packages, setPackages] = useState([])
  const [activePackage, setActivePackage] = useState(null)
  const [activeTab, setActiveTab] = useState('highlights')
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    loadHolidayPackages()
  }, [])

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }, [menuOpen, packages, activePackage, activeTab, modalOpen])

  useEffect(() => {
    if (!modalOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closePackageModal()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [modalOpen])

  const splitLines = (text = '') => {
    if (!text || typeof text !== 'string') return []
    return text
      .split(/\n|•|-/g)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }

  const makeFeatureChips = (pkg) => {
    const items = splitLines(pkg.short_description || pkg.full_description)
    if (items.length) return items.slice(0, 4)

    return [
      pkg.location ? pkg.location.charAt(0).toUpperCase() + pkg.location.slice(1) : 'Zanzibar',
      pkg.duration || 'Flexible',
      pkg.price || 'Custom Quote',
      pkg.is_featured ? 'Top Pick' : 'Available',
    ]
  }

  const makeHighlights = (pkg) => {
    const items = splitLines(pkg.full_description || pkg.short_description)
    if (items.length) return items.slice(0, 6)

    return [
      'Holiday planning support',
      'Flexible package arrangement',
      'Comfortable travel experience',
      'Booking confirmation after review',
    ]
  }

  const makeItinerary = (pkg) => {
    const items = splitLines(pkg.full_description)

    if (items.length >= 2) {
      return items.slice(0, 6).map((item, index) => ({
        day: index + 1,
        title: `Package Step ${index + 1}`,
        desc: item,
      }))
    }

    return [
      {
        day: 1,
        title: 'Arrival & Planning',
        desc: 'Arrival support and start of your holiday arrangement.',
      },
      {
        day: 2,
        title: 'Holiday Experience',
        desc: pkg.short_description || 'Enjoy the main experiences included in this package.',
      },
      {
        day: 3,
        title: 'Flexible Continuation',
        desc: 'Continue the package based on the selected travel plan.',
      },
    ]
  }

  const makeInclusions = (pkg) => {
    const list = []

    if (pkg.duration) list.push(`Duration: ${pkg.duration}`)
    if (pkg.location) list.push(`Location: ${pkg.location}`)
    if (pkg.price) list.push(`Price: ${pkg.price}`)

    list.push('Planning support')
    list.push('Direct communication with our team')

    return list
  }

  const makeTerms = (pkg) => {
    return [
      'Booking request is reviewed before confirmation',
      'Payment is handled outside the website',
      'Final travel details are confirmed directly with our team',
      pkg.is_featured ? 'Featured package option' : 'Standard package option',
    ]
  }

  const normalizePackage = (row) => {
    return {
      id: row.id,
      title: row.title || 'Holiday Package',
      duration: row.duration || 'Flexible',
      price: row.price || 'Custom Quote',
      rating: row.is_featured ? 'Top Pick' : 'Available',
      image: row.image_url || img('c (193).jpeg'),
      summary:
        row.short_description ||
        'Explore this holiday package with flexible planning and memorable travel experiences.',
      overview:
        row.full_description ||
        row.short_description ||
        'Discover this package and contact our team for more details.',
      features: makeFeatureChips(row),
      highlights: makeHighlights(row),
      itinerary: makeItinerary(row),
      inclusions: makeInclusions(row),
      essentials: makeTerms(row),
      raw: row,
    }
  }

  const getBookingUrl = (packageTitle) => {
    return `${base}booking?type=holiday_package&package=${encodeURIComponent(packageTitle)}`
  }

  const loadHolidayPackages = async () => {
    setLoading(true)
    setErrorMessage('')

    try {
      const { data, error } = await supabaseClient
        .from('packages')
        .select('*')
        .eq('category', 'holiday_package')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      const rows = Array.isArray(data) ? data.map(normalizePackage) : []
      setPackages(rows)
    } catch (error) {
      console.error('Failed to load holiday packages:', error)
      setErrorMessage('Failed to load packages.')
    } finally {
      setLoading(false)
    }
  }

  const openPackageModal = (pkg) => {
    setActivePackage(pkg)
    setActiveTab('highlights')
    setModalOpen(true)
  }

  const closePackageModal = () => {
    setModalOpen(false)
  }

  return (
    <div className="holiday-packages-page">
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
            <Link
              to="/holiday-packages"
              className="active"
              onClick={() => setMenuOpen(false)}
            >
              Holiday Packages
            </Link>
            <Link to="/visit-zanzibar" onClick={() => setMenuOpen(false)}>
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

      <section className="page-hero">
        <div className="page-hero-overlay"></div>
        <div className="wrapper page-hero-content">
          <span className="eyebrow">Signature Escapes</span>
          <h1>Holiday Packages</h1>
          <p>
            Curated Zanzibar holidays with beaches, cultural highlights, snorkeling,
            spice tours, and unforgettable island moments.
          </p>
        </div>
      </section>

      <section className="section packages-section">
        <div className="wrapper">
          <div className="section-head">
            <h2>Choose Your Package</h2>
            <p>
              Short, clear package cards for quick browsing. Open any package to see the
              itinerary, inclusions, and booking details.
            </p>
          </div>

          <div className="package-grid" id="packageGrid">
            {loading ? (
              <div
                className="empty-state"
                style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '28px 18px' }}
              >
                <h3 style={{ marginBottom: '10px' }}>Loading packages...</h3>
                <p>Please wait a moment.</p>
              </div>
            ) : errorMessage ? (
              <div
                className="empty-state"
                style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '28px 18px' }}
              >
                <h3 style={{ marginBottom: '10px' }}>Failed to load packages</h3>
                <p>{errorMessage}</p>
              </div>
            ) : !packages.length ? (
              <div
                className="empty-state"
                style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '28px 18px' }}
              >
                <h3 style={{ marginBottom: '10px' }}>No holiday packages available right now</h3>
                <p>Please check again soon or contact our team for custom planning.</p>
              </div>
            ) : (
              packages.map((pkg) => (
                <article className="package-card" key={pkg.id}>
                  <div className="package-image">
                    <img src={pkg.image} alt={pkg.title} />
                    <span className="package-badge">{pkg.duration}</span>
                    <span className="package-price">From {pkg.price}</span>
                  </div>

                  <div className="package-body">
                    <h3>{pkg.title}</h3>
                    <p className="package-summary">{pkg.summary}</p>

                    <div className="package-features">
                      {pkg.features.map((item, index) => (
                        <span className="feature-chip" key={index}>
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="card-actions">
                      <button
                        className="btn btn-outline"
                        onClick={() => openPackageModal(pkg)}
                      >
                        View More
                      </button>

                      <a href={getBookingUrl(pkg.title)} className="btn btn-primary">
                        Book Now
                      </a>
                    </div>
                  </div>
                </article>
              ))
            )}
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

      <div
        className={`modal ${modalOpen ? 'active' : ''}`}
        id="packageModal"
        onClick={closePackageModal}
      >
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <button
            className="modal-close"
            id="modalClose"
            aria-label="Close"
            onClick={closePackageModal}
          >
            &times;
          </button>

          {activePackage ? (
            <>
              <div className="modal-media">
                <img id="modalImage" src={activePackage.image} alt={activePackage.title} />
              </div>

              <div className="modal-body">
                <div className="modal-top">
                  <div className="modal-badges">
                    <span id="modalDuration" className="pill">
                      {activePackage.duration}
                    </span>
                    <span id="modalRating" className="pill pill-soft">
                      {activePackage.rating}
                    </span>
                  </div>

                  <h3 id="modalTitle">{activePackage.title}</h3>
                  <p id="modalOverview" className="modal-overview">
                    {activePackage.overview}
                  </p>
                </div>

                <div className="modal-tabs">
                  <button
                    className={`tab-btn ${activeTab === 'highlights' ? 'active' : ''}`}
                    data-tab="highlights"
                    onClick={() => setActiveTab('highlights')}
                  >
                    Highlights
                  </button>

                  <button
                    className={`tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
                    data-tab="itinerary"
                    onClick={() => setActiveTab('itinerary')}
                  >
                    Itinerary
                  </button>

                  <button
                    className={`tab-btn ${activeTab === 'included' ? 'active' : ''}`}
                    data-tab="included"
                    onClick={() => setActiveTab('included')}
                  >
                    Included
                  </button>

                  <button
                    className={`tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
                    data-tab="terms"
                    onClick={() => setActiveTab('terms')}
                  >
                    Essentials
                  </button>
                </div>

                <div
                  className={`tab-panel ${activeTab === 'highlights' ? 'active' : ''}`}
                  id="tab-highlights"
                >
                  <div id="modalHighlights">
                    <div className="highlight-list">
                      {activePackage.highlights.map((item, index) => (
                        <div className="highlight-item" key={index}>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  className={`tab-panel ${activeTab === 'itinerary' ? 'active' : ''}`}
                  id="tab-itinerary"
                >
                  <div id="modalItinerary">
                    {activePackage.itinerary.map((day, index) => (
                      <div className="itinerary-day" key={index}>
                        <strong>
                          Step {day.day}: {day.title}
                        </strong>
                        <p>{day.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className={`tab-panel ${activeTab === 'included' ? 'active' : ''}`}
                  id="tab-included"
                >
                  <div id="modalInclusions">
                    <div className="inclusion-list">
                      {activePackage.inclusions.map((item, index) => (
                        <div className="inclusion-item" key={index}>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  className={`tab-panel ${activeTab === 'terms' ? 'active' : ''}`}
                  id="tab-terms"
                >
                  <div id="modalTerms">
                    <div className="terms-list">
                      {activePackage.essentials.map((item, index) => (
                        <div className="terms-item" key={index}>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button className="btn btn-light" id="modalBackBtn" onClick={closePackageModal}>
                    Close
                  </button>

                  <a
                    href={getBookingUrl(activePackage.title)}
                    className="btn btn-primary"
                    id="modalBookBtn"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default HolidayPackages