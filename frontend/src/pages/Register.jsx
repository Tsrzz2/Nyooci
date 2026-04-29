import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', address: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState({})
  const { register } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError({ ...error, [e.target.name]: '' })
  }

  const validate = () => {
    const err = {}
    if (!form.name) err.name = 'Nama harus diisi'
    if (!form.email) err.email = 'Email harus diisi'
    if (!form.password) err.password = 'Password harus diisi'
    else if (form.password.length < 6) err.password = 'Password minimal 6 karakter'
    if (form.password !== form.confirmPassword) err.confirmPassword = 'Password tidak cocok'
    return err
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (Object.keys(err).length) {
      setError(err)
      return
    }
    setLoading(true)
    try {
      console.log('Sending registration data:', { ...form, password: '***', confirmPassword: '***' });
      await register({ name: form.name, email: form.email, password: form.password, phone: form.phone, address: form.address })
      showToast('Registrasi berhasil!', 'success')
      navigate('/dashboard')
    } catch (err) {
      showToast(err.response?.data?.message || 'Registrasi gagal', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="card" style={{ padding: '2rem', width: '100%', maxWidth: '450px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', textAlign: 'center', marginBottom: '0.5rem' }}>
          Daftar di Nyooci
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--gray)', marginBottom: '2rem' }}>
          Buat akun baru untuk memulai
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Lengkap</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className={error.name ? 'input-error' : ''} placeholder="John Doe" />
            {error.name && <p className="error-message">{error.name}</p>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className={error.email ? 'input-error' : ''} placeholder="email@example.com" />
            {error.email && <p className="error-message">{error.email}</p>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className={error.password ? 'input-error' : ''} placeholder="Min. 6 karakter" />
            {error.password && <p className="error-message">{error.password}</p>}
          </div>
          <div className="form-group">
            <label>Konfirmasi Password</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className={error.confirmPassword ? 'input-error' : ''} placeholder="Ulangi password" />
            {error.confirmPassword && <p className="error-message">{error.confirmPassword}</p>}
          </div>
          <div className="form-group">
            <label>No. Telepon (opsional)</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="081234567890" />
          </div>
          <div className="form-group">
            <label>Alamat (opsional)</label>
            <textarea name="address" value={form.address} onChange={handleChange} rows={2} placeholder="Jl. Sudirman No. 123" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Loading...' : 'Daftar'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--gray)' }}>
          Sudah punya akun? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
        </p>
      </div>
    </div>
  )
}
