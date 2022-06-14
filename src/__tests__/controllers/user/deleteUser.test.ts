import { getMockReq, getMockRes } from '@jest-mock/express';
import { deleteUser } from '../../../controllers/users.controller';
import * as userService from '../../../services/user.service';

describe('deleteUser controller', () => {
  test('should call delete service and return success message', async () => {
    const mockedUserId = 'foo';

    const deleteSpy = jest.spyOn(userService, 'deleteUser').mockResolvedValue();

    const req = getMockReq({ params: { id: mockedUserId } });
    const { res, next } = getMockRes();

    await deleteUser(req, res, next);

    expect(deleteSpy).toHaveBeenCalledWith(mockedUserId);
    expect(res.sendStatus).toBeCalledWith(204);
  });

  test('should call next with deleteUser service error', async () => {
    jest.spyOn(userService, 'deleteUser').mockRejectedValue(new Error());

    const req = getMockReq();
    const { res, next } = getMockRes();

    await deleteUser(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error());
  });
});
