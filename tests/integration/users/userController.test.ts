import type { Request, Response, NextFunction } from 'express';
import { errorHandler } from '@/infrastructure/middleware/errorHandler';
// Dynamic import to avoid type checking issues during test compilation
let getUser: any;
let updateExistingUser: any;
let removeUser: any;

/**
 * Integration test for userController endpoints
 * Tests validation error handling (missing user id)
 * This test verifies the current behavior before refactoring to use BadRequestError
 */
(async () => {
  // Dynamic import after setup
  const controllerModule = await import('@/features/users/userController');
  getUser = controllerModule.getUser;
  updateExistingUser = controllerModule.updateExistingUser;
  removeUser = controllerModule.removeUser;

  console.log(`\n🧪 Starting UserController integration test...\n`);

  let testsPassed = 0;
  let testsFailed = 0;

  // Helper to create mock Express objects
  const createMockReq = (params: any = {}, user: any = null): Partial<Request> =>
    ({
      params,
      user,
    }) as any;

  const createMockRes = (): any => {
    const res: any = {
      statusCode: 200,
      responseBody: null,
    };
    res.status = (code: number) => {
      res.statusCode = code;
      return res;
    };
    res.json = (body: any) => {
      res.responseBody = body;
      return res;
    };
    res.send = () => res;
    return res;
  };

  const createMockNext = (): any => {
    let capturedError: any = null;
    const nextFn: any = (err?: any) => {
      capturedError = err;
      // If error is captured, call errorHandler
      if (err) {
        return err;
      }
    };
    nextFn.getError = () => capturedError;
    return nextFn;
  };

  // Test 1: getUser with missing id
  try {
    console.log(`📝 Test 1: getUser with missing id...`);
    const req = createMockReq({ id: undefined });
    const res = createMockRes();
    const next = createMockNext();

    await getUser(req as Request, res as Response, next);

    // Check if error was passed to next()
    const error = next.getError();
    if (error) {
      // Call errorHandler to process the error
      errorHandler(error, req as Request, res as Response, (() => {}) as NextFunction);
    }

    if (res.statusCode === 400) {
      if (res.responseBody?.error === 'Missing user id') {
        console.log(`✅ Test 1 passed: Returns 400 with "Missing user id"`);
        testsPassed++;
      } else {
        throw new Error(
          `Expected error message "Missing user id", got: ${JSON.stringify(res.responseBody)}`
        );
      }
    } else {
      throw new Error(`Expected status 400, got: ${res.statusCode}`);
    }
  } catch (error: any) {
    console.error(`❌ Test 1 failed: ${error.message}`);
    testsFailed++;
  }

  // Test 2: updateExistingUser with missing id
  try {
    console.log(`\n📝 Test 2: updateExistingUser with missing id...`);
    const req = createMockReq({ id: undefined }, { id: 'test-user-id' });
    const res = createMockRes();
    const next = createMockNext();

    await updateExistingUser(req as Request, res as Response, next);

    // Check if error was passed to next()
    const error = next.getError();
    if (error) {
      // Call errorHandler to process the error
      errorHandler(error, req as Request, res as Response, (() => {}) as NextFunction);
    }

    if (res.statusCode === 400) {
      if (res.responseBody?.error === 'Missing user id') {
        console.log(`✅ Test 2 passed: Returns 400 with "Missing user id"`);
        testsPassed++;
      } else {
        throw new Error(
          `Expected error message "Missing user id", got: ${JSON.stringify(res.responseBody)}`
        );
      }
    } else {
      throw new Error(`Expected status 400, got: ${res.statusCode}`);
    }
  } catch (error: any) {
    console.error(`❌ Test 2 failed: ${error.message}`);
    testsFailed++;
  }

  // Test 3: removeUser with missing id
  try {
    console.log(`\n📝 Test 3: removeUser with missing id...`);
    const req = createMockReq({ id: undefined }, { id: 'test-user-id' });
    const res = createMockRes();
    const next = createMockNext();

    await removeUser(req as Request, res as Response, next);

    // Check if error was passed to next()
    const error = next.getError();
    if (error) {
      // Call errorHandler to process the error
      errorHandler(error, req as Request, res as Response, (() => {}) as NextFunction);
    }

    if (res.statusCode === 400) {
      if (res.responseBody?.error === 'Missing user id') {
        console.log(`✅ Test 3 passed: Returns 400 with "Missing user id"`);
        testsPassed++;
      } else {
        throw new Error(
          `Expected error message "Missing user id", got: ${JSON.stringify(res.responseBody)}`
        );
      }
    } else {
      throw new Error(`Expected status 400, got: ${res.statusCode}`);
    }
  } catch (error: any) {
    console.error(`❌ Test 3 failed: ${error.message}`);
    testsFailed++;
  }

  // Summary
  console.log(`\n📊 Test Summary:`);
  console.log(`   ✅ Passed: ${testsPassed}`);
  console.log(`   ❌ Failed: ${testsFailed}`);
  console.log(`   📈 Total: ${testsPassed + testsFailed}\n`);

  if (testsFailed > 0) {
    console.error(`❌ Some tests failed!\n`);
    process.exit(1);
  } else {
    console.log(`✅ All tests passed! 🎉\n`);
    process.exit(0);
  }
})();
