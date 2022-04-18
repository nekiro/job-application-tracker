import mongoose from 'mongoose';

let conn = null;

export const createConnection = async () => {
  if (!conn) {
    try {
      conn = mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (error) {
      console.log(error);
    }

    await conn;

    console.log(
      `Mongoose default connection opened to ${process.env.DATABASE_URL}`
    );
  }

  return conn;
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
