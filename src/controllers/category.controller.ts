import { NextFunction, Request, Response } from 'express';
import { canAccessResource } from '../util/authentication';
import AuthError from '../errors/AuthError';
import * as categoryService from '../services/category.service';

export const addCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!canAccessResource(req.user, req.params.userId)) {
      throw new AuthError();
    }

    const job = await categoryService.addCategory(req.params.userId, req.body);
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
};

export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    if (!canAccessResource(req.user, userId)) {
      throw new AuthError();
    }

    const category = await categoryService.getCategory(userId);
    res.json(category);
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    if (!canAccessResource(req.user, userId)) {
      throw new AuthError();
    }

    const categories = await categoryService.getCategories(userId);
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, categoryId } = req.params;

    if (!canAccessResource(req.user, userId)) {
      throw new AuthError();
    }

    await categoryService.deleteCategory(categoryId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
