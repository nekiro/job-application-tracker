import { User } from '@prisma/client';
import NotFoundError from '../errors/NotFoundError';
import prisma from '../prisma';

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await prisma.user.delete({ where: { id } });
  } catch (err) {
    throw new NotFoundError('User not found');
  }
};

export const createUser = async (data: User): Promise<User> => {
  const user = await prisma.user.create({ data });
  return user;
};

export const getUser = async (id: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

export const getUsers = async (): Promise<User[]> => {
  const users = await prisma.user.findMany();
  return users;
};
