import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo = null;

export const connect = async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export const disconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
};

export const clear = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
