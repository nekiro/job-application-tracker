import supertest from 'supertest';
import app from '../src/app';
import { connect, disconnect } from './mocks/db';
import seedUsers from './seeds/users';
import mockToken from './mocks/token';

const request = supertest(app);

describe('Test Delete User Endpoint', () => {
  let user, token;

  beforeAll(async () => {
    await connect();
    await seedUsers();

    // generate mock token
    ({ user, token } = await mockToken());
  });

  afterAll(async () => {
    await disconnect();
  });

  describe('given no payload', () => {
    test('should respond with an error', async () => {
      const response = await request
        .delete('/users/delete')
        .set('Authorization', `Bearer ${token}`)
        .send({});

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
