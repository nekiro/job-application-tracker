// import util from 'util';
// const exec = util.promisify(require('child_process').exec);
import prismaClient from '../../src/database';

export const createDatabase = async () => {
  // initiate new client
  await prismaClient.$connect();
};

export const destroyDatabase = async () => {
  // wipe all
  // this a very hacky way using (probably) temporary (risky) fields
  for (const model of prismaClient._dmmf.datamodel.models) {
    const modelRef = prismaClient[model.name];
    await modelRef.deleteMany();
  }

  await prismaClient.$disconnect();
};

export const prisma = prismaClient;
