import { prismaMock } from '../../../singleton';
import NotFoundError from '../../../errors/NotFoundError';
import * as jobService from '../../../services/job.service';

const mockedCompany = {
  name: 'foobar',
  website: 'www.foobar.com',
  size: 1,
};

const addJobTest = async (mockedJobData: any) => {
  const mockedCompanyId = 'bar';

  const mockedJob = {
    name: mockedJobData.name,
    level: mockedJobData.level,
    status: mockedJobData.status,
    companyId: mockedCompanyId,
    userId: mockedJobData.userId,
    categoryId: mockedJobData.categoryId,
  };

  prismaMock.user.findUnique.mockResolvedValue({ id: 'foo' } as any);

  if (typeof mockedJobData.company === 'object') {
    prismaMock.company.create.mockResolvedValue({
      ...mockedJobData.company,
      id: mockedCompanyId,
      userId: mockedJobData.userId,
    });
  } else {
    prismaMock.company.findFirst.mockResolvedValue(mockedCompany as any);
  }

  prismaMock.job.create.mockResolvedValue(mockedJob as any);

  const job = await jobService.addJob(
    mockedJobData.userId,
    mockedJobData.categoryId,
    mockedJobData
  );

  expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
    select: { id: true },
    where: { id: mockedJobData.userId },
  });

  if (typeof mockedJobData.company === 'object') {
    expect(prismaMock.company.create).toHaveBeenCalledWith({
      data: { ...mockedJobData.company, userId: mockedJobData.userId },
    });
  } else if (typeof mockedJobData.company === 'string') {
    expect(prismaMock.company.findFirst).toHaveBeenCalledWith({
      where: { id: mockedJobData.company },
    });
  }

  expect(prismaMock.job.create).toHaveBeenCalledWith({
    data: mockedJob,
  });

  expect(job).toEqual(mockedJob);
};

describe('addJob service', () => {
  describe('given valid payload', () => {
    test('should create new company or reference it and new job and return it', async () => {
      const mockedJobData = {
        name: 'foo',
        userId: 'foo',
      };

      // object type
      await addJobTest({ ...mockedJobData, company: mockedCompany });

      // string type, id
      await addJobTest({ ...mockedJobData, company: 'foobar' });
    });
  });

  describe('given user that does not exist', () => {
    test('should throw NotFoundError', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      try {
        await jobService.addJob('foo', 'bar', {} as any);
      } catch (err) {
        expect(err).toEqual(new NotFoundError('User not found'));
      }
    });
  });

  describe('given company that does not exist', () => {
    test('should throw NotFoundError', async () => {
      const mockedJobData = {
        name: 'foo',
        userId: 'foo',
        categoryId: 'bar',
      };

      const mockedCompanyId = 'foo';

      prismaMock.user.findUnique.mockResolvedValue({} as any);
      prismaMock.company.findFirst.mockResolvedValue(null);

      try {
        await jobService.addJob(
          mockedJobData.userId,
          mockedJobData.categoryId,
          {
            ...mockedJobData,
            company: mockedCompanyId,
          }
        );
      } catch (err) {
        expect(err).toEqual(new NotFoundError('Company not found'));
      }
    });
  });
});
