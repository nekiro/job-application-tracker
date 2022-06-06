import prisma from '../src/database';

import seedCompanies from './seeds/companies';
import seedJobs from './seeds/jobs';
import seedUsers from './seeds/users';

(async () => {
  try {
    await prisma.job.deleteMany();
    await prisma.company.deleteMany();
    await prisma.user.deleteMany();

    console.log(`Starting seeding ...`);

    // users
    await seedUsers();

    // companies
    await seedCompanies();

    // jobs
    await seedJobs();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
