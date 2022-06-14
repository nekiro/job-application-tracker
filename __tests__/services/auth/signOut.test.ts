import { prismaMock } from '../../../src/singleton';
import * as crypt from '../../../src/util/crypt';
import * as authService from '../../../src/services/auth.service';

describe('Sign-out service', () => {
  describe('given valid user', () => {
    test('should call update on user with new tokenSecret', async () => {
      const mockedUser: any = {
        id: 'foo',
      };

      const generateSaltSpy = jest.spyOn(crypt, 'generateSalt');

      prismaMock.user.update.mockResolvedValue(mockedUser);

      await authService.signOut(mockedUser.id);

      expect(generateSaltSpy).toHaveBeenCalledWith(6);

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: mockedUser.id },
        data: {
          tokenSecret: expect.any(String),
        },
      });
    });
  });
});
