import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
import loginRouter from './routes/login';

app.use('/login', loginRouter);

// error handler
app.use((req, res, next) => {
  res.status(404).send();
});

export default app;
