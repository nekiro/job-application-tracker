import { prismaMock } from '../../src/singleton';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { getUser } from '../../src/handlers/users.handler';
import * as authentication from '../../src/util/authentication';
import * as util from '../../src/util/index';
import AuthError from '../../src/errors/AuthError';
import NotFoundError from '../../src/errors/NotFoundError';
import { userExcludedKeys } from '../../src/schemas/auth';

describe('getUser', () => {
  describe('given valid user id', () => {
    test('should return single user', async () => {
      const mockedUserId = 'foo';

      jest.spyOn(authentication, 'canAccessResource').mockReturnValue(true);
      const excludeKeysSpy = jest.spyOn(util, 'excludeKeys');

      prismaMock.user.findUnique.mockResolvedValue({ id: mockedUserId } as any);

      const req = getMockReq({
        params: { id: mockedUserId },
      });
      const { res, next } = getMockRes();

      await getUser(req, res, next);

      expect(excludeKeysSpy).toHaveBeenCalledWith(
        { id: mockedUserId },
        userExcludedKeys
      );
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockedUserId },
      });
      expect(res.json).toBeCalledWith({ id: mockedUserId });
    });
  });

  describe('given user with no privileges', () => {
    test('should call next with AuthError', async () => {
      jest.spyOn(authentication, 'canAccessResource').mockReturnValue(false);

      const req = getMockReq({
        user: { id: 'foo' },
      });
      const { res, next } = getMockRes();

      await getUser(req, res, next);

      expect(next).toHaveBeenCalledWith(new AuthError());
    });
  });

  describe('given user that does not exist', () => {
    test('should call next with NotFoundError', async () => {
      jest.spyOn(authentication, 'canAccessResource').mockReturnValue(true);

      prismaMock.user.findUnique.mockResolvedValue(null);

      const req = getMockReq();
      const { res, next } = getMockRes();

      await getUser(req, res, next);

      expect(next).toHaveBeenCalledWith(new NotFoundError('User not found'));
    });
  });
});
