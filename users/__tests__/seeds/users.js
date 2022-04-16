import { Role } from '../../src/middlewares/role';
import User from '../../src/models/user';

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
    await User.deleteMany();
    await User.insertMany(users);
  } catch (err) {
    console.log(err);
  }
};

export default seedUsers;
