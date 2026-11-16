class StorageService {
  constructor(prefix) {
    this.prefix = prefix;
    this.available = StorageService.checkAvailable();
  }

  static checkAvailable() {
    try {
      const testKey = "__saffron_test__";
      localStorage.setItem(testKey, "1");
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  key(name) {
    return this.prefix + ":" + name;
  }

  get(name, fallback, isValid) {
    if (!this.available) return fallback;
    try {
      const raw = localStorage.getItem(this.key(name));
      if (raw === null) return fallback;
      const value = JSON.parse(raw);
      if (isValid && !isValid(value)) {
        this.remove(name);
        return fallback;
      }
      return value;
    } catch (error) {
      this.remove(name);
      return fallback;
    }
  }

  set(name, value) {
    if (!this.available) return false;
    try {
      localStorage.setItem(this.key(name), JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  remove(name) {
    if (!this.available) return;
    try {
      localStorage.removeItem(this.key(name));
    } catch (error) {
    }
  }
}

const appStore = new StorageService("saffron");
