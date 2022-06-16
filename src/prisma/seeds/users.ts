import prisma from '../';
import { encrypt, generateSalt } from '../../util/crypt';

const users = [
  {
    firstName: 'admin',
    lastName: 'admin',
    email: 'admin@admin.pl',
    password: 'admin',
    role: 'ADMIN',
  },
  {
    firstName: 'Marcin',
    lastName: 'J',
    email: 'marcinj@gmail.com',
    password: 'marcin',
    role: 'USER',
  },
];

const main = async () => {
  console.log('Seeding users...');

  for (const user of users) {
    try {
      await prisma.user.create({
        data: {
          ...user,
          tokenSecret: await generateSalt(6),
          password: await encrypt(user.password),
        },
      });
    } catch (err) {
      // ignore err
    }
  }

  console.log('users table:', await prisma.user.findMany());
};

export default main;
