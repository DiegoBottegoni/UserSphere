const path = require('path');

/** @type {import("jest").Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testMatch: ['**/?(*.)+(test|spec).ts'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@/features/(.*)$': '<rootDir>/src/features/$1',
    '^@/domain/(.*)$': '<rootDir>/src/domain/$1',
  },

  setupFiles: ['tsconfig-paths/register', path.resolve(__dirname, 'tests/setupEnv.ts')],

  setupFilesAfterEnv: [
    path.resolve(__dirname, 'tests/setupMocks.ts'),
    path.resolve(__dirname, 'tests/setupTests.ts'),
  ],

  modulePathIgnorePatterns: ['<rootDir>/dist/'],
};
