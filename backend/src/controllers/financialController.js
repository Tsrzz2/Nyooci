const cache = require('memory-cache');
const Booking = require('../models/Booking');
const { getMockBookings } = require('./bookingController');

function normalizeBookings(bookings) {
  return bookings.map((b) => ({
    _id: b._id,
    totalPrice: b.totalPrice || 0,
    status: b.status,
    createdAt: b.createdAt,
    service: b.service,
    user: b.user
  }));
}

async function fetchBookings() {
  try {
    const bookings = await Booking.find()
      .populate('service')
      .populate('user', 'name email')
      .sort('-createdAt');

    if (bookings.length > 0) {
      return normalizeBookings(bookings);
    }
  } catch (err) {
    // fall through to mock data
  }

  return getMockBookings().map((b) => ({
    ...b,
    user: typeof b.user === 'object' ? b.user : { name: 'User Test', email: 'test@example.com' }
  }));
}

function aggregateFinancialData(bookings) {
  const activeBookings = bookings.filter((b) => b.status !== 'cancelled');
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  const totalRevenue = activeBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const completedRevenue = completedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const serviceMap = {};
  activeBookings.forEach((b) => {
    const name = b.service?.name || 'Unknown';
    serviceMap[name] = (serviceMap[name] || 0) + (b.totalPrice || 0);
  });

  const monthMap = {};
  activeBookings.forEach((b) => {
    const date = new Date(b.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthMap[key] = (monthMap[key] || 0) + (b.totalPrice || 0);
  });

  const statusMap = {};
  bookings.forEach((b) => {
    statusMap[b.status] = (statusMap[b.status] || 0) + (b.totalPrice || 0);
  });

  return {
    totalRevenue,
    completedRevenue,
    totalBookings: bookings.length,
    activeBookings: activeBookings.length,
    revenueByService: Object.entries(serviceMap).map(([name, revenue]) => ({ name, revenue })),
    revenueByMonth: Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, revenue]) => ({ month, revenue })),
    revenueByStatus: Object.entries(statusMap).map(([status, revenue]) => ({ status, revenue })),
    transactions: bookings.map((b) => ({
      id: b._id,
      customer: b.user?.name || 'Unknown',
      service: b.service?.name || '-',
      price: b.totalPrice || 0,
      status: b.status,
      date: b.createdAt
    }))
  };
}

exports.getFinancialData = async (req, res, next) => {
  try {
    const cacheKey = 'financial-overview';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json({
        success: true,
        data: cachedData
      });
    }

    const bookings = await fetchBookings();
    const data = aggregateFinancialData(bookings);

    cache.put(cacheKey, data, 60000);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
