import { prismaMock } from '../../src/singleton';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { signIn } from '../../src/handlers/auth.handler';
import AuthError from '../../src/errors/AuthError';

jest.mock('../../src/util/crypt', () => {
  return {
    compareHash: jest.fn().mockResolvedValue(true),
  };
});

jest.mock('../../src/util/authentication', () => {
  return {
    generateToken: jest
      .fn()
      .mockReturnValue({ token: 'foo', expiresAt: 1234567 }),
  };
});

describe('Sign-in', () => {
  describe('given no payload', () => {
    test('should call next with error', async () => {
      //@ts-ignore
      prismaMock.user.findFirst.mockResolvedValue(null);

      const req = getMockReq();
      const { res, next } = getMockRes();

      await signIn(req, res, next);

      expect(prismaMock.user.findFirst).toHaveBeenCalled();

      expect(next).toHaveBeenCalledWith(
        new AuthError("Email or password doesn't match")
      );
    });
  });

  describe('given valid payload', () => {
    test('should respond with valid token and user object', async () => {
      const mockedUser: any = {
        id: 'foo',
        email: 'foo@bar',
      };

      prismaMock.user.findFirst.mockResolvedValue({
        ...mockedUser,
        tokenSecret: 'foobar',
      });

      const req = getMockReq({
        body: { email: mockedUser.email, password: 'foo' },
      });

      const { res, next } = getMockRes();

      await signIn(req, res, next);

      expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
        where: { email: mockedUser.email },
      });

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          token: expect.any(String),
          expiresAt: expect.any(Number),
          user: expect.objectContaining(mockedUser),
        })
      );
    });
  });
});
