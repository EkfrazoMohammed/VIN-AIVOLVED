// utils/cryptoUtils.js
import CryptoJS from 'crypto-js';

// Replace with your hexadecimal key
const hexKey = '03C597A3660D50B59332AE1603A94AC2';
const AES_KEY = CryptoJS.enc.Hex.parse(hexKey);

// PKCS7 Padding function
function pad(data) {
    const blockSize = 16;
    const padLength = blockSize - (data.length % blockSize);
    const padding = String.fromCharCode(padLength).repeat(padLength);
    return data + padding;
}

// PKCS7 Unpadding function
function unpad(data) {
    const padLength = data.charCodeAt(data.length - 1);
    return data.slice(0, -padLength);
}

export function encryptAES(data) {
    // Convert object/array to JSON string
    const plaintext = JSON.stringify(data);
    const key = AES_KEY;
    const plaintextPadded = pad(plaintext);
    const ciphertext = CryptoJS.AES.encrypt(plaintextPadded, key, { mode: CryptoJS.mode.ECB }).toString();
    return ciphertext;
}

export function decryptAES(encryptedData) {
    try {
        const key = AES_KEY;
        const bytes = CryptoJS.AES.decrypt(encryptedData, key, { mode: CryptoJS.mode.ECB });
        const decryptedData = CryptoJS.enc.Utf8.stringify(bytes);
        // Remove padding and parse JSON string back to object/array
        return JSON.parse(unpad(decryptedData));
    } catch (e) {
        console.error(`Error during decryption: ${e.message}`);
        return null;
    }
}
