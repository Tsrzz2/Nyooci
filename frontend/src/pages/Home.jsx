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
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
        color: 'white',
        padding: '5rem 2rem',
        textAlign: 'center',
        borderRadius: '0 0 3rem 3rem'
      }}>
        <img src="/logo.png" alt="Nyooci Logo" style={{ height: '180px', width: 'auto', marginBottom: '1.5rem', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))' }} />
        <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1rem' }}>
          Shoe Care Service Premium
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
         rawat sepatu kesayanganmu dengan layanan terbaik
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/services" className="btn" style={{ background: 'white', color: 'var(--primary)' }}>
            Lihat Layanan
          </Link>
          <Link to="/register" className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>
            Daftar Sekarang
          </Link>
        </div>
      </section>

      <section style={{ padding: '4rem 2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', textAlign: 'center', marginBottom: '3rem' }}>
          Mengapa Nyooci?
        </h2>
        <div className="grid grid-3 container" style={{ margin: '0 auto' }}>
          {[
            { icon: '✨', title: 'Premium Quality', desc: 'Menggunakan bahan berkualitas tinggi untuk hasil terbaik' },
            { icon: '🚚', title: 'Pickup & Delivery', desc: 'Layanan jemput dan antar sepatu ke lokasi kamu' },
            { icon: '⏱️', title: 'Cepat & Tepat', desc: 'Proses cepat dengan hasil yang memuaskan' }
          ].map((item, i) => (
            <div key={i} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{item.icon}</div>
              <h3 style={{ marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--gray)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '4rem 2rem', background: 'var(--light)' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', textAlign: 'center', marginBottom: '3rem' }}>
          Layanan Kami
        </h2>
        <div className="grid grid-3 container" style={{ margin: '0 auto' }}>
          {services.map(service => (
            <div key={service._id} className="card" style={{ overflow: 'hidden' }}>
              {service.image && (
                <img src={service.image} alt={service.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
              )}
              <div style={{ padding: '1.5rem' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  background: 'var(--primary)',
                  color: 'white',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase'
                }}>
                  {service.category}
                </span>
                <h3 style={{ marginBottom: '0.5rem' }}>{service.name}</h3>
                <p style={{ color: 'var(--gray)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {service.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '700', color: 'var(--primary)' }}>
                    Rp {service.price.toLocaleString('id-ID')}
                  </span>
                  <Link to={`/booking/${service._id}`} className="btn btn-primary btn-sm">
                    Booking
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/services" className="btn btn-outline">Lihat Semua Layanan</Link>
        </div>
      </section>

      <section style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>
          Siap Merawat Sepatu Kamu?
        </h2>
        <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>
          Daftar sekarang dan dapatkan berbagai promo menarik
        </p>
        <Link to="/register" className="btn btn-primary">Daftar Gratis</Link>
      </section>
    </div>
  )
}
