import { getMockReq, getMockRes } from '@jest-mock/express';
import { addCompany } from '../../../controllers/companies.controller';
import * as authentication from '../../../util/authentication';
import AuthError from '../../../errors/AuthError';
import * as companyService from '../../../services/company.service';

describe('addCompany controller', () => {
  test('should call addCompany service and return its return value', async () => {
    const mockedCompanyData = {
      name: 'foo',
      website: 'www.foobar.com',
      size: 2,
      userId: 'foo',
    };

    const canAccessResourceSpy = jest
      .spyOn(authentication, 'canAccessResource')
      .mockReturnValue(true);

    const addCompanySpy = jest
      .spyOn(companyService, 'addCompany')
      .mockResolvedValue({ ...mockedCompanyData, id: 'bar' });

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

    expect(addCompanySpy).toHaveBeenCalledWith(mockedCompanyData);

    expect(res.json).toHaveBeenCalledWith({
      ...mockedCompanyData,
      id: 'bar',
    });
  });

  test('should call next with addCompany service error', async () => {
    jest.spyOn(companyService, 'addCompany').mockRejectedValue(new Error());

    const req = getMockReq();
    const { res, next } = getMockRes();

    await addCompany(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error());
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
});
