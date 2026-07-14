const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { protect, adminOnly } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validator');

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Mendapatkan semua layanan
 *     description: Mengembalikan daftar seluruh layanan perawatan sepatu yang tersedia. Bisa difilter berdasarkan kategori dan status aktif. Tidak memerlukan autentikasi.
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [cleaning, repair, repaint, polishing, hydration, other]
 *         description: Filter berdasarkan kategori layanan
 *       - in: query
 *         name: active
 *         schema:
 *           type: string
 *           enum: ['true', 'false']
 *         description: Filter berdasarkan status aktif
 *     responses:
 *       200:
 *         description: Daftar layanan berhasil diambil
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
 *                     $ref: '#/components/schemas/Service'
 */
router.get('/', serviceController.getAllServices);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Mendapatkan layanan berdasarkan ID
 *     description: Mengembalikan detail satu layanan berdasarkan ID. Tidak memerlukan autentikasi.
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID layanan (MongoDB ObjectId)
 *         example: 667a1b2c3d4e5f6a7b8c9d0e
 *     responses:
 *       200:
 *         description: Detail layanan berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Service'
 *       404:
 *         description: Layanan tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', serviceController.getServiceById);

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Membuat layanan baru (Admin Only)
 *     description: Menambahkan layanan perawatan sepatu baru. Hanya dapat dilakukan oleh admin.
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceRequest'
 *     responses:
 *       201:
 *         description: Layanan berhasil dibuat
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
 *                   example: Layanan berhasil dibuat
 *                 data:
 *                   $ref: '#/components/schemas/Service'
 *       400:
 *         description: Validasi gagal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Tidak memiliki akses
 *       403:
 *         description: Akses ditolak — hanya admin
 */
router.post('/', protect, adminOnly, validate(schemas.service), serviceController.createService);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update layanan (Admin Only)
 *     description: Memperbarui data layanan perawatan sepatu berdasarkan ID. Hanya dapat dilakukan oleh admin.
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID layanan (MongoDB ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceRequest'
 *     responses:
 *       200:
 *         description: Layanan berhasil diperbarui
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
 *                   example: Layanan berhasil diperbarui
 *                 data:
 *                   $ref: '#/components/schemas/Service'
 *       404:
 *         description: Layanan tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Tidak memiliki akses
 *       403:
 *         description: Akses ditolak — hanya admin
 */
router.put('/:id', protect, adminOnly, validate(schemas.service), serviceController.updateService);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Hapus layanan (Admin Only)
 *     description: Menghapus layanan perawatan sepatu berdasarkan ID secara permanen. Hanya dapat dilakukan oleh admin.
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID layanan (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Layanan berhasil dihapus
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
 *                   example: Layanan berhasil dihapus
 *       404:
 *         description: Layanan tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Tidak memiliki akses
 *       403:
 *         description: Akses ditolak — hanya admin
 */
router.delete('/:id', protect, adminOnly, serviceController.deleteService);

module.exports = router;
