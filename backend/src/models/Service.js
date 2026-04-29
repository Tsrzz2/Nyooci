const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama layanan harus diisi'],
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  category: {
    type: String,
    enum: ['cleaning', 'repair', 'repaint', 'polishing', 'hydration', 'other'],
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Harga harus diisi'],
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    description: 'Durasi dalam jam'
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

serviceSchema.index({ category: 1 });
serviceSchema.index({ isActive: 1 });

module.exports = mongoose.model('Service', serviceSchema);
