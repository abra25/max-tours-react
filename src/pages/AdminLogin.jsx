import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminLogin() {
  const navigate = useNavigate()

  const base = import.meta.env.BASE_URL
  const img = (file) => `${base}img/${file}`

  const ADMIN_USERNAME = '@maxtours'
  const ADMIN_PASSWORD = 'admin@Maxtours2026'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginMessage, setLoginMessage] = useState({
    text: '',
    type: '',
  })

  useEffect(() => {
    if (localStorage.getItem('max_admin_logged_in') === 'true') {
      navigate('/admin')
    }
  }, [navigate])

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }, [showPassword, loginMessage])

  const handleSubmit = (e) => {
    e.preventDefault()

    const trimmedUsername = username.trim()

    setLoginMessage({
      text: '',
      type: '',
    })

    if (trimmedUsername === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem('max_admin_logged_in', 'true')
      localStorage.setItem('max_admin_user', trimmedUsername)

      setLoginMessage({
        text: 'Login successful. Redirecting...',
        type: 'success',
      })

      setTimeout(() => {
        navigate('/admin')
      }, 700)
    } else {
      setLoginMessage({
        text: 'Invalid username or password.',
        type: 'error',
      })
    }
  }

  return (
    <div className="login-shell">
      <div className="login-overlay"></div>

      <div className="login-card">
        <div className="login-brand">
          <img src={img('next.jpeg')} alt="Max Tour & Safari Logo" />
          <div>
            <h1>Max Tour & Safari</h1>
            <p>Admin Access Portal</p>
          </div>
        </div>

        <div className="login-copy">
          <span className="login-tag">Secure Area</span>
          <h2>Welcome Back</h2>
          <p>
            Sign in to manage bookings, packages, messages, and agent
            applications.
          </p>
        </div>

        <form id="adminLoginForm" className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrap">
              <i data-lucide="user-round"></i>
              <input
                type="text"
                id="username"
                placeholder="Enter username"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <i data-lucide="lock-keyhole"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                id="togglePassword"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <i data-lucide={showPassword ? 'eye-off' : 'eye'}></i>
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn">
            Login to Admin Panel
          </button>

          <p id="loginMessage" className={`login-message ${loginMessage.type || ''}`}>
            {loginMessage.text}
          </p>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin