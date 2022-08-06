import { User } from '@prisma/client';
import NotFoundError from '../errors/NotFoundError';
import prisma from '../prisma';
import UserDTO from '../types/UserDTO';

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await prisma.user.delete({ where: { id: userId } });
  } catch (err) {
    throw new NotFoundError('User not found');
  }
};

export const createUser = async (data: UserDTO): Promise<User> => {
  const user = await prisma.user.create({ data });
  return user;
};

export const getUser = async (userId: string): Promise<User> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

export const getUsers = async (): Promise<User[]> => {
  const users = await prisma.user.findMany();
  return users;
};
