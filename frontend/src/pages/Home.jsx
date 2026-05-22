import { Link } from 'react-router-dom'
import { serviceAPI } from '../utils/api'
import { useEffect, useState } from 'react'

export default function Home() {
  const [services, setServices] = useState([])

  useEffect(() => {
    serviceAPI.getAll({ active: 'true' })
      .then(res => setServices(res.data.data.slice(0, 6)))
      .catch(console.error)
  }, [])

  return (
    <div>
      <section style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1461896756985-237d6580bd0d?q=80&w=2070&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '0 1rem'
      }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <p style={{ color: 'var(--primary)', fontWeight: '700', letter-spacing: '2px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            — PREMIUM SHOE CARE SINCE 2013
          </p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: '900', marginBottom: '1.5rem', lineHeight: '1.1', textTransform: 'uppercase' }}>
            CUCI SEPATU PREMIUM BERGARANSI
          </h1>
          <p style={{ fontSize: '1.125rem', marginBottom: '2.5rem', maxWidth: '800px', marginInline: 'auto', opacity: 0.9 }}>
            Lebih dari sekadar cuci sepatu — kami merawat, melindungi, dan mengembalikan tampilan sepatu kesayanganmu agar awet, bersih, dan nyaman dipakai.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/services" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
              Gunakan Layanan Sekarang
            </Link>
            <Link to="/booking" className="btn btn-outline" style={{ padding: '1rem 2rem' }}>
              Antar Jemput
            </Link>
          </div>
        </div>
        
        {/* Floating Chat Icon Placeholder */}
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'var(--secondary)',
          color: 'white',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          boxShadow: '0 10px 15px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          zIndex: 1000,
          border: '1px solid var(--border)'
        }}>
          💬
        </div>
      </section>

      <section style={{ padding: '6rem 2rem', background: '#fff' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', textAlign: 'center', marginBottom: '4rem', textTransform: 'uppercase' }}>
            Layanan Kami
          </h2>
          <div className="grid grid-3">
            {services.map(service => (
              <div key={service._id} className="card" style={{ border: 'none', boxShadow: 'none' }}>
                {service.image && (
                  <img src={service.image} alt={service.name} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                )}
                <div style={{ padding: '1.5rem 0' }}>
                  <div style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    {service.category}
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem' }}>{service.name}</h3>
                  <p style={{ color: 'var(--gray)', marginBottom: '1.5rem' }}>{service.description}</p>
                  <Link to={`/booking/${service._id}`} style={{ fontWeight: '700', color: 'var(--dark)', borderBottom: '2px solid var(--primary)', paddingBottom: '2px' }}>
                    LIHAT DETAIL
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
