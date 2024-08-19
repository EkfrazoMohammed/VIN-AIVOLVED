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
    const decrypted = CryptoJS.AES.decrypt(encryptedData, AES_KEY, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Utf8.stringify(decrypted);

};

// Encrypt function for integers
export const encryptAESInt = (integerValue) => {
    if (typeof integerValue !== 'number' || !Number.isInteger(integerValue)) {
        throw new Error("Input must be an integer");
    }

    const plaintext = integerValue.toString();
    const encrypted = CryptoJS.AES.encrypt(plaintext, AES_KEY, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
};

// Decrypt function for integers
export const decryptAESInt = (encryptedData) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, AES_KEY, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

    const decryptedString = CryptoJS.enc.Utf8.stringify(decrypted);
    const decryptedInt = parseInt(decryptedString, 10);

    if (isNaN(decryptedInt)) {
        throw new Error("Decryption did not result in a valid integer");
    }

    return decryptedInt;
};


