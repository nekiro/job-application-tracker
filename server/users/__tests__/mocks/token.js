import { generateToken } from '../../src/utils/authentication';
import User from '../../src/models/user';

const mockToken = async () => {
  const user = await User.findOne();
  const token = generateToken(user).token;
  return { user, token };
};

export default mockToken;
