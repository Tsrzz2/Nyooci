const Service = require('../models/Service');
const cache = require('memory-cache');
const fetch = require('node-fetch');

// Mock services data for testing (in-memory)
const mockServices = [
  {
    _id: '1',
    name: 'Cuci Sepatu Basic',
    description: 'Pembersihan dasar sepatu untuk menghilangkan debu dan noda ringan.',
    category: 'cleaning',
    price: 25000,
    duration: 2,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400',
    isActive: true,
    order: 1
  },
  {
    _id: '2',
    name: 'Cuci Sepatu Premium',
    description: 'Pembersihan menyeluruh dengan treatment khusus untuk semua jenis sepatu.',
    category: 'cleaning',
    price: 45000,
    duration: 3,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
    isActive: true,
    order: 2
  },
  {
    _id: '3',
    name: 'Deep Cleaning',
    description: 'Pembersihan menyeluruh sampai ke bagian dalam sepatu.',
    category: 'cleaning',
    price: 60000,
    duration: 4,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    isActive: true,
    order: 3
  },
  {
    _id: '4',
    name: 'Repair Sol Sepatu',
    description: 'Perbaikan sol sepatu yang aus atau rusak.',
    category: 'repair',
    price: 75000,
    duration: 48,
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400',
    isActive: true,
    order: 4
  },
  {
    _id: '5',
    name: 'Polishing Sepatu Kulit',
    description: 'Poles sepatu kulit untuk mengembalikan kilau.',
    category: 'polishing',
    price: 35000,
    duration: 1,
    image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400',
    isActive: true,
    order: 5
  },
  {
    _id: '6',
    name: 'Repaint Sepatu',
    description: 'Pengecatan ulang sepatu sesuai warna pilihan.',
    category: 'repaint',
    price: 100000,
    duration: 72,
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400',
    isActive: true,
    order: 6
  },
  {
    _id: '7',
    name: 'Hydration Kulit Sepatu',
    description: 'Treatment untuk menjaga kelembutan kulit sepatu.',
    category: 'hydration',
    price: 50000,
    duration: 2,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    isActive: true,
    order: 7
  }
];

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

    let services = [];
    // Coba SheetDB terlebih dahulu jika URL tersedia
    if (process.env.SHEETDB_URL) {
      try {
        const response = await fetch(process.env.SHEETDB_URL);
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          services = data.data.map((row, index) => ({
            _id: index.toString(),
            name: row.name || row.Nama,
            description: row.description || row.Deskripsi,
            category: row.category || row.Kategori,
            price: parseFloat(row.price || row.Harga) || 0,
            duration: parseInt(row.duration || row.Durasi) || 60,
            image: row.image || row.Gambar,
            isActive: (row.isActive || row.Aktif) !== 'false' && (row.isActive || row.Aktif) !== false,
            order: index
          }));
        }
      } catch (sheetErr) {
        console.error('Gagal mengambil data dari SheetDB:', sheetErr.message);
      }
    }

    // Jika SheetDB tidak punya data atau gagal, coba MongoDB atau mock
    if (services.length === 0) {
      try {
        const filter = {};
        if (category) filter.category = category;
        if (active !== undefined) filter.isActive = active === 'true';
        services = await Service.find(filter).sort('order createdAt');
      } catch (err) {
        // Jika MongoDB juga gagal, gunakan mock data
        services = [...mockServices];
      }
    }

    // Apply category and active filters
    if (category) {
      services = services.filter(s => s.category === category);
    }
    if (active !== undefined) {
      services = services.filter(s => s.isActive === (active === 'true'));
    }

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

    let service;
    // Coba SheetDB terlebih dahulu
    if (process.env.SHEETDB_URL) {
      try {
        const response = await fetch(process.env.SHEETDB_URL);
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          const index = parseInt(req.params.id);
          const row = data.data[index];
          if (row) {
            service = {
              _id: index.toString(),
              name: row.name || row.Nama,
              description: row.description || row.Deskripsi,
              category: row.category || row.Kategori,
              price: parseFloat(row.price || row.Harga) || 0,
              duration: parseInt(row.duration || row.Durasi) || 60,
              image: row.image || row.Gambar,
              isActive: (row.isActive || row.Aktif) !== 'false' && (row.isActive || row.Aktif) !== false,
              order: index
            };
          }
        }
      } catch (sheetErr) {
        console.error('Gagal mengambil service dari SheetDB:', sheetErr.message);
      }
    }

    // Jika SheetDB tidak punya service, coba MongoDB atau mock
    if (!service) {
      try {
        service = await Service.findById(req.params.id);
      } catch (err) {
        // Jika MongoDB gagal, gunakan mock data
        service = mockServices.find(s => s._id === req.params.id);
      }
    }

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
