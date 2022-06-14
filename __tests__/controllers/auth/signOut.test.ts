import { getMockReq, getMockRes } from '@jest-mock/express';
import { signOut } from '../../../src/controllers/auth.controller';
import * as authService from '../../../src/services/auth.service';

describe('Sign-out controller', () => {
  test('should call signOut service and respond with success message', async () => {
    const mockedUser: any = {
      id: 'foo',
    };

    const signOutSpy = jest.spyOn(authService, 'signOut').mockResolvedValue();

    const req = getMockReq({ user: mockedUser });
    const { res, next } = getMockRes();

    await signOut(req, res, next);

    expect(signOutSpy).toHaveBeenCalledWith(mockedUser.id);

    expect(res.json).toHaveBeenCalledWith({
      message: 'Logged out succesfully',
    });
  });

  test('should call next with signOut service error', async () => {
    jest.spyOn(authService, 'signOut').mockRejectedValue(new Error('foo'));

    const req = getMockReq({ user: { id: 'foo' } });
    const { res, next } = getMockRes();

    await signOut(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error('foo'));
  });
});
