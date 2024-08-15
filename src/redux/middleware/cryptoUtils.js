// cryptoUtils.js
import CryptoJS from 'crypto-js';

const SECRET_KEY = '03C597A3660D50B59332AE1603A94AC2'; // Use a strong key

export const encrypt = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decrypt = (data) => {
  const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
