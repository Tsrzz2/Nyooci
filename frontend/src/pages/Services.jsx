import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { serviceAPI } from '../utils/api'

const WHATSAPP_NUMBER = '62882007476292' // Ganti dengan nomor WhatsApp Anda

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')

  const categories = [
    { value: '', label: 'Semua' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'repair', label: 'Repair' },
    { value: 'repaint', label: 'Repaint' },
    { value: 'polishing', label: 'Polishing' },
    { value: 'hydration', label: 'Hydration' }
  ]

  useEffect(() => {
    setLoading(true)
    const params = category ? { category, active: 'true' } : { active: 'true' }
    serviceAPI.getAll(params)
      .then(res => setServices(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [category])

  return (
    <div className="container">
      <h1 className="page-title">Layanan Kami</h1>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`btn ${category === cat.value ? 'btn-primary' : 'btn-outline'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : services.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--gray)' }}>Tidak ada layanan dalam kategori ini</p>
        </div>
      ) : (
        <div className="grid grid-3">
          {services.map(service => (
            <div key={service._id} className="card" style={{ overflow: 'hidden' }}>
              {service.image && (
                <img src={service.image} alt={service.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              )}
              <div style={{ padding: '1.5rem' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  background: 'var(--primary)',
                  color: 'white',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase'
                }}>
                  {service.category}
                </span>
                <h3 style={{ marginBottom: '0.5rem' }}>{service.name}</h3>
                <p style={{ color: 'var(--gray)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {service.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1.25rem' }}>
                      Rp {service.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div style={{ color: 'var(--gray)', fontSize: '0.875rem' }}>
                    ⏱️ ~{service.duration} jam
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                  <Link to={`/booking/${service._id}`} className="btn btn-primary" style={{ flex: 1 }}>
                    Booking Sekarang
                  </Link>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Nyooci!%20Saya%20ingin%20memesan%20layanan%20${encodeURIComponent(service.name)}%20dengan%20harga%20Rp%20${service.price.toLocaleString('id-ID')}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{ flex: 1, background: '#25D366', color: 'white' }}
                  >
                    Pesan via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
