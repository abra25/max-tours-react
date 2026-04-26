import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

function Gallery() {
  const base = import.meta.env.BASE_URL
  const img = (file) => `${base}img/${file}`

  const [menuOpen, setMenuOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const [showBackTop, setShowBackTop] = useState(false)
  useEffect(() => {
  const handleScroll = () => {
    setShowBackTop(window.scrollY > 350)
  }

  window.addEventListener('scroll', handleScroll)
  handleScroll()

  return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
  }

  const galleryData = useMemo(
    () => [
      {
        key: 'beach',
        title: 'Beaches & Ocean Escapes',
        count: '24 Photos',
        items: [
          { image: img('Blue Lagoon Zanzibar.jpeg'), alt: 'Blue Lagoon Zanzibar', caption: 'Blue Lagoon' },
          { image: img('Nakupenda Beach.jpeg'), alt: 'Nakupenda Beach', caption: 'Nakupenda Beach' },
          { image: img('Mnemba Island.jpeg'), alt: 'Mnemba Island', caption: 'Mnemba Island' },
          { image: img('Mnemba Atoll Trip.jpeg'), alt: 'Mnemba Atoll Trip', caption: 'Mnemba Atoll' },
          { image: img('Sunset Dhow Cruise Zanzibar.jpeg'), alt: 'Sunset Dhow Cruise Zanzibar', caption: 'Sunset Dhow' },
          { image: img('Blue Safari Trip Zanzibar.jpeg'), alt: 'Blue Safari Trip Zanzibar', caption: 'Blue Safari' },
          { image: img('Local Fishing Zanzibar.jpeg'), alt: 'Local Fishing Zanzibar', caption: 'Local Fishing' },
          { image: img('beach-2.jpg'), alt: 'Beach', caption: 'Beach View' },
          { image: img('c (141).jpeg'), alt: 'Beach view', caption: 'Beach View' },
          { image: img('c (149).jpeg'), alt: 'Beach escape', caption: 'Beach Escape' },
          { image: img('c (167).jpeg'), alt: 'Ocean tour', caption: 'Ocean Tour' },
          { image: img('c (177).jpeg'), alt: 'Beach adventure', caption: 'Beach Adventure' },
          { image: img('c (186).jpeg'), alt: 'Ocean experience', caption: 'Ocean Experience' },
          { image: img('c (196).jpeg'), alt: 'Coastal travel', caption: 'Coastal Travel' },
          { image: img('c (224).jpeg'), alt: 'Island moment', caption: 'Island Moment' },
          { image: img('c (225).jpeg'), alt: 'Sea experience', caption: 'Sea Experience' },
          { image: img('c (227).jpeg'), alt: 'Beach photo', caption: 'Beach Photo' },
          { image: img('c (246).jpeg'), alt: 'Beach travel', caption: 'Beach Travel' },
          { image: img('c (252).jpeg'), alt: 'Island trip', caption: 'Island Trip' },
          { image: img('c (260).jpeg'), alt: 'Beach destination', caption: 'Beach Destination' },
          { image: img('c (261).jpeg'), alt: 'Sunset coast', caption: 'Sunset Coast' },
          { image: img('c (267).jpeg'), alt: 'Island coastline', caption: 'Island Coastline' },
          { image: img('c (277).jpeg'), alt: 'Beach scene', caption: 'Beach Scene' },
          { image: img('c (278).jpeg'), alt: 'Ocean sunset', caption: 'Ocean Sunset' },
        ],
      },
      {
        key: 'zanzibar',
        title: 'Zanzibar Experiences',
        count: '32 Photos',
        items: [
          { image: img('Full Day North Coast Nungwi Relaxation.jpeg'), alt: 'North Coast Relaxation', caption: 'North Coast' },
          { image: img('Kuza Cave.jpeg'), alt: 'Kuza Cave', caption: 'Kuza Cave' },
          { image: img('Stone Town Tour Zanzibar.jpeg'), alt: 'Stone Town Tour Zanzibar', caption: 'Stone Town' },
          { image: img('c (12).jpeg'), alt: 'Zanzibar moment', caption: 'Zanzibar Moment' },
          { image: img('c (13).jpeg'), alt: 'Island lifestyle', caption: 'Island Lifestyle' },
          { image: img('c (14).jpeg'), alt: 'Zanzibar view', caption: 'Zanzibar View' },
          { image: img('c (19).jpeg'), alt: 'Stone Town scene', caption: 'Stone Town Scene' },
          { image: img('c (40).jpeg'), alt: 'Zanzibar travel', caption: 'Zanzibar Travel' },
          { image: img('c (51).jpeg'), alt: 'Cave adventure', caption: 'Cave Adventure' },
          { image: img('c (70).jpeg'), alt: 'Island place', caption: 'Island Place' },
          { image: img('c (83).jpeg'), alt: 'Local atmosphere', caption: 'Local Atmosphere' },
          { image: img('c (93).jpeg'), alt: 'Travel memory', caption: 'Travel Memory' },
          { image: img('c (94).jpeg'), alt: 'Zanzibar journey', caption: 'Zanzibar Journey' },
          { image: img('c (96).jpeg'), alt: 'Village tour', caption: 'Village Tour' },
          { image: img('c (98).jpeg'), alt: 'Village life', caption: 'Village Life' },
          { image: img('c (103).jpeg'), alt: 'Island photo', caption: 'Island Photo' },
          { image: img('c (104).jpeg'), alt: 'Jozani Forest', caption: 'Jozani Forest' },
          { image: img('c (105).jpeg'), alt: 'Island excursion', caption: 'Island Excursion' },
          { image: img('c (136).jpeg'), alt: 'Prison Island', caption: 'Prison Island' },
          { image: img('c (139).jpeg'), alt: 'Local scene', caption: 'Local Scene' },
          { image: img('c (152).jpeg'), alt: 'The Rock area', caption: 'The Rock' },
          { image: img('c (153).jpeg'), alt: 'Stone Town view', caption: 'Stone Town View' },
          { image: img('c (175).jpeg'), alt: 'Spice tour', caption: 'Spice Tour' },
          { image: img('c (191).jpeg'), alt: 'Holiday experience', caption: 'Holiday Experience' },
          { image: img('c (192).jpeg'), alt: 'Island experience', caption: 'Prison Island' },
          { image: img('c (193).jpeg'), alt: 'Zanzibar overview', caption: 'Zanzibar Overview' },
          { image: img('c (204).jpeg'), alt: 'Spice farm experience', caption: 'Spice Farm' },
          { image: img('c (210).jpeg'), alt: 'Cooking and spice tour', caption: 'Cooking Tour' },
          { image: img('c (253).jpeg'), alt: 'Stone Town', caption: 'Stone Town' },
          { image: img('c (255).jpeg'), alt: 'Aquarium visit', caption: 'Aquarium Visit' },
          { image: img('c (259).jpeg'), alt: 'Salaam Cave', caption: 'Salaam Cave' },
          { image: img('Kuza Cave.jpeg'), alt: 'Kuza Cave Jambiani', caption: 'Kuza Cave Jambiani' },
        ],
      },
      {
        key: 'wildlife',
        title: 'Wildlife & Safari',
        count: '12 Photos',
        items: [
          { image: img('Bagamoyo.jpeg'), alt: 'Bagamoyo', caption: 'Bagamoyo' },
          { image: img('Gombe Stream National Park.jpeg'), alt: 'Gombe Stream National Park', caption: 'Gombe Stream' },
          { image: img('IMG_098_22. (16).jpg'), alt: 'Safari landscape', caption: 'Safari Landscape' },
          { image: img('IMG_098_22. (18).jpg'), alt: 'Serengeti National Park', caption: 'Serengeti' },
          { image: img('Mount Kilimanjaro National Park.jpeg'), alt: 'Mount Kilimanjaro National Park', caption: 'Kilimanjaro' },
          { image: img('Ngorongoro creater.jpg'), alt: 'Ngorongoro Crater', caption: 'Ngorongoro' },
          { image: img('Olduvai Gorge.jpeg'), alt: 'Olduvai Gorge', caption: 'Olduvai Gorge' },
          { image: img('c (16).jpeg'), alt: 'Safari road', caption: 'Safari Road' },
          { image: img('c (216).jpeg'), alt: 'Mikumi Park', caption: 'Mikumi Park' },
          { image: img('c (219).jpeg'), alt: 'Safari wildlife', caption: 'Safari Wildlife' },
          { image: img('c (232).jpeg'), alt: 'Wildlife destination', caption: 'Wildlife Destination' },
          { image: img('c (241).jpeg'), alt: 'Safari moment', caption: 'Safari Moment' },
        ],
      },
      {
        key: 'story',
        title: 'Brand & Story Moments',
        count: '19 Photos',
        items: [
          { image: img('c (7).jpeg'), alt: 'Story moment', caption: 'Story Moment' },
          { image: img('c (8).png'), alt: 'Brand visual', caption: 'Brand Visual' },
          { image: img('g.jpeg'), alt: 'Gallery visual', caption: 'Gallery Visual' },
          { image: img('g1.jpeg'), alt: 'Gallery visual', caption: 'Gallery Visual' },
          { image: img('g10.jpeg'), alt: 'Gallery visual', caption: 'Gallery Visual' },
          { image: img('g11.jpeg'), alt: 'Gallery visual', caption: 'Gallery Visual' },
          { image: img('g12.jpeg'), alt: 'Gallery visual', caption: 'Gallery Visual' },
          { image: img('g14.jpeg'), alt: 'Gallery visual', caption: 'Gallery Visual' },
          { image: img('g2.jpeg'), alt: 'Gallery visual', caption: 'Gallery Visual' },
          { image: img('g3.jpeg'), alt: 'Gallery visual', caption: 'Gallery Visual' },
          { image: img('g4.jpeg'), alt: 'Gallery visual', caption: 'Gallery Visual' },
          { image: img('g6.jpeg'), alt: 'Gallery visual', caption: 'Gallery Visual' },
          { image: img('g7.jpeg'), alt: 'Gallery visual', caption: 'Gallery Visual' },
          { image: img('g8.jpeg'), alt: 'Gallery visual', caption: 'Gallery Visual' },
          { image: img('g9.jpeg'), alt: 'Gallery visual', caption: 'Gallery Visual' },
          { image: img('his.jpeg'), alt: 'Historical sites', caption: 'Historical Sites' },
          { image: img('isl.jpeg'), alt: 'Island trip', caption: 'Island Trip' },
          { image: img('moment-1.jpg'), alt: 'Gallery moment', caption: 'Gallery Moment' },
          { image: img('why.jpeg'), alt: 'Why Zanzibar', caption: 'Why Zanzibar' },
          { image: img('c (194).jpeg'), alt: 'Hourse Riding', caption: 'Beach riding' }
        ],
      },
    ],
    []
  )

  const visibleCategories =
    activeFilter === 'all'
      ? galleryData
      : galleryData.filter((category) => category.key === activeFilter)

  const visibleItems = useMemo(() => {
    return visibleCategories.flatMap((category) =>
      category.items.map((item) => ({
        ...item,
        category: category.key,
      }))
    )
  }, [visibleCategories])

  const currentItem = visibleItems[currentIndex] || null

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
    setCurrentIndex(0)

    setTimeout(() => {
      const section = document.querySelector('.gallery-section')
      if (section) {
        window.scrollTo({
          top: section.offsetTop - 90,
          behavior: 'smooth',
        })
      }
    }, 50)
  }

  const openLightbox = (clickedItem) => {
    const index = visibleItems.findIndex(
      (item) => item.image === clickedItem.image && item.caption === clickedItem.caption
    )

    setCurrentIndex(index >= 0 ? index : 0)
    setLightboxOpen(true)
    document.body.classList.add('lightbox-open')
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.classList.remove('lightbox-open')
  }

  const showNext = () => {
    if (!visibleItems.length) return
    setCurrentIndex((prev) => (prev + 1) % visibleItems.length)
  }

  const showPrev = () => {
    if (!visibleItems.length) return
    setCurrentIndex((prev) => (prev - 1 + visibleItems.length) % visibleItems.length)
  }

  useEffect(() => {
  if (window.lucide) {
    window.lucide.createIcons()
  }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!lightboxOpen) return

      if (event.key === 'Escape') closeLightbox()
      if (event.key === 'ArrowRight') showNext()
      if (event.key === 'ArrowLeft') showPrev()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, visibleItems.length])

  return (
    <div className="gallery-page">
      <header className="site-header">
        <div className="wrapper nav-wrap">
          <Link to="/" className="brand">
            <img src={img('next.jpeg')} alt="Max Tour & Safari Logo" />
            <span>Max Tour & Safari</span>
          </Link>

          <button
            id="menuToggle"
            className="menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen ? 'true' : 'false'}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            ☰
          </button>

          <nav id="mainNav" className={`main-nav ${menuOpen ? 'active' : ''}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/daily-tours" onClick={() => setMenuOpen(false)}>
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
            <Link to="/gallery" className="active" onClick={() => setMenuOpen(false)}>
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
          <span className="hero-badge">Photo Gallery</span>
          <h1>Zanzibar & Tanzania in Frames</h1>
        </div>
      </section>

      <section className="section gallery-section">
        <div className="wrapper">
          <div className="gallery-topbar">
            <div className="gallery-intro">
              <span className="gallery-tag">Travel Moments</span>
              <h2>Explore by Category</h2>
            </div>

            <div className="gallery-filters" id="galleryFilters">
              <button
                className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                data-filter="all"
                onClick={() => handleFilterChange('all')}
              >
                All
              </button>

              <button
                className={`filter-btn ${activeFilter === 'beach' ? 'active' : ''}`}
                data-filter="beach"
                onClick={() => handleFilterChange('beach')}
              >
                Beaches & Ocean
              </button>

              <button
                className={`filter-btn ${activeFilter === 'zanzibar' ? 'active' : ''}`}
                data-filter="zanzibar"
                onClick={() => handleFilterChange('zanzibar')}
              >
                Zanzibar Experiences
              </button>

              <button
                className={`filter-btn ${activeFilter === 'wildlife' ? 'active' : ''}`}
                data-filter="wildlife"
                onClick={() => handleFilterChange('wildlife')}
              >
                Wildlife & Safari
              </button>

              <button
                className={`filter-btn ${activeFilter === 'story' ? 'active' : ''}`}
                data-filter="story"
                onClick={() => handleFilterChange('story')}
              >
                Brand & Story
              </button>
            </div>
          </div>

          {visibleCategories.map((category) => (
            <section
              className="gallery-category"
              data-category={category.key}
              key={category.key}
            >
              <div className="category-head">
                <div>
                  <span className="category-kicker">Category</span>
                  <h3>{category.title}</h3>
                </div>
                <span className="category-count">{category.count}</span>
              </div>

              <div className="gallery-grid">
                {category.items.map((item, index) => (
                  <div
                    className="gallery-item"
                    data-category={category.key}
                    key={`${category.key}-${index}`}
                    onClick={() => openLightbox(item)}
                  >
                    <img src={item.image} alt={item.alt} loading="lazy" />
                    <span>{item.caption}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <div
        className={`lightbox ${lightboxOpen ? 'active' : ''}`}
        id="lightbox"
        aria-hidden={lightboxOpen ? 'false' : 'true'}
        onClick={(event) => {
          if (event.target.id === 'lightbox') {
            closeLightbox()
          }
        }}
      >
        <button
          className="lightbox-close"
          id="closeLightbox"
          aria-label="Close lightbox"
          onClick={closeLightbox}
        >
          &times;
        </button>

        <button
          className="lightbox-nav prev"
          id="prevLightbox"
          aria-label="Previous image"
          onClick={showPrev}
        >
          &#10094;
        </button>

        <div className="lightbox-inner">
          {currentItem ? (
            <>
              <img id="lightboxImg" src={currentItem.image} alt={currentItem.alt} />
              <div className="lightbox-caption" id="lightboxCaption">
                {currentItem.caption || currentItem.alt}
              </div>
            </>
          ) : null}
        </div>

        <button
          className="lightbox-nav next"
          id="nextLightbox"
          aria-label="Next image"
          onClick={showNext}
        >
          &#10095;
        </button>
      </div>

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

            {/* back top */}
      <button
        type="button"
        className={`back-to-top ${showBackTop ? 'show' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <i data-lucide="arrow-up"></i>
      </button>
    </div>
  )
}

export default Gallery