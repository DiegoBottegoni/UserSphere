const path = require('path');

/** @type {import("jest").Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testMatch: ['**/?(*.)+(test|spec).ts'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  setupFiles: [path.resolve(__dirname, 'tests/setupEnv.ts')],

  setupFilesAfterEnv: [path.resolve(__dirname, 'tests/setupMocks.ts')],

  modulePathIgnorePatterns: ['<rootDir>/dist/'],
};
