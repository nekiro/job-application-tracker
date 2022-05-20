import app from './app';
import prisma from './database';

prisma.$connect().then(() => {
  console.log(
    `Initialized connection to database at ${process.env.DATABASE_URL}`
  );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});
