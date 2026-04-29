import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { serviceAPI, bookingAPI } from '../utils/api'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'

export default function Booking() {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { user } = useAuth()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    shoeType: '',
    shoeColor: '',
    description: '',
    pickupAddress: user?.address || '',
    pickupDate: '',
    pickupTime: ''
  })
  const [error, setError] = useState({})

  useEffect(() => {
    serviceAPI.getById(serviceId)
      .then(res => setService(res.data.data))
      .catch(() => {
        showToast('Layanan tidak ditemukan', 'error')
        navigate('/services')
      })
      .finally(() => setLoading(false))

    if (user?.address && !form.pickupAddress) {
      setForm(prev => ({ ...prev, pickupAddress: user.address }))
    }
  }, [serviceId, user])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError({ ...error, [e.target.name]: '' })
  }

  const validate = () => {
    const err = {}
    if (!form.shoeType) err.shoeType = 'Jenis sepatu harus diisi'
    if (!form.pickupAddress) err.pickupAddress = 'Alamat pickup harus diisi'
    if (!form.pickupDate) err.pickupDate = 'Tanggal pickup harus diisi'
    if (!form.pickupTime) err.pickupTime = 'Waktu pickup harus diisi'
    return err
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (Object.keys(err).length) {
      setError(err)
      return
    }
    setSubmitting(true)
    try {
      await bookingAPI.create({ ...form, service: serviceId })
      showToast('Booking berhasil! Kami akan segera menghubungi Anda.', 'success')
      navigate('/dashboard')
    } catch (err) {
      showToast(err.response?.data?.message || 'Booking gagal', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>
  }

  if (!service) {
    return null
  }

  return (
    <div className="container">
      <h1 className="page-title">Booking Layanan</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          {service.image && (
            <img src={service.image} alt={service.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1.5rem' }} />
          )}
          <h2 style={{ marginBottom: '0.5rem' }}>{service.name}</h2>
          <p style={{ color: 'var(--gray)', marginBottom: '1rem' }}>{service.description}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ color: 'var(--gray)', fontSize: '0.875rem' }}>Harga</div>
              <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1.25rem' }}>Rp {service.price.toLocaleString('id-ID')}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--gray)', fontSize: '0.875rem' }}>Durasi</div>
              <div style={{ fontWeight: '600' }}>~{service.duration} jam</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Form Booking</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Jenis Sepatu *</label>
              <input type="text" name="shoeType" value={form.shoeType} onChange={handleChange} className={error.shoeType ? 'input-error' : ''} placeholder="Contoh: Nike Air Max, Adidas Ultraboost" />
              {error.shoeType && <p className="error-message">{error.shoeType}</p>}
            </div>
            <div className="form-group">
              <label>Warna Sepatu</label>
              <input type="text" name="shoeColor" value={form.shoeColor} onChange={handleChange} placeholder="Contoh: White/Black, Red" />
            </div>
            <div className="form-group">
              <label>Deskripsi Masalah</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={2} placeholder="Jelaskan kondisi atau masalah sepatu Anda" />
            </div>
            <div className="form-group">
              <label>Alamat Pickup *</label>
              <textarea name="pickupAddress" value={form.pickupAddress} onChange={handleChange} className={error.pickupAddress ? 'input-error' : ''} rows={2} placeholder="Masukkan alamat lengkap untuk penjemputan" />
              {error.pickupAddress && <p className="error-message">{error.pickupAddress}</p>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Tanggal Pickup *</label>
                <input type="date" name="pickupDate" value={form.pickupDate} onChange={handleChange} className={error.pickupDate ? 'input-error' : ''} min={new Date().toISOString().split('T')[0]} />
                {error.pickupDate && <p className="error-message">{error.pickupDate}</p>}
              </div>
              <div className="form-group">
                <label>Waktu Pickup *</label>
                <select name="pickupTime" value={form.pickupTime} onChange={handleChange} className={error.pickupTime ? 'input-error' : ''}>
                  <option value="">Pilih waktu</option>
                  <option value="08:00 - 10:00">08:00 - 10:00</option>
                  <option value="10:00 - 12:00">10:00 - 12:00</option>
                  <option value="13:00 - 15:00">13:00 - 15:00</option>
                  <option value="15:00 - 17:00">15:00 - 17:00</option>
                </select>
                {error.pickupTime && <p className="error-message">{error.pickupTime}</p>}
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? 'Memproses...' : 'Konfirmasi Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
