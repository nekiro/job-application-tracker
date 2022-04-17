import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
// import errorHandler from './middlewares/errorHandler';
// import validateRequest from './middlewares/validation';
import 'dotenv/config';
import proxyPass from './middlewares/proxyPass';

import proxies from './proxies.json';

const app = express();

app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// we don't need to tell our framework
app.disable('x-powered-by');

// schema validator
// app.use(validateRequest);

// register proxies
// TODO: use https in production
proxies.forEach((proxy) => {
  app.use(
    proxyPass(proxy.path, `http://${proxy.host}:${proxy.port}`, proxy.options)
  );
});

// error handler
// app.use(errorHandler);

// unknown routes
app.use((_req, res, _next) => {
  res.status(404).send();
});

export default app;
