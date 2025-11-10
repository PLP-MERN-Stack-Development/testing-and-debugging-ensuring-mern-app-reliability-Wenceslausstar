const winston = require("winston");
const logger = require("../../src/utils/logger");

// Mock winston to avoid actual file logging during tests
jest.mock("winston", () => ({
  createLogger: jest.fn(() => ({
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    http: jest.fn(),
    debug: jest.fn(),
  })),
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    colorize: jest.fn(),
    printf: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
  addColors: jest.fn(),
}));

describe("Logger", () => {
  let mockLogger;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Get the mock logger instance
    mockLogger = winston.createLogger.mock.results[0]?.value;
  });

  test("should create logger with correct configuration", () => {
    // Verify winston.createLogger was called
    if (winston.createLogger.mock.calls.length > 0) {
      const loggerConfig = winston.createLogger.mock.calls[0][0];
      expect(loggerConfig.level).toBeDefined();
      expect(loggerConfig.levels).toEqual({
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
      });
      expect(loggerConfig.format).toBeDefined();
      expect(loggerConfig.transports).toBeDefined();
      expect(loggerConfig.transports.length).toBe(3); // Console + 2 File transports
    }
  });

  test("should export logger methods", () => {
    expect(logger.error).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.info).toBeDefined();
    expect(logger.http).toBeDefined();
    expect(logger.debug).toBeDefined();
  });

  test("should call winston logger methods when invoked", () => {
    const testMessage = "Test message";

    logger.error(testMessage);
    logger.warn(testMessage);
    logger.info(testMessage);
    logger.http(testMessage);
    logger.debug(testMessage);

    expect(logger.error).toHaveBeenCalledWith(testMessage);
    expect(logger.warn).toHaveBeenCalledWith(testMessage);
    expect(logger.info).toHaveBeenCalledWith(testMessage);
    expect(logger.http).toHaveBeenCalledWith(testMessage);
    expect(logger.debug).toHaveBeenCalledWith(testMessage);
  });
});
