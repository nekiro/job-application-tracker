import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

process.env = {
  SKIP_AUTH: 'false',
  REFRESH_TOKEN_SECRET: 'x',
  ACCESS_TOKEN_SECRET: 'y',
  REFRESH_TOKEN_LIFETIME: '86400',
  ACCESS_TOKEN_LIFETIME: '600',
};

import prisma from './prisma';

jest.mock('./prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
