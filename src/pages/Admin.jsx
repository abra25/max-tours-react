import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabaseClient } from '../lib/supabase'

function Admin() {
  const navigate = useNavigate()

  const base = import.meta.env.BASE_URL
  const img = (file) => `${base}img/${file}`

  const [activeSection, setActiveSection] = useState('dashboardSection')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [adminUser, setAdminUser] = useState('@maxtours')

  const [allBookings, setAllBookings] = useState([])
  const [allPackages, setAllPackages] = useState([])
  const [allAgents, setAllAgents] = useState([])
  const [allMessages, setAllMessages] = useState([])

  const [dashboardRecentBookings, setDashboardRecentBookings] = useState([])

  const [bookingSearch, setBookingSearch] = useState('')
  const [packageSearch, setPackageSearch] = useState('')
  const [agentSearch, setAgentSearch] = useState('')
  const [messageSearch, setMessageSearch] = useState('')

  const [bookingStatusMessage, setBookingStatusMessage] = useState({ text: '', type: '' })
  const [packageStatusMessage, setPackageStatusMessage] = useState({ text: '', type: '' })
  const [packageEditorMessage, setPackageEditorMessage] = useState({ text: '', type: '' })
  const [agentStatusMessage, setAgentStatusMessage] = useState({ text: '', type: '' })
  const [messageStatusMessage, setMessageStatusMessage] = useState({ text: '', type: '' })

  const [packageModalOpen, setPackageModalOpen] = useState(false)

  const initialPackageForm = {
    id: '',
    title: '',
    slug: '',
    category: '',
    location: '',
    price: '',
    child_price: '',
    duration: '',
    rating: '',
    image_url: '',
    short_description: '',
    full_description: '',
    details: '',
    features: '',
    highlights: '',
    itinerary: '',
    inclusions: '',
    essentials: '',
    is_featured: 'false',
    is_active: 'true',
    image_file: null,
  }

  const [packageForm, setPackageForm] = useState(initialPackageForm)

  useEffect(() => {
    if (localStorage.getItem('max_admin_logged_in') !== 'true') {
      navigate('/admin-login')
      return
    }

    setAdminUser(localStorage.getItem('max_admin_user') || '@maxtours')
  }, [navigate])

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }, [
    activeSection,
    sidebarOpen,
    allBookings,
    allPackages,
    allAgents,
    allMessages,
    dashboardRecentBookings,
    packageModalOpen,
  ])

  useEffect(() => {
    loadDashboardStats()
    loadDashboardRecentBookings()
    loadBookings()
    loadPackagesAdmin()
    loadAgentApplications()
    loadMessages()
  }, [])

  const formatDate = (value) => {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatDateTime = (value) => {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value

    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const slugify = (text = '') => {
    return String(text)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  const parseLines = (text = '') => {
    return String(text)
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  const parseItinerary = (text = '') => {
    return String(text)
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const [day, title, ...rest] = line.split('|')
        return {
          day: Number(day) || index + 1,
          title: (title || `Step ${index + 1}`).trim(),
          desc: rest.join('|').trim(),
        }
      })
  }

  const stringifyItinerary = (items = []) => {
    if (!Array.isArray(items)) return ''
    return items
      .map((item, index) => `${item.day || index + 1}|${item.title || ''}|${item.desc || ''}`)
      .join('\n')
  }

  const openSection = (sectionId) => {
    setActiveSection(sectionId)
    setSidebarOpen(false)

    if (sectionId === 'dashboardSection') {
      loadDashboardStats()
      loadDashboardRecentBookings()
    }

    if (sectionId === 'bookingsSection') {
      loadBookings()
    }

    if (sectionId === 'packagesSection') {
      loadPackagesAdmin()
    }

    if (sectionId === 'agentsSection') {
      loadAgentApplications()
    }

    if (sectionId === 'messagesSection') {
      loadMessages()
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('max_admin_logged_in')
    localStorage.removeItem('max_admin_user')
    navigate('/admin-login')
  }

  const loadDashboardStats = async () => {
    try {
      const [bookingsResult, packagesResult, agentsResult, messagesResult] = await Promise.all([
        supabaseClient.from('bookings').select('id', { count: 'exact' }),
        supabaseClient.from('packages').select('id, is_active', { count: 'exact' }),
        supabaseClient.from('agent_applications').select('id, status', { count: 'exact' }),
        supabaseClient.from('contact_messages').select('id, status', { count: 'exact' }),
      ])

      if (!bookingsResult.error) {
        setAllBookings(Array.isArray(bookingsResult.data) ? bookingsResult.data : [])
      }

      if (!packagesResult.error) {
        setAllPackages(Array.isArray(packagesResult.data) ? packagesResult.data : [])
      }

      if (!agentsResult.error) {
        setAllAgents(Array.isArray(agentsResult.data) ? agentsResult.data : [])
      }

      if (!messagesResult.error) {
        setAllMessages(Array.isArray(messagesResult.data) ? messagesResult.data : [])
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error)
    }
  }

  const loadDashboardRecentBookings = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('bookings')
        .select('id, full_name, package_name, travel_date, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setDashboardRecentBookings(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load recent dashboard bookings:', error)
      setDashboardRecentBookings([])
    }
  }

  const loadBookings = async () => {
    setBookingStatusMessage({ text: 'Loading bookings...', type: '' })

    try {
      const { data, error } = await supabaseClient
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const rows = Array.isArray(data) ? data : []
      setAllBookings(rows)
      setBookingStatusMessage({
        text: `Loaded ${rows.length} booking(s).`,
        type: 'success',
      })
    } catch (error) {
      console.error('Failed to load bookings:', error)
      setBookingStatusMessage({
        text: `Failed to load bookings: ${error.message}`,
        type: 'error',
      })
      setAllBookings([])
    }
  }

  const loadPackagesAdmin = async () => {
    setPackageStatusMessage({ text: 'Loading packages...', type: '' })

    try {
      const { data, error } = await supabaseClient
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const rows = Array.isArray(data) ? data : []
      setAllPackages(rows)
      setPackageStatusMessage({
        text: `Loaded ${rows.length} package(s).`,
        type: 'success',
      })
    } catch (error) {
      console.error('Failed to load packages:', error)
      setPackageStatusMessage({
        text: `Failed to load packages: ${error.message}`,
        type: 'error',
      })
      setAllPackages([])
    }
  }

  const loadAgentApplications = async () => {
    setAgentStatusMessage({ text: 'Loading applications...', type: '' })

    try {
      const { data, error } = await supabaseClient
        .from('agent_applications')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const rows = Array.isArray(data) ? data : []
      setAllAgents(rows)
      setAgentStatusMessage({
        text: `Loaded ${rows.length} application(s).`,
        type: 'success',
      })
    } catch (error) {
      console.error('Failed to load agent applications:', error)
      setAgentStatusMessage({
        text: `Failed to load applications: ${error.message}`,
        type: 'error',
      })
      setAllAgents([])
    }
  }

  const loadMessages = async () => {
    setMessageStatusMessage({ text: 'Loading messages...', type: '' })

    try {
      const { data, error } = await supabaseClient
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const rows = Array.isArray(data) ? data : []
      setAllMessages(rows)
      setMessageStatusMessage({
        text: `Loaded ${rows.length} message(s).`,
        type: 'success',
      })
    } catch (error) {
      console.error('Failed to load messages:', error)
      setMessageStatusMessage({
        text: `Failed to load messages: ${error.message}`,
        type: 'error',
      })
      setAllMessages([])
    }
  }

  const updateBookingStatus = async (bookingId, newStatus) => {
    setBookingStatusMessage({ text: `Saving booking #${bookingId}...`, type: '' })

    try {
      const { error } = await supabaseClient
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)

      if (error) throw error

      setBookingStatusMessage({
        text: `Booking #${bookingId} updated to ${newStatus}.`,
        type: 'success',
      })
      await loadBookings()
      await loadDashboardRecentBookings()
    } catch (error) {
      console.error('Failed to update booking status:', error)
      setBookingStatusMessage({
        text: `Failed to update booking #${bookingId}: ${error.message}`,
        type: 'error',
      })
    }
  }

  const deleteBooking = async (bookingId) => {
    const confirmed = window.confirm(`Delete booking #${bookingId}? This action cannot be undone.`)
    if (!confirmed) return

    setBookingStatusMessage({ text: `Deleting booking #${bookingId}...`, type: '' })

    try {
      const { error } = await supabaseClient
        .from('bookings')
        .delete()
        .eq('id', bookingId)

      if (error) throw error

      setBookingStatusMessage({
        text: `Booking #${bookingId} deleted successfully.`,
        type: 'success',
      })
      await loadBookings()
      await loadDashboardRecentBookings()
    } catch (error) {
      console.error('Failed to delete booking:', error)
      setBookingStatusMessage({
        text: `Failed to delete booking #${bookingId}: ${error.message}`,
        type: 'error',
      })
    }
  }

  const toggleCategoryFields = (categoryValue) => {
    return {
      showHoliday: categoryValue === 'holiday_package',
      showDay: categoryValue === 'day_tour',
    }
  }

  const resetPackageForm = () => {
    setPackageForm(initialPackageForm)
    setPackageEditorMessage({ text: '', type: '' })
  }

  const openPackageEditorModal = () => {
    setPackageModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closePackageEditorModal = () => {
    setPackageModalOpen(false)
    document.body.style.overflow = ''
  }

  const editPackage = (pkg) => {
    setPackageForm({
      id: String(pkg.id ?? ''),
      title: pkg.title ?? '',
      slug: pkg.slug ?? '',
      category: pkg.category ?? '',
      location: pkg.location ?? '',
      price: pkg.price ?? '',
      child_price: pkg.child_price ?? '',
      duration: pkg.duration ?? '',
      rating: pkg.rating ?? '',
      image_url: pkg.image_url ?? '',
      short_description: pkg.short_description ?? '',
      full_description: pkg.full_description ?? '',
      details: pkg.details ?? '',
      features: Array.isArray(pkg.features) ? pkg.features.join('\n') : '',
      highlights: Array.isArray(pkg.highlights) ? pkg.highlights.join('\n') : '',
      itinerary: stringifyItinerary(pkg.itinerary),
      inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions.join('\n') : '',
      essentials: Array.isArray(pkg.essentials) ? pkg.essentials.join('\n') : '',
      is_featured: String(!!pkg.is_featured),
      is_active: String(!!pkg.is_active),
      image_file: null,
    })

    setPackageEditorMessage({
      text: `Editing package #${pkg.id}.`,
      type: 'success',
    })
    openPackageEditorModal()
  }

  const uploadPackageImage = async (file) => {
    if (!file) return null

    const safeName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const filePath = `packages/${safeName}`

    const { error } = await supabaseClient.storage
      .from('tour-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    const { data } = supabaseClient.storage
      .from('tour-images')
      .getPublicUrl(filePath)

    return data?.publicUrl || null
  }

  const savePackage = async (values) => {
    const packageId = packageForm.id.trim()

    const payload = {
      title: values.title,
      slug: values.slug || slugify(values.title),
      category: values.category,
      location: values.location,
      price: values.price || null,
      child_price: values.child_price || null,
      duration: values.duration || null,
      rating: values.rating || null,
      image_url: values.image_url || null,
      short_description: values.short_description || null,
      full_description: values.full_description || null,
      details: values.details || null,
      features: values.features || [],
      highlights: values.highlights || [],
      itinerary: values.itinerary || [],
      inclusions: values.inclusions || [],
      essentials: values.essentials || [],
      is_featured: values.is_featured,
      is_active: values.is_active,
    }

    try {
      let result

      if (packageId) {
        result = await supabaseClient
          .from('packages')
          .update(payload)
          .eq('id', Number(packageId))
      } else {
        result = await supabaseClient
          .from('packages')
          .insert([payload])
      }

      if (result.error) throw result.error

      setPackageEditorMessage({
        text: packageId
          ? `Package #${packageId} updated successfully.`
          : 'Package added successfully.',
        type: 'success',
      })

      resetPackageForm()
      await loadPackagesAdmin()
      closePackageEditorModal()
    } catch (error) {
      console.error('Failed to save package:', error)
      setPackageEditorMessage({
        text: `Failed to save package: ${error.message}`,
        type: 'error',
      })
    }
  }

  const handlePackageSubmit = async (e) => {
    e.preventDefault()

    try {
      let imageUrl = packageForm.image_url.trim() || ''

      if (packageForm.image_file) {
        setPackageEditorMessage({ text: 'Uploading image...', type: 'success' })
        imageUrl = await uploadPackageImage(packageForm.image_file)
      }

      const values = {
        title: packageForm.title.trim(),
        slug: packageForm.slug.trim(),
        category: packageForm.category,
        location: packageForm.location,
        price: packageForm.price.trim(),
        child_price: packageForm.child_price.trim(),
        duration: packageForm.duration.trim(),
        rating: packageForm.rating.trim(),
        image_url: imageUrl,
        short_description: packageForm.short_description.trim(),
        full_description: packageForm.full_description.trim(),
        details: packageForm.details.trim(),
        features: parseLines(packageForm.features),
        highlights: parseLines(packageForm.highlights),
        itinerary: parseItinerary(packageForm.itinerary),
        inclusions: parseLines(packageForm.inclusions),
        essentials: parseLines(packageForm.essentials),
        is_featured: packageForm.is_featured === 'true',
        is_active: packageForm.is_active === 'true',
      }

      if (!values.title || !values.category || !values.location) {
        setPackageEditorMessage({
          text: 'Please complete title, category, and location.',
          type: 'error',
        })
        return
      }

      await savePackage(values)
    } catch (error) {
      console.error('Package submit failed:', error)
      setPackageEditorMessage({
        text: `Package submit failed: ${error.message}`,
        type: 'error',
      })
    }
  }

  const deletePackage = async (packageId) => {
    const confirmed = window.confirm(`Delete package #${packageId}?`)
    if (!confirmed) return

    setPackageStatusMessage({ text: `Deleting package #${packageId}...`, type: '' })

    try {
      const { error } = await supabaseClient
        .from('packages')
        .delete()
        .eq('id', packageId)

      if (error) throw error

      setPackageStatusMessage({
        text: `Package #${packageId} deleted successfully.`,
        type: 'success',
      })
      await loadPackagesAdmin()
    } catch (error) {
      console.error('Failed to delete package:', error)
      setPackageStatusMessage({
        text: `Failed to delete package #${packageId}: ${error.message}`,
        type: 'error',
      })
    }
  }

  const updateAgentStatus = async (agentId, newStatus) => {
    setAgentStatusMessage({ text: `Saving application #${agentId}...`, type: '' })

    try {
      const { error } = await supabaseClient
        .from('agent_applications')
        .update({ status: newStatus })
        .eq('id', agentId)

      if (error) throw error

      setAgentStatusMessage({
        text: `Application #${agentId} updated to ${newStatus}.`,
        type: 'success',
      })
      await loadAgentApplications()
    } catch (error) {
      console.error('Failed to update agent application:', error)
      setAgentStatusMessage({
        text: `Failed to update application #${agentId}: ${error.message}`,
        type: 'error',
      })
    }
  }

  const deleteAgentApplication = async (agentId) => {
    const confirmed = window.confirm(`Delete agent application #${agentId}?`)
    if (!confirmed) return

    setAgentStatusMessage({ text: `Deleting application #${agentId}...`, type: '' })

    try {
      const { error } = await supabaseClient
        .from('agent_applications')
        .delete()
        .eq('id', agentId)

      if (error) throw error

      setAgentStatusMessage({
        text: `Application #${agentId} deleted successfully.`,
        type: 'success',
      })
      await loadAgentApplications()
    } catch (error) {
      console.error('Failed to delete agent application:', error)
      setAgentStatusMessage({
        text: `Failed to delete application #${agentId}: ${error.message}`,
        type: 'error',
      })
    }
  }

  const markMessageAsRead = async (messageId) => {
    setMessageStatusMessage({ text: `Saving message #${messageId}...`, type: '' })

    try {
      const { error } = await supabaseClient
        .from('contact_messages')
        .update({ status: 'read' })
        .eq('id', messageId)

      if (error) throw error

      setMessageStatusMessage({
        text: `Message #${messageId} marked as viewed.`,
        type: 'success',
      })
      await loadMessages()
    } catch (error) {
      console.error('Failed to update message:', error)
      setMessageStatusMessage({
        text: `Failed to update message #${messageId}: ${error.message}`,
        type: 'error',
      })
    }
  }

  const deleteMessage = async (messageId) => {
    const confirmed = window.confirm(`Delete message #${messageId}?`)
    if (!confirmed) return

    setMessageStatusMessage({ text: `Deleting message #${messageId}...`, type: '' })

    try {
      const { error } = await supabaseClient
        .from('contact_messages')
        .delete()
        .eq('id', messageId)

      if (error) throw error

      setMessageStatusMessage({
        text: `Message #${messageId} deleted successfully.`,
        type: 'success',
      })
      await loadMessages()
    } catch (error) {
      console.error('Failed to delete message:', error)
      setMessageStatusMessage({
        text: `Failed to delete message #${messageId}: ${error.message}`,
        type: 'error',
      })
    }
  }

  const filteredBookings = useMemo(() => {
    if (!bookingSearch.trim()) return allBookings

    const query = bookingSearch.trim().toLowerCase()

    return allBookings.filter((booking) =>
      [
        booking.full_name,
        booking.email,
        booking.phone,
        booking.package_name,
        booking.service_type,
        booking.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    )
  }, [allBookings, bookingSearch])

  const filteredPackages = useMemo(() => {
    if (!packageSearch.trim()) return allPackages

    const query = packageSearch.trim().toLowerCase()

    return allPackages.filter((pkg) =>
      [
        pkg.title,
        pkg.slug,
        pkg.category,
        pkg.location,
        pkg.price,
        pkg.duration,
        pkg.short_description,
        pkg.rating,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    )
  }, [allPackages, packageSearch])

  const filteredAgents = useMemo(() => {
    if (!agentSearch.trim()) return allAgents

    const query = agentSearch.trim().toLowerCase()

    return allAgents.filter((agent) =>
      [
        agent.full_name,
        agent.email,
        agent.phone,
        agent.country,
        agent.company_name,
        agent.experience,
        agent.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    )
  }, [allAgents, agentSearch])

  const filteredMessages = useMemo(() => {
    if (!messageSearch.trim()) return allMessages

    const query = messageSearch.trim().toLowerCase()

    return allMessages.filter((msg) =>
      [msg.full_name, msg.email, msg.subject, msg.message, msg.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    )
  }, [allMessages, messageSearch])

  const activePackagesCount = allPackages.filter((pkg) => pkg.is_active === true).length
  const unreadMessagesCount = allMessages.filter((msg) => msg.status === 'new').length
  const categoryFields = toggleCategoryFields(packageForm.category)

  return (
    <div className="admin-layout">
      <aside className={`sidebar ${sidebarOpen ? 'active' : ''}`} id="sidebar">
        <div className="sidebar-top">
          <Link to="/" className="sidebar-brand">
            <img src={img('next.jpeg')} alt="Logo" />
            <div>
              <h2>Max Tours</h2>
              <p>Admin Panel</p>
            </div>
          </Link>

          <button
            className="mobile-close"
            id="mobileClose"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <i data-lucide="x"></i>
          </button>
        </div>

        <div className="admin-user-box">
          <div className="admin-avatar">
            <i data-lucide="shield-check"></i>
          </div>
          <div>
            <strong>Administrator</strong>
            <span id="adminUserText">{adminUser}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-link ${activeSection === 'dashboardSection' ? 'active' : ''}`}
            onClick={() => openSection('dashboardSection')}
          >
            <i data-lucide="layout-dashboard"></i>
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-link ${activeSection === 'bookingsSection' ? 'active' : ''}`}
            onClick={() => openSection('bookingsSection')}
          >
            <i data-lucide="calendar-check-2"></i>
            <span>Bookings</span>
          </button>

          <button
            className={`nav-link ${activeSection === 'packagesSection' ? 'active' : ''}`}
            onClick={() => openSection('packagesSection')}
          >
            <i data-lucide="briefcase-business"></i>
            <span>Packages</span>
          </button>

          <button
            className={`nav-link ${activeSection === 'agentsSection' ? 'active' : ''}`}
            onClick={() => openSection('agentsSection')}
          >
            <i data-lucide="users-round"></i>
            <span>Agent Applications</span>
          </button>

          <button
            className={`nav-link ${activeSection === 'messagesSection' ? 'active' : ''}`}
            onClick={() => openSection('messagesSection')}
          >
            <i data-lucide="mail"></i>
            <span>Messages</span>
          </button>
        </nav>

        <button className="logout-btn" id="logoutBtn" onClick={handleLogout}>
          <i data-lucide="log-out"></i>
          <span>Logout</span>
        </button>
      </aside>

      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'active' : ''}`}
        id="sidebarBackdrop"
        onClick={() => setSidebarOpen(false)}
      ></div>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Welcome, Admin</h1>
            <p>Manage your tourism website content from one place.</p>
          </div>

          <button
            className="menu-btn"
            id="menuBtn"
            aria-label="Open sidebar"
            onClick={() => setSidebarOpen(true)}
          >
            <i data-lucide="menu"></i>
          </button>
        </header>

        <section className={`page-section ${activeSection === 'dashboardSection' ? 'active' : ''}`}>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon soft-gold">
                <i data-lucide="calendar-check-2"></i>
              </div>
              <div>
                <h3 id="dashboardBookingsCount">{allBookings.length}</h3>
                <p>Total Bookings</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon soft-green">
                <i data-lucide="briefcase-business"></i>
              </div>
              <div>
                <h3 id="dashboardPackagesCount">{activePackagesCount}</h3>
                <p>Active Packages</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon soft-blue">
                <i data-lucide="users-round"></i>
              </div>
              <div>
                <h3 id="dashboardAgentsCount">{allAgents.length}</h3>
                <p>Agent Requests</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon soft-red">
                <i data-lucide="mail"></i>
              </div>
              <div>
                <h3 id="dashboardMessagesCount">{unreadMessagesCount}</h3>
                <p>New Messages</p>
              </div>
            </div>
          </div>

          <div className="dashboard-stack">
            <div className="panel-card">
              <div className="panel-head">
                <h2>Recent Bookings</h2>
                <span className="badge">Latest</span>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Package</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody id="dashboardRecentBookingsBody">
                    {!dashboardRecentBookings.length ? (
                      <tr>
                        <td colSpan="4">No recent bookings found.</td>
                      </tr>
                    ) : (
                      dashboardRecentBookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="dashboard-booking-row"
                          onClick={() => openSection('bookingsSection')}
                        >
                          <td>{booking.full_name || '—'}</td>
                          <td>{booking.package_name || '—'}</td>
                          <td>{formatDate(booking.travel_date)}</td>
                          <td>
                            <span className={`status ${booking.status || 'pending'}`}>
                              {booking.status || 'pending'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="panel-card quick-actions">
              <div className="panel-head">
                <h2>Quick Actions</h2>
              </div>

              <div className="quick-grid">
                <button className="quick-btn" onClick={() => openSection('bookingsSection')}>
                  <i data-lucide="calendar-plus"></i>
                  <span>View Bookings</span>
                </button>

                <button
                  className="quick-btn"
                  onClick={() => {
                    resetPackageForm()
                    openSection('packagesSection')
                    openPackageEditorModal()
                  }}
                >
                  <i data-lucide="folder-plus"></i>
                  <span>Add Package</span>
                </button>

                <button className="quick-btn" onClick={() => openSection('agentsSection')}>
                  <i data-lucide="user-plus"></i>
                  <span>Agent Requests</span>
                </button>

                <button className="quick-btn" onClick={() => openSection('messagesSection')}>
                  <i data-lucide="inbox"></i>
                  <span>Open Messages</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className={`page-section ${activeSection === 'bookingsSection' ? 'active' : ''}`}>
          <div className="panel-card">
            <div className="panel-head panel-head-stack">
              <div>
                <h2>Bookings</h2>
                <span className="badge green">Latest Requests</span>
              </div>

              <div className="bookings-tools">
                <input
                  type="text"
                  id="bookingSearch"
                  className="booking-search"
                  placeholder="Search by name, email, package..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                />
                <button className="primary-btn" id="refreshBookingsBtn" type="button" onClick={loadBookings}>
                  Refresh
                </button>
              </div>
            </div>

            <p className={`admin-info-message ${bookingStatusMessage.type || ''}`}>
              {bookingStatusMessage.text}
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Guest</th>
                    <th>Package</th>
                    <th>Travel Date</th>
                    <th>Guests</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody id="bookingsTableBody">
                  {!filteredBookings.length ? (
                    <tr>
                      <td colSpan="8">No bookings found.</td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => {
                      const adults = Number(booking.adults || 0)
                      const children = Number(booking.children || 0)

                      const guestsCount = `${adults} Adult${adults !== 1 ? 's' : ''}${
                        children > 0 ? ` / ${children} Child${children !== 1 ? 'ren' : ''}` : ''
                      }`

                      return (
                        <tr key={booking.id}>
                          <td>{booking.id}</td>
                          <td>
                            <div className="booking-guest">
                              <strong>{booking.full_name || '—'}</strong>
                              <span>{booking.email || '—'}</span>
                              <span>{booking.phone || '—'}</span>
                            </div>
                          </td>
                          <td>
                            <div className="booking-package">
                              <strong>{booking.package_name || '—'}</strong>
                              <span>{booking.service_type || '—'}</span>
                            </div>
                          </td>
                          <td>{formatDate(booking.travel_date)}</td>
                          <td>{guestsCount}</td>
                          <td>{formatDateTime(booking.created_at)}</td>
                          <td>
                            <span className={`status ${booking.status || 'pending'}`}>
                              {booking.status || 'pending'}
                            </span>
                          </td>
                          <td>
                            <div className="booking-actions-stack">
                              <select
                                className="status-select"
                                value={booking.status || 'pending'}
                                onChange={(e) => {
                                  setAllBookings((prev) =>
                                    prev.map((item) =>
                                      item.id === booking.id ? { ...item, status: e.target.value } : item
                                    )
                                  )
                                }}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="rejected">Rejected</option>
                              </select>

                              <div className="booking-row-actions">
                                <button
                                  className="table-action-btn"
                                  onClick={() => updateBookingStatus(booking.id, booking.status || 'pending')}
                                >
                                  Save
                                </button>
                                <button
                                  className="table-delete-btn"
                                  onClick={() => deleteBooking(booking.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className={`page-section ${activeSection === 'packagesSection' ? 'active' : ''}`}>
          <div className="panel-card">
            <div className="panel-head panel-head-stack">
              <div>
                <h2>Packages</h2>
                <span className="badge gold">Manage Day Tours & Holiday Packages</span>
              </div>

              <div className="bookings-tools">
                <input
                  type="text"
                  id="packageSearch"
                  className="booking-search"
                  placeholder="Search packages..."
                  value={packageSearch}
                  onChange={(e) => setPackageSearch(e.target.value)}
                />
                <button className="primary-btn" id="refreshPackagesBtn" type="button" onClick={loadPackagesAdmin}>
                  Refresh
                </button>
                <button
                  className="primary-btn"
                  id="openPackageModalBtn"
                  type="button"
                  onClick={() => {
                    resetPackageForm()
                    openPackageEditorModal()
                  }}
                >
                  Add Package
                </button>
              </div>
            </div>

            <p className={`admin-info-message ${packageStatusMessage.type || ''}`}>
              {packageStatusMessage.text}
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody id="packagesTableBody">
                  {!filteredPackages.length ? (
                    <tr>
                      <td colSpan="7">No packages found.</td>
                    </tr>
                  ) : (
                    filteredPackages.map((pkg) => (
                      <tr key={pkg.id}>
                        <td>{pkg.id}</td>
                        <td>
                          <div className="package-title-cell">
                            <strong>{pkg.title || '—'}</strong>
                            <span>{pkg.duration || 'No duration'}</span>
                          </div>
                        </td>
                        <td>{pkg.category || '—'}</td>
                        <td>{pkg.location || '—'}</td>
                        <td>{pkg.price || '—'}</td>
                        <td>
                          <span className={`status ${pkg.is_active ? 'confirmed' : 'rejected'}`}>
                            {pkg.is_active ? 'active' : 'inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="package-actions">
                            <button className="table-edit-btn" onClick={() => editPackage(pkg)}>
                              Edit
                            </button>
                            <button className="table-delete-btn" onClick={() => deletePackage(pkg.id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <div className={`admin-modal ${packageModalOpen ? 'active' : ''}`} id="packageEditorModal">
          <div className="admin-modal-backdrop" id="packageEditorBackdrop" onClick={closePackageEditorModal}></div>

          <div className="admin-modal-dialog">
            <div className="admin-modal-header">
              <div>
                <span className="badge gold">Package Editor</span>
                <h2 id="packageFormTitle">
                  {packageForm.id ? `Edit Package #${packageForm.id}` : 'Add New Package'}
                </h2>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                id="closePackageModalBtn"
                aria-label="Close"
                onClick={closePackageEditorModal}
              >
                &times;
              </button>
            </div>

            <p className={`admin-info-message ${packageEditorMessage.type || ''}`}>
              {packageEditorMessage.text}
            </p>

            <form className="admin-form admin-form-modal" id="packageForm" onSubmit={handlePackageSubmit}>
              <input type="hidden" id="packageId" value={packageForm.id} />
              <input type="hidden" id="packageImageUrl" value={packageForm.image_url} />

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="packageTitle">Title</label>
                  <input
                    type="text"
                    id="packageTitle"
                    placeholder="Enter package title"
                    required
                    value={packageForm.title}
                    onChange={(e) =>
                      setPackageForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                        slug: prev.id ? prev.slug : slugify(e.target.value),
                      }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="packageSlug">Slug</label>
                  <input
                    type="text"
                    id="packageSlug"
                    placeholder="example-package-name"
                    value={packageForm.slug}
                    onChange={(e) =>
                      setPackageForm((prev) => ({
                        ...prev,
                        slug: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label htmlFor="packageCategory">Category</label>
                  <select
                    id="packageCategory"
                    required
                    value={packageForm.category}
                    onChange={(e) =>
                      setPackageForm((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select category</option>
                    <option value="day_tour">Day Tour</option>
                    <option value="holiday_package">Holiday Package</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="packageLocation">Location</label>
                  <select
                    id="packageLocation"
                    required
                    value={packageForm.location}
                    onChange={(e) =>
                      setPackageForm((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select location</option>
                    <option value="zanzibar">Zanzibar</option>
                    <option value="tanzania">Tanzania</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="packageDuration">Duration</label>
                  <input
                    type="text"
                    id="packageDuration"
                    placeholder="3 hours / 7 Days / Full Day"
                    value={packageForm.duration}
                    onChange={(e) =>
                      setPackageForm((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label htmlFor="packagePrice">Price</label>
                  <input
                    type="text"
                    id="packagePrice"
                    placeholder="$120 or Custom Quote"
                    value={packageForm.price}
                    onChange={(e) =>
                      setPackageForm((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className={`form-group holiday-only-field ${!categoryFields.showHoliday ? 'hidden-category-field' : ''}`}>
                  <label htmlFor="packageChildPrice">Child Price</label>
                  <input
                    type="text"
                    id="packageChildPrice"
                    placeholder="$80"
                    value={packageForm.child_price}
                    onChange={(e) =>
                      setPackageForm((prev) => ({
                        ...prev,
                        child_price: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="packageRating">Rating</label>
                  <input
                    type="text"
                    id="packageRating"
                    placeholder="5-Star or 5"
                    value={packageForm.rating}
                    onChange={(e) =>
                      setPackageForm((prev) => ({
                        ...prev,
                        rating: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label htmlFor="packageFeatured">Featured</label>
                  <select
                    id="packageFeatured"
                    value={packageForm.is_featured}
                    onChange={(e) =>
                      setPackageForm((prev) => ({
                        ...prev,
                        is_featured: e.target.value,
                      }))
                    }
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="packageActive">Status</label>
                  <select
                    id="packageActive"
                    value={packageForm.is_active}
                    onChange={(e) =>
                      setPackageForm((prev) => ({
                        ...prev,
                        is_active: e.target.value,
                      }))
                    }
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="packageImageFile">Image</label>
                  <input
                    type="file"
                    id="packageImageFile"
                    accept="image/*"
                    onChange={(e) =>
                      setPackageForm((prev) => ({
                        ...prev,
                        image_file: e.target.files?.[0] || null,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="packageShortDescription">Short Description</label>
                <textarea
                  id="packageShortDescription"
                  rows="3"
                  placeholder="Short summary for cards"
                  value={packageForm.short_description}
                  onChange={(e) =>
                    setPackageForm((prev) => ({
                      ...prev,
                      short_description: e.target.value,
                    }))
                  }
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="packageFullDescription">Overview / Full Description</label>
                <textarea
                  id="packageFullDescription"
                  rows="5"
                  placeholder="Main description / overview"
                  value={packageForm.full_description}
                  onChange={(e) =>
                    setPackageForm((prev) => ({
                      ...prev,
                      full_description: e.target.value,
                    }))
                  }
                ></textarea>
              </div>

              <div className={`form-group day-only-field ${!categoryFields.showDay ? 'hidden-category-field' : ''}`}>
                <label htmlFor="packageDetails">Tour Details (HTML/text allowed)</label>
                <textarea
                  id="packageDetails"
                  rows="8"
                  placeholder="Detailed day tour content"
                  value={packageForm.details}
                  onChange={(e) =>
                    setPackageForm((prev) => ({
                      ...prev,
                      details: e.target.value,
                    }))
                  }
                ></textarea>
              </div>

              <div className={`form-group holiday-only-field ${!categoryFields.showHoliday ? 'hidden-category-field' : ''}`}>
                <label htmlFor="packageFeatures">Features (one per line)</label>
                <textarea
                  id="packageFeatures"
                  rows="5"
                  placeholder={'Long Stay\nBeach Days\nStone Town'}
                  value={packageForm.features}
                  onChange={(e) =>
                    setPackageForm((prev) => ({
                      ...prev,
                      features: e.target.value,
                    }))
                  }
                ></textarea>
              </div>

              <div className={`form-group holiday-only-field ${!categoryFields.showHoliday ? 'hidden-category-field' : ''}`}>
                <label htmlFor="packageHighlights">Highlights (one per line)</label>
                <textarea
                  id="packageHighlights"
                  rows="5"
                  placeholder={'Extended island stay\nStone Town and Prison Island'}
                  value={packageForm.highlights}
                  onChange={(e) =>
                    setPackageForm((prev) => ({
                      ...prev,
                      highlights: e.target.value,
                    }))
                  }
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="packageItinerary">Itinerary (one line each: Day|Title|Description)</label>
                <textarea
                  id="packageItinerary"
                  rows="8"
                  placeholder={'1|Arrival|Airport transfer and resort check-in.\n2|Stone Town|Guided historic town experience.'}
                  value={packageForm.itinerary}
                  onChange={(e) =>
                    setPackageForm((prev) => ({
                      ...prev,
                      itinerary: e.target.value,
                    }))
                  }
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="packageInclusions">Inclusions (one per line)</label>
                <textarea
                  id="packageInclusions"
                  rows="5"
                  placeholder={'Airport transfers\nGuided tour'}
                  value={packageForm.inclusions}
                  onChange={(e) =>
                    setPackageForm((prev) => ({
                      ...prev,
                      inclusions: e.target.value,
                    }))
                  }
                ></textarea>
              </div>

              <div className={`form-group holiday-only-field ${!categoryFields.showHoliday ? 'hidden-category-field' : ''}`}>
                <label htmlFor="packageEssentials">Essentials (one per line)</label>
                <textarea
                  id="packageEssentials"
                  rows="5"
                  placeholder={'Deposit required\nFlights not included'}
                  value={packageForm.essentials}
                  onChange={(e) =>
                    setPackageForm((prev) => ({
                      ...prev,
                      essentials: e.target.value,
                    }))
                  }
                ></textarea>
              </div>

              <div className="package-form-actions">
                <button type="submit" className="primary-btn" id="packageSubmitBtn">
                  {packageForm.id ? 'Update Package' : 'Save Package'}
                </button>
                <button type="button" className="secondary-btn" id="packageResetBtn" onClick={resetPackageForm}>
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        <section className={`page-section ${activeSection === 'agentsSection' ? 'active' : ''}`}>
          <div className="panel-card">
            <div className="panel-head panel-head-stack">
              <div>
                <h2>Agent Applications</h2>
                <span className="badge blue">Applications</span>
              </div>

              <div className="bookings-tools">
                <input
                  type="text"
                  id="agentSearch"
                  className="booking-search"
                  placeholder="Search by name, email, country..."
                  value={agentSearch}
                  onChange={(e) => setAgentSearch(e.target.value)}
                />
                <button className="primary-btn" id="refreshAgentsBtn" type="button" onClick={loadAgentApplications}>
                  Refresh
                </button>
              </div>
            </div>

            <p className={`admin-info-message ${agentStatusMessage.type || ''}`}>
              {agentStatusMessage.text}
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Applicant</th>
                    <th>Country</th>
                    <th>Experience</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody id="agentsTableBody">
                  {!filteredAgents.length ? (
                    <tr>
                      <td colSpan="7">No agent applications found.</td>
                    </tr>
                  ) : (
                    filteredAgents.map((agent) => (
                      <tr key={agent.id}>
                        <td>{agent.id}</td>
                        <td>
                          <div className="booking-guest">
                            <strong>{agent.full_name || '—'}</strong>
                            <span>{agent.email || '—'}</span>
                            <span>{agent.phone || '—'}</span>
                          </div>
                        </td>
                        <td>{agent.country || '—'}</td>
                        <td>{agent.experience || '—'}</td>
                        <td>{formatDateTime(agent.created_at)}</td>
                        <td>
                          <span
                            className={`status ${
                              agent.status === 'approved'
                                ? 'confirmed'
                                : agent.status === 'rejected'
                                ? 'rejected'
                                : 'pending'
                            }`}
                          >
                            {agent.status || 'pending'}
                          </span>
                        </td>
                        <td>
                          <div className="booking-actions-stack">
                            <select
                              className="status-select"
                              value={agent.status || 'pending'}
                              onChange={(e) => {
                                setAllAgents((prev) =>
                                  prev.map((item) =>
                                    item.id === agent.id ? { ...item, status: e.target.value } : item
                                  )
                                )
                              }}
                            >
                              <option value="pending">Pending</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </select>

                            <div className="booking-row-actions">
                              <button
                                className="table-action-btn"
                                onClick={() => updateAgentStatus(agent.id, agent.status || 'pending')}
                              >
                                Save
                              </button>
                              <button
                                className="table-delete-btn"
                                onClick={() => deleteAgentApplication(agent.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className={`page-section ${activeSection === 'messagesSection' ? 'active' : ''}`}>
          <div className="panel-card">
            <div className="panel-head panel-head-stack">
              <div>
                <h2>Messages</h2>
                <span className="badge red">Inbox</span>
              </div>

              <div className="bookings-tools">
                <input
                  type="text"
                  id="messageSearch"
                  className="booking-search"
                  placeholder="Search by name, email, subject..."
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                />
                <button className="primary-btn" id="refreshMessagesBtn" type="button" onClick={loadMessages}>
                  Refresh
                </button>
              </div>
            </div>

            <p className={`admin-info-message ${messageStatusMessage.type || ''}`}>
              {messageStatusMessage.text}
            </p>

            <div className="message-list" id="messagesList">
              {!filteredMessages.length ? (
                <div className="message-item">
                  <p>No messages found.</p>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <div className="message-item" key={msg.id}>
                    <div className="message-top">
                      <div>
                        <strong>{msg.full_name || '—'}</strong>
                        <div style={{ marginTop: '4px', color: '#6f6a64', fontSize: '0.9rem' }}>
                          {msg.email || '—'}
                        </div>
                      </div>
                      <span>{formatDateTime(msg.created_at)}</span>
                    </div>

                    <h4>{msg.subject || 'No Subject'}</h4>
                    <p>{msg.message || ''}</p>

                    <div className="booking-row-actions" style={{ marginTop: '14px' }}>
                      <button
                        className="table-action-btn"
                        onClick={() => markMessageAsRead(msg.id)}
                      >
                        {msg.status === 'read' ? 'Viewed' : 'Mark as Viewed'}
                      </button>
                      <button
                        className="table-delete-btn"
                        onClick={() => deleteMessage(msg.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Admin