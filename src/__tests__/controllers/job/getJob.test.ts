import { getMockReq, getMockRes } from '@jest-mock/express';
import { getJob } from '../../../controllers/jobs.controller';
import * as authentication from '../../../util/authentication';
import * as jobService from '../../../services/job.service';
import AuthError from '../../../errors/AuthError';
import { Job } from '@prisma/client';

describe('getJob controller', () => {
  test('should call getJob service and return its return value', async () => {
    const mockedJobData = {
      name: 'foo',
      userId: 'foo',
    };

    const mockedJobId = 'foo';

    jest.spyOn(authentication, 'canAccessResource').mockReturnValue(true);

    const getJobSpy = jest
      .spyOn(jobService, 'getJob')
      .mockResolvedValue(mockedJobData as any);

    const req = getMockReq({
      params: { jobId: mockedJobId },
    });
    const { res, next } = getMockRes();

    await getJob(req, res, next);

    expect(getJobSpy).toHaveBeenCalledWith(mockedJobId);

    expect(res.json).toHaveBeenCalledWith(mockedJobData);
  });

  test('should call next with canAccessResource error', async () => {
    jest.spyOn(authentication, 'canAccessResource').mockReturnValue(false);

    const req = getMockReq();
    const { res, next } = getMockRes();

    await getJob(req, res, next);

    expect(next).toHaveBeenCalledWith(new AuthError());
  });

  test('should call next with getJob service error', async () => {
    jest.spyOn(authentication, 'canAccessResource').mockReturnValue(true);
    jest.spyOn(jobService, 'getJob').mockRejectedValue(new Error());

    const req = getMockReq();
    const { res, next } = getMockRes();

    await getJob(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error());
  });
});
