import express from 'express';
import { initializeRoutes } from '@routes/index.js';
// import { errorHandler } from '@middlewares/error.middleware.js';
import prisma from '@utils/db.js';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerOptions from '@config/swagger.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Initialize routes
initializeRoutes(app);

// Swagger
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', 
  swaggerUI.serve,
  swaggerUI.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true, // Keeps auth token between page refreshes
      tryItOutEnabled: true      // Enables "Try it out" feature
    }
  })
);
// app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle Prisma shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed');
  });
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed');
  });
});