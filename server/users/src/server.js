import app from './app';
import { createConnection } from './database';

const PORT = process.env.PORT || 3000;

// connect to mongodb
createConnection();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});
