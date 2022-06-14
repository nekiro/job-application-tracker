import { prismaMock } from '../../../src/singleton';
import NotFoundError from '../../../src/errors/NotFoundError';
import * as companyService from '../../../src/services/company.service';

describe('getCompany service', () => {
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

      const company = await companyService.getCompany(mockedUserId);

      expect(prismaMock.company.findFirst).toHaveBeenCalledWith({
        where: { id: mockedUserId },
      });

      expect(company).toEqual(mockedCompanyData);
    });
  });

  describe('given company id that does not exist', () => {
    test('should throw NotFoundError', async () => {
      prismaMock.company.findFirst.mockResolvedValue(null);

      try {
        await companyService.getCompany('');
      } catch (err) {
        expect(err).toEqual(new NotFoundError('Company not found'));
      }
    });
  });
});
