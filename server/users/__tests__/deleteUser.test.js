import supertest from 'supertest';
import app from '../src/app';
import { connect, disconnect } from './db';
import seedUsers from './seeds/users';
import { generateToken } from '../src/utils/authentication';
import User from '../src/models/user';

const request = supertest(app);

describe('Test Delete User Endpoint', () => {
  let token;
  let user;

  beforeAll(async () => {
    await connect();
    await seedUsers();
  });

  afterAll(async () => {
    await disconnect();
  });

  beforeEach(async () => {
    // generate mock token
    user = await User.findOne();
    token = generateToken(user).token;
  });

  describe('given no payload', () => {
    test('should respond with an error', async () => {
      const response = await request.delete('/users/delete').send({});

      expect(response.statusCode).toBe(400);
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('given valid payload', () => {
    test('should respond with code 200', async () => {
      const response = await request
        .delete('/users/delete')
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: user._id,
        });

      expect(response.statusCode).toBe(200);
    });
  });
});
