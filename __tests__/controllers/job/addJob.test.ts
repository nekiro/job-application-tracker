import { getMockReq, getMockRes } from '@jest-mock/express';
import { addJob } from '../../../src/controllers/jobs.controller';
import * as authentication from '../../../src/util/authentication';
import AuthError from '../../../src/errors/AuthError';
import * as jobService from '../../../src/services/job.service';

describe('addJob controller', () => {
  test('should call job service and return new job', async () => {
    const mockedJobData = {
      name: 'foo',
      level: 'bar',
      status: 'barbar',
      userId: 'foo',
    };

    const mockedCompanyId = 'bar';

    const mockedJob = {
      name: mockedJobData.name,
      level: mockedJobData.level,
      status: mockedJobData.status,
      companyId: mockedCompanyId,
      userId: mockedJobData.userId,
    };

    const canAccessResourceSpy = jest
      .spyOn(authentication, 'canAccessResource')
      .mockReturnValue(true);

    const addJobSpy = jest
      .spyOn(jobService, 'addJob')
      .mockResolvedValue(mockedJob);

    const req = getMockReq({
      body: mockedJobData,
      user: { id: 'foo' },
    });
    const { res, next } = getMockRes();

    await addJob(req, res, next);

    expect(canAccessResourceSpy).toHaveBeenCalledWith(
      (req as any).user,
      mockedJobData.userId
    );

    expect(addJobSpy).toHaveBeenCalledWith(mockedJobData);

    expect(res.json).toHaveBeenCalledWith(mockedJob);
  });

  test('should call next with addJob service error', async () => {
    jest.spyOn(authentication, 'canAccessResource').mockReturnValue(true);
    jest.spyOn(jobService, 'addJob').mockRejectedValue(new Error());

    const req = getMockReq();
    const { res, next } = getMockRes();

    await addJob(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error());
  });

  describe('given user with no privileges', () => {
    test('should call next with AuthError', async () => {
      jest.spyOn(authentication, 'canAccessResource').mockReturnValue(false);

      const req = getMockReq({
        user: { id: 'foo' },
      });
      const { res, next } = getMockRes();

      await addJob(req, res, next);

      expect(next).toHaveBeenCalledWith(new AuthError());
    });
  });
});
