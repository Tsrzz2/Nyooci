const Booking = require('../models/Booking');
const Service = require('../models/Service');
const cache = require('memory-cache');

exports.createBooking = async (req, res, next) => {
  try {
    const service = await Service.findById(req.body.service);
    if (!service || !service.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Layanan tidak valid atau tidak tersedia'
      });
    }

    const booking = await Booking.create({
      ...req.body,
      user: req.user._id,
      totalPrice: service.price
    });

    await booking.populate('service');
    cache.clear(); // Clear all cache when a new booking is created

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
    
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('service')
      .sort('-createdAt');
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
    
    const filter = {};
    if (status) filter.status = status;
    if (userId) filter.user = userId;
    if (startDate || endDate) {
      filter.pickupDate = {};
      if (startDate) filter.pickupDate.$gte = new Date(startDate);
      if (endDate) filter.pickupDate.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(filter)
      .populate('service')
      .populate('user', 'name email phone')
      .sort('-createdAt');
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

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking tidak ditemukan'
      });
    }

    if (status) booking.status = status;
    if (notes) booking.notes = notes;
    if (beforeImages) booking.beforeImages = beforeImages;
    if (afterImages) booking.afterImages = afterImages;

    await booking.save();
    await booking.populate('service');
    await booking.populate('user', 'name email phone');
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
    
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);

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
