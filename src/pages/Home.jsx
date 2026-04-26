import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabaseClient } from '../lib/supabase'

function Home() {
  const base = import.meta.env.BASE_URL
  const img = (file) => `${base}img/${file}`

  const heroSlides = useMemo(
    () => [
      {
        img: img('c (24).jpeg'),
        title: 'Discover the beauty of Zanzibar & Tanzania',
      },
      {
        img: img('Nakupenda Beach.jpeg'),
        title: 'Authentic Tours Across Zanzibar',
      },
      {
        img: img('c (177).jpeg'),
        title: 'Adventure, Culture & Beach Escapes',
      },
      {
        img: img('c (304).jpeg'),
        title: "Explore Tanzania's Natural Wonders",
      },
      {
        img: img('c (303).jpeg'),
        title: 'Create Unforgettable Travel Memories',
      },
    ],
    []
  )

  const attractions = useMemo(
    () => [
      {
        title: 'Serengeti National Park',
        image: img('IMG_098_22. (18).jpg'),
        desc: 'World-renowned for its annual wildebeest migration, the Serengeti offers vast savannahs teeming with wildlife, golden plains, and unforgettable safari experiences in the heart of Tanzania.',
      },
      {
        title: 'Zanzibar Archipelago',
        image: img('Mnemba Atoll Trip.jpeg'),
        desc: 'Zanzibar is famed for its white-sand beaches, turquoise waters, rich Swahili culture, and relaxing island atmosphere that makes it one of East Africa’s most loved coastal destinations.',
      },
      {
        title: 'Ngorongoro Conservation Area',
        image: img('Ngorongoro creater.jpg'),
        desc: 'Famous for the Ngorongoro Crater, this area is a haven for wildlife, dramatic landscapes, and Maasai culture, offering one of the most unique safari settings in Africa.',
      },
      {
        title: 'Selous / Nyerere National Park',
        image: img('IMG_098_22. (16).jpg'),
        desc: 'One of Africa’s largest protected areas, known for wild landscapes, rich wildlife, peaceful river scenery, and unique boat safaris away from the crowds.',
      },
    ],
    []
  )

  const testimonials = useMemo(
    () => [
      {
        text: 'Max Tour & Safari made our trip to Zanzibar unforgettable! Their team are storytellers who make every place come alive. Highly recommended!',
        author: 'Laisesma',
        meta: 'Brazil • January 2025',
        image: img('1 (1).jpeg'),
      },
      {
        text: 'The guides were knowledgeable and friendly. We loved every moment of our safari!',
        author: 'Anna Müller',
        meta: 'Germany • February 2025',
        image: img('1 (2).jpeg'),
      },
      {
        text: 'A seamless experience from booking to the actual tour. Highly professional.',
        author: 'John Smith',
        meta: 'United Kingdom • March 2025',
        image: img('1 (3).jpeg'),
      },
      {
        text: 'Fantastic service and unforgettable memories. Will book again!',
        author: 'Yuki Tanaka',
        meta: 'Japan • January 2026',
        image: img('1 (10).jpeg'),
      },
    ],
    []
  )

  const [menuOpen, setMenuOpen] = useState(false)
  const [heroIndex, setHeroIndex] = useState(0)
  const [attractionIndex, setAttractionIndex] = useState(0)
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [isAttractionChanging, setIsAttractionChanging] = useState(false)
  const [isTestimonialChanging, setIsTestimonialChanging] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState({
    title: '',
    image: '',
    text: '',
  })

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

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [contactFeedback, setContactFeedback] = useState({
    text: '',
    type: '',
  })

  const [sending, setSending] = useState(false)

  const heroTitleRef = useRef(null)
  const heroTextRef = useRef(null)
  const heroBtnRef = useRef(null)
  const contactSectionRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length)
    }, 5200)

    return () => clearInterval(timer)
  }, [heroSlides.length])

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAttractionChanging(true)

      setTimeout(() => {
        setAttractionIndex((prev) => (prev + 1) % attractions.length)
      }, 320)

      setTimeout(() => {
        setIsAttractionChanging(false)
      }, 760)
    }, 5000)

    return () => clearInterval(timer)
  }, [attractions.length])

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTestimonialChanging(true)

      setTimeout(() => {
        setTestimonialIndex((prev) => (prev + 1) % testimonials.length)
      }, 220)

      setTimeout(() => {
        setIsTestimonialChanging(false)
      }, 520)
    }, 4300)

    return () => clearInterval(timer)
  }, [testimonials.length])

  useEffect(() => {
    attractions.forEach((item) => {
      const preloadImg = new Image()
      preloadImg.src = item.image
    })
  }, [attractions])

  useEffect(() => {
    const animateEl = (el, animation) => {
      if (!el) return
      el.style.animation = 'none'
      void el.offsetWidth
      el.style.animation = animation
    }

    animateEl(heroTitleRef.current, 'heroTextRise 1s ease 0.2s both')
    animateEl(heroTextRef.current, 'heroTextRise 1s ease 0.36s both')
    animateEl(heroBtnRef.current, 'heroTextRise 1s ease 0.5s both')
  }, [heroIndex])

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }, [modalOpen, menuOpen, heroIndex, attractionIndex, testimonialIndex, contactFeedback])

  useEffect(() => {
    if (!contactFeedback.text) return

    const timer = setTimeout(() => {
      setContactFeedback({ text: '', type: '' })
    }, 4000)

    return () => clearTimeout(timer)
  }, [contactFeedback.text])

  useEffect(() => {
    if (!modalOpen) return

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setModalOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [modalOpen])

  const currentHero = heroSlides[heroIndex]
  const currentAttraction = attractions[attractionIndex]
  const currentTestimonial = testimonials[testimonialIndex]

  const openModal = (title, image, text) => {
    setModalData({ title, image, text })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const handleBookFromModal = () => {
    setContactForm((prev) => ({
      ...prev,
      subject: `Booking: ${modalData.title}`,
      message: `Hello, I am interested in ${modalData.title}. Please provide more information.`,
    }))

    setModalOpen(false)

    if (contactSectionRef.current) {
      contactSectionRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleContactChange = (e) => {
    const { id, value } = e.target

    const mapping = {
      'contact-name': 'name',
      'contact-email': 'email',
      'contact-subject': 'subject',
      'contact-message': 'message',
    }

    const field = mapping[id]
    if (!field) return

    setContactForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()

    const name = contactForm.name.trim()
    const email = contactForm.email.trim()
    const subject = contactForm.subject.trim()
    const message = contactForm.message.trim()

    if (!name || !email || !subject || !message) {
      setContactFeedback({
        text: 'Please fill in all fields.',
        type: 'error',
      })
      return
    }

    setSending(true)
    setContactFeedback({ text: '', type: '' })

    try {
      const payload = {
        full_name: name,
        email,
        subject,
        message,
      }

      const { error } = await supabaseClient
        .from('contact_messages')
        .insert([payload])

      if (error) throw error

      setContactFeedback({
        text: 'Your message has been sent successfully. Our team will get back to you soon.',
        type: 'success',
      })

      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
    } catch (error) {
      console.error('Contact form submit failed:', error)

      setContactFeedback({
        text: `Message failed: ${error.message}`,
        type: 'error',
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="home-page">
      <header className="site-header">
        <div className="wrapper nav-wrap">
          <a href="#home" className="brand">
            <img src={img('next.jpeg')} alt="Max Tour & Safari Logo" />
            <span>Max Tour & Safari</span>
          </a>

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
            <a href="#home" onClick={() => setMenuOpen(false)}>
              Home
            </a>
            <Link to="/daily-tours" onClick={() => setMenuOpen(false)}>
              Daily Tours
            </Link>
            <Link to="/holiday-packages" onClick={() => setMenuOpen(false)}>
              Holiday Tours
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

      <section className="hero" id="home">
        <div
          className="hero-slider"
          id="heroSlider"
          style={{ backgroundImage: `url('${currentHero.img}')` }}
        >
          <div className="hero-overlay"></div>

          <div className="hero-content wrapper">
            <h1 id="heroTitle" ref={heroTitleRef}>
              {currentHero.title}
            </h1>
            <p ref={heroTextRef}>Authentic African Tours & Experiences</p>
            <a href="#destinations" className="btn-primary" ref={heroBtnRef}>
              Explore Tours
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="wrapper two-col">
          <div className="about-images">
            <img src={img('g.jpeg')} alt="About Max Tour & Safari" />
          </div>

          <div className="about-text">
            <h2>Who We Are — Welcome to Max Tour & Safari</h2>

            <p>Welcome to <strong>Max Tour & Safari</strong>, where every safari is a unique story waiting to be written. We take you to discover the true beauty of tourist attractions, local cultures, and breathtaking landscapes through professional services and safaris customized to your needs.</p>

            <p>With over 4 years of experience in the tourism sector, we offer unique experiences, organized with care, passion, and professionalism.</p>

            <div className="about-feature-grid">
              <div className="about-feature-card">
                <h3>Our Services</h3>
                <ul className="about-feature-list">
                  <li>Unique nature safaris</li>
                  <li>Historical and cultural tours</li>
                  <li>Water tours</li>
                  <li>Snorkeling, diving, and boat cruises</li>
                  <li>Spice tours</li>
                  <li>Village tours</li>
                  <li>Sunset experiences</li>
                  <li>Airport transfers</li>
                  <li>House rentals</li>
                </ul>
              </div>

              <div className="about-feature-card">
                <h3>Lingue Disponibili</h3>
                <ul className="about-feature-list">
                  <li>English</li>
                  <li>Spanish</li>
                  <li>French</li>
                  <li>Italian</li>
                  <li>Polish</li>
                  <li>German</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section light-section" id="attractions">
        <div className="wrapper">
          <div className="section-title">
            <h2>Attractions of Tanzania & Zanzibar</h2>
          </div>

          <div className="attraction-view" id="attractionView">
            <div className="attraction-image">
              <img
                id="attractionImage"
                className={isAttractionChanging ? 'attraction-fading' : ''}
                src={currentAttraction.image}
                alt={currentAttraction.title}
              />
            </div>

            <div className={`attraction-info ${isAttractionChanging ? 'is-changing' : ''}`}>
              <h3 id="attractionTitle">{currentAttraction.title}</h3>
              <p id="attractionDesc">{currentAttraction.desc}</p>
            </div>
          </div>

          <p className="attraction-note">
            Famous attractions: beaches, national parks, and historical sites in Tanzania
            and Zanzibar.
          </p>
        </div>
      </section>

      <section className="section" id="destinations">
        <div className="wrapper">
          <div className="section-title">
            <h2>Destinations & Tours</h2>
            <p>Explore curated tours and experiences across Tanzania and Zanzibar.</p>
          </div>

          <div className="card-grid">
            <article className="card">
              <img src={img('c (186).jpeg')} alt="Blue Lagoon" />
              <div className="card-body">
                <h3>Blue Lagoon</h3>
                <p>
                  Blue Lagoon is a breathtaking snorkeling spot on Zanzibar’s southeast
                  coast, known for turquoise waters and vibrant marine life.
                </p>
                <button
                  className="btn-primary open-modal"
                  onClick={() =>
                    openModal(
                      'Blue Lagoon',
                      '/img/c (186).jpeg',
                      'Includes boat ride, snorkeling gear, lunch, and guide. Enjoy an unforgettable marine adventure.'
                    )
                  }
                >
                  See More
                </button>
              </div>
            </article>

            <article className="card">
              <img src={img('c (104).jpeg')} alt="Jozani Forest" />
              <div className="card-body">
                <h3>Jozani Forest</h3>
                <p>
                  Visit Zanzibar’s famous forest and discover the rare Zanzibar red colobus
                  monkeys in a peaceful tropical setting.
                </p>
                <button
                  className="btn-primary open-modal"
                  onClick={() =>
                    openModal(
                      'Jozani Forest',
                      '/img/c (104).jpeg',
                      'Guided forest walk, red colobus monkeys, mangrove boardwalk, and a memorable eco-tour experience.'
                    )
                  }
                >
                  See More
                </button>
              </div>
            </article>

            <article className="card">
              <img src={img('c (253).jpeg')} alt="Stone Town" />
              <div className="card-body">
                <h3>Stone Town</h3>
                <p>
                  Explore the historic and cultural heart of Zanzibar with its narrow
                  streets, carved doors, and rich heritage.
                </p>
                <button
                  className="btn-primary open-modal"
                  onClick={() =>
                    openModal(
                      'Stone Town',
                      '/img/c (253).jpeg',
                      'Walking tour, local guide, entrance fees, and a deep cultural experience in Zanzibar’s UNESCO heritage site.'
                    )
                  }
                >
                  See More
                </button>
              </div>
            </article>

            <article className="card">
              <img src={img('c (252).jpeg')} alt="Prison Island" />
              <div className="card-body">
                <h3>Prison Island</h3>
                <p>
                  Enjoy a unique excursion to meet giant tortoises, relax by the sea, and
                  explore a beautiful island near Stone Town.
                </p>
                <button
                  className="btn-primary open-modal"
                  onClick={() =>
                    openModal(
                      'Prison Island',
                      '/img/c (252).jpeg',
                      'Boat transfer, tortoise sanctuary visit, beautiful scenery, and a memorable island experience.'
                    )
                  }
                >
                  See More
                </button>
              </div>
            </article>

            <article className="card">
              <img src={img('c (167).jpeg')} alt="Safari Blue" />
              <div className="card-body">
                <h3>Safari Blue</h3>
                <p>
                  A full-day marine adventure featuring dhow cruise, snorkeling, seafood
                  BBQ, tropical fruits, and ocean beauty.
                </p>
                <button
                  className="btn-primary open-modal"
                  onClick={() =>
                    openModal(
                      'Safari Blue',
                      '/img/c (167).jpeg',
                      'Dhow cruise, snorkeling, seafood lunch, fruits, drinks, and a full-day marine adventure.'
                    )
                  }
                >
                  See More
                </button>
              </div>
            </article>

            <article className="card">
              <img src={img('Mnemba Island.jpeg')} alt="Mnemba Island" />
              <div className="card-body">
                <h3>Mnemba Island</h3>
                <p>
                  Experience dolphins, snorkeling, and crystal-clear water near one of
                  Zanzibar’s most beautiful marine areas.
                </p>
                <button
                  className="btn-primary open-modal"
                  onClick={() =>
                    openModal(
                      'Mnemba Island',
                      '/img/Mnemba Island.jpeg',
                      'Boat transfer, snorkeling gear, guide, and tropical beach moments near Mnemba Island.'
                    )
                  }
                >
                  See More
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section" id="adventures">
        <div className="wrapper">
          <div className="section-title">
            <h2>Our Travel Adventures</h2>
            <p>See some of the best travel experiences we have organized.</p>
          </div>

          <div className="card-grid">
            <article className="card">
              <img src={img('c (196).jpeg')} alt="Beach Resorts" />
              <div className="card-body">
                <h3>Beach Resorts</h3>
                <p>Relaxing beach escapes with stunning ocean views and tropical vibes.</p>
              </div>
            </article>

            <article className="card">
              <img src={img('c (216).jpeg')} alt="Mikumi Park" />
              <div className="card-body">
                <h3>Mikumi Park</h3>
                <p>Wildlife safari moments from one of Tanzania’s most loved parks.</p>
              </div>
            </article>

            <article className="card">
              <img src={img('c (96).jpeg')} alt="Village Tour" />
              <div className="card-body">
                <h3>Village Tour</h3>
                <p>Experience local life, traditions, food, and authentic culture.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section warm-section" id="testimonials">
        <div className="wrapper">
          <div className="section-title">
            <h2>Testimonials</h2>
          </div>

          <div className="testimonial-slider" id="testimonialSlider">
            <div className={`testimonial-card ${isTestimonialChanging ? 'is-changing' : ''}`}>
              <img
                id="testimonialImage"
                src={currentTestimonial.image}
                alt={currentTestimonial.author}
              />
              <p id="testimonialText">{currentTestimonial.text}</p>
              <h4 id="testimonialAuthor">{currentTestimonial.author}</h4>
              <small id="testimonialMeta">{currentTestimonial.meta}</small>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="blogs">
        <div className="wrapper">
          <div className="section-title">
            <h2>Blogs</h2>
          </div>

          <div className="card-grid">
            <article className="card">
              <img
                src={img('why.jpeg')}
                alt="Why Zanzibar Is The Perfect Holiday Destination"
              />
              <div className="card-body">
                <h3>Why Zanzibar Is The Perfect Holiday Destination</h3>
                <p>
                  Discover why Zanzibar is ideal for adventure, relaxation, culture, and
                  unforgettable tours.
                </p>
                <button
                  className="btn-primary open-modal"
                  onClick={() =>
                    openModal(
                      'Why Zanzibar Is The Perfect Holiday Destination',
                      img('why.jpeg'),
                      'Zanzibar is a paradise for travelers seeking adventure, relaxation, culture, and unforgettable day trips.'
                    )
                  }
                >
                  Read More
                </button>
              </div>
            </article>

            <article className="card">
              <img src={img('his.jpeg')} alt="Historical Sites" />
              <div className="card-body">
                <h3>Historical Sites</h3>
                <p>
                  Explore Stone Town, the Old Fort, Slave Market, Forodhani, and more.
                </p>
                <button
                  className="btn-primary open-modal"
                  onClick={() =>
                    openModal(
                      'Historical Sites',
                      img('his.jpeg'),
                      'Stone Town is rich in stories, architecture, and heritage, making it one of Zanzibar’s cultural treasures.'
                    )
                  }
                >
                  Read More
                </button>
              </div>
            </article>

            <article className="card">
              <img src={img('isl.jpeg')} alt="Island Trips" />
              <div className="card-body">
                <h3>Island Trips</h3>
                <p>
                  Enjoy full-day adventures with beaches, dolphins, snorkeling, and
                  cultural visits.
                </p>
                <button
                  className="btn-primary open-modal"
                  onClick={() =>
                    openModal(
                      'Island Trips',
                      img('isl.jpeg'),
                      'Island trips in Zanzibar combine beaches, sea activities, and cultural experiences into one unforgettable journey.'
                    )
                  }
                >
                  Read More
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section light-section" id="contact" ref={contactSectionRef}>
        <div className="wrapper two-col">
          <div>
            <h2>Contact Us</h2>

            <form id="contactForm" className="contact-form" onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label htmlFor="contact-name">Your Name</label>
                <input
                  type="text"
                  id="contact-name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">Your Email</label>
                <input
                  type="email"
                  id="contact-email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  type="text"
                  id="contact-subject"
                  value={contactForm.subject}
                  onChange={handleContactChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  rows="5"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" disabled={sending}>
                {sending ? 'Sending...' : 'Send Message'}
              </button>

              {contactFeedback.text ? (
                <p
                  id="contactFormMessage"
                  style={{
                    marginTop: '12px',
                    fontWeight: '700',
                    color: contactFeedback.type === 'success' ? '#1f7a43' : '#b42318',
                  }}
                >
                  {contactFeedback.text}
                </p>
              ) : null}
            </form>
          </div>

          <div className="contact-info">
            <h3>Get in Touch</h3>
            <p>
              Max Tour & Safari is your trusted partner for tours and travel in Zanzibar
              and Tanzania. For inquiries, bookings, or partnership opportunities, contact
              us.
            </p>

            <ul>
              <li>
                <strong>Company:</strong> Max Tour & Safari
              </li>
              <li>
                <strong>Address:</strong> Zanzibar
              </li>
              <li>
                <strong>Contact:</strong> +255689840637
              </li>
              <li>
                <strong>Email:</strong> info@maxtourandsafari.co.tz
              </li>
            </ul>

            <div className="social-links">
              <a
                href="https://wa.me/255617438758"
                target="_blank"
                rel="noreferrer"
                className="social-link whatsapp-link"
                aria-label="WhatsApp"
              >
                <i className="fab fa-whatsapp"></i>
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=61561055606916"
                target="_blank"
                rel="noreferrer"
                className="social-link facebook-link"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook"></i>
              </a>

              <a
                href="https://www.instagram.com/zakayo3838?igsh=eDNiMmRlbWF5MHlu"
                target="_blank"
                rel="noreferrer"
                className="social-link instagram-link"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>

              <a
                href="https://tiktok.com/@max.tours.safari"
                target="_blank"
                rel="noreferrer"
                className="social-link tiktok-link"
                aria-label="TikTok"
              >
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer" style={{ justifyContent: 'space-between' }}>
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
        id="siteModal"
        onClick={closeModal}
      >
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" id="modalClose" onClick={closeModal}>
            &times;
          </button>

          <div id="modalContent">
            {modalOpen ? (
              <div className="modal-body-custom">
                <img src={modalData.image} alt={modalData.title} />
                <h2>{modalData.title}</h2>
                <p>{modalData.text}</p>
                <button className="btn-primary" id="bookFromModalBtn" onClick={handleBookFromModal}>
                  Book / Ask About This
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
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

export default Home