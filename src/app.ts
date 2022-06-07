import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from './middlewares/errorHandler';
import 'dotenv/config';
import NotFoundError from './errors/NotFoundError';
import { User as PrismaUser } from '@prisma/client';

// routes
import jobsRouter from './routes/jobs';
import companiesRouter from './routes/companies';
import usersRouter from './routes/users';
import authRouter from './routes/auth';

declare global {
  namespace Express {
    interface Request {
      user: PrismaUser;
    }
  }
}

const app = express();

app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// we don't need to tell our framework
app.disable('x-powered-by');

// routes
app.use('/jobs', jobsRouter);
app.use('/companies', companiesRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

// error handler
app.use(errorHandler);

// unknown routes
app.use((req: Request, res: Response, next: NextFunction) =>
  errorHandler(new NotFoundError('Invalid route'), req, res, next)
);

export default app;
