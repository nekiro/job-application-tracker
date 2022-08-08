import { prismaMock } from '../../../singleton';
import * as companyService from '../../../services/company.service';
import NotFoundError from '../../../errors/NotFoundError';
import CompanyDTO from '../../../types/CompanyDTO';

describe('addCompany service', () => {
  describe('given valid payload', () => {
    test('should create new company and return it', async () => {
      const mockedCompanyData = {
        name: 'foo',
        website: 'www.foobar.com',
        size: 2,
        userId: 'foo',
      };

      prismaMock.user.findUnique.mockResolvedValue({ id: 'foo' } as any);
      prismaMock.company.create.mockResolvedValue({
        ...mockedCompanyData,
        id: 'bar',
      });

      const company = await companyService.addCompany(mockedCompanyData);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        select: { id: true },
        where: { id: mockedCompanyData.userId },
      });

      expect(prismaMock.company.create).toHaveBeenCalledWith({
        data: mockedCompanyData,
      });

      expect(company).toEqual({
        ...mockedCompanyData,
        id: 'bar',
      });
    });
  });

  describe('given user that does not exist', () => {
    test('should throw NotFoundError', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      try {
        await companyService.addCompany({} as CompanyDTO);
      } catch (err) {
        expect(err).toEqual(new NotFoundError('User not found'));
      }
    });
  });
});
