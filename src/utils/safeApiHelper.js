import {Alert} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const BASE_URL = 'https://jobipo.com/api/';

// Memory-safe JSON parsing
const safeJsonParse = (jsonString, fallback = null) => {
  try {
    if (typeof jsonString === 'string') {
      return JSON.parse(jsonString);
    }
    return jsonString;
  } catch (error) {
    // console.warn('JSON parsing failed:', error);
    return fallback;
  }
};

// Memory-safe data processing
const processApiResponse = (response, maxSize = 5 * 1024 * 1024) => {
  // 5MB limit
  try {
    const responseString = JSON.stringify(response);
    if (responseString.length > maxSize) {
      // console.warn('Response too large, truncating data');
      return null;
    }
    return response;
  } catch (error) {
    // console.warn('Response processing failed:', error);
    return null;
  }
};

// Check memory usage
const checkMemoryUsage = () => {
  try {
    if (global.performance && global.performance.memory) {
      const memory = global.performance.memory;
      const usedMB = memory.usedJSHeapSize / 1024 / 1024;
      const totalMB = memory.totalJSHeapSize / 1024 / 1024;

      if (usedMB > totalMB * 0.8) {
        // 80% memory usage
        // console.warn('High memory usage detected:', usedMB, 'MB');
        return false;
      }
    }
    return true;
  } catch (error) {
    return true; // Continue if memory check fails
  }
};

// Memory-safe fetch with timeout
const safeFetch = async (url, options = {}, timeout = 30000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

// Enhanced API helper with memory management
export const safePost = async ({
  url,
  data,
  header = {'Content-Type': 'application/json'},
}) => {
  try {
    // Check memory before making request
    if (!checkMemoryUsage()) {
      throw new Error('Insufficient memory');
    }

    const isConnected = await NetInfo.fetch();
    if (!isConnected.isConnected) {
      return {status: 0, message: 'No internet connection'};
    }

    const params = {
      method: 'POST',
      headers: {
        ...header,
        ...(global.userToken && {Authorization: 'Bearer ' + global.userToken}),
      },
      body: typeof data === 'string' ? data : JSON.stringify(data),
    };

    const response = await safeFetch(BASE_URL + url, params);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseText = await response.text();
    const json = safeJsonParse(responseText);

    if (!json) {
      throw new Error('Invalid response format');
    }

    // Process response with memory limits
    const processedResponse = processApiResponse(json);
    if (!processedResponse) {
      throw new Error('Response too large');
    }

    return processedResponse;
  } catch (error) {
    // console.error('API Error:', error);
    return {
      status: 0,
      message: error.message || 'Network error occurred',
    };
  }
};

export const safeGet = async ({url, timeout = 30000}) => {
  try {
    if (!checkMemoryUsage()) {
      throw new Error('Insufficient memory');
    }

    const isConnected = await NetInfo.fetch();
    if (!isConnected.isConnected) {
      return {status: 0, message: 'No internet connection'};
    }

    const params = {
      method: 'GET',
      headers: {
        ...(global.userToken && {Authorization: 'Bearer ' + global.userToken}),
      },
    };

    const response = await safeFetch(BASE_URL + url, params, timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseText = await response.text();
    const json = safeJsonParse(responseText);

    if (!json) {
      throw new Error('Invalid response format');
    }

    const processedResponse = processApiResponse(json);
    if (!processedResponse) {
      throw new Error('Response too large');
    }

    return processedResponse;
  } catch (error) {
    // console.error('API Error:', error);
    return {
      status: 0,
      message: error.message || 'Network error occurred',
    };
  }
};

// Memory cleanup utility
export const cleanupMemory = () => {
  try {
    if (global.gc) {
      global.gc();
    }
  } catch (error) {
    // console.warn('Memory cleanup failed:', error);
  }
};

// Safe data processing for large datasets
export const processLargeData = (data, maxItems = 100) => {
  try {
    if (Array.isArray(data) && data.length > maxItems) {
      // console.warn(`Data truncated from ${data.length} to ${maxItems} items`);
      return data.slice(0, maxItems);
    }
    return data;
  } catch (error) {
    // console.warn('Data processing failed:', error);
    return [];
  }
};
