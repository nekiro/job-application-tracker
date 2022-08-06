import { canAccessResource } from '../util/authentication';
import AuthError from '../errors/AuthError';
import { NextFunction, Request, Response } from 'express';
import * as jobService from '../services/job.service';

export const addJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!canAccessResource(req.user, req.params.userId)) {
      throw new AuthError();
    }

    const job = await jobService.addJob(
      req.params.userId,
      req.params.categoryId,
      req.body
    );
    res.status(201).json(job);
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
    const userId = req.params.userId as string;

    console.log(req.user, userId);

    if (!canAccessResource(req.user, userId)) {
      console.log('exception');
      throw new AuthError();
    }

    const job = await jobService.getJob(req.params.jobId);
    res.json(job);
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
    const userId = req.params.userId as string;

    if (!canAccessResource(req.user, userId)) {
      throw new AuthError();
    }

    const jobs = await jobService.getJobs(req.params.categoryId);
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};
