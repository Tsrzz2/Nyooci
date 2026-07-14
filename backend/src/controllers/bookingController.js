const Booking = require('../models/Booking');
const Service = require('../models/Service');
const cache = require('memory-cache');
const fetch = require('node-fetch');

// Mock data storage
let mockBookings = [];
let nextBookingId = 1;

// Mock services lookup (copy from serviceController)
const mockServices = [
  { _id: '1', name: 'Cuci Sepatu Basic', price: 25000, isActive: true },
  { _id: '2', name: 'Cuci Sepatu Premium', price: 45000, isActive: true },
  { _id: '3', name: 'Deep Cleaning', price: 60000, isActive: true },
  { _id: '4', name: 'Repair Sol Sepatu', price: 75000, isActive: true },
  { _id: '5', name: 'Polishing Sepatu Kulit', price: 35000, isActive: true },
  { _id: '6', name: 'Repaint Sepatu', price: 100000, isActive: true },
  { _id: '7', name: 'Hydration Kulit Sepatu', price: 50000, isActive: true }
];

// Function to write booking to SheetDB
async function writeBookingToSheet(booking, user) {
  if (!process.env.SHEETDB_URL) {
    console.log('ℹ️ SHEETDB_URL tidak di-set, tidak mengirim ke sheet');
    return;
  }

  try {
    // Format sesuai SheetDB docs: { data: [ { ... } ] }
    const sheetData = {
      data: [
        {
          'ID Booking': booking._id,
          'Nama Pelanggan': user?.name || 'Tidak Diketahui',
          'Layanan': booking.service?.name || booking.service,
          'Harga': booking.totalPrice,
          'Tanggal Booking': new Date(booking.createdAt).toLocaleDateString('id-ID'),
          'Status': booking.status,
          'Jenis Sepatu': booking.shoeType || '-',
          'Alamat Pickup': booking.pickupAddress || '-',
          'Tanggal Pickup': booking.pickupDate || '-'
        }
      ]
    };

    console.log('📤 Mengirim ke SheetDB:', JSON.stringify(sheetData, null, 2));

    const response = await fetch(process.env.SHEETDB_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sheetData)
    });

    const result = await response.json();
    console.log('📥 Response dari SheetDB:', result);

    if (response.ok) {
      console.log('✅ Booking berhasil ditulis ke SheetDB');
    } else {
      console.log('❌ Gagal menulis ke SheetDB:', result);
    }
  } catch (err) {
    console.error('❌ Error saat menulis ke SheetDB:', err.message);
  }
}

exports.createBooking = async (req, res, next) => {
  try {
    // Find service from mock or DB
    let service;
    try {
      service = await Service.findById(req.body.service);
    } catch (err) {
      service = mockServices.find(s => s._id === req.body.service);
    }

    if (!service || !service.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Layanan tidak valid atau tidak tersedia'
      });
    }

    // Create booking in mock or DB
    let booking;
    try {
      booking = await Booking.create({
        ...req.body,
        user: req.user._id,
        totalPrice: service.price
      });
      await booking.populate('service');
    } catch (err) {
      // Use mock booking
      booking = {
        _id: nextBookingId.toString(),
        ...req.body,
        user: req.user._id,
        totalPrice: service.price,
        status: 'pending',
        service: service,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockBookings.push(booking);
      nextBookingId++;
    }

    cache.clear(); // Clear all cache when a new booking is created

    // Write to SheetDB
    await writeBookingToSheet(booking, req.user);

    res.status(201).json({
      success: true,
      message: 'Booking berhasil dibuat',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const cacheKey = `my-bookings-${req.user._id}-${status || 'all'}`;
    let cachedBookings = cache.get(cacheKey);
    
    if (cachedBookings) {
      return res.json({
        success: true,
        data: cachedBookings
      });
    }
    
    let bookings;
    try {
      const filter = { user: req.user._id };
      if (status) filter.status = status;
      bookings = await Booking.find(filter)
        .populate('service')
        .sort('-createdAt');
    } catch (err) {
      // Use mock data
      bookings = mockBookings.filter(b => b.user === req.user._id);
      if (status) {
        bookings = bookings.filter(b => b.status === status);
      }
      bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    cache.put(cacheKey, bookings, 60000); // Cache for 60 seconds

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const cacheKey = `booking-${req.params.id}`;
    let cachedBooking = cache.get(cacheKey);
    
    if (cachedBooking) {
      return res.json({
        success: true,
        data: cachedBooking
      });
    }
    
    const booking = await Booking.findById(req.params.id)
      .populate('service')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking tidak ditemukan'
      });
    }

    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }
    cache.put(cacheKey, booking, 60000); // Cache for 60 seconds

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking tidak ditemukan'
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }

    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Booking tidak dapat dibatalkan'
      });
    }

    booking.status = 'cancelled';
    booking.notes = req.body.notes || 'Dibatalkan oleh user';
    await booking.save();
    cache.clear(); // Clear all cache

    res.json({
      success: true,
      message: 'Booking berhasil dibatalkan',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

exports.reviewBooking = async (req, res, next) => {
  try {
    const { rating, review } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking tidak ditemukan'
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Hanya booking yang sudah selesai dapat direview'
      });
    }

    booking.rating = rating;
    booking.review = review || '';
    await booking.save();
    cache.clear(); // Clear all cache

    res.json({
      success: true,
      message: 'Review berhasil dikirim',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const { status, userId, startDate, endDate } = req.query;
    const cacheKey = `all-bookings-${status || 'all'}-${userId || 'all'}-${startDate || 'all'}-${endDate || 'all'}`;
    let cachedBookings = cache.get(cacheKey);
    
    if (cachedBookings) {
      return res.json({
        success: true,
        data: cachedBookings
      });
    }
    
    let bookings;
    try {
      const filter = {};
      if (status) filter.status = status;
      if (userId) filter.user = userId;
      if (startDate || endDate) {
        filter.pickupDate = {};
        if (startDate) filter.pickupDate.$gte = new Date(startDate);
        if (endDate) filter.pickupDate.$lte = new Date(endDate);
      }

      bookings = await Booking.find(filter)
        .populate('service')
        .populate('user', 'name email phone')
        .sort('-createdAt');
    } catch (err) {
      // Use mock data
      bookings = [...mockBookings];
      if (status) bookings = bookings.filter(b => b.status === status);
      if (userId) bookings = bookings.filter(b => b.user === userId);
      // Add mock user data
      bookings = bookings.map(b => ({
        ...b,
        user: {
          _id: b.user,
          name: 'User Test',
          email: 'test@example.com',
          phone: '081234567890'
        }
      }));
      bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    cache.put(cacheKey, bookings, 60000); // Cache for 60 seconds

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status, notes, beforeImages, afterImages } = req.body;

    let booking;
    try {
      booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking tidak ditemukan' });
      }
      if (status) booking.status = status;
      if (notes) booking.notes = notes;
      if (beforeImages) booking.beforeImages = beforeImages;
      if (afterImages) booking.afterImages = afterImages;
      await booking.save();
      await booking.populate('service');
      await booking.populate('user', 'name email phone');
    } catch (err) {
      // Find in mock data
      booking = mockBookings.find(b => b._id === req.params.id);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking tidak ditemukan' });
      }
      if (status) booking.status = status;
      if (notes) booking.notes = notes;
      if (beforeImages) booking.beforeImages = beforeImages;
      if (afterImages) booking.afterImages = afterImages;
      booking.updatedAt = new Date();
      // Add mock user data
      booking = {
        ...booking,
        user: {
          _id: booking.user,
          name: 'User Test',
          email: 'test@example.com',
          phone: '081234567890'
        }
      };
    }

    cache.clear(); // Clear all cache

    res.json({
      success: true,
      message: 'Status booking berhasil diperbarui',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking tidak ditemukan'
      });
    }
    cache.clear(); // Clear all cache

    res.json({
      success: true,
      message: 'Booking berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};

exports.getMockBookings = () => mockBookings;

exports.getBookingStats = async (req, res, next) => {
  try {
    const cacheKey = 'booking-stats';
    let cachedStats = cache.get(cacheKey);
    
    if (cachedStats) {
      return res.json({
        success: true,
        data: cachedStats
      });
    }
    
    let stats;
    try {
      stats = await Booking.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalRevenue: { $sum: '$totalPrice' }
          }
        }
      ]);
    } catch (err) {
      // Calculate stats from mock data
      const statusGroups = {};
      mockBookings.forEach(b => {
        if (!statusGroups[b.status]) {
          statusGroups[b.status] = { count: 0, totalRevenue: 0 };
        }
        statusGroups[b.status].count++;
        statusGroups[b.status].totalRevenue += b.totalPrice;
      });
      stats = Object.entries(statusGroups).map(([status, data]) => ({
        _id: status,
        count: data.count,
        totalRevenue: data.totalRevenue
      }));
    }

    const totalBookings = stats.reduce((acc, curr) => acc + curr.count, 0);
    const totalRevenue = stats.reduce((acc, curr) => acc + curr.totalRevenue, 0);
    
    const statsData = {
      stats,
      totalBookings,
      totalRevenue
    };
    cache.put(cacheKey, statsData, 60000); // Cache for 60 seconds

    res.json({
      success: true,
      data: statsData
    });
  } catch (error) {
    next(error);
  }
};
