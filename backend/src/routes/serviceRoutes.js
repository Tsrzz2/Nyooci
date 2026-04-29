const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { protect, adminOnly } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validator');

router.get('/', serviceController.getAllServices);
router.get('/category/:category', serviceController.getServicesByCategory);
router.get('/:id', serviceController.getServiceById);

router.post('/', protect, adminOnly, validate(schemas.service), serviceController.createService);
router.put('/:id', protect, adminOnly, validate(schemas.service), serviceController.updateService);
router.delete('/:id', protect, adminOnly, serviceController.deleteService);

module.exports = router;
