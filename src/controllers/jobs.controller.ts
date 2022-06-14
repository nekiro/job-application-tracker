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
    if (!canAccessResource(req.user, req.body.userId)) {
      throw new AuthError();
    }

    const job = await jobService.addJob(req.body);
    res.json(job);
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
    // TODO: getJob should only allow getting data for token user
    // so there is potentially one extra query here, because we have to pull job
    // to get "owner" of it

    const job = await jobService.getJob(req.params.id);
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
    const userId = req.query.userId as string;

    if (!canAccessResource(req.user, userId)) {
      throw new AuthError();
    }

    const jobs = await jobService.getJobs(userId);
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};
