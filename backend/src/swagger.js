const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nyooci API Documentation',
      version: '1.0.0',
      description: 'API untuk layanan perawatan sepatu Nyooci. Dokumentasi lengkap seluruh endpoint termasuk autentikasi, manajemen layanan, booking, dan laporan keuangan.',
      contact: {
        name: 'Nyooci Dev Team'
      }
    },
    servers: [
      {
        url: 'https://nyooci-app.vercel.app',
        description: 'Production server (Vercel)'
      },
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Endpoint autentikasi — register, login, logout, refresh token'
      },
      {
        name: 'Users',
        description: 'Endpoint manajemen user — profil, password, dan admin CRUD'
      },
      {
        name: 'Services',
        description: 'Endpoint manajemen layanan perawatan sepatu'
      },
      {
        name: 'Bookings',
        description: 'Endpoint pemesanan layanan — booking, cancel, review'
      },
      {
        name: 'Financial',
        description: 'Endpoint laporan keuangan (Admin only)'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Masukkan JWT access token. Contoh: "eyJhbGciOiJIUzI1NiIs..."'
        }
      },
      schemas: {
        // ── Model Schemas ──
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '667a1b2c3d4e5f6a7b8c9d0e' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            phone: { type: 'string', example: '081234567890' },
            address: { type: 'string', example: 'Jl. Sudirman No. 123, Jakarta' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            avatar: { type: 'string', example: '' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Service: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '667a1b2c3d4e5f6a7b8c9d0e' },
            name: { type: 'string', example: 'Deep Cleaning' },
            description: { type: 'string', example: 'Pembersihan menyeluruh untuk menghilangkan noda, debu, dan bakteri pada sepatu.' },
            category: { type: 'string', enum: ['cleaning', 'repair', 'repaint', 'polishing', 'hydration', 'other'], example: 'cleaning' },
            price: { type: 'number', example: 35000 },
            duration: { type: 'number', description: 'Durasi dalam jam', example: 24 },
            image: { type: 'string', example: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400' },
            isActive: { type: 'boolean', example: true },
            order: { type: 'number', example: 1 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Booking: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '667a1b2c3d4e5f6a7b8c9d0e' },
            user: { type: 'string', description: 'User ID atau objek User (populated)' },
            service: { type: 'string', description: 'Service ID atau objek Service (populated)' },
            shoeType: { type: 'string', example: 'Sneakers' },
            shoeColor: { type: 'string', example: 'Putih' },
            description: { type: 'string', example: 'Ada noda di bagian depan' },
            pickupAddress: { type: 'string', example: 'Jl. Merdeka No. 45, Jakarta' },
            pickupDate: { type: 'string', format: 'date', example: '2026-08-01' },
            pickupTime: { type: 'string', example: '10:00' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'], example: 'pending' },
            totalPrice: { type: 'number', example: 35000 },
            notes: { type: 'string', example: '' },
            beforeImages: { type: 'array', items: { type: 'string' } },
            afterImages: { type: 'array', items: { type: 'string' } },
            rating: { type: 'number', minimum: 1, maximum: 5, nullable: true, example: null },
            review: { type: 'string', example: '' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },

        // ── Request Body Schemas ──
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 100, example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
            phone: { type: 'string', example: '081234567890' },
            address: { type: 'string', example: 'Jl. Sudirman No. 123' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin@nyooci.com' },
            password: { type: 'string', example: 'admin123' }
          }
        },
        RefreshTokenRequest: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' }
          }
        },
        UpdateProfileRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 100, example: 'John Updated' },
            phone: { type: 'string', example: '089876543210' },
            address: { type: 'string', example: 'Jl. Baru No. 99' }
          }
        },
        ChangePasswordRequest: {
          type: 'object',
          required: ['currentPassword', 'newPassword'],
          properties: {
            currentPassword: { type: 'string', example: 'oldpassword123' },
            newPassword: { type: 'string', minLength: 6, example: 'newpassword456' }
          }
        },
        CreateServiceRequest: {
          type: 'object',
          required: ['name', 'category', 'price', 'duration'],
          properties: {
            name: { type: 'string', example: 'Premium Cleaning' },
            description: { type: 'string', example: 'Pembersihan premium dengan treatment khusus.' },
            category: { type: 'string', enum: ['cleaning', 'repair', 'repaint', 'polishing', 'hydration', 'other'], example: 'cleaning' },
            price: { type: 'number', minimum: 0, example: 55000 },
            duration: { type: 'number', minimum: 1, description: 'Durasi dalam jam', example: 24 },
            image: { type: 'string', example: 'https://images.unsplash.com/photo-example' },
            isActive: { type: 'boolean', example: true },
            order: { type: 'number', example: 2 }
          }
        },
        CreateBookingRequest: {
          type: 'object',
          required: ['service', 'shoeType', 'pickupAddress', 'pickupDate', 'pickupTime'],
          properties: {
            service: { type: 'string', description: 'ID layanan', example: '667a1b2c3d4e5f6a7b8c9d0e' },
            shoeType: { type: 'string', example: 'Sneakers' },
            shoeColor: { type: 'string', example: 'Putih' },
            description: { type: 'string', example: 'Ada noda di bagian depan' },
            pickupAddress: { type: 'string', example: 'Jl. Merdeka No. 45, Jakarta' },
            pickupDate: { type: 'string', format: 'date', example: '2026-08-01' },
            pickupTime: { type: 'string', example: '10:00' }
          }
        },
        ReviewRequest: {
          type: 'object',
          required: ['rating'],
          properties: {
            rating: { type: 'number', minimum: 1, maximum: 5, example: 5 },
            review: { type: 'string', example: 'Hasil sangat bersih, recommended!' }
          }
        },
        UpdateBookingStatusRequest: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'], example: 'processing' },
            notes: { type: 'string', example: 'Sedang dikerjakan' },
            beforeImages: { type: 'array', items: { type: 'string' } },
            afterImages: { type: 'array', items: { type: 'string' } }
          }
        },
        UpdateUserRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Admin Updated' },
            email: { type: 'string', format: 'email', example: 'admin@nyooci.com' },
            phone: { type: 'string', example: '081234567890' },
            address: { type: 'string', example: 'Jl. Admin No. 1' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'admin' },
            isActive: { type: 'boolean', example: true }
          }
        },

        // ── Response Schemas ──
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' }
          }
        },
        ValidationErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validasi gagal' },
            errors: { type: 'array', items: { type: 'string' } }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
                refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' }
              }
            }
          }
        },
        BookingStatsResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                stats: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      _id: { type: 'string', example: 'pending' },
                      count: { type: 'number', example: 5 },
                      totalRevenue: { type: 'number', example: 250000 }
                    }
                  }
                },
                totalBookings: { type: 'number', example: 15 },
                totalRevenue: { type: 'number', example: 750000 }
              }
            }
          }
        },
        FinancialResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                totalRevenue: { type: 'number', example: 500000 },
                completedRevenue: { type: 'number', example: 350000 },
                totalBookings: { type: 'number', example: 10 },
                activeBookings: { type: 'number', example: 8 },
                revenueByService: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string', example: 'Deep Cleaning' },
                      revenue: { type: 'number', example: 105000 }
                    }
                  }
                },
                revenueByMonth: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      month: { type: 'string', example: '2026-07' },
                      revenue: { type: 'number', example: 250000 }
                    }
                  }
                },
                revenueByStatus: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'completed' },
                      revenue: { type: 'number', example: 350000 }
                    }
                  }
                },
                transactions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      customer: { type: 'string', example: 'John Doe' },
                      service: { type: 'string', example: 'Deep Cleaning' },
                      price: { type: 'number', example: 35000 },
                      status: { type: 'string', example: 'completed' },
                      date: { type: 'string', format: 'date-time' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: [
    path.join(__dirname, 'routes', 'authRoutes.js'),
    path.join(__dirname, 'routes', 'serviceRoutes.js'),
    path.join(__dirname, 'routes', 'bookingRoutes.js'),
    path.join(__dirname, 'routes', 'financialRoutes.js'),
  ],
};

// On Vercel serverless, swagger-jsdoc can't read route files from disk
// (they're bundled, not physical files). So we use a pre-generated JSON spec.
// For local dev, swagger-jsdoc works normally.
let swaggerSpec;
try {
  // Try loading pre-generated spec first (works on Vercel)
  const preGenerated = require('./swagger-spec.json');
  if (preGenerated.paths && Object.keys(preGenerated.paths).length > 0) {
    swaggerSpec = preGenerated;
  } else {
    swaggerSpec = swaggerJsdoc(options);
  }
} catch (e) {
  // Fallback to runtime generation (local dev)
  swaggerSpec = swaggerJsdoc(options);
}

module.exports = swaggerSpec;
