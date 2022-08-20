import { getMockReq, getMockRes } from '@jest-mock/express';
import { signIn } from '../../../controllers/auth.controller';
import AuthError from '../../../errors/AuthError';
import * as authService from '../../../services/auth.service';

describe('Sign-in sontroller', () => {
  test('should call signIn service and respond with valid token and user object', async () => {
    const mockedUser: any = {
      id: 'foo',
      email: 'foo@bar',
    };

    const signInSpy = jest.spyOn(authService, 'signIn').mockResolvedValue({
      refreshToken: { value: 'foo', expiresAt: 0 },
      accessToken: { value: 'foo', expiresAt: 0 },
    });

    const req = getMockReq({
      body: { email: mockedUser.email, password: 'foo' },
    });
    const { res, next } = getMockRes();

    await signIn(req, res, next);

    expect(signInSpy).toHaveBeenCalledWith(mockedUser.email, 'foo');
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        token: expect.any(String),
      })
    );
  });

  test('should call next with AuthError when returned token is invalid', async () => {
    jest.spyOn(authService, 'signIn').mockResolvedValue(null);

    const req = getMockReq();
    const { res, next } = getMockRes();

    await signIn(req, res, next);

    expect(next).toHaveBeenCalledWith(new AuthError());
  });

  test('should call next with signIn service error', async () => {
    const signInSpy = jest
      .spyOn(authService, 'signIn')
      .mockRejectedValue(new Error());

    const req = getMockReq();
    const { res, next } = getMockRes();

    await signIn(req, res, next);

    expect(signInSpy).toHaveBeenCalled();

    expect(next).toHaveBeenCalledWith(new Error());
  });
});
