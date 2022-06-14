import { prismaMock } from '../../../src/singleton';
import * as userService from '../../../src/services/user.service';

describe('getUsers service', () => {
  test('should return all users', async () => {
    const mockedUsers = [
      { id: 'foo', email: 'foo@bar' },
      { id: 'bar', email: 'bar@foo' },
    ];

    prismaMock.user.findMany.mockResolvedValue(mockedUsers as any);

    const users = await userService.getUsers();

    expect(users).toEqual(mockedUsers);
  });
});
