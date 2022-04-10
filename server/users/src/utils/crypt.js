import bcrypt from 'bcrypt';

export const encrypt = async (data) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(data, salt);
};

export const compareHash = async (first, second) => {
  return await bcrypt.compare(first, second);
};
