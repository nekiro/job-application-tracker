import AuthError from '../errors/AuthError';
import NotFoundError from '../errors/NotFoundError';
import prisma from '../prisma';
import { canAccessResource } from '../util/authentication';
import { NextFunction, Request, Response } from 'express';

export const addCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, website, size, userId } = req.body;

    if (!canAccessResource(req.user, userId)) {
      throw new AuthError();
    }

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
    const { id } = req.params;

    // TODO: getCompany should only allow getting data for token user
    // so there is potentially one extra query here, because we have to pull company
    // to get "owner" of it

    const company = await prisma.company.findFirst({
      where: { id },
    });
    if (!company) {
      throw new NotFoundError('Company not found');
    }

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

    const companies = await prisma.company.findMany({
      where: {
        userId,
      },
    });

    res.json(companies);
  } catch (err) {
    next(err);
  }
};
