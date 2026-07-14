import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const WHATSAPP_NUMBER = '62882007476292' // Ganti dengan nomor WhatsApp Anda

export default function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            <img src="/logo.png" alt="Nyooci Logo" style={{ height: '60px', width: 'auto' }} />
          </Link>
          <div className="navbar-links">
            <Link to="/" className={isActive('/') ? 'active' : ''}>Beranda</Link>
            <Link to="/tentang" className={isActive('/tentang') ? 'active' : ''}>Tentang</Link>
            <Link to="/services" className={isActive('/services') ? 'active' : ''}>Layanan</Link>
            <Link to="/lokasi" className={isActive('/lokasi') ? 'active' : ''}>Lokasi</Link>
            <Link to="/promo" className={isActive('/promo') ? 'active' : ''}>Promo</Link>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {user ? (
              <>
                <Link 
                  to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                  className="btn btn-primary btn-sm"
                >
                  Dashboard
                </Link>
                <button onClick={logout} className="btn btn-outline btn-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: '#fff', fontWeight: '600' }}>Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Daftar</Link>
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
      {/* Floating WhatsApp Icon */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Nyooci!%20Saya%20membutuhkan%20bantuan.`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: '#25D366',
          color: 'white',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.75rem',
          boxShadow: '0 10px 15px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          zIndex: 1000,
          textDecoration: 'none'
        }}
      >
        💬
      </a>
    </div>
  )
}
