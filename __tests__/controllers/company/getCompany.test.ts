import { getMockReq, getMockRes } from '@jest-mock/express';
import * as companyService from '../../../src/services/company.service';
import { getCompany } from '../../../src/controllers/companies.controller';

describe('getCompany controller', () => {
  test('should return job', async () => {
    const mockedJobData = {
      name: 'foo',
      level: 'bar',
      status: 'barbar',
      userId: 'foo',
    };

    const mockedJobId = 'foo';

    const getCompanySpy = jest
      .spyOn(companyService, 'getCompany')
      .mockResolvedValue(mockedJobData as any);

    const req = getMockReq({
      params: { id: mockedJobId },
    });
    const { res, next } = getMockRes();

    await getCompany(req, res, next);

    expect(getCompanySpy).toHaveBeenCalledWith(mockedJobId);

    expect(res.json).toHaveBeenCalledWith(mockedJobData);
  });

  test('should call next with getCompany service error', async () => {
    jest.spyOn(companyService, 'getCompany').mockRejectedValue(new Error());

    const req = getMockReq();
    const { res, next } = getMockRes();

    await getCompany(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error());
  });
});
