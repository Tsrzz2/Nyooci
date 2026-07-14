const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getMockUserById } = require('../utils/mockUsers');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Tidak memiliki akses. Silakan login terlebih dahulu.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key-nyooci-2026');
    
    // Get user from DB or mock
    let user;
    try {
      user = await User.findById(decoded.id);
    } catch (err) {
      user = getMockUserById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User tidak ditemukan.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Akun tidak aktif.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid.'
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak. Hanya admin yang dapat mengakses.'
    });
  }
};

module.exports = { protect, adminOnly };
