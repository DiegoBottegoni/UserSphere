# Tests

This directory contains integration tests for the UserSphere application.

## Structure

```
tests/
├── integration/
│   ├── users/
│   │   └── userService.test.ts    # User service integration tests
│   └── socket/
│       └── socket.test.ts          # Socket.IO integration tests
├── unit/
│   └── middleware/
│       └── errorHandler.test.ts    # Error handler unit tests
└── README.md
```

## Running Tests

### User Service Tests
Tests the `userService` and `UserRepositoryPrisma` integration:
```bash
npx ts-node src/tests/integration/users/userService.test.ts
```

### Socket Tests
Tests Socket.IO real-time messaging functionality (requires server running):
```bash
# Start the server first
npm run dev

# In another terminal, run the test
npx ts-node src/tests/integration/socket/socket.test.ts
```

### Error Handler Unit Tests
Tests the errorHandler middleware to ensure custom errors (like `ServiceUnavailableError`) are properly recognized and handled:
```bash
npm run test:errorHandler
```

## Test Requirements

- **Database**: PostgreSQL must be running and accessible via `DATABASE_URL` in `.env`
- **Environment**: `.env` file must be configured with `DATABASE_URL`
- **Server**: Socket tests require the server to be running on `http://localhost:3000`

## Adding New Tests

When adding new integration tests:
1. Place them in the appropriate subdirectory under `integration/`
2. Use the `.test.ts` naming convention
3. Ensure proper cleanup of test data
4. Update this README with instructions for running the new test

