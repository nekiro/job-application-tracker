import { getMockReq, getMockRes } from '@jest-mock/express';
import { getJobs } from '../../../controllers/jobs.controller';
import * as authentication from '../../../util/authentication';
import AuthError from '../../../errors/AuthError';
import * as jobService from '../../../services/job.service';

describe('getJobs controller', () => {
  test('should call getJobs service and return its return value', async () => {
    const mockedJobs = [
      {
        name: 'foo',
        level: 'bar',
        status: 'barbar',
        userId: 'foo',
      },
    ];

    const mockedUserId = 'bar';
    const mockedCategoryId = 'foobar';

    const canAccessResourceSpy = jest
      .spyOn(authentication, 'canAccessResource')
      .mockReturnValue(true);

    const getJobsSpy = jest
      .spyOn(jobService, 'getJobs')
      .mockResolvedValue(mockedJobs as any);

    const req = getMockReq({
      params: { userId: mockedUserId, categoryId: mockedCategoryId },
      user: { id: 'foo' },
    });
    const { res, next } = getMockRes();

    await getJobs(req, res, next);

    expect(canAccessResourceSpy).toBeCalledWith({ id: 'foo' }, mockedUserId);
    expect(getJobsSpy).toHaveBeenCalledWith(mockedCategoryId);
    expect(res.json).toHaveBeenCalledWith(mockedJobs);
  });

  test('should call next with getJobs service error', async () => {
    jest.spyOn(jobService, 'getJobs').mockRejectedValue(new Error());

    const req = getMockReq();
    const { res, next } = getMockRes();

    await getJobs(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error());
  });

  describe('given user with no privileges', () => {
    test('should call next with AuthError', async () => {
      jest.spyOn(authentication, 'canAccessResource').mockReturnValue(false);

      const req = getMockReq();
      const { res, next } = getMockRes();

      await getJobs(req, res, next);

      expect(next).toHaveBeenCalledWith(new AuthError());
    });
  });
});
