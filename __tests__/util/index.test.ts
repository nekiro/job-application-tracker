import { excludeKeys } from '../../src/util';

describe('excludeKeys', () => {
  describe('given valid arguments', () => {
    test('should filtered object', async () => {
      const mockedObj = {
        id: 'foo',
        email: 'foo@bar',
        firstName: 'foo',
        lastName: 'bar',
        password: 'foo',
        tokenSecret: 'barSecret',
      };

      const mockedExcludedKeys = ['id', 'email'];

      const filtered = excludeKeys(mockedObj, mockedExcludedKeys);

      expect(filtered).toEqual({
        firstName: 'foo',
        lastName: 'bar',
        password: 'foo',
        tokenSecret: 'barSecret',
      });
    });
  });

  describe('given invalid arguments', () => {
    test('should return null', async () => {
      for (const val of [null, undefined]) {
        const filtered = excludeKeys(val as any, val as any);
        expect(filtered).toEqual({});
      }
    });
  });
});
