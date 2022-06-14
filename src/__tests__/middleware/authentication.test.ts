import { getMockReq, getMockRes } from '@jest-mock/express';
import { prismaMock } from '../../singleton';
import { authenticate } from '../../middlewares/authentication';
import Jwt, { JsonWebTokenError } from 'jsonwebtoken';

describe('authenticate', () => {
  describe('given no token', () => {
    test('should call next with error', async () => {
      const req = getMockReq();

      const { res, next } = getMockRes();

      await authenticate()(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new JsonWebTokenError('Token is required')
      );
    });
  });

  describe('given malformed token', () => {
    test('should call next with error', async () => {
      const mockedValue = 'foo';

      jest.spyOn(Jwt, 'decode').mockReturnValue(null);

      const req = getMockReq({
        headers: { authorization: `Bearer ${mockedValue}` },
      });
      const { res, next } = getMockRes();

      await authenticate()(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new JsonWebTokenError('Malformed token data')
      );
    });
  });

  describe('given token with invalid user', () => {
    test('should call next with error', async () => {
      const mockedValue = 'foo';

      jest.spyOn(Jwt, 'decode').mockReturnValue({ data: { id: 'foo' } });

      prismaMock.user.findFirst.mockResolvedValue(null);

      const req = getMockReq({
        headers: { authorization: `Bearer ${mockedValue}` },
      });
      const { res, next } = getMockRes();

      await authenticate()(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new JsonWebTokenError('Malformed token data')
      );
    });
  });

  describe('given valid token', () => {
    test('should add user to request', async () => {
      const mockedValue = 'foo';

      //@ts-ignore
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
