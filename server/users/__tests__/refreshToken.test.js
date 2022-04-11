import supertest from 'supertest';
import app from '../src/app';

const request = supertest(app);

describe('Test RefreshToken Endpoint', () => {
  describe('given no payload', () => {
    test('should return response with status code 200', async () => {
      const response = await request.get('/refreshToken');
      expect(response.statusCode).toBe(200);
    });

    test('content type should be json', async () => {
      const res = await request.get('/refreshToken');
      expect(res.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });

    test('should respond with a json object containing token', async () => {
      const res = await request.get('/refreshToken');
      expect(res.body).toHaveProperty('token');
    });
  });
});
