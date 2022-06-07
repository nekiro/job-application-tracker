import NotFoundError from '../errors/NotFoundError';
import prisma from '../prisma';
import { canAccessResource } from '../util/authentication';
import AuthError from '../errors/AuthError';
import { NextFunction, Request, Response } from 'express';

export const addJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const jobOffer = await prisma.job.create({
      data: {
        name,
        level,
        status,
        companyId: companyObj?.id as string,
        userId: user.id,
      },
    });

    res.send(jobOffer);
  } catch (err) {
    next(err);
  }
};

export const getJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const getJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.query.userId as string;

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
