import supertest from 'supertest';
import app from '../../src/app';
import mockToken from '../mocks/token';
import seedUsers from '../seeds/users';
import { createDatabase, destroyDatabase } from '../mocks/db';

const request = supertest(app);

describe('API Delete User - delete user successfully', () => {
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

  describe('given invalid user id', () => {
    test('should respond with an error', async () => {
      const response = await request
        .delete(`/users/123124`)
        .set('Authorization', `Bearer ${token}`)
        .send();

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
        .delete(`/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.statusCode).toBe(200);
    });
  });
});
