// Performance monitoring utilities
export const performanceMonitor = {
  // Measure page load performance
  measurePageLoad() {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      const domReadyTime =
        timing.domContentLoadedEventEnd - timing.navigationStart;
      const firstPaint = timing.responseStart - timing.navigationStart;

      console.log("Performance Metrics:", {
        "Page Load Time": `${loadTime}ms`,
        "DOM Ready Time": `${domReadyTime}ms`,
        "First Paint": `${firstPaint}ms`,
      });

      return {
        loadTime,
        domReadyTime,
        firstPaint,
      };
    }
  },

  // Measure component render time
  measureRenderTime(componentName, startTime) {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
    return renderTime;
  },

  // Start measuring a custom operation
  startMeasurement(name) {
    return {
      name,
      startTime: performance.now(),
    };
  },

  // End measuring a custom operation
  endMeasurement(measurement) {
    const endTime = performance.now();
    const duration = endTime - measurement.startTime;
    console.log(`${measurement.name} duration: ${duration.toFixed(2)}ms`);
    return duration;
  },

  // Monitor memory usage (if available)
  monitorMemory() {
    if (window.performance && window.performance.memory) {
      const memory = window.performance.memory;
      console.log("Memory Usage:", {
        "Used JS Heap Size": `${(memory.usedJSHeapSize / 1048576).toFixed(
          2
        )} MB`,
        "Total JS Heap Size": `${(memory.totalJSHeapSize / 1048576).toFixed(
          2
        )} MB`,
        "JS Heap Size Limit": `${(memory.jsHeapSizeLimit / 1048576).toFixed(
          2
        )} MB`,
      });
      return memory;
    }
  },

  // Monitor network requests
  monitorNetworkRequests() {
    if (window.performance && window.performance.getEntriesByType) {
      const resources = window.performance.getEntriesByType("resource");
      const slowRequests = resources.filter((entry) => entry.duration > 1000); // Requests taking more than 1 second

      if (slowRequests.length > 0) {
        console.warn("Slow network requests detected:");
        slowRequests.forEach((request) => {
          console.warn(`- ${request.name}: ${request.duration.toFixed(2)}ms`);
        });
      }

      return resources;
    }
  },

  // Initialize performance monitoring
  init() {
    // Measure page load on load event
    window.addEventListener("load", () => {
      setTimeout(() => {
        this.measurePageLoad();
        this.monitorMemory();
        this.monitorNetworkRequests();
      }, 0);
    });

    // Monitor for long tasks (tasks taking more than 50ms)
    if (window.PerformanceObserver) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === "longtask") {
              console.warn(
                `Long task detected: ${entry.duration.toFixed(2)}ms`
              );
            }
          }
        });
        observer.observe({ entryTypes: ["longtask"] });
      } catch (e) {
        console.warn("Long task monitoring not supported");
      }
    }
  },
};

// Initialize performance monitoring when module is loaded
if (typeof window !== "undefined") {
  performanceMonitor.init();
}
