import { prismaMock } from '../../../singleton';
import Role from '../../../models/role';
import ResourceExistsError from '../../../errors/ResourceExistsError';
import * as authService from '../../../services/auth.service';

describe('Sign-up service', () => {
  describe('given valid payload', () => {
    test('should respond with created user', async () => {
      const mockedUser: any = {
        email: 'foo@bar',
        firstName: 'foo',
        lastName: 'bar',
        password: 'barfoo',
        role: Role.USER,
        tokenSecret: 'foobar',
      };

      prismaMock.user.create.mockResolvedValue({
        ...mockedUser,
        tokenSecret: 'foobar',
      });

      const user = await authService.signUp(mockedUser);

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'foo@bar',
          firstName: 'foo',
          lastName: 'bar',
          password: expect.any(String),
          role: 'USER',
          tokenSecret: expect.any(String),
        }),
      });

      expect(user).toEqual(mockedUser);
    });
  });

  describe('given payload with already used email', () => {
    test('should throw ResourceExistsError', async () => {
      prismaMock.user.create.mockRejectedValue(new Error());

      try {
        await authService.signUp({} as any);
      } catch (err) {
        expect(err).toEqual(new ResourceExistsError('Email already used'));
      }
    });
  });
});
