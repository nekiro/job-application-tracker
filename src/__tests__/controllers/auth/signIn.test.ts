import { getMockReq, getMockRes } from '@jest-mock/express';
import { signIn } from '../../../controllers/auth.controller';
import * as authService from '../../../services/auth.service';

describe('Sign-in sontroller', () => {
  test('should call signIn service and respond with valid token and user object', async () => {
    const mockedUser: any = {
      id: 'foo',
      email: 'foo@bar',
    };

    const signInSpy = jest.spyOn(authService, 'signIn').mockResolvedValue({
      user: mockedUser,
      token: 'foobar',
      expiresAt: Date.now(),
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
        expiresAt: expect.any(Number),
        user: expect.objectContaining(mockedUser),
      })
    );
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
