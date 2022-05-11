import { NotFoundError } from '../middlewares/errorHandler';
import prisma from '../database';
import { canAccessResource } from '../utils/authentication';
import { AuthError } from '../middlewares/errorHandler';

export const addJob = async (req, res, next) => {
  try {
    const { name, level, status, company, userId } = req.body;

    if (!canAccessResource(req.user, userId)) {
      throw new AuthError();
    }

    // check if user id exists
    const user = await prisma.user.findUnique({
      select: { id: true },
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    let companyObj = null;

    if (typeof company == 'object') {
      // if company is an object, we have to create and insert it too
      companyObj = await prisma.company.create({
        data: {
          name: company.name,
          website: company.website,
          size: company.size,
          userId: user.id,
        },
      });
    } else if (typeof company == 'string') {
      // company is a string (id), so it already exists
      companyObj = await prisma.company.findFirst({ where: { id: company } });
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
    const { id } = req.params;

    // TODO: getJob should only allow getting data for token user
    // so there is potentially one extra query here, because we have to pull job
    // to get "owner" of it

    const job = await prisma.job.findUnique({ where: { id } });
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
    const { userId } = req.query;

    if (!canAccessResource(req.user, userId)) {
      throw new AuthError();
    }

    // TODO: pagination?
    const jobs = await prisma.job.findMany({ where: { userId } });

    res.send(jobs);
  } catch (err) {
    next(err);
  }
};
