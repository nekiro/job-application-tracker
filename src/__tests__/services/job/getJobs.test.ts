import { prismaMock } from '../../../singleton';
import * as jobService from '../../../services/job.service';

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

      const mockedCategoryId = 'foo';

      prismaMock.job.findMany.mockResolvedValue(mockedJobs as any);

      const jobs = await jobService.getJobs(mockedCategoryId);

      expect(prismaMock.job.findMany).toHaveBeenCalledWith({
        where: { categoryId: mockedCategoryId },
      });

      expect(jobs).toEqual(mockedJobs);
    });
  });
});
