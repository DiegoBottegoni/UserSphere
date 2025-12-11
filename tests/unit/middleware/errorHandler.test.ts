import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '@/infrastructure/middleware/errorHandler';
import { AppError } from '@/infrastructure/errors/AppError';
import { ServiceUnavailableError } from '@/infrastructure/errors/ServiceUnavailableError';
import { UnauthorizedError } from '@/infrastructure/errors/UnauthorizedError';
import { BadRequestError } from '@/infrastructure/errors/BadRequestError';

/**
 * Unit tests for errorHandler middleware
 * Tests that ServiceUnavailableError, UnauthorizedError, and BadRequestError are properly recognized and handled
 */
(async () => {
  console.log(`\n🧪 Starting errorHandler unit tests...\n`);

  let testsPassed = 0;
  let testsFailed = 0;

  // Helper to create mock Express request object
  const createMockReq = (): Partial<Request> => ({});

  // Helper to create mock Express response object
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
    return res;
  };

  // Test 1: ServiceUnavailableError with default message
  try {
    console.log(`📝 Test 1: ServiceUnavailableError with default message...`);
    const req = {} as Request;
    const res = createMockRes();
    const next = (() => {}) as NextFunction;

    const error = new ServiceUnavailableError();
    errorHandler(error as any, req, res as Response, next);

    if (res.statusCode === 503) {
      if (res.responseBody?.error === 'Service unavailable. Please try again later.') {
        console.log(`✅ Test 1 passed: Returns 503 with default message`);
        testsPassed++;
      } else {
        throw new Error(
          `Expected error message "Service unavailable. Please try again later.", got: ${JSON.stringify(
            res.responseBody
          )}`
        );
      }
    } else {
      throw new Error(`Expected status 503, got: ${res.statusCode}`);
    }
  } catch (error: any) {
    console.error(`❌ Test 1 failed: ${error.message}`);
    testsFailed++;
  }

  // Test 2: ServiceUnavailableError with custom message
  try {
    console.log(`\n📝 Test 2: ServiceUnavailableError with custom message...`);
    const req = {} as Request;
    const res = createMockRes();
    const next = (() => {}) as NextFunction;

    const error = new ServiceUnavailableError('Database unavailable');
    errorHandler(error as any, req, res as Response, next);

    if (res.statusCode === 503) {
      if (res.responseBody?.error === 'Database unavailable') {
        console.log(`✅ Test 2 passed: Returns 503 with custom message`);
        testsPassed++;
      } else {
        throw new Error(
          `Expected error message "Database unavailable", got: ${JSON.stringify(res.responseBody)}`
        );
      }
    } else {
      throw new Error(`Expected status 503, got: ${res.statusCode}`);
    }
  } catch (error: any) {
    console.error(`❌ Test 2 failed: ${error.message}`);
    testsFailed++;
  }

  // Test 3: Verify ServiceUnavailableError is instanceof AppError
  try {
    console.log(`\n📝 Test 3: ServiceUnavailableError instanceof AppError...`);
    const error = new ServiceUnavailableError();
    if (error instanceof AppError) {
      console.log(`✅ Test 3 passed: ServiceUnavailableError extends AppError`);
      testsPassed++;
    } else {
      throw new Error('ServiceUnavailableError is not an instance of AppError');
    }
  } catch (error: any) {
    console.error(`❌ Test 3 failed: ${error.message}`);
    testsFailed++;
  }

  // Test 4: Verify errorHandler treats ServiceUnavailableError same as AppError(503)
  try {
    console.log(`\n📝 Test 4: ServiceUnavailableError handled same as AppError(503)...`);
    const req1 = {} as Request;
    const res1 = createMockRes();
    const next1 = (() => {}) as NextFunction;

    const req2 = {} as Request;
    const res2 = createMockRes();
    const next2 = (() => {}) as NextFunction;

    const serviceUnavailableError = new ServiceUnavailableError('Database unavailable');
    const appError503 = new AppError(503, 'Database unavailable');

    errorHandler(serviceUnavailableError as any, req1, res1 as Response, next1);
    errorHandler(appError503 as any, req2, res2 as Response, next2);

    const status1 = res1.statusCode;
    const status2 = res2.statusCode;
    const message1 = res1.responseBody?.error;
    const message2 = res2.responseBody?.error;

    if (status1 === status2 && status1 === 503 && message1 === message2) {
      console.log(`✅ Test 4 passed: Both errors handled identically`);
      testsPassed++;
    } else {
      throw new Error(
        `Errors handled differently. ServiceUnavailableError: ${status1}/${message1}, AppError(503): ${status2}/${message2}`
      );
    }
  } catch (error: any) {
    console.error(`❌ Test 4 failed: ${error.message}`);
    testsFailed++;
  }

  // Test 5: Verify statusCode property is 503
  try {
    console.log(`\n📝 Test 5: ServiceUnavailableError has statusCode 503...`);
    const error = new ServiceUnavailableError();
    if (error.statusCode === 503) {
      console.log(`✅ Test 5 passed: statusCode is 503`);
      testsPassed++;
    } else {
      throw new Error(`Expected statusCode 503, got: ${error.statusCode}`);
    }
  } catch (error: any) {
    console.error(`❌ Test 5 failed: ${error.message}`);
    testsFailed++;
  }

  // Test 6: UnauthorizedError with default message
  try {
    console.log(`\n📝 Test 6: UnauthorizedError with default message...`);
    const req = createMockReq();
    const res = createMockRes();
    const next = (() => {}) as NextFunction;

    const error = new UnauthorizedError();
    errorHandler(error as any, req as Request, res as Response, next);

    if (res.statusCode === 401) {
      if (
        res.responseBody?.error === 'Unauthorized. Please authenticate to access this resource.'
      ) {
        console.log(`✅ Test 6 passed: Returns 401 with default message`);
        testsPassed++;
      } else {
        throw new Error(
          `Expected error message "Unauthorized. Please authenticate to access this resource.", got: ${JSON.stringify(
            res.responseBody
          )}`
        );
      }
    } else {
      throw new Error(`Expected status 401, got: ${res.statusCode}`);
    }
  } catch (error: any) {
    console.error(`❌ Test 6 failed: ${error.message}`);
    testsFailed++;
  }

  // Test 7: UnauthorizedError with custom message
  try {
    console.log(`\n📝 Test 7: UnauthorizedError with custom message...`);
    const req = createMockReq();
    const res = createMockRes();
    const next = (() => {}) as NextFunction;

    const error = new UnauthorizedError('Invalid token');
    errorHandler(error as any, req as Request, res as Response, next);

    if (res.statusCode === 401) {
      if (res.responseBody?.error === 'Invalid token') {
        console.log(`✅ Test 7 passed: Returns 401 with custom message`);
        testsPassed++;
      } else {
        throw new Error(
          `Expected error message "Invalid token", got: ${JSON.stringify(res.responseBody)}`
        );
      }
    } else {
      throw new Error(`Expected status 401, got: ${res.statusCode}`);
    }
  } catch (error: any) {
    console.error(`❌ Test 7 failed: ${error.message}`);
    testsFailed++;
  }

  // Test 8: Verify UnauthorizedError is instanceof AppError
  try {
    console.log(`\n📝 Test 8: UnauthorizedError instanceof AppError...`);
    const error = new UnauthorizedError();
    if (error instanceof AppError) {
      console.log(`✅ Test 8 passed: UnauthorizedError extends AppError`);
      testsPassed++;
    } else {
      throw new Error('UnauthorizedError is not an instance of AppError');
    }
  } catch (error: any) {
    console.error(`❌ Test 8 failed: ${error.message}`);
    testsFailed++;
  }

  // Test 9: Verify errorHandler treats UnauthorizedError same as AppError(401)
  try {
    console.log(`\n📝 Test 9: UnauthorizedError handled same as AppError(401)...`);
    const req1 = createMockReq();
    const res1 = createMockRes();
    const next1 = (() => {}) as NextFunction;

    const req2 = createMockReq();
    const res2 = createMockRes();
    const next2 = (() => {}) as NextFunction;

    const unauthorizedError = new UnauthorizedError('Invalid token');
    const appError401 = new AppError(401, 'Invalid token');

    errorHandler(unauthorizedError as any, req1 as Request, res1 as Response, next1);
    errorHandler(appError401 as any, req2 as Request, res2 as Response, next2);

    const status1 = res1.statusCode;
    const status2 = res2.statusCode;
    const message1 = res1.responseBody?.error;
    const message2 = res2.responseBody?.error;

    if (status1 === status2 && status1 === 401 && message1 === message2) {
      console.log(`✅ Test 9 passed: Both errors handled identically`);
      testsPassed++;
    } else {
      throw new Error(
        `Errors handled differently. UnauthorizedError: ${status1}/${message1}, AppError(401): ${status2}/${message2}`
      );
    }
  } catch (error: any) {
    console.error(`❌ Test 9 failed: ${error.message}`);
    testsFailed++;
  }

  // Test 10: Verify statusCode property is 401
  try {
    console.log(`\n📝 Test 10: UnauthorizedError has statusCode 401...`);
    const error = new UnauthorizedError();
    if (error.statusCode === 401) {
      console.log(`✅ Test 10 passed: statusCode is 401`);
      testsPassed++;
    } else {
      throw new Error(`Expected statusCode 401, got: ${error.statusCode}`);
    }
  } catch (error: any) {
    console.error(`❌ Test 10 failed: ${error.message}`);
    testsFailed++;
  }

  // Test 11: BadRequestError with default message
  try {
    console.log(`\n📝 Test 11: BadRequestError with default message...`);
    const req = createMockReq();
    const res = createMockRes();
    const next = (() => {}) as NextFunction;

    const error = new BadRequestError();
    errorHandler(error as any, req as Request, res as Response, next);

    if (res.statusCode === 400) {
      if (res.responseBody?.error === 'Bad request. Please check your input and try again.') {
        console.log(`✅ Test 11 passed: Returns 400 with default message`);
        testsPassed++;
      } else {
        throw new Error(
          `Expected error message "Bad request. Please check your input and try again.", got: ${JSON.stringify(
            res.responseBody
          )}`
        );
      }
    } else {
      throw new Error(`Expected status 400, got: ${res.statusCode}`);
    }
  } catch (error: any) {
    console.error(`❌ Test 11 failed: ${error.message}`);
    testsFailed++;
  }

  // Test 12: BadRequestError with custom message
  try {
    console.log(`\n📝 Test 12: BadRequestError with custom message...`);
    const req = createMockReq();
    const res = createMockRes();
    const next = (() => {}) as NextFunction;

    const error = new BadRequestError('You cannot send a friendship request to yourself.');
    errorHandler(error as any, req as Request, res as Response, next);

    if (res.statusCode === 400) {
      if (res.responseBody?.error === 'You cannot send a friendship request to yourself.') {
        console.log(`✅ Test 12 passed: Returns 400 with custom message`);
        testsPassed++;
      } else {
        throw new Error(
          `Expected error message "You cannot send a friendship request to yourself.", got: ${JSON.stringify(
            res.responseBody
          )}`
        );
      }
    } else {
      throw new Error(`Expected status 400, got: ${res.statusCode}`);
    }
  } catch (error: any) {
    console.error(`❌ Test 12 failed: ${error.message}`);
    testsFailed++;
  }

  // Test 13: Verify BadRequestError is instanceof AppError
  try {
    console.log(`\n📝 Test 13: BadRequestError instanceof AppError...`);
    const error = new BadRequestError();
    if (error instanceof AppError) {
      console.log(`✅ Test 13 passed: BadRequestError extends AppError`);
      testsPassed++;
    } else {
      throw new Error('BadRequestError is not an instance of AppError');
    }
  } catch (error: any) {
    console.error(`❌ Test 13 failed: ${error.message}`);
    testsFailed++;
  }

  // Test 14: Verify errorHandler treats BadRequestError same as AppError(400)
  try {
    console.log(`\n📝 Test 14: BadRequestError handled same as AppError(400)...`);
    const req1 = createMockReq();
    const res1 = createMockRes();
    const next1 = (() => {}) as NextFunction;

    const req2 = createMockReq();
    const res2 = createMockRes();
    const next2 = (() => {}) as NextFunction;

    const badRequestError = new BadRequestError('Invalid operation');
    const appError400 = new AppError(400, 'Invalid operation');

    errorHandler(badRequestError as any, req1 as Request, res1 as Response, next1);
    errorHandler(appError400 as any, req2 as Request, res2 as Response, next2);

    const status1 = res1.statusCode;
    const status2 = res2.statusCode;
    const message1 = res1.responseBody?.error;
    const message2 = res2.responseBody?.error;

    if (status1 === status2 && status1 === 400 && message1 === message2) {
      console.log(`✅ Test 14 passed: Both errors handled identically`);
      testsPassed++;
    } else {
      throw new Error(
        `Errors handled differently. BadRequestError: ${status1}/${message1}, AppError(400): ${status2}/${message2}`
      );
    }
  } catch (error: any) {
    console.error(`❌ Test 14 failed: ${error.message}`);
    testsFailed++;
  }

  // Test 15: Verify statusCode property is 400
  try {
    console.log(`\n📝 Test 15: BadRequestError has statusCode 400...`);
    const error = new BadRequestError();
    if (error.statusCode === 400) {
      console.log(`✅ Test 15 passed: statusCode is 400`);
      testsPassed++;
    } else {
      throw new Error(`Expected statusCode 400, got: ${error.statusCode}`);
    }
  } catch (error: any) {
    console.error(`❌ Test 15 failed: ${error.message}`);
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
