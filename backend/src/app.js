require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const financialRoutes = require('./routes/financialRoutes');
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
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
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

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/financial', financialRoutes);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route tidak ditemukan'
  });
});

// Function to connect to MongoDB
async function connectDB() {
  let mongoUri = process.env.MONGODB_URI;

  try {
    if (!mongoUri) {
      console.warn('⚠️ MONGODB_URI tidak ditemukan - running without database');
      return;
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Berhasil konek ke MongoDB');
  } catch (err) {
    console.error('❌ Gagal konek ke MongoDB:', err.message);
  }
}

// Function to seed initial data
async function seedInitialData() {
  const Service = require('./models/Service');
  const User = require('./models/User');

  const seedServices = [
    {
      name: 'Deep Cleaning',
      description: 'Pembersihan menyeluruh untuk menghilangkan noda, debu, dan bakteri pada sepatu.',
      category: 'cleaning',
      price: 35000,
      duration: 24,
      image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400',
      order: 1
    },
    {
      name: 'Premium Cleaning',
      description: 'Pembersihan premium dengan treatment khusus untuk材质 sepatu yang sensitif.',
      category: 'cleaning',
      price: 55000,
      duration: 24,
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
      order: 2
    },
    {
      name: 'Leather Repair',
      description: 'Perbaikan kerusakan pada sepatu kulit seperti sobek, pecah, atau looseness.',
      category: 'repair',
      price: 75000,
      duration: 48,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      order: 3
    },
    {
      name: 'Sole Replacement',
      description: 'Penggantian sol sepatu yang aus atau rusak dengan sol berkualitas tinggi.',
      category: 'repair',
      price: 120000,
      duration: 72,
      image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400',
      order: 4
    },
    {
      name: 'Color Restoration',
      description: 'Mengembalikan warna asli sepatu yang pudar atau rusak akibat pemakaian.',
      category: 'repaint',
      price: 85000,
      duration: 48,
      image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400',
      order: 5
    },
    {
      name: 'Custom Painting',
      description: 'Mengecat sepatu dengan desain custom sesuai keinginan pelanggan.',
      category: 'repaint',
      price: 150000,
      duration: 72,
      image: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=400',
      order: 6
    },
    {
      name: 'High Shine Polishing',
      description: 'Poles high-shine untuk memberikan kilau maksimal pada sepatu kulit.',
      category: 'polishing',
      price: 25000,
      duration: 12,
      image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400',
      order: 7
    },
    {
      name: 'Premium Polishing',
      description: 'Poles premium dengan menggunakan bahan berkualitas tinggi.',
      category: 'polishing',
      price: 45000,
      duration: 24,
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
      order: 8
    },
    {
      name: 'Leather Hydration',
      description: 'Treatment moisturizing untuk menjaga kelembutan dan elastisitas kulit sepatu.',
      category: 'hydration',
      price: 50000,
      duration: 24,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
      order: 9
    },
    {
      name: 'Crease Prevention',
      description: 'Treatment anti-crease untuk mencegah dan mengurangi lipatan pada toe box.',
      category: 'hydration',
      price: 30000,
      duration: 12,
      image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400',
      order: 10
    }
  ];

  const seedAdmin = {
    name: 'Admin Nyooci',
    email: 'admin@nyooci.com',
    password: 'admin123',
    phone: '081234567890',
    address: 'Jl. Sudirman No. 123, Jakarta',
    role: 'admin'
  };

  try {
    await Service.deleteMany({});
    await Service.insertMany(seedServices);
    console.log('✅ Layanan berhasil di-seed');

    const existingAdmin = await User.findOne({ email: seedAdmin.email });
    if (!existingAdmin) {
      await User.create(seedAdmin);
      console.log('✅ Admin berhasil dibuat: admin@nyooci.com / admin123');
    }
  } catch (err) {
    console.error('❌ Gagal seed data:', err.message);
  }
}

// Connect to DB
connectDB();

module.exports = app;
