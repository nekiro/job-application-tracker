import { prismaMock } from '../../src/singleton';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { getJob } from '../../src/handlers/jobs.handler';
import NotFoundError from '../../src/errors/NotFoundError';

describe('getJob', () => {
  describe('given valid existing job id', () => {
    test('should return job', async () => {
      const mockedJobData = {
        name: 'foo',
        level: 'bar',
        status: 'barbar',
        userId: 'foo',
      };

      const mockedJobId = 'foo';

      prismaMock.job.findUnique.mockResolvedValue(mockedJobData as any);

      const req = getMockReq({
        params: { id: mockedJobId },
      });
      const { res, next } = getMockRes();

      await getJob(req, res, next);

      expect(prismaMock.job.findUnique).toHaveBeenCalledWith({
        where: { id: mockedJobId },
      });

      expect(res.json).toHaveBeenCalledWith(mockedJobData);
    });
  });

  describe('given valid non existing job id', () => {
    test('should call next with NotFoundError', async () => {
      const mockedJobId = 'foo';

      prismaMock.job.findUnique.mockResolvedValue(null);

      const req = getMockReq({
        params: { id: mockedJobId },
      });
      const { res, next } = getMockRes();

      await getJob(req, res, next);

      expect(prismaMock.job.findUnique).toHaveBeenCalledWith({
        where: { id: mockedJobId },
      });

      expect(next).toHaveBeenCalledWith(new NotFoundError('Job not found'));
    });
  });
});
