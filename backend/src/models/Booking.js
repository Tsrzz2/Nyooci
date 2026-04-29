const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  shoeType: {
    type: String,
    required: [true, 'Jenis sepatu harus diisi'],
    trim: true
  },
  shoeColor: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  pickupAddress: {
    type: String,
    required: [true, 'Alamat pickup harus diisi'],
    trim: true
  },
  pickupDate: {
    type: Date,
    required: [true, 'Tanggal pickup harus diisi']
  },
  pickupTime: {
    type: String,
    required: [true, 'Waktu pickup harus diisi']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  totalPrice: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  beforeImages: [{
    type: String
  }],
  afterImages: [{
    type: String
  }],
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  review: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

bookingSchema.index({ user: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ pickupDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
