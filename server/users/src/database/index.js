import mongoose from 'mongoose';
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemServer = null;

export const createConnection = async () => {
  try {
    let databaseUrl = process.env.DATABASE_URL;

    // tests
    if (process.env.NODE_ENV === 'test') {
      mongoMemServer = await MongoMemoryServer.create();
      databaseUrl = mongoMemServer.getUri();
    }

    mongoose.connect(databaseUrl, {
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
    if (mongoMemServer) {
      await mongoMemServer.stop();
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default mongoose.connection;
