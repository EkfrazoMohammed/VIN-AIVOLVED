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

export const decryptAES = (encryptedData) => {
    console.log(encryptedData)
    const decrypted = CryptoJS.AES.decrypt(encryptedData, AES_KEY, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Utf8.stringify(decrypted);

};


