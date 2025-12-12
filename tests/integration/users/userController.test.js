"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = require("@/infrastructure/middleware/errorHandler");
// Dynamic import to avoid type checking issues during test compilation
let getUser;
let updateExistingUser;
let removeUser;
/**
 * Integration test for userController endpoints
 * Tests validation error handling (missing user id)
 * This test verifies the current behavior before refactoring to use BadRequestError
 */
(async () => {
    // Dynamic import after setup
    const controllerModule = await Promise.resolve().then(() => __importStar(require('@/features/users/userController')));
    getUser = controllerModule.getUser;
    updateExistingUser = controllerModule.updateExistingUser;
    removeUser = controllerModule.removeUser;
    console.log(`\n🧪 Starting UserController integration test...\n`);
    let testsPassed = 0;
    let testsFailed = 0;
    // Helper to create mock Express objects
    const createMockReq = (params = {}, user = null) => ({
        params,
        user,
    });
    const createMockRes = () => {
        const res = {
            statusCode: 200,
            responseBody: null,
        };
        res.status = (code) => {
            res.statusCode = code;
            return res;
        };
        res.json = (body) => {
            res.responseBody = body;
            return res;
        };
        res.send = () => res;
        return res;
    };
    const createMockNext = () => {
        let capturedError = null;
        const nextFn = (err) => {
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
        await getUser(req, res, next);
        // Check if error was passed to next()
        const error = next.getError();
        if (error) {
            // Call errorHandler to process the error
            (0, errorHandler_1.errorHandler)(error, req, res, (() => { }));
        }
        if (res.statusCode === 400) {
            if (res.responseBody?.error === 'Missing user id') {
                console.log(`✅ Test 1 passed: Returns 400 with "Missing user id"`);
                testsPassed++;
            }
            else {
                throw new Error(`Expected error message "Missing user id", got: ${JSON.stringify(res.responseBody)}`);
            }
        }
        else {
            throw new Error(`Expected status 400, got: ${res.statusCode}`);
        }
    }
    catch (error) {
        console.error(`❌ Test 1 failed: ${error.message}`);
        testsFailed++;
    }
    // Test 2: updateExistingUser with missing id
    try {
        console.log(`\n📝 Test 2: updateExistingUser with missing id...`);
        const req = createMockReq({ id: undefined }, { id: 'test-user-id' });
        const res = createMockRes();
        const next = createMockNext();
        await updateExistingUser(req, res, next);
        // Check if error was passed to next()
        const error = next.getError();
        if (error) {
            // Call errorHandler to process the error
            (0, errorHandler_1.errorHandler)(error, req, res, (() => { }));
        }
        if (res.statusCode === 400) {
            if (res.responseBody?.error === 'Missing user id') {
                console.log(`✅ Test 2 passed: Returns 400 with "Missing user id"`);
                testsPassed++;
            }
            else {
                throw new Error(`Expected error message "Missing user id", got: ${JSON.stringify(res.responseBody)}`);
            }
        }
        else {
            throw new Error(`Expected status 400, got: ${res.statusCode}`);
        }
    }
    catch (error) {
        console.error(`❌ Test 2 failed: ${error.message}`);
        testsFailed++;
    }
    // Test 3: removeUser with missing id
    try {
        console.log(`\n📝 Test 3: removeUser with missing id...`);
        const req = createMockReq({ id: undefined }, { id: 'test-user-id' });
        const res = createMockRes();
        const next = createMockNext();
        await removeUser(req, res, next);
        // Check if error was passed to next()
        const error = next.getError();
        if (error) {
            // Call errorHandler to process the error
            (0, errorHandler_1.errorHandler)(error, req, res, (() => { }));
        }
        if (res.statusCode === 400) {
            if (res.responseBody?.error === 'Missing user id') {
                console.log(`✅ Test 3 passed: Returns 400 with "Missing user id"`);
                testsPassed++;
            }
            else {
                throw new Error(`Expected error message "Missing user id", got: ${JSON.stringify(res.responseBody)}`);
            }
        }
        else {
            throw new Error(`Expected status 400, got: ${res.statusCode}`);
        }
    }
    catch (error) {
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
    }
    else {
        console.log(`✅ All tests passed! 🎉\n`);
        process.exit(0);
    }
})();
//# sourceMappingURL=userController.test.js.map