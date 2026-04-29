const mongoose = require('mongoose');
const dns = require('dns');
// Paksa menggunakan DNS Google
dns.setServers(['8.8.8.8', '8.8.4.4']);

const Service = require('./models/Service');
const User = require('./models/User');
require('dotenv').config();

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

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      family: 4
    });
    console.log('Connected to MongoDB');

    await Service.deleteMany({});
    console.log('Services cleared');

    await Service.insertMany(seedServices);
    console.log('Services seeded successfully');

    const existingAdmin = await User.findOne({ email: seedAdmin.email });
    if (!existingAdmin) {
      await User.create(seedAdmin);
      console.log('Admin user created: admin@nyooci.com / admin123');
    } else {
      console.log('Admin user already exists');
    }

    console.log('Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 TIPS:');
      console.log('1. Pastikan koneksi internet Anda stabil.');
      console.log('2. Pastikan IP Address Anda sudah di-whitelist di MongoDB Atlas (Network Access).');
      console.log('3. Periksa apakah MONGODB_URI di file .env sudah benar.');
      console.log('4. Jika ingin menggunakan database lokal, ganti MONGODB_URI di .env menjadi: mongodb://127.0.0.1:27017/nyooci');
    }
    process.exit(1);
  }
}

seed();
