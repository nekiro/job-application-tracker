import { NotFoundError } from '../middlewares/errorHandler';
import prisma from '../database';
import { formatSuccess, excludeKeys } from '../utils';
import { userExcludedKeys } from '../schemas/auth';

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    try {
      await prisma.User.delete({ where: { id } });
    } catch (err) {
      throw new NotFoundError('User not found');
    }

    res.send(formatSuccess('Deleted succesfully'));
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.User.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.send(excludeKeys(user, userExcludedKeys));
  } catch (err) {
    next(err);
  }
};

export const addJob = async (req, res, next) => {
  try {
    const { user } = req;
    const { name, level, status, company } = req.body;

    let companyObj = null;

    if (typeof company == 'object') {
      // if company is an object, we have to create and insert it too
      companyObj = await prisma.Company.create({
        data: {
          name: company.name,
          website: company.website,
          size: company.size,
        },
      });
    } else if (typeof company == 'string') {
      // company is a string (id), so it already exists
      companyObj = await prisma.Company.findFirst({ where: { id: company } });
      if (!companyObj) {
        throw new NotFoundError('Company not found');
      }
    }

    // create job offer
    const jobOffer = await prisma.Job.create({
      data: {
        name,
        level,
        status,
        companyId: companyObj.id,
        userId: user.id,
      },
    });

    res.send(jobOffer);
  } catch (err) {
    next(err);
  }
};

export const getJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await prisma.Job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundError('Job not found');
    }

    res.send(job);
  } catch (err) {
    next(err);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    const { user } = req;

    // TODO: pagination?
    const jobs = await prisma.Job.findMany({ where: { userId: user.id } });

    res.send(jobs);
  } catch (err) {
    next(err);
  }
};

export const addCompany = async (req, res, next) => {
  try {
    const { user } = req;
    const { name, website, size } = req.body;

    const company = await prisma.Company.create({
      data: {
        name,
        website,
        size,
        userId: user.id,
      },
    });

    res.send(company);
  } catch (err) {
    next(err);
  }
};

export const getCompanies = async (req, res, next) => {
  try {
    const { user } = req;

    const companies = await prisma.Company.findMany({
      where: { userId: user.id },
    });

    res.send(companies);
  } catch (err) {
    next(err);
  }
};

export const getCompany = async (req, res, next) => {
  try {
    const { user } = req;
    const { companyId } = req.params;

    const company = await prisma.Company.findFirst({
      where: { userId: user.id, id: companyId },
    });
    if (!company) {
      throw new NotFoundError('Company not found');
    }

    res.send(company);
  } catch (err) {
    next(err);
  }
};
