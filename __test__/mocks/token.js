import { generateToken } from '../../src/utils/authentication';
import prisma from '../../src/database';

export const mockToken = async () => {
  const user = await prisma.User.findFirst();
  const token = generateToken(user).token;
  return { user, token };
};

export default mockToken;
