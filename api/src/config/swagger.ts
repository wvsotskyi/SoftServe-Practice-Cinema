import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Cinema API Documentation',
    version: '1.0.0',
    description: 'API documentation for the Cinema Management System',
    contact: {
      name: 'API Support',
      email: 'support@cinema.com',
    },
  },
  servers: [
    {
      url: `${process.env.API_URL}/api`,
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token in format: `Bearer <token>`'
      }
    },
  },
  security: [{
    bearerAuth: [],
  }],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/models/*.ts',
  ],
};

export default options;