import NotFoundError from '../../../errors/NotFoundError';
import * as userService from '../../../services/user.service';
import { prismaMock } from '../../../singleton';

describe('getUser service', () => {
  test('should return single user', async () => {
    const mockedUserId = 'foo';

    prismaMock.user.findUnique.mockResolvedValue({ id: mockedUserId } as any);

    const user = await userService.getUser(mockedUserId);

    expect(user).toEqual({ id: mockedUserId });
  });

  test('should throw NotFoundError', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    try {
      await userService.getUser('');
    } catch (err) {
      expect(err).toEqual(new NotFoundError('User not found'));
    }
  });
});
