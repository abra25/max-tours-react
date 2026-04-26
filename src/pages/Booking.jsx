import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabaseClient } from '../lib/supabase'

function Booking() {
  const base = import.meta.env.BASE_URL
  const img = (file) => `${base}img/${file}`

  // BADILISHA EMAIL HAPA BAADAYE UWEKE YA CLIENT
  const notificationEmail = 'abramkuja24@gmail.com'

  const [searchParams] = useSearchParams()

  const localPackages = useMemo(
    () => [
      { id: 1, title: 'Kuza Cave Jambiani', category: 'day_tour', location: 'Zanzibar', is_active: true },
      { id: 2, title: 'Blue Lagoon Snorkeling Trip Zanzibar', category: 'day_tour', location: 'Zanzibar', is_active: true },
      { id: 3, title: 'Nungwi Village Tour', category: 'day_tour', location: 'Zanzibar', is_active: true },
      { id: 4, title: 'Salaam Cave Tour', category: 'day_tour', location: 'Zanzibar', is_active: true },
      { id: 5, title: 'Mtende Beach Escape', category: 'day_tour', location: 'Zanzibar', is_active: true },
      { id: 6, title: 'Kae Funk Sunset Experience', category: 'day_tour', location: 'Zanzibar', is_active: true },
      { id: 7, title: 'Full Day North Coast Relaxation', category: 'day_tour', location: 'Zanzibar', is_active: true },
      { id: 8, title: 'Spice Tour with Cooking Class', category: 'day_tour', location: 'Zanzibar', is_active: true },

      { id: 101, title: '3 Days Zanzibar Escape', category: 'holiday_package', location: 'Zanzibar', is_active: true },
      { id: 102, title: '4 Days Beach & Culture Package', category: 'holiday_package', location: 'Zanzibar', is_active: true },
      { id: 103, title: '5 Days Zanzibar Adventure Package', category: 'holiday_package', location: 'Zanzibar', is_active: true },
      { id: 104, title: '6 Days Zanzibar Holiday Experience', category: 'holiday_package', location: 'Zanzibar', is_active: true },
      { id: 105, title: '7 Days Zanzibar Honeymoon Package', category: 'holiday_package', location: 'Zanzibar', is_active: true },
      { id: 106, title: '7 Days Zanzibar Family Holiday', category: 'holiday_package', location: 'Zanzibar', is_active: true },

      { id: 201, title: 'Stone Town', category: 'visit_zanzibar', location: 'Zanzibar', is_active: true },
      { id: 202, title: 'Prison Island', category: 'visit_zanzibar', location: 'Zanzibar', is_active: true },
      { id: 203, title: 'Safari Blue', category: 'visit_zanzibar', location: 'Zanzibar', is_active: true },
      { id: 204, title: 'Mnemba Island', category: 'visit_zanzibar', location: 'Zanzibar', is_active: true },
      { id: 205, title: 'Paje Beach', category: 'visit_zanzibar', location: 'Zanzibar', is_active: true },
      { id: 206, title: 'Spice Tours', category: 'visit_zanzibar', location: 'Zanzibar', is_active: true },

      { id: 301, title: 'Visit Tanzania Request', category: 'visit_tanzania', location: 'Tanzania', is_active: true },
    ],
    []
  )

  const [menuOpen, setMenuOpen] = useState(false)
  const [allPackages, setAllPackages] = useState([...localPackages])
  const [packagesSource, setPackagesSource] = useState('local')
  const [loadingPackages, setLoadingPackages] = useState(true)
  const [sending, setSending] = useState(false)
  const [formStatus, setFormStatus] = useState({ text: '', type: '' })

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    service_type: '',
    package_name: [],
    travel_date: '',
    pickup_location: '',
    adults: 1,
    children: 0,
    message: '',
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

  useEffect(() => {
    loadPackages()
  }, [])

  useEffect(() => {
  if (window.lucide) {
    window.lucide.createIcons()
  }
  }, [])

  useEffect(() => {
    if (!formStatus.text) return

    const timer = setTimeout(() => {
      setFormStatus({ text: '', type: '' })
    }, 4000)

    return () => clearTimeout(timer)
  }, [formStatus.text])

  const sortPackagesByTitle = (items) => {
    return [...items].sort((a, b) => a.title.localeCompare(b.title))
  }

  const populatePackageOptions = (selectedType = '') => {
    if (!selectedType) {
      return [{ value: '', label: 'Select service type first' }]
    }

    if (selectedType === 'general_inquiry') {
      return [
        { value: '', label: 'Select inquiry type' },
        { value: 'General Inquiry', label: 'General Inquiry' },
      ]
    }

    const filtered = sortPackagesByTitle(
      allPackages.filter((item) => item.category === selectedType && item.is_active !== false)
    )

    if (!filtered.length) {
      return [{ value: '', label: 'No items available for this type' }]
    }

    return filtered.map((item) => ({
      value: item.title,
      label: item.title,
      packageId: item.id,
      location: item.location || '',
    }))
  }

  const packageOptions = populatePackageOptions(formData.service_type)

  const loadPackages = async () => {
    const typeFromUrl = searchParams.get('type') || ''
    const packageFromUrl = searchParams.get('package') || ''

    try {
      const { data, error } = await supabaseClient
        .from('packages')
        .select('id, title, category, location, is_active')
        .eq('is_active', true)
        .order('title', { ascending: true })

      if (!error && Array.isArray(data) && data.length) {
        setAllPackages(data)
        setPackagesSource('supabase')
      } else {
        setAllPackages(sortPackagesByTitle(localPackages.filter((item) => item.is_active)))
        setPackagesSource('local')
      }
    } catch (error) {
      console.error('Failed to load packages from Supabase. Using local package list.', error)
      setAllPackages(sortPackagesByTitle(localPackages.filter((item) => item.is_active)))
      setPackagesSource('local')
    } finally {
      setLoadingPackages(false)
      setFormData((prev) => ({
        ...prev,
        service_type: typeFromUrl,
        package_name: packageFromUrl ? [packageFromUrl] : [],
      }))
    }
  }

  const handleChange = (e) => {
    const { id, value, selectedOptions } = e.target

    const mapping = {
      fullName: 'full_name',
      email: 'email',
      phone: 'phone',
      serviceType: 'service_type',
      packageName: 'package_name',
      travelDate: 'travel_date',
      pickupLocation: 'pickup_location',
      adults: 'adults',
      children: 'children',
      message: 'message',
    }

    const field = mapping[id]
    if (!field) return

    if (field === 'service_type') {
      setFormData((prev) => ({
        ...prev,
        service_type: value,
        package_name: [],
      }))
      return
    }

    if (field === 'package_name') {
      const values = Array.from(selectedOptions || []).map((option) => option.value).filter(Boolean)

      setFormData((prev) => ({
        ...prev,
        package_name: values,
      }))
      return
    }

    setFormData((prev) => ({
      ...prev,
      [field]:
        field === 'adults' || field === 'children'
          ? Number(value)
          : value,
    }))
  }

  const sendEmailNotification = async (payload) => {
    const emailData = new FormData()

    emailData.append('_subject', 'New Booking Request - Max Tour & Safari')
    emailData.append('_template', 'table')
    emailData.append('Full Name', payload.full_name)
    emailData.append('Phone', payload.phone)
    emailData.append('Package', payload.package_name)
    emailData.append('Message', payload.message || 'No message provided')

    const response = await fetch(`https://formsubmit.co/ajax/${notificationEmail}`, {
      method: 'POST',
      body: emailData,
    })

    if (!response.ok) {
      throw new Error('Email notification failed')
    }

    return response.json()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setFormStatus({ text: '', type: '' })

    const selectedOptions = packageOptions.filter((option) =>
      formData.package_name.includes(option.value)
    )

    let packageId = null
    if (
      packagesSource === 'supabase' &&
      selectedOptions.length === 1 &&
      selectedOptions[0]?.packageId
    ) {
      packageId = Number(selectedOptions[0].packageId)
    }

    const payload = {
      full_name: formData.full_name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      service_type: formData.service_type,
      package_id: packageId,
      package_name: formData.package_name.join(', '),
      travel_date: formData.travel_date || null,
      pickup_location: formData.pickup_location.trim() || null,
      adults: Number(formData.adults || 1),
      children: Number(formData.children || 0),
      message: formData.message.trim() || null,
    }

    if (
      !payload.full_name ||
      !payload.email ||
      !payload.phone ||
      !payload.service_type ||
      !formData.package_name.length
    ) {
      setFormStatus({
        text: 'Please complete the required fields before sending your booking request.',
        type: 'error',
      })
      return
    }

    setSending(true)

    try {
      const { error } = await supabaseClient
        .from('bookings')
        .insert([payload])

      if (error) throw error

      await sendEmailNotification(payload)

      setFormStatus({
        text: 'Your booking request has been sent successfully. Our team will contact you soon.',
        type: 'success',
      })

      setFormData({
        full_name: '',
        email: '',
        phone: '',
        service_type: '',
        package_name: [],
        travel_date: '',
        pickup_location: '',
        adults: 1,
        children: 0,
        message: '',
      })
    } catch (error) {
      console.error('Booking insert or email notification failed:', error)
      setFormStatus({
        text: error.message
          ? `Booking failed: ${error.message}`
          : 'Something went wrong while sending your booking request. Please try again.',
        type: 'error',
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="booking-page">
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
            <Link to="/visit-zanzibar" onClick={() => setMenuOpen(false)}>
              Visit Zanzibar
            </Link>
            <Link to="/agents" onClick={() => setMenuOpen(false)}>
              Agents
            </Link>
            <Link to="/gallery" onClick={() => setMenuOpen(false)}>
              Gallery
            </Link>
            <Link to="/booking" className="active" onClick={() => setMenuOpen(false)}>
              Book Now
            </Link>
          </nav>
        </div>
      </header>

      <section className="booking-hero">
        <div className="booking-hero-overlay"></div>
        <div className="wrapper booking-hero-content">
          <span className="booking-eyebrow">Max Tour & Safari</span>
          <h5>Plan Your Tour With Confidence</h5>
          <p>
            Tell us your preferred tour, travel date, and a few details about your trip.
            We will review your request and contact you to confirm availability and final
            arrangements.
          </p>

          <div className="booking-hero-pills">
            <span>Fast Response</span>
            <span>Flexible Planning</span>
            <span>Zanzibar & Tanzania</span>
          </div>
        </div>
      </section>

      <section className="booking-section">
        <div className="wrapper booking-layout">
          <div className="booking-form-wrap">
            <div className="section-intro">
              <span className="section-tag">Booking Request</span>
              <h5>Book Your Experience</h5>
              <p>
                Complete the form below and our team will contact you with the next steps.
                Payment is arranged outside the website after confirmation.
              </p>
            </div>

            <form id="bookingForm" className="booking-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone / WhatsApp</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="+255..."
                    required
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="serviceType">Service Type</label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    required
                    value={formData.service_type}
                    onChange={handleChange}
                  >
                    <option value="">Select service type</option>
                    <option value="day_tour">Day Tour</option>
                    <option value="holiday_package">Holiday Package</option>
                    <option value="visit_zanzibar">Visit Zanzibar</option>
                    <option value="visit_tanzania">Visit Tanzania</option>
                    <option value="general_inquiry">General Inquiry</option>
                  </select>
                </div>

                <div className="form-group form-group-wide">
                  <label htmlFor="packageName">Select Tour / Package</label>
                  <select
                    id="packageName"
                    name="packageName"
                    required
                    multiple
                    size={Math.min(Math.max(packageOptions.length, 3), 8)}
                    value={formData.package_name}
                    onChange={handleChange}
                    disabled={loadingPackages || !formData.service_type}
                  >
                    {packageOptions.map((option, index) => (
                      <option key={`${option.value}-${index}`} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <small className="field-help">
                    Hold Ctrl (Windows) or Command (Mac) to select multiple tours/packages.
                  </small>

                  <div className="selected-packages">
                    {formData.package_name.length > 0 && (
                      <>
                        <span className="selected-title">Selected Tours:</span>
                        <div className="selected-list">
                          {formData.package_name.map((pkg, index) => (
                            <span key={index} className="selected-item">
                              {pkg}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="travelDate">Preferred Travel Date</label>
                  <input
                    type="date"
                    id="travelDate"
                    name="travelDate"
                    value={formData.travel_date}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pickupLocation">Hotel / Pickup Location</label>
                  <input
                    type="text"
                    id="pickupLocation"
                    name="pickupLocation"
                    placeholder="Hotel name or pickup area"
                    value={formData.pickup_location}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="adults">Adults</label>
                  <input
                    type="number"
                    id="adults"
                    name="adults"
                    min="1"
                    value={formData.adults}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="children">Children</label>
                  <input
                    type="number"
                    id="children"
                    name="children"
                    min="0"
                    value={formData.children}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group form-group-wide">
                  <label htmlFor="message">Special Request / Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    placeholder="Tell us any special request, preferred activities, or important trip details..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <div className="form-note">
                By sending this request, you allow our team to contact you by email or
                WhatsApp to confirm your booking details.
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={sending}>
                  {sending ? 'Sending...' : 'Send Booking Request'}
                </button>
                <Link to="/" className="btn-secondary">
                  Back to Home
                </Link>
              </div>

              <p id="formStatus" className={`form-status ${formStatus.type || ''}`}>
                {formStatus.text}
              </p>
            </form>
          </div>

          <aside className="booking-side">
            <div className="booking-card">
              <span className="side-tag">Why book with us</span>
              <h3>Simple, Clear, and Personal</h3>
              <p>
                We help travelers enjoy Zanzibar and Tanzania with smooth planning,
                clear communication, and flexible support before arrival.
              </p>

              <ul className="feature-list">
                <li>Personal assistance before your trip</li>
                <li>Flexible tour planning</li>
                <li>Local experience and destination guidance</li>
                <li>Easy communication by WhatsApp</li>
              </ul>
            </div>

            <div className="booking-card contact-card">
              <span className="side-tag">Need help first?</span>
              <h3>Contact Our Team</h3>
              <p>If you are not ready to book yet, contact us directly.</p>

              <ul className="contact-list">
                <li>
                  <strong>Company:</strong> Max Tour & Safari
                </li>
                <li>
                  <strong>Email:</strong> info@maxtourandsafari.co.tz
                </li>
                <li>
                  <strong>Phone:</strong> +255 689 840 637
                </li>
                <li>
                  <strong>Location:</strong> Zanzibar, Tanzania
                </li>
              </ul>

              <a
                href="https://wa.me/255689840637"
                target="_blank"
                rel="noreferrer"
                className="whatsapp-btn"
              >
                Chat on WhatsApp
              </a>
            </div>
          </aside>
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

export default Booking