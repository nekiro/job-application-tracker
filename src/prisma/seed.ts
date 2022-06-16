import prisma from './';

import usersSeed from './seeds/users';
import jobsSeed from './seeds/jobs';
import companiesSeed from './seeds/companies';

async function main() {
  await usersSeed();
  await companiesSeed();
  await jobsSeed();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
