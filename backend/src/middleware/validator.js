const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: messages
      });
    }
    next();
  };
};

const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().allow(''),
    address: Joi.string().allow('')
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(100),
    phone: Joi.string().allow(''),
    address: Joi.string().allow('')
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
  }),

  service: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().allow(''),
    category: Joi.string().valid('cleaning', 'repair', 'repaint', 'polishing', 'hydration', 'other').required(),
    price: Joi.number().min(0).required(),
    duration: Joi.number().min(1).required(),
    image: Joi.string().allow(''),
    isActive: Joi.boolean(),
    order: Joi.number()
  }),

  booking: Joi.object({
    service: Joi.string().required(),
    shoeType: Joi.string().required(),
    shoeColor: Joi.string().allow(''),
    description: Joi.string().allow(''),
    pickupAddress: Joi.string().required(),
    pickupDate: Joi.date().required(),
    pickupTime: Joi.string().required()
  }),

  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    review: Joi.string().allow('')
  })
};

module.exports = { validate, schemas };
