// import util from 'util';
// const exec = util.promisify(require('child_process').exec);
import prismaClient from '../../src/database';

export const createDatabase = async () => {
  // initiate new client

  // await exec(
  //   'npx prisma migrate reset --force --schema ./test/prisma/schema.prisma'
  // );

  // await exec('npx prisma db push --schema ./test/prisma/schema.prisma');

  await prismaClient.$connect();

  // const companies = await prisma.Company.findMany({
  //   where: { userId: user.id },
  // });

  // wipe all
  // this a very hacky way using (probably) temporary (risky) fields
  for (const model of prismaClient._dmmf.datamodel.models) {
    const modelRef = prismaClient[model.name];

    // modelRef.findMany = (args) => {

    // }

    await modelRef.deleteMany();

    //console.log('Wiping model: ' + model.name);
  }
};

export const destroyDatabase = async () => {
  await prismaClient.$disconnect();
};

export const prisma = prismaClient;
