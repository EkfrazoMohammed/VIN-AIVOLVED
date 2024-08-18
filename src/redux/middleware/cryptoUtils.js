import CryptoJS from 'crypto-js';

const base64Key = "03C597A3660D50B59332AE1603A94AC2";
const AES_KEY = CryptoJS.enc.Hex.parse(base64Key);

export const encryptAES = (plaintext) => {
    const encrypted = CryptoJS.AES.encrypt(plaintext, AES_KEY, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
};
const decryptAES = (key, encryptedData) => {
    try {
        const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        return CryptoJS.enc.Utf8.stringify(decrypted);
    } catch (error) {
        console.error('Error during decryption:', error);
        return null;
    }
};


