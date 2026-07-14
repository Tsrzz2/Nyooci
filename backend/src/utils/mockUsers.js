const bcrypt = require('bcryptjs');

// Shared mock users storage
let mockUsers = new Map();

// Initialize default admin
const defaultAdmin = {
  _id: '1',
  name: 'Admin Nyooci',
  email: 'admin@nyooci.com',
  password: bcrypt.hashSync('admin123', 12),
  phone: '081234567890',
  address: 'Jl. Sudirman No. 123, Jakarta',
  role: 'admin',
  isActive: true,
  refreshToken: null,
  createdAt: new Date(),
  updatedAt: new Date()
};
mockUsers.set('admin@nyooci.com', defaultAdmin);

// Initialize default user
const defaultUser = {
  _id: '2',
  name: 'User Biasa',
  email: 'user@nyooci.com',
  password: bcrypt.hashSync('user123', 12),
  phone: '082345678901',
  address: 'Jl. Thamrin No. 45, Jakarta',
  role: 'user',
  isActive: true,
  refreshToken: null,
  createdAt: new Date(),
  updatedAt: new Date()
};
mockUsers.set('user@nyooci.com', defaultUser);

function addMockUser(user) {
  mockUsers.set(user.email, user);
}

function getMockUserByEmail(email) {
  return mockUsers.get(email);
}

function getMockUserById(id) {
  for (let user of mockUsers.values()) {
    if (user._id === id) return user;
  }
  return null;
}

function getAllMockUsers() {
  return Array.from(mockUsers.values());
}

module.exports = {
  addMockUser,
  getMockUserByEmail,
  getMockUserById,
  getAllMockUsers
};
