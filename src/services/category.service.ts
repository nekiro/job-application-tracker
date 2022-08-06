import { Category } from '@prisma/client';
import NotFoundError from '../errors/NotFoundError';
import prisma from '../prisma';

export const addCategory = async (userId: string, data: any) => {
  const user = await prisma.user.findUnique({
    select: { id: true },
    where: { id: userId },
  });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const category = await prisma.category.create({
    data: {
      ...data,
      userId,
    },
    include: { jobs: true },
  });
  return category;
};

export const getCategory = async (id: string): Promise<Category> => {
  const category = await prisma.category.findFirst({
    where: { id },
    include: { jobs: true },
  });

  if (!category) {
    throw new NotFoundError('Category not found');
  }
  return category;
};

export const getCategories = async (userId: string): Promise<Category[]> => {
  const categories = await prisma.category.findMany({
    where: {
      userId,
    },
    include: { jobs: true },
  });
  return categories;
};

export const deleteCategory = async (categoryId: string) => {
  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
};
