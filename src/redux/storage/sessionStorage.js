// src/redux/storage/sessionStorage.js
const sessionStorage = {
    getItem: (key) => {
      return new Promise((resolve) => {
        resolve(window.sessionStorage.getItem(key));
      });
    },
    setItem: (key, value) => {
      return new Promise((resolve) => {
        window.sessionStorage.setItem(key, value);
        resolve();
      });
    },
    removeItem: (key) => {
      return new Promise((resolve) => {
        window.sessionStorage.removeItem(key);
        resolve();
      });
    },
  };
  
  export default sessionStorage;
  