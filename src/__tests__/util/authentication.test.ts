import {
  generateTokenPair,
  canAccessResource,
  TokenData,
} from '../../util/authentication';
import { User } from '@prisma/client';
import Role from '../../models/role';

describe('generateTokenPair', () => {
  describe('given user with valid properties', () => {
    test('should return object with token and expiresAt properties', async () => {
      const mockedUser: User = {
        id: 'foo',
        email: 'foo@bar',
        firstName: 'foo',
        lastName: 'bar',
        password: 'foo',
        tokenSecret: 'barSecret',
        role: Role.USER,
      };

      const data = (await generateTokenPair(mockedUser)) as TokenData;

      expect(data).toEqual(
        expect.objectContaining({
          accessToken: {
            value: expect.any(String),
            expiresAt: expect.any(Number),
          },
          refreshToken: {
            value: expect.any(String),
            expiresAt: expect.any(Number),
          },
        })
      );
    });
  });

  describe('given invalid user', () => {
    test('should return null', async () => {
      for (const val of [null, undefined, {}]) {
        expect(await generateTokenPair(val as User)).toBe(null);
      }
    });
  });
});

describe('canAccessResource', () => {
  describe('given user with valid properties and valid requested id', () => {
    test('should return true', async () => {
      const mockedUser: User = {
        id: 'foo',
        email: 'foo@bar',
        firstName: 'foo',
        lastName: 'bar',
        password: 'foo',
        tokenSecret: 'barSecret',
        role: Role.USER,
      };

      const data = canAccessResource(mockedUser, 'foo');
      expect(data).toBeTruthy();
    });
  });

  describe('given user that has admin role', () => {
    test('should return true', async () => {
      const mockedUser: User = {
        id: 'foo',
        email: 'foo@bar',
        firstName: 'foo',
        lastName: 'bar',
        password: 'foo',
        tokenSecret: 'barSecret',
        role: Role.ADMIN,
      };

      const data = canAccessResource(mockedUser, 'foo');
      expect(data).toBeTruthy();
    });
  });

  describe('given user that has different id than requested user and is not admin', () => {
    test('should return false', async () => {
      const mockedUser: User = {
        id: 'foo',
        email: 'foo@bar',
        firstName: 'foo',
        lastName: 'bar',
        password: 'foo',
        tokenSecret: 'barSecret',
        role: Role.USER,
      };

      const data = canAccessResource(mockedUser, 'bar');
      expect(data).toBeFalsy();
    });
  });

  describe('given invalid user and valid requested id', () => {
    test('should return false', async () => {
      const requestedUserId = 'foo';

      for (const val of [null, undefined, {}]) {
        expect(canAccessResource(val as any, requestedUserId)).toBeFalsy();
      }
    });
  });
});
