import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '@/infrastructure/middleware/errorHandler';
import { AppError } from '@/infrastructure/errors/AppError';
import { ServiceUnavailableError } from '@/infrastructure/errors/ServiceUnavailableError';

/**
 * Unit tests for errorHandler middleware
 * Tests that ServiceUnavailableError is properly recognized and handled
 */
(async () => {
  console.log(`\n🧪 Starting errorHandler unit tests...\n`);

  let testsPassed = 0;
  let testsFailed = 0;

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
