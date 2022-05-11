import { AuthError, NotFoundError } from '../middlewares/errorHandler';
import prisma from '../database';
import { canAccessResource } from '../utils/authentication';

export const addCompany = async (req, res, next) => {
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

    res.send(company);
  } catch (err) {
    next(err);
  }
};

export const getCompany = async (req, res, next) => {
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

    res.send(company);
  } catch (err) {
    next(err);
  }
};

export const getCompanies = async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!canAccessResource(req.user, userId)) {
      throw new AuthError();
    }

    const companies = await prisma.company.findMany({
      where: {
        userId,
      },
    });

    res.send(companies);
  } catch (err) {
    next(err);
  }
};
