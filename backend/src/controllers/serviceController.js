const Service = require('../models/Service');
const cache = require('memory-cache');

exports.getAllServices = async (req, res, next) => {
  try {
    const { category, active } = req.query;
    const cacheKey = `services-${category || 'all'}-${active || 'all'}`;
    let cachedServices = cache.get(cacheKey);
    
    if (cachedServices) {
      return res.json({
        success: true,
        data: cachedServices
      });
    }
    
    const filter = {};
    if (category) filter.category = category;
    if (active !== undefined) filter.isActive = active === 'true';

    const services = await Service.find(filter).sort('order createdAt');
    cache.put(cacheKey, services, 60000); // Cache for 60 seconds

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

exports.getServiceById = async (req, res, next) => {
  try {
    const cacheKey = `service-${req.params.id}`;
    let cachedService = cache.get(cacheKey);
    
    if (cachedService) {
      return res.json({
        success: true,
        data: cachedService
      });
    }
    
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Layanan tidak ditemukan'
      });
    }
    
    cache.put(cacheKey, service, 60000);

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

exports.createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    cache.clear(); // Clear all cache when a new service is created

    res.status(201).json({
      success: true,
      message: 'Layanan berhasil dibuat',
      data: service
    });
  } catch (error) {
    next(error);
  }
};

exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Layanan tidak ditemukan'
      });
    }
    cache.clear(); // Clear all cache when a service is updated

    res.json({
      success: true,
      message: 'Layanan berhasil diperbarui',
      data: service
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Layanan tidak ditemukan'
      });
    }
    cache.clear(); // Clear all cache when a service is deleted

    res.json({
      success: true,
      message: 'Layanan berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};
