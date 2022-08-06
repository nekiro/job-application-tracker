import { Company } from '@prisma/client';
import NotFoundError from '../errors/NotFoundError';
import prisma from '../prisma';
import CompanyDTO from '../types/CompanyDTO';

export const addCompany = async (companyData: CompanyDTO): Promise<Company> => {
  const { name, website, size, userId } = companyData;

  const user = await prisma.user.findUnique({
    select: { id: true },
    where: { id: userId },
  });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const company = await prisma.company.create({
    data: {
      name,
      website,
      size,
      userId,
    },
  });

  return company;
};

export const getCompany = async (companyId: string): Promise<Company> => {
  const company = await prisma.company.findFirst({
    where: { id: companyId },
  });
  if (!company) {
    throw new NotFoundError('Company not found');
  }
  return company;
};

export const getCompanies = async (userId: string): Promise<Company[]> => {
  const companies = await prisma.company.findMany({
    where: {
      userId,
    },
  });
  return companies;
};
