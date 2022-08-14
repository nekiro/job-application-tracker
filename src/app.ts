import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from './middlewares/errorHandler';
import 'dotenv/config';
import NotFoundError from './errors/NotFoundError';
import { User as PrismaUser } from '@prisma/client';

// routes
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
app.use('/company', companiesRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

// home route
const homeHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>API Home</title>
  </head>
  <body>
    <h1>Job Application Tracker API</h1>
    <h2><a href="${process.env.DOCUMENTATION_URL}" target="_blank">Documentation</a></h2>
  </body>
</html>
`;

app.get('/', (_req: Request, res: Response) => {
  res.send(homeHtml);
});

app.get('/health', (_req: Request, res: Response) => {
  res.sendStatus(200);
});

// error handler
app.use(errorHandler);

// unknown routes
app.use((req: Request, res: Response, next: NextFunction) =>
  errorHandler(new NotFoundError('Invalid route'), req, res, next)
);

export default app;
