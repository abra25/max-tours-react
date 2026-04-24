import './styles/style.css'
import './styles/daily-tours.css'
import './styles/holiday-packages.css'
import './styles/visit-zanzibar.css'
import './styles/agents.css'
import './styles/gllary.css'
import './styles/booking.css'
import './styles/legal-pages.css'
import './styles/admin-login.css'
import './styles/admin.css'

import { Routes, Route } from 'react-router-dom'

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

function App() {
  return (
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
  )
}

export default App