import { getMockReq, getMockRes } from '@jest-mock/express';
import { prismaMock } from '../../src/singleton';
import { authenticate } from '../../src/middlewares/authentication';
import Jwt from 'jsonwebtoken';

describe('authenticate', () => {
  describe('given no token', () => {
    test('should call next with error', async () => {
      const req = getMockReq();

      const { res, next } = getMockRes();

      await authenticate()(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('given valid token', () => {
    test('should add user to request', async () => {
      const mockedValue = 'foo';

      prismaMock.user.findFirst.mockResolvedValue({
        id: mockedValue,
        tokenSecret: 'bar',
      } as any);
      const decodeSpy = jest
        .spyOn(Jwt, 'decode')
        .mockReturnValue({ data: { id: 'foo' } });

      const verifySpy = jest.spyOn(Jwt, 'verify').mockReturnValue();

      const req = getMockReq({
        headers: { authorization: `Bearer ${mockedValue}` },
      });

      const { res, next } = getMockRes();

      await authenticate()(req, res, next);

      expect(decodeSpy).toBeCalledWith(mockedValue);
      expect(verifySpy).toBeCalledWith(
        mockedValue,
        process.env.TOKEN_SECRET + 'bar'
      );
      expect((req as any).user).toEqual(
        expect.objectContaining({ id: mockedValue })
      );
      expect(next).toBeCalled();
    });
  });
});
