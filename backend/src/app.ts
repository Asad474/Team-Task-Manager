import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import mainRouter from './api/v1/modules/index.router';
import errorMiddleware from './middleware/error';

const createApp = (): Express => {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(cors({ 
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
    credentials: true 
  }));

  app.use(cookieParser());

  app.use('/api/v1', mainRouter);

  app.use(errorMiddleware);

  return app;
};

export default createApp;