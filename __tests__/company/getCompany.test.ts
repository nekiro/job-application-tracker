import { prismaMock } from '../../src/singleton';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { getCompany } from '../../src/handlers/companies.handler';
import NotFoundError from '../../src/errors/NotFoundError';

describe('getCompany', () => {
  describe('given valid param', () => {
    test('should return with company if found', async () => {
      const mockedCompanyData = {
        name: 'foo',
        website: 'www.foobar.com',
        size: 2,
        userId: 'foo',
      };

      const mockedUserId = 'foo';

      prismaMock.company.findFirst.mockResolvedValue(mockedCompanyData as any);

      const req = getMockReq({
        params: { id: mockedUserId },
      });
      const { res, next } = getMockRes();

      await getCompany(req, res, next);

      expect(prismaMock.company.findFirst).toHaveBeenCalledWith({
        where: { id: mockedUserId },
      });

      expect(res.json).toHaveBeenCalledWith(mockedCompanyData);
    });
  });

  describe('given company id that does not exist', () => {
    test('should call next with NotFoundError', async () => {
      prismaMock.company.findFirst.mockResolvedValue(null);

      const req = getMockReq();
      const { res, next } = getMockRes();

      await getCompany(req, res, next);

      expect(next).toHaveBeenCalledWith(new NotFoundError('Company not found'));
    });
  });
});
