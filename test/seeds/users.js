import { Role } from '../../src/middlewares/role';
import { generateSalt } from '../../src/utils/crypt';
import prisma from '../../src/database';

const users = [
  {
    firstName: 'admin',
    lastName: 'admin',
    email: 'admin@admin.pl',
    password: 'admin', // admin
    role: Role.ADMIN,
  },
];

const seedUsers = async () => {
  try {
    for (const user of users) {
      await prisma.User.create({
        data: { ...user, tokenSecret: await generateSalt(6) },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export default seedUsers;
