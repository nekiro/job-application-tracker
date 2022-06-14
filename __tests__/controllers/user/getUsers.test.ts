import { prismaMock } from '../../../src/singleton';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { getUsers } from '../../../src/controllers/users.controller';
import * as util from '../../../src/util/index';
import * as userService from '../../../src/services/user.service';

describe('getUsers controller', () => {
  test('should return all users', async () => {
    const mockedUsers = [
      { id: 'foo', email: 'foo@bar' },
      { id: 'bar', email: 'bar@foo' },
    ];

    const excludeKeysSpy = jest.spyOn(util, 'excludeKeys');

    const getUsersSpy = jest
      .spyOn(userService, 'getUsers')
      .mockResolvedValue(mockedUsers as any);

    prismaMock.user.findMany.mockResolvedValue(mockedUsers as any);

    const req = getMockReq();
    const { res, next } = getMockRes();

    await getUsers(req, res, next);

    expect(excludeKeysSpy).toHaveBeenCalledTimes(mockedUsers.length);
    expect(getUsersSpy).toHaveBeenCalled();
    expect(res.json).toBeCalledWith(mockedUsers);
  });

  test('should call next with getUsers service error', async () => {
    jest.spyOn(userService, 'getUsers').mockRejectedValue(new Error());

    const req = getMockReq();
    const { res, next } = getMockRes();

    await getUsers(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error());
  });
});
