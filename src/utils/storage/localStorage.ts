
/**
 * Utility functions for working with localStorage safely
 */

/**
 * Get an item from localStorage with safe parsing
 * @param key The storage key
 * @returns The parsed value or null if not found
 */
export function getLocalStorage<T>(key: string): T | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return null;
  }
}

/**
 * Store an item in localStorage with safe stringification
 * @param key The storage key
 * @param value The value to store
 * @returns true if successful, false if failed
 */
export function setLocalStorage<T>(key: string, value: T): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
}

/**
 * Remove an item from localStorage
 * @param key The storage key
 * @returns true if successful, false if failed
 */
export function removeLocalStorage(key: string): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
}

/**
 * Check if localStorage has a specific key
 * @param key The storage key
 * @returns true if the key exists
 */
export function hasLocalStorage(key: string): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error checking ${key} in localStorage:`, error);
    return false;
  }
}

/**
 * Check if localStorage is available in the current environment
 * @returns true if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  
  try {
    // Try a test operation
    const testKey = '___test_key___';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}
