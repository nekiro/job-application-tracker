import { prismaMock } from '../../src/singleton';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { addJob } from '../../src/handlers/jobs.handler';
import * as authentication from '../../src/util/authentication';
import AuthError from '../../src/errors/AuthError';
import NotFoundError from '../../src/errors/NotFoundError';

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
  };

  const canAccessResourceSpy = jest
    .spyOn(authentication, 'canAccessResource')
    .mockReturnValue(true);

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

  expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
    select: { id: true },
    where: { id: mockedJobData.userId },
  });

  if (typeof mockedJobData.company === 'object') {
    expect(prismaMock.company.create).toHaveBeenCalledWith({
      data: { ...mockedJobData.company, userId: mockedJobData.userId },
    });
  } else {
    expect(prismaMock.company.findFirst).toHaveBeenCalledWith({
      where: { id: mockedJobData.company },
    });
  }

  expect(prismaMock.job.create).toHaveBeenCalledWith({
    data: mockedJob,
  });

  expect(res.json).toHaveBeenCalledWith(mockedJob);
};

describe('addJob', () => {
  describe('given valid payload', () => {
    test('should create new company or reference it and new job and return it', async () => {
      const mockedJobData = {
        name: 'foo',
        level: 'bar',
        status: 'barbar',
        userId: 'foo',
      };

      // object type
      await addJobTest({ ...mockedJobData, company: mockedCompany });

      // string type, id
      await addJobTest({ ...mockedJobData, company: 'foobar' });
    });
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

  describe('given user that does not exist', () => {
    test('should call next with NotFoundError', async () => {
      jest.spyOn(authentication, 'canAccessResource').mockReturnValue(true);

      prismaMock.user.findUnique.mockResolvedValue(null);

      const req = getMockReq();
      const { res, next } = getMockRes();

      await addJob(req, res, next);

      expect(next).toHaveBeenCalledWith(new NotFoundError('User not found'));
    });
  });

  describe('given company that does not exist', () => {
    test('should call next with NotFoundError', async () => {
      const mockedJobData = {
        name: 'foo',
        level: 'bar',
        status: 'barbar',
        userId: 'foo',
      };

      const mockedCompanyId = 'foo';

      jest.spyOn(authentication, 'canAccessResource').mockReturnValue(true);

      prismaMock.user.findUnique.mockResolvedValue({} as any);

      prismaMock.company.findFirst.mockResolvedValue(null);

      const req = getMockReq({
        body: { ...mockedJobData, company: mockedCompanyId },
      });
      const { res, next } = getMockRes();

      await addJob(req, res, next);

      expect(next).toHaveBeenCalledWith(new NotFoundError('Company not found'));
    });
  });
});
