import mongoose from 'mongoose';

export const createConnection = async () => {
  try {
    mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
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

export const destroyConnection = async () => {
  try {
    await mongoose.connection.close();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default mongoose.connection;
