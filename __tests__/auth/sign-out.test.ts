import { prismaMock } from '../../src/singleton';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { signOut } from '../../src/handlers/auth.handler';
import * as crypt from '../../src/util/crypt';

describe('Sign-out', () => {
  describe('given valid user', () => {
    test('should call update on user', async () => {
      const mockedUser: any = {
        id: 'foo',
      };

      const generateSaltSpy = jest.spyOn(crypt, 'generateSalt');

      prismaMock.user.update.mockResolvedValue(mockedUser);

      const req = getMockReq({ user: mockedUser });
      const { res, next } = getMockRes();

      await signOut(req, res, next);

      expect(generateSaltSpy).toHaveBeenCalledWith(6);

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: mockedUser.id },
        data: {
          tokenSecret: expect.any(String),
        },
      });

      expect(res.json).toHaveBeenCalledWith({
        message: 'Logged out succesfully',
      });
    });
  });

  describe('given invalid user', () => {
    test('should call next with error', async () => {
      prismaMock.user.update.mockRejectedValue(new Error('foo'));

      const req = getMockReq({ user: { id: 'foo' } });
      const { res, next } = getMockRes();

      await signOut(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error('foo'));
    });
  });
});
