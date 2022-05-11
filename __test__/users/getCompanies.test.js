import supertest from 'supertest';
import app from '../../src/app';
import seedUsers from '../seeds/users';
import seedCompanies from '../seeds/companies';
import mockToken from '../mocks/token';
import { createDatabase, destroyDatabase } from '../mocks/db';

const request = supertest(app);

describe('API Get Companies - returns all user companies', () => {
  let user, token;

  beforeEach(async () => {
    await createDatabase();
    await seedUsers();
    await seedCompanies();

    // generate mock token
    ({ user, token } = await mockToken());
  });

  afterEach(async () => {
    await destroyDatabase();
  });

  describe('given invalid company id', () => {
    test('should respond with an error', async () => {
      const response = await request
        .get(`/users/${user.id}/companies/212xdxd`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.statusCode).toBe(404);
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('given valid user id', () => {
    test('should respond with code 200', async () => {
      const response = await request
        .get(`/users/${user.id}/companies`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
