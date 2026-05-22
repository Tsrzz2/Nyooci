require('dotenv').config();
const dns = require('dns');

// Hanya gunakan DNS Google di lingkungan lokal jika ada masalah
if (process.env.NODE_ENV !== 'production') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (e) {
    console.log('Gagal mengatur DNS server:', e.message);
  }
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Health check untuk Vercel
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://res.cloudinary.com"],
      connectSrc: ["'self'", "https://api.cloudinary.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Middleware untuk log request body (untuk debugging)
app.use((req, res, next) => {
  if (req.path.includes('auth')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Nyooci API - Shoe Care Service',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend Nyooci berhasil berjalan!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route tidak ditemukan'
  });
});

// Koneksi database untuk lingkungan Vercel
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI tidak ditemukan di Environment Variables');
}

if (process.env.NODE_ENV !== 'production') {
  mongoose.connect(process.env.MONGODB_URI || '', {
    family: 4,
    connectTimeoutMS: 10000,
  })
    .then(() => {
      console.log('✅ Berhasil konek ke MongoDB');
    })
    .catch(err => {
      console.error('❌ Gagal konek ke MongoDB:', err.message);
    });
} else {
  // Di produksi (Vercel), kita konek tanpa menunggu listen
  mongoose.connect(process.env.MONGODB_URI || '', {
    connectTimeoutMS: 10000,
  }).catch(err => console.error('MongoDB connection error:', err));
}

module.exports = app;
