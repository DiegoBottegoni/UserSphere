"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = require("@/infrastructure/middleware/errorHandler");
const AppError_1 = require("@/infrastructure/errors/AppError");
const ServiceUnavailableError_1 = require("@/infrastructure/errors/ServiceUnavailableError");
const UnauthorizedError_1 = require("@/infrastructure/errors/UnauthorizedError");
const BadRequestError_1 = require("@/infrastructure/errors/BadRequestError");
// Helper to create mock Express request object
const createMockReq = () => ({});
// Helper to create mock Express response object
const createMockRes = () => {
    const res = {
        statusCode: 200,
        responseBody: null,
    };
    res.status = jest.fn((code) => {
        res.statusCode = code;
        return res;
    });
    res.json = jest.fn((body) => {
        res.responseBody = body;
        return res;
    });
    return res;
};
describe('errorHandler Middleware', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = createMockReq();
        res = createMockRes();
        next = jest.fn();
    });
    describe('ServiceUnavailableError', () => {
        it('should return 503 with default message', () => {
            const error = new ServiceUnavailableError_1.ServiceUnavailableError();
            (0, errorHandler_1.errorHandler)(error, req, res, next);
            expect(res.status).toHaveBeenCalledWith(503);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Service unavailable. Please try again later.',
            });
        });
        it('should return 503 with custom message', () => {
            const error = new ServiceUnavailableError_1.ServiceUnavailableError('Database unavailable');
            (0, errorHandler_1.errorHandler)(error, req, res, next);
            expect(res.status).toHaveBeenCalledWith(503);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Database unavailable',
            });
        });
        it('should be an instance of AppError', () => {
            const error = new ServiceUnavailableError_1.ServiceUnavailableError();
            expect(error).toBeInstanceOf(AppError_1.AppError);
        });
        it('should result in same response as AppError(503)', () => {
            const res2 = createMockRes();
            const next2 = jest.fn();
            const serviceUnavailableError = new ServiceUnavailableError_1.ServiceUnavailableError('Database unavailable');
            const appError503 = new AppError_1.AppError(503, 'Database unavailable');
            (0, errorHandler_1.errorHandler)(serviceUnavailableError, req, res, next);
            (0, errorHandler_1.errorHandler)(appError503, req, res2, next2);
            expect(res.statusCode).toBe(res2.statusCode);
            expect(res.responseBody).toEqual(res2.responseBody);
        });
        it('should have statusCode property 503', () => {
            const error = new ServiceUnavailableError_1.ServiceUnavailableError();
            expect(error.statusCode).toBe(503);
        });
    });
    describe('UnauthorizedError', () => {
        it('should return 401 with default message', () => {
            const error = new UnauthorizedError_1.UnauthorizedError();
            (0, errorHandler_1.errorHandler)(error, req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Unauthorized. Please authenticate to access this resource.',
            });
        });
        it('should return 401 with custom message', () => {
            const error = new UnauthorizedError_1.UnauthorizedError('Invalid token');
            (0, errorHandler_1.errorHandler)(error, req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Invalid token',
            });
        });
        it('should be an instance of AppError', () => {
            const error = new UnauthorizedError_1.UnauthorizedError();
            expect(error).toBeInstanceOf(AppError_1.AppError);
        });
        it('should result in same response as AppError(401)', () => {
            const res2 = createMockRes();
            const next2 = jest.fn();
            const unauthorizedError = new UnauthorizedError_1.UnauthorizedError('Invalid token');
            const appError401 = new AppError_1.AppError(401, 'Invalid token');
            (0, errorHandler_1.errorHandler)(unauthorizedError, req, res, next);
            (0, errorHandler_1.errorHandler)(appError401, req, res2, next2);
            expect(res.statusCode).toBe(res2.statusCode);
            expect(res.responseBody).toEqual(res2.responseBody);
        });
        it('should have statusCode property 401', () => {
            const error = new UnauthorizedError_1.UnauthorizedError();
            expect(error.statusCode).toBe(401);
        });
    });
    describe('BadRequestError', () => {
        it('should return 400 with default message', () => {
            const error = new BadRequestError_1.BadRequestError();
            (0, errorHandler_1.errorHandler)(error, req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Bad request. Please check your input and try again.',
            });
        });
        it('should return 400 with custom message', () => {
            const error = new BadRequestError_1.BadRequestError('You cannot send a friendship request to yourself.');
            (0, errorHandler_1.errorHandler)(error, req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'You cannot send a friendship request to yourself.',
            });
        });
        it('should be an instance of AppError', () => {
            const error = new BadRequestError_1.BadRequestError();
            expect(error).toBeInstanceOf(AppError_1.AppError);
        });
        it('should result in same response as AppError(400)', () => {
            const res2 = createMockRes();
            const next2 = jest.fn();
            const badRequestError = new BadRequestError_1.BadRequestError('Invalid operation');
            const appError400 = new AppError_1.AppError(400, 'Invalid operation');
            (0, errorHandler_1.errorHandler)(badRequestError, req, res, next);
            (0, errorHandler_1.errorHandler)(appError400, req, res2, next2);
            expect(res.statusCode).toBe(res2.statusCode);
            expect(res.responseBody).toEqual(res2.responseBody);
        });
        it('should have statusCode property 400', () => {
            const error = new BadRequestError_1.BadRequestError();
            expect(error.statusCode).toBe(400);
        });
    });
});
//# sourceMappingURL=errorHandler.test.js.map