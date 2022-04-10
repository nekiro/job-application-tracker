import User from '../models/user';
import { encrypt, compareHash } from '../utils/crypt';
import { generateToken } from '../utils/authentication';

const refreshToken = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
  });

  if (!user) {
    return res.status(404).send();
  }

  const success = await compareHash(password, user.password);
  if (!success) {
    return res.status(403).send();
  }

  user.token = generateToken(user);

  res.send(user);
};

const createUser = async (req, res) => {
  await User.deleteMany();

  const { firstName, lastName, email, password, role } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.status(409).send();
  }

  console.log(password);

  // create
  user = await User.create({
    firstName,
    lastName,
    email,
    password: await encrypt(password),
    role,
  });

  user.token = generateToken(user);

  res.send(user);
};

const deleteUser = async (req, res) => {
  const { id } = req.body;

  const result = await User.deleteOne({ _id: id });
  if (result.deletedCount !== 0) {
    res.send();
  } else {
    res.status(404).send();
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send();
  }
};

export default {
  refreshToken,
  createUser,
  deleteUser,
  getUser,
};
