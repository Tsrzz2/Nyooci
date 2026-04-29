const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validator');

router.post('/', protect, validate(schemas.booking), bookingController.createBooking);
router.get('/my-bookings', protect, bookingController.getMyBookings);
router.get('/stats', protect, adminOnly, bookingController.getBookingStats);
router.get('/:id', protect, bookingController.getBookingById);
router.put('/:id/cancel', protect, bookingController.cancelBooking);
router.put('/:id/review', protect, validate(schemas.review), bookingController.reviewBooking);

router.get('/', protect, adminOnly, bookingController.getAllBookings);
router.put('/:id', protect, adminOnly, bookingController.updateBookingStatus);
router.delete('/:id', protect, adminOnly, bookingController.deleteBooking);

module.exports = router;
