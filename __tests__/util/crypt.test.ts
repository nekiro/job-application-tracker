import bcrypt from 'bcryptjs';
import { encrypt, generateSalt, compareHash } from '../../src/util/crypt';

describe('generateSalt', () => {
  test('should call bcrypt.genSalt with given rounds', async () => {
    const genSaltSpy = jest.spyOn(bcrypt, 'genSalt');

    const data = await generateSalt(2);

    expect(genSaltSpy).toBeCalledWith(2);
    expect(data).toEqual(expect.any(String));
  });
});

describe('encrypt', () => {
  test('should call bcrypt.hash with data and 10 rounds', async () => {
    const mockedData = 'foo';

    const hashSpy = jest.spyOn(bcrypt, 'hash');
    const genSaltSpy = jest.spyOn(bcrypt, 'genSalt');

    const data = await encrypt(mockedData);

    expect(genSaltSpy).toBeCalledWith(10);
    expect(hashSpy).toBeCalledWith(mockedData, expect.any(String));
    expect(data).toEqual(expect.any(String));
  });
});

describe('compareHash', () => {
  test('should call bcrypt.compare with first and second argument', async () => {
    const mockedFirst = 'foo';
    const mockedSecond = 'bar';

    const compareSpy = jest.spyOn(bcrypt, 'compare');

    const data = await compareHash(mockedFirst, mockedSecond);

    expect(compareSpy).toBeCalledWith(mockedFirst, mockedSecond);
    expect(data).toEqual(expect.any(Boolean));
  });
});
