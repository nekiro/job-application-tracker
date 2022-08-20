import { getMockReq, getMockRes } from '@jest-mock/express';
import { refreshToken } from '../../../controllers/auth.controller';
import AuthError from '../../../errors/AuthError';
import * as authentication from '../../../util/authentication';

describe('refreshToken sontroller', () => {
  test('should call authentication.refreshToken and respond with new valid token', async () => {
    const refreshTokenSpy = jest
      .spyOn(authentication, 'refreshToken')
      .mockResolvedValue({ value: 'foo', expiresAt: 0 });

    const req = getMockReq({
      cookies: { jwt: 'foo' },
    });
    const { res, next } = getMockRes();

    await refreshToken(req, res, next);

    expect(refreshTokenSpy).toHaveBeenCalledWith(req.cookies.jwt);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        token: expect.any(String),
      })
    );
  });

  test('should call next with AuthError if no refreshToken is provided', async () => {
    jest.spyOn(authentication, 'refreshToken').mockRejectedValue(new Error());

    const req = getMockReq();
    const { res, next } = getMockRes();

    await refreshToken(req, res, next);

    expect(next).toHaveBeenCalledWith(new AuthError());
  });

  test('should call next with authentication.refreshToken error', async () => {
    jest.spyOn(authentication, 'refreshToken').mockRejectedValue(new Error());

    const req = getMockReq({ cookies: { jwt: 'foo' } });
    const { res, next } = getMockRes();

    await refreshToken(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error());
  });
});
