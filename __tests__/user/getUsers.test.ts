import { prismaMock } from '../../src/singleton';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { getUsers } from '../../src/handlers/users.handler';
import * as util from '../../src/util/index';

describe('getUsers', () => {
  describe("when prisma doesn't throw", () => {
    test('should return all users', async () => {
      const mockedUsers = [
        { id: 'foo', email: 'foo@bar' },
        { id: 'bar', email: 'bar@foo' },
      ];

      const excludeKeysSpy = jest.spyOn(util, 'excludeKeys');

      prismaMock.user.findMany.mockResolvedValue(mockedUsers as any);

      const req = getMockReq();
      const { res, next } = getMockRes();

      await getUsers(req, res, next);

      expect(excludeKeysSpy).toHaveBeenCalledTimes(mockedUsers.length);
      expect(prismaMock.user.findMany).toHaveBeenCalled();
      expect(res.json).toBeCalledWith(mockedUsers);
    });
  });

  describe('when prisma throws', () => {
    test('should cal next with error', async () => {
      prismaMock.user.findMany.mockRejectedValue(new Error('foo'));

      const req = getMockReq();
      const { res, next } = getMockRes();

      await getUsers(req, res, next);

      expect(next).toBeCalledWith(new Error('foo'));
    });
  });
});
