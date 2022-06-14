import { prismaMock } from '../../../src/singleton';
import * as jobService from '../../../src/services/job.service';

describe('getJobs service', () => {
  describe('given valid userId', () => {
    test('should return jobs related with user', async () => {
      const mockedJobs = [
        {
          name: 'foo',
          level: 'bar',
          status: 'barbar',
          userId: 'foo',
        },
      ];

      const mockedUserId = 'foo';

      prismaMock.job.findMany.mockResolvedValue(mockedJobs as any);

      const jobs = await jobService.getJobs(mockedUserId);

      expect(prismaMock.job.findMany).toHaveBeenCalledWith({
        where: { userId: mockedUserId },
      });

      expect(jobs).toEqual(mockedJobs);
    });
  });
});
