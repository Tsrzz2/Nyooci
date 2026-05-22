import { useEffect, useState } from 'react'
import { serviceAPI, bookingAPI, authAPI } from '../utils/api'
import { useToast } from '../context/ToastContext'

export default function AdminDashboard() {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({ totalBookings: 0, totalRevenue: 0, stats: [] })
  const [bookings, setBookings] = useState([])
  const [services, setServices] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = () => {
    setLoading(true)
    if (activeTab === 'dashboard') {
      bookingAPI.getStats()
        .then(res => setStats(res.data.data))
        .catch(console.error)
    }
    if (activeTab === 'bookings') {
      bookingAPI.getAll()
        .then(res => setBookings(res.data.data))
        .catch(console.error)
    }
    if (activeTab === 'services') {
      serviceAPI.getAll()
        .then(res => setServices(res.data.data))
        .catch(console.error)
    }
    if (activeTab === 'users') {
      authAPI.getAllUsers()
        .then(res => setUsers(res.data.data))
        .catch(console.error)
    }
    setLoading(false)
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      await bookingAPI.updateStatus(id, { status })
      showToast('Status berhasil diperbarui', 'success')
      loadData()
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal memperbarui status', 'error')
    }
  }

  const handleDeleteBooking = async (id) => {
    if (!confirm('Yakin ingin menghapus booking ini?')) return
    try {
      await bookingAPI.delete(id)
      showToast('Booking berhasil dihapus', 'success')
      loadData()
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menghapus', 'error')
    }
  }

  const handleAddService = async (e) => {
    e.preventDefault()
    const form = e.target
    const data = {
      name: form.name.value,
      description: form.description.value,
      category: form.category.value,
      price: parseFloat(form.price.value),
      duration: parseInt(form.duration.value),
      image: form.image.value
    }
    try {
      await serviceAPI.create(data)
      showToast('Layanan berhasil ditambahkan', 'success')
      form.reset()
      loadData()
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menambahkan', 'error')
    }
  }

  const handleDeleteService = async (id) => {
    if (!confirm('Yakin ingin menghapus layanan ini?')) return
    try {
      await serviceAPI.delete(id)
      showToast('Layanan berhasil dihapus', 'success')
      loadData()
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menghapus', 'error')
    }
  }

  const statusBadge = (status) => {
    const badges = {
      pending: 'badge-pending',
      confirmed: 'badge-confirmed',
      processing: 'badge-processing',
      completed: 'badge-completed',
      cancelled: 'badge-cancelled'
    }
    return badges[status] || ''
  }

  return (
    <div className="container">
      <h1 className="page-title">Admin Dashboard</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {['dashboard', 'bookings', 'services', 'users'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-outline'}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Bookings</div>
              <div className="stat-value">{stats.totalBookings}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Revenue</div>
              <div className="stat-value">Rp {(stats.totalRevenue || 0).toLocaleString('id-ID')}</div>
            </div>
            {stats.stats?.map(s => (
              <div key={s._id} className="stat-card">
                <div className="stat-label">{s._id}</div>
                <div className="stat-value">{s.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div>
          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : (
            <div className="card" style={{ overflow: 'hidden' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Layanan</th>
                    <th>Sepatu</th>
                    <th>Pickup</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking._id}>
                      <td>
                        <div style={{ fontWeight: '500' }}>{booking.user?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{booking.user?.email}</div>
                      </td>
                      <td>{booking.service?.name}</td>
                      <td>{booking.shoeType}</td>
                      <td>
                        <div>{new Date(booking.pickupDate).toLocaleDateString('id-ID')}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{booking.pickupTime}</div>
                      </td>
                      <td>
                        <select value={booking.status} onChange={(e) => handleUpdateStatus(booking._id, e.target.value)} className={statusBadge(booking.status)} style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)' }}>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td style={{ fontWeight: '600' }}>Rp {booking.totalPrice?.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'services' && (
        <div>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Tambah Layanan Baru</h3>
            <form onSubmit={handleAddService} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <input name="name" placeholder="Nama Layanan" required />
              <select name="category" required>
                <option value="">Pilih Kategori</option>
                <option value="cleaning">Cleaning</option>
                <option value="repair">Repair</option>
                <option value="repaint">Repaint</option>
                <option value="polishing">Polishing</option>
                <option value="hydration">Hydration</option>
                <option value="other">Other</option>
              </select>
              <input name="price" type="number" placeholder="Harga" required />
              <input name="duration" type="number" placeholder="Durasi (jam)" required />
              <input name="image" placeholder="URL Gambar" />
              <input name="description" placeholder="Deskripsi" />
              <button type="submit" className="btn btn-primary">Tambah</button>
            </form>
          </div>

          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : (
            <div className="grid grid-3">
              {services.map(service => (
                <div key={service._id} className="card" style={{ overflow: 'hidden' }}>
                  {service.image && <img src={service.image} alt={service.name} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />}
                  <div style={{ padding: '1rem' }}>
                    <h3>{service.name}</h3>
                    <span className="badge" style={{ background: 'var(--primary)', color: 'white' }}>{service.category}</span>
                    <p style={{ color: 'var(--gray)', fontSize: '0.875rem', margin: '0.5rem 0' }}>{service.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '700', color: 'var(--primary)' }}>Rp {service.price.toLocaleString('id-ID')}</span>
                      <button onClick={() => handleDeleteService(service._id)} className="btn btn-danger btn-sm">Hapus</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : (
            <div className="card" style={{ overflow: 'hidden' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Daftar</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: '500' }}>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className={`badge ${u.role === 'admin' ? 'badge-confirmed' : 'badge-pending'}`}>{u.role}</span></td>
                      <td><span className={`badge ${u.isActive ? 'badge-completed' : 'badge-cancelled'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td>{new Date(u.createdAt).toLocaleDateString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
