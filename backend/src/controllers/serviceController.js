const Service = require('../models/Service');

exports.getAllServices = async (req, res, next) => {
  try {
    const { category, active } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (active !== undefined) filter.isActive = active === 'true';

    const services = await Service.find(filter).sort('order createdAt');

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
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Layanan tidak ditemukan'
      });
    }

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

    res.json({
      success: true,
      message: 'Layanan berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};

exports.getServicesByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const validCategories = ['cleaning', 'repair', 'repaint', 'polishing', 'hydration', 'other'];
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Kategori tidak valid'
      });
    }

    const services = await Service.find({ category, isActive: true }).sort('order');

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    next(error);
  }
};
