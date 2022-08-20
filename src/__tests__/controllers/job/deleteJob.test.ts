import { getMockReq, getMockRes } from '@jest-mock/express';
import { deleteJob } from '../../../controllers/jobs.controller';
import * as authentication from '../../../util/authentication';
import * as jobService from '../../../services/job.service';
import { Job } from '@prisma/client';
import AuthError from '../../../errors/AuthError';

describe('deleteJob controller', () => {
  test('should call job service and return deleted job', async () => {
    const mockedJobId = 'foo';

    const mockedJob = {
      name: 'foobar',
      companyId: 'bar',
      userId: 'foo',
    };

    const canAccessResourceSpy = jest
      .spyOn(authentication, 'canAccessResource')
      .mockReturnValue(true);

    const deleteJobSpy = jest
      .spyOn(jobService, 'deleteJob')
      .mockResolvedValue(mockedJob as Job);

    const req = getMockReq({
      user: { id: 'foo' },
      params: { jobId: mockedJobId, userId: mockedJob.userId },
    });
    const { res, next } = getMockRes();

    await deleteJob(req, res, next);

    expect(canAccessResourceSpy).toHaveBeenCalledWith(
      req.user,
      mockedJob.userId
    );

    expect(deleteJobSpy).toHaveBeenCalledWith(mockedJobId);
    expect(res.json).toHaveBeenCalledWith(mockedJob);
  });

  test('should call next with addJob service error', async () => {
    jest.spyOn(authentication, 'canAccessResource').mockReturnValue(true);
    jest.spyOn(jobService, 'deleteJob').mockRejectedValue(new Error());

    const req = getMockReq();
    const { res, next } = getMockRes();

    await deleteJob(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error());
  });

  describe('given user with no privileges', () => {
    test('should call next with AuthError', async () => {
      jest.spyOn(authentication, 'canAccessResource').mockReturnValue(false);

      const req = getMockReq({
        user: { id: 'foo' },
      });
      const { res, next } = getMockRes();

      await deleteJob(req, res, next);

      expect(next).toHaveBeenCalledWith(new AuthError());
    });
  });
});
