import CryptoJS from 'crypto-js';

// Convert the base64 key to Hex format for AES-256 (equivalent to binascii.unhexlify)
const base64Key = "03C597A3660D50B59332AE1603A94AC2";
const AES_KEY = CryptoJS.enc.Hex.parse(base64Key);

// URL-safe Base64 encoding and decoding functions
function safeEncode(data) {
    return CryptoJS.enc.Base64.stringify(data).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function safeDecode(data) {
    // Replace URL-safe characters and add necessary padding
    const paddedData = data.replace(/-/g, '+').replace(/_/g, '/');
    const base64Data = paddedData + '='.repeat((4 - paddedData.length % 4) % 4);
    return CryptoJS.enc.Base64.parse(base64Data);
}

// AES Encryption
export const encryptAES = (plaintext) => {
    const encrypted = CryptoJS.AES.encrypt(plaintext, AES_KEY, {\
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    
    const encryptedBase64 = encrypted.toString(); // Standard Base64 encryption result
    return safeEncode(CryptoJS.enc.Base64.parse(encryptedBase64)); // URL-safe encoding
};

export const decryptAES = (ciphertext) => {
    const decodedCiphertext = safeDecode(ciphertext);  // Decode the URL-safe base64
    const bytes = CryptoJS.AES.decrypt({ ciphertext: decodedCiphertext }, AES_KEY, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return bytes.toString(CryptoJS.enc.Utf8);  // Convert to string (plaintext)
};


export const encryptAESlash = (plaintext) => {
    const encrypted = CryptoJS.AES.encrypt(plaintext, AES_KEY, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });

    // Convert to Base64 and make it URL-safe
    let encryptedBase64 = encrypted.toString();
    encryptedBase64 = encryptedBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    return encryptedBase64;
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


// Use this function to decrypt your plantId
const plantId = "B1w%2F0zn7r3%2FledwBqYUsCw%3D%3D";
const decryptedPlantId = decryptAES(plantId);
//console.log(decryptedPlantId);

