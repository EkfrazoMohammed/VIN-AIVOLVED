import CryptoJS from 'crypto-js';
import { Buffer } from 'buffer';

const base64Key = "03C597A3660D50B59332AE1603A94AC2";

const AES_KEY = CryptoJS.enc.Hex.parse(base64Key);
const AES_KEY2 = Uint8Array.from(base64Key.match(/.{1,2}/g).map(byte => parseInt(byte, 16))); // Convert hex key to Uint8Array
const fixedIV = new TextEncoder().encode("293229524557234B823834"); // Ensure IV is 12 bytes long

// // AES-GCM encryption function
export const encryptAES = async (plaintext) => {
    try {
        // Import the AES key into the SubtleCrypto API
        const key = await crypto.subtle.importKey(
            "raw",
            AES_KEY2,
            { name: "AES-GCM" },
            false,
            ["encrypt"]
        );

        // Encode the plaintext into a Uint8Array
        const encodedText = new TextEncoder().encode(plaintext);

        // Encrypt the plaintext
        const encryptedBuffer = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: fixedIV,
            },
            key,
            encodedText
        );

        // Convert the encrypted data (ciphertext + tag) to base64
        const encryptedData = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
        return encryptedData
    } catch (error) {
        console.error("Encryption error:", error);
        throw error;
    }
};

export const decryptAES = async (encryptedData) => {
    try {
        // Import the AES key into the SubtleCrypto API
        const key = await crypto.subtle.importKey(
            "raw",
            AES_KEY2,
            { name: "AES-GCM" },
            false,
            ["decrypt"]
        );

        // Decode the base64-encoded encrypted data to a Uint8Array
        const encryptedArray = Uint8Array.from(atob(encryptedData), char => char.charCodeAt(0));

        // Decrypt the data
        const decryptedBuffer = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: fixedIV,
            },
            key,
            encryptedArray
        );

        // Decode the decrypted buffer back into a string
        const decryptedText = new TextDecoder().decode(decryptedBuffer);
       
        return decryptedText;
    } catch (error) {
        console.error("Decryption error:", error);
        throw error;
    }
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



// OLD MEHTOD OF ENCRYPTION AES-ECB
// export const encryptAES = (plaintext) => {
//     const encrypted = CryptoJS.AES.encrypt(plaintext, AES_KEY, {
//         mode: CryptoJS.mode.ECB,
//         padding: CryptoJS.pad.Pkcs7
//     });
//     return encrypted.toString();
// };

// export const decryptAES = (encryptedData) => {
//     const decrypted = CryptoJS.AES.decrypt(encryptedData, AES_KEY, {
//         mode: CryptoJS.mode.ECB,
//         padding: CryptoJS.pad.Pkcs7
//     });
//     return CryptoJS.enc.Utf8.stringify(decrypted);

// };