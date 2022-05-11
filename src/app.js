import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from './middlewares/errorHandler';
import 'dotenv/config';
import { NotFoundError } from './middlewares/errorHandler';

// routes
import jobsRouter from './routes/jobs';
import companiesRouter from './routes/companies';
import usersRouter from './routes/users';
import authRouter from './routes/auth';

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
app.use((req, res, next) =>
  errorHandler(new NotFoundError('Invalid route'), req, res, next)
);

export default app;
