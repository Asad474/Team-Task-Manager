import mongoose from 'mongoose';
import { databaseConfig, setupMongoDBEvents } from '../config/database.config';

export const connectDatabase = async (): Promise<void> => {
  try {
    setupMongoDBEvents();

    await mongoose.connect(databaseConfig.url);
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('Database disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting database:', error);
  }
};
