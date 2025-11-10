const {
  errorHandler,
  notFoundHandler,
  requestLogger,
} = require("../../src/middleware/errorHandler");

// Mock the logger
jest.mock("../../src/utils/logger", () => ({
  error: jest.fn(),
  warn: jest.fn(),
  http: jest.fn(),
  info: jest.fn(),
}));

const logger = require("../../src/utils/logger");

describe("Error Handler Middleware", () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      method: "GET",
      url: "/test",
      ip: "127.0.0.1",
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      on: jest.fn(),
      statusCode: 200,
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe("errorHandler", () => {
    test("should handle ValidationError with 400 status", () => {
      const error = new Error("Validation failed");
      error.name = "ValidationError";

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(logger.error).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Validation Error",
      });
    });

    test("should handle CastError with 400 status", () => {
      const error = new Error("Invalid ID");
      error.name = "CastError";

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid ID format",
      });
    });

    test("should handle JsonWebTokenError with 401 status", () => {
      const error = new Error("Invalid token");
      error.name = "JsonWebTokenError";

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid token",
      });
    });

    test("should handle TokenExpiredError with 401 status", () => {
      const error = new Error("Token expired");
      error.name = "TokenExpiredError";

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Token expired",
      });
    });

    test("should handle duplicate field error with 400 status", () => {
      const error = new Error("Duplicate field");
      error.code = 11000;

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Duplicate field value",
      });
    });

    test("should handle generic errors with 500 status", () => {
      const error = new Error("Something went wrong");

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(logger.error).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal Server Error",
      });
    });

    test("should include stack trace in development", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      const error = new Error("Test error");
      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal Server Error",
        stack: error.stack,
      });

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe("notFoundHandler", () => {
    test("should return 404 for undefined routes", () => {
      notFoundHandler(mockReq, mockRes, mockNext);

      expect(logger.warn).toHaveBeenCalledWith(
        "404 - Route not found: GET /test"
      );
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Route not found",
      });
    });
  });

  describe("requestLogger", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test("should log incoming requests", () => {
      requestLogger(mockReq, mockRes, mockNext);

      expect(logger.http).toHaveBeenCalledWith("GET /test - IP: 127.0.0.1");

      const finishCall = mockRes.on.mock.calls.find(
        (call) => call[0] === "finish"
      );

      if (finishCall) {
        finishCall[1]();
      }

      expect(logger.http).toHaveBeenCalledTimes(2);

      expect(logger.http).toHaveBeenNthCalledWith(2, "GET /test - 200 - 50ms");
      expect(mockNext).toHaveBeenCalled();
    });

    test("should log response time when request finishes", () => {
      // Mock Date.now to control timing
      const mockNow = jest.fn();
      mockNow.mockReturnValueOnce(1000); // Start time
      mockNow.mockReturnValueOnce(1050); // End time

      global.Date.now = mockNow;

      // Mock res.on to simulate finish event
      mockRes.on = jest.fn((event, callback) => {
        if (event === "finish") {
          callback();
        }
      });

      requestLogger(mockReq, mockRes, mockNext);

      expect(logger.http).toHaveBeenCalledWith("GET /test - 200 - 50ms");
    });
  });
});
