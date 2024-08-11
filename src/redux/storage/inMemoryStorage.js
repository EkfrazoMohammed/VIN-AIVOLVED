// src/storage/inMemoryStorage.js
class InMemoryStorage {
    constructor() {
      this.storage = {};
    }
  
    getItem(key) {
      return Promise.resolve(this.storage[key] || null);
    }
  
    setItem(key, value) {
      this.storage[key] = value;
      return Promise.resolve();
    }
  
    removeItem(key) {
      delete this.storage[key];
      return Promise.resolve();
    }
  }
  
  export default new InMemoryStorage();
  