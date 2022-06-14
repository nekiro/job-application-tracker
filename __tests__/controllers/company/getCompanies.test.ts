import { getMockReq, getMockRes } from '@jest-mock/express';
import { getCompanies } from '../../../src/controllers/companies.controller';
import * as authentication from '../../../src/util/authentication';
import AuthError from '../../../src/errors/AuthError';
import * as companyService from '../../../src/services/company.service';

describe('getCompanies controller', () => {
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

    const getCompaniesSpy = jest
      .spyOn(companyService, 'getCompanies')
      .mockResolvedValue(mockedCompanies as any);

    jest.spyOn(authentication, 'canAccessResource').mockReturnValue(true);

    const req = getMockReq({
      query: { userId: mockedUserId },
    });
    const { res, next } = getMockRes();

    await getCompanies(req, res, next);

    expect(getCompaniesSpy).toHaveBeenCalledWith(mockedUserId);

    expect(res.json).toHaveBeenCalledWith(mockedCompanies);
  });

  test('should call next with getCompanies service error', async () => {
    jest.spyOn(companyService, 'getCompanies').mockRejectedValue(new Error());

    const req = getMockReq();
    const { res, next } = getMockRes();

    await getCompanies(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error());
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
