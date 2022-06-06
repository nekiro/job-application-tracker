module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  transformIgnorePatterns: ['<rootDir>/build'],
  setupFilesAfterEnv: ['<rootDir>/src/singleton.ts'],
  clearMocks: true,
  setupFiles: ['dotenv/config'],
};
