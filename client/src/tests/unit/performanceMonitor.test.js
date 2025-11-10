import { performanceMonitor } from "../../utils/performanceMonitor";

// Mock window.performance
const mockPerformance = {
  timing: {
    loadEventEnd: 2000,
    navigationStart: 1000,
    domContentLoadedEventEnd: 1500,
    responseStart: 1200,
  },
  memory: {
    usedJSHeapSize: 10485760, // 10MB
    totalJSHeapSize: 20971520, // 20MB
    jsHeapSizeLimit: 1073741824, // 1GB
  },
  getEntriesByType: jest.fn(),
  now: jest.fn(),
};

// Mock window.PerformanceObserver
global.PerformanceObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.addEventListener
global.addEventListener = jest.fn();

describe("Performance Monitor", () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup window.performance mock
    Object.defineProperty(window, "performance", {
      value: mockPerformance,
      writable: true,
    });

    // Reset performance.now mock
    mockPerformance.now.mockReturnValueOnce(0).mockReturnValueOnce(50);
  });

  describe("measurePageLoad", () => {
    test("should calculate page load metrics correctly", () => {
      const metrics = performanceMonitor.measurePageLoad();

      expect(metrics.loadTime).toBe(1000); // 2000 - 1000
      expect(metrics.domReadyTime).toBe(500); // 1500 - 1000
      expect(metrics.firstPaint).toBe(200); // 1200 - 1000
    });

    test("should return undefined when performance.timing is not available", () => {
      delete window.performance.timing;

      const metrics = performanceMonitor.measurePageLoad();

      expect(metrics).toBeUndefined();
    });
  });

  describe("measureRenderTime", () => {
    test("should calculate render time correctly", () => {
      mockPerformance.now.mockReturnValueOnce(100).mockReturnValueOnce(150);

      const renderTime = performanceMonitor.measureRenderTime(
        "TestComponent",
        100
      );

      expect(renderTime).toBe(50);
    });
  });

  describe("startMeasurement and endMeasurement", () => {
    test("should measure custom operation duration", () => {
      mockPerformance.now.mockReturnValueOnce(100).mockReturnValueOnce(250);

      const measurement = performanceMonitor.startMeasurement("test-operation");
      expect(measurement.name).toBe("test-operation");
      expect(measurement.startTime).toBe(100);

      const duration = performanceMonitor.endMeasurement(measurement);
      expect(duration).toBe(150);
    });
  });

  describe("monitorMemory", () => {
    test("should return memory usage when available", () => {
      const memory = performanceMonitor.monitorMemory();

      expect(memory.usedJSHeapSize).toBe(10485760);
      expect(memory.totalJSHeapSize).toBe(20971520);
      expect(memory.jsHeapSizeLimit).toBe(1073741824);
    });

    test("should return undefined when memory API is not available", () => {
      delete window.performance.memory;

      const memory = performanceMonitor.monitorMemory();

      expect(memory).toBeUndefined();
    });
  });

  describe("monitorNetworkRequests", () => {
    test("should identify slow requests", () => {
      const mockResources = [
        { name: "fast-request", duration: 500 },
        { name: "slow-request-1", duration: 1500 },
        { name: "slow-request-2", duration: 2000 },
      ];

      mockPerformance.getEntriesByType.mockReturnValue(mockResources);

      const resources = performanceMonitor.monitorNetworkRequests();

      expect(resources).toEqual(mockResources);
    });

    test("should return undefined when getEntriesByType is not available", () => {
      delete window.performance.getEntriesByType;

      const resources = performanceMonitor.monitorNetworkRequests();

      expect(resources).toBeUndefined();
    });
  });

  describe("init", () => {
    test("should initialize performance monitoring", () => {
      performanceMonitor.init();

      expect(window.addEventListener).toHaveBeenCalledWith(
        "load",
        expect.any(Function)
      );
    });

    test("should setup PerformanceObserver for long tasks", () => {
      performanceMonitor.init();

      expect(global.PerformanceObserver).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    test("should handle PerformanceObserver not being supported", () => {
      // Mock console.warn
      const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

      // Make PerformanceObserver throw an error
      global.PerformanceObserver.mockImplementationOnce(() => {
        throw new Error("Not supported");
      });

      performanceMonitor.init();

      expect(warnSpy).toHaveBeenCalledWith(
        "Long task monitoring not supported"
      );

      warnSpy.mockRestore();
    });
  });
});
