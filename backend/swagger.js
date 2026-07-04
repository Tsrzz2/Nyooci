const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nyooci API Documentation',
      version: '1.0.0',
      description: 'API untuk layanan perawatan sepatu Nyooci',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Service: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            category: { type: 'string' },
            price: { type: 'number' },
            duration: { type: 'number' },
            image: { type: 'string' },
            isActive: { type: 'boolean' }
          }
        },
        Booking: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            service: { type: 'string' },
            shoeType: { type: 'string' },
            shoeColor: { type: 'string' },
            description: { type: 'string' },
            pickupAddress: { type: 'string' },
            pickupDate: { type: 'string', format: 'date' },
            pickupTime: { type: 'string' },
            totalPrice: { type: 'number' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'] },
            rating: { type: 'number' },
            review: { type: 'string' }
          }
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            address: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
