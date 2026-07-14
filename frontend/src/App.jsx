import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Services from './pages/Services'
import Tentang from './pages/Tentang'
import Lokasi from './pages/Lokasi'
import Promo from './pages/Promo'
import Booking from './pages/Booking'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="tentang" element={<Tentang />} />
              <Route path="services" element={<Services />} />
              <Route path="lokasi" element={<Lokasi />} />
              <Route path="promo" element={<Promo />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="booking/:serviceId" element={
                <ProtectedRoute><Booking /></ProtectedRoute>
              } />
              <Route path="dashboard" element={
                <ProtectedRoute><UserDashboard /></ProtectedRoute>
              } />
              <Route path="admin" element={
                <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
              } />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
