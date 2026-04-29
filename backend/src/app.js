require('dotenv').config();
const dns = require('dns');
// Paksa menggunakan DNS Google untuk mengatasi ECONNREFUSED pada record SRV
dns.setServers(['8.8.8.8', '8.8.4.4']);

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

app.use(helmet());
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

// Koneksi database untuk lingkungan Vercel (tanpa app.listen)
if (process.env.NODE_ENV !== 'production') {
  mongoose.connect(process.env.MONGODB_URI, {
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
  mongoose.connect(process.env.MONGODB_URI, {
    connectTimeoutMS: 10000,
  });
}

module.exports = app;
