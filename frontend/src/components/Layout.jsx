import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <div>
      <div className="top-banner">
        BERGABUNG DENGAN MEMBERSHIP NYOOCI. DAPATKAN 5000 POIN. — <span>BERGABUNG</span>
      </div>
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            <img src="/logo.png" alt="Nyooci Logo" style={{ height: '60px', width: 'auto' }} />
          </Link>
          <div className="navbar-links">
            <Link to="/" className={isActive('/') ? 'active' : ''}>Beranda</Link>
            <Link to="/tentang">Tentang</Link>
            <Link to="/services">Layanan</Link>
            <Link to="/lokasi">Lokasi</Link>
            <Link to="/promo">Promo</Link>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn-primary btn-sm">Dashboard</Link>
                <button onClick={logout} className="btn btn-outline btn-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: '#fff', fontWeight: '600' }}>Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Daftar Menu ▾</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main style={{ minHeight: '100vh' }}>
        <Outlet />
      </main>
      <footer style={{ background: 'var(--dark)', color: 'white', padding: '4rem 2rem', textAlign: 'center' }}>
        <div className="container">
          <img src="/logo.png" alt="Nyooci Logo" style={{ height: '80px', width: 'auto', marginBottom: '2rem' }} />
          <p style={{ color: 'var(--gray)', marginBottom: '1rem' }}>&copy; 2024 Nyooci - Shoe Care Service. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
