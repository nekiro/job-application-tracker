import bcrypt from 'bcrypt';

export const generateSalt = async (rounds) => {
  return await bcrypt.genSalt(rounds);
};

export const encrypt = async (data) => {
  return await bcrypt.hash(data, await generateSalt(10));
};

export const compareHash = async (first, second) => {
  return await bcrypt.compare(first, second);
};
