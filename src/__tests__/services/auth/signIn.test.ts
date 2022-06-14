import { prismaMock } from '../../../singleton';
import AuthError from '../../../errors/AuthError';
import * as crypt from '../../../util/crypt';
import * as authService from '../../../services/auth.service';
import * as authentication from '../../../util/authentication';

describe('Sign-in service', () => {
  describe('given valid payload', () => {
    test('should respond with valid token and user object', async () => {
      const mockedUser: any = {
        id: 'foo',
        email: 'foo@bar',
      };

      jest
        .spyOn(authentication, 'generateToken')
        .mockReturnValue({ token: 'foo', expiresAt: 1234567 });

      const compareHashSpy = jest
        .spyOn(crypt, 'compareHash')
        .mockResolvedValue(true);

      prismaMock.user.findFirst.mockResolvedValue({
        ...mockedUser,
        tokenSecret: 'foobar',
        password: 'bar',
      });

      const returnedUser = await authService.signIn(mockedUser.email, 'foo');

      expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
        where: { email: mockedUser.email },
      });
      expect(compareHashSpy).toHaveBeenCalledWith('foo', 'bar');
      expect(returnedUser).toStrictEqual(
        expect.objectContaining({
          token: expect.any(String),
          expiresAt: expect.any(Number),
          user: expect.objectContaining(mockedUser),
        })
      );
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
