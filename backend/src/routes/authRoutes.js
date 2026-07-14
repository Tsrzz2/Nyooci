const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validator');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrasi user baru
 *     description: Mendaftarkan user baru dengan data nama, email, password, nomor telepon, dan alamat. Mengembalikan access token dan refresh token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Email sudah terdaftar atau validasi gagal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 */
router.post('/register', validate(schemas.register), authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Login dengan email dan password. Mengembalikan access token (berlaku 1 hari) dan refresh token (berlaku 7 hari).
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Email atau password salah / Akun tidak aktif
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', validate(schemas.login), authController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Menghapus refresh token user yang sedang login.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logout berhasil
 *       401:
 *         description: Tidak memiliki akses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/logout', protect, authController.logout);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     description: Mendapatkan access token dan refresh token baru menggunakan refresh token yang masih valid.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: Token berhasil di-refresh
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIs...
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIs...
 *       401:
 *         description: Refresh token tidak valid atau tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/refresh-token', authController.refreshToken);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Mendapatkan data user yang sedang login
 *     description: Mengembalikan data profil user berdasarkan JWT token yang dikirim.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data user berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Tidak memiliki akses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/me', protect, authController.getMe);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update profil user
 *     description: Memperbarui data profil (nama, nomor telepon, alamat) user yang sedang login.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: Profil berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profil berhasil diperbarui
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Tidak memiliki akses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/profile', protect, validate(schemas.updateProfile), authController.updateProfile);

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Ganti password
 *     description: Mengganti password user yang sedang login. Memerlukan password saat ini untuk verifikasi.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password berhasil diubah
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password berhasil diubah
 *       400:
 *         description: Password saat ini salah
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Tidak memiliki akses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/change-password', protect, validate(schemas.changePassword), authController.changePassword);

/**
 * @swagger
 * /api/auth:
 *   get:
 *     summary: Mendapatkan semua user (Admin Only)
 *     description: Mengembalikan daftar seluruh user yang terdaftar, diurutkan berdasarkan tanggal terbaru.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar user berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Tidak memiliki akses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Akses ditolak — hanya admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', protect, adminOnly, authController.getAllUsers);

/**
 * @swagger
 * /api/auth/{id}:
 *   get:
 *     summary: Mendapatkan user berdasarkan ID (Admin Only)
 *     description: Mengembalikan data user berdasarkan ID yang diberikan.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID user (MongoDB ObjectId)
 *         example: 667a1b2c3d4e5f6a7b8c9d0e
 *     responses:
 *       200:
 *         description: Data user berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Tidak memiliki akses
 *       403:
 *         description: Akses ditolak — hanya admin
 */
router.get('/:id', protect, adminOnly, authController.getUserById);

/**
 * @swagger
 * /api/auth/{id}:
 *   put:
 *     summary: Update data user (Admin Only)
 *     description: Memperbarui data user termasuk role dan status aktif. Admin dapat mengubah role user menjadi admin atau sebaliknya.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID user (MongoDB ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User berhasil diperbarui
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User tidak ditemukan
 *       401:
 *         description: Tidak memiliki akses
 *       403:
 *         description: Akses ditolak — hanya admin
 */
router.put('/:id', protect, adminOnly, validate(schemas.updateProfile), authController.updateUser);

/**
 * @swagger
 * /api/auth/{id}:
 *   delete:
 *     summary: Hapus user (Admin Only)
 *     description: Menghapus user berdasarkan ID secara permanen.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID user (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: User berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User berhasil dihapus
 *       404:
 *         description: User tidak ditemukan
 *       401:
 *         description: Tidak memiliki akses
 *       403:
 *         description: Akses ditolak — hanya admin
 */
router.delete('/:id', protect, adminOnly, authController.deleteUser);

module.exports = router;
