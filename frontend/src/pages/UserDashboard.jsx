import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { bookingAPI, authAPI } from '../utils/api'

const WHATSAPP_NUMBER = '62882007476292' // Ganti dengan nomor WhatsApp Anda

export default function UserDashboard() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('bookings')
  const [profile, setProfile] = useState({ name: '', phone: '', address: '' })
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    loadBookings()
    if (user) {
      setProfile({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      })
    }
  }, [statusFilter, user])

  const loadBookings = () => {
    setLoading(true)
    const params = statusFilter ? { status: statusFilter } : {}
    bookingAPI.getMyBookings(params)
      .then(res => setBookings(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const handleCancelBooking = async (id) => {
    if (!confirm('Apakah Anda yakin ingin membatalkan booking ini?')) return
    try {
      await bookingAPI.cancel(id, 'Dibatalkan oleh user')
      showToast('Booking berhasil dibatalkan', 'success')
      loadBookings()
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal membatalkan', 'error')
    }
  }

  const handleReview = async (id) => {
    const rating = prompt('Berikan rating (1-5):')
    if (!rating || rating < 1 || rating > 5) {
      showToast('Rating harus antara 1-5', 'error')
      return
    }
    const review = prompt('Tulis review Anda (opsional):') || ''
    try {
      await bookingAPI.review(id, { rating: parseInt(rating), review })
      showToast('Review berhasil dikirim', 'success')
      loadBookings()
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal mengirim review', 'error')
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      await authAPI.updateProfile(profile)
      showToast('Profil berhasil diperbarui', 'success')
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal memperbarui profil', 'error')
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('Password baru tidak cocok', 'error')
      return
    }
    try {
      await authAPI.changePassword({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword })
      showToast('Password berhasil diubah', 'success')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal mengubah password', 'error')
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
      <h1 className="page-title">User Dashboard</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => setActiveTab('bookings')} className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-outline'}`}>
          Bookings
        </button>
        <button onClick={() => setActiveTab('profile')} className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline'}`}>
          Profil
        </button>
        <button onClick={() => setActiveTab('password')} className={`btn ${activeTab === 'password' ? 'btn-primary' : 'btn-outline'}`}>
          Ubah Password
        </button>
      </div>

      {activeTab === 'bookings' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Riwayat Bookings</h2>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : bookings.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--gray)', marginBottom: '1rem' }}>Belum ada booking</p>
              <Link to="/services" className="btn btn-primary">Buat Booking Baru</Link>
            </div>
          ) : (
            <div className="card" style={{ overflow: 'hidden' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Layanan</th>
                    <th>Sepatu</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Hubungi</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking._id}>
                      <td>
                        <div style={{ fontWeight: '500' }}>{booking.service?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{booking.service?.category}</div>
                      </td>
                      <td>
                        <div>{booking.shoeType}</div>
                        {booking.shoeColor && <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{booking.shoeColor}</div>}
                      </td>
                      <td>
                        <div>{new Date(booking.pickupDate).toLocaleDateString('id-ID')}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{booking.pickupTime}</div>
                      </td>
                      <td><span className={`badge ${statusBadge(booking.status)}`}>{booking.status}</span></td>
                      <td style={{ fontWeight: '600' }}>Rp {booking.totalPrice?.toLocaleString('id-ID')}</td>
                      <td>
                        <a
                          href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Nyooci!%20Saya%20ingin%20bertanya%20tentang%20booking%20layanan%20${encodeURIComponent(booking.service?.name)}%20dengan%20ID%20${booking._id}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: '#25D366',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            textDecoration: 'none',
                            fontSize: '0.875rem'
                          }}
                        >
                          Chat WA
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="card" style={{ padding: '2rem', maxWidth: '500px' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Edit Profil</h2>
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Nama</label>
              <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={user?.email || ''} disabled />
            </div>
            <div className="form-group">
              <label>No. Telepon</label>
              <input type="text" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Alamat</label>
              <textarea rows={3} value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
          </form>
        </div>
      )}

      {activeTab === 'password' && (
        <div className="card" style={{ padding: '2rem', maxWidth: '500px' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Ubah Password</h2>
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Password Saat Ini</label>
              <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Password Baru</label>
              <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Konfirmasi Password Baru</label>
              <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary">Ubah Password</button>
          </form>
        </div>
      )}
    </div>
  )
}
