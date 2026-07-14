
const express = require('express');
const router = express.Router();
const financialController = require('../controllers/financialController');
const { protect, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /api/financial:
 *   get:
 *     summary: Mendapatkan laporan keuangan (Admin Only)
 *     description: |
 *       Mengembalikan ringkasan laporan keuangan lengkap berdasarkan data booking, termasuk:
 *       - **Total revenue** (semua booking non-cancelled)
 *       - **Completed revenue** (booking completed saja)
 *       - **Revenue per layanan** (breakdown per service)
 *       - **Revenue per bulan** (breakdown bulanan)
 *       - **Revenue per status** (breakdown per status booking)
 *       - **Daftar transaksi** (semua booking sebagai transaksi)
 *
 *       Data di-cache selama 60 detik untuk performa.
 *     tags: [Financial]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data keuangan berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FinancialResponse'
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
router.get('/', protect, adminOnly, financialController.getFinancialData);

module.exports = router;
