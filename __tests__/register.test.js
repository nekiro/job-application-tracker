import supertest from 'supertest';
import app from '../src/app';
import { connect, disconnect } from './mocks/db';
import seedUsers from './seeds/users';

const request = supertest(app);

describe('Test Register Endpoint', () => {
  beforeAll(async () => {
    await connect();
    await seedUsers();
  });

  afterAll(async () => {
    await disconnect();
  });

  describe('given no payload', () => {
    test('should respond with an error', async () => {
      const response = await request.post('/auth/register').send();

      expect(response.statusCode).toBe(400);
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('given valid payload', () => {
    test('should respond with new user', async () => {
      const response = await request.post('/auth/register').send({
        firstName: 'admin2',
        lastName: 'admin2',
        email: 'admin2@admin.pl',
        password: 'admin2',
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
      expect(response.body).toHaveProperty('_id');
    });
  });
});
