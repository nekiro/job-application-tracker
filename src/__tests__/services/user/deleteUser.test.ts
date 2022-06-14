import NotFoundError from '../../../errors/NotFoundError';
import * as userService from '../../../services/user.service';
import { prismaMock } from '../../../singleton';

describe('deleteUser service', () => {
  test('should call prisma delete', async () => {
    const mockedUserId = 'foo';

    prismaMock.user.delete.mockResolvedValue({} as any);

    await userService.deleteUser(mockedUserId);

    expect(prismaMock.user.delete).toHaveBeenCalledWith({
      where: { id: mockedUserId },
    });
  });

  test('should throw NotFoundError', async () => {
    prismaMock.user.delete.mockRejectedValue(new Error());

    try {
      await userService.deleteUser('');
    } catch (err) {
      expect(err).toEqual(new NotFoundError('User not found'));
    }
  });
});
