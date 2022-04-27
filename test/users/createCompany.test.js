import supertest from 'supertest';
import app from '../../src/app';
import mockToken from '../mocks/token';
import seedUsers from '../seeds/users';
import { createDatabase, destroyDatabase } from '../mocks/db';

const request = supertest(app);

describe('API Create Company - create new company successfully', () => {
  let user, token;

  beforeEach(async () => {
    await createDatabase();
    await seedUsers();

    // generate mock token
    ({ user, token } = await mockToken());
  });

  afterEach(async () => {
    await destroyDatabase();
  });

  describe('given invalid payload', () => {
    test('should respond with an error', async () => {
      const response = await request
        .post(`/users/${user.id}/companies`)
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
    test('should respond with code 200', async () => {
      const response = await request
        .post(`/users/${user.id}/companies`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'company 1',
          website: '',
          size: 0,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id');
    });
  });
});
