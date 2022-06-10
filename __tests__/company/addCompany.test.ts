import { prismaMock } from '../../src/singleton';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { addCompany } from '../../src/handlers/companies.handler';
import * as authentication from '../../src/util/authentication';
import AuthError from '../../src/errors/AuthError';
import NotFoundError from '../../src/errors/NotFoundError';

describe('addCompany', () => {
  describe('given valid payload', () => {
    test('should create new company and return it', async () => {
      const mockedCompanyData = {
        name: 'foo',
        website: 'www.foobar.com',
        size: 2,
        userId: 'foo',
      };

      const canAccessResourceSpy = jest
        .spyOn(authentication, 'canAccessResource')
        .mockReturnValue(true);

      prismaMock.user.findUnique.mockResolvedValue({ id: 'foo' } as any);
      prismaMock.company.create.mockResolvedValue({
        ...mockedCompanyData,
        id: 'bar',
      });

      const req = getMockReq({
        body: mockedCompanyData,
        user: { id: 'foo' },
      });
      const { res, next } = getMockRes();

      await addCompany(req, res, next);

      expect(canAccessResourceSpy).toHaveBeenCalledWith(
        (req as any).user,
        mockedCompanyData.userId
      );

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        select: { id: true },
        where: { id: mockedCompanyData.userId },
      });

      expect(prismaMock.company.create).toHaveBeenCalledWith({
        data: mockedCompanyData,
      });

      expect(res.json).toHaveBeenCalledWith({
        ...mockedCompanyData,
        id: 'bar',
      });
    });
  });

  describe('given user with no privileges', () => {
    test('should call next with AuthError', async () => {
      jest.spyOn(authentication, 'canAccessResource').mockReturnValue(false);

      const req = getMockReq();
      const { res, next } = getMockRes();

      await addCompany(req, res, next);

      expect(next).toHaveBeenCalledWith(new AuthError());
    });
  });

  describe('given user that does not exist', () => {
    test('should call next with NotFoundError', async () => {
      jest.spyOn(authentication, 'canAccessResource').mockReturnValue(true);

      prismaMock.user.findUnique.mockResolvedValue(null);

      const req = getMockReq();
      const { res, next } = getMockRes();

      await addCompany(req, res, next);

      expect(next).toHaveBeenCalledWith(new NotFoundError('User not found'));
    });
  });
});
