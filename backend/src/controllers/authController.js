const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { addMockUser, getMockUserByEmail, getMockUserById, getAllMockUsers } = require('../utils/mockUsers');

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'fallback-secret-key-nyooci-2026',
    { expiresIn: '1d' }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key-nyooci-2026',
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Helper to get user from DB or mock
async function getUserByEmail(email) {
  try {
    const user = await User.findOne({ email }).select('+password');
    if (user) return user;
  } catch (err) {
    // If DB not connected, use mock
  }
  return getMockUserByEmail(email);
}

// Helper to create user in DB or mock
async function createUser(userData) {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (err) {
    // If DB not connected, create in mock
    const newUser = {
      _id: Date.now().toString(),
      ...userData,
      password: bcrypt.hashSync(userData.password, 12),
      role: userData.role || 'user',
      isActive: true,
      refreshToken: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    addMockUser(newUser);
    return newUser;
  }
}

// Helper to compare password
async function comparePassword(candidatePassword, userPassword) {
  if (userPassword.startsWith('$2')) { // bcrypt hash
    return bcrypt.compare(candidatePassword, userPassword);
  }
  return candidatePassword === userPassword;
}

exports.register = async (req, res, next) => {
  try {
    console.log('--- Mencoba Registrasi ---');
    console.log('Data diterima:', { ...req.body, password: '***' });
    const { name, email, password, phone, address } = req.body;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    const user = await createUser({
      name,
      email,
      password,
      phone,
      address
    });

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    if (user.save) await user.save();

    // Remove sensitive data from response
    const userResponse = { ...user };
    delete userResponse.password;
    delete userResponse.refreshToken;

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        user: userResponse,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Akun tidak aktif'
      });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    if (user.save) await user.save();

    // Remove sensitive data from response
    const userResponse = { ...user };
    delete userResponse.password;
    delete userResponse.refreshToken;

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        user: userResponse,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper to get user by ID from DB or mock
async function getUserById(id) {
  try {
    const user = await User.findById(id);
    if (user) return user;
  } catch (err) {
    // If DB not connected, use mock
  }
  return getMockUserById(id);
}

exports.logout = async (req, res, next) => {
  try {
    const user = await getUserById(req.user._id);
    if (user) {
      user.refreshToken = null;
      if (user.save) await user.save();
    }

    res.json({
      success: true,
      message: 'Logout berhasil'
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token diperlukan'
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key-nyooci-2026');
    const user = await getUserById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token tidak valid'
      });
    }

    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    if (user.save) await user.save();

    res.json({
      success: true,
      data: tokens
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token tidak valid'
    });
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await getUserById(req.user._id);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Password saat ini salah'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password berhasil diubah'
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    let users;
    try {
      users = await User.find().sort('-createdAt');
    } catch (err) {
      users = getAllMockUsers();
    }

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, phone, address, role, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address, role, isActive },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'User berhasil diperbarui',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'User berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};
