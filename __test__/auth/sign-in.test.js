import supertest from 'supertest';
import app from '../../src/app';
import { mockToken } from '../mocks/token';
import seedUsers from '../seeds/users';
import { createDatabase, destroyDatabase } from '../mocks/db';

const request = supertest(app);

describe('API Sign-in - authenticate successfully', () => {
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

  describe('given no payload', () => {
    test('should respond with an error', async () => {
      const response = await request
        .post('/auth/sign-in')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.statusCode).toBe(400);
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('given valid payload', () => {
    test('should respond with valid token', async () => {
      const response = await request
        .post('/auth/sign-in')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'admin@admin.pl', password: 'admin' });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
      expect(response.body.token).toBeDefined();
      expect(response.body.expiresAt).toBeDefined();
    });
  });
});
