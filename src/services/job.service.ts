import { Job } from '@prisma/client';
import NotFoundError from '../errors/NotFoundError';
import prisma from '../prisma';

export const addJob = async (jobData: any): Promise<any> => {
  const { name, level, status, company, userId } = jobData;

  // check if user id exists
  const user = await prisma.user.findUnique({
    select: { id: true },
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  let companyObj = null;

  if (typeof company === 'object') {
    // if company is an object, we have to create and insert it too
    companyObj = await prisma.company.create({
      data: {
        name: company.name,
        website: company.website,
        size: company.size,
        userId: user.id,
      },
    });
  } else if (typeof company === 'string') {
    // company is a string (id), so it already exists
    companyObj = await prisma.company.findFirst({ where: { id: company } });
    if (!companyObj) {
      throw new NotFoundError('Company not found');
    }
  }

  // create job offer
  const jobOffer = await prisma.job.create({
    data: {
      name,
      level,
      status,
      companyId: companyObj?.id as string,
      userId: user.id,
    },
  });

  return jobOffer;
};

export const getJob = async (id: string): Promise<Job> => {
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) {
    throw new NotFoundError('Job not found');
  }

  return job;
};

export const getJobs = async (userId: string): Promise<Job[]> => {
  // TODO: pagination?
  const jobs = await prisma.job.findMany({ where: { userId } });
  return jobs;
};
