import request from 'supertest';
import app from '../src/app';

describe('Test Login Endpoint', () => {
  describe('given no payload', () => {
    test('should respond with a json object containing token', async () => {
      const res = await request(app).get('/login');
      expect(res.body).toHaveProperty('token');
    });

    test('should return response with status code 200', async () => {
      const response = await request(app).get('/login');
      expect(response.statusCode).toBe(200);
    });

    test('content type should be json', async () => {
      const res = await request(app).get('/login');
      expect(res.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });
  });
});
