import { prismaMock } from '../../src/singleton';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { signUp } from '../../src/handlers/auth.handler';
import { Role } from '../../src/models/role';
import ResourceExistsError from '../../src/errors/ResourceExistsError';

describe('Sign-up', () => {
  describe('given valid payload', () => {
    test('should respond with created user', async () => {
      const mockedUser: any = {
        email: 'foo@bar',
        firstName: 'foo',
        lastName: 'bar',
        password: 'foobar',
        role: Role.USER,
      };

      prismaMock.user.create.mockResolvedValue({
        ...mockedUser,
        tokenSecret: 'foobar',
      });

      const req = getMockReq({
        body: mockedUser,
      });
      const { res, next } = getMockRes();

      await signUp(req, res, next);

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

      expect(res.json).toHaveBeenCalledWith({
        email: mockedUser.email,
        firstName: mockedUser.firstName,
        lastName: mockedUser.lastName,
        role: mockedUser.role,
      });
    });
  });

  describe('given payload with already used email', () => {
    test('should call next with error', async () => {
      prismaMock.user.create.mockRejectedValue(new Error());

      const req = getMockReq();
      const { res, next } = getMockRes();

      await signUp(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new ResourceExistsError('Email already used')
      );
    });
  });
});
