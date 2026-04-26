import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabaseClient } from '../lib/supabase'

function Agents() {
  const base = import.meta.env.BASE_URL
  const img = (file) => `${base}img/${file}`

  const [menuOpen, setMenuOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    country: '',
    company_name: '',
    experience: '',
    message: '',
  })

  const formWrapRef = useRef(null)

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!message.text) return

    const timer = setTimeout(() => {
      setMessage({ text: '', type: '' })
    }, 5000)

    return () => clearTimeout(timer)
  }, [message.text])

  const openAgentForm = () => {
    setFormOpen(true)

    setTimeout(() => {
      formWrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const closeAgentForm = () => {
    setFormOpen(false)
  }

  const handleChange = (e) => {
    const { id, value } = e.target

    const mapping = {
      agentFullName: 'full_name',
      agentEmail: 'email',
      agentPhone: 'phone',
      agentCountry: 'country',
      agentCompany: 'company_name',
      agentExperience: 'experience',
      agentMessage: 'message',
    }

    const field = mapping[id]
    if (!field) return

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      full_name: formData.full_name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      country: formData.country.trim() || null,
      company_name: formData.company_name.trim() || null,
      experience: formData.experience.trim() || null,
      message: formData.message.trim() || null,
    }

    if (!payload.full_name || !payload.email || !payload.phone) {
      setMessage({
        text: 'Please complete full name, email, and phone.',
        type: 'error',
      })
      return
    }

    setSending(true)
    setMessage({ text: '', type: '' })

    try {
      const { error } = await supabaseClient
        .from('agent_applications')
        .insert([payload])

      if (error) throw error

      setMessage({
        text: 'Your application has been sent successfully. Our team will contact you soon.',
        type: 'success',
      })

      setFormData({
        full_name: '',
        email: '',
        phone: '',
        country: '',
        company_name: '',
        experience: '',
        message: '',
      })
    } catch (error) {
      console.error('Agent application failed:', error)
      setMessage({
        text: `Application failed: ${error.message}`,
        type: 'error',
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="agents-page">
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
            {menuOpen ? '✕' : '☰'}
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
            <Link to="/agents" className="active" onClick={() => setMenuOpen(false)}>
              Agents
            </Link>
            <Link to="/gallery" onClick={() => setMenuOpen(false)}>
              Gallery
            </Link>
            <a href={`${base}#contact`} onClick={() => setMenuOpen(false)}>
              Contact
            </a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>Become Our Agent</h1>
          <p>Grow your travel business with us</p>
        </div>
      </section>

      <section className="section">
        <div className="wrapper">
          <div className="grid-2">
            <div>
              <h2>Why Become Our Agent?</h2>

              <ul className="features">
                <li>✔ Attractive partnership & rewards</li>
                <li>✔ Marketing support & promotion</li>
                <li>✔ Full training provided</li>
                <li>✔ 24/7 support</li>
                <li>✔ No setup fees</li>
                <li>✔ Wide range of tours</li>
                <li>✔ Easy booking process</li>
              </ul>
            </div>

            <div className="card">
              <h3>How It Works</h3>
              <ol>
                <li>
                  <strong>Apply</strong> – Fill the application
                </li>
                <li>
                  <strong>Review</strong> – We check your request
                </li>
                <li>
                  <strong>Approval</strong> – We contact you
                </li>
                <li>
                  <strong>Training</strong> – Learn the process
                </li>
                <li>
                  <strong>Start Selling</strong> – Begin your journey
                </li>
              </ol>
            </div>
          </div>

          <div className="cta">
            <h3>Ready to Join?</h3>
            <p>Open the form below and send your application to become our partner agent.</p>

            <div className="contact-box">
              <p>
                <strong>Email:</strong> info@maxtourandsafari.co.tz
              </p>
              <p>
                <strong>WhatsApp:</strong> +255689840637
              </p>
              <p>
                <strong>Location:</strong> Zanzibar
              </p>
            </div>

            <button type="button" className="btn" id="toggleAgentFormBtn" onClick={openAgentForm}>
              Apply Now
            </button>
          </div>

          <div
            className={`agent-form-wrap ${formOpen ? 'active' : ''}`}
            id="agentFormWrap"
            ref={formWrapRef}
          >
            <div className="agent-form-card">
              <div className="agent-form-head">
                <div>
                  <span className="agent-tag">Partner Application</span>
                  <h3>Agent Application Form</h3>
                  <p>Fill in your details and our team will review your request.</p>
                </div>
              </div>

              <form id="agentApplicationForm" className="agent-form" onSubmit={handleSubmit}>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="agentFullName">Full Name</label>
                    <input
                      type="text"
                      id="agentFullName"
                      placeholder="Enter your full name"
                      required
                      value={formData.full_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="agentEmail">Email Address</label>
                    <input
                      type="email"
                      id="agentEmail"
                      placeholder="Enter your email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="agentPhone">Phone / WhatsApp</label>
                    <input
                      type="text"
                      id="agentPhone"
                      placeholder="+255..."
                      required
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="agentCountry">Country</label>
                    <input
                      type="text"
                      id="agentCountry"
                      placeholder="Your country"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="agentCompany">Company / Brand Name</label>
                    <input
                      type="text"
                      id="agentCompany"
                      placeholder="Optional company or agency name"
                      value={formData.company_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="agentExperience">Travel Experience</label>
                    <input
                      type="text"
                      id="agentExperience"
                      placeholder="Eg. 2 years in travel business"
                      value={formData.experience}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="agentMessage">Message</label>
                  <textarea
                    id="agentMessage"
                    rows="5"
                    placeholder="Tell us about your business, audience, or why you want to join us..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="agent-form-actions">
                  <button type="submit" className="btn" disabled={sending}>
                    {sending ? 'Sending...' : 'Send Application'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    id="closeAgentFormBtn"
                    onClick={closeAgentForm}
                  >
                    Close
                  </button>
                </div>

                <p
                  id="agentFormMessage"
                  className={`agent-form-message ${message.type || ''}`}
                >
                  {message.text}
                </p>
              </form>
            </div>
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

export default Agents