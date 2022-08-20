import { prismaMock } from '../../../singleton';
import AuthError from '../../../errors/AuthError';
import * as crypt from '../../../util/crypt';
import * as authService from '../../../services/auth.service';
import * as authentication from '../../../util/authentication';
import { Token } from '../../../util/authentication';

describe('Sign-in service', () => {
  describe('given valid payload', () => {
    test('should respond with valid token and user object', async () => {
      const mockedUser: any = {
        id: 'foo',
        email: 'foo@bar',
      };
      const mockedAccessToken = { value: 'foo', expiresAt: 0 } as Token;
      const mockedRefreshToken = { value: 'foo', expiresAt: 0 } as Token;

      jest.spyOn(authentication, 'generateTokenPair').mockResolvedValue({
        accessToken: mockedAccessToken,
        refreshToken: mockedRefreshToken,
      });

      const compareHashSpy = jest
        .spyOn(crypt, 'compareHash')
        .mockResolvedValue(true);

      prismaMock.user.findFirst.mockResolvedValue({
        ...mockedUser,
        tokenSecret: 'foobar',
        password: 'bar',
      });

      const returnedTokenData = await authService.signIn(
        mockedUser.email,
        'foo'
      );

      expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
        where: { email: mockedUser.email },
      });
      expect(compareHashSpy).toHaveBeenCalledWith('foo', 'bar');
      expect(returnedTokenData).toEqual({
        accessToken: expect.objectContaining(mockedAccessToken),
        refreshToken: expect.objectContaining(mockedRefreshToken),
      });
    });
  });

  describe("given valid payload but password doesn't match", () => {
    test('should throw AuthError', async () => {
      const mockedCredentials = {
        email: 'foo@bar',
        password: 'foo',
      };

      prismaMock.user.findFirst.mockResolvedValue({} as any);

      jest.spyOn(crypt, 'compareHash').mockResolvedValue(false);

      try {
        await authService.signIn(
          mockedCredentials.email,
          mockedCredentials.password
        );
      } catch (err) {
        expect(err).toEqual(new AuthError("Email or password doesn't match"));
      }

      expect(prismaMock.user.findFirst).toHaveBeenCalled();
    });
  });

  describe("given valid payload but user doesn't exist", () => {
    test('should throw AuthError', async () => {
      const mockedCredentials = {
        email: 'foo@bar',
        password: 'foo',
      };

      prismaMock.user.findFirst.mockResolvedValue(null);

      try {
        await authService.signIn(
          mockedCredentials.email,
          mockedCredentials.password
        );
      } catch (err) {
        expect(err).toEqual(new AuthError("Email or password doesn't match"));
      }

      expect(prismaMock.user.findFirst).toHaveBeenCalled();
    });
  });
});
