import AuthError from '../errors/AuthError';
import { canAccessResource } from '../util/authentication';
import { NextFunction, Request, Response } from 'express';
import * as companyService from '../services/company.service';

export const addCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!canAccessResource(req.user, req.body.userId)) {
      throw new AuthError();
    }

    const company = await companyService.addCompany(req.body);
    res.json(company);
  } catch (err) {
    next(err);
  }
};

export const getCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: getCompany should only allow getting data for token user
    // so there is potentially one extra query here, because we have to pull company
    // to get "owner" of it
    const company = await companyService.getCompany(req.params.id);
    res.json(company);
  } catch (err) {
    next(err);
  }
};

export const getCompanies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.query.userId as string;

    if (!canAccessResource(req.user, userId)) {
      throw new AuthError();
    }

    const companies = await companyService.getCompanies(userId);

    res.json(companies);
  } catch (err) {
    next(err);
  }
};
