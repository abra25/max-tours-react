import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import Home from './pages/Home'
import DailyTours from './pages/DailyTours'
import HolidayPackages from './pages/HolidayPackages'
import VisitZanzibar from './pages/VisitZanzibar'
import Agents from './pages/Agents'
import Gallery from './pages/Gallery'
import Booking from './pages/Booking'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Faqs from './pages/Faqs'
import AdminLogin from './pages/AdminLogin'
import Admin from './pages/Admin'

function RouteStyles() {
  const location = useLocation()
  const base = import.meta.env.BASE_URL

  useEffect(() => {
    const routeCssMap = {
      '/': `${base}css/style.css`,
      '/daily-tours': `${base}css/daily-tours.css`,
      '/holiday-packages': `${base}css/holiday-packages.css`,
      '/visit-zanzibar': `${base}css/visit-zanzibar.css`,
      '/agents': `${base}css/agents.css`,
      '/gallery': `${base}css/gllary.css`,
      '/booking': `${base}css/booking.css`,
      '/terms': `${base}css/legal-pages.css`,
      '/privacy': `${base}css/legal-pages.css`,
      '/faqs': `${base}css/legal-pages.css`,
      '/admin-login': `${base}css/admin-login.css`,
      '/admin': `${base}css/admin.css`,
    }

    const href = routeCssMap[location.pathname] || `${base}css/style.css`

    const oldLink = document.getElementById('route-page-css')
    if (oldLink) {
      oldLink.remove()
    }

    const link = document.createElement('link')
    link.id = 'route-page-css'
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)

    return () => {
      const existing = document.getElementById('route-page-css')
      if (existing) existing.remove()
    }
  }, [location.pathname, base])

  return null
}

function App() {
  return (
    <>
      <RouteStyles />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/daily-tours" element={<DailyTours />} />
        <Route path="/holiday-packages" element={<HolidayPackages />} />
        <Route path="/visit-zanzibar" element={<VisitZanzibar />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  )
}

export default App