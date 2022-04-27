import supertest from 'supertest';
import app from '../../src/app';
import seedUsers from '../seeds/users';
import { createDatabase, destroyDatabase } from '../mocks/db';
import mockToken from '../mocks/token';

const request = supertest(app);

describe('API Sign-out - revoke token successfully', () => {
  let token;

  beforeEach(async () => {
    await createDatabase();
    await seedUsers();

    // generate mock token
    ({ token } = await mockToken());
  });

  afterEach(async () => {
    await destroyDatabase();
  });

  describe('given no token', () => {
    test('should respond with an error', async () => {
      const response = await request.post('/auth/sign-out').send();

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
        .post('/auth/sign-out')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.statusCode).toBe(200);
    });
  });
});
