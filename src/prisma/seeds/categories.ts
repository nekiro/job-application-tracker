import prisma from '../';

const categories = [
  {
    name: 'hr interview',
    index: 1,
  },
  {
    name: 'technical interview',
    index: 1,
  },
];

const main = async () => {
  console.log('Seeding categories...');

  const users = await prisma.user.findMany();

  for (const [index, user] of users.entries()) {
    try {
      const category = categories[index];
      if (!categories) {
        continue;
      }

      await prisma.category.create({
        data: {
          ...category,
          userId: user.id,
        },
      });
    } catch (err) {
      console.log(err);
      // ignore err
    }
  }

  console.log('categories table:', await prisma.category.findMany());
};

export default main;
