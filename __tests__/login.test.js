import supertest from 'supertest';
import app from '../src/app';
import { connect, disconnect } from './mocks/db';
import seedUsers from './seeds/users';
import mockToken from './mocks/token';

const request = supertest(app);

describe('Test Login Endpoint', () => {
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

  describe('given no payload', () => {
    test('should respond with an error', async () => {
      const response = await request
        .post('/auth/login')
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
        .post('/auth/login')
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
