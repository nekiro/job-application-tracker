module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  transformIgnorePatterns: ['<rootDir>/build', 'node_modules'],
  setupFilesAfterEnv: ['<rootDir>/src/singleton.ts'],
  clearMocks: true,
  setupFiles: ['dotenv/config'],
};
