import { prismaMock } from '../../../src/singleton';
import NotFoundError from '../../../src/errors/NotFoundError';
import * as jobService from '../../../src/services/job.service';

describe('getJob service', () => {
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

      const job = await jobService.getJob(mockedJobId);

      expect(prismaMock.job.findUnique).toHaveBeenCalledWith({
        where: { id: mockedJobId },
      });

      expect(job).toEqual(mockedJobData);
    });
  });

  describe('given valid non existing job id', () => {
    test('should throw NotFoundError', async () => {
      const mockedJobId = 'foo';

      prismaMock.job.findUnique.mockResolvedValue(null);

      try {
        await jobService.getJob(mockedJobId);
      } catch (err) {
        expect(err).toEqual(new NotFoundError('Job not found'));
      }

      expect(prismaMock.job.findUnique).toHaveBeenCalledWith({
        where: { id: mockedJobId },
      });
    });
  });
});
