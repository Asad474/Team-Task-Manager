import createApp from './app';
import { connectDatabase, disconnectDatabase } from './database/connection';
import { AppError } from './utils/AppError';

const port = Number(process.env.BACKEND_PORT) || 3000;
const app = createApp();

// Error handlers
process.on('uncaughtException', (error: AppError) => {
  console.error(`Uncaught Exception: ${error.message}`);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason: AppError) => {
  console.error(`Unhandled Rejection: ${reason.message}`);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down...`);
  await disconnectDatabase();
  process.exit(0);
};

const startServer = async () => {
  try {
    await connectDatabase();
    console.log('Database connected');

    app.listen(port, () => {
      console.info(`Server listening on port ${port}`);
    });

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
startServer();
