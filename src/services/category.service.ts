import { Category } from '@prisma/client';
import NotFoundError from '../errors/NotFoundError';
import prisma from '../prisma';

export const addCategory = async (data: any) => {
  const user = await prisma.user.findUnique({
    select: { id: true },
    where: { id: data.userId },
  });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const category = await prisma.category.create({
    data,
  });
  return category;
};

export const getCategory = async (id: string): Promise<Category> => {
  const category = await prisma.category.findFirst({
    where: { id },
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
