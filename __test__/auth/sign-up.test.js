import supertest from 'supertest';
import app from '../../src/app';
import { createDatabase, destroyDatabase } from '../mocks/db';

const request = supertest(app);

describe('API Sign-up - create user successfully', () => {
  beforeEach(async () => {
    await createDatabase();
  });

  afterEach(async () => {
    await destroyDatabase();
  });

  describe('given no payload', () => {
    test('should respond with an error', async () => {
      const response = await request.post('/auth/sign-up').send();

      expect(response.statusCode).toBe(400);
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('given valid payload', () => {
    test('should respond with new user', async () => {
      const response = await request.post('/auth/sign-up').send({
        firstName: 'admin2',
        lastName: 'admin2',
        email: 'admin2@admin.pl',
        password: 'admin2',
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
      expect(response.body).toHaveProperty('id');
    });
  });
});
