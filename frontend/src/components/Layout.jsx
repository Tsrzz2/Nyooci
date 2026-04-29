import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/logo.png" alt="Nyooci Logo" style={{ height: '40px', width: 'auto' }} />
            Nyooci
          </Link>
          <div className="navbar-links">
            <Link to="/" className={isActive('/') ? 'active' : ''}>Beranda</Link>
            <Link to="/services" className={isActive('/services') ? 'active' : ''}>Layanan</Link>
            {user ? (
              <>
                <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>Dashboard</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>Admin</Link>
                )}
                <button onClick={logout} className="btn btn-outline btn-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className={isActive('/login') ? 'active' : ''}>Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Daftar</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main style={{ minHeight: 'calc(100vh - 80px)', padding: '2rem 0' }}>
        <Outlet />
      </main>
      <footer style={{ background: 'var(--dark)', color: 'white', padding: '2rem', textAlign: 'center' }}>
        <p>&copy; 2024 Nyooci - Shoe Care Service. All rights reserved.</p>
      </footer>
    </div>
  )
}
