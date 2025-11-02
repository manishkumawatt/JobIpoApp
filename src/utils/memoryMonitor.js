import {Alert} from 'react-native';

class MemoryMonitor {
  constructor() {
    this.memoryThreshold = 0.8; // 80% memory usage threshold
    this.checkInterval = 30000; // Check every 30 seconds
    this.intervalId = null;
    this.isMonitoring = false;
  }

  startMonitoring() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.intervalId = setInterval(() => {
      this.checkMemoryUsage();
    }, this.checkInterval);
  }

  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isMonitoring = false;
  }

  checkMemoryUsage() {
    try {
      if (global.performance && global.performance.memory) {
        const memory = global.performance.memory;
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        const totalMB = memory.totalJSHeapSize / 1024 / 1024;
        const usagePercentage = usedMB / totalMB;

        // // console.log(
        //   `Memory usage: ${usedMB.toFixed(2)}MB / ${totalMB.toFixed(2)}MB (${(usagePercentage * 100).toFixed(1)}%)`,
        // );

        if (usagePercentage > this.memoryThreshold) {
          // console.warn('High memory usage detected, triggering cleanup');
          this.triggerMemoryCleanup();
        }
      }
    } catch (error) {
      // console.warn('Memory monitoring error:', error);
    }
  }

  triggerMemoryCleanup() {
    try {
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
        // // console.log('Garbage collection triggered');
      }

      // Clear any cached data
      this.clearCaches();
    } catch (error) {
      // console.warn('Memory cleanup error:', error);
    }
  }

  clearCaches() {
    try {
      // Clear any global caches or temporary data
      if (global.tempCache) {
        global.tempCache.clear();
      }

      // Clear any image caches
      if (global.ImageCache) {
        global.ImageCache.clear();
      }
    } catch (error) {
      // console.warn('Cache clearing error:', error);
    }
  }

  getMemoryInfo() {
    try {
      if (global.performance && global.performance.memory) {
        const memory = global.performance.memory;
        return {
          used: memory.usedJSHeapSize / 1024 / 1024,
          total: memory.totalJSHeapSize / 1024 / 1024,
          limit: memory.jsHeapSizeLimit / 1024 / 1024,
          usagePercentage:
            (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
        };
      }
      return null;
    } catch (error) {
      // console.warn('Memory info error:', error);
      return null;
    }
  }

  // Method to check if device has low memory
  isLowMemoryDevice() {
    try {
      const memoryInfo = this.getMemoryInfo();
      if (memoryInfo) {
        // Consider device low memory if total heap is less than 100MB
        return memoryInfo.total < 100;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  // Method to get recommended limits based on device memory
  getRecommendedLimits() {
    const isLowMemory = this.isLowMemoryDevice();

    return {
      maxListItems: isLowMemory ? 20 : 50,
      maxImageSize: isLowMemory ? 1024 : 2048,
      maxCacheSize: isLowMemory ? 10 : 50,
      maxApiResponseSize: isLowMemory ? 1024 * 1024 : 5 * 1024 * 1024, // 1MB vs 5MB
    };
  }
}

// Create singleton instance
const memoryMonitor = new MemoryMonitor();

export default memoryMonitor;
