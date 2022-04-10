import mongoose from 'mongoose';

export const createConnection = () => {
  try {
    mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
    });
  } catch (error) {
    console.log(error);
  }

  mongoose.connection.on('connected', () =>
    console.log(
      `Mongoose default connection opened to ${process.env.DATABASE_URL}`
    )
  );

  mongoose.connection.on('error', (err) => {
    console.log(err);
  });
};

export default mongoose.connection;
