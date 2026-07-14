import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState({})
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError({ ...error, [e.target.name]: '' })
  }

  const validate = () => {
    const err = {}
    if (!form.email) err.email = 'Email harus diisi'
    if (!form.password) err.password = 'Password harus diisi'
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
      const res = await login(form.email, form.password)
      showToast('Login berhasil!', 'success')
      if (res.user?.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Login gagal', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="card" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', textAlign: 'center', marginBottom: '0.5rem' }}>
          Login ke Nyooci
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--gray)', marginBottom: '2rem' }}>
          Selamat datang kembali!
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={error.email ? 'input-error' : ''}
              placeholder="email@example.com"
            />
            {error.email && <p className="error-message">{error.email}</p>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={error.password ? 'input-error' : ''}
              placeholder="••••••••"
            />
            {error.password && <p className="error-message">{error.password}</p>}
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--gray)' }}>
          Belum punya akun? <Link to="/register" style={{ color: 'var(--primary)' }}>Daftar</Link>
        </p>
      </div>
    </div>
  )
}
