import { getMockReq, getMockRes } from '@jest-mock/express';
import errorHandler from '../../src/middlewares/errorHandler';
import AuthError from '../../src/errors/AuthError';

describe('errorHandler', () => {
  test('should respond with error message and type', async () => {
    const mockedError = new AuthError('foobar');
    const req = getMockReq();
    const { res, next } = getMockRes();

    errorHandler(mockedError, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: mockedError.message,
      errorType: mockedError.name,
    });
  });
});
