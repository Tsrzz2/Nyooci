const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validator');

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Membuat booking baru
 *     description: Membuat pesanan layanan perawatan sepatu baru. Total harga otomatis diambil dari harga layanan yang dipilih. Booking juga otomatis ditulis ke Google Sheet jika SHEETDB_URL terkonfigurasi.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookingRequest'
 *     responses:
 *       201:
 *         description: Booking berhasil dibuat
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
 *                   example: Booking berhasil dibuat
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Layanan tidak valid atau validasi gagal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Tidak memiliki akses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', protect, validate(schemas.booking), bookingController.createBooking);

/**
 * @swagger
 * /api/bookings/my-bookings:
 *   get:
 *     summary: Mendapatkan booking user yang sedang login
 *     description: Mengembalikan daftar seluruh booking milik user yang sedang login, diurutkan dari terbaru. Bisa difilter berdasarkan status.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, processing, completed, cancelled]
 *         description: Filter berdasarkan status booking
 *     responses:
 *       200:
 *         description: Daftar booking berhasil diambil
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
 *                     $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Tidak memiliki akses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/my-bookings', protect, bookingController.getMyBookings);

/**
 * @swagger
 * /api/bookings/stats:
 *   get:
 *     summary: Mendapatkan statistik booking (Admin Only)
 *     description: Mengembalikan statistik booking yang dikelompokkan berdasarkan status, termasuk total booking dan total pendapatan.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik booking berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingStatsResponse'
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
router.get('/stats', protect, adminOnly, bookingController.getBookingStats);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Mendapatkan booking berdasarkan ID
 *     description: Mengembalikan detail booking berdasarkan ID. User hanya bisa melihat booking milik sendiri, admin bisa melihat semua.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID booking (MongoDB ObjectId)
 *         example: 667a1b2c3d4e5f6a7b8c9d0e
 *     responses:
 *       200:
 *         description: Detail booking berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       403:
 *         description: Akses ditolak — bukan pemilik booking
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Booking tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Tidak memiliki akses
 */
router.get('/:id', protect, bookingController.getBookingById);

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   put:
 *     summary: Membatalkan booking
 *     description: Membatalkan booking yang masih berstatus "pending" atau "confirmed". Hanya pemilik booking yang bisa membatalkan.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID booking (MongoDB ObjectId)
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 description: Alasan pembatalan (opsional)
 *                 example: Saya ingin reschedule
 *     responses:
 *       200:
 *         description: Booking berhasil dibatalkan
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
 *                   example: Booking berhasil dibatalkan
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Booking tidak dapat dibatalkan (status sudah processing/completed/cancelled)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Akses ditolak — bukan pemilik booking
 *       404:
 *         description: Booking tidak ditemukan
 *       401:
 *         description: Tidak memiliki akses
 */
router.put('/:id/cancel', protect, bookingController.cancelBooking);

/**
 * @swagger
 * /api/bookings/{id}/review:
 *   put:
 *     summary: Memberikan review dan rating
 *     description: Memberikan rating (1-5) dan review tertulis untuk booking yang sudah berstatus "completed". Hanya pemilik booking yang bisa review.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID booking (MongoDB ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewRequest'
 *     responses:
 *       200:
 *         description: Review berhasil dikirim
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
 *                   example: Review berhasil dikirim
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Booking belum selesai (status bukan completed)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Akses ditolak — bukan pemilik booking
 *       404:
 *         description: Booking tidak ditemukan
 *       401:
 *         description: Tidak memiliki akses
 */
router.put('/:id/review', protect, validate(schemas.review), bookingController.reviewBooking);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Mendapatkan semua booking (Admin Only)
 *     description: Mengembalikan daftar seluruh booking dari semua user. Bisa difilter berdasarkan status, userId, dan rentang tanggal.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, processing, completed, cancelled]
 *         description: Filter berdasarkan status booking
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter berdasarkan user ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter tanggal mulai (YYYY-MM-DD)
 *         example: '2026-01-01'
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter tanggal akhir (YYYY-MM-DD)
 *         example: '2026-12-31'
 *     responses:
 *       200:
 *         description: Daftar booking berhasil diambil
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
 *                     $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Tidak memiliki akses
 *       403:
 *         description: Akses ditolak — hanya admin
 */
router.get('/', protect, adminOnly, bookingController.getAllBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Update status booking (Admin Only)
 *     description: Memperbarui status, catatan, dan gambar before/after pada booking. Digunakan admin untuk memproses pesanan.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID booking (MongoDB ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBookingStatusRequest'
 *     responses:
 *       200:
 *         description: Status booking berhasil diperbarui
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
 *                   example: Status booking berhasil diperbarui
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Booking tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Tidak memiliki akses
 *       403:
 *         description: Akses ditolak — hanya admin
 */
router.put('/:id', protect, adminOnly, bookingController.updateBookingStatus);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Hapus booking (Admin Only)
 *     description: Menghapus booking berdasarkan ID secara permanen. Hanya dapat dilakukan oleh admin.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID booking (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Booking berhasil dihapus
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
 *                   example: Booking berhasil dihapus
 *       404:
 *         description: Booking tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Tidak memiliki akses
 *       403:
 *         description: Akses ditolak — hanya admin
 */
router.delete('/:id', protect, adminOnly, bookingController.deleteBooking);

module.exports = router;
