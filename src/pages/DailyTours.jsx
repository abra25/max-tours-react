import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabaseClient } from '../lib/supabase'

function DailyTours() {
  const base = import.meta.env.BASE_URL
  const img = (file) => `${base}img/${file}`

  const [menuOpen, setMenuOpen] = useState(false)
  const [dayTours, setDayTours] = useState([])
  const [activeTour, setActiveTour] = useState(null)
  const [currentFilter, setCurrentFilter] = useState('all')
  const [currentSearch, setCurrentSearch] = useState('')
  const [activeTab, setActiveTab] = useState('details')
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    loadDayTours()
  }, [])

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }, [menuOpen, dayTours, activeTour, currentFilter, currentSearch, activeTab, modalOpen])

  useEffect(() => {
    if (!modalOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeTourModal()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.classList.add('modal-open')

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('modal-open')
    }
  }, [modalOpen])

  const starSVG = () => {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11.999 2.5l2.935 5.947 6.565.955-4.75 4.63 1.121 6.538-5.871-3.087-5.871 3.087 1.121-6.538-4.75-4.63 6.565-.955L11.999 2.5z"></path>
      </svg>
    `
  }

  const renderStars = (count = 5, total = 5) => {
    const safeCount = Math.max(0, Math.min(Number(count) || 0, total))
    let stars = `<span class="rating-stars" aria-label="${safeCount} out of ${total} stars">`

    for (let i = 1; i <= total; i++) {
      stars += `
        <span class="rating-star ${i <= safeCount ? 'filled' : 'empty'}">
          ${starSVG()}
        </span>
      `
    }

    stars += '</span>'
    return stars
  }

  const getDurationGroup = (duration = '') => {
    const value = String(duration).toLowerCase()

    if (value.includes('full')) return 'full'
    if (value.includes('half')) return 'half'
    return 'short'
  }

  const parseItineraryRows = (items = []) => {
    if (Array.isArray(items) && items.length) {
      return items.map((item, index) => ({
        title: item.title || `Step ${item.day || index + 1}`,
        desc: item.desc || '',
      }))
    }

    return []
  }

  const normalizeTour = (row) => {
    let numericRating = 4

    if (row.rating) {
      const parsed = parseInt(String(row.rating).replace(/[^\d]/g, ''), 10)
      if (!Number.isNaN(parsed)) {
        numericRating = Math.max(1, Math.min(parsed, 5))
      }
    }

    return {
      id: row.id,
      title: row.title || 'Day Tour',
      img: row.image_url || img('c (193).jpeg'),
      duration: row.duration || '3 hours',
      rating: numericRating,
      description: row.short_description || 'Enjoy a memorable Zanzibar day tour.',
      overview:
        row.full_description ||
        row.short_description ||
        'Explore this day tour with our local team.',
      details:
        row.details ||
        `<p>${
          row.full_description ||
          row.short_description ||
          'Tour details will be confirmed directly with our team.'
        }</p>`,
      itinerary: parseItineraryRows(row.itinerary),
      inclusions: Array.isArray(row.inclusions) ? row.inclusions : [],
    }
  }

  const getBookingUrl = (tourTitle) => {
    return `${base}booking?type=day_tour&package=${encodeURIComponent(tourTitle)}`
  }

  const loadDayTours = async () => {
    setLoading(true)
    setErrorMessage('')

    try {
      const { data, error } = await supabaseClient
        .from('packages')
        .select('*')
        .eq('category', 'day_tour')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      const tours = Array.isArray(data) ? data.map(normalizeTour) : []
      setDayTours(tours)
    } catch (error) {
      console.error('Failed to load day tours:', error)
      setErrorMessage('Failed to load tours.')
    } finally {
      setLoading(false)
    }
  }

  const filteredTours = useMemo(() => {
    return dayTours.filter((tour) => {
      const filterMatch =
        currentFilter === 'all' || getDurationGroup(tour.duration) === currentFilter

      const q = currentSearch.trim().toLowerCase()
      const searchMatch =
        !q ||
        String(tour.title || '')
          .toLowerCase()
          .includes(q) ||
        String(tour.description || '')
          .toLowerCase()
          .includes(q) ||
        String(tour.overview || '')
          .toLowerCase()
          .includes(q)

      return filterMatch && searchMatch
    })
  }, [dayTours, currentFilter, currentSearch])

  const openTourModal = (tour) => {
    setActiveTour(tour)
    setActiveTab('details')
    setModalOpen(true)
  }

  const closeTourModal = () => {
    setModalOpen(false)
  }

  return (
    <div className="daily-tours-page">
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
            <Link to="/daily-tours" className="active" onClick={() => setMenuOpen(false)}>
              Day Tours
            </Link>
            <Link to="/holiday-packages" onClick={() => setMenuOpen(false)}>
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
          <span className="eyebrow">Zanzibar Experiences</span>
          <h1>Day Tours</h1>
          <h2>Best Activities in Zanzibar</h2>
          <p>
            Looking for the best things to do in Zanzibar? We organize private day tours and
            local experiences including cave visits, snorkeling trips, village tours, beach
            escapes, spice experiences, and more.
          </p>

          <div className="hero-pills">
            <span>
              <i data-lucide="sparkles"></i> Private Tours
            </span>
            <span>
              <i data-lucide="clock-3"></i> Flexible Duration
            </span>
            <span>
              <i data-lucide="map-pinned"></i> Island Highlights
            </span>
          </div>
        </div>
      </section>

      <section className="section tours-section">
        <div className="wrapper">
          <div className="section-head">
            <span className="section-tag">Choose Your Experience</span>
            <h2>Choose Your Tour</h2>
            <p>Browse our handpicked daily experiences and open any card for full details.</p>
          </div>

          <div className="tour-toolbar">
            <div className="tour-filters" id="tourFilters">
              <button
                className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
                data-filter="all"
                onClick={() => setCurrentFilter('all')}
              >
                All Tours
              </button>

              <button
                className={`filter-btn ${currentFilter === 'short' ? 'active' : ''}`}
                data-filter="short"
                onClick={() => setCurrentFilter('short')}
              >
                Short Tours
              </button>

              <button
                className={`filter-btn ${currentFilter === 'half' ? 'active' : ''}`}
                data-filter="half"
                onClick={() => setCurrentFilter('half')}
              >
                Half Day
              </button>

              <button
                className={`filter-btn ${currentFilter === 'full' ? 'active' : ''}`}
                data-filter="full"
                onClick={() => setCurrentFilter('full')}
              >
                Full Day
              </button>
            </div>

            <div className="tour-search">
              <i data-lucide="search"></i>
              <input
                type="text"
                id="tourSearch"
                placeholder="Search tours..."
                aria-label="Search tours"
                value={currentSearch}
                onChange={(e) => setCurrentSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="tour-grid" id="tourGrid">
            {loading ? (
              <div className="empty-state">
                <p>Loading tours...</p>
              </div>
            ) : errorMessage ? (
              <div className="empty-state">
                <i data-lucide="search-x"></i>
                <p>{errorMessage}</p>
              </div>
            ) : filteredTours.length === 0 ? (
              <div className="empty-state">
                <i data-lucide="search-x"></i>
                <p>No tours found.</p>
              </div>
            ) : (
              filteredTours.map((tour) => (
                <article className="tour-card" key={tour.id}>
                  <div className="tour-card-image">
                    <img src={tour.img} alt={tour.title} loading="lazy" />
                    <span className="tour-badge">{tour.duration}</span>

                    <div
                      className="tour-rating"
                      aria-label={`${tour.rating} star rating`}
                      dangerouslySetInnerHTML={{ __html: renderStars(tour.rating) }}
                    />
                  </div>

                  <div className="tour-card-body">
                    <h3>{tour.title}</h3>
                    <p className="tour-desc">{tour.description}</p>

                    <div className="tour-meta">
                      <span className="tour-duration">
                        <i data-lucide="clock-3"></i>
                        {tour.duration}
                      </span>

                      <span className="tour-link">
                        Explore
                        <i data-lucide="arrow-up-right"></i>
                      </span>
                    </div>

                    <div className="card-actions">
                      <button
                        className="btn btn-outline"
                        onClick={() => openTourModal(tour)}
                      >
                        View More
                      </button>

                      <a href={getBookingUrl(tour.title)} className="btn btn-primary">
                        Book Now
                      </a>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="tour-note">
            <div className="tour-note-icon">
              <i data-lucide="badge-check"></i>
            </div>
            <div>
              <h3>Why book a day tour with Max Tour & Safari?</h3>
              <p>
                We focus on memorable local experiences, smooth planning, and flexible
                booking. Each day tour includes clear highlights, itinerary steps, and
                essentials so the guest understands the experience before booking.
              </p>
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

      <div
        className={`modal ${modalOpen ? 'active' : ''}`}
        id="tourModal"
        onClick={closeTourModal}
      >
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <button
            className="modal-close"
            id="modalClose"
            aria-label="Close"
            onClick={closeTourModal}
          >
            &times;
          </button>

          {activeTour ? (
            <>
              <div className="modal-media">
                <img id="modalImage" src={activeTour.img} alt={activeTour.title} />
              </div>

              <div className="modal-body">
                <div className="modal-top">
                  <div className="modal-badge-row">
                    <span className="modal-tour-chip">
                      <i data-lucide="map"></i> Day Tour
                    </span>
                    <span className="modal-tour-chip">
                      <i data-lucide="star"></i> Top Pick
                    </span>
                  </div>

                  <h3 id="modalTitle">{activeTour.title}</h3>

                  <div
                    className="modal-meta"
                    id="modalMeta"
                    dangerouslySetInnerHTML={{
                      __html: `
                        <span class="modal-meta-item">
                          <i data-lucide="clock-3"></i>
                          ${activeTour.duration}
                        </span>
                        <span class="modal-meta-item">
                          ${renderStars(activeTour.rating)}
                        </span>
                      `,
                    }}
                  />

                  <p className="modal-overview" id="modalOverview">
                    {activeTour.overview || activeTour.description || ''}
                  </p>
                </div>

                <div className="modal-tabs">
                  <button
                    className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                    data-tab="details"
                    onClick={() => setActiveTab('details')}
                  >
                    Details
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
                </div>

                <div className={`tab-panel ${activeTab === 'details' ? 'active' : ''}`} id="tab-details">
                  <div
                    id="modalDetails"
                    dangerouslySetInnerHTML={{
                      __html: activeTour.details || '<p>No extra details available.</p>',
                    }}
                  />
                </div>

                <div
                  className={`tab-panel ${activeTab === 'itinerary' ? 'active' : ''}`}
                  id="tab-itinerary"
                >
                  <div id="modalItinerary">
                    {activeTour.itinerary && activeTour.itinerary.length ? (
                      activeTour.itinerary.map((item, index) => (
                        <div className="itinerary-item" key={index}>
                          <strong>{item.title}</strong>
                          <p>{item.desc}</p>
                        </div>
                      ))
                    ) : (
                      <p>No itinerary available.</p>
                    )}
                  </div>
                </div>

                <div
                  className={`tab-panel ${activeTab === 'included' ? 'active' : ''}`}
                  id="tab-included"
                >
                  <div className="included-wrap">
                    <div className="duration-row">
                      <strong>Duration:</strong>
                      <span id="modalDuration">{activeTour.duration || ''}</span>
                    </div>

                    <div id="modalInclusions">
                      {activeTour.inclusions && activeTour.inclusions.length ? (
                        <>
                          <h6>Inclusions</h6>
                          <ul>
                            {activeTour.inclusions.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <p>No inclusions listed.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button className="btn btn-light" id="modalBackBtn" onClick={closeTourModal}>
                    Back
                  </button>

                  <a
                    href={getBookingUrl(activeTour.title)}
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

export default DailyTours