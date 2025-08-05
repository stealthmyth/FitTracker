// Storage utility with error handling and fallback
class StorageManager {
  constructor() {
    this.isLocalStorageAvailable = this.checkLocalStorageAvailability();
    this.fallbackStorage = new Map();
  }

  checkLocalStorageAvailability() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage not available, using fallback storage');
      return false;
    }
  }

  setItem(key, value) {
    try {
      if (this.isLocalStorageAvailable) {
        localStorage.setItem(key, value);
      } else {
        this.fallbackStorage.set(key, value);
      }
    } catch (e) {
      console.error('Error saving data:', e);
      this.fallbackStorage.set(key, value);
    }
  }

  getItem(key) {
    try {
      if (this.isLocalStorageAvailable) {
        return localStorage.getItem(key);
      } else {
        return this.fallbackStorage.get(key) || null;
      }
    } catch (e) {
      console.error('Error reading data:', e);
      return this.fallbackStorage.get(key) || null;
    }
  }

  removeItem(key) {
    try {
      if (this.isLocalStorageAvailable) {
        localStorage.removeItem(key);
      } else {
        this.fallbackStorage.delete(key);
      }
    } catch (e) {
      console.error('Error removing data:', e);
      this.fallbackStorage.delete(key);
    }
  }

  clear() {
    try {
      if (this.isLocalStorageAvailable) {
        localStorage.clear();
      } else {
        this.fallbackStorage.clear();
      }
    } catch (e) {
      console.error('Error clearing data:', e);
      this.fallbackStorage.clear();
    }
  }
}

// Create singleton instance
const storage = new StorageManager();

export default storage;

