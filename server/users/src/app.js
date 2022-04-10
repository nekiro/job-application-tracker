import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import { createConnection } from './database';

// connect to mongodb
createConnection();

const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// we don't need to tell our framework
app.disable('x-powered-by');

// routes
import usersRouter from './routes/users';

app.use('/users', usersRouter);

// error handler
app.use((req, res, next) => {
  res.status(404).send();
});

export default app;
