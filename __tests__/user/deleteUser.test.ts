import { prismaMock } from '../../src/singleton';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { deleteUser } from '../../src/handlers/users.handler';
import NotFoundError from '../../src/errors/NotFoundError';

describe('deleteUser', () => {
  describe('given existing user', () => {
    test('should return success message', async () => {
      const mockedUserId = 'foo';

      prismaMock.user.delete.mockResolvedValue({ id: mockedUserId } as any);

      const req = getMockReq({ params: { id: mockedUserId } });
      const { res, next } = getMockRes();

      await deleteUser(req, res, next);

      expect(prismaMock.user.delete).toHaveBeenCalledWith({
        where: { id: mockedUserId },
      });
      expect(res.json).toBeCalledWith({ message: 'Deleted succesfully' });
    });
  });

  describe('given non existing user', () => {
    test('should return NotFoundError', async () => {
      const mockedUserId = 'foo';

      prismaMock.user.delete.mockRejectedValue(new Error());

      const req = getMockReq({ params: { id: mockedUserId } });
      const { res, next } = getMockRes();

      await deleteUser(req, res, next);

      expect(next).toBeCalledWith(new NotFoundError('User not found'));
    });
  });
});
