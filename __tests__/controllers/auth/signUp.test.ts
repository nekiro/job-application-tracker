import { getMockReq, getMockRes } from '@jest-mock/express';
import { signUp } from '../../../src/controllers/auth.controller';
import Role from '../../../src/models/role';
import * as authService from '../../../src/services/auth.service';

describe('Sign-up controller', () => {
  test('should call signUp service and respond with new user', async () => {
    const mockedUser: any = {
      email: 'foo@bar',
      firstName: 'foo',
      lastName: 'bar',
      password: 'foobar',
      role: Role.USER,
    };

    const signUpSpy = jest
      .spyOn(authService, 'signUp')
      .mockResolvedValue(mockedUser);

    const req = getMockReq({
      body: mockedUser,
    });
    const { res, next } = getMockRes();

    await signUp(req, res, next);

    expect(signUpSpy).toHaveBeenCalledWith(mockedUser);

    expect(res.json).toHaveBeenCalledWith({
      email: mockedUser.email,
      firstName: mockedUser.firstName,
      lastName: mockedUser.lastName,
      role: mockedUser.role,
    });
  });

  test('should call next with signUp service error', async () => {
    jest.spyOn(authService, 'signUp').mockRejectedValue(new Error('foo'));

    const req = getMockReq({ user: { id: 'foo' } });
    const { res, next } = getMockRes();

    await signUp(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error('foo'));
  });
});
