import { prismaMock } from '../../src/singleton';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { getJobs } from '../../src/handlers/jobs.handler';
import * as authentication from '../../src/util/authentication';
import AuthError from '../../src/errors/AuthError';

describe('getJobs', () => {
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

      const canAccessResourceSpy = jest
        .spyOn(authentication, 'canAccessResource')
        .mockReturnValue(true);

      prismaMock.job.findMany.mockResolvedValue(mockedJobs as any);

      const req = getMockReq({
        query: { userId: mockedUserId },
        user: { id: 'foo' },
      });
      const { res, next } = getMockRes();

      await getJobs(req, res, next);

      expect(canAccessResourceSpy).toBeCalledWith({ id: 'foo' }, mockedUserId);

      expect(prismaMock.job.findMany).toHaveBeenCalledWith({
        where: { userId: mockedUserId },
      });

      expect(res.json).toHaveBeenCalledWith(mockedJobs);
    });
  });

  describe('given user with no privileges', () => {
    test('should call next with AuthError', async () => {
      jest.spyOn(authentication, 'canAccessResource').mockReturnValue(false);

      const req = getMockReq({
        user: { id: 'foo' },
      });
      const { res, next } = getMockRes();

      await getJobs(req, res, next);

      expect(next).toHaveBeenCalledWith(new AuthError());
    });
  });
});
