import supertest from 'supertest';
import app from '../src/app';
import { connect, disconnect } from './mocks/db';
import seedUsers from './seeds/users';
import mockToken from './mocks/token';

const request = supertest(app);

describe('Test Logout Endpoint', () => {
  let token;

  beforeAll(async () => {
    await connect();
    await seedUsers();

    // generate mock token
    ({ token } = await mockToken());
  });

  afterAll(async () => {
    await disconnect();
  });

  describe('given no token', () => {
    test('should respond with an error', async () => {
      const response = await request.post('/auth/logout').send();

      expect(response.statusCode).toBe(401);
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('given valid token', () => {
    test('should respond with code 200', async () => {
      const response = await request
        .post('/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.statusCode).toBe(200);
    });
  });
});
