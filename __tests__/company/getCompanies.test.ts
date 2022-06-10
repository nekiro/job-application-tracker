import { prismaMock } from '../../src/singleton';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { getCompanies } from '../../src/handlers/companies.handler';
import * as authentication from '../../src/util/authentication';
import AuthError from '../../src/errors/AuthError';

describe('getCompanies', () => {
  describe('given valid param', () => {
    test('should return with companies', async () => {
      const mockedCompanies = [
        {
          name: 'foo',
          website: 'www.foobar.com',
          size: 2,
          userId: 'foo',
        },
      ];

      const mockedUserId = 'foo';

      prismaMock.company.findMany.mockResolvedValue(mockedCompanies as any);

      jest.spyOn(authentication, 'canAccessResource').mockReturnValue(true);

      const req = getMockReq({
        query: { userId: mockedUserId },
      });
      const { res, next } = getMockRes();

      await getCompanies(req, res, next);

      expect(prismaMock.company.findMany).toHaveBeenCalledWith({
        where: { userId: mockedUserId },
      });

      expect(res.json).toHaveBeenCalledWith(mockedCompanies);
    });
  });

  describe('given user with no privileges', () => {
    test('should call next with AuthError', async () => {
      jest.spyOn(authentication, 'canAccessResource').mockReturnValue(false);

      const req = getMockReq();
      const { res, next } = getMockRes();

      await getCompanies(req, res, next);

      expect(next).toHaveBeenCalledWith(new AuthError());
    });
  });
});
