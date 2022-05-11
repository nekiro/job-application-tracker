import supertest from 'supertest';
import app from '../../src/app';
import seedUsers from '../seeds/users';
import seedCompanies from '../seeds/companies';
import mockToken from '../mocks/token';
import { createDatabase, destroyDatabase, prisma } from '../mocks/db';

const request = supertest(app);

describe('API Get Company - returns requested user company', () => {
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
        .get(`/users/${user.id}/companies/123124124`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.statusCode).toBe(404);
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('given valid company id', () => {
    test('should respond with code 200', async () => {
      const company = await prisma.Company.findFirst({
        where: { userId: user.id },
      });

      const response = await request
        .get(`/users/${user.id}/companies/${company.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id');
    });
  });
});
