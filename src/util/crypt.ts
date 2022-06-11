import bcrypt from 'bcryptjs';

export const generateSalt = async (rounds: number = 6): Promise<string> => {
  return await bcrypt.genSalt(rounds);
};

export const encrypt = async (data: string): Promise<string> => {
  return await bcrypt.hash(data, await generateSalt(10));
};

export const compareHash = async (
  first: string,
  second: string
): Promise<boolean> => {
  return await bcrypt.compare(first, second);
};
