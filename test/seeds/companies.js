import prisma from '../../src/database';

const companies = [
  {
    name: 'company 1',
    website: '',
    size: 0,
  },
];

const seedCompanies = async () => {
  try {
    const user = await prisma.User.findFirst();
    for (const company of companies) {
      await prisma.Company.create({
        data: { ...company, userId: user.id },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export default seedCompanies;
