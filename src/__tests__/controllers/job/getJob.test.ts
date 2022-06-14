import { getMockReq, getMockRes } from '@jest-mock/express';
import { getJob } from '../../../controllers/jobs.controller';
import * as jobService from '../../../services/job.service';

describe('getJob controller', () => {
  test('should call getJob service and return its return value', async () => {
    const mockedJobData = {
      name: 'foo',
      level: 'bar',
      status: 'barbar',
      userId: 'foo',
    };

    const mockedJobId = 'foo';

    const getJobSpy = jest
      .spyOn(jobService, 'getJob')
      .mockResolvedValue(mockedJobData as any);

    const req = getMockReq({
      params: { id: mockedJobId },
    });
    const { res, next } = getMockRes();

    await getJob(req, res, next);

    expect(getJobSpy).toHaveBeenCalledWith(mockedJobId);

    expect(res.json).toHaveBeenCalledWith(mockedJobData);
  });

  test('should call next with getJob service error', async () => {
    jest.spyOn(jobService, 'getJob').mockRejectedValue(new Error());

    const req = getMockReq();
    const { res, next } = getMockRes();

    await getJob(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error());
  });
});
