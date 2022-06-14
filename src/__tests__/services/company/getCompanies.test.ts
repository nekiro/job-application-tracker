import { prismaMock } from '../../../singleton';
import * as companyService from '../../../services/company.service';

describe('getCompanies service', () => {
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

      const companies = await companyService.getCompanies(mockedUserId);

      expect(prismaMock.company.findMany).toHaveBeenCalledWith({
        where: { userId: mockedUserId },
      });

      expect(companies).toEqual(mockedCompanies);
    });
  });
});
